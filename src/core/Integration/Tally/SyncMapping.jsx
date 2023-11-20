import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getSyncMapping,
  postSyncMappingSuper,
  postSyncMapping,
  setSyncMapping,
} from '@action/Store/Reducers/Integration/TallySyncState';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { Button, Stack, Typography } from '@mui/material';

import { ExpandMoreRounded as ExpandMoreRoundedIcon } from '@mui/icons-material';
import { Popover } from '@material-ui/core';

import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';

import emptyData from '@assets/trip_empty.svg';

import ContactsDropDown from '../../BillBookView/Journal/ContactsDropDown';
import * as css from './syncmapping.scss';
import * as css2 from '../../BillBookView/Journal/journal.scss';

export const StatusComponents = {
  draft: (
    <>
      <Typography className={css.draft}>Draft</Typography>
    </>
  ),
  submitted: (
    <>
      <Typography className={css.submitted}>Submitted to SA</Typography>
    </>
  ),
};

const SyncMapping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState('tally');
  const [EFIAccounts, setEFIAccounts] = useState();
  const [TallyAccounts, setTallyAccounts] = useState();
  const [contactEl, setContactEl] = useState(null);
  const [oneRow, setOneRow] = useState(null);
  const [tallyMapData, setTallyMapData] = useState();
  const [effMapData, setEffMapData] = useState();

  const { syncMappingDetail } = useSelector((state) => state.TallySync);

  const style = {
    border: 'none',
    borderWidth: 'unset !important',
    borderStyle: 'none !important',
    borderColor: 'unset !important',

    '& .MuiDataGrid-columnHeadersInner': {
      background: '#F7F7F7',
      flex: 1,
    },

    '& .MuiDataGrid-columnHeader': {
      height: '40px !important',
    },

    '& .MuiDataGrid-cell': {
      minHeight: '56px !important',
      maxHeight: '56px !important',
    },

    '& .MuiDataGrid-row': {
      minHeight: '56px !important',
      maxHeight: '56px !important',
      borderBottom: '1px solid #E5E5E5',
    },

    '& .MuiDataGrid-columnSeparator': { display: 'none' },
  };

  const tabOnClick = (val) => {
    if (tabValue === 'tally') setEffMapData();
    else if (tabValue === 'effortless') setTallyMapData();
    dispatch(getSyncMapping(val));
    setTabValue(val);
  };

  const submitTallyAction = () => {
    const formPayload = tallyMapData
      ?.filter((ele) => ele?.mappingAccount?.id)
      ?.map((element) => ({
        id: element?.id,
        base_account_id: element?.mappingAccount?.id,
      }));

    if (formPayload?.length > 0)
      dispatch(postSyncMappingSuper({ mapping_accounts: formPayload }));
    else
      dispatch(
        openSnackbar({ type: 'error', message: 'Please select the account' })
      );
  };

  const submitEFFAction = (selectedValue) => {
    const formPayload = {
      ledger_parent_name: selectedValue,
    };

    dispatch(postSyncMapping({ id: oneRow?.id, payload: formPayload }));
  };

  const handleContactChange = (value) => {
    if (tabValue === 'tally') {
      const updateData = tallyMapData?.map((item) => {
        if (item.id === oneRow.id)
          return {
            ...item,
            mappingAccount: value,
          };
        return item;
      });
      setTallyMapData(updateData);
    } else if (tabValue === 'effortless') submitEFFAction(value);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <GridToolbarQuickFilter sx={{ marginLeft: 'auto' }} />
      </GridToolbarContainer>
    );
  }

  const TallyColumns = [
    {
      field: 'name',
      headerName: 'Tally Account',
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography
          sx={{ color: '#191919;', fontSize: '14px', fontWeight: '400' }}
        >
          {param?.value}
        </Typography>
      ),
    },
    {
      field: 'ledger_name',
      headerName: 'Tally Group',
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography
          sx={{ color: '#191919;', fontSize: '14px', fontWeight: '400' }}
        >
          {param?.value}
        </Typography>
      ),
    },
    {
      field: 'mappingAccount',
      headerName: 'EFI Account',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Stack>
          <Stack
            className={`${css.select}`}
            onClick={(e) => {
              setContactEl(e.currentTarget);
              setOneRow(param?.row);
            }}
          >
            <input
              className={css.input}
              value={
                param?.row?.mappingAccount?.name ||
                EFIAccounts?.filter(
                  (ele) => ele?.id === param?.row?.mapping_account_id
                )[0]?.name
              }
            />
            <ExpandMoreRoundedIcon className={css.icon} />
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 60,
      groupable: false,
      flex: 1,
      renderCell: (param) =>
        param?.row?.status?.toLowerCase() === 'submitted to sa'
          ? StatusComponents?.submitted
          : StatusComponents[param.row.status],
    },
  ];

  const EffortlessColumns = [
    {
      field: 'name',
      headerName: 'EFL Account',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography
          sx={{ color: '#191919;', fontSize: '14px', fontWeight: '400' }}
        >
          {param?.value}
        </Typography>
      ),
    },
    {
      field: 'acc_group_name',
      headerName: 'EFL Group',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography
          sx={{ color: '#191919;', fontSize: '14px', fontWeight: '400' }}
        >
          {param?.value}
        </Typography>
      ),
    },
    {
      field: 'ledger_name',
      headerName: 'Tally Account',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography
          sx={{ color: '#191919;', fontSize: '14px', fontWeight: '400' }}
        >
          {param?.value}
        </Typography>
      ),
    },
    {
      field: 'mappingAccount',
      headerName: 'Tally Group',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Stack>
          <Stack
            className={`${css.select}`}
            onClick={(e) => {
              setContactEl(e.currentTarget);
              setOneRow(param?.row);
            }}
          >
            <input
              className={css.input}
              value={
                param?.row?.mappingAccount?.name
                  ? param?.row?.mappingAccount?.name
                  : param?.row?.mappingAccount
              }
            />
            <ExpandMoreRoundedIcon className={css.icon} />
          </Stack>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    if (tabValue === 'tally') setTallyMapData(syncMappingDetail?.data);
    else if (tabValue === 'effortless') setEffMapData(syncMappingDetail?.data);

    if (syncMappingDetail?.master_accounts?.length > 0)
      setEFIAccounts(syncMappingDetail?.master_accounts);

    if (syncMappingDetail?.tally_group?.length > 0)
      setTallyAccounts(syncMappingDetail?.tally_group);
  }, [syncMappingDetail]);

  useEffect(() => {
    dispatch(getSyncMapping('tally'));
    return () => {
      dispatch(setSyncMapping(null));
    };
  }, []);

  return (
    <Stack className={css.syncMappingContainer}>
      <Stack className={css.headerContainer}>
        <Typography className={css.headerText}>
          {tabValue === 'tally' ? 'Tally Accounts List' : 'EFL Accounts List'}
        </Typography>
        <Stack className={css.headerBtnContainer}>
          {tabValue === 'tally' && (
            <Button
              className={css.submitSuperAccBtn}
              onClick={submitTallyAction}
            >
              Submit to Super Accountant
            </Button>
          )}
          <Stack
            direction="row"
            className={css.uploadBtn}
            onClick={() => {
              navigate(`/invoice-upload`, {
                state: {
                  from: 'sync',
                  type: tabValue,
                  thisFor: 'account_mappings',
                },
              });
            }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                  stroke="#283049"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.3327 5.33333L7.99935 2L4.66602 5.33333"
                  stroke="#283049"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2V10"
                  stroke="#283049"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{' '}
            </span>
            <Typography className={css.uploadBtnTxt}>upload</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack className={css.tabwrapper}>
        <Stack className={css.tabbtnwrapper}>
          <Button
            className={
              tabValue === 'tally' ? `${css.tabbtn} ${css.active}` : css.tabbtn
            }
            onClick={() => tabOnClick('tally')}
          >
            Tally
          </Button>
          <Button
            className={
              tabValue === 'effortless'
                ? `${css.tabbtn} ${css.active}`
                : css.tabbtn
            }
            onClick={() => tabOnClick('effortless')}
          >
            Effortless
          </Button>
        </Stack>
      </Stack>
      <Stack className={css.tableContainer}>
        {tabValue === 'tally' ? (
          <DataGridPremium
            sx={style}
            columns={TallyColumns}
            rows={tallyMapData || []}
            hideFooter
            disableRowSelectionOnClick
            density="compact"
            getDetailPanelHeight={() => 'auto'}
            disableChildrenSorting
            // onRowClick={(param) => handleRowClick(param)}
            // getRowHeight={() => 'auto'}
            // rowHeight={58}
            // disableColumnMenu
            // disableColumnResize
            disableColumnReorder
            disableColumnPinning
            disableRowGrouping
            disableAggregation
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img src={emptyData} alt="no data" />
                </Stack>
              ),
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            slotProps={{
              panel: { placement: 'auto' },
            }}
          />
        ) : (
          <DataGridPremium
            sx={style}
            columns={EffortlessColumns}
            rows={effMapData || []}
            hideFooter
            disableRowSelectionOnClick
            density="compact"
            getDetailPanelHeight={() => 'auto'}
            disableChildrenSorting
            // onRowClick={(param) => handleRowClick(param)}
            // rowHeight={58}
            // getRowHeight={() => 'auto'}
            // disableColumnMenu
            // disableColumnResize
            disableColumnReorder
            disableColumnPinning
            disableRowGrouping
            disableAggregation
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img src={emptyData} alt="no data" />
                </Stack>
              ),
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            slotProps={{
              panel: { placement: 'auto' },
            }}
          />
        )}
      </Stack>

      <Popover
        open={Boolean(contactEl)}
        anchorEl={contactEl}
        onClose={() => {
          setContactEl(null);
          // setTabValue('tally');
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className={css2.contactPopover}
        sx={{
          '& .MuiPaper-elevation': {
            borderRadius: '8px',
            background: '#FFF',
            boxShadow: '0px -1px 0px 0px rgba(0, 0, 0, 0.10) initial',
          },
        }}
      >
        <ContactsDropDown
          onChange={(e) => handleContactChange(e)}
          onClose={() => setContactEl(null)}
          data={tabValue === 'tally' ? EFIAccounts : TallyAccounts}
          from="sync"
        />
      </Popover>
    </Stack>
  );
};

export default memo(SyncMapping);
