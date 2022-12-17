module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1670062602407, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttp = exports.default = void 0;
function createHttp(config = { showLoading: true }) {
    // 记录 loading 的状态
    const loadingQueue = [];
    /**
     * 封装 wx.request API
     */
    const http = (options) => {
        // 处理基础路径
        if (!options.url.startsWith('http') && http.baseURL) {
            options.url = http.baseURL + options.url;
        }
        // 调用拦截器处理请求数据
        options = http.intercept.request(options);
        // 记录请求开始的次量
        loadingQueue.push('loading');
        // 是否显示加载 loading
        if (config.showLoading && loadingQueue.length)
            wx.showLoading(http.loading);
        // 包装 Promise 对象
        return new Promise((resolve, reject) => {
            // 调用小程序 api
            wx.request(Object.assign(Object.assign({}, options), { success: (result) => {
                    // 调用拦截器处理响应数据
                    resolve(http.intercept.response(Object.assign(Object.assign({}, result), { config: options })));
                }, fail: reject, complete: () => {
                    // 记录结束的请求数量
                    loadingQueue.pop();
                    // 关闭加载提示框
                    if (!loadingQueue.length)
                        wx.hideLoading();
                } }));
        });
    };
    // get 方法请求
    http.get = (url, data) => {
        return http({ url, data, method: 'GET' });
    };
    // post 方法请求
    http.post = (url, data) => {
        return http({ url, data, method: 'POST' });
    };
    // put 方法请求
    http.put = (url, data) => {
        return http({ url, data, method: 'PUT' });
    };
    // delete 方法请求
    http.delete = (url, data) => {
        return http({ url, data, method: 'DELETE' });
    };
    /**
     * 默认loading配置
     */
    http.loading = {
        title: '正在加载...',
        mask: true,
    };
    /**
     * 默认拦截器（什么也没做）
     */
    http.intercept = {
        request: (options) => options,
        response: (result) => result,
    };
    return http;
}
exports.createHttp = createHttp;
const http = createHttp();
exports.default = http;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1670062602407);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map