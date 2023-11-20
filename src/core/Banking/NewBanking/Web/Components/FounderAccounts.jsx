import React, { memo, useEffect, useState, useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import { useDispatch, useSelector } from 'react-redux';

import {
  Typography,
  Stack,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Checkbox,
  Popover,
  MenuItem,
} from '@mui/material';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { makeStyles } from '@material-ui/core/styles';

import {
  setActiveList,
  setActive,
  setBanks,
  addBankAccounts,
  AccountPreference,
  addOtherBank,
} from '@action/Store/Reducers/Banking/BankingState';

import { IndianCurrency, SumAmount } from '@components/utils';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import edit_icon from '@assets/accedit.svg';
import bank_icon from '@assets/bankicon.svg';

import { StyledMenu, ListsItem } from '../../Statement/util';

import * as css from '../../bankingnew.scss';

const useStyles = makeStyles(() => ({
  PopoverRoot: {
    '& .MuiPopover-paper': {
      background: '#FFFFFF',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      width: '339px',
      // top: '545px !important',
      left: '248px !important',
    },
  },

  titleRoot: {
    fontWeight: '300 !important',
    fontSize: '14px !important',
    lineHeight: '16px !important',
    color: '#414141',
    position: 'relative',
    marginTop: '12px !important',
    padding: '0 0 4px 12px',
    marginBottom: '8px !important',

    '&:before': {
      content: "''",
      width: '13px',
      height: '2px',
      position: 'absolute',
      bottom: 0,
      background: ' #f08b32',
      borderRadius: '8px',
    },
  },

  listItemRoot: {
    padding: 0,
    marginBottom: '8px',
    borderBottom: '1px solid #dcdcdc',
    cursor: 'pointer',

    '&:last-child': {
      marginBottom: '4px',
      borderBottom: 'none !important',
    },
  },

  listTextRoot: {
    margin: 0,

    '& .MuiListItemText-primary': {
      fontWeight: 200,
      fontSize: '14px',
      lineHeight: '16px',
      color: '#414141',
    },
  },
}));

const InitialState = [
  { name: 'Founder’s Bank Account', check: true },
  { name: 'Owner’s Bank Account', check: false },
  { name: 'Promoter’s Bank Account', check: false },
];

const FounderAccounts = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { founderAccounts, activeList, active, founderAccountHeader } =
    useSelector((state) => state.Banking);

  const { userPermissions } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [FounderAccHeader, setFounderAccHeader] = useState(
    InitialState[0].name
  );
  const [havePermission, setHavePermission] = useState({ open: false });

  const [AccHeaderState, setAccHeaderState] = useState(InitialState);

  const [preferenceShow, setPreferenceShow] = useState(null);
  const preferenceOpen = Boolean(preferenceShow);

  const yodleeConnect = () => {
    if (!userPermissions?.Banking['Connecting a Bank']?.create_yodlee_account) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }

    dispatch(
      addBankAccounts({
        type: 'Add Others',
        fastConfig: 'add_bank',
        fastConfigLocal: 'add_bank',
        accountType: 'founder',
      })
    );
  };

  const handleAccountClick = (val) => () => {
    setFounderAccHeader(val.name);

    const newState = AccHeaderState.map((row) => {
      if (row.name === val.name) return { ...row, check: true };
      return { ...row, check: false };
    });

    setAccHeaderState(newState);
    setPreferenceShow(null);

    let name;
    if (val.name === 'Founder’s Bank Account') name = 'founder';
    else if (val.name === 'Owner’s Bank Account') name = 'owner';
    else if (val.name === 'Promoter’s Bank Account') name = 'promoter';

    dispatch(AccountPreference(name));
  };

  const AddBankAccounts = (row) => {
    if (row === 'Add Other Bank') yodleeConnect();
    else dispatch(addOtherBank(true));

    setAnchorEl(null);
  };

  useEffect(() => {
    if (founderAccountHeader !== '') {
      let index;
      if (founderAccountHeader === 'founder') index = 0;
      else if (founderAccountHeader === 'owner') index = 1;
      else if (founderAccountHeader === 'promoter') index = 2;

      setFounderAccHeader(InitialState[index].name);
      const newState = AccHeaderState.map((row) => {
        if (row.name === InitialState[index].name)
          return { ...row, check: true };
        return { ...row, check: false };
      });
      setAccHeaderState(newState);
    }
  }, [founderAccountHeader]);

  useEffect(() => {
    dispatch(AccountPreference());
  }, []);

  return (
    <>
      <Stack
        className={
          activeList.Founder
            ? `${css.acclistcontainer} ${css.activecontainer}`
            : css.acclistcontainer
        }
        onClick={() => dispatch(setActiveList('Founder'))}
      >
        <Stack className={`${css.acctypeheader} `}>
          <Typography variant="h4" className={css.acctypetext}>
            {FounderAccHeader}
            <IconButton
              sx={{ padding: '0px', marginLeft: '12px' }}
              onClick={(e) => setPreferenceShow(e.currentTarget)}
            >
              <img src={edit_icon} alt="account" />
            </IconButton>
          </Typography>
          {founderAccounts !== undefined && (
            //   <Button className={css.accconnectbtn} onClick={yodleeConnect}>
            //     <AddRoundedIcon fontSize="small" />
            //     Connect
            //   </Button>
            // )}

            <Button
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              disableElevation
              className={css.accconnectbtn}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <AddRoundedIcon fontSize="small" />
              Connect
            </Button>
          )}
          <StyledMenu
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            listwidth={198}
          >
            {['Add Other Bank', 'Add Bank Manually'].map((row) => (
              <MenuItem
                key={row}
                className={css.dropdownitem}
                onClick={() => AddBankAccounts(row)}
              >
                {row}
              </MenuItem>
            ))}
          </StyledMenu>

          <Popover
            open={preferenceOpen}
            anchorEl={preferenceShow}
            onClose={() => setPreferenceShow(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            className={classes.PopoverRoot}
          >
            <Typography className={classes.titleRoot}>
              Select Preference
            </Typography>
            <List sx={{ paddingTop: '0px' }}>
              {AccHeaderState.map((val) => (
                <ListItem
                  key={val.name}
                  className={classes.listItemRoot}
                  onClick={handleAccountClick(val)}
                >
                  <Checkbox
                    icon={<CircleUnchecked />}
                    checkedIcon={<CircleCheckedFilled />}
                    checked={val.check}
                    sx={{
                      color: '#E5E5E5',
                      marginLeft: '3px',
                      padding: 0,
                      marginRight: '12px',

                      '&.Mui-checked': {
                        color: '#F08B32',
                      },
                    }}
                    onChange={handleAccountClick(val)}
                  />
                  <ListItemText
                    primary={val.name}
                    className={classes.listTextRoot}
                  />
                </ListItem>
              ))}
            </List>
          </Popover>
        </Stack>
        {founderAccounts === undefined ||
        Object.keys(founderAccounts || {})?.length === 0 ? (
          <Stack className={css.nodatawrp}>
            <img
              src={bank_icon}
              alt="Bank Icon"
              className={css.nodataicon}
              loading="lazy"
            />
            <Typography className={css.nodatatext}>
              No Bank Account Found.
            </Typography>
            <Stack sx={{ position: 'relative' }}>
              <Button
                className={css.addaccbtn}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                Add Your Bank Account
              </Button>
            </Stack>
          </Stack>
        ) : (
          <List>
            {Object.keys(founderAccounts)
              ?.sort()
              ?.map((val, ind) => (
                <ListsItem
                  disablePadding
                  key={val}
                  onClick={() =>
                    dispatch(
                      setBanks({
                        tab: 'Founder',
                        bankList: founderAccounts[val],
                        title: val,
                        sumAmt: IndianCurrency.format(
                          SumAmount(founderAccounts[val])
                        ),
                        ind,
                      })
                    )
                  }
                >
                  <ListItemButton
                    className={css.listitemwrp}
                    onClick={() => setActive(ind)}
                    selected={active.Founder === ind}
                  >
                    <ListItemText
                      primary={`${founderAccounts[val].length} ${val} ACCOUNT`}
                      className={css.listitemtext}
                    />
                    <Stack className={css.amountwrp}>
                      <Typography className={css.listaccamt}>
                        {IndianCurrency.format(SumAmount(founderAccounts[val]))}
                      </Typography>
                      <KeyboardArrowRightRoundedIcon
                        className={css.arrowicon}
                      />
                    </Stack>
                  </ListItemButton>
                </ListsItem>
              ))}
          </List>
        )}
      </Stack>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default memo(FounderAccounts);
