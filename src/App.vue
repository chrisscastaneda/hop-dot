<template>
  <div class="app-container">
    <DotComponent />
  </div>
</template>

<script>
import DotComponent from './components/DotComponent.vue';

export default {
  name: 'App',
  components: {
    DotComponent
  }
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
}
</style>
