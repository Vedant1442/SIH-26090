import json
import urllib.request
import os

with open(r"C:\Users\Vedant\.gemini\antigravity\brain\65308990-4088-47a9-ae91-afc5e6d8c3b6\.system_generated\steps\146\output.txt", "r") as f:
    data = json.load(f)

os.makedirs(r"d:\SIH\mobile\.stitch\designs", exist_ok=True)

for screen in data["screens"]:
    screen_id = screen["name"].split("/")[-1]
    if not screen_id:
        continue
    
    html_url = screen.get("htmlCode", {}).get("downloadUrl")
    png_url = screen.get("screenshot", {}).get("downloadUrl")
    
    width = screen.get("width", "780")
    
    if html_url:
        print(f"Fetching HTML for {screen_id}...")
        try:
            req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(f"d:\\SIH\\mobile\\.stitch\\designs\\{screen_id}.html", 'wb') as out_file:
                out_file.write(response.read())
        except Exception as e:
            print(f"Failed HTML {screen_id}: {e}")
            
    if png_url:
        print(f"Fetching PNG for {screen_id}...")
        try:
            png_url_sized = f"{png_url}=w{width}"
            req = urllib.request.Request(png_url_sized, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(f"d:\\SIH\\mobile\\.stitch\\designs\\{screen_id}.png", 'wb') as out_file:
                out_file.write(response.read())
        except Exception as e:
            print(f"Failed PNG {screen_id}: {e}")
            
print("Done fetching.")
