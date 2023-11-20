import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Avatar, IconButton, Popover, Dialog, Tooltip } from '@mui/material';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {
  ElectricityIcon,
  InternetIcon,
  PhoneIcon,
} from '@components/SvgIcons/SvgIcons.jsx';

import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';

import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EastIcon from '@mui/icons-material/East';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import CachedIcon from '@mui/icons-material/Cached';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import StopWatch from '@assets/WebAssets/stopwatch.svg';

import CircleOk from '@assets/WebAssets/circle-ok2.svg';
import ErrorImg from '@assets/WebAssets/payfailure.svg';

import billDetail from '@assets/WebAssets/alert-circle.svg';
import billrefresh from '@assets/WebAssets/refresh-cw.svg';
import billdelete from '@assets/WebAssets/billdelete.svg';
import paymenthistory from '@assets/WebAssets/paymenthistory.svg';

import ForgetPassword from '../PaymentView/TransactionVerify/ForgetPassword';
import { BillDetails, PaymentDetilsShow } from './components/BillComponent';
import ProceedToPay from '../PaymentView/shared/ProceedToPay';

import UtilityBills from './UtilityBills/UtilityBills';
import * as css from './UtilityBillsViewContainer.scss';

const listItems = [
  {
    icon: <PhoneIcon className={css.fontIcon} />,
    title: 'Phone',
    desc: 'Set up your Monthly Payment for Phone Bill Services',
  },
  {
    icon: <ElectricityIcon className={css.fontIcon} />,
    title: 'Electricity',
    desc: 'Set up your Monthly Electricity Payment Process',
  },
  {
    icon: <InternetIcon className={css.fontIcon} />,
    title: 'Internet',
    desc: 'Set up your Monthly Payment for Internet Bill Services',
  },
];

