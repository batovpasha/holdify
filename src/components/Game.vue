<template>
  <div class="main">
    <PopUp @send_data="parser" v-if="form_visibility"/>
    <Rules v-if="rule_visibility"/>
    <transition name="fade">
      <WarningPopUp v-if="this.duplicate"/>
    </transition>
    <div class="row cards">
      <div class="col hand">
        <div class="title">
          <div class="strip strip-left"></div>
            РУКА
          <div class="strip strip-right"></div>
        </div>
        <div class="row hand-cards">
          <CardField @send_id="receiveId" v-for='card in cards' :class="{'card-field-hand-active' : card.is_open}" v-if="card.id<2" :suit='card.suit' :rank='card.rank' :id='card.id' :key='card.id' class="card-field card-field-hand"/>
        </div>
      </div>
      <div class="col deck">
        <div class="title">
          <div class="strip strip-left"></div>
            СТОЛ
          <div class="strip strip-right"></div>
        </div>
        <div class="row deck-cards">
          <CardField @send_id="receiveId" v-for='card in cards' v-if="card.id>1" :class="{'card-field-deck-active':card.is_open}" :suit='card.suit' :rank='card.rank' :id='card.id' :key='card.id' class="card-field card-field-deck"/>
        </div>
      </div>
    </div>

    <div class="row bets">
      <div class="col field">
        <div class="field-left">
          Банк
        </div>
        <input @input="validation()" class="field-right" type="text" name="" ref="bank" value="">
      </div>
      <div class="col field">
        <div class="field-left">
          Ставка
        </div>
        <div class="field-right">{{bet}}</div>
      </div>
    </div>

    <div class="footer">
      <div @click="send_round_data(); validation()" v-if="this.btn_availability" class="button button-success">
        <img src="../assets/icons/success.svg" alt="">
      </div>
      <div @click="reset()" class="button button-reset">
        <img src="../assets/icons/reset.svg" alt="">
      </div>
      <h2>{{name_of_round}}</h2>
      <p>{{advice}}</p>
    </div>

  </div>
</template>

