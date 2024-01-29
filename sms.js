const sms = () => {

  const path = require("path");
  const { SolapiMessageService } = require('solapi');
  const dotenv = require('dotenv');
  dotenv.config();

  // 이미지가 저장 되어있는 로컬폴더
  const img_path = "./flask/image/img.jpg";

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}시 ${minutes}분`;
  };

  const sendMessage = async () => {
    const messageService = new SolapiMessageService(process.env.SOLAPI_API_KEY, process.env.SOLAPI_API_SECRET);

    // MMS 용 이미지 업로드에는 200kb 이내의 jpg 파일만 업로드할 수 있습니다!
    const imageId = await messageService.uploadFile(path.join(__dirname, img_path), "MMS")
      .then(res => res.fileId)
      .catch(err => console.log(`메시지 전송 에러 ${err}`));

    const currentTime = getCurrentTime();

    messageService.send({
      "imageId": imageId,
      "to": "",
      "from": "",
      "subject": "[Eyes on] 이상알림",
      "text": `[Eyes on] ${currentTime}, 01번, 1F - 작업실 배전반 이상 알림`
    });
  };

  // sendMessage 함수를 호출
  sendMessage();

};

module.exports = sms;