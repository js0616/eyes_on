# 작성자 이진솔

# ctrl shift p - python 인터프리터 선택 - 가상환경 test111 
# ctrl shift `  - 새로운 cmd 열고 아래와 같이 가상환경으로 변경 되는지 확인
# C:\Users\gjaischool\Desktop\fire-project\total_test\test16>C:/Users/gjaischool/anaconda3/Scripts/activate
# (base) C:\Users\gjaischool\Desktop\fire-project\total_test\test16>conda activate test111
# (test111) C:\Users\gjaischool\Desktop\fire-project\total_test\test16>
# cd flask 로 이동
# python appp2.py   ## 실행 
# 파이썬 로컬 주소 확인 후 3-5초 뒤에 리액트 페이지 새로고침 

# 가상환경 끄기 deactivate

# 1. 네트워크 연결 확인
# - IP 주소 : 192.168.1.12 / 서브넷 마스크 : 255.255.255.0

# 2. nodemon - npm start - python app.py 순서로 다시 실행 해보기

# node 에 axios 설치
# obj_record.js 라우터 확인
# RealDetect.jsx 
# RealVideoDetailPage.jsx


# app.py
from flask import Flask, render_template, Response, jsonify, request, json
import cv2
import torch
import numpy as np
import pandas as pd
import pytesseract
from scipy.spatial import cKDTree
from flask_cors import CORS
from datetime import datetime, timedelta

## LSTM 예측 모델 
from keras.models import load_model

# LSTM 불러올 모델의 경로
LSTM_model_path = './LSTM30.h5'
LSTM_Model = load_model(LSTM_model_path)



## 더미데이터용 import
import random

app = Flask(__name__)
CORS(app)

device=torch.device('cuda')
model = torch.hub.load('ultralytics/yolov5', 'custom', 'best.pt')
model.to(device)

# 이미지에서 온도 범위를 추출하는 함수
def img2OCR(tempimg):

    # 이미지를 그레이스케일로 변환
    gray_image = cv2.cvtColor(tempimg, cv2.COLOR_BGR2GRAY)

    # 이진화: Otsu's thresholding
    _, thresh = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # _, thresh = cv2.threshold(tempimg, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Tesseract 실행
    custom_config = r'--oem 3 --psm 6'  # OEM과 PSM 모드 설정
    extracted_text = pytesseract.image_to_string(thresh, config=custom_config)
    
    return extracted_text

