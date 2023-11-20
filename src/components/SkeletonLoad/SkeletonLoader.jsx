import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const InvoicePdfLoad = () => {
  return (
    <>
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          width: '100%',
          flexDirection: 'row-reverse',
        }}
      >
        <Skeleton
          animation="wave"
          variant="circular"
          width={100}
          height={100}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6, borderRadius: '4px' }}
          />
          <Skeleton
            animation="wave"
            height={10}
            width="40%"
            style={{ borderRadius: '4px' }}
          />
        </div>
      </div>
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="100%"
        height={60}
        style={{ margin: '16px 0', borderRadius: '6px' }}
      />
      <Skeleton
        animation="wave"
        variant="rounded"
        width={410}
        height={50}
        style={{ marginBottom: 6, borderRadius: '6px' }}
      />
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="100%"
        height={60}
        style={{ margin: '16px 0', borderRadius: '6px' }}
      />
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
      <Skeleton
        animation="wave"
        variant="rounded"
        width={410}
        height={40}
        style={{ borderRadius: '6px' }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="100%"
        height={60}
        style={{ margin: '16px 0', borderRadius: '6px' }}
      />
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
      <Skeleton
        animation="wave"
        variant="text"
        sx={{ fontSize: '1rem', borderRadius: '4px' }}
      />
    </>
  );
};

export const InvoiceLoadingSkeleton = () => {
  return (
    <Box
      sx={{
        height: 'max-content',
      }}
    >
      {[...Array(20)].map(() => (
        <Stack sx={{ gap: 10, flexDirection: 'row', width: '98%' }}>
          {[...Array(5)].map(() => (
            <Skeleton
              variant="rectangular"
              sx={{ my: 2, mx: 1, width: `${100 / 5}%`, borderRadius: '6px' }}
              animation="wave"
              height={12}
            />
          ))}
        </Stack>
      ))}
    </Box>
  );
};

export const MobileInvoiceLoadingSkeleton = () => {
  return [...Array(10)].map(() => (
    <Box
      sx={{
        height: 'max-content',
        border: '1px solid #cfcfcf',
        width: '94%',
        margin: '3% !important',
        borderRadius: 2,
        boxShadow: '0px 0px 4px 0px #cfcfcf',
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{ my: 2, mx: 1, borderRadius: '12px' }}
        animation="wave"
        width="95%"
        height={20}
      />
      <Skeleton
        variant="rounded"
        sx={{ my: 2, mx: 1, borderRadius: '12px' }}
        animation="wave"
        width="50%"
        height={20}
      />
    </Box>
  ));
};

export const CustomSearchLoadingSkeleton = () => {
  return (
    <Box
      sx={{
        height: 'max-content',
        width: '94%',
        margin: '3% !important',
        borderRadius: 2,
      }}
    >
      {[45, 75, 95, 30, 60]?.map((val) => (
        <Skeleton
          variant="rounded"
          sx={{ my: 2, mx: 1, borderRadius: '12px' }}
          animation="wave"
          width={`${val}%`}
          height={10}
        />
      ))}
    </Box>
  );
};

export const MobileCardLoadingSkeleton = ({ NumCard }) => {
  return [...Array(NumCard)].map(() => (
    <Box
      sx={{
        height: 'max-content',
        border: '1px solid #cfcfcf',
        width: '94%',
        margin: '12px 3% 0px !important',
        borderRadius: 2,
        boxShadow: '0px 0px 4px 0px #cfcfcf',
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{ my: 2, mx: 1, borderRadius: '12px' }}
        animation="wave"
        width="95%"
        height={20}
      />
      <Skeleton
        variant="rounded"
        sx={{ my: 2, mx: 1, borderRadius: '12px' }}
        animation="wave"
        width="50%"
        height={20}
      />
    </Box>
  ));
};

export const BillBoxLoadingSkeleton = ({ desktopView }) => {
  return (
    <Stack
      direction="row"
      gap={desktopView ? '24px' : '12px'}
      padding="12px"
      sx={{
        display: 'grid',
        gridTemplateColumns: desktopView
          ? 'auto auto auto auto auto'
          : 'auto auto auto',
      }}
    >
      {[...Array(20)].map(() => (
        <Box
          sx={{
            height: desktopView ? '180px' : '100px',
            border: '1px solid #cfcfcf',
            // width,
            borderRadius: 2,
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{ mt: 2, mx: 1, borderRadius: '0px' }}
            animation="wave"
            width="calc(100% - 16px)"
            height={desktopView ? 80 : 30}
          />
          <Skeleton
            variant="rounded"
            sx={{ my: 2, mx: 1, borderRadius: '4px' }}
            animation="wave"
            width="calc(100% - 16px)"
            height={desktopView ? 16 : 6}
          />
          <Skeleton
            variant="rounded"
            sx={{ mb: 2, mx: 1, borderRadius: '4px' }}
            animation="wave"
            width="50%"
            height={desktopView ? 12 : 4.5}
          />
        </Box>
      ))}
    </Stack>
  );
};
