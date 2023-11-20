import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

import {
  getBorrowingList,
  getEMIStatement,
} from '@action/Store/Reducers/Banking/BankingState';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { IndianCurrency } from '@components/utils';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import LoanAmount from '@assets/loanamt.svg';
import EMIStart from '@assets/emistart.svg';
import Period from '@assets/period.svg';
import InterestRate from '@assets/interestrate.svg';

import * as css from '../../bankingnew.scss';
import OtherBorrowing from './OtherBorrowing';

const BorrowingsLists = () => {
  const dispatch = useDispatch();

  const { bankLoans, EMIStatementDetail, active } = useSelector(
    (state) => state.Banking
  );

  const [oneEmi, setOneEmi] = useState({});
  const [viewEMIDetail, setViewEMIDetail] = useState({});

  const EMIDetails = (emiData, title) => () => {
    if (emiData.status === 'not_started') {
      dispatch(
        openSnackbar({
          message: 'Loan is Processing...',
          type: MESSAGE_TYPE.WARNING,
        })
      );
      return;
    }

    let emi_title;
    if (title === 'emi') emi_title = title.toUpperCase();
    else
      emi_title = title
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (word) => word.toUpperCase());

    setOneEmi(emiData);
    setViewEMIDetail({ ...viewEMIDetail, open: true, title: emi_title });
    dispatch(getEMIStatement(emiData.id));
  };

  useEffect(() => {
    dispatch(getBorrowingList());
  }, []);

  useEffect(() => {
    setViewEMIDetail(false);
  }, [active.BorrowType]);

  return (
    <Box className={css.brcontainer}>
      <Stack className={css.brcontainer_header}>
        {viewEMIDetail.open ? (
          <>
            <IconButton
              sx={{ padding: '0px', marginRight: '8px' }}
              onClick={() => setViewEMIDetail(false)}
            >
              <KeyboardArrowLeftRoundedIcon sx={{ color: '#000000' }} />
            </IconButton>
            <Typography variant="h4" className={css.headertext}>
              {`Borrowings / ${viewEMIDetail.title}`}
            </Typography>
          </>
        ) : (
          <Typography variant="h4" className={css.headertext}>
            {active.BorrowType}
          </Typography>
        )}
      </Stack>
      {active.BorrowType === 'Loan from Banks' ? (
        <>
          {!viewEMIDetail.open ? (
            <Stack className={css.borrowlistwrp}>
              {Object.keys(bankLoans || {})?.map((row) => (
                <>
                  <Typography
                    className={`${css.borrowtype} ${
                      row === 'emi' && css.upppercase
                    }`}
                  >
                    {row.replace('_', ' ')}
                  </Typography>
                  {bankLoans[row].map((item) => (
                    <>
                      {item.status === 'not_started' ? (
                        <Box
                          className={css.borrowlistitem}
                          key={item.id}
                          onClick={EMIDetails(item, row)}
                        >
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              Lender Name
                            </Typography>

                            <Tooltip title={item.lender_name || '-'} arrow>
                              <Typography className={css.borrowel_value}>
                                {item.lender_name.length > 10
                                  ? `${item.lender_name.slice(0, 9)}...` || '_'
                                  : item.lender_name || '_'}
                              </Typography>
                            </Tooltip>
                          </Stack>
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              Purpose
                            </Typography>
                            <Typography className={css.borrowel_value}>
                              {item.purpose || '-'}
                            </Typography>
                          </Stack>
                          <Stack className={`${css.borrowel} ${css.flex_}`}>
                            <Stack
                              sx={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Typography className={css.spaccountbadge} />
                              <Typography className={css.borrowel_header}>
                                Pending for SuperAccountant
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      ) : (
                        <Box
                          className={css.borrowlistitem}
                          key={item.id}
                          onClick={EMIDetails(item, row)}
                        >
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              Lender Name
                            </Typography>
                            <Tooltip title={item.lender_name || '-'} arrow>
                              <Typography className={css.borrowel_value}>
                                {item.lender_name.length > 10
                                  ? `${item.lender_name.slice(0, 9)}...` || '_'
                                  : item.lender_name || '_'}
                              </Typography>
                            </Tooltip>
                          </Stack>
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              Purpose
                            </Typography>
                            <Typography className={css.borrowel_value}>
                              {item.purpose || '-'}
                            </Typography>
                          </Stack>
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              Loan Amount
                            </Typography>
                            <Typography className={css.borrowel_value}>
                              {IndianCurrency.format(item.loan_amount || 0)}
                            </Typography>
                          </Stack>
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              Interest Rate
                            </Typography>
                            <Typography className={css.borrowel_value}>
                              {`${item.interest_rate}%`}
                            </Typography>
                          </Stack>
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              Outstanding Amount
                            </Typography>
                            <Typography className={css.borrowel_value}>
                              {IndianCurrency.format(
                                item.outstanding_amount || 0
                              )}
                            </Typography>
                          </Stack>
                          <Stack className={css.borrowel}>
                            <Typography className={css.borrowel_header}>
                              EMI’s Paid
                            </Typography>
                            <Typography className={css.borrowel_value}>
                              {`${item.emi_paid || 0}/${item.periods || 0}`}
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                    </>

                    // <Box className={css.borrowlistitem} key={item.id}>
                    //   <Stack className={css.borrowel}>
                    //     <Typography className={css.borrowel_header}>Lender Name</Typography>
                    //     <Typography className={css.borrowel_value}>Mr.Loki</Typography>
                    //   </Stack>

                    //   <Stack className={css.borrowel}>
                    //     <Typography className={css.borrowel_header}>Loan Amount</Typography>
                    //     <Typography className={css.borrowel_value}>₹50019.00</Typography>
                    //   </Stack>
                    //   <Stack className={css.borrowel}>
                    //     <Typography className={`${css.borrowel_header} ${css.mr_40}`}>
                    //       Interest Rate
                    //     </Typography>
                    //     <Typography className={`${css.borrowel_value} ${css.mr_40}`}>
                    //       15%
                    //     </Typography>
                    //   </Stack>
                    //   <Stack className={css.borrowel}>
                    //     <Typography className={css.borrowel_header}>
                    //       Outstanding Amount
                    //     </Typography>
                    //     <Typography className={css.borrowel_value}>₹41922.35</Typography>
                    //   </Stack>
                    // </Box>
                  ))}
                </>
              ))}
            </Stack>
          ) : (
            <Stack className={css.bodycontainer}>
              <Stack
                sx={{ padding: '24px', marginBottom: '7px' }}
                className={css.bordetail}
              >
                <Stack className={css.lenderwrp}>
                  <Typography className={css.lenderlabel}>
                    Lender Name
                  </Typography>
                  <Typography className={css.lendervalue}>
                    {oneEmi.lender_name || '-'}
                  </Typography>
                </Stack>
                <Stack className={css.puposewrp}>
                  <Typography className={css.purposelabel}>Purpose</Typography>
                  <Typography className={css.purposevalue}>
                    {oneEmi.purpose || '-'}
                  </Typography>
                </Stack>
                <Stack className={css.emidetail}>
                  <Stack className={css.emailitemwrp}>
                    <img
                      src={LoanAmount}
                      alt="Loan Amount"
                      width="32px"
                      height="32px"
                    />
                    <Stack sx={{ marginLeft: '16px' }}>
                      <Typography className={css.itemlabel}>
                        Loan Amount
                      </Typography>
                      <Typography className={css.itemvalue}>
                        {IndianCurrency.format(oneEmi.loan_amount || 0)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className={css.emailitemwrp}>
                    <img
                      src={EMIStart}
                      alt="EMI Start Date"
                      width="32px"
                      height="32px"
                    />
                    <Stack sx={{ marginLeft: '16px' }}>
                      <Typography className={css.itemlabel}>
                        EMI Start Date
                      </Typography>
                      <Typography className={css.itemvalue}>
                        {oneEmi.emi_start_date !== null
                          ? moment(oneEmi.emi_start_date, 'YYYY-MM-DD').format(
                              'DD MMM YYYY'
                            )
                          : '-'}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className={css.emailitemwrp}>
                    <img src={Period} alt="Period" width="32px" height="32px" />
                    <Stack sx={{ marginLeft: '16px' }}>
                      <Typography className={css.itemlabel}>Period</Typography>
                      <Typography className={css.itemvalue}>{`${
                        oneEmi.periods || 0
                      } Months`}</Typography>
                    </Stack>
                  </Stack>
                  <Stack className={css.emailitemwrp}>
                    <img
                      src={InterestRate}
                      alt="Interest Date"
                      width="32px"
                      height="32px"
                    />
                    <Stack sx={{ marginLeft: '16px' }}>
                      <Typography className={css.itemlabel}>
                        Interest Rate
                      </Typography>
                      <Typography
                        className={css.itemvalue}
                      >{`${oneEmi.interest_rate}%`}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <TableContainer className={css.bordetail}>
                <Table sx={{ minWidth: 650 }} stickyHeader>
                  <TableHead>
                    <TableRow className={css.emitableheadrow}>
                      <TableCell>Date</TableCell>
                      <TableCell>Opening Balance</TableCell>
                      <TableCell>Principal</TableCell>
                      <TableCell>Interest</TableCell>
                      <TableCell>EMI Payment</TableCell>
                      <TableCell>Closing Balance</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {EMIStatementDetail?.map((row) => (
                      <TableRow className={css.emitablebodyrow}>
                        <TableCell>
                          {moment(row.period).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          {IndianCurrency.format(row.opening_balance || 0)}
                        </TableCell>
                        <TableCell>
                          {IndianCurrency.format(row.principal || 0)}
                        </TableCell>
                        <TableCell>
                          {IndianCurrency.format(row.interest || 0)}
                        </TableCell>
                        <TableCell>
                          {IndianCurrency.format(row.emi_payment || 0)}
                        </TableCell>
                        <TableCell>
                          {IndianCurrency.format(row.closing_balance || 0)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              row.paid ? css.paidbadge : css.unpaidbadge
                            }
                          >
                            {row.paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}
        </>
      ) : (
        <OtherBorrowing />
      )}
    </Box>
  );
};

export default BorrowingsLists;
