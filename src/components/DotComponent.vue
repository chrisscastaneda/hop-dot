<template>
  <div 
    class="dot" 
    :class="{ 'empty-dot': color === '#d3d3d3' }"
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
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  box-shadow: 
    inset -4px -4px 8px rgba(0, 0, 0, 0.3),
    inset 4px 4px 8px rgba(255, 255, 255, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.dot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) rotate(-25deg);
  width: 8px;
  height: 100%;
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  opacity: 0.5;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

.dot::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 12px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 50%);
  pointer-events: none;
}

.dot:not([style*="background: #d3d3d3"]) {
  cursor: pointer;
}

.dot.empty-dot {
  box-shadow: 
    inset 2px 2px 4px rgba(0, 0, 0, 0.15),
    inset -2px -2px 4px rgba(255, 255, 255, 0.1),
    0 -2px 4px rgba(0, 0, 0, 0.08);
  background: radial-gradient(circle at center, #d3d3d3, #b0b0b0 70%) !important;
  border-width: 0;
  color: #999;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.dot.empty-dot::before {
  content: none;
  opacity: 0;
  display: none;
}

.dot.empty-dot::after {
  content: none;
  opacity: 0;
  display: none;
}
</style>
