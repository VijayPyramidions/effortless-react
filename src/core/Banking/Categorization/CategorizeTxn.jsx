import React, { useContext } from 'react';
import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInst from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

const CategorizeTxn = () => {
  const { organization } = useContext(AppContext);
  const PageNavigateData = JSON.parse(localStorage.getItem('PageWithParams'));
  let txnDetails;
  let bankAccDetails;
  let bankTxn;
  // const [txnDetails,setTxnDetails] = useState();
  // const [bankAccDetails,setBankAccDetails] = useState();
  const derivedMasters = {
    incomecategories: { data: [] },
    expensecategories: { data: [] },
    towards: { inflow: {}, outflow: {}, data: [] },
    type: [
      { name: 'Receipt', id: 'receipt_from_party' },
      { name: 'Payment', id: 'payment_to_party' },
    ],
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryParamBankTxnId = new URLSearchParams(window.location.search).get('id') || PageNavigateData?.id;
  const queryParamBankId = new URLSearchParams(window.location.search).get('bank_account_id') || PageNavigateData?.bank_account_id;

  const CategTransactionSelect = () => {
    // if (acctbtnVal === intialAccButton.virtual) return;

    // if (
    //   !userPermissions?.Banking?.['Categorizing Transactions']
    //     ?.view_categorization
    // ) {
    //   setHavePermission({
    //     open: true,
    //     back: () => {
    //       setHavePermission({ open: false });
    //     },
    //   });
    //   return;
    // }

    const alldata = { data: [] };
    let counter = 0;
    let rowfound = 0;

    const datanew = bankTxn.map((data) => {
      const temp = { ...data, index: counter };
      counter += 1;
      return temp;
    });

    const tr = datanew.filter((item) => item.id === txnDetails.id);

    alldata.data = datanew.filter(
      (data) => data?.txn_category?.toLowerCase() === 'business'
    );

    if (bankTxn && bankTxn.length > 0) {
      const ndataten = bankTxn.filter(
        (data) => data?.txn_category?.toLowerCase() === 'business'
      );

      ndataten.forEach((banktransaction, index) => {
        if (banktransaction.id === txnDetails.id) {
          rowfound = index;
        }
      });
    }

    localStorage.setItem('pagestart', rowfound);
    localStorage.setItem('itemstatus', txnDetails.categorized ? 'Edit' : 'Add');

    navigate('/banking-categorization', {
      state: {
        status: !txnDetails.categorized ? 'Add' : 'Edit', // selected transaction already categorized ? "Edit" : "Add"
        bankaccountid: bankAccDetails.bank_account_id, // Bank Account ID
        selectedtype: 'others', //
        row: rowfound, //
        alldata, // All Business Category Transactions
        bankDetails: {
          bankName:
            bankAccDetails?.sub_account_group === 'Cash Accounts'
              ? 'Cash Account'
              : bankAccDetails.bank_name,
          bankId: bankAccDetails.bank_account_id,
          bankAccountNumber:
            bankAccDetails?.sub_account_group === 'Cash Accounts'
              ? bankAccDetails?.display_name
              : bankAccDetails.bank_account_number,
        },

        // bankname: bankAccDetails.bank_name, // Bank Name
        // bankaccount: bankAccDetails.bank_account_number, // Bank Account  Number
        // bankid: bankAccDetails.bank_account_id, // Bank Account ID
        selecteddata: tr[0], // Selected Transaction Details
        masterslist: derivedMasters,
        from: 'categorize-txn',
      },
    });
  };

  const fetchTowardsDetails = () => {
    enableLoading(true);
    const urls = `organizations/${organization?.orgId}/accounts/categorization_account_list`;
    axiosInst
      .get(urls)
      .then((res) => {
        derivedMasters.towards.data = res.data.data;
        derivedMasters.towards.data.push({
          id: 'expense',
          name: 'Expenses',
          inflow_description: 'Expense',
          outflow_description: 'Expense',
        });
        derivedMasters.towards.data.push({
          id: 'income',
          name: 'Income',
          inflow_description: 'Income',
          outflow_description: 'Income',
        });
        const newlist1 = {};
        const newlist2 = {};
        res.data.data.forEach((toward) => {
          newlist1[toward.inflow_description] = toward;
          newlist2[toward.outflow_description] = toward;
        });
        derivedMasters.towards.inflow = newlist1;
        derivedMasters.towards.outflow = newlist2;
        CategTransactionSelect();
        enableLoading(false);
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          })
        );
      });
  };

  const fetchBankTxnDetails = (data) => {
    axiosInst
      .get(
        data.provider === 'yodlee' 
        ? `organizations/${organization?.orgId}/yodlee_bank_accounts/${data?.id}/txns`
        : `organizations/${organization?.orgId}/icici_bank_accounts/${data?.bank_account_id}/txns`
      )
      .then((res) => {
        // setBankAccDetails(res?.data?.data?.filter(ele => ele?.id === id)[0]);
        bankTxn = res?.data?.data;
        fetchTowardsDetails();
        enableLoading(false);
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          })
        );
      });
  };

  const fetchBankDetails = (id) => {
    axiosInst
      .get(
        `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing`
      )
      .then((res) => {
        console.log(id);
        // setBankAccDetails(res?.data?.data?.filter(ele => ele?.id === id)[0]);
        bankAccDetails = res?.data?.data?.filter(
          (ele) => ele?.bank_account_id === id
        )[0];
        if (queryParamBankTxnId) {
          fetchBankTxnDetails(bankAccDetails);
        } else {
          navigate('/banking-statement', {
            state: {
              accDetails: bankAccDetails,
              fillclass:'Uncategorized',
              fill: 'Uncategorized'
            },
          });
        }

        enableLoading(false);
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          })
        );
      });
  };

  const fetchTxn = (id) => {
    axiosInst
      .get(`organizations/${organization?.orgId}/bank_txns/${id}`)
      .then((res) => {
        // setTxnDetails(res.data);
        txnDetails = res?.data;
        fetchBankDetails(queryParamBankId);
        enableLoading(false);
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          })
        );
      });
  };

  React.useEffect(() => {
    if (queryParamBankTxnId) fetchTxn(queryParamBankTxnId);
  }, [queryParamBankTxnId]);

  React.useEffect(() => {
    if (!queryParamBankTxnId && queryParamBankId)
      fetchBankDetails(queryParamBankId);
  }, [queryParamBankId]);

  // useEffect(()=>{
  //   if(txnDetails?.id && bankAccDetails?.id){

  //   }
  // },[txnDetails,bankAccDetails]);

  return <></>;
};

export default CategorizeTxn;