# 원본 frame과  box - frame 
def path_temp(origin, crop_img):
    
    # 이미지를 읽어옵니다.
    image = origin
    
    # 이미지 전처리
    # temp_box_image 위치
    x1, y1, x2, y2 = 621,112,622,367
    temp_box_image = image[y1:y2, x1:x2]
    
    # 최고온도 : 589, 85 // 638, 105
    x1,y1,x2,y2 = 570,83,627,104
    high_temp_img = image[y1:y2,x1:x2]

    # 최저온도 : 589, 385 // 638, 405
    x3,y3,x4,y4 = 570,384,627,404
    low_temp_img = image[y3:y4,x3:x4]
    
    # img2temp 함수 OCR 이용 - 최고, 최저 온도 추출
    temp_high = img2OCR(high_temp_img)
    temp_low = img2OCR(low_temp_img)

    try:
        temp_high = float(temp_high)
        temp_low = float(temp_low)
    except ValueError:
        print("OCR 에러 3 - type_err")
        return -100
    
    if temp_high > 100:
        # print('OCR 에러 1 - temp_high_err', temp_high, temp_low)
        temp_high = temp_high/10
        # return -100
    
    if temp_low > 100:
        # print('OCR 에러 2 - temp_low_err', temp_high, temp_low)
        temp_low = temp_low/10

    # RGB 값을 평균내어 온도로 변환하는 과정
    # 온도 값을 저장할 배열 생성
    temperature_values = np.zeros((temp_box_image.shape[0], 1))

    for i in range(temp_box_image.shape[0]):
        # RGB 값 평균 계산
        average_pixel_value = np.mean(temp_box_image[i, 0, :])
        # 평균 RGB 값으로 온도 계산
        temperature = temp_low + ((average_pixel_value / 255) * (temp_high - temp_low))
        # 계산된 온도를 배열에 저장
        temperature_values[i] = temperature
    
    # DataFrame을 생성하기 위한 데이터 준비
    # 각 픽셀의 RGB 값과 온도 값을 결합
    data = {
        'Red': temp_box_image[:, 0, 0],
        'Green': temp_box_image[:, 0, 1],
        'Blue': temp_box_image[:, 0, 2],
        'Temperature': temperature_values.flatten()
    }

    # DataFrame 생성
    df = pd.DataFrame(data)
    
    # k-d tree를 위한 RGB 값과 온도 값 준비
    rgb_values = df[['Red', 'Green', 'Blue']].values
    temperatures = df['Temperature'].values

    # k-d tree 생성
    tree = cKDTree(rgb_values)

    # 다른 이미지 로드
    other_image = crop_img

    # 이미지를 2차원 배열로 변환 (각 행이 픽셀의 RGB 값)
    pixels = other_image.reshape(-1, 3)

    # k-d tree를 사용하여 각 픽셀의 가장 가까운 RGB 값 찾기
    distances, indices = tree.query(pixels)

    # 가장 가까운 RGB 값에 대응하는 온도 찾기
    estimated_temperatures = temperatures[indices]

    # 추정된 온도를 원본 이미지의 형태로 재구성
    temperature_image = estimated_temperatures.reshape(other_image.shape[:2])  

    # 특정 부분의 평균 온도 값    
    average_temperature = np.mean(temperature_image)
    # print(f"Average Temperature: {average_temperature}")
    
    return average_temperature

# 온도 배열을 저장할 리스트
temp_list = []

# 온도 + 에측 저장
total_list = [['1'],[1]]

######### test 용 더미 데이터 넣기 ########

# 초기 온도 설정 더미온도 
initial_temp = random.uniform(17, 18)
temp_difference_limit = 1

# 온도 데이터 생성
temp_demo = [initial_temp]

for _ in range(90):
    # 이전 온도에서 최대 0.1의 차이를 가진 새로운 온도 생성
    new_temp = max(15, min(20, initial_temp + random.uniform(-temp_difference_limit, temp_difference_limit)))
    
    # 생성된 온도를 리스트에 추가
    temp_demo.append(new_temp)
    
    # 생성된 온도를 다음 루프의 초기값으로 설정
    initial_temp = new_temp


# 현재 시간 얻기
current_time = datetime.now()

# 현재 시간을 기준으로 -90 초부터 하나씩 temp_demo의 0번 인덱스와 함께 temp_list에 추가
for i in range(91):
    # 현재 시간에서 i 초 전의 시간 계산
    target_time = current_time - timedelta(seconds=(91 - i))
    
    # 특정 형식으로 현재 시간 출력
    formatted_time = target_time.strftime("%H:%M:%S")
    
    # temp_list에 시간과 온도 데이터 추가
    temp_list.append([formatted_time, round(temp_demo[0],1)])




