<template>
  <div class="app-container">
    <div class="game-message" v-if="gameOverMessage">{{ gameOverMessage }}</div>
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
    <div class="instruction-message" v-if="customResetMode">To start, pick the dot to be empty.</div>
    <div class="button-container">
      <button class="reset-button" @click="resetGame">Reset Game</button>
      <button class="reset-button" @click="customReset">Custom Reset</button>
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
      dotStates: [],
      selectedDot: null,
      customResetMode: false
    };
  },
  created() {
    this.initializeDots();
  },
  computed: {
    /**
     * Counts the number of non-empty dots remaining on the board.
     * @returns {number} The count of default or selected dots
     */
    remainingDots() {
      let count = 0;
      for (let row of this.dotStates) {
        for (let state of row) {
          if (state !== 'empty') {
            count++;
          }
        }
      }
      return count;
    },
    /**
     * Checks if there are any valid moves remaining.
     * @returns {boolean} True if at least one valid move exists
     */
    hasValidMoves() {
      for (let fromRow = 0; fromRow < this.rows.length; fromRow++) {
        for (let fromIndex = 0; fromIndex < this.rows[fromRow]; fromIndex++) {
          if (this.dotStates[fromRow][fromIndex] !== 'empty') {
            for (let toRow = 0; toRow < this.rows.length; toRow++) {
              for (let toIndex = 0; toIndex < this.rows[toRow]; toIndex++) {
                if (this.dotStates[toRow][toIndex] === 'empty') {
                  if (this.getValidMoves(fromRow, fromIndex, toRow, toIndex)) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
      return false;
    },
    /**
     * Returns the appropriate game over message based on remaining dots.
     * @returns {string|null} The message to display, or null if game is not over
     */
    gameOverMessage() {
      if (this.customResetMode || this.hasValidMoves) {
        return null;
      }
      
      const count = this.remainingDots;
      if (count === 1) return 'Congratulations! You\'re a genius!';
      if (count === 2) return 'Good job! Almost perfect.';
      if (count === 3) return 'Better luck next time.';
      if (count >= 4) return 'Is that all you got?! Try harder.';
      return null;
    }
  },
  methods: {
    /**
     * Resets the game by clearing the selected dot and re-initializing all dots.
     * @returns {void}
     */
    resetGame() {
      this.selectedDot = null;
      this.customResetMode = false;
      this.initializeDots();
    },
    /**
     * Custom reset that sets all dots to default state and waits for user to select empty dot.
     * @returns {void}
     */
    customReset() {
      this.selectedDot = null;
      this.customResetMode = true;
      this.dotStates = this.rows.map((numDots) => {
        return Array(numDots).fill('default');
      });
    },
    /**
     * Initializes the dot states for the game board.
     * Sets all dots to 'default' state except one randomly selected dot which is set to 'empty'.
     * @returns {void}
     */
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
    /**
     * Gets the color for a dot based on its current state.
     * @param {number} rowIndex - The zero-based row index of the dot
     * @param {number} dotIndex - The one-based dot index within the row
     * @returns {string} The hex color code for the dot's current state
     */
    getDotColor(rowIndex, dotIndex) {
      const state = this.dotStates[rowIndex][dotIndex - 1];
      if (state === 'default') return this.defaultColor;
      if (state === 'selected') return this.selectedColor;
      return this.emptyColor;
    },
    /**
     * Calculates the display number for a dot based on its position.
     * Numbers are sequential from 1-15, starting at the top of the triangle.
     * @param {number} rowIndex - The zero-based row index of the dot
     * @param {number} dotIndex - The one-based dot index within the row
     * @returns {number} The display number for the dot (1-15)
     */
    getDotNumber(rowIndex, dotIndex) {
      let number = 1;
      for (let i = 0; i < rowIndex; i++) {
        number += this.rows[i];
      }
      return number + dotIndex - 1;
    },
    /**
     * Handles click events on dots and manages game state transitions.
     * - Clicking a default dot selects it
     * - Clicking a selected dot deselects it
     * - Clicking an empty dot attempts to move the selected dot there
     * @param {number} rowIndex - The zero-based row index of the clicked dot
     * @param {number} dotIndex - The one-based dot index within the row
     * @returns {void}
     */
    changeDotColor(rowIndex, dotIndex) {
      const arrayIndex = dotIndex - 1;
      const currentState = this.dotStates[rowIndex][arrayIndex];
      
      if (this.customResetMode) {
        this.dotStates[rowIndex][arrayIndex] = 'empty';
        this.customResetMode = false;
        return;
      }
      
      if (currentState === 'default') {
        if (this.selectedDot) {
          this.dotStates[this.selectedDot.row][this.selectedDot.index] = 'default';
        }
        this.dotStates[rowIndex][arrayIndex] = 'selected';
        this.selectedDot = { row: rowIndex, index: arrayIndex };
      } else if (currentState === 'selected') {
        this.dotStates[rowIndex][arrayIndex] = 'default';
        this.selectedDot = null;
      } else if (currentState === 'empty' && this.selectedDot) {
        this.tryMove(this.selectedDot.row, this.selectedDot.index, rowIndex, arrayIndex);
      }
    },
    /**
     * Attempts to execute a move from one position to another.
     * If valid, removes the jumping dot and middle dot, and places selected dot at destination.
     * @param {number} fromRow - The zero-based row index of the source dot
     * @param {number} fromIndex - The zero-based dot index of the source dot
     * @param {number} toRow - The zero-based row index of the destination dot
     * @param {number} toIndex - The zero-based dot index of the destination dot
     * @returns {void}
     */
    tryMove(fromRow, fromIndex, toRow, toIndex) {
      const moves = this.getValidMoves(fromRow, fromIndex, toRow, toIndex);
      
      if (moves) {
        this.dotStates[fromRow][fromIndex] = 'empty';
        this.dotStates[moves.midRow][moves.midIndex] = 'empty';
        this.dotStates[toRow][toIndex] = 'selected';
        this.selectedDot = { row: toRow, index: toIndex };
      }
    },
    /**
     * Validates a move and returns the middle dot position if valid.
     * Checks if the move is exactly 2 positions away in a valid hexagonal direction
     * and that there is a default dot in between to jump over.
     * @param {number} fromRow - The zero-based row index of the source dot
     * @param {number} fromIndex - The zero-based dot index of the source dot
     * @param {number} toRow - The zero-based row index of the destination dot
     * @param {number} toIndex - The zero-based dot index of the destination dot
     * @returns {Object|null} Object with midRow and midIndex if valid, null otherwise
     */
    getValidMoves(fromRow, fromIndex, toRow, toIndex) {
      const rowDiff = toRow - fromRow;
      const indexDiff = toIndex - fromIndex;
      
      let midRow, midIndex;
      
      if (rowDiff === 0 && Math.abs(indexDiff) === 2) {
        midRow = fromRow;
        midIndex = fromIndex + indexDiff / 2;
      }
      else if (rowDiff === 2 && indexDiff === 0) {
        midRow = fromRow + 1;
        midIndex = fromIndex;
      }
      else if (rowDiff === 2 && indexDiff === 2) {
        midRow = fromRow + 1;
        midIndex = fromIndex + 1;
      }
      else if (rowDiff === -2 && indexDiff === 0) {
        midRow = fromRow - 1;
        midIndex = fromIndex;
      }
      else if (rowDiff === -2 && indexDiff === -2) {
        midRow = fromRow - 1;
        midIndex = fromIndex - 1;
      }
      else if (rowDiff === -2 && Math.abs(indexDiff) === 2) {
        midRow = fromRow - 1;
        midIndex = fromIndex + indexDiff / 2;
      }
      else {
        return null;
      }
      
      if (midRow < 0 || midRow >= this.rows.length) return null;
      if (midIndex < 0 || midIndex >= this.rows[midRow]) return null;
      
      if (this.dotStates[midRow][midIndex] === 'default') {
        return { midRow, midIndex };
      }
      
      return null;
    }
  }
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  position: relative;
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

.game-message {
  position: absolute;
  top: 80px;
  font-size: 36px;
  font-weight: bold;
  color: #e74c3c;
  text-align: center;
  max-width: 80%;
}

.instruction-message {
  position: absolute;
  bottom: 90px;
  font-size: 18px;
  color: #555;
  text-align: center;
}

.button-container {
  position: absolute;
  bottom: 30px;
  display: flex;
  gap: 15px;
}

.reset-button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background: #ddd;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.reset-button:hover {
  background: #ccc;
}
</style>
