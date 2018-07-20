import { CanvasUtils } from './canvas-utils';
import { Point } from '../models/point';

const t = 0.2;
const rad = Math.PI / 180;

export class PetalShape {
  private readonly utils: CanvasUtils;
  private centerPoint = new Point(100, 280);
  private petalRadius = 200;
  private petalTipSkewRatio = 1.2;
  private petalAngleSpan = 50;

  constructor(private readonly context: CanvasRenderingContext2D) {
    this.utils = new CanvasUtils(this.context);
  }

  draw() {
    this.utils.drawDashedLineBetweenTwoPoints(
      this.centerPoint,
      new Point(100, 40)
    );
    this.utils.drawCircle(
      this.centerPoint,
      this.petalRadius,
      'black',
      -(90 + 0.5 * this.petalAngleSpan),
      -(90 - 0.5 * this.petalAngleSpan)
    );

    const vs = this.getVertices();
    const cps = this.controlPoints(vs); // the control points array
    cps.forEach(x => this.utils.drawDashedLineBetweenTwoPoints(x[0], x[1]));
    this.context.beginPath();
    this.context.moveTo(this.centerPoint.x, this.centerPoint.y);
    // the first & the last curve are quadratic Bezier
    // because I'm using push(), pc[i][1] comes before pc[i][0]
    this.context.strokeStyle = this.utils.green;
    this.context.quadraticCurveTo(cps[1][1].x, cps[1][1].y, vs[1].x, vs[1].y);
    this.context.stroke();

    // central curves are cubic Bezier
    this.context.beginPath();
    this.context.moveTo(vs[1].x, vs[1].y);
    this.context.strokeStyle = this.utils.blue;
    this.context.bezierCurveTo(
      cps[1][0].x,
      cps[1][0].y,
      cps[2][1].x,
      cps[2][1].y,
      vs[2].x,
      vs[2].y
    );
    this.context.bezierCurveTo(
      cps[2][0].x,
      cps[2][0].y,
      cps[3][1].x,
      cps[3][1].y,
      vs[3].x,
      vs[3].y
    );
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(vs[3].x, vs[3].y);
    // the first & the last curve are quadratic Bezier
    this.context.strokeStyle = this.utils.green;
    this.context.quadraticCurveTo(
      cps[3][0].x,
      cps[3][0].y,
      this.centerPoint.x,
      this.centerPoint.y
    );
    this.context.stroke();
  }

  getVertices() {
    const vs: Point[] = [this.centerPoint];
    const halfAngleSpan = 0.5 * this.petalAngleSpan;
    const dx = this.petalRadius * Math.sin(halfAngleSpan * rad);
    const dy = this.petalRadius * Math.cos(halfAngleSpan * rad);
    vs.push(new Point(this.centerPoint.x - dx, this.centerPoint.y - dy));

    const petalTipLength = this.petalRadius * this.petalTipSkewRatio;
    vs.push(new Point(this.centerPoint.x, this.centerPoint.y - petalTipLength));

    vs.push(new Point(this.centerPoint.x + dx, this.centerPoint.y - dy));

    vs.push(this.centerPoint);
    vs.forEach(p => this.utils.drawPoint(p, 3, this.utils.red));
    return vs;
  }

  controlPoints(p: Point[]) {
    const pc: Point[][] = [];
    for (let i = 1; i < p.length - 1; i++) {
      const dx = p[i - 1].x - p[i + 1].x;
      const dy = p[i - 1].y - p[i + 1].y;
      pc[i] = [];
      pc[i].push(new Point(p[i].x - dx * t, p[i].y - dy * t));
      pc[i].push(new Point(p[i].x + dx * t, p[i].y + dy * t));
      pc[i].forEach(cp => this.utils.drawPoint(cp, 3, this.utils.blue));
    }
    return pc;
  }
}
