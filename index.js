import { stringifyParams, serializeParams, isPlainObject, quickappGlobal } from './_util'

/**
 * 支持的类型
 * 1. log 普通日志
 * 2. error 错误日志
 * 3. debug 请求信息日志
 */
const types = ['log', 'error', 'debug']

class QAConsole {
  constructor() {
    this.logs = []
    this.listeners = []
    this.maxLength = 100
    this.init()
  }
  /**
   * 对 console 的方法进行重写，并调用 addLog 方法
   */
  init() {
    types.forEach(type => {
      const that = this
      const originMethod = console[type]
      console[type] = function() {
        that.addLog(type, arguments)
        originMethod.apply(console, arguments)
      }
    })
  }
  /**
   * 向 logs 中添加数据
   * @param {String} type 日志类型：1 log、2 error、3 debug
   * @param {any} info 日志内容
   */
  addLog(type, info) {
    // debug 中的 info 保持为对象，方便在组件面板上进行引用，不用使用 JSON.parse() 反序列化
    if (type === 'debug') {
      info = info[0]
      // fix unknown palce uses console.debug()
      if (!isPlainObject(info) || !info.url) {
        return
      }
      info.unfold = false
      // 对参数和返回的数据进行格式化，方便展示查看
      if (info.params) {
        info.params = stringifyParams(info.params)
      }
      if (info.data) {
        info.data = stringifyParams(info.data)
      }
    } else {
      // 其他类型日志，统一转换成字符串
      info = serializeParams(info)
    }
    if (this.maxLength <= this.logs.length) {
      this.logs.shift()
    }
    this.logs.push({
      type,
      info
    })
    this.notify()
  }
  /**
   *  清空 logs
   */
  clearLogs(type) {
    this.logs = this.logs.filter(log => log.type !== type)
    this.notify()
  }
  /**
   * 发布
   */
  notify() {
    try {
      this.listeners.forEach(cb => {
        cb(this.logs)
      })
    } catch (error) {
      console.error(`qaConsole error: ${error}`)
    }
  }
  /**
   * 订阅
   * @param {Function} cb
   */
  attach(cb) {
    this.listeners.push(cb)
  }
}

function createQAConsole() {
  if (quickappGlobal.qaConsole instanceof QAConsole) {
    return
  }
  quickappGlobal.qaConsole = new QAConsole()
}

createQAConsole()
