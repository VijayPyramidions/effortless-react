import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetAllEmailListDataState,
  GetEmailBillsListState,
  ClearStateGetEmailBillsListWithId,
  GetSingleEmailBillState,
  ClearStateGetSingleEmailBill,
  DeleteEmailProviderState,
  DeleteEmailBillState,
  GetEmailBillsProviderCategoryState,
  PostNewProviderState,
  ClearEmailBillActionState,
} from '@action/Store/Reducers/Bills/EmailBillsState';
import {
  GetVendorBillDetailsState,
  ClearStateGetVendorBillDetails,
} from '@action/Store/Reducers/Bills/BillBoxState';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';
import PageTitle from '@core/DashboardView/PageTitle';

import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Avatar,
  Checkbox,
  Dialog,
  Popover,
  // MenuItem,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  MenuItem
} from '@material-ui/core';

import { DataGridPremium } from '@mui/x-data-grid-premium';

import gmail_logo from '@assets/BillsLogo/gmail_logo.svg';
import new_red_delete from '@assets/BillsLogo/new_red_delete.svg';
import eye_off from '@assets/BillsLogo/eye-off.svg';
import edit_bill from '@assets/BillsLogo/edit_bill.svg';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import InfiniteScroll from 'react-infinite-scroll-component';

import {
  MobileCardLoadingSkeleton,
  // InvoiceLoadingSkeleton,
} from '@components/SkeletonLoad/SkeletonLoader';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import { BillDetails } from './EmailBillAction';

import BillViewDialog from '../components/BillViewDialog';
import AddEmailBillProvider from './AddEmailBillProvider';

