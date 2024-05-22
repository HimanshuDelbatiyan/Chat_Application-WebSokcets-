"use strict";
const socket = io();
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio("/message_tone.mp3");
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});
messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback", {
        feedback: `${nameInput.value} is typing a message`
    });
});
messageInput.addEventListener("keypress", (e) => {
    socket.emit("feedback", {
        feedback: `${nameInput.value} is typing a message`
    });
});
messageInput.addEventListener("blur", (e) => {
    socket.emit("feedback", {
        feedback: ``
    });
});
socket.on("chat-message", async (data) => {
    console.log(data);
    await messageTone.play();
    addMessageToUI(false, data);
});
socket.on("clients-total", (data) => {
    console.log(data);
    document.querySelector("#clients-total").innerHTML = `Total Clients: ${data}`;
});
socket.on("feedback", (data) => {
    clearFeedback();
    const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>`;
    messageContainer.innerHTML += element;
});
function clearFeedback() {
    document.querySelectorAll("li.message-feedback").forEach(element => {
        element.parentNode.removeChild(element);
    });
}
function sendMessage() {
    console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    };
    socket.emit("message", data);
    addMessageToUI(true, data);
    messageInput.value = "";
}
function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = ` 
            <li class="message-${isOwnMessage ? "right" : "left"}">
                <p class="message">
                    ${data.message}
                    <!--
                        Here, the moment.js is a package which is used for time and data showing purposes
                        So here it is getting the time passed from the time now
                    -->
                    <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>`;
    messageContainer.innerHTML += element;
}
//# sourceMappingURL=main.js.map