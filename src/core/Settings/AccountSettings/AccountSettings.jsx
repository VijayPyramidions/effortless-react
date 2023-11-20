/* eslint-disable no-unused-vars */
/* eslint-disable no-lonely-if */

import React from 'react';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { googleLogout } from '@react-oauth/google';
import JSBridge from '@nativeBridge/jsbridge';
import * as Router from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
// import cameraIcon from '@assets/camera.svg';
import pencil from '@assets/pencil.svg';
// import questionMark from '@assets/questionMark.svg';
// import secure from '@assets/secure.svg';
// import upload from '@assets/upload.svg';
// import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import CloseIcon from '@material-ui/icons/Close';
// import Checkbox from '@material-ui/core/Checkbox';
// import Divider from '@material-ui/core/Divider';
import Dialog from '@mui/material/Dialog';
import Input from '@components/Input/Input.jsx';

// import * as css from '../../Receivables/Ageing/Ageing.scss';

const useStyles = makeStyles(() => ({
  alignContent: {
    textAlignLast: 'start',
  },
  p_bottom: {
    paddingBottom: '7px',
  },
  space: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '0.7px solid rgba(153, 158, 165, 0.39)',
    width: '100%',
  },
  heading: {
    fontSize: '12px',
    fontWeight: '500',
    paddingBottom: '37px',
  },
  h1: {
    fontWeight: '400 !important',
    fontSize: '18px !important',
    alignItems: 'center',
    color: '#283049',
  },
  h2: {
    fontWeight: '350 !important',
    fontSize: '14px !important',
    alignItems: 'center',
    color: '#283049',
  },
  h3: {
    fontWeight: '300 !important',
    fontSize: '13px !important',
    alignItems: 'center',
    color: 'rgba(40, 48, 73, 0.62)',
  },
  logoutBtn: {
    backgroundColor: 'white !important',
    border: '1px solid #F08B32 !important',
    borderRadius: '15px !important',
  },
  logoutBtnTxt: {
    fontWeight: '400 !important',
    fontSize: '12px !important',
    alignItems: 'center',
    color: '#F08B32',
  },
  desktopMargin: {
    margin: '2rem 6rem 2rem 4rem !important',
  },
  marginMobile: {
    margin: '1rem !important',
  },
  mobileGrid: {
    // height: 'fit-content',
    backgroundColor: 'white',
    height: '100vh',
  },
  desktopGrid: {
    height: 'fit-content',
    backgroundColor: 'white',
    width: '92% !important',
  },
  mobileImgStack: {
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    width: '82px',
  },
  desktopImgStack: {
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    width: '82px',
    height: '50px',
    borderRadius: '8px',
  },
  desktopName: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '0.7px solid rgba(153, 158, 165, 0.39)',
    width: '100%',
    height: '50px',
  },
  mobileName: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '0.7px solid rgba(153, 158, 165, 0.39)',
    width: '100%',
    marginLeft: '2px',
  },
}));

// const WhiteBackgroundCheckbox = withStyles((theme) => ({
//   root: {
//     '& .MuiSvgIcon-root': {
//       fill: 'white',
//       '&:hover': {
//         backgroundColor: 'rgba(153, 158, 165, 0.4)',
//       },
//     },
//     '&$checked': {
//       '& .MuiIconButton-label': {
//         position: 'relative',
//         zIndex: 0,
//         border: '1px solid #F08B32',
//         borderRadius: 3,
//         width: '19px',
//         height: '19px',
//       },
//       '& .MuiIconButton-label:after': {
//         content: '""',
//         left: 2,
//         top: 2,
//         height: 15,
//         width: 15,
//         position: 'absolute',
//         backgroundColor: '#F08B32',
//         zIndex: -1,
//         borderColor: 'transparent',
//       },
//     },
//     '&:not($checked) .MuiIconButton-label': {
//       position: 'relative',
//       zIndex: 0,
//       border: '1px solid #bbbbbb',
//       borderRadius: 3,
//       width: '19px',
//       height: '19px',
//     },
//     '&:not($checked) .MuiIconButton-label:after': {
//       content: '""',
//       left: 2,
//       top: 2,
//       height: 15,
//       width: 15,
//       position: 'absolute',
//       backgroundColor: 'white',
//       zIndex: -1,
//       borderColor: 'transparent',
//     },
//     '& .MuiSwitch-track': {
//       backgroundColor: 'green !important',
//     },
//   },
//   color: theme,
//   checked: {},
// }))(Checkbox);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(237, 237, 237, 0.15)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxSizing: 'border-box',
  borderRadius: '8px',
  fontSize: '12px',
  boxShadow: 'None',
}));

