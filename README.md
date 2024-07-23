주제 : 열화상 카메라 활용 전기설비 이상 유무 판단 시스템 </br>
기간 : 2023.10.26 ~ 2023.12.03 </br>
인원 : 5명   </br>
활용기술 : Node.js, Flask, Python, Yolov5, LSTM, OCR  </br>

---

[flask]

/flask/appp2.py

[학습된 딥러닝 모델]

model : yolov5 모델

LSTM_Model : LSTM 모델

[온도 임시 저장 변수]

temp_list : 측정온도 배열

total_list : 측정 온도 + 예측 온도 배열

[함수]

img2OCR(이미지) : OCR 활용하여 이미지에서 숫자 추출 함수

path_temp (원본이미지, 객체탐지이미지) : 전기 설비의 평균 온도를 추출하는 함수

predict_temperature : temp_list 의 온도를 사용하여, 나중 온도를 LSTM 모델로 예측하고, total_list 에 저장하는 함수

gen_frames : 객체탐지 model 사용하여 전기설비를 탐지하고, path_temp 에 전달해서 설비 온도 추출 하여, temp_list 에 현재 시간과 함께 저장하고, ir 객체탐지 영상 송출

gen_frames_hd :  hd 영상 송출

gen_frames_ir : yolo 객체 탐지된 영상 송출

gen_frames_ir3 :  ir 영상 송출

@app.route

/video 요청 ->   gen_frames 요청

/video2 요청 ->  gen_frames_hd 요청

/video3 요청 ->  gen_frames_ir 요청

/video4 요청 ->  gen_frames_ir3 요청

/flask/temp 요청 -> temp_list 반환

/flask/predict 요청 -> total_list 반환

[부가설명]

/video 요청 -> gen_frames 에서 yolo model 사용, img_crop (객체영역) 을 얻고, path_temp 를 호출한다.

path_temp 는 img2OCR 을 이용하여 원본 열화상 이미지의 최고, 최저 온도를 구하고 rgb 픽셀 값을 비교하여 객체 평균온도를 구하여 반환한다.

gen_frames 에서 평균온도를 계산된 시간과 함께 temp_list 에 임시 저장하고, ir 객체 탐지 영상을 송출한다.


[react]

/project/src/components/VideoPlayer/RealVideoPlayer.jsx 

'isHD' 의 상태에 따라서 video2 , video3 를 요청한다. 

ir 영상과 hd 영상을 전환하는 toggle 기능

/project/src/pages/VideoDetailPage/RealVideoDetailPage.jsx

[함수]

onTemp : /flask/temp api 요청 

onPredict : /flask/predict api 요청


useEffect 를 통해 초기값으로 1회 onTemp 요청 -> 설비온도 반환 -> last_temp 저장 

useEffect 에 setInterval 사용하여 설비 온도 주기적으로 요청하는데

단, 마지막 온도(last_temp)가 기준 온도(temp_fa)보다 높으면 onPredict , 낮으면 onTemp 
