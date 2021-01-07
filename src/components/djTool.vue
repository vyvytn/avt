<template>
  <b-container fluid="">
    <b-row>
      <b-col col>
        <deck @openLibraryClicked="togglePlaylistModal" id="deckA" :array-playlist="listA"></deck>
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
      <b-col col>
        <deck @openLibraryClicked="togglePlaylistModal" id="deckB" :array-playlist="listB"></deck>
      </b-col>
    </b-row>

    <!--MENU FOR PLAYLIST EDITING BEGIN-->
    <b-modal ref="playlistModal" title="Playlist bearbeiten">
      <b-tabs pills card fill>
        <b-tab title="Bibliothek" active>
          <b-card-text>
            <edit-play-list :play-list-array-a="listA" :play-list-array-b="listB" :song-library="songLibrary"></edit-play-list>
          </b-card-text>
        </b-tab>
        <b-tab title="Musik importieren">
          <b-card-text>
            <FileExplorer></FileExplorer>
          </b-card-text>
        </b-tab>
        <b-tab title="Freesound">
          <FreeSoundList @update="updateLibrary"></FreeSoundList>
        </b-tab>
      </b-tabs>
    </b-modal>
    <!--MENU FOR PLAYLIST EDITING END-->
  </b-container>

</template>

<script>

import deck from './deck';
import VolumeSlider from './VolumeSlider';
import FreeSoundList from './FreeSoundList';
import FileExplorer from './FileExplorer';
import EditPlayList from './EditPlayList';

export default {
  name: 'djtool',
  components: {
    VolumeSlider,
    deck,
    FileExplorer,
    FreeSoundList,
    EditPlayList,
  },
  data() {
    return {
      value: 0,
      listA: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
      listB: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
      songLibrary:[
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ]
    };
  },
  methods: {
    togglePlaylistModal() {
      this.$refs.playlistModal.show();
    },
    updateLibrary(value){
      this.songLibrary.push(value)
    }

  },
  mounted() {

  }
};
</script>

<style scoped>
.container-fluid {
  max-height: 100vh;
  padding: 1em;
}

.col-auto {
  padding: .5em;
  margin: .2em .8em;

}

.row {
  justify-content: center;
  margin-bottom: 1.5em;
}

h6, h4 {
  margin-bottom: 0.5em;
  text-align: center;
}
</style>
