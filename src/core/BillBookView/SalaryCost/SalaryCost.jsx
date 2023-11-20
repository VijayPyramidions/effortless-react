import React, { useState } from 'react';
import moment from 'moment';

import { Box, Stack, Typography, Button } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import { InvoiceLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';
import SalaryCostAction from './SalaryCostAction';
import upload_department from '../../../assets/upload_department.svg';

import * as css from './salarycost.scss';

const sampleData = [
  {
    id: 11,
    salary_month: '2023-05-23',
    upload_date: '2023-04-22',
    accounted_date: '2023-05-01',
    salary: 35000,
    status: 'pending',
  },
  {
    id: 21,
    salary_month: '2023-06-23',
    upload_date: '2023-05-22',
    accounted_date: '2023-06-01',
    salary: 12000,
    status: 'pending',
  },
  {
    id: 13,
    salary_month: '2023-03-23',
    upload_date: '2023-02-22',
    accounted_date: '2023-03-01',
    salary: 65000,
    status: 'reject',
  },
];

const SalaryCost = () => {
  const [selectedType, setSelectedType] = useState('accounted');
  const [selectedRow, setSelectedRow] = useState({});
  const [drawer, setDrawer] = useState({});

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const accountedColumn = [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      cellClassName: 'fontdensity',
    },
    {
      field: 'salary_month',
      headerName: 'Salary Month',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.salary_month
          ? moment(params.row?.salary_month).format('MMM YYYY')
          : '-',
      flex: 1,
    },
    {
      field: 'upload_date',
      headerName: 'Updated Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.upload_date
          ? moment(params.row?.upload_date).format('MMM DD, YYYY')
          : '-',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'accounted_date',
      headerName: 'Accounted Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.accounted_date
          ? moment(params.row?.accounted_date).format('MMM DD, YYYY')
          : '-',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'salary',
      headerName: 'Salary Payable',
      renderCell: (params) => {
        return (
          <Typography className="MuiDataGrid-cellForAmount">
            {params?.value < 0
              ? `(${customCurrency('INR', 'en-IN').format(params?.value || 0)})`
              : customCurrency('INR', 'en-IN').format(params?.value || 0)}
          </Typography>
        );
      },
      headerClassName: 'left-align--header',
      align: 'right',
      type: 'number',
      flex: 1,
    },
    {
      field: '-',
      headerName: 'Action',
      renderCell: (param) => {
        return (
          <Button
            className={css.linkbutton}
            onClick={() => {
              setSelectedRow(param?.row);
            }}
          >
            View Bill
          </Button>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 140,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

  const unAccountedColumn = [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'salary_month',
      headerName: 'Salary Month',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.salary_month
          ? moment(params.row?.salary_month).format('MMM YYYY')
          : '-',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'upload_date',
      headerName: 'Upload Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.upload_date
          ? moment(params.row?.upload_date).format('MMM DD, YYYY')
          : '-',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (param) => {
        return (
          <Button
            className={
              param?.row?.status === 'reject'
                ? css.rejectbutton
                : css.pendingbutton
            }
            onClick={() => console.log(param)}
          >
            {param?.row?.status}
          </Button>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 200,
      disableColumnMenu: true,
      filterable: false,
      flex: 1,
    },
    {
      field: '-',
      headerName: 'Action',
      renderCell: (param) => {
        return (
          <Button
            className={css.linkbutton}
            onClick={() => {
              setSelectedRow(param?.row);
            }}
          >
            View Bill
          </Button>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 140,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

  return (
    <Box className={css.salaryCost}>
      <Typography className={css.titlecont}>Salary Cost</Typography>
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ margin: '24px' }}
      >
        <Stack className={css.buttonselect}>
          <Button
            className={
              selectedType === 'accounted'
                ? `${css.button} ${css.active}`
                : `${css.button}`
            }
            onClick={() => setSelectedType('accounted')}
          >
            Accounted
          </Button>
          <Button
            className={
              selectedType === 'unaccounted'
                ? `${css.button} ${css.active}`
                : `${css.button}`
            }
            onClick={() => setSelectedType('unaccounted')}
          >
            Unaccounted
          </Button>
        </Stack>
        <Button
          className={css.primaryButton}
          onClick={() => {
            handleDrawer('viewBill', true);
          }}
          startIcon={<img src={upload_department} alt="upload" />}
        >
          Upload Salary Cost
        </Button>
      </Stack>
      <Box>
        <DataGridPremium
          rows={
            selectedType === 'accounted'
              ? sampleData?.map((item, ind) => ({ ...item, sno: ind + 1 }))
              : sampleData?.map((item, ind) => ({ ...item, sno: ind + 1 }))
          }
          columns={
            selectedType === 'accounted' ? accountedColumn : unAccountedColumn
          }
          density="compact"
          rowHeight={60}
          columnHeaderHeight={55}
          disableChildrenSorting
          disableColumnResize
          disableColumnReorder
          disableColumnPinning
          disableAggregation
          disableRowGrouping
          disableColumnSelector
          hideFooter
          disableRowSelectionOnClick
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Data Found.
              </Stack>
            ),
            LoadingOverlay: InvoiceLoadingSkeleton,
          }}
          // loading={BillBoxDataLoad === null}
          className={css.salarycost_datagrid}
          sx={{
            background: '#fff',
            borderRadius: '0px',
            border: 'none',
            '& .MuiDataGrid-virtualScrollerContent': {
              height: 'calc(100vh - 276px) !important',
            },
            '& .MuiDataGrid-columnHeaders': {
              background: '#F5F5F5',
              border: 'none',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'break-spaces',
              textAlign: 'center',
              lineHeight: '20px',
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: '300 !important',
              fontSize: '14px',
            },
            '& .MuiDataGrid-cell': {
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: '300 !important',
              fontSize: '13px',
            },
            '& .MuiDataGrid-row': {
              borderBottom: '1px solid #E5E5E5',
            },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .left-align--header': {
              '.MuiDataGrid-columnHeaderDraggableContainer': {
                flexDirection: 'row !important',
              },
              '.MuiDataGrid-columnHeaderTitleContainer': {
                flexDirection: 'row !important',
                justifyContent: 'end !important',
              },
            },
            '& .MuiDataGrid-cellForAmount': {
              color: '#F08B32',
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: '500 !important',
              fontSize: '14px',
            },
            '& .fontdensity': {
              fontWeight: 400,
            },
          }}
        />
      </Box>
      <SelectBottomSheet
        open={drawer?.viewBill}
        onClose={() => {
          handleDrawer('viewBill', false);
        }}
        triggerComponent={<></>}
        addNewSheet
      >
        <SalaryCostAction selectedRow={selectedRow} />
      </SelectBottomSheet>
    </Box>
  );
};

export default SalaryCost;
