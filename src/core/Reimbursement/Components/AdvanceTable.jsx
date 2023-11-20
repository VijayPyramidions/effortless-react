import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Divider,
  Typography,
  Box,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Checkbox,
  Button,
  IconButton,
} from '@mui/material';
import { advanceAdjust } from '@action/Store/Reducers/Reimbursement/ReimbursementState';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as css from '../ReimbursementContainer.scss';

const AdvanceTable = ({ value, reimbursementId, onChange }) => {
  const [drawer, setDrawer] = useState(false);

  return (
    <div className={css.advancetable}>
      <Divider />
      <Box sx={{ border: '1px solid #D7D9DC', borderRadius: '8px' }}>
        <Stack direction="row" justifyContent="space-between" padding="12px">
          <Typography component="p" className={css.advancetext}>
            Advance to Adjust
          </Typography>
          {/* <Typography
            component="p"
            className={css.viewall}
            onClick={() => setDrawer(true)}
            sx={{
              pointerEvents: value?.length === 0 && 'none',
              opacity: value?.length === 0 && '.5',
            }}
          >
            View All
          </Typography> */}
        </Stack>
        <TableCont
          TableData={value}
          length={36}
          reimbursementId={reimbursementId}
          onChange={onChange}
        />
      </Box>
      <SelectBottomSheet
        name="advance"
        open={drawer}
        triggerComponent={<></>}
        onTrigger={() => setDrawer(true)}
        onClose={() => setDrawer(false)}
      >
        <Box className={css.advancetable}>
          <>
            <Stack direction="row" padding="12px" alignItems="center" gap="8px">
              <IconButton onClick={() => setDrawer(false)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography component="p" className={css.advancetextheader}>
                Advance to Adjust
              </Typography>
            </Stack>
            <TableCont TableData={value} length={50} />
          </>
          <Button className={css.primaryButton}>Knock Off</Button>
        </Box>
      </SelectBottomSheet>
    </div>
  );
};

export const TableCont = ({ TableData, length, reimbursementId, onChange }) => {
  const dispatch = useDispatch();

  const truncateText = (text) => {
    if (text?.length <= length) {
      return text || '';
    }
    return text?.length > 0 ? `${text?.substring(0, length - 3)}...` : '';
  };

  const advanceItemAdjust = (row) => {
    const arr = {
      id: reimbursementId,
      payload: { txn_line_id: row.id },
    };

    dispatch(advanceAdjust(arr));
  };

  return (
    <TableContainer className={css.table_container}>
      <Table stickyHeader sx={{ minWidth: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Date</TableCell>
            <TableCell>Trip Name</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {TableData?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No Advances Found.
              </TableCell>
            </TableRow>
          )}
          {TableData?.length > 0 &&
            TableData?.map((val) => (
              <TableRow key={val?.id}>
                <TableCell>
                  <Checkbox
                    onChange={() => {
                      advanceItemAdjust(val);
                      onChange(val);
                    }}
                    value={val?.id}
                    sx={{
                      color: '#E5E5E5',
                      '&.Mui-checked': { color: '#F08B32' },
                    }}
                  />
                </TableCell>
                <TableCell>{moment(val?.date).format('DD-MM-YYYY')}</TableCell>
                <TableCell>
                  {truncateText(val?.reimbursement_description)}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {val?.amount}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdvanceTable;
