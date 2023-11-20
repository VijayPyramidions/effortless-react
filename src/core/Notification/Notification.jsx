import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Radio,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';

import * as css from './notification.scss';
import NotificationTabs from '../../components/NotificationTabs/NotificationTabs';

const useStyles = makeStyles({
  selectedList: {
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
      '& .MuiListItemText-primary': {
        color: '#F08B32 !important',
        fontWeight: '400 !important',
      },
    },
  },
});

const Notification = () => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');

  const emptyRef = useRef();

  const { user, openSnackBar, enableLoading, NotificationOrganization } =
    useContext(AppContext);

  const [onganizations, setOrganizations] = useState([]);
  const [selectedOrg, setselectedOrg] = useState('all');

  const selectOrganization = (rowdata) => {
    setselectedOrg(rowdata);
    NotificationOrganization(rowdata);
    emptyRef?.current?.emptyData();
  };

  const getOrganizationDetails = async () => {
    await RestApi(`organizations`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setOrganizations((prev) => [...prev, ...res.data]);
        NotificationOrganization('all');
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e?.message || 'Unknown error occured',
          type: 'error',
        });
        enableLoading(false);
      });
  };

  useEffect(() => {
    getOrganizationDetails();
  }, []);
  return (
    <Box
      className={css.maincontainer}
      sx={device !== 'mobile' ? { display: 'flex' } : { display: 'block' }}
    >
      {device !== 'mobile' && (
        <Stack>
          <Stack className={css.companylist}>
            <Typography className={css.companylisttitle}>
              Company List
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, padding: 0 }}>
              <ListItem disablePadding className={css.listItem}>
                <ListItemButton
                  onClick={() => selectOrganization('all')}
                  dense
                  className={`${css.listItemBtn} ${classes.selectedList}`}
                  selected={selectedOrg === 'all'}
                >
                  <ListItemIcon className={css.radiobtn}>
                    <Radio
                      edge="start"
                      disableRipple
                      checked={selectedOrg === 'all'}
                      sx={{
                        color: '#DBDBDB',
                        '&.Mui-checked': {
                          color: '#F08B32',
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="All Company"
                    className={css.listItemText}
                  />
                </ListItemButton>
              </ListItem>

              {onganizations?.map((item) => (
                <ListItem disablePadding className={css.listItem} key={item.id}>
                  <ListItemButton
                    onClick={() => selectOrganization(item)}
                    dense
                    className={`${css.listItemBtn} ${classes.selectedList}`}
                    selected={item.id === selectedOrg.id}
                  >
                    <ListItemIcon className={css.radiobtn}>
                      <Radio
                        edge="start"
                        disableRipple
                        checked={item.id === selectedOrg.id}
                        sx={{
                          color: '#DBDBDB',
                          '&.Mui-checked': {
                            color: '#F08B32',
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.short_name}
                      className={css.listItemText}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Stack>
      )}
      <Stack className={css.notificationtabscontainer}>
        <NotificationTabs maxheight ref={emptyRef} />
      </Stack>
    </Box>
  );
};

export default Notification;
