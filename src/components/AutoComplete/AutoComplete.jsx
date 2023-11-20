/* @flow */
/**
 * @fileoverview Autocomplete search component
 */

import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as theme from '@root/theme.scss';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';

const TextField = withStyles({
  root: {
    border: `1px solid ${theme.colorGrey}`,
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
  },
})(MuiTextField);

const AutoComplete = ({
  getOptionSelected,
  getOptionLabel,
  label,
  onChange,
  value,
  helperText,
  error,
  options = [],
  autoSelect = false,
  freeSolo = false,
}) => {
  const loading = options.length === 0;
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Autocomplete
      id="asyncSearch"
      value={localValue}
      freeSolo={freeSolo}
      autoSelect={autoSelect}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      options={options}
      onChange={onChange}
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

export default AutoComplete;
