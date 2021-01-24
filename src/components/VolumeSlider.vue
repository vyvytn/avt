<template>
  <div>
    <div v-if="!horizontal && !tempo">
      <vue-slider
        :max="1"
        v-model="value"
        :interval="0.10"
        :marks=true
        :hide-label=true
        :tooltip-placement="'bottom'"
        direction="btt"
        :contained=true
        :drag-on-click=true
        style="display: inline-block; height: 12em"
        @change="emitValue(value)"
      >
      </vue-slider>
    </div>
    <div v-if="!horizontal && tempo">
      <vue-slider
        :max="2"
        :min="0.1"
        :interval="0.1"
        v-model="value3"
        :hide-label=true
        :tooltip-placement="'bottom'"
        direction="btt"
        :contained=true
        :drag-on-click=true
        style="display: inline-block; height: 12em"
        @change="emitValue(value3)"
      >
      </vue-slider>
    </div>
    <div v-if="horizontal && !tempo">
      <vue-slider
        :max="1"
        v-model="value2"
        :interval="0.05"
        :hide-label=true
        :tooltip=" 'none' "
        direction="ltr"
        :contained=true
        :drag-on-click=true
        style="display: block; width: 18em;"
        @change="emitValue(value2)"
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
      value2: 0.5,
      value3: 1,
      value: 0.5,
    };
  },
  props: {
    horizontal: Boolean,
    tempo: Boolean,
    //value3:Number
  },
  methods: {
    emitValue(val) {
      this.$emit('valueChanged', val);
    }
  }

};

</script>

<style scoped>
</style>
