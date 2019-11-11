const screenW = window.screen.width,
      screen = window.screen.height;

let ratio = Math.pow(screenW * screenH / 1600 / 900, 1 / 3);

let ratioMarkPoint = 1;

if(screenW > 5000) {
    ratioMarkPoint = 1.3;
}

export { ratio, ratioMarkPoint }