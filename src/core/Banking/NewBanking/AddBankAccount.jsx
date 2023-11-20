import React, { memo, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';

import {
  Box,
  Link,
  Stack,
  Typography,
  Button,
  FormControlLabel,
} from '@mui/material';
import {
  closeBankAccount,
  getBankList,
  // openTranPassword,
} from '@action/Store/Reducers/Banking/BankingState';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { InputText } from '@components/Input/Input';
import { Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { validateRequired, validateIfsc } from '@services/Validation';
import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import axiosInst from '@action/ApiConfig/AxiosInst';
import * as css from './bankingnew.scss';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      required
      theme="light"
      className={css.textfieldStyle}
    />
  );
};

export const useStyles = makeStyles({
  chckroot: {
    marginLeft: '0px !important',
    marginBottom: '22px',

    '& .MuiFormControlLabel-label': {
      fontWeight: 300,
      fontSize: '13px',
      color: '#283049',
      marginLeft: '12px',
    },
    // margin-left: 12px;
    '& .MuiCheckbox-root:not(.Mui-checked)': {
      padding: '0px !important',
      '& .MuiIconButton-label': {
        background: '#FFFFFF',
        border: '1px solid #D5D7DA',
        borderRadius: '4px',
        width: '16px',
        height: '16px',

        '&:hover': {
          background: '#FFFFFF',
        },

        '& .MuiSvgIcon-root': {
          display: 'none',
        },
      },
    },
    '& .PrivateSwitchBase-root-32.Mui-checked': {
      padding: '0px !important',
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#F08B32 !important',
      padding: '0px !important',
    },
    '& .MuiCheckbox-root.Mui-disabled': {
      background: 'rgba(203, 213, 225, 0.5)',
      border: '1px solid rgba(203, 213, 225, 0.5)',
      cursor: 'not-allowed',
    },
  },
});

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

