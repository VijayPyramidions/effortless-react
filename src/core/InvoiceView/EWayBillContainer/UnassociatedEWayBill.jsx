import React, { useState } from 'react';
import moment from 'moment';
import { Box, Stack, Avatar, Typography } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';

import { InvoiceDialogView } from '../../../components/InvoiceBilDialog/InvoiceBillDialogView';

import { data } from './EWayBillInvoice';

import * as css from './EWayBillStyle.scss';

const UnassociatedEWayBill = () => {
  const device = localStorage.getItem('device_detect');
  const [invoiceAction, setInvoiceAction] = useState({});
  const unApprovedColumn = [
    {
      field: 'invoice_number',
      headerName: 'Invoice No',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params?.row?.id) {
                setInvoiceAction({
                  open: true,
                  id: params?.row?.id,
                  name: params.row?.invoice_number,
                });
              }
            }}
          >
            <p
              style={{
                whiteSpace: 'nowrap',
                color: params.row?.id ? '#1F4FB9' : '#000',
                cursor: params.row?.id && 'pointer',
              }}
            >
              {params.row?.invoice_number}
            </p>
          </div>
        );
      },
      sortable: false,
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center">
            <Avatar className={css.avatar}>
              {params.row?.customer_name[0]}
            </Avatar>
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.customer_name}
            </p>
          </Stack>
        );
      },
      sortable: false,
    },
    {
      field: 'document_type',
      headerName: 'Transporter',
      renderCell: (params) => {
        return (
          <p style={{ whiteSpace: 'nowrap' }}>{params.row?.document_type}</p>
        );
      },
      sortable: false,
      align: 'right',
      width: 105,
    },
    {
      field: 'generator_name',
      headerName: 'E-Way Bill No',
      renderCell: (params) => {
        return (
          <p style={{ whiteSpace: 'nowrap' }}>{params.row?.generator_name}</p>
        );
      },
      sortable: false,
      align: 'right',
      width: 110,
    },
    {
      field: 'created_at',
      headerName: 'E-Way Bill - Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        moment(params.row?.created_at).format('DD-MM-YYYY'),
      sortable: false,
      align: 'right',
      width: 135,
    },
    {
      field: 'updated_at',
      headerName: 'Expiry Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        moment(params.row?.created_at).format('DD-MM-YYYY'),
      sortable: false,
      align: 'right',
      width: 105,
    },
  ];
  return (
    <>
      {device === 'desktop' ? (
        <Box
          className={css.unassociatedewaybilldesktop}
          sx={{
            '& .left-align--header': {
              '.MuiDataGrid-columnHeaderDraggableContainer': {
                flexDirection: 'row !important',
              },
              '.MuiDataGrid-columnHeaderTitleContainer': {
                flexDirection: 'row !important',
              },
              textAlign: 'left',
            },
          }}
        >
          <Typography component="p" className={css.toptext}>
            E-Way Bills
          </Typography>

          <DataGridPremium
            rows={data}
            columns={unApprovedColumn}
            density="compact"
            getRowHeight={() => 'auto'}
            rowHeight={60}
            disableColumnMenu
            disableChildrenSorting
            disableColumnResize
            disableColumnReorder
            hideFooter
            disableRowSelectionOnClick
            components={{
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  No Data Found
                </Stack>
              ),
              // LoadingOverlay: InvoiceLoadingSkeleton,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            // loading={unApprovedLoad === null}
            sx={{
              background: '#fff',
              borderRadius: '0px',
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                background: '#F5F5F5',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'break-spaces',
                textAlign: 'center',
                lineHeight: '20px',
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '400 !important',
                fontSize: '13px',
              },
              '& .MuiDataGrid-row': {
                // cursor: 'pointer !important',
                padding: '4px 0',
              },
              '& .MuiDataGrid-cell': {
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '300 !important',
                fontSize: '13px',
              },
              '& .MuiDataGrid-columnSeparator': { display: 'none' },
            }}
          />
        </Box>
      ) : (
        <div className={css.unassociatedewaybillmobile}>
          {data?.map((val) => (
            <Box className={css.unassociatedewaybillbox}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                gap="4%"
              >
                <p className={css.customername}>{val?.customer_name}</p>{' '}
                <Box
                  sx={{
                    padding: '2px 8px',
                    background: '#99BFD3',
                    borderRadius: '2px',
                    width: '15%',
                  }}
                >
                  <p className={css.traveltype}>Road</p>
                </Box>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                gap="2%"
              >
                <div
                  onClick={() => {
                    if (val?.id) {
                      setInvoiceAction({
                        open: true,
                        id: val?.id,
                        name: val?.invoice_number,
                      });
                    }
                  }}
                  style={{ width: '32%' }}
                >
                  <p
                    style={{
                      color: val?.id ? '#1F4FB9' : '#000',
                    }}
                    className={css.invoicenumber}
                  >
                    {val?.invoice_number}
                  </p>
                </div>
                <p className={css.invoicedate}>
                  Bill Date-{moment(val?.created_at).format('DD-MM-YYYY')}
                </p>
                <p className={css.invoicedate}>
                  Expiry-{moment(val?.created_at).format('DD-MM-YYYY')}
                </p>
              </Stack>
            </Box>
          ))}
        </div>
      )}
      {invoiceAction?.open && (
        <InvoiceDialogView
          invoiceAction={invoiceAction}
          setInvoiceAction={setInvoiceAction}
        />
      )}
    </>
  );
};

export default UnassociatedEWayBill;
