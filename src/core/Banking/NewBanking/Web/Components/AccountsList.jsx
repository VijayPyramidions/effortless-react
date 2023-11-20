/* eslint-disable no-lonely-if */

import React, { memo, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { withStyles } from '@material-ui/core/styles';
// import axiosInst from '@action/ApiConfig/AxiosInst';

import {
  addBankAccounts,
  BankSync,
  BankStausUpdate,
  DeleteBankAccount,
  iciciAccountSync,
  addCashAccount,
  editCashAccount,
  deleteCashAccount,
  setEditCashAccountDr,
  setMergeAccDrawer,
} from '@action/Store/Reducers/Banking/BankingState';
import { txnsRefresh } from '@action/Store/Reducers/Banking/StatementState';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { IndianCurrency } from '@components/utils';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
// import Refresh from '../../../assets/fetchaccbal.svg';
import cedit from '@assets/edit-2.svg';
import CashAccount from '@assets/BankLogo/cashaccount.svg';
import { StyledMenu } from '../../Statement/util';

import * as css from '../../bankingnew.scss';
import EditAccount from '../../EditIndividualAccount';
import MergeAccounts from './MergeAccounts';

const MenuList = withStyles({
  paper: {
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
})(Menu);

const StatusComponent = {
  disconnect: (
    <>
      <div className={css.disconnect}>
        <div className={css.dinconnectinline} />
      </div>
      <Typography className={css.disstatus}>Disconnect</Typography>
    </>
  ),
  invalid_credentials: (
    <>
      <div className={css.disconnect}>
        <div className={css.dinconnectinline} />
      </div>
      <Typography className={css.disstatus}>Disconnect</Typography>
    </>
  ),
  not_registered: (
    <>
      <div className={css.disconnect}>
        <div className={css.dinconnectinline} />
      </div>
      <Typography className={css.disstatus}>Not Registered</Typography>
    </>
  ),
  active: (
    <>
      <div className={css.active}>
        <div className={css.activeinline} />
      </div>
      <Typography className={css.actstatus}>Active</Typography>
    </>
  ),
  paused: (
    <>
      <div className={css.pause}>
        <div className={css.pauseinline} />
      </div>
      <Typography className={css.pausestatus}>Paused</Typography>
    </>
  ),
  disabled: (
    <>
      <div className={css.disable}>
        <div className={css.disableinline} />
      </div>
      <Typography className={css.diablestatus}>Disabled</Typography>
    </>
  ),
  fetching: (
    <>
      <div className={css.fetching}>
        <div className={css.fetchinginline} />
      </div>
      <Typography className={css.fetchingstatus}>Fetching</Typography>
    </>
  ),
};

const AccountsList = () => {
  const { userPermissions } = useContext(AppContext);

  const dispatch = useDispatch();

  const { Banks, editCashAccountDr, mergeAccDrawer } = useSelector(
    (state) => state.Banking
  );

  const [AmoutShortValue, setAmoutShortValue] = useState('Amount high to low');
  const [EditBankshow, setEditBankshow] = useState(false);
  const [BankLists, setBankLists] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [oneBankList, setoneBankList] = useState({});
  const [bankSync, setbankbankSync] = useState();
  const [bankStatus, setbankStatus] = useState();

  const [havePermission, setHavePermission] = useState({ open: false });

  const [cashAccountName, setCashAccountName] = useState('');
  const [cashAccountNameErr, setCashAccountNameErr] = useState(false);

  const [anchorElSort, setAnchorElSort] = useState(null);
  const openSort = Boolean(anchorElSort);

  const [anchorElTally, setAnchorElTally] = useState(null);
  const openTally = Boolean(anchorElTally);

  const navigate = useNavigate();

  const handleClick = (val) => (event) => {
    event.stopPropagation();

    setoneBankList(val);
    if (val.account_status === 'paused') setbankbankSync('Enable');
    else setbankbankSync('Disable');

    if (val.account_status === 'disabled') setbankStatus('Enable');
    else setbankStatus('Disable');

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const HandleShortAmount = (val, data) => {
    setAmoutShortValue(val);
    setAnchorElSort(null);
    const sorteddata = Object.assign(data);
    const subAccountGroups = Object.keys(sorteddata);

    if (val === 'Amount low to high')
      subAccountGroups.forEach((item) => {
        sorteddata[item]?.sort(
          (a, b) =>
            parseFloat(a?.available_balance) - parseFloat(b?.available_balance)
        );
      });
    else
      subAccountGroups.forEach((item) => {
        sorteddata[item]?.sort(
          (a, b) =>
            parseFloat(b?.available_balance) - parseFloat(a?.available_balance)
        );
      });

    setBankLists(sorteddata);
  };

  const HandleListItemClick = (val) => () => {
    if (val === 'EAD') {
      if (oneBankList.service_provider !== 'icici') {
        if (
          userPermissions?.Banking?.['Connecting a Bank']?.edit_yodlee_account
        )
          setEditBankshow(true);
        else
          setHavePermission({
            open: true,
            back: () => {
              setHavePermission({ open: false });
            },
          });
      } else {
        if (
          userPermissions?.Banking?.['ICICI Connected Banking']
            ?.edit_icici_account
        )
          setEditBankshow(true);
        else
          setHavePermission({
            open: true,
            back: () => {
              setHavePermission({ open: false });
            },
          });
      }
    } else if (val === 'UBC') {
      dispatch(
        addBankAccounts({
          type: 'Other Bank',
          fastConfig: 'update_credentials',
          fastConfigLocal: 'update_credentials',
          accountType: oneBankList.bank_account_type,
          accountId: oneBankList.id,
        })
      );
    } else if (val === 'DEBS') {
      if (oneBankList.account_status === 'paused') {
        if (oneBankList.sub_account_group === 'Connected Banking') {
          dispatch(
            BankSync({ id: oneBankList?.bank_account_id, type: 'enable' })
          );
        } else
          dispatch(
            addBankAccounts({
              type: 'Other Bank',
              fastConfig: 'refresh_bank',
              fastConfigLocal: 'enable_sync',
              accountType: oneBankList.bank_account_type,
              accountId: oneBankList.id,
            })
          );
      } else
        dispatch(
          BankSync({ id: oneBankList?.bank_account_id, type: 'disable' })
        );
    } else if (val === 'DEA') {
      if (oneBankList.account_status === 'disabled') {
        if (oneBankList.sub_account_group === 'Connected Banking') {
          dispatch(
            BankStausUpdate({
              status: 'active',
              acccountID: oneBankList?.bank_account_id,
            })
          );
        } else
          dispatch(
            addBankAccounts({
              type: 'Other Bank',
              fastConfig: 'refresh_bank',
              fastConfigLocal: 'activate_bank',
              accountType: oneBankList.bank_account_type,
              accountId: oneBankList.id,
            })
          );
      } else
        dispatch(
          BankStausUpdate({
            status: 'disabled',
            acccountID: oneBankList?.bank_account_id,
          })
        );
    } else if (val === 'DBA') {
      if (oneBankList.service_provider !== 'icici') {
        if (
          userPermissions?.Banking?.['Connecting a Bank']?.delete_yodlee_account
        )
          dispatch(DeleteBankAccount(oneBankList?.bank_account_id));
        else
          setHavePermission({
            open: true,
            back: () => {
              setHavePermission({ open: false });
            },
          });
      } else {
        if (
          userPermissions?.Banking?.['ICICI Connected Banking']
            ?.delete_icici_account
        )
          dispatch(DeleteBankAccount(oneBankList?.bank_account_id));
        else
          setHavePermission({
            open: true,
            back: () => {
              setHavePermission({ open: false });
            },
          });
      }
    } else if (val === 'MBA') {
      if (oneBankList.merging)
        dispatch(
          openSnackbar({
            message: 'Account merging is under process.',
            type: MESSAGE_TYPE.ERROR,
          })
        );
      else dispatch(setMergeAccDrawer(true));
    }

    handleClose();
  };

  const HandleCashListItemClick = (val) => () => {
    if (val === 'ECAN') {
      dispatch(setEditCashAccountDr(true));
      setCashAccountName(
        oneBankList.display_name.length > 0
          ? oneBankList.display_name
          : oneBankList.account_name
      );
      setAnchorEl(null);
    } else {
      dispatch(enableLoading(true));
      dispatch(deleteCashAccount(oneBankList.bank_account_id));
    }
  };

  const TnxsRefresh = () => {
    setAnchorEl(null);
    dispatch(enableLoading(true));
    dispatch(txnsRefresh(oneBankList));
  };

  const BankFilter = () => {
    const result_3 = Banks?.BankList?.reduce((x, y) => {
      (x[y.sub_account_group] = x[y.sub_account_group] || []).push(y);
      return x;
    }, {});
    HandleShortAmount('Amount high to low', result_3);
  };

  const fetchBankDetailsStatus = (accDetails) => {
    navigate('/banking-statement', {
      state: {
        accDetails,
      },
    });
  };

  const handleAccountClick = (val) => () => {
    if (
      val?.service_provider !== 'yodlee' &&
      val?.account_name !== 'Effortless Virtual Account'
    ) {
      if (
        userPermissions?.Banking?.['ICICI Connected Banking']
          ?.view_icici_account
      ) {
        if (val.bank_account_id || val.id) fetchBankDetailsStatus(val);
        else
          dispatch(
            openSnackbar({
              message: 'Bank Account ID is not found.',
              type: MESSAGE_TYPE.ERROR,
            })
          );
      } else
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
    } else if (
      val?.service_provider === 'yodlee' &&
      val?.account_name !== 'Effortless Virtual Account'
    ) {
      if (
        userPermissions?.Banking?.['Connecting a Bank']?.view_yodlee_account
      ) {
        if (val.bank_account_id || val.id) fetchBankDetailsStatus(val);
        else
          dispatch(
            openSnackbar({
              message: 'Bank Account ID is not found.',
              type: MESSAGE_TYPE.ERROR,
            })
          );
      } else
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
    } else {
      if (
        userPermissions?.Banking?.['Effortless Virtual Account']
          ?.view_virtual_account
      ) {
        if (val.bank_account_id || val.id) fetchBankDetailsStatus(val);
        else
          dispatch(
            openSnackbar({
              message: 'Bank Account ID is not found.',
              type: MESSAGE_TYPE.ERROR,
            })
          );
      } else
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
    }
  };

  const wordWrap = (dn, an) => {
    let name;
    if (dn) {
      if (dn.length > 15) name = `${dn?.slice(0, 13)}...`;
      else name = dn;
    } else if (an) {
      if (an.length > 15) name = `${an?.slice(0, 13)}...`;
      else name = an;
    } else name = '-';
    return name;
  };

  const tallyAccountConnect = (row) => () => {
    let data;
    if (row === 'Add ICICI Bank Account') data = { type: row };
    else {
      data = {
        type: row,
        fastConfig: 'add_bank',
        fastConfigLocal: 'add_bank',
        accountType: 'company',
      };
    }

    dispatch(addBankAccounts(data));
    setAnchorElTally(null);
  };

  const IciciSync = (data) => (e) => {
    e.stopPropagation();
    dispatch(iciciAccountSync(data.bank_account_id));
  };
  const accountReconnect = (data) => (e) => {
    e.stopPropagation();
    if (data.service_provider === 'yodlee' || data.service_provider === null)
      dispatch(
        addBankAccounts({
          type: 'Other Bank',
          fastConfig: 'update_credentials',
          fastConfigLocal: 'update_credentials',
          accountType: data.bank_account_type,
          accountId: data.id,
        })
      );
  };

  useEffect(() => {
    BankFilter();
  }, [Banks]);

  return (
    <Box className={css.alcontainer}>
      <StyledMenu
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorElTally}
        open={openTally}
        onClose={() => setAnchorElTally(null)}
        listwidth={198}
      >
        {['Add ICICI Bank Account', 'Add Other Bank'].map((row) => (
          <MenuItem
            key={row}
            className={css.dropdownitem}
            onClick={tallyAccountConnect(row)}
          >
            {row}
          </MenuItem>
        ))}
      </StyledMenu>

      <MenuList
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={css.menu}
      >
        {oneBankList.sub_account_group === 'Cash Accounts' ? (
          <>
            <MenuItem
              className={css.menuitem}
              onClick={HandleCashListItemClick('ECAN')}
            >
              Edit Cash Account Name
            </MenuItem>
            <MenuItem
              className={css.menuitem}
              onClick={HandleCashListItemClick('DCA')}
            >
              Delete Cash Account
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              className={css.menuitem}
              onClick={HandleListItemClick('EAD')}
            >
              Edit Account Details
            </MenuItem>

            {oneBankList.sub_account_group === 'Connected Banking' ? (
              <>
                {oneBankList.registration_status && (
                  <MenuItem
                    className={css.menuitem}
                    onClick={() => {
                      navigate(`/invoice-upload`, {
                        state: {
                          from: 'banking',
                          bank_account_id: oneBankList?.bank_account_id,
                          thisFor: 'transactions',
                        },
                      });
                    }}
                  >
                    Upload Transactions
                  </MenuItem>
                )}
              </>
            ) : (
              <MenuItem
                className={css.menuitem}
                onClick={() => {
                  navigate(`/invoice-upload`, {
                    state: {
                      from: 'banking',
                      bank_account_id: oneBankList?.bank_account_id,
                      thisFor: 'transactions',
                    },
                  });
                }}
              >
                Upload Transactions
              </MenuItem>
            )}

            {oneBankList.service_provider !== 'yodlee' &&
              oneBankList.registration_status && (
                <MenuItem className={css.menuitem} onClick={TnxsRefresh}>
                  Refresh Bank Feed
                </MenuItem>
              )}

            {oneBankList.service_provider === 'yodlee' && (
              <MenuItem
                className={css.menuitem}
                onClick={HandleListItemClick('UBC')}
              >
                Update Bank Credentials
              </MenuItem>
            )}

            {oneBankList.sub_account_group === 'Connected Banking' ? (
              <>
                {oneBankList.registration_status && (
                  <>
                    <MenuItem
                      className={css.menuitem}
                      onClick={HandleListItemClick('DEBS')}
                    >
                      {`${bankSync} Bank Sync`}
                    </MenuItem>
                    <MenuItem
                      className={css.menuitem}
                      onClick={HandleListItemClick('DEA')}
                    >
                      {`${bankStatus} Account`}
                    </MenuItem>
                  </>
                )}
              </>
            ) : (
              <>
                <MenuItem
                  className={css.menuitem}
                  onClick={HandleListItemClick('DEBS')}
                >
                  {`${bankSync} Bank Sync`}
                </MenuItem>
                <MenuItem
                  className={css.menuitem}
                  onClick={HandleListItemClick('DEA')}
                >
                  {`${bankStatus} Account`}
                </MenuItem>
              </>
            )}

            {(oneBankList.service_provider === 'eff_books' ||
              oneBankList.service_provider === 'zoho_books' ||
              oneBankList.service_provider === 'tally_books') && (
              <MenuItem
                className={css.menuitem}
                onClick={HandleListItemClick('MBA')}
              >
                Merging Bank Account
              </MenuItem>
            )}
            <MenuItem
              className={css.menuitem}
              onClick={HandleListItemClick('DBA')}
            >
              Delete Bank Account
            </MenuItem>
          </>
        )}
      </MenuList>

      <Stack className={css.accountlistheader}>
        <Typography variant="h4" className={css.headertext}>
          {`List of ${
            Banks?.title?.toLowerCase() === 'fd'
              ? Banks?.title?.toUpperCase()
              : Banks?.title?.substr(0, 1)?.toUpperCase() +
                Banks?.title?.substr(1)?.toLowerCase()
          } Account`}
        </Typography>
        <Typography className={css.totalamount}>{Banks.total_amt}</Typography>
      </Stack>
      <Stack className={css.bodycontainer}>
        {Object.keys(BankLists)
          .sort()
          .map((val, ind) => (
            <>
              <Stack className={css.acclistswrp}>
                <Stack className={css.acctypewtp}>
                  <Typography className={css.acctyptext}>{val}</Typography>
                  {ind === 0 && (
                    <Stack className={css.accbalsortwrp}>
                      <Button
                        aria-controls={
                          openSort ? 'demo-customized-menu' : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openSort ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={(e) => setAnchorElSort(e.currentTarget)}
                        endIcon={<KeyboardArrowDownOutlinedIcon />}
                        className={css.accbalsortbtn}
                      >
                        Sort By:
                        <span
                          style={{
                            marginLeft: '5px',
                            color: '#000000',
                            fontWeight: 300,
                          }}
                        >
                          {AmoutShortValue}
                        </span>
                      </Button>
                      <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                          'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorElSort}
                        open={openSort}
                        onClose={() => setAnchorElSort(null)}
                        listwidth={255}
                      >
                        {['Amount low to high', 'Amount high to low'].map(
                          (items) => (
                            <MenuItem
                              onClick={() =>
                                HandleShortAmount(items, BankLists)
                              }
                              disableRipple
                              key={items}
                            >
                              {items}
                            </MenuItem>
                          )
                        )}
                      </StyledMenu>

                      {Banks.title === 'CASH' && (
                        <Tooltip title="Add Cash Account" arrow>
                          <>
                            <IconButton
                              className={css.addcashAccountBtn}
                              onClick={() => {
                                dispatch(enableLoading(true));
                                dispatch(addCashAccount());
                              }}
                            >
                              <AddRoundedIcon />
                            </IconButton>
                          </>
                        </Tooltip>
                      )}
                    </Stack>
                  )}
                </Stack>
                {BankLists[val].map((row) => (
                  <>
                    {row.account_type !== 'CASH' ? (
                      <>
                        <Grid
                          className={css.acclistitemwrp}
                          key={row.id}
                          onClick={handleAccountClick(row)}
                          container
                        >
                          <Grid item md={5}>
                            <Stack>
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                                    row.account_name ===
                                    'Effortless Virtual Account'
                                      ? 'effortless'
                                      : row.bank_code
                                  }.svg`}
                                  alt="Bank Logo"
                                  width="32px"
                                  height="32px"
                                  onError={(e) => {
                                    e.target.src =
                                      'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                                  }}
                                  className={css.banklogo}
                                  loading="lazy"
                                />
                                <Stack>
                                  <Tooltip
                                    title={
                                      row.account_name ===
                                      'Effortless Virtual Account'
                                        ? row.account_name
                                        : row.display_name ||
                                          row.account_holder_name
                                    }
                                    arrow
                                  >
                                    <>
                                      <Typography
                                        className={css.accholdname}
                                        title={
                                          row.display_name ||
                                          row.account_holder_name
                                        }
                                      >
                                        {row.account_name ===
                                        'Effortless Virtual Account'
                                          ? row.account_name
                                          : wordWrap(
                                              row.display_name,
                                              row.account_holder_name
                                            )}
                                      </Typography>
                                    </>
                                  </Tooltip>
                                  <Typography className={css.accnumber}>
                                    {`A/C No: ${row.bank_account_number}`}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Grid>
                          <Grid item md={4}>
                            <Stack>
                              <Stack className={css.accstatus_utime}>
                                {row.service_provider === 'eff_books' ||
                                row.service_provider === 'zoho_books' ||
                                row.service_provider === 'tally_books' ? (
                                  <Button
                                    className={css.tallyconnect}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAnchorElTally(e.currentTarget);
                                    }}
                                  >
                                    <AddRoundedIcon
                                      className={css.connectplus}
                                    />
                                    {/* <span className={css.connectplus}>+</span>  */}
                                    Connect
                                  </Button>
                                ) : (
                                  <>{StatusComponent[row.account_status]}</>
                                )}
                                {row.last_synced_at && (
                                  <span>
                                    {`Update On : ${moment(
                                      row.last_synced_at
                                    ).format('DD-MM-YYYY')}`}
                                  </span>
                                )}
                              </Stack>
                              {row.ifsc_code && <Typography className={css.accifsccode}>
                                {`IFSC: ${row.ifsc_code}`}
                              </Typography>}
                              {row.swift_code && <Typography className={css.accifsccode}>
                                {`Swift Code: ${row.swift_code}`}
                              </Typography>}
                            </Stack>
                          </Grid>
                          <Grid item md={3}>
                            <Stack>
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginBottom: '5px',
                                  justifyContent: 'end',
                                }}
                              >
                                <Typography className={css.acccountsaving}>
                                  {IndianCurrency.format(row.available_balance)}
                                </Typography>
                                {row.account_name !==
                                  'Effortless Virtual Account' && (
                                  <IconButton
                                    sx={{ padding: '0px', marginLeft: '3px' }}
                                  >
                                    <MoreVertRoundedIcon
                                      sx={{ color: '#464646' }}
                                      fontSize="small"
                                      onClick={handleClick(row)}
                                    />
                                  </IconButton>
                                )}
                              </Stack>
                              <Stack sx={{ alignItems: 'flex-end' }}>
                                {row.service_provider === 'icici' &&
                                !row.registration_status ? (
                                  <Button
                                    className={css.iciciSync}
                                    onClick={IciciSync(row)}
                                  >
                                    Sync Now
                                  </Button>
                                ) : (
                                  <>
                                    {row?.account_status ===
                                    'invalid_credentials' ? (
                                      <Button
                                        className={css.iciciSync}
                                        onClick={accountReconnect(row)}
                                      >
                                        <Tooltip
                                          title={row?.account_status}
                                          arrow
                                        >
                                          <ErrorOutlineRoundedIcon
                                            sx={{
                                              height: '1rem',
                                              transform: 'rotate(180deg)',
                                            }}
                                          />
                                        </Tooltip>
                                        Reconnect
                                      </Button>
                                    ) : (
                                      <Typography
                                        className={
                                          row.account_name !==
                                          'Effortless Virtual Account'
                                            ? css.amtinbnk
                                            : `${css.amtinbnk} ${css.mr_0}`
                                        }
                                      >
                                        Amount in Hand
                                      </Typography>
                                    )}
                                  </>
                                )}
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid
                          className={css.acclistitemwrp}
                          key={row.id}
                          onClick={handleAccountClick(row)}
                          container
                        >
                          <Grid item md={5}>
                            <Stack>
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  src={CashAccount}
                                  alt="Bank Logo"
                                  width="32px"
                                  height="32px"
                                  onError={(e) => {
                                    e.target.src =
                                      'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                                  }}
                                  className={css.banklogo}
                                  loading="lazy"
                                />
                                <Stack className={css.cashaccountname}>
                                  <Tooltip
                                    title={
                                      row.display_name ||
                                      row.account_holder_name
                                    }
                                    arrow
                                  >
                                    <>
                                      <Typography
                                        className={css.accholdname}
                                        style={{ marginBottom: 0 }}
                                      >
                                        {wordWrap(
                                          row.display_name,
                                          row.account_holder_name
                                        )}
                                      </Typography>
                                    </>
                                  </Tooltip>

                                  <Button
                                    className={css.eiditbtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setoneBankList(row);
                                      setCashAccountName(
                                        row.display_name.length > 0
                                          ? row.display_name
                                          : row.account_name
                                      );
                                      dispatch(setEditCashAccountDr(true));
                                    }}
                                  >
                                    <IconButton className={css.editbtnicon}>
                                      <img src={cedit} alt="edit icon" />
                                    </IconButton>
                                    Edit
                                  </Button>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Grid>

                          <Grid item md={3}>
                            <Stack>
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginBottom: '5px',
                                  justifyContent: 'end',
                                }}
                              >
                                <Typography className={css.acccountsaving}>
                                  {IndianCurrency.format(row.available_balance)}
                                </Typography>

                                <IconButton
                                  sx={{ padding: '0px', marginLeft: '3px' }}
                                >
                                  <MoreVertRoundedIcon
                                    sx={{ color: '#464646' }}
                                    fontSize="small"
                                    onClick={handleClick(row)}
                                  />
                                </IconButton>
                              </Stack>
                              <Stack sx={{ alignItems: 'flex-end' }}>
                                <Typography className={css.amtinbnk}>
                                  Amount in Hand
                                </Typography>
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </>
                ))}
              </Stack>
            </>
          ))}
      </Stack>

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}

      <SelectBottomSheet
        triggerComponent
        open={EditBankshow}
        name="Edit Bank"
        onClose={() => setEditBankshow(false)}
      >
        <EditAccount
          onClose={() => setEditBankshow(false)}
          // FetchBankAccounts={FetchBankAccounts}
          data={oneBankList}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={mergeAccDrawer}
        name="Merge Bank Account"
        fixedWidthSheet={600}
        onClose={() => dispatch(setMergeAccDrawer(false))}
      >
        <MergeAccounts
          onClose={() => dispatch(setMergeAccDrawer(false))}
          // FetchBankAccounts={FetchBankAccounts}
          data={oneBankList}
        />
      </SelectBottomSheet>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={editCashAccountDr}
        onClose={() => dispatch(setEditCashAccountDr(false))}
        sx={{
          '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded': {
            borderRadius: '18px',
            maxWidth: 500,
            padding: '24px 16px 24px 24px',
          },
        }}
      >
        <Box>
          <Stack className={css.caheaderwrp}>
            <Typography className={css.headertitle}>
              Edit Cash Account Name
            </Typography>
            <IconButton onClick={() => dispatch(setEditCashAccountDr(false))}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ marginRight: '16px' }}>
            <Typography className={css.casubtitle}>
              Enter Your Cash Account Name
            </Typography>
            <Stack className={css.cainputwrp}>
              <label htmlFor="caname" className={css.calabel}>
                Name
              </label>
              <input
                type="text"
                name="cashaccountname"
                id="caname"
                value={cashAccountName}
                className={css.canameinput}
                onChange={(e) => {
                  setCashAccountName(e.target.value);
                  if (e.target.value === '') {
                    setCashAccountNameErr(true);
                  } else {
                    setCashAccountNameErr(false);
                  }
                }}
              />
            </Stack>
            {cashAccountNameErr && (
              <span className={css.caNameError}>
                Please enter valid Cash Account Name
              </span>
            )}
            <Button
              className={css.casavebtn}
              onClick={() => {
                if (cashAccountName === '') {
                  return;
                }
                dispatch(enableLoading(true));
                dispatch(
                  editCashAccount({
                    id: oneBankList.bank_account_id,
                    payload: { display_name: cashAccountName },
                  })
                );
              }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default memo(AccountsList);
