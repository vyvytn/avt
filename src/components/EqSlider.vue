<template>
  <vue-slider
    v-model="value2"
    :marks="marks2"
    direction="btt"
    style="display: inline-block; margin: 30px 0; height: 300px;"
  ></vue-slider>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css'
export default {
  components:{
    VueSlider
  },
  props:{
    value:0
  },
  name: 'EqSlider',
  data: function () {
    return {
      value2: 0,
      marks2: {
        '0': {
          label: this.value,
          style: {
            width: '8px',
            height: '8px',
            display: 'block',
            backgroundColor: 'red',
            transform: 'translate(-2px, -2px)'
          },
          labelStyle: {
            color: 'red'
          }
        }
      },
    };
  },
};
</script>

<style scoped>

</style>
