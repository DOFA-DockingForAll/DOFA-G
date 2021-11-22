# from skimage.measure import compare_ssim 

from flask import Flask, render_template, request
    
from skimage.metrics import structural_similarity as compare_ssim
import imutils
import cv2
import numpy as np

def image_diff():
    imagea = cv2.imread("./img/original.png")
    imageb = cv2.imread("./img/modified.png")
    
    imageA = cv2.resize(imagea, dsize=(0, 0), fx=0.5, fy=0.5)
    imageB = cv2.resize(imageb, dsize=(0, 0), fx=0.5, fy=0.5)
    # cv2.waitKey(0)
    
    grayA = cv2.cvtColor(imageA, cv2.COLOR_BGR2GRAY)
    grayB = cv2.cvtColor(imageB, cv2.COLOR_BGR2GRAY)
    (score, diff) = compare_ssim(grayA, grayB, full=True)
    diff = (diff * 255).astype("uint8")
    #print(f"SSIM: {score}")
    cv2.imshow("A", grayA)
    cv2.imshow("B", grayB)
    cv2.imshow("diff",diff)

    #외각선 검출
    thresh = cv2.threshold(
                 diff, 0, 200, 
                 cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU
             )[1]
    
    cnts, _ = cv2.findContours(
                thresh, 
                cv2.RETR_EXTERNAL, 
                cv2.CHAIN_APPROX_SIMPLE
              )
    cv2.imshow("thresh",thresh)
    for c in cnts:
        area = cv2.contourArea(c)
        if area > 40:
            x, y, w, h = cv2.boundingRect(c)
            #cv2.rectangle(imageA, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.drawContours(imageB, [c], -1, (0, 0, 255), 2)
    #cv2.imshow("Original", imageA)
    cv2.imshow("Modified", imageB)
    #cv2.waitKey(0)
    #cv2.imwrite('./result/result_original.jpg', imageA)
    #cv2.imwrite('./result/result_modified.jpg', imageB)

    
if __name__ == "__main__":
    image_diff()
