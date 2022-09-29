import type { Http } from '../miniprogram/utils/http'

declare global {
  namespace WechatMiniprogram {
    interface Wx {
      http: Http
    }
  }
}
