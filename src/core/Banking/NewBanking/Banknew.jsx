import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@mui/material';
import {
  getBankList,
  openVirtualAccount,
  closeVirtualAccount,
  closeBankAccount,
  addBankAccounts,
  closeBorrowing,
  closeTranPassword,
  addOtherBank,
} from '@action/Store/Reducers/Banking/BankingState';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import axiosInst from '@action/ApiConfig/AxiosInst';
import TransactionPassword from '../../PaymentView/TransactionVerify/TransactionPassword';

import CreateVirtualAccount from './CreateVirtualAccount';
import AddBankAccount from './AddBankAccount';
import BankingMobile from './Mobile/BankingMobile';
import AddBorrowings from './AddBorrowings';
import AddOtherBank from './AddOtherBank';

import BankingWeb from './Web/BankingWeb';

const Banknew = () => {
  const { organization, openSnackBar, enableLoading } = useContext(AppContext);

  const dispatch = useDispatch();

  const {
    virtualAccountShow,
    effortlessAccounts,
    addIciciBanks,
    YodleeBank,
    borrowing,
    congratsDrawer,
    addBankDrawer,
  } = useSelector((state) => state.Banking);

  const device = localStorage.getItem('device_detect');

  const [toggleModal, setToggleModal] = useState(false);

  const queryParam = new URLSearchParams(window.location.search).get('id');

  const handleCloseModal = () => {
    setToggleModal(false);
    dispatch(closeBankAccount({ type: 'other' }));
  };

  const createBankDetails = (response) => {
    enableLoading(true);

    const payload = {
      fastlink_flow: YodleeBank.fastLinkConfigLocal,
      sites: response,
      account_type: YodleeBank.bankAccountType,
    };
    axiosInst
      .post(
        `organizations/${organization?.orgId}/yodlee_bank_accounts/handle_fastlink_event`,
        payload
      )
      .then((res) => {
        if (res && !res.data.error) dispatch(getBankList());

        if (res.data.error)
          openSnackBar({
            message: res.data.message || 'Something went wrong',
            type: MESSAGE_TYPE.ERROR,
          });

        enableLoading(false);
        handleCloseModal();
      })
      .catch((e) => {
        if (e?.message) {
          openSnackBar({
            message:
              e.message ||
              Object.values(e?.errors)?.join(',') ||
              'Sorry,Something went Wrong, Please try again',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
        handleCloseModal();
      });
  };

  const connectBank = () => {
    enableLoading(true);
    axiosInst
      .post(
        `organizations/${organization?.orgId}/yodlee_bank_accounts/fastlink_config`,
        {
          fastlink_flow: YodleeBank.fastLinkConfig,
          bank_account_id:
            YodleeBank.fastLinkConfig !== 'add_bank'
              ? YodleeBank.bank_account_id
              : undefined,
        }
      )
      .then((res) => {
        if (res?.data) {
          if (res && res?.data?.fastlink_url) {
            setToggleModal(true);
            let fastlinkParams;
            if (res.data.flow)
              fastlinkParams = {
                configName: res.data.fast_link_config_name,
                flow: res.data.flow,
              };
            else
              fastlinkParams = {
                configName: res.data.fast_link_config_name,
              };

            if (res.data.provider_account_id)
              fastlinkParams = {
                ...fastlinkParams,
                providerAccountId: res.data.provider_account_id,
              };

            window.fastlink.open(
              {
                fastLinkURL: res.data.fastlink_url,
                accessToken: `Bearer ${res.data.access_token}`,
                params: fastlinkParams,
                forceIframe: true,
                iframeScrolling: 'yes',
                onError(data) {
                  enableLoading(false);
                  // will be called on error. For list of possible message, refer to onError(data) Method.
                  console.log('onError', data);

                  // openSnackBar({
                  //   message: data.reason || data.message || 'Failed',
                  //   type: MESSAGE_TYPE.ERROR,
                  // });
                  // handleCloseModal();
                },
                onEvent(data) {
                  enableLoading(false);
                  // will be called on error. For list of possible message, refer to onError(data) Method.
                  console.log('onEvent', data);

                  // openSnackBar({
                  //   message: data.reason || data.message || 'Failed',
                  //   type: MESSAGE_TYPE.ERROR,
                  // });
                  // handleCloseModal();
                },
                onClose(data) {
                  // will be called called to close FastLink. For list of possible message, refer to onClose(data) Method.
                  if (
                    data.action === 'exit' &&
                    (data.status === 'USER_CLOSE_ACTION' ||
                      data.code === 'E103' ||
                      data.code === 'E110')
                  ) {
                    handleCloseModal();
                    if (data.code === 'E103') dispatch(getBankList());
                  } else if (
                    data.action === 'exit' &&
                    data.sites &&
                    data.sites.length > 0
                  ) {
                    createBankDetails(data?.sites);
                  }
                },
              },
              'Fastlink-container'
            );
            // } else {
            // JSBridge.connectYodlee(res, yodleeBank.bankAccountType);
            // }

            enableLoading(false);
          } else if (res?.data?.error)
            openSnackBar({
              message: res.data.message,
              type: MESSAGE_TYPE.ERROR,
            });
        }
        enableLoading(false);
        dispatch(closeBankAccount({ type: 'other' }));
      })
      .catch((e) => {
        if (e) {
          openSnackBar({
            message:
              e.message ||
              Object.values(e?.errors)?.join(',') ||
              'Sorry,Something went Wrong, Please try again',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      });
  };

  useEffect(() => {
    if (queryParam === 'create_virtual' && !effortlessAccounts?.account_status)
      dispatch(openVirtualAccount());
    else if (queryParam === 'create_icici')
      dispatch(addBankAccounts({ type: 'Add ICICI Bank Account' }));
  }, [queryParam]);

  useEffect(() => {
    dispatch(getBankList());
  }, []);

  useEffect(() => {
    if (YodleeBank.fastLinkConfig) connectBank();
  }, [YodleeBank.fastLinkConfig]);

  return (
    <>
      {device === 'desktop' ? <BankingWeb /> : <BankingMobile />}

      <SelectBottomSheet
        triggerComponent
        open={virtualAccountShow}
        name="Add Virtual Account"
        onClose={() => dispatch(closeVirtualAccount())}
      >
        <CreateVirtualAccount onClose={() => dispatch(closeVirtualAccount())} />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={addIciciBanks}
        name="Add Bank"
        onClose={() => dispatch(closeBankAccount({ type: 'icici' }))}
      >
        <AddBankAccount />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={borrowing}
        name="Add Borrowings"
        onClose={() => dispatch(closeBorrowing())}
      >
        <AddBorrowings />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={congratsDrawer.open}
        name="Create Transaction Password"
        hideClose
        // onClose={() => setCongratsDrawer(false)}
      >
        <TransactionPassword onClose={() => dispatch(closeTranPassword())} />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={addBankDrawer}
        name="Add Bank"
        onClose={() => dispatch(addOtherBank(false))}
      >
        <AddOtherBank onClose={() => dispatch(addOtherBank(false))} />
      </SelectBottomSheet>

      <Modal open={toggleModal} onClose={handleCloseModal}>
        <div
          id="Fastlink-container"
          style={{ height: '100vh', overflow: 'scroll', marginTop: '4vh' }}
        />
      </Modal>
    </>
  );
};

export default Banknew;
