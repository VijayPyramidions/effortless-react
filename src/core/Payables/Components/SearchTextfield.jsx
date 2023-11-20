import { TextField, withStyles } from '@material-ui/core';

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 20,
      },
    },
  },
})(TextField);

export default CssTextField;
