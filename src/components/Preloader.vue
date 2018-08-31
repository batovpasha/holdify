<template>
  <transition name='fade'>
    <div class="main">
      <div class="row title">
        <div class="col">
          <h1>Holdify</h1>
          <transition name='fade'>
            <p v-if='load_start' :style="{left:dot_counter*0.145+'vw'}">{{load_title}}{{dots}}</p>
          </transition>
            <p v-if='!load_start'>Покер стал умнее</p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Preloader',
  data () {
    return {
      load_start: false,
      load_title: 'Загрузка',
      dot_counter: 0,
      dots: ''
    }
  },
  methods: {
    fade () {
      //  fade animation
      window.setTimeout(() => {
        this.$router.push('/game')
      }, 4000)
    },
    loading () {
      //  load animation
      window.setTimeout(() => {
        this.load_start = true
      }, 1500)

      window.setInterval(() => {
        if (this.dot_counter === 3) {
          this.dot_counter = 0
          this.dots = ''
        } else {
          this.dots += '.'
          this.dot_counter++
        }
      }, 500)
    }
  },
  created () {
    this.fade()
    this.loading()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
.main
  overflow: hidden
  background: #2b2b2b
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
      &:before
        content: ''
        position: absolute
        width: 10vw
        height: 8vw
        left: 24%
        background: url('/static/img/logo.png')
        background-position: center
        background-size: cover

    p
      margin-top: 1%
      font-family: 'Raleway', sans-serif
      font-size: 1.5vw
      position: relative
      margin-left: 30%

.fade-enter-active, .fade-leave-active
  transition: opacity .7s ease

.fade-enter, .fade-leave-to
  opacity: 0

@media only screen and (max-width : 768px)
  .main
    .title
      height: 40vw
      h1
        font-size: 14vw
        margin-top: 10%
        &:before
          width: 15vw
          height: 12vw
          left:   7%
          top: 25%
      p
        font-size: 4vw
</style>
