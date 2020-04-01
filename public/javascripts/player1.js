document.addEventListener("DOMContentLoaded", function() {
  /** チャット関連 */
  var player1CommentList = document.getElementById("player1-comment");
  player1CommentList.classList.add("list-unstyled");
  var player1CommentForm = document.getElementById("player1-input-comment");

  // socket.io
  var socketio = io.connect("http://localhost:3000");

  document
    .getElementById("player1-comment-form")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      socketio.emit("chat1", player1CommentForm.value);
      player1CommentForm.value = "";
    });

  socketio.on("chat1", function(msg) {
    var li = document.createElement("li");
    var div = document.createElement("div");
    var span = document.createElement("small");
    div.appendChild(document.createTextNode(msg));
    div.classList.add(
      "alert",
      "alert-light",
      "rounded-pill",
      "shadow-sm",
      "mr-2",
      "message"
    );
    li.appendChild(div);
    var date = new Date();
    var outputDate;
    if (date.getMinutes() < 10) {
      outputDate = String(date.getHours()) + ":0" + String(date.getMinutes());
    } else {
      outputDate = String(date.getHours()) + ":" + String(date.getMinutes());
    }
    span.appendChild(document.createTextNode(outputDate));
    span.classList.add("text-secondary");
    li.appendChild(span);
    player1CommentList.appendChild(li);
    player1CommentList.scrollTop = player1CommentList.scrollHeight; // 一番下までスクロール
  });

  /** 以下名前変更関連 */

  function showNameEdit() {
    var showPlayer1NameEdit = document.getElementById("player1-name-edit-form");
    var visibility = showPlayer1NameEdit.style.visibility;
    if (visibility === "hidden") {
      showPlayer1NameEdit.style.visibility = "visible";
    } else {
      showPlayer1NameEdit.style.visibility = "hidden";
    }
  }

  function player1NameEdit(e) {
    e.preventDefault();
    var player1NameForm = document.getElementById("player1-input-name");
    socketio.emit("nameEdit1", player1NameForm.value);
    socketio.on("nameEdit1", function(param) {
      document.getElementById("player1-name").textContent = param;
    });
    player1NameForm.value = "";
    showNameEdit();
  }
  document
    .getElementById("show-player1-name-edit")
    .addEventListener("click", showNameEdit);
  document
    .getElementById("player1-name-edit-form")
    .addEventListener("submit", player1NameEdit);
});
