import * as Mui from '@mui/material';
// import * as MuiIcons from '@mui/icons-material';
import * as React from 'react';
import Input from '@components/Input/Input.jsx';
// import { makeStyles } from '@material-ui/core';
// import * as themes from '@root/theme.scss';
import { validateRequired, validateIfsc } from '@services/Validation.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
// import * as css from '../banking.scss';

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
  bank_branch: {
    errMsg: 'Enter valid Bank Branch Name',
    test: validateRequired,
  },
};

const EditIndividualAccount = ({ valueCont, closeDrawer }) => {
  const { organization, enableLoading, user, openSnackBar } =
    React.useContext(AppContext);
  const [bankState, setBankState] = React.useState({
    name: '',
    bank_swift_code: '',
    bank_account_number: '',
    bank_account_name: '',
    bank_branch: '',
    bank_ifsc_code: '',
    default: false,
    id: '',
  });
  const initialValidationErr = Object.keys(VALIDATIONBANK).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);

  React.useEffect(() => {
    setBankState({ ...valueCont });
  }, [valueCont]);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(bankState[v]);
      return a;
    }, {});
  };

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[a-zA-Z0-9\b]+$/.test(key))) {
       event.preventDefault();
    }
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value =
      ps?.target?.type === 'checkbox' ? ps?.target?.checked : ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATIONBANK?.[name]?.test?.(value),
    }));
  };

  const getBankDetails = (code) => {
    enableLoading(true);
    RestApi(`ifsc?ifsc=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const { BANK: bank_account_name, BRANCH: bank_branch } = res;
          setBankState((s) => ({
            ...s,
            bank_account_name,
            bank_branch,
          }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setBankState((s) => ({
      ...s,
      [name]: name === 'bank_ifsc_code' ? value?.toUpperCase() : value,
    }));
    if (name === 'bank_ifsc_code' && value.length === 11) {
      getBankDetails(value);
    }
  };

  const submitBank = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/bank_accounts/${bankState?.id}`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          ...bankState,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: 'Updated Successfully',
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res?.error) {
          openSnackBar({
            message: res?.errors?.bank_account_number || 'Something Wrong',
            type: MESSAGE_TYPE.WARNING,
          });
        }
        closeDrawer();
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        closeDrawer();
        enableLoading(false);
      });
  };

  const onSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATIONBANK).forEach((k) => {
      sectionValidation[k] = VALIDATIONBANK[k];
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else {
      submitBank();
    }
  };

  return (
    <Mui.Grid container spacing={3}>
      <Mui.Grid item xs={12}>
        <Input
          name="name"
          label="Account Name"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.name}
          helperText={validationErr.name ? VALIDATIONBANK?.name?.errMsg : ''}
          onChange={onInputChange}
          value={bankState?.name}
          required
        />
      </Mui.Grid>
      {/* <Mui.Grid item xs={12}>
            <Input
            name="bank_account_code"
            label="Account Code"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            // onBlur={reValidate}
            // error={validationErr.bank_account_number}
            // helperText={
            //   validationErr.bank_account_number
            //     ? VALIDATIONBANK?.bank_account_number?.errMsg
            //     : ''
            // }
            onChange={onInputChange}
            value={bankState?.bank_swift_code}
            // required
                />
                </Mui.Grid>
                <Mui.Grid item xs={12}>
            <Input
            name="bank_currency"
            label="Currency"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            // onBlur={reValidate}
            // error={validationErr.bank_account_number}
            // helperText={
            //   validationErr.bank_account_number
            //     ? VALIDATIONBANK?.bank_account_number?.errMsg
            //     : ''
            // }
            // onChange={onInputChange}
            // value={bankState?.bank_account_number}
            // required
                />
                </Mui.Grid> */}
      <Mui.Grid item xs={12}>
        <Input
          name="bank_account_number"
          label="Account Number"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.bank_account_number}
          helperText={
            validationErr.bank_account_number
              ? VALIDATIONBANK?.bank_account_number?.errMsg
              : ''
          }
          onChange={onInputChange}
          value={bankState?.bank_account_number}
          required
          type="number"
        />
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Input
          name="bank_account_name"
          label="Bank Name"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.bank_account_name}
          helperText={
            validationErr.bank_account_name
              ? VALIDATIONBANK?.bank_account_name?.errMsg
              : ''
          }
          onChange={onInputChange}
          value={bankState?.bank_account_name}
          required
        />
      </Mui.Grid>

      <Mui.Grid item xs={12}>
        <Input
          name="bank_ifsc_code"
          label="IFSC Code"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.bank_ifsc_code}
          helperText={
            validationErr.bank_ifsc_code
              ? VALIDATIONBANK?.bank_ifsc_code?.errMsg
              : ''
          }
          onKeyPress={handleIfscKeyPress}
          onChange={onInputChange}
          value={bankState?.bank_ifsc_code}
          required
        />
      </Mui.Grid>

      <Mui.Grid item xs={12}>
        <Input
          name="bank_branch"
          label="Branch Name"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.bank_branch}
          helperText={
            validationErr.bank_branch ? VALIDATIONBANK?.bank_branch?.errMsg : ''
          }
          onChange={onInputChange}
          value={bankState?.bank_branch}
          required
        />
      </Mui.Grid>

      {/* <Mui.Grid item xs={12}>
            <label className={css.editAccountLabelDesc}>
              <p>Description</p>
              <textarea type="text" />
            </label>
            </Mui.Grid>
            
            <Mui.Grid item xs={12}>
            <label className={css.editAccountCheckbox}>
              <input type="checkbox" name='default' checked={bankState?.default} onChange={onInputChange} />
              <p>Save as Primary Bank Account</p>
            </label>
            </Mui.Grid> */}

      <Mui.Grid item xs={12} display="flex" justifyContent="center">
        <Mui.Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
          mt={4}
          mb={2}
        >
          <Mui.Button
            variant="outlined"
            style={{
              borderColor: '#ff7f12a8',
              color: '#f08b32',
              borderRadius: '20px',
              padding: '7px 50px',
              fontWeight: '600',
            }}
            onClick={() => {
              closeDrawer();
            }}
          >
            Cancel
          </Mui.Button>
          <Mui.Button
            contained
            style={{
              background: '#ff7f12a8',
              color: '#fff',
              borderRadius: '20px',
              padding: '7px 50px',
              fontWeight: '600',
            }}
            onClick={() => {
              onSubmit();
            }}
          >
            Update Bank Details
          </Mui.Button>
        </Mui.Stack>
      </Mui.Grid>
    </Mui.Grid>
  );
};

export default EditIndividualAccount;
