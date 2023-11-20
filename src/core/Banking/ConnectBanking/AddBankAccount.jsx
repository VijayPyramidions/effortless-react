import React from 'react';
import * as Mui from '@mui/material';
import Input from '@components/Input/Input.jsx';
import { validateRequired, validateIfsc } from '@services/Validation.jsx';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import * as css from './OtherBankAccount.scss';
import Oval from '../../../assets/WebAssets/Oval.svg';
import CircleOk from '../../../assets/WebAssets/tik.svg';

const VALIDATOR = {
  icici_corporate_id: (v) => validateRequired(v),
  icici_user_id: (v) => validateRequired(v),
  account_number: (v) => validateRequired(v),
  confirm_account_number: (v) => validateRequired(v),
  ifsc: (v) => validateIfsc(v),
  account_holder_name: (v) => validateRequired(v),
  alias_id: (v) => validateRequired(v),
};

const ValidationErrMsg = {
  icici_corporate_id: 'Please fill ICICI Corporate Id',
  icici_user_id: 'Please fill ICICI User Id ',
  account_number: 'Please fill Account Number',
  confirm_account_number: 'Confirm Account Number is Invalid',
  ifsc: 'Please fill IFSC',
  account_holder_name: 'Please fill Account Holder Name',
  alias_id: 'Please fill Alias Id',
};

const initialValidationErr = {
  icici_corporate_id: false,
  icici_user_id: false,
  account_number: false,
  confirm_account_number: false,
  ifsc: false,
  account_holder_name: false,
  alias_id: false,
};

const intialState = {
  icici_corporate_id: '',
  icici_user_id: '',
  account_number: '',
  ifsc: '',
  account_holder_name: '',
  confirm_account_number: '',
  alias_id: '',
};

