import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetInvoiceDashboardState,
  PostInvoiceBulkUploadState,
  GetStatusInvoiceBulkUploadState,
  ClearStateStatusInvoiceBulkUpload,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import moment from 'moment';
import { withStyles } from '@material-ui/core';
import * as Mui from '@material-ui/core';
import * as MuiLs from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import download from '@assets/downloadBulk.png';
import filePng from '@assets/file.png';
// import Lottie from 'react-lottie';
import { BASE_URL } from '@action/ApiConfig/AxiosInst';
import FileUpload from '@components/FileUpload/FileUpload.jsx';
// import sucessAnimation from '@root/Lotties/paymentSucess.json';
// import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
// import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import * as Router from 'react-router-dom';
import PageTitle from '@core/DashboardView/PageTitle';
import bulkUpload from '@assets/bulkUpload.png';
import circle from '../../assets/circle-ok.svg';
import cancel from '../../assets/cancel.svg';
// import error from '../../assets/error.svg';

import * as css from './bulkUpload.scss';

const SnackbarMui = withStyles({
  root: {
    '& .MuiSnackbarContent-root': {
      backgroundColor: 'white',
    },
  },
})(Mui.Snackbar);

function BulkUpload() {
  const {
    organization,
    user,
    // changeSubView,
    // registerEventListeners,
    enableLoading,
    // openSnackBar,
    userPermissions,
  } = React.useContext(AppContext);
  const dispatch = useDispatch();
  const { invoiceBulkUploadData, invoiceBulkUploadStatusData } = useSelector(
    (value) => value.Invoice,
  );
  const [type, setType] = React.useState('');
  const [butt, setButt] = React.useState(true);
  const [forUpload, setForUpload] = React.useState([]);
  // const [forDownload, setForDownload] = React.useState();
  // const [Download, setDownload] = React.useState();
  const [trigger, setTrigger] = React.useState({
    open: false,
    icon: false,
    subject: '',
    message: '',
  });
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const device = localStorage.getItem('device_detect');
  const [percentage, setPercentage] = React.useState(60);

  const [userRolesPeople, setUserRolesPeople] = React.useState({});
  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  const uploadNavigatePerm = (route, stateParam) => {
    setHavePermission({
      open: true,
      back: () => {
        setHavePermission({ open: false });
        if (stateParam) {
          navigate(route, stateParam);
        } else {
          navigate(route || '/invoice');
        }
      },
    });
  };

  React.useEffect(() => {
    if (type === 'vendors' || type === 'customers' || type === 'team') {
      if (Object.keys(userPermissions?.People || {})?.length > 0) {
        if (!userPermissions?.People?.People) {
          uploadNavigatePerm('/dashboard');
        }
        setUserRolesPeople({ ...userPermissions?.People });
        // setUserRolesInvoicing({ ...userPermissions?.Invoicing });
      }
    } else if (Object.keys(userPermissions?.Invoicing || {})?.length > 0) {
      if (!userPermissions?.Invoicing?.Invoicing) {
        uploadNavigatePerm('/dashboard');
      }
      setUserRolesInvoicing({ ...userPermissions?.Invoicing });
    }
  }, [userPermissions, type]);

  React.useEffect(() => {
    if (
      Object.keys(userRolesPeople?.Customers || {})?.length > 0 &&
      !userRolesPeople?.Customers?.create_customers &&
      type === 'customers'
    ) {
      uploadNavigatePerm('/people', { state: { choose: 'tab1' } });
    } else if (
      Object.keys(userRolesPeople?.Vendors || {})?.length > 0 &&
      !userRolesPeople?.Vendors?.create_vendors &&
      type === 'vendors'
    ) {
      uploadNavigatePerm('/people', { state: { choose: 'tab2' } });
    } else if (
      Object.keys(userRolesPeople?.Employees || {})?.length > 0 &&
      !userRolesPeople?.Employees?.create_employees &&
      type === 'team'
    ) {
      uploadNavigatePerm('/people', { state: { choose: 'tab3' } });
    } else if (
      Object.keys(userRolesInvoicing?.Contract || {})?.length > 0 &&
      !userRolesInvoicing?.Contract?.create_recurring_invoices &&
      type === 'recurring'
    ) {
      uploadNavigatePerm('/invoice-recurring');
    } else if (
      Object.keys(userRolesInvoicing?.['Tax Invoice'] || {})?.length > 0 &&
      Object.keys(userRolesInvoicing?.Estimate || {})?.length > 0 &&
      !type &&
      !userRolesInvoicing?.['Tax Invoice']?.create_invoices &&
      !userRolesInvoicing?.Estimate?.create_estimate
    ) {
      uploadNavigatePerm();
    }
  }, [
    userRolesPeople?.Customers,
    userRolesPeople?.Vendors,
    userRolesPeople?.Employees,
    userRolesInvoicing?.Contract,
    userRolesInvoicing?.['Tax Invoice'],
    type,
  ]);

  React.useEffect(() => {
    return () => {
      dispatch(ClearStateStatusInvoiceBulkUpload());
    };
  }, []);

  let payloaddata = {
    file: null,
    generate_invoice: true,
  };
  React.useEffect(() => {
    if (device === 'mobile') {
      navigate('/invoice');
    }
  }, []);
  const getdownloadurl = () => {
    if (type === 'recurring')
      return `${BASE_URL}/organizations/${organization.orgId}/customer_agreements/uploads/new.xlsx`;
    if (type === 'vendors')
      return `${BASE_URL}/organizations/${organization.orgId}/vendors/uploads.xlsx`;
    if (type === 'customers')
      return `${BASE_URL}/organizations/${organization.orgId}/customers/uploads.xlsx`;
    if (type === 'team')
      return `${BASE_URL}/organizations/${organization.orgId}/members.xlsx`;
    if (type === 'transactions')
      return `${BASE_URL}/organizations/${organization.orgId}/bank_statements.xlsx?id=${state?.bank_account_id}`;
    if (type === 'account_mappings')
      return `${BASE_URL}/organizations/${organization.orgId}/account_mappings.xlsx?source=${state?.type}`;
    return `${BASE_URL}/organizations/${organization.orgId}/invoices/uploads.xlsx`;
  };
  const getuploadurl = () => {
    if (type === 'recurring') return `customer_agreements/uploads`;
    if (type === 'vendors') return `vendors/uploads`;
    if (type === 'customers') return `customers/uploads`;
    if (type === 'team') return `members/upload`;
    if (type === 'transactions') return `bank_statements`;
    if (type === 'account_mappings')
      return `account_mappings.xlsx?source=${state?.type}`;
    return `invoices/uploads`;
  };

  const getuploadStmt = () => {
    if (type === 'recurring') return 'Recurring Invoice';
    if (type === 'vendors') return 'Vendors';
    if (type === 'customers') return 'Customers';
    if (type === 'team') return 'Teams';
    if (type === 'transactions') return 'Transactions';
    if (type === 'account_mappings') return 'Accounts mapping';
    return 'Invoice';
  };
  const downloadFunction = () => {
    const apiurl = getdownloadurl();
    enableLoading(true);
    fetch(apiurl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Bulk Upload';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    enableLoading(false);
  };

  const updateFunction = () => {
    const apiurl = getuploadurl();
    if (type === undefined || type === 'recurring') {
      payloaddata.generate_invoice = butt;
    }
    payloaddata = {
      ...payloaddata,
      file: forUpload.map((file) => file.id)[0],
    };
    if (state?.from === 'banking' && state?.bank_account_id) {
      payloaddata = {
        ...payloaddata,
        id: state?.bank_account_id,
        generate_invoice: undefined,
      };
    }
    dispatch(
      PostInvoiceBulkUploadState({
        apiURL: apiurl,
        payloadData: payloaddata,
      }),
    );
  };

  React.useEffect(() => {
    if (Object.keys(invoiceBulkUploadData || {})?.length > 0) {
      setTrigger({
        open: true,
        icon: bulkUpload,
        subject: 'UPLOAD IN PROGRESS...',
        message: `Your ${getuploadStmt()} List is being uploaded.`,
      });
      dispatch(
        GetStatusInvoiceBulkUploadState({
          dataId: invoiceBulkUploadData?.id || invoiceBulkUploadData?.data?.id,
        }),
      );
      setForUpload([]);
      setButt(true);
      dispatch(
        GetInvoiceDashboardState({
          durationDate: moment().format('YYYY-MM-DD'),
        }),
      );
    }
  }, [invoiceBulkUploadData]);

  React.useEffect(() => {
    if (
      Object.keys(invoiceBulkUploadStatusData || {})?.length > 0 &&
      Object.keys(invoiceBulkUploadData || {})?.length > 0
    ) {
      if (invoiceBulkUploadStatusData?.status === 'processing') {
        setTrigger({
          open: true,
          icon: bulkUpload,
          subject: 'UPLOAD IN PROGRESS...',
          message: `Your ${getuploadStmt()} List is being uploaded.`,
        });
        setTimeout(() => {
          dispatch(
            GetStatusInvoiceBulkUploadState({
              dataId:
                invoiceBulkUploadStatusData?.id ||
                invoiceBulkUploadStatusData?.data?.id,
            }),
          );
        }, 5000);
      } else if (invoiceBulkUploadStatusData?.status === 'success') {
        setTrigger({
          open: true,
          icon: circle,
          subject: 'SUCCESS',
          message: `Your ${getuploadStmt()} List are ready.`,
        });
        dispatch(
          GetInvoiceDashboardState({
            durationDate: moment().format('YYYY-MM-DD'),
          }),
        );
      } else if (invoiceBulkUploadStatusData?.status === 'failed') {
        setTrigger({
          open: true,
          icon: cancel,
          subject: 'UNSUCCESSFUL',
          message: `We were unable to upload your ${getuploadStmt()} List. Try again.`,
        });
        dispatch(
          GetInvoiceDashboardState({
            durationDate: moment().format('YYYY-MM-DD'),
          }),
        );
      } else if (invoiceBulkUploadStatusData?.status === 'partial_success') {
        setTrigger({
          open: true,
          icon: circle,
          subject: 'PARTIAL SUCCESS',
          message: `Your ${getuploadStmt()} List is being partially uploaded.`,
        });
        dispatch(
          GetInvoiceDashboardState({
            durationDate: moment().format('YYYY-MM-DD'),
          }),
        );
      }
    }
  }, [invoiceBulkUploadStatusData]);

  const close = () => {
    setTrigger({ open: false, icon: false, subject: '', message: '' });
    setForUpload([]);
    setPercentage(40);
  };
  const iff = () => {
    if (type === 'recurring') return 'Agreement';
    if (type === 'vendors') return 'Vendors';
    if (type === 'customers') return 'Customers';
    if (type === 'team') return 'Employee';
    if (type === 'transactions') return 'Transactions';
    if (type === 'account_mappings') return 'Accounts mapping';
    return 'Invoice';
  };
  React.useEffect(() => {
    if (forUpload?.length > 0 && percentage < 100) {
      setTimeout(() => {
        setPercentage((prev) => prev + 20);
      }, 500);
    }
  }, [forUpload, percentage]);

  React.useEffect(() => {
    if (state?.thisFor) {
      setType(state?.thisFor);
    }
  }, [state]);

  return (
    <>
      {' '}
      <PageTitle
        title={`Upload ${iff()}`}
        onClick={() => {
          if (state?.from === 'people') {
            navigate('/people', { state: { choose: state?.choose } });
          } else {
            navigate(-1);
          }
        }}
      />{' '}
      <Mui.Grid container>
        <Mui.Grid item xs={12} md={7}>
          <Mui.Paper className={css.paper}>
            <div className={css.mainDiv}>
              <Mui.Typography className={css.title}>
                Step 1 : Download the Template
              </Mui.Typography>
              <div
                className={css.uploadButt}
                onClick={() => downloadFunction()}
              >
                <div className={css.download}>
                  {/* {!forDownload ? ( */}
                  <img
                    src={download}
                    alt="download"
                    style={{ padding: '16.7px 20px' }}
                    // onClick={() => downloadFunction()}
                  />
                  {/* ) : (
                  <img
                    src={filePng}
                    style={{ padding: '12px 20px' }}
                    alt="download"
                  />
                )} */}
                </div>
                <Mui.Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  className={css.buttonComp}
                  disableElevation
                  disableTouchRipple
                  // onClick={() => downloadFunction()}
                >
                  {/* <a
                  href={Download}
                  style={{ textDecoration: 'none', color: '#000000' }}
                  target="_blank"
                  rel="noreferrer"
                > */}
                  Get the upload template
                  {/* </a> */}
                </Mui.Button>
              </div>
            </div>

            <div className={css.mainDiv}>
              <Mui.Typography className={css.title}>
                Step 2 : Upload Filled-in Template
              </Mui.Typography>
              <div className={css.uploadButt}>
                <div className={css.download}>
                  {forUpload.length === 0 ? (
                    <img
                      src={download}
                      alt="download"
                      style={{
                        padding: '16.7px 20px',
                        transform: ' rotate(180deg)',
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => {
                        setForUpload([]);
                        setPercentage(40);
                      }}
                    >
                      <img
                        src={filePng}
                        style={{ padding: '12px 20px' }}
                        alt="download"
                        title="Click to clear"
                      />
                    </div>
                  )}
                </div>
                {forUpload?.length === 0 ? (
                  <Mui.Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    className={css.buttonComp}
                    disableElevation
                    disableTouchRipple
                  >
                    Choose a File
                    <FileUpload setForUpload={setForUpload} />
                  </Mui.Button>
                ) : (
                  <div className={css.uploadFile}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {forUpload?.map((file) => (
                        <p style={{ margin: 0 }}>{file?.fileName}</p>
                      ))}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '5px',
                        background: '#d8d8d8',
                        borderRadius: '5px',
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          background: '#0F91D2',
                          height: '5px',
                          borderRadius: '5px',
                        }}
                      />
                      <div style={{ width: '100%', textAlign: 'right' }}>
                        <p style={{ textAlign: 'right', margin: 0 }}>
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {type === 'vendors' ||
            type === 'customers' ||
            type === 'team' ||
            type === 'transactions' ||
            type === 'account_mappings' ? (
              <></>
            ) : (
              <div className={css.mainDiv}>
                <Mui.Typography className={css.title}>
                  Step 3 : Generate all Invoices
                </Mui.Typography>
                <div className={css.uploadButt}>
                  <Mui.Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    className={css.buttonCompForSend}
                    disableElevation
                    disableTouchRipple
                    style={{
                      backgroundColor: !butt ? '#D8D8D8' : '#fff',
                      color: butt ? '#f08b32' : '#000',
                    }}
                    onClick={() => setButt(true)}
                  >
                    Send for Approval
                  </Mui.Button>
                  <Mui.Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    className={css.buttonCompForDraft}
                    disableElevation
                    disableTouchRipple
                    style={{
                      backgroundColor: butt ? '#D8D8D8' : '#fff',
                      color: !butt ? '#f08b32' : '#000',
                    }}
                    onClick={() => setButt(false)}
                  >
                    Keep in Draft
                  </Mui.Button>
                </div>
              </div>
            )}

            <div className={css.buttDiv}>
              <Mui.Button
                variant="contained"
                component="label"
                className={css.orangeConatined}
                disableElevation
                disableTouchRipple
                disabled={forUpload.length === 0 || percentage !== 100}
                onClick={() => updateFunction()}
              >
                Upload
              </Mui.Button>
              <Mui.Button
                variant="outlined"
                component="label"
                className={css.whiteVariant}
                disableElevation
                disableTouchRipple
                onClick={() => {
                  setForUpload([]);
                  setButt(true);
                }}
              >
                Cancel
              </Mui.Button>
            </div>
          </Mui.Paper>
        </Mui.Grid>
        <SnackbarMui
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={trigger.open}
          onClose={close}
          message={
            <div className={css.messageContainer}>
              <MuiLs.Stack direction="row">
                <img
                  src={trigger?.icon}
                  alt="success"
                  className={css.success}
                />
                <MuiLs.Stack>
                  <MuiLs.Typography className={css.successTxt}>
                    {trigger?.subject}
                  </MuiLs.Typography>
                  <MuiLs.Typography className={css.message}>
                    {trigger?.message}
                  </MuiLs.Typography>
                </MuiLs.Stack>
              </MuiLs.Stack>
            </div>
          }
          // autoHideDuration={5000}
          // key={vertical + horizontal}
        />
      </Mui.Grid>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
}

export default BulkUpload;
