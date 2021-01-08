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
            @change="log"
            :scroll-sensitivity="200"
            forceFallback="true"
            style="list-style: none"
          >
            <div
              class="list-group-item"
              v-for="(element, index) in library"
            >
              {{ element.name }} {{ index }}
              <b-button variant="outline-danger" @click="deleteSong(element.name, index)">
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
            @change="log"
            :scroll-sensitivity="200"
            forceFallback="true"
            style="list-style: none">
            <div
              class="list-group-item"
              v-for="(element, index) in songListA"
            >
              {{ element.name }} {{ index }}
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
            @change="log"
            :scroll-sensitivity="200"
            forceFallback="true"
            group="song"
            style="list-style: none">
            <div
              class="list-group-item"
              v-for="(element, index) in songListB"
            >
              {{ element.name }} {{ index }}
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
        this.library.splice(idx, 1);
        for(let i=0; i < this.songListA.length; i++){
          if(this.songListA[i].name===name){
            console.log(this.songListA[i]);
            this.songListA.splice(idx, 1);
          }
        }
        for(let i=0; i < this.songListB.length; i++){
          if(this.songListB[i].name===name){
            console.log(this.songListB[i]);
            this.songListB.splice(idx, 1);
          }
        }
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
