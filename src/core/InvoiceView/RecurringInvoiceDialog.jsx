/* @flow */
/**
 * @fileoverview  Recurring Invoice Dialog Container
 */

import React, { useState } from 'react';
import moment from 'moment';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Grid from '@material-ui/core/Grid';
import { MuiDatePicker } from '@components/DatePicker/DatePicker.jsx';
import Input from '@components/Input/Input.jsx';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const RecurringInvoiceDialog = ({
  open,
  onCancel,
  onSubmit,
}: {
  open: boolean,
  onCancel: () => void,
  onSubmit: () => void,
}) => {
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [deliveryDate, setDeliveryDate] = useState('');

  const onDateChange = (setter) => (m) => {
    setter(m.format('YYYY-MM-DD'));
  };

  const onCreate = () => {
    onSubmit({
      startDate,
      endDate,
      dayOfCreation: deliveryDate?.toString(),
    });
  };

  const bodyContent = () => {
    return (
      <div className={css.approveInvoiceContainer}>
        <Grid container spacing={2} className={css.approveInvoiceForm}>
          <Grid item xs={6}>
            <MuiDatePicker
              selectedDate={startDate}
              label="From"
              onChange={onDateChange(setStartDate)}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiDatePicker
              selectedDate={endDate}
              label="Till"
              onChange={onDateChange(setEndDate)}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="Date of Delivery"
              variant="standard"
              defaultValue={deliveryDate}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                type: 'tel',
                min: 1,
                max: 29,
              }}
              fullWidth
              onChange={(e) => {
                setDeliveryDate(e.target.value);
              }}
              theme="light"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              Please note that you are seting this Invoice up as a Recurring
              Invoice
            </Typography>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              You will be authorizing Effortless to deliver this Invoice on a
              monthly basis to the Customer mentioned in this Invoice.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={onCreate}
            >
              Confirm
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

export default RecurringInvoiceDialog;
