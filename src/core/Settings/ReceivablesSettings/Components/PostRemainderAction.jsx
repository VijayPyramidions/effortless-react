/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, memo } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { PostCreateReceivablesRemainderState, PatchUpdateReceivablesRemainderState } from '@action/Store/Reducers/Settings/ReceivablesSettingsState';

import { Button, IconButton, Popover, Box,Checkbox } from '@mui/material';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { styled } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
// import CustomCheckbox from '../../../../components/Checkbox/Checkbox';
import * as css from '../receivablesSettings.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));


const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const PostRemainderAction = ({ reminState, submit, actionType, passedDataShow, duplicateType }) => {
  const device = localStorage.getItem('device_detect');

  const dispatch = useDispatch();

  const [postAction, setPostAction] = useState({
    currentPostAction: 'annually',
    customDate: moment().format('DD-MM-YYYY'),
    customSelectedDays: [],
  });

  const [drawer, setDrawer] = useState({});
  const [drawerForMonthly, setDrawerForMonthly] = useState(null);
  const [drawerForWeekly, setDrawerForWeekly] = useState(null);
  const [dataShow, setDataShow] = useState({});

  const convertArrayToString = (array) => {
    // if (array?.length > 1) {
    //   const firstDay = array[0];
    //   const lastDay = array[array.length - 1];
    //   return `${firstDay} - ${lastDay}`;
    // }
    // return array[0];

    return array?.length > 1 ? `${array[0]} + ${array?.length - 1} Days` : array[0];
  };
  
  const GetPostReminderDays = () => {
    const postReminderDateResult = postAction?.currentPostAction === 'weekly'
      ? postAction?.customSelectedDays
      // ? convertArrayToString(postAction?.customSelectedDays).toLocaleLowerCase()
      : postAction?.customDate;
    if (dataShow?.email_reminders?.[0]?.frequency === postAction?.currentPostAction && dataShow?.email_reminders?.[0]?.post_reminder_date === postReminderDateResult && dataShow?.email_reminders?.[0]?.recipients?.every((val, i) => val === reminState?.customer_id?.[i])) {
      return undefined;
    }
    return [{
      post_reminder_date: postReminderDateResult,
      recipients: reminState?.customer_id,
      frequency: postAction?.currentPostAction,
      id: dataShow?.email_reminders?.[0]?.id,
      active: true
    }];
   };
  const OnSubmit = async (submitType) => {
    await submit();

    if (
      !postAction?.customDate &&
      postAction?.currentPostAction === 'monthly'
    ) {
      dispatch(
        openSnackbar({
          message: 'Please select date',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      return;
    }
    if (
      postAction?.customSelectedDays?.length === 0 &&
      postAction?.currentPostAction === 'weekly'
    ) {
      dispatch(
        openSnackbar({
          message: 'Please select days',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      return;
    }
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
            category_type: 'post_due_reminder',
            frequency: postAction?.currentPostAction,
            post_reminder_date:
              postAction?.currentPostAction === 'weekly'
                ? postAction?.customSelectedDays
                // ? convertArrayToString(postAction?.customSelectedDays)
                : postAction?.customDate,
            recipients: reminState?.customer_id,
            body: reminState?.body,
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
            category_type: 'post_due_reminder',
            email_reminders: GetPostReminderDays(),
          },
          remainderTemplateId: dataShow?.id,
        })
      );
    }
  };

  const openDrawerClick = (action, event) => {
    if (event === 'open') {
      setDrawer((prev) => ({ ...prev, [action]: true }));
    } else {
      setDrawer((prev) => ({ ...prev, [action]: event.currentTarget }));
    }
  };

  const closeDrawerClick = (action, set) => {
    setDrawer((prev) => ({ ...prev, [action]: set }));
  };

  useEffect(() => {
    if (dataShow?.email_reminders) {
      if (dataShow?.email_reminders?.[0]?.frequency === 'weekly') {
        // const dataShowRemainderday = dataShow?.email_reminders?.[0]?.post_reminder_date;
        // const [startDay, endDay] = dataShowRemainderday.split(' - ');
        // const startIndex = days.indexOf(startDay);
        // const endIndex = days.indexOf(endDay);
        // const slicedDays = days.slice(startIndex, endIndex + 1);
        setPostAction((prev) => ({
          ...prev,
          currentPostAction: dataShow?.email_reminders?.[0]?.frequency,
          customSelectedDays: dataShow?.email_reminders?.[0]?.post_reminder_date || []
        }));
        return;
      }
      setPostAction({
        currentPostAction: dataShow?.email_reminders?.[0]?.frequency,
        customDate: dataShow?.email_reminders?.[0]?.post_reminder_date,
        // customSelectedDays: dataShow?.email_reminders?.[0]?.post_reminder_date,
      });
    }
  }, [dataShow]);

  useEffect(() => { 
    if (dataShow) {
      setDataShow({ ...passedDataShow, email_reminders: passedDataShow?.email_reminders?.filter((val) => val?.active) });
    }
  }, [passedDataShow]);

  return (
    <div className={css.postForm}>
      <div
        className={device === 'mobile' ? `${css.topPostMobile}` : css.topPost}
      >
        <p className={css.leftTag}>Select Frequency</p>
        <div className={css.rightTag}>
          {[
            { name: 'annually' },
            { name: 'monthly' },
            { name: 'weekly' },
            { name: 'daily' },
          ]?.map((val) => (
            <div
              className={
                postAction?.currentPostAction === val?.name
                  ? `${css.postButtonAction} ${css.active}`
                  : css.postButtonAction
              }
              onClick={() => {
                if (postAction?.currentPostAction !== val?.name) {
                  setPostAction((prev) => ({
                    ...prev,
                    currentPostAction: val?.name,
                    customDate:
                      val.name === 'annually'
                        ? moment().format('DD-MM-YYYY')
                        : (val.name === 'daily' && moment().format('DD')) || '',
                    customSelectedDays: [],
                  }));
                }
              }}
            >
              <p>{val?.name}</p>
            </div>
          ))}
        </div>
      </div>

      {(postAction?.currentPostAction === 'monthly' ||
        postAction?.currentPostAction === 'weekly') && (
        <div
          className={
            device === 'mobile' ? css.bottomPostMobile : css.bottomPost
          }
        >
          <p className={css.leftTag}>{postAction?.currentPostAction === 'weekly' ? 'Select Days' : 'Select Date'}</p>
          <div className={css.rightTag}>
            <div
              className={css.postButtonAction}
              onClick={(e) => {
                if (device === 'mobile') {
                  openDrawerClick('remainderAction', e);
                }
                if (device === 'desktop') {
                  if (postAction?.currentPostAction === 'monthly') {
                    setDrawerForMonthly(e?.currentTarget);
                  } else {
                    setDrawerForWeekly(e?.currentTarget);
                  }
                }
              }}
            >
              {postAction?.currentPostAction === 'weekly' ? (
                <p>
                  {(postAction?.customSelectedDays?.length > 0 &&
                    convertArrayToString(postAction?.customSelectedDays)) ||
                    'Days'}
                </p>
              ) : (
                <p>{postAction?.customDate || 'Date'}</p>
              )}
              <IconButton>
                <KeyboardArrowDownIcon />
              </IconButton>
            </div>
          </div>
        </div>
      )}

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

      <Popover
        id="basic-menu-sort"
        anchorEl={drawerForMonthly}
        PaperProps={{
          sx: {
            width:
              postAction?.customDateOpen === 'customDay' ? '240px' : '300px',
            boxShadow:
              '0px 9px 42px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            marginTop: '10px',
          },
        }}
        open={Boolean(drawerForMonthly) && device === 'desktop'}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => {
          setDrawerForMonthly(null);
          if (postAction?.customDateOpen === 'customDay') {
            setPostAction((prev) => ({ ...prev, customDateOpen: '' }));
          }
        }}
      >
        <RemainderDelivery
          postAction={postAction}
          setPostAction={setPostAction}
          closeDrawerClick={(e, val) => setDrawerForMonthly(val)}
        />
      </Popover>

      <Popover
        id="basic-menu-sort"
        anchorEl={drawerForWeekly}
        PaperProps={{
          sx: {
            width:
              postAction?.customDateOpen === 'customDay' ? '240px' : '300px',
            boxShadow:
              '0px 9px 42px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            marginTop: '10px',
          },
        }}
        open={Boolean(drawerForWeekly) && device === 'desktop'}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => {
          setDrawerForWeekly(null);
        }}
      >
        <RemainderDelivery
          postAction={postAction}
          setPostAction={setPostAction}
          closeDrawerClick={(e, val) => setDrawerForWeekly(val)}
        />
      </Popover>

      <SelectBottomSheet
        open={Boolean(drawer?.remainderAction) && device === 'mobile'}
        onClose={() => closeDrawerClick('remainderAction', null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <Puller />
        <br />
        <RemainderDelivery
          postAction={postAction}
          setPostAction={setPostAction}
          closeDrawerClick={closeDrawerClick}
          openDrawerClick={openDrawerClick}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={Boolean(drawer?.customDay) && device === 'mobile'}
        onClose={() => closeDrawerClick('customDay', null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <Puller />
        <br />
        <CustomDate
          postAction={postAction}
          setPostAction={setPostAction}
          closeDrawerClick={closeDrawerClick}
        />
      </SelectBottomSheet>
    </div>
  );
};

const RemainderDelivery = ({
  postAction,
  setPostAction,
  closeDrawerClick,
  openDrawerClick,
}) => {
  const device = localStorage.getItem('device_detect');
  const [RemainderDay, setRemainderDay] = useState(postAction?.customSelectedDays);

  useEffect(() => {
    // if (RemainderDay?.length > 0) {
    //   const firstSelectedDayIndex = days.indexOf(RemainderDay[0]);
    //   const lastSelectedDayIndex = days.indexOf(
    //     RemainderDay[RemainderDay.length - 1]
    //   );
    //   const selectedRange = days.slice(
    //     firstSelectedDayIndex,
    //     lastSelectedDayIndex + 1
    //   );
    //   setPostAction((prev) => ({ ...prev, customSelectedDays: selectedRange }));
    //   if (selectedRange?.length === 0) {
    //     setRemainderDay([]);
    //   }
    // } else if (RemainderDay?.length > 0) {
    //   setPostAction((prev) => ({ ...prev, customSelectedDays: RemainderDay }));
    // }
    setPostAction((prev) => ({ ...prev, customSelectedDays: RemainderDay }));
  }, [RemainderDay]);

  return postAction?.customDateOpen === 'customDay' ? (
    <CustomDate
      postAction={postAction}
      setPostAction={setPostAction}
      closeDrawerClick={closeDrawerClick}
    />
  ) : (
    <div className={css.deliverySchedule}>
      <div className={css.topCont}>
        <p className={css.titletag}>Set Reminder Delivery Schedule</p>
        <p className={css.subTitleTag}>
          Deliver Reminders to your Customers on:
        </p>
      </div>
      {postAction?.currentPostAction === 'monthly' && (
        <div className={css.bottomCont}>
          {[
            { name: 'Same Date', value: new Date().getDate() },
            { name: 'First of the Month', value: 1 },
            { name: 'Last of the Month', value: 30 },
            { name: 'Custom', value: 'customDay' },
          ]?.map((val) => (
            <div
              className={css.listcontent}
              onClick={() => {
                if (val?.value === 'customDay' && device === 'mobile') {
                  openDrawerClick('customDay', 'open');
                  closeDrawerClick('remainderAction', null);
                }
                if (val?.value === 'customDay' && device === 'desktop') {
                  setPostAction((prev) => ({
                    ...prev,
                    customDateOpen: val?.value,
                  }));
                }
                if (val?.value !== 'customDay') {
                  setPostAction((prev) => ({
                    ...prev,
                    customDate: val?.value,
                  }));
                  closeDrawerClick('remainderAction', null);
                }
              }}
            >
              <Button className={css.listtexttag}>{val?.name}</Button>
            </div>
          ))}
        </div>
      )}

      {/* for day selection */}

      {postAction?.currentPostAction === 'weekly' && (
        <div className={css.bottomContDays}>
          {days.map((val) => (
            <div
              className={css.listcontent}
              onClick={() => {
                if (RemainderDay?.includes(val)) {
                  setRemainderDay(RemainderDay?.filter((item) => item !== val));
                } else {
                  setRemainderDay((prev) => [...prev, val]);
                }
              }}
            >
              <Checkbox
                checked={postAction?.customSelectedDays?.includes(val)}
                sx={{padding: '8px 4px', color: '#e0e0e0',  '&.Mui-checked': {
                  color: '#F08B32',
                },}}
              />
              <Button className={css.listtexttag}>{val}</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomDate = ({ postAction, setPostAction, closeDrawerClick }) => {
  const device = localStorage.getItem('device_detect');
  return (
    <div className={css.dateListPop}>
      {Array.from(
        {
          length: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ).getDate(),
        },
        (_, index) => index + 1
      )?.map((val) => (
        <div
          className={
            postAction?.customDate === val
              ? `${css.individualDate} ${css.active}`
              : `${css.individualDate}`
          }
          onClick={() => {
            if (device === 'mobile') {
              setPostAction((prev) => ({ ...prev, customDate: val }));
              closeDrawerClick('customDay', null);
            } else if (device === 'desktop') {
              setPostAction((prev) => ({
                ...prev,
                customDate: val,
                customDateOpen: '',
              }));
              closeDrawerClick('remainderAction', null);
            }
          }}
        >
          <p>{val}</p>
        </div>
      ))}
    </div>
  );
};

export default memo(PostRemainderAction);
