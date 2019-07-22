/**
 *Created by hongwei on 2019/05/02.已知图片或组件缩放前、后的宽高，计算里面指定坐标缩放后的值
 * @param {String} x0
 * @param {String} y0
 * @param {Number} oldWidth
 * @param {Number} oldHeight
 * @param {Number} newWidth
 * @param {Number} newHeight
 */
export function adjustPosition(x0, y0, oldWidth, oldHeight, newWidth, newHeight) {
  // 缩放后坐标
  var x = Math.round(parseInt(x0) * newWidth / oldWidth).toString()
  var y = Math.round(parseInt(y0) * newHeight / oldHeight).toString()

  return { 'x': x, 'y': y }
}

