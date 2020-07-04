from PIL import Image, ImageFilter

image_path = input("image path\n")
no_of_img = int(input("number of images\n"))
blur_index = 50//no_of_img

img=Image.open(image_path)

for i in range(1,no_of_img+1):
    blur_image = img.filter(ImageFilter.GaussianBlur(radius=(blur_index*i)))
    blur_image.save("blur_image"+str(i)+".jpg")
