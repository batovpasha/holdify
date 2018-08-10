<template>
    <div @click='activeDot()' class="main">

    </div>
</template>

<script>
export default {
  name: 'PopUp',
  props: ['id'],
  components:{

  },
  data () {
    return {

    }
  },
  methods: {
    activeDot(){
      this.$emit('dot_id', this.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>

</style>
