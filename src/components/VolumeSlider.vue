<template>
  <div>
    <div v-if="!horizontal">
      <vue-slider
        v-model="value"
        :interval="25"
        :marks="true"
        :hide-label="true"
        direction="btt"
        style="display: inline-block; margin: 5em 1.5em; height: 15em;"
      ></vue-slider>
    </div>
    <div v-if="horizontal">
      <vue-slider
        v-model="value2"
        :interval="10"
        :marks="true"
        :hide-label="true"
        :tooltip=" 'none' "
        direction="ltr"
        style="display: block; margin: 2em 1em; width: 15em;"
      ></vue-slider>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: 'VolumeSlider',
  components: { VueSlider },
  data() {
    return {
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
