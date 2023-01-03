import cv2

path="bg-guidao10.jpg"
k=3

img=cv2.imread(path)
x, y = img.shape[0:2]
img1=cv2.resize(img,(int(y / k), int(x / k)))
cv2.imshow("img",img1)
cv2.imwrite(path,img1)
cv2.waitKey()