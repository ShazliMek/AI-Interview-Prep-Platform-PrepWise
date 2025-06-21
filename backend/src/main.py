import shutil
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from . import analysis

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-interview-response/")
async def analyze_response_endpoint(audio_file: UploadFile = File(...)):
    """
    Endpoint to receive an audio file, analyze it, and return the results.
    """
    # Ensure the uploaded file is in a supported format (e.g., wav, mp3)
    if not audio_file.filename.endswith(('.wav', '.mp3', '.m4a')):
        raise HTTPException(status_code=400, detail="Unsupported file format.")

    # Create a temporary path to save the file
    temp_path = f"temp_{audio_file.filename}"
    
    try:
        # Save the uploaded file to the temporary path
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
        
        # Run the analysis using the new module
        report = analysis.analyze_audio(temp_path)
        
        return report

    except Exception as e:
        # Handle potential errors during analysis
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
    finally:
        # Clean up by deleting the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/")
def read_root():
    return {"message": "PrepWise AI Analysis Server is running."}
