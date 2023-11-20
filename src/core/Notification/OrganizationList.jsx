import React, { useState, useEffect, useContext } from 'react';
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';

import sel from '../../assets/allcompsel.svg';
import unsel from '../../assets/allcompunsel.svg';

import * as css from '../Banking/NewBanking/Mobile/bankingmobile.scss';
import * as css_ from './notification.scss';

const useStyles = makeStyles(() => ({
  listitemRoot: {
    padding: '0px !important',
    marginBottom: '20px',

    '&:last-child': {
      marginBottom: 0,
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },

  AccountText: {
    '& .MuiListItemText-primary': {
      fontWeight: 300,
      fontSize: '14px',
      lineHeight: '18px',
      color: '#888888',
    },
  },

  selectedList: {
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
      '& .MuiListItemText-primary': {
        color: '#F08B32 !important',
      },
    },
  },
}));

const OrganizationList = ({ onClose }) => {
  // const [Search, setSearch] = useState('');
  const classes = useStyles();
  const {
    user,
    openSnackBar,
    enableLoading,
    NotificationOrganization,
    selectedOrg,
  } = useContext(AppContext);

  const [onganizations, setOrganizations] = useState([]);
  // const [filtOganizations, setFiltOganizations] = useState([]);

  const selectOrganization = (rowdata) => {
    NotificationOrganization(rowdata);
    onClose();
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
        // setFiltOganizations((prev) => [...prev, ...res.data]);
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

  // const organizationFilter = () => {
  //   const filteredOrg = onganizations?.filter((row) =>
  //     row.short_name.toLowerCase().includes(Search.toLowerCase())
  //   );
  //   setFiltOganizations(filteredOrg);
  // };

  // useEffect(() => {
  //   organizationFilter();
  // }, [Search]);

  useEffect(() => {
    getOrganizationDetails();
  }, []);

  return (
    <Stack className={css.bottommodalcontainer}>
      <Stack
        className={css.emptyBar}
        sx={{ marginBottom: '20px !important' }}
      />
      <Stack className={css_.headerWrp}>
        <Typography variant="h4" className={css_.accpreftitle}>
          Company List
        </Typography>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon sx={{ width: '16px', height: '16px' }} />
        </IconButton>
      </Stack>
      <Typography className={css_.desc}>
        You are still in Agrya Consulting workspace
      </Typography>

      {/* <Stack className={css.searchwrp}>
        <img src={Searchicon} alt="search" width={16} height={16} />
        <input
          type="search"
          value={Search}
          className={css.searchinput}
          placeholder="Search organization"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack> */}

      <List
        dense
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          padding: 0,
          height: '340px',
          overflow: 'auto',
        }}
      >
        <ListItem
          sx={{
            padding: 0,
          }}
          className={classes.listitemRoot}
        >
          <ListItemButton
            sx={{ padding: '0', borderRadius: '4px' }}
            selected={selectedOrg === 'all'}
            onClick={() => selectOrganization('all')}
            className={classes.selectedList}
          >
            <ListItemAvatar sx={{ minWidth: 'initial', marginRight: '12px' }}>
              <Avatar
                alt="Avatar"
                src={selectedOrg === 'all' ? sel : unsel}
                sx={{ width: '24px', height: '24px' }}
              />
            </ListItemAvatar>
            <ListItemText
              primary="All Company"
              className={classes.AccountText}
            />
          </ListItemButton>
        </ListItem>

        {onganizations?.map((item) => (
          <ListItem
            sx={{
              padding: 0,
            }}
            className={classes.listitemRoot}
            key={item.id}
          >
            <ListItemButton
              sx={{
                padding: '4px 20px',
                borderRadius: '4px',
                marginLeft: '-20px',
                marginRight: '-20px',
              }}
              selected={item.id === selectedOrg.id}
              className={classes.selectedList}
              onClick={() => selectOrganization(item)}
            >
              <ListItemAvatar sx={{ minWidth: 'initial', marginRight: '12px' }}>
                {item.logo ? (
                  <Avatar
                    alt="Avatar"
                    src={item.logo}
                    sx={{ width: '24px', height: '24px' }}
                  />
                ) : (
                  <Avatar sx={{ width: '24px', height: '24px' }}>
                    {item.short_name.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={item.short_name}
                className={classes.AccountText}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* ) : (
          <ListItem>
            <ListItemText primary="No bank found." />
          </ListItem>
        )} */}
      </List>
    </Stack>
  );
};

export default OrganizationList;
