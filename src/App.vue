<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
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
@font-face
    font-family: "Raleway-ExtraBold"
    src : url("assets/fonts/Raleway-ExtraBold.ttf")
input
  outline: none
  border-width: 0px
  &:focus
    outline: none
    border-width: 0px
  &:active
    outline: none
    border-width: 0px

</style>
