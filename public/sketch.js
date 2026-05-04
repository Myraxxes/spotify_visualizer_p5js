let img;
let prevImg = null;

let seed = 0;

let transitionProgress = 1;
let transitionSpeed = 0.03;

// Load song cover image

function setImage(url, track = null) {
  loadImage(url, (loaded) => {

    prevImg = img;
    img = loaded;

    transitionProgress = 0;

    // generate a unique "seed" for visuals
    if (track) {
      seed = hash(track.id || track.name);

      // seed the randomness systems so visuals stay consistent per song
      randomSeed(seed);
      noiseSeed(seed);
    }
  });
}

// Simple hash function:
// converts a string (song name / id) into a consistent number
function hash(str) {
  let h = 0;

  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
  }

  return Math.abs(h);
}

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("canvas-wrapper");

  imageMode(CENTER);
}

function draw() {
  background(0);

  if (!img) {
    fill(255);
    textAlign(CENTER, CENTER);
    text("No image loaded", width / 2, height / 2);
    return;
  }

  // visual parameters derived from seed
  let glitchStrength = map((seed % 100), 0, 100, 5, 40);
  let sliceHeight = map((seed % 50), 0, 50, 2, 10);
  let speed = map((seed % 80), 0, 80, 0.01, 0.06);

  let mode = seed % 3; // changes glitch "style"
  let direction = (seed % 2 === 0) ? 1 : -1;

  // color palette derived from seed (unique per song)
  let r = (seed * 3) % 255;
  let g = (seed * 7) % 255;
  let b = (seed * 11) % 255;

  let scaleFactor = 1.1;
  let w = width * scaleFactor;
  let h = height * scaleFactor;

  // Base image + transition

  noTint();

  if (prevImg && transitionProgress < 1) {

    // smooth easing so fade doesn't feel robotic
    let t = constrain(transitionProgress, 0, 1);
    let eased = t * t * (3 - 2 * t);

    push();

    // fade out old image
    tint(255, 220 * (1 - eased));
    image(prevImg, width / 2, height / 2, w, h);

    // fade in new image
    tint(255, 220 * eased);
    image(img, width / 2, height / 2, w, h);

    pop();

    transitionProgress += transitionSpeed;
    transitionProgress = constrain(transitionProgress, 0, 1);

  } else {
    // normal render (slightly dimmed for consistency across images)
    tint(255, 220);
    image(img, width / 2, height / 2, w, h);
    noTint();
  }

  let effectAlpha = min(1, transitionProgress * 1.5);

  // Glitch Layer

  push();

  translate(sin(frameCount * 0.02) * 15, 0);

  tint(255, 120 * effectAlpha);

  for (let y = 0; y < height; y += sliceHeight + 2) {

    // noise-based horizontal distortion per slice
    let offset = noise(y * 0.02, frameCount * speed * 0.3) * glitchStrength;

    // different glitch styles
    if (mode === 0) offset *= 0.4;

    if (mode === 1 && random() < 0.02) {
      offset += random(-50, 50);
    }

    if (mode === 2) offset *= 1.3;

    offset *= direction;

    // draw sliced sections of the image with offsets
    copy(
      img,
      0, y, width, sliceHeight,
      offset, y, width, sliceHeight
    );
  }

  pop();

  // Color layer

  let flicker = sin(frameCount * 0.05) * 20;

  blendMode(SCREEN);

  tint(r, g, b, 80 * effectAlpha);
  image(img, width / 2 + flicker * 0.6, height / 2, w, h);

  tint(255, 60 * effectAlpha);
  image(img, width / 2 - flicker * 0.6, height / 2, w, h);

  noTint();
  blendMode(BLEND);
}