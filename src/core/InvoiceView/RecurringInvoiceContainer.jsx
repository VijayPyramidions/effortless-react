import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetInvoiceRecurringState,
  ClearStateInvoiceRecurring,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import { makeStyles } from '@material-ui/core/styles';
import * as Mui from '@mui/material';
import {CircularProgress} from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid-premium';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import moment from 'moment';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import AppContext from '@root/AppContext.jsx';
import upload from '@assets/fileupload.svg';
import * as Router from 'react-router-dom';
import {
  InvoiceLoadingSkeleton,
  MobileInvoiceLoadingSkeleton,
} from '../../components/SkeletonLoad/SkeletonLoader';
import * as css from './CreateInvoiceContainer.scss';

const useStyles = makeStyles(() => ({
  headingRecurring: {
    fontWeight: '500',
    fontSize: '13px',
    lineHeight: '15px',
    display: 'flex',
    alignItems: 'center',
    color: '#283049',
    paddingBottom: '5px',
  },
  divider: {
    borderRadius: '8px',
    width: '16px',
    height: '3px',
    backgroundColor: '#F08B32',
  },
  cardItem: {},

  name: {
    paddingBottom: '18px',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#2E3A59',
    whiteSpace: 'nowrap',
    width: '40vw',
    textOverflow: 'ellipsis',
    textTransform: 'capitalize',
    overflow: 'hidden',
  },
  contentAndDate: {
    textAlign: 'justify',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#000000',
    marginBottom: '18px',
  },
  amount: {
    fontWeight: '700',
    fontSize: '13px',
    lineHeight: '16px',
    color: '#000000',
    whiteSpace: 'nowrap',
    marginLeft: '4%',
    marginRight: '3%',
    marginTop: '2px',
  },
}));

