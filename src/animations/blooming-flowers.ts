import { Flower } from '../models/flower';
import { FlowerRandomizationService } from '../services/flower-randomization.service';

export class BloomingFlowers {
  private readonly context: CanvasRenderingContext2D;
  private readonly canvasWidth: number;
  private readonly canvasHeight: number;
  private readonly flowers: Flower[] = [];
  private readonly randomizationService = new FlowerRandomizationService();
  private raf = 0;
  private stopAnimation = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly nFlowers: number = 30
  ) {
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.addShadowEffect();
    this.getFlowers();
  }

  bloom() {
    this.raf = window.requestAnimationFrame(() => this.animateFlowers());
    window.setTimeout(() => {
      if (this.raf) {
        window.cancelAnimationFrame(this.raf);
        this.stopAnimation = true;
      }
      console.log('cancelAnimationFrame');
    }, 5000);
  }

  private animateFlowers() {
    if (this.stopAnimation) {
      return;
    }
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.flowers.forEach(flower => {
      flower.increasePetalRadius();
      flower.draw(this.context);
    });
    window.requestAnimationFrame(() => this.animateFlowers());
  }

  private getFlowers() {
    for (let i = 0; i < this.nFlowers; i++) {
      const flower = this.randomizationService.getFlowerOnCanvas(
        this.canvasWidth,
        this.canvasHeight
      );
      this.flowers.push(flower);
    }
  }

  private addShadowEffect() {
    this.context.shadowBlur = 5;
    this.context.shadowOffsetX = 2;
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = '#333';
    this.context.globalAlpha = 0.8;
  }
}
