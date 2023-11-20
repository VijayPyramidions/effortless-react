import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import * as theme from '@root/theme.scss';

const CustomCheckbox = withStyles({
  root: {
    color: theme.colorMain,
    '&$checked': {
      color: theme.colorMain,
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default CustomCheckbox;
