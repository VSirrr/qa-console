# @vsirrr/qa-console

## 背景

- tencent/vconsole 依赖于 DOM，在快应用中不能使用。

## 目前支持的功能

- 重写了 console 的 log、error、debug 方法，所以只能收集通过 console.log()、console.error()、console.debug() 输出的内容，其他特殊异常无法捕获。
- 目前一共有四个面板：Log（普通日志）、Error（错误日志）、Request（请求信息，包含请求的 url、type、status、params、response 等信息）、Storage（本地存储）
- 长按输出的 log、error 日志内容，可以复制文本；长按 request 中的参数和返回值可以复制文本；长按 Storage 的 value 值可以复制文本。
- 每个面板底部的工具栏：点击 clear 按钮是清空对应的内容，点击 hide 按钮是关闭弹层。

## 使用方式

### 安装

```shell
npm i -D @vsirrr/qa-console
```

### demo

```js
// 1. 在 app.ux 中进行初始化
if(process.env.NODE_ENV === 'development') {
  require('@vsirrr/qa-console')
}

// 2. 在使用该功能的地方引入 qa-console 组件 不支持单次引用多页面使用
<import name="qa-console" src="@vsirrr/qa-console/component.ux"></import>

<qa-console></qa-console>

// 3. 接口提供的 @system.fetch 无法被重写。所以在封装的请求库中使用 console.debug() 方法，收集请求与响应的信息
import $fetch from '@system.fetch'

function request(params) {
  return new Promise((resolve, reject) => {
    $fetch.fetch({
      url: params.url,
      method: params.method,
      data: params.data,
      responseType: 'json',
      success: (response) => {
        console.debug({
          url: params.url,
          method: params.method,
          params: params.data,
          data: response.data,
          status: 'success',
        })
        resolve(response.data)
      },
      fail: (error, code) => {
        const data =
          Object.prototype.toString.call(error).slice(8, -1) === 'Object'
            ? { code, ...error }
            : { code, error }
        console.debug({
          data,
          url: params.url,
          method: params.method,
          params: params.data,
          status: 'error',
        })
        reject(error)
      },
    })
  })
}
```

## 注意事项

- 使用完 qa-console 组件之后，把相关代码注释掉，防止打包时增加包的体积。

<!-- ## 问题记录 -->

<!-- - 华为品牌手机，页面刷新之后报错（cannot set property logs of undefined at Vm.set），猜测是编译问题 -->
