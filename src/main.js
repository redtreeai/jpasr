import Vue from 'vue';
import App from './App.vue';
import global_ from './global'
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import echarts from 'echarts';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import VueLazyload from 'vue-lazyload';
import $ from 'jquery';
import hljs from 'highlight.js';  //代码高亮
import 'highlight.js/styles/railscasts.css' //代码高亮样式

import { codemirror } from 'vue-codemirror-lite' // codemirror高亮代码

//import 'assets/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill"; //IE兼容补丁

Vue.use(ElementUI);
Vue.use(VueLazyload);
Vue.prototype.$axios = axios;
Vue.prototype.GLOBAL = global_;
Vue.prototype.$echarts = echarts //将echarts注册成Vue的全局属性

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

//post设置cookie
axios.defaults.withCredentials = true;


// 代码高亮引入
// Vue.directive('highlight',function(el){
//     let blocks = el.querySelectorAll('pre code');
//     blocks.forEach((block)=>{
//         hljs.highlightBlock(block)
//     })
// });

//代码块执行多次方法
// hljs.highlightCode = function () {
//     let blocks = document.querySelectorAll('pre code');
//     [].forEach.call(blocks,hljs.highlightBlock);
// };

//代码块新生代码编辑
// hljs.configure({useBR:true});
// hljs.highlightBlock($('pre code').each(function (i,block) {
//     hljs.highlightBlock(block);
// }));


//注册vue-router全局钩子，未登录拦截
/*router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.auth)) {
        //判断用户是否登录，验证本地存储是否有token
        if (!global_.getCookie('token')) {
            next({
                path: '/'
            });
        }else{
            next();
        }
        //如果返回了Login页（退出登录），清空token
        if(to.fullPath === '/' || to.fullPath === '/login') {
            this.setCookie('token','')
        }
        //如果点击的是本页，则刷新
        if(to.fullPath === from.fullPath) {
            this.$router.go(0);
        }
    }else{
        next();
    }
});*/
