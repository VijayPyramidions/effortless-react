import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mergeBankAccount } from '@action/Store/Reducers/Banking/BankingState';

import {
  Box,
  Stack,
  Typography,
  Radio,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';

import * as css from '../../bankingnew.scss';

const device = localStorage.getItem('device_detect');

const useStyles = makeStyles(() => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparant',
    },
    '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded': {
      borderRadius: '18px',
      maxWidth: 500,
    },
  },
  RadioRoot: {
    padding: 0,
    marginRight: '16px !important',
    marginLeft: 'unset !important',

    '& .MuiRadio-root': {
      padding: 0,
    },
  },
  RadioRootPromoter: {
    padding: 0,
    marginRight: '20px !important',
    marginLeft: '0px !important',

    '& .MuiRadio-root': {
      padding: '6px',
    },
  },
  listitemRoot: {
    padding:
      device !== 'mobile' ? '16px 32px !important' : '12px 20px !important',
    // marginBottom: '30px',
    borderBottom: '1px solid  rgba(0, 0, 0, 0.10)',

    '& :lastchild': {
      marginBottom: 0,
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },
  listitemRootPromoter: {
    padding: '0px !important',
    marginBottom: '26px',

    '& :lastchild': {
      marginBottom: 0,
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },
  AccountText: {
    '& .MuiListItemText-primary': {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '16px',
      color: '#283049',
    },
    '& .MuiListItemText-secondary': {
      fontWeight: 300,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#6E6E6E',
    },
  },
}));

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,

  backgroundColor: '#FFFFFF',
  border: '1px solid #F08B32',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  padding: 0,
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#FFFFFF',
    border: '1px solid #F08B32',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#F08B32',

  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#F08B32',
  },
});

const BpRadio = (props) => {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
};

const MergeAccounts = ({ data, onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedBank, setSelectedBank] = useState('');
  const [accountList, setAccountList] = useState([]);

  const { businessAccounts } = useSelector((state) => state.Banking);

  console.log(data, selectedBank, businessAccounts);

  useEffect(() => {
    if (businessAccounts) {
      const arr = [];
      Object.keys(businessAccounts)?.forEach((row) =>
        businessAccounts[row]?.forEach((item) => {
          if (
            (item?.service_provider === 'icici' ||
              item?.service_provider === 'yodlee' ||
              (item?.service_provider === 'eff_books' && item?.account_type?.toUpperCase() !== 'CASH')) &&
            data.bank_account_id !== item.bank_account_id
          )
            arr.push(item);
        })
      );
      setAccountList(arr);
    }
  }, []);
  console.log(accountList);
  return (
    <Box sx={{ background: '#FFFFFF', flex: '1' }}>
      <Stack className={css.container}>
        {device !== 'mobile' && (
          <Typography className={css.headertitle}>
            Merging Your Bank Account
          </Typography>
        )}
        <Box className={css.selectedbankwrp}>
          <Stack
            className={css.banklogowrp}
            direction="row"
            alignItems="center"
          >
            <img
              src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                data.account_name === 'Effortless Virtual Account'
                  ? 'effortless'
                  : data.bank_code
              }.svg`}
              alt="Bank Logo"
              width="32px"
              height="32px"
              onError={(e) => {
                e.target.src =
                  'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
              }}
              className={`${css.banklogo} ${css.logorelative}`}
              style={{ marginRight: 8 }}
              loading="lazy"
            />
            <Typography className={css.accountname}>
              {data.display_name || '-'}
            </Typography>
          </Stack>
          <Typography
            className={`${css.accountnumber} ${css.headacc}`}
          >{`A/C No: ${data.bank_account_number}`}</Typography>
          {device !== 'mobile' && (
            <Typography className={css.ifsccode}>{`IFSC: ${
              data.ifsc_code || '-'
            }`}</Typography>
          )}
        </Box>
      </Stack>

      <Stack className={css.acclistcontainer}>
        <Typography className={css.subtitle}>Select Bank Account</Typography>
        <List
          dense
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            padding: 0,
            maxHeight: 'calc(100vh - 301px)',
            overflow: 'auto',
          }}
        >
          {accountList.length > 0 ? (
            <>
              {accountList?.map((item) => (
                <ListItem
                  // secondaryAction={
                  //   // <Typography className={css.accountnumber}>
                  //   ` A/C No: ${item.bank_account_number}`
                  //   // </Typography>
                  // }
                  className={classes.listitemRoot}
                  key={item.bank_account_id}
                  onClick={() => setSelectedBank(item)}
                >
                  <ListItemButton
                    sx={{ padding: '0 0 0 11px' }}
                    className={css.listitembtn}
                  >
                    <FormControlLabel
                      value="bank_account"
                      className={classes.RadioRoot}
                      control={
                        <BpRadio
                          name="selectedBank"
                          checked={
                            selectedBank.bank_account_id ===
                            item.bank_account_id
                          }
                          onChange={() => setSelectedBank(item)}
                        />
                      }
                    />

                    <img
                      src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${item.bank_code}.svg`}
                      alt="Bank Logo"
                      onError={(e) => {
                        e.target.src =
                          'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                      }}
                      width="32px"
                      height="32px"
                      className={css.banklogo}
                      style={{ marginRight: 8 }}
                      loading="lazy"
                    />
                    <ListItemText
                      // primary={
                      //   val?.bank_account_name?.length > 20
                      //     ? `${val?.bank_account_name?.slice(0, 20)}...`
                      //     : val?.bank_account_name || ''
                      // }
                      secondary={
                        <Typography
                          className={`${css.accountnumber} ${css.secondary}`}
                        >
                          {`A/C No: ${item.bank_account_number || '-'}`}
                        </Typography>
                      }
                      primary={
                        <>
                          <Stack
                            sx={{
                              display: 'grid',
                              gridTemplateColumns:
                                device !== 'mobile' ? 'auto 40% 29%' : 'auto',
                              alignItems: 'center',
                            }}
                          >
                            <Typography className={css.accountname}>
                              {item.account_holder_name}
                            </Typography>
                            {device !== 'mobile' && (
                              <>
                                <Typography className={css.accountnumber}>
                                  {` A/C No: ${
                                    item.bank_account_number || '-'
                                  }`}
                                </Typography>

                                <Typography className={css.ifsccode}>
                                  {`IFSC: ${item.ifsc_code || '-'}`}
                                </Typography>
                              </>
                            )}
                          </Stack>
                        </>
                      }
                      className={classes.AccountText}
                    />
                    {/* <Typography>A/C No: 161005506789</Typography> */}
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <ListItem>
              <ListItemText
                primary="No bank found."
                sx={{ marginLeft: '20px' }}
              />
            </ListItem>
          )}
        </List>
      </Stack>
      <Stack className={css.actionbtns}>
        <Button className={css.cancelbtn} onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          disabled={!selectedBank}
          className={css.submitbtn}
          onClick={() =>
            dispatch(
              mergeBankAccount({
                base_account_id: data.bank_account_id,
                target_account_id: selectedBank.bank_account_id,
              })
            )
          }
        >
          Merge Your Account
        </Button>
      </Stack>
    </Box>
  );
};

export default MergeAccounts;
