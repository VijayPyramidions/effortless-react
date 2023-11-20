import React, { memo, useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { makeStyles } from '@material-ui/core/styles';

import CashAccount from '@assets/BankLogo/cashaccount.svg';
import Searchicon from '@assets/search_1.svg';

import { AccountTypeMobile } from '../../Statement/util';

import * as css from '../bankingmobile.scss';

const useStyles = makeStyles(() => ({
  listitemRoot: {
    padding: '0px !important',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',

    '& :lastchild': {
      marginBottom: 0,
      borderBottom: 'none',
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },

  listTextRoot: {
    marginTop: '0px !important',
    marginBottom: '0px !important',

    '& .MuiListItemText-primary': {
      fontWeight: 200,
      fontSize: '13px',
      lineHeight: '16px',
      color: '#2E3A59',
    },

    '& .MuiListItemText-secondary': {
      fontWeight: 200,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#6E6E6E',
    },
  },
}));

const AccountSelect = ({
  title,
  onClose,
  handleAccountSelect,
  bankListingDetails,
  intialAccButton,
  acctbtnVal,
}) => {
  const classes = useStyles();

  const [search, setSearch] = useState('');
  const [filteredBanks, setfilteredBanks] = useState([]);
  const [accountsLength, setAccountsLength] = useState('');

  const dropDownAccountFilter = () => {
    let type;
    if (acctbtnVal === intialAccButton.business) type = 'company';
    else if (acctbtnVal === intialAccButton.founder) type = 'founder';
    else type = 'virtual';

    if (type === 'company' || type === 'founder') {
      const filteredRow = bankListingDetails.filter((row) =>
        row.sub_account_group === 'Cash Accounts'
          ? row.bank_account_type === type &&
            row.account_name !== 'Effortless Virtual Account' &&
            row?.display_name?.toLowerCase()?.includes(search?.toLowerCase())
          : row.bank_account_type === type &&
            row.account_name !== 'Effortless Virtual Account' &&
            row?.bank_name?.toLowerCase()?.includes(search?.toLowerCase())
      );

      setfilteredBanks(filteredRow);
    }
  };

  const dropDownAccountFilterLength = () => {
    let type;
    if (acctbtnVal === intialAccButton.business) type = 'company';
    else if (acctbtnVal === intialAccButton.founder) type = 'founder';
    else type = 'virtual';

    if (type === 'company' || type === 'founder') {
      const filteredRow = bankListingDetails.filter((row) =>
        row.sub_account_group === 'Cash Accounts'
          ? row.bank_account_type === type &&
            row.account_name !== 'Effortless Virtual Account' &&
            row?.display_name?.toLowerCase()?.includes(search?.toLowerCase())
          : row.bank_account_type === type &&
            row.account_name !== 'Effortless Virtual Account' &&
            row?.bank_name?.toLowerCase()?.includes(search?.toLowerCase())
      );
      setAccountsLength(filteredRow?.length);
    }
  };

  useEffect(() => {
    dropDownAccountFilterLength();
  }, []);

  useEffect(() => {
    dropDownAccountFilter();
  }, [search, acctbtnVal]);

  return (
    <Stack className={css.bottommodalcontainer}>
      <Stack className={css.emptyBar} />
      <Stack className={css.headerWrp}>
        <Typography variant="h4" className={css.accpreftitle}>
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon sx={{ width: '16px', height: '16px' }} />
        </IconButton>
      </Stack>
      {accountsLength > 5 && (
        <Stack
          className={css.searchwrp_select}
          sx={{ margin: '0 0 4px 0 !important' }}
        >
          <img src={Searchicon} alt="search" />
          <input
            type="search"
            className={css.searchinput}
            placeholder="Search a Bank Account"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Stack>
      )}

      <Stack>
        <List
          dense
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            padding: 0,
          }}
        >
          {filteredBanks.length > 0 ? (
            <>
              {filteredBanks?.slice(0, 5)?.map((row) => (
                <ListItem
                  secondaryAction={AccountTypeMobile[row.account_type]}
                  className={classes.listitemRoot}
                  key={row.bank_account_id}
                  onClick={handleAccountSelect(row)}
                >
                  <ListItemButton
                    sx={{ padding: '12px 0 !important' }}
                    className={css.listitembtn}
                  >
                    <ListItemAvatar
                      sx={{
                        minWidth: '8px !important',
                        marginRight: '8px !important',
                      }}
                    >
                      <img
                        alt="Avatar"
                        src={
                          row.sub_account_group === 'Cash Accounts'
                            ? CashAccount
                            : `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                                row.account_name ===
                                'Effortless Virtual Account'
                                  ? 'effortless'
                                  : row.bank_code
                              }.svg`
                        }
                        onError={(e) => {
                          e.target.src =
                            'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                        }}
                        style={{ width: '32px', height: '32px' }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        row.sub_account_group === 'Cash Accounts'
                          ? row.display_name
                          : row.bank_name
                      }
                      secondary={
                        row.sub_account_group === 'Cash Accounts'
                          ? ''
                          : `xxxx ${row.bank_account_number?.slice(-4) || '-'}`
                      }
                      className={classes.listTextRoot}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <ListItem>
              <ListItemText primary="No bank accounts found." />
            </ListItem>
          )}
        </List>
      </Stack>
    </Stack>
  );
};

export default memo(AccountSelect);
