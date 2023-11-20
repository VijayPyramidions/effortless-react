/* @flow */
/**
 * @fileoverview Date picker component
 */

import React from 'react';
import moment from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { styled } from '@material-ui/styles';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Input, { InputText } from '@components/Input/Input';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      theme="light"
      fullWidth
      // className={css.textfieldStyle}
    />
  );
};

const CssTextField = styled(KeyboardDatePicker)((props) => {
  return {
    '& .MuiInputAdornment-positionEnd': {
      margin: '18px 8px',
    },
    '& .MuiButtonBase-root': {
      color: props.color,
      padding: '0',
    },
    '& .MuiInputBase-input': {
      visibility: 'hidden',
      width: '0px',
    },
  };
});

const MuiDatePicker = ({
  selectedDate,
  className,
  onChange,
  label,
  format = 'DD/MM/yyyy',
  error,
  helperText,
}) => {
  return (
    <MuiPickersUtilsProvider utils={moment}>
      <KeyboardDatePicker
        className={`${className}`}
        autoOk
        variant="inline"
        label={label}
        format={format}
        value={selectedDate}
        InputAdornmentProps={{ position: 'end' }}
        onChange={onChange}
        TextFieldComponent={(props) => (
          <Input {...props} fullWidth theme="light" required />
        )}
        required
        {...{ error, helperText }}
      />
    </MuiPickersUtilsProvider>
  );
};

const OnlyDatePicker = ({
  selectedDate,
  className,
  classNameV,
  onChange,
  label,
  format = 'DD MMM yyyy',
  color,
  id,
  maxDate,
  minDate,
  invoice,
}) => {
  const subtractMonths = (date, months) => {
    const dateVal = new Date(date);
    dateVal.setMonth(dateVal.getMonth() - months);

    return dateVal;
  };

  const subtractMonthsMaxDate = (months) => {
    const dateVal = new Date();
    const newMonth =
      months === 1 ? dateVal.getMonth() - months : dateVal.getMonth();

    return new Date(dateVal.getFullYear(), newMonth, '01');
  };

  return (
    <MuiPickersUtilsProvider utils={moment}>
      {id ? (
        <CssTextField
          views={[id]}
          InputProps={{
            readOnly: true,
            disableUnderline: true,
            className: `dateInput ${classNameV}`,
          }}
          className={className}
          autoOk
          variant="inline"
          label={label}
          format={format}
          value={selectedDate}
          onChange={onChange}
          color={color || '#000000'}
          maxDate={maxDate === undefined ? maxDate : new Date()}
          minDate={
            invoice
              ? subtractMonthsMaxDate(minDate)
              : minDate && subtractMonths(selectedDate, minDate)
          }
          // minDate={minDate && subtractMonthsMaxDate(minDate)}
        />
      ) : (
        <CssTextField
          InputProps={{
            readOnly: true,
            disableUnderline: true,
            className: `dateInput ${classNameV}`,
          }}
          className={className}
          autoOk
          variant="inline"
          label={label}
          format={format}
          value={selectedDate}
          onChange={onChange}
          color={color || '#000000'}
          maxDate={maxDate === undefined ? maxDate : new Date()}
          minDate={
            invoice
              ? subtractMonthsMaxDate(minDate)
              : minDate && subtractMonths(selectedDate, minDate)
          }
          // minDate={minDate && subtractMonthsMaxDate(minDate)}
        />
      )}
    </MuiPickersUtilsProvider>
  );
};

const DatePickerLabeled = ({
  name,
  label,
  dateFormate,
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  minDate,
  maxDate,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={name}
        inputFormat={dateFormate || 'DD-MM-YYYY'}
        // InputProps={{ disableUnderline: true }}
        minDate={minDate}
        maxDate={maxDate}
        value={value}
        onChange={onChange}
        disabled={disabled}
        views={['year', 'month', 'day']}
        renderInput={(params) => (
          <TextfieldStyle
            {...params}
            required={required}
            label={label}
            variant="standard"
            name={name}
            rootStyle={{
              border: '1px solid rgba(153, 158, 165, 0.39)',
            }}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export { MuiDatePicker, OnlyDatePicker, DatePickerLabeled };
