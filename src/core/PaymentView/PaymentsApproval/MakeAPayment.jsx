/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useState, useContext, useEffect, useRef } from 'react';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import SuccessView from '@core/BillBookView/shared/SuccessView';
import BillItem from '@core/PaymentView/shared/Bill';
import * as Mui from '@mui/material';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import SearchIcon2 from '@assets/search.svg';
import upArrowPayment from '@assets/upArrowPayment.svg';
import { Tab, Tabs, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as Router from 'react-router-dom';
import PayNow from '../shared/PayNow';
import * as css from './MakeAPayment.scss';
import ProceedToPay from '../shared/ProceedToPay';
import VendorBill from '../shared/VendorBill';

const useStyles = makeStyles(() => ({
  tableHeadFonts: {
    fontSize: '12px',
  },
  colr: {
    height: '1px',
    backgroundColor: '  #6E6E6E',
  },
  colrs: {
    height: '1px',
    backgroundColor: '#F08B32',
  },
  fontcolr: {
    color: '  #6E6E6E',
    paddingBottom: '13px',
  },
  fontcolrs: {
    color: '#F08B32',
  },
  indicator: {
    backgroundColor: '#F08B32',
  },
  styledCardTextfield: {
    backgroundColor: 'white !important',
    height: '49px !important',
    width: '90vw !important',
    padding: '0 0 0 25px',
    borderRadius: '16px !important',
  },
  styledCardTextfieldDesktop: {
    width: '100% !important',
    height: '40px !important',
    borderRadius: '8px !important',
    backgroundColor: 'rgba(237, 237, 237, 0.15)',
    border: '1px solid rgba(153, 158, 165, 0.39)',
    padding: '5px',
    paddingLeft: '44px',
    fontSize: '13px',
  },
  styledCardTextfieldDesktop2: {
    width: '97px !important',
    height: '29px !important',
    borderRadius: '8px !important',
    border: '1px solid #A0A4AF',
    padding: '5px',
    fontSize: '13px',
  },
}));

const MakeAPayment = () => {
  const {
    changeSubView,
    organization,
    enableLoading,
    user,
    openSnackBar,
    pageParams,
  } = useContext(AppContext);

  const classes = useStyles();
  const searchRef = useRef();
  const [paymentVoucharId, setPaymentVoucharId] = useState();
  const [vendorBills, setVendorBills] = useState([]);
  const [unsettledVendorBills, setUnsettledVendorBills] = useState([]);
  const [selectedbillids, setselectedbillids] = useState([]);
  const [searchUnsettledVendorBills, setSearchUnsettledVendorBills] = useState(
    []
  );
  // const [click, setClick] = React.useState('tab1');
  const [color, setColor] = React.useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [vendor, setVendor] = useState();
  const [bankAccounts, setBankAccounts] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const { state } = Router.useLocation();
  const [button, setButton] = useState('pay now');
  const [payStatus, setPayStatus] = useState('pay');

  const [payNow, setPayNow] = useState({
    active: false,
    title: 'Grand Total',
    subTitle: 'No Parties and Bills Selected for Payment',
  });
  const tabchange = (event, value) => {
    setTabValue(value);
  };
  const device = localStorage.getItem('device_detect');

  const [drawer, setDrawer] = useState({
    makePayment: false,
    proceedToPay: false,
    verifyPassword: false,
    paymentSuccess: false,
  });

  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown Error Occured',
      type: 'error',
    });
  };
  const navigate = Router.useNavigate();

  const GetUnsettledVendorBillsByVendorId = async (vendorId) => {
    enableLoading(true);

    RestApi(
      `organizations/${organization.orgId}/vendor_unsettled?vendor_id=${vendorId}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          res.data.map((a) =>
            Object.assign(a, {
              selected: false,
              paidAmount: Number(a.net_balance),
            })
          );
          let resdata = [];
          if (selectedbillids.length > 0) {
            res.data.map((item) =>
              selectedbillids.map((id) => {
                if (item.id === id) return;
                resdata.push(item);
              })
            );
          } else {
            resdata = res.data;
          }
          setVendorBills(resdata);
          setDrawer((d) => ({ ...d, makePayment: true }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const onTriggerDrawer = async (name, vendorId) => {
    setVendor(vendorId);
    await GetUnsettledVendorBillsByVendorId(vendorId);
  };
  const getBankAccounts = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucharId}/bank_accounts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setBankAccounts(res.data);
          setDrawer((d) => ({ ...d, proceedToPay: true }));
        } else {
          showError(res.message);
        }
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
    onTriggerDrawer();
  };

  const handlePay = () => {
    if (payNow.active) {
      getBankAccounts();
    }
  };

  const GetUnsettledVendorBills = async () => {
    enableLoading(true);

    RestApi(
      `organizations/${organization.orgId}/vendor_unsettled?grouped=true`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setUnsettledVendorBills(res.data);
          const list = res.data.map((item) => {
            const temp = item;
            temp.selected = false;
            return temp;
          });
          setSearchUnsettledVendorBills(list);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
    handlePay();
  };

  const CreateVoucher = async () => {
    enableLoading(true);
    await RestApi(`organizations/${organization.orgId}/payment_vouchers`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setPaymentVoucharId(res.id);
        } else {
          showError(res.error);
        }
        enableLoading(false);
      })
      .catch((e) => {
        enableLoading(false);
        showError(e);
      });
  };

  const getAllVoucherItems = async () => {
    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${
        state?.payment?.id || paymentVoucharId
      }/items`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          res.data.map((a) =>
            Object.assign(a, {
              selected: true,
              credit_period: a.age,
              name: a.vendor_name,
              voucher_id: a.id,
              paidAmount: a.amount,
            })
          );
          setVendorBills(res.data);
        } else {
          showError(res.error);
        }
        enableLoading(false);
      })
      .catch((e) => {
        enableLoading(false);
        showError(e);
      });
  };
  useEffect(() => {
    if (state) {
      setTabValue(1);
      setPaymentVoucharId(state?.payment?.id);
      getAllVoucherItems();
    } else {
      setTabValue(0);
      CreateVoucher();
      GetUnsettledVendorBills();
    }
  }, []);
  useEffect(() => {
    if (state && tabValue === 1) {
      getAllVoucherItems();
    }
  }, [tabValue]);

  const onInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    const searchResult =
      unsettledVendorBills &&
      unsettledVendorBills.filter(
        (item) =>
          item && item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
    setSearchUnsettledVendorBills(searchResult);
  };

  const deleteVoucher = async (id) => {
    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucharId}/items/${id}`,
      {
        method: METHOD.DELETE,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && res.error) {
          showError(res.error);
        }
      })
      .catch((e) => {
        showError(e);
      });
  };

  const updateVoucherItem = async (id, amount) => {
    enableLoading(true);
    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucharId}/items/${id}`,
      {
        method: METHOD.PATCH,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          amount,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          const newItems = vendorBills.map((item) => {
            if (item.voucher_id === id) {
              const updatedItem = {
                ...item,
                paidAmount: amount,
              };
              return updatedItem;
            }
            return { ...item };
          });
          setVendorBills(newItems);
        } else {
          showError(res.error);
        }
        enableLoading(false);
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  const createVoucherItem = async (data) => {
    const body = {
      vendor_id: vendor,
      amount: data.amount,
      document_reference: '',
      description: data.narration,
      txn_line_id: data.txn_line_id,
    };
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${paymentVoucharId}/items`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: { ...body },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const newItems = vendorBills.map((item) => {
            if (item.id === data.txn_line_id) {
              const updatedItem = {
                ...item,
                voucher_id: res.id,
                selected: true,
              };
              return updatedItem;
            }

            return { ...item };
          });

          setVendorBills(newItems);
        } else {
          showError(res.error);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const handleSelect = (checked, id, vendor_id) => {
    const bill = vendorBills.find((a) => a.id === id);
    const body = {
      amount: 0,
      document_reference: '',
      description: bill.narration,
      txn_line_id: bill.id,
    };

    if (checked === true) {
      createVoucherItem(body);
    } else {
      deleteVoucher(bill.voucher_id);
      const newItems = vendorBills.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            selected: checked,
            voucher_id: null,
            paidAmount: 0,
          };
          return updatedItem;
        }
        return item;
      });
      setVendorBills(newItems);
      const temp = searchUnsettledVendorBills.map((item) => {
        const t = item;
        if (t.id === vendor_id) {
          t.selected = false;
          t.total_count = Number(t.total_count) + 1;
          return item;
        }
        return t;
      });
      setSearchUnsettledVendorBills(temp);
    }
  };

  const handleAmountChange = (amount, id) => {
    const newItems = vendorBills.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          paidAmount: amount,
        };
        return updatedItem;
      }

      return { ...item };
    });

    setVendorBills(newItems);
  };
  const groupByKey = (data, key) => {
    return data.reduce((acc, item) => {
      (acc[item[key]] = acc[item[key]] || []).push(item);
      return acc;
    }, {});
  };
  useEffect(() => {
    // let partyCount = 1;
    // if (state) {
    const vendorObj = {};
    vendorBills.forEach((el) => {
      vendorObj[el.vendor_id] = null;
    });
    const partyCount = Object.keys(vendorObj).length;
    // }
    const billCount = vendorBills.filter((a) => a.selected).length;

    const totalAmount = vendorBills
      .filter((a) => a.selected && Number(a.paidAmount) <= Number(a.amount))
      .map((a) => Number(a.paidAmount) || 0)
      .reduce((a, b) => a + b, 0);
    if (billCount === 0) {
      setPayNow({
        active: false,
        title: 'Grand Total',
        subTitle: 'No Parties and Bills Selected for Payment',
      });
    } else {
      setPayNow({
        active: Number.isNaN(totalAmount) ? 0 : Number(totalAmount) > 0,
        title: FormattedAmount(totalAmount),
        subTitle: `${partyCount} Party and ${billCount} Bills Selected`,
      });
    }
  }, [vendorBills]);
  const fintotal = (input) => {
    let total = 0;
    input.map((item) => {
      total += Number(item.amount);
      return total;
    });
    return Number.isNaN(total) ? 0 : total;
  };
  return (
    // here
    device === 'desktop' ? (
      <div className={css.makePaymentContainerDesktop}>
        <div className={css.makePaymentContainerMainDesktop}>
          <div className={css.headerContainerDesktop}>
            <div className={css.headerLabel}>
              {drawer.paymentSuccess ? 'Payment Status' : 'Make a Payment'}
            </div>
            <span className={css.headerUnderline} />
          </div>
          {drawer.paymentSuccess ? (
            <SuccessView
              title="Your Payment is Being Processed"
              description=""
              btnTitle="Visit Payments"
              onClick={() => {
                changeSubView('paymentView');
                navigate('/payment');
              }}
            />
          ) : (
            <div className={css.tabContainerDesktop}>
              <Mui.Grid className={css.right}>
                <Mui.Grid className={css.rejectFont}>Reject</Mui.Grid>
              </Mui.Grid>
              <div className={css.tabsWrapperDesktop}>
                <div className={css.title}>Make a payment</div>
                <Mui.Divider className={css.divideHead} />
                <Tabs
                  value={tabValue}
                  onChange={tabchange}
                  className={css.tabsStyle}
                  classes={{
                    indicator: classes.indicator,
                  }}
                >
                  <Tab
                    disableRipple
                    value={0}
                    key="outstanding"
                    label="OUTSTANDING"
                    className={tabValue === 0 ? css.activeTab : css.deactiveTab}
                  />
                  <Tab
                    disableRipple
                    value={1}
                    key="selected"
                    label="SELECTED"
                    className={tabValue === 1 ? css.activeTab : css.deactiveTab}
                  />
                </Tabs>
              </div>

              <Mui.Typography className={css.text}>
                companies to be selected
              </Mui.Typography>
              {tabValue === 0 ? (
                <>
                  <div className={css.outstanding}>
                    <Mui.Grid className={css.searchClass2}>
                      <img
                        src={SearchIcon2}
                        className={css.searchClass}
                        alt="search"
                      />
                    </Mui.Grid>
                    <InputBase
                      inputRef={searchRef}
                      className={classes.styledCardTextfieldDesktop}
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search for Bills"
                      name="search"
                      value={searchTerm}
                      onChange={(e) => onInputChange(e)}
                    />

                    <div className={css.billsDesktop}>
                      <div className={css.displayFlex}>
                        <Mui.Stack direction="row">
                          <Mui.Typography>
                            <Mui.Checkbox
                              // onClick={() => selectedCust(val)}
                              style={{ color: '#F08B32' }}
                            />
                          </Mui.Typography>
                          <div className={css.billNamed}>
                            Acme Inc. - 2 Invoices
                          </div>
                        </Mui.Stack>
                        <Mui.Stack direction="row" className={css.billRow}>
                          <Mui.Grid className={css.billNamed2}>
                            Rs. 23,00,000
                          </Mui.Grid>
                          <Mui.Grid className={css.billNamed}>
                            <img src={upArrowPayment} alt="payments" />
                          </Mui.Grid>
                        </Mui.Stack>
                      </div>
                      <div className={css.displayFlex2}>
                        <Mui.Stack direction="row">
                          <Mui.Typography>
                            <Mui.Checkbox
                              // onClick={() => selectedCust(val)}
                              style={{ color: '#F08B32' }}
                            />
                          </Mui.Typography>
                          <Mui.Grid className={css.billNamed}>
                            <div className={css.greyCard}>
                              Acme Inc. - 2 Invoices
                            </div>
                            <div className={css.overDueTime}>
                              Overdue by 4 Days
                            </div>
                          </Mui.Grid>
                        </Mui.Stack>
                        <Mui.Stack>
                          <Mui.Grid
                            className={css.toPay}
                            onClick={() => {
                              setButton('Send For Approval');
                            }}
                          >
                            To pay
                          </Mui.Grid>
                          <Mui.Grid
                            className={css.toPayAmount}
                            onClick={() => {
                              setButton('download');
                            }}
                          >
                            Rs. 35,000
                          </Mui.Grid>
                        </Mui.Stack>
                        <Mui.Stack direction="row">
                          <Mui.Divider className={css.divider} />
                          <Mui.Stack className={css.pr}>
                            <Mui.Grid className={css.toPay}>
                              Pending Amount
                            </Mui.Grid>
                            <Mui.Grid className={css.toPayAmount2}>
                              Rs. 35,000
                            </Mui.Grid>
                          </Mui.Stack>
                        </Mui.Stack>
                      </div>

                      {/* {searchUnsettledVendorBills &&
                      searchUnsettledVendorBills.length > 0 &&
                      searchUnsettledVendorBills.map((bill) => {
                        if (bill.selected === false) {
                          return (
                            <div
                              key={`index-${bill.id}`}
                              className={css.billItemDesktop}
                              onClick={() =>
                                onTriggerDrawer('makePayment', bill.id)
                              }
                            >
                              <div className={css.body}>
                                <p className={css.billName}>
                                  {bill.name?.toLowerCase()}
                                </p>
                                <p className={css.totalBill}>
                                  {bill.total_count} Outstanding Biils
                                </p>
                              </div>
                              <p className={css.billAmount}>
                                Rs.{' '}
                                {Number(
                                  bill.total_net_balance,
                                ) 'en-IN')}
                              </p>
                            </div>
                          );
                        }
                      })} */}
                    </div>
                  </div>
                  <div className={css.payNowDesktop}>
                    <PayNow
                      active={payNow.active}
                      title={payNow.title}
                      subTitle={payNow.subTitle}
                      handlePay={() => {}}
                      hasBalance
                    />
                  </div>
                  <SelectBottomSheet
                    triggerComponent
                    open={drawer.makePayment}
                    name="makePayment"
                    onClose={() => handleBottomSheet('makePayment')}
                    id="overFlowHidden"
                  >
                    <VendorBill
                      vendorBillsList={vendorBills}
                      vendor_id={vendor}
                      deleteVoucher={deleteVoucher}
                      paymentVoucharId={paymentVoucharId}
                      done={(amount, billCount, selectedids) => {
                        setTabValue(1);
                        setDrawer({ makePayment: false });
                        setPayNow({
                          active: true,
                          title: `Rs. ${amount}`,
                          subTitle: `1 Party and ${billCount} Bill(s) Selected`,
                        });
                        getAllVoucherItems();
                        const list = searchUnsettledVendorBills.map((item) => {
                          const temp = item;
                          const count =
                            Number(temp.total_count) - selectedids.length;
                          if (temp.id === vendor) {
                            temp.total_count = count;
                            temp.selected = count === 0;
                            return temp;
                          }
                          return temp;
                        });
                        setselectedbillids((prvdata) => {
                          let temp = prvdata;
                          temp = [...selectedbillids, ...selectedids];
                          return temp;
                        });
                        setSearchUnsettledVendorBills(list);
                      }}
                    />
                  </SelectBottomSheet>
                </>
              ) : (
                <>
                  <div className={css.selectedParty}>
                    {/* {vendorBills.filter((a) => a.selected)?.length > 0 && (
                    <div className={css.selectedBill}>
                      <p className={css.selectedBillName}>Total</p>
                      <p className={css.selectedTotalAmount}>{payNow?.title}</p>
                    </div>
                  )} */}
                    {vendorBills?.length > 0 &&
                      Object.keys(
                        groupByKey(
                          vendorBills.filter((a) => a.selected),
                          'vendor_name'
                        )
                      ).map((objKey) => {
                        return (
                          <>
                            <div className={css.selectedBill}>
                              <p className={css.selectedBillName}>
                                {pageParams === null
                                  ? unsettledVendorBills
                                      .find((a) => a.id === vendor)
                                      ?.name?.toLowerCase()
                                  : objKey}
                              </p>
                              <p className={css.selectedTotalAmount}>
                                {FormattedAmount(
                                  fintotal(
                                    groupByKey(
                                      vendorBills?.filter((a) => a?.selected),
                                      'vendor_name'
                                    )[objKey]
                                  )
                                )}
                              </p>
                            </div>
                            {groupByKey(
                              vendorBills.filter((a) => a.selected),
                              'vendor_name'
                            )[objKey].map((listitem, index) => {
                              return (
                                <div
                                  className={css.categoryOptionsDesktop}
                                  key={listitem.id}
                                  role="menuitem"
                                >
                                  {console.log('itemval', listitem)}
                                  <BillItem
                                    key={listitem.id}
                                    index={index}
                                    checked={listitem.selected}
                                    name={listitem.vendor_name}
                                    totalAmount={listitem.amount}
                                    paidAmount={listitem.paidAmount}
                                    day={listitem.age_description}
                                    descriptionColor={
                                      listitem.age_description_color
                                    }
                                    hasAgeDescription
                                    handleChange={(e) =>
                                      handleSelect(
                                        e.target.checked,
                                        listitem.id,
                                        listitem.vendor_id
                                      )
                                    }
                                    id={listitem.id}
                                    tabValue={tabValue}
                                    handleAmountChange={(e) => {
                                      handleAmountChange(
                                        e.target.value,
                                        listitem.id
                                      );
                                    }}
                                    date={listitem.date}
                                    updateAmount={() =>
                                      updateVoucherItem(
                                        listitem.voucher_id,
                                        listitem.paidAmount
                                      )
                                    }
                                  />
                                </div>
                              );
                            })}
                          </>
                        );
                      })}
                  </div>

                  {/* <div className={css.payNowDesk}> */}
                  {/* <PayNow
                    active={payNow.active}
                    title={payNow.title}
                    subTitle={payNow.subTitle}
                    handlePay={handlePay}
                    hasBalance
                  /> */}
                  {/* </div> */}
                  <SelectBottomSheet
                    triggerComponent
                    open={drawer.proceedToPay}
                    name="proceedToPay"
                    onClose={handleBottomSheet}
                  >
                    <ProceedToPay
                      onClose={handleBottomSheet}
                      paymentVoucharId={paymentVoucharId}
                      showVerifyPassword={[drawer, setDrawer]}
                      bankAccounts={bankAccounts}
                      paidAmount={vendorBills
                        .filter((a) => a.selected)
                        .map((a) => Number(a.paidAmount) || 0)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2)}
                      payNow={payNow}
                    />
                  </SelectBottomSheet>
                </>
              )}
            </div>
          )}
        </div>
        {tabValue === 0 && (
          <Mui.Stack direction="row" className={css.payStackDesktop}>
            <Mui.Stack style={{ margin: '0 10px' }}>
              <Mui.Typography className={css.grandTotal}>
                Grand Total
              </Mui.Typography>
              <Mui.Typography style={{ color: 'white' }}>
                Rs. 35,00,000
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack className={css.payStackDesktops}>
              {button !== 'download' ? (
                <Mui.Button
                  className={
                    button === 'Send For Approval' ? css.btn1 : css.btn
                  }
                  disableElevation
                  disableTouchRipple
                  onClick={() => {
                    navigate('/payment-processing', {
                      state: {
                        status: 'success',
                      },
                    });
                  }}
                >
                  <Mui.Typography noWrap className={css.buttonFont}>
                    {button}
                  </Mui.Typography>
                </Mui.Button>
              ) : (
                <Mui.Stack direction="row">
                  <Mui.Button
                    className={css.btn2}
                    disableElevation
                    disableTouchRipple
                    onClick={() => {
                      navigate('/payment-processing', {
                        state: {
                          status: 'success',
                        },
                      });
                    }}
                  >
                    <Mui.Typography noWrap className={css.buttonFont}>
                      Download Acknowledgement
                    </Mui.Typography>
                  </Mui.Button>
                  <Mui.Button
                    className={css.btn3}
                    disableElevation
                    disableTouchRipple
                    onClick={() => {
                      navigate('/payment-processing', {
                        state: {
                          status: 'succes',
                        },
                      });
                    }}
                  >
                    <Mui.Typography noWrap className={css.buttonFont}>
                      Share With Customer{' '}
                    </Mui.Typography>
                  </Mui.Button>
                </Mui.Stack>
              )}
            </Mui.Stack>
          </Mui.Stack>
        )}
      </div>
    ) : (
      <Mui.Stack className={css.stack}>
        <Mui.Stack>
          <Mui.Typography className={css.title}>Make a Payment</Mui.Typography>
          <Mui.Divider
            style={{
              borderRadius: '4px',
              width: '16px',
              height: '1px',
              marginLeft: '21px',
              backgroundColor: '#F08B32',
            }}
            variant="fullWidth"
          />
        </Mui.Stack>
        <Mui.Grid className={css.gridAddAndManage}>
          <Mui.Stack
            direction="row"
            justifyContent="space-around"
            style={{ marginTop: '34px' }}
          >
            <Mui.Grid
              style={{ fontSize: '15px' }}
              className={color === false ? classes.fontcolr : classes.fontcolrs}
              onClick={() => {
                setColor(true);
              }}
            >
              OUTSTANDING
            </Mui.Grid>
            <Mui.Grid
              style={{ fontSize: '15px' }}
              className={color === true ? classes.fontcolr : classes.fontcolrs}
              onClick={() => {
                setColor(false);
                setPayStatus('paid');
              }}
            >
              {' '}
              SELCETED
            </Mui.Grid>
          </Mui.Stack>
          <Mui.Grid
            style={{
              display: 'flex',
              flexDirection: 'row',
              // marginLeft: '-13.5%',
              width: '100%',
            }}
          >
            <Mui.Grid xs={6} lg={6} md={6} sm={6}>
              <Mui.Divider
                className={color === false ? classes.colr : classes.colrs}
                variant="fullWidth"
              />{' '}
            </Mui.Grid>
            <Mui.Grid xs={6} lg={6} md={6} sm={6}>
              <Mui.Divider
                className={color === true ? classes.colr : classes.colrs}
                variant="fullWidth"
              />
            </Mui.Grid>{' '}
          </Mui.Grid>
          <Mui.Grid>
            <Mui.Typography className={css.titleSelectEmail}>
              {color === true
                ? 'Select the Emails from which you get your Bills'
                : 'List of Providers whose Emails are scanned for Bills'}
            </Mui.Typography>
            <Mui.Grid>
              {color === false ? (
                <Mui.Stack direction="row" className={css.dataGrid}>
                  <Mui.Grid>
                    <Mui.Typography>Ngrok.com billing@ngrok.com</Mui.Typography>
                  </Mui.Grid>
                  {/* <Mui.Grid>
                    <img src={bin} alt="bin" />
                  </Mui.Grid> */}
                </Mui.Stack>
              ) : (
                <Mui.Stack direction="row" className={css.dataGrid}>
                  <Mui.Grid className={css.cardWhite}>
                    <Mui.Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: '7px' }}
                    >
                      <Mui.Grid className={css.invoiceNum} sx={{ ml: '10px' }}>
                        ACME INC.
                      </Mui.Grid>
                      <Mui.Stack direction="row" className={css.gridAmt}>
                        <Mui.Grid className={css.invoiceAmt}>
                          Rs. 60,000s
                        </Mui.Grid>
                        <Mui.Grid sx={{ pb: '4px' }}>
                          <img
                            src={upArrowPayment}
                            alt="payments"
                            width="16px"
                          />
                        </Mui.Grid>
                      </Mui.Stack>
                    </Mui.Stack>
                    <Mui.Stack direction="row">
                      <Mui.Grid>
                        <Mui.Typography className={css.checkBox}>
                          <Mui.Checkbox
                            size="medium"
                            // onClick={() => selectedCust(val)}
                            style={{ color: '#F08B32' }}
                          />
                        </Mui.Typography>
                      </Mui.Grid>
                      <Mui.Stack className={css.gridVal}>
                        <Mui.Grid
                          className={css.invoiceNum}
                          sx={{ width: '146px' }}
                        >
                          INV-0991 (dt. 12/02/2022)
                        </Mui.Grid>
                        <Mui.Grid className={css.invoiceDate}>
                          Overdue by 4 Days
                        </Mui.Grid>
                      </Mui.Stack>

                      <Mui.Stack className={css.stackInput}>
                        <Mui.Grid>
                          <InputBase
                            inputRef={searchRef}
                            className={classes.styledCardTextfieldDesktop2}
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Rs.100"
                            name="search"
                            value={searchTerm}
                            onChange={(e) => onInputChange(e)}
                          />
                        </Mui.Grid>
                        <Mui.Grid className={css.invoiceAmt}>
                          Out of Rs. 45,000
                        </Mui.Grid>
                      </Mui.Stack>
                    </Mui.Stack>
                  </Mui.Grid>
                  {/* <Mui.Grid className={css.invoiceImg}>
                    <img src={invoiceAddAndManage} alt="addandmanage" />
                  </Mui.Grid> */}
                </Mui.Stack>
              )}
            </Mui.Grid>
          </Mui.Grid>
          {color === true && (
            <Mui.Stack direction="row" className={css.buttons}>
              <Mui.Button
                className={payStatus === 'paid' ? css.paid2 : css.addProvider}
                onClick={() => {
                  if (payStatus === 'unApproved') {
                    navigate('/payment-processing');
                  } else if (payStatus === 'paid') {
                    navigate('/payment-processing');
                  } else {
                    navigate('/payment-processing', {
                      state: {
                        status: 'success',
                      },
                    });
                  }
                }}
              >
                {(payStatus === 'pay' && 'Review') ||
                  (payStatus === 'paid' && 'Download Acknowledgement') ||
                  (payStatus === 'unApproved' && 'Comment')}
              </Mui.Button>
              <Mui.Button
                className={
                  payStatus === 'paid' ? css.paid1 : css.providerConfirm
                }
                onClick={() => {
                  if (payStatus === 'unApproved') {
                    navigate('/payment-processing');
                  } else if (payStatus === 'paid') {
                    navigate('/payment-processing');
                  } else {
                    navigate('/payment-processing', {
                      state: {
                        status: 'success',
                      },
                    });
                  }
                }}
              >
                {(payStatus === 'pay' && 'Approve') ||
                  (payStatus === 'paid' && 'Share with Customer') ||
                  (payStatus === 'unApproved' && 'Send it Myself')}
              </Mui.Button>
            </Mui.Stack>
          )}
        </Mui.Grid>
      </Mui.Stack>
    )
  );
};

export default MakeAPayment;
