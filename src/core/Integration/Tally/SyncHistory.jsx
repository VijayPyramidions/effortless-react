import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  getSyncHistory,
  getSyncSummary,
  setSyncSummary,
} from '@action/Store/Reducers/Integration/TallySyncState';

import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import emptyData from '@assets/trip_empty.svg';

import * as css from './synchistory.scss';

const status = {
  success: (
    <>
      <Stack className={`${css.statuswrp} ${css.completed}`}>
        <Typography className={`${css.status} ${css.completedlabel}`}>
          Completed
        </Typography>
      </Stack>
    </>
  ),
  partial_success: (
    <>
      <Stack className={`${css.statuswrp} ${css.completed}`}>
        <Typography className={`${css.status} ${css.completedlabel}`}>
          Completed
        </Typography>
      </Stack>
    </>
  ),
  failed: (
    <>
      <Stack className={`${css.statuswrp} ${css.failed}`}>
        <Typography className={`${css.status} ${css.failedlabel}`}>
          Failed
        </Typography>
      </Stack>
    </>
  ),
  processing: (
    <>
      <Stack className={`${css.statuswrp} ${css.processing}`}>
        <Typography className={`${css.status} ${css.processinglabel}`}>
          On Going
        </Typography>
      </Stack>
    </>
  ),
  pending: (
    <>
      <Stack className={`${css.statuswrp} ${css.notsynced}`}>
        <Typography className={`${css.status} ${css.notsyncedlabel}`}>
          Not Synced
        </Typography>
      </Stack>
    </>
  ),
};

const SyncHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { syncHistory } = useSelector((state) => state.TallySync);

  const viewSyncHistory = (data) => async () => {
    await dispatch(getSyncSummary(data.id));
    navigate('/integration-tally-history', { state: { id: data.id } });
  };

  useEffect(() => {
    dispatch(getSyncHistory());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setSyncSummary(null));
    };
  }, []);

  return (
    <Stack className={css.synchistorycontainer}>
      <Typography className={css.synctitle}>Sync History</Typography>
      <TableContainer className={css.synchistorytablecontainer}>
        <Table className={css.synchistorytable} stickyHeader>
          <TableHead className={css.synchistorytablehead}>
            <TableRow className={css.headrow}>
              <TableCell>Sync Data</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Sync Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={css.synchistorytablebody}>
            {syncHistory?.data?.length > 0 ? (
              <>
                {syncHistory?.data?.map((item) => (
                  <TableRow className={css.bodyrow} key={item.id}>
                    <TableCell>
                      {item.sync_date
                        ? moment(item.sync_date, 'DD MMM YYYY').format(
                            'DD MMM, YYYY'
                          )
                        : '-'}
                    </TableCell>
                    <TableCell>{item.start_time}</TableCell>
                    <TableCell>{item.end_time}</TableCell>
                    <TableCell>{status[item.status]}</TableCell>
                    <TableCell>
                      <Button
                        className={css.viewhistorybtn}
                        onClick={viewSyncHistory(item)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow className={css.bodyrow}>
                <TableCell colSpan={5} align="center">
                  <img src={emptyData} alt="no data" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default memo(SyncHistory);
