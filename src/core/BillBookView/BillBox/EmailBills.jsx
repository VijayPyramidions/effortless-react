import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetEmailUserListState,
  PostNewEmailUserState,
  PostEmailSyncState,
  DeleteEmailState,
  GetEmailBillsListState,
  ClearStateGetEmailBillsList,
  GetEmailBillsProviderCategoryState,
  PostNewProviderState,
  ClearStateGetEmailUserList,
  ClearEmailBillActionState,
  ClearStateGetSingleEmailBill,
} from '@action/Store/Reducers/Bills/EmailBillsState';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import AppContext from '@root/AppContext.jsx';

import {
  Box,
  Stack,
  Typography,
  // IconButton,
  Button,
  // Avatar,
  TextField,
  Dialog,
  // MenuItem,
  Popover,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  MenuItem
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import InputAdornment from '@mui/material/InputAdornment';

import JSBridge from '@nativeBridge/jsbridge';
import { useGoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';

import google_sign_in from '@assets/BillsLogo/google_sign_in.svg';
import gmail_logo from '@assets/BillsLogo/gmail_logo.svg';
import refresh_bill from '@assets/BillsLogo/refresh_bill.svg';
import plus from '@assets/BillsLogo/plus.svg';
import eye_off from '@assets/BillsLogo/eye-off.svg';
import google_provider_logo from '@assets/BillsLogo/google_provider_logo.svg';
import { SearchIconModule } from '@components/SvgIcons/SvgIcons.jsx';

import InfiniteScroll from 'react-infinite-scroll-component';

import { MobileCardLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';

import { EmailBillsCard, EmailBillsDatagrid } from './EmailBillAction';
import { IgnoreContent } from './EmailBillBox';
import AddEmailBillProvider from './AddEmailBillProvider';
import BillViewDialog from '../components/BillViewDialog';

import * as css from './billBox.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const EmailBills = ({ debounceSearchQuery }) => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));
  const device = localStorage.getItem('device_detect');

  const { state } = useLocation();
  const navigate = useNavigate();

  const { registerEventListeners, deRegisterEventListener } =
    useContext(AppContext);

  const dispatch = useDispatch();
  const {
    EmailUserListData,
    EmailBillsListDataState,
    EmailBillsListDataLoad,
    EmailCategoryListData,
    EmailBillAction,
    SingleEmailBillData,
  } = useSelector((value) => value.EmailBills);

  const [drawer, setDrawer] = useState({});
  const [localState, setLocalState] = useState({
    selectedEmail: state?.selectedEmail || {},
  });
  const [emailBills, setEmailBills] = useState([]);
  const [providerState, setProviderState] = useState({});
  const [providerStateEdit, setProviderStateEdit] = useState({});

  const [emailList, setEmailList] = useState([]);
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [fileUrl, setFileUrl] = useState('');

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const EmailBillListCall = (searchVal, page, loading) => {
    dispatch(
      GetEmailBillsListState({
        searchText: searchVal || '',
        emailUserId: localState?.selectedEmail?.id,
        pageNum: page || 1,
        load: loading,
      })
    );
  };

  const loadMore = () => {
    if (EmailBillsListDataState?.pages > 1) {
      EmailBillListCall('', EmailBillsListDataState?.page + 1);
    }
  };

  const onInputChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setLocalState((prev) => ({ ...prev, [name]: value }));
  };

  const connectGmailListenerForWeb = (e) => {
    const hasAccess = hasGrantedAllScopesGoogle(
      e,
      'https://www.googleapis.com/auth/gmail.readonly'
    );
    console.log(hasAccess, 'hasAccess');
    dispatch(
      PostNewEmailUserState({
        payload: {
          code: e.code,
          provider: 'google',
          redirect_uri: window.location.origin,
        },
      })
    );
  };

  const connectGmailListener = (e) => {
    console.log("emailbills");
    const { detail } = e;
    dispatch(
      PostNewEmailUserState({
        payload: {
          code: detail.code,
          provider: 'google',
          redirect_uri: window.location.origin,
        },
      })
    );
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => connectGmailListenerForWeb(tokenResponse),
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    flow: 'auth-code',
    auto_select: true,
  });

  const GoogleLog = () => {
    if (device === 'mobile') JSBridge.launchGoogleForGmailConnect();
    else if (device === 'desktop') googleLogin();
  };

  const handleEditProvider = (val) => {
    setProviderStateEdit(val);
    handleDrawer('editProvider', true);
  };

  useEffect(() => {
    if (Object?.keys(EmailUserListData || {})?.length > 0) {
      setEmailList(EmailUserListData?.data);
      if (Object?.keys(localState?.selectedEmail || {})?.length === 0) {
        setLocalState({ selectedEmail: EmailUserListData?.data[0] });
      } else {
        const tempSelectedEmail = EmailUserListData?.data?.find(val => val?.id === localState?.selectedEmail?.id);
        if (Object?.keys(tempSelectedEmail || {})?.length === 0) {
          setLocalState({ selectedEmail: EmailUserListData?.data[0] });
        } else {
          setLocalState({ selectedEmail: tempSelectedEmail });
        }
      }
    }
  }, [JSON.stringify(EmailUserListData || {})]);

  useEffect(() => {
    if (debounceSearchQuery !== null) {
      EmailBillListCall(debounceSearchQuery, 1, true);
    }
  }, [debounceSearchQuery]);

  useEffect(() => {
    if (EmailBillsListDataState?.data) {
      if (EmailBillsListDataState?.page === 1) {
        setEmailBills(EmailBillsListDataState?.data);
      } else {
        setEmailBills((prev) => [...prev, ...EmailBillsListDataState?.data]);
      }
      if (
        EmailBillsListDataState?.pages > 1 &&
        EmailBillsListDataState?.page < EmailBillsListDataState?.pages &&
        desktopView
      ) {
        EmailBillListCall('', EmailBillsListDataState?.page + 1);
      }
      if (!desktopView) {
        sethasMoreItems(
          EmailBillsListDataState?.page !== EmailBillsListDataState?.pages
        );
      }
    }
  }, [JSON.stringify(EmailBillsListDataState)]);

  useEffect(() => {
    if (
      Object.keys(providerState || {})?.length > 0 &&
      !providerState?.editProvider
    ) {
      dispatch(
        PostNewProviderState({
          emailUserId: localState?.selectedEmail?.id,
          payload: providerState,
        })
      );
      handleDrawer('addNewProvider', false);
      setProviderState({});
    } else if (
      Object.keys(providerState || {})?.length > 0 &&
      providerState?.editProvider
    ) {
      dispatch(
        PostNewProviderState({
          emailUserId: localState?.selectedEmail?.id,
          payload: providerState,
          type: 'edit',
          emailListId: providerState?.emailListId,
        })
      );
      handleDrawer('editProvider', false);
      setProviderState({});
      setProviderStateEdit({});
    }
  }, [providerState]);

  useEffect(() => {
    if (EmailBillAction === 'newProviderCreated') {
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction === 'newEmailUserCreated') {
      dispatch(GetEmailUserListState());
      setLocalState({ selectedEmail: {} });
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction === 'emailSynced') {
      dispatch(ClearStateGetEmailUserList());
      dispatch(GetEmailUserListState());
      // setLocalState({ selectedEmail: {} });
      // EmailBillListCall('', 1, true);
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction === 'emailSyncStoped') {
      dispatch(ClearStateGetEmailUserList());
      dispatch(GetEmailUserListState());
      // setLocalState({ selectedEmail: {} });
      // EmailBillListCall('', 1, true);
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction === 'emailDeleted') {
      dispatch(GetEmailUserListState());
      setLocalState({ selectedEmail: {} });
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction === 'emailBillDeleted') {
      EmailBillListCall('', 1, true);
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction === 'emailProviderDeleted') {
      EmailBillListCall('', 1, true);
      dispatch(ClearEmailBillActionState());
    }
    if (EmailBillAction?.name === 'providerEdited') {
      EmailBillListCall('', 1, true);
      dispatch(ClearEmailBillActionState());
    }
  }, [EmailBillAction]);

  useEffect(() => {
    if (localState?.selectedEmail?.id) {
      EmailBillListCall('', 1, true);
    }
  }, [localState?.selectedEmail?.id]);

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
    registerEventListeners({
      name: 'gmailConnect',
      method: connectGmailListener,
    });
    dispatch(GetEmailUserListState());
    dispatch(GetEmailBillsProviderCategoryState());
    return () => {
      dispatch(ClearStateGetEmailBillsList());
      dispatch(ClearStateGetEmailUserList());
      deRegisterEventListener({
        name: 'gmailConnect',
        method: connectGmailListener,
      });
    };
  }, []);

  useEffect(() => {
    if (state?.connectGoogleDirectly) {
      GoogleLog();
      navigate('/bill-box', {
        state: {
          showButton: 'Email Bills',
        },
      });
    }
   }, [state?.for, device]);

  return (
    <Box component={Stack} className={css.email_bills_mobile}>
      {EmailUserListData?.data?.length === 0 && (
        <Stack
          direction="column"
          alignItems="center"
          gap="20px"
          p={desktopView ? '20px' : '12px 20px'}
          className={css.emptycont}
          width={desktopView ? '506px' : 'auto'}
          margin="auto"
        >
          <img
            src={gmail_logo}
            alt="Gmail"
            style={{ width: desktopView ? '160px' : '100px' }}
          />
          <Typography className={css.googleconnect}>
            Connecting your Gmail allows Effortless to track Bills sent to you
            by your Vendor. Use this for a smoother Bill Booking experience.
          </Typography>
          <Box component={Button} onClick={() => GoogleLog()}>
            <img
              src={google_sign_in}
              alt="google_sign_in"
              style={{ width: '258px', cursor: 'pointer' }}
            />
          </Box>
        </Stack>
      )}
      {EmailUserListData?.data?.length > 0 && (
        <Stack
          direction="column"
          p={desktopView ? '0px' : '12px 20px'}
          className={css.emailcont}
        >
          {desktopView && (
            <Box component={Stack} gap="8px" p="16px 22px 22px">
              <Typography className={css.maillabel}>
                Select Your Email
              </Typography>
              <Stack
                direction="row"
                width="100%"
                justifyContent="flex-start"
                gap="16px"
                alignItems="center"
                sx={{ overflow: 'auto' }}
              >
                <Stack
                  direction="row"
                  component={Button}
                  justifyContent="space-between"
                  alignItems="center"
                  className={css.emailselectfield}
                  width="65%"
                  minWidth="fit-content"
                  onClick={(e) => handleDrawer('emailList', e?.currentTarget)}
                >
                  <Typography className={css.emailtext}>
                    {localState?.selectedEmail?.email}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ color: '#000' }} />
                </Stack>
                <Box
                  component={Stack}
                  gap="16px"
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className={css.desktop_top_view}
                  width="100%"
                >
                  {localState?.selectedEmail?.sync_processing && <Typography className={css.syncprocessmsg}>Sync Processing</Typography> || <Typography className={css.syncmsg}>
                    <span>Last Sync: </span>
                    {localState?.selectedEmail?.last_synced_at
                      ? moment(
                          localState?.selectedEmail?.last_synced_at
                        )?.format('MMMM Do YYYY, h:mm:ss a')
                      : '-'}
                  </Typography>}
                  <Stack direction="row" gap="16px" sx={{ marginLeft: 'auto' }}>
                    <Button
                      className={`${css.addnewprovider_btn} ${css.btn}`}
                      startIcon={<AddIcon />}
                      onClick={() => handleDrawer('addNewProvider', true)}
                    >
                      Add New Provider
                    </Button>
                    <Button
                      className={`${css.connectgoogle_btn} ${css.btn}`}
                      startIcon={
                        <img src={google_provider_logo} alt="google" />
                      }
                      onClick={() => GoogleLog()}
                    >
                      Connect New Email
                    </Button>
                    <Button
                      className={`${css.moreaction_btn} ${css.btn}`}
                      endIcon={<KeyboardArrowDownIcon sx={{ color: '#000' }} />}
                      onClick={(event) =>
                        handleDrawer('moreAction', event?.currentTarget)
                      }
                    >
                      More Actions
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}

          {!desktopView && (
            <>
              <Box component={Stack} gap="8px">
                <Typography className={css.maillabel}>
                  Select Your Email
                </Typography>
                <Stack
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                  gap="16px"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    component={Button}
                    justifyContent="space-between"
                    alignItems="center"
                    className={css.emailselectfield}
                    width="65%"
                    onClick={() => handleDrawer('emailList', true)}
                  >
                    <Typography className={css.emailtext}>
                      {localState?.selectedEmail?.email}
                    </Typography>
                    <KeyboardArrowDownIcon sx={{ color: '#000' }} />
                  </Stack>
                  {localState?.selectedEmail?.status !== 'active' && (
                    <Box
                      className={css.syncbtn}
                      component={Button}
                      onClick={() => {
                        dispatch(
                          PostEmailSyncState({
                            emailUserId: localState?.selectedEmail?.id,
                            payload: { status: 'active' },
                          })
                        );
                      }}
                    >
                      <img src={refresh_bill} alt="refresh" />
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box
                component={Stack}
                gap="16px"
                direction="row"
                justifyContent="space-between"
                margin="12px 0"
                alignItems="center"
              >
                {localState?.selectedEmail?.sync_processing && <Typography className={css.syncprocessmsg}>Sync Processing</Typography> || <Typography className={css.syncmsg}>
                  <span>Last Sync: </span>
                  {localState?.selectedEmail?.last_synced_at
                    ? moment(localState?.selectedEmail?.last_synced_at)?.format(
                      'MMMM Do YYYY, h:mm:ss a'
                    )
                    : '-'}
                </Typography>}
                <Button
                  className={css.moreaction_btn}
                  endIcon={<KeyboardArrowDownIcon sx={{ color: '#000' }} />}
                  onClick={() => handleDrawer('moreAction', true)}
                >
                  More Actions
                </Button>
              </Box>
            </>
          )}

          {!desktopView && (
            <>
              {!EmailBillsListDataLoad && (
                <MobileCardLoadingSkeleton NumCard={6} />
              )}
              {EmailBillsListDataState?.data?.length === 0 &&
                EmailBillsListDataLoad === 'dataLoad' && (
                  <Typography align="center" my="16px">
                    No Bill Found.
                  </Typography>
                )}
              {EmailBillsListDataState?.data?.length > 0 &&
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
                    height="calc(100vh - 240px)"
                  >
                    <Box component={Stack} gap="12px">
                      {emailBills?.map((val) => (
                        <EmailBillsCard
                          data={val}
                          selectedEmail={localState?.selectedEmail}
                        />
                      ))}
                    </Box>
                  </InfiniteScroll>
                )}
            </>
          )}

          {desktopView && (
            <EmailBillsDatagrid
              EmailBillData={emailBills}
              selectedEmail={localState?.selectedEmail}
              handleEditProvider={handleEditProvider}
            />
          )}
        </Stack>
      )}
      <SelectBottomSheet
        open={drawer?.moreAction && !desktopView}
        onClose={() => handleDrawer('moreAction', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <div>
          {!desktopView && <Puller />}
          <Stack className={css.moreactionsheet}>
            <Box padding="36px 20px 8px">
              <p className={css.headertext}>More Action</p>
            </Box>

            <MoreActionList
              handleDrawer={handleDrawer}
              localState={localState}
              GoogleLog={GoogleLog}
            />
          </Stack>
        </div>
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.addNewProvider && !desktopView}
        triggerComponent={<></>}
        onClose={() => handleDrawer('addNewProvider', false)}
        styleDrawerMinHeight="auto"
      >
        <AddEmailBillProvider
          handleClose={handleDrawer}
          categoryList={EmailCategoryListData?.data}
          setProviderState={setProviderState}
        />
      </SelectBottomSheet>
      <Dialog
        open={drawer?.addNewProvider && desktopView}
        onClose={() => handleDrawer('addNewProvider', false)}
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
        />
      </Dialog>
      <SelectBottomSheet
        open={drawer?.editProvider && !desktopView}
        triggerComponent={<></>}
        onClose={() => handleDrawer('editProvider', false)}
        styleDrawerMinHeight="auto"
      >
        <AddEmailBillProvider
          handleClose={handleDrawer}
          categoryList={EmailCategoryListData?.data}
          setProviderState={setProviderState}
          type="edit"
          providerState={providerStateEdit}
        />
      </SelectBottomSheet>
      <Dialog
        open={drawer?.editProvider && desktopView}
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
          providerState={providerStateEdit}
        />
      </Dialog>

      <Popover
        open={Boolean(drawer?.moreAction && desktopView)}
        anchorEl={drawer?.moreAction}
        onClose={() => handleDrawer('moreAction', null)}
        sx={{
          '& .MuiPaper-root': {
            padding: '4px 0',
            marginTop: '8px',
            width: '200px',
            borderRadius: '8px',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack className={css.moreactionsheet}>
          <MoreActionList
            handleDrawer={handleDrawer}
            localState={localState}
            GoogleLog={GoogleLog}
          />
        </Stack>
      </Popover>
      <Popover
        open={Boolean(drawer?.emailList && desktopView)}
        anchorEl={drawer?.emailList}
        onClose={() => handleDrawer('emailList', null)}
        sx={{
          '& .MuiPaper-root': {
            width: '320px',
            borderRadius: '8px',
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
        <Stack className={css.emailselectionsheet}>
          <EmailSelectionList
            handleDrawer={handleDrawer}
            emailList={emailList}
            onInputChange={onInputChange}
            height='24vh'
          />
        </Stack>
      </Popover>
      <SelectBottomSheet
        open={drawer?.emailList && !desktopView}
        triggerComponent={<></>}
        onClose={() => handleDrawer('emailList', false)}
      >
        <div>
          <Puller />
          <Stack className={css.emailselectionsheet} mt="24px">
            <EmailSelectionList
              handleDrawer={handleDrawer}
              emailList={emailList}
              onInputChange={onInputChange}
              height='54vh'
            />
          </Stack>
        </div>
      </SelectBottomSheet>
      <Dialog
        open={drawer?.deActivate}
        onClose={() => handleDrawer('deActivate', false)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <IgnoreContent
          title="Deactivate this User"
          descrpitionText="Are you sure You want to Deactivate this User."
          leftButton="Cancel"
          rightButton="Confirm"
          handleNo={() => {
            handleDrawer('deActivate', null);
          }}
          handleYes={() => {
            handleDrawer('deActivate', null);
            dispatch(
              DeleteEmailState({
                emailUserId: localState?.selectedEmail?.id,
              })
            );
          }}
        />
      </Dialog>
      {drawer?.viewBill && (
        <BillViewDialog
          file_url={fileUrl}
          onClose={() => handleDrawer('viewBill', null)}
        />
      )}
    </Box>
  );
};

export default EmailBills;

const MoreActionList = ({ handleDrawer, localState, GoogleLog }) => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const dispatch = useDispatch();

  return (
    <ul style={{ padding: 0, margin: 0 }}>
      {[
        {
          name:
            localState?.selectedEmail?.status === 'active'
              ? 'Stop Sync'
              : 'Reconnect',
          icon: <img src={refresh_bill} alt="refresh" />,
          click: () => {
            handleDrawer('moreAction', false);
            if (localState?.selectedEmail?.status === 'access_revoked') {
              GoogleLog();
            } else {
              dispatch(
                PostEmailSyncState({
                  emailUserId: localState?.selectedEmail?.id,
                  payload: {
                    status:
                      localState?.selectedEmail?.status === 'active'
                        ? 'inactive'
                        : 'active',
                  },
                })
              );
            }
          },
          show: true,
        },
        {
          name: 'Refresh',
          icon: <img src={refresh_bill} alt="refresh" />,
          click: () => {
            handleDrawer('moreAction', false);
            dispatch(
              PostEmailSyncState({
                emailUserId: localState?.selectedEmail?.id,
                payload: {
                  sync_processing: true,
                },
                syncNow: true,
              })
            );
          },
          show: localState?.selectedEmail?.status === 'active',
        },
        {
          name: 'Deactivate',
          icon: <img src={eye_off} alt="eye_off" />,
          click: () => {
            handleDrawer('moreAction', false);
            handleDrawer('deActivate', true);
          },
          show: true,
        },
        {
          name: 'Add New Provider',
          icon: <img src={plus} alt="plus" />,
          click: () => {
            handleDrawer('moreAction', false);
            handleDrawer('addNewProvider', true);
          },
          show: !desktopView,
        },
        {
          name: 'Connect New Email',
          icon: <img src={google_provider_logo} alt="google" />,
          color: '#F08B32',
          click: () => {
            handleDrawer('moreAction', false);
            GoogleLog();
          },
          show: !desktopView,
        },
      ]
        ?.filter((data) => data?.show)
        ?.map((val) => (
          <MenuItem
            key={val?.user_id}
            value={val?.user_id}
            onClick={() => {
              val?.click();
            }}
            className={css.menutext}
            style={{
              color: val?.color || '#000',
            }}
          >
            {val?.icon}
            {val?.name}
          </MenuItem>
        ))}
    </ul>
  );
};

const EmailSelectionList = ({ handleDrawer, emailList, onInputChange, height }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIconModule />
            </InputAdornment>
          ),
        }}
        sx={{
          width: '100%',
          background: '#FAFAFA',
          '& .MuiInputBase-input': {
            padding: '12px 0',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              border: 'none',
              borderBottom: '1px solid #ECECEC',
            },
            '&:hover fieldset': {
              borderBottom: '1px solid #ECECEC',
            },
          },
        }}
        focused={false}
        placeholder="Search Email"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e?.target?.value);
        }}
      />
      <ul
        style={{ padding: 0, margin: 0, maxHeight: height, overflow: 'auto' }}
      >
        {emailList
          ?.filter((ele) =>
            ele?.email
              ?.toLocaleLowerCase()
              ?.includes(searchQuery?.toLocaleLowerCase())
          )
          ?.map((val) => (
            <MenuItem
              key={val?.email}
              value={val?.email}
              onClick={() => {
                onInputChange({
                  target: { name: 'selectedEmail', value: val },
                });
                handleDrawer('emailList', false);
              }}
              className={css.menutext}
              style={{ color: val?.status === 'inactive' && '#00000080' }}
            >
              {val?.email}
              <Box
                className={
                  ((val?.status === 'active' ||
                    val?.status === 'inactive' ||
                    val?.status === 'access_revoked') &&
                    css[val?.status]) ||
                  css.unsynced
                }
              >
                {val?.status === 'active' || val?.status === 'inactive'
                  ? val?.status
                  : (val?.status === 'access_revoked' && 'Disconnect') ||
                    'Unsynced'}
              </Box>
            </MenuItem>
          ))}
        {emailList?.filter((ele) =>
          ele?.email
            ?.toLocaleLowerCase()
            ?.includes(searchQuery?.toLocaleLowerCase())
        )?.length === 0 && (
          <MenuItem className={css.menutext}>No Email in the list.</MenuItem>
        )}
      </ul>
    </>
  );
};
