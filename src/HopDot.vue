<template>
  <div class="hop-dot-app">
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
      <div 
        v-if="jumpAnimation" 
        class="jumping-dot"
        :class="{ animating: animating }"
        :style="jumpDotStyle"
      >
        {{ jumpAnimation.number }}
      </div>
      <div 
        v-if="jumpAnimation && jumpAnimation.showPoof"
        class="poof-effect"
        :style="poofStyle"
      ></div>
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
  name: 'HopDot',
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
      customResetMode: false,
      animating: false,
      jumpAnimation: null
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
    },
    /**
     * Calculates CSS styles for the jumping dot animation.
     * @returns {Object} Style object with position and color
     */
    jumpDotStyle() {
      if (!this.jumpAnimation) return {};
      
      const { fromPos, toPos, color } = this.jumpAnimation;
      
      return {
        '--from-x': `${fromPos.x}px`,
        '--from-y': `${fromPos.y}px`,
        '--to-x': `${toPos.x}px`,
        '--to-y': `${toPos.y}px`,
        background: color,
        left: `${fromPos.x}px`,
        top: `${fromPos.y}px`
      };
    },
    /**
     * Calculates CSS styles for the poof effect.
     * @returns {Object} Style object with position
     */
    poofStyle() {
      if (!this.jumpAnimation || !this.jumpAnimation.midPos) return {};
      
      const { midPos } = this.jumpAnimation;
      return {
        left: `${midPos.x}px`,
        top: `${midPos.y}px`
      };
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
      this.animating = false;
      this.jumpAnimation = null;
      this.initializeDots();
    },
    /**
     * Custom reset that sets all dots to default state and waits for user to select empty dot.
     * @returns {void}
     */
    customReset() {
      this.selectedDot = null;
      this.customResetMode = true;
      this.animating = false;
      this.jumpAnimation = null;
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
      if (this.animating) return;
      
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
        this.animating = true;
        
        const fromPos = this.getDotPosition(fromRow, fromIndex);
        const toPos = this.getDotPosition(toRow, toIndex);
        const midPos = this.getDotPosition(moves.midRow, moves.midIndex);
        const number = this.getDotNumber(fromRow, fromIndex + 1);
        
        this.jumpAnimation = {
          fromPos,
          toPos,
          midPos,
          color: this.selectedColor,
          number,
          showPoof: false
        };
        
        this.dotStates[fromRow][fromIndex] = 'empty';
        this.selectedDot = null;
        
        setTimeout(() => {
          this.animating = true;
        }, 10);
        
        setTimeout(() => {
          this.jumpAnimation.showPoof = true;
          this.dotStates[moves.midRow][moves.midIndex] = 'empty';
        }, 600);
        
        setTimeout(() => {
          this.dotStates[toRow][toIndex] = 'selected';
          this.selectedDot = { row: toRow, index: toIndex };
          this.jumpAnimation = null;
          this.animating = false;
        }, 900);
      }
    },
    /**
     * Gets the absolute position of a dot on screen.
     * @param {number} row - The zero-based row index
     * @param {number} index - The zero-based dot index
     * @returns {Object} Object with x and y coordinates
     */
    getDotPosition(row, index) {
      const rowElement = document.querySelectorAll('.triangle .row')[row];
      if (!rowElement) return { x: 0, y: 0 };
      
      const dots = rowElement.querySelectorAll('.dot');
      const dotElement = dots[index];
      if (!dotElement) return { x: 0, y: 0 };
      
      const triangleRect = document.querySelector('.triangle').getBoundingClientRect();
      const dotRect = dotElement.getBoundingClientRect();
      
      return {
        x: dotRect.left - triangleRect.left + dotRect.width / 2,
        y: dotRect.top - triangleRect.top + dotRect.height / 2
      };
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
.hop-dot-app {
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
  transform: translateY(-10vh);
  position: relative;
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
  z-index: 1000;
}

.instruction-message {
  position: absolute;
  bottom: 150px;
  font-size: 18px;
  color: #555;
  text-align: center;
}

.button-container {
  position: absolute;
  bottom: 90px;
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

.jumping-dot {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.jumping-dot.animating {
  animation: jumpAnimation 450ms cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
}

@keyframes jumpAnimation {
  0% {
    left: var(--from-x);
    top: var(--from-y);
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    left: calc((var(--from-x) + var(--to-x)) / 2);
    top: calc((var(--from-y) + var(--to-y)) / 2 - 30px);
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    left: var(--to-x);
    top: var(--to-y);
    transform: translate(-50%, -50%) scale(1);
  }
}

.poof-effect {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(211, 211, 211, 0.8) 0%, rgba(211, 211, 211, 0) 70%);
  animation: poofAnimation 300ms ease-out;
  pointer-events: none;
  z-index: 99;
}

@keyframes poofAnimation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}
</style>
