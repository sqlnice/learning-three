import * as THREE from 'three'
export function resizeRendererToDisplaySize(renderer) {
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
// 提供以度数为单位进行操作的对象, 但将以弧度为单位设置属性
export class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj
    this.prop = prop
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop])
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v)
  }
}
