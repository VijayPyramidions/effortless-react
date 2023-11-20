import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import * as css from './NameDialog.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    minHeight: '48px',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      margin: 'auto',
      paddingLeft: '12px',
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
    '& .MuiDialogContent-root': {
      overflow: 'none',
    },
  },
  paper: {
    '& .MuiPaper-root': {
      borderRadius: '16px',
      padding: '20px 0',
    },
    '& .MuiDialogContentText-root': {
      marginBottom: '0px !important',
    },
    '& .MuiDialogActions-root': {
      justifyContent: 'center !important',
    },
    '& .MuiDialogActions-root .MuiButton-root': {
      flex: 'unset',
      width: '50%',
    },
  },
}));

export default function FormDialog({ onCancel, onSave, open }) {
  const classes = useStyles();

  const onProceed = () => {
    onSave();
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <Dialog
      className={`${css.dialog} ${classes.paper}`}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle disableTypography className={css.title}>
        Verification Required
      </DialogTitle>
      <DialogContent className={css.dialogContent}>
        <DialogContentText className={css.description}>
          By opting for Automatic Settlement, you are authorizing Effortless to
          make a Payment to the selected Vendor on the Due Date.
          <br />
          <br />
          Click Agree to Proceed. Else, change your Settlement Mode.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={css.actionContainer}>
        <Button onClick={onProceed} size="medium" className={css.submitButton}>
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
