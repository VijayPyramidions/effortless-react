import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import AppContext from '@root/AppContext.jsx';
import axiosInst from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import UploadYourBillContainer from '@core/BillBookView/UploadYourBillContainer.jsx';
import BillStatementCategorization from './BillStatementCategorization';
import AdvanceGivenCategorization from './AdvanceGivenCategorization';
import StatutoryDuesCategorization from './StatutoryDuesCategorization';
import RefundCategorization from './RefundCategorization';
import AdvanceTaxCategorization from './AdavanceTaxCategorization';
import OtherBankCategorization from './OtherBankCategorization';
import EMISchdeuleCategorization from './EMISchdeuleCategorization';
import SalaryAndWagesCategorization from './SalaryAndWagesCategorization';

const CategorizationCenterMain = ({
  stateData,
  CategorizationState,
  setPayloadData,
  selectedTransaction,
  setHideTDS,
  CategorizationTablesState,
  tdspercentagestate,
  setCategorizationState,
  hideTDS,
  status,
  CategorizationSuccessClear,
  setTransactionStatus,
}) => {
  const { organization } = useContext(AppContext);
  const dispatch = useDispatch();
  const [CategorizationShow, setCategorizationShow] = useState('');
  const [ExpenseState, setExpenseState] = useState({});

  const CategorizationBillView = (id) => {
    // if (!userRoles?.['Bill Booking']?.edit_bills) {
    //   setHavePermission({
    //     open: true,
    //     back: () => {
    //       setHavePermission({ open: false });
    //     },
    //   });
    //   return;
    // }
    dispatch(enableLoading(true));
    axiosInst
      .patch(`organizations/${organization.orgId}/vendor_bills/${id}`)
      .then((res) => {
        dispatch(enableLoading(false));
        if (res?.data?.error) {
          dispatch(
            openSnackbar({
              message: res?.message || 'Unknown error occured',
              type: MESSAGE_TYPE.ERROR,
            })
          );
        } else {
          setExpenseState(res?.data);
          setCategorizationShow('Expenses');
        }
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

  useEffect(() => {
    if (
      !selectedTransaction?.entityId &&
      !selectedTransaction?.entityType &&
      selectedTransaction?.categorized &&
      selectedTransaction?.categorized_lines?.length > 0
    ) {
      // setCategorizationState((prev) => ({ ...prev, purposeState: {etype: "OTHER BANKS",id: "",name: selectedTransaction?.name,otype: "OTHER BANKS",type: "Purpose"}, partyState: {id: "OTHER BANKS",name: "N/A",taxpercentage: undefined,type: "OTHER BANKS"} }));
      setCategorizationShow('Bank list');
      setHideTDS(true);
    }
  }, [selectedTransaction]);

  console.log('CategorizationState', CategorizationState, setPayloadData);

  useEffect(() => {
    if (
      CategorizationState?.purposeState?.name === 'Refund' &&
      CategorizationState?.partyState?.name === 'Income Tax (IT)'
    ) {
      setCategorizationShow('Tax Refund');
    } else if (
      CategorizationState?.purposeState?.name === 'Against Bills' ||
      CategorizationState?.purposeState?.name === 'Refund' ||
      CategorizationState?.purposeState?.name === 'Loan Taken - Repaid' ||
      CategorizationState?.purposeState?.name === 'Loan Given - Repaid' ||
      CategorizationState?.purposeState?.name === 'Reimbursement' ||
      CategorizationState?.purposeState?.name === 'Loan Borrowed - Repaid' ||
      CategorizationState?.purposeState?.name === 'Loan Borrowed - EMI Repaid'
    ) {
      setCategorizationShow('Bill Settlement');
    } else if (
      CategorizationState?.purposeState?.name === 'Advance' ||
      CategorizationState?.purposeState?.name === 'Deposit' ||
      CategorizationState?.purposeState?.name === 'Drawing' ||
      CategorizationState?.purposeState?.name === 'Capital' ||
      CategorizationState?.purposeState?.name === 'Loan Taken - Taken' ||
      CategorizationState?.purposeState?.name === 'Loan Given - Given' ||
      CategorizationState?.purposeState?.name === 'Loan Borrowed - Taken'
    ) {
      setCategorizationShow('Advance');
    } else if (
      CategorizationState?.purposeState?.name === 'Payment of Taxes' ||
      CategorizationState?.purposeState?.name === 'Payment of EPF' ||
      CategorizationState?.purposeState?.name === 'Payment of ESI' ||
      CategorizationState?.purposeState?.name === 'Payment of GST' ||
      CategorizationState?.purposeState?.name === 'Payment of TDS' ||
      CategorizationState?.purposeState?.name === 'Payment of PT' ||
      CategorizationState?.purposeState?.name === 'Payment of Income Tax' ||
      CategorizationState?.purposeState?.name === 'Statutory dues' ||
      (CategorizationState?.purposeState?.name === 'Salary' &&
        CategorizationState?.partyState?.name === 'Salary Payable')
    ) {
      setCategorizationShow('Tax paid Screen');
    } else if (CategorizationState?.purposeState?.name === 'Advance Tax') {
      setCategorizationShow('Advance tax');
    } else if (CategorizationState?.purposeState?.name === 'Expense') {
      if (
        selectedTransaction?.categorized &&
        selectedTransaction?.vendor_bill_id
      ) {
        CategorizationBillView(selectedTransaction?.vendor_bill_id);
      } else {
        setCategorizationShow('Expenses');
      }
    } else if (
      CategorizationState?.purposeState?.name === 'Salary' ||
      CategorizationState?.purposeState?.name === 'Director Remuneration'
    ) {
      setCategorizationShow('Salary');
    } else if (
      CategorizationState?.purposeState?.name === 'EMI Schedule Upload' ||
      CategorizationState?.purposeState?.name === 'Loan Borrowed - EMI Taken'
    ) {
      setCategorizationShow('EMI Schedule');
    } else if (CategorizationState?.purposeState?.otype?.toLowerCase() === 'other banks') {
      setCategorizationShow('Bank list');
    } else {
      setCategorizationShow('');
    }
  }, [CategorizationState?.purposeState]);
  return (
    <div style={{ height: '100%' }}>
      {CategorizationShow === 'Bill Settlement' && (
        <BillStatementCategorization
          stateData={stateData}
          CategorizationBillStatementState={
            CategorizationTablesState?.tableData
          }
          CategorizationAdvanceTableDataState={
            CategorizationTablesState?.advanceTableData
          }
          tdspercentagestate={tdspercentagestate}
          hideTDS={hideTDS}
          setCategorizationState={setCategorizationState}
          CategorizationViewTableDataState={selectedTransaction?.categorized}
          selectedTransaction={selectedTransaction}
          CategorizationState={CategorizationState}
          status={status}
        />
      )}
      {CategorizationShow === 'Advance' && (
        <AdvanceGivenCategorization
          stateData={stateData}
          CategorizationAdvanceTableDataState={
            CategorizationTablesState?.advanceTableData
          }
          hideTDS={hideTDS}
          setCategorizationState={setCategorizationState}
          tdspercentagestate={tdspercentagestate}
          CategorizationViewTableDataState={selectedTransaction?.categorized}
          selectedTransaction={selectedTransaction}
          status={status}
          CategorizationState={CategorizationState}
        />
      )}
      {CategorizationShow === 'Tax paid Screen' && (
        <StatutoryDuesCategorization
          stateData={stateData}
          CategorizationStatutoryDuesState={
            CategorizationTablesState?.tableData
          }
          setCategorizationState={setCategorizationState}
          CategorizationViewTableDataState={selectedTransaction?.categorized}
          selectedTransaction={selectedTransaction}
          CategorizationState={CategorizationState}
          status={status}
        />
      )}
      {CategorizationShow === 'Tax Refund' && <RefundCategorization />}
      {CategorizationShow === 'Advance tax' && (
        <AdvanceTaxCategorization
          stateData={stateData}
          CategorizationAdvanceTaxTableDataState={CategorizationTablesState?.tableData}
          setCategorizationState={setCategorizationState}
          selectedTransaction={selectedTransaction}
        />
      )}
      {CategorizationShow === 'EMI Schedule' && (
        <EMISchdeuleCategorization
          setCategorizationState={setCategorizationState}
          status={status}
        />
      )}
      {CategorizationShow === 'Expenses' && (
        <UploadYourBillContainer
          heading="no"
          billUploadFrom="bankCategorization"
          categorizationvendordetails={CategorizationState?.partyState}
          purposeState={CategorizationState?.purposeState}
          categ="categorization"
          bankAccountDetails={stateData}
          status={status}
          selectedTransactionUploadBill={selectedTransaction}
          ExpenseDone={(val) => {
            if (val?.response?.status === 'accounted'|| val?.params?.status === 'accounted') {
              CategorizationSuccessClear('add');
            }
          }}
          CategorizationSelected={ExpenseState}
          setTransactionStatus={setTransactionStatus}
        />
      )}
      {CategorizationShow === 'Salary' && (
        <SalaryAndWagesCategorization
          setCategorizationState={setCategorizationState}
          status={status}
        />
      )}
      {CategorizationShow === 'Bank list' && (
        <OtherBankCategorization
          setPayloadData={setPayloadData}
          categorizedNarration={
            selectedTransaction?.categorized
              ? selectedTransaction?.categorization_narration
              : ''
          }
          stateData={stateData}
          CategorizationOtherBankState={
            CategorizationTablesState?.tableData
          }
          setCategorizationState={setCategorizationState}
          CategorizationViewTableDataState={selectedTransaction?.categorized}
          selectedTransaction={selectedTransaction}
          CategorizationState={CategorizationState}
          status={status}
        />
      )}
    </div>
  );
};

export default CategorizationCenterMain;
