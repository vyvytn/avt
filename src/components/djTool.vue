<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col>
        <deck id="deckA"></deck>
      </b-col>
      <b-col>
        <b-row>
          <VolumeSlider :horizontal="false"></VolumeSlider>
          <VolumeSlider :horizontal="false"></VolumeSlider>
          <VolumeSlider :horizontal="false"></VolumeSlider>
        </b-row>
        <b-row>
          <VolumeSlider :horizontal="false"></VolumeSlider>
          <VolumeSlider :horizontal="false"></VolumeSlider>
        </b-row>
        <b-row>
          <VolumeSlider :horizontal="true"></VolumeSlider>
        </b-row>
      </b-col>
      <b-col>
        <deck id="deckB"></deck>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>

import deck from './deck';
//import VueSlider from 'vue-slider-component';
//import 'vue-slider-component/theme/default.css';
import VolumeSlider from './VolumeSlider';
export default {
  name: 'djtool',
  components: {
    VolumeSlider,
    deck
  },
  data() {
    return {
      value: 0,
    };
  }
};
</script>

<style scoped>
#deckA {
  width: 100%;
  position: absolute;
  left: 0px;
  height: 100vh;
  top: 0;
}

#deckB {
  width: 100%;
  position: absolute;
  right: 0px;
  height: 100vh;
}
</style>
