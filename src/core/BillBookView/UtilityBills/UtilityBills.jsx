import React, { useState, useEffect, useContext, memo } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import ProceedToPay from '@core/PaymentView/shared/ProceedToPay';
import ForgetPassword from '@core/PaymentView/TransactionVerify/ForgetPassword';

import PhoneInternetWeb from './PhoneInternetWeb';
import Electricity from './ElectricityWeb';
import BillInfoWeb from './Components/BillInfoWeb';

import * as css from './utilitybills.scss';

const UtilityBills = ({ billInfoState }) => {
  const { organization, user, openSnackBar, enableLoading } =
    useContext(AppContext);

  const [billInfo, setBillInfo, getBillList] = billInfoState;

  const [selectedProvider, setSelectedProvider] = useState({});
  const [inputParams, setInputParams] = useState({});

  const [billInfoDetails, setBillInfoDetail] = useState([]);
  const [drawer_, setDrawer_] = useState({});
  const [openDrawer, setOpenDrawer] = useState({});
  const [serviceType, setServiceType] = useState('');

  const [paymentBanks, setPaymentBanks] = useState([]);
  const [voucher, setVoucher] = useState([]);
  const [payAmount, setPayAmount] = useState({
    active: true,
    title: '',
    subTitle: '',
  });

  const handleActionSheetChange = () => {
    setOpenDrawer((prev) => ({ ...prev, billInfo: true }));
    setBillInfo((prev) => ({ ...prev, [billInfo.page.toLowerCase()]: false }));
  };

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown Error Occured',
      type: MESSAGE_TYPE.ERROR,
    });
  };

  const getBankAccounts = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${billInfoDetails.fetch_id}/bank_accounts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error && !res.message) {
          setPaymentBanks(res.data);
          setOpenDrawer((prev) => ({
            ...prev,
            billInfo: false,
            billPayment: true,
          }));
        } else showError(res.message || res.error);
      })
      .catch((e) => {
        showError(e.message);
        enableLoading(false);
      });
  };

  const getPaymentVoucher = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/bbps_fetches/${billInfoDetails.fetch_id}/bbps_payments`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.message) {
          setVoucher(res);
          setInputParams({});
          getBankAccounts();
        } else {
          showError(res.message);
        }
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  useEffect(() => {
    let category;
    if (billInfo.page === 'Phone') category = 'phone';
    else if (billInfo.page === 'Electricity') category = 'electricity';
    else if (billInfo.page === 'Internet') category = 'broadband';
    setServiceType(category);
    return () => {
      setSelectedProvider([]);
      setInputParams({});
      setBillInfoDetail([]);
    };
  }, [billInfo.page]);

  return (
    <Box>
      <SelectBottomSheet
        triggerComponent
        open={billInfo.phone || billInfo.internet}
        name="Bill Details"
        onClose={() =>
          setBillInfo((prev) => ({ ...prev, phone: false, internet: false }))
        }
        addNewSheet
      >
        <Stack className={css.phonebillcontainer}>
          <Typography className={css.phoneheader}>
            {serviceType === 'phone'
              ? 'Pay Mobile PostPaid'
              : 'Pay Broadband / Landline Bill'}
          </Typography>
          <PhoneInternetWeb
            propValues={[
              setBillInfoDetail,
              selectedProvider,
              setSelectedProvider,
              setPayAmount,
              inputParams,
              setInputParams,
              handleActionSheetChange,
              serviceType,
            ]}
          />
        </Stack>
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={billInfo.electricity}
        name="Bill Details"
        onClose={() => setBillInfo((prev) => ({ ...prev, electricity: false }))}
        addNewSheet
      >
        <Stack className={css.phonebillcontainer}>
          <Typography className={css.phoneheader}>Electricity</Typography>
          <Electricity
            propValues={[
              setBillInfoDetail,
              selectedProvider,
              setSelectedProvider,
              setPayAmount,
              inputParams,
              setInputParams,
              handleActionSheetChange,
            ]}
          />
        </Stack>
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={openDrawer.billInfo}
        name="Bill Details"
        onClose={() => setOpenDrawer((prev) => ({ ...prev, billInfo: false }))}
        addNewSheet
      >
        <BillInfoWeb
          billInfoDetails={billInfoDetails}
          selectedProvider={selectedProvider}
          inputFormData={inputParams}
          paytype={serviceType}
          OnSubmit={() => getPaymentVoucher()}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={openDrawer.billPayment}
        name="Pay Bill"
        onClose={() =>
          setOpenDrawer((prev) => ({ ...prev, billPayment: false }))
        }
        addNewSheet
      >
        <ProceedToPay
          onClose={() => {
            setOpenDrawer((prev) => ({ ...prev, billPayment: false }));
            getBillList();
          }}
          payNow={payAmount}
          payType
          bankAccounts={paymentBanks}
          paymentVoucharId={voucher?.id}
          BBPSFetchId={billInfoDetails?.fetch_id}
          paidAmount={billInfoDetails?.total_amount}
          ShowTransForgPass={() =>
            setOpenDrawer((prev) => ({ ...prev, showTransPass: true }))
          }
          showVerifyPassword={[drawer_, setDrawer_]}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={openDrawer.showTransPass}
        name="forgetPassword"
        hideClose
      >
        <ForgetPassword
          onClose={() =>
            setOpenDrawer((prev) => ({ ...prev, showTransPass: false }))
          }
        />
      </SelectBottomSheet>
    </Box>
  );
};

export default memo(UtilityBills);
