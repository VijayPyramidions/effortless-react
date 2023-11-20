/* @flow */
/**
 * @fileoverview  Create Invoice Template
 */

import React, { useState } from 'react';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Grid from '@material-ui/core/Grid';
import Input from '@components/Input/Input.jsx';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const CreateInvoiceTemplate = ({
  open,
  onCancel,
  onSubmit,
}: {
  open: boolean,
  onCancel: () => void,
  onSubmit: () => void,
}) => {
  const [templateName, setTemplateName] = useState<string>('');

  const bodyContent = () => {
    return (
      <div className={css.approveInvoiceContainer}>
        <Grid container spacing={2} className={css.approveInvoiceForm}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              Give this template a Unique name so that you can easily search for
              it.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Input
              label="Template Name"
              variant="standard"
              defaultValue={templateName}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={(e) => {
                setTemplateName(e.target.value);
              }}
              theme="light"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              Please note that you are setting this Invoice up as a Template.
            </Typography>
            <Typography
              variant="subtitle2"
              className={css.recurringInvoiceNote}
            >
              By doing this, you will be able re-use this invoice details and
              share them with multiple customers as per your requirements.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={() => {
                onSubmit({
                  templateName,
                });
              }}
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
      title="Create this template"
      body={bodyContent()}
      open={open}
      onCancel={onCancel}
      maxWidth="lg"
    />
  );
};

export default CreateInvoiceTemplate;
