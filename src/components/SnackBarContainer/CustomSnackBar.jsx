import * as React from 'react';
import { withStyles } from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarMui = withStyles({
  root: () => {
    const device = localStorage.getItem('device_detect');
    return {
      '& .MuiSnackbarContent-root': {
        backgroundColor: 'white',
        color: '#000',
        maxHeight: device === 'mobile' ? '5vh' : '10vh',
        minHeight: device === 'mobile' ? '4vh' : '8vh',
        minWidth: device === 'mobile' ? 'auto' : '50vh',
        borderRadius: device === 'mobile' ? '0' : '',
      },
    };
  },
})(Snackbar);

export default function SimpleSnackbar({ openSnack, message, setOpenSnack }) {
  const handleClose = () => {
    setOpenSnack(false);
  };
  const device = localStorage.getItem('device_detect');

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <SnackbarMui
      anchorOrigin={{
        vertical: device === 'mobile' ? 'top' : 'bottom',
        horizontal: device === 'mobile' ? 'center' : 'left',
      }}
      open={openSnack}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
      action={action}
      style={{ top: device === 'mobile' ? '20px' : '' }}
    />
  );
}
