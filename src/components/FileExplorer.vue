<template>
  <div id="fileExplorer">
    <b-form-file
      v-model="file"
      :state="Boolean(file)"
      placeholder="Lade eigene MP3-Dateien hoch..."
      drop-placeholder="Drop file here..."
      accept=".mp3"
    ></b-form-file>
    <div class="mt-3">Deine MP3: {{ file ? file.name : '' }}
      <b-button @click="uploadSong(file)">Upload</b-button>
    </div>
    <b-list-group v-for="(element, index) in fileList"
                  :key="index">
      <b-list-group-item>
        {{ element }}
      </b-list-group-item>
    </b-list-group>
    <b-alert
      v-model="uploadSuccess"
      variant="success"
      dismissible>
      Zur Bibliothek erfolgreich hinzugefügt
    </b-alert>
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
      fileList: [],
      uploadSuccess: false,
    };
  },
  methods: {
    uploadSong(file) {
      this.fileList.push(file.name);
      this.$emit('upload', file);
      this.uploadSuccess = true;
    }

  }
};
</script>

<style scoped>

</style>
