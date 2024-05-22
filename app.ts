// Importing the Express Package
import express from "express";
// Importing the "Path" Module for manipulating the files and folder within the express application
import path from "path";
// Importing the Web Socket to create the WebSocket Server.
import {Server as WebSocketServer} from "socket.io"

// Creating the instance of Express Application
const app = express();

// Defining the PORT or getting the port defined inside the Environment Variables.
const PORT = process.env.port || 3000

// Setting the Static Directory for Static Files.
// Which will be served by this middleware
app.use(express.static(path.join(__dirname,"public")));

// Defining the PORT from where the app will listen for requests and provide response.
// Note: .listen() method returns the instance of HTTP Server.
// Which will listen for HTTP Request from the specified "PORT" which we have defined in the Express Application Instance.
const server = app.listen(PORT, ()=>
{
    console.log(`Chat Server Listening on port ${PORT}`)
})

// Creating the WebSocket Server by passing the HTTP Server as an Argument.
// We do this to define the Server from here the WebSocket Server will listen
// for WebSocket Connections.
// Note: The first request for Web Socket is "HTTP Handshake Request with Upgrade Header".
const io = new WebSocketServer(server);

// Set is an Object which holds only unique Values and ignores the duplicate values.
let socketsConnected = new Set();

// As Web Socket is a "Consistent Connection" between the client and server.
// So Connection event will be "Happening all the time until the either one server and client disconnects"
// Note: Each Connected Client to WebSocket server will have "Unique ID"
// Which we can access the later
// Note:-------------------------> Socket passed as an argument to the "callback function"
// is nothing but a "Unique Connection Object" representing the unique connection for each client.
io.on("connection", function(socket)
{

    // Whenever a new user is connected this message will log the unique connection id into the console.
    console.log(socket.id + " is connected");

    // Adding the newly connected user to the Set (An Array of Unique Values and Duplicate Values are Ignored)
    socketsConnected.add(socket.id);

    // io ---> Whole Circuit
    // Socket --> A Individual Unique Connection
    // So Whenever a new user is connected then to all the connected user the size of set will be sent
    // or, We can say an event will be triggered
    io.emit("clients-total", socketsConnected.size)

    // Here we are listening for message event from individual unique connection
    // Whenever individual connection triggers and associate the data with the message event
    // Then this event handler will be executed.
    socket.on("message",(data) =>
    {
        console.log(data); // Log the user message into the console.
        // Sends the Message to all the connected user's except the one who triggered this event.
        socket.broadcast.emit("chat-message",data)
    })

    // Same as Above obe
    socket.on("feedback", (data) =>
        {
            socket.broadcast.emit("feedback",data)
        })


    // When any of the User disconnects from the server then this event handler will be executed.
    socket.on("disconnect", ()=>
    {
        // Remove the disconnected connection ID from the set.
        socketsConnected.delete(socket.id);

        // Specify which connection is terminated.
        console.log(`${socket.id} is Disconnected`); // Log the message into the console

        io.emit("clients-total", socketsConnected.size) // as well as triggers the new event which
        // Sent the new number of connected user to all the connected users.
    })
})


