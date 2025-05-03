# README.md

# Web-based Chat Assistant

This project implements a web-based Chat Assistant that allows users to have continuous conversations with a Large Language Model (LLM). The application features a front-end UI, a back-end API, file upload support, multi-model comparison, and deployment readiness on Render.com.

## Features

- Interactive chat interface for real-time conversations with an LLM
- Support for uploading files to enhance interactions
- Ability to compare responses from multiple LLM models
- Modular and scalable architecture
- Deployment on Render.com

## Technologies Used

- FastAPI for the backend API
- Uvicorn as the ASGI server
- liteLLM for lightweight LLM interactions
- httpx for HTTP requests
- starlette for web server components
- pydantic for data validation

## Files

- `front_end.js`: Front-end JavaScript for UI interactions
- `server.py`: Backend API implementation
- `README.md`: This documentation

## Setup Instructions

### Prerequisites

- Python 3.8+
- pip

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository_url>
cd <repository_directory>
pip install fastapi uvicorn liteLLM httpx starlette pydantic
```

### Running the Server

Start the backend server with Uvicorn:

```bash
uvicorn server:app --host 0.0.0.0 --port 8000
```

The server will be accessible at `http://localhost:8000`.

### Front-end

Open `front_end.js` in your preferred browser or integrate it into your web page to interact with the API.

## Deployment

To deploy on Render.com:

1. Push your code to a GitHub repository.
2. Create a new Web Service on Render.
3. Connect your repository.
4. Set the start command to:

```bash
uvicorn server:app --host 0.0.0.0 --port 10000
```

5. Configure environment variables if needed.

## Usage

- Access the chat interface via your front-end.
- Upload files to include in conversations.
- Select different models for comparison.
- Continue conversations seamlessly.

## License

This project is licensed under the MIT License.

---

**Note:** Replace `<repository_url>` and `<repository_directory>` with your actual repository URL and directory name.