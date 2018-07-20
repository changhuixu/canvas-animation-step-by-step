import { Point } from './point';

const rad = Math.PI / 180;
const tangent = 0.2;

export class Petal {
  private readonly vertices: Point[];
  private readonly controlPoints: Point[][];

  constructor(
    public readonly centerPoint: Point,
    public readonly radius: number,
    public readonly tipSkewRatio: number,
    public readonly angleSpan: number,
    public readonly color: string
  ) {
    this.vertices = this.getVertices();
    this.controlPoints = this.getControlPoints(this.vertices);
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.beginPath();
    context.moveTo(this.centerPoint.x, this.centerPoint.y);
    context.quadraticCurveTo(
      this.controlPoints[1][1].x,
      this.controlPoints[1][1].y,
      this.vertices[1].x,
      this.vertices[1].y
    );
    context.bezierCurveTo(
      this.controlPoints[1][0].x,
      this.controlPoints[1][0].y,
      this.controlPoints[2][1].x,
      this.controlPoints[2][1].y,
      this.vertices[2].x,
      this.vertices[2].y
    );
    context.bezierCurveTo(
      this.controlPoints[2][0].x,
      this.controlPoints[2][0].y,
      this.controlPoints[3][1].x,
      this.controlPoints[3][1].y,
      this.vertices[3].x,
      this.vertices[3].y
    );
    context.quadraticCurveTo(
      this.controlPoints[3][0].x,
      this.controlPoints[3][0].y,
      this.centerPoint.x,
      this.centerPoint.y
    );
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  private getVertices(): Point[] {
    const halfAngleSpan = 0.5 * this.angleSpan * rad;
    const dx = this.radius * Math.sin(halfAngleSpan);
    const dy = this.radius * Math.cos(halfAngleSpan);
    const tipRadius = this.radius * this.tipSkewRatio;
    return [
      this.centerPoint,
      new Point(this.centerPoint.x - dx, this.centerPoint.y - dy),
      new Point(this.centerPoint.x, this.centerPoint.y - tipRadius),
      new Point(this.centerPoint.x + dx, this.centerPoint.y - dy),
      this.centerPoint
    ];
  }

  private getControlPoints(vertices: Point[]): Point[][] {
    const controlPoints: Point[][] = [];
    for (let i = 1; i < vertices.length - 1; i++) {
      const dx = (vertices[i - 1].x - vertices[i + 1].x) * tangent;
      const dy = (vertices[i - 1].y - vertices[i + 1].y) * tangent;
      controlPoints[i] = [];
      controlPoints[i].push(new Point(vertices[i].x - dx, vertices[i].y - dy));
      controlPoints[i].push(new Point(vertices[i].x + dx, vertices[i].y + dy));
    }
    return controlPoints;
  }
}
