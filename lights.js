import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { resizeRendererToDisplaySize, DegRadHelper } from './util'
import GUI from 'lil-gui'
export default function lights() {
  const gui = new GUI()
  const canvas = document.getElementById('three')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  // 透视摄像机
  const fov = 45
  const aspect = 2 // 宽高比
  const near = 0.1
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 10, 20)
  // 控制器
  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 5, 0)
  controls.update()
  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')
  {
    // 地平面
    // 纹理
    const planeSize = 40
    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)
    // 平面几何体
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh)
  }
  {
    // 立方体
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    scene.add(mesh)
  }
  {
    // 球体
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
    const mesh = new THREE.Mesh(sphereGeo, sphereMat)
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    scene.add(mesh)
  }
  {
    // 环境光, 只是将材质的颜色与光照颜色进行叠加再乘以光照强度
    // const color = '0xffffff'
    // const intensity = 1
    // const light = new THREE.AmbientLight(color, intensity)
    // scene.add(light)
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    // gui.add(light, 'intensity', 0, 2, 0.01)
  }
  {
    // 半球光
    // const skyColor = 0xb1e1ff
    // const groundColor = 0xb97a20
    // const intensity = 1
    // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    // scene.add(light)
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor')
    // gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor')
    // gui.add(light, 'intensity', 0, 2, 0.01)
  }
  {
    // 方向光
    // const color = 0xffffff
    // const intensity = 1
    // const light = new THREE.DirectionalLight(color, intensity)
    // light.position.set(0, 10, 0)
    // light.target.position.set(-5, 0, 0)
    // scene.add(light)
    // scene.add(light.target)
    // const helper = new THREE.DirectionalLightHelper(light)
    // scene.add(helper)
    // function updateLight() {
    //   light.target.updateMatrixWorld()
    //   helper.update()
    // }
    // updateLight()
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    // gui.add(light, 'intensity', 0, 2, 0.01)
    // makeXYZGUI(gui, light.position, 'position', updateLight)
    // makeXYZGUI(gui, light.target.position, 'target', updateLight)
  }
  {
    // 点光源
    // const color = 0xffffff
    // const intensity = 1
    // const light = new THREE.PointLight(color, intensity)
    // light.position.set(0, 10, 0)
    // scene.add(light)
    // const helper = new THREE.PointLightHelper(light)
    // scene.add(helper)
    // function updateLight() {
    //   helper.update()
    // }
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    // gui.add(light, 'intensity', 0, 2, 0.01)
    // gui.add(light, 'distance', 0, 40).onChange(updateLight)
    // makeXYZGUI(gui, light.position, 'position', updateLight)
  }
  {
    // 聚光灯
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.SpotLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
    const helper = new THREE.SpotLightHelper(light)
    scene.add(helper)
    function updateLight() {
      light.target.updateMatrixWorld()
      helper.update()
    }
    updateLight()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    gui.add(light, 'intensity', 0, 2, 0.01)
    gui.add(light, 'distance', 0, 40, 0.01)
    gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight)
    gui.add(light, 'penumbra', 0, 1, 0.01)
    makeXYZGUI(gui, light.position, 'position', updateLight)
    makeXYZGUI(gui, light.target.position, 'target', updateLight)
  }
  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object
    this.prop = prop
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`
  }
  set value(hexString) {
    this.object[this.prop].set(hexString)
  }
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name)
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
  folder.open()
}
