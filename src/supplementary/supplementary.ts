import { Curves } from './curves';
import { Point } from '../models/point';
import { CanvasUtils } from './canvas-utils';
import { PetalShape } from './petal-shape';
import { Petal } from '../models/petal';
import { Flower } from '../models/flower';
import { FlowerCenter } from '../models/flower-center';

export class Supplementary {
  private readonly context: CanvasRenderingContext2D;
  private readonly utils: CanvasUtils;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext('2d');
    this.utils = new CanvasUtils(this.context);

    this.context.save();
    this.recapOfCanvasCurves();
    this.context.restore();

    this.context.save();
    this.context.translate(20, 110);
    const petalShape = new PetalShape(this.context);
    petalShape.draw();
    this.context.restore();

    this.context.save();
    this.context.translate(200, 110);
    const petal = new Petal(new Point(160, 280), 200, 1.2, 50, 'pink');
    petal.draw(this.context);
    this.context.restore();

    this.context.save();
    this.context.translate(20, 300);
    const petal1 = new Petal(new Point(100, 200), 60, 1.2, 75, '#ff1493');
    const center1 = new FlowerCenter(new Point(100, 200), 20, '#ff5a02');
    const flower1 = new Flower(center1, 4, petal1);
    flower1.draw(this.context);
    this.context.restore();

    this.context.save();
    this.context.translate(220, 300);
    this.context.shadowBlur = 5;
    this.context.shadowOffsetX = 2;
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = '#333';
    this.context.globalAlpha = 0.85;
    const petal2 = new Petal(new Point(140, 200), 60, 1.2, 75, '#ff1493');
    const center2 = new FlowerCenter(new Point(140, 200), 20, '#ff5a02');
    const flower2 = new Flower(center2, 4, petal2);
    flower2.draw(this.context);
    this.context.restore();

    this.utils.drawLabel('1', 120, 120);
    this.utils.drawLabel('2', 360, 120);
    this.utils.drawLabel('3', 120, 410);
    this.utils.drawLabel('4', 360, 410);
    this.utils.drawLabel('5', 120, 585);
    this.utils.drawLabel('6', 360, 585);
  }

  recapOfCanvasCurves() {
    const curves = new Curves(this.canvas);
    this.context.save();
    curves.drawQuadraticCurve();
    this.context.restore();

    this.context.save();
    this.context.translate(250, 0);
    curves.drawBezierCurve();
    this.context.restore();
  }
}
