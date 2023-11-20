import React from 'react';
import DatePicker from 'react-mobile-datepicker';
import styled from 'styled-components';
import * as Mui from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import * as css from './Calendar.scss';

const useStyles = makeStyles(() => ({
  colors: {
    '& .datepicker-caption': {
      color: 'red',
      backgroundColor: 'red',
    },
  },
}));

const monthMap = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const DatePickerContainer = styled.div`
  .datepicker {
    position: initial;
    background-color: white;

    .default .datepicker-scroll li {
      color: #9c9c9c;
    }

    .datepicker-caption-item {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: #000000;
    }
  }

  .datepicker-navbar {
    display: none;
  }
  .datepicker {
    position: initial;
  }
  .datepicker.default .datepicker-scroll li {
    color: #9c9c9c;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    :nth-child(6) {
      color: #36e3c0;
    }
  }
  .datepicker.default .datepicker-header {
    display: none;
  }
  .datepicker.default .datepicker-wheel {
    color: green;
    border: none;
  }
  .disabled {
    background-color: #fff;
  }
`;
const toOpenShow = true;

const Calander = ({ head, button, handleDate, max, selectedTip, maxDate }) => {
  const classes = useStyles();
  const [click, setClick] = React.useState(new Date());

  const calendarData = (val) => setClick(val);

  const { dates } = React.useContext(AppContext);

  const myArrayFrom =
    dates.status === true
      ? dates?.startDate?.start?.toString().split('-')
      : moment(new Date()).format('YYYY-MM-DD')?.toString().split('-');
  const myArrayTo = dates?.endDate?.end?.toString().split('-');

  const getMaxDate = () => {
    return new Date().getDate() >= 12
      ? new Date(+myArrayFrom[0], +myArrayFrom[1] - 1, '01')
      : new Date(+myArrayFrom[0], +myArrayFrom[1] - 2, '01');
  };

  React.useEffect(() => {
    if (
      dates.status === true &&
      head === 'Select Start Date' &&
      dates.startDate.start === ''
    ) {
      setClick(new Date());
    } else if (dates.status === true && head === 'Select Start Date') {
      setClick(new Date(+myArrayFrom[0], +myArrayFrom[1] - 1, +myArrayFrom[2]));
    } else if (
      dates.status === true &&
      head === 'Select End Date' &&
      dates.endDate.end === ''
    ) {
      setClick(new Date());
    } else if (dates.status === false) {
      setClick(new Date());
    } else {
      setClick(new Date(+myArrayTo[0], +myArrayTo[1] - 1, +myArrayTo[2]));
    }
  }, [dates]);

  return (
    <div className={css.parent}>
      <DatePickerContainer style={{ textAlignLast: 'center' }}>
        <Mui.Grid>
          <Mui.Grid className={css.header}>{head}</Mui.Grid>
        </Mui.Grid>
        {max ? (
          <DatePicker
            isOpen={toOpenShow}
            isPopup={false}
            showCaption={toOpenShow}
            showHeader={false}
            min={
              dates.status === false
                ? getMaxDate()
                : new Date(
                    +myArrayFrom[0],
                    +myArrayFrom[1] - 1,
                    +myArrayFrom[2],
                  )
            }
            max={
              dates.status === false
                ? new Date()
                : new Date(+myArrayTo[0], +myArrayTo[1] - 1, +myArrayTo[2])
            }
            //   theme='ios'
            //   customHeader='Choose Starting Date'

            className={classes.color}
            onChange={(e) => {
              calendarData(e);
            }}
            dateConfig={{
              month: {
                format: (value) => monthMap[value.getMonth() + 1],
                caption: 'Month',
                step: 1,
              },
              date: {
                format: 'D',
                caption: 'Day',
                step: 1,
              },
              year: {
                format: 'YYYY',
                caption: 'Year',
                step: 1,
              },
              // hour: {
              //   format: "hh",
              //   caption: "Hour",
              //   step: 1
              // },
              // minute: {
              //   format: "mm",
              //   caption: "Min",
              //   step: 5
              // }
            }}
            value={click}
          />
        ) : (
          <DatePicker
            isOpen={toOpenShow}
            isPopup={false}
            showCaption={toOpenShow}
            showHeader={false}
            min={
              selectedTip?.start_date
                ? new Date(
                    moment(selectedTip?.start_date, 'YYYY-MM-DD').format(
                      'YYYY',
                    ),
                    moment(selectedTip?.start_date, 'YYYY-MM-DD').format('MM') -
                      1,
                    moment(selectedTip?.start_date, 'YYYY-MM-DD').format('DD'),
                  )
                : new Date(1900, 1, 1)
            }
            max={
              selectedTip?.end_date
                ? new Date(
                    moment(selectedTip?.end_date, 'YYYY-MM-DD').format('YYYY'),
                    moment(selectedTip?.end_date, 'YYYY-MM-DD').format('MM') -
                      1,
                    moment(selectedTip?.end_date, 'YYYY-MM-DD').format('DD'),
                  )
                : maxDate &&
                  new Date(
                    moment(maxDate, 'YYYY-MM-DD').format('YYYY'),
                    moment(maxDate, 'YYYY-MM-DD').format('MM') - 1,
                    moment(maxDate, 'YYYY-MM-DD').format('DD'),
                  )
            }
            //   theme='ios'
            //   customHeader='Choose Starting Date'

            className={classes.color}
            onChange={(e) => {
              calendarData(e);
            }}
            dateConfig={{
              month: {
                format: (value) => monthMap[value.getMonth() + 1],
                caption: 'Month',
                step: 1,
              },
              date: {
                format: 'D',
                caption: 'Day',
                step: 1,
              },
              year: {
                format: 'YYYY',
                caption: 'Year',
                step: 1,
              },
              // hour: {
              //   format: "hh",
              //   caption: "Hour",
              //   step: 1
              // },
              // minute: {
              //   format: "mm",
              //   caption: "Min",
              //   step: 5
              // }
            }}
            value={click}
          />
        )}
        <Mui.Grid className={css.button}>
          <Mui.Grid
            className={css.buttonFont}
            onClick={() => {
              handleDate(click);
            }}
          >
            {button}
          </Mui.Grid>
        </Mui.Grid>
      </DatePickerContainer>
    </div>
  );
};
export default Calander;
