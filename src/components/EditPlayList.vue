<template>
  <b-container>
    <b-row>
      <b-col>
        <h3>Bibliothek</h3>
        <div style="overflow-y: auto ; max-height: 200px">
          <draggable
            class="dragArea list-group"
            :list="library"
            :group="{name:'song', pull:'clone', put:false}"
            :scroll-sensitivity="200"
            forceFallback="true"
            style="list-style: none"
            @change="updatePlaylist('both')"
          >
            <div
              class="list-group-item"
              v-for="(element, index) in library"
            >
              <b-icon icon="music-note-list"></b-icon>
              <p><b>Künstler: </b>{{ element.artist }}</p>
              <p><b>Titel: </b>{{ element.title }}</p>
<!--              <p><b>Länge: </b>{{ element.duration }}</p>-->
              <b-button variant="outline-danger" @click="deleteSong(element.songId, index)">
                <b-icon icon="trash-fill"></b-icon>
              </b-button>
            </div>
          </draggable>
        </div>

      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>Deck A</h3>
        <div style="overflow-y: auto ; max-height: 200px">
          <draggable
            class="dragArea list-group"
            :list="songListA"
            group="song"
            :scroll-sensitivity="200"
            forceFallback="true"
            style="list-style: none"
            @change="updatePlaylist('A')"
          >
            <div
              class="list-group-item"
              v-for="(element, index) in songListA"
            >
              <b-icon icon="music-note-list"></b-icon>
              <p>{{ element.artist }}</p>
              <p>{{ element.title }}</p>
              <b-button @click="deleteFromPlaylistA(element.songId,index)" variant="outline-danger">
                <b-icon icon="x-circle-fill"></b-icon>
              </b-button>
            </div>
          </draggable>
        </div>
      </b-col>
      <b-col>
        <h3>Deck B</h3>
        <div style="overflow-y: auto ; max-height: 200px">
          <draggable
            class="list-group"
            :list="songListB"
            :scroll-sensitivity="200"
            forceFallback="true"
            group="song"
            style="list-style: none"
            @change="updatePlaylist('B')"
          >
            <div
              class="list-group-item"
              v-for="(element, index) in songListB"
            >
              <b-icon icon="music-note-list"></b-icon>
              <p>{{ element.artist }}</p>
              <p>{{ element.title }}</p>
              <b-button @click="deleteFromPlaylistB(element.songId, index)" variant="outline-danger">
                <b-icon icon="x-circle-fill"></b-icon>
              </b-button>
            </div>
          </draggable>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'EditPlayList',
  components: {
    draggable,
  },
  data() {
    return {

      songName: 0
    };
  },
  methods: {
    log(evt) {
      console.log(evt);
    },
    deleteSong(sId, idx) {
      this.library.splice(idx, 1);
      this.deleteFromPlaylistA(sId);
      this.deleteFromPlaylistB(sId);
    },
    deleteFromPlaylistA(sId) {
      this.songListA.forEach(function (item, index, object) {
        if (item.songId === sId) {
          object.splice(index, 1);
        }
      });
      this.$emit('deleteFromPlaylistA', sId);
    },
    deleteFromPlaylistB(sId) {
      this.songListB.forEach(function (item, index, object) {
        if (item.songId === sId) {
          object.splice(index, 1);
        }
      });
      this.$emit('deleteFromPlaylistB', sId);
    },
    updatePlaylist(deck) {
      this.$emit('playlistChanged', deck);
    },
  },
  props: {
    playListArrayA: Array,
    playListArrayB: Array,
    songLibrary: Array,
  },
  computed: {
    songListA: function () {
      return this.playListArrayA;
    },
    songListB: function () {
      return this.playListArrayB;
    },
    library: function () {
      return this.songLibrary;
    }
  }

};
</script>

<style scoped>
</style>
