import * as THREE from 'three'
import { resizeRendererToDisplaySize } from './util'
import GUI from 'lil-gui'
export default function main() {
  const gui = new GUI()
  const canvas = document.getElementById('three')
  const renderer = new THREE.WebGLRenderer({ canvas })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5)
  camera.position.z = 2
  scene.add(camera)

  {
    const color = 'lightblue'
    const near = 1
    const far = 2
    scene.fog = new THREE.Fog(color, near, far)
    scene.background = new THREE.Color(color)
    const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background)
    gui.add(fogGUIHelper, 'near', near, far).listen()
    gui.add(fogGUIHelper, 'far', near, far).listen()
    gui.addColor(fogGUIHelper, 'color')
  }
  {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }
  const boxWidht = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidht, boxHeight, boxDepth)
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    scene.add(cube)
    return cube
  }
  const cubes = [makeInstance(geometry, 0x44aa88, 0), makeInstance(geometry, 0x8844aa, -2), makeInstance(geometry, 0xaa8844, 2)]

  function render(time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

class FogGUIHelper {
  constructor(fog, backgroundColor) {
    this.fog = fog
    this.backgroundColor = backgroundColor
  }
  get near() {
    return this.fog.near
  }
  set near(v) {
    this.fog.near = v
  }
  get far() {
    return this.fog.far
  }
  set far(v) {
    this.fog.far = v
    this.fog.near = Math.min(this.fog.near, this.fog.far)
  }
  get color() {
    return `#${this.fog.color.getHexString()}`
  }
  set color(hexString) {
    this.fog.color.set(hexString)
    this.backgroundColor.set(hexString)
  }
}
