/* eslint-disable no-nested-ternary */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Box,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import { IndianCurrency } from '@components/utils';
import { useStyles, StyledTextarea } from './CategorizationStyledComponents';
import * as css from './CategorizationCenter.scss';

let remainingInput = 0;

const AdvanceTaxCategorization = ({
  stateData,
  CategorizationAdvanceTaxTableDataState,
  setCategorizationState,
  selectedTransaction,
}) => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const tempAmount = Math.abs(stateData?.selecteddata?.amount);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsWithBalance, setSelectedRowsWithBalance] = useState([]);
  const [textValue, setTextValue] = useState();
  const [currentQuater, setCurrentQuater] = useState();
  const columns = [
    {
      headerName: 'Quarter',
    },
    {
      headerName: 'Payable Amount',
    },
    {
      headerName: 'Paid',
    },
    // {
    //   headerName: 'To Allocate',
    // },
    // {
    //   headerName: 'Balance',
    // },
  ];

  const findCurrentQuater = () => {
    let quaterData;
    const quater = CategorizationAdvanceTaxTableDataState?.filter((ele) => {
      const currentMonth = moment(selectedTransaction?.date).month();
      if (currentMonth === 1 || currentMonth === 2 || currentMonth === 3) {
        quaterData = `Quarter 4 ${moment().year()}`;
      } else if (
        currentMonth === 4 ||
        currentMonth === 5 ||
        currentMonth === 6
      ) {
        quaterData = `Quarter 1 ${moment().year()}`;
      } else if (
        currentMonth === 7 ||
        currentMonth === 8 ||
        currentMonth === 9
      ) {
        quaterData = `Quarter 2 ${moment().year()}`;
      } else {
        quaterData = `Quarter 3 ${moment().year()}`;
      }
      return quaterData === ele?.document_number;
    });
    console.log('quater', quater);
    CategorizationAdvanceTaxTableDataState?.forEach((element) => {
      if (element.id === quater[0]?.id) {
        element.transactionAmountPaid = selectedTransaction?.amount;
      }
    });
    setCurrentQuater(quater);
    console.log("selectedRows",selectedRows);
  };

  const TransactionAmtAssign = (transAmount, data) => {
    remainingInput = transAmount;
    const updatedArray = data
      ?.filter((row) => Number(row.net_balance) > 0)
      ?.reduce((result, item) => {
        if (remainingInput >= Number(item?.net_balance)) {
          remainingInput -= Number(item?.net_balance);
          return result.concat({
            id: item?.id,
            amount: Number(item?.net_balance),
            pendingAmount: item?.net_balance,
            balanceAmount: 0,
            originalArray: item,
          });
          // eslint-disable-next-line no-else-return
        } else if (remainingInput > 0) {
          const tempBalance = Number(item?.net_balance) - remainingInput;
          const reducedAmt = Number(item?.net_balance) - tempBalance;
          remainingInput = 0;
          return result.concat({
            id: item?.id,
            amount: reducedAmt,
            balanceAmount: tempBalance,
            pendingAmount: item?.net_balance,
            originalArray: item,
          });
        }
        return result;
      }, []);
    return updatedArray;
  };

  useEffect(() => {
    const tempArray = TransactionAmtAssign(
      tempAmount,
      CategorizationAdvanceTaxTableDataState
    );
    findCurrentQuater();
    setSelectedRowsWithBalance(tempArray);
    setSelectedRows(tempArray?.map((val) => val?.id));
  }, [CategorizationAdvanceTaxTableDataState, tempAmount, stateData]);

  useEffect(() => {
    if (textValue)
      setCategorizationState((prev) => ({ ...prev, narration: textValue }));
  }, [textValue]);

  useEffect(() => {
    setCategorizationState((prev) => ({
      ...prev,
      advanceData: {
        id: currentQuater && currentQuater[0]?.id,
        paid: Math.abs(selectedTransaction?.amount),
        tds: 0,
      },
    }));
  }, [currentQuater]);

  return device === 'desktop' ? (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        gap: '4%',
      }}
    >
      <Stack
        sx={{
          height: '100%',
          width: '68%',
        }}
      >
        <Box
          sx={{
            height: '85%',
            width: '100%',
            overflow: 'hidden',
            '& .edit-cell-background': {
              background: '#d9d9d959',
            },
          }}
        >
          <TableContainer className={css.statutoryduestableContainer}>
            <Table className={classes.table} stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {columns?.map((val) => (
                    <TableCell key={val}>{val?.headerName}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {CategorizationAdvanceTaxTableDataState?.filter((row) => row)
                  ?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns?.length + 1} align="center">
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
                {currentQuater?.length > 0 && CategorizationAdvanceTaxTableDataState?.length > 0 &&
                  CategorizationAdvanceTaxTableDataState?.filter(
                    (row) => row?.id === currentQuater[0]?.id
                  )?.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>{item?.document_number}</TableCell>
                      <TableCell align="right">
                        {IndianCurrency.format(
                          Math.abs(item?.transactionAmountPaid) ||
                            item?.amount ||
                            0
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {IndianCurrency.format(
                          Math.abs(item?.transactionAmountPaid) ||
                            item?.settled_amount ||
                            0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <div className={css.statutoryduescategorization}>
          <p className={css.totaltextcategorization}>Total</p>
          <div className={css.allocatebottomdiv}>
            {selectedRowsWithBalance?.length > 0
              ? IndianCurrency.format(
                  selectedRowsWithBalance?.reduce(
                    (total, item) => total + item.amount,
                    0
                  )  || 0
                )
              : currentQuater?.length > 0 ? IndianCurrency.format(
                Math.abs(selectedTransaction?.amount) || 0
              ) : 0}
          </div>
          <div className={css.balancebottomdiv}>
            {selectedRowsWithBalance?.length > 0
              ? IndianCurrency.format(
                  selectedRowsWithBalance?.reduce(
                    (total, item) => total + item.balanceAmount,
                    0
                  ) || 0
                )
              : currentQuater?.length > 0 ? IndianCurrency.format(
                Math.abs(selectedTransaction?.amount) || 0
              ) : 0}
          </div>
        </div>
      </Stack>

      <Box
        sx={{
          height: '100%',
          width: '28%',
        }}
      >
        <StyledTextarea
          placeholder="Notes (Optional)"
          onChange={(e) => setTextValue(e.target.value)}
          value={textValue}
        />
      </Box>
    </Box>
  ) : (
    (CategorizationAdvanceTaxTableDataState?.filter((row) => row)?.length ===
      0 && (
      <p style={{ textAlign: 'center', fontSize: 12, margin: '10px 0' }}>
        No Data Found
      </p>
    )) || (
      <div className={css.advancegivencategorizationmobile}>
        <Stack
          justifyContent="space-between"
          width="calc(100% - 24px)"
          direction="row"
          p="12px"
        >
          <p className={css.headeradvtxt}>Quarter</p>
          <p className={css.headeradvtxt}>Payable Amount</p>
          <p className={css.headeradvtxt}>Paid</p>
        </Stack>
        {CategorizationAdvanceTaxTableDataState?.map((item) => (
          <Box
            sx={{
              background: '#EDEDED',
              borderRadius: '0 0 8px 8px',
              margin: '5px 0px',
            }}
          >
            <Stack
              justifyContent="space-between"
              width="calc(100% - 26px)"
              direction="row"
              p="12px"
              sx={{
                background: '#fff',
                border: '1px solid #D8D8D8',
                borderRadius: '4px',
              }}
            >
              <Stack justifyContent="space-between" width="70%" direction="row">
                <p className={css.refnumbertxt}>{item?.document_number}</p>
                <p className={css.payabletxt}>
                  {IndianCurrency.format(
                    Math.abs(item?.transactionAmountPaid) || item?.amount || 0
                  )}
                </p>
              </Stack>
              <p className={css.paidtxt}>
                {IndianCurrency.format(
                  Math.abs(item?.transactionAmountPaid) ||
                    item?.settled_amount ||
                    0
                )}
              </p>
            </Stack>
          </Box>
        ))}

        <Box
          sx={{
            height: '20%',
            width: '100%',
          }}
        >
          <p className={css.noteheader}>Note (optional)</p>
          <StyledTextarea
            style={{ background: '#fff' }}
            onChange={(e) => setTextValue(e.target.value)}
            value={textValue}
          />
        </Box>
      </div>
    )
  );
};

export default AdvanceTaxCategorization;
