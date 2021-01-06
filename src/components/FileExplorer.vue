<template>
  <div id="fileExplorer">
    <b-form-file
      v-model="file"
      :state="Boolean(file)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      accept=".mp3"
    ></b-form-file>
    <b-list-group>
      <b-list-group-item></b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: 'FileExplorer',
  data(){
    return{
      file: null,
    }
  }
};
</script>

<style scoped>

</style>
