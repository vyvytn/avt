<template>
  <b-card-text>
    <b-form-input :list="freeSoundList" placeholder="Search for free Sounds"></b-form-input>
    <b-list-group>
      <b-list-group-item v-for="element in freeSoundList" :key = "element.name">
        <div>
          {{element.name}}
        </div>
        <b-button>Add</b-button>
      </b-list-group-item>
    </b-list-group>
  </b-card-text>
</template>

<script>
export default {
  name: 'FreeSoundList',
  data(){
    return{
      freeSoundList: [
        { name: 'Song 1'},
        { name: 'Song 2'},
        { name: 'song 3'},
      ],
    }
  }
};
</script>

<style scoped>

</style>
