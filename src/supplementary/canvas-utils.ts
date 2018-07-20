import { Point } from '../models/point';

export class CanvasUtils {
  public readonly red = '#ff0a42';
  public readonly blue = '#007bff';
  public readonly green = '#00aa33';

  constructor(private readonly context: CanvasRenderingContext2D) {}

  drawPoint(point: Point, radius: number = 3, color: string = 'black') {
    this.drawDot(point.x, point.y, radius, color);
  }

  drawDot(x: number, y: number, radius: number = 3, color: string = 'black') {
    this.context.save();
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.restore();
  }

  drawDashedLineBetweenTwoPoints(p1: Point, p2: Point) {
    this.drawDashedLine(p1.x, p1.y, p2.x, p2.y);
  }

  drawDashedLine(x0: number, y0: number, x1: number, y1: number) {
    this.context.save();
    this.context.beginPath();
    this.context.setLineDash([3, 1]);
    this.context.moveTo(x0, y0);
    this.context.lineTo(x1, y1);
    this.context.strokeStyle = 'gray';
    this.context.stroke();
    this.context.restore();
  }

  writeText(
    text: string,
    x: number,
    y: number,
    color: string = 'black',
    font: string = '12px Times New Roman',
    textAlign: string = 'center'
  ) {
    this.context.save();
    this.context.font = font;
    this.context.fillStyle = color;
    this.context.textAlign = textAlign;
    this.context.fillText(text, x, y);
    this.context.restore();
  }

  drawCircle(
    center: Point,
    radius: number,
    color: string = 'black',
    startAngle: number = 0,
    endAngle: number = 360
  ) {
    const rr = Math.PI / 180;
    this.context.save();
    this.context.beginPath();
    this.context.setLineDash([1, 3]);
    this.context.strokeStyle = color;
    this.context.arc(
      center.x,
      center.y,
      radius,
      startAngle * rr,
      endAngle * rr
    );
    this.context.stroke();
    this.context.restore();
  }

  drawLabel(text: string, x: number, y: number) {
    this.drawDot(x, y, 10);
    this.writeText(text, x, y + 4, 'white');
  }
}
