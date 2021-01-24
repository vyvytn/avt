<template>
  <div>
    <div v-if=on>

      <vue-slider
        :min="-12"
        :max="12"
        v-model="value2"
        :interval="1"
        :marks=true
        :hide-label=true
        :tooltip-placement="'bottom'"
        direction="btt"
        :contained=true
        :drag-on-click=true
        style="display: inline-block; margin: 5em 1em; height: 15em;"
        @change="emitValue(value, value2)"
      >
        <div style="justify-content: center">
          <label>{{ value }}</label>
        </div>
      </vue-slider>
    </div>
    <div v-if=!on>
      <vue-slider
        :hide-label=true
        :tooltip=" 'none' "
        direction="btt"
        :contained=true
        :disabled=true
        :drag-on-click=true
        style="display: inline-block; margin: 5em 1em; height: 15em;"
        @change="emitValue(value, 0)"
      >
      </vue-slider>
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
      value2: 0,
    };
  },
  methods: {
    emitValue(index, value) {
      this.$emit('changeEq', index, value);
      //console.log(this.value + ", " + this.value2)
      console.log(index + ', ' + value);
    }
  }
};
</script>

<style scoped>

</style>
