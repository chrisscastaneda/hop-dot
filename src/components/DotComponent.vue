<template>
  <div 
    class="dot" 
    :style="{ background: currentColor }"
    @click="changeColor"
  ></div>
</template>

<script>
export default {
  name: 'DotComponent',
  data() {
    return {
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'],
      colorIndex: 0
    };
  },
  computed: {
    currentColor() {
      return this.colors[this.colorIndex];
    }
  },
  methods: {
    changeColor() {
      this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    }
  }
};
</script>

<style scoped>
.dot {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}
</style>
