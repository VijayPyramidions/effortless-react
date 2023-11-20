import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  Stack,
  Typography,
  Divider,
  Popover,
  Dialog,
  CircularProgress,
  // useTheme,
  // useMediaQuery,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { MobileCardLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';

import edit_bill from '@assets/BillsLogo/edit_bill.svg';
import eye_bill from '@assets/BillsLogo/eye_bill.svg';
import red_color_delete from '@assets/red_color_delete.svg';

import BillViewDialog from '../components/BillViewDialog';

import * as css from './accounted.scss';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const AccountedBillCategoryDetails = ({ selectedMaterial, dateFilter }) => {
  const dispatch = useDispatch();
  const {
    AccountedBillsListData,
    AccountedBillDataLoad,
    AccountedBillVersionData,
  } = useSelector((value) => value.AccountedBills);
  const { BillBoxAction } = useSelector((value) => value.BillBox);
  const navigate = useNavigate();

  const [drawer, setDrawer] = useState({});
  const [expenseDeatils, setExpenseDetails] = useState({});
  const [activeBill, setActiveBill] = useState({});
  const [accountedBills, setAccountedBills] = useState([]);
  const [hasMoreItems, sethasMoreItems] = useState(true);

  const AccountedBillsCall = (page) => {
    dispatch(
      GetAccountedBillsListState({
        pageNum: page || 1,
        expense_id: expenseDeatils?.id,
        fromDate: dateFilter?.fromDate,
        endDate: dateFilter?.endDate,
        period: 'month',
      })
    );
  };

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const loadMore = () => {
    if (AccountedBillsListData?.pages > 1) {
      AccountedBillsCall(AccountedBillsListData?.page + 1);
    }
  };

  const ViewBillFunction = () => {
    if (activeBill?.file_url) {
      handleDrawer('viewBill', true);
    } else {
      dispatch(
        openSnackbar({
          message: 'There is no Bill.',
          type: 'error',
        })
      );
    }
  };

  useEffect(() => {
    setExpenseDetails(selectedMaterial);
  }, [selectedMaterial]);

  useEffect(() => {
    if (expenseDeatils?.id && dateFilter?.fromDate && dateFilter?.endDate) {
      AccountedBillsCall(1);
    }
  }, [expenseDeatils?.id, dateFilter]);

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
    <Box className={css.rightcard}>
      <Box className={css.topcont}>
        <Stack direction="column" gap="8px">
          <Typography className={css.titletext}>
            {expenseDeatils?.name || '-'}
          </Typography>
          <Typography className={css.totalspendtext}>
            Total spend{' '}
            <span>
              {currencyFormatter.format(Math.abs(expenseDeatils?.amount || 0))}
            </span>
          </Typography>
        </Stack>
      </Box>

      <InfiniteScroll
        dataLength={accountedBills?.length}
        next={() => loadMore()}
        scrollThreshold="20px"
        hasMore={hasMoreItems}
        loader={
          <div style={{ display: 'flex' }}>
            <CircularProgress style={{ color: '#F08B32', margin: 'auto' }} />
          </div>
        }
        height="calc(100vh - 250px)"
        className={css.maincont}
      >
        {!AccountedBillDataLoad && expenseDeatils?.id && (
          <MobileCardLoadingSkeleton NumCard={6} />
        )}
        {((AccountedBillsListData?.data?.length === 0 &&
          AccountedBillDataLoad) ||
          !expenseDeatils?.id) && (
          <Typography align="center" my="16px">
            No Bill Found.
          </Typography>
        )}
        {AccountedBillsListData?.data?.length > 0 &&
          AccountedBillDataLoad &&
          accountedBills?.map((val) => (
            <>
              <Typography className={css.month_text}>
                {moment(val?.period).format('MMMM, YYYY')}
              </Typography>

              {val?.bills?.map((data) => (
                <Box
                  className={css.boxcont}
                  component={Stack}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" gap="16px" alignItems="center">
                    <Typography className={css.categorydate}>
                      {moment(data?.created_at).format('ddd')}
                      <br />
                      <span>{moment(data?.created_at).format('DD')}</span>
                    </Typography>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <Box padding="12px 0" component={Stack} gap="12px">
                      <Stack direction="row" gap="8px" alignItems="center">
                        <Typography width="80px" className={css.categorylabel}>
                          Vendor
                        </Typography>
                        <Typography
                          className={`${css.categoryvalue} ${css.vendorname}`}
                        >
                          {data?.vendor?.name}
                        </Typography>
                      </Stack>
                      <Stack direction="row" gap="8px" alignItems="center">
                        <Typography width="80px" className={css.categorylabel}>
                          Bill Number
                        </Typography>
                        <Typography className={css.categoryvalue}>
                          {data?.document_number}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Stack direction="column" gap="8px" padding="12px 16px">
                    <Typography className={css.categoryamount}>
                      {currencyFormatter.format(Math.abs(data?.amount || 0))}
                    </Typography>
                    <Typography
                      className={css.categorymoreaction}
                      onClick={(event) => {
                        handleDrawer('moreaction', event?.currentTarget);
                        setActiveBill(data);
                      }}
                    >
                      More Action
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </>
          ))}
      </InfiniteScroll>

      <Popover
        open={Boolean(drawer?.moreaction)}
        anchorEl={drawer?.moreaction}
        onClose={() => handleDrawer('moreaction', null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: '8px',
            border: '0.5px solid #C7C7C7',
            background: '#FFF',
            width: '220px',
            padding: '4px 0',
          },
        }}
      >
        {[
          {
            name: 'View Bill',
            image: eye_bill,
            click: () => {
              handleDrawer('moreaction', null);
              ViewBillFunction();
            },
          },
          {
            name: 'Edit Bill',
            image: edit_bill,
            click: () => {
              handleDrawer('moreaction', null);
              dispatch(
                PostAccountedBillVersionState({
                  bill_id: activeBill?.id,
                  from: 'accounted',
                })
              );
            },
          },
          {
            name: 'Delete Bill',
            image: red_color_delete,
            click: () => {
              handleDrawer('moreaction', null);
              handleDrawer('deleteBill', true);
            },
          },
        ]?.map((val) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="start"
            gap="8px"
            className={css.moreactionbtn}
            component={Button}
            onClick={val?.click}
          >
            <img src={val?.image} alt="bill_action" />
            {val?.name}
          </Stack>
        ))}
      </Popover>
      <Dialog
        open={drawer?.deleteBill}
        onClose={() => handleDrawer('deleteBill', false)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <DeleteContent
          handleNo={() => handleDrawer('deleteBill', null)}
          handleYes={() => {
            handleDrawer('deleteBill', null);
            dispatch(
              DeleteVendorBillState({
                bill_id: activeBill?.id,
                from: 'accounted',
              })
            );
          }}
        />
      </Dialog>
      {drawer?.viewBill && (
        <BillViewDialog
          file_url={activeBill?.file_url}
          onClose={() => handleDrawer('viewBill', null)}
        />
      )}
    </Box>
  );
};

export default AccountedBillCategoryDetails;

export const DeleteContent = ({ handleNo, handleYes }) => {
  return (
    <div className={css.deleteddialog}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.deletehead}>Confirm</Typography>
        {/* {!desktopView && (
          <IconButton onClick={() => handleNo()}>
            <CloseIcon />
          </IconButton>
        )} */}
      </Stack>

      <Typography className={css.descriptiontext}>
        Are you sure you want to delete this Bill?
      </Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          No
        </Button>
        <Button className={css.primaryButton} onClick={() => handleYes()}>
          Yes
        </Button>
      </Stack>
    </div>
  );
};
