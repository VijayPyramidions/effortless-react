import React from 'react';
import * as Mui from '@mui/material';
import moment from 'moment';
import * as Router from 'react-router-dom';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import * as css from '../Ageing/Ageing.scss';

const OpenContent = ({ val, i, callFunction, vendorId }) => {
  const navigate = Router.useNavigate();
  const [billsView, setBillsView] = React.useState(false);

  return (
    <Mui.Box
      sx={{
        bgcolor: i % 2 === 0 ? '#FFF' : '#F2F2F2',
        padding: '10px',
        marginBottom: billsView ? '15px' : '0',
        boxShadow: billsView ? '0px 2px 11px #0000001a' : '0',
      }}
      onClick={() => setBillsView(!billsView)}
    >
      <Mui.Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Mui.Typography
          className={css.showText}
          width="24%"
          noWrap
          sx={{ color: val?.bill_id ? '#1F4FB9 !important' : '#000' }}
        >
          {val?.bill_number || '-'}
        </Mui.Typography>
        <Mui.Typography className={css.showText} width="24%">
          {moment(val?.date).format('DD-MMM-YYYY')}
        </Mui.Typography>
        <Mui.Typography className={`${css.showText} ${val?.amount < 0 ? css.redColor : ''}`} width="24%">
          {FormattedAmount(val?.amount)}
        </Mui.Typography>
        <Mui.Typography
          className={css.showText}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
          width="28%"
        >
          {`${val?.over_due_age} days` || '-'}
          <span>
            <KeyboardArrowDown
              style={{ color: '#F08B32' }}
              className={!billsView ? css.iconRotateAg : css.iconDropAg}
            />
          </span>
        </Mui.Typography>
      </Mui.Stack>
      {billsView && (
        <Mui.Stack>
          <Mui.Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Mui.ListItemText
              primary={
                <Mui.Typography className={css.hideHead} width="auto" noWrap>
                  Due Date
                </Mui.Typography>
              }
              secondary={
                <Mui.Typography className={css.hideBody}>
                  {moment(val?.due_date).format('DD-MMM-YYYY')}
                </Mui.Typography>
              }
            />
            <Mui.ListItemText
              primary={
                <Mui.Typography className={css.hideHead} width="25%">
                  Payments
                </Mui.Typography>
              }
              secondary={
                <Mui.Typography className={css.hideBody}>
                  {FormattedAmount(val?.collection)}
                </Mui.Typography>
              }
            />
            <Mui.ListItemText
              primary={
                <Mui.Typography className={css.hideHead} width="25%">
                  Balance
                </Mui.Typography>
              }
              secondary={
                <Mui.Typography className={css.hideBody}>
                  {FormattedAmount(val?.balance)}
                </Mui.Typography>
              }
            />
            <Mui.ListItemText
              primary={
                <Mui.Typography className={css.hideHead} width="auto" noWrap>
                  Credit Period
                </Mui.Typography>
              }
              secondary={
                <Mui.Typography className={css.hideBody}>
                  {val?.credit_period || '-'}
                </Mui.Typography>
              }
            />
          </Mui.Stack>

          <Mui.Stack direction="row" alignItems="center" width="100%">
            <Mui.ListItemText
              primary={
                <Mui.Typography className={css.hideHead} noWrap>
                  Description
                </Mui.Typography>
              }
              secondary={
                <Mui.Typography className={css.hideBody}>
                  {val?.narration || '-'}
                </Mui.Typography>
              }
            />
          </Mui.Stack>
          <Mui.Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            width="100%"
            mt="10px"
          >
            {val?.bill_id && (
              <Mui.Button
                variant="outlined"
                sx={{
                  textTransform: 'capitalize !important',
                  margin: '0 5px !important',
                  bgcolor: '#FFF !important',
                  color: '#00A676 !important',
                  border: '1px solid #00A676 !important',
                  borderRadius: '5px !important',
                  padding: '6px 16px !important'
                }}
                onClick={() => {
                  callFunction(val?.bill_id);
                }}
              >
                View Invoice
              </Mui.Button>
            )}
            <Mui.Button
              variant="contained"
              sx={{
                textTransform: 'capitalize !important',
                margin: '0 5px !important',
                bgcolor: '#00A676 !important',
                color: '#FFF !important',
                borderRadius: '5px !important',
                padding: '6px 16px !important'
              }}
              onClick={() => {
                navigate('/payment-makepayment', {
                  state: {
                    payables: {
                      id: vendorId,
                      amount: val?.balance,
                      narration: val?.narration,
                      txn_line_id: val?.txn_line_id,
                    },
                  },
                });
              }}
            >
              Pay Now
            </Mui.Button>
          </Mui.Stack>
        </Mui.Stack>
      )}
    </Mui.Box>
  );
};

export default OpenContent;
