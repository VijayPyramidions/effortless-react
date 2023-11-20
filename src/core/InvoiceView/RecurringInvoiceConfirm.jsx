/* @flow */
/**
 * @fileoverview  Recurring Invoice Dialog Container
 */

import React from 'react';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const RecurringInvoiceConfirm = ({
  open,
  invoiceId,
  dayOfDelivery,
  onCancel,
  onSubmit,
}: {
  open: boolean,
  invoiceId: string,
  dayOfDelivery: string,
  onCancel: () => void,
  onSubmit: () => void,
}) => {
  const bodyContent = () => {
    return (
      <div className={css.approveInvoiceContainer}>
        <Grid container spacing={2} className={css.approveInvoiceForm}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              This Invoice {invoiceId} has been set as a Recurring Invoice.
            </Typography>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              It will be sent to the customer on {dayOfDelivery} every month.
            </Typography>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              If you wish to modify this configuration, visit the Invoice
              Section for more details.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={onSubmit}
            >
              Return to Dashboard
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <DialogContainer
      title="RECURRING INVOICE"
      body={bodyContent()}
      open={open}
      onCancel={onCancel}
      maxWidth="lg"
    />
  );
};

export default RecurringInvoiceConfirm;