<script>
import Card from '@/components/Card'
import CardField from '@/components/CardField'
import PopUp from '@/components/PopUp'
import Rules from '@/components/Rules'
export default {
  name: 'Preloader',
  components: {
    Card,
    PopUp,
    CardField,
    Rules
  },
  data () {
    return {
      form_visibility: false,
      rule_visibility: true,
      temp_id: -1,
      name_of_round: 'Preflop',
      advice: 'Укажите карты и банк',
      counter: 0,
      bank: '',
      bet: '',
      duplicate: false,
      btn_availability: false,
      rounds: ['Preflop', 'Flop', 'Turn', 'River'],
      cards: [
        {suit: 'none', rank: 'none', is_open: true, id: 0, cardId: -1},
        {suit: 'none', rank: 'none', is_open: true, id: 1, cardId: -2},
        {suit: 'none', rank: 'none', is_open: false, id: 2, cardId: -3},
        {suit: 'none', rank: 'none', is_open: false, id: 3, cardId: -4},
        {suit: 'none', rank: 'none', is_open: false, id: 4, cardId: -5},
        {suit: 'none', rank: 'none', is_open: false, id: 5, cardId: -6},
        {suit: 'none', rank: 'none', is_open: false, id: 6, cardId: -7}
      ]
    }
  },
  created () {
    this.validation()
    if (this.$root.rule_counter >= 1) this.rule_visibility = false
  },
  updated () {

  },
  methods: {
    //  create a request that returns an object with such fields as: bank, hand cards and table cards
    create_request () {
      this.hand_cards = []
      this.table_cards = []
      for (let i = 0; i < 2; i++) {
        if (this.cards[i].suit !== 'none') {
          this.hand_cards.push({suit: this.cards[i].suit, rank: this.cards[i].rank})
        }
      }

      for (let i = 2; i < 7; i++) {
        if (this.cards[i].suit !== 'none') {
          this.table_cards.push({suit: this.cards[i].suit, rank: this.cards[i].rank})
        }
      }

      this.data = {
        bank: this.$refs.bank.value,
        hand_cards: this.hand_cards,
        table_cards: this.table_cards
      }
      this.axios.post('/game', this.data).then(response => {
        this.advice = response.data.decision
        this.bet = response.data.bet
      })
    },
    send_round_data () {
      // describes the game process
      this.counter++
      switch (this.counter) {
        case 0:
          this.name_of_round = 'Preflop'
          this.advice = 'Укажите карты и банк'
          break
        case 1:
          this.name_of_round = 'Preflop'
          this.create_request()
          break
        case 2:
          this.name_of_round = 'Flop'
          this.advice = 'Укажите карты и банк'
          this.cards[2].is_open = true
          this.cards[3].is_open = true
          this.cards[4].is_open = true
          break
        case 3:
          this.name_of_round = 'Flop'
          this.create_request()
          break
        case 4:
          this.name_of_round = 'Turn'
          this.advice = 'Укажите карты и банк'
          this.cards[5].is_open = true
          break
        case 5:
          this.name_of_round = 'Turn'
          this.create_request()
          break
        case 6:
          this.name_of_round = 'River'
          this.advice = 'Укажите карты и банк'
          this.cards[6].is_open = true
          break
        case 7:
          this.name_of_round = 'River'
          this.create_request()
          break
        case 8:
          this.name_of_round = 'Конец игры'
          this.advice = 'Игра окончена, нажмите на крестик, чтоб сыграть снова'
          this.btn_availability = false
      }
    },
    validation () {
      // checks if the input data is correct
      let valueArr = this.cards.map((item) => item.cardId)
      let isDuplicate = valueArr.some((item, idx) => valueArr.indexOf(item) !== idx)
      if (isDuplicate) this.advice = 'Вы указали одинаковые карты'
      if (isDuplicate === true || this.all_cards_is_chosen() === false || this.counter === 8 || this.$refs.bank.value === '') {
        this.btn_availability = false
      } else {
        this.btn_availability = true
      }
    },
    all_cards_is_chosen () {
      // checks if all cards is chosen
      for (let i = 0; i < this.cards.length; i++) {
        if ((this.cards[i].suit === 'none') && (this.cards[i].is_open)) return false
      }
      return true
    },
    reset () {
      // reseting the game
      this.$router.push('/')
    },
    parser (suit, rank, cardId) {
      // reveive the event data and updating the this.cards object
      this.form_visibility = !this.form_visibility
      this.$set(this.cards, this.temp_id, {suit: suit, rank: rank, is_open: this.cards[this.temp_id].is_open, id: this.temp_id, cardId: cardId})
      this.validation()
    },
    receiveId (id) {
      if (this.cards[id].is_open === true) {
        this.temp_id = id
        this.advice = 'Укажите карты и банк'
        this.form_visibility = !this.form_visibility
      } else {
        this.advice = 'В данном раунде эта карта недоступна'
      }
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
          border-radius: 15%
          width: 7vw
          height: 10vw
          display: block
          position: relative
          margin-left: 5%
          z-index: 3
          &-active
            border: 0.3vw solid #6dc5af
          &:hover
            transform: scale(1.1)
      .deck-cards
        height: 10vw
        margin-left: 4vw
        margin-top: 3%
        .card-field-deck
          width: 7vw
          height: 10vw
          display: block
          position: relative
          margin-left: 1vw
          z-index: 3
          cursor: pointer
          border-radius: 15%
          &-active
            border: 0.3vw solid #6dc5af
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
        line-height: 5vw
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

  .fade-enter-active, .fade-leave-active
    transition: opacity .7s ease

  .fade-enter, .fade-leave-to
    opacity: 0

@media only screen and (max-width : 480px)
  .main
    .cards
      .deck
        .deck-cards
          .card-field-deck
            margin-left: 0.25vw
    .bets
      .field
        &:nth-child(1)
          margin-left: 15vw
        &:nth-child(2)
          margin-right: 10vw

@media only screen and (max-width : 768px)
  .main
    .cards
      .hand, .deck
        .deck-cards
          .card-field-deck
            width: 13vw
            height: 16vw
            margin-top: 3%
            &:nth-child(4)
              margin-left: 8vw
  .main
    .cards
      .hand
        .hand-cards
          margin-left: 17%
          .card-field-hand
            width: 13vw
            height: 16vw
    .bets
      .field
        &:nth-child(1)
          margin-right: 0vw
          margin-left: 7vw
        &:nth-child(2)
          margin-left: 5vw
          margin-right: 0vw
        &-left
          width: 17vw
          line-height: 10vw
          font-size: 3vw
          height: 10vw
        &-right
          width: 20vw
          height: 10vw
          font-size: 3vw
          line-height: 10vw
    .footer
      height: 30vw
      h2
        font-size: 5vw
        margin-top: 5%
      p
        font-size: 3.5vw
      .button
        width: 16vw
        height: 16vw
        &-reset
          top: -25%
        &-success
          top: -25%
        img
          width: 8vw
          margin-top: 25%

</style>
