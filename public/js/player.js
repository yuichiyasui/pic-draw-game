import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js";

dayjs.locale("ja");
const socket = io();

/**
 * プレイヤー名の変更フォームを開閉する
 *
 * @param {string} playerId
 */
const togglePlayerNameForm = (playerId) => {
  const playerNameEditForm = document.getElementById(
    `player${playerId}-name-edit-form`,
  );
  const visibility = playerNameEditForm.style.visibility;
  if (visibility === "hidden") {
    playerNameEditForm.style.visibility = "visible";
  } else {
    playerNameEditForm.style.visibility = "hidden";
  }
};

/**
 * プレイヤー名を変更する
 *
 * @param {*} event
 */
const changePlayerName = (event) => {
  event.preventDefault();
  const playerName = event.target.playerName.value;
  const playerId = event.target.playerId.value;
  socket.emit(`nameEdit${playerId}`, playerName);

  event.target.playerName.value = "";
  togglePlayerNameForm(playerId);
};

/**
 * コメントを送信する
 *
 * @param {*} event
 */
const sendComment = (event) => {
  event.preventDefault();
  const comment = event.target.comment.value;
  const playerId = event.target.playerId.value;
  socket.emit(`chat${playerId}`, comment);
  event.target.comment.value = "";
};

/**
 * 現在時間を取得する
 * @returns {string} HH:mm
 */
const getCurrentTime = () => {
  return dayjs().format("HH:mm");
};

/**
 * コメントの要素を作成する
 *
 * @param {string} comment コメント
 * @param {string} playerId プレイヤーID
 * @returns {Element} コメントの要素
 */
const createCommentElement = (comment, playerId) => {
  const template = document.getElementById("comment-template");
  const clone = template.content.cloneNode(true);
  clone.querySelector("[data-template=comment]").textContent = comment;
  clone.querySelector("[data-template=time]").textContent = getCurrentTime();

  return clone;
};

/**
 * プレイヤーの初期化
 *
 * @param {string} playerId
 */
const init = (playerId) => {
  document
    .getElementById(`player${playerId}-name-edit-form`)
    .addEventListener("submit", changePlayerName);
  document
    .getElementById(`show-player${playerId}-name-edit`)
    .addEventListener("click", () => togglePlayerNameForm(playerId));
  socket.on(`nameEdit${playerId}`, (playerName) => {
    document.getElementById(`player${playerId}-name`).textContent = playerName;
  });

  document
    .getElementById(`player${playerId}-comment-form`)
    .addEventListener("submit", sendComment);
  socket.on(`chat${playerId}`, (comment) => {
    const elm = createCommentElement(comment, playerId);
    const playerCommentList = document.getElementById(
      `player${playerId}-comment`,
    );
    playerCommentList.appendChild(elm);
    playerCommentList.scrollTop = playerCommentList.scrollHeight; // 一番下までスクロール
  });
};

document.addEventListener("DOMContentLoaded", () => {
  init("1");
  init("2");
});
