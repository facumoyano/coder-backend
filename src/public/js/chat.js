const socket = io();

let user = null;
let messageInput = document.querySelector("#message");
let form = document.querySelector("#messageForm");

Swal.fire({
  title: "Welcome!",
  text: "Enter your user e-mail",
  input: "email",
  inputAttributes: {
    autocapitalize: "off",
  },
  inputValidator: (value) => {
    if (!value) {
      return "You need to enter an email.";
    }
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

form.addEventListener("submit", (e) => {
 
    e.preventDefault(); 
    if (messageInput.value.trim().length > 0) {
      socket.emit("message", { user, message: messageInput.value });
      messageInput.value = ""; 
    }
  
});

socket.on("messageLogs", (messages) => {
    const messagesContainer = document.querySelector(".messages");
    messagesContainer.innerHTML = "";
    messages.forEach((message) => {
        const messageElement = document.createElement("div");
        const timestamp = new Date(message.timestamp).toLocaleTimeString();
        messageElement.innerHTML = `<b>${message.user} (${timestamp}):</b> ${message.message}`;
        messagesContainer.appendChild(messageElement);
    });
});
