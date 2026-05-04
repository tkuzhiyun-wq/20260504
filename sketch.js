let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

// 指定要連線的節點編號
const lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
// 第二組指定的節點編號
const outerLipIndices = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
// 右眼編號：包含 246 的內圈與包含 247 的外圈
const eyeRightInnerIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const eyeRightOuterIndices = [226, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 244];
// 左眼編號：包含 466 的內圈與包含 467 的外圈
const eyeLeftInnerIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
const eyeLeftOuterIndices = [463, 341, 256, 252, 253, 254, 339, 255, 359, 467, 260, 259, 257, 258, 286, 414];
// 臉部最外層輪廓編號
const faceOvalIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

function preload() {
  // 初始化 faceMesh 模型
  if (typeof ml5 !== 'undefined') {
    faceMesh = ml5.faceMesh(options);
  } else {
    console.error("錯誤：ml5.js 函式庫未載入，請檢查網路連線或 script 連結。");
  }
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  capture = createCapture(VIDEO);
  capture.hide();

  // 檢查 faceMesh 是否存在並開始偵測
  if (faceMesh) {
    faceMesh.detectStart(capture, gotFaces);
  } else {
    console.warn("無法啟動辨識：faceMesh 模型尚未就緒。");
  }
}

function gotFaces(results) {
  // 儲存偵測結果
  faces = results;
}

function draw() {
  // 設定背景顏色
  background('#e7c6ff');

  // 計算影像顯示的寬高（畫面的 50%）
  let displayW = width * 0.5;
  let displayH = height * 0.5;

  push();
  // 移動座標原點至畫面中心
  translate(width / 2, height / 2);
  // 關鍵：水平翻轉（X軸縮放 -1）
  scale(-1, 1);
  // 設定影像繪製模式為中心
  imageMode(CENTER);
  // 繪製影像
  image(capture, 0, 0, displayW, displayH);

  // 若偵測到臉部則開始繪圖
  if (faces.length > 0) {
    let face = faces[0];
    
    stroke('#ff0000');
    strokeWeight(1);
    noFill();

    // 依照指定的編號依序連線
    for (let i = 0; i < lipIndices.length; i++) {
      let currIdx = lipIndices[i];
      let nextIdx = lipIndices[(i + 1) % lipIndices.length]; // 最後一個點接回第一個點

      let pt1 = face.keypoints[currIdx];
      let pt2 = face.keypoints[nextIdx];

      // 將原始影像座標映射至畫布上的影像大小 (50% 寬高，置中繪製)
      let x1 = map(pt1.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y1 = map(pt1.y, 0, capture.height, -displayH / 2, displayH / 2);
      let x2 = map(pt2.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y2 = map(pt2.y, 0, capture.height, -displayH / 2, displayH / 2);

      line(x1, y1, x2, y2);
    }

    // 繪製第二組連線 (粗細為 1)
    strokeWeight(1);
    for (let i = 0; i < outerLipIndices.length; i++) {
      let currIdx = outerLipIndices[i];
      let nextIdx = outerLipIndices[(i + 1) % outerLipIndices.length];

      let pt1 = face.keypoints[currIdx];
      let pt2 = face.keypoints[nextIdx];

      let x1 = map(pt1.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y1 = map(pt1.y, 0, capture.height, -displayH / 2, displayH / 2);
      let x2 = map(pt2.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y2 = map(pt2.y, 0, capture.height, -displayH / 2, displayH / 2);

      line(x1, y1, x2, y2);
    }

    // 繪製右眼內圈 (包含編號 246)，粗細設為 1
    strokeWeight(1);
    for (let i = 0; i < eyeRightInnerIndices.length; i++) {
      let currIdx = eyeRightInnerIndices[i];
      let nextIdx = eyeRightInnerIndices[(i + 1) % eyeRightInnerIndices.length];

      let pt1 = face.keypoints[currIdx];
      let pt2 = face.keypoints[nextIdx];

      let x1 = map(pt1.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y1 = map(pt1.y, 0, capture.height, -displayH / 2, displayH / 2);
      let x2 = map(pt2.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y2 = map(pt2.y, 0, capture.height, -displayH / 2, displayH / 2);

      line(x1, y1, x2, y2);
    }

    // 繪製右眼外圈 (包含編號 247)，粗細設為 1
    for (let i = 0; i < eyeRightOuterIndices.length; i++) {
      let currIdx = eyeRightOuterIndices[i];
      let nextIdx = eyeRightOuterIndices[(i + 1) % eyeRightOuterIndices.length];

      let pt1 = face.keypoints[currIdx];
      let pt2 = face.keypoints[nextIdx];

      let x1 = map(pt1.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y1 = map(pt1.y, 0, capture.height, -displayH / 2, displayH / 2);
      let x2 = map(pt2.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y2 = map(pt2.y, 0, capture.height, -displayH / 2, displayH / 2);

      line(x1, y1, x2, y2);
    }

    // 繪製左眼內圈 (包含編號 466)，粗細設為 1
    for (let i = 0; i < eyeLeftInnerIndices.length; i++) {
      let currIdx = eyeLeftInnerIndices[i];
      let nextIdx = eyeLeftInnerIndices[(i + 1) % eyeLeftInnerIndices.length];

      let pt1 = face.keypoints[currIdx];
      let pt2 = face.keypoints[nextIdx];

      let x1 = map(pt1.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y1 = map(pt1.y, 0, capture.height, -displayH / 2, displayH / 2);
      let x2 = map(pt2.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y2 = map(pt2.y, 0, capture.height, -displayH / 2, displayH / 2);

      line(x1, y1, x2, y2);
    }

    // 繪製左眼外圈 (包含編號 467)，粗細設為 1
    for (let i = 0; i < eyeLeftOuterIndices.length; i++) {
      let currIdx = eyeLeftOuterIndices[i];
      let nextIdx = eyeLeftOuterIndices[(i + 1) % eyeLeftOuterIndices.length];

      let pt1 = face.keypoints[currIdx];
      let pt2 = face.keypoints[nextIdx];

      let x1 = map(pt1.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y1 = map(pt1.y, 0, capture.height, -displayH / 2, displayH / 2);
      let x2 = map(pt2.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y2 = map(pt2.y, 0, capture.height, -displayH / 2, displayH / 2);

      line(x1, y1, x2, y2);
    }

    // 繪製臉部最外層輪廓，粗細設為 1
    for (let i = 0; i < faceOvalIndices.length; i++) {
      let currIdx = faceOvalIndices[i];
      let nextIdx = faceOvalIndices[(i + 1) % faceOvalIndices.length];

      let pt1 = face.keypoints[currIdx];
      let pt2 = face.keypoints[nextIdx];

      let x1 = map(pt1.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y1 = map(pt1.y, 0, capture.height, -displayH / 2, displayH / 2);
      let x2 = map(pt2.x, 0, capture.width, -displayW / 2, displayW / 2);
      let y2 = map(pt2.y, 0, capture.height, -displayH / 2, displayH / 2);

      line(x1, y1, x2, y2);
    }
  }
  pop();
}

function windowResized() {
  // 當瀏覽器視窗大小改變時，重新調整畫布
  resizeCanvas(windowWidth, windowHeight);
}
