<template>
  <div 
    class="dot" 
    :style="{ background: color }"
    @click="$emit('click')"
  >
    {{ number }}
  </div>
</template>

<script>
export default {
  name: 'DotComponent',
  props: {
    color: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: true
    }
  },
  emits: ['click']
};
</script>

<style scoped>
.dot {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: background 0.3s ease;
  margin: 5px;
  border: 3px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.dot:not([style*="background: #d3d3d3"]) {
  cursor: pointer;
}
</style>
