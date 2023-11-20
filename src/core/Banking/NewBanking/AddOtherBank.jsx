import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import axiosInst from '@action/ApiConfig/AxiosInst';

import { Box, Button, Typography, Stack } from '@mui/material';
import Checkbox from '@material-ui/core/Checkbox';
import { validateRequired, validateIfsc,validateSwiftCode } from '@services/Validation';

import {
  enableLoading,
  // openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import { InputText } from '../../../components/Input/Input';
import * as css from './bankingnew.scss';
import { addOtherBankManually } from '../../../StateManagement/Store/Reducers/Banking/BankingState';

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

const VALIDATIONBANK = {
  name: {
    errMsg: 'Enter valid Name',
    test: validateRequired,
  },
  bank_account_number: {
    errMsg: 'Enter valid Account Number',
    test: validateRequired,
  },
  bank_account_name: {
    errMsg: 'Enter valid Bank Name',
    test: validateRequired,
  },
  bank_ifsc_code: {
    errMsg: 'Enter valid IFSC Code',
    test: validateIfsc,
  },
  bank_swift_code: {
    errMsg: 'Enter valid Swift Code',
    test: validateSwiftCode,
  },
  bank_branch: {
    errMsg: 'Enter valid Bank Branch Name',
    test: validateRequired,
  },
};

const AddOtherBank = ({ onClose }) => {
  const dispatch = useDispatch();

  const initialValidationErr = Object.keys(VALIDATIONBANK).map((k) => ({
    [k]: false,
  }));

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[a-zA-Z0-9\b]+$/.test(key))) {
       event.preventDefault();
    }
  };
  const handleSwiftKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const [bankState, setBankState] = useState({
    name: '',
    bank_account_number: '',
    bank_account_name: '',
    bank_branch: '',
    bank_ifsc_code: '',
    bank_swift_code: '',
    nick_name: '',
  });
  const[noIfsc,setNoIfsc] = useState(false);
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value =
      ps?.target?.type === 'checkbox' ? ps?.target?.checked : ps?.target?.value;
    return [name, value];
  };

  const validateAllFields = (validationData) => {
    if(noIfsc){
      return Object.keys(validationData).reduce((a, v) => {
        a[v] = v !== 'bank_ifsc_code' && !validationData?.[v]?.test(bankState[v]);
        return a;
      }, {});
    }  
      return Object.keys(validationData).reduce((a, v) => {
        a[v] = v !== 'bank_swift_code' && !validationData?.[v]?.test(bankState[v]);
        return a;
      }, {});
    
    
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATIONBANK?.[name]?.test?.(value),
    }));
  };

  const onIFSCCodeChange = (e) => {
    dispatch(enableLoading(true));
    axiosInst
      .get(`ifsc?ifsc=${e}`)
      .then((res) => {
        dispatch(enableLoading(false));

        if (res?.data && !res?.data?.error) {
          setBankState((s) => ({
            ...s,
            bank_account_name: res?.data?.BANK,
            bank_branch: res?.data?.BRANCH,
          }));
        }
      })
      .catch(() => {
        dispatch(enableLoading(false));
      });
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    if(name === 'noIfsc') {
      setNoIfsc(value);
      return;
    }
    if(name === 'bank_ifsc_code'){
      setBankState((s) => ({
        ...s,
        [name]: name === 'bank_ifsc_code' || name === 'bank_swift_code'? value?.toUpperCase() : value,
        bank_swift_code: null
      }));
    } else if(name === 'bank_swift_code'){
      setBankState((s) => ({
        ...s,
        [name]: name === 'bank_ifsc_code' || name === 'bank_swift_code'? value?.toUpperCase() : value,
        bank_ifsc_code: null
      }));
    } else {
      setBankState((s) => ({
        ...s,
        [name]: name === 'bank_ifsc_code' || name === 'bank_swift_code'? value?.toUpperCase() : value,
      }));
    }
    if (
      name === 'bank_ifsc_code' &&
      (value.length === 11 || value.length === 0)
    ) {
      if (value.length === 0) {
        setBankState((s) => ({
          ...s,
          bank_account_name: '',
          bank_branch: '',
        }));
        return;
      }

      onIFSCCodeChange(value);
    }
  };

  const OnSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATIONBANK).forEach((k) => {
      sectionValidation[k] = VALIDATIONBANK[k];
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }

    dispatch(enableLoading(true));
    dispatch(addOtherBankManually(bankState));
  };

  return (
    <Box className={css.formContainer}>
      <Typography variant="h4" className={css.fromContainer_header}>
        Add Bank Account Details
      </Typography>
      {/* <Typography className={css.fromContainer_subheader}>
        Modify this Bank Account&apos;s Details
      </Typography> */}
      <Stack>
        <TextfieldStyle
          label="Account Holder Name"
          name="name"
          className={css.textFieldSize}
          value={bankState?.name}
          error={validationErr.name}
          helperText={validationErr.name ? VALIDATIONBANK?.name?.errMsg : ''}
          onChange={onInputChange}
          onBlur={reValidate}
        />
        <TextfieldStyle
          label="Account Number"
          name="bank_account_number"
          type="number"
          className={css.textFieldSize}
          value={bankState?.bank_account_number}
          error={validationErr.bank_account_number}
          helperText={
            validationErr.bank_account_number
              ? VALIDATIONBANK?.bank_account_number?.errMsg
              : ''
          }
          onChange={onInputChange}
          onBlur={reValidate}
        />

<div className={css.noIfsc}>
                <Checkbox
                  name="noIfsc"
                  checked={noIfsc}
                  onChange={onInputChange}
                  style={{
                    color: '#F08B32',
                    textTransform: 'capitalize',
                  }}
                />
                <div htmlFor="whatsappNotify" className={css.label}>
                  I do not have IFSC code
                </div>
              </div>

        {!noIfsc ? <TextfieldStyle
          label="Bank IFSC Code"
          name="bank_ifsc_code"
          className={css.textFieldSize}
          value={bankState?.bank_ifsc_code}
          error={validationErr.bank_ifsc_code}
          helperText={
            validationErr.bank_ifsc_code
              ? VALIDATIONBANK?.bank_ifsc_code?.errMsg
              : ''
          }
          onChange={onInputChange}
          onBlur={reValidate}
          onKeyPress={handleIfscKeyPress}
        />
:
<TextfieldStyle
          label="Bank Swift Code"
          name="bank_swift_code"
          className={css.textFieldSize}
          value={bankState?.bank_swift_code}
          error={validationErr.bank_swift_code}
          helperText={
            validationErr.bank_swift_code
              ? VALIDATIONBANK?.bank_swift_code?.errMsg
              : ''
          }
          onChange={onInputChange}
          onBlur={reValidate}
          onKeyPress={handleSwiftKeyPress}
        />
}

        <TextfieldStyle
          label="Bank Name"
          name="bank_account_name"
          className={css.textFieldSize}
          value={bankState?.bank_account_name}
          error={validationErr.bank_account_name}
          helperText={
            validationErr.bank_account_name
              ? VALIDATIONBANK?.bank_account_name?.errMsg
              : ''
          }
          onChange={onInputChange}
          onBlur={reValidate}
        />
        <TextfieldStyle
          label="Branch Name"
          name="bank_branch"
          className={css.textFieldSize}
          value={bankState?.bank_branch}
          error={validationErr.bank_branch}
          helperText={
            validationErr.bank_branch ? VALIDATIONBANK?.bank_branch?.errMsg : ''
          }
          onChange={onInputChange}
          onBlur={reValidate}
        />

        <InputText
          label="Display Name"
          name="nick_name"
          className={css.textfieldStyle}
          value={bankState?.display_name}
          onChange={onInputChange}
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          theme="light"
        />
        <Stack className={css.fromContainer_btnwrp} sx={{ marginTop: '24px' }}>
          <Button className={css.fromContainer_cancelbtn} onClick={onClose}>
            Cancel
          </Button>
          <Button className={css.fromContainer_successbtn} onClick={OnSubmit}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddOtherBank;
