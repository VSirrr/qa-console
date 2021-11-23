/**
 * 判断是否为 plainObject
 * @param {any} params
 * @returns {Boolean}
 */
export function isPlainObject(params) {
  return Object.prototype.toString.call(params) === '[object Object]'
}

// 解决循环引用问题
function circularReplacer() {
  const seen = []
  return (_, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.indexOf(value) >= 0) {
        return '[Circular]'
      }
      seen.push(value)
    }
    return value
  }
}

/**
 * 处理参数显示问题
 * @param {any} params
 * @returns {any}
 */
export function stringifyParams(params) {
  // 处理 null 和 undefined 显示
  if (params == null) {
    return String(params)
  }
  // 处理 number 类型
  if (typeof params === 'number') {
    return `Number(${params})`
  }
  // 函数类型，返回函数字符串
  if (typeof params === 'function') {
    return params.toString()
  }
  // 对象与数组通过 JSON.stringify() 序列化
  if (isPlainObject(params) || Array.isArray(params)) {
    return JSON.stringify(params, circularReplacer(), 2)
  }
  // 其他类型直接返回
  return params
}

/**
 * 将传入的参数转成数组，并对每一项进行转换
 * @param {ArrayLike} params
 * @returns {Stirng}
 */
export function serializeParams(params) {
  return Array.from(params)
    .map(item => stringifyParams(item))
    .join(' ')
}

// 快应用全局对象
export const quickappGlobal = Object.getPrototypeOf(global) || global
