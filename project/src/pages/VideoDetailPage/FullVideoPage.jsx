import React from 'react';
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';

const FullVideoPage = () => {
  const { videoInfo } = useParams();
  const [videoId, videoType] = videoInfo.split('&');
  const navigate = useNavigate();

  return (
    <div className='full_video_page'>
      <video src={`/videos/video_${videoId}_type_${videoType}.mp4`} muted autoPlay playsInline loop className='full_video'></video>
      <button type='button' className='btn_close' onClick={() => navigate(-1)}><MdClose /></button>
    </div>
  );
};

export default FullVideoPage;