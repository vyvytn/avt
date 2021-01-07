<template>
  <div>
    {{name}} <b-button @click="$emit('addSong')">Add</b-button>
  </div>
</template>

<script>
  export default {
    name: 'FreeSoundItem',
    props: {
      name: null
    }
  };
</script>

<style scoped>

</style>
