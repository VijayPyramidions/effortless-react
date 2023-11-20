import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetReceivablesRemainderState,
  ClearStateCreateReceivablesRemainder,
} from '@action/Store/Reducers/Settings/ReceivablesSettingsState';
import { Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import RemaindersCardTable from './Components/RemaindersCardTable';
import RemaindersActionSheet from './Components/RemaindersActionSheet';
import * as css from './receivablesSettings.scss';

const Campaign = () => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { remainderData, receivablesSettingsAction } =
    useSelector((value) => value.ReceivablesSettings);

  const [drawer, setDrawer] = useState({});
  const [currentReaminder, setCurrentRemainder] = useState('');
  const [PreDueRemainderData, setPreDueRemainderData] = useState([]);
  const [PostDueRemainderData, setPostDueRemainderData] = useState([]);

  const openDrawerClick = (action) => {
    setDrawer((prev) => ({ ...prev, [action]: true }));
  };

  const closeDrawerClick = (action) => {
    setDrawer((prev) => ({ ...prev, [action]: false }));
  };

  useEffect(() => {
    if (
      Object.keys(receivablesSettingsAction?.newRemainder || {})?.length > 0
    ) {
      if (device === 'desktop') {
        setDrawer({});
        dispatch(ClearStateCreateReceivablesRemainder());
      }
    }
  }, [JSON.stringify(receivablesSettingsAction?.newRemainder)]);

  useEffect(() => {
    dispatch(GetReceivablesRemainderState());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(remainderData || {})?.length > 0) {
      setPreDueRemainderData(
        remainderData?.data?.filter(
          (val) => val?.active && val?.category_type === 'pre_due_reminder'
        )
      );
      setPostDueRemainderData(
        remainderData?.data?.filter(
          (val) => val?.active && val?.category_type === 'post_due_reminder'
        )
      );
    } else {
      setPreDueRemainderData([]);
      setPostDueRemainderData([]);
    }
  }, [remainderData]);

  return (
    <div>
      <p className={css.titleUnderLine}>Reminders</p>

      {[
        {
          name: 'Pre-Due Reminders',
          id: 'pre_due_reminder',
          data: PreDueRemainderData,
        },
        {
          name: 'Post-Due Reminders',
          id: 'post_due_reminder',
          data: PostDueRemainderData,
        },
      ].map((val) => (
        <div
          className={css.remainders}
          style={{ marginBottom: device === 'mobile' ? '18px' : '32px' }}
        >
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            mb="16px"
          >
            <p className={css.tableTitle}>{val.name}</p>
            <Button
              onClick={() => {
                setCurrentRemainder(val.id);
                if (device === 'desktop') {
                  openDrawerClick('addNewRemainder');
                } else if (device === 'mobile') {
                  navigate('/settings-receivables-action', {
                    state: { type: 'new', from: val.id },
                  });
                }
              }}
              className={css.secondaryButton}
            >
              <AddIcon sx={{ fontSize: 16 }} /> Add
            </Button>
          </Stack>
            <RemaindersCardTable tableRow={val?.data} id={val.id} />
        </div>
      ))}

      <SelectBottomSheet
        open={drawer.addNewRemainder && device === 'desktop'}
        onClose={() => closeDrawerClick('addNewRemainder', null)}
        triggerComponent={<div style={{ display: 'none' }} />}
        fixedWidthSheet="60vw"
      >
        <RemaindersActionSheet type="new" from={currentReaminder} />
      </SelectBottomSheet>
    </div>
  );
};

export default Campaign;
