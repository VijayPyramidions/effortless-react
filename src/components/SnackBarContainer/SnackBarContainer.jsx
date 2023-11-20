/* @flow */
/**
 * @fileoverview Date picker component
 */

import React from 'react';
import { withStyles } from '@material-ui/core';
import * as Mui from '@mui/material';
import * as css from './SnackBarContainer.scss';
import circle from '../../assets/circle-ok.svg';
import cancel from '../../assets/cancel.svg';
import error from '../../assets/error.svg';

const AUTO_HIDE_DURATION = 2000;

export const MESSAGE_TYPE = {
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warning',
  GREETING: 'greeting',
};

const SnackbarMui = withStyles({
  root: {
    '& .MuiSnackbarContent-root': {
      backgroundColor: 'white',
    },
  },
})(Mui.Snackbar);

const SnackBarContainer = ({
  open,
  message,
  type,
  vertical = 'bottom',
  horizontal = 'center',
  handleClose,
}) => {
  const device = localStorage.getItem('device_detect');
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Mui.Slide direction="bottom" ref={ref} {...props} />;
  });
  return (
    <SnackbarMui
      anchorOrigin={{
        vertical: device === 'mobile' ? 'top' : 'bottom',
        horizontal: device === 'mobile' ? 'center' : 'left',
      }}
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      autoHideDuration={AUTO_HIDE_DURATION}
      message={
        <div className={css.messageContainer}>
          {type === MESSAGE_TYPE.INFO && (
            <Mui.Stack direction="row">
              <img src={circle} alt="success" className={css.success} />
              <Mui.Stack>
                <Mui.Typography className={css.successTxt}>
                  Success
                </Mui.Typography>
                <Mui.Typography className={css.message}>
                  {message}
                </Mui.Typography>
              </Mui.Stack>
            </Mui.Stack>
          )}
          {type === MESSAGE_TYPE.WARNING && (
            <Mui.Stack direction="row">
              <img src={error} alt="error" className={css.tryagain} />
              <Mui.Stack>
                <Mui.Typography className={css.successTxt}>
                  Try again
                </Mui.Typography>
                <Mui.Typography
                  className={css.message}
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {message}
                </Mui.Typography>
              </Mui.Stack>
            </Mui.Stack>
          )}
          {type === MESSAGE_TYPE.GREETING && (
            <Mui.Stack direction="row">
              <img src={circle} alt="success" className={css.success} />
              <Mui.Stack>
                <Mui.Typography className={css.successTxt}>
                  Hello
                </Mui.Typography>
                <Mui.Typography className={css.message}>
                  {message}
                </Mui.Typography>
              </Mui.Stack>
            </Mui.Stack>
          )}
          {type === MESSAGE_TYPE.ERROR && (
            <Mui.Stack direction="row">
              <img src={cancel} alt="cancel" className={css.declined} />
              <Mui.Stack>
                <Mui.Typography className={css.successTxt}>
                  declined
                </Mui.Typography>
                <Mui.Typography className={css.message}>
                  {message}
                </Mui.Typography>
              </Mui.Stack>
            </Mui.Stack>
          )}
          {type === 'ERRORINVOICE' && (
            <Mui.Stack direction="row">
              <img src={cancel} alt="cancel" className={css.declined} />
              <Mui.Stack>
                <Mui.Typography className={css.successTxt}>
                  UNSUCCESSFUL
                </Mui.Typography>
                <Mui.Typography className={css.message}>
                  {message}
                </Mui.Typography>
              </Mui.Stack>
            </Mui.Stack>
          )}
        </div>
      }
      key={vertical + horizontal}
    />
  );
};

export default SnackBarContainer;
