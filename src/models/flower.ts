import { Petal } from './petal';
import { FlowerCenter } from './flower-center';

export class Flower {
  private readonly originalPetalRadius: number;
  public stopChanging = false;

  constructor(
    private readonly flowerCenter: FlowerCenter,
    private readonly numberOfPetals: number,
    private petal: Petal
  ) {
    this.originalPetalRadius = this.petal.radius;
  }

  draw(context: CanvasRenderingContext2D) {
    this.drawPetals(context);
    this.flowerCenter.draw(context);
  }

  increasePetalRadius() {
    this.petal = new Petal(
      this.petal.centerPoint,
      this.petal.radius + 0.2,
      this.petal.tipSkewRatio,
      this.petal.angleSpan,
      this.petal.color
    );
  }

  increasePetalRadiusWithLimit() {
    if (this.petal.radius < this.originalPetalRadius + 20) {
      this.stopChanging = false;
      this.increasePetalRadius();
    } else {
      this.stopChanging = true;
    }
  }

  private drawPetals(context: CanvasRenderingContext2D) {
    context.save();
    const rotateAngle = (2 * Math.PI) / this.numberOfPetals;
    for (let i = 0; i < this.numberOfPetals; i++) {
      context.translate(this.petal.centerPoint.x, this.petal.centerPoint.y);
      context.rotate(rotateAngle);
      context.translate(-this.petal.centerPoint.x, -this.petal.centerPoint.y);
      this.petal.draw(context);
    }
    context.restore();
  }
}
