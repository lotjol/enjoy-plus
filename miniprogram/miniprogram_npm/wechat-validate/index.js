module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1670062602408, function(require, module, exports) {

/// <reference path="./wechat.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Behavior({
    methods: {
        checkKey(datakey) {
            if (!this.rules)
                return console.warn('==== 未定义 rules 验证规则! ====');
            // 验证结果
            let result = { valid: true, datakey, message: 'validate:ok' };
            for (let ruleKey in this.rules[datakey]) {
                const rule = this.rules[datakey][ruleKey];
                // 处理验证规则
                if (rule.required)
                    rule.pattern = /[\S]+/;
                const reg = new RegExp(rule.pattern);
                // 验证数据
                const valid = reg.test(this.data[datakey]);
                // 验证结果
                if (!valid) {
                    result.valid = valid;
                    result.message = rule.message;
                    break;
                }
            }
            return result;
        },
        validate(key) {
            if (key)
                return this.checkKey(key);
            for (let dataKey in this.rules) {
                const { valid, message } = this.checkKey(dataKey);
                if (!valid) {
                    wx.showToast({ title: message, icon: 'none' });
                    return valid;
                }
            }
            return true;
        },
    },
});

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1670062602408);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map