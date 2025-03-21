import cv2
import numpy as np
from deepface import DeepFace
from mtcnn import MTCNN
import hashlib
import logging

logger = logging.getLogger(__name__)

class FaceHasher:
    def __init__(self, detector_backend="mtcnn"):
        self.detector = MTCNN() if detector_backend == "mtcnn" else None
        self.detector_backend = detector_backend

    def detect_face(self, image_bytes):
        """Detect face from in-memory image bytes"""
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError("Invalid image data")
            
            if self.detector_backend == "mtcnn":
                # Convert BGR to RGB for MTCNN
                rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = self.detector.detect_faces(rgb_img)
                if not results:
                    return None
                x, y, w, h = results[0]['box']
                face = rgb_img[y:y+h, x:x+w]
                return cv2.resize(face, (160, 160))  # FaceNet input size
            else:
                # Use DeepFace's in-memory detection
                face = DeepFace.detectFace(img, detector_backend=self.detector_backend)
                return (face * 255).astype('uint8')
        except Exception as e:
            logger.error(f"Face detection failed: {str(e)}")
            return None

    def generate_hash(self, image_bytes, secure=False):
        """Generate facial hash from image bytes"""
        face = self.detect_face(image_bytes)
        if face is None:
            return None

        try:
            # Extract embedding using in-memory face array
            embedding = DeepFace.represent(
                img_path=face,
                model_name="Facenet",
                detector_backend="skip",  # Skip detection step
                enforce_detection=False
            )[0]["embedding"]
            
            # Generate binary hash
            median = np.median(embedding)
            binary_hash = ''.join(['1' if x > median else '0' for x in embedding])
            
            if secure:
                return hashlib.sha256(binary_hash.encode()).hexdigest()
            return binary_hash
        except Exception as e:
            logger.error(f"Embedding extraction failed: {str(e)}")
            return None

    @staticmethod
    def compare_hashes(hash1, hash2, threshold=30):
        """Compare two binary hashes"""
        if len(hash1) != len(hash2):
            raise ValueError("Hash length mismatch")
        distance = sum(c1 != c2 for c1, c2 in zip(hash1, hash2))
        return distance, distance <= threshold