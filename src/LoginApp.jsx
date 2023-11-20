/* @flow */
/**
 * @fileoverview App launh component
 */

import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Input from './components/Input/Input.jsx';
import RegistrationDialog from './Dialogs/RegistrationDialog.jsx';

import payilLogo from './assets/payil_logo.png';

import * as css from './login.scss';

const LoginApp = () => {
  const [openRegistration, setOpenRegistration] = useState<boolean>(false);

  /** Handle registration dialog open */

  const onRegistrationClick = () => {
    setOpenRegistration(true);
  };

  const closeRegistration = () => {
    setOpenRegistration(false);
  };

  return (
    <div className={css.loginPage}>
      <div className={css.logoContainer}>
        <img className={css.logoImg} src={payilLogo} alt="Logo" />
      </div>
      <div className={css.loginContainer}>
        <div className={css.loginFormContainer}>
          <Input
            label="Username"
            className={css.input}
            variant="outlined"
            fullWidth
          />
          <Input
            label="Password"
            className={css.input}
            variant="outlined"
            inputProps={{
              type: 'password',
            }}
            fullWidth
          />
          <Button variant="outlined" className={css.loginButton} fullWidth>
            Sign in
          </Button>
          <Typography>
            <span className={css.forgotPwdLink}>Forgot Password?</span>
          </Typography>
          <div className={css.newRegister}>
            <Button
              variant="outlined"
              className={css.registerButton}
              fullWidth
              onClick={onRegistrationClick}
            >
              New Registrations
            </Button>
          </div>
        </div>
      </div>
      <RegistrationDialog
        open={openRegistration}
        onCancel={closeRegistration}
      />
    </div>
  );
};

export default LoginApp;
