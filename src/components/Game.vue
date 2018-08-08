<template>
  <div class="main">
    <div class="row title">
      <div class="col">
        <h1>Main game screen</h1>
        <p>Some text</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preloader',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
.main
  overflow: hidden
  background: green
  position: absolute
  width: 100%
  height: 100%
  .title
    position: relative
    width: 91vw
    background: #7f4266
    height: 18vw
    margin: auto
    top: 33%
    text-align: center
    &:after
      content: ''
      width: 3%
      height: 100%
      position: absolute
      right: -5%
      margin: 0
      background: #7f4266
    &:before
      content: ''
      width: 3%
      height: 100%
      position: absolute
      left: -5%
      margin: 0
      background: #7f4266
    h1
      font-family: 'Kollektif', sans-serif
      color: #86ffe0
      font-size: 8vw
      margin-top: 3%
      margin-bottom: 0
    p
      margin-top: 1%
      font-family: 'Raleway', sans-serif
      font-size: 1.5vw
      margin-left: 30%
</style>
