import React, { useState } from 'react';
import Input from '@components/Input/Input.jsx';
import Grid from '@material-ui/core/Grid';
import * as Mui from '@mui/material';
import Select, { MultipleSelect } from '@components/Select/Select.jsx';
import additionalSettings from '@assets/add.svg';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TrixEditor } from 'react-trix';
import 'trix/dist/trix';
import 'trix/dist/trix.css';
import { Button } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import {
  validateEmail,
  validateName,
  validateRequired,
} from '@services/Validation.jsx';
import * as css from './Ageing.scss';

const VALIDATION = {
  to: {
    errMsg: 'Please provide valid email',
    test: validateRequired,
  },
  subject: {
    errMsg: 'Please provide valid Subject',
    test: validateRequired,
  },
  // subject: {
  //   errMsg: 'Please provide valid Email',
  //   test: validateRequired,
  // },
};

const VALIDATOR = {
  contactName: (v) => validateName(v),
  mobileNo: (v) => validateRequired(v),
  email: (v) => validateEmail(v),
};

const ValidationErrMsg = {
  contactName: 'Please provide valid name',
  mobileNo: 'Please provide valid Mobile no.',
  email: 'Please provide valid Email',
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const RequestPayment = ({ customer_id, setRequestPayment, FetchFun }) => {
  const { organization, enableLoading, user, openSnackBar, currentUserInfo } =
    React.useContext(AppContext);
  const [value, setValue] = React.useState({
    to: [],
    cc: '',
    subject: '',
    body: '',
    name: '',
    // payment: true,
    // invoice: false
  });
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [sendToAddrList, setSendToAddrList] = React.useState([
    {
      payload: 'email',
      text: 'email',
    },
  ]);
  const [template, setTemplate] = React.useState({ list: [], selected: {} });
  const [drawer, setDrawer] = React.useState({
    addContact: false,
  });
  const [contactName, setContactName] = React.useState('');
  const [mobileNo, setMobileNo] = React.useState('');
  const [email, setEmail] = React.useState('');

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  const validateContactFields = () => {
    return {
      contactName: !VALIDATOR?.contactName?.(contactName),
      mobileNo: !VALIDATOR?.mobileNo?.(mobileNo),
      email: !VALIDATOR?.email?.(email),
    };
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      if (v === 'to') {
        a[v] = !validationData?.[v]?.test(value[v]?.[0] || '');
        return a;
      }
      a[v] = !validationData?.[v]?.test(value[v]);
      return a;
    }, {});
  };
  const getEventNameValue = (e) => {
    const name = e?.target?.name;
    const data =
      e?.target?.type === 'checkbox' ? e?.target?.checked : e?.target?.value;
    return [name, data];
  };
  const reValidate = (e) => {
    const [name, data] = getEventNameValue(e);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(data),
    }));
  };

  const reValidateContact = (e) => {
    const name = e?.target?.name;
    const contactValue = e?.target?.value;
    setValidationErr((s) => ({
      ...s,
      [name]: !VALIDATOR?.[name]?.(contactValue),
    }));
  };

  const onInputChange = (e) => {
    reValidate(e);
    const [name, data] = getEventNameValue(e);
    setValue((s) => ({ ...s, [name]: data }));
  };

  const onInputChangeContact = (setter) => (e) => {
    reValidate(e);
    setter(e.target.value);
  };

  React.useEffect(() => {
    const element = document.querySelector('trix-editor');
    element.editor.setSelectedRange([0, value?.body?.length]);
    element.editor.deleteInDirection('forward');

    const temp = template?.response?.find(
      (val) => val?.name === template?.selected,
    );
    setValue((prev) => ({
      ...prev,
      subject: temp?.subject,
      body: temp?.body,
    }));
    element.editor.insertHTML(temp?.body);
  }, [template?.selected]);

  const handleChange = (e) => {
    setValue((prev) => ({
      ...prev,
      body: e,
    }));
  };

  const device = localStorage.getItem('device_detect');

  const handleDelete = (values) => {
    const filteredArray = value?.to?.filter((item) => item !== values);
    setValue((prev) => ({ ...prev, to: [...filteredArray] }));
  };

  const handleTemplate = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/email_templates?mail_type=Outstanding&show_default=true&customer_id=${customer_id}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (!res?.errors) {
        setTemplate({
          list: res?.data?.map((val) => ({
            payload: val?.name,
            text: val?.name,
          })),
          selected: res?.data[0]?.name,
          response: res?.data,
        });
      } else {
        openSnackBar({
          message: res?.message || 'Body Null',
          type: MESSAGE_TYPE.ERROR,
        });
      }
      enableLoading(false);
    });
  };

  const fetchContactByCustomer = (s_ids) => {
    enableLoading(true);

    RestApi(
      `organizations/${organization.orgId}/customers/${customer_id}/contacts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setSendToAddrList(
          res?.data?.map((s) => ({
            payload: s.email,
            text: s.email,
          })),
        );
        if (!s_ids) {
          setValue((prev) => ({
            ...prev,
            to: res?.data?.map((s) => s.email),
          }));
        }
        if (s_ids) {
          setValue((prev) => ({
            ...prev,
            to: [...prev.to, res?.data?.find((s) => s.id === s_ids)?.email],
          }));
        }
        setValue((prev) => ({
          ...prev,
          cc: currentUserInfo?.email,
          name: res?.data?.[0]?.name,
        }));
      }
      enableLoading(false);
    });
    enableLoading(false);
  };

  React.useEffect(() => {
    handleTemplate();
    fetchContactByCustomer();
  }, []);

  const resetValue = () => {
    setContactName('');
    setMobileNo('');
    setEmail('');
  };

  const createCustomerContact = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendors/${customer_id}/contacts`,
      {
        method: METHOD.POST,
        payload: {
          name: contactName,
          email,
          mobile_number: mobileNo,
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          fetchContactByCustomer(res?.id);
          handleBottomSheet('addContact');
          resetValue();
          openSnackBar({
            message: `${res?.name} added Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res.errors) {
          openSnackBar({
            message: Object.values(res.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
      });
    enableLoading(false);
  };

  const handleClick = () => {
    const { name, ...params } = value;
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/request_payment_email_notifications`,
      {
        method: METHOD.POST,
        payload: {
          ...params,
          customer_id,
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.errors) {
          openSnackBar({
            message: `Your Invoices was delivered to ${value?.name}`,
            type: MESSAGE_TYPE.INFO,
          });

          if (FetchFun) {
            FetchFun();
          }

          setRequestPayment(false);
        } else if (res && res.errors) {
          openSnackBar({
            message: Object.values(res.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
          setRequestPayment(false);
        } else {
          openSnackBar({
            message: `We were unable to deliver your invoice to  ${value?.name}.`,
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Something Went Wrong`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  return (
    <div className={css.bodyContent}>
      {device === 'mobile' ? (
        <div className={css.valueHeader}>Request Payment</div>
      ) : (
        <></>
      )}
      <div
        className={
          device === 'mobile' ? css.addCustomerContainer : css.centerDivWeb
        }
      >
        {device !== 'mobile' ? (
          <Mui.Stack direction="row" justifyContent="space-between">
            <Mui.Typography className={css.ageingTitle}>
              Request Payment
            </Mui.Typography>
          </Mui.Stack>
        ) : (
          ''
        )}
        <Grid
          container
          spacing={4}
          className={device === 'mobile' ? '' : css.addCustomerContainer2}
        >
          <Grid item xs={12} style={{ position: 'relative' }}>
            <MultipleSelect
              name="to"
              label="To"
              options={sendToAddrList}
              defaultValue={value?.to}
              onBlur={reValidate}
              error={validationErr.to}
              helperText={validationErr.to ? VALIDATION?.to?.errMsg : ''}
              onChange={onInputChange}
              fullWidth
              theme="light"
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              variant="standard"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              onClose
              multiple
              open
              value={value?.to}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected?.map((val) => (
                    <Chip
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                      key={val}
                      label={val}
                      onDelete={() => handleDelete(val)}
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.08) !important',
                        borderRadius: '16px !important'
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              IconComponent={() => <></>}
              required
            />
            <SelectBottomSheet
              name="addContact"
              triggerComponent={
                <input
                  type="image"
                  src={additionalSettings}
                  alt="settings"
                  className={css.addIcon}
                  // style={{ width: c.width }}
                  onClick={() => {
                    resetValue();
                    onTriggerDrawer('addContact');
                  }}
                />
              }
              open={drawer.addContact}
              onTrigger={onTriggerDrawer}
              onClose={handleBottomSheet}
              maxHeight="45vh"
              addNewSheet
            >
              <div className={css.CreateCustomerDialogContainer}>
                <div className={css.valueHeader}>Add New Contact</div>

                <div className={css.addCustomerContainerNew}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} style={{ position: 'relative' }}>
                      <Input
                        name="contactName"
                        onBlur={reValidateContact}
                        error={validationErr.contactName}
                        helperText={
                          validationErr.contactName
                            ? ValidationErrMsg.contactName
                            : ''
                        }
                        label="Contact Name"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        rootStyle={{
                          border: '1px solid #A0A4AF',
                        }}
                        fullWidth
                        onChange={onInputChangeContact(setContactName)}
                        theme="light"
                        value={contactName}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Input
                        name="mobileNo"
                        onBlur={reValidateContact}
                        error={validationErr.mobileNo}
                        helperText={
                          validationErr.mobileNo
                            ? ValidationErrMsg.mobileNo
                            : ''
                        }
                        label="Contact Phone Number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        rootStyle={{ border: '1px solid #A0A4AF' }}
                        inputProps={{
                          type: 'tel',
                        }}
                        fullWidth
                        onChange={onInputChangeContact(setMobileNo)}
                        theme="light"
                        value={mobileNo}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Input
                        name="email"
                        onBlur={reValidateContact}
                        error={validationErr.email}
                        helperText={
                          validationErr.email ? ValidationErrMsg.email : ''
                        }
                        label="Contact Email ID"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        rootStyle={{
                          border: '1px solid #A0A4AF',
                        }}
                        fullWidth
                        onChange={onInputChangeContact(setEmail)}
                        theme="light"
                        value={email}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <div className={css.addCustomerFooter}>
                        <Button
                          variant="contained"
                          className={css.primary}
                          style={{ padding: 15, textTransform: 'initial' }}
                          onClick={() => {
                            const v = validateContactFields();
                            const valid = Object.values(v).every((val) => !val);

                            if (!valid) {
                              setValidationErr((s) => ({ ...s, ...v }));
                              return false;
                            }
                            createCustomerContact();
                            return true;
                          }}
                        >
                          Save and Finish
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </SelectBottomSheet>
          </Grid>

          <Grid item xs={12}>
            <Input
              name="cc"
              // onBlur={}
              // error={}
              // helperText={}
              label="Cc"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={value.cc}
              onChange={onInputChange}
              // onChange={}
              theme="light"
              multiline
              rows={2}
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
            />
            <p style={{ margin: '5px 5px 0', fontSize: 10 }}>
              Note: User needs to add comma (,) to Type a New Email ID
            </p>
          </Grid>

          <Grid item xs={12} className={css.gridDeliver}>
            <Select
              label="Select Template"
              options={template?.list}
              defaultValue={template?.selected || ''}
              onChange={(e) =>
                setTemplate((prev) => ({ ...prev, selected: e?.target?.value }))
              }
              fullWidth
              theme="light"
              variant="standard"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name="subject"
              onBlur={reValidate}
              error={validationErr.subject}
              helperText={
                validationErr.subject ? VALIDATION?.subject?.errMsg : ''
              }
              label="Subject"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={value.subject}
              onChange={onInputChange}
              theme="light"
              multiline
              rows={2}
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
            />
          </Grid>

          <Grid item xs={12} className={`${css.gridDeliver}`}>
            <div className={` ${css.bodyDeliver}`}>
              <p className={css.paraDeliver}>
                Body<span className={css.spanDeliver}>*</span>
              </p>

              <TrixEditor
                id="trixEditor"
                className={css.trixEditor}
                // autoFocus={true}
                placeholder="Body Content"
                value={value.body !== null ? value?.body : ''}
                // uploadURL="https://domain.com/imgupload/receiving/post"
                // uploadData={{ key1: "value", key2: "value" }}
                // mergeTags={mergeTags}
                onChange={handleChange}
                // onEditorReady={handleEditorReady}
              />
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              // alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <br />
            <Button
              variant="contained"
              className={
                device === 'mobile' ? css.submitButton : css.submitButton2
              }
              fullWidth
              disableElevation
              disableTouchRipple
              style={{ marginLeft: device === 'mobile' ? '50%' : '75%' }}
              onClick={() => {
                const v = validateAllFields(VALIDATION);
                const valid = Object.values(v).every((val) => !val);
                if (!valid) {
                  setValidationErr((s) => ({ ...s, ...v }));
                  return;
                }
                handleClick();
              }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default RequestPayment;