export const AddBankAccount = ({
  FetchConnectedBank,
  mobile,
  setCongratsDrawer,
}) => {
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const {
    organization,
    user,
    enableLoading,
    currentUserInfo,
    openSnackBar,
    connect,
    setConnect,
  } = React.useContext(AppContext);
  const [CheckId, setCheckId] = React.useState(false);
  const [bankDetails, setBankDetails] = React.useState(intialState);
  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };
  const reValidate = (e) => {
    const name = e?.target?.name;
    if (!name) return;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };
  const validateAllFields = () => {
    return {
      icici_corporate_id: !VALIDATOR?.icici_corporate_id?.(
        bankDetails?.icici_corporate_id
      ),
      icici_user_id: !VALIDATOR?.icici_user_id?.(bankDetails?.icici_user_id),
      account_number: !VALIDATOR?.account_number?.(bankDetails?.account_number),
      ifsc: !VALIDATOR?.ifsc?.(bankDetails?.ifsc),
      account_holder_name: !VALIDATOR?.account_holder_name?.(
        bankDetails?.account_holder_name
      ),
      confirm_account_number: !VALIDATOR?.confirm_account_number?.(
        bankDetails?.confirm_account_number
      ),
      alias_id: CheckId ? !VALIDATOR?.alias_id?.(bankDetails?.alias_id) : false,
    };
  };
  const LinkAccount = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    if (bankDetails?.account_number === bankDetails?.confirm_account_number) {
      RestApi(`organizations/${organization?.orgId}/bank_users`, {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          user_id: currentUserInfo?.id,
          corp_id: bankDetails?.icici_corporate_id,
          bank_user_id: bankDetails?.icici_user_id,
          ifsc_code: bankDetails?.ifsc,
          account_number: bankDetails?.account_number,
          account_holder_name: bankDetails?.account_holder_name,
          // service_provider: 'ICICI',
          alias_id: bankDetails?.alias_id,
        },
      })
        .then((res) => {
          if (res && !res.error) {
            setBankDetails(intialState);
            FetchConnectedBank();
            openSnackBar({
              message: res?.message,
              type: MESSAGE_TYPE.INFO,
            });
            // setTimeout(() => {
            setConnect(false);
            // }, 1000);
            if (
              !currentUserInfo?.transactionPasswordEnabled ||
              (currentUserInfo?.transactionPasswordEnabled &&
                +new Date(currentUserInfo?.transactionPasswordExpireDate) <=
                  +new Date())
            ) {
              setCongratsDrawer(true);
            }
          } else if (res.error) {
            openSnackBar({
              message: res?.message || 'Error',
              type: MESSAGE_TYPE.ERROR,
            });
          }
          enableLoading(false);
        })
        .catch((e) => {
          openSnackBar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });

          enableLoading(false);
        });
    } else {
      enableLoading(false);
      setValidationErr(() => ({
        confirm_account_number: true,
      }));
    }
  };

  return (
    <>
      {mobile && connect === true ? (
        <Mui.Box className={css.mainBoxess}>
          <Mui.Typography mb={2}>Add an ICICI Bank Account</Mui.Typography>
          <>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="icici_corporate_id"
                onBlur={reValidate}
                error={validationErr.icici_corporate_id}
                helperText={
                  validationErr.icici_corporate_id
                    ? ValidationErrMsg.icici_corporate_id
                    : ''
                }
                label="ICICI Corporate ID"
                onChange={(e) => {
                  reValidate(e);
                  setBankDetails({
                    ...bankDetails,
                    icici_corporate_id: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="icici_user_id"
                onBlur={reValidate}
                error={validationErr.icici_user_id}
                helperText={
                  validationErr.icici_user_id
                    ? ValidationErrMsg.icici_user_id
                    : ''
                }
                label="ICICI User ID"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    icici_user_id: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="account_number"
                onBlur={reValidate}
                error={validationErr.account_number}
                helperText={
                  validationErr.account_number
                    ? ValidationErrMsg.account_number
                    : ''
                }
                label="Account Number"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    account_number: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="number"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="confirm_account_number"
                onBlur={reValidate}
                error={validationErr.confirm_account_number}
                helperText={
                  validationErr.confirm_account_number
                    ? ValidationErrMsg.confirm_account_number
                    : ''
                }
                label="Confirm Account Number"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    confirm_account_number: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="number"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="ifsc"
                onBlur={reValidate}
                error={validationErr.ifsc}
                helperText={validationErr.ifsc ? ValidationErrMsg.ifsc : ''}
                label="IFSC"
                onChange={(e) => {
                  reValidate(e);
                  setBankDetails({
                    ...bankDetails,
                    ifsc: e?.target?.value?.toUpperCase(),
                  });
                }}
                value={bankDetails?.ifsc}
                InputLabelProps={{
                  shrink: true,
                }}
                onKeyPress={handleIfscKeyPress}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="account_holder_name"
                onBlur={reValidate}
                error={validationErr.account_holder_name}
                helperText={
                  validationErr.account_holder_name
                    ? ValidationErrMsg.account_holder_name
                    : ''
                }
                label="Account Holder Name"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    account_holder_name: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Mui.FormControlLabel
                control={
                  <Mui.Checkbox
                    icon={
                      <Mui.CardMedia
                        component="img"
                        src={Oval}
                        height="20px"
                        width="20px"
                      />
                    }
                    checked={CheckId}
                    onChange={() => setCheckId(!CheckId)}
                    checkedIcon={
                      <Mui.CardMedia
                        component="img"
                        src={CircleOk}
                        height="20px"
                        width="20px"
                      />
                    }
                  />
                }
                label={
                  <Mui.Typography className={css.checkbox}>
                    Have ICICI Login ID
                  </Mui.Typography>
                }
              />
            </Mui.Stack>
            {CheckId && (
              <Mui.Stack className={css.inputHead}>
                <Input
                  name="alias_id"
                  onBlur={CheckId && reValidate}
                  error={CheckId && validationErr.alias_id}
                  helperText={
                    CheckId && validationErr.alias_id
                      ? ValidationErrMsg.alias_id
                      : ''
                  }
                  label="Alias ID"
                  onChange={(e) => {
                    setBankDetails({
                      ...bankDetails,
                      alias_id: e.target.value,
                    });
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid rgba(153, 158, 165, 0.39)',
                  }}
                  type="text"
                />
              </Mui.Stack>
            )}
            <Mui.Stack direction="row" className={css.btnstack} spacing={2}>
              <Mui.Button
                onClick={() => {
                  setConnect(false);
                }}
                className={css.outlineBtn}
              >
                Cancel
              </Mui.Button>
              <Mui.Button className={css.containedBtn} onClick={LinkAccount}>
                Link My Account
              </Mui.Button>
            </Mui.Stack>
            <Mui.Typography className={css.terms}>
              By clicking on link my Account you agree to the{' '}
              <p className={css.condition}>Terms and conditions</p>
            </Mui.Typography>
          </>
        </Mui.Box>
      ) : (
        <>
          <Mui.Typography mb={2}>Add an ICICI Bank Account</Mui.Typography>
          <Mui.Card
            elevation={0}
            className={css.cards}
            // sx={{ mr: mobile ? '15px' : '100%', ml: mobile ? '15px' : '100%' }}
          >
            <Mui.Stack className={css.inputHead}>
              <Input
                name="icici_corporate_id"
                onBlur={reValidate}
                error={validationErr.icici_corporate_id}
                helperText={
                  validationErr.icici_corporate_id
                    ? ValidationErrMsg.icici_corporate_id
                    : ''
                }
                label="ICICI Corporate ID"
                onChange={(e) => {
                  reValidate(e);
                  setBankDetails({
                    ...bankDetails,
                    icici_corporate_id: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="icici_user_id"
                onBlur={reValidate}
                error={validationErr.icici_user_id}
                helperText={
                  validationErr.icici_user_id
                    ? ValidationErrMsg.icici_user_id
                    : ''
                }
                label="ICICI User ID"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    icici_user_id: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="account_number"
                onBlur={reValidate}
                error={validationErr.account_number}
                helperText={
                  validationErr.account_number
                    ? ValidationErrMsg.account_number
                    : ''
                }
                label="Account Number"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    account_number: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="number"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="confirm_account_number"
                onBlur={reValidate}
                error={validationErr.confirm_account_number}
                helperText={
                  validationErr.confirm_account_number
                    ? ValidationErrMsg.confirm_account_number
                    : ''
                }
                label="Confirm Account Number"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    confirm_account_number: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                type="number"
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="ifsc"
                onBlur={reValidate}
                error={validationErr.ifsc}
                helperText={validationErr.ifsc ? ValidationErrMsg.ifsc : ''}
                label="IFSC"
                onChange={(e) => {
                  reValidate(e);
                  setBankDetails({
                    ...bankDetails,
                    ifsc: e?.target?.value?.toUpperCase(),
                  });
                }}
                onKeyPress={handleIfscKeyPress}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
                value={bankDetails?.ifsc}
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Input
                name="account_holder_name"
                onBlur={reValidate}
                error={validationErr.account_holder_name}
                helperText={
                  validationErr.account_holder_name
                    ? ValidationErrMsg.account_holder_name
                    : ''
                }
                label="Account Holder Name"
                onChange={(e) => {
                  setBankDetails({
                    ...bankDetails,
                    account_holder_name: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
              />
            </Mui.Stack>
            <Mui.Stack className={css.inputHead}>
              <Mui.FormControlLabel
                control={
                  <Mui.Checkbox
                    icon={
                      <Mui.CardMedia
                        component="img"
                        src={Oval}
                        height="20px"
                        width="20px"
                      />
                    }
                    checked={CheckId}
                    onChange={() => setCheckId(!CheckId)}
                    checkedIcon={
                      <Mui.CardMedia
                        component="img"
                        src={CircleOk}
                        height="20px"
                        width="20px"
                      />
                    }
                  />
                }
                label={
                  <Mui.Typography className={css.checkbox}>
                    Have ICICI Login ID
                  </Mui.Typography>
                }
              />
            </Mui.Stack>
            {CheckId && (
              <Mui.Stack className={css.inputHead}>
                <Input
                  name="alias_id"
                  onBlur={CheckId && reValidate}
                  error={CheckId && validationErr.alias_id}
                  helperText={
                    CheckId && validationErr.alias_id
                      ? ValidationErrMsg.alias_id
                      : ''
                  }
                  label="Alias ID"
                  onChange={(e) => {
                    setBankDetails({
                      ...bankDetails,
                      alias_id: e.target.value,
                    });
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid rgba(153, 158, 165, 0.39)',
                  }}
                  type="text"
                />
              </Mui.Stack>
            )}
            <Mui.Stack direction="row" className={css.btnstack} spacing={2}>
              <Mui.Button
                onClick={() => {
                  setConnect(false);
                }}
                className={css.outlineBtn}
              >
                Cancel
              </Mui.Button>
              <Mui.Button className={css.containedBtn} onClick={LinkAccount}>
                Link My Account
              </Mui.Button>
            </Mui.Stack>
            <Mui.Typography className={css.terms}>
              By clicking on link my Account you agree to the{' '}
              <p className={css.condition}>Terms and conditions</p>
            </Mui.Typography>
          </Mui.Card>
        </>
      )}
    </>
  );
};
