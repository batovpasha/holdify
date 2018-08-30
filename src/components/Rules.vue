<template>
    <div class="main">
      <div @click="go_back()" class="overlay">

      </div>
      <div class="form">
        <div class="title">
            <h2>Советы: </h2>
            <p>1. Если программа рекомендует повысить ставку, то значение в соответствующем поле является минимальным необходимым для успешной игры.</p>
            <p>2. Если программа рекомендует уравнять ставку, то в качесте ориентира выбирайте максимальную ставку, сделанную на текущем круге.</p>
            <p>3. Если программа рекомендует сбросить карты, то это означает, что шанс собрать успешную комбинацию крайне мал.</p>
        </div>
        <div class="button" @click="go_back()">OK</div>
      </div>
    </div>
</template>

<script>
import Card from '@/components/Card'
import Dot from '@/components/Dot'
export default {
  name: 'PopUp',
  components: {
    Card,
    Dot
  },
  data () {
    return {
    
    }
  },
  methods: {
      go_back () {
          this.$parent.rule_visibility = false
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
.main
    .overlay
        position: absolute
        background: rgba(0,0,0,.5)
        width: 100%
        height: 100%
        z-index: 5
    .form
        position: absolute
        width: 40vw
        height: 23vw
        background: #7f4467
        left: 30%
        top: 30%
        z-index: 10
        border-radius: 5%
        .title
            text-align: center
        h2
            font-family: 'Raleway-ExtraBold', sans-serif
            color: #8bf9e0
            width: 100%
            height: 4vw
            font-size: 2vw
            line-height: 2vw
            background: #5c314b
            margin-top: 5%
            padding-top: 1vw
        p
            color: white
            margin-top: 3%
            text-align: left
            margin-left: 2%
            font-size: 0.9vw
        .button
            color: white
            margin: auto
            width: 10vw
            height: 3vw
            border: 1px solid white
            border-radius: 5%
            transition: background .5s ease
            text-align: center
            font-family: 'Raleway-Extrabold', sans-serif
            font-size: 1vw
            line-height: 3vw
            cursor: pointer
            &:hover
                color: black
                background: rgba(255, 255, 255, .7)
</style>
