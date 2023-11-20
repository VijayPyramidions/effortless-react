import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { Stack, Typography } from '@mui/material';

import SyncLogTable from './SyncLogTable';

import * as css from './syncdashboard.scss';

const SyncLogDetail = () => {
  const { syncLogDetail } = useSelector((state) => state.TallySync);
  return (
    <Stack className={css.synchistorydetail}>
      <Typography variant="h3" className={css.historytite}>
        Log History
      </Typography>
      <Typography variant="subtitle" className={css.historysubtitle}>
        {syncLogDetail
          ? `${moment(syncLogDetail?.sync_date, 'DD MMM YYYY').format(
              'MMM DD, YYYY'
            )} - Start Time ${syncLogDetail?.start_time} - End Time ${
              syncLogDetail?.end_time
            }`
          : '-'}
      </Typography>
      <SyncLogTable
        data={syncLogDetail?.data}
        page={syncLogDetail?.page}
        pages={syncLogDetail?.pages}
      />
    </Stack>
  );
};

export default memo(SyncLogDetail);
