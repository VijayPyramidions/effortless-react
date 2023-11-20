/* eslint-disable react/jsx-boolean-value */
/* @flow */
/**
 * @fileoverview Input component
 */

import MuiTextField from '@material-ui/core/TextField';
// import * as Mui from '@mui/material';
import { withStyles } from '@material-ui/core/styles';
import * as theme from '@root/theme.scss';
import { NumericFormat, PatternFormat } from 'react-number-format';
// PatternFormat } from 'react-number-format';
import React from 'react';

const Input = withStyles({
  root: (props) => {
    const borderColor =
      props.theme === 'light' ? theme.colorMain : theme.colorWhiteLight;
    const labelColor =
      props.theme === 'light' ? theme.colorGrey : theme.colorWhiteDark;
    const color =
      props.theme === 'light' ? theme.colorDark : theme.colorWhiteDark;
    const formControlMargin =
      props.type !== 'date'
        ? {
            marginTop: '20px',
            paddingLeft: '10px',
            paddingRight: '16px',
          }
        : { margin: '18px 10px' };
    const device = localStorage.getItem('device_detect');
    return {
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      minHeight: '56px',
      background: props?.disabled ? '#F2F2F2' : 'transparent',
      // marginBottom: '24px',
      ...props.rootStyle,

      '&::befor': {
        content: '>',
      },
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
        padding: '10px 10px',
        fontSize:
          props.theme !== 'light' && device === 'desktop' ? '10px' : '14px',
      },
      '& .MuiInputBase-input': {
        textTransform:
          props.text === 'capital'
            ? 'uppercase'
            : (props.text === 'capitalize' && 'capitalize') || 'none',
        cursor: props.Fieldselect ? 'pointer !important' : '',
        caretColor: props.Fieldselect ? 'transparent' : '',
        backgroundColor: 'none',
      },
      '& .MuiInputBase-root': {
        color,
        width: props.type === 'date' ? '80%' : '100%',
        fontWeight: 400,
        fontSize: '14px',
      },
      '& label + .MuiInput-formControl': {
        ...formControlMargin,
      },
      '& label.Mui-focused': {
        color: labelColor,
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
        fontSize: '.5rem',
      },
      '& .MuiInputAdornment-root': {
        margin: '0 4px 12px',
      },
      '& .MuiFormLabel-asterisk': {
        color: 'red',
      },
      '& .MuiInput-root': {
        '& ::placeholder': {
          /* Chrome, Firefox, Opera, Safari 10.1+ */
          color: props?.type === 'number' && '#000',
          opacity: props?.type === 'number' ? 1 : 0.5 /* Firefox */,
        },

        '& :-ms-input-placeholder': {
          /* Internet Explorer 10-11 */
          color: props?.type === 'number' && '#000',
        },

        '& ::-ms-input-placeholder': {
          /* Microsoft Edge */ color: props?.type === 'number' && '#000',
        },
      },
    };
  },
})(MuiTextField);

export default Input;

export const InputText = withStyles({
  root: (props) => {
    // const borderColor =
    //   props.theme === 'light' ? theme.colorMain : theme.colorWhiteLight;
    // const labelColor =
    //   props.theme === 'light' ? theme.colorGrey : theme.colorWhiteDark;
    // const color =
    //   props.theme === 'light' ? theme.colorDark : theme.colorWhiteDark;
    const formControlMargin =
      props.type !== 'date'
        ? {
            marginTop: '24px',
            paddingLeft: '12px',
            paddingRight: '12px',
          }
        : { margin: '18px 10px' };
    const device = localStorage.getItem('device_detect');
    return {
      border: '1px solid rgba(153, 158, 165, 0.39)',
      borderRadius: '8px',
      minHeight: '56px',
      ...props.rootStyle,

      '& .MuiInputLabel-root': {
        padding: '0px 15px',
        color: '#6E6E6E',
        fontWeight: props.theme !== 'light' && device === 'desktop' ? 300 : 400,
        opacity: props.theme !== 'light' && device === 'desktop' ? 0.8 : 1,
        '&.Mui-error': {
          color: theme.colorError,
        },
      },
      '& .MuiInputLabel-root.MuiInputLabel-shrink': {
        padding: '12px',
        color: '#6E6E6E',
        fontSize:
          props.theme !== 'light' && device === 'desktop' ? '10px' : '14px',
      },
      '& .MuiInputBase-input': {
        textTransform:
          props.text === 'capital'
            ? 'uppercase'
            : (props.text === 'capitalize' && 'capitalize') || 'none',
        cursor: props.Fieldselect ? 'pointer !important' : '',
        caretColor: props.Fieldselect ? 'transparent' : '',
        backgroundColor: 'none',
      },
      '& .MuiInputBase-root': {
        // color,
        width: props.type === 'date' ? '80%' : '100%',
        fontWeight: 400,
        fontSize: '14px',
      },
      '& label + .MuiInput-formControl': {
        ...formControlMargin,
      },
      '& label.Mui-focused': {
        color: '#6E6E6E',
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
        bottom: '-15px',
        fontSize: '.5rem',
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

export const AmountFormatCustom = ({
  inputRef,
  onChange,
  align,
  exception,
  ...other
}) => {
  return (
    <>
      <NumericFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          if (exception) {
            onChange({
              target: {
                name: other.name,
                value: values.formattedValue,
              },
            });
          } else {
            onChange({
              target: {
                name: other.name,
                formattedValue: values.formattedValue,
                value: values.value,
              },
            });
          }
        }}
        thousandSeparator=","
        valueIsNumericString
        thousandsGroupStyle="lakh"
        allowNegative={false}
        style={{ textAlign: align ? 'right' : 'left' }}
        // isNumericString
      />
      {/*  */}
    </>
  );
};

export const MobileNumberFormatCustom = ({
  inputRef,
  onChange,
  align,
  ...other
}) => {
  return (
    <PatternFormat
      {...other}
      // getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: other.name,
            //            value: values.formattedValue,
            value: values.value,
          },
        });
      }}
      format="##########"
      mask=" "
      allowEmptyFormatting
      valueIsNumericString
      // thousandSeparator
      // thousandsGroupStyle="lakh"
      allowNegative={false}
      style={{ textAlign: align ? 'right' : 'left' }}
      // isNumericString
    />
  );
};
