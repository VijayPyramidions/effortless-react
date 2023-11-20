/* eslint-disable no-nested-ternary */

import React, { useEffect, useState } from 'react';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import axiosInst from '@action/ApiConfig/AxiosInst';
import moment from 'moment';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetIndividualEntityState,
  ClearSateIndividualEntity,
} from '@action/Store/Reducers/General/GeneralState';
import BankDetailsHeader from './BankDetailsHeader';
import AmountData from './AmountData';
import PartySelection from './PartySelection';
import PurposeSelection from './PurposeSelection';
import TDSField from './TDSField';
import * as css from './CategorizationHeader.scss';

const CategorizationHeaderMain = ({
  stateData,
  selectedTransaction,
  setCategorizationState,
  setHideTDS,
  hideTDS,
  setCategorizationTablesState,
  tdspercentagestate,
  settdspercentagestate,
  clearState,
  status,
  CategorizationState,
}) => {
  const { organization, user, enableLoading, openSnackBar } =
    React.useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  const [contraBanks, setcontraBanks] = useState();
  const dispatch = useDispatch();
  const { individualEntityData } = useSelector((value) => value.General);
  const [partyBottomSheet, setPartyBottomSheet] = useState();
  const [purposeBottomSheet, setPurposeBottomSheet] = useState();
  const [selectedPartyData, setSelectedPartyData] = useState();
  const [selectedTowardsData, setSelectedtowardsData] = useState();

  const fetchdocumentreference = (name) => {
    const url = `/organizations/${organization?.orgId}/yodlee_bank_accounts/advance_voucher_reference`;
    RestApi(url, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          if (res.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.INFO,
            });
          } else if (!res.message) {
            if (name === 'fromBillState') {
              setCategorizationTablesState((prev) => ({
                ...prev,
                advanceTableData: res,
              }));
            } else {
              setCategorizationTablesState({ advanceTableData: res });
            }
          }
        }
      })
      .catch((e) => {
        console.log(e);
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const fetchunsettledBills = (type) => {
    if (type === 'other banks') {
      return;
    }
    let params = {};
    if (type === 'customer') {
      params =
        selectedTowardsData?.name === 'Refund'
          ? {
              customer_id: selectedPartyData.id,
              account_id: stateData?.masterslist?.towards?.data
                ?.filter(
                  (ele) =>
                    ele?.entity_type?.split('_')[0].toLowerCase() === type
                )
                .filter((res) =>
                  res?.purpose?.includes(selectedTowardsData.name)
                )[0]?.id,
              settled: true,
            }
          : {
              customer_id: selectedPartyData.id,
              account_id: stateData?.masterslist?.towards?.data
                ?.filter(
                  (ele) =>
                    ele?.entity_type?.split('_')[0].toLowerCase() === type
                )
                .filter((res) =>
                  res?.purpose?.includes(selectedTowardsData.name)
                )[0]?.id,
            };
      // if (selectedTowardsData?.toUpperCase() === "REFUND") {
      //   params.refund = true;
      //   params.settled = true;
      // }
    } else if (type !== 'customer') {
      if (type === 'government') {
        params = selectedTowardsData?.name?.toLowerCase() !== 'payment of gst' ? {
          government_entity: true,
          account_id:
            selectedTowardsData?.name !== 'Refund'
              ? stateData?.masterslist?.towards?.data
                  ?.filter(
                    (ele) =>
                      ele?.entity_type?.split('_')[0].toLowerCase() ===
                      'government'
                  )
                  .filter((res) =>
                    res?.purpose?.includes(selectedTowardsData.name)
                  )[0]?.id
              : selectedTowardsData?.id,
        } : {
          government_entity: true,
          account_id:
            selectedTowardsData?.name !== 'Refund'
              ? stateData?.masterslist?.towards?.data
                  ?.filter(
                    (ele) =>
                      ele?.entity_type?.split('_')[0].toLowerCase() ===
                      'government'
                  )
                  .filter((res) =>
                    res?.purpose?.includes(selectedTowardsData.name)
                  )[0]?.id
              : selectedTowardsData?.id,
          gstin_id : selectedTowardsData?.gstin
        };
      } else {
        params =
          selectedTowardsData?.name === 'Refund'
            ? {
                vendor_id: selectedPartyData.id,
                account_id: stateData?.masterslist?.towards?.data
                  ?.filter(
                    (ele) =>
                      ele?.entity_type?.split('_')[0].toLowerCase() === type
                  )
                  .filter((res) =>
                    res?.purpose?.includes(selectedTowardsData.name)
                  )[0]?.id,
                settled: true,
              }
            : {
                vendor_id:
                  selectedPartyData?.id === 'Salary Payable'
                    ? ''
                    : selectedPartyData.id,
                account_id:
                  stateData?.masterslist?.towards?.data
                    ?.filter(
                      (ele) =>
                        ele?.entity_type?.split('_')[0].toLowerCase() === type
                    )
                    .filter((res) =>
                      res?.purpose?.includes(selectedTowardsData.name)
                    )[0]?.id ||
                  stateData?.masterslist?.towards?.data
                    ?.filter(
                      (ele) =>
                        ele?.entity_type?.split('_')[0].toLowerCase() === type
                    )
                    .filter((res) => res?.name === 'Salary Payable')[0]?.id,
                order_by:
                  selectedPartyData?.id === 'Salary Payable' ? 'date' : '',
                order: selectedPartyData?.id === 'Salary Payable' ? 'asc' : '',
              };
      }
      // if (selectedTowardsData?.toUpperCase() === "REFUND") {
      //   params.refund = true;
      //   params.settled = true;
      // };
    }
    const tquery = Object.keys(params)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    const query = `?${tquery}`;
    let url = '';
    if (type === 'customer') {
      url = `organizations/${organization?.orgId}/customer_unsettled${query}`;
    } else {
      url = `organizations/${organization?.orgId}/vendor_unsettled${query}`;
    }

    enableLoading(true);
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
            setCategorizationTablesState({ tableData: res?.data });
            fetchdocumentreference('fromBillState');
            //   setSelectedTransaction(res);
            //   setCategorizationState((prev) => ({ ...prev, selectedTransaction: res }));
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

  const fetchTransactions = (data,transactionDetails) => {
    enableLoading(true);
    axiosInst
      .get(
        data.provider === 'yodlee' 
        ? `organizations/${organization?.orgId}/yodlee_bank_accounts/${data?.providerId}/txns?from_date=${moment(transactionDetails?.date).format('YYYY-MM-DD')}&to_date=${moment(transactionDetails?.date).format('YYYY-MM-DD')}&page=1`
        : `organizations/${organization?.orgId}/icici_bank_accounts/${data?.providerId}/txns?from_date=${moment(transactionDetails?.date).format('YYYY-MM-DD')}&to_date=${moment(transactionDetails?.date).format('YYYY-MM-DD')}&page=1`
      )
      .then((res) => {
        // setBankAccDetails(res?.data?.data?.filter(ele => ele?.id === id)[0]);
        setCategorizationTablesState({ tableData: res?.data?.data });
        enableLoading(false);
      })
      .catch((e) => {
        console.log(`Categorization fetch transaction error : ${e}`);
        enableLoading(false);
      });
  };

  const getContraBanks = () => {
    enableLoading(true);
    const url = `organizations/${organization.orgId}/yodlee_bank_accounts/bank_listing`;
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
            const cdata = res.data.filter(
              (ele) => ele?.bank_account_type === 'company'
            );
            setcontraBanks(cdata);
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

  useEffect(() => {
    getContraBanks();
  }, []);

  useEffect(() => {
    if (selectedTransaction?.entity_id && selectedTransaction?.entity_type) {
      dispatch(
        GetIndividualEntityState({
          entityId: selectedTransaction?.entity_id,
          entityType: selectedTransaction?.entity_type?.split('_')?.[0],
        })
      );
    }
    if (selectedTransaction?.purpose) {
      const selectedTransactionId =
        selectedTransaction?.purpose.toLowerCase() === 'other banks'
          ? contraBanks?.filter(
              (ele) => ele.account_name === selectedTransaction?.purpose
            )[0]?.bank_account_id || ''
          : selectedTowardsData ? stateData?.masterslist?.towards?.data
              ?.filter(
                (ele) =>
                  ele?.entity_type?.split('_')[0].toLowerCase() ===
                  selectedTowardsData?.etype?.toLowerCase()
              )
              .filter((res) =>
                res?.purpose?.includes(selectedTransaction?.name)
              )[0] || '' : stateData?.masterslist?.towards?.data
              ?.filter(
                (ele) =>
                  ele?.entity_type?.split('_')[0].toLowerCase() ===
                  selectedTransaction?.entity_type?.toLowerCase()
              )
              .filter((res) =>
                {if(res?.entity_type?.split('_')[0].toLowerCase() === 'government' && selectedTransaction?.entity_type?.toLowerCase() === 'government') {
                  if(res?.id === selectedTransaction?.account_id)
                  return res;
                }
                return res?.purpose?.includes(selectedTransaction.purpose);}
              )?.filter(resp => resp?.id === selectedTransaction?.account_id)[0] || stateData?.masterslist?.towards?.data
              ?.filter(
                (ele) =>
                  ele?.entity_type?.split('_')[0].toLowerCase() ===
                  selectedTransaction?.entity_type?.toLowerCase()
              )
              .filter((res) =>
                {if(res?.entity_type?.split('_')[0].toLowerCase() === 'government' && selectedTransaction?.entity_type?.toLowerCase() === 'government') {
                  if(res?.id === selectedTransaction?.account_id)
                  return res;
                }
                return res?.purpose?.includes(selectedTransaction.purpose);}
              )[0] || '';
      setSelectedtowardsData({
        name: selectedTransaction?.purpose,
        id: selectedTransactionId?.id,
        // id: '',
        type: 'Purpose',
        etype: selectedTransaction?.entity_type,
        otype: selectedTransaction?.entity_type,
        gstin: selectedTransaction?.gstin_id,
      });
    }
  }, [selectedTransaction]);

  useEffect(() => {
    if (Object.keys(individualEntityData || {})?.length > 0) {
      setSelectedPartyData({
        name: individualEntityData?.name,
        id: individualEntityData?.id,
        taxpercentage: individualEntityData?.tax_percentage,
        type:
          CategorizationState?.purposeState?.etype?.toLowerCase() ||
          selectedTransaction?.entity_type?.split('_')?.[0],
      });
      setTimeout(() => {
        dispatch(ClearSateIndividualEntity());
      }, 2000);
    }
  }, [JSON.stringify(individualEntityData)]);

  useEffect(() => {
    setCategorizationState((prev) => ({
      ...prev,
      purposeState: selectedTowardsData,
    }));
    if (
      selectedPartyData?.id &&
      Object.keys(selectedTowardsData || {})?.length > 0
    ) {
      setCategorizationState((prev) => ({
        ...prev,
        selectedTowardsAccount:
          stateData?.masterslist?.towards?.data
            ?.filter(
              (ele) =>
                ele?.entity_type?.split('_')[0].toLowerCase() ===
                selectedTowardsData?.etype?.toLowerCase()
            )
            .filter((res) =>
              res?.purpose?.includes(selectedTowardsData.name)
            ).filter(resp => resp.id === selectedTowardsData?.id)[0] || stateData?.masterslist?.towards?.data
            ?.filter(
              (ele) =>
                ele?.entity_type?.split('_')[0].toLowerCase() ===
                selectedTowardsData?.etype?.toLowerCase()
            )
            .filter((res) =>
              res?.purpose?.includes(selectedTowardsData.name)
            )[0]||
          stateData?.masterslist?.towards?.data
            ?.filter(
              (ele) =>
                ele?.entity_type?.split('_')[0].toLowerCase() ===
                selectedPartyData?.type?.toLowerCase()
            )
            .filter((res) => res?.name === 'Salary Payable')[0],
      }));
      fetchunsettledBills(selectedTowardsData?.etype?.toLowerCase());
    } 
    if(selectedPartyData?.type?.toLowerCase() === 'other banks' &&
      Object.keys(selectedTowardsData || {})?.length > 0 && selectedTowardsData?.name?.toLowerCase() === 'contra entry') {
        fetchTransactions(selectedTowardsData,selectedTransaction);
      }
    if (
      selectedTowardsData?.name === 'Advance' ||
      selectedTowardsData?.name === 'Deposit' ||
      selectedTowardsData?.name === 'Loan Given - Given' ||
      selectedTowardsData?.name === 'Capital' ||
      selectedTowardsData?.name === 'Loan Borrowed - Taken'
    ) {
      fetchdocumentreference();
    }
    if (
      selectedPartyData?.type?.toLowerCase() === 'employee' ||
      selectedTowardsData?.name === 'Loan Given - Given' ||
      selectedTowardsData?.name === 'Director Remuneration' ||
      (selectedTowardsData?.name === 'Against Bills' &&
        selectedPartyData?.type?.toLowerCase() === 'vendor') ||
      (selectedTowardsData?.name === 'Expense' &&
        selectedPartyData?.type?.toLowerCase() === 'vendor') ||
      selectedPartyData?.type?.toUpperCase() === 'OTHER BANKS' ||
      selectedPartyData?.type?.toLowerCase() === 'government' ||
      selectedTowardsData?.name === 'Reimbursement' ||
      selectedTowardsData?.name === 'Refund' ||
      selectedTowardsData?.name === 'Capital' ||
      selectedTowardsData?.name === 'Loan Taken - Taken' ||
      selectedTowardsData?.name === 'Loan Taken - Repaid' ||
      selectedTowardsData?.name === 'Loan Given - Repaid' ||
      selectedTowardsData?.name === 'Loan Borrowed - Taken' ||
      selectedTowardsData?.name === 'Loan Borrowed - Repaid' ||
      selectedTowardsData?.name === 'Loan Borrowed - EMI Taken' ||
      (selectedTowardsData?.name === 'Advance' &&
        selectedPartyData?.type?.toLowerCase() === 'employee') ||
      ((selectedTowardsData?.name === 'Salary Payable' ||
        selectedTowardsData?.name === 'Salary') &&
        selectedPartyData?.type?.toLowerCase() === 'employee') ||
      selectedPartyData?.type?.toLowerCase() === 'promoter'
    ) {
      setHideTDS(true);
      settdspercentagestate(0);
    } else {
      setHideTDS(false);
      settdspercentagestate(0);
    }
  }, [selectedPartyData, selectedTowardsData]);

  useEffect(() => {
    setCategorizationState((prev) => ({
      ...prev,
      partyState: selectedPartyData,
      advanceData: null,
      selectedBill: null,
      narration:null,
      advanceValue: null,
      interestValue: null,
    }));
    if (
      selectedPartyData?.id === 'OTHER BANKS' ||
      selectedPartyData?.type?.toLowerCase() === 'government'
    )
      setHideTDS(true);
    if (selectedPartyData?.name === 'Salary Payable') {
      setSelectedtowardsData({
        name: 'Salary',
        // id: selectedTransactionId?.id,
        id: '',
        type: 'Purpose',
        etype: 'employee',
        otype: 'employee',
      });
    }
    if (selectedPartyData?.name === 'Do Not Track Vendor') {
      setSelectedtowardsData({
        name: 'Expense',
        // id: selectedTransactionId?.id,
        id: '',
        type: 'Purpose',
        etype: 'vendor',
        otype: 'vendor',
      });
    }
  }, [selectedPartyData]);

  useEffect(() => {
    if (
      !selectedTransaction?.entity_id &&
      (!selectedTransaction?.entity_type ||
        selectedTransaction?.entity_type === 'other_banks') &&
      selectedTransaction?.categorized && contraBanks &&
      selectedTransaction?.categorized_lines?.length > 0
    ) {
      // setCategorizationState((prev) => ({ ...prev, purposeState: {etype: "OTHER BANKS",id: "",name: selectedTransaction?.name,otype: "OTHER BANKS",type: "Purpose"}, partyState: {id: "OTHER BANKS",name: "N/A",taxpercentage: undefined,type: "OTHER BANKS"} }));
      if (selectedTransaction?.purpose?.toLowerCase() === 'contra entry') {
        setSelectedPartyData({
          id: selectedTransaction?.account_id,
          name: contraBanks?.filter(
            (ele) => ele.bank_account_id === selectedTransaction?.account_id
          )[0]?.display_name,
          taxpercentage: undefined,
          type: 'OTHER BANKS',
          provider: contraBanks?.filter(
            (ele) => ele.bank_account_id === selectedTransaction?.account_id
          )[0]?.service_provider,
          providerId: contraBanks?.filter(
            (ele) => ele.bank_account_id === selectedTransaction?.account_id
          )[0]?.service_provider === 'yodlee' ? contraBanks?.filter(
            (ele) => ele.bank_account_id === selectedTransaction?.account_id
          )[0]?.id : contraBanks?.filter(
            (ele) => ele.bank_account_id === selectedTransaction?.account_id
          )[0]?.bank_account_id,
        });
      } else {
        setSelectedPartyData({
          id: selectedTransaction?.account_id,
          name: contraBanks?.filter(
            (ele) => ele.bank_account_id === stateData?.bankDetails?.bankId
          )[0]?.display_name,
          taxpercentage: undefined,
          type: 'OTHER BANKS',
        });
      }

      setSelectedtowardsData({
        etype: 'OTHER BANKS',
        id: selectedTransaction?.account_id,
        name: selectedTransaction?.purpose,
        otype: 'OTHER BANKS',
        type: 'Purpose',
        provider: contraBanks?.filter(
          (ele) => ele.bank_account_id === selectedTransaction?.account_id
        )[0]?.service_provider,
        providerId: contraBanks?.filter(
          (ele) => ele.bank_account_id === selectedTransaction?.account_id
        )[0]?.service_provider === 'yodlee' ? contraBanks?.filter(
          (ele) => ele.bank_account_id === selectedTransaction?.account_id
        )[0]?.id : contraBanks?.filter(
          (ele) => ele.bank_account_id === selectedTransaction?.account_id
        )[0]?.bank_account_id,
      });
      setHideTDS(true);
    } else if (
      !selectedTransaction?.entity_id &&
      selectedTransaction?.entity_type === 'employee' &&
      selectedTransaction?.purpose === 'Salary' &&
      selectedTransaction?.categorized
    ) {
      setSelectedPartyData({
        id: 'Salary Payable',
        name: 'Salary Payable',
        taxpercentage: undefined,
        type: 'employee',
      });
    } else if (
      !selectedTransaction?.entity_id &&
      (selectedTransaction?.entity_type === 'vendor' || !selectedTransaction?.entity_type) &&
      (selectedTransaction?.purpose === 'Expense'  || !selectedTransaction?.purpose) &&
      selectedTransaction?.categorized &&
      selectedTransaction?.vendor_bill_id
    ) {
      setSelectedPartyData({
        id: '',
        name: 'Do Not Track Vendor',
        taxpercentage: undefined,
        type: 'vendor',
      });
    }
    // else if(!selectedTransaction?.entityId && selectedTransaction?.entityType?.split("_")[0] === 'government' && selectedTransaction?.categorized){
    //   setSelectedPartyData({ id: selectedTransaction?.account_id,name:stateData?.masterslist?.towards?.data?.filter(ele => ele?.entity_type?.split("_")[0].toLowerCase() === selectedPartyData?.type?.toLowerCase()).filter(res => res?.purpose?.includes(selectedTowardsData.name))[0]?.purpose[0], type: "government" });
    //   // setSelectedtowardsData({ etype: "OTHER BANKS", id: contraBanks?.filter(ele => ele.account_name === selectedTransaction?.purpose)[0]?.bank_account_id || '', name: selectedTransaction?.purpose, otype: "OTHER BANKS", type: "Purpose" });
    //   setHideTDS(true);
    // }
  }, [selectedTransaction,contraBanks]);

  useEffect(() => {
    if (clearState) {
      setSelectedPartyData({});
      setSelectedtowardsData({});
      setCategorizationTablesState([]);
    }
  }, [clearState]);

  return (
    <>
      {device === 'desktop' ? (
        <div className={css.mainContainerDesktop}>
          <BankDetailsHeader data={stateData?.bankDetails} />
          <AmountData
            transactionType={
              selectedTransaction?.amount > 0 ? 'outflow' : 'inflow'
            }
            amount={selectedTransaction?.amount}
          />
          <PartySelection
            partyBottomSheet={partyBottomSheet}
            setPartyBottomSheet={setPartyBottomSheet}
            setSelectedPartyData={(val) => {
              setSelectedPartyData(val);
              setSelectedtowardsData({});
            }}
            selectedPartyData={selectedPartyData}
            transactionType={
              selectedTransaction?.amount > 0 ? 'Receipt' : 'Payment'
            }
            stateData={stateData}
            contraBanks={contraBanks}
            status={status}
            setCategorizationTablesState={setCategorizationTablesState}
          />
          <PurposeSelection
            purposeBottomSheet={purposeBottomSheet}
            setPurposeBottomSheet={setPurposeBottomSheet}
            selectedPartyData={selectedPartyData}
            purposeDetails={stateData?.masterslist?.towards}
            transactionType={
              selectedTransaction?.amount > 0 ? 'Receipt' : 'Payment'
            }
            setSelectedtowardsData={setSelectedtowardsData}
            selectedTowardsData={selectedTowardsData}
            stateData={stateData}
            contraBanks={contraBanks}
            status={status}
          />
          {!hideTDS && (
            <TDSField
              tdspercentagestate={tdspercentagestate}
              settdspercentagestate={settdspercentagestate}
              status={status}
            />
          )}
        </div>
      ) : (
        <div className={css.mainContainerMobile}>
          {/* <BankDetailsHeader data={stateData?.bankDetails} /> */}
          {/* <AmountData transactionType={selectedTransaction?.amount > 0 ? 'outflow' : 'inflow'} amount={selectedTransaction?.amount} /> */}
          <PartySelection
            partyBottomSheet={partyBottomSheet}
            setPartyBottomSheet={setPartyBottomSheet}
            setSelectedPartyData={(val) => {
              setSelectedPartyData(val);
              setSelectedtowardsData({});
            }}
            selectedPartyData={selectedPartyData}
            transactionType={
              selectedTransaction?.amount > 0 ? 'Receipt' : 'Payment'
            }
            stateData={stateData}
            contraBanks={contraBanks}
            status={status}
            setCategorizationTablesState={setCategorizationTablesState}
          />
          <PurposeSelection
            purposeBottomSheet={purposeBottomSheet}
            setPurposeBottomSheet={setPurposeBottomSheet}
            selectedPartyData={selectedPartyData}
            purposeDetails={stateData?.masterslist?.towards}
            transactionType={
              selectedTransaction?.amount > 0 ? 'Receipt' : 'Payment'
            }
            setSelectedtowardsData={setSelectedtowardsData}
            selectedTowardsData={selectedTowardsData}
            stateData={stateData}
            contraBanks={contraBanks}
            status={status}
          />
          {/* <TDSField /> */}
        </div>
      )}
    </>
  );
};

export default CategorizationHeaderMain;
