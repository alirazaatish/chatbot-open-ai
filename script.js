// DOM Elements Selection
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotCloseBtn = document.querySelector(".close-btn");

// Initialize variables
let userMessage = "";
// const API_KEY ="AIzaSyBzONq3GJrlMLliRm6trvy7O62ElKrkxD0";
console.log("APIKEY>>>", API_KEY); // AIzaSyBzONq3GJrlMLliRm6trvy7O62ElKrkxD0
const inputInitHeight = chatInput.scrollHeight;

// Function to create a chat list item
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = 
        className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

// Function to generate response from Gemini API
const generateResponse = async (incomingChatLi) => {
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;
    const messageElement = incomingChatLi.querySelector("p");

    // Configure request options
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [{
                    "text": userMessage
                }]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        
        // Check if response contains valid data
        if (data.candidates && data.candidates.length > 0) {
            messageElement.textContent = data.candidates[0]?.content?.parts[0]?.text || "No response from AI.";
        } else {
            messageElement.textContent = "No response from AI.";
        }
    } catch (error) {
        console.error("API Error:", error);
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to bottom
    }
};

// Handle user chat
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user input
    if (!userMessage) return; // Exit if input is empty
    chatInput.value = ""; // Clear input
    chatInput.style.height = `${inputInitHeight}px`; // Reset input height

    // Append outgoing message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to bottom

    // Simulate AI thinking and get response
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to bottom
        generateResponse(incomingChatLi); // Fetch AI response
    }, 600);
};

// Adjust chat input height dynamically
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`; // Reset height
    chatInput.style.height = `${chatInput.scrollHeight}px`; // Adjust height
});

// Handle 'Enter' key for sending messages
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 880) {
        e.preventDefault();
        handleChat(); // Trigger chat handling
    }
});

// Handle send button click
sendChatBtn.addEventListener("click", handleChat);

// Close chatbot
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Toggle chatbot visibility
chatbotToggle.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
