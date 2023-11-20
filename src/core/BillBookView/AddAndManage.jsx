import React from 'react';
import * as Mui from '@mui/material';
import JSBridge from '@nativeBridge/jsbridge';
import moment from 'moment';
import SearchIcon from '@material-ui/icons/Search';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import { DataGrid } from '@mui/x-data-grid';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import Input from '@components/Input/Input.jsx';
import { styled } from '@material-ui/core';
import { useGoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import refresh from '@assets/refresh.svg';
import UnprocessedAddManage from '@assets/UnprocessedAddManage.svg';
import statusActive from '@assets/statusActive.svg';
import statusInActive from '@assets/statusInActive.svg';
import danger from '@assets/danger.svg';
// import addAccControl from '@assets/addAccControl.svg';
import sign_in_with_google from '@assets/sign_in_with_google.svg';
import * as Router from 'react-router-dom';
import * as css from './AddAndManage.scss';
// import { AddandManageActive } from '../../components/SvgIcons/SvgIcons';

const AddAndManage = () => {
  const { organization, user, enableLoading, userPermissions } =
    React.useContext(AppContext);
  const navigate = Router.useNavigate();
  // dummy
  const Puller = styled(Mui.Box)(() => ({
    width: '50px',
    height: 6,
    backgroundColor: '#C4C4C4',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
  }));
  const TextfieldStyle = (props) => {
    return (
      <Input
        {...props}
        variant="standard"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        theme="light"
        className={css.textfieldMain}
      />
    );
  };

  const device = localStorage.getItem('device_detect');
  const [syncEmails, setSyncEmail] = React.useState('');
  const [addDrawer, setAddDrawer] = React.useState(false);
  // const [emailList, setEmailList] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [filteredUser, setFilteredUser] = React.useState([]);

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (Object.keys(userRoles?.['Connect via Gmail'] || {})?.length > 0) {
      if (!userRoles?.['Connect via Gmail']?.view_email_users) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/bill');
            setHavePermission({ open: false });
          },
        });
      }
    }
  }, [userRoles?.['Connect via Gmail']]);

  const syncEmail = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/email_users`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          const activeField = [];
          const inactiveField = [];
          res.data.forEach((ele) => {
            if (ele.status === 'active') {
              activeField.push(ele);
            } else {
              inactiveField.push(ele);
            }
          });
          setSyncEmail([...activeField, ...inactiveField]);
          // setEmailList([...activeField, ...inactiveField]);
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const syncNow = (id) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/email_users/${id}`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      console.log(res);
      enableLoading(false);
    });
  };

  const deactivate = (ele, val) => {
    if (!ele.target.checked) {
      if (!userRoles?.['Connect via Gmail']?.delete_email_users) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
      enableLoading(true);
      RestApi(`organizations/${organization.orgId}/email_users/${val.id}`, {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }).then(() => {
        syncEmail();
        enableLoading(false);
      });
    }
  };

  const handleRowSelection = (val) => {
    if (!userRoles?.['Connect via Gmail']?.view_email_users) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    navigate('/bill-Add-And-Manage-EmailList', {
      state: {
        datas: val,
      },
    });
  };

  React.useEffect(() => {
    syncEmail();
  }, []);

  React.useEffect(() => {
    if (search?.length > 0) {
      const temp = syncEmails?.filter((val) =>
        val?.name
          ?.toLocaleLowerCase()
          .includes(search?.toLocaleLowerCase() || ''),
      );
      setFilteredUser(temp);
    } else {
      setFilteredUser(syncEmails);
    }
  }, [search, syncEmails]);

  const columns = [
    {
      field: 'name',
      headerName: 'NAME',
      flex: 2,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>NAME</Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <div
            className={`${css.cosDiv} ${
              cellValues.row.status !== 'active' ? `${css.cosDivDisable}` : ''
            }`}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            <Mui.Typography className={css.cosName}>
              {cellValues?.value?.toLowerCase()}
            </Mui.Typography>
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email Address ',
      flex: 2,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Email Address
          </Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <Mui.Typography
            className={css.content}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            {cellValues?.value?.toLowerCase()}
          </Mui.Typography>
        );
      },
    },
    {
      field: 'last_synced_at',
      headerName: 'Email Last Synced',
      flex: 2,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Email Last Synced
          </Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <Mui.Typography
            className={css.content}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            {cellValues.value
              ? moment(cellValues.value).format('MMMM Do YYYY, h:mm:ss a')
              : ''}
          </Mui.Typography>
        );
      },
    },

    {
      field: 'sync_processing',
      headerName: 'Sync Processing',
      flex: 1,

      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Sync Processing
          </Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <div
            className={css.cosDivmoneyIR}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            <Mui.Grid className={css.syncProcessing}>
              <Mui.Grid>
                {/* <AddandManageActive /> */}
                {(cellValues?.row?.status === 'unprocessed' && (
                  <img
                    src={UnprocessedAddManage}
                    className={css.unprocessed}
                    alt="status"
                  />
                )) || (
                  <img
                    src={
                      (cellValues?.row?.status === 'active' && statusActive) ||
                      (cellValues?.row?.status === 'inactive' &&
                        statusInActive) ||
                      (cellValues?.row?.status === 'access_revoked' && danger)
                    }
                    width="12px"
                    alt="status"
                  />
                )}
              </Mui.Grid>
              <Mui.Typography
                // className={css.headingStackText}
                className={
                  (cellValues?.row?.status === 'active' &&
                    css.mobileStatusActive) ||
                  (cellValues?.row?.status === 'inactive' &&
                    css.mobileStatusInActive) ||
                  (cellValues?.row?.status === 'unprocessed' &&
                    css.mobileStatusUnprocessed) ||
                  (cellValues?.row?.status === 'access_revoked' &&
                    css.mobileStatusAccessRevoked)
                }
              >
                {`${cellValues?.row?.status}`}
              </Mui.Typography>
            </Mui.Grid>
          </div>
        );
      },
    },
    {
      field: '',
      headerName: 'Sync',
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>Sync</Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <Mui.Button
            className={css.syncNowButton}
            onClick={() => syncNow(cellValues.id)}
          >
            Sync Now
          </Mui.Button>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      flex: 1,
      renderCell: (val) => {
        return (
          <ToggleSwitch
            checked={val.value === 'active'}
            onChange={(e) => {
              deactivate(e, val);
            }}
          />
        );
      },
    },
  ];

  const connectGmailListenerForWeb = (e) => {
    const hasAccess = hasGrantedAllScopesGoogle(
      e,
      'https://www.googleapis.com/auth/gmail.readonly',
    );
    console.log('hasAccess', hasAccess);
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/email_users`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        code: e.code,
        provider: 'google',
        redirect_uri: window.location.origin,
      },
    })
      .then((res) => {
        setAnchorEl(null);
        syncEmail();
        enableLoading(false);
        console.log(res, 'successful');
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => connectGmailListenerForWeb(tokenResponse),
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    flow: 'auth-code',
    auto_select: true,
  });

  const GoogleLog = () => {
    if (!userRoles?.['Connect via Gmail']?.create_email_users) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (device === 'mobile') JSBridge.launchGoogleForGmailConnect();
    else googleLogin();
  };

  return device === 'mobile' ? (
    <Mui.Stack className={css.addmanagemobile}>
      <Mui.Grid>
        <Mui.Grid className={css.titleTopContainer}>
          <Mui.Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Mui.Stack className={css.addmanagemobile1}>
              <Mui.Typography className={css.title}>
                Add and Manage
              </Mui.Typography>
              <Mui.Divider className={css.dot} />
            </Mui.Stack>
            {/* <Mui.Button
              onClick={() => GoogleLog()}
              className={css.mobileConnectButton}
            >
              Connect Account
            </Mui.Button> */}
            <Mui.Box
              component={Mui.Button}
              onClick={() => GoogleLog()}
              padding="0"
            >
              <img src={sign_in_with_google} alt="sign_in_with_google" />
            </Mui.Box>
          </Mui.Stack>
          <div className={css.searchFilterMobile}>
            <SearchIcon className={css.searchFilterIcon} />{' '}
            <input
              placeholder="Search for..."
              className={css.searchFilterInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Mui.Grid>
        {filteredUser?.length === 0 && (
          <p style={{ textAlign: 'center' }}>No Data Found</p>
        )}
        {filteredUser?.length > 0 &&
          filteredUser?.map((ele) => (
            <Mui.Stack
              direction="row"
              className={
                ele.status === 'inactive'
                  ? css.transactionCardInActive
                  : css.transactionCard
              }
            >
              <Mui.Grid
                className={css.mobileBottomGrid}
                onClick={() => {
                  if (ele.status === 'active') {
                    handleRowSelection(ele);
                  }
                }}
              >
                <Mui.Stack direction="row" className={css.mobileStackContent}>
                  <Mui.Grid className={css.mobileName}>{ele.name}</Mui.Grid>
                  <Mui.Grid className={css.mobileTopGrid}>
                    <Mui.Grid className={css.mobileStatus}>Status</Mui.Grid>
                    <Mui.Stack direction="row" className={css.MobileStatus}>
                      <Mui.Grid>
                        {(ele.status === 'unprocessed' && (
                          <img
                            src={UnprocessedAddManage}
                            className={css.unprocessed}
                            alt="status"
                          />
                        )) || (
                          <img
                            src={
                              (ele.status === 'active' && statusActive) ||
                              (ele.status === 'inactive' && statusInActive) ||
                              (ele.status === 'access_revoked' && danger)
                            }
                            width="12px"
                            alt="status"
                          />
                        )}
                      </Mui.Grid>
                      <Mui.Grid
                        className={
                          (ele?.status === 'active' &&
                            css.mobileStatusActive) ||
                          (ele?.status === 'inactive' &&
                            css.mobileStatusInActive) ||
                          (ele?.status === 'unprocessed' &&
                            css.mobileStatusUnprocessed) ||
                          (ele?.status === 'access_revoked' &&
                            css.mobileStatusAccessRevoked)
                        }
                      >
                        {ele?.status}
                      </Mui.Grid>
                    </Mui.Stack>
                  </Mui.Grid>
                  <Mui.Grid
                    // onClick={() => syncNow(state.datas.id)}
                    className={css.mobilerefreshIconWidth}
                  >
                    <img
                      src={refresh}
                      className={css.mobilerefreshIcon}
                      alt="refresh"
                    />
                  </Mui.Grid>
                </Mui.Stack>
                <Mui.Stack direction="row" className={css.mobileStackContent}>
                  <Mui.Stack className={css.mobileName}>
                    <Mui.Grid className={css.mobileEmailTitle}>Email</Mui.Grid>
                    <Mui.Grid className={css.mobileEmailId}>
                      {ele.email}
                    </Mui.Grid>
                  </Mui.Stack>
                  <Mui.Stack className={css.mobileTopGrid}>
                    <Mui.Grid className={css.mobileLastSync}>
                      Last Sync On
                    </Mui.Grid>
                    <Mui.Grid className={css.mobileLastSyncDate}>
                      {ele.last_synced_at === null
                        ? '-'
                        : moment(ele.last_synced_at).format(
                            'MMMM Do YYYY, h:mm:ss a',
                          )}
                    </Mui.Grid>
                  </Mui.Stack>
                  <Mui.Grid className={css.mobilerefreshIconWidth}>
                    <ToggleSwitch
                      className={css.mobilerefreshIcon}
                      checked={ele.status === 'active'}
                      onChange={(e) => {
                        deactivate(e, ele);
                      }}
                      disabled={ele.status !== 'active'}
                    />
                  </Mui.Grid>
                </Mui.Stack>
              </Mui.Grid>
            </Mui.Stack>
          ))}
      </Mui.Grid>
      <SelectBottomSheet
        open={addDrawer}
        addNewSheet
        onClose={() => {
          setAddDrawer(false);
        }}
        triggerComponent={<span style={{ display: 'none' }} />}
      >
        <Puller />
        <Mui.Stack className={css.addStack}>
          <Mui.Typography className={css.heading}>
            Add a Provider’s Email ID
          </Mui.Typography>
          <TextfieldStyle label="Email ID*" />
          <TextfieldStyle label="Nickname" />
          <Mui.Stack className={css.btnStack}>Add Now</Mui.Stack>
        </Mui.Stack>
      </SelectBottomSheet>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </Mui.Stack>
  ) : (
    // web

    <>
      {' '}
      {syncEmails?.length > 0 !== null ? (
        <>
          <div style={{ padding: '0px  0px 0px 0px', width: '100%' }}>
            {/* {click === 'tab1' ? ( */}
            <Mui.Stack direction="column" className={css.stackAdd}>
              <Mui.Typography className={css.addTitle}>
                Your Accounts
              </Mui.Typography>
              <Mui.Stack
                direction="row"
                justifyContent="space-between"
                className={css.searchAccControl}
              >
                <div
                  className={css.searchFilter}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0px 0px 40px rgba(48, 73, 191, 0.05)',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    height: '34px',
                    width: '28%',
                    paddingLeft: '1.5%',
                  }}
                >
                  <SearchIcon
                    style={{ color: '#af9d9d' }}
                    className={css.searchFilterIcon}
                  />{' '}
                  <input
                    placeholder="Search for..."
                    className={css.searchFilterInput}
                    style={{
                      border: 'none',
                      overflow: 'auto',
                      fontSize: '14px',
                      fontWeight: '500',
                      width: '100%',
                      marginLeft: '4px',
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Mui.Stack
                  direction="row"
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                  }}
                  className={css.webAccountControl}
                >
                  <Mui.Grid className={css.webAccControlFont}>
                    Account Control
                  </Mui.Grid>
                  <Mui.Grid className={css.webDownArrow}>
                    <KeyboardArrowDownIcon
                      className={
                        anchorEl === null ? css.webArrowDown : css.webArrowUp
                      }
                    />
                  </Mui.Grid>
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
            <Mui.Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                elevation: 3,
                style: {
                  maxHeight: '405px',
                  width: '203px',
                  padding: '5px',
                },
              }}
            >
              <Mui.Grid className={css.webAddRemovContainer}>
                <Mui.Stack
                  direction="column"
                  alignItems="center"
                  gap="8px"
                  className={css.webAddRemove}
                >
                  {/* <Mui.Grid
                    className={css.connectRemoveAcc}
                    onClick={() => GoogleLog()}
                  >
                    Connect an Account
                  </Mui.Grid>
                  <Mui.Grid>
                    <img src={addAccControl} alt="accControl" />
                  </Mui.Grid> */}
                  <>
                    <Mui.Box
                      component={Mui.Button}
                      onClick={() => GoogleLog()}
                      width="100%"
                      padding="0"
                    >
                      <img
                        src={sign_in_with_google}
                        className={css.google_sign_in}
                        alt="sign_in_with_google"
                      />
                    </Mui.Box>
                    <Mui.Typography className={css.google_description}>
                      Connect your GMail Account to Auto-Account Transactions
                    </Mui.Typography>
                  </>
                </Mui.Stack>
                {/* <Mui.Divider fullWidth className={css.webDividerAccControl} /> */}
              </Mui.Grid>
            </Mui.Menu>
            <Mui.Stack spacing={2} className={css.ptContainer}>
              <Mui.Box className={css.datagridBox}>
                <DataGrid
                  rows={filteredUser}
                  columns={columns}
                  rowsPerPageOptions={[]}
                  getRowClassName={(params) => `${params.row.status}`}
                  autoHeight
                  components={{
                    NoRowsOverlay: () => (
                      <Mui.Stack
                        height="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        No Data Found
                      </Mui.Stack>
                    ),
                  }}
                  sx={{
                    '.MuiDataGrid-columnSeparator': {
                      display: 'none',
                    },
                    '.MuiDataGrid-main': {
                      borderRadius: '30px',
                    },
                    '.MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader:first-of-type, .MuiDataGrid-row .MuiDataGrid-cell:first-of-type':
                      {
                        paddingLeft: '35px',
                      },
                    '&.MuiDataGrid-root': {
                      border: 'none',
                      background: '#fff',
                      borderRadius: '30px',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontSize: '14px',
                      Font: 'Lexend',
                      Weight: 500,
                    },
                    '& .MuiDataGrid-footerContainer': {
                      display: 'none',
                    },
                    '& .MuiDataGrid-columnHeader:focus,.MuiDataGrid-cell:focus,.MuiDataGrid-columnHeader:focus-within,,.MuiDataGrid-cell:focus-within':
                      {
                        outline: 'none',
                      },
                    '& .MuiDataGrid-row.Mui-selected ': {
                      background: 'none',
                    },
                    '& .MuiDataGrid-row.Mui-selected:hover ': {
                      background: 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiDataGrid-columnHeader--moving': {
                      backgroundColor: 'white !important',
                    },
                    '& .unprocessed,.inactive,.access_revoked': {
                      background: 'rgba(217, 217, 217, 0.47) !important',
                      cursor: 'not-allowed !important',
                      pointerEvents: 'none !important',
                    },
                  }}
                />
              </Mui.Box>
            </Mui.Stack>
          </div>
        </>
      ) : (
        <></>
      )}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default AddAndManage;
