import React, { memo, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Typography,
  Stack,
  Button,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import {
  setActiveList,
  setBanks,
  addBankAccounts,
  addOtherBank,
} from '@action/Store/Reducers/Banking/BankingState';

import { IndianCurrency, SumAmount } from '@components/utils';
import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import bank_icon from '@assets/bankicon.svg';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { StyledMenu, ListsItem } from '../../Statement/util';

import * as css from '../../bankingnew.scss';

const BusinessAccounts = () => {
  const dispatch = useDispatch();

  const { businessAccounts, activeList, active } = useSelector(
    (state) => state.Banking
  );

  const { userPermissions } = useContext(AppContext);

  const [havePermission, setHavePermission] = useState({ open: false });
  const [bankAccounts, setBankAccounts] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const AddBankAccounts = (row) => {
    let data;
    if (row === 'Add ICICI Bank Account') {
      if (
        !userPermissions?.Banking?.['ICICI Connected Banking']
          ?.create_icici_account
      ) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        setAnchorEl(null);
        return;
      }

      data = { type: row };
    } else if (row === 'Add Other Bank') {
      if (
        !userPermissions?.Banking?.['Connecting a Bank']?.create_yodlee_account
      ) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        setAnchorEl(null);
        return;
      }

      data = {
        type: row,
        fastConfig: 'add_bank',
        fastConfigLocal: 'add_bank',
        accountType: 'company',
      };
    } else {
      dispatch(addOtherBank(true));
      setAnchorEl(null);
      return;
    }

    dispatch(addBankAccounts(data));
    setAnchorEl(null);
  };

  const accountSorting = () => {
    const arr = Object?.keys(businessAccounts)?.sort();
    const indexOfCash = arr.indexOf('CASH');
    if (indexOfCash !== -1) {
      arr.splice(indexOfCash, 1);
      arr.push('CASH');
    }
    setBankAccounts(arr);
  };

  useEffect(() => {
    accountSorting();
  }, [businessAccounts]);

  return (
    <>
      <Stack
        className={
          activeList.Business
            ? `${css.acclistcontainer} ${css.activecontainer}`
            : css.acclistcontainer
        }
        onClick={() => dispatch(setActiveList('Business'))}
      >
        <Stack className={css.acctypeheader}>
          <Typography variant="h4" className={css.acctypetext}>
            Business Bank Account
          </Typography>
          {businessAccounts !== undefined && (
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
            {[
              'Add ICICI Bank Account',
              'Add Other Bank',
              'Add Bank Manually',
            ].map((row) => (
              <MenuItem
                key={row}
                className={css.dropdownitem}
                onClick={() => AddBankAccounts(row)}
              >
                {row}
              </MenuItem>
            ))}
          </StyledMenu>
        </Stack>
        {businessAccounts === undefined ||
        Object.keys(businessAccounts || {})?.length === 0 ? (
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
            {bankAccounts?.map((val, ind) => (
              <ListsItem
                disablePadding
                key={val}
                onClick={() =>
                  dispatch(
                    setBanks({
                      tab: 'Business',
                      bankList: businessAccounts[val],
                      title: val,
                      sumAmt: IndianCurrency.format(
                        SumAmount(businessAccounts[val])
                      ),
                      ind,
                    })
                  )
                }
              >
                <ListItemButton
                  selected={active.Business === ind}
                  className={css.listitemwrp}
                >
                  <ListItemText
                    primary={`${businessAccounts[val].length} ${val} ACCOUNT`}
                    className={css.listitemtext}
                  />
                  <Stack className={css.amountwrp}>
                    <Typography className={css.listaccamt}>
                      {IndianCurrency.format(SumAmount(businessAccounts[val]))}
                    </Typography>
                    <KeyboardArrowRightRoundedIcon className={css.arrowicon} />
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

export default memo(BusinessAccounts);
