<template>
  <vue-slider
    v-model="value2"
    :interval="10"
    :marks="true"
    :hide-label="true"
    :tooltip=" 'none' "
    direction="btt"
    style="display: inline-block; margin: 5em 1em; height: 15em;"
  ></vue-slider>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  components: {
    VueSlider,
  },
  props: {
    value: 0,
  },
  name: 'EqSlider',
  data() {
    return {
      value2: 50,
      /*marks2: {
        0: {
          label: this.value,
          style: {
            width: '8px',
            height: '8px',
            display: 'block',
            backgroundColor: 'red',
            transform: 'translate(-2px, -2px)',
          },
          labelStyle: {
            color: 'red',
          },
        },
      },*/
    };
  },
};
</script>

<style scoped>

</style>
