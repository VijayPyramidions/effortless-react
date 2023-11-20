import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { Box, Stack, Typography } from '@mui/material';
import { IndianCurrency } from '@components/utils';

import * as css from '../bankingmobile.scss';

const LoanFromPromoter = () => {
  const { loanDetails } = useSelector((state) => state.Banking);

  return (
    <Box className={css.prom_other_container}>
      <Stack className={css.animicontainer}>
        {loanDetails?.map((item) => (
          <Stack className={css.loanlistwrp} key={item.id}>
            <Stack className={css.loanitemwrp}>
              <Stack>
                <Typography className={css.loanlabel}>Promotor Name</Typography>
                <Typography
                  className={css.loanvalue}
                  sx={{ fontWeight: '500 !important' }}
                >
                  {item?.lender_name?.lenght > 13
                    ? `${item?.lender_name.slice(0, 13)}...` || '-'
                    : item?.lender_name || '-'}
                </Typography>
              </Stack>
              <Stack>
                <Typography className={css.loanlabel}>Date</Typography>
                <Typography className={css.loanvalue}>
                  {item?.date ? moment(item?.date).format('MMM DD, YYYY') : '-'}
                </Typography>
              </Stack>
              <Stack>
                <Typography className={css.loanlabel}>Loan Given</Typography>
                <Typography
                  className={css.loanvalue}
                  sx={{ textAlign: 'right' }}
                >
                  {IndianCurrency.format(item?.loan_taken || 0)}
                </Typography>
              </Stack>
            </Stack>
            <Stack className={css.loanitemwrp}>
              <Stack>
                <Typography className={css.loanlabel}>Loan Amount</Typography>
                <Typography className={css.loanvalue}>
                  {IndianCurrency.format(item?.loan_amount_repaid || 0)}
                </Typography>
              </Stack>
              <Stack>
                <Typography className={css.loanlabel}>
                  Outstanding Balance
                </Typography>
                <Typography
                  className={css.loanvalue}
                  sx={{ textAlign: 'right' }}
                >
                  {IndianCurrency.format(item?.outstanding_amount || 0)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default memo(LoanFromPromoter);
