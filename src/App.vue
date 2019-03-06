<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {

        data() {
            return {
                ccstyle : true
            }
        }
    }
</script>
<style lang="scss">
    @import "assets/css/main";
    @import "assets/css/variable"; /*公共变量*/
    @import "assets/css/color-dark";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>
