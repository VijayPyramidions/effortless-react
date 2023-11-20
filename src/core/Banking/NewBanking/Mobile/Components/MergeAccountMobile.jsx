import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MergeAccounts from '../../Web/Components/MergeAccounts';

const MergeAccountMobile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <MergeAccounts
      data={location.state.oneBankList}
      onClose={() => navigate(-1)}
    />
  );
};

export default MergeAccountMobile;
