import * as React from 'react';
import * as Mui from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import * as Router from 'react-router-dom';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import Lottie from 'react-lottie';
import sucessAnimation from '@root/Lotties/paymentSucess.json';
import quickBooks from '@assets/quickBooks.svg';
import tallyIcon from '@assets/tallyIcon.svg';
import zohobooks from '@assets/zohobooks.svg';
import quickBooksNew from '@assets/quickbookNew.svg';
import tallyIconNew from '@assets/tallyIconNew.svg';
import zohobooksNew from '@assets/zohobooksNew.svg';
import AppContext from '@root/AppContext.jsx';
import bottomEllipse from '@assets/bottomEllipse.svg';
import topEllipse from '@assets/topEllipse.svg';
import featherupload from '@assets/featherupload.svg';
import close from '@assets/close.svg';
// import pdfCompany from '@assets/pdfCompany.png';
import UploadIcon from '@assets/UploadIcon.png';
import circleok from '@assets/circle-ok.svg';
import SimpleSnackbar from '@components/SnackBarContainer/CustomSnackBar.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import FileUpload from '@components/FileUpload/FileUpload.jsx';
// import AppContext from '@root/AppContext.jsx';
import * as css from './CompanyData.scss';

const useStyles = makeStyles(() => ({
  radioGroupRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}));

