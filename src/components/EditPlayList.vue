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
            @change="updatePlaylist"
          >
            <div
              class="list-group-item"
              v-for="(element, index) in library"
            >
              <p>{{ element.artist }}</p>
              <p>{{ element.title }}</p>
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
            @change="updatePlaylist"

          >
            <div
              class="list-group-item"
              v-for="(element, index) in songListA"
            >
              <p>{{ element.artist }}</p>
              <p>{{ element.title }}</p>
              <b-button @click="deleteFromPlaylistA('A',element.songId,index)" variant="outline-danger">
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
            @change="updatePlaylist"
          >
            <div
              class="list-group-item"
              v-for="(element, index) in songListB"
            >
              <p>{{ element.artist }}</p>
              <p>{{ element.title }}</p>
              <b-button @click="deleteFromPlaylistB('B',element.songId, index)" variant="outline-danger">
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
      window.console.log(evt);
    },
    deleteSong(sId, idx) {
      this.deleteFromPlaylistA(sId);
      this.deleteFromPlaylistB(sId);
      this.library.splice(idx, 1);
      // this.$emit('deleteSong', sId);
    },
    deleteFromPlaylistA(sId) {
      this.songListA.forEach(function(item, index, object) {
        if (item.songId === sId) {
          object.splice(index, 1);
        }
      });
      this.$emit('deleteFromPlaylistA', 'A', sId);
    },
    deleteFromPlaylistB(sId) {
      this.songListB.forEach(function(item, index, object) {
        if (item.songId === sId) {
          object.splice(index, 1);
        }
      });
      this.$emit('deleteFromPlaylistB', 'B', sId);
    },
    updatePlaylist() {
      this.$emit('playlistChanged');
    },
  },
  props: {
    playListArrayA: Array,
    playListArrayB: Array,
    songLibrary: Array,
  },
  computed:{
    songListA:function(){
      return this.playListArrayA
    },
    songListB: function (){
      return this.playListArrayB
    },
    library: function (){
      return this.songLibrary
    }
  }

};
</script>

<style scoped>
</style>
