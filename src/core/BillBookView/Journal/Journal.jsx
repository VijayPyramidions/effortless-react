import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Stack, Typography, Button, Box } from '@mui/material';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';

import { AddRounded as AddRoundedIcon } from '@mui/icons-material';
import {
  setDrawer,
  getJournalDesc,
  getJournals,
  getOneJournal,
  setOneJournal,
  getJournalContacts,
} from '@action/Store/Reducers/Bills/JournalState';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { InvoiceLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';
import { IndianCurrency } from '@components/utils';
import empty from '@assets/trip_empty.svg';

import PostJournal from './PostJournal';
import * as css from './journal.scss';

const style = {
  border: 'none',
  borderWidth: 'unset !important',
  borderStyle: 'none !important',
  borderColor: 'unset !important',

  '& .MuiDataGrid-columnHeadersInner': {
    flex: 1,
  },

  '& .MuiDataGrid-columnHeaders': {
    background: '#F7F7F7',
    border: 'none !important',
  },
  '& .MuiDataGrid-columnHeader': {
    height: '40px !important',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: '#464646',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '16px',
  },

  '& .MuiDataGrid-cell': {
    minHeight: '56px !important',
    maxHeight: '56px !important',
  },
  '& .MuiDataGrid-cellContent': {
    color: '#283049',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '16px',
  },

  '& .MuiDataGrid-row': {
    minHeight: '56px !important',
    maxHeight: '56px !important',
    borderBottom: '1px solid #E5E5E5',
  },

  // '& .MuiDataGrid-columnSeparator': { display: 'none' },
};

const status = {
  'In Review': (
    <>
      <Stack className={`${css.status} ${css.inreview}`}>
        <Typography className={`${css.label} ${css.reviewlabel}`}>
          In Review
        </Typography>
      </Stack>
    </>
  ),
  Completed: (
    <>
      <Stack className={`${css.status} ${css.completed}`}>
        <Typography className={`${css.label} ${css.completedlabel}`}>
          Completed
        </Typography>
      </Stack>
    </>
  ),
  Reject: (
    <>
      <Stack className={`${css.status} ${css.reject}`}>
        <Typography className={`${css.label} ${css.rejectlabel}`}>
          Rejected
        </Typography>
      </Stack>
    </>
  ),
};

const coloums = [
  {
    field: 'sno',
    headerName: 'S No',
    width: 70,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200,
    groupable: false,
    sortable: true,
    flex: 1,
  },
  {
    field: 'note',
    headerName: 'Note',
    width: 240,
    groupable: false,
    sortable: true,
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 90,
    groupable: false,
    sortable: true,
    renderCell: (param) =>
      moment(param.row.date, 'YYYY-MM-DD').format('DD-MM-YYYY'),
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 160,
    groupable: false,
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    renderCell: (param) => IndianCurrency.format(param.row.amount),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    groupable: false,
    sortable: true,
    renderCell: (param) => status[param.row.status],
  },
];

const CustomToolbar = () => {
  return (
    <GridToolbarContainer className={css.toolbarcontainer}>
      <GridToolbarColumnsButton className={css.columnfilter} />
      <GridToolbarFilterButton className={css.toolbarfilter} />
      <GridToolbarExport className={css.dataexprt} />
      <GridToolbarQuickFilter className={css.globalsearch} />
    </GridToolbarContainer>
  );
};

const Journal = () => {
  const dispatch = useDispatch();

  const { drawer, journals, dataLoad } = useSelector((state) => state.Journal);
  const [desc, setDesc] = useState('');

  const handleRowClick = (data) => dispatch(getOneJournal(data.id));

  useEffect(() => {
    dispatch(getJournals());
    dispatch(getJournalDesc());
    dispatch(getJournalContacts(''));

    return () => {
      dispatch(setDrawer({ name: 'open', value: false }));
    };
  }, [dispatch]);

  return (
    <>
      <Stack className={css.journalcontainer}>
        <Stack className={css.headercontainer}>
          <Typography variant="h4" className={css.headertitle}>
            Journal List
          </Typography>
          <Button
            className={css.addpostbtn}
            onClick={() => {
              dispatch(setDrawer({ name: 'open', value: true }));
              dispatch(setOneJournal(null));
              setDesc('');
            }}
          >
            <AddRoundedIcon className={css.btnicon} />
            Add New Journal
          </Button>
        </Stack>
        <Box sx={{ height: 'calc(100vh - 210px)', width: '100%' }}>
          <DataGridPremium
            sx={style}
            columns={coloums}
            rows={journals?.map((item, ind) => ({ ...item, sno: ind + 1 }))}
            onRowClick={(param) => handleRowClick(param.row)}
            disableRowSelectionOnClick
            disableColumnPinning
            disableColumnReorder
            disableChildrenSorting
            disableChildrenFiltering
            disableAggregation
            disableColumnSelector
            hideFooter
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img src={empty} alt="No data" />
                </Stack>
              ),
              LoadingOverlay: InvoiceLoadingSkeleton,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            loading={dataLoad.journal}
          />
        </Box>
      </Stack>

      <SelectBottomSheet
        open={drawer?.open}
        onClose={() => {
          dispatch(setDrawer({ name: 'open', value: false }));
          dispatch(setOneJournal(null));
        }}
        fixedWidthSheet={desc === 'Others' ? '75vw' : '39vw'}
        triggerComponent={<></>}
        addNewSheet
      >
        <PostJournal setDesc={setDesc} />
      </SelectBottomSheet>
    </>
  );
};

export default memo(Journal);
