/* @flow */
/**
 * @fileoverview  Create Product Dialog Container
 */

import React, { useState } from 'react';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Grid from '@material-ui/core/Grid';
import Input from '@components/Input/Input.jsx';
import Button from '@material-ui/core/Button';

import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const ApproveDeclineDialog = ({
  open,
  onCancel,
  onApprove,
  onDecline,
}: {
  open: boolean,
  onCancel: () => void,
  onApprove: () => void,
  onDecline: () => void,
}) => {
  const [declineReason, setDeclineReason] = useState('');

  const onInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const bodyContent = () => {
    return (
      <div className={css.approveInvoiceContainer}>
        <Grid container spacing={3} className={css.approveInvoiceForm}>
          <Grid item xs={12}>
            <Input
              label="Comments"
              variant="standard"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setDeclineReason)}
              theme="light"
              multiline
              rows={10}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={() => {
                onDecline(declineReason);
              }}
            >
              Decline
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={onApprove}
            >
              Approve
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <DialogContainer
      title="Approve Invoice"
      body={bodyContent()}
      open={open}
      onCancel={onCancel}
      maxWidth="lg"
    />
  );
};

export default ApproveDeclineDialog;
