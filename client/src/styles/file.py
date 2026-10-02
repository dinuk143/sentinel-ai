from PIL import Image, ImageDraw, ImageFont
import os, textwrap

W, H = 1600, 950
img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)

# Fonts
font_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"
]
bold_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"
]
fp = next((p for p in font_paths if os.path.exists(p)), None)
bp = next((p for p in bold_paths if os.path.exists(p)), fp)

def F(size, bold=False):
    return ImageFont.truetype(bp if bold else fp, size)

title_font = F(26, True)
head_font = F(17, True)
body_font = F(14)
small_bold = F(13, True)
small = F(12)

# Colors
blue = "#1877D2"
yellow = "#FFF0A8"
green = "#E7F4DF"
line = "#555555"
text = "#111111"

# Main title
tx, ty, tw, th = 590, 35, 420, 105
d.rounded_rectangle((tx,ty,tx+tw,ty+th), radius=8, fill=blue, outline=blue)
d.multiline_text((tx+tw/2, ty+th/2), "SENTINEL AI\n(90 Days)", font=title_font, fill="white",
                 anchor="mm", align="center")

# Column definitions
cols = [
    ("1. Requirements\nGathering\nModule", "15 Days",
     ["1.1 Define Project Scope\n(7 Days)", "1.2 Collect User &\nEmergency Requirements\n(8 Days)"]),
    ("2. System Design\nModule", "15 Days",
     ["2.1 UI/UX Design\n(7 Days)", "2.2 Database & System\nArchitecture Design\n(8 Days)"]),
    ("3. Frontend\nDevelopment\nModule", "20 Days",
     ["3.1 Build Home &\nSOS Interface\n(7 Days)", "3.2 Emergency Report\n& Location UI\n(6 Days)", "3.3 First Aid Guide\n& Reports UI\n(7 Days)"]),
    ("4. Backend & AI\nDevelopment\nModule", "20 Days",
     ["4.1 Integrate Google\nGemini AI\n(10 Days)", "4.2 Develop Emergency\nReport & API Logic\n(10 Days)"]),
    ("5. Maps & Emergency\nServices Module", "10 Days",
     ["5.1 Integrate Google\nMaps & Location\n(5 Days)", "5.2 Nearby Hospital,\nPolice & Fire Station\n(5 Days)"]),
    ("6. Notification &\nTesting Module", "5 Days",
     ["6.1 Emergency Numbers,\nEmail & Alerts\n(2 Days)", "6.2 Test All Modules &\nFix Bugs\n(3 Days)"]),
    ("7. Deployment &\nDocumentation\nModule", "5 Days",
     ["7.1 Prepare Project\nDocumentation\n(3 Days)", "7.2 Final Deployment\n& Submission\n(2 Days)"])
]

x0, gap, cw = 40, 18, 207
head_y, head_h = 205, 120
# vertical connector from title
center_x = tx + tw/2
d.line((center_x, ty+th, center_x, head_y-18), fill=line, width=2)
d.line((center_x, head_y-18, x0+cw/2, head_y-18), fill=line, width=2)
d.line((x0+cw/2, head_y-18, x0+cw/2, head_y), fill=line, width=2)
last_center = x0 + 6*(cw+gap) + cw/2
d.line((center_x, head_y-18, last_center, head_y-18), fill=line, width=2)
for i in range(7):
    cx = x0 + i*(cw+gap) + cw/2
    if i > 0:
        d.line((cx, head_y-18, cx, head_y), fill=line, width=2)

def centered_wrapped(x, y, w, h, lines, font, fill=text, spacing=3):
    # lines is list of strings, preserve line breaks
    all_lines = []
    for s in lines:
        all_lines.extend(s.split("\n"))
    total = sum(font.getbbox(s)[3]-font.getbbox(s)[1] for s in all_lines) + spacing*(len(all_lines)-1)
    yy = y + (h-total)/2
    for s in all_lines:
        d.text((x+w/2, yy), s, font=font, fill=fill, anchor="ma")
        yy += (font.getbbox(s)[3]-font.getbbox(s)[1]) + spacing

for i, (head, days, subs) in enumerate(cols):
    x = x0 + i*(cw+gap)
    # header
    d.rectangle((x, head_y, x+cw, head_y+head_h), fill=yellow, outline=line, width=2)
    centered_wrapped(x+5, head_y+5, cw-10, head_h-10, [head, f"({days})"], head_font)
    # connector stem
    cx = x+cw/2
    d.line((cx, head_y+head_h, cx, head_y+head_h+22), fill=line, width=2)
    
    # sub boxes
    sy = 360
    sh = 125 if len(subs) == 2 else 115
    if len(subs) == 3:
        positions = [sy, sy+150, sy+300]
    else:
        positions = [sy, sy+190]
    for j, sub in enumerate(subs):
        yy = positions[j]
        d.rectangle((x+22, yy, x+cw-22, yy+sh), fill=green, outline=line, width=1.5)
        centered_wrapped(x+27, yy+4, cw-54, sh-8, sub.split("\n"), body_font)
        # connector
        d.line((cx, head_y+head_h+22 if j==0 else positions[j-1]+sh, cx, yy), fill=line, width=1.5)

# Fix first/last lower connector visual by adding short verticals where needed
# Footer note
d.text((W/2, 900), "Sentinel AI Work Breakdown Structure (WBS) – 90 Day Project Plan",
       font=F(16, True), fill="#444444", anchor="mm")

png_path="/mnt/data/Sentinel_AI_WBS_90_Days.png"
img.save(png_path, quality=95)
print(f"Created: {png_path}")

