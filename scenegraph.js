import * as THREE from 'three'
import GUI from 'lil-gui'
import { resizeRendererToDisplaySize } from './util'
const gui = new GUI()
export default async function main() {
  const canvas = document.getElementById('three')
  const renderer = new THREE.WebGLRenderer({ canvas })
  // 透视摄像机
  const fov = 50
  const aspect = 2
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 50, 0)
  camera.up.set(0, 0, 1)
  camera.lookAt(0, 0, 0)
  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xaaaaaa)
  // 光源
  {
    const color = 0xffffff
    const intensity = 3
    const light = new THREE.PointLight(color, intensity)
    scene.add(light)
  }
  const objects = []

  const radius = 1
  const widthSegements = 6
  const heightSegements = 6
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegements, heightSegements)
  // 太阳系 局部空间, 没有材质和几何体
  const solarSystem = new THREE.Object3D()
  scene.add(solarSystem)
  objects.push(solarSystem)
  // 地月轨道
  const earthOrbit = new THREE.Object3D()
  earthOrbit.position.x = 10
  solarSystem.add(earthOrbit)
  objects.push(earthOrbit)
  // 太阳
  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
  // 扩大太阳的大小
  sunMesh.scale.set(5, 5, 5)
  solarSystem.add(sunMesh)
  objects.push(sunMesh)
  // 地球
  const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233ff, emissive: 0x112244 })
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
  earthOrbit.add(earthMesh)
  objects.push(earthMesh)
  // 月球
  const moonOrbit = new THREE.Object3D()
  moonOrbit.position.x = 2
  earthOrbit.add(moonOrbit)
  const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 })
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
  moonMesh.scale.set(0.5, 0.5, 0.5)
  moonOrbit.add(moonMesh)
  objects.push(moonMesh)

  // 为每个对象添加坐标轴
  // objects.forEach((obj) => {
  //   const axes = new THREE.AxesHelper()
  //   axes.material.depthTest = false
  //   axes.renderOrder = 1
  //   obj.add(axes)
  // })
  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units)
    gui.add(helper, 'visible').name(label)
  }
  makeAxisGrid(solarSystem, 'solarSystem', 25)
  makeAxisGrid(sunMesh, 'sunMesh')
  makeAxisGrid(earthOrbit, 'earthOrbit')
  makeAxisGrid(earthMesh, 'earthMesh')
  makeAxisGrid(moonOrbit, 'moonOrbit')
  makeAxisGrid(moonMesh, 'moonMesh')

  function render(time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    objects.forEach((obj) => {
      obj.rotation.y = time
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

// 打开/关闭网轴和网格
class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 2 // after the grid
    node.add(axes)

    const grid = new THREE.GridHelper(units, units)
    grid.material.depthTest = false
    grid.renderOrder = 1
    node.add(grid)

    this.grid = grid
    this.axes = axes
    this.visible = false
  }

  get visible() {
    return this._visible
  }
  set visible(v) {
    this._visible = v
    this.grid.visible = v
    this.axes.visible = v
  }
}
