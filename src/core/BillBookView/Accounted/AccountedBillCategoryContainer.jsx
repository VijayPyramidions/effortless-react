import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { GetExpenseListState } from '@action/Store/Reducers/Bills/AccountedBillsState';

import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Popover,
  MenuItem,
  CircularProgress,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Calendar from '@assets/calendar.svg';
import InfiniteScroll from 'react-infinite-scroll-component';

import { MobileCardLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';
import MobileCalendar from '@components/MobileCalendar/DateRangePicker';
import AccountedBillCalander from './AccountedBillCalander';

import * as css from './accounted.scss';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const AccountedBillCategoryContainer = (props) => {
  const { selectedMaterial, setSelectedMaterial, setDateFilter, dateFilter } =
    props;

  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const dispatch = useDispatch();
  const { ExpenseListDataState, ExpenseListDataLoad } = useSelector(
    (value) => value.AccountedBills
  );

  const navigate = useNavigate();

  const DateListItem = [
    'Today',
    'Yesterday',
    'This Week',
    'This Month',
    'This Year',
    'This Quarter',
  ];
  const [drawer, setDrawer] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [calendarShow, setcalendarShow] = useState(true);
  const [date, setDate] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    endDate: moment().endOf('year').format('YYYY-MM-DD'),
  });
  const [datePeriod, setDatePeriod] = useState(DateListItem[4]);
  const [datePeriodCalendar, setDatePeriodCalendar] = useState([
    moment().startOf('year').format('YYYY-MM-DD'),
    moment().endOf('year').format('YYYY-MM-DD'),
  ]);
  const [hasMoreItems, sethasMoreItems] = useState(true);

  const ExpenseListCall = (page) => {
    dispatch(
      GetExpenseListState({
        pageNum: page || 1,
        fromDate: dateFilter?.fromDate,
        endDate: dateFilter?.endDate,
      })
    );
  };

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const handleDateChange = (item) => () => {
    let datefillt = {};
    let rangefillt = [];

    if (item === DateListItem[0]) {
      datefillt = {
        fromDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[1]) {
      datefillt = {
        fromDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().add(-1, 'days').format('YYYY-MM-DD'),
        moment().add(-1, 'days').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[2]) {
      datefillt = {
        fromDate: moment().startOf('week').format('YYYY-MM-DD'),
        endDate: moment().endOf('week').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('week').format('YYYY-MM-DD'),
        moment().endOf('week').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[3]) {
      datefillt = {
        fromDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('month').format('YYYY-MM-DD'),
        moment().endOf('month').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[4]) {
      datefillt = {
        fromDate: moment().startOf('year').format('YYYY-MM-DD'),
        endDate: moment().endOf('year').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('year').format('YYYY-MM-DD'),
        moment().endOf('year').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[5]) {
      datefillt = {
        fromDate: moment().startOf('quarter').format('YYYY-MM-DD'),
        endDate: moment().endOf('quarter').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('quarter').format('YYYY-MM-DD'),
        moment().endOf('quarter').format('YYYY-MM-DD'),
      ];
    }
    setDatePeriod(item);

    setDate(datefillt);
    setDatePeriodCalendar(rangefillt);
    handleDrawer('datefilter', null);
  };

  const DateRangeSelector = (dates) => {
    setDatePeriodCalendar(dates);
    setDate({
      ...date,
      fromDate: dates[0] && moment(dates[0]).format('YYYY-MM-DD'),
      endDate: dates[1] && moment(dates[1]).format('YYYY-MM-DD'),
    });
    setDatePeriod('Custom');
    setcalendarShow(true);
  };

  const loadMore = () => {
    if (ExpenseListDataState?.pages > 1) {
      ExpenseListCall(ExpenseListDataState?.page + 1);
    }
  };

  useEffect(() => {
    setDateFilter(date);
  }, [date]);

  useEffect(() => {
    if (desktopView) setSelectedMaterial(expenseList?.[0] || {});
  }, [desktopView, expenseList]);

  useEffect(() => {
    if (ExpenseListDataState?.data) {
      if (ExpenseListDataState?.page === 1) {
        setExpenseList(ExpenseListDataState?.data);
      } else {
        setExpenseList((prev) => [...prev, ...ExpenseListDataState?.data]);
      }
      sethasMoreItems(
        ExpenseListDataState?.page !== ExpenseListDataState?.pages
      );
    } else {
      sethasMoreItems(false);
    }
  }, [JSON.stringify(ExpenseListDataState)]);

  useEffect(() => {
    if (dateFilter?.fromDate && dateFilter?.endDate) {
      ExpenseListCall(1);
    }
  }, [JSON.stringify(dateFilter)]);

  return (
    <Box className={css.leftcard}>
      <Box className={css.topcont}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb="12px"
        >
          <Typography className={css.amountcont}>
            {currencyFormatter.format(
              Math.abs(ExpenseListDataState?.total_spend || 0)
            )}
          </Typography>
          {desktopView && (
            <Button
              className={css.filterbtn}
              startIcon={
                <>
                  <img src={Calendar} alt="calendar" style={{ zIndex: 1 }} />
                </>
              }
              endIcon={<KeyboardArrowDownOutlinedIcon />}
              onClick={(event) =>
                handleDrawer('datefilter', event?.currentTarget)
              }
            >
              {datePeriod}
            </Button>
          )}
        </Stack>
        <Typography className={css.descriptioncont}>
          Total spend {datePeriod?.toLocaleLowerCase()}
        </Typography>
      </Box>

      {!desktopView && (
        <AccountedBillCalander
          setDateFilter={setDate}
          setDatePeriodTop={setDatePeriod}
        />
      )}

      <Typography className={css.midcont}>This is where you spend</Typography>

      <Stack className={css.bottomcont}>
        {!ExpenseListDataLoad && <MobileCardLoadingSkeleton NumCard={6} />}
        {expenseList?.length === 0 && ExpenseListDataLoad && (
          <Typography align="center">No Expenses Found.</Typography>
        )}

        <InfiniteScroll
          dataLength={expenseList?.length}
          next={() => loadMore()}
          scrollThreshold="20px"
          hasMore={hasMoreItems}
          loader={
            <div style={{ display: 'flex' }}>
              <CircularProgress style={{ color: '#F08B32', margin: 'auto' }} />
            </div>
          }
          height="calc(100vh - 320px)"
        >
          {expenseList?.length > 0 &&
            ExpenseListDataLoad &&
            expenseList?.map((val) => (
              <Box
                className={css.billlistbox}
                component={Stack}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                key={val?.id}
                style={{
                  background:
                    val?.id === selectedMaterial?.id ? '#F8F8F8' : '#fff',
                }}
                onClick={() => {
                  setSelectedMaterial(val);
                  if (!desktopView) {
                    navigate('/bill-accounted-category', {
                      state: { expenseSelectedValue: val, expenseList },
                    });
                  }
                }}
              >
                <Stack direction="row" gap="8px" alignItems="center">
                  {val?.icon ? (
                    <img
                      src={val?.icon}
                      alt="img"
                      style={{ width: '32px', height: '32px' }}
                    />
                  ) : (
                    <Avatar
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${val?.name}&chars=1`}
                      style={{ width: '32px', height: '32px' }}
                    />
                  )}
                  <Stack direction="column" gap="4px">
                    <Typography className={css.categorytext}>
                      {val?.name}
                    </Typography>
                    <Typography className={css.spendtext}>
                      {Number(
                        (Number(val?.amount) /
                          Number(ExpenseListDataState?.total_spend)) *
                          100
                      ).toFixed(2)}
                      % Total Spend
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" gap="8px" alignItems="center">
                  <Typography className={css.amounttext}>
                    {currencyFormatter.format(Math.abs(val?.amount || 0))}
                  </Typography>
                  <IconButton sx={{ padding: 0 }}>
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
        </InfiniteScroll>
      </Stack>
      <Popover
        open={Boolean(drawer?.datefilter)}
        anchorEl={drawer?.datefilter}
        onClose={() => handleDrawer('datefilter', null)}
        sx={{
          '& .MuiPaper-root': {
            padding: '4px 0',
            marginTop: '4px',
          },

          '& .MuiMenuItem-root': {
            marginBottom: '8px !important',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {calendarShow ? (
          <>
            {DateListItem.map((row) => (
              <MenuItem
                key={row}
                disableRipple
                onClick={handleDateChange(row)}
                style={{ borderBottom: '.5px solid rgba(0, 0, 0, 0.10)' }}
              >
                {row}
              </MenuItem>
            ))}
            <MenuItem
              disableRipple
              style={{
                color: '#f08b32 !important',
                fontWeight: '500 !important',
                marginBottom: 0,
              }}
              onClick={() => setcalendarShow(false)}
            >
              Custom
            </MenuItem>
          </>
        ) : (
          <MobileCalendar
            DateRangeSelector={DateRangeSelector}
            onClose={() => handleDrawer('datefilter', null)}
            onCancel={() => setcalendarShow(true)}
            dateRange={datePeriodCalendar}
          />
        )}
      </Popover>
    </Box>
  );
};

export default AccountedBillCategoryContainer;
