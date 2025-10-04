import google.generativeai as genai
import os
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64

app = Flask(__name__)

# It's recommended to use environment variables for the API key
# The backend will pass the key in the request header for security
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# In-memory cache for models to avoid re-initialization on every call
model_cache = {}

def get_gemini_model(api_key):
    if api_key not in model_cache:
        genai.configure(api_key=api_key)
        model_cache[api_key] = genai.GenerativeModel('gemini-1.5-flash')
    return model_cache[api_key]

@app.route('/api/ai/generate', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON input"}), 400

        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return jsonify({"error": "API key is missing"}), 401
            
        model = get_gemini_model(api_key)

        prompt = data.get('prompt')
        images_b64 = data.get('images', [])
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        contents = [prompt]
        for img_b64 in images_b64:
            img_bytes = base64.b64decode(img_b64)
            img = Image.open(io.BytesIO(img_bytes))
            contents.append(img)
            
        response = model.generate_content(contents)
        
        return jsonify({"text": response.text})

    except Exception as e:
        print(f"Error in /generate: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
