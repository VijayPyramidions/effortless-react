import React, { useState } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { AmountFormatCustom } from '@components/Input/Input.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import * as Mui from '@mui/material';
import { Checkbox } from '@material-ui/core';
import { CheckSvg, CheckedSvg } from './Icons';
import * as css from '../MakePayment.scss';

export const Bill = ({
  name,
  day,
  totalAmount,
  handleChange,
  checked,
  tabValue,
  handleAmountChange,
  paidAmount,
  updateAmount,
  hasAgeDescription,
  descriptionColor,
  date,
}) => {
  const device = localStorage.getItem('device_detect');

  const [year, month, daydate] = date
    ? moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')?.split('-')
    : moment().format('YYYY-MM-DD').split('-');

  const label = { inputProps: { 'aria-label': name } };
  const [error, setError] = useState(false);

  const validateAmount = async () => {
    if (Number(paidAmount) === 0 || Number(paidAmount) > Number(totalAmount)) {
      setError(true);
    } else {
      setError(false);
      await updateAmount();
    }
  };

  const useStyles = makeStyles({
    root: {
      margin: (props) =>
        props.tabValue === 0 ? '10px 30px 10px 20px' : '10px 8px 10px 0',
    },
    inputBox: {
      backgroundColor: 'white !important',
      height: device === 'desktop' ? '18px !important' : '32px !important',
      width: '100px !important',
      borderRadius: device === 'desktop' ? '5px !important' : '8px !important',
      border: '1px solid #A0A4AF',
      '& .MuiInputBase-input': {
        textAlign: 'right',
        paddingRight: 5,
      },
    },
    checked: {
      right: (props) => (props.tabValue === 0 ? '20px' : '10px'),
      top: '8px',
    },
    billBody: {
      margin: (props) =>
        props.tabValue === 0 ? '10px 0 10px 16px' : '0 0 0 4px',
      flex: 1,
    },
  });

  const classes = useStyles({ tabValue });

  return (
    <Mui.Stack
      direction={device === 'desktop' && 'row'}
      className={
        device === 'desktop'
          ? css.billBodyDesktop
          : `${css.billItem} ${classes.root}`
      }
    >
      <Mui.Stack>
        <Checkbox
          {...label}
          icon={<CheckSvg />}
          checkedIcon={<CheckedSvg />}
          checked={checked}
          onChange={handleChange}
        />
      </Mui.Stack>
      <Mui.Stack className={classes.billBody}>
        <p className={css.billName}>
          {name} &#40; {daydate}-{month}-{year} &#41;
        </p>
        {hasAgeDescription ? (
          <p className={css.overdue} style={{ color: `${descriptionColor}` }}>
            {day}
          </p>
        ) : (
          <p className={css.overdue} style={{ color: `${descriptionColor}` }}>
            {day}
          </p>
        )}
      </Mui.Stack>
      {device === 'desktop' ? (
        <>
          {checked ? (
            <>
              <div className={css.checkedDesktop}>
                <Mui.Stack spacing={1}>
                  <Mui.Typography className={css.checkedText}>
                    to pay
                  </Mui.Typography>

                  <AmountFormatCustom
                    align="right"
                    className={`${classes.inputBox} ${css.customPlaceholder} ${
                      error ? css.error : ''
                    }`}
                    placeholder={FormattedAmount(totalAmount)}
                    onBlur={validateAmount}
                    onChange={handleAmountChange}
                    value={paidAmount}
                    max={totalAmount}
                    min={0}
                  />
                </Mui.Stack>
                <Mui.Stack
                  style={{ backgroundColor: '#D6D6D6', width: '1px' }}
                />
                <Mui.Stack
                  spacing={1}
                  style={{ alignSelf: 'center', paddingLeft: '10px' }}
                >
                  <Mui.Typography className={css.checkedText}>
                    pending amount{' '}
                    {FormattedAmount(Number(totalAmount) - Number(paidAmount))}
                  </Mui.Typography>
                  <p style={{ textAlign: 'left' }}>
                    Out of {FormattedAmount(totalAmount)}
                  </p>
                </Mui.Stack>
              </div>
            </>
          ) : (
            <p className={css.totalAmount}>{FormattedAmount(totalAmount)}</p>
          )}
        </>
      ) : (
        <>
          {checked ? (
            <>
              <div className={`${css.checked} ${classes.checked}`}>
                <AmountFormatCustom
                  align="right"
                  className={`${classes.inputBox} ${css.customPlaceholder} ${
                    error ? css.error : ''
                  }`}
                  placeholder={FormattedAmount(totalAmount)}
                  onBlur={validateAmount}
                  onChange={handleAmountChange}
                  value={paidAmount}
                  max={totalAmount}
                  min={0}
                />
                <p>Out of {FormattedAmount(totalAmount)}</p>
              </div>
            </>
          ) : (
            <p className={css.totalAmount}>{FormattedAmount(totalAmount)}</p>
          )}
        </>
      )}
    </Mui.Stack>
  );
};
export default Bill;
