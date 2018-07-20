import { BloomingFlowers } from './animations/blooming-flowers';
import { Supplementary } from './supplementary/supplementary';
import { InteractiveFlowers } from './animations/interactive-flowers';

function main() {
  const canvas1 = <HTMLCanvasElement>document.getElementById('supplementary');
  const sup = new Supplementary(canvas1);

  const canvas2 = <HTMLCanvasElement>document.getElementById('blooming-flowers');
  const flowers1 = new BloomingFlowers(canvas2);
  flowers1.bloom();

  const canvas3 = <HTMLCanvasElement>document.getElementById('interactive-flowers');
  const flowers2 = new InteractiveFlowers(canvas3);

  const btn = document.getElementById('clearBtn');
  btn.addEventListener('click', () => {
    flowers2.clearCanvas();
  });
}

main();
