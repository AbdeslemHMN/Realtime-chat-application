import { io } from "socket.io-client";

//@test to connect a 10 users the disconnect them after 30 seconds


// Function to create a socket connection for a user
function createUserConnection(userId) {
    const socket = io("http://localhost:5000", {
        query: {
            userId: userId
        }
    });
    socket.on("connect", () => {
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });

    socket.on("connect_error", (err) => {
        console.error(`User ${userId} connection error:`, err.message);
    });

    socket.on("getOnlineUsers", (users) => {
        console.log(`User ${userId} received online users update:`, users);
    });

    return socket;
}

// Create 10 user connections
const sockets = [];
for (let i = 1; i <= 10; i++) {
    const userId = `test-user-${i}`;
    const socket = createUserConnection(userId);
    sockets.push({ userId, socket });
}

// Disconnect all users after 30 seconds
setTimeout(() => {
    console.log("\nDisconnecting all users...");
    sockets.forEach(({ userId, socket }) => {
        console.log(`Disconnecting user ${userId}`);
        socket.disconnect();
    });
    console.log("All users disconnected");
}, 30000);

console.log("Script started - 10 users connecting to Socket.IO server");
console.log("Will disconnect after 30 seconds...");