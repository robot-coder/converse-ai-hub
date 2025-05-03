from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
from starlette.middleware.cors import CORSMiddleware
from liteLLM import LLM
from typing import List, Optional

app = FastAPI(title="Web-based Chat Assistant")

# Allow CORS for frontend development (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize multiple models for comparison
models = {
    "model1": LLM(model_name="model_name_1"),
    "model2": LLM(model_name="model_name_2"),
    # Add more models as needed
}

# Store conversation history per user/session (simple in-memory store)
# For production, consider persistent storage or session management
conversation_history = {}

class Message(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    responses: dict  # model_name: response_text

@app.post("/chat")
async def chat_endpoint(msg: Message):
    """
    Handle user message, return responses from all models for comparison.
    """
    user_id = msg.user_id
    user_message = msg.message

    # Initialize conversation history if not present
    if user_id not in conversation_history:
        conversation_history[user_id] = []

    # Append user message to history
    conversation_history[user_id].append({"role": "user", "content": user_message})

    responses = {}
    for model_name, model in models.items():
        try:
            # Generate response from model
            response_text = await generate_response(model, conversation_history[user_id])
            responses[model_name] = response_text
        except Exception as e:
            responses[model_name] = f"Error: {str(e)}"

    # Append model responses to history
    for model_name, response_text in responses.items():
        conversation_history[user_id].append({"role": "assistant", "content": response_text})

    return ChatResponse(responses=responses)

async def generate_response(model: LLM, history: List[dict]) -> str:
    """
    Generate a response from the given model based on conversation history.
    """
    # Prepare prompt from history
    prompt = ""
    for turn in history:
        role = turn["role"]
        content = turn["content"]
        if role == "user":
            prompt += f"User: {content}\n"
        elif role == "assistant":
            prompt += f"Assistant: {content}\n"
    prompt += "Assistant: "

    # Generate response
    response = await model.chat(prompt)
    return response.strip()

@app.post("/uploadfile")
async def upload_file(file: UploadFile = File(...)):
    """
    Handle file uploads.
    """
    try:
        content = await file.read()
        # Process the file as needed, e.g., store or parse
        # For demonstration, just return file info
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "message": "File uploaded successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/models")
async def list_models():
    """
    Return available models for comparison.
    """
    return {"models": list(models.keys())}

@app.post("/switch_model")
async def switch_model(model_name: str):
    """
    Switch active model if needed. Placeholder for model management.
    """
    if model_name not in models:
        raise HTTPException(status_code=404, detail="Model not found.")
    # Implement model switching logic if applicable
    return {"message": f"Switched to model: {model_name}"}

# Optional: Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}