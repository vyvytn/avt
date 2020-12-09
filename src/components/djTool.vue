<template>
  <b-container fluid="">
    <b-row>
      <b-col col>
        <deck id="deckA"></deck>
      </b-col>
      <b-col cols="12" md="auto">
        <h4>Volume</h4>
        <b-row>
          <b-col cols="auto">
            <VolumeSlider id="gainLeftDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>L</h6>
          </b-col>
          <b-col cols="auto">
            <VolumeSlider id="gainMasterSlider" :horizontal="false"></VolumeSlider>
            <h6>M</h6>
          </b-col>
          <b-col cols="auto">
            <VolumeSlider id="gainRightDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>R</h6>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="auto">
            <b-button variant="secondary">
              <b-icon font-scale="1.5em" icon="mic-fill" style="color: orangered"></b-icon>
            </b-button>
          </b-col>
        </b-row>
        <h4>Tempo</h4>
        <b-row>
          <b-col cols="auto">
            <VolumeSlider id="tempoLeftDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>L</h6>
          </b-col>
          <b-col cols="auto">
            <VolumeSlider id="tempoRightDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>R</h6>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="auto">
            <h4>Fading</h4>
            <VolumeSlider id="crossfadeSlider" :horizontal="true"></VolumeSlider>
          </b-col>
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
.container-fluid {
  max-height: 100vh;
  padding: 1em;
}

.col-auto{
  padding: .5em;
  margin: .2em .8em;

}

.row{
  justify-content: center;
  margin-bottom: 1.5em;
}

h6, h4 {
  margin-bottom: 0.5em;
  text-align: center;
}
</style>
