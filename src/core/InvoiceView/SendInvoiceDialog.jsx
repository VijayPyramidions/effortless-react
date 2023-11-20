/* @flow */
/**
 * @fileoverview  Create Product Dialog Container
 */

import React, { useState, useEffect } from 'react';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Input from '@components/Input/Input.jsx';
import Grid from '@material-ui/core/Grid';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import Select from '@components/Select/Select.jsx';
import { validateEmail } from '@services/Validation.jsx';

import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const SendInvoiceDialog = ({
  open,
  onCancel,
  onSubmit,
  orgId,
  customerId,
  activeToken,
}: {
  open: boolean,
  onCancel: () => void,
  onSubmit: (*) => void,
  orgId: string,
  customerId: string,
  activeToken: string,
}) => {
  const [sendTo, setSendTo] = useState('');
  const [copyAddr, setCopyAddr] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendToAddrList, setSendToAddrList] = useState([]);
  const [validationErr, setValidationErr] = useState({
    email: false,
  });

  const onInputBlur = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    const isValid = {
      email: validateEmail,
    };
    setValidationErr((s) => ({ ...s, [name]: !isValid?.[name]?.(value) }));
  };

  const onInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const onSend = () => {
    const emailValid = validateEmail(copyAddr);
    if (!emailValid) {
      setValidationErr((s) => ({
        ...s,
        email: !emailValid,
      }));
      return;
    }
    onSubmit({
      sendTo,
      copyAddr,
      emailBody,
    });
  };

  const fetchContactByCustomer = () => {
    RestApi(`organizations/${orgId}/customers/${customerId}/contacts`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setSendToAddrList(
          res.data.map((s) => ({
            payload: s.email,
            text: s.email,
          })),
        );
      }
    });
  };

  useEffect(() => {
    fetchContactByCustomer();
  }, []);

  const bodyContent = () => {
    return (
      <div className={css.addCustomerContainer}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              label="Send To"
              options={sendToAddrList}
              defaultValue={
                sendToAddrList.length > 0 ? sendToAddrList[0].payload : ''
              }
              onChange={onInputChange(setSendTo)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              label="COPY"
              variant="standard"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              error={validationErr.email}
              helperText={
                validationErr.email ? 'Please provide valid email' : ''
              }
              onBlur={onInputBlur}
              fullWidth
              onChange={onInputChange(setCopyAddr)}
              theme="light"
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              label="EMAIL BODY"
              variant="standard"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setEmailBody)}
              theme="light"
              multiline
              rows={10}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <DialogContainer
      title="Send Invoice"
      body={bodyContent()}
      open={open}
      onCancel={onCancel}
      onSubmit={onSend}
      maxWidth="lg"
    />
  );
};

export default SendInvoiceDialog;
