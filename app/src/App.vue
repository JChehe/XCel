

<template>
  <window-top style="-webkit-app-region: drag;"></window-top>
  <router-view keep-alive></router-view>
</template>

<script>
  import windowTop from './components/common/WindowTop'
  import store from './vuex/store'

  export default {
    store,
    components: {
      windowTop
    }
  }
</script>


<style lang="scss">
  @import './components/common/assets/common.scss';
  @import './components/common/assets/content.scss';
  @import './components/common/assets/table.scss';
  @import './components/common/assets/tabs.scss';
  @import './components/common/assets/select.scss';
</style>