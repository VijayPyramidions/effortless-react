/* @flow */
/**
 * @fileoverview Registration Dialog component
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import * as themes from '@root/theme.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  root: {
    margin: 0,
  },
  title: {
    fontWeight: 400,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Dialog = withStyles(() => ({
  paper: {
    margin: 0,
    minWidth: '350px',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
  },
  scrollPaper: {
    alignItems: 'flex-end',
  },
}))(MuiDialog);

const PrimaryButton = withStyles(() => ({
  root: {
    color: themes.colorPrimaryButton,
    fontWeight: 400,
  },
}))(Button);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6" classes={{ root: classes.title }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(() => ({
  root: {
    padding: 0,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const DialogContainer = ({
  open,
  body,
  onSubmit,
  onCancel,
  dismissOnBackdropClick,
  title,
  cancelText = 'Cancel',
  submitText = 'Submit',
  confirmDialog = false,
}) => {
  return (
    <Dialog
      onClose={(e, reason) => {
        if (reason === 'backdropClick' && !dismissOnBackdropClick) {
          return;
        }
        if (onCancel) onCancel();
      }}
      open={open}
      TransitionComponent={Transition}
      fullWidth
    >
      {title && (
        <DialogTitle id="dialogTitle" onClose={onCancel}>
          {title}
        </DialogTitle>
      )}
      <DialogContent>{body}</DialogContent>
      {onSubmit && (
        <DialogActions>
          {!confirmDialog && (
            <Button autoFocus onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          <PrimaryButton onClick={onSubmit}>{submitText}</PrimaryButton>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DialogContainer;
