<template>
  <div class="app-container">
    <div class="triangle">
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="row">
        <DotComponent 
          v-for="dotIndex in row" 
          :key="`${rowIndex}-${dotIndex}`"
          :color="getDotColor(rowIndex, dotIndex)"
          :number="getDotNumber(rowIndex, dotIndex)"
          @click="changeDotColor(rowIndex, dotIndex)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DotComponent from './components/DotComponent.vue';

export default {
  name: 'App',
  components: {
    DotComponent
  },
  data() {
    return {
      rows: [1, 2, 3, 4, 5],
      allColors: [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe',
        '#fd79a8', '#fdcb6e', '#e17055', '#00b894', '#00cec9', '#0984e3',
        '#fab1a0', '#74b9ff', '#a29bfe', '#dfe6e9', '#ff7675', '#fd79a8',
        '#ffeaa7', '#55efc4', '#81ecec', '#74b9ff', '#b2bec3', '#636e72'
      ],
      dotColors: []
    };
  },
  created() {
    this.initializeDots();
  },
  methods: {
    initializeDots() {
      let colorIndex = 0;
      this.dotColors = this.rows.map((numDots, rowIndex) => {
        const row = [];
        for (let i = 0; i < numDots; i++) {
          row.push(this.allColors[colorIndex % this.allColors.length]);
          colorIndex++;
        }
        return row;
      });
    },
    getDotColor(rowIndex, dotIndex) {
      return this.dotColors[rowIndex][dotIndex - 1];
    },
    getDotNumber(rowIndex, dotIndex) {
      let number = 1;
      for (let i = 0; i < rowIndex; i++) {
        number += this.rows[i];
      }
      return number + dotIndex - 1;
    },
    changeDotColor(rowIndex, dotIndex) {
      const currentColor = this.dotColors[rowIndex][dotIndex - 1];
      const usedColors = this.dotColors.flat();
      const availableColors = this.allColors.filter(color => !usedColors.includes(color) || color === currentColor);
      
      let newColor;
      if (availableColors.length > 1) {
        const filtered = availableColors.filter(c => c !== currentColor);
        newColor = filtered[Math.floor(Math.random() * filtered.length)];
      } else {
        const otherColors = this.allColors.filter(c => c !== currentColor);
        newColor = otherColors[Math.floor(Math.random() * otherColors.length)];
      }
      
      this.dotColors[rowIndex][dotIndex - 1] = newColor;
    }
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

.triangle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.row {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
