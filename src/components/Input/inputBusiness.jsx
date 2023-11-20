/* @flow */
/**
 * @fileoverview Input cBusinessomponent
 */

import MuiTextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import * as theme from '@root/theme.scss';

const InputBusiness = withStyles({
  root: (props) => {
    // const uppercase = props.uppercase;
    const borderColor =
      props.theme === 'light' ? theme.colorMain : theme.colorWhiteLight;
    const labelColor =
      props.theme === 'light' ? theme.colorGrey : theme.colorWhiteDark;
    const color =
      props.theme === 'light' ? theme.colorDark : theme.colorWhiteDark;
    const formControlMargin =
      props.type !== 'date'
        ? {
            // marginTop: '20px',
            marginLeft: '10px',
            paddingRight: '16px',
          }
        : { margin: '18px 10px' };
    const device = localStorage.getItem('device_detect');
    return {
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      minHeight: '52px',
      backgroundColor: 'rgba(237, 237, 237, 0.15)',
      // marginBottom: '24px',
      ...props.rootStyle,
      '& .MuiInputLabel-root': {
        padding: '0px 15px',
        color: labelColor,
        fontWeight: props.theme !== 'light' && device === 'desktop' ? 300 : 400,
        opacity: props.theme !== 'light' && device === 'desktop' ? 0.8 : 1,
        '&.Mui-error': {
          color: theme.colorError,
        },
      },
      '& .MuiInputLabel-root.MuiInputLabel-shrink': {
        padding: '10px 10px 5px 10px',
        color: '#6e6e6e',
        fontSize: device === 'desktop' ? '18px' : '18px',
        fontWeight: 400,
        textTransform: 'capitalize',
      },
      '& .MuiInputBase-input': {
        backgroundColor: 'none',
        textTransform: props.textTransformChange,
        // props.text === 'capital' ? '' : '',
      },
      '& .MuiInputBase-root': {
        color,
        width: props.type === 'date' ? '80%' : '100%',
        fontWeight: 400,
        fontSize: device === 'desktop' ? '15px' : '12px',
        padding: device === 'desktop' ? '6px 0px 2px 0px' : '10px 0 7px',
      },
      '& label + .MuiInput-formControl': {
        ...formControlMargin,
      },
      '& label.Mui-focused': {
        color: borderColor,
        fontWeight: 400,
      },
      '& .MuiInput-underline:after, .MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before':
        {
          borderBottom: 'none',
        },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          border: 'none',
        },
        '&:hover fieldset': {
          border: 'none',
        },
        '&.Mui-focused fieldset': {
          border: 'none',
        },
      },

      '& .MuiFormHelperText-root': {
        paddingLeft: '8px',
        color: theme.colorError,
        position: 'absolute',
        bottom: '-20px',
        fontSize: '10px',
      },
      '& .MuiInputAdornment-root': {
        margin: '0 4px 12px',
      },
      '& .MuiFormLabel-asterisk': {
        color: 'red',
      },
    };
  },
})(MuiTextField);

export default InputBusiness;
