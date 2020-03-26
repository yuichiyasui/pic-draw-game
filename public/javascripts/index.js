document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  var player1Comment = document.getElementById("player1-comment");
  var player1CommentForm = document.getElementById("player1CommentForm");

  // socket.io
  var socketio = io.connect("http://localhost:3000");
  socketio.on("chat", function(msg) {
    player1Comment.textContent = msg;
  });

  var player1Color = document.getElementById("player1-color");
  var player1Size = document.getElementById("player1-size");

  var canvasWrap = document.getElementById("canvas-wrap");
  //canvas-wrap(親要素)のサイズをCanvasに指定
  canvas.width = canvasWrap.clientWidth;
  canvas.height = canvasWrap.clientHeight;

  // 描画された画像を保持する配列
  var images = [];

  // 直前のマウスのcanvas上のx座標とy座標を記録する
  const lastPosition = { x: null, y: null };
  let isDrag = false;

  function draw(x, y) {
    if (isDrag) {
      context.lineCap = "round"; // 丸みを帯びた線にする
      context.lineJoin = "round"; // 丸みを帯びた線にする
      context.lineWidth = player1Size.value; // 線の太さ
      context.strokeStyle = player1Color.value; // 線の色
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

  function submitImage() {
    if (images.length < 8) {
      // canvasをpngへ変換
      var image = new Image();
      image.src = canvas.toDataURL("image/png");
      var pic = document.getElementById("pic" + String(images.length + 1));
      pic.src = image.src;

      // imageを表示する
      var picframe = document.getElementById(
        "picframe" + String(images.length + 1)
      );
      picframe.style.visibility = "visible";

      images.push(image); // 配列にimageを追加
      clear(); // キャンバスをクリア
    }
    if (images.length >= 8) {
      alert("終了です!");
    }
  }

  function showNameEdit() {
    var showPlayer1NameEdit = document.getElementById("player1-name-edit");
    var visibility = showPlayer1NameEdit.style.visibility;
    if (visibility === "hidden") {
      showPlayer1NameEdit.style.visibility = "visible";
    } else {
      showPlayer1NameEdit.style.visibility = "hidden";
    }
  }

  function player1NameEdit() {
    var player1NameForm = document.getElementById("player1-name-form");
    document.getElementById("player1-name").textContent = player1NameForm.value;
    player1NameForm.value = "";
    showNameEdit();
  }

  canvas.addEventListener("mousedown", dragStart);
  canvas.addEventListener("mouseup", dragEnd);
  canvas.addEventListener("mouseout", dragEnd);
  canvas.addEventListener("mousemove", e => {
    draw(e.layerX, e.layerY);
  });
  document.getElementById("clearButton").addEventListener("click", clear);
  document
    .getElementById("submitImageButton")
    .addEventListener("click", submitImage);
  document
    .getElementById("show-player1-name-edit")
    .addEventListener("click", showNameEdit);
  document
    .getElementById("player1-name-edit-button")
    .addEventListener("click", player1NameEdit);
  document
    .getElementById("player1CommentButton")
    .addEventListener("click", function(e) {
      e.preventDefault();
      socketio.emit("chat", player1CommentForm.value);
      player1CommentForm.value = "";
    });
});
