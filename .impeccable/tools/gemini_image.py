# python3 gemini_image.py <model> <prompt.txt> <ref.png> <out.png> [aspect]
import base64, json, os, sys, urllib.request, urllib.error
model, prompt_file, ref, out = sys.argv[1:5]
aspect = sys.argv[5] if len(sys.argv) > 5 else "2:3"
body = {
    "contents": [{"parts": [
        {"inline_data": {"mime_type": "image/png", "data": base64.b64encode(open(ref, "rb").read()).decode()}},
        {"text": open(prompt_file).read()},
    ]}],
    "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}},
}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
try:
    res = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e:
    sys.exit(f"HTTP {e.code}: {e.read().decode()[:400]}")
for part in res.get("candidates", [{}])[0].get("content", {}).get("parts", []):
    data = part.get("inlineData") or part.get("inline_data")
    if data:
        open(out, "wb").write(base64.b64decode(data["data"]))
        print("wrote", out, data.get("mimeType") or data.get("mime_type"))
        break
else:
    sys.exit("no image in response: " + json.dumps(res)[:400])
