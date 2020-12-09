<template>
  <b-container fluid="" style="padding: 1em">
    <b-row>
      <b-col col>
        <deck id="deckA"></deck>
      </b-col>
      <b-col cols="12" md="auto">
        <b-row class="row justify-content-center">
          <div>
            <label>Left</label>
            <VolumeSlider id="gainLeftDeckSlider" :horizontal="false"></VolumeSlider>
          </div>
          <div>
            <label>Master</label>
            <VolumeSlider id="gainMasterSlider" :horizontal="false"></VolumeSlider>
          </div>
          <div>
            <label>Right</label>
            <VolumeSlider id="gainRightDeckSlider" :horizontal="false"></VolumeSlider>
          </div>
        </b-row>
        <b-row class="row justify-content-center">
            <H3>Volume</H3>
        </b-row>
        <b-row class="row justify-content-center">
          <div>
            <label>Left</label>
            <VolumeSlider id="tempoLeftDeckSlider" :horizontal="false"></VolumeSlider>
          </div>
          <div>
            <b-button variant="secondary">
              <b-icon font-scale="2" icon="mic-fill" style="color: orangered"></b-icon>
            </b-button>
          </div>
          <div>
            <label>Right</label>
            <VolumeSlider id="tempoRightDeckSlider" :horizontal="false"></VolumeSlider>
          </div>
        </b-row>
        <b-row class="row justify-content-center">
          <H3>Tempo</H3>
        </b-row>
        <b-row class="row justify-content-center">
          <VolumeSlider id="crossfadeSlider" :horizontal="true"></VolumeSlider>
        </b-row>
        <b-row class="row justify-content-center">
          <H3>Fading</H3>
        </b-row>
      </b-col>
      <b-col col >
        <deck id="deckB"></deck>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>

import deck from './deck';
import VolumeSlider from './VolumeSlider';

export default {
  name: 'djtool',
  components: {
    VolumeSlider,
    deck,
  },
  data() {
    return {
      value: 0,
    };
  },
};
</script>

<style scoped>
</style>
