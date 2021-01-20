<template>
  <div id="fileExplorer">
    <b-form-file
      v-model="file"
      :state="Boolean(file)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      accept=".mp3"
    ></b-form-file>
    <div class="mt-3">Selected file: {{ file ? file.name : '' }}
      <b-button @click="uploadSong(file)">Upload</b-button>
    </div>
    <b-list-group v-for="element in fileList">
      <b-list-group-item>
        {{ element }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
/*
  import axios from 'axios';
*/
export default {
  name: 'FileExplorer',
  data() {
    return {
      file: null,
      fileList: []
    };
  },
  methods: {
    uploadSong(file) {
      this.fileList.push(file.name);
      // this.$emit('songFile', file
      this.$emit('upload', file);
    },

  }
};
</script>

<style scoped>

</style>
