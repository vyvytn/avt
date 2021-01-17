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
              {{ element.artist }} {{ element.title  }}
              <b-button variant="outline-danger" @click="deleteSong(element.artist, index)">
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
              {{ element.artist }} {{ element.title  }}
              <b-button @click="songListA.splice(index, 1)" variant="outline-danger">
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
              {{ element.artist }} {{ element.title  }}
              <b-button @click="songListB.splice(index, 1)" variant="outline-danger">
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
        songListA: this.playListArrayA,
        songListB: this.playListArrayB,
        library: this.songLibrary,
        songName: 0
      };
    },
    methods: {
      log(evt) {
        window.console.log(evt);
      },
      deleteSong(name, idx){
        console.log(idx);
        this.library.splice(idx, 1);
        for(let i=0; i < this.songListA.length; i++){
          if(this.songListA[i].name===name){
            console.log(this.songListA[i]);
            this.songListA.splice(i, 1);
          }
        }
        for(let i=0; i < this.songListB.length; i++){
          if(this.songListB[i].name===name){
            console.log(this.songListB[i]);
            this.songListB.splice(i, 1);
          }
        }
      },
      updatePlaylist(){
        this.$emit("playlistChanged")
      }
    },
    props: {
      playListArrayA: Array,
      playListArrayB: Array,
      songLibrary: Array,
    },
  };
</script>

<style scoped>

</style>
