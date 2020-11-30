<template>
  <div>
    <div v-if="!horizontal">
      <vue-slider
        v-model="value"
        direction="ttb"
        style="display: inline-block; margin: 30px 0; height: 300px;"
      ></vue-slider>
    </div>
    <div v-if="horizontal">
      <vue-slider v-model="value"></vue-slider>
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
    };
  },
  props: {
    horizontal: Boolean,
  }

};

</script>

<style scoped>

</style>
