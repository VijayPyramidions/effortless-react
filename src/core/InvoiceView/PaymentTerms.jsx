import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetInvoiceUnsettledPaymentsState } from '@action/Store/Reducers/Invoice/InvoiceState';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getBankList } from '@action/Store/Reducers/Banking/BankingState';
import * as Mui from '@mui/material';
// import AppContext from '@root/AppContext.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import moment from 'moment';
import Input from '@components/Input/Input.jsx';
import { styled, makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  FormControlLabel,
  Avatar,
  Radio,
} from '@mui/material';

import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CashAccount from '@assets/BankLogo/cashaccount.svg';
import * as themes from '@root/theme.scss';
import * as css from './PaymentTermCss.scss';
import { step2 } from './InvoiceImages.js';

const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));

const PaymentTerms = ({
  selectCustomer,
  callFunction,
  lineItems,
  fromBill,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { createInvoiceState } = useSelector((value) => value.Invoice);
  const { bankListingDetails } = useSelector((val) => val.Banking);
  const [drawer, setDrawer] = React.useState({
    paymentTerms: false,
    expandPayment: false,
  });
  const device = localStorage.getItem('device_detect');
  const [tabValue, setTabValue] = React.useState('to_pay');
  const [toPayDay, setToPayDay] = React.useState({
    creditPeriod: '',
    newDueDate: '',
  });
  const [customerUnsettled, setCustomerUnsettled] = React.useState([]);
  const [advancesData, setAdvancesData] = React.useState([]);
  const [companyCashSelected, setCompanyCashSelected] = React.useState('');
  const [toShow, setToShow] = React.useState('to_pay');
  const [showValue, setShowValue] = React.useState({
    creditPeriodToShow: 0,
    advancesDataToShow: [],
    companyCashToShow: {},
  });
  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name, from, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (from === 'to_pay') {
      setToPayDay((p) => ({ ...p, creditPeriod: data }));
    } else if (from === 'paid_as_advance') {
      setAdvancesData(data);
    } else {
      setToPayDay((p) => ({
        ...p,
        creditPeriod: showValue?.creditPeriodToShow,
      }));
    }
  };

  const handleCompanyCash = (row) => {
    setCompanyCashSelected(row?.bank_account_id);
    setToShow('company_cash');
    setShowValue((prev) => ({
      ...prev,
      companyCashToShow: row,
    }));
    handleBottomSheet('paymentTerms', 'company_cash');
    callFunction({
      payer_account_id: row?.bank_account_id,
      payment_mode: 'company_cash',
    });
  };

  const handleCloseClick = (name) => {
    setTabValue(name);
    if (name === 'to_pay') {
      setAdvancesData([]);
      setCompanyCashSelected('');
      setShowValue((prev) => ({
        ...prev,
        advancesDataToShow: [],
        companyCashToShow: {},
      }));
    }
    if (name === 'paid_as_advance') {
      setToPayDay((prev) => ({
        ...prev,
        creditPeriod: 30,
      }));
      setCompanyCashSelected('');
      setShowValue((prev) => ({
        ...prev,
        creditPeriodToShow: 30,
        companyCashToShow: {},
      }));
    }
    if (name === 'company_cash') {
      setAdvancesData([]);
      setToPayDay((prev) => ({
        ...prev,
        creditPeriod: 30,
      }));
      setShowValue((prev) => ({
        ...prev,
        creditPeriodToShow: 30,
        advancesDataToShow: [],
      }));
      const defaultRow = bankListingDetails
        ?.filter((item) => item.sub_account_group === 'Cash Accounts')
        .find((ele) => ele.default);
      handleCompanyCash(defaultRow);
    }
  };

  React.useEffect(() => {
    const date = selectCustomer?.date
      ? new Date(selectCustomer?.date)
      : new Date();
    const tempDate =
      date?.getTime() + Number(toPayDay.creditPeriod) * 24 * 60 * 60 * 1000;
    setToPayDay((prev) => ({ ...prev, newDueDate: new Date(tempDate) }));
  }, [toPayDay.creditPeriod]);

  React.useEffect(() => {
    if (
      Object.keys(createInvoiceState?.unsettledPaymentsList || {})?.length > 0
    ) {
      setCustomerUnsettled(createInvoiceState?.unsettledPaymentsList?.data);
    }
  }, [JSON.stringify(createInvoiceState?.unsettledPaymentsList)]);

  const hangleChecked = (item) => {
    if (
      advancesData?.length === 0 ||
      !advancesData?.map((val) => val?.id)?.includes(item?.id)
    ) {
      setAdvancesData((previous) => [...previous, item]);
    } else {
      setAdvancesData((previous) => [
        ...previous.filter((val) => val?.id !== item?.id),
      ]);
    }
  };
  React.useEffect(() => {
    if (selectCustomer?.customer_id) {
      dispatch(
        GetInvoiceUnsettledPaymentsState({
          customerId: selectCustomer?.customer_id,
        }),
      );
    }
  }, [selectCustomer?.customer_id]);

  React.useEffect(() => {
    if (Object.keys(selectCustomer || {})?.length > 0) {
      setTabValue(selectCustomer?.payment_mode || 'to_pay');
      setToShow(selectCustomer?.payment_mode || 'to_pay');
      if (selectCustomer?.payment_mode === 'company_cash') {
        setCompanyCashSelected(selectCustomer?.payment_source_id);
        setShowValue((prev) => ({
          ...prev,
          companyCashToShow: {
            display_name:
              bankListingDetails?.filter(
                (ele) =>
                  ele?.bank_account_id === selectCustomer?.payment_source_id,
              )?.length > 0 &&
              bankListingDetails?.filter(
                (ele) =>
                  ele?.bank_account_id === selectCustomer?.payment_source_id,
              )[0].display_name,
            bank_account_id: selectCustomer?.payment_source_id,
            ...selectCustomer?.payment_source,
          },
        }));
      }
      if (selectCustomer?.payment_mode === 'to_pay') {
        setToPayDay((prev) => ({
          ...prev,
          creditPeriod: selectCustomer?.credit_period,
        }));
        setShowValue((prev) => ({
          ...prev,
          creditPeriodToShow: selectCustomer?.credit_period,
        }));
      }
      if (selectCustomer?.payment_mode === 'paid_as_advance') {
        const filteredData = customerUnsettled.filter((item) =>
          selectCustomer?.advances.includes(item.id),
        );

        setAdvancesData(filteredData);
        setShowValue((prev) => ({
          ...prev,
          advancesDataToShow: filteredData,
        }));
      }
    }
  }, [selectCustomer?.payment_mode, customerUnsettled]);

  React.useEffect(() => {
    // if (bankListingDetails?.length === 0) {
    dispatch(getBankList());
    // }
  }, []);

  return (
    <>
      {!fromBill && (
        <div
          className={css.mainDivPayment}
          onClick={() => {
            setDrawer((prev) => ({
              ...prev,
              expandPayment: !drawer.expandPayment,
            }));
          }}
        >
          <p className={css.payment}>Payment Terms</p>
          <ExpandMoreIcon
            sx={{
              transition: '.5s',
              transform: drawer.expandPayment
                ? 'rotate(180deg)'
                : 'rotate(360deg)',
            }}
          />
        </div>
      )}
      {drawer.expandPayment && !fromBill && (
        <div className={css.row2}>
          <div className={css.btnSelection}>
            <Button
              variant="outlined"
              onClick={() => handleCloseClick('to_pay')}
              className={
                tabValue === 'to_pay'
                  ? `${css.paymentTermsBtn} ${css.paymentTermsBtnActive}`
                  : css.paymentTermsBtn
              }
              fullWidth
            >
              Credit
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleCloseClick('paid_as_advance')}
              className={
                tabValue === 'paid_as_advance'
                  ? `${css.paymentTermsBtn} ${css.paymentTermsBtnActive}`
                  : css.paymentTermsBtn
              }
              fullWidth
            >
              Advance
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleCloseClick('company_cash')}
              className={
                tabValue === 'company_cash'
                  ? `${css.paymentTermsBtn} ${css.paymentTermsBtnActive}`
                  : css.paymentTermsBtn
              }
              fullWidth
            >
              Cash Sales
            </Button>
          </div>
          {tabValue === 'to_pay' && (
            <div
              className={css.searchInput}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onTriggerDrawer('paymentTerms');
              }}
            >
              <p className={css.paymentPTag}>
                T + {showValue?.creditPeriodToShow}
              </p>
              <img className={css.searchIcon} src={step2.editIcon} alt="edit" />
            </div>
          )}
          {tabValue === 'paid_as_advance' &&
            showValue?.advancesDataToShow?.length === 0 && (
              <div
                className={css.searchInput}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onTriggerDrawer('paymentTerms');
                }}
              >
                <p className={css.paymentPTag}>Select Bills</p>
                <KeyboardArrowDownIcon />
              </div>
            )}
          {tabValue === 'company_cash' && (
            <div
              className={css.searchInput}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onTriggerDrawer('paymentTerms');
              }}
            >
              {companyCashSelected === '' ? (
                <p className={css.paymentPTag}>Select Cash Account</p>
              ) : (
                <Mui.Stack direction="row" gap="8px" alignItems="center">
                  <Avatar
                    sx={{
                      width: '32px',
                      height: '32px',
                    }}
                    alt="Avatar"
                    src={CashAccount}
                  />
                  <p className={css.paymentPTag}>
                    {showValue?.companyCashToShow?.display_name || '-'}
                  </p>
                </Mui.Stack>
              )}
              <KeyboardArrowDownIcon />
            </div>
          )}
        </div>
      )}
      {fromBill && (
        <div className={css.fromBill}>
          <p className={css.label}>Enter Credit Period</p>
          <div
            className={css.searchInput}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              onTriggerDrawer('paymentTerms');
            }}
          >
            <p className={css.paymentPTag}>
              T + {showValue?.creditPeriodToShow || 0}
            </p>
            <p className={css.paymentPTag}>Days</p>
          </div>
        </div>
      )}
      {drawer.expandPayment &&
        showValue?.advancesDataToShow?.length > 0 &&
        toShow === 'paid_as_advance' && (
          <div className={css.row1}>
            {/* <p className={css.advancePTag}>
            Adjustments have been made against the <br />
            following Advance Payments:
          </p> */}

            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ background: '#F7F7F7' }}>
                    <TableCell sx={{ padding: '8px 16px' }}>#voucher</TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>Paid On</TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showValue?.advancesDataToShow?.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>{item?.document_number}</TableCell>
                      <TableCell>
                        {moment(item?.date).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell>{item?.net_balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                margin: '10px 0 0 0',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Mui.Button
                className={`${css.secondary} ${css.modifyPTag}`}
                onClick={() => {
                  onTriggerDrawer('paymentTerms');
                }}
              >
                Modify Advance Adjustment
              </Mui.Button>
            </div>
          </div>
        )}
      <SelectBottomSheet
        name="paymentTerms"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={drawer.paymentTerms}
        onTrigger={onTriggerDrawer}
        onClose={handleBottomSheet}
        // maxHeight="45vh"
        addNewSheet
      >
        <>
          {device === 'mobile' && <Puller />}
          <div style={{ padding: '15px' }}>
            <div style={{ padding: '5px 0' }}>
              <p className={css.valueHeader}>
                {tabValue === 'to_pay' && 'Credit Pay'}
                {tabValue === 'paid_as_advance' && 'Advance Pay'}
                {tabValue === 'company_cash' && 'Cash Sales'}
              </p>
            </div>

            {/* {!fromBill && (
              <div className={css.paymentSelection}>
                <Mui.Button
                  className={tabValue === 'to_pay' ? css.selectedBtn : css.btn}
                  variant="text"
                  onClick={() => {
                    setTabValue('to_pay');
                  }}
                >
                  To Pay
                </Mui.Button>
                <Mui.Button
                  className={tabValue === 'paid_as_advance' ? css.selectedBtn : css.btn}
                  variant="text"
                  onClick={() => {
                    setTabValue('paid_as_advance');
                  }}
                >
                  Advance Paid
                </Mui.Button>
              </div>
            )} */}
            {console.log('lineItems', tabValue)}

            {tabValue === 'to_pay' && (
              <div style={{ padding: '20px' }}>
                <Input
                  name="creditPeriod"
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Enter Credit Period"
                  variant="standard"
                  value={toPayDay.creditPeriod}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    type: 'number',
                    endAdornment: <p className={css.cssDays}>Days</p>,
                    inputProps: {
                      min: 0,
                    },
                  }}
                  fullWidth
                  onChange={(event) => {
                    event.persist();
                    if (event?.target?.value >= 0) {
                      setToPayDay((prev) => ({
                        ...prev,
                        creditPeriod: event?.target?.value,
                      }));
                    }
                  }}
                  theme="light"
                  onKeyDown={(e) =>
                    ['e', 'E', '-', '+', '.'].includes(e.key) &&
                    e.preventDefault()
                  }
                  placeholder="0"
                />

                <p className={css.newDueDate}>
                  Based on the Updated Credit Period, the new Due Date is:
                </p>

                <Input
                  name="newDueDate"
                  //   className={`${css.greyBorder} ${classes.root}`}
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                    background: 'rgba(153, 158, 165, 0.39)',
                  }}
                  label="New Due Date"
                  variant="standard"
                  value={moment(toPayDay?.newDueDate).format('DD-MM-YYYY')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  //   onChange={(event) =>
                  //     setToPayDay((prev) => ({
                  //       ...prev,
                  //       newDueDate: event?.target?.value,
                  //     }))
                  //   }
                  theme="light"
                  disabled
                />

                <div
                  style={{
                    margin: '35px 0 0 0',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Mui.Button
                    variant="contained"
                    className={css.primary}
                    style={{ padding: 15, textTransform: 'initial' }}
                    onClick={() => {
                      setToShow('to_pay');
                      setShowValue((prev) => ({
                        ...prev,
                        creditPeriodToShow: toPayDay?.creditPeriod,
                      }));
                      handleBottomSheet(
                        'paymentTerms',
                        'to_pay',
                        toPayDay?.creditPeriod,
                      );
                      callFunction({
                        credit_period: toPayDay?.creditPeriod,
                        payment_mode: 'to_pay',
                      });
                    }}
                    disableElevation
                  >
                    Update Payment Terms
                  </Mui.Button>
                </div>
              </div>
            )}

            {tabValue === 'paid_as_advance' && selectCustomer?.customer_id && (
              <>
                <div
                  style={{
                    // padding: '20px',
                    maxHeight: device === 'desktop' ? '70vh' : '50vh',
                    overflow: 'auto',
                  }}
                >
                  {customerUnsettled?.length > 0 &&
                    customerUnsettled?.map((item) => (
                      <div
                        style={{
                          display: 'flex',
                          gap: 5,
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Checkbox
                          style={{
                            color: '#F08B32',
                            textTransform: 'capitalize',
                            width: '10%',
                          }}
                          onClick={() => hangleChecked(item)}
                          inputProps={{ 'aria-label': 'controlled' }}
                          checked={advancesData
                            ?.map((val) => val?.id)
                            ?.includes(item?.id)}
                          value={item}
                        />
                        <Mui.ListItemText
                          primary={
                            <p
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                margin: 0,
                              }}
                            >
                              {item?.document_number}
                            </p>
                          }
                          secondary={`paid on ${moment(item.date).format(
                            'DD MMM YYYY',
                          )}`}
                          sx={{ width: '50%' }}
                          onClick={() => hangleChecked(item)}
                        />
                        <p
                          style={{
                            width: '40%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'right',
                            paddingRight: '20px',
                          }}
                        >
                          {FormattedAmount(item?.net_balance)}
                        </p>
                      </div>
                    ))}

                  {customerUnsettled?.length === 0 && (
                    <p
                      style={{
                        color: '#e0513e',
                        fontWeight: '700',
                        margin: '25px',
                      }}
                    >
                      No Advances to Show
                    </p>
                  )}
                </div>
                <div
                  style={{
                    margin: '15px 0 0 0',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Mui.Button
                    variant="contained"
                    className={css.primary}
                    style={{
                      width: '90%',
                      height: 'auto',
                      textTransform: 'initial',
                    }}
                    disabled={advancesData?.length === 0}
                    onClick={() => {
                      setToShow('paid_as_advance');
                      setShowValue((prev) => ({
                        ...prev,
                        advancesDataToShow: advancesData,
                      }));
                      handleBottomSheet(
                        'paymentTerms',
                        'paid_as_advance',
                        advancesData,
                      );
                      const temp = advancesData?.map((val) => val?.id);
                      callFunction({
                        advances: temp,
                        payment_mode: 'paid_as_advance',
                      });
                    }}
                  >
                    Confirm Adjustment <br />{' '}
                    {lineItems.length > 0
                      ? FormattedAmount(
                          lineItems.reduce(
                            (acc, val) => acc + parseInt(val.total, 10),
                            0,
                          ),
                        )
                      : FormattedAmount(0)}{' '}
                    /{' '}
                    {advancesData?.length > 0
                      ? FormattedAmount(
                          advancesData
                            ?.map((val) => Number(val?.net_balance))
                            ?.reduce((a, b) => a + b),
                        )
                      : FormattedAmount(0)}
                  </Mui.Button>
                </div>
              </>
            )}
            {tabValue === 'company_cash' && (
              <List
                dense
                sx={{
                  width: 'auto',
                  bgcolor: 'background.paper',
                  padding: 0,
                  margin: '12px 0 0 20px',
                }}
              >
                {bankListingDetails.filter(
                  (item) => item.sub_account_group === 'Cash Accounts',
                )?.length > 0 ? (
                  <>
                    {bankListingDetails
                      .filter(
                        (item) => item.sub_account_group === 'Cash Accounts',
                      )
                      ?.sort((a, b) =>
                        a.display_name.localeCompare(b.display_name),
                      )
                      ?.map((row) => (
                        <ListItem
                          sx={{
                            padding: 0,
                          }}
                          className={classes.listitemRoot}
                          key={row.bank_account_id}
                        >
                          <ListItemButton
                            sx={{
                              padding: '0 0 0 11px',
                            }}
                            className={css.listitembtn}
                            onClick={() => {
                              handleCompanyCash(row);
                            }}
                          >
                            <FormControlLabel
                              value="bank_account"
                              sx={{
                                marginRight: '4px',
                              }}
                              control={
                                <Radio
                                  name="selectedCashAccount"
                                  sx={{
                                    '&.Mui-checked': {
                                      color: '#f08b32 !important',
                                    },
                                  }}
                                  checked={
                                    companyCashSelected === row.bank_account_id
                                  }
                                  onChange={() => {
                                    handleCompanyCash(row);
                                  }}
                                />
                              }
                            />

                            <ListItemAvatar
                              sx={{
                                minWidth: '40px',
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: '32px',
                                  height: '32px',
                                }}
                                alt="Avatar"
                                src={CashAccount}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={row.display_name || ''}
                              className={classes.AccountText}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                  </>
                ) : (
                  <ListItem>
                    <ListItemText primary="No bank found." />
                  </ListItem>
                )}
              </List>
            )}
            {tabValue === 'paid_as_advance' && !selectCustomer?.customer_id && (
              <p
                style={{
                  color: '#e0513e',
                  fontWeight: '700',
                  margin: '0px 25px 25px 25px',
                }}
              >
                Please Select Customer
              </p>
            )}
          </div>
        </>
      </SelectBottomSheet>
    </>
  );
};

export default PaymentTerms;
