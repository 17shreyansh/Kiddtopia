import React from 'react';
import { Link } from "react-router-dom";

import waveImage from '../assets/Rectangle 29.png'; // Adjust the path as needed

const Wave4 = () => {
  const containerStyle = {
    width: '100%',
    position: 'relative',
    height: '29vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#F8F1E3',
  };

  const contentContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10vw',
    zIndex: 1,
    position: 'relative',
  };

  const headingStyle = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '3vw',
    maxWidth: '80%',
  };

 

  return (
    <div style={containerStyle}>
      <img
        src={waveImage}
        alt="Wave Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 0,
          objectFit: 'contain',
        }}
      />
      <div style={contentContainerStyle}>
        <div style={headingStyle}>
          Create Your Profile Today
        </div>
<Link to="/auth" style={{ textDecoration: "none" }}>
  <button style={{ width: "200px" }} className="btn">
    Create Profile
  </button>
</Link>      </div>
    </div>
  );
};

export default Wave4;
