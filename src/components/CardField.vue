<template>
  <div class="main">
    <img @click='sendId()' :src="backgroundImage()" alt="">
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['suit', 'rank', 'is_open', 'id'],
  data () {
    return {

    }
  },
  methods: {
    backgroundImage () {
      return require('../assets/media/' + this.rank + '_' + this.suit + '.png')
    },
    sendId () {
      this.$emit('send_id', this.id)
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
