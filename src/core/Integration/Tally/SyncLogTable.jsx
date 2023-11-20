import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  getLog,
  // setSyncSummary,
} from '@action/Store/Reducers/Integration/TallySyncState';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import emptyData from '@assets/trip_empty.svg';

import * as css from './synclogtable.scss';

const SyncLogTable = ({ data, page, pages }) => {
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [logData, setLogData] = useState([]);
  const [pageVal, setPage] = useState(1);
  const dispatch = useDispatch();
  const { syncSummary } = useSelector((state) => state.TallySync);

  const nextData = () => {
    if (data.length !== 0)
      if (page >= pages) sethasMoreItems(false);
      else setPage((prev) => prev + 1);
  };

  const RemoveDuplicates = (array, key) => {
    return array.reduce((arr1, item) => {
      const removed = arr1.filter((i) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };

  useEffect(() => {
    if (syncSummary?.id)
      if (pageVal > 0) {
        dispatch(getLog({ id: syncSummary?.id, page: pageVal }));
      } else {
        dispatch(getLog({ id: syncSummary?.id, page: 1 }));
      }
    if (page >= pages) sethasMoreItems(false);
  }, [pageVal]);

  useEffect(() => {
    if (data?.length > 0) {
      const updatedData = [...logData, ...data];
      setLogData(RemoveDuplicates(updatedData, 'id'));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setLogData([]);
    };
  }, []);

  return (
    <InfiniteScroll
      dataLength={logData?.length}
      next={nextData}
      hasMore={hasMoreItems}
      scrollableTarget="allnotify"
    >
      <TableContainer className={css.synclogtablecontainer} id="allnotify">
        <Table stickyHeader className={css.synclogtable}>
          <TableHead className={css.syncloghead}>
            <TableRow className={css.syncheadlogrow}>
              <TableCell width="90px">Time</TableCell>
              <TableCell align="left" width="360px">
                Description
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody className={css.synclogbody}>
            {logData?.length > 0 ? (
              <>
                {logData?.map((item) => (
                  <TableRow className={css.synclogbodyrow} key={item.id}>
                    <TableCell width="90px">{item.time}</TableCell>
                    <TableCell align="left" width="360px">
                      {item.log ? item.log : '-'}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow className={css.synclogbodyrow}>
                <TableCell
                  align="center"
                  colSpan={3}
                  sx={{
                    borderBottom: 'none !important',
                    padding: '56px 0 !important',
                  }}
                >
                  <img src={emptyData} alt="no data" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};

export default memo(SyncLogTable);
