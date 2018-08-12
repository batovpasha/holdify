<template>
  <div class="main">
    <PopUp @send_data="parser" v-if="form_visibility"/>
    <div class="row cards">
      <div class="col hand">
        <div class="title">
          <div class="strip strip-left"></div>
            РУКА
          <div class="strip strip-right"></div>
        </div>
        <div class="row hand-cards">
          <CardField @send_id="receiveId" v-for='card in cards' v-if="card.id<2" :suit='card.suit' :rank='card.rank' :id='card.id' :key='card.id' class="card-field card-field-hand"/>
        </div>
      </div>
      <div class="col deck">
        <div class="title">
          <div class="strip strip-left"></div>
            СТОЛ
          <div class="strip strip-right"></div>
        </div>
        <div class="row deck-cards">
          <CardField @send_id="receiveId" v-for='card in cards' v-if="card.id>1" :suit='card.suit' :rank='card.rank' :id='card.id' :key='card.id' class="card-field card-field-deck"/>
        </div>
      </div>
    </div>

    <div class="row bets">
      <div class="col field">
        <div class="field-left">
          Банк
        </div>
        <input class="field-right" type="text" name="" value="">

      </div>
      <div class="col field">
        <div class="field-left">
          Ставка
        </div>
        <input class="field-right" type="text" name="" value="">
      </div>
    </div>

    <div class="footer">
      <div class="button button-success">
        <img src="../assets/icons/success.svg" alt="">
      </div>
      <div @click="reset()" class="button button-reset">
        <img src="../assets/icons/reset.svg" alt="">
      </div>
      <h2>Ход №3</h2>
      <p>Префлоп - сейчас стоит повысить ставку</p>
    </div>

  </div>
</template>

<script>
import Card from '@/components/Card'
import CardField from '@/components/CardField'
import PopUp from '@/components/PopUp'
export default {
  name: 'Preloader',
  components: {
    Card,
    PopUp,
    CardField
  },
  data () {
    return {
      form_visibility: false,
      temp_id: -1,
      cards: [
        {suit: 'none', rank: 'none', is_open: 'false', id: 0},
        {suit: 'none', rank: 'none', is_open: 'false', id: 1},
        {suit: 'none', rank: 'none', is_open: 'false', id: 2},
        {suit: 'none', rank: 'none', is_open: 'false', id: 3},
        {suit: 'none', rank: 'none', is_open: 'false', id: 4},
        {suit: 'none', rank: 'none', is_open: 'false', id: 5},
        {suit: 'none', rank: 'none', is_open: 'false', id: 6}
      ]
    }
  },
  methods: {
    reset () {
      this.$router.push('/')
    },
    parser (suit, rank) {
      this.form_visibility = !this.form_visibility
      this.$set(this.cards, this.temp_id, {suit: suit, rank: rank, is_open: 'false', id: this.temp_id})
    },
    receiveId (id) {
      this.temp_id = id
      this.form_visibility = !this.form_visibility
    },
    go_back () {
      this.form_visibility = !this.form_visibility
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
.main
  position: absolute
  width: 100%
  height: 100%
  background: #2b2b2b
  overflow-x: hidden
  .cards
    height: 45%
    .hand, .deck
      text-align: center
      padding-top: 2%
      .hand-cards
        height: 10vw
        margin-left: 30%
        margin-top: 3%
        .card-field-hand
          cursor: pointer
          border-radius: 10%
          width: 7vw
          height: 10vw
          display: block
          position: relative
          margin-left: 5%
          z-index: 3
          &:hover
            transform: scale(1.1)
      .deck-cards
        height: 10vw
        margin-left: 10%
        margin-top: 3%
        .card-field-deck
          width: 7vw
          height: 10vw
          display: block
          position: relative
          margin-left: 2%
          z-index: 3
          cursor: pointer
          border-radius: 10%
          &:hover
            transform: scale(1.1)
      .title
        margin: auto
        font-family: 'Raleway-ExtraBold', sans-serif
        background: #7f4467
        width: 17vw
        font-weight: bold
        font-size: 3vw
        color: #8bf9e0
        line-height: 2vw
        height: 5vw
      .strip
        position: relative
        width: 6vw
        height: 1.5vw
        background: #cb9db9
        &-left
          left: -6vw
          top: 1.75vw
          &:after
            content: ''
            width: 6vw
            height: 0.25vw
            background: #2b2b2b
            position: absolute
            top: 0.35vw
            right: 0
        &-right
          left: 17vw
          top: -1.75vw
          &:after
            content: ''
            width: 6vw
            height: 0.25vw
            background: #2b2b2b
            position: absolute
            top: 0.35vw
            right: 0
  .bets
    .field
      width: 20vw
      height: 5vw
      float: left
      font-family: 'Railway', sans-serif
      color: white
      margin-top: 5%
      &:nth-child(1)
        margin-left: 23vw
      &:nth-child(2)
        margin-right: 20vw
      &-left
        text-align: center
        font-size: 2vw
        line-height: 5vw
        width: 10vw
        background: #5b304b
        height: 5vw
        float: left
      &-right
        width: 14vw
        background: #7f4467
        height: 5vw
        float: left
        font-family: 'Railway', sans-serif
        font-size: 2vw
        color: white
        text-align: center

  .footer
    position: absolute
    bottom: 0
    width: 100%
    height: 10vw
    background: #7f4467
    text-align: center
    h2
      font-family: 'Raleway-ExtraBold', sans-serif
      color: #8bf9e0
      font-size: 2vw
      margin-top: 1%
    p
      color: white
      font-family: 'Raleway', sans-serif
      font-size: 2vw
      margin-top: 1%
    .button
      position: absolute
      width: 8vw
      height: 8vw
      border-radius: 100%
      float: left
      cursor: pointer
      text-align: center
      &-success
        left: 10%
        top: -50%
        background: #6dc5af
        transition: background 1s ease
        img
          width: 4vw
          margin-top: 25%
        &:hover
          background: #8bf9e0
      &-reset
        right: 10%
        top: -50%
        background-color: #f25a5b
        transition: background 1s ease
        img
          width: 4vw
          margin-top: 25%
        &:hover
          background: #cc4142

</style>
