import * as THREE from 'three'
import * as FontLoader from 'three/examples/jsm/loaders/FontLoader.js'
import * as TextGeometry from 'three/examples/jsm/geometries/TextGeometry.js'
async function main() {
  // 渲染器
  const canvas = document.getElementById('three')
  const renderer = new THREE.WebGLRenderer({ canvas })
  // 透视摄像机
  const fov = 40
  const aspect = 2
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 120
  // 场景,需要绘制的东西都需要放在 scene 中
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xaaaaaa)
  const objects = []
  const spread = 15
  function addObject(x, y, obj) {
    obj.position.x = x * spread
    obj.position.y = y * spread
    scene.add(obj)
    objects.push(obj)
  }
  // 生成随机颜色的材质
  function createMaterial() {
    const marerial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    })
    const hue = Math.random()
    const saturation = 1
    const luminance = 0.5
    marerial.color.setHSL(hue, saturation, luminance)
    return marerial
  }
  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial())
    addObject(x, y, mesh)
    return mesh
  }
  function addLineGeometry(x, y, geometry) {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 })
    const mesh = new THREE.LineSegments(geometry, material)
    addObject(x, y, mesh)
  }
  const width = 8
  const height = 8
  const depth = 8
  const radius = 7
  const radialSegements = 16
  {
    // 盒子
    addSolidGeometry(-2, 2, new THREE.BoxGeometry(width, height, depth))
  }
  {
    // 平面圆
    const segements = 24
    addSolidGeometry(-1, 2, new THREE.CircleGeometry(radius, segements))
  }
  {
    // 锥形
    addSolidGeometry(0, 2, new THREE.ConeGeometry(radius, height, radialSegements))
  }
  {
    // 圆柱
    addSolidGeometry(1, 2, new THREE.CylinderGeometry(radius, radius, height, radialSegements))
  }
  {
    // 十二面体
    addSolidGeometry(2, 2, new THREE.DodecahedronGeometry(radius))
  }
  {
    // 受挤压的 2D 形状
    const shape = new THREE.Shape()
    const x = -2.5
    const y = -5
    shape.moveTo(x + 2.5, y + 2.5)
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y)
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5)
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5)
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5)
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y)
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5)
    const extrudeSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 2,
    }
    addSolidGeometry(-2, 1, new THREE.ExtrudeGeometry(shape, extrudeSettings))
  }
  {
    // 十二面体
    addSolidGeometry(-1, 1, new THREE.IcosahedronGeometry(radius))
  }
  {
    // 绕着一条线的旋转几何体
    const points = []
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8))
    }
    addSolidGeometry(0, 1, new THREE.LatheGeometry(points))
  }
  {
    // 八面体
    addSolidGeometry(1, 1, new THREE.OctahedronGeometry(radius))
  }
  {
    // 2D 平面
    addSolidGeometry(2, 1, new THREE.PlaneGeometry(width, height))
  }
  {
    // 将一些环绕着中心点的三角形投影到球体上
    const verticesOfCube = [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1]
    const indicesOfFaces = [2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2, 3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4]
    addSolidGeometry(-2, 0, new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, 2))
  }
  {
    // 中间有洞的 2D 圆盘
    const innerRadius = 2
    const outerRadius = 7
    const thetaSegements = 18
    addSolidGeometry(-1, 0, new THREE.RingGeometry(innerRadius, outerRadius, thetaSegements))
  }
  {
    // 2D 的三角轮廓
    const shape = new THREE.Shape()
    const x = -2.5
    const y = -5
    shape.moveTo(x + 2.5, y + 2.5)
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y)
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5)
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5)
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5)
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y)
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5)
    addSolidGeometry(0, 0, new THREE.ShapeGeometry(shape))
  }
  {
    // 球体
    const widthSegements = 12
    const heightSegements = 8
    addSolidGeometry(1, 0, new THREE.SphereGeometry(radius, widthSegements, heightSegements))
  }
  {
    // 四面体
    addSolidGeometry(2, 0, new THREE.TetrahedronGeometry(radius))
  }
  {
    // 根据 3D 字体和字符串生成的 3D 文字
    const loader = new FontLoader.FontLoader()
    const loadFont = (url) => new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject))
    const font = await loadFont('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json')
    const text = 'Hello World!'
    const geometry = new TextGeometry.TextGeometry(text, {
      font,
      size: 3,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.3,
      bevelSegments: 5,
    })
    const mesh = new THREE.Mesh(geometry, createMaterial())
    geometry.computeBoundingBox()
    geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1)
    const parent = new THREE.Object3D()
    parent.add(mesh)
    addObject(-2, -1, parent)
  }
  {
    // 圆环体
    const tubeRadius = 2
    const radialSegements = 8
    const tubularSegements = 24
    addSolidGeometry(-1, -1, new THREE.TorusGeometry(radius, tubeRadius, radialSegements, tubularSegements))
  }
  {
    // 环形节
    const radius = 3.5
    const tubeRadius = 1.5
    const radialSegements = 8
    const tubularSegements = 64
    const p = 2
    const q = 3
    addSolidGeometry(0, -1, new THREE.TorusKnotGeometry(radius, tubeRadius, tubularSegements, radialSegements, p, q))
  }
  {
    // 圆环沿着路径
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super()
        this.scale = scale
      }
      getPoint(t) {
        const tx = t * 3 - 1.5
        const ty = Math.sin(2 * Math.PI * t)
        const tz = 0
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale)
      }
    }
    const path = new CustomSinCurve(4)
    const tubularSegements = 20
    const radius = 1
    const radiusSegements = 8
    const closed = false
    addSolidGeometry(1, -1, new THREE.TubeGeometry(path, tubularSegements, radius, radiusSegements, closed))
  }
  {
    // 工具对象, 将几何体作为输入, 生成面夹角大于某个阈值的那条边
    const widthSegments = 6
    const heightSegments = 3
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    const thresholdAngle = -1
    addLineGeometry(2, -1, new THREE.EdgesGeometry(sphereGeometry, thresholdAngle))
  }
  {
    const size = 8
    const widthSegments = 2
    const heightSegments = 1
    const depthSegments = 1
    addLineGeometry(-2, -2, new THREE.WireframeGeometry(new THREE.BoxGeometry(size, size, size, widthSegments, heightSegments, depthSegments)))
  }
  {
    // 点
    const widthSegements = 12
    const heightSegements = 8
    const geometry = new THREE.SphereGeometry(radius, widthSegements, heightSegements)
    const material = new THREE.PointsMaterial({
      color: 'red',
      size: 8,
      sizeAttenuation: false,
    })
    addObject(-1, -2, new THREE.Points(geometry, material))
  }
  // 光源
  {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = (canvas.clientWidth * pixelRatio) | 0
    const height = (canvas.clientHeight * pixelRatio) | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
  // 渲染
  function render(time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    objects.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.01
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
