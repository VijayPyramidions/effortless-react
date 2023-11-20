import React, { memo } from 'react';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';

import Jio from '@assets/phonePostpaid/jio.svg';
import BPBS from '@assets/phonePostpaid/bpbs.svg';

import * as css from './billdetailinfo.scss';

const BillInfo = ({
  ViewBillDetails,
  paytype,
  billInfoDetails,
  selectedProvider,
  mobile,
  // phone,
  OnSubmit,
}) => {
  const IndianCurrency = Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
  return (
    <Box className={css.billinfocontainer}>
      <Stack className={css.bar} />
      <Stack className={css.providerinfowrp}>
        <Avatar src={Jio} alt="prodiver logo" className={css.providerlogo} />
        <Stack sx={{ flex: 1 }}>
          <Stack className={css.paytypewrp}>
            <Typography className={css.paytype}>{paytype}</Typography>
            <Button className={css.billdetailbtn} onClick={ViewBillDetails}>
              View Bill Details
            </Button>
          </Stack>
          <Typography className={css.providername}>
            {selectedProvider.name}
          </Typography>
        </Stack>
      </Stack>

      <Stack className={css.billinfo}>
        <Typography className={css.billamtlabel}>AMOUNT</Typography>
        <Typography className={css.billamt}>
          {IndianCurrency.format(billInfoDetails.total_amount)}
        </Typography>
        <Stack className={css.labelwrp}>
          {Object.keys(mobile)?.map((item) => (
            <>
              <Typography className={css.label}>
                {item?.replace('_', ' ')}
              </Typography>
              <span className={css.spacer}>-</span>
              <Typography className={css.value}>{mobile[item]}</Typography>
            </>
          ))}
        </Stack>
        <Stack className={css.labelwrp}>
          <Typography className={css.label}>Customer Name</Typography>
          <span className={css.spacer}>-</span>
          <Typography className={css.value}>
            {billInfoDetails.account_holder_name}
          </Typography>
        </Stack>
      </Stack>
      {billInfoDetails.paid && (
        <Typography className={css.paidmsg}>
          All good here! your Bill is{' '}
          <sapn style={{ color: '#00A676' }}>already paid </sapn>
        </Typography>
      )}
      <Stack>
        <Button
          className={css.paybtn}
          disabled={billInfoDetails.total_amount === 0 || billInfoDetails.paid}
          onClick={OnSubmit}
        >
          Pay your Bill
        </Button>
      </Stack>

      <Stack className={css.bpbswrp}>
        <Typography className={css.bpbstitle}>
          Secured by Bharat BillPay
        </Typography>
        <Avatar src={BPBS} alt="bpbs" className={css.bpbslogo} />
      </Stack>
    </Box>
  );
};

export default memo(BillInfo);
