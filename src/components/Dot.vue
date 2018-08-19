<template>
    <div @click='activeDot()' class="main">

    </div>
</template>

<script>
export default {
  name: 'PopUp',
  props: ['id'],
  components: {

  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    activeDot () {
      //  create event 'dot_id', that sends id of the dot by clicking
      this.$emit('dot_id', this.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
.active
  background: white
</style>
