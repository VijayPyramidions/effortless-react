import React, { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetCustomerEntityState } from '@action/Store/Reducers/General/GeneralState';
import { ClearStateCreateReceivablesRemainder } from '@action/Store/Reducers/Settings/ReceivablesSettingsState';
import { Box } from '@mui/material';

import { styled } from '@material-ui/core/styles';
import { InputAdornment } from '@material-ui/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrixEditor } from 'react-trix';
import Input from '@components/Input/Input.jsx';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import PreRemainderAction from './PreRemainderAction';
import PostRemainderAction from './PostRemainderAction';
import RemainderCustomerList from './RemainderCustomerList';
import * as css from '../receivablesSettings.scss';
import * as mainCss from '../../../../App.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const initialErrorText = {
  templateName: 'Enter template name',
  customerList: 'Select one customer',
  subject: 'Enter subject text',
  body: 'Enter body text',
};

const intialError = {
  templateName: false,
  customerList: false,
  subject: false,
  body: false,
};

const RemaindersActionSheet = (props) => {
  const { type, from, dataShow, duplicateType } = props;

  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { customerEntity } = useSelector((value) => value.General);
  const { receivablesSettingsAction } = useSelector(
    (value) => value.ReceivablesSettings
  );

  const [drawer, setDrawer] = useState({});

  const [ActionType, setActionType] = useState();

  const [reminderState, setReminderState] = useState({
    templateName: '',
    customerList: '',
    subject: '',
    body: '',
  });
  const [SelectedCustomerId, setSelectedCustomerId] = useState([]);
  const [error, setError] = useState(intialError);
  const [errorText, setErrorText] = useState({});

  const CustomerListFunc = (custList) => {
    setReminderState((prev) => ({
      ...prev,
      customerList: custList?.map((val) => val?.short_name).join(', '),
    }));
    setSelectedCustomerId(custList?.map((val) => val?.id));
    setDrawer((prev) => ({ ...prev, customerList: false }));
  };

  const validate = (e) => {
    const { name, value } = e.target;

    if (value === '') {
      setError((prev) => ({ ...prev, [name]: true }));
      setErrorText((prev) => ({ ...prev, [name]: initialErrorText[name] }));
    } else {
      setError((prev) => ({ ...prev, [name]: false }));
      setErrorText((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const onInputChange = (e, text) => {
    if (!text) {
      validate(e);
      const { name, value } = e.target;
      setReminderState((prev) => ({ ...prev, [name]: value }));
    } else {
      setReminderState((prev) => ({ ...prev, body: e }));

      if (text || text === '') setError((prev) => ({ ...prev, body: false }));
      else setError((prev) => ({ ...prev, body: true }));
    }
  };

  useEffect(() => {
    if (
      Object.keys(receivablesSettingsAction?.newRemainder || {})?.length > 0
    ) {
      if (device === 'mobile') {
        navigate(-1);
        dispatch(ClearStateCreateReceivablesRemainder());
      }
    }
  }, [JSON.stringify(receivablesSettingsAction?.newRemainder)]);

  useEffect(() => {
    if (device === 'mobile' && state?.type) {
      setActionType(state?.type?.toLocaleLowerCase());
    } else if (device === 'desktop' && type) {
      setActionType(type?.toLocaleLowerCase());
    } else {
      setActionType('new');
    }
  }, [state?.type, type, device]);

  useEffect(() => {
    if (state?.dataShow || dataShow) {
      const element = document.querySelector('trix-editor');
      element.editor.setSelectedRange([0, state?.dataShow?.body?.length]);
      element.editor.deleteInDirection('forward');

      if (device === 'mobile' && state?.dataShow) {
        setReminderState((prev) => ({
          ...prev,
          templateName: state?.dataShow?.name,
          subject: state?.dataShow?.subject,
          body: state?.dataShow?.body,
        }));
      } else if (device === 'desktop' && dataShow) {
        setReminderState((prev) => ({
          ...prev,
          templateName: dataShow?.name,
          subject: dataShow?.subject,
          body: dataShow?.body,
        }));
      }
      element.editor.insertHTML(dataShow?.body || state?.dataShow?.body);
      element.editor.element.setAttribute('contentEditable', true);
    }
  }, [state?.dataShow, dataShow, device]);

  React.useMemo(()=>{
    if(ActionType){
      const element = document.querySelector('trix-editor');
      if(ActionType === 'view') element?.editor?.element?.setAttribute('contentEditable', false);
      else element?.editor?.element?.setAttribute('contentEditable', true);
    }
  },[ActionType]);

  React.useEffect(() => { 
    if (!reminderState?.customerList) {
      const tempRecipients = device === 'mobile' ? state?.dataShow?.email_reminders?.[0]?.recipients : dataShow?.email_reminders?.[0]?.recipients;
      const tempCustomerList = customerEntity?.data?.filter((val) => tempRecipients?.includes(val?.id));

      const tempCustomerName = tempCustomerList?.map((val) => val?.name)?.join(', ');

      setSelectedCustomerId(tempRecipients);

      setReminderState((prev) => ({
        ...prev,
        customerList: tempCustomerName,
      }));
    }
  }, [state?.dataShow, dataShow, customerEntity]);

  const OnSubmit = () => {
    Object.keys(reminderState).forEach((item) => {
      if (!reminderState[item]) {
        setError((prev) => ({ ...prev, [item]: true }));
        setErrorText((prev) => ({ ...prev, [item]: initialErrorText[item] }));
      } else {
        setError((prev) => ({ ...prev, [item]: false }));
        setErrorText((prev) => ({ ...prev, [item]: '' }));
      }
    });
  };

  useEffect(() => {
    dispatch(
      GetCustomerEntityState({
        allParties: false,
        searchText: '',
        pageNum: 1,
        location: false,
      })
    );
  }, [dispatch]);

  return (
    <div
      className={
        device === 'mobile'
          ? css.remaindersactionsheetMobile
          : css.remaindersactionsheet
      }
    >
      {(device === 'desktop' || ActionType === 'view') && (
        <div className={css.headContent}>
          <p className={css.titletag}>Reminder</p>
          {ActionType === 'view' && <div style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}} onClick={() => setActionType('edit')}><DriveFileRenameOutlineIcon sx={{color: '#F08B32', fontSize: 16}} /><p style={{color: '#F08B32'}}>Edit Reminder</p></div>}
        </div>
      )}
      <div
        className={css.remaindersform}
        style={{ pointerEvents: ActionType === 'view' && 'none' }}
      >
        <div>
          <Input
            name="templateName"
            label="Template Name"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              type: 'text',
            }}
            fullWidth
            value={reminderState.templateName}
            onChange={onInputChange}
            onBlur={validate}
            theme="light"
            rootStyle={{
              background: 'rgba(237, 237, 237, 0.15)',
              border: '0.7px solid rgba(153, 158, 165, 0.39)',
              borderRadius: '8px',
              '& .MuiFormLabel-root' :{
                fontSize:'15px !important'
              }
            }}
            required
            error={error.templateName}
            helperText={errorText.templateName}
          />
        </div>

        <div>
          <Input
            name="customerList"
            label="Customer"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              type: 'text',
              endAdornment: (
                <InputAdornment position="end" className={mainCss.endInputText}>
                  Delivery to {SelectedCustomerId?.length || 0} out of{' '}
                  {customerEntity?.count || 0}
                </InputAdornment>
              ),
            }}
            fullWidth
            value={reminderState.customerList}
            onChange={onInputChange}
            onBlur={validate}
            theme="light"
            rootStyle={{
              background: 'rgba(237, 237, 237, 0.15)',
              border: '0.7px solid rgba(153, 158, 165, 0.39)',
              borderRadius: '8px',
              cursor: 'pointer !important',
              '& .MuiFormLabel-root' :{
                fontSize:'15px !important'
              }
            }}
            Fieldselect
            required
            error={error.customerList}
            helperText={errorText.customerList}
            disabled
            onClick={() =>
              setDrawer((prev) => ({ ...prev, customerList: true }))
            }
          />
        </div>

        <div>
          <Input
            name="subject"
            label="Subject"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              type: 'text',
            }}
            fullWidth
            value={reminderState.subject}
            onChange={onInputChange}
            onBlur={validate}
            theme="light"
            rootStyle={{
              background: 'rgba(237, 237, 237, 0.15)',
              border: '0.7px solid rgba(153, 158, 165, 0.39)',
              borderRadius: '8px',
              '& .MuiFormLabel-root' :{
                fontSize:'15px !important'
              }
            }}
            required
            error={error.subject}
            helperText={errorText.subject}
          />
        </div>

        <div>
          <div className={`${css.gridDeliver}`}>
            <p
              className={
                error.body
                  ? ` ${css.paraDeliver} ${css.bodyerror} `
                  : css.paraDeliver
              }
            >
              Body <span className={css.spanDeliver}>*</span>
            </p>
            <TrixEditor
              className={css.trixEditor}
              value={reminderState.body}
              onChange={onInputChange}
            />
          </div>
          {error.body && <p className={css.bodyerrorText}>{errorText.body}</p>}
        </div>

        <div style={{ marginTop: 6 }}>
          {(from === 'pre_due_reminder' || state?.from === 'pre_due_reminder') && (
            <PreRemainderAction
              reminState={{ ...reminderState, customer_id: SelectedCustomerId }}
              submit={OnSubmit}
              passedDataShow={dataShow || state?.dataShow}
              actionType={ActionType}
              duplicateType={duplicateType || state?.duplicateType}
            />
          )}
          {(from === 'post_due_reminder' || state?.from === 'post_due_reminder') && (
            <PostRemainderAction
              reminState={{ ...reminderState, customer_id: SelectedCustomerId }}
              submit={OnSubmit}
              actionType={ActionType}
              passedDataShow={dataShow || state?.dataShow}
              duplicateType={duplicateType || state?.duplicateType}
            />
          )}
        </div>
      </div>
      <SelectBottomSheet
        open={drawer?.customerList}
        onClose={() => setDrawer((prev) => ({ ...prev, customerList: false }))}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
        id="overFlowHidden"
      >
        {device === 'mobile' && <Puller />}
        {device === 'mobile' && <br />}
        <RemainderCustomerList CustomerListSubmitFunc={CustomerListFunc} preFilledCustomer={SelectedCustomerId} />
      </SelectBottomSheet>
    </div>
  );
};

export default memo(RemaindersActionSheet);
