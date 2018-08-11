<template>
    <div class="main">
      <div class="overlay">

      </div>
      <div class="form">
        <div class="title">
          <h2>Выберите карту...</h2>
        </div>
        <div class="row cards">
          <Card @card_data="sendDataAndQuit" class='card' v-for='card in cards' v-if='card.slide==activeDot' :key=card.id :suit='card.suit' :rank='card.rank'/>
        </div>
        <div class="row cards">
          <Card @card_data="sendDataAndQuit" class='card' v-for='card in cards' v-if='card.slide==activeDot+1' :key=card.id :suit='card.suit' :rank='card.rank'/>
        </div>
        <div class="dots">
          <Dot class='dot' @dot_id='change_id' :id='1' :class="{'dot-active':activeDot==1}"/>
          <Dot class='dot' @dot_id='change_id' :id='3' :class="{'dot-active':activeDot==3}"/>
          <Dot class='dot' @dot_id='change_id' :id='5' :class="{'dot-active':activeDot==5}"/>
          <Dot class='dot' @dot_id='change_id' :id='7' :class="{'dot-active':activeDot==7}"/>
          <Dot class='dot' @dot_id='change_id' :id='9' :class="{'dot-active':activeDot==9}"/>
          <Dot class='dot' @dot_id='change_id' :id='11' :class="{'dot-active':activeDot==11}"/>
          <Dot class='dot' @dot_id='change_id' :id='13' :class="{'dot-active':activeDot==13}"/>
        </div>
      </div>
    </div>
</template>

<script>
import Card from '@/components/Card'
import Dot from '@/components/Dot'
export default {
  name: 'PopUp',
  components:{
    Card,
    Dot
  },
  data () {
    return {
      activeDot: 1,
      cards: [
        {id:1, suit: 'diamonds', rank:'A', slide: 1},
        {id:2, suit: 'spades', rank:'A', slide: 1},
        {id:3, suit: 'hearts', rank:'A', slide: 1},
        {id:4, suit: 'clubs', rank:'A', slide: 1},
        {id:5, suit: 'diamonds', rank:'2', slide: 2},
        {id:6, suit: 'spades', rank:'2', slide: 2},
        {id:7, suit: 'hearts', rank:'2', slide: 2},
        {id:8, suit: 'clubs', rank:'2', slide: 2},
        {id:9, suit: 'diamonds', rank:'3', slide: 3},
        {id:10, suit: 'spades', rank:'3', slide: 3},
        {id:11, suit: 'hearts', rank:'3', slide: 3},
        {id:12, suit: 'clubs', rank:'3', slide: 3},
        {id:13, suit: 'diamonds', rank:'4', slide: 4},
        {id:14, suit: 'spades', rank:'4', slide: 4},
        {id:15, suit: 'hearts', rank:'4', slide: 4},
        {id:16, suit: 'clubs', rank:'4', slide: 4},
        {id:17, suit: 'diamonds', rank:'5', slide: 5},
        {id:18, suit: 'spades', rank:'5', slide: 5},
        {id:19, suit: 'hearts', rank:'5', slide: 5},
        {id:20, suit: 'clubs', rank:'5', slide: 5},
        {id:21, suit: 'diamonds', rank:'6', slide: 6},
        {id:22, suit: 'spades', rank:'6', slide: 6},
        {id:23, suit: 'hearts', rank:'6', slide: 6},
        {id:24, suit: 'clubs', rank:'6', slide: 6},
        {id:25, suit: 'diamonds', rank:'7', slide: 7},
        {id:26, suit: 'spades', rank:'7', slide: 7},
        {id:27, suit: 'hearts', rank:'7', slide: 7},
        {id:28, suit: 'clubs', rank:'7', slide: 7},
        {id:29, suit: 'diamonds', rank:'8', slide: 8},
        {id:30, suit: 'spades', rank:'8', slide: 8},
        {id:31, suit: 'hearts', rank:'8', slide: 8},
        {id:32, suit: 'clubs', rank:'8', slide: 8},
        {id:33, suit: 'diamonds', rank:'9', slide: 9},
        {id:34, suit: 'spades', rank:'9', slide: 9},
        {id:35, suit: 'hearts', rank:'9', slide: 9},
        {id:36, suit: 'clubs', rank:'9', slide: 9},
        {id:37, suit: 'diamonds', rank:'10', slide: 10},
        {id:38, suit: 'spades', rank:'10', slide: 10},
        {id:39, suit: 'hearts', rank:'10', slide: 10},
        {id:40, suit: 'clubs', rank:'10', slide: 10},
        {id:41, suit: 'diamonds', rank:'J', slide: 11},
        {id:42, suit: 'spades', rank:'J', slide: 11},
        {id:43, suit: 'hearts', rank:'J', slide: 11},
        {id:44, suit: 'clubs', rank:'J', slide: 11},
        {id:45, suit: 'diamonds', rank:'Q', slide: 12},
        {id:46, suit: 'spades', rank:'Q', slide: 12},
        {id:47, suit: 'hearts', rank:'Q', slide: 12},
        {id:48, suit: 'clubs', rank:'Q', slide: 12},
        {id:49, suit: 'diamonds', rank:'K', slide: 13},
        {id:50, suit: 'spades', rank:'K', slide: 13},
        {id:51, suit: 'hearts', rank:'K', slide: 13},
        {id:52, suit: 'clubs', rank:'K', slide: 13}

      ]
    }
  },
  methods: {
    change_id(id){
      this.activeDot = id
      console.log(this.activeDot)
    },
    sendDataAndQuit(suit, rank){
      this.$emit('send_data', suit, rank)
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
    .cards
      margin: auto
      margin-top: 1vw
      width: 80%
      .card
        cursor: pointer
        position: relative
        width: 4.5vw
        border-radius: 15%
        margin-left: 8%
        &:hover
          transform: scale(1.1)
    .dots
      position: absolute
      right: 3vw
      bottom: 1vw
      .dot
        width: 2vw
        height: 2vw
        background: #e9e9e9
        border-color: gray
        border-style: solid
        border-width: 2px
        border-radius: 100%
        margin-top: 0.25vw
        &:hover
          background: #cecece
          cursor: pointer
        &-active
          background: #cecece
</style>
