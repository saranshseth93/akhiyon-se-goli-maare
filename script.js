window.saveDataAcrossSessions = true;

const LEFT_CUT_OFF = window.innerWidth / 4;
const RIGHT_CUT_OFF = window.innerWidth - window.innerWidth / 4;
const LOOK_DELAY = 1000; // 1 second

let imgElem = getNewImage();
let nextImg = getNewImage(true);
let startLookTime = Number.POSITIVE_INFINITY;
let lookDirection = null;

webgazer
  .setGazeListener((data, timestamp) => {
    if (data == null || lookDirection === "STOP") return;

    if (
      data.x < LEFT_CUT_OFF &&
      lookDirection !== "LEFT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp;
      lookDirection = "LEFT";
    } else if (
      data.x > RIGHT_CUT_OFF &&
      lookDirection !== "RIGHT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp;
      lookDirection = "RIGHT";
    } else if (data.x >= LEFT_CUT_OFF && data.x <= RIGHT_CUT_OFF) {
      startLookTime = Number.POSITIVE_INFINITY;
      lookDirection = null;
    }

    if (startLookTime + LOOK_DELAY < timestamp) {
      if (lookDirection === "LEFT") {
        imgElem.classList.add("left");
      } else {
        imgElem.classList.add("right");
      }

      startLookTime = Number.POSITIVE_INFINITY;
      lookDirection = "STOP";

      setTimeout(() => {
        imgElem.remove();
        nextImg.classList.remove("next");
        imgElem = nextImg;
        nextImg = getNewImage(true);
        lookDirection = "RESET";
      }, 200);
    }
  })
  .begin();

webgazer.showVideoPreview(false).showPredictionPoints(false);

function getNewImage(next = false) {
  const img = document.createElement("img");
  img.src = "https://picsum.photos/1000?" + Math.random();

  if (next) {
    img.classList.add("next");
  }

  document.body.append(img);
  return img;
}
