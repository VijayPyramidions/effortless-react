import React from 'react';
import { TrixEditor } from 'react-trix';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as Router from 'react-router-dom';
import * as Mui from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
import { validateRequired } from '@services/Validation.jsx';
import AppContext from '@root/AppContext.jsx';
import Input from '@components/Input/Input.jsx';
import deleteBin from '@assets/binRed.svg';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import * as css from './InvoiceSettings.scss';
import DataGrid from '../../../components/DataGrid/CustomDataGrid';

const IntialValidation_err = { subject: false, body: false, template: false };

const EmailSubjectBody = () => {
  const device = localStorage.getItem('device_detect');
  const { organization, user, openSnackBar, enableLoading, userPermissions } =
    React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const [downloadStatementformat, setDownloadStatementformat] =
    React.useState(false);
  const [mobDelete, setDelete] = React.useState(false);
  const [Data, setData] = React.useState([]);
  const [subject, setSubject] = React.useState({ subject: '' });
  const [body, setBody] = React.useState({ body: '' });
  const [name, setName] = React.useState({ name: '' });
  const [Open, setOpen] = React.useState(false);
  const [EditSingle, setEditSingle] = React.useState({});
  const [create, setCreate] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // if (text !== '') {
    //   setEditSingle(text);
    // }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const Edittemp = (row) => {
    if (!userRolesInvoicing['Email Subject & Body']?.edit_email_templates) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setCreate('');
    setSubject({ subject: row?.subject || EditSingle?.subject });
    setBody({ body: row?.body || EditSingle?.body });
    setName({ name: row?.name || EditSingle?.name });
    handleClose();
    setDownloadStatementformat(true);
  };

  const head = [
    {
      id: 1,
      title: <Mui.Typography>S.NO</Mui.Typography>,
      style: () => ({
        borderTop: '5px solid #f4f5f4',
        borderBottom: '5px solid #f4f5f4',
        borderRadius: ' 5px 0 0 5px',
      }),
      type: 'rowId',
      hideSort: true,
      cellClick: (row) => {
        Edittemp(row);
        setEditSingle(row);
      },
    },
    {
      id: 2,
      title: <Mui.Typography>TEMPLATE NAME</Mui.Typography>,
      value: 'name',
      style: () => ({
        borderTop: '5px solid #f4f5f4',
        borderBottom: '5px solid #f4f5f4',
      }),
      type: 'date',
      hideSort: true,
      cellClick: (row) => {
        Edittemp(row);
        setEditSingle(row);
      },
    },
    {
      id: 3,
      title: <Mui.Typography>SUBJECT</Mui.Typography>,
      value: 'subject',
      style: () => ({
        borderTop: '5px solid #f4f5f4',
        borderBottom: '5px solid #f4f5f4',
      }),
      type: 'string',
      hideSort: true,
      cellClick: (row) => {
        Edittemp(row);
        setEditSingle(row);
      },
    },
    {
      id: 4,
      title: <Mui.Typography>BODY</Mui.Typography>,
      value: 'body',
      style: () => ({
        borderTop: '5px solid #f4f5f4',
        borderBottom: '5px solid #f4f5f4',
      }),
      type: 'string',
      hideSort: true,
      displayVal: (v) => {
        return <div style={{ height: '22px', overflow: 'hidden' } }><span dangerouslySetInnerHTML={{ __html: v }} /></div>;
      },
      cellClick: (row) => {
        Edittemp(row);
        setEditSingle(row);
      },
    },
    {
      id: 5,
      title: '',
      cellClick: (row) => setEditSingle(row),
      icon: (
        <>
          <Mui.IconButton onClick={handleClick}>
            <MuiIcons.MoreVert />
          </Mui.IconButton>
        </>
      ),
      style: () => ({
        borderTop: '5px solid #f4f5f4',
        borderBottom: '5px solid #f4f5f4',
        borderRadius: '0 5px 5px 0',
        display: 'flex',
        justifyContent: 'end',
      }),
      type: 'icon',
      hideSort: true,
    },
  ];
  const FetchData = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/email_templates?active=true&show_default=true&mail_type=Invoice`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        setData(res.data);
        enableLoading(false);
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
    FetchData();
  }, []);

  const onClosed = () => {
    setCreate('');
    setSubject({ subject: '' });
    setBody({ body: '' });
    setName({ name: '' });
    setDownloadStatementformat(false);
  };
  const handleSave = () => {
    if (create === 'create') {
      enableLoading(true);
      RestApi(`organizations/${organization.orgId}/email_templates`, {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          name: name?.name,
          mail_type: 'Invoice',
          subject: subject?.subject,
          body: body?.body,
        },
      })
        .then((res) => {
          enableLoading(false);
          if (res && !res.error && res?.created_at) {
            openSnackBar({
              message: `Created Successfully`,
              type: MESSAGE_TYPE.INFO,
            });
            setCreate('');
            FetchData();
            onClosed();
          } else {
            openSnackBar({
              message: res?.errors ? Object.values(res?.errors).join() : res?.message,
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch((res) => {
          enableLoading(false);
          openSnackBar({
            message: res?.errors ? Object.values(res?.errors).join() : res?.message,
            type: MESSAGE_TYPE.INFO,
          });
        });
    } else {
      // eslint-disable-next-line no-lonely-if
      if (EditSingle?.id) {
        enableLoading(true);
        RestApi(
          `organizations/${organization.orgId}/email_templates/${EditSingle?.id}`,
          {
            method: METHOD.PATCH,
            headers: {
              Authorization: `Bearer ${user.activeToken}`,
            },
            payload: {
              name: name?.name,
              mail_type: EditSingle?.mail_type,
              subject: subject?.subject,
              body: body?.body,
            },
          },
        )
          .then((res) => {
            enableLoading(false);
            if (res && !res.error) {
              openSnackBar({
                message: `Edited Successfully`,
                type: MESSAGE_TYPE.INFO,
              });
              FetchData();
              onClosed();
            } else {
              openSnackBar({
                message: Object.values(res?.errors).join(),
                type: MESSAGE_TYPE.ERROR,
              });
            }
          })
          .catch((res) => {
            enableLoading(false);
            openSnackBar({
              message: Object.values(res?.errors).join(),
              type: MESSAGE_TYPE.INFO,
            });
          });
      } else if (!EditSingle?.id) {
        openSnackBar({
          message: "Sorry Default Value can't be edited",
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
        // FetchData();
        onClosed();
      }
    }
  };
  const handleBack = () => {
    setEditSingle({});
    onClosed();
    setDownloadStatementformat(false);
  };
  const DeleteTemp = () => {
    if (!userRolesInvoicing['Email Subject & Body']?.delete_email_templates) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    handleClose();
    setOpen(true);
  };
  const Delete = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/email_templates/${EditSingle?.id}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: `Deleted Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
          FetchData();
          setDelete(false);
          setOpen(false);
        } else {
          openSnackBar({
            message: res?.errors?.name,
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.errors?.name,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };
  const MobileHandle = (text) => {
    setSubject({ subject: text?.subject });
    setBody({ body: text?.body });
    setName({ name: text?.name });
    setDownloadStatementformat(true);
  };
  const DeleteBin = () => {
    setDelete(true);
  };
  return (
    <>
      <Mui.Box sx={{ width: '100%' }}>
        <>
          {device === 'desktop' ? (
            <DataGrid
              bodyData={Data}
              headData={head}
              rowStyle={{
                backgroundColor: '#ffffff',
                border: '3px solid blue',
              }}
              rowHeight={60}
              tableStyle={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                borderRadius: '20px',
                '&::-webkit-scrollbar': { width: '0px' },
              }}
            />
          ) : (
            <MobileTable
              data={Data}
              MobileHandle={MobileHandle}
              DeleteBin={DeleteBin}
              mobDelete={mobDelete}
              setDelete={setDelete}
              setOpen={setOpen}
              Delete={Delete}
              setEditSingle={setEditSingle}
              userRolesInvoicing={userRolesInvoicing}
              setHavePermission={setHavePermission}
            />
          )}
          <Mui.Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Mui.Typography
              sx={{ p: 1, cursor: 'pointer', fontSize: '16px' }}
              onClick={() => {
                Edittemp();
              }}
            >
              Edit this Template
            </Mui.Typography>
            {!EditSingle?.default && (
              <Mui.Typography
                sx={{
                  p: 1,
                  color: '#B94747',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={DeleteTemp}
              >
                Delete this Template
              </Mui.Typography>
            )}
          </Mui.Popover>
        </>

        <Create
          name={name}
          body={body}
          device={device}
          setName={setName}
          subject={subject}
          setBody={setBody}
          onClosed={onClosed}
          setCreate={setCreate}
          setSubject={setSubject}
          handleSave={handleSave}
          handleBack={handleBack}
          downloadStatementformat={downloadStatementformat}
          setDownloadStatementformat={setDownloadStatementformat}
          EditSingle={EditSingle}
          setEditSingle={setEditSingle}
          userRolesInvoicing={userRolesInvoicing}
          setHavePermission={setHavePermission}
        />
        <Mui.Dialog
          open={Open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
            },
          }}
        >
          <Mui.DialogContent p={4}>
            <Mui.Typography align="left" fontWeight="bolder" variant="h5">
              Are You Sure ?
            </Mui.Typography>
            <Mui.Typography
              align="left"
              fontWeight="bolder"
              variant="body2"
              color="#283049BF"
              mt={2}
            >
              Do you want to delete this Email Template ?
            </Mui.Typography>
            <Mui.Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
              display="flex"
              mt={2}
            >
              <Mui.Button
                className={css.btnBack1}
                onClick={() => setOpen(false)}
              >
                <Mui.Typography className={css.btntxt1}>no</Mui.Typography>
              </Mui.Button>
              <Mui.Button className={css.btnBack} onClick={() => Delete()}>
                <Mui.Typography className={css.btntxt}>yes</Mui.Typography>
              </Mui.Button>
            </Mui.Stack>
          </Mui.DialogContent>
        </Mui.Dialog>
      </Mui.Box>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default EmailSubjectBody;

const Create = ({
  name,
  body,
  device,
  setName,
  setBody,
  subject,
  onClosed,
  setCreate,
  setSubject,
  handleSave,
  handleBack,
  downloadStatementformat,
  setDownloadStatementformat,
  EditSingle,
  setEditSingle,
  userRolesInvoicing,
  setHavePermission,
}) => {
  const [validationErr, setValidationErr] = React.useState(IntialValidation_err);

  const reValidate = (e) => {
    const e_name = e?.target?.name;
    const e_value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [e_name]: !validateRequired(e_value) }));
  };

  const validateAllFields = () => {
    return {
      subject: !validateRequired(subject?.subject),
      body: !validateRequired(body?.body),
      template: !validateRequired(name?.name)
    };
  };

  const onCreateTemp = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    if (valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      handleSave();
    }
  };

  return (
    <>
      <Mui.Stack
        direction="row"
        justifyContent="center"
        className={css.CreateBtn}
      >
        {device === 'desktop' ? (
          <Mui.Button
            className={css.BTN}
            onClick={() => {
              if (
                !userRolesInvoicing['Email Subject & Body']
                  ?.create_email_templates
              ) {
                setHavePermission({
                  open: true,
                  back: () => {
                    setHavePermission({ open: false });
                  },
                });
                return;
              }
              setCreate('create');
              setEditSingle({});
              setDownloadStatementformat(true);
            }}
          >
            Create A New Template
          </Mui.Button>
        ) : (
          ''
        )}
      </Mui.Stack>
      {device !== 'desktop' ? (
        <Mui.Button
          className={css.submitButton}
          onClick={() => {
            if (
              !userRolesInvoicing['Email Subject & Body']
                ?.create_email_templates
            ) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            setCreate('create');
            setDownloadStatementformat(true);
            setEditSingle({});
          }}
        >
          Create A New Template
        </Mui.Button>
      ) : (
        ''
      )}
      <SelectBottomSheet
        open={downloadStatementformat}
        onClose={() => {
          onClosed();
          setValidationErr(IntialValidation_err);
        }}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <>
          <Mui.Stack className={css.TermsHeadEmail} pl={2}>
            <Mui.Grid container>
              <Mui.Grid xs={12} mt={2}>
                <Input
                  type="text"
                  label="subject"
                  variant="standard"
                  name="subject"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={(e) => {
                    e.persist();
                    reValidate(e);
                    setSubject((prev) => ({
                      ...prev,
                      subject: e?.target?.value,
                    }));
                  }}
                  onBlur={reValidate}
                  value={subject?.subject}
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  required
                  disabled={EditSingle?.id === 'default'}
                  error={validationErr?.subject}
                  helperText={validationErr?.subject ? "Enter Subject Text" : ''}
                />
              </Mui.Grid>
              <Mui.Grid
                item
                xs={12}
                mt={3}
                className={`${css.gridDeliver} ${css.bodyDeliver}`}
                style={{
                  pointerEvents: EditSingle?.id === 'default' ? 'none' : '',
                }}
              >
                <p className={css.paraDeliver} style={{color: validationErr?.body ? '#F00' : '#000'}}>
                  Body <span className={css.spanDeliver}>*</span>{' '}
                </p>
                <TrixEditor
                  className={css.trixEditor}
                  placeholder="Type your body here..."
                  value={body?.body}
                  onChange={(e) => {
                    setValidationErr((s) => ({ ...s, body: e?.length === 0 }));
                    setBody((prev) => ({ ...prev, body: e }));
                  }}
                />
              </Mui.Grid>
                {validationErr?.body && <p style={{fontSize: '.5rem', paddingLeft: 8, color: '#F00'}}>Enter Body Text</p>}
              <Mui.Grid item xs={12} mt={2}>
                <Input
                  type="text"
                  label="Template Name"
                  variant="standard"
                  name="template"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={(e) => {
                    e.persist();
                    reValidate(e);
                    setName((prev) => ({ ...prev, name: e?.target?.value }));
                  }}
                  onBlur={reValidate}
                  value={name?.name}
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  required
                  disabled={EditSingle?.id === 'default'}
                  error={validationErr?.template}
                  helperText={validationErr?.template ? "Enter Template Name" : ''}
                />
              </Mui.Grid>
            </Mui.Grid>

            {EditSingle?.id === null && (
              <div>
                <p>
                  <strong>Note:</strong> This is the default template, so you
                  can`t make any changes.
                </p>
              </div>
            )}

            <Mui.Stack
              direction="row"
              display="flex"
              justifyContent="space-between"
              spacing={2}
              mb={3}
              mt={3}
            >
              <Mui.Button className={css.btnBack1} onClick={() => {
                handleBack();
                setValidationErr(IntialValidation_err);
              }}>
                <Mui.Typography className={css.btntxt1}>Back</Mui.Typography>
              </Mui.Button>
              {EditSingle?.id !== null && (
                <Mui.Button className={css.btnBack} onClick={onCreateTemp}>
                  <Mui.Typography className={css.btntxt}>
                    Save and Finish
                  </Mui.Typography>
                </Mui.Button>
              )}
            </Mui.Stack>
          </Mui.Stack>
        </>
      </SelectBottomSheet>
    </>
  );
};

export const MobileTable = ({
  MobileHandle,
  data,
  Delete,
  DeleteBin,
  setDelete,
  mobDelete,
  setEditSingle,
  userRolesInvoicing,
  setHavePermission,
}) => {
  return (
    <>
      <>
        <Mui.Box className={css.mobhead}>
          <Mui.Typography className={css.mobtypo}>
            Email Subject & Body
          </Mui.Typography>
        </Mui.Box>
        {data?.map((text, i) => {
          return (
            <Mui.Box sx={{ overflow: 'auto' }}>
              <Mui.Box className={i % 2 === 0 ? css.GridBox1 : css.GridBox}>
                <Mui.Grid container className={css.GridContainer}>
                  <Mui.Grid
                    item
                    xs={4}
                    onClick={() => {
                      if (
                        !userRolesInvoicing['Email Subject & Body']
                          ?.edit_email_templates
                      ) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      setEditSingle(text);
                      MobileHandle(text);
                    }}
                  >
                    <Mui.Typography className={css.GridTypography}>
                      Template Name
                    </Mui.Typography>
                    <Mui.Typography className={css.GridTypography}>
                      subject
                    </Mui.Typography>
                  </Mui.Grid>
                  <Mui.Grid
                    item
                    xs={4}
                    onClick={() => {
                      if (
                        !userRolesInvoicing['Email Subject & Body']
                          ?.edit_email_templates
                      ) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      setEditSingle(text);
                      MobileHandle(text);
                    }}
                  >
                    <Mui.Typography
                      fontWeight="bolder"
                      noWrap
                      className={css.GridTextTypography}
                    >
                      {text.name}
                    </Mui.Typography>
                    <Mui.Typography
                      fontWeight="bolder"
                      noWrap
                      className={css.GridTextTypography}
                    >
                      {text.subject}
                    </Mui.Typography>
                  </Mui.Grid>
                  {!text?.default && (
                    <Mui.Grid
                      item
                      xs={4}
                      className={css.GridIcon}
                      onClick={() => {
                        if (
                          !userRolesInvoicing['Email Subject & Body']
                            ?.delete_email_templates
                        ) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        setEditSingle(text);
                        DeleteBin();
                      }}
                    >
                      <img src={deleteBin} alt="delete" />
                    </Mui.Grid>
                  )}
                </Mui.Grid>
              </Mui.Box>
            </Mui.Box>
          );
        })}
      </>
      <SelectBottomSheet
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
        open={mobDelete}
        onClose={() => setDelete(false)}
      >
        <Mui.Stack sx={{ p: '20px' }}>
          <Mui.Typography align="left" fontWeight="bolder" variant="h5">
            Are You Sure ?
          </Mui.Typography>
          <Mui.Typography
            align="left"
            fontWeight="bolder"
            variant="body2"
            color="#283049BF"
            mt={2}
          >
            Do you want to delete this Email Template ?
          </Mui.Typography>
          <Mui.Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            display="flex"
            mt={2}
          >
            <Mui.Button
              className={css.btnBack1}
              onClick={() => setDelete(false)}
            >
              <Mui.Typography className={css.btntxt1}>no</Mui.Typography>
            </Mui.Button>
            <Mui.Button className={css.btnBack} onClick={() => Delete()}>
              <Mui.Typography className={css.btntxt}>yes</Mui.Typography>
            </Mui.Button>
          </Mui.Stack>
        </Mui.Stack>
      </SelectBottomSheet>
    </>
  );
};
