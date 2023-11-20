import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { retryPayments } from '@action/Store/Reducers/Payments/MakePaymentState';
import { enableLoading } from '@action/Store/Reducers/Errors/Errors';

import {
  Grid,
  CardMedia,
  Typography,
  Card,
  Button,
  Stack,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import silencer from '../../assets/WebAssets/silencer.svg';
import CircleOk from '../../assets/WebAssets/circle-ok.svg';
import ErrorImg from '../../assets/WebAssets/error.svg';
import StopWatch from '../../assets/WebAssets/stopwatch.svg';

import * as css from './FinalPayment.scss';

export const FinalPayment = ({ paymentsResponse, paymentType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const [failedState, setFailedState] = useState(false);
  const [failedStateList, setFailedStateList] = useState([]);

  useEffect(() => {
    if (paymentsResponse?.length > 0) {
      setFailedState(
        paymentsResponse.find((ele) => ele.payment_status === 'Failed').id !==
          null ||
          paymentsResponse.find((ele) => ele.payment_status === 'Failed').id !==
            '',
      );
      setFailedStateList(
        paymentsResponse.map((ele) => {
          if (ele.payment_status === 'Failed') return ele.payment_order_id;
          return '';
        }),
      );
    }
  }, [paymentsResponse]);

  const RetryPayment = async () => {
    dispatch(enableLoading(true));
    dispatch(retryPayments({ payment_order_ids: failedStateList }));
  };

  return (
    <Card
      className={css.CardComponent}
      sx={{ height: mobile ? 'auto !important' : '70vh !important' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5} md={5} className={css.LeftSide}>
          <CardMedia
            component="img"
            src={silencer}
            alt="silencer"
            className={css.Img}
          />
          <Typography className={css.head}>Heads Up!</Typography>
          {failedState && (
            <>
              <Typography className={css.subhead} align="center">
                Not All Transactions were Successful
              </Typography>
              {paymentType === 'voucher_payment' && (
                <Button className={css.btnhead} onClick={() => RetryPayment()}>
                  <Typography className={css.btn}>
                    Retry Unsuccesful Payments
                  </Typography>
                </Button>
              )}
            </>
          )}
          <Typography
            className={css.link}
            role="presentation"
            onClick={() => {
              navigate('/payment');
            }}
          >
            Return to Payment Dashboard
          </Typography>
        </Grid>
        <Stack
          sx={{ display: mobile ? 'none' : 'flex' }}
          className={css.divider}
        />
        <Grid item xs={12} lg={6} md={6} className={css.RightSide}>
          {paymentsResponse?.map((ele) => (
            <Card elevation={1} className={css.Box}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography className={css.BoxHead}>
                    {ele.vendor_name}
                  </Typography>
                  <Typography className={css.BoxSubHead}>
                    Paid from Effortless Virtual Account
                  </Typography>
                  <Typography className={css.BoxAmount}>
                    {`Rs. ${ele.amount}`}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Stack direction="column">
                    <Stack className={css.ImgHead}>
                      {ele.payment_status === 'Failed' && (
                        <>
                          {' '}
                          <CardMedia
                            className={css.BoxImg}
                            component="img"
                            src={ErrorImg}
                            alt="ErrorImg"
                          />
                          <Typography className={css.BoxFailed}>
                            {ele.payment_status}
                          </Typography>{' '}
                        </>
                      )}
                      {ele.payment_status === 'Success' && (
                        <>
                          <CardMedia
                            className={css.BoxImg}
                            component="img"
                            src={CircleOk}
                            alt="CircleOk"
                          />
                          <Typography className={css.BoxSuccess}>
                            {ele.payment_status}
                          </Typography>
                        </>
                      )}
                      {ele.payment_status === 'Processing' && (
                        <>
                          <CardMedia
                            className={css.BoxImg}
                            component="img"
                            src={StopWatch}
                            alt="CircleOk"
                          />
                          <Typography className={css.BoxProcessing}>
                            {ele.payment_status}
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};
