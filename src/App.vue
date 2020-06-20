<template>
  <div id="app">
    <router-view/>
    <app-player></app-player>
  </div>
</template>

<script>
import appPlayer from '@/components/app-player';

export default {
  name: 'App',
  components: {
    appPlayer,
  }
}
</script>

<style lang="scss">

</style>
