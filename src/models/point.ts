export class Point {
  constructor(public readonly x = 0, public readonly y = 0) {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  }
}
