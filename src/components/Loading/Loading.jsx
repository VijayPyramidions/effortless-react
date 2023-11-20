import React from 'react';

const Loading = ({ margin }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ffff',
        borderRadius: '12px',
        margin: margin && margin,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '55%',
          transform: 'translate(-50%, -50%)',
          color: '#000',
          fontSize: 30,
          textAlign: 'center',
        }}
      >
        LOADING...
      </div>
    </div>
  );
};

export default Loading;
