<template>
  <b-button :pressed.sync="effectOn" variant="outline-dark">{{this.buttonLabel}}</b-button>
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
  props: {
    label: '',
  }
};
</script>

<style scoped>

</style>
