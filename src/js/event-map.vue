<template>
    <div class="google-map" :id="mapName"></div>
</template>

<script>
export default {
  name: 'event-map',
  props: ['name'],
  data: function() {
      return {
          mapName: this.name + "-map",
      }
  }
};
</script>

<style scoped>
.google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: darkolivegreen;
}
</style>
