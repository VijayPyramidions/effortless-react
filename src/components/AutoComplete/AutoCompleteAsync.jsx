/* @flow */
/**
 * @fileoverview Autocomplete search component
 */

import React, { useEffect, useState } from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as theme from '@root/theme.scss';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const TextField = withStyles({
  root: {
    border: `1px solid ${theme.colorInputLabel}`,
    borderRadius: '8px',
    minHeight: '56px',
    // marginBottom: '24px',
    '& .MuiInputLabel-root': {
      padding: '10px 15px',
      color: theme.colorGrey,
      fontWeight: 400,
      transform: 'translate(5px, 13px) scale(1)',
      '&.Mui-error': {
        color: theme.colorGrey,
      },
    },
    '& .MuiInputBase-root': {
      color: theme.colorDark,
      width: '100%',
      fontWeight: 400,
      fontSize: '14px',
    },
    '& label.Mui-focused': {
      color: theme.colorMain,
      fontWeight: 400,
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(0px, 0px) scale(0.75)',
    },
    '& .MuiInput-underline:after, .MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before':
      {
        borderBottom: 'none',
      },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':
      {
        padding: '13.5px 0px',
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
    '& .MuiSvgIcon-root': {
      color: `${theme.colorInputLabel} !important`,
    },
  },
})(MuiTextField);

const AutoCompleteAsync = ({
  promiseCall,
  getOptionSelected,
  getOptionLabel,
  label,
  onChange,
  value,
  helperText,
  error,
  initialOptions = [],
  valueList,
}) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [options, setOptions] = useState(initialOptions);
  const loading = open && options.length === 0;

  React.useEffect(() => setLocalValue(value), [value]);

  useEffect(() => {
    if (loading && promiseCall) {
      promiseCall().then((res) => {
        if (res && !res.error) {
          setOptions(res.data);
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
    if (open && valueList?.length > 0) {
      setOptions(valueList);
    }
  }, [open, valueList]);

  return (
    <Autocomplete
      id="asyncSearch"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={localValue}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      onChange={(e, newValue) => {
        setLocalValue(newValue);
        onChange(e, newValue);
      }}
      popupIcon={<ExpandMoreOutlinedIcon style={{ color: theme.colorMain }} />}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            shrink: true,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutoCompleteAsync;

const TextField2 = withStyles({
  root: {
    border: '1.0192px solid rgba(153, 158, 165, 0.39)',
    borderRadius: '8px',
    minHeight: '56px',
    // marginBottom: '24px',
    '& .MuiInputLabel-root': {
      // padding: '10px 15px',
      // color: theme.colorGrey,
      // fontWeight: 400,
      // transform: 'translate(5px, 13px) scale(1)',
      // '&.Mui-error': {
      //   color: theme.colorGrey,
      // },
      padding: '6px 0 0 9px',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '10.5px',
      lineHeight: '18px',
      color: '#6E6E6E',
      '& .MuiFormLabel-asterisk': {
        color: 'red',
      },
    },
    '& .MuiInputBase-root': {
      color: theme.colorDark,
      width: '100%',
      fontWeight: 400,
      fontSize: '14px',
      padding: '12px',
    },
    '& label.Mui-focused': {
      color: '#6E6E6E',
      fontWeight: 400,
    },
    '& .MuiInputLabel-outlined': {
      transform: 'none',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'none',
    },
    '& .MuiInput-underline:after, .MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before':
      {
        borderBottom: 'none',
      },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':
      {
        padding: ' 0px',
        marginTop: '15px',
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
    '& .MuiSvgIcon-root': {
      zIndex: 1,
      color: '#283049',
      // marginTop: '-13px',
      fontSize: '18px',
    },
  },
})(MuiTextField);

export const StyledAutoComplete = ({
  className,
  promiseCall,
  getOptionSelected,
  getOptionLabel,
  label,
  onChange,
  value,
  helperText,
  error,
  initialOptions = [],
}) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [options, setOptions] = useState(initialOptions);
  const loading = open && options.length === 0;

  React.useEffect(() => setLocalValue(value), [value]);

  useEffect(() => {
    if (loading) {
      promiseCall().then((res) => {
        if (res && !res.error) {
          setOptions(res.data);
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asyncSearch"
      className={className}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={localValue}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      onChange={(e, newValue) => {
        setLocalValue(newValue);
        onChange(e, newValue);
      }}
      popupIcon={<KeyboardArrowDownRoundedIcon />}
      renderInput={(params) => (
        <TextField2
          {...params}
          label={label}
          variant="outlined"
          error={error}
          required
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            shrink: true,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
