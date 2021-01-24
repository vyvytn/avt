<template>
  <b-container>
    <b-row class="p-2 mb-4">
      <b-col>
        <div class="p-2 mb-2 rounded bg-secondary" style="text-align: center;">
          <h3 class="text-light">BIBLIOTHEK</h3>
        </div>
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
              <b-row>
                <b-col cols="1">
                  <p class="h3">
                    <b-icon icon="music-note-list"></b-icon>
                  </p>
                </b-col>
                <b-col cols="3">
                  <p class="font-weight-lighter">Titel: </p>
                  <p class="font-weight-lighter">Künstler: </p>
                </b-col>
                <b-col cols="6">
                  <p class="font-weight-normal">{{ element.title }}</p>
                  <p class="font-weight-bold">{{ element.artist }}</p>
                  <!--              <p><b>Länge: </b>{{ element.duration }}</p>-->
                </b-col>
                <b-col cols="2">
                  <b-button variant="outline-danger" @click="deleteSong(element.songId, index)">
                    <b-icon icon="trash-fill"></b-icon>
                  </b-button>
                </b-col>
              </b-row>
            </div>
          </draggable>
        </div>
      </b-col>
    </b-row>
    <b-row class="p-2">
      <b-col>
        <div class="p-2 mb-2 rounded" style="text-align: center; background:linear-gradient(135deg, #84e8ca, #b9efe0)">
          <h3 class="text-light">DECK A</h3>
        </div>
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
              <b-row>
                <b-col cols="2">
                  <p class="h3">
                    <b-icon icon="music-note-list"></b-icon>
                  </p>
                </b-col>
                <b-col cols="7">
                  <p class="font-weight-normal">{{ element.title }}</p>
                  <p class="font-weight-bold">{{ element.artist }}</p>
                </b-col>
                <b-col cols="1">
                  <b-button @click="deleteFromPlaylistA(element.songId,index)" variant="outline-danger">
                    <b-icon icon="x-circle-fill"></b-icon>
                  </b-button>
                </b-col>
              </b-row>
            </div>
          </draggable>
        </div>
      </b-col>
      <b-col>
        <div class="p-2 mb-1 rounded" style="text-align: center; background:linear-gradient(135deg, #a498ee, #bbb1f8)">
          <h3 class="text-light">DECK B</h3>
        </div>
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
              <b-row>
                <b-col cols="2">
                  <p class="h3">
                    <b-icon icon="music-note-list"></b-icon>
                  </p>
                </b-col>
                <b-col cols="7">
                  <p class="font-weight-normal">{{ element.title }}</p>
                  <p class="font-weight-bold">{{ element.artist }}</p>
                </b-col>
                <b-col cols="1">
                  <b-button @click="deleteFromPlaylistB(element.songId, index)" variant="outline-danger">
                    <b-icon icon="x-circle-fill"></b-icon>
                  </b-button>
                </b-col>
              </b-row>
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