## yolo_temp_ir
def gen_frames(video_url):
    global temp_demo
    global temp_list
    frame_counter = 0
    cap = cv2.VideoCapture(video_url)
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        if frame_counter % 3 == 0 :
            results = model(frame)
            annotated_frame = results.render()[0]
            
            if frame_counter % 48 == 0:
                bboxes = results.xyxy[0].cpu().numpy()
                if len(bboxes) > 0:
                    cv2.imwrite('./image/img.jpg', frame)

                    annotated_frame = np.array(frame)
                    img_crop = frame[int(bboxes[0][1]):int(bboxes[0][3]),int(bboxes[0][0]):int(bboxes[0][2])]
                    
                    temp = path_temp(frame,img_crop)
                    if temp == -100:
                        continue
                    else :
                        temp = round(temp,1)
                        
                        # 현재 시간 얻기
                        current_time = datetime.now()
                        # 특정 형식으로 현재 시간 출력
                        formatted_time = current_time.strftime("%H:%M:%S")                                   
                        temp_list.append([formatted_time,temp])
                        temp_demo.append(temp)
                                                
                        print(len(temp_list),temp_list[-1], frame_counter)
                        
        # if len(temp_list) >= 300:
        #     temp_demo = temp_demo[-300:]
        #     temp_list = temp_list[-300:]
                        

                            
                            
            
        frame_counter += 1
        
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


## 예측 모델 
def predict_temperature():
    current_time = datetime.now()
    global total_list
    predicted_sequence = []
                        
    num_predictions = 100  # 예측을 원하는 횟수로 조정

    initial_sequence = np.array(temp_demo[-90:])

    # 예측할 시퀀스의 길이만큼 반복하여 예측 수행
    for i in range(1,num_predictions+1):
        # 현재 시퀀스를 모델에 입력하여 다음 값을 예측
        next_value = LSTM_Model.predict(initial_sequence.reshape(1, 90, 1))
        next_value = round(float(next_value[0, 0]), 1)  # float32를 float로 변환
        
        # 현재 시간에서 i 초 이후 시간
        target_time = current_time + timedelta(seconds=(i))
        
        # 특정 형식으로 현재 시간 출력
        formatted_time = target_time.strftime("%H:%M:%S")
        # 예측값을 결과 시퀀스에 추가
        predicted_sequence.append([formatted_time, next_value])
        
        # 예측된 값을 시퀀스에 추가하여 다음 예측에 활용
        initial_sequence = np.append(initial_sequence[1:], next_value)
        
    total_list[0] = temp_list+predicted_sequence
    total_list[1] = len(temp_list)
    
    return total_list
    


## show video

def gen_frames_hd(video_url):
    cap = cv2.VideoCapture(video_url)
    while True:
        success, frame = cap.read()
        if not success:
            break
        frame = cv2.resize(frame, (640, 360))
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def gen_frames_ir(video_url):
    cap = cv2.VideoCapture(video_url)
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        results = model(frame)
        annotated_frame = results.render()[0]
        
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')



def gen_frames_ir3(video_url):
    cap = cv2.VideoCapture(video_url)
    while True:
        success, frame = cap.read()
        if not success:
            break
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')



### detail page

# detail - yolo-temp-ir
@app.route('/video')
def video():
    return Response(gen_frames("rtsp://192.168.1.201/h264"), mimetype='multipart/x-mixed-replace; boundary=frame')


#### cctv page

# hd
@app.route('/video2')
def video2():
    return Response(gen_frames_hd("rtsp://admin:yoseen2018@192.168.1.202/h264/ch1/main/av_stream"), mimetype='multipart/x-mixed-replace; boundary=frame')

# cctv - yolo - ir
@app.route('/video3')
def video3():
    return Response(gen_frames_ir("rtsp://192.168.1.201/h264"), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/video4')
def video4():
    return Response(gen_frames_ir3("rtsp://192.168.1.201/h264"), mimetype='multipart/x-mixed-replace; boundary=frame')


# 정상 온도 가져오기
@app.route('/flask/temp', methods=['GET'])
def send_data_to_react():
    return jsonify(temp_list)


# 이상 온도 + 예측 온도 가져오기
# @app.route('/flask/pre', methods=['GET'])
# def send_data_to_react2():
#     return jsonify(total_list)


# 이상 온도 + 예측 온도 가져오기
@app.route('/flask/predict', methods=['GET'])
def send_data_to_react2():
    total_list = predict_temperature()
    return jsonify(total_list)

if __name__ == '__main__':
    app.run(debug=True)
