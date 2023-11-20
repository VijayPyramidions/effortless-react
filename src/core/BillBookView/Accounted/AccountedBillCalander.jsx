import React, { useState, useEffect } from 'react';
import moment from 'moment';

import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import { styled } from '@material-ui/core/styles';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import Calendar from '@assets/BillsLogo/orange_calendar.svg';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

// import MobileCalendar from '@components/MobileCalendar/DateRangePicker';

import * as css from './accounted.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const datePriodData = [
  'Today',
  'Yesterday',
  'This Week',
  'This Month',
  'This Year',
  'This Quarter',
];

const AccountedBillCalander = ({ setDateFilter, setDatePeriodTop }) => {
  const [drawer, setDrawer] = useState({});
  const [monthShow, setMonthShow] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    endDate: moment().endOf('year').format('YYYY-MM-DD'),
    showValue: moment().startOf('year').format('YYYY'),
  });

  const [datePeriod, setDatePeriod] = useState(datePriodData[4]);
  // const [date, setDate] = useState({
  //   fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  //   endDate: moment().endOf('year').format('YYYY-MM-DD'),
  // });

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const handleDateChange = (item) => {
    let datefillt = {};

    if (item === datePriodData[0]) {
      datefillt = {
        fromDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
      setMonthShow({
        fromDate: datefillt?.fromDate,
        endDate: datefillt?.endDate,
        showValue: moment().format('DD-MM-YYYY'),
      });
    } else if (item === datePriodData[1]) {
      datefillt = {
        fromDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
      };
      setMonthShow({
        fromDate: datefillt?.fromDate,
        endDate: datefillt?.endDate,
        showValue: moment().add(-1, 'days').format('DD-MM-YYYY'),
      });
    } else if (item === datePriodData[2]) {
      datefillt = {
        fromDate: moment().startOf('week').format('YYYY-MM-DD'),
        endDate: moment().endOf('week').format('YYYY-MM-DD'),
      };
      setMonthShow({
        fromDate: datefillt?.fromDate,
        endDate: datefillt?.endDate,
        showValue: `${moment().startOf('week').format('DD-MM-YYYY')} -
          ${moment().endOf('week').format('DD-MM-YYYY')}`,
      });
    } else if (item === datePriodData[3]) {
      datefillt = {
        fromDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
      };
      setMonthShow({
        fromDate: datefillt?.fromDate,
        endDate: datefillt?.endDate,
        showValue: moment().endOf('month').format('MMMM'),
      });
    } else if (item === datePriodData[4]) {
      datefillt = {
        fromDate: moment().startOf('year').format('YYYY-MM-DD'),
        endDate: moment().endOf('year').format('YYYY-MM-DD'),
      };
      setMonthShow({
        fromDate: datefillt?.fromDate,
        endDate: datefillt?.endDate,
        showValue: moment().endOf('year').format('YYYY'),
      });
    } else if (item === datePriodData[5]) {
      datefillt = {
        fromDate: moment().startOf('quarter').format('YYYY-MM-DD'),
        endDate: moment().endOf('quarter').format('YYYY-MM-DD'),
      };
      setMonthShow({
        fromDate: datefillt?.fromDate,
        endDate: datefillt?.endDate,
        showValue: `${moment().startOf('quarter').format('MMMM')} -
          ${moment().endOf('quarter').format('MMMM')}`,
      });
    }
    setDatePeriod(item);
    setDatePeriodTop(item);
    handleDrawer('date_filter', false);
  };

  const monthChange = (direction) => {
    const currentStart = monthShow?.fromDate;
    const currentEnd = monthShow?.endDate;
    if (datePeriod === 'Today' || datePeriod === 'Yesterday') {
      if (direction === 'next') {
        const tempDate = moment(currentStart).add(1, 'days');
        setMonthShow({
          fromDate: moment(tempDate)?.format('YYYY-MM-DD'),
          endDate: currentEnd,
          showValue: moment(tempDate)?.format('DD-MM-YYYY'),
        });
      }
      if (direction === 'previous') {
        const tempDate = moment(currentStart).subtract(1, 'days');
        setMonthShow({
          fromDate: moment(tempDate)?.format('YYYY-MM-DD'),
          endDate: currentEnd,
          showValue: moment(tempDate)?.format('DD-MM-YYYY'),
        });
      }
    }
    if (datePeriod === 'This Week') {
      if (direction === 'next') {
        const tempStartDate = moment(currentStart).add(7, 'days');
        const tempEndDate = moment(currentEnd).add(7, 'days');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: `${moment(tempStartDate)?.format('DD-MM-YYYY')} - ${moment(
            tempEndDate
          )?.format('DD-MM-YYYY')}`,
        });
      }
      if (direction === 'previous') {
        const tempStartDate = moment(currentStart).subtract(7, 'days');
        const tempEndDate = moment(currentEnd).subtract(7, 'days');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: `${moment(tempStartDate)?.format('DD-MM-YYYY')} - ${moment(
            tempEndDate
          )?.format('DD-MM-YYYY')}`,
        });
      }
    }
    if (datePeriod === 'This Month') {
      if (direction === 'next') {
        const tempStartDate = moment(currentStart)
          .add(1, 'month')
          .startOf('month');
        const tempEndDate = moment(currentEnd).add(1, 'month').endOf('month');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: moment(tempEndDate)?.format('MMMM'),
        });
      }
      if (direction === 'previous') {
        const tempStartDate = moment(currentStart)
          .subtract(1, 'month')
          .startOf('month');
        const tempEndDate = moment(currentEnd)
          .subtract(1, 'month')
          .endOf('month');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: moment(tempEndDate)?.format('MMMM'),
        });
      }
    }
    if (datePeriod === 'This Year') {
      if (direction === 'next') {
        const tempStartDate = moment(currentStart).add(1, 'year');
        const tempEndDate = moment(currentEnd).add(1, 'year');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: moment(tempEndDate)?.format('YYYY'),
        });
      }
      if (direction === 'previous') {
        const tempStartDate = moment(currentStart).subtract(1, 'year');
        const tempEndDate = moment(currentEnd).subtract(1, 'year');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: moment(tempEndDate)?.format('YYYY'),
        });
      }
    }
    if (datePeriod === 'This Quarter') {
      if (direction === 'next') {
        const tempStartDate = moment(currentStart)
          .add(1, 'quarter')
          .startOf('quarter');
        const tempEndDate = moment(currentEnd)
          .add(1, 'quarter')
          .endOf('quarter');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: `${moment(tempStartDate).format('MMMM')} -
          ${moment(tempEndDate).format('MMMM')}`,
        });
      }
      if (direction === 'previous') {
        const tempStartDate = moment(currentStart)
          .subtract(1, 'quarter')
          .startOf('quarter');
        const tempEndDate = moment(currentEnd)
          .subtract(1, 'quarter')
          .endOf('quarter');
        setMonthShow({
          fromDate: moment(tempStartDate)?.format('YYYY-MM-DD'),
          endDate: moment(tempEndDate)?.format('YYYY-MM-DD'),
          showValue: `${moment(tempStartDate).format('MMMM')} -
          ${moment(tempEndDate).format('MMMM')}`,
        });
      }
    }
  };

  useEffect(() => {
    if (monthShow?.fromDate && monthShow?.endDate) {
      setDateFilter({
        fromDate: monthShow?.fromDate,
        endDate: monthShow?.endDate,
      });
    }
  }, [monthShow?.fromDate, monthShow?.endDate]);

  return (
    <Box
      component={Stack}
      direction="row"
      alignItems="center"
      className={css.mobileaccountedcalander}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="0 20px"
        flexGrow="1"
      >
        <IconButton sx={{ padding: 0 }} onClick={() => monthChange('previous')}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography className={css.month}>{monthShow.showValue}</Typography>
        <IconButton sx={{ padding: 0 }} onClick={() => monthChange('next')}>
          <KeyboardArrowRightIcon />
        </IconButton>
      </Stack>
      <Box
        padding="8px 20px"
        sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.1)' }}
      >
        <IconButton
          sx={{ padding: 0 }}
          onClick={() => handleDrawer('date_filter', true)}
        >
          <img src={Calendar} alt="calender" />
        </IconButton>
      </Box>

      <SelectBottomSheet
        open={drawer?.date_filter}
        onClose={() => handleDrawer('date_filter', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <div className={css.datefiltersheet}>
          <Puller />
          <Typography className={css.datefilterhead}>
            Select Date Filter
          </Typography>

          {datePriodData?.map((val) => (
            <>
              <Box
                component={Button}
                className={css.filterbutton}
                onClick={() => handleDateChange(val)}
                style={{ color: datePeriod === val ? '#F08B32' : '#283049' }}
              >
                {val}
              </Box>
              <Divider />
            </>
          ))}
        </div>
      </SelectBottomSheet>
    </Box>
  );
};

export default AccountedBillCalander;
