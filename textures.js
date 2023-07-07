import * as THREE from 'three'
import { resizeRendererToDisplaySize, DegRadHelper } from './util'
import GUI from 'lil-gui'
export default function main() {
  const canvas = document.getElementById('three')
  const renderer = new THREE.WebGLRenderer({ canvas })
  // 透视摄像机
  const fov = 75
  const aspect = 2
  const near = 0.1
  const far = 5
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 4
  // 场景
  const scene = new THREE.Scene()
  const cubes = []
  // 几何体
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  // 加载器
  const loadingElem = document.querySelector('#loading')
  loadingElem.style.display = 'flex'
  const progressBarElem = loadingElem.querySelector('.progressbar')
  const loadManager = new THREE.LoadingManager()
  const loader = new THREE.TextureLoader(loadManager)
  // 材质1
  const texture = loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg')
  const gui = new GUI()
  function updateTexture() {
    texture.needsUpdate = true
  }

  gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes).name('texture.wrapS').onChange(updateTexture)
  gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes).name('texture.wrapT').onChange(updateTexture)
  gui.add(texture.repeat, 'x', 0, 5, 0.01).name('texture.repeat.x')
  gui.add(texture.repeat, 'y', 0, 5, 0.01).name('texture.repeat.y')
  gui.add(texture.offset, 'x', -2, 2, 0.01).name('texture.offset.x')
  gui.add(texture.offset, 'y', -2, 2, 0.01).name('texture.offset.y')
  gui.add(texture.center, 'x', -2, 2, 0.01).name('texture.center.x')
  gui.add(texture.center, 'y', -2, 2, 0.01).name('texture.center.y')
  gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360).name('texture.rotation')

  const material = new THREE.MeshBasicMaterial({
    map: texture,
  })

  // 材质2
  const materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('https://threejs.org/manual/examples/resources/images/flower-1.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('https://threejs.org/manual/examples/resources/images/flower-2.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('https://threejs.org/manual/examples/resources/images/flower-3.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('https://threejs.org/manual/examples/resources/images/flower-4.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('https://threejs.org/manual/examples/resources/images/flower-5.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('https://threejs.org/manual/examples/resources/images/flower-6.jpg') }),
  ]
  // 材质3
  const material3 = new THREE.MeshBasicMaterial({
    map: loader.load('https://threejs.org/manual/resources/images/mip-low-res-enlarged.png'),
  })
  // 加载器
  loadManager.onLoad = () => {
    loadingElem.style.display = 'none'
    // 网格1
    const cube = new THREE.Mesh(boxGeometry, material)
    cube.position.x = 2
    cubes.push(cube)
    scene.add(cube)
    // 网格2
    const cube2 = new THREE.Mesh(boxGeometry, materials)
    cube2.position.x = -2
    cubes.push(cube2)
    scene.add(cube2)
    // 网格3
    const cube3 = new THREE.Mesh(boxGeometry, material3)
    cube3.position.x = 0
    cubes.push(cube3)
    scene.add(cube3)
  }
  loadManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal
    progressBarElem.style.transform = `scaleX(${progress})`
  }

  function render(time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    cubes.forEach((cube, ndx) => {
      const speed = 0.2 + ndx * 0.1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

class StringToNumberHelper {
  constructor(obj, prop) {
    this.obj = obj
    this.prop = prop
  }
  get value() {
    return this.obj[this.prop]
  }
  set value(v) {
    this.obj[this.prop] = parseFloat(v)
  }
}

const wrapModes = {
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  RepeatWrapping: THREE.RepeatWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
}
