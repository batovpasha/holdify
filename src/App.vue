<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='sass'>
@import '../node_modules/bootstrap/scss/bootstrap.scss'
@font-face
    font-family: "Kollektif"
    src : url("assets/fonts/Kollektif.ttf")
@font-face
    font-family: "Raleway"
    src : url("assets/fonts/Raleway.ttf")
</style>
