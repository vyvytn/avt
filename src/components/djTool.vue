<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col>
        <deck id="deckA"></deck>
      </b-col>
      <b-col>
        <vue-slider
          v-model="value"
          direction="ttb"
          style="display: inline-block; margin: 30px 0; height: 300px;"
        ></vue-slider>
        <vue-slider
          v-model="value"
          direction="ttb"
          style="display: inline-block; margin: 30px 0; height: 300px;"
        ></vue-slider>
        <vue-slider
          v-model="value"
          direction="ttb"
          style="display: inline-block; margin: 30px 0; height: 300px;"
        ></vue-slider>
      </b-col>
      <b-col>
        <deck id="deckB"></deck>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>

import deck from './deck';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: 'djtool',
  components: {
    deck,
    VueSlider,

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
