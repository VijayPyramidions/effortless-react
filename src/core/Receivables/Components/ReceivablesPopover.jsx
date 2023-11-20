import React from 'react';
import { Popover, Drawer, makeStyles, styled, Box } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: 30,
    // width: device === 'desktop' ? '50% !important' : '',
    position: 'relative',
    // maxWidth: device === 'desktop' ? '455px' : 'auto',
  },
}));

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const DeleteDrawer = styled(Drawer)((props) => {
  return {
    '& .MuiPaper-root': {
      minHeight: props.minHeight,
      // maxHeight: props.maxHeight,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      borderRadius: props.borderRadius,
      background: '#FFFFFF',
    },
  };
});

const ReceivablesPopOver = ({
  open,
  handleClose,
  children,
  position = 'bottom',
  drawer,
}) => {
  const deviceDetect = localStorage.getItem('device_detect');
  const classes = useStyles();
  return (
    <>
      {drawer ? (
        <DeleteDrawer
          anchor={deviceDetect === 'desktop' ? 'right' : 'bottom'}
          variant="temporary"
          open={open}
          onClose={handleClose}
          minHeight={deviceDetect === 'desktop' ? '100%' : 'auto'}
          minWidth={deviceDetect === 'desktop' ? '75vh' : '100%'}
          maxWidth={deviceDetect === 'desktop' ? '75vh' : '100%'}
          borderRadius={deviceDetect === 'desktop' ? '0px' : '20px 20px 0 0'}
        >
          {' '}
          <Puller />
          {children}{' '}
        </DeleteDrawer>
      ) : (
        <Popover
          id="Order-by"
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: position,
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: position,
            horizontal: 'center',
          }}
          classes={{
            paper: classes.paper,
          }}
          style={{
            width: deviceDetect === 'desktop' ? '50% !important' : '',
            maxWidth: deviceDetect === 'desktop' ? '455px' : 'auto',
          }}
        >
          {children}
        </Popover>
      )}
    </>
  );
};

export default ReceivablesPopOver;