function AccountSettings() {
  const {
    currentUserInfo,
    setUserInfo,
    setSessionToken,
    addOrgId,
    changeView,
    changeSubView,
    organization,
    user,
    openSnackBar,
    setCurrentUserInfo,
    enableLoading,
    validateSession,
    getCurrentUser,
    userPermissions,
  } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  // const [BottomSheet, setBottomSheet] = React.useState(false);
  const [BottomSheetName, setBottomSheetName] = React.useState(false);
  const [BottomSheetMail, setBottomSheetMail] = React.useState(false);
  const [BottomSheetNumber, setBottomSheetNumber] = React.useState(false);
  const [BottomSheetRole, setBottomSheetRole] = React.useState(false);
  const [userName, setUserName] = React.useState(currentUserInfo?.name);

  // const [BottomSheetLang, setBottomSheetLang] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [deleteOpenDialog, setDeleteOpenDialog] = React.useState(false);

  const [userRolesSettings, setUserRolesSettings] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Settings || {})?.length > 0) {
      if (!userPermissions?.Settings['Manage Account Settings'].view_user_profile) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/settings');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRolesSettings({ ...userPermissions?.Settings['Manage Account Settings'] });
    }
  }, [userPermissions]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteOpenDialog(false);
  };

  const LogoutFunction = async () => {
    await RestApi(`sessions/logout`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          // setOpen(false);
          setUserInfo({ userInfo: null });
          setSessionToken({ activeToken: null });
          setCurrentUserInfo({ currentUserInfo: {} });
          navigate('/');
          // toggleSidePanel();
        } else if (res.error) {
          // setOpen(false);
          openSnackBar({
            message: res?.error || res?.message || 'Something Went Wrong',
            type: MESSAGE_TYPE.INFO,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        // setOpen(false);
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const DeleteAccount = (orgId, currentUserId) => {
    enableLoading(true);
    RestApi(
      `organizations/${orgId}/members/${currentUserId}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res) {
          setUserInfo({ userInfo: null });
          setSessionToken({ activeToken: null });
          setCurrentUserInfo({ currentUserInfo: {} });
          navigate('/');
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const logout = async (type) => {
    const orgId = organization?.orgId;
    const currentUserId = currentUserInfo?.id;
    addOrgId({ orgId: null });
    JSBridge?.logoutNative();
    googleLogout();
    // toggleSidePanel();
    await localStorage.removeItem('user_info');
    await localStorage.removeItem('current_user_info');
    await localStorage.removeItem('session_token');
    await localStorage.removeItem('selected_organization');
    await localStorage.removeItem('PageWithParams');
    // setUserInfo({ userInfo: null });
    // setSessionToken({ activeToken: null });
    // addOrgId({ orgId: null });
    changeView('signIn');
    changeSubView('');
    if (type === 'logout') {
      if (user?.activeToken) {
        await LogoutFunction();
      } else {
        navigate('/');
      }
    } else {
      if (user?.activeToken) {
        await DeleteAccount(orgId, currentUserId);
      } else {
        navigate('/');
      }
    }
  };

  const onInputChange = (setter) => (e) => {
    // reValidate(e);
    e.preventDefault();
    setter(e.target.value);
  };

  React.useEffect(() => {
    if (currentUserInfo) setUserName(currentUserInfo?.name);
  }, [currentUserInfo?.name]);

  const CurrentUserPatch = () => {
    RestApi(
      `organizations/${organization.orgId}/current_user_details/${currentUserInfo.id}`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          name: userName,
        },
      },
    )
      .then(async (res) => {
        if (res && !res.error) {
          if (res.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
          } else {
            const organizationProps = JSON.parse(
              localStorage.getItem('selected_organization'),
            );

            if (currentUserInfo?.id === res?.id) {
              if (organizationProps) {
                await validateSession(user?.activeToken, organizationProps);
              }
              await getCurrentUser(organization.orgId);
            }
            setCurrentUserInfo({ currentUserInfo: res });
          }
          setBottomSheetName(false);
        }
      })
      .catch((e) => {
        if (e.message) {
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          });
        } else {
          openSnackBar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
        }
      });
  };

  // const RedditTextField = styled((props) => (
  //   <TextField InputProps={{ disableUnderline: true }} {...props} />
  // ))(({ theme }) => ({
  //   '& .MuiFilledInput-root': {
  //     border: '1px solid black',
  //     overflow: 'hidden',
  //     borderRadius: 4,
  //     backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
  //     transition: theme.transitions.create([
  //       'border-color',
  //       'background-color',
  //       'box-shadow',
  //     ]),
  //     '&:hover': {
  //       backgroundColor: 'transparent',
  //     },
  //     '&.Mui-focused': {
  //       backgroundColor: 'transparent',
  //       boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
  //       borderColor: theme.palette.primary.main,
  //     },
  //   },
  // }));
  // const lang = ['English', 'Hindi', 'Tamil', 'Telugu'];

  // const role = ['Member', 'Admin', 'Manager'];

  const classes = useStyles();
  const device = localStorage.getItem('device_detect');

  return (
    <>
      <Grid
        container
        className={
          device === 'desktop' ? classes.desktopGrid : classes.mobileGrid
        }
      >
        <Grid
          item
          xs={12}
          lg={12}
          md={12}
          className={
            device === 'desktop' ? classes.desktopMargin : classes.marginMobile
          }
        // style={{ device === "desktop" ?  (): (marginRight: '1.2rem', marginLeft: '1.2rem', margin: '2rem') }}
        >
          <Box sx={{ width: '100%' }}>
            <Stack spacing={1}>
              <Grid
                item
                xs={12}
                lg={12}
                md={12}
                xs={12}
                className={classes.alignContent}
              >
                <Stack
                  direction="row"
                  width="100%"
                  spacing={2}
                  justifyContent="space-between"
                >
                  {/* <Grid  */}
                  {/* // className={classes.alignContent}
                              // > */}
                  {/* <Stack
                  className={
                    device === 'desktop'
                      ? classes.desktopImgStack
                      : classes.mobileImgStack
                  }
                >
                  <img
                    src={cameraIcon}
                    alt="well"
                    style={{ width: '52%', height: '45px' }}
                  />
                </Stack> */}
                  {/* </Grid>   */}
                  {/* <Grid item xs={12} lg={12} md={12} sm={12} className={classes.alignContent}
                  > */}
                  <Item
                    className={
                      device === 'desktop'
                        ? classes.desktopName
                        : classes.mobileName
                    }
                  >
                    <Grid>
                      <Grid
                        // className={classes.p_bottom}
                        className={
                          device === 'desktop'
                            ? classes.p_bottomDesktop
                            : classes.p_bottom
                        }
                      >
                        Full Name
                      </Grid>
                      <Grid
                        className={classes.p_bottom}
                        style={{ color: '#283049', textTransform: 'capitalize' }}
                      >
                        {currentUserInfo?.name}
                      </Grid>
                    </Grid>
                    <SelectBottomSheet
                      name="moreAction"
                      triggerComponent={
                        <Button
                          style={{
                            minWidth: '0px',
                            padding: '0px',
                            alignSelf: 'flex-start',
                          }}
                          onClick={(e) => {
                            if (!userRolesSettings?.edit_user_profile) {
                              setHavePermission({
                                open: true,
                                back: () => {
                                  // navigate(-1);
                                  setHavePermission({ open: false });
                                },
                              });
                              return;
                            }
                            e.persist();
                            setBottomSheetName(true);
                          }}
                        >
                          <img src={pencil} alt="well" />
                        </Button>
                        // <></>
                      }
                      open={BottomSheetName}
                      onTrigger={() => setBottomSheetName(true)}
                      onClose={() => setBottomSheetName(false)}
                      // maxHeight="45vh"
                      addNewSheet
                    >
                      <Grid
                        container
                        style={{ overflow: 'hidden', marginTop: '15px' }}
                      >
                        <Grid
                          item
                          xs={12}
                          lg={12}
                          md={12}
                          sm={12}
                          style={{
                            marginBottom: '2rem',
                            marginLeft: '1rem',
                            marginRight: '1rem',
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Stack spacing={1}>
                              <Grid
                                item
                                xs={12}
                                lg={12}
                                md={12}
                                className={classes.alignContent}
                              >
                                <Stack
                                  direction="row"
                                  style={{
                                    alignItems: 'flexStart',
                                    justifyContent: 'space-between',
                                    marginBottom: '-13px',
                                  }}
                                >
                                  <Typography className={classes.heading}>
                                    {' '}
                                    YOUR NAME
                                  </Typography>
                                  <CloseIcon
                                    onClick={() => setBottomSheetName(false)}
                                  />
                                </Stack>
                              </Grid>
                              <Grid style={{ textAlign: 'center' }}>
                                <Grid
                                  className={classes.p_bottom}
                                  style={{ color: '#283049' }}
                                >
                                  <Input
                                    label="Enter Your Name"
                                    variant="standard"
                                    // value={" "}
                                    style={{
                                      backgroundColor:
                                        'rgba(237, 237, 237, 0.15)',
                                      border:
                                        '0.7px solid rgba(153, 158, 165, 0.39)',
                                    }}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    fullWidth
                                    // onChange={(e) => {
                                    //   setTemplateName(e.target.value);
                                    // }}
                                    theme="light"
                                    value={userName}
                                    onChange={onInputChange(setUserName)}
                                  />
                                </Grid>
                                <Button
                                  style={{
                                    marginTop: '10px',
                                    border: '2px solid #F08B32',
                                    boxSizing: 'border-box',
                                    borderRadius: ' 45px',
                                    backgroundColor: '#F08B32',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    textTransform: 'capitalize',
                                    paddingInline: '2rem',
                                    color: 'white',
                                  }}
                                  onClick={CurrentUserPatch}
                                >
                                  {' '}
                                  Save Your Name
                                </Button>
                              </Grid>
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </SelectBottomSheet>
                  </Item>
                  {/* </Grid> */}
                </Stack>
              </Grid>

              <Grid item xs={12} lg={12} md={12} className={classes.alignContent}>
                <Item
                  className={
                    device === 'desktop' ? classes.desktopName : classes.space
                  }
                >
                  <Grid>
                    <Grid>Phone Number</Grid>
                    <Grid style={{ color: '#283049' }}>
                      {currentUserInfo?.mobileNumber}
                    </Grid>
                  </Grid>
                  <SelectBottomSheet
                    name="moreAction"
                    triggerComponent={
                      // <Button
                      //   style={{
                      //     minWidth: '0px',
                      //     padding: '0px',
                      //     alignSelf: 'flex-start',
                      //   }}
                      //   onClick={() => {
                      //     setBottomSheetNumber(true);
                      //   }}
                      // >
                      //   {' '}
                      //   <img src={pencil} alt="well" />
                      // </Button>
                      <></>
                    }
                    open={BottomSheetNumber}
                    onTrigger={() => setBottomSheetNumber(true)}
                    onClose={() => setBottomSheetNumber(false)}
                    maxHeight="45vh"
                  >
                    <Grid container style={{ overflow: 'hidden' }}>
                      <Grid
                        item
                        xs={12}
                        lg={12}
                        md={12}
                        sm={12}
                        style={{
                          marginBottom: '2rem',
                          marginLeft: '1rem',
                          marginRight: '1rem',
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Stack spacing={1}>
                            <Grid
                              item
                              xs={12}
                              lg={12}
                              md={12}
                              className={classes.alignContent}
                            >
                              <Stack
                                direction="row"
                                style={{
                                  alignItems: 'flexStart',
                                  justifyContent: 'space-between',
                                  marginBottom: '-13px',
                                }}
                              >
                                <Typography className={classes.heading}>
                                  {' '}
                                  YOUR PHONE NUMBER
                                </Typography>
                                <CloseIcon
                                  onClick={() => setBottomSheetNumber(false)}
                                />
                              </Stack>
                            </Grid>
                            <Grid style={{ textAlign: 'center' }}>
                              <Grid
                                className={classes.p_bottom}
                                style={{ color: '#283049' }}
                              >
                                <Input
                                  label="Enter Number"
                                  variant="standard"
                                  // value={templateName}
                                  style={{
                                    backgroundColor: 'rgba(237, 237, 237, 0.15)',
                                    border:
                                      '0.7px solid rgba(153, 158, 165, 0.39)',
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  fullWidth
                                  // onChange={(e) => {
                                  //   setTemplateName(e.target.value);
                                  // }}
                                  theme="light"
                                />
                              </Grid>
                              <Button
                                style={{
                                  marginTop: '10px',
                                  border: '2px solid #F08B32',
                                  boxSizing: 'border-box',
                                  borderRadius: ' 45px',
                                  backgroundColor: '#F08B32',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  textTransform: 'capitalize',
                                  paddingInline: '2rem',
                                  color: 'white',
                                }}
                                onClick={() => {
                                  setBottomSheetNumber(true);
                                }}
                              >
                                {' '}
                                Save this Number
                              </Button>
                            </Grid>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </SelectBottomSheet>
                </Item>
              </Grid>
              <Grid item xs={12} lg={12} md={12} className={classes.alignContent}>
                <Item className={classes.space}>
                  <Grid>
                    <Grid className={classes.p_bottom}>Email Id</Grid>
                    <Grid className={classes.p_bottom}>
                      {currentUserInfo?.email}
                    </Grid>
                  </Grid>
                  <SelectBottomSheet
                    name="moreAction"
                    triggerComponent={
                      // <Button
                      //   style={{
                      //     minWidth: '0px',
                      //     padding: '0px',
                      //     alignSelf: 'flex-start',
                      //   }}
                      //   onClick={() => {
                      //     setBottomSheetMail(true);
                      //   }}
                      // >
                      //   <img src={pencil} alt="well" />
                      // </Button>
                      <></>
                    }
                    open={BottomSheetMail}
                    onTrigger={() => setBottomSheetMail(true)}
                    onClose={() => setBottomSheetMail(false)}
                    maxHeight="45vh"
                  >
                    <Grid container style={{ overflow: 'hidden' }}>
                      <Grid
                        item
                        xs={12}
                        lg={12}
                        md={12}
                        sm={12}
                        style={{
                          marginBottom: '2rem',
                          marginLeft: '1rem',
                          marginRight: '1rem',
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Stack spacing={1}>
                            <Grid
                              item
                              xs={12}
                              lg={12}
                              md={12}
                              className={classes.alignContent}
                            >
                              <Stack
                                direction="row"
                                style={{
                                  alignItems: 'flexStart',
                                  justifyContent: 'space-between',
                                  marginBottom: '-13px',
                                }}
                              >
                                <Typography className={classes.heading}>
                                  {' '}
                                  YOUR EMAIL ID
                                </Typography>
                                <CloseIcon
                                  onClick={() => setBottomSheetMail(false)}
                                />
                              </Stack>
                            </Grid>
                            <Grid style={{ textAlign: 'center' }}>
                              <Grid
                                className={classes.p_bottom}
                                style={{ color: '#283049' }}
                              >
                                <Input
                                  label="Enter Email ID"
                                  variant="standard"
                                  // value={templateName}
                                  style={{
                                    backgroundColor: 'rgba(237, 237, 237, 0.15)',
                                    border:
                                      '0.7px solid rgba(153, 158, 165, 0.39)',
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  fullWidth
                                  // onChange={(e) => {
                                  //   setTemplateName(e.target.value);
                                  // }}
                                  theme="light"
                                />
                              </Grid>
                              <Button
                                style={{
                                  marginTop: '10px',
                                  border: '2px solid #F08B32',
                                  boxSizing: 'border-box',
                                  borderRadius: ' 45px',
                                  backgroundColor: '#F08B32',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  textTransform: 'capitalize',
                                  paddingInline: '2rem',
                                  color: 'white',
                                }}
                                onClick={() => {
                                  setBottomSheetMail(true);
                                }}
                              >
                                {' '}
                                Save Email ID
                              </Button>
                            </Grid>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </SelectBottomSheet>
                </Item>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                md={12}
                className={classes.alignContent}
                style={{ overflow: 'hidden' }}
              >
                <Item className={classes.space}>
                  <Grid>
                    <Grid className={classes.p_bottom}>Role</Grid>
                    <Grid
                      style={{
                        display: 'flex',
                        paddingTop: '9px',
                        paddingBottom: '9px',
                      }}
                    >
                      {/* {role.map((data) => ( */}
                      <Grid
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(153, 158, 165, 0.39)',
                          boxSizing: 'border-box',
                          borderRadius: '5px',
                          // marginRight: '4%',
                          paddingInline: '0.4rem',
                        }}
                      >
                        {currentUserInfo?.role}
                      </Grid>
                      {/* ))} */}
                    </Grid>
                  </Grid>
                  <SelectBottomSheet
                    name="moreAction"
                    triggerComponent={
                      // <Button
                      //   style={{
                      //     minWidth: '0px',
                      //     padding: '0px',
                      //     alignSelf: 'flex-start',
                      //   }}
                      //   onClick={() => {
                      //     setBottomSheetRole(true);
                      //   }}
                      // >
                      //   {' '}
                      //   <img src={questionMark} alt="well" />
                      // </Button>
                      <></>
                    }
                    open={BottomSheetRole}
                    onTrigger={() => setBottomSheetRole(true)}
                    onClose={() => setBottomSheetRole(false)}
                    maxHeight="45vh"
                  >
                    <Grid container style={{ overflow: 'hidden' }}>
                      <Grid
                        item
                        xs={12}
                        lg={12}
                        md={12}
                        sm={12}
                        style={{
                          marginBottom: '2rem',
                          marginLeft: '1rem',
                          marginRight: '1rem',
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Stack spacing={1}>
                            <Grid
                              item
                              xs={12}
                              lg={12}
                              md={12}
                              className={classes.alignContent}
                            >
                              <Stack
                                direction="row"
                                style={{
                                  alignItems: 'flexStart',
                                  justifyContent: 'space-between',
                                  marginBottom: '-13px',
                                }}
                              >
                                <Typography className={classes.heading}>
                                  {' '}
                                  YOUR ROLE
                                </Typography>
                                <CloseIcon
                                  onClick={() => setBottomSheetRole(false)}
                                />
                              </Stack>
                            </Grid>
                            <Grid style={{ textAlign: 'center' }}>
                              <Item
                                className={classes.space}
                                style={{
                                  backgroundColor: 'rgba(237, 237, 237, 0.15)',
                                  border: '0.7px solid rgba(153, 158, 165, 0.39)',
                                  boxSizing: 'border-box',
                                  borderRadius: '8px',
                                  minHeight: 'max-content',
                                }}
                              >
                                <Stack
                                  style={{ margin: '1rem', textAlign: 'justify' }}
                                >
                                  <Typography
                                    style={{
                                      fontWeight: ' 600',
                                      fontSize: ' 12px',
                                      lineHeight: ' 15px',
                                      display: ' flex',
                                      alignItems: ' center',
                                      paddingBottom: '1rem',
                                      color: ' #283049',
                                    }}
                                  >
                                    Your role has been assigned by your
                                    Administrator.
                                  </Typography>
                                  <Typography
                                    style={{
                                      fontWeight: ' 300',
                                      fontSize: ' 12px',
                                      lineHeight: ' 15px',
                                      display: ' flex',
                                      alignItems: ' center',

                                      color: ' #283049',
                                    }}
                                  >
                                    If you wish to change it or if you notice an
                                    error in it’s assignment, Pleace Contact your
                                    Administrator.
                                  </Typography>
                                </Stack>
                              </Item>
                            </Grid>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </SelectBottomSheet>
                </Item>
              </Grid>
              <Grid item xs={12} lg={12} md={12} className={classes.alignContent}>
                {/* <Item className={classes.space}> */}
                {/* <Grid>
                  <Grid className={classes.p_bottom}>Language</Grid>
                  <Grid
                    style={{
                      display: 'flex',
                      paddingTop: '9px',
                      paddingBottom: '9px',
                    }}
                  >
                    {lang.map((data) => (
                      <Grid
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(153, 158, 165, 0.39)',
                          boxSizing: 'border-box',
                          borderRadius: '5px',
                          marginRight: '4%',
                          paddingInline: '0.4rem',
                        }}
                      >
                        {data}
                      </Grid>
                    ))}
                  </Grid>
                </Grid> */}
                {/* <Grid>
                  <SelectBottomSheet
                    name="moreAction"
                    triggerComponent={
                      // <Button
                      //   style={{
                      //     minWidth: '0px',
                      //     padding: '0px',
                      //     alignSelf: 'flex-start',
                      //   }}
                      //   onClick={() => {
                      //     setBottomSheetLang(true);
                      //   }}
                      // >
                      //   <img src={pencil} alt="well" />
                      // </Button>
                      <></>
                    }
                    open={BottomSheetLang}
                    onTrigger={() => setBottomSheetLang(true)}
                    onClose={() => setBottomSheetLang(false)}
                    maxHeight="45vh"
                  >
                    <Grid container style={{ overflow: 'hidden' }}>
                      <Grid
                        item
                        xs={12}
                        lg={12}
                        md={12}
                        sm={12}
                        style={{
                          marginBottom: '2rem',
                          marginLeft: '1rem',
                          marginRight: '1rem',
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Stack spacing={1}>
                            <Grid
                              item
                              xs={12}
                              lg={12}
                              md={12}
                              style={{ marginLeft: '0.5rem' }}
                            >
                              <Stack
                                direction="row"
                                style={{
                                  alignItems: 'flexStart',
                                  justifyContent: 'space-between',
                                  marginBottom: '-13px',
                                }}
                              >
                                <Typography className={classes.heading}>
                                  {' '}
                                  SELECT YOUR LANGUAGE{' '}
                                </Typography>
                                <CloseIcon
                                  onClick={() => setBottomSheetLang(false)}
                                />
                              </Stack>
                            </Grid>
                            {lang.map((val) => (
                              <Grid>
                                <Grid
                                  className={classes.p_bottom}
                                  style={{
                                    color: '#283049',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                >
                                  <WhiteBackgroundCheckbox />
                                  <Grid
                                    style={{
                                      marginLeft: '1rem',
                                      fontSize: '13px',
                                    }}
                                  >
                                    {val}
                                  </Grid>
                                </Grid>
                                <Divider
                                  variant="fullWidth"
                                  style={{ height: '0.1px' }}
                                />
                              </Grid>
                            ))}
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </SelectBottomSheet>
                </Grid> */}
                {/* </Item> */}
              </Grid>
              {device === 'desktop' ? (
                <Stack>
                  {/* <Typography component="div" className={classes.h1}>
                  {' '}
                  Auto Back-up
                </Typography>
                <Stack
                  direction="row"
                  style={{ justifyContent: 'space-between', marginTop: '1rem' }}
                >
                  <Stack style={{ width: '29vw' }} spacing={1}>
                    <Typography className={classes.h2}>
                      Your data is automatically backed up whenever your phone
                      is connected to the internet
                    </Typography>
                    <Typography className={classes.h3}>
                      Last Back-Up on: Thursday, 10th February, 2022 at 01:31 AM
                    </Typography>
                  </Stack>
                  <Stack>
                    <ToggleSwitch />
                  </Stack>
                </Stack> */}

                  {/* <Stack
                  direction="row"
                  style={{ justifyContent: 'space-between', marginTop: '1rem' }}
                >
                  <Typography className={classes.h1}>Agrya Account</Typography>
                  <Button
                    className={classes.logoutBtn}
                    variant="outlined"
                    onClick={logout}
                  >
                    <Typography className={classes.logoutBtnTxt}>
                      Logout
                    </Typography>
                  </Button>
                </Stack> */}
                </Stack>
              ) : (
                <>
                  {/* <Grid
                  item
                  xs={12}
                  lg={12}
                  md={12}
                  className={classes.alignContent}
                >
                  <Item className={classes.space}>
                    <Grid style={{ width: '100%' }}>
                      <Grid className={classes.p_bottom}>App lock</Grid>
                      <Stack
                        direction="row"
                        width="100%"
                        spacing={2}
                        justifyContent="space-between"
                        style={{ paddingBottom: '7%' }}
                      >
                        <Grid>
                          <img src={secure} alt="well" />
                        </Grid>
                        <Grid
                          className={classes.p_bottom}
                          style={{ textAlign: 'justify', color: '#283049' }}
                        >
                          Secure your account by using your phone’s password,
                          pattern, or fingerprint
                        </Grid>
                        <ToggleSwitch
                          style={{
                            '&. Component-root-59 .MuiSwitch-track': {
                              backgroundColor: 'red',
                            },
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Item>
                </Grid> */}
                  {/* <Grid
                  item
                  xs={12}
                  lg={12}
                  md={12}
                  className={classes.alignContent}
                >
                  <Item className={classes.space}>
                    <Grid style={{ width: '100%' }}>
                      <Grid className={classes.p_bottom}>App Backup</Grid>
                      <Stack
                        direction="row"
                        width="100%"
                        spacing={2}
                        justifyContent="space-between"
                        style={{ paddingBottom: '3%' }}
                      >
                        <Grid>
                          <img src={upload} alt="well" />
                        </Grid>
                        <Grid
                          className={classes.p_bottom}
                          style={{ textAlign: 'justify', color: '#283049' }}
                        >
                          Your data is automatically backed up whenever your
                          phone is connected to the internet
                        </Grid>
                        <ToggleSwitch />
                      </Stack>
                      <Grid
                        style={{
                          fontWeight: ' 300',
                          fontSize: ' 10px',
                          lineHeight: ' 12px',
                          color: ' rgba(40, 48, 73, 0.62)',
                        }}
                      >
                        Last Back-Up on: Thursday, 10th February, 2022 at 01:31
                        AM
                      </Grid>
                    </Grid>
                  </Item>
                </Grid> */}
                  <Stack direction="row" justifyContent='space-between' alignItems='center'>
                    <Button
                      style={{
                        marginTop: '36px',
                        border: '2px solid #F08B32',
                        boxSizing: 'border-box',
                        alignSelf: 'center',
                        borderRadius: ' 45px',
                        color: '#F08B32',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        textTransform: 'capitalize',
                        paddingInline: '1.5rem',
                      }}
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      {' '}
                      Log Out
                    </Button>
                    <Button
                      style={{
                        marginTop: '36px',
                        border: '2px solid #F08B32',
                        boxSizing: 'border-box',
                        alignSelf: 'center',
                        borderRadius: ' 45px',
                        color: '#F08B32',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        textTransform: 'capitalize',
                        paddingInline: '1.5rem',
                      }}
                      onClick={() => {
                        setDeleteOpenDialog(true);
                      }}
                    >
                      {' '}
                      Delete Account
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          </Box>
          <Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                sx: {
                  backgroundColor: '#FFFFFF',
                  boxShadow:
                    '0px 16px 32px rgba(44, 39, 56, 0.04), 0px 32px 64px rgba(44, 39, 56, 0.08)',
                  borderRadius: '16px',
                },
              }}
            >
              <Stack direction="column" style={{ margin: 'inherit' }}>
                <Grid
                  style={{
                    fontWeight: ' 600',
                    fontSize: ' 18px',
                    lineHeight: ' 26px',
                    color: ' #283049',
                  }}
                >
                  Log Out
                </Grid>
                <Grid
                  style={{
                    paddingTop: '0.5rem',
                    fontWeight: ' 300',
                    fontSize: ' 14px',
                    lineHeight: ' 19px',

                    color: ' #6E6E6E',
                  }}
                >
                  Are You Sure You Want To Log Out
                </Grid>
                <Grid
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    style={{
                      marginTop: '36px',
                      boxSizing: 'border-box',
                      alignSelf: 'center',
                      borderRadius: ' 45px',
                      color: 'Black',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      textTransform: 'capitalize',
                      paddingInline: '1.5rem',
                    }}
                    onClick={handleClose}
                  >
                    No
                  </Button>

                  <Button
                    style={{
                      marginTop: '36px',
                      fontSize: '14px',
                      border: '1px solid #F08B32',
                      boxSizing: 'border-box',
                      alignSelf: 'center',
                      borderRadius: ' 45px',
                      color: '#F08B32',
                      textTransform: 'capitalize',
                      paddingInline: '3.5rem',
                    }}
                    onClick={() => logout('logout')}
                  >
                    Yes
                  </Button>
                </Grid>
              </Stack>
            </Dialog>
            <Dialog
              open={deleteOpenDialog}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                sx: {
                  backgroundColor: '#FFFFFF',
                  boxShadow:
                    '0px 16px 32px rgba(44, 39, 56, 0.04), 0px 32px 64px rgba(44, 39, 56, 0.08)',
                  borderRadius: '16px',
                },
              }}
            >
              <Stack direction="column" style={{ margin: 'inherit' }}>
                <Grid
                  style={{
                    fontWeight: ' 600',
                    fontSize: ' 18px',
                    lineHeight: ' 26px',
                    color: ' #283049',
                  }}
                >
                  Delete Account
                </Grid>
                <Grid
                  style={{
                    paddingTop: '0.5rem',
                    fontWeight: ' 300',
                    fontSize: ' 14px',
                    lineHeight: ' 19px',

                    color: ' #6E6E6E',
                  }}
                >
                  Are You Sure You Want To Delete this Account?
                </Grid>
                <Grid
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    style={{
                      marginTop: '36px',
                      boxSizing: 'border-box',
                      alignSelf: 'center',
                      borderRadius: ' 45px',
                      color: 'Black',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      textTransform: 'capitalize',
                      paddingInline: '1.5rem',
                    }}
                    onClick={handleCloseDeleteDialog}
                  >
                    No
                  </Button>

                  <Button
                    style={{
                      marginTop: '36px',
                      fontSize: '14px',
                      border: '1px solid #F08B32',
                      boxSizing: 'border-box',
                      alignSelf: 'center',
                      borderRadius: ' 45px',
                      color: '#F08B32',
                      textTransform: 'capitalize',
                      paddingInline: '3.5rem',
                    }}
                    onClick={() => logout('delete')}
                  >
                    Yes
                  </Button>
                </Grid>
              </Stack>
            </Dialog>
          </Grid>
        </Grid>
      </Grid>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
}

export default AccountSettings;
