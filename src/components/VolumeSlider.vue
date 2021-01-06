<template>
  <div>
    <div v-if="!horizontal">
      <vue-slider
        v-model="value"
        :interval="25"
        :marks=true
        :hide-label=true
        direction="btt"
        :contained=true
        :drag-on-click=true
        style="display: inline-block; height: 12em"
      ></vue-slider>
    </div>
    <div v-if="horizontal">
      <vue-slider
        v-model="value2"
        :interval="10"
        :marks=true
        :hide-label=true
        :tooltip=" 'none' "
        direction="ltr"
        :contained=true
        :drag-on-click=true
        style="display: block; width: 18em;"
      ></vue-slider>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/material.css';

export default {
  name: 'VolumeSlider',
  components: { VueSlider },
  data() {
    return {
      marks: {
      },
      value: 100,
      value2: 50,
    };
  },
  props: {
    horizontal: Boolean,
  }

};

</script>

<style scoped>
</style>
