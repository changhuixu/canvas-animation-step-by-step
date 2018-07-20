import { Flower } from '../models/flower';
import { Point } from '../models/point';
import { FlowerRandomizationService } from '../services/flower-randomization.service';

export class InteractiveFlowers {
  private readonly context: CanvasRenderingContext2D;
  private readonly canvasWidth: number;
  private readonly canvasHeight: number;
  private flowers: Flower[] = [];
  private readonly randomizationService = new FlowerRandomizationService();
  private ctrlIsPressed = false;
  private mousePosition = new Point(-100, -100);

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.addShadowEffect();
    this.addInteractions();
  }

  clearCanvas() {
    this.flowers = [];
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private animateFlowers() {
    if (this.flowers.every(f => f.stopChanging)) {
      return;
    }
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.flowers.forEach(flower => {
      flower.increasePetalRadiusWithLimit();
      flower.draw(this.context);
    });
    window.requestAnimationFrame(() => this.animateFlowers());
  }

  private addInteractions() {
    this.canvas.addEventListener('click', e => {
      if (this.ctrlIsPressed) {
        this.clearCanvas();
        return;
      }
      this.calculateMouseRelativePositionInCanvas(e);
      const flower = this.randomizationService.getFlowerAt(this.mousePosition);
      this.flowers.push(flower);
      this.animateFlowers();
    });

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.which === 17 || e.keyCode === 17) {
        this.ctrlIsPressed = true;
      }
    });
    window.addEventListener('keyup', () => {
      this.ctrlIsPressed = false;
    });
  }

  private calculateMouseRelativePositionInCanvas(e: MouseEvent) {
    this.mousePosition = new Point(
      e.clientX +
        (document.documentElement.scrollLeft || document.body.scrollLeft) -
        this.canvas.offsetLeft,
      e.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop) -
        this.canvas.offsetTop
    );
  }

  private addShadowEffect() {
    this.context.shadowBlur = 5;
    this.context.shadowOffsetX = 2;
    this.context.shadowOffsetY = 2;
    this.context.shadowColor = '#333';
    this.context.globalAlpha = 0.8;
  }
}
