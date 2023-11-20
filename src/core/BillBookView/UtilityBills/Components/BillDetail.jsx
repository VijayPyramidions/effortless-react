import React, { memo } from 'react';
import moment from 'moment';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import * as css from './billdetailinfo.scss';

const BillDetail = ({ onClose, phone, billInfoDetails, mobile }) => {
  return (
    <Box className={css.billinfocontainer}>
      <Stack className={css.bar} />
      <Stack className={css.billdetailheader}>
        <Typography variant="h4" className={css.headertxt}>
          Bill Details
        </Typography>
        <IconButton className={css.closeicon} onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      {phone === 'show' ? (
        <Stack className={css.billdetail}>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}>Due Date</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {moment(billInfoDetails.due_date).format('MMM DD, YYYY')}
            </Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}>Bill Date</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {moment(billInfoDetails.date).format('MMM DD, YYYY')}
            </Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}>Consumer Name</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {billInfoDetails.account_holder_name}
            </Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}>Bill Number</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {billInfoDetails.bill_number}
            </Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}>Bill Period</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {billInfoDetails.bill_period}
            </Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}>Circle</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>Tamil Nadu</Typography>
          </Stack>
        </Stack>
      ) : (
        <Stack className={css.billdetail}>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}>Consumer No</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>{mobile}</Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}> Consumer Name</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {billInfoDetails.account_holder_name}
            </Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}> Bill Date</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {moment(billInfoDetails.date).format('MMM DD, YYYY')}
            </Typography>
          </Stack>
          <Stack className={css.labelwrp}>
            <Typography className={css.label}> Last Paid</Typography>
            <span className={css.spacer}>-</span>
            <Typography className={css.value}>
              {moment(billInfoDetails.due_date).format('MMM DD, YYYY')}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default memo(BillDetail);
