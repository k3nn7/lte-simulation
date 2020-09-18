import TWEEN from '@tweenjs/tween.js';

export async function moveToThePoint(object, destination, duration) {
  return new Promise((resolve) => {
    const position = {x: object.x, y: object.y};
    new TWEEN.Tween(position)
      .to(destination, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        object.position.set(position.x, position.y)
      })
      .onComplete(resolve)
      .start();
  });
}

export async function scaleDown(object, duration) {
  return new Promise(resolve => {
    const scale = {x: object.scale.x, y: object.scale.y};
    const destination = {x: 0.0, y: 0.0};
    new TWEEN.Tween(scale)
      .to(destination, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        object.scale.set(scale.x, scale.y);
      })
      .onComplete(resolve)
      .start();
  });
}

export async function scaleUp(object, duration) {
  return new Promise(resolve => {
    const scale = {scale: 0.0};
    const destination = {scale: 1.0};
    new TWEEN.Tween(scale)
      .to(destination, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        object.scale.set(scale.scale, scale.scale);
      })
      .onComplete(() => {
        object.activate();
        resolve();
      })
      .start();
  });
}

export async function appear(object, duration) {
  return new Promise(resolve => {
    const alpha = {alpha: object.alpha};
    const destination = {alpha: 1.0};
    new TWEEN.Tween(alpha)
      .to(destination, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        object.alpha = alpha.alpha;
      })
      .onComplete(resolve)
      .start();
  });
}

export async function disappear(object, duration) {
  return new Promise(resolve => {
    const alpha = {alpha: object.alpha};
    const destination = {alpha: 0.0};
    new TWEEN.Tween(alpha)
      .to(destination, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        object.alpha = alpha.alpha;
      })
      .onComplete(resolve)
      .start();
  });
}

export function heartbeat(object, duration = 500) {
  const scale = {scale: 1.0};
  const to = {scale: 1.3};
  return new TWEEN.Tween(scale)
    .to(to, duration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      object.scale.set(scale.scale, scale.scale)
    })
    .yoyo(true)
    .repeat(Infinity);
}

export async function quadraticTween(from, to, duration, onUpdate) {
  return new Promise(resolve => {
    new TWEEN.Tween(from)
      .to(to, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
          onUpdate(from);
        }
      )
      .onComplete(resolve)
      .start();
  });
}

export async function timeTween(onUpdate, onStart, onComplete, time) {
  const angle = {angle: -Math.PI / 2};
  const to = {angle: 1.5 * Math.PI};
  return new TWEEN.Tween(angle)
    .to(to, time)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => onUpdate(angle))
    .onStart(onStart)
    .onComplete(onComplete)
    .start();
}


