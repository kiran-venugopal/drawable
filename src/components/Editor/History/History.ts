class History {
  actions: any[] = [{ background: 'white' }];
  currentIndex = 0;
  limit = 200;
  add(object: any) {
    console.log('added', object);
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
    console.log(this);
    if (this.currentIndex < this.actions.length - 1) {
      this.currentIndex++;
      return this.actions[this.currentIndex];
    }
  }
}

const history = new History();
export default history;
