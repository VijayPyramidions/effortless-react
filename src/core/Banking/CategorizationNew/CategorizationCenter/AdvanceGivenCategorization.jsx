/* eslint-disable no-nested-ternary */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
// import { DataGridPremium } from '@mui/x-data-grid-premium';
import { IndianCurrency } from '@components/utils';
import { useStyles, StyledTextarea } from './CategorizationStyledComponents';
import * as css from './CategorizationCenter.scss';

const AdvanceGivenCategorization = ({
  stateData,
  CategorizationAdvanceTableDataState,
  hideTDS,
  setCategorizationState,
  tdspercentagestate,
  CategorizationViewTableDataState,
  selectedTransaction,
  status,
  CategorizationState,
}) => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const [advanceData, setAdvanceData] = useState([]);
  const [textValue, setTextValue] = useState();
  const maxTds = Number((((30) / 100) * Math.abs(selectedTransaction?.amount))?.toFixed(2));
  const isSelectedBill = (CategorizationState?.purposeState?.name === selectedTransaction?.purpose && CategorizationState?.partyState?.id === selectedTransaction?.entity_id);

  const columns = [
    {
      headerName: 'Ref. No.',
    },
    {
      headerName:
        selectedTransaction?.amount > 0
          ? 'Receivable Amount'
          : 'Payable Amount',
    },
    {
      headerName: 'TDS',
    },
    {
      headerName: selectedTransaction?.amount > 0
        ? 'Received'
        : 'Paid',
    },
  ];

  const onInputChange = (e) => {
    if (e?.target?.value < 0) {
      e?.preventDefault();
      return;
    }
    const targetValue = Number(e?.target?.value) > maxTds ? maxTds : parseInt(String(e.target.value),10);
    setAdvanceData([
      {
        id: CategorizationAdvanceTableDataState?.advance_voucher_number,
        payableAmount: targetValue ? targetValue + Math.abs(selectedTransaction?.amount) : Math.abs(selectedTransaction?.amount)|| 0,
        paid: Math.abs(selectedTransaction?.amount) || 0,
        tds: targetValue || 0,
      },
    ]);
    setCategorizationState((prev) => ({
      ...prev,
      advanceData: {
        id: CategorizationAdvanceTableDataState?.advance_voucher_number,
        payableAmount: targetValue ? targetValue + Math.abs(selectedTransaction?.amount) : Math.abs(selectedTransaction?.amount) || 0,
        paid: Math.abs(selectedTransaction?.amount) || 0,
        tds: targetValue || 0,
      },
    }));
    e.target.value = targetValue;
  };

  useEffect(() => {
    if (
      CategorizationAdvanceTableDataState?.advance_voucher_number &&
      !CategorizationViewTableDataState
    ) {
      setAdvanceData([
        {
          id: CategorizationAdvanceTableDataState?.advance_voucher_number,
          payableAmount:
            ((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount) +
              Math.abs(selectedTransaction?.amount) || 0,
          paid: Math.abs(selectedTransaction?.amount) || 0,
          tds:
          Number((((tdspercentagestate || 0) / 100) *
          Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
        },
      ]);
      setCategorizationState((prev) => ({
        ...prev,
        advanceData: {
          id: CategorizationAdvanceTableDataState?.advance_voucher_number,
          payableAmount:
            ((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount) +
              Math.abs(selectedTransaction?.amount) || 0,
          paid: Math.abs(selectedTransaction?.amount) || 0,
          tds:
            Number((((tdspercentagestate || 0) / 100) *
            Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
        },
      }));
    } else if (CategorizationViewTableDataState) {
      if(isSelectedBill){
        setAdvanceData([
          {
            id: selectedTransaction?.categorized_lines?.[0]?.number,
            payableAmount:
              Number(
                selectedTransaction?.categorized_lines?.[0]?.original_amount
              ) + Number(selectedTransaction?.categorized_lines?.[0]?.tds_amount),
            paid: selectedTransaction?.categorized_lines?.[0]?.allocated_amount,
            tds: (selectedTransaction?.categorized_lines?.[0]?.tds_amount)?.toFixed(2),
          },
        ]);
        setTextValue(selectedTransaction?.categorization_narration);
      } else {
        setAdvanceData([
          {
            id: CategorizationAdvanceTableDataState?.advance_voucher_number,
            payableAmount:
              ((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount) +
                Math.abs(selectedTransaction?.amount) || 0,
            paid: Math.abs(selectedTransaction?.amount) || 0,
            tds:
            Number((((tdspercentagestate || 0) / 100) *
            Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
          },
        ]);
        setCategorizationState((prev) => ({
          ...prev,
          advanceData: {
            id: CategorizationAdvanceTableDataState?.advance_voucher_number,
            payableAmount:
              ((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount) +
                Math.abs(selectedTransaction?.amount) || 0,
            paid: Math.abs(selectedTransaction?.amount) || 0,
            tds:
              Number((((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
          },
        }));
      }
      
    }
  }, [
    CategorizationAdvanceTableDataState?.advance_voucher_number,
    stateData,
    CategorizationViewTableDataState,
    selectedTransaction,
  ]);

  useEffect(() => {
    if (
      CategorizationAdvanceTableDataState?.advance_voucher_number &&
      !CategorizationViewTableDataState
    ) {
      setAdvanceData([
        {
          id: CategorizationAdvanceTableDataState?.advance_voucher_number,
          payableAmount:
            ((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount) +
              Math.abs(selectedTransaction?.amount) || 0,
          paid: Math.abs(selectedTransaction?.amount) || 0,
          tds:
            Number((((tdspercentagestate || 0) / 100) *
            Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
        },
      ]);
      setCategorizationState((prev) => ({
        ...prev,
        advanceData: {
          id: CategorizationAdvanceTableDataState?.advance_voucher_number,
          payableAmount:
            ((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount) +
              Math.abs(selectedTransaction?.amount) || 0,
          paid: Math.abs(selectedTransaction?.amount) || 0,
          tds:
            Number((((tdspercentagestate || 0) / 100) *
            Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
        },
      }));
    } else if (CategorizationViewTableDataState) {
      if(isSelectedBill){
        setAdvanceData([
          {
            id: selectedTransaction?.categorized_lines?.[0]?.number,
            payableAmount:
              status === 'Edit'
                ? selectedTransaction?.categorized_lines?.[0]?.original_amount
                : ((tdspercentagestate || 0) / 100) *
                    Math.abs(selectedTransaction?.amount) +
                  Math.abs(selectedTransaction?.amount),
            paid: selectedTransaction?.categorized_lines?.[0]?.allocated_amount,
            tds:
              status === 'Edit'
                ? (selectedTransaction?.categorized_lines?.[0]?.tds_amount)?.toFixed(2)
                : Number((((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
                  Math.abs(selectedTransaction?.amount))?.toFixed(2),
          },
        ]);
      } else {
        setAdvanceData([
          {
            id: CategorizationAdvanceTableDataState?.advance_voucher_number,
            payableAmount:
              ((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount) +
                Math.abs(selectedTransaction?.amount) || 0,
            paid: Math.abs(selectedTransaction?.amount) || 0,
            tds:
              Number((((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
          },
        ]);
        setCategorizationState((prev) => ({
          ...prev,
          advanceData: {
            id: CategorizationAdvanceTableDataState?.advance_voucher_number,
            payableAmount:
              ((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount) +
                Math.abs(selectedTransaction?.amount) || 0,
            paid: Math.abs(selectedTransaction?.amount) || 0,
            tds:
              Number((((tdspercentagestate || 0) / 100) *
              Math.abs(selectedTransaction?.amount))?.toFixed(2)) > maxTds ? maxTds : (((tdspercentagestate || 0) / 100) *
                Math.abs(selectedTransaction?.amount))?.toFixed(2) || 0,
          },
        }));
      }
      
    }
  }, [tdspercentagestate, hideTDS, stateData]);

  useEffect(() => {
    if (textValue)
      setCategorizationState((prev) => ({ ...prev, narration: textValue }));
  }, [textValue]);

  return device === 'desktop' ? (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        gap: '4%',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '48%',
          '& .custom-header': {
            background: '#d9d9d959',
          },
        }}
      >
        <TableContainer className={css.advancetableContainer}>
          <Table className={classes.table} stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns?.map((val) => (
                  <TableCell>{val?.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {advanceData?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.id}</TableCell>
                  <TableCell align="right">
                    {IndianCurrency.format(item?.payableAmount || 0)}
                  </TableCell>
                  <TableCell align="right">
                    {CategorizationViewTableDataState && status === 'Add' && (
                      <input
                        type="number"
                        className={css.inputallocatefield}
                        value={item?.tds}
                        onChange={(e) => onInputChange(e, item?.id)}
                        disabled={hideTDS}
                      />
                    )}
                    {!CategorizationViewTableDataState && status === 'Add' && (
                      <input
                        type="number"
                        className={css.inputallocatefield}
                        value={item?.tds}
                        onChange={(e) => onInputChange(e, item?.id)}
                        disabled={hideTDS}
                      />
                    )}
                    {(CategorizationViewTableDataState &&
                      status === 'Edit' && isSelectedBill) &&
                      IndianCurrency.format(item?.tds || 0)}
                  </TableCell>
                  <TableCell align="right">
                    {IndianCurrency.format(item?.paid || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <DataGridPremium
          rows={advanceData}
          columns={columns}
          density="compact"
          // getRowHeight={() => 'auto'}
          rowHeight={60}
          disableColumnReorder
          disableColumnMenu
          disableColumnResize
          disableRowSelectionOnClick
          hideFooter
          className={classes.datagridcategorization}
          sx={{
            borderRadius: '4px !important',
            '& .MuiDataGrid-main': {
              borderRadius: '4px !important',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'break-spaces',
              lineHeight: '16px',
            },
            '& .MuiDataGrid-columnHeaders, .MuiDataGrid-columnHeader': {
              minHeight: '49px !important',
              maxHeight: '49px !important',
            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              justifyContent: 'flex-start',
              alignItems: 'flex-start !important',
              marginTop: '8px',
            },
          }}
        /> */}
      </Box>

      <Box
        sx={{
          height: '100%',
          width: '48%',
        }}
      >
        <StyledTextarea
          placeholder="Notes (Optional)"
          onChange={(e) => setTextValue(e.target.value)}
          value={textValue}
          disabled={CategorizationViewTableDataState && status === 'Edit'}
        />
      </Box>
    </Box>
  ) : (
    <div className={css.advancegivencategorizationmobile}>
      <Stack
        justifyContent="space-between"
        width="calc(100% - 24px)"
        direction="row"
        p="12px"
      >
        <p className={css.headeradvtxt}>Ref. No.</p>
        <p className={css.headeradvtxt}>
          {selectedTransaction?.amount > 0
            ? 'Receivable Amount'
            : 'Payable Amount'}
        </p>
        <p className={css.headeradvtxt}>{selectedTransaction?.amount > 0
            ? 'Received'
            : 'Paid'}</p>
      </Stack>
      <Box sx={{ background: '#EDEDED', borderRadius: '0 0 8px 8px' }}>
        <Stack
          justifyContent="space-between"
          width="calc(100% - 26px)"
          direction="row"
          p="12px"
          sx={{
            background: '#fff',
            border: '1px solid #D8D8D8',
            borderRadius: '4px',
          }}
        >
          <Stack justifyContent="space-between" width="70%" direction="row">
            <p className={css.refnumbertxt}>{advanceData[0]?.id}</p>
            <p className={css.payabletxt}>
              {IndianCurrency.format(advanceData[0]?.payableAmount || 0)}
            </p>
          </Stack>
          <p className={ selectedTransaction?.amount > 0 ? css.receivedtxt : css.paidtxt}>
            {IndianCurrency.format(advanceData[0]?.paid || 0)}
          </p>
        </Stack>

        <Stack
          justifyContent="space-between"
          width="calc(70% - 24px)"
          direction="row"
          p="12px"
        >
          <p className={css.tdstxt}>TDS Amount</p>
          <input
            value={parseInt(String(advanceData[0]?.tds),10)}
            className={css.tdsinput}
            onChange={(e) => onInputChange(e, advanceData[0]?.id)}
            type="number"
            disabled={hideTDS}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          height: '20%',
          width: '100%',
          marginTop: '10px',
        }}
      >
        <p className={css.noteheader}>Note (optional)</p>
        <StyledTextarea
          style={{ background: '#fff' }}
          onChange={(e) => setTextValue(e.target.value)}
          value={textValue}
          disabled={CategorizationViewTableDataState && status === 'Edit'}
        />
      </Box>
    </div>
  );
};

export default AdvanceGivenCategorization;
