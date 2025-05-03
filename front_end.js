// front_end.js

// This script provides the front-end logic for the web-based Chat Assistant.
// It handles user interactions, file uploads, sending messages to the backend API,
// and displaying chat history and model comparison results.

const apiBaseUrl = 'https://your-render-app-url.com/api'; // Replace with your deployed API URL

/**
 * Sends a message to the backend API and updates the chat UI.
 * @param {string} message - The user's message.
 */
async function sendMessage(message) {
    try {
        // Append user's message to chat
        appendMessage('user', message);

        // Send message to backend
        const response = await fetch(`${apiBaseUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Append assistant's reply
        appendMessage('assistant', data.reply);
    } catch (error) {
        console.error('Error sending message:', error);
        appendMessage('error', 'Failed to get response. Please try again.');
    }
}

/**
 * Handles file uploads to the backend.
 * @param {FileList} files - List of files selected by the user.
 */
async function uploadFiles(files) {
    const formData = new FormData();
    for (let file of files) {
        formData.append('files', file);
    }

    try {
        const response = await fetch(`${apiBaseUrl}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        displayUploadStatus(`Uploaded ${files.length} file(s) successfully.`);
    } catch (error) {
        console.error('File upload error:', error);
        displayUploadStatus('File upload failed. Please try again.');
    }
}

/**
 * Initiates model comparison based on user input.
 * @param {Array<string>} modelIds - List of model identifiers to compare.
 */
async function compareModels(modelIds) {
    try {
        const response = await fetch(`${apiBaseUrl}/compare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ models: modelIds })
        });

        if (!response.ok) {
            throw new Error(`Comparison failed: ${response.status} ${response.statusText}`);
        }

        const comparisonResults = await response.json();
        displayComparisonResults(comparisonResults);
    } catch (error) {
        console.error('Model comparison error:', error);
        alert('Failed to compare models. Please try again.');
    }
}

/**
 * Appends a message to the chat window.
 * @param {string} sender - 'user', 'assistant', or 'error'.
 * @param {string} message - The message content.
 */
function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Displays upload status messages.
 * @param {string} statusMessage - Status message to display.
 */
function displayUploadStatus(statusMessage) {
    const statusDiv = document.getElementById('upload-status');
    statusDiv.textContent = statusMessage;
}

/**
 * Displays model comparison results.
 * @param {Object} results - The comparison results data.
 */
function displayComparisonResults(results) {
    const comparisonDiv = document.getElementById('comparison-results');
    comparisonDiv.innerHTML = '';

    results.forEach((result, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'comparison-result';

        const title = document.createElement('h4');
        title.textContent = `Model ${result.model_id}`;
        resultDiv.appendChild(title);

        const details = document.createElement('pre');
        details.textContent = JSON.stringify(result.metrics, null, 2);
        resultDiv.appendChild(details);

        comparisonDiv.appendChild(resultDiv);
    });
}

/**
 * Initializes event listeners for UI elements.
 */
function initializeUI() {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const compareButton = document.getElementById('compare-button');
    const modelSelect = document.getElementById('model-select');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    uploadButton.addEventListener('click', () => {
        const files = fileInput.files;
        if (files.length > 0) {
            uploadFiles(files);
        } else {
            alert('Please select files to upload.');
        }
    });

    compareButton.addEventListener('click', () => {
        const selectedModels = Array.from(modelSelect.selectedOptions).map(opt => opt.value);
        if (selectedModels.length >= 2) {
            compareModels(selectedModels);
        } else {
            alert('Please select at least two models for comparison.');
        }
    });
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
});