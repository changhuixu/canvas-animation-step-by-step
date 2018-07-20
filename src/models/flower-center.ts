import { Point } from './point';

export class FlowerCenter {
  constructor(
    private readonly centerPoint: Point,
    private readonly centerRadius: number,
    private readonly centerColor: string
  ) {}

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.beginPath();
    context.arc(
      this.centerPoint.x,
      this.centerPoint.y,
      this.centerRadius,
      0,
      2 * Math.PI
    );
    context.fillStyle = this.centerColor;
    context.fill();
    context.restore();
  }
}
