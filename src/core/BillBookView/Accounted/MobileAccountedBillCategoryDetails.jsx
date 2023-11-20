import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetAccountedBillsListState,
  PostAccountedBillVersionState,
  ClearStatePostAccountedBillVersion,
} from '@action/Store/Reducers/Bills/AccountedBillsState';
import {
  DeleteVendorBillState,
  ResetVendorBillAction,
} from '@action/Store/Reducers/Bills/BillBoxState';

import {
  Box,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  // useTheme,
  // useMediaQuery,
} from '@mui/material';
import { styled } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroll-component';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import PageTitle from '@core/DashboardView/PageTitle';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';

import { MobileCardLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';

import new_bill_edit from '@assets/BillsLogo/new_bill_edit.svg';
import red_color_delete from '@assets/red_color_delete.svg';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { DeleteContent } from './AcoountedBillCategoryDetails';

import AccountedBillCalander from './AccountedBillCalander';

import * as css from './accounted.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const MobileAccountedBillCategoryDetails = () => {
  // const themes = useTheme();
  // const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const navigate = useNavigate();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const {
    AccountedBillsListData,
    AccountedBillDataLoad,
    AccountedBillVersionData,
  } = useSelector((value) => value.AccountedBills);
  const { BillBoxAction } = useSelector((value) => value.BillBox);

  const [drawer, setDrawer] = useState({});
  const [billValue, setBillValue] = useState({});
  const [expenseDeatils, setExpenseDetails] = useState({});
  const [dateFilter, setDateFilter] = useState({});
  const [accountedBills, setAccountedBills] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [hasMoreItems, sethasMoreItems] = useState(true);

  const AccountedBillsCall = (page) => {
    dispatch(
      GetAccountedBillsListState({
        pageNum: page || 1,
        expense_id: expenseDeatils?.id,
        fromDate: dateFilter?.fromDate,
        endDate: dateFilter?.endDate,
        period: 'day',
      })
    );
  };

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const onExpenseChangeClick = (side) => {
    const tempIndex = expenseList
      ?.map((val) => val?.id)
      ?.indexOf(expenseDeatils?.id);
    if (side === 'next') {
      if (tempIndex === expenseList?.length - 1) {
        setExpenseDetails(expenseList[0]);
      } else {
        setExpenseDetails(expenseList[tempIndex + 1]);
      }
    }
    if (side === 'prev') {
      if (tempIndex === 0) {
        setExpenseDetails(expenseList[expenseList?.length - 1]);
      } else {
        setExpenseDetails(expenseList[tempIndex - 1]);
      }
    }
  };

  const loadMore = () => {
    if (AccountedBillsListData?.pages > 1) {
      AccountedBillsCall(AccountedBillsListData?.page + 1);
    }
  };

  // const ViewBillFunction = () => {
  //   if (billValue?.file_url) {
  //     handleDrawer('viewBill', true);
  //   }
  // };

  useEffect(() => {
    if (Object.keys(state || {})?.length > 0) {
      setExpenseDetails(state?.expenseSelectedValue);
      setExpenseList(state?.expenseList);
    } else {
      navigate('/bill-accounted');
    }
  }, [JSON.stringify(state)]);

  useEffect(() => {
    if (expenseDeatils?.id && dateFilter?.fromDate && dateFilter?.endDate) {
      AccountedBillsCall(1);
    }
  }, [expenseDeatils, dateFilter?.fromDate, dateFilter?.endDate]);

  useEffect(() => {
    if (Object.keys(AccountedBillsListData || {})?.length > 0) {
      if (AccountedBillsListData?.page === 1) {
        setAccountedBills(AccountedBillsListData?.data);
      } else {
        setAccountedBills((prev) => [...prev, ...AccountedBillsListData?.data]);
      }
      sethasMoreItems(
        AccountedBillsListData?.page !== AccountedBillsListData?.pages
      );
    }
  }, [JSON.stringify(AccountedBillsListData)]);

  useEffect(() => {
    if (BillBoxAction === 'vendorBillDeleted') {
      AccountedBillsCall(1);
      dispatch(ResetVendorBillAction());
    }
  }, [BillBoxAction]);

  useEffect(() => {
    if (Object.keys(AccountedBillVersionData || {})?.length > 0) {
      dispatch(ClearStatePostAccountedBillVersion());
      navigate('/bill-upload', {
        state: { selected: AccountedBillVersionData },
      });
    }
  }, [AccountedBillVersionData]);

  return (
    <>
      <PageTitle title="Accounted Bills" onClick={() => navigate(-1)} />
      <div className={`${cssDash.dashboardBodyContainerhideNavBar}`}>
        <div className={`${css.accountedbill_mobile}`}>
          <Box className={css.rightcard}>
            <Box
              component={Stack}
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              width="calc(100% - 40px)"
              className={css.topcont}
            >
              <IconButton
                sx={{ padding: 0 }}
                onClick={() => onExpenseChangeClick('prev')}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Stack direction="column" gap="8px" alignItems="center">
                <Typography className={css.titletext}>
                  {expenseDeatils?.name || '-'}
                </Typography>
                <Typography className={css.totalspendtext}>
                  {currencyFormatter.format(
                    Math.abs(expenseDeatils?.amount || 0)
                  )}
                </Typography>
              </Stack>
              <IconButton
                sx={{ padding: 0 }}
                onClick={() => onExpenseChangeClick('next')}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>

            <AccountedBillCalander setDateFilter={setDateFilter} />

            <Typography padding="16px 20px">Your Bill list</Typography>

            <InfiniteScroll
              dataLength={accountedBills?.length}
              next={() => loadMore()}
              scrollThreshold="20px"
              hasMore={hasMoreItems}
              loader={
                <div style={{ display: 'flex' }}>
                  <CircularProgress
                    style={{ color: '#F08B32', margin: 'auto' }}
                  />
                </div>
              }
              height="calc(100vh - 312px)"
              className={css.maincont}
            >
              {!AccountedBillDataLoad && (
                <MobileCardLoadingSkeleton NumCard={6} />
              )}
              {AccountedBillsListData?.data?.length === 0 &&
                AccountedBillDataLoad && (
                  <Typography align="center" my="16px">
                    No Bill Found.
                  </Typography>
                )}

              {AccountedBillsListData?.data?.length > 0 &&
                AccountedBillDataLoad &&
                accountedBills?.map((val) => (
                  <>
                    <Box className={css.date_box}>
                      <Typography className={css.date_text}>
                        {moment(val?.period).format('DD MMMM YYYY')}
                      </Typography>
                    </Box>

                    {val?.bills?.map((data) => (
                      <Box
                        className={css.boxcont}
                        component={Stack}
                        direction="row"
                        alignItems="center"
                        gap="8px"
                        onClick={() => {
                          setBillValue(data);
                          handleDrawer('billDetails', true);
                        }}
                      >
                        <Stack className={css.accounted_bill_img}>
                          <iframe
                            src={data?.file_url}
                            title="bill"
                            frameBorder="0"
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </Stack>

                        <Stack direction="column" gap="8px">
                          <Typography className={css.vendor_name}>
                            {data?.vendor?.name}
                          </Typography>
                          <Stack direction="row" gap="8px">
                            <Typography
                              width="80px"
                              className={css.categorylabel}
                            >
                              Bill Number
                            </Typography>
                            <Typography className={css.categoryvalue}>
                              {data?.document_number}
                            </Typography>
                          </Stack>
                          <Stack direction="row" gap="8px">
                            <Typography
                              width="80px"
                              className={css.categorylabel}
                            >
                              Amount
                            </Typography>
                            <Typography className={css.categoryvalue}>
                              {currencyFormatter.format(
                                Math.abs(data?.amount || 0)
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                  </>
                ))}
            </InfiniteScroll>
          </Box>
          <SelectBottomSheet
            open={drawer?.billDetails}
            triggerComponent
            onClose={() => {
              handleDrawer('billDetails', false);
            }}
          >
            <Puller />
            <Box className={css.accountedbilldetailscard}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography className={css.headertext}>Bill Details</Typography>
                <Box component={Stack} direction="row" gap="4px">
                  <IconButton
                    onClick={() => {
                      handleDrawer('billDetails', false);
                      dispatch(
                        PostAccountedBillVersionState({
                          bill_id: billValue?.id,
                          from: 'accounted',
                        })
                      );
                    }}
                  >
                    <img src={new_bill_edit} alt="edit" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleDrawer('billDetails', false);
                      handleDrawer('deleteBill', true);
                    }}
                  >
                    <img src={red_color_delete} alt="delete" />
                  </IconButton>
                </Box>
              </Stack>
              <Box
                component={Stack}
                direction="column"
                gap="12px"
                margin="16px 0"
                height="54vh"
                sx={{ overflow: 'auto' }}
              >
                {[
                  {
                    label: 'Bill Number',
                    value: billValue?.document_number || '',
                  },
                  {
                    label: 'Document Date',
                    value:
                      (billValue?.document_date &&
                        moment(billValue?.document_date).format(
                          'DD-MM-YYYY'
                        )) ||
                      '-',
                  },
                  {
                    label: 'Accounted Date',
                    value:
                      (billValue?.accounted_on &&
                        moment(billValue?.accounted_on).format('DD-MM-YYYY')) ||
                      '-',
                  },
                  { label: 'Vendor', value: billValue?.vendor?.name || '' },
                  {
                    label: 'Amount',
                    value: currencyFormatter.format(
                      Math.abs(billValue?.amount || 0)
                    ),
                  },
                  {
                    label: 'TDS',
                    value: currencyFormatter.format(
                      Math.abs(billValue?.tds_amount || 0)
                    ),
                  },
                  {
                    label: 'Expense Category',
                    value: billValue?.expense_account?.name,
                  },
                  { label: 'Payment Mode', value: 'To Pay' },
                  {
                    label: 'Description',
                    value: billValue?.description || '-',
                  },
                ]?.map((val) => (
                  <Stack direction="column" gap="4px">
                    <Typography className={css.label}>{val?.label}</Typography>
                    <Typography className={css.value}>{val?.value}</Typography>
                  </Stack>
                ))}
              </Box>
            </Box>
          </SelectBottomSheet>
          <SelectBottomSheet
            open={drawer?.deleteBill}
            onClose={() => handleDrawer('deleteBill', false)}
            triggerComponent={<></>}
            styleDrawerMinHeight="auto"
          >
            <Puller />
            <Stack pt="24px">
              <DeleteContent
                handleNo={() => handleDrawer('deleteBill', null)}
                handleYes={() => {
                  handleDrawer('deleteBill', null);
                  dispatch(
                    DeleteVendorBillState({
                      bill_id: billValue?.id,
                      from: 'accounted',
                    })
                  );
                }}
              />
            </Stack>
          </SelectBottomSheet>
        </div>
      </div>
    </>
  );
};

export default MobileAccountedBillCategoryDetails;
