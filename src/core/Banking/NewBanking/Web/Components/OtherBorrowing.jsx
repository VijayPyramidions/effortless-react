import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import {
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { getLoanDetails } from '@action/Store/Reducers/Banking/BankingState';

import { IndianCurrency } from '@components/utils';

import * as css from '../../bankingnew.scss';

const OtherBorrowing = () => {
  const dispatch = useDispatch();
  const { active, loanDetails } = useSelector((state) => state.Banking);

  useEffect(() => {
    dispatch(getLoanDetails(active.BorrowType));
  }, [active.BorrowType]);

  return (
    <Stack className={css.bodycontainer}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow className={css.otherborrowheadrow}>
            <TableCell>Promotor Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Loan Given</TableCell>
            <TableCell>Loan Amount Repaid</TableCell>
            <TableCell>Outstanding Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loanDetails.length > 0 ? (
            <>
              {loanDetails?.map((row) => (
                <TableRow className={css.otherborrowbodyrow} key={row.id}>
                  <TableCell>{row.lender_name || '-'}</TableCell>
                  <TableCell>
                    {moment(row.date, 'YYYY-MM-DD').format('MMM DD YYYY')}
                  </TableCell>
                  <TableCell>
                    {' '}
                    {IndianCurrency.format(row?.loan_taken || 0)}{' '}
                  </TableCell>
                  <TableCell>
                    {IndianCurrency.format(row?.loan_amount_repaid || 0)}
                  </TableCell>
                  <TableCell>
                    {IndianCurrency.format(row?.outstanding_amount || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow className={css.otherborrowbodyrow}>
              <TableCell colSpan={5} sx={{ textAlign: 'center !important' }}>
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default OtherBorrowing;