const AddBankAccount = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { organization, enableLoading, currentUserInfo } =
    useContext(AppContext);
  const [aliasState, setaliasState] = useState(false);
  const [bankDetails, setBankDetails] = useState(intialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[a-zA-Z0-9\b]+$/.test(key))) {
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
      alias_id: aliasState
        ? !VALIDATOR?.alias_id?.(bankDetails?.alias_id)
        : false,
    };
  };

  const OnSubmit = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    if (bankDetails?.account_number === bankDetails?.confirm_account_number) {
      enableLoading(true);
      axiosInst
        .post(`organizations/${organization?.orgId}/bank_users`, {
          user_id: currentUserInfo?.id,
          corp_id: bankDetails?.icici_corporate_id,
          bank_user_id: bankDetails?.icici_user_id,
          ifsc_code: bankDetails?.ifsc,
          account_number: bankDetails?.account_number,
          account_holder_name: bankDetails?.account_holder_name,
          alias_id: bankDetails?.alias_id,
        })
        .then((res) => {
          if (res && !res?.data?.error) {
            dispatch(
              openSnackbar({
                message: res?.data?.message,
                type: MESSAGE_TYPE.INFO,
              })
            );
            setBankDetails(intialState);
            dispatch(getBankList());
            enableLoading(false);

            dispatch(closeBankAccount({ type: 'icici' }));

            // if (
            //   !currentUserInfo?.transactionPasswordEnabled &&
            //   +new Date(currentUserInfo?.transactionPasswordExpireDate) <=
            //     +new Date()
            // ) {
            //   dispatch(openTranPassword('icici'));
            // }
          } else if (res?.error) {
            dispatch(
              openSnackbar({
                message: res?.message || 'Error',
                type: MESSAGE_TYPE.ERROR,
              })
            );
          }
          enableLoading(false);
        })
        .catch((e) => {
          dispatch(
            openSnackbar({
              message: Object.values(e.errors).join(),
              type: MESSAGE_TYPE.ERROR,
            })
          );

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
    <Box className={css.formContainer}>
      <Typography variant="h4" className={css.fromContainer_header}>
        Add an ICICI Bank Account
      </Typography>
      <Stack className={css.bankreg_instructwrp}>
        <Typography variant="h7" className={css.bankreg_title}>
          Registration Process:
        </Typography>
        <ol className={css.bangreg_list}>
          <li className={css.bankreg_instruction}>
            Enter your bank Details in the form
          </li>
          <li className={css.bankreg_instruction}>
            Approve your request in ICICI’s Connected Banking Approvals page:{' '}
            <Link
              href="https://cibnext.icicibank.com/"
              className={css.bankreg_link}
              target="_blank"
            >
              https://cibnext.icicibank.com/
            </Link>
          </li>
          <li className={css.bankreg_instruction}>
            Press the “Sync Now” button to fetch the registration status
          </li>
        </ol>
      </Stack>
      <form>
        <TextfieldStyle
          label="ICICI Corporate Id"
          name="icici_corporate_id"
          className={css.textFieldSize}
          error={validationErr.icici_corporate_id}
          helperText={
            validationErr.icici_corporate_id
              ? ValidationErrMsg.icici_corporate_id
              : ''
          }
          onChange={(e) => {
            reValidate(e);
            setBankDetails({
              ...bankDetails,
              icici_corporate_id: e.target.value,
            });
          }}
          onBlur={reValidate}
        />
        <TextfieldStyle
          label="ICICI User ID"
          name="icici_user_id"
          className={css.textFieldSize}
          error={validationErr.icici_user_id}
          helperText={
            validationErr.icici_user_id ? ValidationErrMsg.icici_user_id : ''
          }
          onChange={(e) => {
            reValidate(e);
            setBankDetails({
              ...bankDetails,
              icici_user_id: e.target.value,
            });
          }}
          onBlur={reValidate}
        />
        <TextfieldStyle
          label="Account Number"
          name="account_number"
          type="number"
          inputProps={{ min: 0 }}
          className={css.textFieldSize}
          error={validationErr.account_number}
          helperText={
            validationErr.account_number ? ValidationErrMsg.account_number : ''
          }
          onChange={(e) => {
            reValidate(e);
            setBankDetails({
              ...bankDetails,
              account_number: e.target.value,
            });
          }}
          onBlur={reValidate}
        />
        <TextfieldStyle
          label="Confirm Account Number"
          name="confirm_account_number"
          type="number"
          inputProps={{ min: 0 }}
          className={css.textFieldSize}
          error={validationErr.confirm_account_number}
          helperText={
            validationErr.confirm_account_number
              ? ValidationErrMsg.confirm_account_number
              : ''
          }
          onChange={(e) => {
            reValidate(e);
            setBankDetails({
              ...bankDetails,
              confirm_account_number: e.target.value,
            });
          }}
          onBlur={reValidate}
        />
        <TextfieldStyle
          label="IFSC"
          name="ifsc"
          className={css.textFieldSize}
          error={validationErr.ifsc}
          helperText={validationErr.ifsc ? ValidationErrMsg.ifsc : ''}
          onChange={(e) => {
            reValidate(e);
            setBankDetails({
              ...bankDetails,
              ifsc: e?.target?.value?.toUpperCase(),
            });
          }}
          onKeyPress={handleIfscKeyPress}
          onBlur={reValidate}
        />
        <TextfieldStyle
          label="Account Holder Name"
          name="account_holder_name"
          className={css.textFieldSize}
          error={validationErr.account_holder_name}
          helperText={
            validationErr.account_holder_name
              ? ValidationErrMsg.account_holder_name
              : ''
          }
          onChange={(e) => {
            reValidate(e);
            setBankDetails({
              ...bankDetails,
              account_holder_name: e.target.value,
            });
          }}
          onBlur={reValidate}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="aliasState"
              checked={aliasState}
              onChange={(e) => setaliasState(e.target.checked)}
            />
          }
          label="Have ICICI Login ID"
          className={classes.chckroot}
        />

        {aliasState && (
          <TextfieldStyle
            label="Alias ID"
            name="alias_id"
            className={css.textFieldSize}
            onBlur={aliasState && reValidate}
            error={aliasState && validationErr.alias_id}
            helperText={
              aliasState && validationErr.alias_id
                ? ValidationErrMsg.alias_id
                : ''
            }
            onChange={(e) => {
              reValidate(e);
              setBankDetails({
                ...bankDetails,
                alias_id: e.target.value,
              });
            }}
          />
        )}

        <Stack className={css.fromContainer_btnwrp}>
          <Button
            className={css.fromContainer_cancelbtn}
            onClick={() => dispatch(closeBankAccount({ type: 'icici' }))}
          >
            Cancel
          </Button>
          <Button className={css.fromContainer_successbtn} onClick={OnSubmit}>
            Link my Account
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default memo(AddBankAccount);
