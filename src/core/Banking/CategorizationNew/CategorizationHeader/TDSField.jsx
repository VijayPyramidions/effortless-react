import React,{ useEffect, useState } from 'react';
import { Box } from '@mui/material';
import * as css from './CategorizationHeader.scss';

const TDSField = ({ tdspercentagestate, settdspercentagestate,status }) => {
  const [tdsValue,setTdsValue] = useState();
  const handleKeyPress = (e) => {
    const isValidKey = /[0-9]/i.test(e.key);
    if (!isValidKey) {
      e.preventDefault();
    }
  };
  useEffect(()=>{
    if (tdsValue <= 30 && tdsValue > 0) {
      settdspercentagestate(String(tdsValue));
    } else {
      settdspercentagestate('');
    }
  },[tdsValue]);
  return (
    <>
      <div className={css.TdsContainer}>
        <Box component="div" className={css.tdsinnerbox}>
          <span className={css.label}>TDS</span>
          <div className={css.amountData}>
            <input
              type="number"
              // placeholder="10"
              className={css.maintdsinputfield}
              value={tdspercentagestate}
              onChange={(e) => {
                setTdsValue(parseInt(String(e.target.value),10));
              }}
              onKeyPress={handleKeyPress}
              disabled={status === 'Edit'}
            />
            <span className={css.mspercent}>%</span>
          </div>
        </Box>
      </div>
    </>
  );
};

export default TDSField;
