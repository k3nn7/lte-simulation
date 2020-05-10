import TWEEN from "@tweenjs/tween.js";

export async function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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

export async function swallow(object, duration) {
  return new Promise(resolve => {
    const scale = {scale: 1.0};
    const destination = {scale: 0.0};
    new TWEEN.Tween(scale)
      .to(destination, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        object.scale.set(scale.scale, scale.scale);
      })
      .onComplete(resolve)
      .start();
  });
}

export async function spit(object, duration) {
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
    const alpha = {alpha: 0.0};
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

export async function changeSize(object, destination, duration) {
  return new Promise(resolve => {
    const size = {width: object.width, height: object.height};
    new TWEEN.Tween(size)
      .to(destination, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        object.width = size.width;
        object.height = size.height;
      })
      .onComplete(resolve)
      .start();
  });
}
