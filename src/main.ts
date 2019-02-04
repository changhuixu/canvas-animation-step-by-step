import { InteractiveFlowers } from './animations/interactive-flowers';

function main() {
  if (navigator.serviceWorker.controller) {
    console.log('Active service worker found, no need to register');
  } else {
    navigator.serviceWorker
      .register('sw.js', {
        scope: './'
      })
      .then(function(reg) {
        console.log(`SW has been registered for scope (${reg.scope})`);
      });
  }

  const canvas = <HTMLCanvasElement>document.getElementById('flowers');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  const flowers = new InteractiveFlowers(canvas);

  const btn = document.getElementById('clearBtn');
  btn.addEventListener('click', () => {
    flowers.clearCanvas();
  });
}

main();
