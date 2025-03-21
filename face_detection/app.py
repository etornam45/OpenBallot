# app.py
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from face_hasher import FaceHasher
import numpy as np
import logging
from deepface import DeepFace
from typing import List, Optional

app = FastAPI(
    title="Facial Hash API",
    version="1.1.0",
    description="API for facial recognition hashing and comparison"
)

hasher = FaceHasher(detector_backend="mtcnn")
logger = logging.getLogger(__name__)

async def process_image(file: UploadFile):
    try:
        contents = await file.read()
        return hasher.generate_hash(contents)
    except Exception as e:
        logger.error(f"Error processing {file.filename}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")
    finally:
        await file.close()

@app.post("/generate-hash", 
         summary="Generate facial hash from single image",
         response_description="Binary hash string")
async def generate_hash(file: UploadFile = File(...)):
    """Generate a unique binary hash from a facial image"""
    try:
        hash_result = await process_image(file)
        if not hash_result:
            raise HTTPException(status_code=400, detail="No face detected")
        return {"hash": hash_result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/average-hash", 
         summary="Generate average hash from multiple images",
         response_description="Average hash and processing stats")
async def average_hash(files: List[UploadFile] = File(...)):
    """Generate an average hash from 2 or more facial images"""
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 images required")

    embeddings = []
    results = {
        "average_hash": None,
        "processed_images": 0,
        "failed_images": []
    }

    for idx, file in enumerate(files):
        try:
            contents = await file.read()
            face = hasher.detect_face(contents)
            if face is None:
                raise ValueError("No face detected")
            
            embedding = DeepFace.represent(
                img_path=face,
                model_name="Facenet",
                detector_backend="skip",
                enforce_detection=False
            )[0]["embedding"]
            
            embeddings.append(embedding)
            results["processed_images"] += 1
        except Exception as e:
            results["failed_images"].append({
                "index": idx,
                "filename": file.filename,
                "error": str(e)
            })
        finally:
            await file.close()

    if not embeddings:
        raise HTTPException(status_code=400, detail="No valid faces detected in any images")

    avg_embedding = np.mean(embeddings, axis=0)
    median = np.median(avg_embedding)
    binary_hash = ''.join(['1' if x > median else '0' for x in avg_embedding])
    
    results["average_hash"] = binary_hash
    return JSONResponse(content=results)

@app.post("/compare-hash", 
         summary="Compare image with existing hash",
         response_description="Comparison results")
async def compare_hash(
    file: UploadFile = File(...),
    target_hash: str = Form(...)
):
    """Compare an uploaded image with a provided hash string"""
    try:
        image_hash = await process_image(file)
        if not image_hash:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        if len(image_hash) != len(target_hash):
            raise HTTPException(status_code=400, detail="Hash length mismatch")
        
        distance, is_match = hasher.compare_hashes(image_hash, target_hash)
        return {
            "hamming_distance": distance,
            "is_match": is_match,
            "hash_length": len(image_hash),
            "threshold": 25
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Comparison failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/compare-images", 
         summary="Compare two images directly",
         response_description="Comparison results")
async def compare_images(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):
    """Compare two facial images directly"""
    try:
        hash1 = await process_image(image1)
        hash2 = await process_image(image2)
        
        if not hash1 or not hash2:
            raise HTTPException(status_code=400, detail="Face not detected in one or both images")
        
        distance, is_match = hasher.compare_hashes(hash1, hash2)
        return {
            "hashes": {
                "image1": hash1,
                "image2": hash2,
            },
            "hamming_distance": distance,
            "is_match": is_match,
            "hash_length": len(hash1)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Comparison failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "healthy", "version": "1.1.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)