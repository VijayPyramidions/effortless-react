/* eslint-disable no-unneeded-ternary */

import React, { useEffect, useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { Button, IconButton } from '@mui/material';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { PostCreateReceivablesRemainderState, PatchUpdateReceivablesRemainderState } from '@action/Store/Reducers/Settings/ReceivablesSettingsState';
import remainder_delete from '@assets/remainder_delete.svg';
import * as css from '../receivablesSettings.scss';

const PreRemainderAction = ({
  reminState,
  submit,
  passedDataShow,
  actionType,
  duplicateType,
}) => {
  const device = localStorage.getItem('device_detect');
  const dispatch = useDispatch();

  const [PreRemValue, setPreRemValue] = useState({ numDayRemainder: 1 });
  const [RemainderDays, setRemainderDays] = useState({days1: ''});
  const [dataShow, setDataShow] = useState({});

  const handleInputRemainder = (e) => {
   
    const inputValue = e.target.value;
    if (inputValue < 0) {
      e.preventDefault();
      return;
    }
    if (inputValue <= 5) {
      if (e.target.value === '') {
        setPreRemValue((prev) => ({ ...prev, numDayRemainder: inputValue }));
        e.preventDefault();
        return;
      }
      if (actionType === 'edit' && dataShow?.email_reminders?.length > e.target.value) {
        e.preventDefault();
        return;
      } 
      setPreRemValue((prev) => ({ ...prev, numDayRemainder: inputValue }));
      const result = RemainderDays;
      if (Object.keys(RemainderDays)?.length < e?.target?.value) {
        Array.from(
          { length: e?.target?.value },
          (_, index) => index + 1
        )?.forEach((obj, index) => {
          if (!(`days${index + 1}` in result)) {
            result[`days${index + 1}`] = '';
          }
        });
        setRemainderDays(result);
      }
      if (Object.keys(result)?.length > e?.target?.value) {
        const keys = Object.keys(result);
        const firstThreeKeys = keys.slice(0, e.target.value);
        const newObj = {};
        firstThreeKeys.forEach(key => {
          newObj[key] = result[key];
        });
        setRemainderDays(newObj);
      }
    }
  };

  const GetPreReminderDays = () => { 
    const tempAPIPreRem = dataShow?.email_reminders?.map((val) => val?.pre_reminder_date);
    const tempStatePreRem = Object.values(RemainderDays);

    const returnPreRem = [];

    if (tempAPIPreRem?.length === tempStatePreRem?.length && tempAPIPreRem?.every((val, i) => val === tempStatePreRem[i]) && dataShow?.email_reminders?.[0]?.recipients?.every((val, i) => val === reminState?.customer_id?.[i])) {
      return undefined;
    }

    if (tempAPIPreRem?.length < tempStatePreRem?.length) {
      tempStatePreRem?.forEach((obj, index) => {
        returnPreRem.push({ id: dataShow?.email_reminders?.[index]?.id || null, pre_reminder_date: tempStatePreRem[index], active: true, frequency: 'pre_due_date', recipients: reminState?.customer_id });
        }
      );
      return returnPreRem;
    }
    if (tempAPIPreRem?.length > tempStatePreRem?.length) {
      tempAPIPreRem?.forEach((obj, index) => {
        returnPreRem.push({ id: dataShow?.email_reminders?.[index]?.id, pre_reminder_date: tempStatePreRem[index], active: !!tempStatePreRem[index], frequency: 'pre_due_date', recipients: reminState?.customer_id });
        }
      );
      return returnPreRem;
    }
    tempStatePreRem?.forEach((obj, index) => {
        returnPreRem.push({ id: dataShow?.email_reminders?.[index]?.id, pre_reminder_date: tempStatePreRem[index], active: !!tempStatePreRem[index], frequency: 'pre_due_date', recipients: reminState?.customer_id });
      }
    );
    return returnPreRem;
  };

  const OnSubmit = async (submitType) => {
    await submit();

    // if (validation) {
      const darray = Object.values(RemainderDays);
      const hasDuplicates = new Set(darray).size !== darray.length;

      if (hasDuplicates) {
        dispatch(
          openSnackbar({
            message: 'You are entered same days in one or more reminders',
            type: MESSAGE_TYPE.ERROR,
          })
        );
        return;
      }

      const sumofdays = Object.values(RemainderDays).reduce(
        (totvalue, currentValue) => Number(totvalue) + Number(currentValue),
        0
      );

      if (sumofdays === 0) {
        dispatch(
          openSnackbar({
            message: 'Enter reminder days',
            type: MESSAGE_TYPE.ERROR,
          })
        );
        return;
      }

      // if (sumofdays > 60) {
      //   dispatch(
      //     openSnackbar({
      //       message:
      //         'The sum of total number of reminder days should be less than 60',
      //       type: MESSAGE_TYPE.ERROR,
      //     })
      //   );
      //   return;
      // }
    // } else {
    //   dispatch(
    //     openSnackbar({
    //       message: 'Please enter mandatory fields',
    //       type: MESSAGE_TYPE.ERROR,
    //     })
    //   );
    // }
    const { customer_id, ...tempReminState } = reminState;
    const validation = Object.values(tempReminState || {}).some(
      (val) => val === ''
    );
    if (validation) {
      return;
    }
    if (submitType === 'new') {
    dispatch(
      PostCreateReceivablesRemainderState({
        newRemainderPayload: {
          name: reminState?.templateName,
          subject: reminState?.subject,
          body: reminState?.body,
          category_type: 'pre_due_reminder',
          pre_reminder_dates: Object.values(RemainderDays).map((date) => ({
            date,
          })),
          recipients: reminState?.customer_id,
        },
      })
      );
    }
    else if (submitType === 'edit') {
      dispatch(
        PatchUpdateReceivablesRemainderState({
          editRemainderPayload: {
            name: dataShow?.name === reminState?.templateName ? undefined : reminState?.templateName,
            subject: dataShow?.subject === reminState?.subject ? undefined : reminState?.subject,
            body: dataShow?.body === reminState?.body ? undefined : reminState?.body,
            category_type: 'pre_due_reminder',
            email_reminders: GetPreReminderDays(),
          },
          remainderTemplateId: dataShow?.id,
        })
      );
    }
  };

  const handleInputDays = (e) => {
    e.persist();
    const inputValue = e.target.value;
    if(Number.isNaN(Number(inputValue))){
      e.preventDefault();
      return;
    }
    if (inputValue < 0) {
      e.preventDefault();
      return;
    }
    if (inputValue <= 60) {
      const parseIntValue = parseInt(Number(inputValue),10);
      setRemainderDays((prev) => ({ ...prev, [e?.target?.name]: parseIntValue ? parseIntValue : ""}));
    } else {
      setRemainderDays((prev) => ({ ...prev, [e?.target?.name]: 1 }));
    }
  };

  const handleKeyPress = (e) => {
    const isValidKey = /[0-5]/i.test(e.key);
    if (!isValidKey) {
      e.preventDefault();
    }
  };

  const handleWheel = (e) => {
    e.currentTarget.blur();
  };

  const handleRemDaysBlur = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '' || inputValue <= 1) {
      if (actionType === 'edit') {
        setPreRemValue((prev) => ({ ...prev, numDayRemainder: dataShow?.email_reminders?.length || 1 }));
        const result = RemainderDays;
        if (Object.keys(RemainderDays)?.length < dataShow?.email_reminders?.length) {
          Array.from(
            { length: dataShow?.email_reminders?.length },
            (_, index) => index + 1
          )?.forEach((obj, index) => {
            if (!(`days${index + 1}` in result)) {
              result[`days${index + 1}`] = '';
            }
          });
          setRemainderDays(result);
        }
        if (Object.keys(result)?.length > dataShow?.email_reminders?.length) {
          const keys = Object.keys(result);
          const firstThreeKeys = keys.slice(0, dataShow?.email_reminders?.length);
          const newObj = {};
          firstThreeKeys.forEach(key => {
            newObj[key] = result[key];
          });
          setRemainderDays(newObj);
        }
        e.preventDefault();
        return;
      }
      const noOfDays = e?.target?.value ? e?.target?.value : 1;
      setPreRemValue((prev) => ({ ...prev, numDayRemainder:noOfDays }));
      const result = RemainderDays;
        if (Object.keys(RemainderDays)?.length < noOfDays) {
          Array.from(
            { length: noOfDays },
            (_, index) => index + 1
          )?.forEach((obj, index) => {
            if (!(`days${index + 1}` in result)) {
              result[`days${index + 1}`] = '';
            }
          });
          setRemainderDays(result);
        }
        if (Object.keys(result)?.length > noOfDays) {
          const keys = Object.keys(result);
          const firstThreeKeys = keys.slice(0, noOfDays);
          const newObj = {};
          firstThreeKeys.forEach(key => {
            newObj[key] = result[key];
          });
          setRemainderDays(newObj);
        }
        e.preventDefault();
    }
    // handleInputRemainder(e);
  };

  useEffect(() => {
    if (Object.keys(dataShow || {})?.length > 0 && actionType !== 'new') {
      const result = {};
      dataShow?.email_reminders?.forEach((obj, index) => {
        result[`days${index + 1}`] = obj.pre_reminder_date;
      });
      setRemainderDays(result);
      setPreRemValue({ numDayRemainder: dataShow?.email_reminders?.length });
      console.log(result);
    }
    if (actionType === 'new') {
      setRemainderDays({ days1: '' });
    }
  }, [dataShow, actionType]);


  useEffect(() => { 
    if (dataShow) {
      setDataShow({ ...passedDataShow, email_reminders: passedDataShow?.email_reminders?.filter((val) => val?.active) });
    }
  }, [passedDataShow]);
  return (
    <div className={css.preForm}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 16,
          width: '100%',
        }}
      >
        <p className={css.preremainderlefttag} style={{width: device === 'desktop' && '25%' || '50%'}}>Number of Reminder</p>
        <input
          style={{
            width: 16,
            marginRight: '5%',
          }}
          className={css.preremainderrighttag}
          type="number"
          onChange={handleInputRemainder}
          onKeyPress={handleKeyPress}
          onBlur={handleRemDaysBlur}
          onClick={(event) => {
            event.target.select();
          }}
          value={PreRemValue?.numDayRemainder}
          name="numDayRemainder"
          onWheel={handleWheel}
        />
        <p className={css.maxremindtext} style={{display: device === 'mobile' && 'none'}}>Maximum number of reminders 5 only</p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexDirection: 'column' }}>
        {Object.keys(RemainderDays)?.map((val, index) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p
              style={{
                width: device === 'desktop' && '25%' || '50%'
              }}
              className={css.preremainderlefttag}
            >
              {device === 'desktop' && <>Reminder {index + 1} <br /> Send Before</>}
              {device === 'mobile' && `Reminder ${index + 1} Send Before`}
            </p>
            <input
              className={css.preremainderrighttag}
              type="number"
              onChange={handleInputDays}
              // onKeyPress={handleKeyPress}
              // onBlur={handleDaysBlur}
              onClick={(event) => {
                event.target.select();
              }}
              placeholder="Days"
              name={val}
              value={RemainderDays[val]}
              onWheel={handleWheel}
              style={{
                width: device === 'mobile' && '90px'
              }}
            />
            {PreRemValue?.numDayRemainder > 1 && actionType === 'edit' && (
              <IconButton
                ml="8px"
                onClick={() => {
                  setPreRemValue((prev) => ({
                    ...prev,
                    numDayRemainder: prev?.numDayRemainder - 1,
                  }));
                  const temp = {...RemainderDays};
                  delete temp[val];
                  setRemainderDays(temp);
                }}
              >
                <img
                  src={remainder_delete}
                  alt="remainder_delte"
                  style={{ cursor: 'pointer' }}
                />
              </IconButton>
            )}
          </div>
        ))}
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'center', margin: '35px 0' }}
      >
        {(actionType === 'new' || duplicateType) && (
          <Button onClick={() => OnSubmit('new')} className={css.primaryButton}>
            Save
          </Button>
        )}
        {(actionType === 'edit' && !duplicateType) && (
          <Button onClick={() => OnSubmit('edit')} className={css.primaryButton}>
            Update
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(PreRemainderAction);
