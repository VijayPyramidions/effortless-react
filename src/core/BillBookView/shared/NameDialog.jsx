import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import Input from '@components/Input/Input.jsx';
import { validateName } from '@services/Validation.jsx';
import * as css from './NameDialog.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
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
    },
  },
}));

const errMsg = 'Please enter valid name';

export default function FormDialog({ onCancel, onSave, open }) {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [err, setErr] = React.useState(false);

  useEffect(() => setName(''), [open]);

  const onClickSave = () => {
    const isValid = validateName(name);
    if (!isValid) setErr(true);
    if (isValid) {
      onSave(name);
    }
  };

  const handleClose = () => {
    onCancel();
  };
  const onChange = (e) => {
    setName(e.target.value);
    setErr(false);
  };

  return (
    <Dialog
      className={`${css.dialog} ${classes.paper}`}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle disableTypography className={css.title}>
        Name bill before saving
      </DialogTitle>
      <DialogContent className={css.dialogContent}>
        <DialogContentText className={css.description}>
          Give your untitled bill a name before it’s saved.
        </DialogContentText>
        <Input
          name="name"
          error={err}
          helperText={err ? errMsg : ''}
          className={`${classes.root}`}
          variant="standard"
          value={name}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onChange={onChange}
          theme="light"
        />
      </DialogContent>
      <DialogActions className={css.actionContainer}>
        <Button className={css.outlineButton} onClick={onCancel} size="medium">
          Cancel
        </Button>
        <Button
          onClick={onClickSave}
          size="medium"
          className={css.submitButton}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
