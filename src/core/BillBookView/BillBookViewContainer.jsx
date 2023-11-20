import React, { useContext, useEffect, useState } from 'react';
// import JSBridge from '@nativeBridge/jsbridge';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetVendorBillsCountState,
  ClearStateGetVendorBillsCount,
} from '@action/Store/Reducers/Bills/BillBoxState';

import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import moment from 'moment';
import billsInQueue from '@assets/billsInQueue.svg';
import setupUtility from '@assets/setupUtility.svg';
import recordAnExpense from '@assets/recordAnExpense.svg';
import nothingtodisplay from '@assets/nothingtodisplay.svg';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AppContext from '@root/AppContext.jsx';
import { Typography, Grid, Stack, Card } from '@mui/material';

import { MobileCardLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';
import * as css from './BillBookViewContainer.scss';

// import your_bills from '../../assets/BillsLogo/your_bills.svg';
// import draft_bills from '../../assets/BillsLogo/draft_bills.svg';
// import bills_in_queue from '../../assets/BillsLogo/bills_in_queue.svg';
import record_an_expense from '../../assets/BillsLogo/record_an_expense.svg';
import setup_utillity_bills from '../../assets/BillsLogo/setup_utillity_bills.svg';
import salary_cost from '../../assets/BillsLogo/salary_cost_new.svg';
import journalIcon from '../../assets/journal.svg';
import bill_box from '../../assets/BillsLogo/bill_box_new.svg';

import bill_box_mobile from '../../assets/BillsLogo/bill_box_mobile.svg';
import alarm1 from '../../assets/alarm1.svg';
import headset from '../../assets/headset.svg';
// import btn_google_signin_light_normal_web from '../../assets/btn_google_signin_dark_normal_web@2x.png';

const listItems = [
  {
    icon: recordAnExpense,
    view: 'uploadYourBillView-haveBill',
    title: 'Record An Expense',
    desc: 'Make a Note of your Recent Transaction',
    route: '/bill-upload',
  },
  {
    icon: setupUtility,
    view: 'utilityBillStatusView',
    title: 'Setup Utility Bills',
    desc: 'Create Bills for core Utilities needed to run your Business',
    route: '/bill-utility',
  },
  {
    icon: billsInQueue,
    view: 'draftBillView',
    title: 'Draft Bills',
    desc: 'Select a partially completed Bill and pick up where you had left off',
    route: '/bill-draft',
  },
  {
    icon: billsInQueue,
    view: 'billInQueueView',
    title: 'Assigned Bills',
    desc: 'Find Bills which are assigned to your SuperAccountant',
    route: '/bill-queue',
  },
  {
    icon: billsInQueue,
    view: 'yourBillsView',
    title: 'Accounted Bills',
    desc: 'Track all your Recorded Bills from one place',
    route: '/bill-accounted',
  },
  {
    icon: bill_box_mobile,
    view: 'yourBillsView',
    title: 'BillBox',
    desc: 'Track all your Recorded Bills from one place',
    route: '/bill-box',
  },
];

const BillBookViewContainer = () => {
  const { userPermissions } = useContext(AppContext);

  const dispatch = useDispatch();
  const { VendorBillsCounts, BillDashboardLoad } = useSelector(
    (value) => value.BillBox,
  );

  const device = localStorage.getItem('device_detect');

  const [yourBills, setYourBills] = useState([]);
  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });

  useEffect(() => {
    if (Object.keys(userPermissions?.Expense || {})?.length > 0) {
      if (!userPermissions?.Expense?.Expense) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Expense });
    }
  }, [userPermissions]);

  const onClick = (view, path, index) => {
    const tempAccess = [
      userRoles?.['Bill Booking']?.view_bills,
      true,
      userRoles?.['Bill Booking']?.view_bills,
      userRoles?.['Bill Booking']?.view_bills,
      userRoles?.['Bill Booking']?.view_bills,
      userRoles?.['Bill Booking']?.view_bills,
    ];
    if (tempAccess[index]) {
      navigate(path);
    } else {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
    }
  };

  const getYourBills = () => {
    dispatch(GetVendorBillsCountState());
  };

  const OpenBillPage = (link, open) => {
    if (!open) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
    } else {
      navigate(link);
    }
  };

  useEffect(() => {
    getYourBills();
    return () => {
      dispatch(ClearStateGetVendorBillsCount());
    };
  }, []);

  useEffect(() => {
    if (Object.keys(VendorBillsCounts || {})?.length > 0) {
      setYourBills(VendorBillsCounts?.in_queue_section?.data);
    }
  }, [JSON.stringify(VendorBillsCounts)]);

  return device === 'desktop' ? (
    // here
    <>
      <Grid container spacing={2} className={css.billBookViewContainerDesktop}>
        <Grid item container spacing={2} lg={6} md={6} xs={12}>
          <Grid item lg={6}>
            <Stack
              className={css.stack1}
              onClick={() =>
                OpenBillPage(
                  '/bill-upload',
                  userRoles?.['Bill Booking']?.create_bills,
                )
              }
            >
              <img src={record_an_expense} alt="recordexpense" />
              <Typography className={css.imgText}>Record an Expense</Typography>
            </Stack>
            <Stack
              mt={3}
              className={css.stack1}
              onClick={() => OpenBillPage('/bill-box', true)}
            >
              <img src={bill_box} alt="utilitybills" />
              <Typography className={css.imgText}>BillBox</Typography>
            </Stack>

            <Stack
              mt={3}
              className={css.stack1}
              onClick={() => OpenBillPage('/bill-salary', true)}
            >
              <img src={salary_cost} alt="utilitybills" />
              <Typography className={css.imgText}>Salary Cost</Typography>
            </Stack>
          </Grid>
          <Grid item lg={6}>
            <Stack
              className={css.stack1}
              onClick={() => navigate('/bill-utility')}
            >
              <img src={setup_utillity_bills} alt="utilitybills" />
              <Typography className={css.imgText}>
                Setup Utility Bills
              </Typography>
            </Stack>

            <Stack
              mt={3}
              className={css.stack1}
              onClick={() => OpenBillPage('/bill-journal', true)}
            >
              <img src={journalIcon} alt="utilitybills" />
              <Typography className={css.imgText}>Other Journal</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <Stack className={css.rightbillsqueueMain}>
            <Stack className={css.rightbillsqueueStack}>
              <Typography className={css.heading}>Bills in Queue</Typography>
              {yourBills?.length === 0 && BillDashboardLoad === null && (
                <MobileCardLoadingSkeleton NumCard={4} />
              )}
              {yourBills?.length === 0 && BillDashboardLoad === 'dataLoad' && (
                <Stack
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // marginTop: '1rem',
                    minHeight: '67vh',
                  }}
                  className={css.cardStack}
                >
                  <img
                    src={nothingtodisplay}
                    alt="nothing"
                    style={{ width: '100px' }}
                  />
                  <Typography className={css.noDataText}>
                    No Bills Available in Queue
                  </Typography>
                </Stack>
              )}
              {yourBills?.length > 0 && BillDashboardLoad === 'dataLoad' && (
                <>
                  {yourBills?.slice(0, 4)?.map((c) => {
                    return (
                      <Stack className={css.cardStack} key={c?.id}>
                        <Card className={css.card}>
                          <Stack className={css.carddivmain} spacing={2}>
                            <Stack
                              direction="row"
                              className={css.carddivmainstack}
                            >
                              <Typography className={css.cardtext1}>
                                {c?.vendor?.name || c?.new_vendor?.name || '-'}
                              </Typography>
                              <Stack
                                direction="row"
                                className={css.cardtext2stack}
                              >
                                <Typography className={css.cardtext2}>
                                  {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                  }).format(c?.amount || 0)}
                                </Typography>
                                <img src={alarm1} alt="alarm" />
                              </Stack>
                            </Stack>
                            <Stack
                              direction="row"
                              className={css.carddivmainstack}
                            >
                              <Typography className={css.cardtext3}>
                                {c?.document_date &&
                                  moment(c.document_date).format(
                                    'Do MMMM YYYY',
                                  )}
                              </Typography>
                              <Stack
                                direction="row"
                                className={css.cardtext4stack}
                              >
                                <Typography className={css.cardtext4}>
                                  {/* {c.quote} */}
                                  This bill is assigned to SuperAccountant
                                </Typography>
                                <img src={headset} alt="headset" />
                              </Stack>
                            </Stack>
                          </Stack>
                        </Card>
                      </Stack>
                    );
                  })}
                </>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  ) : (
    <>
      <div className={css.billBookViewContainer}>
        <section className={css.header}>
          <div className={css.valueHeader}>Bill Booking</div>
          <div className={css.headerUnderline} />
        </section>
        <div className={css.card}>
          {listItems.map((item, index) => (
            <div
              key={item.title}
              className={css.listItem}
              onClick={() => onClick(item.view, item.route, index)}
              role="menuitem"
            >
              <div className={css.icon}>
                <img
                  src={item.icon}
                  className={css.iconImg}
                  alt={`${item.title} icon`}
                />
              </div>
              <div className={css.content}>
                <div className={css.title}>{item.title}</div>
                <div className={css.desc}>{item.desc}</div>
              </div>
              <ArrowForwardIosIcon className={css.arrow} />
            </div>
          ))}
        </div>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default BillBookViewContainer;
