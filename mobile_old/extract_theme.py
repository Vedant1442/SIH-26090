import re

with open(r"d:\SIH\mobile\.stitch\designs\99a7b33f02134250a63e33279181b65c.html", "r", encoding="utf-8") as f:
    content = f.read()

start = content.find("tailwind.config = {")
end = content.find("</script>", start)
if start != -1 and end != -1:
    config_str = content[start + 18 : end].strip()
    
    ts_content = f"export const tailwindConfig = {config_str};\n"
    ts_content += "export const colors = tailwindConfig.theme.extend.colors;\n"
    if "fontFamily" in config_str:
        ts_content += "export const fonts = tailwindConfig.theme.extend.fontFamily;\n"
    else:
        ts_content += "export const fonts = {};\n"
    
    with open(r"d:\SIH\mobile\src\theme.ts", "w", encoding="utf-8") as out:
        out.write(ts_content)
    print("Successfully created src/theme.ts")
else:
    print("Could not find tailwind config")
