import React from 'react';
import "./fullScreenLoader.css";

const FullScreenLoader = () => {
  return (
    <div className='fullscreenloader-overlay'>
        <div className="fullscreenloader"></div>
    </div>
  )
}

export default FullScreenLoader