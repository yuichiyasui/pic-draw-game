import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", function () {
  /** チャット関連 */
  var player2CommentList = document.getElementById("player2-comment");
  player2CommentList.classList.add("list-unstyled");
  var player2CommentForm = document.getElementById("player2-input-comment");

  // socket.io
  const socket = io();

  document
    .getElementById("player2-comment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      socket.emit("chat2", player2CommentForm.value);
      player2CommentForm.value = "";
    });

  socket.on("chat2", function (msg) {
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
      "message",
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
    player2CommentList.appendChild(li);
    player2CommentList.scrollTop = player2CommentList.scrollHeight; // 一番下までスクロール
  });

  /** 以下名前変更関連 */

  function showNameEdit() {
    var showplayer2NameEdit = document.getElementById("player2-name-edit-form");
    var visibility = showplayer2NameEdit.style.visibility;
    if (visibility === "hidden") {
      showplayer2NameEdit.style.visibility = "visible";
    } else {
      showplayer2NameEdit.style.visibility = "hidden";
    }
  }

  function player2NameEdit(e) {
    e.preventDefault();
    var player2NameForm = document.getElementById("player2-input-name");
    socket.emit("nameEdit2", player2NameForm.value);

    player2NameForm.value = "";
    showNameEdit();
  }

  socket.on("nameEdit2", function (param) {
    document.getElementById("player2-name").textContent = param;
  });

  document
    .getElementById("show-player2-name-edit")
    .addEventListener("click", showNameEdit);
  document
    .getElementById("player2-name-edit-form")
    .addEventListener("submit", player2NameEdit);
});
