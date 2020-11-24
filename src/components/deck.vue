<template>
  <div id="deckRoot">
    <div>
      <b-button variant="success">
        <b-icon icon="play-fill"></b-icon>
      </b-button>
      <b-button variant="danger">
        <b-icon icon="stop-fill"></b-icon>
      </b-button>
      <b-button>
        <b-icon icon="skip-start-fill"></b-icon>
      </b-button>
      <b-button>
        <b-icon icon="skip-end-fill"></b-icon>
      </b-button>
    </div>
    <b-tabs pills card>
      <b-tab title="Playlist" active>
        <b-card-text>
          <draggable
            :list="songlist"
            :animation="100"
            ghost-class="moving-card"
            group="songs"
            filter=".action-button"
            class="w-full max-w-md"
            tag="ol"
            :scroll-sensitivity="200"
            :force-fallback="true"
          >
            <song-card
              v-for="s in songlist"
              :key="s.id"
              :s="s"
            ></song-card>
          </draggable>

          <b-button block variant="primary" id="modalBtn" @click="togglePlaylistModal">Bibliothek
            <b-icon icon="Box-arrow-up-right"></b-icon>
          </b-button>

          <!--MENU FOR PLAYLIST EDITING BEGIN-->
          <b-modal ref="playlistModal"  title="Playlist bearbeiten" visible="modalOpen">
            <b-tabs pills card>
              <b-tab title="Bibliothek" active>
                <b-card-text>
                  <b-container>
                    <b-row>
                      <h3>Draggable 1</h3>
                      <draggable class="list-group" :list="list1" group="people" @change="log">
                        <div
                          class="list-group-item"
                          v-for="(element, index) in list1"
                          :key="element.name"
                        >
                          {{ element.name }} {{ index }}
                        </div>
                      </draggable>
                    </b-row>
                    <b-row>
                      <b-col>
                        <h3>Draggable 2</h3>
                        <draggable class="list-group" :list="list2" group="people" @change="log">
                          <div
                            class="list-group-item"
                            v-for="(element, index) in list2"
                            :key="element.name"
                          >
                            {{ element.name }} {{ index }}
                          </div>
                        </draggable>
                      </b-col>
                      <b-col>
                        <h3>Draggable 2</h3>
                        <draggable class="list-group" :list="list2" group="people" @change="log">
                          <div
                            class="list-group-item"
                            v-for="(element, index) in list2"
                            :key="element.name"
                          >
                            {{ element.name }} {{ index }}
                          </div>
                        </draggable>
                      </b-col>

                    </b-row>
                  </b-container>

                </b-card-text>
              </b-tab>
              <b-tab title="Musik importieren">
                <b-card-text>Tab contents 2</b-card-text>
              </b-tab>
              <b-tab title="Freesound">
                <b-card-text>
                </b-card-text>
              </b-tab>
            </b-tabs>
          </b-modal>
          <!--MENU FOR PLAYLIST EDITING END-->

        </b-card-text>
      </b-tab>
      <b-tab title="EQ">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
      <b-tab title="FX">
        <b-card-text>
          <div>
            <b-button :pressed.sync="effect1On" variant="outline-dark">FX 1</b-button>
            <b-button :pressed.sync="effect2On" variant="outline-dark">FX 2</b-button>
            <b-button :pressed.sync="effect3On" variant="outline-dark">FX 3</b-button>
            <b-button :pressed.sync="effect4On" variant="outline-dark">FX 4</b-button>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab title="Scratch">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
      <b-tab title="Beats">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
    </b-tabs>
    <drop-zone></drop-zone>

  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SongCard from './SongCard';
import DropZone from './DropZone';
export default {
  name: 'deck',
  components: {
    draggable,
    SongCard,
    DropZone
  },
  data() {
    return {
      modalOpen: Boolean,
      effect1On: false,
      effect2On: false,
      effect3On: false,
      effect4On: false,
      songlist: [
        {
          id: 1,
          name: 'Song 1',
          img: ''
        },
        {
          id: 2,
          name: 'Song 2',
          img: ''

        },
        {
          id: 3,
          name: 'Song 3',
          img: ''

        },
        {
          id: 4,
          name: 'Song 4',
          img: ''

        },
        {
          id: 5,
          name: 'Song 5',
          img: ''

        }
      ],
      list1: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 }
      ],
      list2: [
        { name: 'Juan', id: 5 },
        { name: 'Edgard', id: 6 },
        { name: 'Johnson', id: 7 }
      ]
    };
  },
  methods: {
    onEdit(song) {
      alert(`Editing ${song.name}`);
    },
    onDelete(song) {
      alert(`Deleting ${song.name}`);
    },
    add: function () {
      this.list.push({ name: 'Juan' });
    },
    replace: function () {
      this.list = [{ name: 'Edgard' }];
    },
    clone: function (el) {
      return {
        name: el.name + ' cloned'
      };
    },
    log: function (evt) {
      window.console.log(evt);
    },
    togglePlaylistModal() {
      this.$refs['playlistModal'].show();
    }
  },
  mounted() {
  },
  /*methods: {
  },
   */

};

</script>

<style scoped>
</style>
