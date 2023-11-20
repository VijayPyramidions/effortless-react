/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-lonely-if */

import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import AppContext from '@root/AppContext.jsx';
import { IndianCurrency } from '@components/utils';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import {
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Dialog,
  DialogContent,
  Grid,
} from '@mui/material';

import { Document, Page } from 'react-pdf'
import download from '@assets/WebAssets/download.svg';
import JSBridge from '@nativeBridge/jsbridge';

import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';

// import { DataGridPremium } from '@mui/x-data-grid-premium';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import { useStyles } from './CategorizationStyledComponents';
import * as css from './CategorizationCenter.scss';
// import { AmountFormatCustom } from '../../../../components/Input/Input';

let remainingInput = 0;

const headData = [
  {
    headerName: 'Bill No. & Date',
  },
  {
    headerName: 'Original Amount',
  },
  {
    headerName: 'Pending Amount',
  },
  {
    headerName: 'TDS',
  },
];

// eslint-disable-next-line no-unused-vars
const BillStatementCategorization = ({
  stateData,
  CategorizationBillStatementState,
  tdspercentagestate,
  hideTDS,
  CategorizationAdvanceTableDataState,
  setCategorizationState,
  CategorizationViewTableDataState,
  selectedTransaction,
  CategorizationState,
  status,
}) => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const { organization, user } = useContext(AppContext);
  const dispatch = useDispatch();

  const tempAmount = Math.abs(selectedTransaction?.amount);
  const [advance, setAdvance] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsWithBalance, setSelectedRowsWithBalance] = useState([]);
  const [width, setWidth] = useState({ tds: 0, allocatamt: 0, baltotal: 0 });
  const [BillStatementTableData, setBillStatementTableData] = useState([]);

  const [columns, setColumns] = useState();
  const [billPdf, setBillPdf] = useState({
    open: false,
    file: null,
  });
  const [pageNumber, setPageNumber] = React.useState(1);
  const customerInvoiceView =
    CategorizationState?.partyState?.type === 'customer' &&
    CategorizationState?.purposeState?.name === 'Against Bills';
  const vendorBillView =
    CategorizationState?.partyState?.type === 'vendor' &&
    CategorizationState?.purposeState?.name === 'Against Bills';
  const isVendor =
    CategorizationState?.purposeState?.etype?.toLowerCase() === 'vendor';
  const isSelectedBill = (CategorizationState?.purposeState?.name === selectedTransaction?.purpose && CategorizationState?.partyState?.id === selectedTransaction?.entity_id);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  const TransactionAmtAssign = (transAmount, data) => {
    remainingInput = transAmount;

    const updatedArray = data?.reduce((result, item) => {
      // if(isVendor){
      //   if (
      //     remainingInput >=
      //     Number(item?.net_balance)
      //   ) {
      //     remainingInput -= Number(item?.net_balance);

      //     return result.concat({
      //       id: item?.id,
      //       amount:
      //         Number(item?.net_balance) ,
      //       pendingAmount: item?.net_balance,
      //       balanceAmount: 0,
      //       taxable_amount: item?.taxable_amount,
      //       toCollect: Number(item?.net_balance) -   ,
      //       tds: !!item?.tds_amount ? item?.tds_amount : 0,
      //       tds_amount: item?.tds_amount,
      //       originalArray: item,
      //     });

      //     // eslint-disable-next-line no-else-return
      //   } else if (remainingInput > 0) {
      //     const tempBalance =
      //       Number(item?.net_balance) - remainingInput;
      //     const reducedAmt =
      //       Number(item?.net_balance) - tempBalance;
      //     remainingInput = 0;
      //     return result.concat({
      //       id: item?.id,
      //       amount: (Number(reducedAmt)).toFixed(2),
      //       balanceAmount: tempBalance,
      //       pendingAmount: item?.net_balance,
      //       taxable_amount: item?.taxable_amount,
      //       toCollect: Number(item?.net_balance) ,
      //       tds: !!item?.tds_amount ? item?.tds_amount : 0,
      //       tds_amount: item?.tds_amount,
      //       originalArray: item,
      //     });
      //   }
      // } else {
      if (
        remainingInput >=
        Number(item?.net_balance) - Number(item?.tds_amount)
      ) {
        remainingInput -= Number(item?.net_balance) - Number(item?.tds_amount);

        return result.concat({
          id: item?.id,
          amount:
            Number(item?.net_balance) - Number(item?.tds_amount).toFixed(2),
          pendingAmount: item?.net_balance,
          balanceAmount: 0,
          taxable_amount: item?.taxable_amount,
          toCollect: Number(item?.net_balance) - Number(item?.tds_amount),
          tds: !!item?.tds_amount ? item?.tds_amount : 0,
          tds_amount: item?.tds_amount,
          originalArray: item,
        });

        // eslint-disable-next-line no-else-return
      } else if (remainingInput > 0) {
        const tempBalance =
          Number(item?.net_balance) - Number(item?.tds_amount) - remainingInput;
        const reducedAmt =
          Number(item?.net_balance) - Number(item?.tds_amount) - tempBalance;
        remainingInput = 0;
        return result.concat({
          id: item?.id,
          amount: reducedAmt.toFixed(2),
          balanceAmount: tempBalance,
          pendingAmount: item?.net_balance,
          taxable_amount: item?.taxable_amount,
          toCollect: Number(item?.net_balance) - Number(item?.tds_amount),
          tds: !!item?.tds_amount ? item?.tds_amount : 0,
          tds_amount: item?.tds_amount,
          originalArray: item,
        });
      }
      // }
      return result;
    }, []);
    return updatedArray;
  };

  const calculateAmout = (e, id) => {
    if (e?.target?.checked) {
      // if(isVendor){
      //   if (
      //     remainingInput === 0 ||
      //     Number(
      //       selectedRowsWithBalance?.reduce(
      //         (total, item) => total + item.amount,
      //         0
      //       )
      //     ) +
      //       (advance === 1 ? remainingInput : 0) ===
      //       tempAmount
      //   ) {
      //     dispatch(
      //       openSnackbar({
      //         message: 'There is no amount remaining',
      //         type: 'error',
      //       })
      //     );
      //     return;
      //   }
      //   const arr = BillStatementTableData?.find((val) => val?.id === id);
      //   let obj = {};
      //   const tds = arr.tds_amount
      //     ? arr.tds_amount
      //     : (Number(tdspercentagestate) / 100) * Number(arr.taxable_amount);
      //   if (remainingInput >= Number(arr?.net_balance)) {
      //     remainingInput -= Number(arr?.net_balance);
      //     obj = {
      //       id: arr?.id,
      //       amount: (Number(arr?.net_balance)).toFixed(2),
      //       balanceAmount: 0,
      //       pendingAmount: arr?.net_balance ,
      //       taxable_amount: arr?.taxable_amount,
      //       toCollect: (Number(arr?.net_balance)).toFixed(2),
      //       tds: !!arr?.tds_amount ? arr?.tds_amount : tds.toFixed(2),
      //       tds_amount: arr?.tds_amount,
      //       originalArray: arr,
      //     };
      //   } else if (remainingInput > 0) {
      //     const tempBalance = Number(arr?.net_balance) - remainingInput;
      //     const reducedAmt = Number(arr?.net_balance) - tempBalance;

      //     remainingInput = 0;
      //     obj = {
      //       id: arr?.id,
      //       amount: (Number(reducedAmt))?.toFixed(2),
      //       balanceAmount: (Number(tempBalance))?.toFixed(2),
      //       pendingAmount: arr?.net_balance,
      //       taxable_amount: arr?.taxable_amount,
      //       toCollect: (Number(arr?.net_balance)).toFixed(2),
      //       tds: !!arr?.tds_amount ? arr?.tds_amount : tds.toFixed(2),
      //       tds_amount: arr?.tds_amount,
      //       originalArray: arr,
      //     };
      //   }

      //   setSelectedRowsWithBalance((prev) => [...prev, obj]);
      //   setSelectedRows((prev) => [...prev, id]);
      // } else {
      if (
        remainingInput === 0 ||
        Number(
          selectedRowsWithBalance?.reduce(
            (total, item) => total + item.amount,
            0
          )
        ) +
          (advance === 1 ? remainingInput : 0) ===
          tempAmount
      ) {
        dispatch(
          openSnackbar({
            message: 'There is no amount remaining',
            type: 'error',
          })
        );
        return;
      }
      const arr = BillStatementTableData?.find((val) => val?.id === id);
      let obj = {};
      const tds = arr.tds_amount
        ? arr.tds_amount
        : (Number(tdspercentagestate) / 100) * Number(arr.taxable_amount);
      if (remainingInput >= Number(arr?.net_balance) - tds) {
        remainingInput -= Number(arr?.net_balance) - tds;
        obj = {
          id: arr?.id,
          amount: (Number(arr?.net_balance) - tds).toFixed(2),
          balanceAmount: 0,
          pendingAmount: arr?.net_balance,
          taxable_amount: arr?.taxable_amount,
          toCollect: (Number(arr?.net_balance) - tds).toFixed(2),
          tds: !!arr?.tds_amount ? arr?.tds_amount : tds.toFixed(2),
          tds_amount: arr?.tds_amount,
          originalArray: arr,
        };
      } else if (remainingInput > 0) {
        const tempBalance = Number(arr?.net_balance) - tds - remainingInput;
        const reducedAmt = Number(arr?.net_balance) - tds - tempBalance;

        remainingInput = 0;
        obj = {
          id: arr?.id,
          amount: reducedAmt?.toFixed(2),
          balanceAmount: tempBalance?.toFixed(2),
          pendingAmount: arr?.net_balance,
          taxable_amount: arr?.taxable_amount,
          toCollect: (Number(arr?.net_balance) - tds).toFixed(2),
          tds: !!arr?.tds_amount ? arr?.tds_amount : tds.toFixed(2),
          tds_amount: arr?.tds_amount,
          originalArray: arr,
        };
      }

      setSelectedRowsWithBalance((prev) => [...prev, obj]);
      setSelectedRows((prev) => [...prev, id]);
      // }
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

  const allSelectDues = () => {
    const sum = BillStatementTableData.reduce((accumulator, current) => {
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
        BillStatementTableData
      );

      setSelectedRowsWithBalance(tempArray);
      setSelectedRows(tempArray?.map((val) => val?.id));
    }
  };

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
          balanceAmount: isVendor
            ? Number(row.pendingAmount) - Number(e.target.value)
            : Number(row.pendingAmount) -
              Number(row.tds) -
              Number(e.target.value),
        };

      return item;
    });

    setSelectedRowsWithBalance(newArray);
    e.target.value = Number(String(e.target.value));
  };

  const onTDSChange = (e, id) => {
    if (e?.target?.value < 0) {
      e?.preventDefault();
      return;
    }
    const newTds = selectedRowsWithBalance.map((item) => {
      // if(isVendor){
      //   if (item.id === id) {
      //     remainingInput += (Number(item.amount) + Number(item.tds_amount));
      //     const TdsAmount = Number(e.target.value);
      //     const toCollectAmt = Number(item.pendingAmount) + Number(item.tds_amount);
      //     let tempObj = {};
      //     if (remainingInput > toCollectAmt) {
      //       tempObj = {
      //         ...item,
      //         tds: TdsAmount,
      //         toCollect: toCollectAmt,
      //         amount: toCollectAmt,
      //         balanceAmount: 0,
      //       };
      //       remainingInput -= toCollectAmt;
      //     } else {
      //       tempObj = {
      //         ...item,
      //         tds: TdsAmount,
      //         toCollect: toCollectAmt,
      //         amount: remainingInput,
      //         balanceAmount: toCollectAmt - remainingInput,
      //       };
      //       remainingInput = 0;
      //     }
      //     return tempObj;
      //   }
      // } else {
      if (item.id === id) {
        remainingInput += Number(item.amount);
        const TdsAmount = Number(e.target.value);
        const toCollectAmt = Number(item.pendingAmount) - TdsAmount;
        let tempObj = {};
        if (remainingInput > toCollectAmt) {
          tempObj = {
            ...item,
            tds: TdsAmount,
            toCollect: toCollectAmt,
            amount: toCollectAmt,
            balanceAmount: 0,
          };
          remainingInput -= toCollectAmt;
        } else {
          tempObj = {
            ...item,
            tds: TdsAmount,
            toCollect: toCollectAmt,
            amount: remainingInput,
            balanceAmount: toCollectAmt - remainingInput,
          };
          remainingInput = 0;
        }
        return tempObj;
      }
      // }
      return item;
    });
    setSelectedRowsWithBalance(newTds);
    e.target.value = Number(String(e.target.value));
  };

  const getWidth = (el) => {
    if (el && el > 0) Number(window?.getComputedStyle(el).width.slice(0, -2));
  };

  const billPdfDownload = (r_id, name) => {
    dispatch(enableLoading(true));
    axiosInst
      .get(`organizations/${organization?.orgId}/vendor_bills/${r_id}`)
      .then((res) => {
        if (res && !res?.data?.error) {
          if (res?.data?.message) {
            dispatch(
              openSnackbar({
                message: res?.data?.message || `Sorry we will look into it`,
                type: MESSAGE_TYPE.WARNING,
              })
            );
          } else if (res?.data?.file_url) {
            setBillPdf({
              file: res?.data?.file_url,
              open: true,
              name,
              id: r_id,
            });
          } else if (!res?.data?.file_url) {
            dispatch(
              openSnackbar({
                message: 'There is no bill',
                type: MESSAGE_TYPE.ERROR,
              })
            );
          }
        } else if (res?.data?.error) {
          dispatch(
            openSnackbar({
              message:
                res?.data?.error ||
                res.data.message ||
                `Sorry we will look into it`,
              type: MESSAGE_TYPE.ERROR,
            })
          );
        }

        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message || 'Error',
            type: MESSAGE_TYPE.ERROR,
          })
        );
        dispatch(enableLoading(false));
      });
  };

  const recurringPdfDownload = (r_id, name) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', user.activeToken);
    myHeaders.append(
      'Cookie',
      'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f'
    );

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/invoices/${r_id}.html`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setBillPdf({ value: result, open: true, name, id: r_id });
      })
      .catch((error) => console.log('error', error));
  };

  const handleDownloadClick = async () => {
    if (device === 'desktop') {
      const image = await fetch(billPdf?.file);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement('a');
      link.href = imageURL;
      link.download = billPdf?.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      JSBridge.downloadLink(billPdf?.file);
    }
  };

  const handleDownloadClickInvoice = async (res) => {
    if (device === 'desktop') {
      const image = await fetch(res.pdf);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement('a');
      link.href = imageURL;
      link.download = billPdf?.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      JSBridge.downloadLink(res.pdf);
    }
  };

  const pdfGeneration = () => {
    dispatch(enableLoading(true));
    axiosInst
      .get(
        `organizations/${organization?.orgId}/invoices/${billPdf?.id}/url?type=pdf`
      )
      .then((res) => {
        if (res?.data && !res?.data?.error) {
          dispatch(enableLoading(false));
          handleDownloadClickInvoice(res?.data);
        } else {
          dispatch(enableLoading(false));
          dispatch(
            openSnackbar({
              message:
                res?.data?.message ||
                Object.values(res?.data?.errors).join(', '),
              type: MESSAGE_TYPE.ERROR,
            })
          );
        }
      });
  };

  const RemoveDuplicates = (array, key) => {
    return array.reduce((arr1, item) => {
      const removed = arr1.filter((i) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };

  useEffect(() => {
    if (!CategorizationViewTableDataState && status === 'Add') {
      const tempArray = TransactionAmtAssign(
        tempAmount,
        BillStatementTableData
      );

      setSelectedRowsWithBalance(tempArray);
      setSelectedRows(tempArray?.map((val) => val?.id));
    }
  }, [BillStatementTableData, tempAmount, stateData]);

  useEffect(() => {
    const sumAmount = selectedRowsWithBalance?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0);

    if (tempAmount - sumAmount > 0) remainingInput = tempAmount - sumAmount;
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
    if (advance === 1) {
      setCategorizationState((prev) => ({
        ...prev,
        advanceData: {
          id: CategorizationAdvanceTableDataState?.advance_voucher_number,
          payableAmount: remainingInput,
          paid: remainingInput,
          tds: 0,
        },
      }));
    } else {
      setCategorizationState((prev) => ({ ...prev, advanceData: null }));
    }
  }, [advance]);

  useEffect(() => {
    if (isVendor) {
      if (CategorizationViewTableDataState && status === 'Edit') {
        const tempArr = [];
        const tempRowWithBalance = [];
        if (isSelectedBill) {
          selectedTransaction?.categorized_lines?.forEach((val) => {
            if (!val?.advance) {
              tempArr?.push({
                ...val,
                amount: val?.original_amount + val?.tds_amount,
                net_balance: val?.net_balance + val?.tds_amount,
                tds_amount: val?.tds_amount,
                pending_amount: val?.pending_amount + val?.tds_amount,
                id: val?.txn_line_id,
                editTds: true,
              });
            }
            if (val?.advance) {
              setAdvance(1);
            }
          });
          selectedTransaction?.categorized_lines?.forEach((val) => {
            const tds = val?.tds_amount
              ? val?.tds_amount
              : (Number(tdspercentagestate) / 100) * Number(val.taxable_amount);
            tempRowWithBalance.push({
              id: val?.txn_line_id,
              amount: Number(val?.allocated_amount),
              balanceAmount:
                Number(val?.net_balance) +
                Number(tds) -
                Number(val?.allocated_amount),
              pendingAmount: Number(val?.net_balance) + Number(tds),
              taxable_amount: Number(val?.taxable_amount),
              toCollect: Number(val?.net_balance) + Number(tds),
              tds: !!val?.tds_amount ? val?.tds_amount : tds.toFixed(2),
              tds_amount: Number(val?.tds_amount),
              originalArray: val,
              editTds: true,
            });
          });
        }
        setBillStatementTableData(tempArr);
        setSelectedRows(tempRowWithBalance?.map((val) => val?.id));
        setSelectedRowsWithBalance(tempRowWithBalance);
      } else if (!CategorizationViewTableDataState && status === 'Add') {
        CategorizationBillStatementState?.forEach((ele) => {
          const tds = ele.tds_amount
            ? Number(ele.tds_amount)
            : (Number(tdspercentagestate) / 100) * Number(ele.taxable_amount);
          ele.amount = Number(ele.amount) + Number(tds);
          ele.net_balance = Number(ele?.net_balance) + Number(tds);
          ele.balanceAmount = Number(ele?.net_balance);
          ele.toCollect = Number(ele?.net_balance);
        });
        setBillStatementTableData(CategorizationBillStatementState);
      } else if (CategorizationViewTableDataState && status === 'Add') {
        const tempArr = [];
        const tempRowWithBalance = [];
        // if (CategorizationBillStatementState?.length === 0) {
        if (isSelectedBill) {
          selectedTransaction?.categorized_lines?.forEach((val) => {
            if (!val?.advance) {
              tempArr?.push({
                ...val,
                amount: Number(val?.original_amount) + Number(val?.tds_amount),
                net_balance: Number(val?.net_balance) + Number(val?.tds_amount),
                tds_amount: val?.tds_amount,
                pending_amount:
                  Number(val?.pending_amount) + Number(val?.tds_amount),
                toCollect: Number(val?.net_balance) - Number(val?.tds_amount),
                id: val?.txn_line_id,
                originalArray: val,
                editTds: true,
              });
            }
            if (val?.advance) {
              setAdvance(1);
            }
          });
          // }
          selectedTransaction?.categorized_lines?.forEach((val) => {
            const tds = val?.tds_amount
              ? val?.tds_amount
              : (Number(tdspercentagestate) / 100) * Number(val.taxable_amount);
            if (!val?.advance) {
              tempRowWithBalance.push({
                id: val?.txn_line_id,
                amount: Number(val?.allocated_amount),
                balanceAmount:
                  Number(val?.net_balance) - Number(val?.allocated_amount),
                pendingAmount: Number(val?.net_balance) + Number(tds),
                taxable_amount: Number(val?.taxable_amount),
                toCollect: Number(val?.net_balance),
                tds: !!val?.tds_amount ? val?.tds_amount : tds.toFixed(2),
                tds_amount: Number(val?.tds_amount),
                originalArray: val,
                editTds: true,
              });
            }
            if (val?.advance) {
              setAdvance(1);
            }
          });
        }
        CategorizationBillStatementState?.forEach((val) => {
          val.amount = Number(val.amount) + Number(val?.tds_amount);
          val.net_balance = Number(val?.net_balance) + Number(val?.tds_amount);
          val.balanceAmount = Number(val?.net_balance);
          val.toCollect = Number(val?.net_balance);
          const tds = val?.tds_amount
            ? val?.tds_amount
            : (Number(tdspercentagestate) / 100) * Number(val.taxable_amount);
          if (isSelectedBill) {
            const tempLines = selectedTransaction?.categorized_lines?.find(
              (data) => data?.txn_line_id === val?.id
            );
            if (Object?.keys(tempLines || {})?.length > 0) {
              tempArr?.push({
                ...val,
                amount: Number(tempLines?.original_amount) + Number(tds),
                net_balance: Number(tempLines?.net_balance) + Number(tds),
                tds_amount: tempLines?.tds_amount,
                pending_amount: Number(tempLines?.pending_amount) + Number(tds),
                toCollect: Number(tempLines?.net_balance),
                editTds:true,
              });
              return;
            }
          }
          tempArr?.push({
            ...val,
            toCollect: Number(val?.net_balance),
          });
        });
        setBillStatementTableData(RemoveDuplicates(tempArr, 'id'));
        // setBillStatementTableData(tempArr);
        setSelectedRows(tempRowWithBalance?.map((val) => val?.id));
        setSelectedRowsWithBalance(tempRowWithBalance);
      }
    } else {
      if (CategorizationViewTableDataState && status === 'Edit') {
        const tempArr = [];
        const tempRowWithBalance = [];
        if (isSelectedBill) {
          selectedTransaction?.categorized_lines?.forEach((val) => {
            if (!val?.advance) {
              tempArr?.push({
                ...val,
                amount: val?.original_amount,
                net_balance: val?.net_balance,
                tds_amount: val?.tds_amount,
                pending_amount: val?.pending_amount,
                id: val?.txn_line_id,
                editTds: true,
              });
            }
            if (val?.advance) {
              setAdvance(1);
            }
          });
          selectedTransaction?.categorized_lines?.forEach((val) => {
            const tds = val?.tds_amount
              ? val?.tds_amount
              : (Number(tdspercentagestate) / 100) * Number(val.taxable_amount);
            tempRowWithBalance.push({
              id: val?.txn_line_id,
              amount: val?.allocated_amount,
              balanceAmount:
                Number(val?.net_balance) - Number(val?.allocated_amount),
              pendingAmount: Number(val?.net_balance),
              taxable_amount: Number(val?.taxable_amount),
              toCollect: Number(val?.net_balance) - tds,
              tds: !!val?.tds_amount ? val?.tds_amount : tds.toFixed(2),
              tds_amount: Number(val?.tds_amount),
              originalArray: val,
              editTds: true,
            });
          });
        }
        setBillStatementTableData(tempArr);
        setSelectedRows(tempRowWithBalance?.map((val) => val?.id));
        setSelectedRowsWithBalance(tempRowWithBalance);
      } else if (!CategorizationViewTableDataState && status === 'Add') {
        CategorizationBillStatementState?.forEach((ele) => {
          const tds = ele.tds_amount
            ? Number(ele.tds_amount)
            : (Number(tdspercentagestate) / 100) * Number(ele.taxable_amount);
          ele.balanceAmount = Number(ele?.net_balance) - tds;
          ele.toCollect = Number(ele?.net_balance) - tds;
        });
        setBillStatementTableData(CategorizationBillStatementState);
      } else if (CategorizationViewTableDataState && status === 'Add') {
        const tempArr = [];
        const tempRowWithBalance = [];
        // if (CategorizationBillStatementState?.length === 0) {
        if (isSelectedBill) {
          selectedTransaction?.categorized_lines?.forEach((val) => {
            if (!val?.advance) {
              tempArr?.push({
                ...val,
                amount: val?.original_amount,
                net_balance: val?.net_balance,
                tds_amount: val?.tds_amount,
                pending_amount: val?.pending_amount,
                toCollect: Number(val?.net_balance) - Number(val?.tds_amount),
                id: val?.txn_line_id,
                originalArray: val,
                editTds: true,
              });
            }
            if (val?.advance) {
              setAdvance(1);
            }
          });
          // }
          selectedTransaction?.categorized_lines?.forEach((val) => {
            const tds = val?.tds_amount
              ? val?.tds_amount
              : (Number(tdspercentagestate) / 100) * Number(val.taxable_amount);
            if (!val?.advance) {
              tempRowWithBalance.push({
                id: val?.txn_line_id,
                amount: val?.allocated_amount,
                balanceAmount:
                  Number(val?.net_balance) - Number(val?.allocated_amount),
                pendingAmount: Number(val?.net_balance),
                taxable_amount: Number(val?.taxable_amount),
                toCollect: Number(val?.net_balance) - tds,
                tds: !!val?.tds_amount ? val?.tds_amount : tds.toFixed(2),
                tds_amount: Number(val?.tds_amount),
                originalArray: val,
                editTds: true,
              });
            }
            if (val?.advance) {
              setAdvance(1);
            }
          });
        }
        CategorizationBillStatementState?.forEach((val) => {
          const tds = val?.tds_amount
            ? val?.tds_amount
            : (Number(tdspercentagestate) / 100) * Number(val.taxable_amount);
          if (isSelectedBill) {
            const tempLines = selectedTransaction?.categorized_lines?.find(
              (data) => data?.txn_line_id === val?.id
            );
            if (Object?.keys(tempLines || {})?.length > 0) {
              tempArr?.push({
                ...val,
                amount: tempLines?.original_amount,
                net_balance: tempLines?.net_balance,
                tds_amount: tempLines?.tds_amount,
                pending_amount: tempLines?.pending_amount,
                toCollect: Number(tempLines?.net_balance) - tds,
                editTds:true,
              });
              return;
            }
          }
          tempArr?.push({
            ...val,
            toCollect: Number(val?.net_balance) - tds,
          });
        });
        setBillStatementTableData(RemoveDuplicates(tempArr, 'id'));
        // setBillStatementTableData(tempArr);
        setSelectedRows(tempRowWithBalance?.map((val) => val?.id));
        setSelectedRowsWithBalance(tempRowWithBalance);
      }
    }
  }, [
    CategorizationViewTableDataState,
    CategorizationBillStatementState,
    stateData,
    status,
  ]);

  useEffect(() => {
    if (CategorizationViewTableDataState && status === 'Edit') {
      const tempData = [
        { headerName: 'Allocate Amount' },
        {
          headerName: 'Balance',
        },
      ];
      setColumns(headData.concat(tempData));
    } else {
      const tempData = [
        { headerName: 'To Collect' },
        { headerName: 'To Allocate' },
        {
          headerName: 'Balance',
        },
      ];
      setColumns(headData.concat(tempData));
    }
  }, [CategorizationViewTableDataState, status]);

  useEffect(() => {
    if (
      Number(tdspercentagestate) >= 0 &&
      typeof tdspercentagestate === 'string'
    ) {
      if (isVendor) {
        setAdvance(0);
        remainingInput = tempAmount;
        const tdsArray = selectedRowsWithBalance?.map((item) => {
          const tds =
            Number(item?.tds_amount) > 0
              ? item?.tds_amount.toFixed(2)
              : (Number(tdspercentagestate) / 100) *
                Number(item.taxable_amount);
          const toCollectAmt = Number(item.pendingAmount) + Number(tds);
          let tempObj = {};
          if (remainingInput >= Number(item.pendingAmount)) {
            remainingInput -= toCollectAmt;
            tempObj = {
              ...item,
              tds:
                Number(item?.tds_amount) > 0
                  ? item?.tds_amount.toFixed(2)
                  : tds.toFixed(2),
              toCollect: toCollectAmt.toFixed(2),
              amount: toCollectAmt.toFixed(2),
              balanceAmount: 0,
            };
          } else if (remainingInput > 0) {
            const remBalance =
              Number(item.pendingAmount) + Number(tds) - remainingInput;
            const alloctedAmount =
              Number(item.pendingAmount) + Number(tds) - remBalance;
            remainingInput = 0;
            tempObj = {
              ...item,
              tds:
                Number(item?.tds_amount) > 0
                  ? item?.tds_amount.toFixed(2)
                  : tds.toFixed(2),
              toCollect: toCollectAmt.toFixed(2),
              amount: alloctedAmount.toFixed(2),
              balanceAmount: remBalance.toFixed(2),
            };
          }
          return tempObj;
        });

        setSelectedRowsWithBalance(tdsArray?.filter((val) => val?.id));
        setSelectedRows(tdsArray?.map((val) => val?.id));
      } else {
        setAdvance(0);
        remainingInput = tempAmount;
        const tdsArray = selectedRowsWithBalance?.map((item) => {
          const tds =
            Number(item?.tds_amount) > 0
              ? item?.tds_amount.toFixed(2)
              : (Number(tdspercentagestate) / 100) *
                Number(item.taxable_amount);
          const toCollectAmt = Number(item.pendingAmount) - tds;
          let tempObj = {};
          if (remainingInput >= Number(item.pendingAmount) - tds) {
            remainingInput -= toCollectAmt;
            tempObj = {
              ...item,
              tds:
                Number(item?.tds_amount) > 0
                  ? item?.tds_amount.toFixed(2)
                  : tds.toFixed(2),
              toCollect: toCollectAmt.toFixed(2),
              amount: toCollectAmt.toFixed(2),
              balanceAmount: 0,
            };
          } else if (remainingInput > 0) {
            const remBalance =
              Number(item.pendingAmount) - tds - remainingInput;
            const alloctedAmount =
              Number(item.pendingAmount) - tds - remBalance;
            remainingInput = 0;
            tempObj = {
              ...item,
              tds:
                Number(item?.tds_amount) > 0
                  ? item?.tds_amount.toFixed(2)
                  : tds.toFixed(2),
              toCollect: toCollectAmt.toFixed(2),
              amount: alloctedAmount.toFixed(2),
              balanceAmount: remBalance.toFixed(2),
            };
          }
          return tempObj;
        });

        setSelectedRowsWithBalance(tdsArray?.filter((val) => val?.id));
        setSelectedRows(tdsArray?.map((val) => val?.id));
      }
    }
  }, [tdspercentagestate]);

  useEffect(() => {
    const tds =
      getWidth(document.querySelector('#row5')) >
      getWidth(document.querySelector('#tdstot'))
        ? getWidth(document.querySelector('#row5'))
        : getWidth(document.querySelector('#tdstot'));
    const allocatamt =
      getWidth(document.querySelector('#row7')) >
      getWidth(document.querySelector('#allocatetot'))
        ? getWidth(document.querySelector('#row7'))
        : getWidth(document.querySelector('#allocatetot'));
    const baltotal =
      getWidth(document.querySelector('#row8')) >
      getWidth(document.querySelector('#baltotal'))
        ? getWidth(document.querySelector('#row8'))
        : getWidth(document.querySelector('#baltotal'));

    setWidth((prev) => ({
      ...prev,
      tds,
      allocatamt,
      baltotal,
      cont: getWidth(document.querySelector('#tabcont')),
    }));
  }, [
    getWidth(document.querySelector('#allocatetot')),
    getWidth(document.querySelector('#tabcont')),
  ]);

  return (
    <>
      {device === 'desktop' ? (
        <>
          <Box
            sx={{
              // height: advance === 1 ? '85%' : '90%',
              height: '85%',
              width: '100%',
              position: 'relative',
              '& .edit-cell-background': {
                background: '#d9d9d959',
              },
            }}
          >
            <TableContainer
              className={css.billstatementcategorizationtableContainer}
              id="tabcont"
            >
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
                          BillStatementTableData?.length > 0
                            ? selectedRows?.length ===
                              BillStatementTableData?.length
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
                  {BillStatementTableData?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns?.length + 1} align="center">
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                  {console.log(
                    'BillStatementTableData',
                    BillStatementTableData
                  )}
                  {BillStatementTableData?.map((item) => (
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
                      <TableCell
                        onClick={() => {
                          if (item?.vendor_bill_id && vendorBillView) {
                            billPdfDownload(
                              item?.vendor_bill_id,
                              item?.document_number || item?.number
                            );
                          } else if (item?.invoice_id && customerInvoiceView) {
                            recurringPdfDownload(
                              item?.invoice_id,
                              item?.document_number || item?.number
                            );
                          }
                        }}
                        style={{
                          color:
                            (item?.vendor_bill_id && vendorBillView) ||
                            (item?.invoice_id && customerInvoiceView)
                              ? '#1F4FB9'
                              : '#000',
                          cursor:
                            ((item?.vendor_bill_id && vendorBillView) ||
                              (item?.invoice_id && customerInvoiceView)) &&
                            'pointer',
                        }}
                      >
                        {item?.document_number || item?.number}
                      </TableCell>
                      <TableCell align="right">
                        {IndianCurrency.format(Number(item?.amount))}
                      </TableCell>
                      <TableCell align="right">
                        {IndianCurrency.format(Number(item?.net_balance))}
                      </TableCell>
                      <TableCell align="right" sx={{ background: '#d9d9d959' }}>
                        {item?.tds_amount || hideTDS ? (
                          <>
                          {!item.editTds ? Number(item?.tds_amount) : <input
                          type="number"
                          className={css.inputallocatefield}
                          value={
                            selectedRowsWithBalance?.find(
                              (val) => val?.id === item?.id
                            )?.tds || 0
                          }
                          onChange={(e) => onTDSChange(e, item?.id)}
                          disabled={CategorizationViewTableDataState && status === 'Edit'}
                        />}
                        </>
                          )
                         : (
                          <input
                            type="number"
                            className={css.inputallocatefield}
                            value={
                              selectedRowsWithBalance?.find(
                                (val) => val?.id === item?.id
                              )?.tds || 0
                            }
                            onChange={(e) => onTDSChange(e, item?.id)}
                          />
                        )}
                      </TableCell>
                      {CategorizationViewTableDataState && status === 'Add' && (
                        <>
                          <TableCell align="right">
                            {IndianCurrency.format(
                              selectedRowsWithBalance?.find(
                                (val) => val?.id === item?.id
                              )?.toCollect ||
                                Number(item?.net_balance) -
                                  Number(item?.tds_amount) ||
                                0
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ background: '#d9d9d959' }}
                          >
                            <input
                              type="number"
                              className={css.inputallocatefield}
                              value={
                                selectedRowsWithBalance?.find(
                                  (val) => val?.id === item?.id
                                )?.amount || 0.0
                              }
                              onChange={(e) => onInputChange(e, item?.id)}
                            />
                          </TableCell>
                        </>
                      )}
                      {!CategorizationViewTableDataState &&
                        status === 'Add' && (
                          <>
                            <TableCell align="right">
                              {IndianCurrency.format(
                                selectedRowsWithBalance?.find(
                                  (val) => val?.id === item?.id
                                )?.toCollect ||
                                  Number(item?.net_balance) -
                                    Number(item?.tds_amount)
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ background: '#d9d9d959' }}
                            >
                              <input
                                type="number"
                                className={css.inputallocatefield}
                                value={
                                  selectedRowsWithBalance?.find(
                                    (val) => val?.id === item?.id
                                  )?.amount || 0.0
                                }
                                onChange={(e) => onInputChange(e, item?.id)}
                              />
                            </TableCell>
                          </>
                        )}
                      {CategorizationViewTableDataState &&
                        status === 'Edit' && (
                          <TableCell align="right">
                            {IndianCurrency.format(
                              Number(item?.allocated_amount)
                            )}
                          </TableCell>
                        )}
                      <TableCell align="right">
                        {
                          CategorizationViewTableDataState &&
                            status === 'Edit' &&
                            IndianCurrency.format(Number(item?.running_balance))
                          // ||
                          // isVendor ? `${IndianCurrency.format(
                          //   selectedRowsWithBalance?.find(
                          //     (row) => row.id === item.id
                          //   )?.balanceAmount + Number(item?.tds_amount) ||
                          //     Number(item?.balanceAmount) + Number(item?.tds_amount) || selectedRowsWithBalance?.find(
                          //       (row) => row.id === item.id
                          //     )?.toCollect ||
                          //       item?.toCollect ||
                          //     0)}` : IndianCurrency.format(
                          //       selectedRowsWithBalance?.find(
                          //         (row) => row.id === item.id
                          //       )?.balanceAmount ||
                          //         item?.balanceAmount || selectedRowsWithBalance?.find(
                          //           (row) => row.id === item.id
                          //         )?.toCollect ||
                          //           item?.toCollect ||
                          //         0
                          // )
                        }
                        {CategorizationViewTableDataState &&
                          status === 'Add' &&
                          IndianCurrency.format(
                            Number(
                              selectedRowsWithBalance?.find(
                                (row) => row.id === item.id
                              )?.balanceAmount
                            ) !== null &&
                              Number(
                                selectedRowsWithBalance?.find(
                                  (row) => row.id === item.id
                                )?.balanceAmount
                              ) !== undefined &&
                              Number(
                                selectedRowsWithBalance?.find(
                                  (row) => row.id === item.id
                                )?.balanceAmount
                              ) !== '' &&
                              !Number.isNaN(
                                Number(
                                  selectedRowsWithBalance?.find(
                                    (row) => row.id === item.id
                                  )?.balanceAmount
                                )
                              )
                              ? Number(
                                  selectedRowsWithBalance?.find(
                                    (row) => row.id === item.id
                                  )?.balanceAmount
                                )
                              : Number(
                                  item?.balanceAmount - item?.tds_amount ||
                                    item?.toCollect
                                ) || 0
                          )}

                        {!CategorizationViewTableDataState &&
                          status === 'Add' &&
                          IndianCurrency.format(
                            Number(
                              selectedRowsWithBalance?.find(
                                (row) => row.id === item.id
                              )?.balanceAmount
                            ) !== null &&
                              Number(
                                selectedRowsWithBalance?.find(
                                  (row) => row.id === item.id
                                )?.balanceAmount
                              ) !== undefined &&
                              Number(
                                selectedRowsWithBalance?.find(
                                  (row) => row.id === item.id
                                )?.balanceAmount
                              ) !== '' &&
                              !Number.isNaN(
                                Number(
                                  selectedRowsWithBalance?.find(
                                    (row) => row.id === item.id
                                  )?.balanceAmount
                                )
                              )
                              ? Number(
                                  selectedRowsWithBalance?.find(
                                    (row) => row.id === item.id
                                  )?.balanceAmount
                                )
                              : Number(
                                  item?.balanceAmount - item?.tds_amount ||
                                    item?.toCollect
                                ) || 0
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {advance === 1 && (
                <Table
                  style={{
                    position: 'sticky',
                    bottom: 0,
                    marginTop: 'auto',
                    zIndex: 2,
                  }}
                >
                  <TableBody>
                    <TableRow className={css.advancefooter}>
                      <TableCell
                        style={{
                          width: getWidth(document.querySelector('#row1')) - 3,
                        }}
                      >
                        <Checkbox
                          style={{
                            color: '#F08B32',
                            padding: 0,
                          }}
                          checked={advance === 1}
                          onChange={() => {
                            setAdvance(0);
                            const tempAdv = selectedRowsWithBalance?.filter(
                              (val) =>
                                val?.id !==
                                CategorizationAdvanceTableDataState?.advance_voucher_number
                            );
                            setSelectedRowsWithBalance(tempAdv);
                          }}
                          disabled={
                            CategorizationViewTableDataState &&
                            status === 'Edit'
                          }
                        />
                      </TableCell>
                      <TableCell
                        style={{
                          width: getWidth(document.querySelector('#row2')) - 3,
                        }}
                      >
                        {
                          CategorizationAdvanceTableDataState?.advance_voucher_number
                        }
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          width: getWidth(document.querySelector('#row3')) - 3,
                        }}
                      >
                        Advance
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          width: getWidth(document.querySelector('#row4')) - 3,
                        }}
                      >
                        {IndianCurrency.format(
                          Number((tdspercentagestate / 100) * remainingInput) +
                            Number(remainingInput) || 0
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          width: getWidth(document.querySelector('#row5')) - 3,
                        }}
                      >
                        {tdspercentagestate
                          ? IndianCurrency.format(
                              Number(
                                (tdspercentagestate / 100) * remainingInput
                              ) || 0
                            )
                          : 0}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          width: getWidth(document.querySelector('#row6')) - 3,
                        }}
                      >
                        {CategorizationViewTableDataState &&
                        status === 'Edit' && isSelectedBill
                          ? IndianCurrency.format(
                              selectedTransaction?.categorized_lines?.find(
                                (val) => val?.advance
                              )?.allocated_amount
                            )
                          : IndianCurrency.format(remainingInput)}
                      </TableCell>
                      {status === 'Add' && (
                        <TableCell
                          align="right"
                          style={{
                            width:
                              getWidth(document.querySelector('#row7')) - 3,
                          }}
                        >
                          {CategorizationViewTableDataState &&
                          status === 'Edit' && isSelectedBill
                            ? IndianCurrency.format(
                                selectedTransaction?.categorized_lines?.find(
                                  (val) => val?.advance
                                )?.allocated_amount
                              )
                            : IndianCurrency.format(remainingInput)}
                        </TableCell>
                      )}
                      <TableCell
                        align="right"
                        style={{
                          width: getWidth(
                            document.querySelector(
                              status === 'Edit' ? '#row7' : '#row7'
                            ) - 3
                          ),
                        }}
                      >
                        {CategorizationViewTableDataState &&
                        status === 'Edit' && isSelectedBill
                          ? IndianCurrency.format(
                              selectedTransaction?.categorized_lines?.find(
                                (val) => val?.advance
                              )?.running_balance
                            )
                          : `-${IndianCurrency.format(remainingInput)}`}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>
          {/* <TableContainer
        className={css.billstatementcategorizationtableContainer}
        style={{ width: getWidth(document.querySelector('#tabcont')) }}
      > */}
          <Table>
            <TableBody>
              <TableRow className={css.footerTotal}>
                <TableCell
                  style={{
                    width: getWidth(document.querySelector('#row1')) - 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '8px 10px',
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  style={{
                    width: getWidth(document.querySelector('#row2')) - 3,
                    padding: '8px 10px',
                  }}
                />
                <TableCell
                  align="right"
                  style={{
                    width: getWidth(document.querySelector('#row3')) - 3,
                    padding: '8px 10px',
                  }}
                />
                <TableCell
                  align="right"
                  style={{
                    width: getWidth(document.querySelector('#row4')) - 3,
                    padding: '8px 10px',
                  }}
                />
                <TableCell
                  align="right"
                  id="tdstot"
                  style={{
                    width: width.tds - 3,
                    borderBottom: '1px solid #e0e0e0',
                    borderLeft: '1px solid #e0e0e0',
                    borderRight: '1px solid #e0e0e0',
                    padding: '8px 10px',
                  }}
                >
                  {IndianCurrency.format(
                    Number(
                      selectedRowsWithBalance?.reduce(
                        (total, item) => total + Number(item?.tds || 0),
                        0
                      )
                    ) + (advance === 1 ? remainingInput : 0) || 0
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    width: getWidth(document.querySelector('#row6')) - 3,
                    padding: '8px 10px',
                  }}
                />
                <TableCell
                  align="right"
                  id="allocatetot"
                  style={{
                    width: width.allocatamt - 3,
                    padding: '8px 10px',
                  }}
                >
                  {IndianCurrency.format(
                    Number(
                      selectedRowsWithBalance?.reduce(
                        (total, item) => total + Number(item.amount),
                        0
                      )
                    ) + (advance === 1 ? remainingInput : 0) || 0
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  id="baltotal"
                  style={{
                    width: width.baltotal - 3,
                    padding: '8px 10px',
                  }}
                >
                  {
                    CategorizationViewTableDataState &&
                      status === 'Edit' &&
                      IndianCurrency.format(
                        Number(
                          selectedRowsWithBalance?.reduce(
                            (total, item) => total + Number(item.balanceAmount),
                            0
                          )
                        ) || 0
                      )
                    // ||
                    // isVendor ? `${IndianCurrency.format(
                    //   selectedRowsWithBalance?.find(
                    //     (row) => row.id === item.id
                    //   )?.balanceAmount + Number(item?.tds_amount) ||
                    //     Number(item?.balanceAmount) + Number(item?.tds_amount) || selectedRowsWithBalance?.find(
                    //       (row) => row.id === item.id
                    //     )?.toCollect ||
                    //       item?.toCollect ||
                    //     0)}` : IndianCurrency.format(
                    //       selectedRowsWithBalance?.find(
                    //         (row) => row.id === item.id
                    //       )?.balanceAmount ||
                    //         item?.balanceAmount || selectedRowsWithBalance?.find(
                    //           (row) => row.id === item.id
                    //         )?.toCollect ||
                    //           item?.toCollect ||
                    //         0
                    // )
                  }

                  {CategorizationViewTableDataState &&
                    status === 'Add' &&
                    IndianCurrency.format(
                      Number(
                        selectedRowsWithBalance?.reduce(
                          (total, item) => total + Number(item.balanceAmount),
                          0
                        )
                      ) || 0
                    )}

                  {/* {isVendor ? IndianCurrency.format(
                    Number(
                      selectedRowsWithBalance?.reduce(
                        (total, item) => total + Number(item.balanceAmount),
                        0
                      )
                    ) + Number(
                      selectedRowsWithBalance?.reduce(
                        (total, item) => total + Number(item?.tds || 0),
                        0
                      )
                    ) || 0
                  ) : IndianCurrency.format(
                    Number(
                      selectedRowsWithBalance?.reduce(
                        (total, item) => total + Number(item.balanceAmount),
                        0
                      )
                    ) || 0
                  )} */}

                  {!CategorizationViewTableDataState &&
                    status === 'Add' &&
                    IndianCurrency.format(
                      Number(
                        selectedRowsWithBalance?.reduce(
                          (total, item) => total + Number(item.balanceAmount),
                          0
                        )
                      ) || 0
                    )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* </TableContainer> */}

          {/* {BillStatementTableData?.length > 0 && (
        <div className={css.billstatementcategorization}>
          <div className={css.emptybottomelements}>
            <p className={css.totaltextcategorization}>Total</p>
          </div>
          <div
            className={css.tdsbottomdiv}
            style={{ width: getWidth(document.querySelector('#row5')) }}
          >
            {IndianCurrency.format(
              Number(
                selectedRowsWithBalance?.reduce(
                  (total, item) => total + Number(item?.tds || 0),
                  0
                )
              ) + (advance === 1 ? remainingInput : 0)
            )}
          </div>
          <div
            className={css.allocatebottomdiv}
            style={{ width: getWidth(document.querySelector('#row7')) }}
          >
            {IndianCurrency.format(
              Number(
                selectedRowsWithBalance?.reduce(
                  (total, item) => total + Number(item.amount),
                  0
                )
              ) + (advance === 1 ? remainingInput : 0)
            )}
          </div>
          <div
            className={css.balancebottomdiv}
            style={{ width: getWidth(document.querySelector('#row8')) }}
          >
            {IndianCurrency.format(
              Number(
                selectedRowsWithBalance?.reduce(
                  (total, item) => total + Number(item.balanceAmount),
                  0
                )
              )
            )}
          </div>
        </div>
      )} */}

          {remainingInput > 0 &&
            advance === 0 &&
            BillStatementTableData?.length > 0 && (
              <div
                onClick={() => {
                  setAdvance(1);
                }}
                // style={{ cursor: 'pointer', color: '#00A676', display:'inline-block' }}
                style={{ cursor: 'pointer', color: '#00A676', marginTop: 8 }}
              >
                + Add Advance
              </div>
            )}
        </>
      ) : (
        <div className={css.billstatementcategorizationmobile}>
          <Stack direction="row" className={css.mobilehead}>
            <p className={css.firstcont}>Bill No. & Date</p>
            <p className={css.secondcont}>To Pay</p>
            <p className={css.thirdcont}>Allocate</p>
          </Stack>
          <Box
            sx={{
              overflow: 'auto',
              height: advance === 1 ? '100%' : 'calc(100% - 30px)',
            }}
          >
            {BillStatementTableData?.length === 0 && (
              <p
                style={{ textAlign: 'center', margin: '10px 0', fontSize: 12 }}
              >
                No Data Found
              </p>
            )}
            {BillStatementTableData?.map((val) => (
              <Accordion
                style={{
                  border: '1px solid #D8D8D8',
                  margin: '8px 0',
                  boxShadow: 'none',
                  borderRadius: '4px',
                }}
                sx={{
                  '&::before': {
                    display: 'none',
                  },
                  '& .MuiAccordionSummary-root': {
                    borderBottom: 'none',
                  },
                  '& .MuiAccordionSummary-root.Mui-expanded': {
                    borderBottom: ' 1px solid #D8D8D8',
                    minHeight: '48px',
                  },
                  '& .MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0',
                  },
                }}
                key={val?.id}
              >
                <AccordionSummary
                  sx={{
                    padding: '0 !important',
                    borderBottom: '1px solid #D8D8D8',
                    // boxShadow: 'none',
                  }}
                >
                  <Stack direction="row" className={css.mobileaccordian}>
                    <div className={css.firstcont}>
                      <Checkbox
                        style={{
                          color: '#F08B32',
                          padding: '0 5px',
                        }}
                        key={val.id}
                        checked={
                          !!selectedRows?.find((item) => item === val?.id)
                        }
                        onChange={(e) => calculateAmout(e, val?.id)}
                        onClick={(e) => e?.stopPropagation()}
                        disabled={
                          CategorizationViewTableDataState && status === 'Edit'
                        }
                      />
                    </div>
                    <div
                      onClick={() => {
                        if (val?.vendor_bill_id && vendorBillView) {
                          billPdfDownload(
                            val?.vendor_bill_id,
                            val?.document_number || val?.number
                          );
                        } else if (val?.invoice_id && customerInvoiceView) {
                          recurringPdfDownload(
                            val?.invoice_id,
                            val?.document_number || val?.number
                          );
                        }
                      }}
                    >
                      <p
                        className={css.secondcont}
                        style={{
                          color:
                            (val?.vendor_bill_id && vendorBillView) ||
                            (val?.invoice_id && customerInvoiceView)
                              ? '#1F4FB9'
                              : '#000',
                          cursor:
                            ((val?.vendor_bill_id && vendorBillView) ||
                              (val?.invoice_id && customerInvoiceView)) &&
                            'pointer',
                        }}
                      >
                        {val?.document_number || val?.number}
                        <br />{' '}
                        <span>
                          {moment(val?.date, 'DD-MM-YYYY').format(
                            'MMM DD, YYYY'
                          )}
                        </span>
                      </p>
                    </div>
                    {/* <p className={css.thirdcont}>
                  {selectedRowsWithBalance &&
                    IndianCurrency.format(
                      selectedRowsWithBalance?.find(
                        (item) => item?.id === val?.id
                      )?.amount || 0.0
                    )}
                </p> */}
                    <p className={css.fourthcont}>
                      {IndianCurrency.format(
                        selectedRowsWithBalance?.find(
                          (item) => item?.id === val?.id
                        )?.toCollect ||
                          val?.toCollect ||
                          0.0
                      )}
                    </p>
                    {CategorizationViewTableDataState && status === 'Edit' && (
                      <p className={css.fourthcont}>
                        {IndianCurrency.format(Number(val?.allocated_amount)) ||
                          IndianCurrency.format(Number(val?.toCollect))}
                      </p>
                    )}
                    {CategorizationViewTableDataState && status === 'Add' && (
                      <input
                        className={css.rightinputtag}
                        value={
                          selectedRowsWithBalance?.find(
                            (row) => row.id === val.id
                          )?.amount || 0
                        }
                        onChange={(e) => onInputChange(e, val?.id)}
                      />
                    )}
                    {!CategorizationViewTableDataState && status === 'Add' && (
                      <input
                        className={css.rightinputtag}
                        value={
                          selectedRowsWithBalance?.find(
                            (row) => row.id === val.id
                          )?.amount || 0
                        }
                        onChange={(e) => onInputChange(e, val?.id)}
                      />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails style={{ padding: '8px 0 8px 36px' }}>
                  <Stack style={{ width: 'calc(66% - 41px)', gap: 12 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      className={css.mobileopenaccordian}
                    >
                      <p className={css.lefttag}>Original Amount</p>
                      <p className={css.righttag}>
                        {IndianCurrency.format(Number(val?.amount))}
                      </p>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      className={css.mobileopenaccordian}
                    >
                      <p className={css.lefttag}>Pending Amount</p>
                      <p className={css.righttag}>
                        {IndianCurrency.format(Number(val?.net_balance))}
                      </p>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      className={css.mobileopenaccordian}
                    >
                      <p className={css.lefttag}>TDS Amount</p>
                      <p className={css.righttag}>
                        {val?.tds_amount || hideTDS ? (
                          Number(val?.tds_amount)
                        ) : (
                          <input
                            type="number"
                            className={css.rightinputtag}
                            value={
                              selectedRowsWithBalance?.find(
                                (value) => value?.id === val?.id
                              )?.tds || 0
                            }
                            onChange={(e) => onTDSChange(e, val?.id)}
                          />
                        )}
                      </p>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    className={css.mobileopenaccordian}
                    mt={2}
                  >
                    <p
                      className={css.lefttag}
                      style={{ paddingLeft: '30%', color: '#F08B32' }}
                    >
                      Balance Amount
                    </p>
                    <p className={css.righttag} style={{ paddingRight: '5%' }}>
                      {/* {(CategorizationViewTableDataState &&
                        status === 'Edit' &&
                        IndianCurrency.format(Number(val?.running_balance))) ||
                        IndianCurrency.format(
                          selectedRowsWithBalance?.find(
                            (row) => row.id === val.id
                          )?.balanceAmount ||
                            val?.balanceAmount ||
                            selectedRowsWithBalance?.find(
                              (row) => row.id === val.id
                            )?.toCollect ||
                            val?.toCollect ||
                            0
                        )} */}

                      {
                        CategorizationViewTableDataState &&
                          status === 'Edit' &&
                          IndianCurrency.format(Number(val?.running_balance))
                        // ||
                        // isVendor ? `${IndianCurrency.format(
                        //   selectedRowsWithBalance?.find(
                        //     (row) => row.id === item.id
                        //   )?.balanceAmount + Number(item?.tds_amount) ||
                        //     Number(item?.balanceAmount) + Number(item?.tds_amount) || selectedRowsWithBalance?.find(
                        //       (row) => row.id === item.id
                        //     )?.toCollect ||
                        //       item?.toCollect ||
                        //     0)}` : IndianCurrency.format(
                        //       selectedRowsWithBalance?.find(
                        //         (row) => row.id === item.id
                        //       )?.balanceAmount ||
                        //         item?.balanceAmount || selectedRowsWithBalance?.find(
                        //           (row) => row.id === item.id
                        //         )?.toCollect ||
                        //           item?.toCollect ||
                        //         0
                        // )
                      }
                      {CategorizationViewTableDataState &&
                        status === 'Add' &&
                        IndianCurrency.format(
                          selectedRowsWithBalance?.find(
                            (row) => row.id === val.id
                          )?.balanceAmount ||
                            val?.balanceAmount - val?.tds_amount ||
                            selectedRowsWithBalance?.find(
                              (row) => row.id === val.id
                            )?.toCollect ||
                            val?.toCollect ||
                            0
                        )}

                      {!CategorizationViewTableDataState &&
                        status === 'Add' &&
                        IndianCurrency.format(
                          selectedRowsWithBalance?.find(
                            (row) => row.id === val.id
                          )?.balanceAmount ||
                            val?.balanceAmount - val?.tds_amount ||
                            selectedRowsWithBalance?.find(
                              (row) => row.id === val.id
                            )?.toCollect ||
                            val?.toCollect ||
                            0
                        )}
                    </p>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
            {advance === 1 && (
              <Accordion
                style={{
                  border: '1px solid #D8D8D8',
                  margin: 0,
                  boxShadow: 'none',
                  borderRadius: '4px',
                  position: 'sticky',
                  bottom: 0,
                }}
                sx={{
                  '&::before': {
                    display: 'none',
                  },
                  '& .MuiAccordionSummary-root': {
                    borderBottom: 'none',
                  },
                  '& .MuiAccordionSummary-root.Mui-expanded': {
                    borderBottom: ' 1px solid #D8D8D8',
                    minHeight: '48px',
                  },
                  '& .MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0',
                  },
                }}
              >
                <AccordionSummary
                  sx={{
                    padding: '0 !important',
                    borderBottom: '1px solid #D8D8D8',
                    background: '#fbe2cc',
                    borderRadius: '4px',
                  }}
                >
                  <Stack direction="row" className={css.mobileaccordian}>
                    <div className={css.firstcont}>
                      <Checkbox
                        style={{
                          color: '#F08B32',
                          padding: '0 5px',
                        }}
                        checked={advance === 1}
                        onChange={() => setAdvance(0)}
                      />
                    </div>
                    <p className={css.secondcont}>
                      {
                        CategorizationAdvanceTableDataState?.advance_voucher_number
                      }
                      <br />
                      <span>
                        {'    '}
                        {moment(selectedTransaction?.date, 'YYYY-MM-DD').format(
                          'MMM DD, YYYY'
                        )}
                      </span>
                    </p>
                    <p className={css.thirdcont}>
                      {IndianCurrency.format(remainingInput)}
                    </p>
                    <p className={css.fourthcont}>
                      {IndianCurrency.format(remainingInput)}
                    </p>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails style={{ padding: '8px 0 8px 36px' }}>
                  <Stack style={{ width: 'calc(66% - 41px)', gap: 12 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      className={css.mobileopenaccordian}
                    >
                      <p className={css.lefttag}>Original Amount</p>
                      <p className={css.righttag}>
                        {IndianCurrency.format(remainingInput)}
                      </p>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      className={css.mobileopenaccordian}
                    >
                      <p className={css.lefttag}>Pending Amount</p>
                      <p className={css.righttag}>
                        {IndianCurrency.format(remainingInput)}
                      </p>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      className={css.mobileopenaccordian}
                    >
                      <p className={css.lefttag}>TDS Amount</p>
                      <p className={css.righttag}>
                        {tdspercentagestate
                          ? IndianCurrency.format(
                              Number(
                                (tdspercentagestate / 100) * remainingInput
                              ) || 0
                            )
                          : 0}
                      </p>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    className={css.mobileopenaccordian}
                    mt={2}
                  >
                    <p
                      className={css.lefttag}
                      style={{ paddingLeft: '30%', color: '#F08B32' }}
                    >
                      Balance Amount
                    </p>
                    <p className={css.righttag} style={{ paddingRight: '5%' }}>
                      -{IndianCurrency.format(remainingInput)}
                    </p>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
          {remainingInput > 0 &&
            advance === 0 &&
            BillStatementTableData?.length > 0 && (
              <div
                onClick={() => setAdvance(1)}
                style={{ cursor: 'pointer', color: '#00A676' }}
              >
                + Add Advance
              </div>
            )}
        </div>
      )}
      <Dialog
        PaperProps={{
          elevation: 3,
          style: {
            width: vendorBillView && '75%',
            minWidth: customerInvoiceView && '75%',
            height: billPdf?.file?.includes('.pdf') ? '100%' : '',
            overflow: 'visible',
            borderRadius: 16,
            padding: 5,
          },
        }}
        open={billPdf?.open}
        onClose={() => setBillPdf({})}
      >
        {vendorBillView && (
          <DialogContent style={{ position: 'relative', padding: '20px 10px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                cursor: 'pointer',
              }}
              onClick={() => handleDownloadClick()}
            >
              <img src={download} alt="download" />
            </div>
            <Grid className={css.iframeViewDocument}>
              {billPdf?.file?.includes('.jpeg') ||
              billPdf?.file?.includes('.png') ||
              billPdf?.file?.includes('.pdf') === false ? (
                <img
                  src={billPdf?.file}
                  alt="upload"
                  style={{ width: '100%' }}
                />
              ) : (
                Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                  <Document
                    file={billPdf?.file}
                    className={css.pdfStyle}
                    loading="  "
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={i} className={css.page} />
                  </Document>
                ))
              )}
            </Grid>
          </DialogContent>
        )}

        {customerInvoiceView && (
          <DialogContent>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                cursor: 'pointer',
              }}
            >
              <div onClick={() => pdfGeneration()}>
                <img src={download} alt="download" />
              </div>
            </div>
            <Stack
              style={{
                backgroundColor: 'white',
                height: '85vh',
                width: '100%',
              }}
            >
              <iframe
                srcDoc={billPdf?.value?.replace(
                  'div.nobreak{page-break-inside:avoid}',
                  'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}'
                )}
                title="html"
                frameBorder="0"
                className={css.scrolling}
              />
            </Stack>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default BillStatementCategorization;
