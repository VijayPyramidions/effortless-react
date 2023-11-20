import React, { useState } from 'react';
// import moment from 'moment';
import TextField from '@mui/material/TextField';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
// import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
const useStyles = makeStyles(() => ({
  Root: {
    // background: 'red',
    '& .MuiPickerStaticWrapper-content': {
      minWidth: 'initial !important',
    },
    '& .MuiPickersToolbar-root': {
      padding: 0,

      '& .MuiTypography-overline': {
        display: 'none',
      },

      '& .MuiGrid-container.MuiPickersToolbar-content': {
        // background: 'red',
        // MuiGrid-container MuiPickersToolbar-content

        '& .MuiDateRangePickerToolbar-container': {
          flex: 1,
          justifyContent: 'space-between',
          // padding: '0 8px',
          margin: '0 8px',
          border: '1px solid #E0E1E4',
          borderRadius: '4px',
          '& .MuiButton-root.MuiButton-text': {
            flex: 1,
            '& .MuiTypography-root': {
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: 300,
              fontSize: '12px',
              lineHeight: '15px',
              textAlign: 'left',
              color: 'rgba(0, 0, 0, 0.5)',
              padding: '11px 16px',
              flex: 1,
            },
          },

          '& .MuiTypography-h5': {
            fontFamily: "'Lexend', sans-serif !important",
            fontWeight: 300,
            fontSize: '18px',
            lineHeight: '15px',
            color: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
          },
        },
        '& .MuiPickersToolbar-penIconButton': {
          display: 'none !important',
        },
      },
    },
    '& .MuiPickersCalendarHeader-root': {
      display: 'flex',
      alignItems: 'center',
      justifyItems: 'center',
      padding: 0,
      marginTop: 8,
    },
    '& .MuiPickersCalendarHeader-root:first-child': {
      order: 0,
      paddingRight: '20px',
      paddingLeft: '20px',
    },
    '& .MuiPickersArrowSwitcher-root': {
      display: 'inline-flex',
      marginLeft: '-2px',

      // visibility: "hidden"
    },
    '& .MuiPickersCalendarHeader-label': {
      textAlign: 'center',
      fontFamily: "'Lexend',sans-serif !important",
      fontWeight: 300,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#000000',
    },
    '& .MuiPickersArrowSwitcher-spacer': {
      width: '182px',
    },
    '& .MuiPickersFadeTransitionGroup-root': {
      display: 'flex',
      position: 'absolute',
      width: '100%',
      justifyContent: 'center',
    },
    // '& .MuiPickersArrowSwitcher-root': {
    //   marginLeft: '-2px',
    // },
    '& .MuiIconButton-edgeEnd': {
      marginRight: '15px',
      '& svg': {
        color: '#212121',
        width: 16,
        height: 16,
      },
    },
    '& .MuiIconButton-edgeStart': {
      marginRight: '11px',
      '& svg': {
        color: '#212121',
        width: 16,
        height: 16,
      },
    },
    '& .MuiDayPicker-weekDayLabel': {
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.5)',
      width: '32px',
      height: '32px',
    },
    '& .MuiDateRangePickerDay-day.MuiDateRangePickerDay-notSelectedDate': {
      fontFamily: "'Work Sans', sans-serif !important",
      fontWeight: 300,
      fontSize: '13px',
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '0px !important',
      width: '32px',
      height: '32px',
      //   marginLeft: 4,
      '&:hover': {
        background: '#F08B32',
        border: 'none',
        color: '#FFFFFF',
        borderRadius: '0px !important',
      },
    },
    '& .MuiDateRangePickerDay-day': {
      '&:focus.Mui-selected': {
        background: '#F08B32',
      },
    },
    '& .Mui-selected.MuiDateRangePickerDay-day': {
      background: '#F08B32',
      border: 'none',
      color: '#FFFFFF',
      borderRadius: '0px !important',
      width: '32px',
      height: '32px',
      '&:hover': {
        background: '#F08B32',
      },
    },
    '& .MuiDateRangePickerDay-dayInsideRangeInterval': {
      background: 'rgba(240, 139, 50, 0.5)',
      color: '#FFFFFF !important',
    },
    '& .MuiDateRangePickerDay-rangeIntervalDayHighlight': {
      background: 'none',
    },
    // '& .css-1m3meum-MuiDateRangePickerDay-root': {
    //   marginLeft: '-1px',
    // },
    '& .MuiDayPicker-weekContainer': {
      margin: 0,
    },
    '& .MuiDateRangePickerDay-day.MuiPickersDay-today': {
      // borderRadius: '4px !important',
      border: '1px solid #E0E1E4 !important',
    },
    '& .MuiDateRangePickerDay-rangeIntervalDayHighlightStart': {
      marginLeft: '0px !important',
    },
    '& .MuiDateRangePickerDay-rangeIntervalDayHighlightEnd': {
      marginRight: '0px !important',
    },
    '& .PrivatePickersSlideTransition-root.MuiDayPicker-slideTransition': {
      minHeight: '217px',
    },
    '& .MuiDialogActions-root': {
      padding: '0 8px 0 0',
      '& .MuiButton-text': {
        textTransform: 'capitalize',
        fontFamily: "'Lexend',sans-serif !important",
        fontWeight: 300,
        fontSize: '12px',
        lineHeight: '15px',
        // color: '#000000',
      },
    },
  },
}));
const StaticDateRangePickerDemo = ({ handleDate, handleClose }) => {
  const classes = useStyles();
  const [value, setValue] = useState([null, null]);
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      dateFormats={{ fullDate: 'MM-DD-YYYY' }}
    >
      <StaticDateRangePicker
        className={classes.Root}
        value={value}
        dayOfWeekFormatter={(day) =>
          day.charAt(0).toUpperCase() + day.charAt(1)
        }
        onAccept={() => {
          handleDate(value);
        }}
        onClose={() => {
          handleClose();
        }}
        onError={() => {
          console.log('onError');
        }}
        onMonthChange={() => {
          console.log('onMonthChange');
        }}
        onOpen={() => {
          console.log('onOpen');
        }}
        onViewChange={() => {
          console.log('onViewChange');
        }}
        // onYearChange={() => {
        //   console.log('onYearChange');
        // }}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        displayStaticWrapperAs="mobile"
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  );
};
export default StaticDateRangePickerDemo;
