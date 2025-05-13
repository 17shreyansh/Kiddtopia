import React from 'react';
import waveImage from '../assets/Rectangle 29.png'; // Adjust the path as needed

const ActivityBanner = () => {
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

  const activitiesContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10vw', // Adjusted padding to use vw
    zIndex: 1,
    position: 'relative',
  };

  const activityStyle = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '2.5vw', // Made font size responsive
    textAlign: 'center',
    padding: '0 2vw', // Adjusted padding to use vw
  };

  const dividerStyle = {
    height: '3vw', // Made height responsive
    width: '0.2vw', // Made width responsive
    backgroundColor: 'white',
    margin: '0 2vw', // Adjusted margin to use vw
  };

  const activities = [
    'Auto Run Car Racing',
    'Go Karting',
    'Agent VR Shooting',
    'Trampolines',
  ];

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
      <div style={activitiesContainerStyle}>
        {activities.map((activity, index) => (
          <React.Fragment key={index}>
            <div style={activityStyle}>{activity}</div>
            {index < activities.length - 1 && <div style={dividerStyle}></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ActivityBanner;
