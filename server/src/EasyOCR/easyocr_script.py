import sys
import easyocr
import json
import cv2
import numpy as np

def recognize_text(image_path):
    reader = easyocr.Reader(['en', 'ru'], gpu=False)  # If GPU is available then True
    image = cv2.imread(image_path)

    # Масштабируем изображение для улучшения точности
    image = cv2.resize(image, (800, 300), interpolation=cv2.INTER_CUBIC)

    # Запускаем OCR
    result = reader.readtext(image, detail=1)

    # Преобразуем результат в JSON
    output = []
    for (bbox, text, prob) in result:
        (x_min, y_min), (x_max, y_max), _, _ = bbox  # Извлекаем координаты
        output.append({
            "text": text.strip().replace("\n", " "),  # Убираем переносы строк
            "confidence": round(prob, 3),  # Округляем уверенность
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
