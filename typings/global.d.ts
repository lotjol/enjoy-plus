import type { Utils } from '../miniprogram/utils/utils'
import type { Http } from 'wechat-http'

declare global {
  namespace WechatMiniprogram {
    interface Wx {
      http: Http
      utils: Utils
    }
  }

  namespace WechatMiniprogram.Page {
    interface Constructor {
      <TData extends DataOption, TCustom extends CustomOption>(
        options: Options<TData, TCustom & { test: string }>
      ): void
    }
  }
}

declare module 'wechat-http' {
  export interface ResponseResultData<T = any> {
    code: number
    message: string
    data: T
  }
}
