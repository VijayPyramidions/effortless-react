/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Radio,
} from '@mui/material';
import { useStyles, StyledTextarea } from './CategorizationStyledComponents';
import * as css from './CategorizationCenter.scss';

const OtherBankCategorization = ({
  setPayloadData,
  categorizedNarration,
  stateData,
  CategorizationOtherBankState,
  setCategorizationState,
  CategorizationViewTableDataState,
  selectedTransaction,
  CategorizationState,
  status,
}) => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));
  const classes = useStyles();
  const [transactionData, setTransactionData] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [textValue, setTextValue] = useState();

  const columns = [
    {
      headerName: 'Narration',
    },
    {
      headerName: 'Amount',
    },
  ];

  const handleSelection = (selectedItem) => {
    setSelectedValue(selectedItem);
    setCategorizationState((prev) => ({
      ...prev,
      selectedBill: {
        selectedContraTransaction: selectedItem,
      },
    }));
  };

  useEffect(() => {
    if (textValue)
      setPayloadData((prev) => ({ ...prev, narration: textValue }));
  }, [textValue]);

  useEffect(() => {
    setTextValue(categorizedNarration);
  }, [categorizedNarration]);

  useEffect(() => {
    if (CategorizationViewTableDataState && status === 'Edit') {
      console.log('View state');
      // View state
      const bankOffsetId =
        selectedTransaction?.categorized_lines[0].offset_bank_txn_id;
      const tempArr = CategorizationOtherBankState?.filter(
        (ele) => ele.id === bankOffsetId
      );

      setTransactionData(tempArr);
      setSelectedValue(tempArr && tempArr[0]);
    } else if (!CategorizationViewTableDataState && status === 'Add') {
      // Add state
      const newStateOutflow = CategorizationOtherBankState?.filter(
        (ele) => selectedTransaction?.amount > 0 && ele?.amount < 0
      );
      const newStateInflow = CategorizationOtherBankState?.filter(
        (ele) => selectedTransaction?.amount < 0 && ele?.amount > 0
      );
      if (selectedTransaction?.amount > 0) {
        setTransactionData(newStateOutflow);
      }
      if (selectedTransaction?.amount < 0) {
        setTransactionData(newStateInflow);
      }
    } else if (CategorizationViewTableDataState && status === 'Add') {
      // Edit state
      const newStateOutflow = CategorizationOtherBankState?.filter(
        (ele) => selectedTransaction?.amount > 0 && ele?.amount < 0
      );
      const newStateInflow = CategorizationOtherBankState?.filter(
        (ele) => selectedTransaction?.amount < 0 && ele?.amount > 0
      );
      if (selectedTransaction?.amount > 0) {
        const bankOffsetId =
          selectedTransaction?.categorized_lines[0].offset_bank_txn_id;
        const tempArr = newStateOutflow?.filter(
          (ele) => ele.id === bankOffsetId
        );
        setSelectedValue(tempArr && tempArr[0]);
        setTransactionData(newStateOutflow);
      }
      if (selectedTransaction?.amount < 0) {
        const bankOffsetId =
          selectedTransaction?.categorized_lines[0].offset_bank_txn_id;
        const tempArr = newStateInflow?.filter(
          (ele) => ele.id === bankOffsetId
        );
        setSelectedValue(tempArr && tempArr[0]);
        setTransactionData(newStateInflow);
      }
    }
  }, [
    CategorizationViewTableDataState,
    CategorizationOtherBankState,
    stateData,
    status,
  ]);

  return (
    <>
      {desktopView ? (
        <>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              gap: '4%',
            }}
          >
            {CategorizationState?.purposeState?.name?.toLowerCase() ===
              'contra entry' && (
              <Stack
                sx={{
                  height: '100%',
                  width: '80%',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
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
                          <TableCell id="row1" style={{ width: '2vw' }}>
                            <></>
                          </TableCell>
                          {columns?.map((val, ind) => (
                            <TableCell key={val} id={`row${ind + 2}`}>
                              {val?.headerName}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactionData?.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={columns?.length + 1}
                              align="center"
                            >
                              No Data Found
                            </TableCell>
                          </TableRow>
                        )}
                        {transactionData?.map((item) => (
                          <TableRow key={item?.id}>
                            <TableCell>
                              <Radio
                                style={{
                                  color: '#F08B32',
                                  padding: 0,
                                  width: '2vw',
                                }}
                                key={item.id}
                                checked={selectedValue?.id === item?.id}
                                onChange={() => handleSelection(item)}
                                disabled={
                                  CategorizationViewTableDataState &&
                                  status === 'Edit'
                                }
                              />
                            </TableCell>
                            <TableCell>{item?.narration}</TableCell>
                            <TableCell align="right">
                              ₹{item.formatted_amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Stack>
            )}

            <Box
              sx={{
                height: '100%',
                width:
                  CategorizationState?.purposeState?.name?.toLowerCase() ===
                  'contra entry'
                    ? '20%'
                    : '100%',
              }}
              className={css.otherbankcategorization}
            >
              <StyledTextarea
                placeholder="Notes"
                onChange={(e) => setTextValue(e.target.value)}
                value={textValue}
                disabled={stateData?.status === 'Edit'}
              />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <div
            className={`${css.billstatementcategorizationmobile} ${css.otherBankCategorizationMobile}`}
          >
            {CategorizationState?.purposeState?.name?.toLowerCase() ===
              'contra entry' && (
              <>
                <Stack direction="row" className={css.mobilehead}>
                  <p className={css.firstcont}>Narration</p>
                  <p className={css.thirdcont}>Amount</p>
                </Stack>
                <Box
                  sx={{
                    overflow: 'auto',
                    height: 'auto',
                  }}
                >
                  {transactionData?.length === 0 && (
                    <p
                      style={{
                        textAlign: 'center',
                        margin: '10px 0',
                        fontSize: 12,
                      }}
                    >
                      No Data Found
                    </p>
                  )}
                  {transactionData?.map((val) => (
                    <Stack
                      direction="row"
                      className={css.mobileaccordianOtherBank}
                    >
                      <div className={css.firstcont}>
                        <Radio
                          style={{
                            color: '#F08B32',
                            padding: 0,
                          }}
                          key={val.id}
                          checked={selectedValue?.id === val?.id}
                          onChange={() => handleSelection(val)}
                          disabled={
                            CategorizationViewTableDataState &&
                            status === 'Edit'
                          }
                        />
                      </div>
                      <div onClick={() => handleSelection(val)}>
                        <p className={css.secondcont}>{val?.narration}</p>
                      </div>

                      <p
                        className={
                          Number(val.amount) > 0
                            ? css.transacdescamtpos
                            : css.transacdescamtneg
                        }
                        onClick={() => handleSelection(val)}
                        role="presentation"
                      >
                        ₹{val.formatted_amount}
                      </p>
                    </Stack>
                  ))}
                </Box>
              </>
            )}
            <Box
              sx={{
                height: '30%',
                width: '100%',
              }}
              className={css.otherbankcategorization}
            >
              <StyledTextarea
                placeholder="Notes"
                onChange={(e) => setTextValue(e.target.value)}
                value={textValue}
                disabled={stateData?.status === 'Edit'}
              />
            </Box>
          </div>
        </>
      )}
    </>
  );
};

export default OtherBankCategorization;
