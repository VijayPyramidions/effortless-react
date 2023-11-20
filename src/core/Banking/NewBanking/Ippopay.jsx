import React, { useState, useEffect } from 'react';
import { Ippopay } from 'react-ippopay';
import { useLocation } from 'react-router-dom';

const IppopayComponent = ({ orderId, publicKey, ippopayHandler }) => {
  const location = useLocation();
  const { state } = location;
  const [ippoState, setippoState] = useState({
    ippopayOpen: true,
    order_id: '',
    public_key: '',
    ippopayclose: true,
  });

  useEffect(() => {
    setippoState({
      ...ippoState,
      order_id: state?.order_id || orderId,
      public_key: state?.public_key || publicKey,
    });
  }, [location, orderId, publicKey]);

  useEffect(() => {
    window.addEventListener('message', ippopayHandler);
    return () => {
      window.removeEventListener('message');
    };
  }, []);

  return (
    <div>
      <Ippopay
        ippopayOpen={ippoState.ippopayOpen}
        ippopayClose={ippoState.ippopayclose}
        order_id={ippoState.order_id}
        public_key={ippoState.public_key}
      />
    </div>
  );
};

export default IppopayComponent;
