import Vue from 'vue'

//定义全局变量
const dev = 'https://jpasrapi.chenhongshu.com'

export default {
    dev,
}

//注册全局组件

/*
 * 通用成功提示
 */
Vue.prototype.success = function(msg) {
    this.$message({
        showClose: true,
        message: msg,
        type: 'success',
        duration: '1500'
    });
};

/*
 * 通用错误提示
 */

Vue.prototype.error = function(msg) {
    this.$message({
        showClose: true,
        message: msg,
        type: 'error',
        duration: '1800'
    });
};

/*
 * 通用警告提示
 */
Vue.prototype.warning = function(msg) {
    this.$message({
        showClose: true,
        message: msg,
        type: 'warning',
        duration: '1500'
    });
};

/*
 * unix时间与标准时间转化
 * @param type: 转化类型
 * @param time: 需要转化的时间
 */
Vue.prototype.cDate = function(time,type) {
    switch(type) {
        case 'toUnix':
            //标准时间转化为unix时间
            return new Date(time).getTime() / 1000;
            break;
        default:
            //unix时间转化为标准时间
            let date = new Date(time * 1000),
                Y = date.getFullYear(),
                M = date.getMonth(),
                D = date.getDate(),
                h = date.getHours(),
                m = date.getMinutes(),
                s = date.getSeconds();

            M += 1;

            if(Number(M) < 10) M = '0' + M;
            if(Number(D) < 10) D = '0' + D;
            if(Number(h) < 10) h = '0' + h;
            if(Number(m) < 10) m = '0' + m;
            if(Number(s) < 10) s = '0' + s;

            return Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s;
    }
};

/*
* 防止重复提交
*/
Vue.prototype.checkRepeat = function() {
    const date = new Date();
    const lastDate = new Date((localStorage.getItem('lastDate')));

    localStorage.setItem('lastDate',date);

    if(date.getTime() - lastDate.getTime() < 1500) {
        //this.warning('请勿重复提交！');
        return false; //低于两秒
    }
};

/*
 * 设置/获取cookie
 */
Vue.prototype.setCookie = function(name,value,time) {
    const date = new Date();
    date.setDate(date.getDate() + time);
    document.cookie = name + "=" + value + (time === null ? "" : ";expires=" + date.toGMTString());
};
Vue.prototype.getCookie = function(name) {
    const cookies = document.cookie;
    if(cookies) {
        if(cookies.indexOf(name) > -1) {
            const arr = cookies.split(';');
            for(let i = 0; i < arr.length; i ++) {
                if(arr[i].indexOf(name + '=') > -1) {
                    const targetCookie = arr[i].split('=');
                    return targetCookie[1];
                }
            }
        }
    }
};
