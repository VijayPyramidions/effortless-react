/* eslint-disable no-unused-vars */
/* @flow */
/**
 * @fileoverview  Add Vendor
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
// import moment from 'moment';
// import Select from '@components/Select/Select.jsx';
import Input from '@components/Input/Input.jsx';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import CreditCardIcon from '@material-ui/icons/CreditCard';
// import CloudUpload from '@material-ui/icons/CloudUpload';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import {
  validateName,
  validateEmail,
  validatePhone,
} from '@services/Validation.jsx';
import * as css from './MagicLink.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
  },
}));

const VALIDATION = {
  name: {
    errMsg: 'Please provide valid Name',
    test: validateName,
  },
  phone: {
    errMsg: 'Please provide valid Phone',
    test: validatePhone,
  },
  email: {
    errMsg: 'Please provide valid Email',
    test: validateEmail,
  },
};

const initialState = {
  name: '',
  phone: '',
  email: '',
  notifyViaWhatsapp: false,
};

const MagicLink = ({ addManually, magicLinkComplete }) => {
  const classes = useStyles();
  const { organization, enableLoading, user, changeSubView } =
    useContext(AppContext);
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [state, setState] = useState(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(state[v]);
      return a;
    }, {});
  };

  const getEventNameValue = (e) => {
    const name = e?.target?.name;
    const value =
      e?.target?.type === 'checkbox' ? e?.target?.checked : e?.target?.value;
    return [name, value];
  };

  const reValidate = (e) => {
    const [name, value] = getEventNameValue(e);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (e) => {
    reValidate(e);
    const [name, value] = getEventNameValue(e);
    setState((s) => ({ ...s, [name]: value }));
  };

  const sendMagicLink = () => {
    const v = validateAllFields(VALIDATION);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    // todo kbt - call api
    magicLinkComplete();
  };

  return (
    <div className={css.magicLinkContainer}>
      <div className={css.headerContainer}>
        <div className={css.headerLabel}>
          {/* {view === VIEW.MAIN && 'Record an Expense'}
          {view === VIEW.VENDOR && 'Add New Vendor'}
          {view === VIEW.DONE && 'Expense Saved'} */}
          Send a Magic link
        </div>
        <span className={css.headerUnderline} />
      </div>
      <div className={css.inputContainer}>
        <Input
          name="name"
          onBlur={reValidate}
          error={validationErr.name}
          helperText={validationErr.name ? VALIDATION?.name?.errMsg : ''}
          className={`${css.greyBorder} ${classes.root}`}
          label="Name"
          variant="standard"
          value={state.name}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onChange={onInputChange}
          theme="light"
        />
        <Input
          name="phone"
          onBlur={reValidate}
          error={validationErr.phone}
          helperText={validationErr.phone ? VALIDATION?.phone?.errMsg : ''}
          className={`${css.greyBorder} ${classes.root}`}
          label="Phone Number"
          variant="standard"
          value={state.phone}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            type: 'tel',
          }}
          fullWidth
          onChange={onInputChange}
          theme="light"
        />
        <Input
          name="email"
          onBlur={reValidate}
          error={validationErr.email}
          helperText={validationErr.email ? VALIDATION?.email?.errMsg : ''}
          className={`${css.greyBorder} ${classes.root}`}
          label="Email Address"
          variant="standard"
          value={state.email}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onChange={onInputChange}
          theme="light"
        />
        <div className={css.information}>
          Sending your Customer a Magic Link will enable them to add all
          relevant details such as Address, Bank Details, etc. so that your Bill
          Booking process continues to run Effortlessly.
        </div>
        <div className={css.notifyViaWhatsapp}>
          <div htmlFor="whatsappNotify" className={css.label}>
            Notify via WhatsApp
          </div>
          <Checkbox
            name="notifyViaWhatsapp"
            checked={state.notifyViaWhatsapp}
            onChange={onInputChange}
          />
        </div>
      </div>
      <div className={css.actionContainer}>
        <Button
          variant="outlined"
          className={css.outlineButton}
          onClick={() => addManually()}
          size="medium"
        >
          Create Manually
        </Button>
        <Button
          onClick={() => sendMagicLink()}
          size="medium"
          className={css.submitButton}
        >
          Send Now
        </Button>
      </div>
    </div>
  );
};

export default MagicLink;
