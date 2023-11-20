/* @flow */
/**
 * @fileoverview Select component
 */

import React from 'react';
import * as Mui from '@mui/material';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  FormHelperText,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import * as theme from '@root/theme.scss';

const device = localStorage.getItem('device_detect');
const SimpleSelect = withStyles({
  filled: (props) => ({
    borderRadius: '10px',
    border: props.light
      ? `1px solid ${theme.colorWhiteLight}`
      : `1px solid ${theme.colorInputLabel}`,
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
    fontSize: device === 'desktop' ? '13px' : '14px',
    fontFamily: 'Lexend, sans- serif!important',
    '&.Mui-focused': {
      color: light ? theme.colorWhiteLight : theme.colorMain,
      fontWeight: 400,
    },
    '&.Mui-disabled': {
      // color: light ? theme.colorWhiteLight : theme.colorMain,
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
  disabled,
  multiple,
  renderValue,
  // IconComponent,
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
        id="grouped-native-select"
        value={defaultValue}
        onChange={onChange}
        IconComponent={ExpandMoreOutlinedIcon}
        {...{ name, onBlur }}
        light={light}
        multiple={multiple}
        renderValue={renderValue}
        // IconComponent={IconComponent}
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

const useStyles2 = makeStyles(() => ({
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
    fontSize: device === 'desktop' ? '18px' : '14px',
    '&.Mui-focused': {
      color: light ? theme.colorWhiteLight : theme.colorMain,
      fontWeight: 400,
    },
    '&.Mui-disabled': {
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
  lableField: {
    fontSize: '9px !important',
    fontWeight: '300 !important',
    fontFamily: 'Lexend, sans-serif !important',
  },
}));

const useStyles3 = makeStyles(() => ({
  formControl: {
    borderRadius: '10px',
    width: '100%',
    marginBottom: '16px',
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

    '& .MuiOutlinedInput-notchedOutline': {
      background: 'transparent',
    },
  },
  inputLabel: ({ light }) => ({
    fontWeight: 400,
    fontSize: '10px',
    fontFamily: 'Lexend, sans-serif !important',
    color: '#6E6E6E',
    marginTop: '-11px',
    '&.Mui-focused': {
      color: light ? theme.colorWhiteLight : theme.colorMain,
      fontWeight: 400,
    },
    '&.Mui-disabled': {
      // color: light ? theme.colorWhiteLight : theme.colorMain,
      fontWeight: 400,
    },
  }),
  menuItem: {
    fontWeight: 400,
    '&.MuiListItem-root.Mui-selected': {
      color: '#F08B32 !important',
    },
  },
  icon: ({ light }) => ({
    color: light ? theme.colorWhiteLight : theme.colorMain,
  }),
  lableField: {
    fontSize: '14px !important',
    fontWeight: '300 !important',
    fontFamily: 'Lexend, sans-serif !important',
    color: '#6E6E6E',
  },
}));

export const MultipleSelect = ({
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
  disabled,
  multiple,
  renderValue,
  // IconComponent,
  required,
}) => {
  const classes = useStyles2({ light });
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
        style={{ marginTop: '-15px' }}
      >
        <Mui.Stack direction="row">
          <Mui.Typography variant="caption">{label}</Mui.Typography>
          {required && (
            <Mui.Typography sx={{ color: 'red', fontSize: '12px' }}>
              *
            </Mui.Typography>
          )}
        </Mui.Stack>
      </InputLabel>
      <Mui.Select
        sx={{
          '& .MuiSelect-select': {
            borderRadius: '10px !important',
            padding: '25px 14px 14px !important',
          },
          '& fieldset': {
            borderRadius: '10px !important',
            border: '1px solid rgb(160, 164, 175) !important',
          },
          '& input,button,svg': {
            zIndex: 1,
            color: '#000000',
          },
          '&:hover fieldset': {
            borderRadius: '10px !important',
            border: '1px solid rgb(160, 164, 175) !important',
            color: '#000000',
          },
        }}
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={defaultValue}
        onChange={onChange}
        IconComponent={ExpandMoreOutlinedIcon}
        {...{ name, onBlur }}
        light={light}
        multiple={multiple}
        renderValue={renderValue}
        // IconComponent={IconComponent}
        disabled={disabled}
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
      </Mui.Select>

      {error && (
        <FormHelperText style={{ whiteSpace: 'nowrap' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export const SingleSelect = ({
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
  disabled,
  multiple,
  renderValue,
  // IconComponent,
  required,
  fromFill,
}) => {
  const classes = useStyles2({ light });
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
        style={{ marginTop: '-15px' }}
      >
        <Mui.Stack direction="row">
          <Mui.Typography
            variant="caption"
            classes={{ root: classes.lableField }}
            sx={{ color: fromFill ? '#ffffffcc' : '#6E6E6E' }}
          >
            {label}
          </Mui.Typography>
          {required && (
            <Mui.Typography sx={{ color: 'red', fontSize: '12px' }}>
              &nbsp;*
            </Mui.Typography>
          )}
        </Mui.Stack>
      </InputLabel>
      <Mui.Select
        sx={{
          '& .MuiSelect-select': {
            borderRadius: '10px !important',
          },
          '& .MuiSelect-outlined': {
            p: '23px 12px 12px',
          },
          '& fieldset': {
            borderRadius: '10px !important',
            border: fromFill
              ? '1px solid rgba(255, 255, 255, 0.2) !important'
              : '1px solid rgb(160, 164, 175) !important',
          },
          '& input,button,svg': {
            zIndex: 1,
            color: fromFill ? '#fff' : '#000000',
          },
          '&:hover fieldset': {
            borderRadius: '10px !important',
            border: fromFill
              ? '1px solid rgba(255, 255, 255, 0.2) !important'
              : '1px solid rgb(160, 164, 175) !important',
            color: '#000000',
          },
          '& .MuiInputBase-input': {
            color: fromFill ? '#fff !important' : '#000 !important',
          },
        }}
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={defaultValue}
        onChange={onChange}
        IconComponent={ExpandMoreOutlinedIcon}
        {...{ name, onBlur }}
        light={light}
        multiple={multiple}
        renderValue={renderValue}
        // IconComponent={IconComponent}
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
      </Mui.Select>

      {error && (
        <FormHelperText style={{ whiteSpace: 'nowrap' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export const SelectField = ({
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
  disabled,
  multiple,
  renderValue,
  // IconComponent,
  required,
  fromFill,
  PaperProps,
  MenuItemProps,
}) => {
  const classes = useStyles3({ light });
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
        style={{ marginTop: defaultValue && '0px' }}
      >
        {label}

        {required && (
          <span style={{ color: 'red', fontSize: '12px', marginLeft: '2px' }}>
            *
          </span>
        )}
      </InputLabel>
      <Mui.Select
        sx={{
          '& .MuiSelect-select': {
            borderRadius: '10px !important',
          },
          '& .MuiSelect-outlined': {
            p: '28px 12px 7px',
          },
          '& fieldset': {
            borderRadius: '8px !important',
            border: fromFill
              ? '1px solid rgba(153, 158, 165, 0.39) !important'
              : '1px solid rgba(153, 158, 165, 0.39) !important',
            background: 'rgba(237, 237, 237, 0.15)',
          },
          '& input,button,svg': {
            zIndex: 1,
            color: fromFill ? '#283049' : '#283049',
            marginTop: '-13px',
            fontSize: '18px',
          },
          '&:hover fieldset': {
            borderRadius: '10px !important',
            border: fromFill
              ? '1px solid rgba(153, 158, 165, 0.39) !important'
              : '1px solid rgba(153, 158, 165, 0.39) !important',
            color: '#000000',
          },
          '& .MuiInputBase-input': {
            color: fromFill
              ? 'rgba(0, 0, 0, 0.87) !important'
              : 'rgba(0, 0, 0, 0.87) !important',
            fontSize: '14px !important',
          },
        }}
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={defaultValue}
        onChange={onChange}
        IconComponent={KeyboardArrowDownRoundedIcon}
        {...{ name, onBlur }}
        light={light}
        multiple={multiple}
        renderValue={renderValue}
        // IconComponent={IconComponent}
        MenuProps={{
          PaperProps: { ...PaperProps },
        }}
        disabled={disabled}
      >
        {options?.map((o) => (
          <MenuItem
            key={o.payload}
            value={o.payload}
            classes={{ root: classes.menuItem }}
            style={{ ...MenuItemProps }}
          >
            {o.text}
          </MenuItem>
        ))}
      </Mui.Select>

      {error && (
        <FormHelperText
          style={{ whiteSpace: 'nowrap', fontSize: '0.5rem', bottom: '-11px' }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export const SelectFieldExpense = ({
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
  disabled,
  multiple,
  renderValue,
  // IconComponent,
  required,
  fromFill,
  PaperProps,
  MenuItemProps,
}) => {
  const classes = useStyles3({ light });
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
        style={{ marginTop: defaultValue && '0px' }}
      >
        {label}

        {required && (
          <span style={{ color: 'red', fontSize: '12px', marginLeft: '2px' }}>
            *
          </span>
        )}
      </InputLabel>
      <Mui.Select
        sx={{
          '& .MuiSelect-select': {
            borderRadius: '10px !important',
          },
          '& .MuiSelect-outlined': {
            p: '28px 12px 7px',
          },
          '& fieldset': {
            borderRadius: '8px !important',
            border: fromFill
              ? '1px solid rgba(153, 158, 165, 0.39) !important'
              : '1px solid rgba(153, 158, 165, 0.39) !important',
            background: 'rgba(237, 237, 237, 0.15)',
          },
          '& input,button,svg': {
            zIndex: 1,
            color: fromFill ? '#283049' : '#283049',
            marginTop: '-13px',
            fontSize: '18px',
          },
          '&:hover fieldset': {
            borderRadius: '10px !important',
            border: fromFill
              ? '1px solid rgba(153, 158, 165, 0.39) !important'
              : '1px solid rgba(153, 158, 165, 0.39) !important',
            color: '#000000',
          },
          '& .MuiInputBase-input': {
            color: fromFill
              ? 'rgba(0, 0, 0, 0.87) !important'
              : 'rgba(0, 0, 0, 0.87) !important',
            fontSize: '14px !important',
          },
        }}
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={defaultValue}
        onChange={onChange}
        IconComponent={KeyboardArrowDownRoundedIcon}
        {...{ name, onBlur }}
        light={light}
        multiple={multiple}
        renderValue={renderValue}
        // IconComponent={IconComponent}
        MenuProps={{
          PaperProps: { ...PaperProps },
        }}
        disabled={disabled}
      >
        {options?.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
            classes={{ root: classes.menuItem }}
            style={{ ...MenuItemProps }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Mui.Select>

      {error && (
        <FormHelperText
          style={{ whiteSpace: 'nowrap', fontSize: '0.5rem', bottom: '-15px' }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

const useStylesSelect = makeStyles(() => ({
  mainRoot: {
    background: 'rgba(237, 237, 237, 0.15)',
    border: '1.0192px solid rgba(153, 158, 165, 0.39)',
    borderRadius: '12px',
    padding: '8px 6px 9px 12px',
    marginBottom: '16px',
    cursor: 'pointer',
  },
  labelWRP: {
    flexDirection: 'row !important',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontWeight: 400,
    fontSize: '10px',
    fontFamily: 'Lexend, sans-serif !important',
    color: '#6E6E6E',
  },
  arrowIcon: {
    fontSize: '18px !important',
    color: '#283049',
  },
  inputValue: {
    fontSize: '14px !important',
    fontWeight: '400 !important',
    color: '#283049 !important',
    height: '21px !important',
  },
}));

export const SelectAutoComplete = ({
  label,
  required,
  value,
  error,
  helperText,
  ...rest
}) => {
  const classes = useStylesSelect();

  return (
    <Mui.Stack
      className={classes.mainRoot}
      {...rest}
      sx={{ position: 'relative' }}
    >
      <Mui.Stack className={classes.labelWRP}>
        <InputLabel
          className={classes.inputLabel}
          style={error ? { color: 'rgb(216, 0, 12)' } : {}}
        >
          {label}

          {required && (
            <span style={{ color: 'red', fontSize: '12px', marginLeft: '2px' }}>
              *
            </span>
          )}
        </InputLabel>
        <KeyboardArrowDownRoundedIcon className={classes.arrowIcon} />
      </Mui.Stack>
      <Mui.Typography className={classes.inputValue}>{value}</Mui.Typography>
      {error && (
        <FormHelperText
          style={{
            whiteSpace: 'nowrap',
            fontSize: '0.5rem',
            bottom: '-14px',
            left: '7px',
            position: 'absolute',
            color: 'rgb(216, 0, 12)',
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Mui.Stack>
  );
};
