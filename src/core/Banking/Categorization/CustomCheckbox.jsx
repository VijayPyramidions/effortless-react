import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import CircleCheckedFilled from '@mui/icons-material/CheckCircle';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';

// a wrapper class for material ui checkbox
// Since you are just using the mui checkbox, simply pass all the props through to restore functionality.
function CheckboxWrapper(props) {
  return (
    <Checkbox
      icon={<CircleUnchecked />}
      checkedIcon={<CircleCheckedFilled />}
      {...props}
    />
  );
}

export default CheckboxWrapper;
