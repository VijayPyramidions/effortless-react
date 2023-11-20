/* eslint-disable no-lonely-if */

import React, { useState, useContext, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Stack,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  // ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import {
  // getBankList,
  addBankAccounts,
  BankSync,
  BankStausUpdate,
  DeleteBankAccount,
  AccountPreference,
  openBorrowing,
  getBorrowingList,
  getLoanDetails,
  addCashAccount,
  editCashAccount,
  deleteCashAccount,
  setEditCashAccountDr,
} from '@action/Store/Reducers/Banking/BankingState';

import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import { IndianCurrency, SumAmount } from '@components/utils';
import brandlogo from '@assets/effcardbrandmobile.svg';
import acceditmobile from '@assets/acceditmobile.svg';
import CashAccount from '@assets/BankLogo/cashaccount.svg';

import VirtualCardEmpty from './Components/VirtualCardEmpty';
import BankAccountsEmpty from './Components/BankAccountsEmpty';
import SelectBottomSheet from '../../../../components/SelectBottomSheet/SelectBottomSheet';
import AccountPreferance from './Components/AccountPreferance';
import BusinessAccountConnect from './Components/BusinessAccountConnent';
import AccountEditOptions from './Components/AccountEditOptions';
import EditAccount from '../EditIndividualAccount';

import * as css from './bankingmobile.scss';

const useStyles = makeStyles({
  AccordionRoot: {
    boxShadow: 'none !important',
    background: 'none !important',
    margin: '0px !important',

    '&.Mui-expanded': {
      background: '#FFFFFF !important',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1) !important',
      borderRadius: '8px !important',
      marginBottom: '16px !important',
    },

    '&:before': {
      display: 'none',
    },
  },

  AccordionSummary: {
    padding: '12px !important',
    minHeight: 'initial !important',

    '& .MuiAccordionSummary-content': {
      justifyContent: 'space-between !important',
      margin: '0px !important',
    },

    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg) !important',
    },
  },

  AccordionDetails: {
    padding: '0 !important',
  },

  AccordionListItemText: {
    margin: '0 0 0 0 !important',

    '& .MuiListItemText-primary': {
      fontWeight: 500,
      fontSize: '13px',
      lineHeight: '16px',
      color: '#2E3A59',
    },
    '& .MuiListItemText-secondary': {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#6E6E6E',
    },
  },

  More: {
    textAlign: 'center !important',
    color: '#f08b32 !important',
  },
});

const InitialState = [
  { name: 'Founder’s Bank Account', check: true },
  { name: 'Owner’s Bank Account', check: false },
  { name: 'Promoter’s Bank Account', check: false },
];

