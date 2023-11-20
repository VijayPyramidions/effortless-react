import React from 'react';
import BankStatementMobile from '../Mobile/Statement/BankStatementMobile';
import BankStatementWeb from './BankStatementWeb';

const BankStatement = () => {
  const device = localStorage.getItem('device_detect');

  return device === 'desktop' ? <BankStatementWeb /> : <BankStatementMobile />;
};

export default BankStatement;
