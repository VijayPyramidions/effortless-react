/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/button-has-type */

import React from 'react';
import * as Mui from '@mui/material';
import moment from 'moment';
import { withStyles } from '@material-ui/core';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import PriceIcon from '@assets/PriceIcon.svg';
import WindowsIcon from '@assets/WindowsIcon.svg';
import InvoiceIcon from '@assets/InvoiceIcon.svg';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import ProgressLabel from 'react-progress-label';
import AppContext from '@root/AppContext.jsx';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
import PaymentBankReq from '@core/PaymentView/component/PaymentBankReq.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import RequestPayment from '@core/Receivables/Ageing/RequestPayment.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import nothingtodisplay from '../../../assets/nothingtodisplay.svg';
import alert from '../../../assets/alert.svg';
import * as css from './dashboardStyles.scss';
import './carousel.css';

// import Chart6 from './charts/chart6';
import SpendBandWidth from './charts/SpendBandWidth';
// import Chart2 from './charts/chart2';
import Chart3 from './charts/chart3';
import Chart4 from './charts/chart4';
import Chart5 from './charts/chart5';
import Chart1 from './charts/chart1';

const DashboardIndex = () => {
  const {
    changeSubView,
    organization,
    user,
    setActiveInvoiceId,
    enableLoading,
    openSnackBar,
    userPermissions,
    currentUserInfo
  } = React.useContext(AppContext);

  const [overdue, setOverdue] = React.useState();
  const [payments, setPayments] = React.useState();
  const [categorize, setCategorize] = React.useState();
  const [chartValue, setChartValue] = React.useState();
  const [basicInfo, setBasicInfo] = React.useState();
  const [spendBandwidth, setSpendBandwidth] = React.useState();
  const [chartData, setChartData] = React.useState(false);
  const [chartSelect, setChartSelect] = React.useState();
  const [datas, setDatas] = React.useState();
  const [openProgress, setOpenProgress] = React.useState(null);
  const onProgressDialogClose = () => {
    setOpenProgress(null);
  };
  const [drawer, setDrawer] = React.useState({
    paymentBank: false,
    requestPayment: false,
  });
  const [clickVendorId, setClickVendorId] = React.useState('');
  const navigate = useNavigate();

  // const [userRolesPeople, setUserRolesPeople] = React.useState({});
  const [userRolesReceviables, setUserRolesReceviables] = React.useState({});
  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [userRolesExpense, setUserRolesExpense] = React.useState({});
  const [userRolesPayments, setUserRolesPayments] = React.useState({});
  // const [userRolesPayables, setUserRolesPayables] = React.useState({});
  const [userRolesBanking, setUserRolesBanking] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    // setUserRolesPeople({ ...userPermissions?.People });
    setUserRolesReceviables({ ...userPermissions?.Receivables });
    setUserRolesInvoicing({ ...userPermissions?.Invoicing });
    setUserRolesExpense({ ...userPermissions?.Expense });
    setUserRolesPayments({ ...userPermissions?.Payments });
    // setUserRolesPayables({ ...userPermissions?.Payables });
    setUserRolesBanking({ ...userPermissions?.Banking });
  }, [userPermissions]);

  const Dialog = withStyles({
    root: {
      '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
        borderRadius: '16px',
      },
    },
  })(Mui.Dialog);

  const dataHere = () => {
    RestApi(`organizations/${organization.orgId}/dashboard/payments`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    }).then((res) => {
      setOverdue(res.over_due);
      setPayments(res.payables);
    });
    RestApi(
      `organizations/${organization.orgId}/dashboard/customer_receivable_summary`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      }
    ).then((res) => {
      setDatas(res?.data);
      console.log('res', res?.data);
    });
    RestApi(`organizations/${organization.orgId}/bank_uncategorized/summary`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    }).then((res) => {
      setCategorize(res);
    });

    RestApi(`organizations/${organization.orgId}/dashboard/chart_data`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        setChartValue(res);

        setChartSelect('liquidity');
      })
      .catch((err) => {
        setChartData(true);
        console.log(err);
      });
    RestApi(`organizations/${organization.orgId}/dashboard/basic_info`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        const spendBandwidthValue =
          Number(res?.basic_info?.bank_accounts) +
          Number(res?.basic_info?.cash) +
          Number(res?.basic_info?.fixed_deposit) +
          Number(res?.basic_info?.unused_credit_card_limit) +
          Number(res?.basic_info?.unused_overdraft);
        setBasicInfo(res?.basic_info);
        setSpendBandwidth(spendBandwidthValue);
        // setChartValue(res);
      })
      .catch(() => {
        // setChartData(true);
      });
  };

  const handleBottomSheetOpen = (open, id) => {
    setDrawer((prev) => ({ ...prev, [open]: true }));
    if (id !== null) {
      setClickVendorId(id);
    }
  };

  const handleBottomSheetClose = (close) => {
    setDrawer((prev) => ({ ...prev, [close]: false }));
  };

  const makeQuickPayments = async (type, vendorId = null) => {
    const body = {};
    if (vendorId === null) {
      body.type = type;
    } else {
      body.vendor_id = vendorId;
    }
    enableLoading(true);
    await RestApi(`organizations/${organization.orgId}/quick_payments`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        ...body,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (res.message === 'No vendor bank details is present') {
            handleBottomSheetOpen('paymentBank', vendorId);
            return;
          } else if (res?.message) {
            openSnackBar({
              message:
                res?.message || 'Something went Wrong, We will look into it',
              type: MESSAGE_TYPE.ERROR,
            });
            return;
          }
          changeSubView('makePayment', res);
          navigate('/payment-makepayment', {
            state: { payment: res, opt: type },
          });
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const totalDue = datas?.total_due_as_of;
  const CurrentMonth = datas?.revenue?.current_month_revenue;
  const LastMonthRevenueData = datas?.revenue?.last_month_revenue;
  const Last6Month = datas?.revenue?.current_month_prev_year_revenue;
  const LastYear = datas?.revenue?.last_three_month_revenue;
  const LastPrevYearRevenue =
    datas?.revenue_ach?.current_month_vs_current_month_prev_yr;
  const LastMonthRevenue = datas?.revenue_ach?.current_month_vs_last_month;
  const Last3MonthRevenue =
    datas?.revenue_ach?.current_month_vs_last_three_month;
  const Overdue = datas?.over_due_receivables;
  const Overall = datas?.overall_receivables;
  React.useEffect(() => {
    if (organization && organization.orgId && currentUserInfo?.modules?.length > 0 && currentUserInfo?.modules?.filter(ele => ele.module_id === 'dashboard')[0]?.active) dataHere();
    setChartSelect();
  }, [organization?.orgId,currentUserInfo?.modules]);
  const device = localStorage.getItem('device_detect');
  // const handleButtonClick = () => {
  //   throw new Error('Error thrown by button click');
  // };

  return device === 'desktop' ? (
    <>
      <Mui.Grid container>
        <Mui.Grid item lg={8} md={8}>
          <Mui.Stack spacing={2}>
            <Mui.Stack className={css.graphStack}>
              <Mui.Stack className={css.graphStackMain}>
                <Mui.Typography>Graphs</Mui.Typography>
                <Mui.Stack style={{ marginTop: '1rem' }}>
                  <Mui.Stack
                    direction="row"
                    style={{ justifyContent: 'space-between' }}
                  >
                    {/* <button onClick={handleButtonClick}>Trigger error</button> */}
                    {/* <Mui.Button
                      className={
                        chartSelect === 'balance'
                          ? css.chartBtnSelect
                          : css.chartBtn
                      }
                      onClick={() => setChartSelect('balance')}
                    >
                      <Mui.Typography className={css.chartBtnText}>
                        balance
                      </Mui.Typography>
                    </Mui.Button> */}
                    <Mui.Button
                      className={
                        chartSelect === 'liquidity'
                          ? css.chartBtnSelect
                          : css.chartBtn
                      }
                      onClick={() => setChartSelect('liquidity')}
                    >
                      <Mui.Typography className={css.chartBtnText}>
                        liquidity
                      </Mui.Typography>
                    </Mui.Button>
                    <Mui.Button
                      className={
                        chartSelect === 'revenue'
                          ? css.chartBtnSelect
                          : css.chartBtn
                      }
                      onClick={() => setChartSelect('revenue')}
                    >
                      <Mui.Typography className={css.chartBtnText}>
                        Revenue Analysis
                      </Mui.Typography>
                    </Mui.Button>
                    <Mui.Button
                      className={
                        chartSelect === 'profitability'
                          ? css.chartBtnSelect
                          : css.chartBtn
                      }
                      onClick={() => setChartSelect('profitability')}
                    >
                      <Mui.Typography className={css.chartBtnText}>
                        Sales{' '}
                        <span style={{ textTransform: 'lowercase' }}>v.</span>{' '}
                        Collection
                      </Mui.Typography>
                    </Mui.Button>
                    <Mui.Button
                      className={
                        chartSelect === 'runway'
                          ? css.chartBtnSelect
                          : css.chartBtn
                      }
                      onClick={() => setChartSelect('runway')}
                    >
                      <Mui.Typography className={css.chartBtnText}>
                        cashburn & runway
                      </Mui.Typography>
                    </Mui.Button>
                  </Mui.Stack>
                  {chartData ? (
                    <Mui.Stack
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '45vh',
                      }}
                    >
                      <img
                        src={nothingtodisplay}
                        alt="nothing"
                        style={{ width: '200px' }}
                      />
                      <Mui.Typography className={css.noDataText}>
                        there is nothing to display
                      </Mui.Typography>
                    </Mui.Stack>
                  ) : (
                    <>
                      {/* {chartSelect === 'balance' && <Chart2 chartValue={chartValue}/>} */}
                      {chartSelect === 'liquidity' && (
                        <Chart1
                          bank={chartValue?.liquidity_position?.bank}
                          ageing={chartValue?.liquidity_position?.ageing}
                          payables={chartValue?.liquidity_position?.payables}
                        />
                      )}
                      {chartSelect === 'revenue' && (
                        // <Chart3
                        //   labels={chartValue?.collection_performance?.labels}
                        //   data={chartValue?.collection_performance?.datasets}
                        // />
                        <Chart4
                          ftm={chartValue?.sales_and_performance_ftm}
                          ytd={chartValue?.sales_and_performance_ytd}
                          monthly={chartValue?.sales_and_performance_ytm}
                        />
                      )}
                      {chartSelect === 'profitability' && (
                        // <Chart4
                        //   ftm={chartValue?.sales_and_performance_ftm}
                        //   ytd={chartValue?.sales_and_performance}
                        //   monthly={chartValue?.sales_and_performance_ytm}
                        // />
                        <Chart3
                          labels={chartValue?.collection_performance?.labels}
                          data={chartValue?.collection_performance?.datasets}
                        />
                      )}
                      {chartSelect === 'runway' && (
                        <Chart5
                          labels={chartValue?.runway_and_cashburn?.labels}
                          data={chartValue?.runway_and_cashburn?.datasets}
                        />
                      )}
                    </>
                  )}
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
            <Mui.Stack
              direction="row"
              justifyContent="space-between"
              className={css.alertRecievablesStack}
            >
              <Mui.Stack className={css.alertStack}>
                <Mui.Stack
                  className={css.alertStack1}
                  spacing={2}
                  sx={{ margin: '0px 10px 0px 0px' }}
                >
                  <Mui.Typography>Payables</Mui.Typography>
                  {chartData ? (
                    <Mui.Stack
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img src={alert} alt="alert" />
                      <Mui.Typography className={css.noDataText}>
                        no alerts available
                      </Mui.Typography>
                    </Mui.Stack>
                  ) : (
                    <>
                      <Mui.Stack
                        className={css.greenCardDesktop}
                        direction="row"
                      >
                        <Mui.Stack
                          className={css.mainStackDesktop}
                          spacing={0.5}
                        >
                          <Mui.Typography className={css.text1}>
                            Overdue Bills
                          </Mui.Typography>
                          <Mui.Typography className={css.text2}>
                            {FormattedAmount(Math.round(overdue?.amount || 0))}
                          </Mui.Typography>
                          <Mui.Typography className={css.text3}>
                            {overdue?.bill_count} Bills to{' '}
                            {overdue?.vendor_count} Parties are <br />
                            Overdue Today.
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Button
                          variant="contained"
                          className={css.cardButtonDesktop}
                          onClick={() => {
                            if (!userRolesPayments?.Payment?.create_payment) {
                              setHavePermission({
                                open: true,
                                back: () => {
                                  setHavePermission({ open: false });
                                },
                              });
                              return;
                            }
                            // navigate('/payment-makepayment');
                            makeQuickPayments('overdue');
                          }}
                          disabled={
                            Math.round(Number(overdue?.amount || 0)) === 0
                          }
                        >
                          <Mui.Typography className={css.cardButtonTxtDesktop}>
                            pay now
                          </Mui.Typography>
                        </Mui.Button>
                      </Mui.Stack>
                      <Mui.Stack
                        className={css.greenCardDesktop}
                        direction="row"
                      >
                        <Mui.Stack
                          className={css.mainStackDesktop}
                          spacing={0.5}
                        >
                          <Mui.Typography className={css.text1}>
                            Due this Week
                          </Mui.Typography>
                          <Mui.Typography className={css.text2}>
                            {FormattedAmount(Math.round(payments?.amount || 0))}
                          </Mui.Typography>
                          <Mui.Typography className={css.text3}>
                            {payments?.bill_count} Bills to{' '}
                            {payments?.vendor_count} Parties <br />
                            due this Week
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Button
                          variant="contained"
                          className={css.cardButtonDesktop}
                          onClick={() => {
                            if (!userRolesPayments?.Payment?.create_payment) {
                              setHavePermission({
                                open: true,
                                back: () => {
                                  setHavePermission({ open: false });
                                },
                              });
                              return;
                            }
                            // navigate('/payment-makepayment');
                            makeQuickPayments('payables');
                          }}
                          disabled={
                            Math.round(Number(payments?.amount || 0)) === 0
                          }
                        >
                          <Mui.Typography className={css.cardButtonTxtDesktop}>
                            Pay now
                          </Mui.Typography>
                        </Mui.Button>
                      </Mui.Stack>
                    </>
                  )}
                </Mui.Stack>
              </Mui.Stack>

              <Mui.Stack className={css.receivablesStack}>
                <Mui.Stack className={css.receivablesStackMain}>
                  <Mui.Stack direction="row" className={css.receivablesStack1}>
                    <Mui.Typography>Collections</Mui.Typography>
                    <Mui.Typography
                      className={chartData ? css.viewMoreNo : css.viewMore}
                      onClick={() => {
                        if (!userRolesReceviables?.Receivables) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        navigate('/receivables');
                      }}
                    >
                      view more
                    </Mui.Typography>
                  </Mui.Stack>
                  {Number(datas?.collection_progress) === 0 &&
                  Number(totalDue) === 0 ? (
                    <Mui.Stack
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '1rem',
                      }}
                    >
                      <img
                        src={nothingtodisplay}
                        alt="nothing"
                        style={{ width: '100px' }}
                      />
                      <Mui.Typography className={css.noDataText}>
                        no receivables available
                      </Mui.Typography>
                    </Mui.Stack>
                  ) : (
                    <>
                      <Mui.Stack
                        direction="row"
                        className={css.receivablesStack1}
                        mt={4}
                        sx={{
                          margin: '1.3rem 0rem 0rem 0rem',
                          flexFlow: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Mui.Typography className={css.dueText}>
                          Total Collection
                        </Mui.Typography>
                        <Mui.Typography>
                          {FormattedAmount(totalDue)}
                        </Mui.Typography>
                      </Mui.Stack>
                      <Mui.Stack
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          marginTop: '1.3rem',
                        }}
                      >
                        <ProgressLabel
                          progress={datas?.collection_progress}
                          fillColor="rgb(248,247,243)"
                          trackColor="#2F9682"
                          progressColor="#93eddc"
                          progressWidth={15}
                          trackWidth={16}
                          trackBorderWidth={1}
                          trackBorderColor="white"
                          cornersWidth={0}
                          size={110}
                          text={`${datas?.collection_progress || 0}%`}
                          textProps={{
                            x: '50%',
                            y: '50%',
                            dx: 3,
                            dy: 6,
                            textAnchor: 'middle',
                            style: {
                              fontSize: 18,
                              fontWeight: '600',
                              fill: 'black',
                            },
                          }}
                        />
                        <Mui.Typography className={css.progressText}>
                          Progress of Collection
                        </Mui.Typography>
                      </Mui.Stack>
                    </>
                  )}
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>

            <Mui.Stack className={css.currentStatusMain} spacing={2}>
              {/* <Mui.Stack className={css.currentStatusStack1} spacing={2}> */}
              <Mui.Stack direction="row" className={css.currentStatusStack2}>
                <Mui.Typography>Receivables</Mui.Typography>
                {/* <Mui.Typography className={css.viewMore}>
                  view more
                </Mui.Typography> */}
              </Mui.Stack>
              <Mui.Stack
                direction="row"
                className={css.greenCardDesktopMainStack}
              >
                <Mui.Stack className={css.greenCardDesktop} direction="row">
                  <Mui.Stack className={css.mainStackDesktop} spacing={1}>
                    <Mui.Typography className={css.text1}>
                      Overdue Receivables
                    </Mui.Typography>
                    <Mui.Typography className={css.text2}>
                      {FormattedAmount(parseInt(Overdue, 10))}
                    </Mui.Typography>
                  </Mui.Stack>

                  <Mui.Button
                    variant="contained"
                    className={css.cardButtonDesktop}
                    onClick={() => {
                      // navigate('/receivables');
                      setDrawer((prev) => ({ ...prev, requestPayment: true }));
                    }}
                    disabled={(parseInt(Overdue, 10) || 0) === 0}
                  >
                    <Mui.Typography className={css.cardButtonTxtDesktop}>
                      Follow Up
                    </Mui.Typography>
                  </Mui.Button>
                </Mui.Stack>

                <Mui.Stack className={css.greenCardDesktop} direction="row">
                  <Mui.Stack className={css.mainStackDesktop} spacing={1}>
                    <Mui.Typography className={css.text1}>
                      Overall Receivables
                    </Mui.Typography>
                    <Mui.Typography className={css.text2}>
                      {FormattedAmount(parseInt(Overall, 10))}
                    </Mui.Typography>
                  </Mui.Stack>
                  <Mui.Button
                    variant="contained"
                    className={css.cardButtonDesktop}
                    onClick={() => {
                      setOpenProgress(true);
                    }}
                  >
                    <Mui.Typography className={css.cardButtonTxtDesktop}>
                      Get Funding
                    </Mui.Typography>
                  </Mui.Button>
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Stack>
        </Mui.Grid>
        <Mui.Grid item lg={4} md={4}>
          <Mui.Stack spacing={2}>
            <Mui.Stack className={css.bandwidthStack}>
              <SpendBandWidth
                info={basicInfo}
                spendBandwidthValue={spendBandwidth}
                loanBorrwings={chartValue?.loan_balance}
              />
            </Mui.Stack>
            <Mui.Stack className={css.categorizeStackDesktop}>
              <Mui.Stack spacing={3} className={css.categorizeStackMain}>
                <Mui.Typography className={css.categorizeHeading}>
                  Categorize Transactions
                </Mui.Typography>
                <Mui.Stack
                  direction="row"
                  className={css.categorizeStackContent}
                >
                  <Mui.Typography noWrap className={css.categorizeTxt}>
                    {categorize?.unsettled_payments_count || 0} Unknown Payments
                  </Mui.Typography>
                  <Mui.Typography noWrap className={css.categorizeamount}>
                    {categorize?.unsettled_payments_total === 0 ? (
                      <> - </>
                    ) : (
                      <>
                        {FormattedAmount(parseInt(categorize?.unsettled_payments_total,10))}
                      </>
                    )}
                  </Mui.Typography>
                </Mui.Stack>
                <Mui.Divider
                  style={{ opacity: '0.2', margin: '16px 0px 0px' }}
                />
                <Mui.Stack
                  direction="row"
                  className={css.categorizeStackContent}
                >
                  <Mui.Typography noWrap className={css.categorizeTxt}>
                    {categorize?.unsettled_receipt_count} Unknown Receipts
                  </Mui.Typography>
                  <Mui.Typography noWrap className={css.categorizeamount}>
                    {categorize?.unsettled_receipts_total === 0 ? (
                      <> - </>
                    ) : (
                      <>
                        {FormattedAmount(parseInt(categorize?.unsettled_receipts_total,10))}
                      </>
                    )}
                  </Mui.Typography>
                </Mui.Stack>

                <Mui.Stack className={css.categorizebtnStackDesktop}>
                  <Mui.Button
                    variant="outlined"
                    className={css.categorizebtn}
                    disabled={
                      categorize?.unsettled_receipt_count === 0 &&
                      categorize?.unsettled_payments_count === 0
                    }
                    onClick={() => {
                      if (
                        !userRolesBanking?.Banking &&
                        !userRolesBanking?.Banking['Categorizing Transactions']
                          ?.view_categorization
                      ) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      navigate('/banking');
                    }}
                  >
                    <Mui.Typography noWrap className={css.categorizebtnTxt}>
                      categorize now
                    </Mui.Typography>
                  </Mui.Button>
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
            <Mui.Stack
              className={css.revenueStack}
              onClick={() => {
                if (!userRolesInvoicing['Tax Invoice'].view_invoices) {
                  setHavePermission({
                    open: true,
                    back: () => {
                      setHavePermission({ open: false });
                    },
                  });
                  return;
                }
                navigate('/invoice-approved', {
                  state: {
                    from: 'dashboard',
                    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
                    endDate: moment().endOf('month').format('YYYY-MM-DD'),
                  },
                });
              }}
            >
              <Mui.Stack className={css.revenueStackMain}>
                <Mui.Typography>Revenue</Mui.Typography>
                <Mui.Stack style={{ marginTop: '1rem' }}>
                  <Mui.Stack
                    className={css.revenueStack1}
                    direction="row"
                    spacing={2}
                    style={{
                      width: '100%',
                    }}
                  >
                    <Mui.Stack
                      direction="row"
                      spacing={1}
                      sx={{ width: '100%' }}
                    >
                      <Mui.Stack
                        direction="row"
                        spacing={1}
                        style={{
                          alignItems: 'center',
                          height: '20px',
                          marginTop: '5px',
                          // width: '20%',
                        }}
                      >
                        {/* {Number(LastMonthRevenue) === 0 && <> % </>} */}
                        {Number(LastMonthRevenue) > 0 ? (
                          <>
                            <ArrowUpwardIcon
                              style={{ width: '15px', color: '#4aaf05' }}
                            />
                            <Mui.Typography className={css.percentageText}>
                              {`${Math.round(LastMonthRevenue)}%`}
                            </Mui.Typography>
                          </>
                        ) : (
                          <>
                            <ArrowDownwardIcon
                              style={{ width: '15px', color: 'red' }}
                            />
                            <Mui.Typography className={css.percentageTextred}>
                              {`${Math.abs(Math.round(LastMonthRevenue))}%`}
                            </Mui.Typography>
                          </>
                        )}
                      </Mui.Stack>
                      <Mui.Stack
                        style={{
                          width: '60%',
                        }}
                      >
                        <Mui.Typography className={css.text1}>
                          Current Month Revenue
                        </Mui.Typography>
                        <Mui.Typography className={css.text2}>
                          Compared to Last Month Revenue
                        </Mui.Typography>
                      </Mui.Stack>
                    </Mui.Stack>
                    <Mui.Stack
                      style={
                        {
                          // width: '20%',
                        }
                      }
                    >
                      <Mui.Typography className={css.textAmount}>
                        {' '}
                        {Number(CurrentMonth) === 0 ? (
                          <> - </>
                        ) : (
                          <>{FormattedAmount(parseInt(CurrentMonth, 10))}</>
                        )}
                      </Mui.Typography>
                      <Mui.Typography className={css.textAmount1}>
                        {' '}
                        {Number(LastMonthRevenueData) === 0 ? (
                          <> - </>
                        ) : (
                          <>
                            {FormattedAmount(
                              parseInt(LastMonthRevenueData, 10)
                            )}
                          </>
                        )}
                      </Mui.Typography>
                    </Mui.Stack>
                  </Mui.Stack>
                  <Mui.Divider
                    style={{
                      opacity: '0.2',
                      marginTop: '1rem',
                      marginBottom: '1rem',
                    }}
                  />
                  <Mui.Stack className={css.revenueStack1} direction="row">
                    <Mui.Stack direction="row" spacing={1}>
                      <Mui.Stack
                        direction="row"
                        spacing={1}
                        style={{
                          alignItems: 'center',
                          height: '20px',
                          marginTop: '5px',
                        }}
                      >
                        {/* {Number(LastPrevYearRevenue) === 0 && <> % </>} */}
                        {Number(LastPrevYearRevenue) > 0 ? (
                          <>
                            <ArrowUpwardIcon
                              style={{ width: '15px', color: '#4aaf05' }}
                            />
                            <Mui.Typography className={css.percentageText}>
                              {`${Math.round(LastPrevYearRevenue)}%`}
                            </Mui.Typography>
                          </>
                        ) : (
                          <>
                            <ArrowDownwardIcon
                              style={{ width: '15px', color: 'red' }}
                            />
                            <Mui.Typography className={css.percentageTextred}>
                              {`${Math.abs(Math.round(LastPrevYearRevenue))}%`}
                            </Mui.Typography>
                          </>
                        )}
                      </Mui.Stack>
                      <Mui.Stack>
                        <Mui.Typography className={css.text1}>
                          Current Month Revenue
                        </Mui.Typography>
                        <Mui.Typography className={css.text2}>
                          Compared to Last Year Same Month Revenue
                        </Mui.Typography>
                      </Mui.Stack>
                    </Mui.Stack>
                    <Mui.Stack>
                      <Mui.Typography className={css.textAmount}>
                        {' '}
                        {Number(CurrentMonth) === 0 ? (
                          <> - </>
                        ) : (
                          <>{FormattedAmount(parseInt(CurrentMonth, 10))}</>
                        )}
                      </Mui.Typography>
                      <Mui.Typography className={css.textAmount1}>
                        {' '}
                        {Number(Last6Month) === 0 ? (
                          <> - </>
                        ) : (
                          <>{FormattedAmount(parseInt(Last6Month, 10))}</>
                        )}
                      </Mui.Typography>
                    </Mui.Stack>
                  </Mui.Stack>
                  <Mui.Divider
                    style={{
                      opacity: '0.2',
                      marginTop: '1rem',
                      marginBottom: '1rem',
                    }}
                  />
                  <Mui.Stack className={css.revenueStack1} direction="row">
                    <Mui.Stack direction="row" spacing={1}>
                      <Mui.Stack
                        direction="row"
                        spacing={1}
                        style={{
                          alignItems: 'center',
                          height: '20px',
                          marginTop: '5px',
                        }}
                      >
                        {/* {Number(Last3MonthRevenue) === 0 && <> % </>} */}
                        {Number(Last3MonthRevenue) > 0 ? (
                          <>
                            <ArrowUpwardIcon
                              style={{ width: '15px', color: '#4aaf05' }}
                            />
                            <Mui.Typography className={css.percentageText}>
                              {`${Math.round(Last3MonthRevenue)}%`}
                            </Mui.Typography>
                          </>
                        ) : (
                          <>
                            <ArrowDownwardIcon
                              style={{ width: '15px', color: 'red' }}
                            />
                            <Mui.Typography className={css.percentageTextred}>
                              {`${Math.abs(Math.round(Last3MonthRevenue))}%`}
                            </Mui.Typography>
                          </>
                        )}
                      </Mui.Stack>
                      <Mui.Stack>
                        <Mui.Typography className={css.text1}>
                          Current Month Revenue
                        </Mui.Typography>
                        <Mui.Typography className={css.text2}>
                          Average Revenue of Last 3 Months
                        </Mui.Typography>
                      </Mui.Stack>
                    </Mui.Stack>
                    <Mui.Stack>
                      <Mui.Typography className={css.textAmount}>
                        {' '}
                        {Number(CurrentMonth) === 0 ? (
                          <> - </>
                        ) : (
                          <>{FormattedAmount(parseInt(CurrentMonth, 10))}</>
                        )}
                      </Mui.Typography>
                      <Mui.Typography className={css.textAmount1}>
                        {' '}
                        {Number(LastYear) === 0 ? (
                          <> - </>
                        ) : (
                          <>{FormattedAmount(parseInt(LastYear, 10))}</>
                        )}
                      </Mui.Typography>
                    </Mui.Stack>
                  </Mui.Stack>
                  {/* <Mui.Divider
                    style={{
                      opacity: '0.2',
                      marginTop: '1rem',
                      // marginBottom: '1rem',
                    }}
                  /> */}
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Stack>
        </Mui.Grid>
      </Mui.Grid>
      <Dialog
        open={Boolean(openProgress)}
        onClose={onProgressDialogClose}
        sx={{ borderRadius: '40px !important' }}
      >
        <Mui.Stack style={{ padding: '1rem' }}>
          <Mui.Typography variant="h6">Whoa!</Mui.Typography>
          <Mui.Typography>This feature is coming soon!</Mui.Typography>
        </Mui.Stack>
      </Dialog>
      <Mui.Dialog
        open={drawer.paymentBank && device === 'desktop'}
        onClose={() => handleBottomSheetClose('paymentBank')}
      >
        <PaymentBankReq
          vendorId={clickVendorId}
          handleBottomSheet={() => handleBottomSheetClose('paymentBank')}
        />
      </Mui.Dialog>
      <Mui.Dialog
        open={drawer?.requestPayment}
        onClose={() =>
          setDrawer((prev) => ({ ...prev, requestPayment: false }))
        }
      >
        <RequestPayment
          customer_id={null}
          setRequestPayment={() =>
            setDrawer((prev) => ({ ...prev, requestPayment: false }))
          }
        />
      </Mui.Dialog>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  ) : (
    <>
      <Mui.Grid container>
        <Mui.Grid item xs={12}>
          <Mui.Stack className={css.mainStack}>
            <Mui.Stack className={css.mainStack1}>
              <Mui.Typography className={css.userName}>
                Hi {user?.userName},
              </Mui.Typography>
              {/* charts */}
              <Mui.Stack direction="column" spacing={2} mt={2}>
                <Carousel className={css.CarouselContainer} showThumbs={false}>
                  <div>
                    <SpendBandWidth
                      info={basicInfo}
                      spendBandwidthValue={spendBandwidth}
                    />
                  </div>
                  <div>
                    {chartValue && chartValue.liquidity_position && (
                      <Chart1
                        bank={chartValue?.liquidity_position?.bank}
                        ageing={chartValue?.liquidity_position?.ageing}
                        payables={chartValue?.liquidity_position?.payables}
                      />
                    )}
                  </div>
                  <div>
                    <Chart3
                      labels={chartValue?.collection_performance?.labels}
                      data={chartValue?.collection_performance?.datasets}
                    />
                  </div>
                  <div>
                    <Chart4
                      ftm={chartValue?.sales_and_performance_ftm}
                      ytd={chartValue?.sales_and_performance_ytd}
                      monthly={chartValue?.sales_and_performance_ytm}
                    />
                  </div>
                  <div>
                    {chartValue && chartValue.runway_and_cashburn && (
                      <Chart5
                        labels={chartValue?.runway_and_cashburn?.labels}
                        data={chartValue?.runway_and_cashburn?.datasets}
                      />
                    )}
                  </div>
                </Carousel>
                {/* </Mui.Stack> */}

                {/* <Mui.Card className={css.categorizeStack}> */}
                {/* <Mui.Stack style={{ overflow: 'auto'}}>
                  <Mui.Stack
                    spacing={2}
                    direction="row"
                    // className={css.categorizeStackMain}
                  >
                    <SpendBandWidth />
                    <Chart1/>
                    <Chart2 />
                    <Chart3 />
                    <Chart4 />
                    <Chart5 />
                    <Chart6 />
                  </Mui.Stack> 
              </Mui.Stack> */}
                {/* </Mui.Card> */}

                {/* initiate Action */}

                <Mui.Typography className={css.initialFont}>
                  initiate action
                </Mui.Typography>
                <Mui.Stack direction="row" className={css.InvoiceactionStack}>
                  <Mui.Stack
                    className={css.iconStack}
                    spacing={1}
                    onClick={() => {
                      if (!userRolesInvoicing?.Invoicing) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      changeSubView('invoiceView');
                      setActiveInvoiceId({
                        activeInvoiceId: '',
                      });
                      navigate('/invoice-new');
                    }}
                  >
                    <img src={InvoiceIcon} alt="InvoiceIcon" />
                    <Mui.Typography noWrap className={css.iconStackText}>
                      Create Invoice
                    </Mui.Typography>
                  </Mui.Stack>
                  <Mui.Stack
                    spacing={1}
                    className={css.iconStack}
                    onClick={() => {
                      if (!userRolesPayments?.Payment?.create_payment) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      changeSubView('paymentView');
                      navigate('/payment-makepayment');
                    }}
                  >
                    <img src={PriceIcon} alt="PriceIcon" />
                    <Mui.Typography noWrap className={css.iconStackText}>
                      Pay a Vendor
                    </Mui.Typography>
                  </Mui.Stack>
                  <Mui.Stack
                    spacing={1}
                    className={css.iconStack}
                    onClick={() => {
                      if (!userRolesExpense?.Expense) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      changeSubView('billbookView');
                      navigate('/bill-upload');
                    }}
                  >
                    <img src={WindowsIcon} alt="WindowsIcon" />
                    <Mui.Typography noWrap className={css.iconStackText}>
                      Record an Expense
                    </Mui.Typography>
                  </Mui.Stack>
                </Mui.Stack>

                {/* greenCards */}
                <Mui.Stack spacing={2} className={css.greenCardsStackContainer}>
                  <Mui.Stack className={css.greenCards}>
                    <Mui.Stack className={css.greenCardsStack1} spacing={1}>
                      <Mui.Typography className={css.cardHead}>
                        Overdue Bills
                      </Mui.Typography>
                      <Mui.Stack
                        direction="row"
                        className={css.cardContentStack}
                      >
                        <Mui.Stack>
                          <Mui.Typography className={css.cardContentRs}>
                            {FormattedAmount(Math.round(overdue?.amount || 0))}
                          </Mui.Typography>

                          <Mui.Typography className={css.cardContent}>
                            {overdue?.bill_count} Bills to{' '}
                            {overdue?.vendor_count} Parties are <br />
                            Overdue Today.
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Button
                          variant="contained"
                          className={css.cardButton}
                          onClick={() => {
                            // changeSubView('paymentView');
                            // navigate('/payment-makepayment');
                            if (!userRolesPayments?.Payment?.create_payment) {
                              setHavePermission({
                                open: true,
                                back: () => {
                                  setHavePermission({ open: false });
                                },
                              });
                              return;
                            }
                            makeQuickPayments('overdue');
                          }}
                          disabled={
                            Math.round(Number(overdue?.amount || 0)) === 0
                          }
                        >
                          <Mui.Typography className={css.cardButtonTxt}>
                            pay now
                          </Mui.Typography>
                        </Mui.Button>
                      </Mui.Stack>
                    </Mui.Stack>
                  </Mui.Stack>

                  <Mui.Stack className={css.greenCards}>
                    <Mui.Stack className={css.greenCardsStack1} spacing={1}>
                      <Mui.Typography className={css.cardHead}>
                        Due this Week
                      </Mui.Typography>
                      <Mui.Stack
                        direction="row"
                        className={css.cardContentStack}
                      >
                        <Mui.Stack>
                          <Mui.Typography className={css.cardContentRs}>
                            {FormattedAmount(Math.round(payments?.amount || 0))}
                          </Mui.Typography>

                          <Mui.Typography className={css.cardContent}>
                            {payments?.bill_count} Bills to{' '}
                            {payments?.vendor_count} Parties <br />
                            due this Week
                          </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Button
                          variant="contained"
                          className={css.cardButton}
                          onClick={() => {
                            // changeSubView('paymentView');
                            // navigate('/payment-makepayment');
                            if (!userRolesPayments?.Payment?.create_payment) {
                              setHavePermission({
                                open: true,
                                back: () => {
                                  setHavePermission({ open: false });
                                },
                              });
                              return;
                            }
                            makeQuickPayments('payables');
                          }}
                          disabled={
                            Math.round(Number(payments?.amount || 0)) === 0
                          }
                        >
                          <Mui.Typography className={css.cardButtonTxt}>
                            pay now
                          </Mui.Typography>
                        </Mui.Button>
                      </Mui.Stack>
                    </Mui.Stack>
                  </Mui.Stack>
                </Mui.Stack>

                {chartValue?.loan_balance?.datasets?.length > 0 && (
                  <Mui.Stack
                    className={`${css.submenuStack} ${css.greenCardsStackContainer}`}
                  >
                    <Mui.Stack className={css.submenuStackMain} spacing={2}>
                      <Mui.Stack
                        direction="row"
                        className={`${css.submenuStack1} ${css.submenuStackContainer}`}
                      >
                        <Mui.Typography className={css.initialFont}>
                          Borrowings
                        </Mui.Typography>
                        <Mui.Link
                          className={css.viewMore}
                          style={{ textDecoration: 'none' }}
                        >
                          {FormattedAmount(
                            chartValue?.loan_balance?.total_amount
                          )}
                        </Mui.Link>
                      </Mui.Stack>
                      {chartValue?.loan_balance?.datasets?.map((c) => {
                        return (
                          <>
                            <Mui.Stack
                              direction="row"
                              className={css.submenuStack1}
                            >
                              <Mui.Typography
                                noWrap
                                className={css.subMenuHead}
                                style={{ width: '60%' }}
                              >
                                {c?.label || '-'}
                              </Mui.Typography>
                              <Mui.Typography noWrap className={css.subMenu1}>
                                {FormattedAmount(c?.amount)}
                              </Mui.Typography>
                            </Mui.Stack>
                            <Mui.Divider />
                          </>
                        );
                      })}
                    </Mui.Stack>
                  </Mui.Stack>
                )}

                {/* Recievables */}

                <Mui.Stack
                  className={`${css.submenuStack} ${css.greenCardsStackContainer}`}
                >
                  <Mui.Stack className={css.submenuStackMain} spacing={2}>
                    <Mui.Stack
                      direction="row"
                      className={`${css.submenuStack1} ${css.submenuStackContainer}`}
                    >
                      <Mui.Typography className={css.initialFont}>
                        Receivables
                      </Mui.Typography>
                      <Mui.Link
                        className={css.viewMore}
                        onClick={() => {
                          if (!userRolesReceviables?.Receivables) {
                            setHavePermission({
                              open: true,
                              back: () => {
                                setHavePermission({ open: false });
                              },
                            });
                            return;
                          }
                          navigate('/receivables');
                        }}
                      >
                        View More
                      </Mui.Link>
                    </Mui.Stack>
                    <Mui.Stack direction="row" className={css.submenuStack1}>
                      <Mui.Typography noWrap className={css.subMenuHead}>
                        Collection Progress
                      </Mui.Typography>
                      <Mui.Typography noWrap className={css.subMenu1}>
                        {datas?.collection_progress}%
                      </Mui.Typography>
                    </Mui.Stack>
                    <Mui.Divider />
                    <Mui.Stack direction="row" className={css.submenuStack1}>
                      <Mui.Typography noWrap className={css.subMenuHead}>
                        Total Due as of Today
                      </Mui.Typography>
                      <Mui.Typography noWrap className={css.subMenu1}>
                        {FormattedAmount(Math.round(Number(totalDue)))}
                      </Mui.Typography>
                    </Mui.Stack>
                  </Mui.Stack>
                </Mui.Stack>

                {/* overdues */}
                <Mui.Stack
                  className={`${css.overdueStack} ${css.greenCardsStackContainer}`}
                >
                  <Mui.Stack className={css.overdueStackMain} spacing={2}>
                    <Mui.Stack
                      className={css.overduesectionStack}
                      direction="row"
                    >
                      <Mui.Stack textAlign="left">
                        <Mui.Typography
                          noWrap
                          className={`${css.initialFont} ${css.submenuStackContainer}`}
                        >
                          Overdue Receivables
                        </Mui.Typography>
                        <Mui.Typography noWrap className={css.amount}>
                          {FormattedAmount(parseInt(Overdue, 10))}
                        </Mui.Typography>
                      </Mui.Stack>
                      <Mui.Stack className={css.overduebtnStack}>
                        <Mui.Button
                          variant="outlined"
                          className={css.overduebtn}
                          onClick={() => {
                            // navigate('/receivables');
                            setDrawer((prev) => ({
                              ...prev,
                              requestPayment: true,
                            }));
                          }}
                          disabled={(parseInt(Overdue, 10) || 0) === 0}
                        >
                          <Mui.Typography noWrap className={css.overduebtnTxt}>
                            follow up
                          </Mui.Typography>
                        </Mui.Button>
                      </Mui.Stack>
                    </Mui.Stack>
                    <Mui.Divider />

                    <Mui.Stack
                      className={css.overduesectionStack}
                      direction="row"
                    >
                      <Mui.Stack textAlign="left">
                        <Mui.Typography
                          noWrap
                          className={`${css.initialFont} ${css.submenuStackContainer}`}
                        >
                          Overall Receivables
                        </Mui.Typography>
                        <Mui.Typography noWrap className={css.amount}>
                          {FormattedAmount(parseInt(Overall, 10))}
                        </Mui.Typography>
                      </Mui.Stack>
                      <Mui.Stack className={css.overduebtnStack}>
                        <Mui.Button
                          variant="outlined"
                          className={css.overduebtn}
                          onClick={() => {
                            setOpenProgress(true);
                          }}
                        >
                          <Mui.Typography noWrap className={css.overduebtnTxt}>
                            get funding
                          </Mui.Typography>
                        </Mui.Button>
                      </Mui.Stack>
                    </Mui.Stack>
                  </Mui.Stack>
                </Mui.Stack>

                {/* categorizeTransactions */}
                <Mui.Stack
                  className={`${css.categorizeStack} ${css.greenCardsStackContainer}`}
                  style={{ height: '23vh !important' }}
                >
                  <Mui.Stack spacing={2} className={css.categorizeStackMain}>
                    <Mui.Typography className={css.categorizeHeading}>
                      Categorize Transactions
                    </Mui.Typography>
                    <Mui.Grid container>
                      <Mui.Grid xs={8}>
                        <Mui.Stack spacing={1}>
                          <Mui.Typography noWrap className={css.categorizeTxt}>
                            {categorize?.unsettled_payments_count || 0} Unknown
                            Payments
                          </Mui.Typography>
                          <Mui.Typography noWrap className={css.categorizeTxt}>
                            {categorize?.unsettled_receipt_count || 0} Unknown
                            Receipts
                          </Mui.Typography>
                        </Mui.Stack>
                      </Mui.Grid>
                      <Mui.Grid xs={4} textAlign="right">
                        <Mui.Stack spacing={1}>
                          <Mui.Typography
                            noWrap
                            className={css.categorizeamount}
                          >
                            {FormattedAmount(
                              parseInt(categorize?.unsettled_payments_total,10)
                            )}
                          </Mui.Typography>
                          <Mui.Typography
                            noWrap
                            className={css.categorizeamount}
                          >
                            {FormattedAmount(
                              parseInt(categorize?.unsettled_receipts_total,10)
                            )}
                          </Mui.Typography>
                        </Mui.Stack>
                      </Mui.Grid>
                    </Mui.Grid>
                    {/* </>
                  );
                  })} */}
                    <Mui.Stack className={css.categorizebtnStack}>
                      <Mui.Button
                        variant="outlined"
                        className={css.categorizebtn}
                        disabled={
                          categorize?.unsettled_receipt_count === 0 &&
                          categorize?.unsettled_payments_count === 0
                        }
                      >
                        <Mui.Typography
                          noWrap
                          className={css.categorizebtnTxt}
                          onClick={() => {
                            if (
                              !userRolesBanking?.Banking &&
                              !userRolesBanking?.Banking[
                                'Categorizing Transactions'
                              ]?.view_categorization
                            ) {
                              setHavePermission({
                                open: true,
                                back: () => {
                                  setHavePermission({ open: false });
                                },
                              });
                              return;
                            }
                            changeSubView('categorizeTransactions');
                            navigate('/banking');
                          }}
                        >
                          categorize now
                        </Mui.Typography>
                      </Mui.Button>
                    </Mui.Stack>
                  </Mui.Stack>
                </Mui.Stack>

                {/* Pending */}
                <Mui.Typography className={css.initialFont}>
                  pending unapproved invoices
                </Mui.Typography>

                <Mui.Stack className={css.greenCards}>
                  <Mui.Stack className={css.greenCardsStack1} spacing={1}>
                    <Mui.Typography noWrap className={css.cardHead}>
                      {chartValue?.unapproved_invoice_summary?.bill_count}{' '}
                      Unapproved Invoices
                    </Mui.Typography>
                    <Mui.Stack direction="row" className={css.cardContentStack}>
                      <Mui.Stack>
                        <Mui.Typography className={css.cardContentRs}>
                          {FormattedAmount(
                            parseInt(Number(chartValue?.unapproved_invoice_summary?.total_value),10)
                          )}
                        </Mui.Typography>

                        <Mui.Typography className={css.cardContent}>
                          {chartValue?.unapproved_invoice_summary?.bill_count}{' '}
                          Bills to{' '}
                          {chartValue?.unapproved_invoice_summary?.party_count}{' '}
                          Parties are to <br />
                          be approved
                        </Mui.Typography>
                      </Mui.Stack>
                      <Mui.Button
                        variant="contained"
                        className={css.cardButton}
                        onClick={() => {
                          if (!userRolesInvoicing?.Invoicing) {
                            setHavePermission({
                              open: true,
                              back: () => {
                                setHavePermission({ open: false });
                              },
                            });
                            return;
                          }
                          navigate('/invoice-unapproved');
                        }}
                        disabled={
                          Number(
                            chartValue?.unapproved_invoice_summary?.bill_count
                          ) === 0
                        }
                      >
                        <Mui.Typography
                          noWrap
                          className={css.cardButtonTxtApprove}
                        >
                          {' '}
                          approve now
                        </Mui.Typography>
                      </Mui.Button>
                    </Mui.Stack>
                  </Mui.Stack>
                </Mui.Stack>
                {/* mainStack */}
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Stack>
        </Mui.Grid>
      </Mui.Grid>
      <Dialog
        open={Boolean(openProgress)}
        onClose={onProgressDialogClose}
        sx={{ borderRadius: '40px !important' }}
      >
        <Mui.Stack style={{ padding: '1rem' }}>
          <Mui.Typography variant="h6">Whoa!</Mui.Typography>
          <Mui.Typography>This feature is coming soon!</Mui.Typography>
        </Mui.Stack>
      </Dialog>
      <SelectBottomSheet
        open={drawer.paymentBank && device === 'mobile'}
        onClose={() => handleBottomSheetClose('paymentBank')}
        // addNewSheet
        id="overFlowHidden"
        triggerComponent={<></>}
        onTrigger={handleBottomSheetOpen}
      >
        <PaymentBankReq
          vendorId={clickVendorId}
          handleBottomSheet={() => handleBottomSheetClose('paymentBank')}
        />
      </SelectBottomSheet>
      <Mui.Dialog
        open={drawer?.requestPayment}
        onClose={() =>
          setDrawer((prev) => ({ ...prev, requestPayment: false }))
        }
      >
        <RequestPayment
          customer_id={undefined}
          setRequestPayment={() =>
            setDrawer((prev) => ({ ...prev, requestPayment: false }))
          }
        />
      </Mui.Dialog>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default DashboardIndex;
