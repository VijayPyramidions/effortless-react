import React from 'react';
import * as Mui from '@mui/material';
import moment from 'moment';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import { DataGrid } from '@mui/x-data-grid';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import Input from '@components/Input/Input.jsx';
import { styled, makeStyles } from '@material-ui/core';
// import {  validateRequired } from '@services/Validation.jsx';
import * as themes from '@root/theme.scss';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import refresh from '@assets/refresh.svg';
import * as Router from 'react-router-dom';
import { validateName, validateEmail } from '@services/Validation.jsx';
import * as css from './AddAndManage.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));
const VALIDATION = {
  email: {
    errMsg: 'Please provide valid Email',
    test: validateEmail,
  },
  name: {
    errMsg: 'Enter valid Name',
    test: validateName,
  },
};

const AddAndManageEmailList = () => {
  const classes = useStyles();
  const { state } = Router.useLocation();
  const { organization, user, enableLoading, openSnackBar } =
    React.useContext(AppContext);

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
  const navigate = Router.useNavigate();
  const device = localStorage.getItem('device_detect');
  const [emailList, setEmailList] = React.useState([]);
  const [newProvider, setAddNewProvider] = React.useState(false);
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [emailVal, setEmailVal] = React.useState('');
  const [nameVal, setNameVal] = React.useState('');
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);

  const handleRowSelection = (val) => {
    navigate('/bill-Add-And-Manage-Statement', {
      state: {
        datas: val,
        state_id: state?.datas?.id,
        email: state?.datas?.email,
      },
    });
  };
  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const handleChange = (setter) => (e) => {
    reValidate(e);
    setter(e?.target?.value);
  };

  const fetchEmailList = () => {
    enableLoading(true);

    RestApi(
      `organizations/${organization.orgId}/email_users/${state?.datas?.id}/email_lists`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setEmailList(res.data);
        } else if (res && res.message) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
        } else if (res.error) {
          const errorMessages = Object.values(res.errors);
          openSnackBar({
            message: errorMessages.join(', '),
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch(() => {
        openSnackBar({
          message: 'Sorry! we will look into it',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      if (v === 'name') {
        a[v] = !validationData?.[v]?.test(nameVal);
      } else if (v === 'email') {
        a[v] = !validationData?.[v]?.test(emailVal);
      }
      return a;
    }, {});
  };

  const AddProvider = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      sectionValidation[k] = VALIDATION[k];
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else {
      enableLoading(true);
      setAddNewProvider(false);
      RestApi(
        `organizations/${organization.orgId}/email_users/${state?.datas?.id}/email_lists`,
        {
          method: METHOD.POST,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
          payload: { name: nameVal, email: emailVal },
        },
      )
        .then((res) => {
          setEmailVal('');
          setNameVal('');
          if (res && !res.error) {
            openSnackBar({
              message: 'Your New Provider Added Successfully',
              type: MESSAGE_TYPE.INFO,
            });
            fetchEmailList();
            // setEmailList(prev => prev.push(res.data));
          } else if (res && res.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.ERROR,
            });
            enableLoading(false);
            fetchEmailList();
          } else if (res.error) {
            const errorMessages = Object.values(res.errors);
            openSnackBar({
              message: errorMessages.join(', '),
              type: MESSAGE_TYPE.ERROR,
            });
          }
          enableLoading(false);
        })
        .catch((e) => {
          const errorMessages = Object?.values(e?.errors);
          openSnackBar({
            message: errorMessages?.join(', '),
            type: MESSAGE_TYPE.ERROR,
          });
        });
    }
  };

  const syncNow = (id) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/email_users/${id}`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then(() => {
      // console.log(res);
      enableLoading(false);
    });
  };

  const deactivate = (ele, val) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/email_users/${state.datas?.id}/email_lists/${val.id}`,
      {
        payload: { fetch: ele.target.checked },
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then(() => {
      fetchEmailList();
      enableLoading(false);
    });
  };

  React.useEffect(() => {
    fetchEmailList();
  }, [state]);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      maxWidth: 250,
      flex: 1,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>NAME</Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <div className={css.cosDiv}>
            <Mui.Typography className={css.cosName}>
              {cellValues?.value?.toLowerCase()}
            </Mui.Typography>
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email ID ',
      maxWidth: 250,
      flex: 1,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Email Address
          </Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <Mui.Typography className={css.content}>
            {cellValues?.value?.toLowerCase()}
          </Mui.Typography>
        );
      },
    },

    {
      field: 'last_bill_date',
      headerName: 'Last Bill recieved on',
      maxWidth: 250,
      flex: 1,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Last Bill recieved on
          </Mui.Typography>
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <div className={css.cosDivmoneyIR}>
            <Mui.Typography className={css.headingStackText}>
              {`${
                cellValues.value
                  ? `${moment(cellValues.value).format(
                      'MMMM Do YYYY, h:mm:ss a',
                    )}`
                  : `-`
              }`}
            </Mui.Typography>
          </div>
        );
      },
    },
    {
      field: '',
      headerName: 'View Bill History',
      maxWidth: 250,
      flex: 1,
      sortable: false,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            View Bill History
          </Mui.Typography>
        </div>
      ),
      renderCell: (val) => {
        return (
          <Mui.Button
            className={css.syncNowButton}
            onClick={() => handleRowSelection(val?.row)}
            disabled={!val.row.fetch}
          >
            View Bills
          </Mui.Button>
        );
      },
    },
    {
      field: 'fetch',
      headerName: 'Status',
      minWidth: 10,
      sortable: false,
      renderCell: (val) => {
        return (
          <ToggleSwitch
            defaultChecked={val.row.fetch}
            onChange={(e) => {
              deactivate(e, val);
            }}
          />
        );
      },
    },
  ];

  const ComDataGrid = () => {
    return (
      <DataGrid
        rows={emailList}
        columns={columns}
        rowsPerPageOptions={[]}
        autoHeight
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
        }}
      />
    );
  };

  return device === 'mobile' ? (
    <Mui.Stack className={css.addmanagemobile}>
      <Mui.Grid className={css.mobileTopTitleContainer}>
        <Mui.Stack direction="row" className={css.MobiletitleStack}>
          <Mui.Grid>
            <Mui.Grid className={css.mobileEmailId}>
              {state?.datas?.email}
            </Mui.Grid>
            <Mui.Divider className={css.divider1} variant="fullWidth" />
            <Mui.Stack direction="row" className={css.lastSyncContainer}>
              <Mui.Grid className={css.mobileEmailListLastSyncTitle}>
                Last Sync:
              </Mui.Grid>
              <Mui.Grid className={css.mobileEmailListLastSync}>
                {' '}
                {moment(state?.datas?.last_synced_at).format(
                  'MMMM Do YYYY, h:mm:ss a',
                )}{' '}
              </Mui.Grid>
            </Mui.Stack>
          </Mui.Grid>
          <Mui.Grid
            onClick={() => syncNow(state.datas.id)}
            className={css.mobilerefreshIconWidth}
          >
            <img
              src={refresh}
              className={css.mobilerefreshIcon}
              alt="refresh"
            />
          </Mui.Grid>
        </Mui.Stack>
        {emailList.length === 0 && (
          <div className={css.nodatas}>No Datas Found</div>
        )}
        {emailList.map((e) => (
          <Mui.Grid
            className={
              e.fetch === false ? css.mobileCardInActive : css.mobileCard
            }
          >
            <Mui.Stack direction="row" justifyContent="space-between">
              <Mui.Grid
                style={{ opacity: e.fetch === false ? '0.5' : '' }}
                className={css.mobileEmailListName}
              >
                {e?.name}
              </Mui.Grid>
              <Mui.Grid>
                {' '}
                <ToggleSwitch
                  defaultChecked={e.fetch}
                  onChange={(event) => {
                    deactivate(event, e);
                  }}
                />
              </Mui.Grid>
            </Mui.Stack>
            <Mui.Stack
              direction="row"
              justifyContent="space-between"
              style={{ opacity: e.fetch === false ? '0.5' : '' }}
              className={css.mobileViewBillPosition}
            >
              <Mui.Grid className={css.mobilBillContainer}>
                <Mui.Grid className={css.mobileEmailWidth}>
                  <Mui.Grid className={css.mobileEmailListEmail}>
                    Email
                  </Mui.Grid>
                  <Mui.Grid className={css.mobileEmailListEmailValue}>
                    {e?.email}
                  </Mui.Grid>
                </Mui.Grid>
                <Mui.Grid className={css.mobileEmailTop}>
                  <Mui.Grid className={css.mobileEmailListEmail}>
                    Last Bill On
                  </Mui.Grid>
                  <Mui.Grid className={css.mobileEmailListEmailValue}>
                    {e?.last_bill_date
                      ? moment(e?.last_bill_date).format('DD-MM-YYYY')
                      : '-'}{' '}
                  </Mui.Grid>
                </Mui.Grid>
              </Mui.Grid>
              <Mui.Button
                className={css.syncNowButtonMobile}
                onClick={() => handleRowSelection(e)}
              >
                View Bills
              </Mui.Button>{' '}
            </Mui.Stack>
          </Mui.Grid>
        ))}
        <Mui.Button
          onClick={() => {
            setAddNewProvider(true);
          }}
          className={css.addNewButtonMobile}
        >
          Add a New Provider
        </Mui.Button>{' '}
      </Mui.Grid>
      <SelectBottomSheet
        open={newProvider}
        addNewSheet
        onClose={() => {
          setAddNewProvider(false);
        }}
        triggerComponent={<span style={{ display: 'none' }} />}
      >
        <Puller />

        <Mui.Grid className={css.addStack}>
          <Mui.Stack direction="column">
            <Mui.Typography className={css.accBalTitle}>
              Add a Provider’s EMail ID
            </Mui.Typography>
            <Mui.Divider className={css.divider1} variant="fullWidth" />
          </Mui.Stack>
          <Mui.Stack>
            <Input
              required
              name="email"
              className={`${css.greyBorder} ${classes.root}`}
              label="Email Id"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              value={emailVal}
              type="email"
              onChange={handleChange(setEmailVal)}
              error={validationErr.email}
              helperText={validationErr.email ? VALIDATION?.email?.errMsg : ''}
            />
            <Mui.Grid className={css.nickNameHelper}>
              <Input
                name="name"
                className={`${css.greyBorder} ${classes.root}`}
                label="Nickname"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                value={nameVal}
                onChange={handleChange(setNameVal)}
                error={validationErr.name}
                helperText={validationErr.name ? VALIDATION?.name?.errMsg : ''}
                required
              />
            </Mui.Grid>
            <Mui.Button
              className={css.addNowButton}
              onClick={() => {
                AddProvider();
              }}
            >
              Add Now
            </Mui.Button>
          </Mui.Stack>
        </Mui.Grid>
      </SelectBottomSheet>
    </Mui.Stack>
  ) : (
    // web

    <>
      {' '}
      <>
        <div style={{ padding: '0px  0px 0px 0px', width: '100%' }}>
          <Mui.Stack direction="column" className={css.stackAdd}>
            <Mui.Stack direction="row" alignItems="normal">
              <Mui.Typography className={css.addTitle}>
                {state?.datas?.email}
              </Mui.Typography>
              <Mui.Grid
                onClick={() => syncNow(state.datas.id)}
                className={css.refreshBtn}
              >
                <img src={refresh} className={css.refreshIcon} alt="refresh" />
              </Mui.Grid>
            </Mui.Stack>

            <Mui.Stack direction="row" alignItems="baseline">
              <Mui.Typography className={css.addTitle}>
                Last Sync:
              </Mui.Typography>{' '}
              <Mui.Typography className={css.add}>
                &nbsp;
                {moment(state?.datas?.last_synced_at).format(
                  'MMMM Do YYYY, h:mm:ss a',
                )}
              </Mui.Typography>
            </Mui.Stack>
          </Mui.Stack>
          <Mui.Stack direction="column" className={css.stackAdd}>
            <Mui.Typography className={css.addTitle}>
              Your Providers
            </Mui.Typography>
            <Mui.Stack direction="row" justifyContent="space-between">
              <Mui.Typography className={css.add}>
                Emails from which you get your Bills :
              </Mui.Typography>
              <Mui.Grid>
                <Mui.Button
                  className={css.buttonWebPage2}
                  onClick={() => setAddNewProvider(true)}
                >
                  Add a New Provider
                </Mui.Button>
              </Mui.Grid>
            </Mui.Stack>

            <Mui.Dialog
              PaperProps={{
                elevation: 3,
                style: {
                  width: '52%',
                  overflow: 'visible',
                  borderRadius: 16,
                  cursor: 'pointer',
                },
              }}
              open={newProvider}
              onClose={() => setAddNewProvider(false)}
            >
              <Mui.DialogContent>
                <Mui.Grid>
                  <Mui.Stack direction="column">
                    <Mui.Typography className={css.accBalTitle}>
                      Add a Provider’s EMail ID
                    </Mui.Typography>
                    <Mui.Divider className={css.divider1} variant="fullWidth" />
                  </Mui.Stack>
                  <Mui.Stack>
                    <Input
                      required
                      name="email"
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Email Id"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      theme="light"
                      value={emailVal}
                      type="email"
                      onChange={handleChange(setEmailVal)}
                      error={validationErr.email}
                      helperText={
                        validationErr.email ? VALIDATION?.email?.errMsg : ''
                      }
                    />
                    <Mui.Grid className={css.nickNameHelper}>
                      <Input
                        name="name"
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Nickname"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        theme="light"
                        value={nameVal}
                        onChange={handleChange(setNameVal)}
                        error={validationErr.name}
                        helperText={
                          validationErr.name ? VALIDATION?.name?.errMsg : ''
                        }
                        required
                      />
                    </Mui.Grid>
                    <Mui.Button
                      className={css.addNowButton}
                      onClick={() => {
                        AddProvider();
                      }}
                    >
                      Add Now
                    </Mui.Button>
                  </Mui.Stack>
                </Mui.Grid>
              </Mui.DialogContent>
            </Mui.Dialog>
          </Mui.Stack>
          <Mui.Stack spacing={2} className={css.ptContainer}>
            <Mui.Box className={css.datagridBox}>{ComDataGrid()}</Mui.Box>
          </Mui.Stack>
        </div>
      </>
    </>
  );
};

export default AddAndManageEmailList;