const CompanyData = () => {
  const { organization, user, enableLoading, openSnackBar } =
    React.useContext(AppContext);
  const classes = useStyles();
  const [uploadDialog, setUploadDialog] = React.useState(false);
  const [forUpload, setForUpload] = React.useState({ id: '', fileName: '' });
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const device = localStorage.getItem('device_detect');
  const [percentage, setPercentage] = React.useState(40);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [fromLocation, setFromLocation] = React.useState();
  const [forTallyUpload, setForTallyUpload] = React.useState(false);
  const [zohoDomainSelectorDialog, setZohoDomainSelectorDialog] =
    React.useState(false);
  const [itemType, setItemType] = React.useState();

  const defaultOptionsSuccess = {
    loop: true,
    autoplay: true,
    animationData: sucessAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  React.useEffect(() => {
    if (device === 'mobile') {
      navigate('/dashboard');
    }
  }, [device]);

  React.useMemo(() => {
    if (state?.from) {
      setFromLocation(state?.from);
    }
  }, [state]);

  const onItemTypeChange = (e) => {
    setItemType(e.target.value);
    // setHsnCode('');
  };

  // eslint-disable-next-line no-unused-vars
  const syncNow = (ids) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/tally_backup`, {
      method: METHOD.POST,
      payload: { tally_backup: ids },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unkonown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else if (!res?.error) {
          console.log(res);
          setForTallyUpload(true);
        }
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const quickBookReg = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/quick_book_syncs`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unkonown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else if (!res?.error) {
          const win = window.open(res?.link, '_blank', '_popup');
          const timer = setInterval(function () {
            if (win.closed) {
              clearInterval(timer);
              setOpenSnack(true);
              // navigate('/dashboard', {state: {from: 'openedNow'}});
            }
          }, 1000);
        }
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const zohoBookReg = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/zoho_sync?zoho_domain=${itemType}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unkonown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else if (!res?.error) {
          const win = window.open(res?.link, '_blank', '_popup');
          const timer = setInterval(function () {
            if (win.closed) {
              clearInterval(timer);
              setOpenSnack(true);
              // navigate('/dashboard', {state: {from: 'openedNow'}});
            }
          }, 1000);
        }
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const registerType = (type) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}`, {
      method: METHOD.PATCH,
      payload: {
        integration_type: type,
        name: organization?.name,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unkonown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else if (!res?.error) {
          if (type === 'quick_books') {
            quickBookReg();
          }
          if (type === 'tally') {
            setUploadDialog(true);
          }
          if (type === 'zoho') {
            zohoBookReg();
          }
        }
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  React.useEffect(() => {
    if (forUpload?.id !== '' && percentage < 100) {
      setTimeout(() => {
        setPercentage((prev) => prev + 15);
      }, 500);
    }
  }, [forUpload, percentage]);

  // const {
  //   // organization,
  //   user,
  //   // changeSubView,
  //   // registerEventListeners,
  //   enableLoading,
  //   openSnackBar,
  // } = React.useContext(AppContext);

  // const updateFunction = () => {
  //   const apiurl = getuploadurl();
  //   if (type === undefined || type === 'recurring') {
  //     payloaddata.generate_invoice = butt;
  //   }
  //   payloaddata = {
  //     ...payloaddata,
  //     file: forUpload.map((file) => file.id)[0],
  //   };
  //   enableLoading(true);
  //   RestApi(apiurl, {
  //     method: METHOD.POST,
  //     headers: {
  //       Authorization: `Bearer ${user.activeToken}`,
  //     },
  //     payload: payloaddata,
  //   })
  //     .then((res) => {
  //       if (res && !res.error) {
  //         // console.log(res);
  //         setTrigger(true);
  //         setForUpload([]);
  //         setButt(true);
  //       }
  //     })
  //     .catch((e) => {
  //       openSnackBar({
  //         message: Object.values(e.errors).join(),
  //         type: MESSAGE_TYPE.ERROR,
  //       });
  //     });

  //   enableLoading(false);
  // };

  // console.log('userData', forUpload);
  return (
    <div
      className={
        fromLocation === 'from-settings-menu'
          ? css.mainContainerFromSettings
          : css.mainContainer
      }
    >
      {/* <div className={css.toptitleContainer}> */}

      <img src={topEllipse} className={css.toptitleContainer} alt="ellipse" />
      <div className={css.titleContent}>
        <div className={css.title}>Set Up Company Data</div>
        {/* </div> */}
        <div className={css.content}>
          <div className={css.rowContainers}>
            <div className={css.imageDiv}>
              <img
                src={
                  fromLocation === 'from-settings-menu'
                    ? quickBooksNew
                    : quickBooks
                }
                className={css.imageSize}
                alt="quickBooks"
              />
            </div>
            <div className={css.descrDiv}>
              <div className={css.bookDescription}>
                Login to your Quickbooks Account to import your past
                transctions, invoices, and more so that you can seamlessly
                transition into the Effortless experience.
              </div>
              <div className={css.Days}>ET: 2 Business Days</div>
            </div>
            <div className={css.continueButtonDiv}>
              <button
                type="button"
                className={css.continueButton}
                onClick={() => registerType('quick_books')}
              >
                Continue
              </button>
            </div>
          </div>
          <div className={css.rowContainers}>
            <div className={css.imageDiv}>
              <img
                src={
                  fromLocation === 'from-settings-menu'
                    ? tallyIconNew
                    : tallyIcon
                }
                className={css.imageSize}
                alt="tallyIcon"
              />
            </div>
            <div className={css.descrDiv}>
              <div className={css.bookDescription}>
                Upload your data from Tally to import all you past transactions
                so that you can seamlessly transition into the Effortless
                experience.
              </div>{' '}
              <div className={css.Days}>ET: 1 Business Days</div>
            </div>
            <div className={css.continueButtonDiv}>
              <button
                type="button"
                onClick={() => {
                  registerType('tally');
                }}
                className={css.continueButton}
              >
                Continue
              </button>
            </div>
          </div>
          <div className={css.rowContainers}>
            <div className={css.imageDiv}>
              <img
                src={
                  fromLocation === 'from-settings-menu'
                    ? zohobooksNew
                    : zohobooks
                }
                className={css.imageSize}
                alt="zohobooks"
              />
            </div>
            <div className={css.descrDiv}>
              <div className={css.bookDescription}>
                Login to your ZohoBooks Account to import your past transctions,
                invoices, and more so that you can seamlessly transition into
                the Effortless experience.
              </div>{' '}
              <div className={css.Days}>ET: 1 Business Days</div>
            </div>
            <div className={css.continueButtonDiv}>
              <button
                type="button"
                className={css.continueButton}
                onClick={() => setZohoDomainSelectorDialog(true)}
              >
                Continue
              </button>
            </div>
          </div>
          {uploadDialog && (
            <Mui.Grid>
              <Mui.Dialog
                fullWidth
                PaperProps={{
                  elevation: 3,
                  style: {
                    width: '72%',
                    borderRadius: 16,
                    cursor: 'pointer',
                    maxWidth: '72%',
                    height: 'fitContent',
                  },
                }}
                open={uploadDialog && !state?.from}
                // onClose={() => setUploadDialog(false)}
              >
                <Mui.DialogContent>
                  <Mui.Grid
                    className={css.close}
                    onClick={() => {
                      setUploadDialog(false);
                      if (percentage === 40 && percentage < 99) {
                        setOpenSnack(true);
                      }
                      if (percentage === 100) {
                        navigate('/dashboard', {
                          state: { from: 'openedNow' },
                        });
                      }
                      setPercentage(40);
                      setForUpload({ id: '', fileName: '' });
                    }}
                  >
                    <img src={close} alt="upload" />
                  </Mui.Grid>
                  <Mui.Grid className={css.uploadContainer}>
                    <Mui.Grid className={css.marginBottom}>
                      {percentage !== 100 ? (
                        <img src={featherupload} alt="upload" />
                      ) : (
                        <img src={circleok} width="121px" alt="circle-ok" />
                      )}
                    </Mui.Grid>
                    <Mui.Grid className={css.uploadTally}>
                      {percentage === 40 && 'Upload your Tally Backup here'}
                      {percentage > 40 &&
                        percentage < 99 &&
                        'Upload In Progress'}
                      {percentage === 100 && 'Upload Completed'}
                      {/* Upload In Progress */}
                    </Mui.Grid>
                    {percentage > 40 && (
                      <Mui.Grid className={css.uploadFile}>
                        {forUpload?.fileName}
                      </Mui.Grid>
                    )}
                    {percentage > 40 && percentage < 99 && (
                      <Mui.Grid
                        sx={{ width: '50%', margin: '0 25%' }}
                        className={css.uploadingBackGround}
                      >
                        <div
                          className={css.uploading}
                          style={{ width: `${percentage}%` }}
                        />
                      </Mui.Grid>
                    )}
                    {percentage === 100 && (
                      <Mui.Grid className={css.descrCompleted}>
                        Your SuperAccountant will set up your Effortless Chart
                        of Accounts in the next 2 Business Days.
                      </Mui.Grid>
                    )}
                    {percentage === 100 && (
                      <Mui.Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        className={css.browseButtonDone}
                        disableElevation
                        disableTouchRipple
                        onClick={() => {
                          navigate('/dashboard', {
                            state: { from: 'openedNow' },
                          });
                        }}
                      >
                        {' '}
                        Done
                      </Mui.Button>
                    )}
                    {percentage === 40 && (
                      <Mui.Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        className={css.browseButton}
                        disableElevation
                        disableTouchRipple
                      >
                        Browse
                        <FileUpload
                          setForUpload={setForUpload}
                          funCall={syncNow}
                          fromCompany
                        />
                      </Mui.Button>
                    )}
                  </Mui.Grid>
                </Mui.DialogContent>
              </Mui.Dialog>
              <Mui.Dialog
                fullWidth
                PaperProps={{
                  elevation: 3,
                  style: {
                    width: '25%',
                    borderRadius: 16,
                    cursor: 'pointer',
                    maxWidth: '25%',
                    height: 'fitContent',
                    padding: '32px 33px',
                  },
                }}
                open={uploadDialog && fromLocation === 'from-settings-menu'}
                onClose={() => {
                  if (forTallyUpload) {
                    setUploadDialog(false);
                    setForUpload({ id: '', fileName: '' });
                    setForTallyUpload(false);
                  }
                }}
              >
                <div>
                  {!forTallyUpload && (
                    <div className={css.headerContainer}>
                      <p className={css.headerLabel}>Upload Tally data</p>
                    </div>
                  )}

                  {forTallyUpload && (
                    <div className={css.lottieSuccess}>
                      <Lottie options={defaultOptionsSuccess} />
                      <p className={css.uploadingText}>Uploading Successful</p>
                    </div>
                  )}

                  <Mui.Button
                    component={forUpload?.id === '' ? 'label' : 'div'}
                    className={css.uploadDiv}
                  >
                    {forUpload?.id === ''
                      ? 'Click here to Upload'
                      : forUpload?.fileName}
                    <FileUpload
                      setForUpload={setForUpload}
                      // funCall={syncNow}
                      fromCompany
                    />
                    <img
                      src={UploadIcon}
                      className={css.uploadImg}
                      alt="upload"
                    />
                  </Mui.Button>

                  {!forTallyUpload && (
                    <div className={css.finalCont}>
                      <Mui.Button
                        className={css.outLinedButton}
                        onClick={() => {
                          setUploadDialog(false);
                          setForUpload({ id: '', fileName: '' });
                          setForTallyUpload(false);
                        }}
                      >
                        Cancel
                      </Mui.Button>
                      <Mui.Button
                        disabled={forUpload?.id === ''}
                        className={css.browseButton}
                        onClick={() => {
                          syncNow(forUpload?.id);
                        }}
                      >
                        Upload
                      </Mui.Button>
                    </div>
                  )}
                </div>
              </Mui.Dialog>
            </Mui.Grid>
          )}
        </div>
      </div>
      <div className={css.bottomEllipse}>
        <div
          className={css.skip}
          onClick={() => {
            navigate('/dashboard', {
              state: { from: 'bankReq' },
            });
          }}
        >
          SKIP
        </div>
        <img src={bottomEllipse} alt="ellipse" />
      </div>
      <Mui.Dialog
        open={zohoDomainSelectorDialog}
        onClose={() => setZohoDomainSelectorDialog(false)}
      >
        <div className={css.zohoDomainContainer}>
          <Mui.Typography className={css.valueHeader}>
            IMPORTANT!
          </Mui.Typography>
          <Mui.Typography className={css.ValueContent}>
            Select which domain address your ZohoBooks Account is associated
            with:{' '}
          </Mui.Typography>
          <Mui.Grid item xs={12} sx={{ marginBottom: '24px' }}>
            <Mui.RadioGroup
              aria-label="itemType"
              name="itemType"
              value={itemType}
              onChange={onItemTypeChange}
              className={css.itemTypeContainer}
              classes={{
                root: classes.radioGroupRoot,
              }}
              sx={{
                alignItems: 'flex-start',
                flexFlow: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <Mui.FormControlLabel
                value=".com"
                control={<Mui.Radio style={{ color: '#F08B32' }} />}
                label=".com"
                sx={{
                  color: '#283049',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 'normal',
                }}
              />
              <Mui.FormControlLabel
                value=".in"
                control={<Mui.Radio style={{ color: '#F08B32' }} />}
                label=".in"
                sx={{
                  color: '#283049',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 'normal',
                }}
              />
            </Mui.RadioGroup>
          </Mui.Grid>
          <div className={css.zohoDomainFooter}>
            <Mui.Button
              className={css.cancelBtn}
              onClick={() => setZohoDomainSelectorDialog(false)}
            >
              Cancel
            </Mui.Button>
            <Mui.Button
              className={css.confirmBtn}
              onClick={() => {
                setZohoDomainSelectorDialog(false);
                registerType('zoho');
              }}
            >
              Confirm
            </Mui.Button>
          </div>
        </div>
      </Mui.Dialog>
      <SimpleSnackbar
        openSnack={openSnack}
        message="The process is incompleted, Click skip to view dashboard"
        setOpenSnack={setOpenSnack}
      />
    </div>
  );
};
export default CompanyData;
