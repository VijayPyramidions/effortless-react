import React, { useState } from 'react';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as Router from 'react-router-dom';
import AppContext from '@root/AppContext.jsx';
import { Stack } from '@mui/material';
// import { makeStyles } from '@material-ui/core/styles';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import closeIcon from '@assets/eva_close-outline.svg';
import * as Mui from '@mui/material';
import Input from '@components/Input/Input.jsx';
import { validateRequired } from '@services/Validation.jsx';
import * as css from './InvoiceSettings.scss';
import SelectBottomSheet from '../../../components/SelectBottomSheet/SelectBottomSheet';

// const useStyles = makeStyles(() => ({
//   switch: {
//     color: 'green',
//   },
// }));

function ContactDetailsOnInvoice() {
  const { organization, user, openSnackBar, enableLoading, userPermissions } =
    React.useContext(AppContext);
  const [customFiels, setCustomField] = useState(false);
  const [data, setData] = useState();
  const [editValue, setEditValue] = useState(false);
  const initialState = {
    fieldName: '',
    defaultValue: '',
    itemId: '',
  };
  const [fieldState, setFieldState] = React.useState(initialState);
  const navigate = Router.useNavigate();

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

  // const classes = useStyles();
  const VALIDATION = {
    fieldName: {
      errMsg: 'Enter Custom Field Name',
      test: validateRequired,
    },
  };

  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const validateAllFields = (stateParam) => {
    const stateData = stateParam || fieldState;
    return Object.keys(VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };

  const reValidate = (e) => {
    const name = e?.target?.name;
    const values = e?.target?.value;
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(values),
    }));
  };
  const onInputChange = (e) => {
    const name = e?.target?.name;
    const values = e?.target?.value;
    reValidate(e);

    setFieldState((s) => ({
      ...s,
      [name]: values,
    }));
  };
  const openDrawer = () => {
    setCustomField(true);
  };
  const NewField = () => {
    setValidationErr(initialValidationErr);
    setEditValue(false);
    setFieldState((s) => ({
      ...s,
      fieldName: '',
      defaultValue: '',
      itemId: '',
    }));
    setCustomField(true);
  };

  const closeDrawer = () => {
    setCustomField(false);
  };

  const device = localStorage.getItem('device_detect');
  const FetchData = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/invoice_custom_fields`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        setData(res.data);
        if (res?.error) {
          openSnackBar({
            message: res?.errors?.base || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((err) => {
        enableLoading(false);
        openSnackBar({
          message: err?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };
  const EditCustomField = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/invoice_custom_fields/${fieldState?.itemId} `,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          default_value: fieldState?.defaultValue,
          name: fieldState?.fieldName,
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
          closeDrawer();
        }
        if (res?.error) {
          openSnackBar({
            message:
              Object.values(res.errors).join() || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        setFieldState((s) => ({
          ...s,
          fieldName: '',
          defaultValue: '',
          itemId: '',
        }));
        setEditValue(false);
      })
      .catch((err) => {
        enableLoading(false);
        openSnackBar({
          message:
            Object.values(err.errors).join() ||
            err?.message ||
            'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };
  const AddCustomField = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/invoice_custom_fields?name=${fieldState?.fieldName}&default_value=${fieldState?.defaultValue} `,

      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: `Created Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
          FetchData();
          setFieldState((s) => ({
            ...s,
            fieldName: '',
            defaultValue: '',
            itemId: '',
          }));
          if (device === 'mobile') {
            closeDrawer();
          }
        } else {
          openSnackBar({
            message:
              Object.values(res.errors).join() ||
              res?.message ||
              'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message:
            Object.values(res.errors).join() ||
            res?.message ||
            'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const Valid = (call) => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    }
    if (valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      if (call === 'add') {
        AddCustomField();
      }
      if (call === 'edit') {
        EditCustomField();
      }
    }
  };

  React.useEffect(() => {
    FetchData();
  }, []);
  const SelectItem = (item) => {
    setEditValue(true);
    openDrawer();
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/invoice_custom_fields/${item.id}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        setFieldState((s) => ({
          ...s,
          fieldName: res?.name,
          defaultValue: res?.default_value,
          itemId: item?.id,
        }));
        if (res?.error) {
          openSnackBar({
            message:
              Object.values(res.errors).join() ||
              res?.message ||
              'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message:
            Object.values(res.errors).join() ||
            res?.message ||
            `Unknown Error Occured`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };
  const update = (id, bool) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/invoice_custom_fields/${id}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        active: bool,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: `Edited Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
          FetchData();
        }
        if (res?.error) {
          openSnackBar({
            message:
              Object.values(res.errors).join() ||
              res?.message ||
              'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message:
            Object.values(res.errors).join() ||
            res?.message ||
            `Unknown Error Occured`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };
  const ToggleSet = (c) => {
    update(c?.id, !c?.active);
  };

  return (
    <div
      className={
        device === 'desktop'
          ? css.contactDetailsOnInvoiceContainerDesktop
          : css.contactDetailsOnInvoiceContainer
      }
    >
      <div className={css.card}>
        {data?.map((c) => {
          return (
            <>
              <Mui.Stack direction="row" justifyContent="space-between">
                <Mui.Typography
                  className={css.lable}
                  onClick={() => {
                    if (
                      !userRolesInvoicing['Custom Fields'].edit_custom_fields
                    ) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    SelectItem(c);
                  }}
                >
                  {c.name}
                </Mui.Typography>
                <ToggleSwitch
                  onChange={() => {
                    if (
                      !userRolesInvoicing['Custom Fields'].edit_custom_fields
                    ) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    ToggleSet(c);
                  }}
                  checked={c?.active}
                  // classes={{
                  //   colorPrimary: classes.switch,
                  // }}
                />
              </Mui.Stack>
              <div
                className={
                  device === 'desktop' ? css.dividerDesktop : css.divider
                }
              >
                <Mui.Divider />
              </div>
            </>
          );
        })}
        {device === 'desktop' && (
          <div className={css.stack1}>
            <div className={css.h1}>Add a custom field</div>
            <div>
              <Input
                name="fieldName"
                label="Enter the Custom Field"
                variant="standard"
                onBlur={reValidate}
                error={validationErr.fieldName}
                helperText={
                  validationErr.fieldName ? VALIDATION?.fieldName?.errMsg : ''
                }
                fullWidth
                theme="light"
                InputLabelProps={{
                  shrink: true,
                }}
                className={css.inputDesk}
                onChange={onInputChange}
                value={fieldState?.fieldName}
                disabled={editValue}
              />
            </div>
            <div>
              <Input
                name="defaultValue"
                label="Set Default Value"
                variant="standard"
                fullWidth
                theme="light"
                InputLabelProps={{
                  shrink: true,
                }}
                className={css.inputDesk}
                onChange={onInputChange}
                value={fieldState?.defaultValue || ''}
              />
            </div>
            <div className={css.bStack}>
              <Mui.Button
                className={css.b1}
                onClick={() => {
                  if (
                    !userRolesInvoicing['Custom Fields'].create_custom_fields
                  ) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  Valid(editValue ? 'edit' : 'add');
                }}
                disableTouchRipple
                disableElevation
              >
                <div className={css.b1txt}>
                  {editValue ? 'Edit This Field' : 'Create New Field'}
                </div>
              </Mui.Button>
            </div>
          </div>
        )}
      </div>
      {device === 'mobile' && (
        <div className={css.addCustomFields}>
          <div
            className={css.addCustomFieldslable}
            onClick={() => {
              if (!userRolesInvoicing['Custom Fields'].create_custom_fields) {
                setHavePermission({
                  open: true,
                  back: () => {
                    setHavePermission({ open: false });
                  },
                });
                return;
              }
              NewField();
            }}
          >
            Add Custom Field
          </div>
          <SelectBottomSheet
            anchor="bottom"
            variant="temporary"
            open={customFiels}
            onClose={closeDrawer}
            addNewSheet
            triggerComponent={<div style={{ display: 'none' }} />}
          >
            <>
              <Stack className={css.styledDrawerWrapper} spacing={2}>
                <div className={css.headerContainer}>
                  <div className={css.lable}>
                    {editValue
                      ? 'EDIT THIS CUSTOM FIELD'
                      : 'ADD A CUSTOM FIELD'}
                  </div>
                  <div className={css.imageWrapper} onClick={closeDrawer}>
                    <img className={css.image} src={closeIcon} alt="close" />
                  </div>
                </div>
                <Input
                  name="fieldName"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  onBlur={reValidate}
                  error={validationErr.fieldName}
                  helperText={
                    validationErr.fieldName ? VALIDATION?.fieldName?.errMsg : ''
                  }
                  label="Enter Field Name"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  value={fieldState?.fieldName}
                  disabled={editValue}
                />
                <Input
                  name="defaultValue"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  onBlur={reValidate}
                  error={validationErr.defaultValue}
                  helperText={
                    validationErr.defaultValue
                      ? VALIDATION?.defaultValue?.errMsg
                      : ''
                  }
                  label="Set Default Value"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  value={fieldState?.defaultValue || ''}
                />
                <Mui.Button
                  onClick={() => Valid(editValue ? 'edit' : 'add')}
                  className={css.Btn}
                  disableTouchRipple
                  disableElevation
                >
                  <Mui.Typography className={css.BtnMobile}>
                    {editValue ? 'Edit This Field' : 'Add New Field'}
                  </Mui.Typography>
                </Mui.Button>
              </Stack>
            </>
          </SelectBottomSheet>
        </div>
      )}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
}

export default ContactDetailsOnInvoice;
