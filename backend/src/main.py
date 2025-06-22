from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from . import analysis
import requests
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js frontend
    "https://prepwise.ai",    # Your production domain
    "https://www.prepwise.ai" # Your www production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AudioRequest(BaseModel):
    audio_url: str

@app.post("/analyze-audio/")
async def analyze_response_endpoint(request: AudioRequest):
    """
    Endpoint to analyze an audio file from a URL.
    Downloads the file, saves it temporarily, analyzes it, and then deletes it.
    """
    temp_audio_path = None
    try:
        # Download the audio file from the provided URL
        response = requests.get(request.audio_url, stream=True)
        response.raise_for_status()  # Raise an exception for bad status codes

        # Create a temporary file to store the audio
        temp_dir = "temp_audio"
        os.makedirs(temp_dir, exist_ok=True)
        # Use a predictable but unique name for simplicity, or uuid for production
        file_name = os.path.basename(request.audio_url).split('?')[0]
        temp_audio_path = os.path.join(temp_dir, file_name)

        with open(temp_audio_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to download audio file: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving audio file: {e}")

    try:
        # Perform the analysis
        report = analysis.analyze_audio(temp_audio_path)
        return report
    except Exception as e:
        # Log the exception details for debugging
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during audio analysis: {e}")
    finally:
        # Clean up the temporary file
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

@app.get("/")
def read_root():
    return {"message": "PrepWise Analysis API is running."}