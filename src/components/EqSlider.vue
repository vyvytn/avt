<template>
  <div>
    <div v-if="on">
      <label v-model="this.value"></label>
      <vue-slider
        v-model="value2"
        :interval="10"
        :marks="true"
        :hide-label="true"
        :tooltip=" 'none' "
        direction="btt"
        contained="true"
        drag-on-click="true"
        style="display: inline-block; margin: 5em 1em; height: 15em;"
      ></vue-slider>
    </div>
    <div v-if="!on">
      <label v-model="this.value"></label>
      <vue-slider
        v-model="value2"
        :interval="10"
        :marks="true"
        :hide-label="true"
        :tooltip=" 'none' "
        direction="btt"
        contained="true"
        disabled="true"
        drag-on-click="true"
        style="display: inline-block; margin: 5em 1em; height: 15em;"
      ></vue-slider>
    </div>
  </div>
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
    on: Boolean,
  },
  name: 'EqSlider',
  data() {
    return {
      value2: 50,
    };
  },
};
</script>

<style scoped>

</style>
