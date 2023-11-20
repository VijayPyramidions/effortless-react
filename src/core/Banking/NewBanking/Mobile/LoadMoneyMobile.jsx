import React, { useState, useEffect, useContext, memo, useRef } from 'react';

import { Avatar, IconButton, Stack, Typography } from '@mui/material';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import IppoPay from '../Ippopay';
import SelectBottomSheet from '../../../../components/SelectBottomSheet/SelectBottomSheet';

import LoadMoneyIcon from '../../../../assets/loadmoneyicon.png';
import AccountListMoney from './Components/AccountListMoney';

import * as css from './bankingmobile.scss';

const LoadMoney = () => {
  const { openSnackBar } = useContext(AppContext);

  const [AccountSelect, setAccountSelect] = useState(false);
  const [Amount, setAmount] = useState();
  const inputRef = useRef();
  // Ippo Pay //

  const [paymentResponse, setPaymentResponse] = useState();
  const [ippoPayModal, setIppopayModal] = useState(false);
  const [ippoPaySuccess, setippoPaySuccess] = useState('');

  // Ippo Pay //

  const amountSubmit = () => {
    if (Number(Amount) === 0 || Amount === '') {
      openSnackBar({
        message: 'Please Enter Valid Amount.',
        type: MESSAGE_TYPE.ERROR,
      });
      return;
    }
    // if (Number(Amount) < 51) {
    //   openSnackBar({
    //     message: 'Minumum Net Banking Amount Rs. 51',
    //     type: MESSAGE_TYPE.ERROR,
    //   });

    //   return;
    // }
    setAccountSelect(true);
  };

  // Ippo Pay Succes & Error Handler //

  const ippopayHandler = (e) => {
    if (e.data.status === 'success') {
      setIppopayModal(false);
      openSnackBar({
        message: 'Payment Successfull.',
        type: MESSAGE_TYPE.INFO,
      });
      setippoPaySuccess('paymentSuccess');
      setAccountSelect(true);
      // setaction('account');
      // setbtnutils({
      //   ...btnutils,
      //   title: 'Account confirmation',
      //   desc: 'Choose the Account',
      //   btntext: 'Confirm Account',
      // });

      // setactionHandler(true);
    }
    if (e.data.status === 'failure') {
      console.log('failure', e.data);
    }
    if (e.data.status === 'closed') {
      console.log('closed', e.data);
      // onClose();
    }
  };

  // Ippo Pay Succes & Error Handler //

  useEffect(() => {
    if (paymentResponse?.collection_service_provider === 'ippopay') {
      setIppopayModal(true);
      setAccountSelect(false);
    } else setIppopayModal(false);
  }, [paymentResponse]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <>
      <Stack className={css.moneyContainer}>
        <Avatar
          src={LoadMoneyIcon}
          alt="effortless logo"
          sx={{ margin: '40px 0 12px 0' }}
        />
        <Typography className={css.actiontext}>
          Paying Effortless Virtual Account
        </Typography>
        <Stack className={css.amountinputwtp}>
          &#8377;
          <input
            name="amount"
            type="number"
            className={css.amountinput}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            ref={inputRef}
          />
        </Stack>
        <IconButton className={css.amtsubmitbtn} onClick={amountSubmit}>
          <CheckRoundedIcon className={css.amticon} />
        </IconButton>
      </Stack>

      {ippoPayModal && (
        <IppoPay
          orderId={paymentResponse?.order_id}
          publicKey={paymentResponse?.public_key}
          ippopayHandler={ippopayHandler}
        />
      )}

      <SelectBottomSheet
        triggerComponent
        open={AccountSelect}
        name="Load Money"
        onClose={() => setAccountSelect(false)}
        addNewSheet
      >
        <AccountListMoney
          actionTyope="load_money"
          LoadAmount={Amount}
          setPaymentResponse={setPaymentResponse}
          ippoPaySuccess={ippoPaySuccess}
          onClose={() => setAccountSelect(false)}
        />
      </SelectBottomSheet>
    </>
  );
};

export default memo(LoadMoney);
