import React from 'react';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import syncInfo from '@assets/syncinfo.svg';
import syncFailure from '@assets/syncfailure.svg';
import syncSuccess from '@assets/syncsuccess.svg';

import emptyData from '@assets/trip_empty.svg';

import * as css from './synchistorylog.scss';
import Loader from './Loader';

const SyncHistoryLog = ({ type, data, status }) => {
  const getStatusIcon = (rowdata) => {
    if (type === 'eff') {
      if (rowdata.difference_count === 0) return syncSuccess;
      if (rowdata.difference_count === rowdata.eff_count) return syncFailure;
      return syncInfo;
    }

    if (rowdata.difference_count === 0) return syncSuccess;
    if (rowdata.difference_count === rowdata.tally_count) return syncFailure;
    return syncInfo;
  };
  return (
    <TableContainer className={css.synchistorylogcontainer}>
      <Table className={css.histotylogtable} stickyHeader>
        <TableHead className={css.historyloghead}>
          <TableRow className={css.historylogrow}>
            <TableCell>Description</TableCell>
            <TableCell align="center">
              {type === 'eff' ? 'EFL Docs' : 'Tally Docs'}
            </TableCell>
            <TableCell align="center">
              {type !== 'eff' ? 'EFL Docs' : 'Tally Docs'}
            </TableCell>
            <TableCell align="center">Difference</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody className={css.historylogbody}>
          {data?.length > 0 ? (
            <>
              {data?.map((item) => (
                <TableRow className={css.historylogrow} key={item.description}>
                  <TableCell align="center">
                    <Stack className={css.synclistwrp}>
                      {type === 'eff' ? (
                        <>
                          {status === 'processing' && item.eff_count !== 0 ? (
                            <Loader />
                          ) : (
                            <img
                              src={getStatusIcon(item)}
                              alt="sync status"
                              className={css.syncstatusicon}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {status === 'processing' && item.tally_count !== 0 ? (
                            <Loader />
                          ) : (
                            <img
                              src={getStatusIcon(item)}
                              alt="sync status"
                              className={css.syncstatusicon}
                            />
                          )}
                        </>
                      )}

                      <Typography className={css.synclisttitle}>
                        {item.description}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    {type === 'eff' ? item.eff_count : item.tally_count}
                  </TableCell>
                  <TableCell align="center">
                    {type !== 'eff' ? item.eff_count : item.tally_count}
                  </TableCell>
                  <TableCell align="center">{item.difference_count}</TableCell>
                  <TableCell />
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow className={css.historylogrow}>
              <TableCell align="center" colSpan={5}>
                <img src={emptyData} alt="no data" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SyncHistoryLog;
