import * as React from 'react';
import * as Mui from '@mui/material';

const InputCategoriz = () => {
  return (
    <Mui.Grid item xs={12}>
      <input
        type="text"
        placeholder="Enter Amount"
        style={{
          fontWeight: 300,
          fontSize: ' 9px',
          lineHeight: ' 11px',
          width: '63px',
          height: '22px',
          border: '0.5px solid rgba(217, 217, 217, 0.8)',
          backgroundColor: 'rgba(234, 232, 232, 0.26)',
          boxSizing: 'border-box',
          borderRadius: '5px',
          color: ' rgba(51, 51, 51, 0.64)',
        }}
      />
    </Mui.Grid>
  );
};
export default InputCategoriz;
