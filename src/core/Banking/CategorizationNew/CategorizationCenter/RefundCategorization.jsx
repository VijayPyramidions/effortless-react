import React from 'react';
import { Box, Stack } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import { useStyles, StyledTextarea } from './CategorizationStyledComponents';
import * as css from './CategorizationCenter.scss';

const RefundCategorization = () => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const columns = [
    {
      field: 'month',
      headerName: 'Month',
      sortable: false,
      width: 110,
      flex: 1,
    },
    {
      field: 'orginalAmount',
      headerName: 'Original Amount',
      sortable: false,
      width: 110,
      flex: 1,
    },
    {
      field: 'pendingAmount',
      headerName: 'Pending Amount',
      sortable: false,
      width: 110,
      flex: 1,
    },
    {
      field: 'allocate',
      headerName: 'To Allocate',
      sortable: false,
      width: 110,
      flex: 1,
      cellClassName: 'edit-cell-background',
      editable: true,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      sortable: false,
      width: 110,
      flex: 1,
    },
  ];

  const rows = [
    {
      id: 1,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 3,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 4,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 5,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 7,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 8,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 9,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 10,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 12,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 13,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 14,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 15,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 17,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 18,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
    {
      id: 19,
      orginalAmount: '25000',
      pendingAmount: '25000',
      allocate: '25000',
      balance: '25000',
      month: 'October 2023',
    },
  ];
  return device === 'desktop' ? (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        gap: '4%',
      }}
    >
      <Stack
        sx={{
          height: '100%',
          width: '68%',
        }}
      >
        <Box
          sx={{
            height: '85%',
            width: '100%',
            '& .edit-cell-background': {
              background: '#d9d9d959',
            },
          }}
        >
          <DataGridPremium
            rows={rows}
            columns={columns}
            density="compact"
            // getRowHeight={() => 'auto'}
            rowHeight={60}
            disableColumnReorder
            disableColumnMenu
            disableColumnResize
            disableRowSelectionOnClick
            checkboxSelection
            hideFooter
            className={classes.datagridcategorization}
            sx={{
              borderRadius: '8px 8px 0 8px !important',
              '& .MuiDataGrid-main': {
                borderRadius: '8px 8px 0 8px !important',
              },
            }}
          />
        </Box>
        <div className={css.refundcategorization}>
          <p className={css.totaltextcategorization}>Total</p>
          <div className={css.allocatebottomdiv}>1,50,000</div>
          <div className={css.balancebottomdiv}>1,50,000</div>
        </div>
      </Stack>

      <Box
        sx={{
          height: '100%',
          width: '28%',
        }}
      >
        <StyledTextarea placeholder=" Notes  ̰(Optional)" />
      </Box>
    </Box>
  ) : (
    <div className={css.statutoryduescategorizationmobile}>
      <Stack
        direction="row"
        justifyContent="space-between"
        width="calc(90% - 24px)"
        ml="10%"
        p="12px"
        gap="1.5%"
      >
        <p className={css.headertext}>Month</p>
        <p className={css.headertext}>To Allocate</p>
        <p className={css.headertext} style={{ textAlign: 'end' }}>
          Balance
        </p>
      </Stack>
      <Box className={css.statutoryduescategorizationcard}>
        <Stack
          alignItems="center"
          p="12px"
          direction="row"
          width="calc(100% - 24px)"
        >
          <Checkbox
            style={{
              color: '#F08B32',
              padding: 0,
              width: '10%',
            }}
            checked
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="90%"
            gap="1.5%"
          >
            <p className={css.monthtext}>Oct 2022</p>
            <p className={css.allocationtext}>200000</p>
            <p className={css.balancetext}>200000</p>
          </Stack>
        </Stack>
        <Stack className={css.bodyofcategorization}>
          <Stack
            alignItems="center"
            p="4px 12px"
            direction="row"
            justifyContent="space-between"
            width="calc(90% - 24px)"
            pl="calc(10% + 12px)"
            gap="1.5%"
            sx={{ background: '#F4F4F4' }}
          >
            <p className={css.bodyheadertext}>GST</p>
            <p className={css.bodyheadertext}>Original Amount</p>
            <p className={css.bodyheadertext} style={{ textAlign: 'end' }}>
              To Allocate
            </p>
          </Stack>
          <Stack>
            <Stack
              alignItems="center"
              p="4px 12px"
              direction="row"
              justifyContent="space-between"
              width="calc(90% - 24px)"
              ml="10%"
            >
              <p className={css.bodyheadertext}>CGST</p>
              <p className={css.amountText}>Rs. 5,00,000</p>
              <input value="5,00,000" className={css.toallocateinput} />
            </Stack>
            <Stack
              alignItems="center"
              p="4px 12px"
              direction="row"
              justifyContent="space-between"
              width="calc(90% - 24px)"
              ml="10%"
            >
              <p className={css.bodyheadertext}>SGST</p>
              <p className={css.amountText}>Rs. 5,00,000</p>
              <input value="5,00,000" className={css.toallocateinput} />
            </Stack>
            <Stack
              alignItems="center"
              p="4px 12px"
              direction="row"
              justifyContent="space-between"
              width="calc(90% - 24px)"
              ml="10%"
            >
              <p className={css.bodyheadertext}>IGST</p>
              <p className={css.amountText}>Rs. 5,00,000</p>
              <input value="5,00,000" className={css.toallocateinput} />
            </Stack>
          </Stack>
        </Stack>
        <Stack
          alignItems="center"
          p="8px"
          direction="row"
          justifyContent="space-between"
          width="calc(60% - 24px)"
          ml="10%"
          gap="2%"
        >
          <p className={css.pendingtext}>Pending Amount</p>
          <p className={css.pendingamountText}>Rs. 5,00,000</p>
        </Stack>
      </Box>
      <Box
        sx={{
          height: '20%',
          width: '100%',
        }}
      >
        <p className={css.noteheader}>Note (optional)</p>
        <StyledTextarea style={{ background: '#fff' }} />
      </Box>
    </div>
  );
};

export default RefundCategorization;
