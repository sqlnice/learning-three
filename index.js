import * as THREE from './node_modules/three/build/three.module.js'
function main() {
  // 渲染器
  const canvas = document.getElementById('three')
  const renderer = new THREE.WebGLRenderer({ canvas })
  console.log(renderer)
  // 透视摄像机
  const fov = 75
  const aspect = 2
  const near = 0.1
  const far = 5
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 2
  // 场景,需要绘制的东西都需要放在 scene 中
  const scene = new THREE.Scene()
  // 立方几何体, 包含顶点信息
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  function makeInstance(geometry, color, x) {
    // 材质
    const material = new THREE.MeshPhongMaterial({ color })
    // 网格
    const cube = new THREE.Mesh(geometry, material)
    // 将网格添加到场景中
    scene.add(cube)
    cube.position.x = x
    return cube
  }
  const cubes = [makeInstance(geometry, 0x44aa88, 0), makeInstance(geometry, 0x8844aa, -2), makeInstance(geometry, 0xaa8844, 2)]
  // 渲染
  function render(time) {
    time *= 0.001
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
  {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }
}
main()
