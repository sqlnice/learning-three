import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import GUI from 'lil-gui'
import { resizeRendererToDisplaySize } from './util'
export default function main() {
  genSplitDom()
  const canvas = document.getElementById('three')
  const view1Elem = document.querySelector('#view1')
  const view2Elem = document.querySelector('#view2')
  // logarithmicDepthBuffer 解决 z 冲突问题
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, logarithmicDepthBuffer: true })
  const gui = new GUI()

  // 摄像机 1
  const fov = 45
  const aspect = 2 // 宽高比
  const near = 0.00001
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 10, 20)
  const cameraHelper = new THREE.CameraHelper(camera)
  // 控制器 1
  const controls = new OrbitControls(camera, view1Elem)
  controls.target.set(0, 5, 0)
  controls.update()
  // 摄像机 2
  const camera2 = new THREE.PerspectiveCamera(
    60, // fov
    2, // aspect
    0.1, // near
    500 // far
  )
  camera2.position.set(40, 10, 30)
  camera2.lookAt(0, 5, 0)
  // 控制器 2
  const controls2 = new OrbitControls(camera2, view2Elem)
  controls2.target.set(0, 5, 0)
  controls2.update()
  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')
  scene.add(cameraHelper)

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()
    // 计算canvas的尺寸
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
    const top = Math.max(0, elemRect.top - canvasRect.top)

    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)

    // 设置剪函数以仅渲染一部分场景
    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)

    // 返回aspect
    return width / height
  }

  // 灯光
  {
    const color = '0xffffff'
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }
  // 地平面
  {
    const planSize = 40
    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planSize / 2
    texture.repeat.set(repeats, repeats)
    // 平面几何体
    const planGeo = new THREE.PlaneGeometry(planSize, planSize)
    const planMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(planGeo, planMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh)
  }
  // 立方体
  {
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    scene.add(mesh)
  }
  // 球体
  {
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
    const mesh = new THREE.Mesh(sphereGeo, sphereMat)
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    scene.add(mesh)
  }
  // 20 个球体
  {
    const sphereRadius = 3
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 16)
    const numSpheres = 20
    for (let i = 0; i < numSpheres; ++i) {
      const sphereMat = new THREE.MeshPhongMaterial()
      sphereMat.color.setHSL(i * 0.73, 1, 0.5)
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, i * 2)
      scene.add(mesh)
    }
  }
  gui.add(camera, 'fov', 1, 180)
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
  gui.add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001).name('near')
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')
  function render() {
    resizeRendererToDisplaySize(renderer, true)
    // 启用剪刀函数
    renderer.setScissorTest(true)

    // 渲染主视野
    {
      const aspect = setScissorForElement(view1Elem)
      // 用计算出的aspect修改摄像机参数
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      cameraHelper.update()
      // 原视野中不要绘制cameraHelper
      cameraHelper.visible = false
      scene.background.set(0x000000)
      // 渲染
      renderer.render(scene, camera)
    }

    // 渲染第二台摄像机
    {
      const aspect = setScissorForElement(view2Elem)
      // 调整aspect
      camera2.aspect = aspect
      camera2.updateProjectionMatrix()
      // 在第二台摄像机中绘制cameraHelper
      cameraHelper.visible = true
      scene.background.set(0x000040)
      renderer.render(scene, camera2)
    }
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj
    this.minProp = minProp
    this.maxProp = maxProp
    this.minDif = minDif
  }
  get min() {
    return this.obj[this.minProp]
  }
  set min(v) {
    this.obj[this.minProp] = v
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
  }
  get max() {
    return this.obj[this.maxProp]
  }
  set max(v) {
    this.obj[this.maxProp] = v
    this.min = this.min // this will call the min setter
  }
}

function genSplitDom() {
  const splitDiv = document.createElement('div')
  splitDiv.className = 'split'
  const view1 = document.createElement('div')
  view1.id = 'view1'
  view1.dataset.tabindex = '1'
  const view2 = document.createElement('div')
  view2.id = 'view2'
  view2.dataset.tabindex = '2'
  splitDiv.appendChild(view1)
  splitDiv.appendChild(view2)
  const appElem = document.querySelector('#app')
  appElem.appendChild(splitDiv)
  const style = document.createElement('style')
  style.textContent = `
  .split {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
}
.split>div {
  width: 100%;
  height: 100%;
}`
  document.head.appendChild(style)
}
