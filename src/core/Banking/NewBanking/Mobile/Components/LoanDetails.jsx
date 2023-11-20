import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import {
  Stack,
  Avatar,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { IndianCurrency } from '@components/utils';

import LoanAmount from '@assets/loanamt.svg';
import EMIStart from '@assets/emistart.svg';
import Period from '@assets/period.svg';
import InterestRate from '@assets/interestrate.svg';

import * as css from '../bankingmobile.scss';

const EMIDetails = () => {
  const { oneLoanDetail, EMIStatementDetail } = useSelector(
    (state) => state.Banking
  );
  console.log(EMIStatementDetail, oneLoanDetail);

  return (
    <Box className={css.loanDetailContainer}>
      <Stack className={css.loanhead}>
        <Stack className={css.lenderdetailwrp}>
          <Typography className={css.label}>Lender Name</Typography>
          <Typography className={css.value}>
            {oneLoanDetail.lender_name || '-'}
          </Typography>
        </Stack>
        <Stack className={css.lenderdetailwrp}>
          <Typography className={css.label}>Purpose</Typography>
          <Typography className={css.value}>
            {oneLoanDetail.purpose || '-'}
          </Typography>
        </Stack>
      </Stack>
      <Stack className={css.loanratescontainer}>
        <Stack className={css.itemwrp}>
          <Stack direction="row" mb="16px">
            <Avatar src={LoanAmount} alt="loan amount" className={css.icon} />
            <Stack>
              <Typography className={css.label}>Loan Amount</Typography>
              <Typography className={css.value}>
                {IndianCurrency.format(oneLoanDetail.loan_amount || 0)}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Avatar src={Period} alt="period" className={css.icon} />
            <Stack>
              <Typography className={css.label}>Period</Typography>
              <Typography className={css.value}>
                {oneLoanDetail.periods
                  ? `${oneLoanDetail.periods} Months`
                  : '-'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack className={css.itemwrp}>
          <Stack direction="row" mb="16px">
            <Avatar src={EMIStart} alt="emi" className={css.icon} />
            <Stack>
              <Typography className={css.label}>EMI Start Date</Typography>
              <Typography className={css.value}>
                {moment(oneLoanDetail.emi_start_date).format('DD MMM YYYY')}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Avatar src={InterestRate} alt="interest" className={css.icon} />
            <Stack>
              <Typography className={css.label}>Interest Rate</Typography>
              <Typography className={css.value}>
                {Number(oneLoanDetail.interest_rate) > 1
                  ? `${oneLoanDetail.interest_rate}%`
                  : '-'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{ overflow: 'auto', height: 'calc(100vh - 353px)' }}
        className={css.loanlistcontainer}
      >
        {EMIStatementDetail?.map((item) => (
          <Accordion
            className={css.accroot}
            sx={{
              '&.Mui-expanded': {
                margin: 0,
              },
            }}
            key={item.id}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDownRoundedIcon />}
              sx={{
                padding: '0 12px',
                '&.Mui-expanded': {
                  minHeight: 'unset',
                },
                '& .MuiAccordionSummary-content.Mui-expanded': {
                  margin: '12px 0',
                },
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  color: '#F08B32',
                },
              }}
            >
              <Stack>
                <Stack direction="row" mb="8px">
                  <Typography className={css.acclabel}>Due On</Typography>
                  <Typography className={css.duedate}>
                    {item.period
                      ? moment(item.period).format('MMM DD, YYYY')
                      : '-'}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={css.acclabel}>EMI</Typography>
                  <Typography className={css.emiamount}>
                    {IndianCurrency.format(item.emi_payment || 0)}
                  </Typography>
                  {!item.paid ? (
                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                      <div className={css.unpaid}>
                        <div className={css.unpaidinline} />
                      </div>
                      <Typography className={css.unpaidstatus}>
                        Un Paid
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                      <div className={css.active}>
                        <div className={css.activeinline} />
                      </div>
                      <Typography className={css.activestatus}>Paid</Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: '0 12px 12px',
              }}
            >
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Stack>
                  <Stack direction="row" mb="8px" mr="8px">
                    <Typography className={css.ballabel} sx={{ width: '92px' }}>
                      Opening Balance
                    </Typography>
                    <Typography className={css.balamount}>
                      {IndianCurrency.format(item.opening_balance || 0)}
                    </Typography>
                  </Stack>
                  <Stack direction="row">
                    <Typography className={css.ballabel} sx={{ width: '92px' }}>
                      Closing Balance
                    </Typography>
                    <Typography className={css.balamount}>
                      {IndianCurrency.format(item.closing_balance || 0)}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack>
                  <Stack direction="row" mb="8px">
                    <Typography className={css.ballabel} sx={{ width: '45px' }}>
                      Principal
                    </Typography>
                    <Typography className={css.balamount}>
                      {IndianCurrency.format(item.principal || 0)}
                    </Typography>
                  </Stack>
                  <Stack direction="row">
                    <Typography className={css.ballabel} sx={{ width: '45px' }}>
                      Interest
                    </Typography>
                    <Typography className={css.balamount}>
                      {IndianCurrency.format(item.interest || 0)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
};

export default EMIDetails;
