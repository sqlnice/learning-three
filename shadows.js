import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { resizeRendererToDisplaySize } from './util'
export default function main() {
  // 渲染器
  const canvas = document.getElementById('three')
  const renderer = new THREE.WebGLRenderer({ canvas })
  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('white')
  // 透视摄像机
  const fov = 60
  const aspect = 2
  const near = 0.1
  const far = 400
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(10, 20, 0)

  // 控制器
  const controls = new OrbitControls(camera, canvas)
  controls.update()

  const loader = new THREE.TextureLoader()
  // 平面
  {
    const planSize = 40
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planSize / 2
    texture.repeat.set(repeats, repeats)
    // 平面几何体
    const planGeo = new THREE.PlaneGeometry(planSize, planSize)
    const planMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    planMat.color.setRGB(1.5, 1.5, 1.5)
    const mesh = new THREE.Mesh(planGeo, planMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh)
  }

  const sphereShadowBases = []
  // 加载阴影贴图
  const shadowTexture = loader.load('https://threejs.org/manual/examples/resources/images/roundshadow.png')
  // 球
  const sphereRadius = 1
  const sphereWidthDivisions = 32
  const sphereHeightDivisions = 16
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
  // 假阴影
  const planeSize = 1
  const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize)
  // 生成球体
  const numSpheres = 15
  for (let i = 0; i < numSpheres; i++) {
    const base = new THREE.Object3D()
    scene.add(base)

    // 阴影
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.position.y = 0.001 // 高于地面
    shadowMesh.rotation.x = Math.PI * -0.5
    const shadowSize = sphereRadius * 4
    shadowMesh.scale.set(shadowSize, shadowSize, shadowSize)
    base.add(shadowMesh)

    // 球体
    const u = i / numSpheres // 颜色
    const sphereMat = new THREE.MeshPhongMaterial()
    sphereMat.color.setHSL(u, 1, 0.75)
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
    sphereMesh.position.set(0, sphereRadius + 2, 0)
    base.add(sphereMesh)

    sphereShadowBases.push({
      base,
      sphereMesh,
      shadowMesh,
      y: sphereMesh.position.y,
    })
  }
  // 半球光
  {
    const skyColor = 0xb1e1ff // light blue
    const groundColor = 0xb97a20 // brownish orange
    const intensity = 1
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    scene.add(light)
  }
  // 定向光
  {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 5)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }
  function render(time) {
    time *= 0.001
    sphereShadowBases.forEach((sphereShadowBase, index) => {
      const { base, sphereMesh, shadowMesh, y } = sphereShadowBase
      const u = index / sphereShadowBases.length
      const speed = time * 0.2
      const angle = speed + u * Math.PI * 2 * (index % 1 ? 1 : -1)
      const radius = Math.sin(speed - index) * 10
      base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)

      const yOff = Math.abs(Math.sin(time * 2 + index))
      sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff)
      shadowMesh.material.opacity = THREE.MathUtils.lerp(1, 0.25, yOff)
    })
    resizeRendererToDisplaySize(renderer)

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
