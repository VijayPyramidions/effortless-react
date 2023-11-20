/* eslint-disable array-callback-return */

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import useDebounce from '@components/Debounce/Debounce.jsx';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';
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
import moment from 'moment';
import { IndianCurrency } from '@components/utils';
// import { DataGridPremium } from '@mui/x-data-grid-premium';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import { useStyles, StyledTextarea } from './CategorizationStyledComponents';
import * as css from './CategorizationCenter.scss';

let remainingInput = 0;

const StatutoryDuesCategorization = ({
  stateData,
  CategorizationStatutoryDuesState,
  setCategorizationState,
  CategorizationViewTableDataState,
  selectedTransaction,
  CategorizationState,
  status,
}) => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const dispatch = useDispatch();

  const tempAmount = Math.abs(selectedTransaction?.amount);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsWithBalance, setSelectedRowsWithBalance] = useState([]);
  const [textValue, setTextValue] = useState();
  const [StatutoryCategorizationData, setStatutoryCategorizationData] =
    useState([]);
  const [advance, setAdvance] = useState(0);
  const [interest, setInterest] = useState(0);
  const [advanceValue, setAdvanceValue] = useState({
    cgst: 0,
    igst: 0,
  });
  const [interestValue, setInterestValue] = useState({
    gst: 0,
  });
  const [showAdvIntBtn, setShowAdvIntBtn] = useState(false);
  const debounceAdvanceIgst = useDebounce(advanceValue?.igst);
  const debounceAdvanceCgst = useDebounce(advanceValue?.cgst);
  const debounceinterestgst = useDebounce(interestValue?.gst);

  const getWidth = (el) => {
    if (el) {
      return Number(window?.getComputedStyle(el).width.slice(0, -2));
    }
    return 10;
  };
  const isSelectedBill = () => {
    if (
      CategorizationState?.purposeState?.name ===
        selectedTransaction?.purpose &&
      CategorizationState?.partyState?.id === selectedTransaction?.entity_id
    ) {
      return true;
    }
    if (
      CategorizationState?.purposeState?.name ===
        selectedTransaction?.purpose &&
      CategorizationState?.partyState?.id === 'Salary Payable' &&
      !selectedTransaction?.entity_id
    ) {
      return true;
    }
    return false;
  };
  const columns =
    CategorizationState?.partyState?.name === 'Salary Payable'
      ? [
          {
            headerName: 'Month',
          },
          {
            headerName: 'Original Amount',
          },
          {
            headerName: 'Pending Amount',
          },
          {
            headerName: 'To Allocate',
          },
          {
            headerName: 'Balance',
          },
        ]
      : [
          {
            headerName: 'Month',
          },
          {
            headerName:
              CategorizationState?.purposeState?.name === 'Payment of TDS'
                ? 'TDS'
                : 'GST',
          },
          {
            headerName: 'Original Amount',
          },
          {
            headerName: 'Pending Amount',
          },
          {
            headerName: 'To Allocate',
          },
          {
            headerName: 'Balance',
          },
        ];

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

  const calculateAmout = (e, id) => {
    if (e?.target?.checked) {
      if (remainingInput === 0) {
        dispatch(
          openSnackbar({
            message: 'There is no amount remaining',
            type: 'error',
          })
        );
        return;
      }
      const arr = StatutoryCategorizationData?.find((val) => val?.id === id);
      let obj = {};
      if (remainingInput >= Number(arr?.net_balance)) {
        remainingInput -= Number(arr?.net_balance);
        obj = {
          id: arr?.id,
          amount: Number(arr?.net_balance),
          balanceAmount: 0,
          pendingAmount: arr?.net_balance,
          originalArray: arr,
        };
      } else if (remainingInput > 0) {
        const tempBalance = Number(arr?.net_balance) - remainingInput;
        const reducedAmt = Number(arr?.net_balance) - tempBalance;

        remainingInput = 0;
        obj = {
          id: arr?.id,
          amount: reducedAmt,
          balanceAmount: tempBalance,
          pendingAmount: arr?.net_balance,
          originalArray: arr,
        };
      }

      setSelectedRowsWithBalance((prev) => [...prev, obj]);
      setSelectedRows((prev) => [...prev, id]);
    } else {
      remainingInput += Number(
        selectedRowsWithBalance.find((val) => val.id === id).amount
      );
      setSelectedRowsWithBalance((prev) =>
        prev?.filter((val) => val.id !== id)
      );
      setSelectedRows((prev) => prev?.filter((val) => val !== id));
    }
  };
  const RemoveDuplicates = (array, key) => {
    return array.reduce((arr1, item) => {
      const removed = arr1.filter((i) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };

  // const onInputChange = (e, id) => {
  //   if (e?.target?.value && e?.target?.value <= remainingInput) {
  //     const arr = CategorizationStatutoryDuesState?.filter(
  //       (val) => val?.id === id
  //     )[0];
  //     let obj = {};
  //     if (arr?.net_balance >= Number(e?.target?.value)) {
  //       obj = {
  //         id: arr?.id,
  //         amount: Number(e?.target?.value),
  //         balanceAmount: Number(arr?.net_balance) - Number(e?.target?.value),
  //         pendingAmount: arr?.net_balance,
  //         originalArray: arr,
  //       };
  //     }
  //     const tempArr = [...selectedRowsWithBalance, obj];
  //     const result = RemoveDuplicates(tempArr, 'id');
  //     const totalAmt = result.map((val) => val.amount);
  //     const rows = [...selectedRows, id];

  //     remainingInput =
  //       tempAmount -
  //       totalAmt.reduce(
  //         (accumulator, currentValue) => accumulator + currentValue,
  //         0
  //       );
  //     setSelectedRowsWithBalance(result);
  //     setSelectedRows([...new Set(rows)]);
  //   } else if (e?.target?.value > remainingInput) {
  //     dispatch(
  //       openSnackbar({
  //         message: 'Given amount is high',
  //         type: 'error',
  //       })
  //     );
  //   }
  // };
  const onInputChange = (e, id) => {
    if (e?.target?.value < 0) {
      e?.preventDefault();
      return;
    }
    const sumAmt = selectedRowsWithBalance
      ?.filter((i) => i.id !== id)
      ?.reduce((sum, item) => {
        return sum + parseFloat(item.amount);
      }, 0);

    const row = Object.assign(
      selectedRowsWithBalance.find((item) => item.id === id)
    );

    if (Number(row.pendingAmount) < Number(e.target.value)) {
      dispatch(
        openSnackbar({
          message: 'Enter the amount less than pending amount',
          type: 'error',
        })
      );
      e.target.value = row.amount;
      return;
    }

    if (tempAmount < Number(sumAmt) + Number(e.target.value)) {
      dispatch(
        openSnackbar({
          message: 'Enter the amount less than transaction amount',
          type: 'error',
        })
      );
      e.target.value = row.amount;
      return;
    }

    const newArray = selectedRowsWithBalance.map((item) => {
      if (item.id === id)
        return {
          ...item,
          amount: Number(String(e.target.value)),
          balanceAmount: Number(row.pendingAmount) - Number(e.target.value),
        };

      return item;
    });

    setSelectedRowsWithBalance(newArray);
    e.target.value = Number(String(e.target.value));
  };

  const allSelectDues = (e) => {
    if (e?.target?.checked === false) {
      setSelectedRows([]);
      setSelectedRowsWithBalance([]);
      return;
    }
    const sum = StatutoryCategorizationData.reduce((accumulator, current) => {
      return accumulator + parseFloat(current.amount);
    }, 0);

    if (remainingInput < sum)
      dispatch(
        openSnackbar({
          message: 'The transaction amount is less than pending amount.',
          type: 'error',
        })
      );
    else {
      const tempArray = TransactionAmtAssign(
        tempAmount,
        StatutoryCategorizationData
      );

      setSelectedRowsWithBalance(tempArray);
      setSelectedRows(tempArray?.map((val) => val?.id));
    }
  };

  const onAdvChange = (e) => {
    const eventName = e?.target?.name;
    const eventValue = e?.target?.value;
    if (e?.target?.value < 0) {
      e?.preventDefault();
      return;
    }

    const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0);

    if (eventName === 'adv_cgst') {
      if (
        tempAmount <
        Number(sumAmount) +
          2 * Number(e.target.value) +
          Number(advanceValue?.igst) +
          Number(interestValue?.gst)
      ) {
        dispatch(
          openSnackbar({
            message: 'Entered amount more than remaining amount',
            type: 'error',
          })
        );
        e.target.value = advanceValue?.cgst;
        return;
      }

      setAdvanceValue((s) => ({
        ...s,
        cgst: Number(eventValue) === 0 ? '' : Number(eventValue),
      }));
    } else if (eventName === 'adv_igst') {
      if (
        tempAmount <
        Number(sumAmount) +
          Number(eventValue) +
          2 * Number(advanceValue?.cgst) +
          Number(interestValue?.gst)
      ) {
        dispatch(
          openSnackbar({
            message: 'Entered amount more than remaining amount',
            type: 'error',
          })
        );
        e.target.value = advanceValue?.igst;
        return;
      }

      setAdvanceValue((s) => ({
        ...s,
        igst: Number(eventValue) === 0 ? '' : Number(eventValue),
      }));
    }
  };

  const onInterestChange = (e) => {
    const eventName = e?.target?.name;
    const eventValue = e?.target?.value;
    if (e?.target?.value < 0) {
      e?.preventDefault();
      return;
    }

    const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0);

    if (eventName === 'int_gst') {
      if (
        tempAmount <
        Number(sumAmount) +
          Number(eventValue) +
          2 * Number(advanceValue?.cgst) +
          Number(advanceValue?.igst)
      ) {
        dispatch(
          openSnackbar({
            message: 'Entered amount more than remaining amount',
            type: 'error',
          })
        );
        e.target.value = advanceValue?.igst;
        return;
      }

      setInterestValue((s) => ({
        ...s,
        gst: Number(eventValue) === 0 ? '' : Number(eventValue),
      }));
    }
  };

  useEffect(() => {
    if (
      (!CategorizationViewTableDataState && status === 'Add') ||
      (!isSelectedBill() && status === 'Add')
    ) {
      const tempArray = TransactionAmtAssign(
        tempAmount,
        StatutoryCategorizationData
      );

      setSelectedRowsWithBalance(tempArray);
      setSelectedRows(tempArray?.map((val) => val?.id));
    }
  }, [
    StatutoryCategorizationData,
    tempAmount,
    stateData,
    CategorizationViewTableDataState,
  ]);

  // useEffect(() => {
  //   console.log('selectedRowsWithBalance', selectedRowsWithBalance);
  //   setCategorizationState((prev) => ({
  //     ...prev,
  //     selectedBill: {
  //       selectedRowsWithBalance,
  //       remainingAmount: remainingInput,
  //     },
  //   }));
  // }, [selectedRowsWithBalance]);

  useEffect(() => {
    const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0);

    const remainingAmt =
      advanceValue?.cgst * 2 +
      advanceValue?.igst +
      interestValue?.gst;


    if (tempAmount - sumAmount - remainingAmt > 0) remainingInput = tempAmount - sumAmount - remainingAmt;
    else remainingInput = 0;

    setCategorizationState((prev) => ({
      ...prev,
      selectedBill: {
        selectedRowsWithBalance,
        remainingAmount: remainingInput,
      },
    }));
  }, [selectedRowsWithBalance]);

  useEffect(() => {
    console.log('selectedRows', selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    if (textValue)
      setCategorizationState((prev) => ({ ...prev, narration: textValue }));
  }, [textValue]);

  useEffect(() => {
    if (CategorizationViewTableDataState && status === 'Edit') {
      // View state
      const tempArr = [];
      const tempRowWithBalance = [];
      if (isSelectedBill()) {
        selectedTransaction?.categorized_lines?.forEach((val) => {
          if (val?.line_type === 'advance' || val?.line_type === 'late_fee') {
            if (val?.line_type === 'advance' && val?.tax_id === 'CGST') {
              setAdvanceValue((s) => ({
                ...s,
                cgst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }
            if (val?.line_type === 'advance' && val?.tax_id === 'IGST') {
              setAdvanceValue((s) => ({
                ...s,
                igst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }

            if (val?.line_type === 'late_fee') {
              setInterestValue((s) => ({
                ...s,
                gst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setInterest(1);
              remainingInput -= Number(val?.allocated_amount);
            }
          } else {
            tempArr.push({
              ...val,
              txn_month: val?.number,
              amount: val?.original_amount,
              net_balance: val?.pending_amount,
              id: val?.txn_line_id,
            });
          }
        });
        selectedTransaction?.categorized_lines?.forEach((val) => {
          if (val?.line_type === 'advance' || val?.line_type === 'late_fee') {
            if (val?.line_type === 'advance' && val?.tax_id === 'CGST') {
              setAdvanceValue((s) => ({
                ...s,
                cgst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }
            if (val?.line_type === 'advance' && val?.tax_id === 'IGST') {
              setAdvanceValue((s) => ({
                ...s,
                igst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }

            if (val?.line_type === 'late_fee') {
              setInterestValue((s) => ({
                ...s,
                gst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setInterest(2);
              remainingInput -= Number(val?.allocated_amount);
            }
          } else {
            tempRowWithBalance.push({
              id: val?.txn_line_id,
              amount: val?.allocated_amount,
              balanceAmount: val?.pending_amount,
              pendingAmount: val?.original_amount,
              originalArray: val,
            });
          }
        });
      } else {
        setStatutoryCategorizationData(CategorizationStatutoryDuesState);
      }
      setStatutoryCategorizationData(tempArr);
      setSelectedRows(tempRowWithBalance?.map((val) => val?.id));
      setSelectedRowsWithBalance(tempRowWithBalance);
    } else if (!CategorizationViewTableDataState && status === 'Add') {
      // Add state
      setStatutoryCategorizationData(CategorizationStatutoryDuesState);
    } else if (CategorizationViewTableDataState && status === 'Add') {
      // Edit State
      const tempArr = [];
      const tempRowWithBalance = [];
      // if (CategorizationStatutoryDuesState?.length === 0) {
      if (isSelectedBill()) {
        selectedTransaction?.categorized_lines?.forEach((val) => {
          if (val?.line_type === 'advance' || val?.line_type === 'late_fee') {
            if (val?.line_type === 'advance' && val?.tax_id === 'CGST') {
              setAdvanceValue((s) => ({
                ...s,
                cgst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }
            if (val?.line_type === 'advance' && val?.tax_id === 'IGST') {
              setAdvanceValue((s) => ({
                ...s,
                igst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }

            if (val?.line_type === 'late_fee') {
              setInterestValue((s) => ({
                ...s,
                gst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setInterest(2);
              remainingInput -= Number(val?.allocated_amount);
            }
          } else {
            tempArr?.push({
              ...val,
              txn_month: val?.number,
              amount: val?.original_amount,
              net_balance: val?.pending_amount,
              id: val?.txn_line_id,
            });
          }
        });
        // }
        selectedTransaction?.categorized_lines?.forEach((val) => {
          if (val?.line_type === 'advance' || val?.line_type === 'late_fee') {
            if (val?.line_type === 'advance' && val?.tax_id === 'CGST') {
              setAdvanceValue((s) => ({
                ...s,
                cgst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }
            if (val?.line_type === 'advance' && val?.tax_id === 'IGST') {
              setAdvanceValue((s) => ({
                ...s,
                igst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setAdvance(2);
              remainingInput -= Number(val?.allocated_amount);
            }

            if (val?.line_type === 'late_fee') {
              setInterestValue((s) => ({
                ...s,
                gst:
                  Number(val?.allocated_amount) === 0
                    ? ''
                    : Number(val?.allocated_amount),
              }));
              setInterest(2);
              remainingInput -= Number(val?.allocated_amount);
            }
          } else {
            tempRowWithBalance.push({
              id: val?.txn_line_id,
              amount: val?.allocated_amount,
              balanceAmount: Number(val?.pending_amount),
              pendingAmount: Number(val?.original_amount),
              originalArray: val,
            });
          }
        });
      }
      CategorizationStatutoryDuesState?.forEach((val) => {
        if (isSelectedBill()) {
          const tempLines = selectedTransaction?.categorized_lines?.find(
            (data) => data?.txn_line_id === val?.id
          );
          if (Number(val?.net_balance) > 0) {
            if (Object?.keys(tempLines || {})?.length > 0) {
              tempArr?.push({
                ...val,
                amount: tempLines?.original_amount,
                net_balance: tempLines?.pending_amount,
              });
              return;
            }
          }
        }
        tempArr?.push(val);
      });
      setStatutoryCategorizationData(RemoveDuplicates(tempArr, 'id'));
      setSelectedRows(tempRowWithBalance?.map((val) => val?.id));
      setSelectedRowsWithBalance(tempRowWithBalance);
    }
  }, [
    CategorizationViewTableDataState,
    CategorizationStatutoryDuesState,
    stateData,
    status,
  ]);

  useEffect(() => {
    if (advance && remainingInput > 0) {
      if(advance === 1){
        setAdvanceValue((s) => ({
          ...s,
          cgst: '',
          igst: remainingInput === 0 ? '' : Number(remainingInput).toFixed(2),
        }));
      }
      
      setTimeout(() => {
        remainingInput = 0;
        setShowAdvIntBtn(false);
        setCategorizationState((prev) => ({
          ...prev,
          selectedBill: {
            selectedRowsWithBalance,
            remainingAmount: remainingInput,
          },
        }));
      }, 300);
    } else if (!advance) {
      const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
        return sum + parseFloat(item.amount);
      }, 0);

      const interestAmt = Number(interestValue?.gst);

      if (tempAmount - sumAmount - interestAmt > 0)
        remainingInput = tempAmount - sumAmount - interestAmt;
      else remainingInput = 0;

      setAdvanceValue((s) => ({
        ...s,
        cgst: '',
        igst: '',
      }));
      setCategorizationState((prev) => ({
        ...prev,
        selectedBill: {
          selectedRowsWithBalance,
          remainingAmount: remainingInput,
        },
      }));
    }
  }, [advance]);

  useEffect(() => {
    if (interest && remainingInput > 0) {
      if(interest === 1){
        setInterestValue((s) => ({
          ...s,
          gst:
            Number(remainingInput) === 0 ? '' : Number(remainingInput).toFixed(2),
        }));
      }
      
      setTimeout(() => {
        remainingInput = 0;
        setShowAdvIntBtn(false);
        setCategorizationState((prev) => ({
          ...prev,
          selectedBill: {
            selectedRowsWithBalance,
            remainingAmount: remainingInput,
          },
        }));
      }, 300);
    } else if (!interest) {
      const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
        return sum + parseFloat(item.amount);
      }, 0);

      const advanceAmt =
        Number(advanceValue?.cgst) * 2 + Number(advanceValue?.igst);

      if (tempAmount - sumAmount - advanceAmt > 0)
        remainingInput = tempAmount - sumAmount - advanceAmt;
      else remainingInput = 0;

      setInterestValue((s) => ({
        ...s,
        gst: '',
      }));
      setCategorizationState((prev) => ({
        ...prev,
        selectedBill: {
          selectedRowsWithBalance,
          remainingAmount: remainingInput,
        },
      }));
    }
  }, [interest]);

  useEffect(() => {
    setCategorizationState((prev) => ({
      ...prev,
      advanceValue,
      interestValue,
    }));
  }, [
    advanceValue?.cgst,
    advanceValue?.igst,
    interestValue?.gst,
    advance,
    interest,
  ]);

  useEffect(() => {
    if (remainingInput > 0) {
      setShowAdvIntBtn(true);
    } else {
      setShowAdvIntBtn(false);
    }
  }, [remainingInput]);

  useEffect(() => {
    return () => {
      setStatutoryCategorizationData([]);
      setSelectedRows([]);
      setSelectedRowsWithBalance([]);
    };
  }, []);

  useMemo(() => {
    const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0);

    const remainingAmt =
      tempAmount -
      sumAmount -
      advanceValue?.cgst * 2 -
      Number(debounceAdvanceIgst) -
      interestValue?.gst;

    if (remainingAmt > 0) remainingInput = remainingAmt;
    else remainingInput = 0;

    setCategorizationState((prev) => ({
      ...prev,
      selectedBill: {
        selectedRowsWithBalance,
        remainingAmount: remainingInput,
      },
    }));
  }, [debounceAdvanceIgst]);

  useMemo(() => {
    const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0);

    const remainingAmt =
      tempAmount -
      sumAmount -
      advanceValue?.igst -
      2 * Number(debounceAdvanceCgst) -
      interestValue?.gst;

    if (remainingAmt > 0) remainingInput = remainingAmt;
    else remainingInput = 0;

    setCategorizationState((prev) => ({
      ...prev,
      selectedBill: {
        selectedRowsWithBalance,
        remainingAmount: remainingInput,
      },
    }));
  }, [debounceAdvanceCgst]);

  useMemo(() => {
    const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0);

    const remainingAmt =
      tempAmount -
      sumAmount -
      advanceValue?.cgst * 2 -
      advanceValue?.igst -
      Number(debounceinterestgst);

    if (remainingAmt > 0) remainingInput = remainingAmt;
    else remainingInput = 0;

    setCategorizationState((prev) => ({
      ...prev,
      selectedBill: {
        selectedRowsWithBalance,
        remainingAmount: remainingInput,
      },
    }));
  }, [debounceinterestgst]);

  return device === 'desktop' ? (
    <>
      <Box
        sx={{
          height: '96%',
          width: '100%',
          display: 'flex',
          gap: '4%',
        }}
      >
        <Stack
          sx={{
            height: '100%',
            width: '80%',
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
                    <TableCell id="row1">
                      <Checkbox
                        style={{
                          color: '#F08B32',
                          padding: 0,
                        }}
                        checked={
                          StatutoryCategorizationData?.length > 0
                            ? selectedRows?.length ===
                              StatutoryCategorizationData?.length
                            : false
                        }
                        onChange={allSelectDues}
                        disabled={
                          CategorizationViewTableDataState && status === 'Edit'
                        }
                      />
                    </TableCell>
                    {columns?.map((val, ind) => (
                      <TableCell key={val} id={`row${ind + 2}`}>
                        {val?.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {StatutoryCategorizationData?.filter(
                    (row) => Number(row.net_balance) !== 0
                  )?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns?.length + 1} align="center">
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                  {StatutoryCategorizationData?.filter(
                    (row) => Number(row.net_balance) !== 0
                  )?.map((item) => (
                    <>
                      {null ? (
                        <>
                          <TableRow key={item?.id}>
                            <TableCell rowSpan={4}>
                              <Checkbox
                                style={{
                                  color: '#F08B32',
                                  padding: 0,
                                }}
                                checked
                              />
                            </TableCell>
                            <TableCell rowSpan={4}>{item?.month}</TableCell>
                          </TableRow>
                          {Object.values(item?.details)?.map((detail) => (
                            <TableRow key={item?.id}>
                              <TableCell>{detail?.name}</TableCell>
                              <TableCell align="right">
                                {detail?.originalAmt}
                              </TableCell>
                              <TableCell align="right">
                                {detail?.pendingAmt}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ background: '#d9d9d959' }}
                              >
                                {detail?.toAllocate}
                              </TableCell>
                              <TableCell align="right">
                                {detail?.balance}
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <TableRow key={item?.id}>
                          <TableCell>
                            <Checkbox
                              style={{
                                color: '#F08B32',
                                padding: 0,
                              }}
                              key={item.id}
                              checked={
                                !!selectedRows?.find((val) => val === item?.id)
                              }
                              onChange={(e) => calculateAmout(e, item?.id)}
                              disabled={
                                CategorizationViewTableDataState &&
                                status === 'Edit'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {moment(item?.date || item?.txn_month).format(
                              'MMM-YYYY'
                            )}
                          </TableCell>
                          {CategorizationState?.partyState?.name !==
                            'Salary Payable' && (
                            <TableCell>{item?.account_name}</TableCell>
                          )}
                          <TableCell align="right">
                            {IndianCurrency?.format(item?.amount || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {IndianCurrency?.format(item?.net_balance || 0)}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ background: '#d9d9d959' }}
                          >
                            {status === 'Edit' ? (
                              item?.allocated_amount
                            ) : (
                              <input
                                type="number"
                                className={css.inputallocatefield}
                                value={
                                  selectedRowsWithBalance?.find(
                                    (row) => row.id === item.id
                                  )?.amount || 0
                                }
                                onChange={(e) => onInputChange(e, item?.id)}
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {IndianCurrency?.format(
                              selectedRowsWithBalance?.find(
                                (row) => row.id === item.id
                              )?.balanceAmount || 0
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
              {CategorizationState?.purposeState?.name?.toLowerCase() ===
                'payment of gst' && (
                <>
                  {(advance === 1 || advance === 2 )&& (
                    <TableRow
                      style={{
                        position: 'sticky',
                        bottom: (((advance === 1 && interest === 1) || (advance === 2 && interest === 2)) && 70) || 0,
                        marginTop: 'auto',
                        zIndex: 2,
                        background: '#fbe2cc',
                      }}
                      className={css.statutoryduestableContainerAdvance}
                    >
                      <TableRow>
                        <TableCell
                          sx={{
                            width: getWidth(document.querySelector('#row1')),
                          }}
                          rowspan="3"
                        >
                          <Checkbox
                            style={{
                              color: '#F08B32',
                              padding: 0,
                            }}
                            checked={advance === 1 || advance === 2}
                            onChange={() => {
                              setAdvance(0);
                              setShowAdvIntBtn(true);
                            }}
                            disabled={
                              CategorizationViewTableDataState &&
                              status === 'Edit'
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            width: getWidth(document.querySelector('#row2')),
                          }}
                          rowspan="3"
                        >
                          Advance
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row3')),
                          }}
                        >
                          CGST
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            width: getWidth(document.querySelector('#row4')),
                          }}
                        >
                          {IndianCurrency?.format(advanceValue?.cgst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row5')),
                          }}
                        >
                          {IndianCurrency?.format(advanceValue?.cgst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row6')),
                          }}
                        >
                          <input
                            type="number"
                            name="adv_cgst"
                            className={css.inputadvancefield}
                            value={advanceValue?.cgst}
                            onChange={(e) => onAdvChange(e)}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row7')),
                          }}
                        >
                          {IndianCurrency?.format(0)}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        style={{
                          background: '#fbe2cc',
                        }}
                      >
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row3')),
                          }}
                        >
                          SGST
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            width: getWidth(document.querySelector('#row4')),
                          }}
                        >
                          {IndianCurrency?.format(advanceValue?.cgst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row5')),
                          }}
                        >
                          {IndianCurrency?.format(advanceValue?.cgst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row6')),
                          }}
                        >
                          <input
                            type="number"
                            name="adv_cgst"
                            className={css.inputadvancefield}
                            value={advanceValue?.cgst}
                            onChange={(e) => onAdvChange(e)}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row7')),
                          }}
                        >
                          {IndianCurrency?.format(0)}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        style={{
                          background: '#fbe2cc',
                        }}
                      >
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row3')),
                          }}
                        >
                          IGST
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            width: getWidth(document.querySelector('#row4')),
                          }}
                        >
                          {IndianCurrency?.format(advanceValue?.igst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row5')),
                          }}
                        >
                          {IndianCurrency?.format(advanceValue?.igst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row6')),
                          }}
                        >
                          <input
                            type="number"
                            name="adv_igst"
                            className={css.inputadvancefield}
                            value={advanceValue?.igst}
                            onChange={(e) => onAdvChange(e)}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row7')),
                          }}
                        >
                          {IndianCurrency?.format(0)}
                        </TableCell>
                      </TableRow>
                    </TableRow>
                  )}

                  {(interest === 1 || interest === 2) && (
                    <TableRow
                      style={{
                        position: 'sticky',
                        bottom: 0,
                        marginTop: 'auto',
                        zIndex: 2,
                        background: '#EDF0FF',
                      }}
                      className={css.statutoryduestableContainerAdvance}
                    >
                      <TableRow>
                        <TableCell
                          sx={{
                            width: getWidth(document.querySelector('#row1')),
                          }}
                          rowspan="3"
                        >
                          <Checkbox
                            style={{
                              color: '#F08B32',
                              padding: 0,
                            }}
                            checked={interest === 1 || interest === 2}
                            onChange={() => {
                              setInterest(0);
                              setShowAdvIntBtn(true);
                            }}
                            disabled={
                              CategorizationViewTableDataState &&
                              status === 'Edit'
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            width: getWidth(document.querySelector('#row2')),
                          }}
                          rowspan="3"
                        >
                          Interest / late fees
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row3')),
                          }}
                        >
                          <> </>
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            width: getWidth(document.querySelector('#row4')),
                          }}
                        >
                          {IndianCurrency?.format(interestValue?.gst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row5')),
                          }}
                        >
                          {IndianCurrency?.format(interestValue?.gst || 0)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row6')),
                          }}
                        >
                          <input
                            type="number"
                            name="int_gst"
                            className={css.inputinterestfield}
                            value={interestValue?.gst}
                            onChange={(e) => onInterestChange(e)}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            width: getWidth(document.querySelector('#row7')),
                          }}
                        >
                          {IndianCurrency?.format(0)}
                        </TableCell>
                      </TableRow>
                      {/* <TableRow
                          style={{
                            background: '#EDF0FF',
                          }}
                        >
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row3')),
                            }}
                          >
                            SGST
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              width: getWidth(document.querySelector('#row4')),
                            }}
                          >
                            {IndianCurrency?.format(interestValue?.cgst || 0)}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row5')),
                            }}
                          >
                            {IndianCurrency?.format(interestValue?.cgst || 0)}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row6')),
                            }}
                          >
                            <input
                              type="number"
                              className={css.inputinterestfield}
                              value={interestValue?.cgst}
                              name="int_cgst"
                              onChange={(e) => onInterestChange(e)}
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row7')),
                            }}
                          >
                            {IndianCurrency?.format(interestValue?.cgst || 0)}
                          </TableCell>
                        </TableRow> */}
                      {/* <TableRow
                          style={{
                            background: '#EDF0FF',
                          }}
                        >
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row3')),
                            }}
                          >
                            IGST
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              width: getWidth(document.querySelector('#row4')),
                            }}
                          >
                            {IndianCurrency?.format(interestValue?.igst || 0)}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row5')),
                            }}
                          >
                            {IndianCurrency?.format(interestValue?.igst || 0)}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row6')),
                            }}
                          >
                            <input
                              type="number"
                              className={css.inputinterestfield}
                              value={interestValue?.igst}
                              name="int_igst"
                              onChange={(e) => onInterestChange(e)}
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              width: getWidth(document.querySelector('#row7')),
                            }}
                          >
                            {IndianCurrency?.format(interestValue?.igst || 0)}
                          </TableCell>
                        </TableRow> */}
                    </TableRow>
                  )}
                </>
              )}
            </TableContainer>
          </Box>
          <div className={css.statutoryduescategorization}>
            <p className={css.totaltextcategorization}>Total</p>
            <div
              className={css.allocatebottomdiv}
              style={{
                width: getWidth(document.querySelector('#row6')) - 4,
              }}
            >
              {IndianCurrency?.format(
                selectedRowsWithBalance?.reduce(
                  (total, item) => total + item.amount,
                  0
                ) +
                  2 * Number(advanceValue?.cgst || 0) +
                  Number(advanceValue.igst || 0) +
                  Number(interestValue.gst || 0)
              )}
            </div>
            <div
              className={css.balancebottomdiv}
              style={{
                width: getWidth(document.querySelector('#row7')) - 4,
              }}
            >
              {IndianCurrency?.format(
                selectedRowsWithBalance?.reduce(
                  (total, item) => total + item.balanceAmount,
                  0
                )
              )}
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
            placeholder="Notes(Optional)"
            onChange={(e) => setTextValue(e.target.value)}
            value={textValue}
            disabled={CategorizationViewTableDataState && status === 'Edit'}
          />
        </Box>
      </Box>
      <Stack direction="row" gap="8px">
        {CategorizationState?.purposeState?.name?.toLowerCase() ===
          'payment of gst' &&
          showAdvIntBtn && (
            <>
              {advance === 0 && (
                <div
                  onClick={() => {
                    setAdvance(1);
                  }}
                  style={{
                    cursor: 'pointer',
                    color: '#00A676',
                    marginTop: 8,
                    width: 'fit-content',
                  }}
                >
                  + Add Advance
                </div>
              )}
              {interest === 0 && (
                <div
                  onClick={() => {
                    setInterest(1);
                  }}
                  style={{
                    cursor: 'pointer',
                    color: '#3049BF',
                    marginTop: 8,
                    width: 'fit-content',
                  }}
                >
                  + Add Interest / late fees
                </div>
              )}
            </>
          )}
      </Stack>
    </>
  ) : (
    (StatutoryCategorizationData?.filter((row) => Number(row.net_balance) !== 0)
      ?.length === 0 && (
      <p style={{ textAlign: 'center', fontSize: 12, margin: '10px 0' }}>
        No Data Found
      </p>
    )) || (
      <>
        <div className={css.statutoryduescategorizationmobile}>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="calc(90% - 24px)"
            ml="10%"
            p="12px"
            gap="1.5%"
          >
            <p className={css.headertext}>Month</p>
            <p className={css.headertext}>To Allocate</p>
            <p className={css.headertext} style={{ textAlign: 'end' }}>
              Balance
            </p>
          </Stack>
          {(advance === 1  || advance === 2) && (
            <Box className={`${css.statutoryduescategorizationcard}`}>
              <Stack
                alignItems="center"
                p="12px"
                direction="row"
                width="calc(100% - 24px)"
                sx={{ background: '#fbe2cc !important' }}
              >
                <Checkbox
                  style={{
                    color: '#F08B32',
                    padding: 0,
                    width: '10%',
                  }}
                  checked={advance === 1 || advance === 2}
                  onChange={() => {
                    setAdvance(0);
                    setShowAdvIntBtn(true);
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="90%"
                  gap="1.5%"
                >
                  <p className={css.monthtext}>Advance</p>
                  <p className={css.allocationtext}>
                    {IndianCurrency?.format(
                      2 * Number(advanceValue?.cgst) +
                        Number(advanceValue?.igst) || 0
                    )}
                  </p>
                  <p className={css.balancetext}>
                    {IndianCurrency?.format(Number(remainingInput))}
                  </p>
                </Stack>
              </Stack>
              <Stack className={css.bodyofcategorization}>
                <Stack
                  alignItems="center"
                  p="4px 12px"
                  direction="row"
                  justifyContent="space-between"
                  width="calc(100% - 24px)"
                  gap="1.5%"
                  sx={{ background: '#F4F4F4' }}
                >
                  <p className={css.bodyheadertext}>GST</p>
                  <p
                    className={css.bodyheadertext}
                    style={{ textAlign: 'end' }}
                  >
                    CGST
                  </p>
                  <p
                    className={css.bodyheadertext}
                    style={{ textAlign: 'end' }}
                  >
                    IGST
                  </p>
                  <p
                    className={css.bodyheadertext}
                    style={{ textAlign: 'end' }}
                  >
                    SGST
                  </p>
                </Stack>

                <Stack>
                  <Stack
                    alignItems="center"
                    p="4px 12px"
                    direction="row"
                    justifyContent="space-between"
                    width="calc(100% - 24px)"
                    gap="1.5%"
                  >
                    <p className={css.bodyheadertext}>Original Amount </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(Number(advanceValue?.cgst) || 0)}
                    </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(advanceValue?.cgst || 0)}
                    </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(advanceValue?.igst || 0)}
                    </p>
                  </Stack>
                  <Stack
                    alignItems="center"
                    p="4px 12px"
                    direction="row"
                    justifyContent="space-between"
                    width="calc(100% - 24px)"
                    gap="1.5%"
                  >
                    <p className={css.bodyheadertext}>To Allocate </p>
                    <input
                      type="number"
                      name="adv_cgst"
                      className={css.toallocateinput}
                      value={advanceValue?.cgst}
                      onChange={(e) => onAdvChange(e)}
                    />
                    <input
                      type="number"
                      name="adv_cgst"
                      className={css.toallocateinput}
                      value={advanceValue?.cgst}
                      onChange={(e) => onAdvChange(e)}
                    />
                    <input
                      type="number"
                      name="adv_igst"
                      className={css.toallocateinput}
                      value={advanceValue?.igst}
                      onChange={(e) => onAdvChange(e)}
                    />
                  </Stack>
                  <Stack
                    alignItems="center"
                    p="4px 12px"
                    direction="row"
                    justifyContent="space-between"
                    width="calc(100% - 24px)"
                    gap="1.5%"
                  >
                    <p className={css.pendingtext} style={{ width: '29%' }}>
                      Pending Amount{' '}
                    </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(advanceValue?.cgst || 0)}
                    </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(advanceValue?.cgst || 0)}
                    </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(advanceValue?.igst || 0)}
                    </p>
                  </Stack>
                </Stack>
              </Stack>

              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                width="calc(100% - 24px)"
                gap="1.5%"
                p="8px"
                sx={{ border: 'none !important' }}
                className={css.bodyofcategorization}
              >
                <p className={css.bodyheadertext}>Balance</p>
                <p className={css.amountText}>
                  {IndianCurrency?.format(remainingInput)}
                </p>
                <p className={css.amountText}>
                  {IndianCurrency?.format(remainingInput)}
                </p>
                <p className={css.amountText}>
                  {IndianCurrency?.format(remainingInput)}
                </p>
              </Stack>
            </Box>
          )}
          {(interest === 1  || interest === 2) && (
            <Box className={`${css.statutoryduescategorizationcard}`}>
              <Stack
                alignItems="center"
                p="12px"
                direction="row"
                width="calc(100% - 24px)"
                sx={{ background: '#EDF0FF !important' }}
              >
                <Checkbox
                  style={{
                    color: '#F08B32',
                    padding: 0,
                    width: '10%',
                  }}
                  checked={interest === 1||interest === 2}
                  onChange={() => {
                    setInterest(0);
                    setShowAdvIntBtn(true);
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="90%"
                  gap="1.5%"
                >
                  <p className={css.monthtext}>Interest/Late Fee</p>
                  <p className={css.allocationtext}>
                    {IndianCurrency?.format(Number(interestValue?.gst) || 0)}
                  </p>
                  <p className={css.balancetext}>
                    {IndianCurrency?.format(remainingInput)}
                  </p>
                </Stack>
              </Stack>
              <Stack className={css.bodyofcategorization}>
                <Stack
                  alignItems="center"
                  p="4px 12px"
                  direction="row"
                  justifyContent="space-between"
                  width="calc(100% - 24px)"
                  gap="1.5%"
                  sx={{ background: '#F4F4F4' }}
                >
                  <p className={css.bodyheadertext}>GST</p>
                  <p
                    className={css.bodyheadertext}
                    style={{ textAlign: 'end' }}
                  >
                    <> </>
                  </p>
                  <p
                    className={css.bodyheadertext}
                    style={{ textAlign: 'end' }}
                  >
                    <> </>
                  </p>
                  <p
                    className={css.bodyheadertext}
                    style={{ textAlign: 'end' }}
                  >
                    <> </>
                  </p>
                </Stack>

                <Stack>
                  <Stack
                    alignItems="center"
                    p="4px 12px"
                    direction="row"
                    justifyContent="space-between"
                    width="calc(100% - 24px)"
                    gap="1.5%"
                  >
                    <p className={css.bodyheadertext}>Original Amount </p>
                    <p className={css.amountText}>
                      <> </>
                    </p>
                    <p className={css.amountText}>
                      <> </>
                    </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(interestValue?.gst || 0)}
                    </p>
                  </Stack>
                  <Stack
                    alignItems="center"
                    p="4px 12px"
                    direction="row"
                    justifyContent="space-between"
                    width="calc(100% - 24px)"
                    gap="1.5%"
                  >
                    <p className={css.bodyheadertext}>To Allocate </p>
                    {/* <input
                      type="number"
                      className={css.toallocateinput}
                      value={interestValue?.gst}
                      onChange={(e) => onInterestChange(e)}
                    />
                    <input
                      type="number"
                      className={css.toallocateinput}
                      value={interestValue?.gst}
                      onChange={(e) => onInterestChange(e)}
                    /> */}
                    <> </>
                    <> </>
                    <input
                      type="number"
                      className={css.toallocateinput}
                      name="int_gst"
                      value={interestValue?.gst}
                      onChange={(e) => onInterestChange(e)}
                    />
                  </Stack>
                  <Stack
                    alignItems="center"
                    p="4px 12px"
                    direction="row"
                    justifyContent="space-between"
                    width="calc(100% - 24px)"
                    gap="1.5%"
                  >
                    <p className={css.pendingtext} style={{ width: '29%' }}>
                      Pending Amount{' '}
                    </p>
                    <p className={css.amountText}>
                      <> </>
                    </p>
                    <p className={css.amountText}>
                      <> </>
                    </p>
                    <p className={css.amountText}>
                      {IndianCurrency?.format(interestValue?.gst || 0)}
                    </p>
                  </Stack>
                </Stack>
              </Stack>

              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                width="calc(100% - 24px)"
                gap="1.5%"
                p="8px"
                sx={{ border: 'none !important' }}
                className={css.bodyofcategorization}
              >
                <p className={css.bodyheadertext}>Balance</p>
                <p className={css.amountText}>
                  <> </>
                </p>
                <p className={css.amountText}>
                  <> </>
                </p>
                <p className={css.amountText}>
                  {IndianCurrency?.format(remainingInput)}
                </p>
              </Stack>
            </Box>
          )}
          {StatutoryCategorizationData?.filter(
            (row) => Number(row.net_balance) !== 0
          )?.map((item) => (
            <Box className={css.statutoryduescategorizationcard}>
              <Stack
                alignItems="center"
                p="12px"
                direction="row"
                width="calc(100% - 24px)"
              >
                <Checkbox
                  style={{
                    color: '#F08B32',
                    padding: 0,
                    width: '10%',
                  }}
                  checked={!!selectedRows?.find((val) => val === item?.id)}
                  onChange={(e) => calculateAmout(e, item?.id)}
                  disabled={
                    CategorizationViewTableDataState && status === 'Edit'
                  }
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="90%"
                  gap="1.5%"
                >
                  <p className={css.monthtext}>
                    {moment(item?.txn_month).format('MMM-YYYY')}
                  </p>
                  <p className={css.allocationtext}>
                    {IndianCurrency?.format(
                      selectedRowsWithBalance
                        ?.find((row) => row.id === item.id)
                        ?.amount.toFixed(2) || 0
                    )}
                  </p>
                  <p className={css.balancetext}>
                    {IndianCurrency?.format(
                      selectedRowsWithBalance
                        ?.find((row) => row.id === item.id)
                        ?.balanceAmount.toFixed(2) || 0
                    )}
                  </p>
                </Stack>
              </Stack>
              <Stack className={css.bodyofcategorization}>
                <Stack
                  alignItems="center"
                  p="4px 12px"
                  direction="row"
                  justifyContent="space-between"
                  width="calc(90% - 24px)"
                  pl="calc(10% + 12px)"
                  gap="1.5%"
                  sx={{ background: '#F4F4F4' }}
                >
                  <p className={css.bodyheadertext}>GST</p>
                  <p className={css.bodyheadertext}>Original Amount</p>
                  <p
                    className={css.bodyheadertext}
                    style={{ textAlign: 'end' }}
                  >
                    To Allocate
                  </p>
                </Stack>
                {null ? (
                  <Stack>
                    <Stack
                      alignItems="center"
                      p="4px 12px"
                      direction="row"
                      justifyContent="space-between"
                      width="calc(90% - 24px)"
                      ml="10%"
                    >
                      <p className={css.bodyheadertext}>CGST</p>
                      <p className={css.amountText}>Rs. 5,00,000</p>
                      <input value="5,00,000" className={css.toallocateinput} />
                    </Stack>
                    <Stack
                      alignItems="center"
                      p="4px 12px"
                      direction="row"
                      justifyContent="space-between"
                      width="calc(90% - 24px)"
                      ml="10%"
                    >
                      <p className={css.bodyheadertext}>SGST</p>
                      <p className={css.amountText}>Rs. 5,00,000</p>
                      <input value="5,00,000" className={css.toallocateinput} />
                    </Stack>
                    <Stack
                      alignItems="center"
                      p="4px 12px"
                      direction="row"
                      justifyContent="space-between"
                      width="calc(90% - 24px)"
                      ml="10%"
                    >
                      <p className={css.bodyheadertext}>IGST</p>
                      <p className={css.amountText}>Rs. 5,00,000</p>
                      <input value="5,00,000" className={css.toallocateinput} />
                    </Stack>
                  </Stack>
                ) : (
                  <Stack>
                    <Stack
                      alignItems="center"
                      p="4px 12px"
                      direction="row"
                      justifyContent="space-between"
                      width="calc(90% - 24px)"
                      ml="10%"
                    >
                      <p className={css.bodyheadertext}>{item?.account_name}</p>
                      <p className={css.amountText}>
                        {IndianCurrency?.format(item?.amount)}
                      </p>
                      {(CategorizationViewTableDataState &&
                        status === 'Edit' && (
                          <p className={css.amountText}>
                            {IndianCurrency?.format(
                              selectedRowsWithBalance
                                ?.find((row) => row.id === item.id)
                                ?.amount.toFixed(2) || 0
                            )}
                          </p>
                        )) || (
                        <input
                          type="number"
                          className={css.toallocateinput}
                          value={
                            selectedRowsWithBalance?.find(
                              (row) => row.id === item.id
                            )?.amount || 0
                          }
                          onChange={(e) => onInputChange(e, item?.id)}
                        />
                      )}
                    </Stack>
                  </Stack>
                )}
              </Stack>
              <Stack
                alignItems="center"
                p="8px"
                direction="row"
                justifyContent="space-between"
                width="calc(60% - 24px)"
                ml="10%"
                gap="2%"
              >
                <p className={css.pendingtext}>Pending Amount</p>
                <p className={css.pendingamountText}>
                  {IndianCurrency?.format(item?.net_balance)}
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
              disabled={CategorizationViewTableDataState && status === 'Edit'}
            />
          </Box>
        </div>
        <Stack direction="row" gap="8px">
          {CategorizationState?.purposeState?.name?.toLowerCase() ===
            'payment of gst' &&
            showAdvIntBtn && (
              <>
                {advance === 0 && (
                  <div
                    onClick={() => {
                      setAdvance(1);
                    }}
                    style={{
                      cursor: 'pointer',
                      color: '#00A676',
                      marginTop: 8,
                      width: 'fit-content',
                    }}
                  >
                    + Add Advance
                  </div>
                )}
                {interest === 0 && (
                  <div
                    onClick={() => {
                      setInterest(1);
                    }}
                    style={{
                      cursor: 'pointer',
                      color: '#3049BF',
                      marginTop: 8,
                      width: 'fit-content',
                    }}
                  >
                    + Add Interest / late fees
                  </div>
                )}
              </>
            )}
        </Stack>
      </>
    )
  );
};

export default StatutoryDuesCategorization;