const RecurringInvoiceContainer = () => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const { userPermissions } = useContext(AppContext);
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const dispatch = useDispatch();
  const { invoiceRecurringData, recurringLoad } = useSelector(
    (value) => value.Invoice,
  );
  const [draftInvoice, setDraftInvoice] = useState([]);
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const [valueOptionsFilter, setValueOptionsFilter] = React.useState([]);

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Invoicing || {})?.length > 0) {
      if (!userPermissions?.Invoicing?.Invoicing) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Invoicing });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (invoiceRecurringData?.data) {
      if (invoiceRecurringData?.page === 1) {
        setDraftInvoice(invoiceRecurringData?.data);
      } else {
        setDraftInvoice((prev) => [...prev, ...invoiceRecurringData?.data]);
      }
      if (
        invoiceRecurringData?.pages > 1 &&
        invoiceRecurringData?.page < invoiceRecurringData?.pages &&
        device === 'desktop'
      ) {
        dispatch(
          GetInvoiceRecurringState({ numPage: invoiceRecurringData?.page + 1 }),
        );
      }
      if (device === 'mobile') {
        sethasMoreItems(
          invoiceRecurringData?.page !== invoiceRecurringData?.pages,
        );
      }
    }
  }, [JSON.stringify(invoiceRecurringData)]);

  const loadMore = () => {
    if (invoiceRecurringData?.pages > 1) {
      dispatch(
        GetInvoiceRecurringState({ numPage: invoiceRecurringData?.page + 1 }),
      );
    }
  };

  useEffect(() => {
    dispatch(GetInvoiceRecurringState());
    return () => {
      dispatch(ClearStateInvoiceRecurring());
    };
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'white',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
    boxSizing: 'border-box',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: 'None',
  }));

  const handleRowSelection = (c) => {
    if (!userRoles?.Contract?.view_recurring_invoices) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    navigate('/invoice-recurring-view', {
      state: { id: c.id, recurringAccess: userRoles?.Contract },
    });
  };

  const upcomingInvoice = (dayOfCreation) => {
    if (Number(dayOfCreation) > new Date().getDate()) {
      return `${moment(
        new Date(
          `${dayOfCreation}/${moment().format('MMM')}/${moment().format(
            'YYYY',
          )}`,
        ),
      ).format('MMM DD')}`;
    }
    if (Number(dayOfCreation) <= new Date().getDate()) {
      return `${moment(
        new Date(
          `${dayOfCreation}/${moment().format('MMM')}/${moment().format(
            'YYYY',
          )}`,
        ),
      )
        .add(1, 'months')
        .format('MMM DD')}`;
    }
    return '-';
  };

  React.useEffect(() => {
    if (device === 'desktop') {
      const temp = Array.from(
        new Set(draftInvoice?.map((invoice) => invoice?.customer_name)),
      )?.map((customerName) => ({ value: customerName, label: customerName }));
      setValueOptionsFilter(temp);
    }
  }, [device, draftInvoice]);

  const recurringColumn = [
    {
      field: 'code',
      headerName: 'Agreement Code',
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p
              style={{
                whiteSpace: 'break-spaces',
                textTransform: 'capitalize',
              }}
            >
              {params.row?.code || '-'}
            </p>
          </div>
        );
      },
      maxWidth: 150,
      width: 130,
      sortable: false,
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Mui.Avatar
              className={css.avatar}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${params?.row?.customer_name}&chars=1`}
            />{' '}
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.customer_name}
            </p>
          </div>
        );
      },
      minWidth: 250,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      type: 'date',
      valueGetter: (params) => moment(params.value).toDate(),
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {moment(params.row?.start_date).format('DD-MM-YYYY')}
            </p>
          </div>
        );
      },
      maxWidth: 100,
    },
    {
      field: 'total_amount',
      headerName: 'Taxable Value',
      headerClassName: 'left-align--header',
      type: 'number',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'nowrap' }}>
              {customCurrency(
                params?.row?.currency?.iso_code,
                params?.row?.currency?.locale,
              ).format(params?.row?.total_amount)}
            </p>
          </div>
        );
      },
      maxWidth: 150,
      width: 100,
      align: 'right',
    },
    {
      field: 'day_of_creation',
      headerName: 'Scheduled On',
      type: 'date',
      flex: 1,
      valueGetter: (params) => moment(params.value).toDate(),
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>
              {upcomingInvoice(params.row?.day_of_creation)}
            </p>
          </div>
        );
      },
      maxWidth: 100,
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              handleRowSelection(params.row);
            }}
          >
            <p style={{ whiteSpace: 'break-spaces' }}>{params.row?.status}</p>
          </div>
        );
      },
      maxWidth: 100,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport />
        <GridToolbarQuickFilter sx={{ marginLeft: 'auto' }} />
      </GridToolbarContainer>
    );
  }

  return (
    <div className={css.draftInvoiceContainer}>
      {device === 'desktop' && (
        <Mui.Grid container>
          <Mui.Grid item xs={12}>
            <Mui.Stack className={css.RecurringContainer}>
              {device === 'desktop' && draftInvoice && (
                <>
                  <div className={css.buttDiv}>
                    <Mui.Button
                      variant="contained"
                      component="label"
                      className={css.orangeConatined}
                      disableElevation
                      disableTouchRipple
                      // disabled={forUpload.length === 0 || percentage !== 100}
                      onClick={() => {
                        if (!userRoles?.Contract?.create_recurring_invoices) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        navigate(`/invoice-upload`, {
                          state: {
                            thisFor: 'recurring',
                          },
                        });
                      }}
                    >
                      <img src={upload} alt="" style={{ marginRight: '5px' }} />
                      Upload Recurring Invoices
                    </Mui.Button>
                    {/* set search component here while set reduce buttDiv width to 70% */}
                  </div>
                  <Mui.Box
                    sx={{
                      height: '78vh',
                      width: '100%',
                      marginTop: '0 !important',
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
                    <DataGridPremium
                      rows={draftInvoice}
                      columns={recurringColumn?.map((col) => {
                        if (col.field !== 'customer_name') {
                          return col;
                        }
                        return {
                          ...col,
                          filterOperators:
                            getGridSingleSelectOperators().filter(
                              (operator) => operator.value !== 'isAnyOf',
                            ),
                        };
                      })}
                      density="compact"
                      getRowHeight={() => 'auto'}
                      rowHeight={60}
                      disableColumnReorder
                      disableColumnPinning
                      disableRowGrouping
                      disableAggregation
                      // disableColumnSelector
                      hideFooter
                      disableRowSelectionOnClick
                      initialState={{
                        filter: {
                          filterModel: {
                            items: [],
                            quickFilterValues: [state?.search_text],
                          },
                        },
                      }}
                      components={{
                        Toolbar: CustomToolbar,
                        NoRowsOverlay: () => (
                          <Mui.Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            No Data Found
                          </Mui.Stack>
                        ),
                        LoadingOverlay: InvoiceLoadingSkeleton,
                      }}
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                        },
                      }}
                      loading={recurringLoad === null}
                      sx={{
                        background: '#fff',
                        borderRadius: '16px',
                        '& .MuiDataGrid-columnHeaderTitle': {
                          whiteSpace: 'break-spaces',
                          textAlign: 'center',
                          lineHeight: '20px',
                          fontFamily: "'Lexend', sans-serif !important",
                          fontWeight: '400 !important',
                          fontSize: '13px',
                        },
                        '& .MuiDataGrid-row': {
                          cursor: 'pointer !important',
                          padding: '4px 0',
                        },
                        '& .MuiDataGrid-cell': {
                          fontFamily: "'Lexend', sans-serif !important",
                          fontWeight: '300 !important',
                          fontSize: '13px',
                        },
                      }}
                    />
                  </Mui.Box>
                </>
              )}
            </Mui.Stack>
          </Mui.Grid>
        </Mui.Grid>
      )}
      {device === 'mobile' && (
        <Mui.Grid container>
          <Mui.Stack
            direction="column"
            style={{ margin: '4% 4% 0% 4%', width: '100%' }}
          >
            <Mui.Box sx={{ width: '100%' }}>
              <Mui.Stack spacing={1}>
                <Mui.Stack
                  spacing={1}
                  style={{ paddingTop: '15px', paddingBottom: '5px' }}
                >
                  <Mui.Grid className={classes.headingRecurring}>
                    YOUR RECURRING INVOICES
                  </Mui.Grid>
                  <Mui.Divider
                    className={classes.divider}
                    variant="fullWidth"
                  />{' '}
                </Mui.Stack>
                {recurringLoad === null && draftInvoice?.length === 0 && (
                  <div
                    style={{
                      overflowX: 'hidden',
                      overflowY: 'auto',
                      height: 'calc(100vh - 250px)',
                    }}
                  >
                    <MobileInvoiceLoadingSkeleton />
                  </div>
                )}
                {recurringLoad !== null && draftInvoice?.length > 0 && (
                  <div
                    style={{
                      overflow: 'auto',
                      height: 'calc(100vh - 200px)',
                    }}
                    id="draftContent"
                  >
                    <InfiniteScroll
                      dataLength={draftInvoice?.length}
                      next={() => loadMore()}
                      scrollThreshold="20px"
                      hasMore={hasMoreItems}
                      loader={
                        <div style={{ display: 'flex' }}>
                          <CircularProgress
                            style={{ color: '#F08B32', margin: 'auto' }}
                          />
                        </div>
                      }
                      scrollableTarget="draftContent"
                    >
                      {draftInvoice?.map((d) => (
                        <Mui.Grid
                          item
                          xs={12}
                          lg={12}
                          md={12}
                          style={{ paddingTop: '10px' }}
                          onClick={() => {
                            handleRowSelection(d);
                          }}
                        >
                          <Item
                            style={{
                              backgroundColor: 'white',
                              textAlignLast: 'center',
                              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                              borderRadius: '18px',
                            }}
                          >
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Grid
                                alignSelf="center"
                                style={{
                                  paddingRight: '25px',
                                  paddingLeft: '3%',
                                }}
                              >
                                <Mui.Avatar
                                  style={{
                                    textTransform: 'uppercase',
                                    fontSize: '13.588px',
                                    color: 'white',
                                    backgroundColor: '#F08B32',
                                  }}
                                >
                                  {d?.customer_name?.slice(0, 1)}
                                </Mui.Avatar>
                              </Mui.Grid>
                              <Mui.Grid
                                style={{
                                  textAlignLast: 'left',
                                  paddingRight: '15px',
                                  textTransform: 'capitalize',
                                }}
                              >
                                <Mui.Grid className={classes.name}>
                                  {d?.customer_name?.toLowerCase()}
                                </Mui.Grid>
                                <Mui.Grid className={classes.contentAndDate}>
                                  Preparing on the {d?.day_of_creation}th of
                                  every month until{' '}
                                  {d?.end_date
                                    ? moment(d.end_date).format('DD-MM-YYYY')
                                    : '-'}
                                </Mui.Grid>
                              </Mui.Grid>
                              <Mui.Grid className={classes.amount}>
                                {customCurrency(
                                  d?.currency?.iso_code,
                                  d?.currency?.locale,
                                ).format(d?.total_amount)}
                              </Mui.Grid>
                            </Mui.Stack>
                          </Item>
                        </Mui.Grid>
                      ))}
                    </InfiniteScroll>
                  </div>
                )}
                {recurringLoad !== null &&
                  invoiceRecurringData?.data?.length === 0 && (
                    <div className={css.draftInfo}>
                      <Mui.Typography align="center">
                        No Invoices Found
                      </Mui.Typography>
                    </div>
                  )}
              </Mui.Stack>
            </Mui.Box>
          </Mui.Stack>
        </Mui.Grid>
      )}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
};

export default RecurringInvoiceContainer;
