<template>
  <div class="main">
    <img @click="sendCardData()" :src="`/static/img/${rank}_${suit}.png`" alt="">
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['suit', 'rank'],
  data () {
    return {

    }
  },
  methods: {
    sendCardData () {
      this.$emit('card_data', this.suit, this.rank)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
.main
  img
    width: 100%
    height: 100%

</style>
