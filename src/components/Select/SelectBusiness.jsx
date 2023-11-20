/* @flow */
/**
 * @fileoverview Select component
 */

import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';

import * as theme from '@root/theme.scss';
import { FormHelperText } from '@material-ui/core';

const device = localStorage.getItem('device_detect');
const SimpleSelect = withStyles({
  filled: (props) => ({
    borderRadius: '10px',
    border: props.light
      ? `1px solid ${theme.colorWhiteLight}`
      : props.borderChange,
    fontWeight: 400,
    color: props.light ? theme.colorWhiteDark : theme.colorDark,
    height: device === 'desktop' ? '25%' : '',
    minHeight: device === 'desktop' ? '0px' : '',
  }),
  icon: (props) => ({
    color: props.light ? theme.colorWhiteLight : theme.colorInputLabel,
  }),
})(Select);

const useStyles = makeStyles(() => ({
  formControl: {
    borderRadius: '10px',
    width: '100%',
    // marginBottom: '24px',
    '& .MuiFilledInput-underline:before, .MuiFilledInput-underline:after': {
      border: 'none',
    },
    '& .MuiFilledInput-root, & .MuiSelect-select:focus': {
      backgroundColor: 'transparent',
      borderRadius: '10px',
      fontSize: device === 'mobile' ? '14px' : '16px',
    },
    '& .MuiFormHelperText-root': {
      paddingLeft: '8px',
      color: theme.colorError,
      position: 'absolute',
      bottom: '-20px',
      fontSize: '10px',
      marginLeft: 'unset',
    },
  },
  inputLabel: ({ light }) => ({
    color: light ? theme.colorWhiteLight : theme.colorInputLabel,
    fontWeight: 400,
    fontSize: device === 'desktop' ? '14px' : '14px',
    '&.Mui-focused': {
      color: light ? theme.colorWhiteLight : theme.colorMain,
      fontWeight: 400,
    },
  }),
  menuItem: {
    fontWeight: 400,
  },
  icon: ({ light }) => ({
    color: light ? theme.colorWhiteLight : theme.colorMain,
  }),
}));

const MuiSelect = ({
  name,
  onBlur,
  error,
  helperText,
  className,
  label,
  options,
  defaultValue,
  onChange,
  light,
  style,
  borderChange,
  disabled,
}) => {
  const classes = useStyles({ light });
  return (
    <FormControl
      variant="filled"
      classes={{ root: `${classes.formControl} ${className || ''}` }}
      error={error}
      style={style}
      disabled={disabled}
    >
      <InputLabel
        id="demo-simple-select-filled-label"
        classes={{ root: classes.inputLabel }}
      >
        {label}
      </InputLabel>
      <SimpleSelect
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={defaultValue}
        onChange={onChange}
        borderChange={borderChange}
        IconComponent={ExpandMoreOutlinedIcon}
        {...{ name, onBlur }}
        light={light}
      >
        {options?.map((o) => (
          <MenuItem
            key={o.payload}
            value={o.payload}
            classes={{ root: classes.menuItem }}
          >
            {o.text}
          </MenuItem>
        ))}
      </SimpleSelect>
      {error && (
        <FormHelperText style={{ whiteSpace: 'nowrap' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default MuiSelect;
