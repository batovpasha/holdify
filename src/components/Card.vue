<template>
  <div class="main">
    <img :src="backgroundImage()" alt="">
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['suit','rank'],
  data () {
    return {

    }
  },
  methods:{
    backgroundImage() {
      return require('../assets/media/' + this.rank + '_' + this.suit + '.png')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
.main
  width: 100px
  height: 200px

</style>
