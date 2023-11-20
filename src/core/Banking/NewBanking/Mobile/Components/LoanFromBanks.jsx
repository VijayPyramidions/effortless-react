import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import {
  setOneLoanDetail,
  getEMIStatement,
} from '@action/Store/Reducers/Banking/BankingState';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { IndianCurrency } from '@components/utils';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import { Box, Typography, Stack, Tooltip } from '@mui/material';

import * as css from '../bankingmobile.scss';

const LoanFromBanks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bankLoans } = useSelector((state) => state.Banking);

  const loanClick = (emiData) => () => {
    if (emiData.status === 'not_started') {
      dispatch(
        openSnackbar({
          message: 'Loan is Processing...',
          type: MESSAGE_TYPE.WARNING,
        })
      );
      return;
    }

    dispatch(setOneLoanDetail(emiData));
    dispatch(getEMIStatement(emiData.id));
    navigate('/banking-loan-detail');
  };

  return (
    <Box className={css.bankloancontainer}>
      <Stack className={css.bncon}>
        {Object.keys(bankLoans)?.map((item) => (
          <>
            <Typography
              className={`${css.loanheader} ${
                item === 'emi' && css.upppercase
              }`}
            >{`${item.replace('_', ' ')} ( ${
              bankLoans[item].length
            } )`}</Typography>

            <Stack className={css.scrollcontainer}>
              {bankLoans[item]?.map((row) => (
                <Stack
                  className={css.loancontainer}
                  key={row.id}
                  onClick={loanClick(row)}
                >
                  <Stack className={css.loanwrp}>
                    <Stack>
                      <Typography className={css.loanlabel}>
                        Lender Name
                      </Typography>
                      <Tooltip title={row.lender_name}>
                        <Typography className={css.loanvalue}>
                          {row?.lender_name?.length > 7
                            ? `${row?.lender_name?.slice(0, 7)}...`
                            : row?.lender_name}
                        </Typography>
                      </Tooltip>
                    </Stack>
                    <Stack>
                      <Typography className={css.loanlabel}>Purpose</Typography>
                      <Typography className={css.loanvalue}>
                        {row.purpose || '-'}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography className={css.loanlabel}>
                        Loan Amount
                      </Typography>
                      <Typography className={`${css.loanvalue} ${css.alright}`}>
                        {IndianCurrency.format(row.loan_amount || 0)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className={css.loanwrp}>
                    <Stack>
                      <Typography className={css.loanlabel}>
                        Interest Rate
                      </Typography>
                      <Typography className={css.loanvalue}>{`${
                        row.interest_rate || 0
                      }%`}</Typography>
                    </Stack>
                    <Stack>
                      <Typography className={css.loanlabel}>
                        Outstanding Amount
                      </Typography>
                      <Typography className={`${css.loanvalue} ${css.alright}`}>
                        {IndianCurrency.format(row.outstanding_amount || 0)}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography className={css.loanlabel}>
                        EMI’s Paid
                      </Typography>
                      <Typography
                        className={`${css.loanvalue} ${css.alright}`}
                      >{`${row.emi_paid || 0}/${row.periods || 0}`}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </>
        ))}
      </Stack>
    </Box>
  );
};

export default LoanFromBanks;
