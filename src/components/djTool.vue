<template>
  <div>
    <deck id="deckA"></deck>
    <deck id="deckB"></deck>
  </div>
</template>

<script>

import deck from './deck';

export default {
  name: 'djtool',
  components: { deck },
};
</script>

<style scoped>
#deckA{
  width: 50%;
  position: absolute;
  left: 0px;
  height: 100vh;
  top: 0;
}
#deckB{
  width: 50%;
  position: absolute;
  right: 0px;
  height: 100vh;
}
</style>
