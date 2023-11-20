import React, { useEffect, useState } from 'react';
import AppContext from '@root/AppContext.jsx';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { Paper, IconButton, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTitle from '@core/DashboardView/PageTitle';
import * as css_main from '@core/DashboardView/DashboardViewContainer.scss';
import CategorizationHeaderMain from './CategorizationHeader/CategorizationHeaderMain';
import CategorizationCenterMain from './CategorizationCenter/CategorizationCenterMain';
import CategorizationFooterMain from './CategorizationFooter/CategorizationFooterMain';

import * as css from './categorizationMain.scss';

const CategorizeMain = () => {
  const { organization, user, enableLoading, openSnackBar } =
    React.useContext(AppContext);
  const { state } = useLocation();
  const device = localStorage.getItem('device_detect');
  const [selectedTransaction, setSelectedTransaction] = useState();
  const [selectedTransactionId, setSelectedTransactionId] = useState();
  const [rowIndex, setRowIndex] = useState();
  const [CategorizationState, setCategorizationState] = useState({});
  const [payloadData, setPayloadData] = useState({});
  const [hideTDS, setHideTDS] = useState();
  const [CategorizationTablesState, setCategorizationTablesState] = useState(
    []
  );
  const [tdspercentagestate, settdspercentagestate] = useState();
  const [clearState, setClearstate] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState();
  const dispatch = useDispatch();

  const GetTxnDetails = (id) => {
    enableLoading(true);
    const url = `/organizations/${organization?.orgId}/bank_txns/${id}`;
    RestApi(url, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (res.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.INFO,
            });
          } else {
            setClearstate(false);
            setSelectedTransaction(res);
            setCategorizationState((prev) => ({
              ...prev,
              selectedTransaction: res,
            }));
            setTransactionStatus(res?.categorized ? 'Edit' : 'Add');
          }
        }
      })
      .catch((e) => {
        enableLoading(false);
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const CategorizationSuccessClear = (action) => {
    setClearstate(true);
    setCategorizationState((prev) => ({
      ...prev,
      partyState: null,
      purposeState: null,
      selectedBill: null,
      selectedTowardsAccount: null,
      selectedTransaction: null,
      file: null,
      narration: null,
      advanceValue: null,
      interestValue: null
    }));
    setCategorizationTablesState([]);
    if (action?.toLowerCase() === 'add') {
      setRowIndex((prev) => prev + 1);
    } else if (action?.toLowerCase() === 'dub') {
      setRowIndex((prev) => prev - 1);
    }
  };

  const CategorizeNowWithCheck = async () => {
    if (
      CategorizationState?.partyState?.id &&
      CategorizationState?.purposeState?.name &&
      CategorizationState?.selectedTransaction?.id
    ) {
      const transactionType =
        CategorizationState?.selectedTransaction?.amount > 0
          ? 'receipt_from_party'
          : 'payment_to_party';
      let formPayload;
      if (
        CategorizationState?.purposeState?.etype?.toLowerCase() ===
        'other banks'
      ) {
        if(CategorizationState?.purposeState?.name?.toLowerCase() === 'contra entry'){
          if(Math.abs(CategorizationState?.selectedBill?.selectedContraTransaction?.amount) === Math.abs(CategorizationState?.selectedTransaction?.amount)){
            formPayload = {
              type: transactionType,
              entity_id: CategorizationState?.partyState?.id,
              purpose: CategorizationState?.purposeState?.name,
              bank_txn_id: CategorizationState?.selectedTransaction?.id,
              account_id: CategorizationState?.purposeState?.id,
              amount: Math.abs(
                Number(CategorizationState?.selectedTransaction?.amount || 0)
              ),
              narration: payloadData?.narration,
              offset_bank_txn_id: CategorizationState?.selectedBill?.selectedContraTransaction?.id
            };
          } else {
            dispatch(
              openSnackbar({
                message:"Amount mismatch error",
                type: 'error',
              })
            );
            return;
          }
        } else {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.purposeState?.id,
            amount: Math.abs(
              Number(CategorizationState?.selectedTransaction?.amount || 0)
            ),
            narration: payloadData?.narration,
          };
        }
      }

      if (
        CategorizationState?.purposeState?.etype?.toLowerCase() === 'government'
      ) {
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'payment of gst' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'payment of income tax' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'statutory dues' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'payment of epf' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'payment of esi' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'payment of tds' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'payment of pt'
        ) {
          if (CategorizationState?.selectedBill?.remainingAmount === 0) {
            if (
              CategorizationState?.purposeState?.name?.toLowerCase() ===
              'payment of gst'
            ) {
              const gstPayload = [];
              if (CategorizationState?.advanceValue?.cgst) {
                const advanceValueCgst = {
                  advance: true,
                  type: 'cgst',
                  amount: CategorizationState?.advanceValue?.cgst,
                };
                const advanceValueSgst = {
                  advance: true,
                  type: 'sgst',
                  amount: CategorizationState?.advanceValue?.cgst,
                };
                gstPayload.push(advanceValueCgst, advanceValueSgst);
              }

              if (CategorizationState?.advanceValue?.igst) {
                const advanceValueIgst = {
                  advance: true,
                  type: 'igst',
                  amount: CategorizationState?.advanceValue?.igst,
                };
                gstPayload.push(advanceValueIgst);
              }

              if (CategorizationState?.interestValue?.gst) {
                const interestValueGst = {
                  advance: false,
                  type: '',
                  amount:
                    CategorizationState?.interestValue?.gst,
                };
                
                gstPayload.push(interestValueGst);
              }

              if (CategorizationState?.interestValue?.igst) {
                const interestValueIgst = {
                  advance: true,
                  type: 'igst',
                  amount:
                    CategorizationState?.interestValue?.igst,
                };
                gstPayload.push(interestValueIgst);
              }

              formPayload = {
                type: transactionType,
                bank_txn_id: CategorizationState?.selectedTransaction?.id,
                entity_id: CategorizationState?.partyState?.id,
                purpose: CategorizationState?.purposeState?.name,
                account_id: CategorizationState?.selectedTowardsAccount?.id,
                narration: CategorizationState?.narration,
                bills:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                    (ele) => ({
                      txn_line_id: ele.id,
                      amount: Number(ele?.amount),
                      tds_amount: null,
                      original_amount: Number(ele?.originalArray?.amount),
                      pending_amount: Number(ele?.originalArray?.net_balance),
                      taxable_amount: Number(
                        ele?.originalArray?.taxable_amountm|| 0
                      ),
                      account_id: ele?.originalArray?.account_id || CategorizationState?.selectedTowardsAccount?.id,
                      date: ele?.originalArray?.txn_month,
                      document_number:
                        ele?.originalArray?.document_number ||
                        ele?.originalArray?.number,
                    })
                  ),
                statutory_payment: gstPayload,
              };
            } else {
              formPayload = {
                type: transactionType,
                bank_txn_id: CategorizationState?.selectedTransaction?.id,
                entity_id: CategorizationState?.partyState?.id,
                purpose: CategorizationState?.purposeState?.name,
                account_id: CategorizationState?.selectedTowardsAccount?.id,
                narration: CategorizationState?.narration,
                bills:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                    (ele) => ({
                      txn_line_id: ele.id,
                      amount: Number(ele?.amount),
                      tds_amount: null,
                      original_amount: Number(ele?.originalArray?.amount),
                      pending_amount: Number(ele?.originalArray?.net_balance),
                      taxable_amount: Number(
                        ele?.originalArray?.taxable_amount || 0
                      ),
                      account_id: ele?.originalArray?.account_id || CategorizationState?.selectedTowardsAccount?.id,
                      date: ele?.originalArray?.txn_month,
                      document_number:
                        ele?.originalArray?.document_number ||
                        ele?.originalArray?.number,
                    })
                  ),
              };
            }
          } else {
            dispatch(
              openSnackbar({
                message:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance
                    ?.length === 0
                    ? 'Amount is not matching with the Allocated amount'
                    : 'Still there are some amount pending to categorize',
                type: 'error',
              })
            );
            return;
          }
        }

        if (
          CategorizationState?.purposeState?.name?.toLowerCase() === 'advance tax' 
        ) {
            formPayload = {
              type: transactionType,
              bank_txn_id: CategorizationState?.selectedTransaction?.id,
              entity_id: CategorizationState?.partyState?.id,
              purpose: CategorizationState?.purposeState?.name,
              account_id: CategorizationState?.selectedTowardsAccount?.id,
              narration: CategorizationState?.narration,
              advance: {
                document_reference: CategorizationState?.advanceData?.id,
                amount: CategorizationState?.advanceData?.paid,
                tds_amount: CategorizationState?.advanceData?.tds,
              },
            };
        }

        if (
          CategorizationState?.purposeState?.name?.toLowerCase() === 'refund'
        ) {
          if (
            CategorizationState?.selectedBill?.remainingAmount === 0 ||
            CategorizationState?.selectedBill?.remainingAmount ===
              CategorizationState?.advanceData?.paid
          ) {
            formPayload = CategorizationState?.advanceData
              ? {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                  advance: {
                    document_reference: CategorizationState?.advanceData?.id,
                    amount: CategorizationState?.advanceData?.paid,
                    tds_amount: CategorizationState?.advanceData?.tds,
                  },
                }
              : {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                };
          } else {
            dispatch(
              openSnackbar({
                message:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance
                    ?.length === 0
                    ? 'Amount is not matching with the Allocated amount'
                    : 'Still there are some amount pending to categorize',
                type: 'error',
              })
            );
            return;
          }
        }
      }

      if (
        CategorizationState?.purposeState?.etype?.toLowerCase() === 'promoter'
      ) {
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'loan given - given' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'drawing' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'capital' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'loan taken - taken'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            amount: Math.abs(
              Number(CategorizationState?.selectedTransaction?.amount || 0)
            ),
            narration: CategorizationState?.narration,
          };
        }

        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
          'director remuneration'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            amount: Math.abs(
              Number(CategorizationState?.selectedTransaction?.amount || 0)
            ),
            file: CategorizationState?.file?.id,
          };
        }

        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'reimbursement' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'loan taken - repaid' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'loan given - repaid'
        ) {
          if (
            CategorizationState?.selectedBill?.remainingAmount === 0 ||
            CategorizationState?.selectedBill?.remainingAmount ===
              CategorizationState?.advanceData?.paid
          ) {
            formPayload = CategorizationState?.advanceData
              ? {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                  advance: {
                    document_reference: CategorizationState?.advanceData?.id,
                    amount: CategorizationState?.advanceData?.paid,
                    tds_amount: CategorizationState?.advanceData?.tds,
                  },
                }
              : {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                };
          } else {
            dispatch(
              openSnackbar({
                message:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance
                    ?.length === 0
                    ? 'Amount is not matching with the Allocated amount'
                    : 'Still there are some amount pending to categorize',
                type: 'error',
              })
            );
            return;
          }
        }
      }

      if (
        CategorizationState?.purposeState?.etype?.toLowerCase() === 'lender'
      ) {
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
          'loan borrowed - emi taken'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            amount: Math.abs(
              Number(CategorizationState?.selectedTransaction?.amount || 0)
            ),
            file: CategorizationState?.file?.id,
          };
        }
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'loan borrowed - repaid' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'loan borrowed - emi repaid'
        ) {
          if (
            CategorizationState?.selectedBill?.remainingAmount === 0 ||
            CategorizationState?.selectedBill?.remainingAmount ===
              CategorizationState?.advanceData?.paid
          ) {
            formPayload = CategorizationState?.advanceData
              ? {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                  advance: {
                    document_reference: CategorizationState?.advanceData?.id,
                    amount: CategorizationState?.advanceData?.paid,
                    tds_amount: CategorizationState?.advanceData?.tds,
                  },
                }
              : {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                };
          } else {
            dispatch(
              openSnackbar({
                message:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance
                    ?.length === 0
                    ? 'Amount is not matching with the Allocated amount'
                    : 'Still there are some amount pending to categorize',
                type: 'error',
              })
            );
            return;
          }
        }

        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
          'loan borrowed - taken'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            // amount: Math.abs(Number(CategorizationState?.selectedTransaction?.amount || 0)),
            narration: CategorizationState?.narration,
            advance: {
              document_reference: CategorizationState?.advanceData?.id,
              amount: CategorizationState?.advanceData?.paid,
              tds_amount: CategorizationState?.advanceData?.tds,
            },
          };
        }
      }

      if (
        CategorizationState?.purposeState?.etype?.toLowerCase() === 'employee'
      ) {
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
          'loan given - given'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            amount: Math.abs(
              Number(CategorizationState?.selectedTransaction?.amount || 0)
            ),
            narration: CategorizationState?.narration,
          };
        }
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() === 'advance'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            // amount: Math.abs(Number(CategorizationState?.selectedTransaction?.amount || 0)),
            narration: CategorizationState?.narration,
            advance: {
              document_reference: CategorizationState?.advanceData?.id,
              amount: CategorizationState?.advanceData?.paid,
              tds_amount: CategorizationState?.advanceData?.tds,
            },
          };
        }
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'reimbursement' ||
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'loan given - repaid' ||
          (CategorizationState?.partyState?.name === 'Salary Payable' &&
            CategorizationState?.purposeState?.name?.toLowerCase() === 'salary')
        ) {
          if (
            CategorizationState?.selectedBill?.remainingAmount === 0 ||
            CategorizationState?.selectedBill?.remainingAmount ===
              CategorizationState?.advanceData?.paid
          ) {
            formPayload = CategorizationState?.advanceData
              ? {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                  advance: {
                    document_reference: CategorizationState?.advanceData?.id,
                    amount: CategorizationState?.advanceData?.paid,
                    tds_amount: CategorizationState?.advanceData?.tds,
                  },
                }
              : {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                };
          } else {
            dispatch(
              openSnackbar({
                message:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance
                    ?.length === 0
                    ? 'Amount is not matching with the Allocated amount'
                    : 'Still there are some amount pending to categorize',
                type: 'error',
              })
            );
            return;
          }
        }
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() === 'salary' &&
          CategorizationState?.partyState?.name !== 'Salary Payable'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            amount: Math.abs(
              Number(CategorizationState?.selectedTransaction?.amount || 0)
            ),
            file: CategorizationState?.file?.id,
          };
        }
      }

      if (
        CategorizationState?.purposeState?.etype?.toLowerCase() === 'vendor'
      ) {
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'advance' ||
          CategorizationState?.purposeState?.name?.toLowerCase() === 'deposit'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            // amount: Math.abs(Number(CategorizationState?.selectedTransaction?.amount || 0)),
            narration: CategorizationState?.narration,
            advance: {
              document_reference: CategorizationState?.advanceData?.id,
              amount: CategorizationState?.advanceData?.paid,
              tds_amount: CategorizationState?.advanceData?.tds,
            },
          };
        }
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'against bills' ||
          CategorizationState?.purposeState?.name?.toLowerCase() === 'refund'
        ) {
          if (
            CategorizationState?.selectedBill?.remainingAmount === 0 ||
            CategorizationState?.selectedBill?.remainingAmount ===
              CategorizationState?.advanceData?.paid
          ) {
            formPayload = CategorizationState?.advanceData
              ? {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                  advance: {
                    document_reference: CategorizationState?.advanceData?.id,
                    amount: CategorizationState?.advanceData?.paid,
                    tds_amount: CategorizationState?.advanceData?.tds,
                  },
                }
              : {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                };
          } else {
            dispatch(
              openSnackbar({
                message:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance
                    ?.length === 0
                    ? 'Amount is not matching with the Allocated amount'
                    : 'Still there are some amount pending to categorize',
                type: 'error',
              })
            );
            return;
          }
        }
      }

      if (
        CategorizationState?.purposeState?.etype?.toLowerCase() === 'customer'
      ) {
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() === 'advance'
        ) {
          formPayload = {
            type: transactionType,
            entity_id: CategorizationState?.partyState?.id,
            purpose: CategorizationState?.purposeState?.name,
            bank_txn_id: CategorizationState?.selectedTransaction?.id,
            account_id: CategorizationState?.selectedTowardsAccount?.id,
            // amount: Math.abs(Number(CategorizationState?.selectedTransaction?.amount || 0)),
            narration: CategorizationState?.narration,
            advance: {
              document_reference: CategorizationState?.advanceData?.id,
              amount: CategorizationState?.advanceData?.paid,
              tds_amount: CategorizationState?.advanceData?.tds,
            },
          };
        }
        if (
          CategorizationState?.purposeState?.name?.toLowerCase() ===
            'against bills' ||
          CategorizationState?.purposeState?.name?.toLowerCase() === 'refund'
        ) {
          if (
            CategorizationState?.selectedBill?.remainingAmount === 0 ||
            CategorizationState?.selectedBill?.remainingAmount ===
              CategorizationState?.advanceData?.paid
          ) {
            formPayload = CategorizationState?.advanceData
              ? {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                  advance: {
                    document_reference: CategorizationState?.advanceData?.id,
                    amount: CategorizationState?.advanceData?.paid,
                    tds_amount: CategorizationState?.advanceData?.tds,
                  },
                }
              : {
                  type: transactionType,
                  bank_txn_id: CategorizationState?.selectedTransaction?.id,
                  entity_id: CategorizationState?.partyState?.id,
                  purpose: CategorizationState?.purposeState?.name,
                  account_id: CategorizationState?.selectedTowardsAccount?.id,
                  narration: CategorizationState?.narration,
                  bills:
                    CategorizationState?.selectedBill?.selectedRowsWithBalance.map(
                      (ele) => ({
                        txn_line_id: ele.id,
                        amount: Number(ele?.amount),
                        tds_amount: Number(ele?.tds),
                        original_amount: Number(ele?.originalArray?.amount),
                        pending_amount: Number(ele?.originalArray?.net_balance),
                        taxable_amount: Number(
                          ele?.originalArray?.taxable_amount
                        ),
                        account_id: ele?.originalArray?.account_id,
                        date: ele?.originalArray?.date,
                        document_number: ele?.originalArray?.document_number || ele?.originalArray?.number,
                      })
                    ),
                };
          } else {
            dispatch(
              openSnackbar({
                message:
                  CategorizationState?.selectedBill?.selectedRowsWithBalance
                    ?.length === 0
                    ? 'Amount is not matching with the Allocated amount'
                    : 'Still there are some amount pending to categorize',
                type: 'error',
              })
            );
            return;
          }
        }
      }
      enableLoading(true);
      const url = `organizations/${organization?.orgId}/yodlee_bank_accounts/categorization?`;
      await RestApi(url, {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
        payload: formPayload,
      })
        .then((res) => {
          enableLoading(false);
          if (res && !res.error) {
            if (res.message) {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.INFO,
              });
            }
            setClearstate(true);
            setCategorizationState((prev) => ({
              ...prev,
              partyState: null,
              purposeState: null,
              selectedBill: null,
              selectedTowardsAccount: null,
              selectedTransaction: null,
              file: null,
              narration: null,
              advanceValue: null,
              interestValue: null
            }));
            setCategorizationTablesState([]);
            setRowIndex((prev) => prev + 1);
          } else if (res.error) {
            openSnackBar({
              message:
                (res?.error_response &&
                  Object.values(res?.error_response).join()) ||
                res?.message ||
                "Sorry Something went wrong, We'll look into it!",
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch((e) => {
          enableLoading(false);
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          });
        });
    } else {
      openSnackBar({
        message: 'Please select any one value',
        type: MESSAGE_TYPE.ERROR,
      });
    }
  };

  const updateChangedEntity = () => {
    const url = `/organizations/${organization?.orgId}/entities/${CategorizationState?.partyState?.id}/create_entity_type`;
    const postData = {
      entity_type: CategorizationState?.purposeState?.etype?.toLowerCase(),
    };
    RestApi(url, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
      payload: postData,
    })
      .then((res) => {
        if (res && !res.error) {
          CategorizeNowWithCheck();
        } else if (res?.error) {
          if (
            Object.values(res?.errors).join() ===
            'Entity type has already been taken'
          ) {
            CategorizeNowWithCheck();
          } else {
            openSnackBar({
              message:
                (res?.errors && Object.values(res?.errors).join()) ||
                res?.message ||
                "Sorry Something went wrong, We'll look into it!",
              type: MESSAGE_TYPE.ERROR,
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);
        dispatch(
          openSnackBar({
            message: e.message,
            type: 'error',
          })
        );
      });
  };

  const CategorizeNow = () => {
    if (
      CategorizationState?.partyState?.type?.toLowerCase() !==
      CategorizationState?.purposeState?.etype?.toLowerCase()
    ) {
      updateChangedEntity();
      return;
    }
    CategorizeNowWithCheck();
  };

  useEffect(() => {
    if (state?.row) {
      setSelectedTransactionId(state?.alldata?.data[state?.row]);
    } else if (state?.selecteddata) {
      setSelectedTransactionId(state?.selecteddata);
    }
    setTransactionStatus(state?.status);
    setRowIndex(state?.row);
  }, [state]);

  // useEffect(() => {
  //   if (transactionStatus === 'Add') {
  //     GetTxnDetails(selectedTransactionId?.id);
  //   }
  // }, [transactionStatus]);

  useEffect(() => {
    if (rowIndex >= 0) {
      setSelectedTransactionId(state?.alldata?.data[rowIndex]);
    }
  }, [rowIndex]);

  useEffect(() => {
    if (selectedTransactionId?.id) {
      if (selectedTransactionId?.categorized) {
        GetTxnDetails(selectedTransactionId?.id);
      } else {
        // GetUnsetteledBills();
        GetTxnDetails(selectedTransactionId?.id);
      }
      setClearstate(false);
    }
  }, [selectedTransactionId]);

  return device === 'desktop' ? (
    <CategorizeMainWeb
      state={state}
      selectedTransaction={selectedTransaction}
      rowIndex={rowIndex}
      setRowIndex={setRowIndex}
      CategorizationState={CategorizationState}
      setCategorizationState={setCategorizationState}
      setPayloadData={setPayloadData}
      CategorizeNow={CategorizeNow}
      hideTDS={hideTDS}
      setHideTDS={setHideTDS}
      CategorizationTablesState={CategorizationTablesState}
      setCategorizationTablesState={setCategorizationTablesState}
      tdspercentagestate={tdspercentagestate}
      settdspercentagestate={settdspercentagestate}
      clearState={clearState}
      setClearstate={setClearstate}
      transactionStatus={transactionStatus}
      setTransactionStatus={setTransactionStatus}
      CategorizationSuccessClear={CategorizationSuccessClear}
    />
  ) : (
    <CategorizeMainMobile
      state={state}
      selectedTransaction={selectedTransaction}
      rowIndex={rowIndex}
      setRowIndex={setRowIndex}
      CategorizationState={CategorizationState}
      setCategorizationState={setCategorizationState}
      setPayloadData={setPayloadData}
      CategorizeNow={CategorizeNow}
      hideTDS={hideTDS}
      setHideTDS={setHideTDS}
      CategorizationTablesState={CategorizationTablesState}
      setCategorizationTablesState={setCategorizationTablesState}
      tdspercentagestate={tdspercentagestate}
      settdspercentagestate={settdspercentagestate}
      clearState={clearState}
      setClearstate={setClearstate}
      transactionStatus={transactionStatus}
      setTransactionStatus={setTransactionStatus}
      CategorizationSuccessClear={CategorizationSuccessClear}
    />
  );
};

const CategorizeMainWeb = ({
  state,
  selectedTransaction,
  setRowIndex,
  rowIndex,
  CategorizationState,
  setCategorizationState,
  setPayloadData,
  CategorizeNow,
  setHideTDS,
  hideTDS,
  CategorizationTablesState,
  setCategorizationTablesState,
  tdspercentagestate,
  settdspercentagestate,
  clearState,
  setClearstate,
  transactionStatus,
  setTransactionStatus,
  CategorizationSuccessClear,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <PageTitle
        title="Categorization"
        onClick={() => {
          navigate(-1);
        }}
      />
      <div className={css_main.dashboardBodyContainerDesktop}>
        <div className={css.bankingcategorizationmaindesktop}>
          {/* <p className={css.mainheader}>Categorization</p> */}

          <div className={css.categorizationmaincontent}>
            <div className={css.categorizationiconstart}>
              <IconButton
                onClick={() => {
                  if (rowIndex > 0) {
                    setRowIndex((prev) => prev - 1);
                  } else {
                    setRowIndex(0);
                  }
                  setClearstate(true);
                  setCategorizationState((prev) => ({
                    ...prev,
                    partyState: null,
                    purposeState: null,
                    selectedBill: null,
                    selectedTowardsAccount: null,
                    selectedTransaction: null,
                    file: null,
                    narration: null,
                  }));
                  setCategorizationTablesState([]);
                }}
                disabled = {rowIndex <= 0}
              >
                <ArrowBackIcon disabled = {rowIndex <= 0}/>
              </IconButton>
            </div>
            <Paper elevation={2} className={css.categorizationcentercard}>
              <div style={{ overflowX: 'auto' }}>
                <CategorizationHeaderMain
                  stateData={state}
                  selectedTransaction={selectedTransaction}
                  setCategorizationState={setCategorizationState}
                  setHideTDS={setHideTDS}
                  hideTDS={hideTDS}
                  setCategorizationTablesState={setCategorizationTablesState}
                  tdspercentagestate={tdspercentagestate}
                  settdspercentagestate={settdspercentagestate}
                  CategorizationState={CategorizationState}
                  clearState={clearState}
                  setClearstate={setClearstate}
                  status={transactionStatus}
                />
              </div>

              {CategorizationState?.purposeState?.name === 'Expense' && (
                <div style={{ height: '15%' }}>
                  <div className={css.narrationDataContainerForExpense}>
                    <Box component="div">
                      <span className={css.label}>Narration</span>
                      <div className={css.narrationData}>
                        <div className={css.displayData}>
                          {selectedTransaction?.narration}
                        </div>
                      </div>
                    </Box>
                  </div>
                </div>
              )}

              <div
                className={
                  CategorizationState?.purposeState?.name === 'Expense'
                    ? css.centerwebcategorizationwithexpense
                    : css.centerwebcategorization
                }
              >
                <CategorizationCenterMain
                  stateData={state}
                  CategorizationState={CategorizationState}
                  setPayloadData={setPayloadData}
                  selectedTransaction={selectedTransaction}
                  setHideTDS={setHideTDS}
                  CategorizationTablesState={CategorizationTablesState}
                  tdspercentagestate={tdspercentagestate}
                  setCategorizationState={setCategorizationState}
                  hideTDS={hideTDS}
                  status={transactionStatus}
                  CategorizationSuccessClear={CategorizationSuccessClear}
                  setTransactionStatus={setTransactionStatus}
                />
              </div>

              {CategorizationState?.purposeState?.name !== 'Expense' && (
                <div style={{ height: '15%' }}>
                  <CategorizationFooterMain
                    selectedTransaction={selectedTransaction}
                    status={transactionStatus}
                    CategorizeNow={CategorizeNow}
                    stateData={state}
                    setTransactionStatus={setTransactionStatus}
                    CategorizationState={CategorizationState}
                  />
                </div>
              )}
            </Paper>
            <div className={css.categorizationiconend}>
              <IconButton
                onClick={() => {
                  if (rowIndex >= 0) {
                    setRowIndex((prev) => prev + 1);
                  }
                  setClearstate(true);
                  setCategorizationState((prev) => ({
                    ...prev,
                    partyState: null,
                    purposeState: null,
                    selectedBill: null,
                    selectedTowardsAccount: null,
                    selectedTransaction: null,
                    file: null,
                    narration: null,
                    advanceValue: null,
                    interestValue: null
                  }));
                  setCategorizationTablesState([]);
                }}
                disabled = {(state?.alldata?.data?.length - 1) === rowIndex}
              >
                <ArrowForwardIcon disabled = {(state?.alldata?.data?.length - 1) === rowIndex}/>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CategorizeMainMobile = ({
  state,
  selectedTransaction,
  setRowIndex,
  rowIndex,
  CategorizationState,
  setCategorizationState,
  setPayloadData,
  CategorizeNow,
  setHideTDS,
  hideTDS,
  CategorizationTablesState,
  setCategorizationTablesState,
  tdspercentagestate,
  settdspercentagestate,
  clearState,
  setClearstate,
  transactionStatus,
  setTransactionStatus,
  CategorizationSuccessClear,
}) => {
  const navigate = useNavigate();

  function maskNumber(number) {
    const numberString = String(number);
    const lastEightDigits = numberString.slice(-8);
    const maskedDigits = lastEightDigits.replace(/^(\d{4})/, '****');
    const formattedNumber = `**** ${maskedDigits.slice(-4)}`;
    return formattedNumber;
  }

  console.log('bank mobile', state);
  return (
    <>
      <PageTitle
        title="Categorization"
        onClick={() => {
          navigate(-1);
        }}
        bankingCategorizationData={{
          amount:
            selectedTransaction &&
            customCurrency('INR', 'en-US').format(
              Math.abs(Number(selectedTransaction?.amount))
            ),
          date:
            selectedTransaction &&
            moment(selectedTransaction?.date).format('DD/MM/YYYY'),
          tds: tdspercentagestate,
          bankName: state?.bankDetails?.bankName,
          bankAcc:
            selectedTransaction &&
            maskNumber(state?.bankDetails?.bankAccountNumber),
          narration: selectedTransaction && selectedTransaction?.narration,
          flow:
            selectedTransaction && selectedTransaction?.amount > 0
              ? 'inflow'
              : 'outflow',
          showTds: !hideTDS,
          settdspercentagestate: (val) => settdspercentagestate(val),
          status:transactionStatus
        }}
      />

      <div className={css_main.dashboardBodyContainerhideNavBar}>
        <div className={css.bankingcategorizationmainmobile}>
          <div className={css.categorizationmaincontent}>
            <div>
              <CategorizationHeaderMain
                stateData={state}
                selectedTransaction={selectedTransaction}
                setCategorizationState={setCategorizationState}
                setHideTDS={setHideTDS}
                hideTDS={hideTDS}
                setCategorizationTablesState={setCategorizationTablesState}
                CategorizationState={CategorizationState}
                clearState={clearState}
                settdspercentagestate={settdspercentagestate}
                setClearstate={setClearstate}
                status={transactionStatus}
              />
            </div>

            <div className={css.mobilecategorizationCenterContainer}>
              <CategorizationCenterMain
                stateData={state}
                CategorizationState={CategorizationState}
                setPayloadData={setPayloadData}
                selectedTransaction={selectedTransaction}
                setHideTDS={setHideTDS}
                CategorizationTablesState={CategorizationTablesState}
                setCategorizationState={setCategorizationState}
                tdspercentagestate={tdspercentagestate}
                hideTDS={hideTDS}
                status={transactionStatus}
                CategorizationSuccessClear={CategorizationSuccessClear}
                setTransactionStatus={setTransactionStatus}
              />
            </div>

            <div className={css.mobilecategorizationfooter}>
              <div className={css.categorizationiconstart}>
                <IconButton
                  onClick={() => {
                    if (rowIndex > 0) {
                      setRowIndex((prev) => prev - 1);
                    } else {
                      setRowIndex(0);
                    }
                    setClearstate(true);
                    setCategorizationState((prev) => ({
                      ...prev,
                      partyState: null,
                      purposeState: null,
                      selectedBill: null,
                      selectedTowardsAccount: null,
                      selectedTransaction: null,
                      file: null,
                      narration: null,
                      advanceValue: null,
                      interestValue: null
                    }));
                    setCategorizationTablesState([]);
                  }}
                  disabled = {rowIndex <= 0}
                >
                  <ArrowBackIcon disabled = {rowIndex <= 0}/>
                </IconButton>
              </div>
              <div style={{ width: '90%' }}>
                <CategorizationFooterMain
                  selectedTransaction={selectedTransaction}
                  status={transactionStatus}
                  CategorizeNow={CategorizeNow}
                  stateData={state}
                  setTransactionStatus={setTransactionStatus}
                  CategorizationState={CategorizationState}
                />
              </div>
              <div className={css.categorizationiconend}>
                <IconButton
                  onClick={() => {
                    if (rowIndex >= 0) {
                      setRowIndex((prev) => prev + 1);
                    }
                    setClearstate(true);
                    setCategorizationState((prev) => ({
                      ...prev,
                      partyState: null,
                      purposeState: null,
                      selectedBill: null,
                      selectedTowardsAccount: null,
                      selectedTransaction: null,
                      file: null,
                      narration: null,
                      advanceValue: null,
                      interestValue: null
                    }));
                    setCategorizationTablesState([]);
                  }}
                  disabled = {(state?.alldata?.data?.length - 1) === rowIndex}
                >
                  <ArrowForwardIcon disabled = {(state?.alldata?.data?.length - 1) === rowIndex} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorizeMain;
