// Configuring the WebSocket at the Client Side.
// Here, io() method is used to connect to the WebSocket Server.
// By Default, it will try to connect to the same server from which the Page is loaded.
// But, we can specify the server by passing the server address as an argument to it.
// Note: Do not forget to run this "{npm install socket.io-client}" and include the CDN in main html.
//@ts-ignore
const socket = io();

// Selecting the DOM elements using the Vanilla JS.
const messageContainer  = document.getElementById('message-container')
const nameInput  = document.getElementById('name-input')
const messageForm  = document.getElementById('message-form')
const messageInput  = document.getElementById('message-input')

// Here we are creating the New Object of Audio Class as well as passing the Audio File location
// as an argument.
const messageTone = new Audio("/message_tone.mp3")

// @ts-ignore
// Binding the event handler to form's submit button
messageForm.addEventListener("submit",(e) =>
{
    e.preventDefault(); // Preventing the default form submission.

    sendMessage(); // Sends the message event to the server as well as include the method to the UI.
})


//@ts-ignore
// Binding the event listener to the message input
// Which will be executed each time user put focus on the message input field.
messageInput.addEventListener("focus", (e) =>
{
    // This will send the "feedback" event to the Websocket server
    socket.emit("feedback", {
        //@ts-ignore
        feedback: `${nameInput.value} is typing a message`
    })
})
//@ts-ignore
// Binding the event listener to the message input
// Which will be executed each time user press any keyboard key on the message input field.
messageInput.addEventListener("keypress", (e) =>
{
    // This will send the "feedback" event to the Websocket server
    socket.emit("feedback",
    {
        //@ts-ignore
        feedback: `${nameInput.value} is typing a message`
    })
})
//@ts-ignore
// Binding the event listener to the message input
// Which will be executed each time user blur the message input field.
messageInput.addEventListener("blur", (e) =>
{
    // This will send the "feedback" event to the Websocket server
    socket.emit("feedback", {
        //@ts-ignore
        feedback: ``
    })
})

// Defining an event listener for "chat-message" event from the server (Web Socket Server)
// Which will be executed each time the server triggers that event.
socket.on("chat-message", async (data:any) =>
{
    console.log(data) // Write the data into the console.
    await messageTone.play(); // using the await sync (For Asynchronous Tasks) and playing the tune each time the
    // event listener is triggered/
    addMessageToUI(false,data); // Adding the message to the UI to the left-side.
})

// Defining an event listener for "client-totals" event from the server and
// update the total number of connected users dynamically
socket.on("clients-total",(data:any) =>
{
    console.log(data) // Log the message into the console.
    // @ts-ignore
    document.querySelector("#clients-total").innerHTML = `Total Clients: ${data}`;
})

// Defining an event listener for "feedback" event from the WebSocket Server
socket.on("feedback",(data:any)=>
{
    clearFeedback() // Clear the previous feedback/Message who is typing.

    // and append the new message data received from the server.
    const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>`

    //@ts-ignore
    messageContainer.innerHTML += element;

})

// This method will remove all the "li" tags consisting of Class "message-feedback" from the message container.
function clearFeedback()
{
    document.querySelectorAll("li.message-feedback").forEach(element =>
    {
        //@ts-ignore
        element.parentNode.removeChild(element)
    })
}

/**
 * This message will send the "message" event to the server as well as add the message to the UI.
 */
function sendMessage()
{
    // @ts-ignore
    console.log(messageInput.value)


    const data = {
        //@ts-ignore
        name: nameInput.value,
        //@ts-ignore
        message: messageInput.value,
        dateTime : new Date()
    }

    socket.emit("message",data)

    addMessageToUI(true, data) // add Own Message to the UI on right-side

    //@ts-ignore
    messageInput.value = ""; // Clear the input field.
}

/**
 * This method adds the new message to the UI as well as take arguments which specify what type of message is this.
 * @param isOwnMessage Define the type of message
 * @param data Data for message
 */
function addMessageToUI(isOwnMessage:any, data:any)
{
    clearFeedback() // Clear's the feedback before adding the message to the UI
    // @ts-ignore
    const element = ` 
            <li class="message-${isOwnMessage ? "right": "left"}">
                <p class="message">
                    ${data.message}
                    <!--
                        Here, the moment.js is a package which is used for time and data showing purposes
                        So here it is getting the time passed from the time now
                    -->
                    <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>`;


    // @ts-ignore
    messageContainer.innerHTML += element; // Append the new message
}

