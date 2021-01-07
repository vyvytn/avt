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
              <b-button @click="library.splice(index, 1)">delete</b-button>
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
