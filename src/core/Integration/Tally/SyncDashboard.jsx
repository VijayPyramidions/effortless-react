import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import {
  setDrawer,
  getSync,
  postSync,
  getSyncSummary,
  setOneSync,
  setSyncSummary,
  setLog,
  setSummaryId,
  getLog,
} from '@action/Store/Reducers/Integration/TallySyncState';

import { Avatar, Button, Stack, Typography } from '@mui/material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import TallySyncImg from '@assets/syncavatar.svg';
import syncFailure from '@assets/syncfailure.svg';
import syncSuccess from '@assets/syncsuccess.svg';
import syncList from '@assets/synclist.svg';
import syncInfo from '@assets/syncinfo.svg';

import SyncLogTable from './SyncLogTable';
import SyncHistoryLog from './SyncHistoryLog';
import SyncLogDetail from './SyncLogDetail';
import * as css from './syncdashboard.scss';
import Loader from './Loader';

const SyncDashboard = () => {
  const dispatch = useDispatch();

  const {
    drawer,
    syncData,
    oneSyncDetail,
    syncSummary,
    summaryDetails,
    syncLogDetail,
  } = useSelector((state) => state.TallySync);

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

  const GetLogsData = () => {
    dispatch(getSyncSummary(summaryDetails?.data?.id));
    dispatch(getLog({ id: summaryDetails?.data?.id, page: 1 }));
  };
  useEffect(() => {
    dispatch(getSync());
  }, [dispatch]);

  useEffect(() => {
    if (summaryDetails?.data?.id) {
      dispatch(getSyncSummary(summaryDetails?.data?.id));
      setTimeout(() => {
        GetLogsData();
      }, 10000);
    }
  }, [dispatch, summaryDetails]);

  useEffect(() => {
    return () => {
      dispatch(setOneSync(null));
      dispatch(setSyncSummary(null));
      dispatch(setLog(null));
      dispatch(setSummaryId(null));
    };
  }, []);

  return (
    <Stack className={css.syncdashboardcontainer}>
      <Stack className={css.synccardcontainer}>
        <Stack className={css.syncimg}>
          <Avatar
            className={css.syncavatar}
            src={TallySyncImg}
            alt="Tally Sync"
          />
        </Stack>
        {Object.keys(oneSyncDetail || {}).length > 0 ? (
          <Stack className={css.syncprocesscontainer}>
            <Stack className={css.syncheader}>
              <Typography className={css.processtitle}>
                Sync is Ongoing
              </Typography>
              <Button
                className={css.viewlog}
                onClick={() =>
                  dispatch(setDrawer({ name: 'logHistory', value: true }))
                }
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

                    {syncSummary.status === 'processing' ||
                    syncSummary.status === 'pending' ? (
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
            {/* <Button className={css.resyncbtn}>Resync</Button> */}
          </Stack>
        ) : (
          <Stack className={css.syncdesccontainer}>
            <Typography variant="h2" className={css.synctitle}>
              Sync
            </Typography>
            <Typography className={css.syncsubtitle}>2 Way Sync</Typography>
            <Typography className={css.syncdesc}>
              Experience seamless two-way synchronization between Effortless and
              Tally with our Tally Sync feature, ensuring real-time accuracy and
              consistency of product data across platforms, thus enhancing
              operational efficiency and productivity
            </Typography>
            <Stack className={css.tallystatuswrp}>
              <Stack className={css.tallystatus}>
                <span
                  className={
                    syncData?.status === 'online'
                      ? css.indicator
                      : `${css.indicator} ${css.inactive}`
                  }
                />
                <Typography
                  className={
                    syncData?.status === 'online'
                      ? css.statusdesc
                      : `${css.statusdesc} ${css.inactive}`
                  }
                >
                  {syncData?.status === 'online'
                    ? 'Tally is Online'
                    : 'Tally is Offline'}
                </Typography>
              </Stack>
              <Button
                className={css.syncbtn}
                disabled={syncData?.status !== 'online'}
                onClick={() =>
                  dispatch(postSync({ connection_id: syncData?.id }))
                }
              >
                Sync Now
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>

      {oneSyncDetail?.data && (
        <Stack className={css.synclogcontainer}>
          <Typography className={css.synclogtitle}>
            Tally to Effortless
            <span className={css.syncSpan}>
              <Button className={css.syncSpanBtn} onClick={GetLogsData}>
                Log Refresh
              </Button>
            </span>
          </Typography>
          <SyncLogTable
            data={syncLogDetail?.data}
            page={syncLogDetail?.page}
            pages={syncLogDetail?.pages}
          />
        </Stack>
      )}

      {syncSummary?.effortless_to_tally && (
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
      )}

      {syncSummary?.tally_to_effortless && (
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
      )}

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

export default memo(SyncDashboard);
