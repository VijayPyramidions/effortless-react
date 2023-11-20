import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import Grid from '@material-ui/core/Grid';
import Box from '@mui/material/Box';

import * as css from './ConfirmationDialog.scss';

const AlertDialog = (props) => {
  const {
    handleClick,
    name,
    initopen,
    message,
    buttontext1,
    buttontext2,
    ptype,
  } = props;
  const [openModal, setOpenModal] = React.useState(initopen);
  const [selectedYes, setselectedYes] = useState(false);
  const [buttonselected1, setbuttonselected1] = useState('');
  const answer = { answer: 'No' };

  const handleClose = () => {
    if (
      document.querySelector('[role="presentation"]') &&
      document.querySelector('[role="presentation"]').querySelector('div')
    ) {
      document
        .querySelector('[role="presentation"]')
        .querySelector('div').style.opacity = '.1';
    }
    handleClick(answer);
    setOpenModal(!openModal);
  };

  const handleCloseYes = () => {
    if (
      document.querySelector('[role="presentation"]') &&
      document.querySelector('[role="presentation"]').querySelector('div')
    ) {
      document
        .querySelector('[role="presentation"]')
        .querySelector('div').style.opacity = '.1';
    }
    setselectedYes(true);
  };

  useEffect(() => {
    if (selectedYes) {
      answer.answer = 'Yes';
      setbuttonselected1(
        [css.button1, css.custompopupsButtonsSelected].join(' ')
      );
      handleClick(answer);
      setOpenModal(!openModal);
    }
  }, [selectedYes]);

  useEffect(() => {
    setTimeout(() => {
      if (
        document.querySelector('[role="presentation"]') &&
        document.querySelector('[role="presentation"]').querySelector('div')
      ) {
        document
          .querySelector('[role="presentation"]')
          .querySelector('div').style.opacity = '.1';
      }
    }, 10);
    setbuttonselected1(css.button1);
  }, []);

  const buttonselected2 = [css.button1, css.custompopupsButtonsSelected].join(
    ' '
  );

  const dialogstyle =
    ptype === 'mobile'
      ? {
          bottom: '0',
          padding: '20px',
          margin: '0',
          background: '#FFFFFF',
          borderRadius: '16px',
        }
      : {
          borderRadius: '16px',
          width: '414px',
          background: '#FFFFFF',
          padding: '20px',
        };

  return (
    <Box>
      <Dialog
        disableEnforceFocus
        open={openModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: dialogstyle,
          className: css.mainAlert,
        }}
        className={css.dialogContainer}
      >
        <DialogTitle id="alert-dialog-title" className={css.headTitle}>
          {/* <Grid
            container
            direction="row"
            justify-content="space-between"
            alignItems="center"
          >
            <Grid item xs={11} sm={11}> */}
          {message}
          {/* </Grid>
          </Grid> */}
        </DialogTitle>
        <DialogContent className={css.bodyContainer}>
          <DialogContentText
            id="alert-dialog-description"
            className={css.bodyText}
          >
            {name}
          </DialogContentText>
          <Box
            className={
              (buttontext1.length === 0 && buttontext2.length !== 0) ||
              (buttontext1.length !== 0 && buttontext2.length === 0)
                ? css.buttonHolder_single
                : css.buttonHolder_double
            }
          >
            {buttontext2.length > 0 ? (
              <Button className={buttonselected1} onClick={handleClose}>
                {buttontext2}
              </Button>
            ) : (
              ''
            )}
            {buttontext1.length > 0 ? (
              <Button className={buttonselected2} onClick={handleCloseYes}>
                {buttontext1}
              </Button>
            ) : (
              ''
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AlertDialog;
