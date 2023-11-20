import React from 'react';
import * as Mui from '@mui/material';
import JSBridge from '@nativeBridge/jsbridge';
// import * as MuiIcons from '@mui/icons-material';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as Router from 'react-router-dom';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { DirectUpload } from '@rails/activestorage';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import AppContext from '@root/AppContext.jsx';
// import Input from '@components/Input/Input.jsx';
import * as css from './InvoiceSettings.scss';
import download from '../../../assets/Vector.png';
import Upload from '../../../assets/WebAssets/feather_upload-cloud.svg';

const Signature = () => {
  const { organization, user, enableLoading, openSnackBar, userPermissions, registerEventListeners, deRegisterEventListener } =
    React.useContext(AppContext);
  const justRef = React.useRef();
  const navigate = Router.useNavigate();
  const device = localStorage.getItem('device_detect');
  const [fileData, setFileData] = React.useState();
  const [data, setData] = React.useState();
  const [Url, setUrl] = React.useState('');
  const [ProgressOpen, setProgressOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [checkBox, setCheckBox] = React.useState(false);

  const [showSignatureData, setShowSignatureData] = React.useState();
  const [progress, setProgress] = React.useState(0);
  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Settings || {})?.length > 0) {
      if (!userPermissions?.Settings?.Settings) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRolesInvoicing({ ...userPermissions?.Invoicing });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const FetchData = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/signatures`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((response) => {
        enableLoading(false);
        setData(response.data);
        if (response?.error) {
          openSnackBar({
            message: response?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.WARNING,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };

  const submitMarkedPersonal = (signId, imgUrl, defaultCheck) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/signatures/${signId}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        image_url: imgUrl,
        default: defaultCheck,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          openSnackBar({
            message: Object.values('Updated Successfully'),
            type: MESSAGE_TYPE.INFO,
          });
          enableLoading(false);
        } else {
          openSnackBar({
            message: Object.values('Cannot Set Default'),
            type: MESSAGE_TYPE.WARNING,
          });
          enableLoading(false);
        }
      })
      .catch(() => {
        openSnackBar({
          message: Object.values('Action Failed'),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
    enableLoading(false);
  };
  React.useEffect(() => {
    FetchData();
  }, []);
  const onFileUpload = (e, directFile) => {
    setProgressOpen(!ProgressOpen);
    const file = directFile ? e : e?.target?.files?.[0];
    const Files = URL.createObjectURL(file);
    const url = `${BASE_URL}/direct_uploads`;
    const uploadHere = new DirectUpload(file, url);
    uploadHere
      .create((error, blob) => {
        const id = blob?.signed_id;
        // const name = blob?.filename;
        setProgressOpen(false);
        setFileData(id);
        setUrl(Files);
        openSnackBar({
          message: 'Signature Uploaded',
          type: MESSAGE_TYPE.INFO,
        });
      })
      .catch(() => {
        enableLoading(false);
      });
  };
  const UploadFile = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/signatures`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        image: fileData,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setUrl('');
          setFileData();
          FetchData();
          // openSnackBar({
          //   message: 'Signature Uploaded Successfully',
          //   type: MESSAGE_TYPE.INFO,

          // });
        }
        if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.WARNING,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };
  const ShowSignature = (c) => {
    setOpen(true);
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/signatures/${c?.id}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        image: fileData,
      },
    })
      .then((res) => {
        enableLoading(false);
        setShowSignatureData(res);
        setCheckBox(res.default);
        //  setFileData();
        if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.WARNING,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };
  const Replace = (id) => {
    enableLoading(true);
    console.log(justRef);
    RestApi(
      `organizations/${organization.orgId}/signatures/${showSignatureData?.id || justRef?.current?.id}`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          image: id,
        },
      },
    )
      .then(() => {
        enableLoading(false);
        setOpen(false);
        FetchData();
        //  setFileData();
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };
  React.useEffect(() => {
    console.log(showSignatureData);
    justRef.current = showSignatureData;
  }, [showSignatureData]);

  const ReplaceItems = (e, directFile) => {
    setProgressOpen(!ProgressOpen);
    const file = directFile ? e : e?.target?.files?.[0];
    const url = `${BASE_URL}/direct_uploads`;
    const uploadHere = new DirectUpload(file, url);
    try {
      uploadHere
        .create((error, blob) => {
          if (error) {
            console.log("errr1 val", error);
          } else {
            const id = blob?.signed_id;
            // const name = blob?.filename;
            // setFileData(id);
            Replace(id);
            setProgressOpen(false);
          }
        });
    }
    catch (errVal) {
      console.log("errval", errVal);
    }
  };
  const DeleteSignature = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/signatures/${showSignatureData?.id || justRef?.current?.id}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          active: false,
        },
      },
    )
      .then(() => {
        enableLoading(false);
        setOpen(false);
        setSuccess(true);
        //  setFileData();
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };
  const deleteButton = () => {
    setDialog(open);
    setSuccess(false);
  };
  const SuccessDone = () => {
    setDialog(false);
    setSuccess(false);
    FetchData();
  };

  const fileConversion = async (res) => {
    const resp = JSON.parse(res.detail.value);
    console.log('logoResp', res.detail.value);
    const { base64, filename } = resp;
    let blobValue;

    if (base64) {
      const base64Str = `data:image/jpeg;base64,${base64}`;
      await fetch(base64Str)
        .then(async (fetchRes) => {
          await fetchRes
            .blob()
            .then((blobData) => {
              // const file = new File([blobData], filename, { type: 'image/*' });
              // onFileUpload(file, true);
              blobValue = blobData;
            })
            .catch((e) => console.log('base64 blob err', e));
        })
        .catch((e) => console.log('base64 err', e));

      // const fetchRes = await fetch(base64Str);
      // const blob = await fetchRes.blob();
      // eslint-disable-next-line no-undef
      const file = new File([blobValue], filename, { type: 'image/png' });
      if (resp.type === 'new-upload') onFileUpload(file, true);
      else if (resp.type === 'replace') ReplaceItems(file, true);
    }
  };

  React.useEffect(() => {
    registerEventListeners({
      name: 'signatureDetails',
      method: fileConversion,
    });
    return () =>
      deRegisterEventListener({
        name: 'signatureDetails',
        method: fileConversion,
      });
  }, []);

  // React.useEffect(()=>{
  // FetchData();
  // },[checkBox]);
  return (
    <Mui.Stack className={css.TermsHead}>
      <Mui.Stack className={css.TermsHead1}>
        <Mui.Stack className={css.TermsHead2}>
          {Url === '' ? (
            <Mui.Stack mt={2} className={css.stack} onClick={() => {
              if (device !== 'desktop') JSBridge.browseSignature('new-upload');
            }}>
              <label htmlFor="avatar">
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <img src={download} alt={download} width="81px" />
                  <Mui.Typography className={css.headingSign}>
                    Enter your signature
                  </Mui.Typography>
                </div>
              </label>

              {device === 'desktop' && <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                hidden
                onChange={(e) => {
                  if (
                    !userRolesInvoicing?.Signatures
                      .create_organization_signature
                  ) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  onFileUpload(e);
                }}
              />}
            </Mui.Stack>
          ) : (
            <Mui.Stack mt={2} className={css.stack}>
              <Mui.CardMedia
                component="img"
                src={Url}
                onClick={() => setUrl('')}
                sx={{ width: '300px', height: '250px', mt: 2 }}
              />
            </Mui.Stack>
          )}
        </Mui.Stack>
      </Mui.Stack>
      {device === 'desktop' ? (
        <Mui.Stack className={css.stackTerms}>
          <Mui.Button
            className={css.b1}
            disableTouchRipple
            disableElevation
            disabled={!fileData && Url === ''}
            style={{ opacity: !fileData && Url === '' ? '0.3' : '1' }}
          >
            <div
              className={css.b1txt}
              onClick={() => {
                if (
                  !userRolesInvoicing?.Signatures.create_organization_signature
                ) {
                  setHavePermission({
                    open: true,
                    back: () => {
                      setHavePermission({ open: false });
                    },
                  });
                  return;
                }
                UploadFile();
              }}
            >
              Save
            </div>
          </Mui.Button>
        </Mui.Stack>
      ) : (
        <Mui.Link
          className={css.TermsCond}
          onClick={() => {
            if (!userRolesInvoicing?.Signatures.create_organization_signature) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            UploadFile();
          }}
          style={{
            pointerEvents: !fileData ? 'none' : '',
            opacity: !fileData ? '.5' : '1',
          }}
        >
          save your signature
        </Mui.Link>
      )}
      {/* <Mui.Link className={css.TermsCond}>save your signature</Mui.Link> */}
      {device === 'desktop' ? (
        <Mui.Stack style={{ marginLeft: '0.5rem' }}>
          <Mui.Typography className={css.savedText}>
            saved signatures
          </Mui.Typography>
          <Mui.Grid container pl={2} pt={2}>
            <Mui.Grid item lg={11} md={10}>
              <Mui.Grid container spacing={4}>
                {data
                  ?.filter((c) => c?.active)
                  .map((c) => {
                    return (
                      <Mui.Grid item lg={4}>
                        <Mui.Paper className={css.signCard}>
                          <ModeEditOutlineOutlinedIcon
                            className={css.pencil}
                            onClick={() => {
                              if (
                                !userRolesInvoicing?.Signatures
                                  .edit_organization_signature
                              ) {
                                setHavePermission({
                                  open: true,
                                  back: () => {
                                    setHavePermission({ open: false });
                                  },
                                });
                                return;
                              }
                              ShowSignature(c);
                            }}
                          />
                          <Mui.CardMedia
                            component="img"
                            height="150"
                            image={c?.image_url}
                            alt="green iguana"
                            className={css.cardMedia}
                          />
                        </Mui.Paper>
                      </Mui.Grid>
                    );
                  })}
              </Mui.Grid>
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Stack>
      ) : (
        <Mui.Stack style={{ marginLeft: '0.5rem' }}>
          <Mui.Typography className={css.savedText}>
            saved signatures
          </Mui.Typography>
          <Mui.Stack className={css.stackFlexMobile}>
            <Mui.Grid container spacing={4} pt={2} pb={1}>
              {data?.map((c) => {
                // ?.filter((c) => c?.active)

                return (
                  <Mui.Grid item xs={11} ml={2}>
                    <Mui.Paper className={css.signCard}>
                      <ModeEditOutlineOutlinedIcon
                        className={css.pencil}
                        onClick={() => {
                          if (
                            !userRolesInvoicing?.Signatures
                              .edit_organization_signature
                          ) {
                            setHavePermission({
                              open: true,
                              back: () => {
                                setHavePermission({ open: false });
                              },
                            });
                            return;
                          }
                          ShowSignature(c);
                        }}
                      />
                      <Mui.CardMedia
                        component="img"
                        height="150"
                        image={c?.image_url}
                        alt="green iguana"
                        className={css.cardMedia}
                      />
                    </Mui.Paper>
                  </Mui.Grid>
                );
              })}
            </Mui.Grid>
          </Mui.Stack>
        </Mui.Stack>
      )}
      <Mui.Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: 16,
          },
        }}
      >
        {success ? (
          <Mui.Stack
            className={device === 'desktop' ? css.success : css.successMobile}
            spacing={2}
          >
            <Mui.Typography className={css.font1}>
              Successfully Deleted
            </Mui.Typography>
            <Mui.Typography className={css.font2}>
              Your signature has been successfully deleted.
            </Mui.Typography>
            <Mui.Stack className={css.btnStack}>
              <Mui.Stack className={css.btn2} onClick={() => SuccessDone()}>
                done
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Stack>
        ) : (
          <Mui.Stack
            className={device === 'desktop' ? css.delete : css.deleteMobile}
          >
            <Mui.Typography className={css.font3}>
              Are you sure?{' '}
            </Mui.Typography>
            <Mui.Typography className={css.font2}>
              Do you want to delete your existing signature?
            </Mui.Typography>
            <Mui.Stack direction="row" className={css.btnStack}>
              <Mui.Stack className={css.btn1} onClick={() => setDialog(false)}>
                No
              </Mui.Stack>
              <Mui.Stack className={css.btn2} onClick={() => DeleteSignature()}>
                Yes
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Stack>
        )}
      </Mui.Dialog>
      <SelectBottomSheet
        name="contact"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={open}
        // onTrigger={onTriggerDrawer}
        onClose={() => setOpen(false)}
        maxHeight="45vh"
      >
        <Mui.Stack m={4} className={css.manageStack}>
          <Mui.Typography className={css.headingManage}>
            manage your signature
          </Mui.Typography>
          <Mui.Divider className={css.dividerDot} />
          <Mui.Stack mt={4}>
            <img
              src={showSignatureData?.image_url}
              alt="im"
              height="200px"
              style={{ objectFit: 'contain' }}
            />
          </Mui.Stack>
          <Mui.Stack direction="row" alignItems="center">
            <Checkbox
              checked={checkBox}
              onChange={() => {
                setCheckBox(!checkBox);
                submitMarkedPersonal(
                  showSignatureData?.id,
                  showSignatureData?.image_url,
                  !checkBox,
                );
                setOpen(false);
              }}
            />
            <Mui.Typography
              // onClick={()=>{
              //   submitMarkedPersonal(
              //     console.log(showSignatureData?.id,showSignatureData?.image_url));}
              // }
              className={css.defaultSign}
            >
              set as default signatures
            </Mui.Typography>
          </Mui.Stack>

          <Mui.Stack
            direction="row"
            className={css.buttonSignaturesMobile}
            spacing={2}
          >
            <Mui.Stack onClick={() => {
              if (device !== 'desktop') JSBridge.browseSignature('replace');
            }}>
              <label htmlFor="replace">
                <Mui.Stack className={css.replaceBtn}>Replace</Mui.Stack>
              </label>

              {device === 'desktop' && <input
                type="file"
                id="replace"
                name="avatar"
                accept="image/png, image/jpeg"
                hidden
                onChange={(e) => {
                  if (device === 'desktop') ReplaceItems(e);
                  else JSBridge.browseSignature('replace');
                }}
              />}
            </Mui.Stack>
            <Mui.Stack
              className={css.changeSignBtn}
              onClick={() => deleteButton()}
            >
              Delete Signature
            </Mui.Stack>
          </Mui.Stack>
        </Mui.Stack>
      </SelectBottomSheet>
      <Mui.Dialog
        open={ProgressOpen}
        onClose={() => setProgressOpen(false)}
        PaperProps={{
          sx: {
            width: '1398px',
            height: '678px',
            left: '0px',
            top: ' 0px',
            background: '#F1F0F0',
            border: '1.82299px dashed rgba(153, 158, 165, 0.53)',
            borderRadius: '10px',
          },
        }}
      >
        <Mui.Stack>
          <Mui.Box className={css.cardBox}>
            <Mui.CardMedia
              component="img"
              src={Upload}
              className={css.cardMediaImg}
            />
          </Mui.Box>
          <Mui.Typography align="center" className={css.dialogTypography}>
            Upload In Progress
          </Mui.Typography>
          <Mui.Box className={css.headProgress}>
            <Mui.LinearProgress
              variant="determinate"
              value={progress}
              color="warning"
              className={css.progress}
            />
          </Mui.Box>
        </Mui.Stack>
      </Mui.Dialog>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </Mui.Stack>
  );
};

export default Signature;
