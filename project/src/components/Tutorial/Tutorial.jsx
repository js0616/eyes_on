import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const Tutorial = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["홈 페이지", "CCTV 페이지", "상세 페이지"];

  const handleModalContentClick = (e) => {
    e.stopPropagation(); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <div className="tab-box">
          <div className="img-box">
            <img src={`/images/Main-01.png`} alt={`메인페이지-1`}></img>
          </div>
          <div className="img-box">
            <img src={`/images/Main-2.png`} alt={`메인페이지-2`}></img>
          </div>
        </div>;
      case 1:
        return <div className="tab-box">
          <div className="img-box">
            <img src={`/images/Cctv-1.png`} alt={`CCTV페이지-1`}></img>
          </div>
          <div className="img-box">
            <img src={`/images/Cctv-2.png`} alt={`CCTV페이지-2`}></img>
          </div>
        </div>;
      case 2:
        return <div className="tab-box">
          <div className="img-box">
            <img src={`/images/Detail-1.png`} alt={`상세페이지-1`}></img>
          </div>
          <div className="img-box">
            <img src={`/images/Detail-2.png`} alt={`상세페이지-2`}></img>
          </div>
        </div>;
    }
  };

  return (
    <div className="tutorial" onClick={handleModalContentClick}>
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button key={index} onClick={() => setActiveTab(index)} className={activeTab === index ? "active" : ""}> {tab} </button>))}
          <button className='md_close' onClick={onClose}><MdClose /></button>
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default Tutorial;
