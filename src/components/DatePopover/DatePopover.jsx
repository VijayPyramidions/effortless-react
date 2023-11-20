import * as React from 'react';
import { Popover } from '@mui/material';
import moment from 'moment';
import MobileDateRangePicker from './MobileDateRangePicker';
import * as css from './datePopover.scss';

const MultipleDatePopover = (props) => {
  const {
    anchorEl,
    onClose,
    onPeriodChange,
    fromWidth,
    popoverStyle,
    DateType,
  } = props;
  const [customDatePicker, setCustomDatePicker] = React.useState(false);

  const getFiscalYearTimestamps = () => {
    if (DateType === 'Financial') {
      // const startMonthName = 'April';
      // const endMonthName = 'March';
      // return {
      //   current: {
      //     start: moment()
      //       .subtract(1, 'year')
      //       .month(startMonthName)
      //       .startOf('month')
      //       .format('YYYY-MM-DD'),
      //     end: moment().month(endMonthName).endOf('month').format('YYYY-MM-DD'),
      //   },
      //   last: {
      //     start: moment()
      //       .subtract(2, 'year')
      //       .month(startMonthName)
      //       .startOf('month')
      //       .format('YYYY-MM-DD'),
      //     end: moment()
      //       .subtract(1, 'year')
      //       .month(endMonthName)
      //       .endOf('month')
      //       .format('YYYY-MM-DD'),
      //   },
      // };
      const currentMonth = moment().month();
      const startMonth = currentMonth < 3 ? 9 + currentMonth : 3;
      const startOfFinancialYear = moment().month(startMonth).startOf('month');
      const endOfFinancialYear = moment(startOfFinancialYear)
        .add(11, 'months')
        .endOf('month');
      return {
        current: {
          start: startOfFinancialYear?.format('YYYY-MM-DD'),
          end: endOfFinancialYear?.format('YYYY-MM-DD'),
        },
        last: {
          start: startOfFinancialYear
            ?.subtract(1, 'year')
            ?.format('YYYY-MM-DD'),
          end: endOfFinancialYear?.subtract(1, 'year')?.format('YYYY-MM-DD'),
        },
      };
    }
    return {
      current: { start: moment().startOf('year'), end: moment().endOf('year') },
      last: {
        start: moment().subtract(1, 'year').startOf('year'),
        end: moment().subtract(1, 'year').endOf('year'),
      },
    };
  };

  const dateList = [
    {
      name: 'Today',
      fromDate: moment()?.format('YYYY-MM-DD'),
      toDate: moment()?.format('YYYY-MM-DD'),
    },
    {
      name: 'This Week',
      fromDate: moment()?.startOf('week')?.format('YYYY-MM-DD'),
      toDate: moment()?.endOf('week')?.format('YYYY-MM-DD'),
    },
    {
      name: 'This Month',
      fromDate: moment()?.startOf('month')?.format('YYYY-MM-DD'),
      toDate: moment()?.endOf('month')?.format('YYYY-MM-DD'),
    },
    {
      name: 'This Quarter',
      fromDate: moment()?.startOf('quarter')?.format('YYYY-MM-DD'),
      toDate: moment()?.endOf('quarter')?.format('YYYY-MM-DD'),
    },
    {
      name: 'This Year',
      fromDate: getFiscalYearTimestamps()?.current?.start,
      toDate: getFiscalYearTimestamps()?.current?.end,
    },
    {
      name: 'Yesterday',
      fromDate: moment()?.subtract(1, 'days')?.format('YYYY-MM-DD'),
      toDate: moment()?.format('YYYY-MM-DD'),
    },
    {
      name: 'Previous Week',
      fromDate: moment()
        ?.startOf('week')
        ?.subtract(1, 'week')
        ?.format('YYYY-MM-DD'),
      toDate: moment()
        ?.endOf('week')
        ?.subtract(1, 'week')
        ?.format('YYYY-MM-DD'),
    },
    {
      name: 'Previous Month',
      fromDate: moment()
        ?.startOf('month')
        ?.subtract(1, 'month')
        ?.format('YYYY-MM-DD'),
      toDate: moment()
        ?.endOf('month')
        ?.subtract(1, 'month')
        ?.format('YYYY-MM-DD'),
    },
    {
      name: 'Previous Quarter',
      fromDate: moment()
        ?.startOf('quarter')
        ?.subtract(1, 'quarter')
        ?.format('YYYY-MM-DD'),
      toDate: moment()
        ?.endOf('quarter')
        ?.subtract(1, 'quarter')
        ?.format('YYYY-MM-DD'),
    },
    {
      name: 'Previous Year',
      fromDate: getFiscalYearTimestamps()?.last?.start,
      toDate: getFiscalYearTimestamps()?.last?.end,
    },
  ];

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => {
        onClose();
        setCustomDatePicker(false);
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        elevation: 3,
        style: {
          ...popoverStyle,
          width: customDatePicker ? 'auto' : fromWidth || '200px',
        },
      }}
    >
      <>
        {!customDatePicker ? (
          <div className={css.dropDown}>
            {dateList?.map((val) => (
              <div
                onClick={() => {
                  onPeriodChange(val?.fromDate, val?.toDate, val?.name);
                }}
              >
                <p
                  className={
                    val?.name === 'Custom' ? css.dropDownCustom : css.dropDownP
                  }
                >
                  {val?.name}
                </p>
              </div>
            ))}
            <div
              onClick={() => {
                setCustomDatePicker(true);
              }}
            >
              <p className={css.dropDownCustom}>Custom</p>
            </div>
          </div>
        ) : (
          <MobileDateRangePicker
            handleDate={(val) => onPeriodChange(val[0], val[1], 'Custom')}
            handleClose={() => {
              onClose();
              setCustomDatePicker(false);
            }}
          />
        )}
      </>
    </Popover>
  );
};

export default MultipleDatePopover;
