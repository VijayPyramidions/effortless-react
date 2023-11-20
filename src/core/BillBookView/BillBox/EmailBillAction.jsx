import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetSingleEmailBillState,
  ClearStateGetSingleEmailBill,
  DeleteEmailBillState,
  DeleteEmailProviderState,
  PostNewProviderState,
} from '@action/Store/Reducers/Bills/EmailBillsState';
import {
  GetVendorBillDetailsState,
  ClearStateGetVendorBillDetails,
} from '@action/Store/Reducers/Bills/BillBoxState';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import {
  Box,
  Stack,
  Typography,
  IconButton,
  Popover,
  Dialog,
  Button,
  Avatar,
  // MenuItem,
  //   useTheme,
  //   useMediaQuery,
} from '@mui/material';
import { MenuItem } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { DataGridPremium } from '@mui/x-data-grid-premium';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { InvoiceLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';

import gmail_logo from '@assets/BillsLogo/gmail_logo.svg';
import eye_off_red from '@assets/BillsLogo/eye_off_red.svg';
import history_bills from '@assets/BillsLogo/history_bills.svg';
import view_bills from '@assets/BillsLogo/view_bills.svg';
import eye_off from '@assets/BillsLogo/eye-off.svg';
import edit_bill from '@assets/BillsLogo/edit_bill.svg';

import { IgnoreContent } from './EmailBillBox';
import BillViewDialog from '../components/BillViewDialog';
import AddEmailBillProvider from './AddEmailBillProvider';

import * as css from './billBox.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const EmailBillsCard = ({ data, selectedEmail }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { EmailCategoryListData } = useSelector((value) => value.EmailBills);
  const { VendorBillDetails } = useSelector((value) => value.BillBox);

  const [drawer, setDrawer] = useState({});
  const [providerState, setProviderState] = useState({});

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const viewBillFun = () => {
    handleDrawer('moreAction', false);
    dispatch(
      GetSingleEmailBillState({
        emailUserId: selectedEmail?.id,
        emailBillId: data?.id,
      })
    );
  };

  const viewEmailFun = () => {
    handleDrawer('moreAction', false);
  };

  const billHistory = () => {
    handleDrawer('moreAction', false);
    navigate('/bill-box-email', {
      state: {
        emailBillData: {
          ...data,
          name: data?.email_list_name,
          editable: data?.email_list_editable,
        },
        selectedEmail,
      },
    });
  };

  const ignoreFun = () => {
    handleDrawer('moreAction', false);
    handleDrawer('ignoreAction', true);
  };

  const editProviderFun = () => {
    handleDrawer('moreAction', false);
    handleDrawer('editProvider', true);
    setProviderState({
      name: data?.email_list_name,
      email: data?.email,
      expense_category_id: data?.expense_category_id,
      vendor_id: data?.vendor_id
    });
  };

  useEffect(() => {
    if (Object.keys(VendorBillDetails || {})?.length > 0) {
      navigate('/bill-upload', {
        state: {
          selected: VendorBillDetails,
          billBox: true,
          stateForBack: {
            showButton: 'Email Bills',
            selectedEmail,
          },
        },
      });
    }
  }, [JSON.stringify(VendorBillDetails)]);

  useEffect(() => {
    if (
      Object.keys(providerState || {})?.length > 0 &&
      providerState?.editProvider
    ) {
      dispatch(
        PostNewProviderState({
          emailUserId: selectedEmail?.id,
          payload: providerState,
          type: 'edit',
          emailListId: data?.email_list_id,
        })
      );
      handleDrawer('editProvider', false);
      setProviderState({});
    }
  }, [providerState]);

  useEffect(() => {
    return () => {
      dispatch(ClearStateGetVendorBillDetails());
    };
  }, []);

  return (
    <Box className={css.emailbill_box}>
      <Stack
        direction="column"
        gap="12px"
        onClick={() =>
          dispatch(GetVendorBillDetailsState({ bill_id: data?.vendor_bill_id }))
        }
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box component={Stack} direction="row" alignItems="center" gap="8px">
            <Avatar
              sx={{ width: 24, height: 24, border: '.5px solid #9397A4' }}
              src={
                data?.image_key
                  ? `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/email_list_logos/${data?.image_key}.svg`
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${data?.email_list_name}&chars=1`
              }
            />
            <Typography className={css.emailbill_text}>
              {data?.email_list_name}
            </Typography>
          </Box>
          <IconButton
            // sx={{ padding: 0 }}
            onClick={(event) => {
              handleDrawer('moreAction', true);
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Box component={Stack} gap="4px" alignItems="start">
            <Typography className={css.labeltext}>Bill Date</Typography>
            <Typography className={css.valuetext}>
              {data?.bill_date
                ? moment(data?.bill_date)?.format('DD-MM-YYYY')
                : '-'}
            </Typography>
          </Box>
          {/* <Box component={Stack} gap="4px" alignItems="center">
            <Typography className={css.labeltext}>Payment Status</Typography>
            <Typography className={`${css.statustext} ${css[data?.status]}`}>
              {data?.status}
            </Typography>
          </Box> */}
          <Box component={Stack} gap="4px" alignItems="end">
            <Typography className={css.labeltext}>Amount</Typography>
            <Typography className={css.valuetext}>
              {currencyFormatter.format(Math.abs(data?.amount || 0))}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <SelectBottomSheet
        open={drawer?.moreAction}
        onClose={() => handleDrawer('moreAction', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
        styleDrawerMinHeight="auto"
      >
        <BillDetails
          from="emailBillHistoryWithServiceProvider"
          viewBillFun={viewBillFun}
          viewEmailFun={viewEmailFun}
          billHistory={billHistory}
          ignoreFun={ignoreFun}
          editProviderFun={editProviderFun}
          showEdit={data?.email_list_editable}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.ignoreAction}
        onClose={() => handleDrawer('ignoreAction', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
        styleDrawerMinHeight="auto"
      >
        <IgnoreContent
          title="Heads Up"
          descrpitionText="Please select which Activity would you like to perform:"
          leftButton="Ignore Vendor"
          rightButton="Ignore Bill"
          handleNo={() => {
            handleDrawer('ignoreAction', null);
            handleDrawer('ignoreVendor', true);
          }}
          handleYes={() => {
            handleDrawer('ignoreAction', null);
            handleDrawer('ignoreBill', true);
          }}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.ignoreBill}
        onClose={() => handleDrawer('ignoreBill', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
        styleDrawerMinHeight="auto"
      >
        <IgnoreContent
          title="Ignore Bill - Confirm Your Decision"
          descrpitionText={`This Bill from ${data?.email_list_name} will be removed from your Bill Box and won’t be considered for Accounting. How would you like to proceed?`}
          leftButton="Cancel"
          rightButton="Confirm"
          handleNo={() => handleDrawer('ignoreBill', null)}
          handleYes={() => {
            handleDrawer('ignoreBill', null);
            dispatch(
              DeleteEmailBillState({
                emailUserId: selectedEmail?.id,
                emailBillId: data?.id,
              })
            );
          }}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.ignoreVendor}
        onClose={() => handleDrawer('ignoreVendor', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
        styleDrawerMinHeight="auto"
      >
        <IgnoreContent
          title="Ignore Vendor - Confirm Your Decision"
          descrpitionText={`You will no longer be able to receive bills sent by ${data?.email_list_name} to you ${data?.email} ID on Effortless. How would you like to proceed?`}
          leftButton="Cancel"
          rightButton="Confirm"
          handleNo={() => handleDrawer('ignoreVendor', null)}
          handleYes={() => {
            handleDrawer('ignoreVendor', null);
            dispatch(
              DeleteEmailProviderState({
                emailUserId: selectedEmail?.id,
                emailListId: data?.email_list_id,
              })
            );
          }}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.editProvider}
        triggerComponent={<></>}
        onClose={() => handleDrawer('editProvider', false)}
        styleDrawerMinHeight="auto"
      >
        <AddEmailBillProvider
          handleClose={handleDrawer}
          categoryList={EmailCategoryListData?.data}
          setProviderState={setProviderState}
          type="edit"
          providerState={providerState}
        />
      </SelectBottomSheet>
    </Box>
  );
};

export const BillDetails = ({
  from,
  viewBillFun,
  viewEmailFun,
  billHistory,
  editProviderFun,
  ignoreFun,
  showEdit,
}) => {
  return (
    <div>
      <Puller />
      <Stack className={css.moreactionsheet}>
        <ul style={{ padding: 0 }}>
          {[
            {
              name: 'View Bill',
              icon: <img src={view_bills} alt="view" />,
              click: () => {
                viewBillFun();
              },
              show: from !== 'emailBillHistoryForServiceProvider',
            },
            {
              name: 'View Email',
              icon: (
                <img src={gmail_logo} alt="gmail" style={{ width: '16px' }} />
              ),
              click: () => {
                viewEmailFun();
              },
              show: from !== 'emailBillHistoryForServiceProvider',
            },
            {
              name: 'Bill History',
              icon: <img src={history_bills} alt="history" />,
              click: () => {
                billHistory();
              },
              show:
                from !== 'emailBillHistory' &&
                from !== 'emailBillHistoryForServiceProvider',
            },
            {
              name: 'Edit Provider',
              icon: <img src={edit_bill} alt="edit" />,
              click: () => {
                editProviderFun();
              },
              show:
                (from === 'emailBillHistoryForServiceProvider' && showEdit) ||
                (from === 'emailBillHistoryWithServiceProvider' && showEdit),
            },
            {
              name: 'Ignore',
              icon: <img src={eye_off_red} alt="eye_off_red" />,
              color: '#f00',
              click: () => {
                ignoreFun();
              },
              show: true,
            },
          ]
            ?.filter((ele) => ele?.show)
            ?.map((val) => (
              <MenuItem
                key={val?.user_id}
                value={val?.user_id}
                onClick={() => {
                  val?.click();
                }}
                className={css.menutext}
                style={{
                  color: val?.color || '#000',
                }}
              >
                {val?.icon}
                {val?.name}
              </MenuItem>
            ))}
        </ul>
      </Stack>
    </div>
  );
};

export const EmailBillsDatagrid = ({
  EmailBillData,
  selectedEmail,
  handleEditProvider,
}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { EmailBillsListDataLoad, SingleEmailBillData } = useSelector(
    (value) => value.EmailBills
  );
  const { VendorBillDetails } = useSelector((value) => value.BillBox);

  const [drawer, setDrawer] = useState({});
  const [fileUrl, setFileUrl] = useState({});
  const [activeRow, setActiveRow] = useState({});

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };
  const EmailBillColumn = [
    {
      field: 'email_list_name',
      headerName: 'Service Provider',
      renderCell: (param) => {
        return (
          <Stack direction="row" alignItems="center">
            <Avatar
              className={css.avatar_service}
              src={
                param?.row?.image_key
                  ? `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/email_list_logos/${param?.row?.image_key}.svg`
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${param.row?.email_list_name}&chars=1`
              }
            />
            <Typography className="MuiDataGrid-cell">
              {param?.row?.email_list_name}
            </Typography>
          </Stack>
        );
      },
      width: 260,
      flex: 1,
    },
    {
      field: 'bill_date',
      headerName: 'Bill Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.bill_date
          ? moment(params.row?.bill_date).format('DD-MM-YYYY')
          : '-',
      width: 120,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      renderCell: (params) => {
        return (
          <Typography className="MuiDataGrid-columnHeaderTitle">
            {params?.value < 0
              ? `(${currencyFormatter.format(Math.abs(params?.value))})`
              : currencyFormatter.format(params?.value || 0)}
          </Typography>
        );
      },
      headerAlign: 'center',
      align: 'center',
      width: 160,
      flex: 1,
      type: 'number',
    },
    {
      field: 'id',
      headerName: 'Bill',
      renderCell: (param) => {
        return (
          <Stack direction="row" gap="24px" alignItems="center">
            <Button
              onClick={() =>
                dispatch(
                  GetSingleEmailBillState({
                    emailUserId: selectedEmail?.id,
                    emailBillId: param?.row?.id,
                  })
                )
              }
              className={css.openbilltag}
              disabled={!param?.row?.file_attached}
            >
              Open Bill
            </Button>
            <Button
              endIcon={
                <img src={gmail_logo} alt="Gmail" style={{ width: '20px' }} />
              }
              className={css.viewButton}
              target="_blank"
              href={param?.row?.mail_url}
            >
              View
            </Button>
          </Stack>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 200,
      disableColumnMenu: true,
      filterable: false,
    },
    {
      field: '-',
      headerName: 'Action',
      renderCell: (param) => {
        return (
          <Stack direction="row" gap="12px" alignItems="center">
            <Button
              className={css.secondaryButton}
              onClick={() =>
                dispatch(
                  GetVendorBillDetailsState({
                    bill_id: param?.row?.vendor_bill_id,
                  })
                )
              }
            >
              Record Now
            </Button>
            <Button
              className={css.emailbillmoreactionbtn}
              onClick={(event) => {
                handleDrawer('moreAction', event?.currentTarget);
                setActiveRow(param?.row);
              }}
            >
              <MoreHorizIcon sx={{ color: '#000' }} />
            </Button>
          </Stack>
        );
      },
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 220,
      disableColumnMenu: true,
      filterable: false,
    },
  ];

  const handleRowClick = (params) => {
    if (params?.field === 'email_list_name') {
      navigate('/bill-box-email', {
        state: {
          emailBillData: {
            ...params?.row,
            name: params?.row?.email_list_name,
            editable: params?.row?.email_list_editable,
          },
          selectedEmail,
        },
      });
    }
  };

  useEffect(() => {
    if (Object.keys(SingleEmailBillData || {})?.length > 0) {
      if (SingleEmailBillData?.file_url) {
        setFileUrl(SingleEmailBillData?.file_url);
        handleDrawer('viewBill', true);
      } else {
        dispatch(
          openSnackbar({
            message: 'There is no bill.',
            type: 'warning',
          })
        );
      }
      dispatch(ClearStateGetSingleEmailBill());
    }
  }, [JSON.stringify(SingleEmailBillData)]);

  useEffect(() => {
    if (Object.keys(VendorBillDetails || {})?.length > 0) {
      navigate('/bill-upload', {
        state: {
          selected: VendorBillDetails,
          billBox: true,
          stateForBack: {
            showButton: 'Email Bills',
            selectedEmail,
          },
        },
      });
    }
  }, [JSON.stringify(VendorBillDetails)]);

  useEffect(() => {
    return () => {
      dispatch(ClearStateGetVendorBillDetails());
    };
  }, []);

  return (
    <Box>
      <DataGridPremium
        rows={EmailBillData || []}
        columns={EmailBillColumn}
        density="compact"
        rowHeight={80}
        columnHeaderHeight={80}
        disableChildrenSorting
        disableColumnResize
        disableColumnReorder
        hideFooter
        disableRowSelectionOnClick
        disableColumnPinning
        disableAggregation
        disableRowGrouping
        disableColumnSelector
        onCellClick={handleRowClick}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Bill Found.
            </Stack>
          ),
          LoadingOverlay: InvoiceLoadingSkeleton,
        }}
        loading={EmailBillsListDataLoad === null}
        className={css.email_bills_list}
        sx={{
          background: '#fff',
          borderRadius: '0px',
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            background: '#F5F5F5',
            border: 'none',
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            height: 'calc(100vh - 500px) !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'break-spaces',
            textAlign: 'center',
            lineHeight: '20px',
            fontFamily: "'Lexend', sans-serif !important",
            fontWeight: '500 !important',
            fontSize: '14px',
          },
          '& .MuiDataGrid-row': {
            padding: '4px 0',
          },
          '& .MuiDataGrid-cell': {
            fontFamily: "'Lexend', sans-serif !important",
            fontWeight: '300 !important',
            fontSize: '14px',
          },
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
        }}
      />
      {drawer?.viewBill && (
        <BillViewDialog
          file_url={fileUrl}
          onClose={() => handleDrawer('viewBill', false)}
        />
      )}
      <Popover
        open={Boolean(drawer?.moreAction)}
        anchorEl={drawer?.moreAction}
        onClose={() => handleDrawer('moreAction', null)}
        sx={{
          '& .MuiPaper-root': {
            padding: '4px 0',
            width: '200px',
            borderRadius: '8px',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack className={css.moreactionsheet}>
          <ul style={{ padding: 0, margin: 0 }}>
            {activeRow?.email_list_editable && (
              <MenuItem
                onClick={() => {
                  handleEditProvider({
                    name: activeRow?.email_list_name,
                    email: activeRow?.email,
                    expense_category_id: activeRow?.expense_category_id,
                    emailListId: activeRow?.email_list_id,
                    vendor_id: activeRow?.vendor_id
                  });
                  handleDrawer('editProvider', true);
                  handleDrawer('moreAction', null);
                }}
                className={css.menutext}
              >
                <img src={edit_bill} alt="edit" />
                Edit Provider
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                handleDrawer('ignoreAction', true);
                handleDrawer('moreAction', null);
              }}
              className={css.menutext}
            >
              <img src={eye_off} alt="eye_off" />
              Ignore
            </MenuItem>
          </ul>
        </Stack>
      </Popover>
      <Dialog
        open={drawer?.ignoreAction}
        onClose={() => handleDrawer('ignoreAction', false)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <IgnoreContent
          title="Heads Up"
          descrpitionText="Please select which Activity would you like to perform:"
          leftButton="Ignore Vendor"
          rightButton="Ignore Bill"
          handleNo={() => {
            handleDrawer('ignoreAction', null);
            handleDrawer('ignoreVendor', true);
          }}
          handleYes={() => {
            handleDrawer('ignoreAction', null);
            handleDrawer('ignoreBill', true);
          }}
        />
      </Dialog>
      <Dialog
        open={drawer?.ignoreBill}
        onClose={() => handleDrawer('ignoreBill', false)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <IgnoreContent
          title="Ignore Bill - Confirm Your Decision"
          descrpitionText={`This Bill from ${activeRow?.email_list_name} will be removed from your Bill Box and won’t be considered for Accounting. How would you like to proceed?`}
          leftButton="Cancel"
          rightButton="Confirm"
          handleNo={() => handleDrawer('ignoreBill', null)}
          handleYes={() => {
            handleDrawer('ignoreBill', null);
            dispatch(
              DeleteEmailBillState({
                emailUserId: selectedEmail?.id,
                emailBillId: activeRow?.id,
              })
            );
          }}
        />
      </Dialog>
      <Dialog
        open={drawer?.ignoreVendor}
        onClose={() => handleDrawer('ignoreVendor', false)}
        PaperProps={{ style: { width: 400, borderRadius: 12 } }}
      >
        <IgnoreContent
          title="Ignore Vendor - Confirm Your Decision"
          descrpitionText={`You will no longer be able to receive bills sent by ${activeRow?.email_list_name} to you ${activeRow?.email} ID on Effortless. How would you like to proceed?`}
          leftButton="Cancel"
          rightButton="Confirm"
          handleNo={() => handleDrawer('ignoreVendor', null)}
          handleYes={() => {
            handleDrawer('ignoreVendor', null);
            dispatch(
              DeleteEmailProviderState({
                emailUserId: selectedEmail?.id,
                emailListId: activeRow?.email_list_id,
              })
            );
          }}
        />
      </Dialog>
    </Box>
  );
};
