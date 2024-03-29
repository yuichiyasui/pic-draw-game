import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

/** ターン数のカウンター */
let count = 0;

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  var drawColor = document.getElementById("draw-color");
  var drawSize = document.getElementById("draw-size");

  var canvasWrap = document.getElementById("canvas-wrap");
  //canvas-wrap(親要素)のサイズをCanvasに指定
  canvas.width = canvasWrap.clientWidth;
  canvas.height = canvasWrap.clientHeight;

  // 直前のマウスのcanvas上のx座標とy座標を記録する
  const lastPosition = { x: null, y: null };
  let isDrag = false;

  function draw(x, y) {
    if (isDrag) {
      context.lineCap = "round"; // 丸みを帯びた線にする
      context.lineJoin = "round"; // 丸みを帯びた線にする
      context.lineWidth = drawSize.value; // 線の太さ
      context.strokeStyle = drawColor.value; // 線の色
      // 書き始めは lastPosition.x, lastPosition.y の値はnullとなっているため、
      // クリックしたところを開始点としている。
      // この関数(draw関数内)の最後の2行で lastPosition.xとlastPosition.yに
      // 現在のx, y座標を記録することで、次にマウスを動かした時に、
      // 前回の位置から現在のマウスの位置まで線を引くようになる。
      if (lastPosition.x === null || lastPosition.y === null) {
        context.moveTo(x, y); // ドラッグ開始時の線の開始位置
      } else {
        context.moveTo(lastPosition.x, lastPosition.y); // ドラッグ中の線の開始位置
      }
      // context.moveToで設定した位置から、context.lineToで設定した位置までの線を引く。
      // - 開始時はmoveToとlineToの値が同じであるためただの点となる。
      // - ドラッグ中はlastPosition変数で前回のマウス位置を記録しているため、
      //   前回の位置から現在の位置までの線(点のつながり)となる
      context.lineTo(x, y);

      context.stroke(); // context.moveTo, context.lineToの値を元に実際に線を引く

      lastPosition.x = x; // 現在のマウス位置を記録して、次回線を書くときの開始点に使う
      lastPosition.y = y;
    }
  }

  function dragStart(e) {
    context.beginPath(); // これから新しい線を書き始めることを宣言する
    isDrag = true;
  }

  function dragEnd(e) {
    context.closePath();
    isDrag = false;
    lastPosition.x = null; // 描画中に記録していた値をリセットする
    lastPosition.y = null;
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const submitImage = () => {
    if (count < 8) {
      // canvasをpngへ変換
      const image = new Image();
      image.src = canvas.toDataURL("image/png");
      socket.emit("canvas", { image: image.src, count: count + 1 });
    }
  };

  socket.on("canvas", ({ image, count: newCount }) => {
    const template = document.getElementById("pic-frame-template");
    const clone = template.content.cloneNode(true);
    const picElm = clone.querySelector("[data-template=pic]");
    picElm.src = image;
    const picFrameListElm = document.getElementById("pic-frame-list");
    picFrameListElm.appendChild(clone);

    count = newCount;
    clear(); // キャンバスをクリア

    if (count >= 8) {
      alert("終了です!");
    }
  });

  canvas.addEventListener("mousedown", dragStart);
  canvas.addEventListener("mouseup", dragEnd);
  canvas.addEventListener("mouseout", dragEnd);
  canvas.addEventListener("mousemove", (e) => {
    draw(e.layerX, e.layerY);
  });
  document.getElementById("clearButton").addEventListener("click", clear);
  document
    .getElementById("submitImageButton")
    .addEventListener("click", submitImage);
});
