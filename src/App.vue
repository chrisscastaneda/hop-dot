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
      defaultColor: '#4a90e2',
      emptyColor: '#d3d3d3',
      selectedColor: '#2ecc71',
      dotStates: []
    };
  },
  created() {
    this.initializeDots();
  },
  methods: {
    initializeDots() {
      this.dotStates = this.rows.map((numDots) => {
        return Array(numDots).fill('default');
      });
      
      const totalDots = 15;
      const randomDot = Math.floor(Math.random() * totalDots);
      let count = 0;
      
      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        for (let dotIndex = 0; dotIndex < this.rows[rowIndex]; dotIndex++) {
          if (count === randomDot) {
            this.dotStates[rowIndex][dotIndex] = 'empty';
            return;
          }
          count++;
        }
      }
    },
    getDotColor(rowIndex, dotIndex) {
      const state = this.dotStates[rowIndex][dotIndex - 1];
      if (state === 'default') return this.defaultColor;
      if (state === 'selected') return this.selectedColor;
      return this.emptyColor;
    },
    getDotNumber(rowIndex, dotIndex) {
      let number = 1;
      for (let i = 0; i < rowIndex; i++) {
        number += this.rows[i];
      }
      return number + dotIndex - 1;
    },
    changeDotColor(rowIndex, dotIndex) {
      const currentState = this.dotStates[rowIndex][dotIndex - 1];
      if (currentState === 'empty') return;
      
      if (currentState === 'default') {
        this.dotStates[rowIndex][dotIndex - 1] = 'selected';
      } else if (currentState === 'selected') {
        this.dotStates[rowIndex][dotIndex - 1] = 'default';
      }
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
