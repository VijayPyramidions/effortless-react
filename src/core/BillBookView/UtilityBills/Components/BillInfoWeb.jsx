/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useState, useContext, memo } from 'react';
import moment from 'moment';

import { Box, Button, Stack, Typography, Avatar } from '@mui/material';
import { InputText } from '@components/Input/Input';
import { StyledAutoComplete } from '@components/AutoComplete/AutoCompleteAsync';

import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import BPBS from '../../../../assets/phonePostpaid/bpbs.svg';

import * as css from './billdetailinfo.scss';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      theme="light"
      className={css.textfieldStyle}
    />
  );
};

const initialBillInfo = {
  id: '',
  fetchId: '',
  dueDate: '',
  date: '',
  customerName: '',
  billNumber: '',
  billPeriod: '',
  curcle: '',
};

const BillInfoWeb = ({
  paytype,
  billInfoDetails,
  selectedProvider,
  OnSubmit,
  inputFormData,
}) => {
  const { user, openSnackBar, enableLoading, organization } =
    useContext(AppContext);

  const [provider, setProvider] = useState({});
  const [amount, setAmount] = useState('');

  const [inputParams, setInputParams] = useState({});

  const [billInfo, setBillInfo] = useState(initialBillInfo);
  const [reset, setReset] = useState(false);

  const onProviderChange = (e, value) => {
    console.log(e);
    if (!reset) {
      setReset(true);
      setProvider(value);
      setInputParams({});
    } else setProvider(value);
  };

  const onInputChange = (dataType) => (e) => {
    const { name, value } = e.target;
    const regex = /^$|^[0-9\b]+$/;

    if (dataType === 'NUMERIC') {
      if (regex.test(value))
        setInputParams({
          ...inputParams,
          [name]: value,
        });
    } else setInputParams({ ...inputParams, [name]: value });
  };

  const getBillInfoDetails = async () => {
    const data = [];
    let errorstate = false;

    Object.keys(inputParams || {}).forEach((item, index) => {
      if (provider?.input_params[index]?.regEx) {
        const pattern = new RegExp(provider.input_params[index].regEx, 'i');

        if (pattern.test(inputParams[item]))
          data.push({ key: item.replace('_', ' '), value: inputParams[item] });
        else {
          openSnackBar({
            message: `Enter valid ${item.replace('_', ' ')}`,
            type: MESSAGE_TYPE.ERROR,
          });
          errorstate = true;
        }
      } else
        data.push({ key: item.replace('_', ' '), value: inputParams[item] });
    });

    if (Object.keys(inputParams || {}).length === 0)
      openSnackBar({
        message: `Enter valid fields`,
        type: MESSAGE_TYPE.ERROR,
      });

    if (errorstate || Object.keys(inputParams || {}).length === 0) return;

    enableLoading(true);

    await RestApi(`organizations/${organization.orgId}/bbps_accounts`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        bbps_biller_id: provider?.id,
        input_params: data,
      },
    })
      .then((res) => {
        enableLoading(false);

        if (res.status !== 422 && !res.message) {
          setReset(false);

          setBillInfo((prev) => ({
            ...prev,
            id: res.id,
            fetchId: res.fetch_id,
            dueDate: res.due_date,
            date: res.date,
            customerName: res.account_holder_name,
            billNumber: res.bill_number,
            billPeriod: res.bill_period,
            paid: res.paid,
            curcle: res.curcle || 'Tamil Nadu',
          }));

          setAmount(res.total_amount);
        } else
          openSnackBar({
            message: res?.message || res?.error || 'Something Wrong',
            type: MESSAGE_TYPE.WARNING,
          });
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const payBillAmount = () => {
    OnSubmit();
  };

  const getServiceProviders = () => {
    let category;

    if (paytype === 'phone') category = 'Mobile Postpaid';
    else if (paytype === 'broadband') category = 'Broadband Postpaid';
    else category = 'Electricity';

    return RestApi(`bbps_billers?category=${category}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    });
  };

  useEffect(() => {
    setInputParams(inputFormData);
  }, [inputFormData]);

  useEffect(() => {
    setProvider(selectedProvider);
    setAmount(billInfoDetails.total_amount);

    setBillInfo((prev) => ({
      ...prev,
      id: billInfoDetails.id,
      fetchId: billInfoDetails.fetch_id,
      dueDate: billInfoDetails.due_date,
      date: billInfoDetails.date,
      customerName: billInfoDetails.account_holder_name,
      billNumber: billInfoDetails.bill_number,
      billPeriod: billInfoDetails.bill_period,
      paid: billInfoDetails.paid,
      curcle: billInfoDetails.curcle || 'Tamil Nadu',
    }));
  }, [billInfoDetails]);

  return (
    <Box className={css.billinfocontainerweb}>
      <Typography className={css.phoneheader}>
        {paytype === 'phone' && 'Mobile Postpaid'}
        {paytype === 'broadband' && 'Pay Broadband / Landline Bill'}
        {paytype === 'electricity' && 'Electricity'}
      </Typography>
      <Stack>
        <Typography className={css.msgdesc}>
          {paytype === 'phone' &&
            'Set up your Monthly Payment for Phone Bill Services'}
          {paytype === 'broadband' &&
            'Set up your Monthly Payment for Internet Services'}
          {paytype === 'electricity' &&
            'Set up your Monthly Electricity Payment Process'}
        </Typography>

        <StyledAutoComplete
          className={css.providerlist}
          label="Select Provider"
          getOptionSelected={(option, value) => option?.id === value?.id}
          getOptionLabel={(option) => option.name}
          value={provider}
          promiseCall={getServiceProviders}
          onChange={onProviderChange}
          required
        />

        {provider?.input_params?.map((item) => (
          <TextfieldStyle
            key={item?.paramName?.replace(' ', '_')}
            label={item?.paramName}
            name={item?.paramName?.replace(' ', '_')}
            value={inputParams[item?.paramName?.replace(' ', '_')] || ''}
            onChange={onInputChange(item.dataType)}
            inputProps={{
              minLength: item?.minLength,
              maxLength: item?.maxLength,
            }}
            required={item.isOptional === 'false'}
          />
        ))}

        {!reset && (
          <>
            {/* <TextfieldStyle label="Circle" name="circle" value={curcle} /> */}

            <TextfieldStyle
              label="Amount"
              name="amount"
              type="number"
              value={amount || 0}
              required
              disabled
            />
          </>
        )}
      </Stack>
      {!reset && (
        <>
          <Stack className={css.billdetailcontainer}>
            <Typography className={css.billdetailtitle}>
              Consumer Details
            </Typography>
            <Stack className={css.labelwrp}>
              <Typography className={css.label}>Due Date</Typography>
              <span className={css.spacer}>-</span>
              <Typography className={css.value}>
                {moment(billInfo.dueDate).format('MMM DD, YYYY')}
              </Typography>
            </Stack>
            <Stack className={css.labelwrp}>
              <Typography className={css.label}>Bill Date</Typography>
              <span className={css.spacer}>-</span>
              <Typography className={css.value}>
                {moment(billInfo.date).format('MMM DD, YYYY')}
              </Typography>
            </Stack>
            <Stack className={css.labelwrp}>
              <Typography className={css.label}>Consumer Name</Typography>
              <span className={css.spacer}>-</span>
              <Typography className={css.value}>
                {billInfo.customerName}
              </Typography>
            </Stack>
            <Stack className={css.labelwrp}>
              <Typography className={css.label}>Bill Number</Typography>
              <span className={css.spacer}>-</span>
              <Typography className={css.value}>
                {billInfo.billNumber}
              </Typography>
            </Stack>
            <Stack className={css.labelwrp}>
              <Typography className={css.label}>Bill Period</Typography>
              <span className={css.spacer}>-</span>
              <Typography className={css.value}>
                {billInfo.billPeriod}
              </Typography>
            </Stack>
            {/* <Stack className={css.labelwrp}>
              <Typography className={css.label}>Circle</Typography>
              <span className={css.spacer}>-</span>
              <Typography className={css.value}>{billInfo.curcle}</Typography>
            </Stack> */}
          </Stack>

          {billInfo?.paid && (
            <Typography className={css.paidmsg} sx={{ mb: '24px' }}>
              All good here! your Bill is{' '}
              <sapn style={{ color: '#00A676' }}>already paid </sapn>
            </Typography>
          )}
        </>
      )}
      <Stack>
        <Button
          className={css.paybillbtn}
          disabled={
            (amount === 0 && reset === false) ||
            (amount === null && reset === false) ||
            (billInfo?.paid && reset === false) ||
            (Object.keys(provider || {}).length === 0 && reset)
          }
          sx={reset && { marginTop: '16px !important' }}
          onClick={reset ? getBillInfoDetails : payBillAmount}
        >
          {reset ? 'Get Bill' : ' Proceed to Pay'}
        </Button>
      </Stack>

      <Stack className={css.bpbswrp}>
        <Typography className={css.bpbstitle}>
          Secured by Bharat BillPay
        </Typography>
        <Avatar src={BPBS} alt="bpbs" className={css.bpbslogo} />
      </Stack>
    </Box>
  );
};

export default memo(BillInfoWeb);
