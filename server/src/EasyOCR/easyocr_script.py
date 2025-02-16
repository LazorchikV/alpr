import sys
import easyocr
import json
import cv2
import numpy as np

def recognize_text(image_path):
    reader = easyocr.Reader(['en', 'ru'], gpu=False)  # If GPU is available then True
    image = cv2.imread(image_path)

    # Scale the image to improve accuracy
    image = cv2.resize(image, (800, 300), interpolation=cv2.INTER_CUBIC)

    # Launch OCR
    result = reader.readtext(image, detail=1)

    # Convert the result to JSON
    output = []
    for (bbox, text, prob) in result:
        (x_min, y_min), (x_max, y_max), _, _ = bbox  # Extracting coordinates
        output.append({
            "text": text.strip().replace("\n", " "),  # Removing line breaks
            "confidence": round(prob, 3),  # Rounding off confidence
            "boundingBox": {
                "x": int(x_min),
                "y": int(y_min),
                "width": int(x_max - x_min),
                "height": int(y_max - y_min)
            }
        })

    print(json.dumps(output, ensure_ascii=False))

if __name__ == "__main__":
    image_path = sys.argv[1]
    recognize_text(image_path)
