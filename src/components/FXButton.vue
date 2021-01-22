<template>
  <b-button :pressed.sync="effectOn" @click="toggleEffect(buttonLabel)" variant="outline-dark">{{this.buttonLabel}}</b-button>
</template>

<script>
export default {
  name: 'FXButton',
  data() {
    return {
      effectOn: false,
      buttonLabel: this.label,
    };
  },
  methods:{
    toggleEffect(name){
      this.$emit('toggleFXButton', name)
    }
  },
  props: {
    label: '',
  }
};
</script>

<style scoped>

</style>
