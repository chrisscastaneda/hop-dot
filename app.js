const { createApp } = Vue;

const DotComponent = {
  template: '#dot-template',
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

createApp({
  components: {
    DotComponent
  },
  template: `<DotComponent />`
}).mount('#app');
