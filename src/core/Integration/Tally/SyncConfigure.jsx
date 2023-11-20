import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import {
  postSyncConfig,
  getSyncConfig,
  updateSyncConfig,
} from '@action/Store/Reducers/Integration/TallySyncState';

import { Button, Stack, Typography } from '@mui/material';

import { OnlyDatePicker } from '@components/DatePicker/DatePicker';
import { convertKeysToSnakeCase } from '@components/utils';

import * as css from './syncconfigure.scss';

const SyncConfigure = () => {
  const dispatch = useDispatch();

  const [configState, setConfigState] = useState({
    id: null,
    startDate: null,
    companyName: '',
    edit: false,
  });

  const { configDetail } = useSelector((state) => state.TallySync);

  const onInputChange = (e) => {
    const { name, value } = e?.target;
    setConfigState((prev) => ({ ...prev, [name]: value }));
  };

  const disableSubmit = () => {
    const { id, edit, ...restItems } = configState;
    return !Object.values(restItems)
      .map((item) => !!item)
      .every((val) => val === true);
  };

  const onSubmit = () => {
    const { id, edit, ...restItems } = configState;
    const data = convertKeysToSnakeCase(restItems);

    if (configState?.id) dispatch(updateSyncConfig(data));
    else dispatch(postSyncConfig(data));
  };

  useEffect(() => {
    if (configDetail && Object.keys(configDetail || {}).length > 0)
      setConfigState((prev) => ({
        ...prev,
        id: configDetail?.id,
        startDate: configDetail?.start_date,
        companyName: configDetail?.company_name,
        edit: !!configDetail?.id,
      }));
    else
      setConfigState((prev) => ({
        ...prev,
        id: null,
        startDate: null,
        companyName: '',
        edit: false,
      }));
  }, [configDetail]);

  useEffect(() => {
    dispatch(getSyncConfig());
  }, [dispatch]);

  return (
    <Stack className={css.syncconfigurecontainer}>
      <Stack className={css.syncconfigurewrp}>
        <Typography className={css.configuretitle}>Config Your ERP</Typography>
        <Stack className={css.configuredatepickerwrp}>
          <label htmlFor="date" className={css.dateinputlabel}>
            Accounts Start Date
          </label>
          <Stack className={css.dateinputwrp}>
            <input
              id="date"
              type="text"
              name="startDate"
              className={css.dateinput}
              disabled={configState?.edit}
              value={
                configState?.startDate
                  ? moment(configState?.startDate).format('DD-MM-YYYY')
                  : ''
              }
              placeholder="Select account start date"
            />
            <OnlyDatePicker
              color="#6E6E6E"
              selectedDate={configState?.startDate}
              onChange={(e) =>
                onInputChange({ target: { name: 'startDate', value: e._d } })
              }
              className={
                configState?.edit
                  ? `${css.dateicon} ${css.disabled}`
                  : css.dateicon
              }
              maxDate="disable"
            />
          </Stack>
        </Stack>
        <Stack className={css.companynamewrp}>
          <label htmlFor="compayname" className={css.companynamelabel}>
            Company Name as per Tally
          </label>
          <input
            id="compayname"
            name="companyName"
            className={css.companynameinput}
            value={configState?.companyName}
            placeholder="Enter company name"
            onChange={onInputChange}
            disabled={configState?.edit}
          />
        </Stack>
        {configState?.edit ? (
          <Button
            className={css.configuresubmitbtn}
            onClick={() => setConfigState((prev) => ({ ...prev, edit: false }))}
          >
            Edit
          </Button>
        ) : (
          <Button
            className={css.configuresubmitbtn}
            disabled={disableSubmit()}
            onClick={onSubmit}
          >
            Save
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(SyncConfigure);
