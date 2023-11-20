/* @flow */
/**
 * @fileoverview Select component
 */

import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';

import * as theme from '@root/theme.scss';

const SimpleSelect = withStyles({
  filled: {
    borderRadius: '10px',
    border: `1px solid ${theme.colorMain}`,
    fontWeight: 400,
  },
  icon: {
    color: theme.colorMain,
  },
})(Select);

const useStyles = makeStyles(() => ({
  formControl: {
    borderRadius: '10px',
    width: '100%',
    '& .MuiFilledInput-underline:before, .MuiFilledInput-underline:after': {
      border: 'none',
    },
    '& .MuiFilledInput-root, & .MuiSelect-select:focus': {
      backgroundColor: 'transparent',
      borderRadius: '10px',
    },
  },
  inputLabel: {
    color: theme.colorMain,
    fontWeight: 400,

    '&.Mui-focused': {
      color: theme.colorMain,
    },
  },
  icon: {
    color: theme.colorMain,
  },
  textStyle: {
    fontWeight: 400,
  },
}));

const MuiSelect = ({
  label,
  optionCategories,
  defaultValue,
  onChange,
  multiple = false,
  closeOnSelect = true,
  disabled = false,
}: {
  label: string,
  optionCategories: {
    [string]: {
      payload: string,
      text: string,
    },
  },
  defaultValue: string,
  onChange: () => void,
  multiple: boolean,
  closeOnSelect: boolean,
  disabled: boolean,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleChange = (e: *) => {
    onChange(e);
    if (closeOnSelect) {
      setOpen(false);
    }
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <FormControl
      variant="filled"
      classes={{ root: classes.formControl }}
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
        open={open}
        value={defaultValue}
        onChange={handleChange}
        multiple={multiple}
        IconComponent={ExpandMoreOutlinedIcon}
        onClose={onClose}
        onOpen={onOpen}
      >
        {Object.keys(optionCategories).map((c) => {
          const options = optionCategories[c].map((o) => (
            <MenuItem
              key={o.payload}
              value={o.payload}
              classes={{ root: classes.textStyle }}
            >
              {o.text}
            </MenuItem>
          ));
          options.unshift(
            <ListSubheader
              classes={{ root: classes.textStyle }}
              style={{
                textTransform: 'capitalize',
                fontSize: 14,
                pointerEvents: 'none',
              }}
              disabled
            >
              {c}
            </ListSubheader>,
          );
          return options;
        })}
      </SimpleSelect>
    </FormControl>
  );
};

export default MuiSelect;
