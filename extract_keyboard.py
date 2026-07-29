# pyrefly: ignore [missing-import]
from PIL import Image
import os

img_path = r"c:\Users\pc\Desktop\Vivek Works\Vivek\code-immersive\designs-img\image.png"
img = Image.open(img_path)
print("Image size:", img.size)

# Bounding box for keyboard in image.png
# Let's inspect where keyboard is located
# image.png width x height
# Let's save a preliminary crop around the central keyboard
width, height = img.size

# Keyboard occupies approximately x: 35% to 65%, y: 10% to 90%
crop_box = (int(width * 0.35), int(height * 0.10), int(width * 0.65), int(height * 0.90))
cropped = img.crop(crop_box)

os.makedirs(r"c:\Users\pc\Desktop\Vivek Works\Vivek\code-immersive\public\images", exist_ok=True)
cropped.save(r"c:\Users\pc\Desktop\Vivek Works\Vivek\code-immersive\public\images\keyboard_raw.png")

# Also let's extract with transparent background:
# Since background of image.png around keyboard is pure white (#FFFFFF or close),
# we can make pixels close to pure white transparent!
rgba_img = cropped.convert("RGBA")
datas = rgba_img.getdata()

newData = []
for item in datas:
    # change all white & near-white pixels (e.g. RGB > 248) to transparent
    if item[0] > 248 and item[1] > 248 and item[2] > 248:
        newData.append((255, 255, 255, 0))
    elif item[0] > 240 and item[1] > 240 and item[2] > 240:
        # smooth anti-aliased edge alpha for soft transition
        avg = (item[0] + item[1] + item[2]) / 3
        alpha = int((255 - avg) / (255 - 240) * 255)
        newData.append((item[0], item[1], item[2], alpha))
    else:
        newData.append(item)

rgba_img.putdata(newData)
rgba_img.save(r"c:\Users\pc\Desktop\Vivek Works\Vivek\code-immersive\public\images\keyboard.png")
print("Keyboard image extracted successfully to public/images/keyboard.png!")