const UtilityBillsViewContainer = () => {
  const navigate = useNavigate();

  const { organization, enableLoading, user, openSnackBar } =
    useContext(AppContext);

  const IndianCurrency = Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const [drawer, setDrawer] = useState({});
  const [drawer_, setDrawer_] = useState({});
  const [PaidBillList, setPaidBillList] = useState([]);
  const [SelectedBill, setSelectedBill] = useState({});

  const device = localStorage.getItem('device_detect');
  const [billInfo, setBillInfo] = useState({
    phone: false,
    electricity: false,
    internet: false,
    page: '',
  });

  const [billPaymentHistory, setBillPaymentHistory] = useState([]);
  const [onePayment, setOnePayment] = useState({});

  const [bankAccounts, setBankAccounts] = useState({});
  const [voucher, setVoucher] = useState({});
  const [payNow, setPayNow] = useState({
    active: true,
    title: 'Grand Total',
    subTitle: 'No Parties and Bills Selected for Payment',
  });

  const onClick = (page) => {
    if (device === 'mobile') {
      if (page === 'Phone') navigate('/bill-utility-phone');
      else if (page === 'Electricity') navigate('/bill-utility-electricity');
      else if (page === 'Internet') navigate('/bill-utility-internet');
    } else if (device === 'desktop') {
      if (page === 'Phone')
        setBillInfo((prev) => ({ ...prev, phone: true, page }));
      else if (page === 'Electricity')
        setBillInfo((prev) => ({ ...prev, electricity: true, page }));
      else if (page === 'Internet')
        setBillInfo((prev) => ({ ...prev, internet: true, page }));
    }
  };

  const handleDrawerOpen = (name, value) => {
    setDrawer((prev) => ({ ...prev, [name]: value }));
  };

  const getBillList = async () => {
    enableLoading(true);

    RestApi(`organizations/${organization.orgId}/bbps_accounts`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setPaidBillList(res?.data);
        } else {
          openSnackBar({
            message: res?.message || 'Something Went Wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Something Went Wrong',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown Error Occured',
      type: MESSAGE_TYPE.ERROR,
    });
  };

  const getBillPaymentHistory = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/bbps_accounts/${SelectedBill.id}/payment_history`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setBillPaymentHistory((prev) => [...prev, ...res.data]);
        } else {
          showError(res.message);
        }
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  const viewPaymentHistory = (rowdata) => {
    setOnePayment(rowdata);
    handleDrawerOpen('paymentDetailsCard', true);
  };

  const BillRefresh = async (account_id) => {
    enableLoading(true);

    RestApi(
      `organizations/${organization.orgId}/bbps_accounts/${account_id}/refresh`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: 'Refresh Done',
            type: MESSAGE_TYPE.INFO,
          });
          getBillList();
        } else {
          openSnackBar({
            message: res?.message || 'Something Went Wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Something Went Wrong',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const BillDelete = async (account_id) => {
    enableLoading(true);

    RestApi(`organizations/${organization.orgId}/bbps_accounts/${account_id}`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
          getBillList();
        } else {
          openSnackBar({
            message: res?.message || 'Something Went Wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Something Went Wrong',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const getDaysFromNowToDate = (dateString) => {
    const dueDate = new Date(dateString);
    const currentDate = new Date();
    const differenceMs = dueDate - currentDate;
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    return differenceDays > 0 ? Math.abs(differenceDays) : 0;
  };

  const getDueSatement = (dateString) => {
    const overdueAge = getDaysFromNowToDate(dateString);
    let overdueStatement = '';
    if (Number(overdueAge) > 0) {
      overdueStatement = `Due in ${overdueAge} Days`;
    } else if (Number(overdueAge) < 0) {
      overdueStatement = `Overdue by ${overdueAge} Days`;
    } else if (Number(overdueAge) === 0) {
      overdueStatement = 'Due today';
    }
    return overdueStatement;
  };

  const getBankAccounts = async (fetchId) => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${fetchId}/bank_accounts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (!res.message && !res.error && !res.errors) {
          setBankAccounts(res.data);
          handleDrawerOpen('billPayment', true);
        } else showError(res.message);
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  const getPaymentVoucher = async (fetchId) => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/bbps_fetches/${fetchId}/bbps_payments`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.message) {
          setVoucher(res);
          getBankAccounts(fetchId);
        } else {
          showError(res.message);
        }
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  useEffect(() => {
    getBillList();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        background: device === 'mobile' && '#FFFFFF',
      }}
    >
      {PaidBillList?.length > 0 && (
        <div
          className={
            device === 'mobile'
              ? css.utilityBillsTopViewmob
              : css.utilityBillsTopView
          }
          style={{ padding: device === 'mobile' ? '4%' : '0' }}
        >
          <p className={css.headerText}>Bill Pay</p>
          <div className={device === 'mobile' ? css.mainCardmob : css.mainCard}>
            {PaidBillList?.map((val) => (
              <div className={`${css.card}`}>
                <div
                  className={css.innerDiv}
                  onClick={() => {
                    handleDrawerOpen('billDetails', true);
                    setSelectedBill(val);
                  }}
                >
                  <div className={css.divForTop}>
                    <div className={css.divForTopFirst}>
                      <Avatar
                        alt="provider icon"
                        src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/${val.source_id}.svg`}
                        className={css.avatar}
                      >
                        <img
                          src="https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/unknown_mobile_broadband.svg"
                          alt="fallback"
                          style={{ background: '#FFFFFF' }}
                        />
                      </Avatar>
                      <p className={css.pTagForName}>{val?.biller_name}</p>
                    </div>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDrawerOpen('listPopover', e?.currentTarget);
                        setSelectedBill(val);
                      }}
                    >
                      <MoreVertIcon sx={{ width: 20, height: 20 }} />
                    </IconButton>
                  </div>
                  <div className={css.divForSecond}>
                    <p className={css.name}>{val?.account_holder_name}</p>
                    <p className={css.number}>
                      {val?.input_params?.[0]?.value}
                    </p>

                    {val?.paid && (
                      <div className={css.statusSuccess}>
                        <p>Paid</p>
                      </div>
                    )}
                    {(val.payment_status === 'bbps_pending' ||
                      val.payment_status === 'settlement_processing') && (
                      <div className={css.statusProcess}>
                        <p>Processing</p>
                      </div>
                    )}

                    {val.payment_status !== 'bbps_pending' &&
                      !val.paid &&
                      val.payment_status !== 'settlement_processing' && (
                        <div className={css.statusFail}>
                          <p>{getDueSatement(val?.due_date)}</p>
                        </div>
                      )}
                  </div>
                </div>

                {val.payment_status === 'bbps_pending' ||
                val.payment_status === 'settlement_processing' ? (
                  <Tooltip title="Payment is Processing" arrow>
                    <div
                      className={css.secondDiv}
                      // onClick={() => {
                      //   getPaymentVoucher(val.fetch_id);
                      //   setSelectedBill(val);
                      //   setPayNow((prev) => ({
                      //     ...prev,
                      //     title: FormattedAmount(val?.total_amount || 0),
                      //   }));
                      // }}
                      style={{ cursor: 'not-allowed' }}
                    >
                      <p className={css.amount}>
                        {FormattedAmount(val?.total_amount || 0)}
                      </p>
                      <button
                        type="submit"
                        className={css.secondDivInner}
                        disabled
                      >
                        <p className={css.payNow}>Pay Now</p>
                        <IconButton style={{ marginTop: '-7px !important' }}>
                          <EastIcon
                            sx={{ color: '#fff', width: 20, height: 20 }}
                          />
                        </IconButton>
                      </button>
                    </div>
                  </Tooltip>
                ) : (
                  <div
                    className={css.secondDiv}
                    onClick={() => {
                      getPaymentVoucher(val.fetch_id);
                      setSelectedBill(val);
                      setPayNow((prev) => ({
                        ...prev,
                        title: FormattedAmount(val?.total_amount || 0),
                      }));
                    }}
                  >
                    <p className={css.amount}>
                      {FormattedAmount(val?.total_amount || 0)}
                    </p>
                    <button type="submit" className={css.secondDivInner}>
                      <p className={css.payNow}>Pay Now</p>
                      <IconButton style={{ marginTop: '-7px !important' }}>
                        <EastIcon
                          sx={{ color: '#fff', width: 20, height: 20 }}
                        />
                      </IconButton>
                    </button>
                  </div>
                )}
                {/* <div className={device === 'mobile' ? css.wavemob : css.wave} /> */}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={css.utilityBillsViewContainer}>
        {device !== 'mobile' && <p className={css.headerText}>Bill Pay</p>}

        <div className={css.card}>
          {listItems.map((item) => (
            <div
              key={item.title}
              className={css.listItem}
              onClick={() => onClick(item.title)}
              role="menuitem"
            >
              <div className={css.icon}>{item.icon}</div>
              <div className={css.content}>
                <div className={css.title}>{item.title}</div>
                <div className={css.desc}>{item.desc}</div>
              </div>
              <ArrowForwardIosIcon className={css.arrow} />
            </div>
          ))}
        </div>
      </div>

      <UtilityBills billInfoState={[billInfo, setBillInfo, getBillList]} />

      <Popover
        open={Boolean(drawer?.listPopover)}
        anchorEl={drawer?.listPopover}
        onClose={() => handleDrawerOpen('listPopover', null)}
        PaperProps={{
          elevation: 3,
          style: {
            maxHeight: 500,
            width: '275px',
            borderRadius: 8,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div>
          {[
            {
              head: 'View Bill Details',
              subHead: 'Know more about your bill',
              icon: (
                <>
                  <img src={billDetail} alt="bill detail" />
                </>
              ),
              click: () => {
                handleDrawerOpen('listPopover', null);
                handleDrawerOpen('billDetails', true);
              },
            },
            {
              head: 'Payment History ',
              subHead: 'View your utility payments',
              icon: (
                <>
                  <img src={paymenthistory} alt="bill detail" />
                </>
              ),
              click: () => {
                getBillPaymentHistory();
                handleDrawerOpen('listPopover', null);
                handleDrawerOpen('paymentHistory', true);
                setBillPaymentHistory([]);
              },
            },
            {
              head: 'Refresh',
              subHead: 'get the latest payment status',
              icon: (
                <>
                  <img src={billrefresh} alt="bill refresh" />
                </>
              ),
              click: () => {
                handleDrawerOpen('listPopover', null);
                BillRefresh(SelectedBill?.id);
              },
              disable:
                SelectedBill.payment_status === 'bbps_pending' ||
                SelectedBill.payment_status === 'settlement_processing',
            },
            {
              head: 'Delete',
              subHead: 'Move this bill out of your view',
              icon: (
                <>
                  <img src={billdelete} alt="bill delete" />
                </>
              ),
              click: () => {
                handleDrawerOpen('listPopover', null);
                BillDelete(SelectedBill?.id);
              },
              disable:
                SelectedBill.payment_status === 'bbps_pending' ||
                SelectedBill.payment_status === 'settlement_processing',
            },
          ]?.map((val) => (
            <button
              key={val.head}
              title={val.disable && 'Payment is Processing'}
              type="button"
              className={css.popoverCont}
              onClick={() => val?.click()}
              disabled={val.disable}
            >
              {val?.icon}
              <div>
                <p className={css.head}>{val?.head}</p>
                <p className={css.subHead}>{val?.subHead}</p>
              </div>
            </button>
          ))}
        </div>
      </Popover>

      <Dialog
        open={drawer?.billDetails}
        onClose={() => handleDrawerOpen('billDetails', false)}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: '18px',
            width: '500px',
            height: 'auto',
          },
        }}
      >
        <BillDetails
          SelectedValue={SelectedBill}
          handleClose={() => handleDrawerOpen('billDetails', false)}
          OnSubmit={(fetchId) => getPaymentVoucher(fetchId)}
        />
      </Dialog>

      <SelectBottomSheet
        open={drawer?.paymentHistory}
        id="overFlowHidden"
        onClose={() => handleDrawerOpen('paymentHistory', false)}
        triggerComponent={<></>}
        addNewSheet
      >
        <div className={css.bottomSheetCont}>
          <p className={css.head}>Payment History</p>

          <div className={css.headCont}>
            <Avatar
              src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/${SelectedBill.source_id}.svg`}
              className={css.avatar}
            >
              <img
                src="https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/unknown_mobile_broadband.svg"
                alt="fallback"
              />
            </Avatar>
            <p className={css.pTag}>{SelectedBill.biller_name}</p>
          </div>

          <div className={css.finalCont}>
            <p className={css.pTag}>
              {`Bill Payment of ${moment().format('YYYY')}`}
            </p>
            <div className={css.paymentList}>
              {billPaymentHistory.length > 0 ? (
                <>
                  {billPaymentHistory?.map((val) => (
                    <div
                      className={css.paymentCont}
                      onClick={() => viewPaymentHistory(val)}
                      key={val.id}
                    >
                      {val?.payment_status === 'bbps_success' && (
                        <Avatar
                          src={CircleOk}
                          alt="success"
                          sx={{ height: '16px', width: '16px' }}
                        />
                      )}

                      {val?.payment_status === 'bbps_failure' && (
                        <Avatar
                          src={ErrorImg}
                          alt="error"
                          sx={{ height: '16px', width: '16px' }}
                        />
                      )}
                      {val?.payment_status === 'bbps_pending' && (
                        <Avatar
                          src={StopWatch}
                          alt="processing"
                          sx={{ height: '16px', width: '16px' }}
                        />
                      )}

                      <div className={css.mainDiv}>
                        <div className={css.firstDiv}>
                          <p className={css.paymentStatus}>
                            {val?.payment_status === 'bbps_success' &&
                              'Payment Successful'}
                            {val?.payment_status === 'bbps_failure' &&
                              'Payment Failed'}
                            {val?.payment_status === 'bbps_pending' &&
                              'Payment Processing'}
                          </p>
                          <p className={css.paymentDate}>{val?.paid_at}</p>
                        </div>
                        <p className={css.paymentAmount}>
                          {IndianCurrency.format(val?.amount || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className={css.paymentCont}>No Payment History</div>
              )}
            </div>
          </div>
        </div>
      </SelectBottomSheet>

      <Dialog
        open={drawer?.paymentDetailsCard}
        onClose={() => handleDrawerOpen('paymentDetailsCard', false)}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: '18px',
            width: '500px',
            height: 'auto',
          },
        }}
      >
        <PaymentDetilsShow
          paymentDetails={onePayment}
          handleClose={() => {
            handleDrawerOpen('paymentDetailsCard', false);
          }}
        />
      </Dialog>

      <SelectBottomSheet
        triggerComponent
        open={drawer.billPayment}
        name="Pay Bill"
        onClose={() => handleDrawerOpen('billPayment', false)}
        addNewSheet
      >
        <ProceedToPay
          onClose={() => {
            handleDrawerOpen('billPayment', false);
            getBillList();
          }}
          payNow={payNow}
          payType
          bankAccounts={bankAccounts}
          paymentVoucharId={voucher?.id}
          BBPSFetchId={SelectedBill?.fetch_id}
          paidAmount={SelectedBill?.total_amount}
          ShowTransForgPass={() => handleDrawerOpen('showTransPass', true)}
          showVerifyPassword={[drawer_, setDrawer_]}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={drawer.showTransPass}
        name="forgetPassword"
        hideClose
      >
        <ForgetPassword
          onClose={() => handleDrawerOpen('showTransPass', false)}
        />
      </SelectBottomSheet>
    </div>
  );
};

export default UtilityBillsViewContainer;
