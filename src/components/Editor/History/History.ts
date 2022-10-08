class History {
  actions: any[] = [];
  currentIndex = -1;
  limit = 200;

  clear() {
    this.actions = [];
    this.currentIndex = -1;
  }

  add(object: any) {
    this.actions.push(object);
    this.currentIndex = this.actions.length - 1;
    if (this.actions.length > this.limit) {
      this.actions.shift();
    }
  }
  undo() {
    console.log(this);
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.actions[this.currentIndex];
    }
  }
  redo() {
    if (this.currentIndex < this.actions.length - 1) {
      this.currentIndex++;
      return this.actions[this.currentIndex];
    }
  }
}

const history = new History();
export default history;
