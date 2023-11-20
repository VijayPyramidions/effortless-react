import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Backdrop, Modal, Fade, Button, Stack } from '@mui/material';
import { Typography } from '@material-ui/core';

import AppContext from '@root/AppContext';
import NotificationTabs from '@components/NotificationTabs/NotificationTabs';

import * as css from './NotificationContainer.scss';

const style = {
  position: 'absolute',
  top: '80px',
  right: '45px',
  width: 480,
  bgcolor: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.08)',
  outline: 'none',
};

const NotificationContainer = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { organization, NotificationOrganization } = useContext(AppContext);

  const emptyRef = useRef();

  const ViewAll = () => {
    emptyRef?.current?.emptyData();
    navigate('/notification', { state: { show: 'navigation' } });
    NotificationOrganization('all');
    handleClose();
  };

  useEffect(() => {
    NotificationOrganization(organization);
  }, []);

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Stack sx={{ position: 'relative' }}>
              <Typography variant="h4" className={css.notificationheader}>
                Notifications
              </Typography>
              <NotificationTabs onClose={handleClose} ref={emptyRef} />
              <Button className={css.viewAllbtn} onClick={ViewAll}>
                View All
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default NotificationContainer;