import * as css from './billBox.scss';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const EmailBillBox = () => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const dispatch = useDispatch();
  const {
    EmailListDataState,
    EmailBillsListDataStateWithId,
    SingleEmailBillData,
    EmailBillsListDataLoad,
    EmailCategoryListData,
    // EmailListDataLoad,
    EmailBillAction,
  } = useSelector((value) => value.EmailBills);
  const { VendorBillDetails } = useSelector((value) => value.BillBox);

  const navigate = useNavigate();
  const { state } = useLocation();

  const [drawer, setDrawer] = useState({});
  const [selectedBills, setSelectedBill] = useState([]);
  const [selectedItemMain, setSelectedItemMain] = useState();
  const [emailList, setEmailList] = useState([]);
  const [emailBills, setEmailBills] = useState([]);
  const [activeRow, setActiveRow] = useState({});
  const [fileUrl, setFileUrl] = useState('');
  const [providerState, setProviderState] = useState({});
  const [hasMoreItems, sethasMoreItems] = useState(true);

  const EmailListCall = (page) => {
    dispatch(
      GetAllEmailListDataState({
        emailUserId: state?.selectedEmail?.id,
        pageNum: page || 1,
      })
    );
  };

  const EmailBillListCall = (page, loading) => {
    dispatch(
      GetEmailBillsListState({
        emailUserId: state?.selectedEmail?.id,
        emailListId: selectedItemMain?.email_list_id,
        pageNum: page || 1,
        load: loading,
      })
    );
  };

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const loadMore = () => {
    if (EmailBillsListDataStateWithId?.pages > 1) {
      EmailBillListCall(EmailBillsListDataStateWithId?.page + 1);
    }
  };

  const onCheckBoxChange = (e) => {
    const { value } = e?.target;
    if (selectedBills?.includes(value)) {
      const tempBills = selectedBills?.filter((val) => val !== value);
      setSelectedBill(tempBills);
    } else {
      setSelectedBill((prev) => [...prev, value]);
    }
  };

  const viewBillFun = () => {
    handleDrawer('moreAction', false);
    dispatch(
      GetSingleEmailBillState({
        emailUserId: state?.selectedEmail?.id,
        emailBillId: activeRow?.id,
      })
    );
  };

  const viewEmailFun = () => {
    handleDrawer('moreAction', false);
  };

  const ignoreBillFun = () => {
    handleDrawer('moreAction', false);
    handleDrawer('ignoreBill', true);
  };

  const editProviderFun = () => {
    handleDrawer('moreActionForServiceProvider', false);
    handleDrawer('editProvider', true);
    setProviderState({
      name: selectedItemMain?.name,
      email: selectedItemMain?.email,
      expense_category_id: selectedItemMain?.expense_category_id,
      vendor_id: selectedItemMain?.vendor_id
    });
  };

  const ignoreProviderFun = () => {
    handleDrawer('moreActionForServiceProvider', false);
    handleDrawer('ignoreVendor', true);
  };

  const multipleRecordFun = () => {
    dispatch(GetVendorBillDetailsState({ bill_id: selectedBills[0] }));
  };

  useEffect(() => {
    if (
      Object.keys(VendorBillDetails || {})?.length > 0 &&
      selectedBills?.length === 1
    ) {
      navigate('/bill-upload', {
        state: { selected: VendorBillDetails,
          emailBillBox: true,
          stateForBack: {emailBillData: selectedItemMain,
            selectedEmail: state?.selectedEmail,} },
      });
    } else if (
      Object.keys(VendorBillDetails || {})?.length > 0 &&
      selectedBills?.length > 1
    ) {
      navigate('/bill-upload', {
        state: { multipleBills: selectedBills, selected: VendorBillDetails,
          emailBillBox: true,
          stateForBack: {emailBillData: selectedItemMain,
            selectedEmail: state?.selectedEmail,}
          }, },
      );
    }
  }, [JSON.stringify(VendorBillDetails), selectedBills]);

  useEffect(() => {
    if (
      Object.keys(providerState || {})?.length > 0 &&
      providerState?.editProvider &&
      !desktopView
    ) {
      dispatch(
        PostNewProviderState({
          emailUserId: state?.selectedEmail?.id,
          payload: providerState,
          type: 'edit',
          emailListId: selectedItemMain?.email_list_id,
        })
      );
      handleDrawer('editProvider', false);
      setProviderState({});
    }
  }, [providerState]);

  useEffect(() => {
    if (Object.keys(state?.emailBillData || {})?.length === 0) {
      navigate('/bill-box', {
        state: {
          showButton: 'Email Bills',
          selectedEmail: state?.selectedEmail,
        },
      });
    } else {
      setSelectedItemMain(state?.emailBillData);
    }
    if (state?.selectedEmail?.id && desktopView) {
      EmailListCall(1);
    }
  }, [state, desktopView]);

  useEffect(() => {
    if (EmailListDataState?.data) {
      if (EmailListDataState?.page === 1) {
        setEmailList(EmailListDataState?.data);
      } else {
        setEmailList((prev) => [...prev, ...EmailListDataState?.data]);
      }
      if (
        EmailListDataState?.pages > 1 &&
        EmailListDataState?.page < EmailListDataState?.pages &&
        desktopView
      ) {
        EmailListCall(EmailListDataState?.page + 1);
      }
      // if (!desktopView) {
      //   sethasMoreItems(
      //     EmailListDataState?.page !== EmailListDataState?.pages
      //   );
      // }
    }
  }, [JSON.stringify(EmailListDataState)]);

  useEffect(() => {
    if (EmailBillsListDataStateWithId?.data) {
      if (EmailBillsListDataStateWithId?.page === 1) {
        setEmailBills(EmailBillsListDataStateWithId?.data);
      } else {
        setEmailBills((prev) => [
          ...prev,
          ...EmailBillsListDataStateWithId?.data,
        ]);
      }
      if (
        EmailBillsListDataStateWithId?.pages > 1 &&
        EmailBillsListDataStateWithId?.page <
          EmailBillsListDataStateWithId?.pages &&
        desktopView
      ) {
        EmailBillListCall(EmailBillsListDataStateWithId?.page + 1);
      }
      if (!desktopView) {
        sethasMoreItems(
          EmailBillsListDataStateWithId?.page !==
            EmailBillsListDataStateWithId?.pages
        );
      }
    }
  }, [JSON.stringify(EmailBillsListDataStateWithId)]);

  useEffect(() => {
    if (selectedItemMain?.email_list_id) {
      EmailBillListCall(1, true);
    }
  }, [selectedItemMain?.email_list_id]);

  useEffect(() => {
    dispatch(GetEmailBillsProviderCategoryState());
    return () => {
      dispatch(ClearStateGetEmailBillsListWithId());
      dispatch(ClearStateGetVendorBillDetails());
    };
  }, []);

  useEffect(() => {
    if (Object.keys(SingleEmailBillData || {})?.length > 0 && !desktopView) {
      if (SingleEmailBillData?.file_url) {
        setFileUrl(SingleEmailBillData?.file_url);
        handleDrawer('viewBill', true);
      } else {
        dispatch(
          openSnackbar({
            message: 'There is no bill.',
            type: 'warning',
          })
        );
      }
      dispatch(ClearStateGetSingleEmailBill());
    }
  }, [JSON.stringify(SingleEmailBillData)]);

  useEffect(() => {
    if (EmailBillAction?.name === 'providerEdited') {
      EmailListCall(1);
      // setSelectedItemMain({
      //   ...selectedItemMain,
      //   name: EmailBillAction?.response?.name,
      //   email: EmailBillAction?.response?.email,
      //   expense_category_id: EmailBillAction?.response?.expense_category_id,
      // });
      dispatch(ClearEmailBillActionState());
      navigate('/bill-box-email', {
        state: {
          emailBillData: {
            ...selectedItemMain,
            name: EmailBillAction?.response?.name,
            email: EmailBillAction?.response?.email,
            expense_category_id: EmailBillAction?.response?.expense_category_id,
            vendor_id: EmailBillAction?.response?.vendor_id,
          },
          selectedEmail: state?.selectedEmail,
        },
      });
    }
    if (EmailBillAction === 'emailBillDeleted') {
      EmailBillListCall('', 1, true);
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction === 'emailProviderDeleted') {
      if (!desktopView) {
        dispatch(ClearEmailBillActionState());
        navigate('/bill-box', {
          state: {
            showButton: 'Email Bills',
            selectedEmail: state?.selectedEmail,
          },
        });
        return;
      }
      EmailListCall(1);
      dispatch(ClearEmailBillActionState());
      navigate('/bill-box-email', {
        state: {
          emailBillData: {...emailList[0], email_list_id: emailList[0]?.id},
          selectedEmail: state?.selectedEmail,
        },
      });
    }
  }, [EmailBillAction]);

  return (
    <>
      <PageTitle
        title="BillBox"
        onClick={() => {
          navigate('/bill-box', {
            state: {
              showButton: 'Email Bills',
              selectedEmail: state?.selectedEmail,
            },
          });
        }}
      />
      <div
        className={
          !desktopView
            ? cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
      >
        {desktopView ? (
          <EmailBillBoxDesktop
            emailList={emailList}
            emailBills={emailBills}
            selectedItemMain={selectedItemMain}
            setSelectedItemMain={setSelectedItemMain}
            selectedBills={selectedBills}
            setSelectedBill={setSelectedBill}
            EmailBillListCall={EmailBillListCall}
            EmailCategoryListData={EmailCategoryListData}
            providerState={providerState}
            setProviderState={setProviderState}
          />
        ) : (
          <Box className={css.emailbillbox_main}>
            <Stack
              className={css.topcard}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                component={Stack}
                gap="12px"
                direction="row"
                alignItems="center"
              >
                <Avatar
                  className={css.avatar}
                  src={
                    selectedItemMain?.image_key
                      ? `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/email_list_logos/${selectedItemMain?.image_key}.svg`
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${selectedItemMain?.name}&chars=1`
                  }
                />
                <Stack gap="4px">
                  <Typography className={css.title}>
                    {selectedItemMain?.name}
                  </Typography>
                  <Typography className={css.subtitle}>
                    {selectedItemMain?.email}
                  </Typography>
                </Stack>
              </Box>

              <Box
                component={IconButton}
                className={css.actionbtn}
                onClick={() =>
                  handleDrawer('moreActionForServiceProvider', true)
                }
              >
                <MoreHorizIcon />
              </Box>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={css.mid_cont}
            >
              <Typography className={css.text}>Bill History</Typography>
              <Button
                className={css.secondaryButton}
                disabled={selectedBills?.length === 0}
                onClick={() => multipleRecordFun()}
              >
                Record Now
              </Button>
            </Stack>

            <Box className={css.last_cont}>
              <Box
                component={Stack}
                direction="row"
                // justifyContent="space-between"
                alignItems="center"
                className={css.headcont}
              >
                <Stack direction="row" gap="2px" alignItems="center">
                  <Checkbox
                    style={{
                      color: '#F08B32',
                      padding: 0,
                    }}
                    checked={selectedBills?.length === emailBills?.length}
                    onChange={(event) => {
                      if (event?.target?.checked) {
                        setSelectedBill(
                          emailBills?.map((val) => val?.vendor_bill_id)
                        );
                      } else {
                        setSelectedBill([]);
                      }
                    }}
                  />
                  <Typography className={css.headtitletext}>
                    Bill Date
                  </Typography>
                </Stack>
                <Typography
                  className={css.headtitletext}
                  sx={{ width: '50%' }}
                  align="center"
                >
                  Amount
                </Typography>
                {/* <Typography className={css.headtitletext}>Payment Status</Typography> */}
              </Box>

              <>
                {!EmailBillsListDataLoad && (
                  <MobileCardLoadingSkeleton NumCard={6} />
                )}
                {EmailBillsListDataStateWithId?.data?.length === 0 &&
                  EmailBillsListDataLoad === 'dataLoad' && (
                    <Typography align="center" my="16px">
                      No Bill Found.
                    </Typography>
                  )}
                {EmailBillsListDataStateWithId?.data?.length > 0 &&
                  EmailBillsListDataLoad === 'dataLoad' && (
                    <InfiniteScroll
                      dataLength={emailBills?.length}
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
                      height="calc(100vh - 360px)"
                    >
                      <Stack
                        direction="column"
                        gap="12px"
                        // sx={{ height: 'calc(100vh - 360px)', overflow: 'auto' }}
                      >
                        {emailBills?.map((val) => (
                          <Box
                            component={Stack}
                            direction="row"
                            alignItems="center"
                            className={css.row_cont}
                          >
                            <Stack
                              direction="row"
                              gap="2px"
                              alignItems="center"
                              width="fit-content"
                            >
                              <Checkbox
                                style={{
                                  color: '#F08B32',
                                  padding: 0,
                                }}
                                value={val?.vendor_bill_id}
                                checked={selectedBills?.includes(
                                  val?.vendor_bill_id
                                )}
                                onChange={onCheckBoxChange}
                              />
                              <Typography className={css.row_text}>
                                {moment(val?.last_bill_date).format(
                                  'DD-MM-YYYY'
                                )}
                              </Typography>
                            </Stack>
                            <Typography
                              className={css.row_text}
                              sx={{ width: '40%' }}
                            >
                              {currencyFormatter.format(
                                Math.abs(val?.amount || 0)
                              )}
                            </Typography>
                            <Box
                              // className={css[val?.status]}
                              sx={{ marginLeft: 'auto', width: 'fit-content' }}
                              component={IconButton}
                              onClick={() => {
                                setActiveRow(val);
                                handleDrawer('moreAction', true);
                              }}
                            >
                              <MoreHorizIcon />
                              {/* {val?.status} */}
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </InfiniteScroll>
                  )}
              </>
            </Box>
            <SelectBottomSheet
              open={drawer?.moreAction}
              onClose={() => handleDrawer('moreAction', false)}
              triggerComponent={<div style={{ display: 'none' }} />}
              addNewSheet
              styleDrawerMinHeight="auto"
            >
              <BillDetails
                from="emailBillHistory"
                viewBillFun={viewBillFun}
                viewEmailFun={viewEmailFun}
                ignoreFun={ignoreBillFun}
              />
            </SelectBottomSheet>
            <SelectBottomSheet
              open={drawer?.moreActionForServiceProvider}
              onClose={() =>
                handleDrawer('moreActionForServiceProvider', false)
              }
              triggerComponent={<div style={{ display: 'none' }} />}
              addNewSheet
              styleDrawerMinHeight="auto"
            >
              <BillDetails
                from="emailBillHistoryForServiceProvider"
                ignoreFun={ignoreProviderFun}
                editProviderFun={editProviderFun}
                showEdit={selectedItemMain?.editable}
              />
            </SelectBottomSheet>
            {drawer?.viewBill && (
              <BillViewDialog
                file_url={fileUrl}
                onClose={() => handleDrawer('viewBill', null)}
              />
            )}
            <SelectBottomSheet
              open={drawer?.ignoreBill}
              onClose={() => handleDrawer('ignoreBill', false)}
              triggerComponent={<div style={{ display: 'none' }} />}
              addNewSheet
              styleDrawerMinHeight="auto"
            >
              <IgnoreContent
                title="Ignore Bill - Confirm Your Decision"
                descrpitionText={`This Bill from ${activeRow?.email_list_name} will be removed from your Bill Box and won’t be considered for Accounting. How would you like to proceed?`}
                leftButton="Cancel"
                rightButton="Confirm"
                handleNo={() => handleDrawer('ignoreBill', null)}
                handleYes={() => {
                  handleDrawer('ignoreBill', null);
                  dispatch(
                    DeleteEmailBillState({
                      emailUserId: state?.selectedEmail?.id,
                      emailBillId: activeRow?.id,
                    })
                  );
                }}
              />
            </SelectBottomSheet>
            <SelectBottomSheet
              open={drawer?.ignoreVendor}
              onClose={() => handleDrawer('ignoreVendor', false)}
              triggerComponent={<div style={{ display: 'none' }} />}
              addNewSheet
              styleDrawerMinHeight="auto"
            >
              <IgnoreContent
                title="Ignore Vendor - Confirm Your Decision"
                descrpitionText={`You will no longer be able to receive bills sent by ${activeRow?.email_list_name} to you ${activeRow?.email} ID on Effortless. How would you like to proceed?`}
                leftButton="Cancel"
                rightButton="Confirm"
                handleNo={() => handleDrawer('ignoreVendor', null)}
                handleYes={() => {
                  handleDrawer('ignoreVendor', null);
                  dispatch(
                    DeleteEmailProviderState({
                      emailUserId: state?.selectedEmail?.id,
                      emailListId: selectedItemMain?.email_list_id,
                    })
                  );
                }}
              />
            </SelectBottomSheet>
            <SelectBottomSheet
              open={drawer?.editProvider}
              triggerComponent={<></>}
              onClose={() => handleDrawer('editProvider', false)}
              styleDrawerMinHeight="auto"
            >
              <AddEmailBillProvider
                handleClose={handleDrawer}
                categoryList={EmailCategoryListData?.data}
                setProviderState={setProviderState}
                type="edit"
                providerState={providerState}
              />
            </SelectBottomSheet>
          </Box>
        )}
      </div>
    </>
  );
};

export default EmailBillBox;

const EmailBillBoxDesktop = ({
  emailList,
  emailBills,
  selectedItemMain,
  setSelectedItemMain,
  selectedBills,
  setSelectedBill,
  EmailBillListCall,
  EmailCategoryListData,
  providerState,
  setProviderState,
}) => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const dispatch = useDispatch();

  const [drawer, setDrawer] = useState({});

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const multipleRecordFun = () => {
    dispatch(GetVendorBillDetailsState({ bill_id: selectedBills[0] }));
  };

  useEffect(() => {
    if (
      Object.keys(providerState || {})?.length > 0 &&
      providerState?.editProvider
    ) {
      dispatch(
        PostNewProviderState({
          emailUserId: state?.selectedEmail?.id,
          payload: providerState,
          type: 'edit',
          emailListId: selectedItemMain?.email_list_id,
        })
      );
      handleDrawer('editProvider', false);
      setProviderState({});
    }
  }, [providerState]);

  return (
    <Stack direction="row" gap="24px" className={css.emailbillbox_desktop_main}>
      <Box className={css.first_container}>
        <Box p="20px" sx={{ borderBottom: '1px solid #E4E4E4' }}>
          <Stack
            direction="row"
            gap="8px"
            pt="2px"
            pb="16px"
            alignItems="center"
          >
            <IconButton
              onClick={() => {
                navigate('/bill-box', {
                  state: {
                    showButton: 'Email Bills',
                    selectedEmail: state?.selectedEmail,
                  },
                });
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <Typography className={css.emailbills_text}>Email Bills</Typography>
          </Stack>
          <Typography className={css.emailbills_label} pb="12px">
            Selected Email
          </Typography>
          <Typography className={css.emailbills_email}>
            {state?.selectedEmail?.email}
          </Typography>
        </Box>

        <EmailBillProviderCard
          dataList={emailList}
          selectedItem={selectedItemMain}
          setSelectedItem={(val) => setSelectedItemMain(val)}
          EmailBillListCall={EmailBillListCall}
        />
      </Box>
      <Stack direction="column" gap="24px" className={css.second_container}>
        <Box className={`${css.top_container}`} p="20px 24px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              component={Stack}
              direction="row"
              gap="12px"
              alignItems="center"
            >
              <Avatar
                className={css.avatar_emailbill}
                src={
                  selectedItemMain?.image_key
                    ? `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/email_list_logos/${selectedItemMain?.image_key}.svg`
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${selectedItemMain?.name}&chars=1`
                }
              />
              <Stack direction="column" gap="12px" alignItems="start">
                <Typography className={css.emailbill_provider}>
                  {selectedItemMain?.name}
                </Typography>
                <Typography className={css.emailbill_email}>
                  {selectedItemMain?.email}
                </Typography>
              </Stack>
            </Box>
            <Box
              component={IconButton}
              className={css.actionbtn}
              onClick={(event) =>
                handleDrawer('moreAction', event?.currentTarget)
              }
            >
              <MoreHorizIcon />
            </Box>
          </Stack>
        </Box>
        <Box className={css.bottom_container}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p="16px 24px"
          >
            <Typography className={css.bill_history}>Bill History</Typography>
            <Button
              className={css.primaryButton}
              disabled={selectedBills?.length === 0}
              onClick={() => multipleRecordFun()}
            >
              Record Now
            </Button>
          </Stack>
          <EmailBillBoxDatagrid
            selectedEmail={state?.selectedEmail}
            emailBills={emailBills}
            setSelectedBill={setSelectedBill}
            selectedItemMain={selectedItemMain}
          />
        </Box>
      </Stack>
      <Popover
        open={Boolean(drawer?.moreAction)}
        anchorEl={drawer?.moreAction}
        onClose={() => handleDrawer('moreAction', null)}
        sx={{
          '& .MuiPaper-root': {
            padding: '4px 0',
            width: '200px',
            borderRadius: '8px',
          },
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack className={css.moreactionsheet}>
          <ul style={{ padding: 0, margin: 0 }}>
            {selectedItemMain?.editable && (
              <MenuItem
                onClick={() => {
                  setProviderState({
                    name: selectedItemMain?.name,
                    email: selectedItemMain?.email,
                    expense_category_id: selectedItemMain?.expense_category_id,
                    vendor_id: selectedItemMain?.vendor_id
                  });
                  handleDrawer('editProvider', true);
                  handleDrawer('moreAction', null);
                }}
                className={css.menutext}
              >
                <img src={edit_bill} alt="edit" />
                Edit Provider
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                handleDrawer('ignoreVendor', true);
                handleDrawer('moreAction', null);
              }}
              className={css.menutext}
            >
              <img src={eye_off} alt="eye_off" />
              Ignore
            </MenuItem>
          </ul>
        </Stack>
      </Popover>
      <Dialog
        open={drawer?.ignoreVendor}
        onClose={() => handleDrawer('ignoreVendor', false)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <IgnoreContent
          title="Ignore Vendor - Confirm Your Decision"
          descrpitionText={`You will no longer be able to receive bills sent by ${selectedItemMain?.name} to you ${selectedItemMain?.email} ID on Effortless. How would you like to proceed?`}
          leftButton="Cancel"
          rightButton="Confirm"
          handleNo={() => handleDrawer('ignoreVendor', null)}
          handleYes={() => {
            handleDrawer('ignoreVendor', null);
            dispatch(
              DeleteEmailProviderState({
                emailUserId: state?.selectedEmail?.id,
                emailListId: selectedItemMain?.email_list_id,
              })
            );
          }}
        />
      </Dialog>
      <Dialog
        open={drawer?.editProvider}
        onClose={() => handleDrawer('editProvider', false)}
        PaperProps={{
          style: {
            width: 460,
            paddingBottom: 20,
            borderRadius: 8,
          },
        }}
      >
        <AddEmailBillProvider
          handleClose={handleDrawer}
          categoryList={EmailCategoryListData?.data}
          setProviderState={setProviderState}
          type="edit"
          providerState={providerState}
        />
      </Dialog>
    </Stack>
  );
};

const EmailBillProviderCard = ({
  dataList,
  selectedItem,
  setSelectedItem,
  EmailBillListCall,
}) => {
  const {
    EmailListDataLoad,
    EmailListDataState,
    // EmailBillAction,
  } = useSelector((value) => value.EmailBills);
  const [hasMoreItems, sethasMoreItems] = useState(true);

  const loadMore = () => {
    if (EmailListDataState?.pages > 1) {
      EmailBillListCall(EmailListDataState?.page + 1);
    }
  };

  useEffect(() => {
    if (EmailListDataState?.data) {
      sethasMoreItems(EmailListDataState?.page !== EmailListDataState?.pages);
    }
  }, [JSON.stringify(EmailListDataState)]);

  return (
    <>
      <Box
        sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}
        id="billScrollable"
      >
        {!EmailListDataLoad && (
          <Box p="16px 20px">
            <MobileCardLoadingSkeleton NumCard={6} />
          </Box>
        )}
        {EmailListDataState?.data?.length === 0 &&
          EmailListDataLoad === 'dataLoad' && (
            <Typography align="center" my="16px">
              No Bill Found.
            </Typography>
          )}
        {EmailListDataState?.data?.length > 0 &&
          EmailListDataLoad === 'dataLoad' && (
            <InfiniteScroll
              dataLength={dataList?.length}
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
              // height="calc(100vh - 300px)"
              scrollableTarget="billScrollable"
            >
              <Stack p="16px 20px" gap="12px">
                {dataList?.map((val) => (
                  <Box
                    className={css.emailbill_card}
                    key={val?.id}
                    sx={{
                      boxShadow:
                        selectedItem?.email_list_id !== val?.id &&
                        'none !important',
                      '&:hover': {
                        boxShadow:
                          selectedItem?.email_list_id !== val?.id &&
                          '0px 2px 4px 0px rgba(246, 145, 13, 0.35) !important',
                      },
                    }}
                    onClick={() => {
                      setSelectedItem({ ...val, email_list_id: val?.id });
                    }}
                    component={Button}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box
                        component={Stack}
                        direction="row"
                        gap="12px"
                        alignItems="center"
                      >
                        <Avatar
                          className={css.avatar_emailbill}
                          src={
                            val?.image_key
                              ? `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/email_list_logos/${val?.image_key}.svg`
                              : `https://api.dicebear.com/7.x/initials/svg?seed=${val?.name}&chars=1`
                          }
                        />
                        <Stack direction="column" gap="12px" alignItems="start">
                          <Typography className={css.emailbill_provider}>
                            {val?.name}
                          </Typography>
                          <Stack direction="row" gap="14px" alignItems="center">
                            <Typography className={css.emailbill_datelabel}>
                              Bill date
                            </Typography>
                            <Typography className={css.emailbill_datevalue}>
                              {val?.last_bill_date
                                ? moment(val?.last_bill_date)?.format(
                                    'YYYY-MM-DD'
                                  )
                                : '-'}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                      <Stack direction="column" gap="12px" alignItems="end">
                        <Typography className={css.emailbill_amount}>
                          {currencyFormatter.format(Math.abs(val?.amount || 0))}
                        </Typography>
                        {/* <Box className={css[val?.status]}>{val?.status}</Box> */}
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
              {/* </Box> */}
            </InfiniteScroll>
          )}
      </Box>
    </>
  );
};

const EmailBillBoxDatagrid = ({
  selectedEmail,
  emailBills,
  setSelectedBill,
  selectedItemMain,
}) => {
  const dispatch = useDispatch();
  const {  SingleEmailBillData } = useSelector(
    (value) => value.EmailBills
  );

  const [drawer, setDrawer] = useState({});
  const [fileUrl, setFileUrl] = useState({});
  const [activeRow, setActiveRow] = useState({});

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };
  const EmailBillColumn = [
    {
      field: 'bill_date',
      headerName: 'Bill Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
      params.row?.bill_date ? moment(params.row?.bill_date).format('DD-MM-YYYY') : '-',
      headerAlign: 'left',
      align: 'left',
      width: 135,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      renderCell: (params) => {
        return (<Typography className='MuiDataGrid-cell-amount'>
          {params?.value < 0 ? `(${currencyFormatter.format(Math.abs(params?.value))})`
            : currencyFormatter.format(params?.value || 0)}
        </Typography>);
      },
      headerAlign: 'center',
      align: 'center',
      width: 160,
      flex: 1,
      type: 'number',
    },
    {
      field: 'id',
      headerName: 'Bill',
      renderCell: (param) => {
        return (
          <Stack direction="row" gap="24px" alignItems="center">
            <Button
              onClick={() =>
                dispatch(
                  GetSingleEmailBillState({
                    emailUserId: selectedEmail?.id,
                    emailBillId: param?.row?.id,
                  })
                )
              }
              className={css.openbilltag}
              disabled={!param?.row?.file_attached}
            >
              Open Bill
            </Button>
            <Button
              endIcon={
                <img src={gmail_logo} alt="Gmail" style={{ width: '20px' }} />
              }
              className={css.viewButton}
              target="_blank"
              href={param?.row?.mail_url}
            >
              View
            </Button>
          </Stack>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      width: 200,
    },
    {
      field: '-',
      headerName: 'Action',
      renderCell: (param) => {
        return (
          <Button
            className={css.emailbillmoreactionbtn}
            onClick={() => {
              setActiveRow(param?.row);
              handleDrawer('deleteBill', true);
            }}
          >
            <img src={new_red_delete} alt="delete" />
          </Button>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      width: 160,
    },
  ];

  useEffect(() => {
    if (Object.keys(SingleEmailBillData || {})?.length > 0) {
      if (SingleEmailBillData?.file_url) {
        setFileUrl(SingleEmailBillData?.file_url);
        handleDrawer('viewBill', true);
      } else {
        dispatch(
          openSnackbar({
            message: 'There is no bill.',
            type: 'warning',
          })
        );
      }
      dispatch(ClearStateGetSingleEmailBill());
    }
  }, [JSON.stringify(SingleEmailBillData)]);

  return (
    <Box>
      <DataGridPremium
        rows={emailBills || []}
        columns={EmailBillColumn}
        density="compact"
        rowHeight={80}
        columnHeaderHeight={80}
        disableChildrenSorting
        disableColumnResize
        disableColumnReorder
        hideFooter
        disableRowSelectionOnClick
        disableColumnPinning
        disableAggregation
        disableRowGrouping
        disableColumnSelector
        checkboxSelection
        onRowSelectionModelChange={(ids) => {
          const selectedRowsData = ids?.map(
            (id) => emailBills?.find((row) => row.id === id)?.vendor_bill_id
          );
          setSelectedBill(selectedRowsData);
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Bill Found.
            </Stack>
          ),
          // LoadingOverlay: InvoiceLoadingSkeleton,
        }}
        // loading={EmailBillsListDataLoad === null}
        className={css.email_bill_box_list}
        sx={{
          background: '#fff',
          borderRadius: '0px',
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            background: '#F5F5F5',
            border: 'none',
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            height: 'calc(100vh - 400px) !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'break-spaces',
            textAlign: 'center',
            lineHeight: '20px',
            fontFamily: "'Lexend', sans-serif !important",
            fontWeight: '200 !important',
            fontSize: '13px',
            color: '#464646'
          },
          '& .MuiDataGrid-row': {
            padding: '4px 0',
          },
          '& .MuiDataGrid-cell': {
            fontFamily: "'Lexend', sans-serif !important",
            fontWeight: '300 !important',
            fontSize: '14px',
          },
          '& .MuiDataGrid-cell-amount': {
            fontFamily: "'Lexend', sans-serif !important",
            fontWeight: '400 !important',
            fontSize: '14px',
          },
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
        }}
      />
      {drawer?.viewBill && (
        <BillViewDialog
          file_url={fileUrl}
          onClose={() => handleDrawer('viewBill', null)}
        />
      )}
      <Dialog
        open={drawer?.deleteBill}
        onClose={() => handleDrawer('deleteBill', false)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <IgnoreContent
          title="Ignore Bill - Confirm Your Decision"
          descrpitionText={`This Bill from ${selectedItemMain?.name} will be removed from your Bill Box and won’t be considered for Accounting. How would you like to proceed?`}
          leftButton="Cancel"
          rightButton="Confirm"
          handleNo={() => handleDrawer('deleteBill', null)}
          handleYes={() => {
            handleDrawer('deleteBill', null);
            dispatch(
              DeleteEmailBillState({
                emailUserId: selectedEmail?.id,
                emailBillId: activeRow?.id,
              })
            );
          }}
        />
      </Dialog>
    </Box>
  );
};

export const IgnoreContent = ({
  title,
  descrpitionText,
  leftButton,
  rightButton,
  handleNo,
  handleYes,
}) => {
  return (
    <div className={css.ignoreddialog}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.deletehead}>{title}</Typography>
      </Stack>

      <Typography className={css.descriptiontext}>{descrpitionText}</Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          {leftButton}
        </Button>
        <Button className={css.primaryButton} onClick={() => handleYes()}>
          {rightButton}
        </Button>
      </Stack>
    </div>
  );
};
