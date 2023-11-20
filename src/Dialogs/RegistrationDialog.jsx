/* @flow */
/**
 * @fileoverview Registration Dialog component
 */

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Input from '@components/Input/Input.jsx';

import * as css from './RegistrationDialog.scss';

const RegistrationDialog = ({
  open,
  onCancel,
}) => {
  const renderRegsistrationForm = () => {
    return (
      <Grid container className={css.registrationFormContainer}>
        <Grid item xs="12" className={css.field}>
          <Input label="Email" variant="outlined" fullWidth required />
        </Grid>
        <Grid item xs="12" className={css.field}>
          <Input
            label="Password"
            variant="outlined"
            inputProps={{
              type: 'password',
            }}
            required
            fullWidth
            helperText="Password should contain atleast one uppercase letter, one numeric and one special character."
          />
        </Grid>
        <Grid item xs="12" className={css.field}>
          <Input
            label="Retype Password"
            variant="outlined"
            inputProps={{
              type: 'password',
            }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs="12" className={css.field}>
          <Button variant="outlined" className={css.registerButton} fullWidth>
            Register
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <DialogContainer
      title="Payil Registration"
      body={renderRegsistrationForm()}
      open={open}
      onCancel={onCancel}
      onSubmit={() => {}}
    />
  );
};

export default RegistrationDialog;
