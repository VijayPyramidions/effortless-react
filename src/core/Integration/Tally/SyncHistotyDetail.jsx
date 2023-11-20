import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import moment from 'moment';

import { Avatar, Button, Stack, Typography } from '@mui/material';

import {
  setDrawer,
  getLog,
  setLog,
  getSyncSummary,
  setSyncSummary,
} from '@action/Store/Reducers/Integration/TallySyncState';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import TallySyncImg from '@assets/syncavatar.svg';
import syncFailure from '@assets/syncfailure.svg';
import syncSuccess from '@assets/syncsuccess.svg';
import syncInfo from '@assets/syncinfo.svg';
import syncList from '@assets/synclist.svg';

import SyncHistoryLog from './SyncHistoryLog';
import SyncLogDetail from './SyncLogDetail';
import Loader from './Loader';

import * as css from './syncdashboard.scss';

const SyncHistotyDetail = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const { drawer, syncSummary } = useSelector((state) => state.TallySync);

  const getStatusIcon = (item) => {
    if (item.total_count === item.success_count) return syncSuccess;
    if (item.total_count > 0 && item.success_count === 0) return syncFailure;
    if (
      item.total_count > 0 &&
      item.success_count > 0 &&
      item.success_count !== item.total_count
    )
      return syncInfo;

    return null;
  };

  useEffect(() => {
    if (location?.state?.id)
      if (syncSummary === null) dispatch(getSyncSummary(location?.state?.id));

    return () => {
      // setLogData([]);
      dispatch(setSyncSummary(null));
      dispatch(setLog(null));
    };
  }, []);

  return (
    <Stack className={css.syncdashboardcontainer} sx={{ marginTop: 2 }}>
      <Stack className={css.synccardcontainer}>
        <Stack className={css.syncimg}>
          <Avatar
            className={css.syncavatar}
            src={TallySyncImg}
            alt="Tally Sync"
          />
        </Stack>

        <Stack className={css.syncprocesscontainer}>
          <Stack className={css.syncheader}>
            {(syncSummary?.status === 'success' ||
              syncSummary?.status === 'partial_success') && (
              <Typography className={css.processtitle}>
                Sync Completed
              </Typography>
            )}
            {syncSummary?.status === 'processing' && (
              <Typography className={css.processtitle}>
                Sync is Ongoing
              </Typography>
            )}
            {syncSummary?.status === 'failed' && (
              <Typography className={`${css.processtitle} ${css.failed}`}>
                Sync Failed
              </Typography>
            )}
            {syncSummary?.status === 'pending' && (
              <Typography className={`${css.processtitle} ${css.failed}`}>
                Sync Not Completed
              </Typography>
            )}
            <Button
              className={css.viewlog}
              onClick={() => {
                dispatch(setDrawer({ name: 'logHistory', value: true }));
                dispatch(getLog({ id: syncSummary?.id, page: 1 }));
              }}
            >
              View Log
            </Button>
          </Stack>
          <Typography className={css.processdesc}>
            Experience seamless two-way synchronization between Effortless and
            Tally with our Tally Sync feature, ensuring real-time accuracy and
            consistency of product data across platforms, thus enhancing
            operational efficiency and productivity.
          </Typography>
          <Stack className={css.syncslistcontainer}>
            <Stack className={css.synclistwrp}>
              {syncSummary?.overall_summary?.map((item) => (
                <Stack className={css.synclist} key={item.description}>
                  <Avatar
                    src={syncList}
                    alt="status"
                    className={css.synclistimg}
                  />
                  <Typography className={css.synclisttitle}>
                    {item.description}
                  </Typography>
                  {syncSummary.status === 'processing' ? (
                    <Loader />
                  ) : (
                    <img
                      src={getStatusIcon(item)}
                      alt="live status"
                      className={css.syncstatusindicator}
                    />
                  )}
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack className={css.efftallysync}>
        <Stack
          flexDirection="row"
          sx={{ padding: '20px 20px 12px 20px', alignItems: 'center' }}
        >
          <Typography className={css.efftallytitle}>
            Effortless to Tally
          </Typography>
          <Typography className={css.synctime}>
            {syncSummary
              ? `${moment(syncSummary.sync_date, 'DD MMM YYYY').format(
                  'MMM DD, YYYY'
                )} - Start Time ${syncSummary.start_time} - End Time ${
                  syncSummary.end_time
                }`
              : '-'}
          </Typography>
        </Stack>
        <SyncHistoryLog
          type="eff"
          data={syncSummary?.effortless_to_tally}
          status={syncSummary?.status}
        />
      </Stack>
      <Stack className={css.efftallysync}>
        <Stack
          flexDirection="row"
          sx={{ padding: '20px 20px 12px 20px', alignItems: 'center' }}
        >
          <Typography className={css.efftallytitle}>
            Tally to Effortless
          </Typography>
          <Typography className={css.synctime}>
            {syncSummary
              ? `${moment(syncSummary.sync_date, 'DD MMM YYYY').format(
                  'MMM DD, YYYY'
                )} - Start Time ${syncSummary.start_time} - End Time ${
                  syncSummary.end_time
                }`
              : '-'}
          </Typography>
        </Stack>
        <SyncHistoryLog
          type="tally"
          data={syncSummary?.tally_to_effortless}
          status={syncSummary?.status}
        />
      </Stack>

      <SelectBottomSheet
        open={drawer.logHistory}
        onClose={() =>
          dispatch(setDrawer({ name: 'logHistory', value: false }))
        }
        fixedWidthSheet="600px"
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <SyncLogDetail />
      </SelectBottomSheet>
    </Stack>
  );
};

export default memo(SyncHistotyDetail);