const BankingMobile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    effortlessAccount,
    businessAccounts,
    founderAccounts,
    founderAccountHeader,
    borrowingAccounts,
    editCashAccountDr,
    dataLoad,
  } = useSelector((state) => state.Banking);

  const { openSnackBar, currentUserInfo, userPermissions } =
    useContext(AppContext);

  const [bankAccounts, setBankAccounts] = useState([]);

  const [EditBankshow, setEditBankshow] = useState(false);
  const [oneBankList, setoneBankList] = useState({});
  const [loadMore, setLoadMore] = useState({ business: 5, founder: 5 });

  const [connectType, setConnectType] = useState('Business');
  // filter top

  const [cashAccountName, setCashAccountName] = useState('');

  const [FounderAccPref, setFounderAccPref] = useState(false);
  const [ConnectAccount, setConnectAccount] = useState(false);
  const [AccountEdit, setAccountEdit] = useState(false);

  const [FounderAccHeader, setFounderAccHeader] = useState();
  const [AccHeaderState, setAccHeaderState] = useState(InitialState);

  const [havePermission, setHavePermission] = useState({ open: false });

  const EditIndividualAccount = (data) => (e) => {
    e.stopPropagation();
    setoneBankList(data);
    setAccountEdit(true);
  };

  const HandleAccountEditOption = (val) => () => {
    setAccountEdit(false);

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
      if (oneBankList.account_status === 'paused')
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
      else
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
    } else if (val === 'ECAN') {
      dispatch(setEditCashAccountDr(true));
      setCashAccountName(
        oneBankList.display_name.length > 0
          ? oneBankList.display_name
          : oneBankList.account_name
      );
    } else if (val === 'DCA') {
      dispatch(enableLoading(true));
      dispatch(deleteCashAccount(oneBankList.bank_account_id));
    } else if (val === 'MBA')
      if (oneBankList.merging)
        dispatch(
          openSnackbar({
            message: 'Account merging is under process.',
            type: MESSAGE_TYPE.ERROR,
          })
        );
      else
        navigate('/banking-merge-account', {
          state: { oneBankList },
        });
  };

  const fetchBankDetailsStatus = (accDetails) => {
    navigate('/banking-statement', {
      state: {
        accDetails,
      },
    });
  };

  const accountSorting = () => {
    const arr = Object?.keys(businessAccounts || {})?.sort();
    const indexOfCash = arr.indexOf('CASH');
    if (indexOfCash !== -1) {
      arr.splice(indexOfCash, 1);
      arr.push('CASH');
    }
    setBankAccounts(arr);
  };

  const formatLoanString = (str) => {
    let formattedStr = str.replace(/_/g, ' ');
    const words = formattedStr.split(' ');
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    if (words.length >= 3) {
      words[2] = words[2][0].toUpperCase() + words[2].slice(1);
    }
    formattedStr = words.join(' ');
    return formattedStr;
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
          openSnackBar({
            message: 'Bank Account ID is not found.',
            type: MESSAGE_TYPE.ERROR,
          });
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
          openSnackBar({
            message: 'Bank Account ID is not found.',
            type: MESSAGE_TYPE.ERROR,
          });
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
          openSnackBar({
            message: 'Bank Account ID is not found.',
            type: MESSAGE_TYPE.ERROR,
          });
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
      if (dn.length > 11) name = `${dn?.slice(0, 13)}...`;
      else name = dn;
    } else if (an) {
      if (an.length > 11) name = `${an?.slice(0, 13)}...`;
      else name = an;
    } else name = '';
    return name;
  };

  const handleChangeAccountHeader = (val) => () => {
    setFounderAccHeader(val.name);

    const newState = AccHeaderState.map((row) => {
      if (row.name === val.name) return { ...row, check: true };
      return { ...row, check: false };
    });

    setAccHeaderState(newState);
    let name;
    if (val.name === 'Founder’s Bank Account') name = 'founder';
    else if (val.name === 'Owner’s Bank Account') name = 'owner';
    else if (val.name === 'Promoter’s Bank Account') name = 'promoter';

    dispatch(AccountPreference(name));

    setFounderAccPref(false);
  };

  const borrowingClick = (val) => () => {
    if (val === 'loan_from_banks') navigate('/banking-loan-from-banks');
    if (val === 'loan_from_promoters') navigate('/banking-loan-from-promoter');
    if (val === 'loan_from_others') navigate('/banking-loan-from-others');

    if (val === 'loan_from_banks') dispatch(getBorrowingList());
    else dispatch(getLoanDetails(formatLoanString(val)));
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
    accountSorting();
  }, [businessAccounts]);

  useEffect(() => {
    dispatch(AccountPreference());
  }, []);

  if (dataLoad === null) return null;

  return (
    <>
      <Box className={css.banking_mob_container}>
        {Object.keys(effortlessAccount || {})?.length === 0 ? (
          <VirtualCardEmpty />
        ) : (
          <Stack className={css.efcard_container}>
            <Stack className={css.brandtxtwrp}>
              <img
                src={brandlogo}
                alt="Card Logo"
                className={css.brandlogo}
                loading="lazy"
              />

              <Typography className={css.acctext}>Virtual Account</Typography>
            </Stack>
            <Stack className={css.accinfowrp}>
              <Typography className={css.accname}>
                {effortlessAccount?.display_name ||
                  effortlessAccount?.account_holder_name ||
                  currentUserInfo?.name}
              </Typography>
              <Typography className={css.accbal}>
                {(IndianCurrency.format(
                  effortlessAccount?.available_balance
                ) !== '₹NaN' &&
                  IndianCurrency.format(
                    effortlessAccount?.available_balance
                  )) ||
                  `₹ 0.00`}
              </Typography>
            </Stack>
            <Stack className={css.loadwidthdrawbtnwrp}>
              <Button
                className={css.widthrawbtn}
                onClick={() => {
                  navigate('/banking-withdraw-money');
                }}
              >
                Withdraw Money
              </Button>
              <Button
                className={css.loadmoneybtn}
                onClick={() => {
                  navigate('/banking-load-money');
                }}
              >
                Load Money
              </Button>
            </Stack>
          </Stack>
        )}

        {Object.keys(businessAccounts || {})?.length === 0 ? (
          <BankAccountsEmpty
            desc="No Business Accounts Found"
            btnText="Add Business Account"
            AddAccount={() => setConnectAccount(true)}
          />
        ) : (
          <Stack>
            <Stack className={css.accountTypeHeader}>
              <Typography className={css.accheader}>
                Business Accounts
              </Typography>
              <Button
                className={css.connectbtn}
                onClick={() => {
                  setConnectAccount((prev) => !prev);
                  setConnectType('Business');
                }}
              >
                <AddRoundedIcon />
                Connect
              </Button>
            </Stack>
            {bankAccounts?.map((row) => (
              <Accordion className={classes.AccordionRoot} key={row}>
                <AccordionSummary
                  expandIcon={<KeyboardArrowRightRoundedIcon />}
                  className={classes.AccordionSummary}
                >
                  <Typography className={css.accitem}>
                    {`${businessAccounts[row].length} ${row} ACCOUNT`}
                  </Typography>
                  <Typography className={css.accamount}>
                    {IndianCurrency.format(SumAmount(businessAccounts[row]))}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.AccordionDetails}>
                  <List className={css.accordionList}>
                    {businessAccounts[row]
                      ?.slice(0, loadMore.business)
                      ?.map((val) => (
                        <ListItem
                          key={val.bank_account_number}
                          secondaryAction={
                            <Stack
                              sx={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Typography className={css.listaccountAmount}>
                                {IndianCurrency.format(val.available_balance)}
                              </Typography>
                              {val.account_name !==
                                'Effortless Virtual Account' && (
                                <IconButton
                                  className={css.accordionIconButton}
                                  onClick={EditIndividualAccount(val)}
                                >
                                  <MoreVertRoundedIcon />
                                </IconButton>
                              )}
                            </Stack>
                          }
                          className={css.accordionListItem}
                          disablePadding
                          onClick={handleAccountClick(val)}
                        >
                          <ListItemButton
                            className={css.accordionListItemButton}
                          >
                            {/* <ListItemAvatar
                              sx={{ minWidth: 'initial', marginRight: '6px' }}
                            > */}
                            {/* <span
                                aria-label={val.bank_code}
                                // src={hdfclogo}
                                // alt="bank logo"
                                className={css.accordionbanklogo}

                              /> */}
                            <img
                              src={
                                val.sub_account_group === 'Cash Accounts'
                                  ? CashAccount
                                  : `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                                      val.account_name ===
                                      'Effortless Virtual Account'
                                        ? 'effortless'
                                        : val.bank_code
                                    }.svg`
                              }
                              alt="Bank Logo"
                              onError={(e) => {
                                e.target.src =
                                  'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                              }}
                              className={css.accordionbanklogo}
                              loading="lazy"
                            />
                            {/* </ListItemAvatar> */}
                            <ListItemText
                              title={
                                val.display_name || val.account_holder_name
                              }
                              primary={
                                val.account_name ===
                                'Effortless Virtual Account'
                                  ? val.account_name
                                  : wordWrap(
                                      val.display_name,
                                      val.account_holder_name
                                    )
                              }
                              secondary={
                                val.sub_account_group !== 'Cash Accounts' &&
                                `xx ${
                                  val.bank_account_number?.substr(-4) || '-'
                                }`
                              }
                              className={classes.AccordionListItemText}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    {row.toLowerCase() === 'cash' && (
                      <ListItem
                        onClick={() => {
                          dispatch(enableLoading(true));
                          dispatch(addCashAccount());
                        }}
                      >
                        <ListItemButton className={classes.More}>
                          <ListItemText primary="+ Add Cash Account" />
                        </ListItemButton>
                      </ListItem>
                    )}
                    {businessAccounts[row].length > 5 &&
                      loadMore.business !== businessAccounts[row].length && (
                        <ListItem
                          onClick={() =>
                            setLoadMore({
                              ...loadMore,
                              business: businessAccounts[row].length,
                            })
                          }
                        >
                          <ListItemButton className={classes.More}>
                            <ListItemText primary="More" />
                          </ListItemButton>
                        </ListItem>
                      )}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}

        {Object.keys(founderAccounts || {})?.length === 0 ? (
          <BankAccountsEmpty
            desc="No Founder Accounts Found"
            btnText="Add Founder Account"
            AddAccount={() => {
              setConnectAccount((prev) => !prev);
              setConnectType('Founder');
            }}
          />
        ) : (
          <Stack>
            <Stack className={css.accountTypeHeader}>
              <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography className={css.accheader}>
                  {FounderAccHeader}
                </Typography>
                <IconButton
                  sx={{ marginLeft: '4px' }}
                  onClick={() => setFounderAccPref((prev) => !prev)}
                >
                  <Avatar
                    src={acceditmobile}
                    alt="edit icon"
                    sx={{ height: '16px', width: '16px' }}
                  />
                </IconButton>
              </Stack>
              <Button
                className={css.connectbtn}
                // onClick={yodleeConnect}

                onClick={() => {
                  setConnectAccount((prev) => !prev);
                  setConnectType('Founder');
                }}
              >
                <AddRoundedIcon />
                Connect
              </Button>
            </Stack>
            {Object.keys(founderAccounts || {})
              ?.sort()
              .map((row) => (
                <Accordion className={classes.AccordionRoot} key={row}>
                  <AccordionSummary
                    expandIcon={<KeyboardArrowRightRoundedIcon />}
                    className={classes.AccordionSummary}
                  >
                    <Typography className={css.accitem}>
                      {`${founderAccounts[row].length} ${row} ACCOUNT`}
                    </Typography>
                    <Typography className={css.accamount}>
                      {IndianCurrency.format(SumAmount(founderAccounts[row]))}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.AccordionDetails}>
                    <List className={css.accordionList}>
                      {founderAccounts[row]
                        ?.slice(0, loadMore.founder)
                        ?.map((val) => (
                          <ListItem
                            key={val}
                            secondaryAction={
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography className={css.listaccountAmount}>
                                  {IndianCurrency.format(val.available_balance)}
                                </Typography>
                                <IconButton
                                  className={css.accordionIconButton}
                                  onClick={EditIndividualAccount(val)}
                                >
                                  <MoreVertRoundedIcon />
                                </IconButton>
                              </Stack>
                            }
                            className={css.accordionListItem}
                            disablePadding
                            onClick={handleAccountClick(val)}
                          >
                            <ListItemButton
                              className={css.accordionListItemButton}
                            >
                              {/* <ListItemAvatar
                              sx={{ minWidth: 'initial', marginRight: '6px' }}
                            >
                              <Avatar
                                src={hdfclogo}
                                alt="bank logo"
                                className={css.accordionbanklogo}
                              />
                            </ListItemAvatar> */}
                              {/* <span
                                aria-label={val.bank_code}
                                // src={hdfclogo}
                                // alt="bank logo"
                                className={css.accordionbanklogo}
                              /> */}
                              <img
                                src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${val.bank_code}.svg`}
                                alt="Bank Logo"
                                onError={(e) => {
                                  e.target.src =
                                    'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                                }}
                                className={css.accordionbanklogo}
                                loading="lazy"
                              />
                              <ListItemText
                                // primary={val.account_name}
                                title={
                                  val.display_name || val.account_holder_name
                                }
                                primary={wordWrap(
                                  val.display_name,
                                  val.account_holder_name
                                )}
                                secondary={`xx ${
                                  val.bank_account_number?.substr(-4) || '-'
                                }`}
                                className={classes.AccordionListItemText}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      {founderAccounts[row].length > 5 &&
                        loadMore.founder !== founderAccounts[row].length && (
                          <ListItem
                            onClick={() =>
                              setLoadMore({
                                ...loadMore,
                                founder: founderAccounts[row].length,
                              })
                            }
                          >
                            <ListItemButton className={classes.More}>
                              <ListItemText primary="More" />
                            </ListItemButton>
                          </ListItem>
                        )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Stack>
        )}

        {borrowingAccounts === undefined ||
        !Object.values(borrowingAccounts).some((value) => value > 0) ? (
          <BankAccountsEmpty
            desc="No Borrowings Found"
            btnText="Add Borrowings"
            AddAccount={() => dispatch(openBorrowing())}
          />
        ) : (
          <Stack>
            <Stack className={css.accountTypeHeader}>
              <Typography className={css.accheader}>Borrowings</Typography>
              <Button
                className={css.connectbtn}
                onClick={() => dispatch(openBorrowing())}
              >
                <AddRoundedIcon />
                Add Borrowings
              </Button>
            </Stack>
            {Object.keys(borrowingAccounts || {}).map((row) => (
              <>
                {Number(borrowingAccounts[row]) > 0 && (
                  <Accordion
                    className={classes.AccordionRoot}
                    key={row}
                    expanded={false}
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowRightRoundedIcon />}
                      className={classes.AccordionSummary}
                      onClick={borrowingClick(row)}
                    >
                      <Typography className={css.accitem}>
                        {formatLoanString(row)}
                      </Typography>
                      <Typography className={css.accamount}>
                        {IndianCurrency.format(borrowingAccounts[row] || 0)}
                      </Typography>
                    </AccordionSummary>
                  </Accordion>
                )}
              </>
            ))}
          </Stack>
        )}
        {havePermission.open && (
          <PermissionDialog onClose={() => havePermission.back()} />
        )}

        <SelectBottomSheet
          triggerComponent
          open={FounderAccPref}
          name="Edit Founder"
          onClose={() => setFounderAccPref(false)}
          addNewSheet
        >
          <AccountPreferance
            handleChangeAccountHeader={handleChangeAccountHeader}
            AccHeaderState={AccHeaderState}
            onClose={() => setFounderAccPref(false)}
          />
        </SelectBottomSheet>

        <SelectBottomSheet
          triggerComponent
          open={ConnectAccount}
          name="Connect Account"
          onClose={() => setConnectAccount(false)}
          addNewSheet
        >
          <BusinessAccountConnect
            onClose={() => setConnectAccount(false)}
            connectType={connectType}
          />
        </SelectBottomSheet>
        <SelectBottomSheet
          triggerComponent
          open={AccountEdit}
          name="Connect Account"
          onClose={() => setAccountEdit(false)}
          addNewSheet
        >
          <AccountEditOptions
            onClose={() => setAccountEdit(false)}
            HandleOption={HandleAccountEditOption}
            Sync={
              oneBankList.account_status === 'paused' ? 'Enable' : 'Disable'
            }
            Status={
              oneBankList.account_status === 'disabled' ? 'Enable' : 'Disable'
            }
            oneBank={oneBankList}
          />
        </SelectBottomSheet>

        <SelectBottomSheet
          triggerComponent
          open={EditBankshow}
          name="Edit Bank"
          onClose={() => setEditBankshow(false)}
        >
          <EditAccount
            onClose={() => setEditBankshow(false)}
            data={oneBankList}
          />
        </SelectBottomSheet>

        <SelectBottomSheet
          triggerComponent
          open={editCashAccountDr}
          name="Edit Cash Account Name"
          onClose={() => dispatch(setEditCashAccountDr(false))}
          addNewSheet
        >
          <Box className={css.cashAccountMobile}>
            <Typography className={css.emptyBar} />
            <Stack className={css.caheaderwrp}>
              <Typography className={css.caheadertitle}>
                Edit Cash Account Name
              </Typography>
              <IconButton
                sx={{ height: '16px', width: '16px' }}
                onClick={() => dispatch(setEditCashAccountDr(false))}
              >
                <CloseRoundedIcon sx={{ height: '16px', width: '16px' }} />
              </IconButton>
            </Stack>
            <Stack>
              <Typography className={css.casubtitle}>
                Enter Your Cash Account Name
              </Typography>
              <Stack>
                <label htmlFor="cainput" className={css.cainputlabel}>
                  Name
                </label>
                <input
                  type="text"
                  className={css.cainput}
                  id="cainput"
                  value={cashAccountName}
                  onChange={(e) => setCashAccountName(e.target.value)}
                />
              </Stack>
              <Button
                className={css.casavebtn}
                onClick={() => {
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
        </SelectBottomSheet>
      </Box>
    </>
  );
};

export default memo(BankingMobile);
