import React from 'react';
import moment from 'moment';

import { useSelector } from 'react-redux';

import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { IndianCurrency } from '@components/utils';

import { makeStyles } from '@material-ui/core/styles';
import {
  DirectionsBikeOutlined as DirectionsBikeOutlinedIcon,
  DriveEtaOutlined as DriveEtaOutlinedIcon,
} from '@mui/icons-material/';

import OutBound from '@assets/outbound.svg';
import InBound from '@assets/inbound.svg';

import * as css from './vehiclehistory.scss';

const useStyles = makeStyles(() => ({
  listitemRoot: {
    padding: '16px 32px !important',
    borderBottom: '1px solid rgba(153, 158, 165, 0.39)',

    '& :lastchild': {
      marginBottom: 0,
      borderBottom: 'none',
    },
  },
  listitemRootMobile: {
    padding: '16px 20px !important',
    borderBottom: '1px solid rgba(153, 158, 165, 0.39)',

    '& :lastchild': {
      marginBottom: 0,
      borderBottom: 'none',
    },
  },

  listTextRoot: {
    marginTop: '0px !important',
    marginBottom: '0px !important',

    '& .MuiListItemText-primary': {
      fontfamily: "'Lexend',sans-serif",
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 'normal',
      color: '#283049',
    },

    '& .MuiListItemText-secondary': {
      fontfamily: "'Lexend',sans-serif",
      fontWeight: 300,
      fontSize: '14px',
      lineHeight: '14px',
      color: '#000',
      marginTop: '10px',
    },
  },
}));

const VehicleHistory = () => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');

  const { mileageHistory } = useSelector(
    (state) => state.ReimbursementSettings
  );

  return (
    <Box className={css.vehiclehistorycontainer}>
      <Typography className={css.historytitle}>
        Own Vehicle Expenses - History
      </Typography>
      <List
        dense
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          padding: 0,
        }}
      >
        {mileageHistory.length > 0 ? (
          <>
            {mileageHistory.map((item) => (
              <ListItem
                secondaryAction={
                  <>
                    <Stack className={css.mileageamoutwrapper}>
                      <Typography
                        className={
                          item.active ? css.amountprogress : css.amountexired
                        }
                      >
                        {IndianCurrency.format(item.mileage_rate)}
                      </Typography>
                      <Stack direction="row">
                        {item.vehicle_type === 'bike' ? (
                          <DirectionsBikeOutlinedIcon
                            className={css.vehicleicon}
                          />
                        ) : (
                          <DriveEtaOutlinedIcon className={css.vehicleicon} />
                        )}
                        <Typography className={css.dureation}>
                          {item.vehicle_type === 'bike' ? '2W' : '4W'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </>
                }
                className={
                  device === 'mobile'
                    ? classes.listitemRootMobile
                    : classes.listitemRoot
                }
                key={item.id}
                //   onClick={handleAccountSelect(row)}
              >
                <ListItemButton
                  sx={{
                    padding: '12px 0 !important',
                    cursor: 'default',
                    pointerEvents: 'none',
                  }}
                  className={css.listitembtn}
                >
                  <ListItemAvatar
                    sx={{
                      minWidth: '8px !important',
                      marginRight: '12px !important',
                    }}
                  >
                    <img
                      alt="icons"
                      src={item.active ? OutBound : InBound}
                      style={{ width: '24px', height: '24px' }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${moment(item.start_date).format(
                      'Do MMM YYYY'
                    )} - ${moment(item.end_date).format('Do MMM YYYY')}`}
                    secondary={
                      <Typography
                        className={
                          item.active ? css.cycleprogress : css.cycleexpired
                        }
                      >
                        {item.active ? 'Ongoing' : 'Cycle Expired'}
                      </Typography>
                    }
                    className={classes.listTextRoot}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        ) : (
          <ListItem>
            <ListItemText primary="No history found." />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default VehicleHistory;
