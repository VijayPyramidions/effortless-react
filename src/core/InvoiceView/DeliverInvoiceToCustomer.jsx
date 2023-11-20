import additionalSettings from '@assets/add.svg';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetInvoiceDeliverEmailTemplateState,
  GetInvoiceDeliverContactListState,
  PostInvoiceDeliverToCustomerState,
  PostInvoiceDeliverNewContactState,
  ClearStateInvoiceDeliverAction,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import Input from '@components/Input/Input.jsx';
// import * as Mui from '@mui/material';
import Select, { MultipleSelect } from '@components/Select/Select.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import OutlinedInput from '@mui/material/OutlinedInput';
import AppContext from '@root/AppContext.jsx';
import {
  validateEmail,
  validateName,
  validateRequired,
} from '@services/Validation.jsx';
import React from 'react';
import * as Router from 'react-router-dom';
import { TrixEditor } from 'react-trix';
import 'trix/dist/trix';
import 'trix/dist/trix.css';
import * as css from './DeliverInvoiceToCustomer.scss';

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

const initialValidationErr = {
  contactName: false,
  mobileNo: false,
  email: false,
};

function DeliverInvoiceToCustomer({ fromSheet }) {
  const {
    organization,
    user,
    // enableLoading,
    // openSnackBar,
    currentUserInfo,
    userPermissions,
  } = React.useContext(AppContext);

  const dispatch = useDispatch();
  const { deliverInvoiceToCustomerData } = useSelector(
    (value) => value.Invoice,
  );

  const [values, setValues] = React.useState({
    to: '',
    cc: '',
    subject: '',
    body: null,
    PDF: false,
    name: '',
  });

  const [sendTo, setSendTo] = React.useState([]);
  const [contactName, setContactName] = React.useState('');
  const [mobileNo, setMobileNo] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const [sendToAddrList, setSendToAddrList] = React.useState([]);
  const [template, setTemplate] = React.useState({ list: [], selected: {} });
  const [drawer, setDrawer] = React.useState({
    addContact: false,
  });
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const [sendToErr, setSendToErr] = React.useState([
    {
      error: false,
      validation: validateRequired,
      errorText: 'Please select email',
    },
  ]);

  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.People || {})?.length > 0) {
      if (!userPermissions?.People?.People) {
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

  const validateAllFields = () => {
    return {
      contactName: !VALIDATOR?.contactName?.(contactName),
      mobileNo: !VALIDATOR?.mobileNo?.(mobileNo),
      email: !VALIDATOR?.email?.(email),
    };
  };

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  const onInputChange = (setter) => (e) => {
    if (setter === setSendTo) {
      setSendToErr([
        {
          error: false,
          validation: validateRequired,
          errorText: 'Please select email',
        },
      ]);
    }
    reValidate(e);
    setter(e.target.value);
  };

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  const resetValue = () => {
    setContactName('');
    setMobileNo('');
    setEmail('');
  };

  React.useEffect(() => {
    dispatch(
      GetInvoiceDeliverEmailTemplateState({
        documentType: state?.documentType,
      }),
    );
    return () => {
      dispatch(ClearStateInvoiceDeliverAction());
    };
  }, []);

  React.useEffect(() => {
    if (
      Object.keys(deliverInvoiceToCustomerData?.emailTemplate || {})?.length > 0
    ) {
      const res = deliverInvoiceToCustomerData?.emailTemplate?.data?.filter(
        (s) => s?.active,
      );
      setTemplate({
        list: res?.map((val) => ({
          payload: val?.name,
          text: val?.name,
        })),
        selected: res?.[0]?.name,
        response: res,
      });
    }
  }, [JSON.stringify(deliverInvoiceToCustomerData?.emailTemplate)]);

  React.useEffect(() => {
    if (
      Object.keys(deliverInvoiceToCustomerData?.contactList || {})?.length > 0
    ) {
      setSendToAddrList(
        deliverInvoiceToCustomerData?.contactList?.data?.map((s) => ({
          payload: s.email,
          text: s.email,
        })),
      );
      setSendTo(
        deliverInvoiceToCustomerData?.contactList?.data?.map((s) => s.email),
      );
      setValues((prev) => ({
        ...prev,
        cc: currentUserInfo?.email,
        name: deliverInvoiceToCustomerData?.contactList?.data?.[0]?.name,
      }));
    }
  }, [JSON.stringify(deliverInvoiceToCustomerData?.contactList)]);

  React.useEffect(() => {
    if (
      Object.keys(deliverInvoiceToCustomerData?.deliverAction?.newContact || {})
        ?.length > 0
    ) {
      setSendTo((prev) => [
        ...prev,
        deliverInvoiceToCustomerData?.deliverAction?.newContact?.email,
      ]);
      handleBottomSheet('addContact');
      resetValue();
    }
  }, [JSON.stringify(deliverInvoiceToCustomerData?.deliverAction?.newContact)]);

  React.useEffect(() => {
    if (
      Object.keys(
        deliverInvoiceToCustomerData?.deliverAction?.invoiceDeliver || {},
      )?.length > 0
    ) {
      if (fromSheet) {
        fromSheet(false);
      }
      if (!fromSheet) {
        const pathName = window.location.pathname;
        if (pathName.includes('people')) {
          navigate('/people');
        } else {
          navigate('/invoice');
        }
      }
    }
  }, [
    JSON.stringify(deliverInvoiceToCustomerData?.deliverAction?.invoiceDeliver),
  ]);

  React.useEffect(() => {
    if (
      organization?.activeInvoiceId &&
      organization?.activeInvoiceId?.length > 0
    ) {
      dispatch(
        GetInvoiceDeliverContactListState({
          customerId: state?.id || user.customerId,
        }),
      );
    } else {
      navigate('/invoice');
    }
  }, [organization?.activeInvoiceId, user, state]);

  const submitForm = () => {
    const v = sendToErr[0].validation(sendTo?.[0] || '');
    if (!v) {
      setSendToErr([
        {
          error: true,
          validation: validateRequired,
          errorText: 'Please select email',
        },
      ]);
    }
    if (v) {
      dispatch(
        PostInvoiceDeliverToCustomerState({
          deliverPayload: {
            reply_to_email: sendTo,
            invoice_id: organization?.activeInvoiceId,
            subject: values?.subject,
            body: values?.body,
            cc: values?.cc?.split(' ').join(''),
          },
          name: values?.name,
        }),
      );
    }
  };

  React.useEffect(() => {
    const element = document.querySelector('trix-editor');
    element.editor.setSelectedRange([0, values?.body?.length]);
    element.editor.deleteInDirection('forward');

    const temp = template?.response?.find(
      (val) => val?.name === template?.selected,
    );
    setValues((prev) => ({
      ...prev,
      subject: temp?.subject,
      body: temp?.body,
    }));
    element.editor.insertHTML(temp?.body);
    if (
      Object?.keys(userRolesInvoicing?.['Email Subject & Body'] || {})?.length >
        0 &&
      !userRolesInvoicing?.['Email Subject & Body']?.edit_email_templates
    ) {
      element.editor.element.setAttribute('contentEditable', false);
    }
  }, [
    template?.selected,
    userRolesInvoicing?.['Email Subject & Body']?.edit_email_templates,
  ]);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      body: e,
    }));
  };

  const handleDelete = (value) => {
    const filteredArray = sendTo?.filter((item) => item !== value);
    setSendTo([...filteredArray]);
  };

  return (
    <div className={css.deliveryToCustomerContainer}>
      <section className={css.header}>
        <div className={css.valueHeader}>Deliver to Customer</div>
        {/* <div className={css.headerUnderline} /> */}
      </section>
      <section className={css.card}>
        <Grid container>
          <Grid item xs={12} className={css.gridDeliver}>
            <MultipleSelect
              label="Send To"
              options={sendToAddrList}
              defaultValue={sendTo}
              error={sendToErr[0].error}
              helperText={sendToErr[0].error ? sendToErr[0].errorText : ''}
              onChange={onInputChange(setSendTo)}
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
              value={sendTo}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    zIndex: 99999,
                    mt: '20px',
                  }}
                >
                  {selected.map((value) => (
                    <Chip
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
                        borderRadius: '16px !important',
                        '& .MuiChip-label': {
                          color: 'black !important',
                        },
                      }}
                      key={value}
                      label={value}
                      onDelete={() => handleDelete(value)}
                    />
                  ))}
                </Box>
              )}
              IconComponent={() => <></>}
              required
              disabled={
                !userRolesInvoicing?.['Email Subject & Body']
                  ?.edit_email_templates
              }
            />
            <SelectBottomSheet
              name="addContact"
              triggerComponent={
                <input
                  type="image"
                  src={additionalSettings}
                  alt="settings"
                  className={css.addIcon}
                  style={{
                    pointerEvents: userRolesInvoicing?.['Email Subject & Body']
                      ?.edit_email_templates
                      ? ''
                      : 'none',
                  }}
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
                        onBlur={reValidate}
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
                        onChange={onInputChange(setContactName)}
                        theme="light"
                        value={contactName}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Input
                        name="mobileNo"
                        onBlur={reValidate}
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
                        onChange={onInputChange(setMobileNo)}
                        theme="light"
                        value={mobileNo}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Input
                        name="email"
                        onBlur={reValidate}
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
                        onChange={onInputChange(setEmail)}
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
                            const v = validateAllFields();
                            const valid = Object.values(v).every((val) => !val);

                            if (!valid) {
                              setValidationErr((s) => ({ ...s, ...v }));
                              return false;
                            }
                            dispatch(
                              PostInvoiceDeliverNewContactState({
                                customerId: state?.id || user.customerId,
                                newContactPayload: {
                                  name: contactName,
                                  email,
                                  mobile_number: mobileNo,
                                },
                              }),
                            );
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

          <Grid item xs={12} className={css.gridDeliver}>
            <Input
              name="cc"
              type="email"
              label="Cc"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={(e) => {
                setValues((prev) => ({ ...prev, cc: e?.target?.value }));
              }}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
              value={values.cc}
              disabled={
                !userRolesInvoicing?.['Email Subject & Body']
                  ?.edit_email_templates
              }
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
              disabled={
                !userRolesInvoicing?.['Email Subject & Body']
                  ?.edit_email_templates
              }
            />
          </Grid>
          <Grid item xs={12} className={css.gridDeliver}>
            <Input
              name="subject"
              type="text"
              label="Subject"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={(e) => {
                setValues((prev) => ({ ...prev, subject: e?.target?.value }));
              }}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={values.subject}
              required
              disabled={
                !userRolesInvoicing?.['Email Subject & Body']
                  ?.edit_email_templates
              }
            />
          </Grid>

          <Grid
            item
            xs={12}
            className={
              userRolesInvoicing?.['Email Subject & Body']?.edit_email_templates
                ? `${css.gridDeliver} ${css.bodyDeliver}`
                : `${css.gridDeliver} ${css.bodyDeliver} ${css.disableDeliver}`
            }
          >
            <p className={css.paraDeliver}>
              Body<span className={css.spanDeliver}>*</span>
            </p>

            <TrixEditor
              id="trixEditor"
              className={css.trixEditor}
              // autoFocus={true}
              placeholder="Body Content"
              value={values.body !== null ? values?.body : ''}
              // uploadURL="https://domain.com/imgupload/receiving/post"
              // uploadData={{ key1: "value", key2: "value" }}
              // mergeTags={mergeTags}
              onChange={handleChange}
              // onEditorReady={handleEditorReady}
            />
          </Grid>
          {/* <div>
            <Typography variant="caption" color="red">{errorMsg.bodyErr}</Typography>
          </div> */}
        </Grid>
        <div className={css.buttonContainer}>
          <Button
            fullWidth
            variant="contained"
            className={css.primary}
            onClick={() => {
              submitForm();
            }}
            style={{ textTransform: 'capitalize' }}
          >
            Deliver Now
          </Button>
        </div>
      </section>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
}

export default DeliverInvoiceToCustomer;
