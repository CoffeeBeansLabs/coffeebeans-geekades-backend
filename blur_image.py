# pip install image_slicer pillow numpy uuid
# python blur_image.py --image './abdul-kalam.jpg' --bgimage './orange.jpg' --tile_count 4 --open_tiles 2 4 6 7 18

import numpy
import image_slicer
import sys
import argparse
import uuid
import os.path

from image_slicer import join
from PIL import Image, ImageFilter, ImageDraw

parser = argparse.ArgumentParser()

parser.add_argument('--image', help = 'image src')
parser.add_argument('--bgimage', help = 'background image src')
parser.add_argument('--tile_count', help = 'tile count', type = int)
parser.add_argument('--open_tiles', nargs = '*', help ='open tile numbers', type = int)

args = parser.parse_args()

image = args.image
bg_image = args.bgimage
tile_count = args.tile_count * args.tile_count


temp_image = Image.open(image)
temp_bgimage = Image.open(bg_image)

w_image, h_image = temp_image.size
w_bgimage, h_bgimage = temp_bgimage.size

if (w_image != w_bgimage) or (h_image != h_bgimage):
	temp_bgimage = temp_bgimage.resize((w_image, h_image))

unique_bgname = False
while unique_bgname == False:
	bgname = uuid.uuid4()
	final_bgname = str(bgname) + '.jpeg'
	if os.path.isfile(final_bgname) == False:
		unique_bgname = True

temp_bgimage.save(final_bgname)

open_tile = []

for tile_number in args.open_tiles:
	open_tile.append(tile_number)

img_tiles = image_slicer.slice(image, tile_count, save = False)
bg_tiles = image_slicer.slice(final_bgname, tile_count, save = False)

i = 0
j = 1

for tile in img_tiles:
	im = tile.image
	bg = bg_tiles[tile.number-1]
	bg = bg.image

	im = im.convert("RGBA")
	bg = bg.convert("RGBA")

	imArray = numpy.asarray(im)
	bgArray = numpy.asarray(bg)

	w, h = im.size
	left_coord_odd = [(0,0),(0,h),(w,0)]
	right_coord_odd = [(w,h),(0,h),(w,0)]

	left_coord_even = [(0,0),(0,h),(w,h)]
	right_coord_even = [(0,0),(w,0),(w,h)]

	if tile.number%2 == 0:
		left_coord = left_coord_even
		right_coord = right_coord_even
	else:
		left_coord = left_coord_odd
		right_coord = right_coord_odd

	left_im = Image.new('L', (imArray.shape[1], imArray.shape[0]), 0)
	left_bg = Image.new('L', (bgArray.shape[1], bgArray.shape[0]), 0)
	ImageDraw.Draw(left_im).polygon(left_coord, outline=1, fill=1)
	ImageDraw.Draw(left_bg).polygon(left_coord, outline=1, fill=1)
	mask_left = numpy.array(left_im)
	mask_left_bg = numpy.array(left_bg)


	right_im = Image.new('L', (imArray.shape[1], imArray.shape[0]), 0)
	right_bg = Image.new('L', (bgArray.shape[1], bgArray.shape[0]), 0)
	ImageDraw.Draw(right_im).polygon(right_coord, outline=1, fill=1)
	ImageDraw.Draw(right_bg).polygon(right_coord, outline=1, fill=1)
	mask_right = numpy.array(right_im)
	mask_right_bg = numpy.array(right_bg)

	newImArray_left = numpy.empty(imArray.shape,dtype='uint8')
	newBgArray_left = numpy.empty(bgArray.shape,dtype='uint8')

	newImArray_right = numpy.empty(imArray.shape,dtype='uint8')
	newBgArray_right = numpy.empty(bgArray.shape,dtype='uint8')

	newImArray_left[:,:,:3] = imArray[:,:,:3]
	newBgArray_left[:,:,:3] = bgArray[:,:,:3]

	newImArray_right[:,:,:3] = imArray[:,:,:3]
	newBgArray_right[:,:,:3] = bgArray[:,:,:3]

	newImArray_left[:,:,3] = mask_left * 255
	newBgArray_left[:,:,3] = mask_left_bg * 255

	newImArray_right[:,:,3] = mask_right * 255
	newBgArray_right[:,:,3] = mask_right_bg * 255


	newIm_left = Image.fromarray(newImArray_left, "RGBA")
	newBg_left = Image.fromarray(newBgArray_left, "RGBA")

	newIm_right = Image.fromarray(newImArray_right, "RGBA")
	newBg_right = Image.fromarray(newBgArray_right, "RGBA")

	if ((tile.number+i) not in open_tile) and ((tile.number+j) not in open_tile):
		newBg_left = newBg_left.filter(ImageFilter.GaussianBlur(radius = 40))
		newBg_right = newBg_right.filter(ImageFilter.GaussianBlur(radius = 20))
		tile.image = Image.composite(newBg_right, newBg_left, newBg_right)

	if ((tile.number+i) in open_tile) and ((tile.number+j) not in open_tile):
		newBg_left = newBg_left.filter(ImageFilter.GaussianBlur(radius = 40))
		tile.image = Image.composite(newBg_left, newIm_right, newIm_right)

	elif ((tile.number+i) not in open_tile) and ((tile.number+j) in open_tile):
		newBg_right = newBg_right.filter(ImageFilter.GaussianBlur(radius = 40))
		tile.image = Image.composite(newBg_right, newIm_left, newIm_left)

	elif ((tile.number+i) in open_tile) and ((tile.number+j) in open_tile):
		tile.image = Image.composite(newIm_right, newIm_left, newIm_left)


	i = i + 1
	j = j + 1

final_image = join(img_tiles)

unique_name = False
while unique_name == False:
	filename = uuid.uuid4()
	final_filename = str(filename) + '.png'

	if os.path.isfile(final_filename) == False:
		unique_name = True

final_image.save(final_filename)
os.remove(final_bgname)
