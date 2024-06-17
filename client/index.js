const socket = io("http://localhost:5000");

const messageForm = document.querySelector(".chatbox form");
const messageList = document.querySelector("#messagelist");
const userList = document.querySelector("ul#users");
const chatBoxInput = document.querySelector(".chatbox input");
const userAddForm = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const userAddInput = document.querySelector(".modal input");

const messages = [];
let user = [];

// SOCKET LISTENERS
socket.on("message_client", (message) => {
  messages.push(message);
  updateMessages();
});

socket.on("users", (_users) => {
  users = _users;
  updateUsers();
});

// EVENT LISTENERS
messageForm.addEventListener("submit", messageSubmitHandler);
userAddForm.addEventListener("submit", userAddHandler);

// FUNCTIONS
function messageSubmitHandler(e) {
  e.preventDefault();
  let message = chatBoxInput.value;

  if (!message) {
    return alert("Message must not be empty");
  }

  socket.emit("message", message);

  chatBoxInput.value = "";
}

function updateMessages() {
  messageList.textContent = "";

  for (let i = 0; i < messages.length; i++) {
    messageList.innerHTML += `<li>
      <p>${messages[i].user}</p>
      <p>${messages[i].message}</p>
    </li>`;
  }
}

function updateUsers() {
  userList.textContent = "";

  for (let i = 0; i < users.length; i++) {
    let node = document.createElement("li");
    let textNode = document.createTextNode(users[i]);
    node.appendChild(textNode);
    userList.appendChild(node);
  }
}

function userAddHandler(e) {
  e.preventDefault();

  let username = userAddInput.value;

  if (!username) {
    return alert("You must add a username");
  }

  socket.emit("addUser", username);

  userAddForm.classList.add("disappear");
  backdrop.classList.add("disappear");
}
