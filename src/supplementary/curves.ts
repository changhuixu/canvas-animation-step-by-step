import { CanvasUtils } from './canvas-utils';

export class Curves {
  private readonly context: CanvasRenderingContext2D;
  private readonly utils: CanvasUtils;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext('2d');
    this.utils = new CanvasUtils(this.context);
  }

  drawQuadraticCurve() {
    this.context.beginPath();
    this.context.moveTo(20, 20);
    this.context.quadraticCurveTo(20, 100, 200, 20);
    this.context.stroke();

    this.utils.drawDot(20, 20, 3, this.utils.red);
    this.utils.writeText('(20, 20)', 24, 14);
    this.utils.drawDot(20, 100, 3, this.utils.blue);
    this.utils.writeText('(20, 100)', 24, 114);
    this.utils.drawDot(200, 20, 3, this.utils.green);
    this.utils.writeText('(200, 20)', 200, 14);

    this.utils.drawDashedLine(20, 20, 20, 100);
    this.utils.drawDashedLine(20, 100, 200, 20);
  }

  drawBezierCurve() {
    this.context.beginPath();
    this.context.moveTo(20, 20);
    this.context.bezierCurveTo(20, 100, 200, 100, 200, 20);
    this.context.stroke();

    this.utils.drawDot(20, 20, 3, this.utils.red);
    this.utils.writeText('(20, 20)', 24, 14);
    this.utils.drawDot(20, 100, 3, this.utils.blue);
    this.utils.writeText('(20, 100)', 24, 114);
    this.utils.drawDot(200, 100, 3, this.utils.blue);
    this.utils.writeText('(200, 100)', 200, 114);
    this.utils.drawDot(200, 20, 3, this.utils.green);
    this.utils.writeText('(200, 20)', 200, 14);

    this.utils.drawDashedLine(20, 20, 20, 100);
    this.utils.drawDashedLine(20, 100, 140, 78);
    this.utils.drawDashedLine(200, 100, 200, 20);
    this.utils.drawDashedLine(200, 100, 80, 78);
  }
}
