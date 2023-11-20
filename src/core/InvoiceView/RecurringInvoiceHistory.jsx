import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetInvoiceDashboardState,
  DeleteRecurringInvoiceState,
  GetRecurringInvoiceByIdState,
  GetRecurringInvoiceHistoryByIdState,
  ClearStateRecurringInvoiceById,
  PostRecurringInvoiceFileUploadState,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import * as Mui from '@mui/material';
import { styled } from '@mui/material/styles';
import { Document, Page } from 'react-pdf'
import AppContext from '@root/AppContext.jsx';
import { makeStyles } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import circleOk from '@assets/circleOk.svg';
import editPencil from '@assets/editPencil.svg';
import download from '@assets/WebAssets/download.svg';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { METHOD, BASE_URL } from '@services/RestApi.jsx';
import * as Router from 'react-router-dom';
import moment from 'moment';
import { InvoicePdfLoad } from '../../components/SkeletonLoad/SkeletonLoader';
import UploadDialog from '../../components/UploadDialogComp/UploadDialog';
import ReceivablesPopOver from '../Receivables/Components/ReceivablesPopover';
import * as css from './CreateInvoiceContainer.scss';

const useStyles = makeStyles({
  tableContainer: {
    height: 'auto',
    // border: '1px solid #999ea580',
    borderRadius: '0px',
  },
  table: {},
  thead: {
    textTransform: 'uppercase',
    background: '#F5F5F5',
  },
  tbody: {
    background: '#fff',
  },
  cell: {
    fontSize: '13px !important',
    fontWeight: '500 !important',
    fontFamily: 'Lexend !important',
    textTransform: 'capitalize !important',
    color: '#283049 !important',
  },
  tcell: {
    fontSize: '14px !important',
    fontWeight: '300 !important',
    fontFamily: 'Lexend !important',
    color: '#283049 !important',
  },
  amtCell: {
    fontSize: '14px !important',
    fontWeight: '500 !important',
    fontFamily: 'Lexend !important',
    color: '#283049 !important',
  },
  statusCell: {
    fontSize: '12px !important',
    fontWeight: '400 !important',
    fontFamily: 'Lexend !important',
    color: '#20C9AC !important',
    textAlign: 'center',
    background: ' #20c9ac1a',
    borderRadius: '4px',
    padding: '4px 8px',
  },
});

const StyledTableCell = Mui.styled(Mui.TableCell)(() => ({
  [`&.${Mui.tableCellClasses.head}`]: {
    backgroundColor: '#F4F4F4 !important',
    // color:
    padding: '5px 10px !important',
    fontFamily: 'Lexend !important',
    fontWeight: 500,
    fontSize: '14px',
  },
  [`&.${Mui.tableCellClasses.body}`]: {
    fontSize: 14,
    height: '5px',
  },
}));
const StyledTableRow = Mui.styled(Mui.TableRow)(() => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: "white"
    border: '0px solid white',
    padding: '3px 5px',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: '0px solid white',
    padding: '3px 5px',
  },
}));

const RecurringInvoiceHistory = () => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(237, 237, 237, 0.15)',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxSizing: 'border-box',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: 'None',
  }));

  const {
    organization,
    user,
    setActiveInvoiceId,
    // pageParams,
  } = React.useContext(AppContext);
  const dispatch = useDispatch();
  const {
    recurringInvoiceDataById,
    recurringInvoiceHistoryDataById,
    recurringUpdateState,
    recurringLoad,
  } = useSelector((value) => value.Invoice);

  const [draftInvoice, setDraftInvoice] = React.useState([]);
  const [params, setParams] = React.useState();
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const [drawer, setDrawer] = React.useState({
    deletePopup: false,
  });
  const [tableValue, setTableValue] = React.useState([]);
  const [recurringPdf, setRecurringPdf] = React.useState(false);
  const [html, sethtml] = React.useState();
  const [havePermission, setHavePermission] = React.useState({ open: false });
  const [uploadDialog, setUploadDialog] = React.useState(false);
  const [viewBill, setViewBill] = React.useState(false);
  const [file, setFile] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(1);
  const queryParam = new URLSearchParams(window.location.search).get('id');

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  React.useEffect(() => {
    if (Object.keys(recurringInvoiceDataById || {})?.length > 0) {
      setDraftInvoice(recurringInvoiceDataById);
      setParams({
        type: 'recurring',
        id: state?.id || queryParam,
      });
    }
  }, [JSON.stringify(recurringInvoiceDataById)]);

  React.useEffect(() => {
    if (Object.keys(recurringInvoiceHistoryDataById || {})?.length > 0) {
      setTableValue(recurringInvoiceHistoryDataById?.data);
    }
  }, [JSON.stringify(recurringInvoiceHistoryDataById)]);

  React.useEffect(() => {
    if (Object.keys(recurringUpdateState || {})?.length > 0) {
      navigate('/invoice-recurring');
    }
  }, [JSON.stringify(recurringUpdateState)]);

  const recurringPdfDownload = (id) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', user.activeToken);
    myHeaders.append(
      'Cookie',
      'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f',
    );

    const requestOptions = {
      method: METHOD.GET,
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/customer_agreements/${id}.html`,
      // `https://staging.goeffortless.co/api/v1/organizations/6b1dbb37-a966-405f-90dc-3e49e2c30be4/invoices/d914dfb6-5ba4-4ee2-acaf-f69a68bb3910.html`,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        sethtml(result);
      })
      .catch((error) => console.log('error', error));
  };

  React.useEffect(() => {
    if ((state && state?.id.length > 0) || queryParam) {
      dispatch(
        GetRecurringInvoiceByIdState({
          activeInvoiceSubject: 'customer_agreements',
          invoiceId: state?.id || queryParam,
        }),
      );
      dispatch(
        GetRecurringInvoiceHistoryByIdState({
          invoiceId: state?.id || queryParam,
        }),
      );
    } else {
      navigate('/invoice-recurring');
    }
    return () => {
      dispatch(
        GetInvoiceDashboardState({
          durationDate: moment().format('YYYY-MM-DD'),
        }),
      );
      dispatch(ClearStateRecurringInvoiceById());
    };
  }, []);

  const EditRecurring = () => {
    if (!state?.recurringAccess?.edit_recurring_invoices) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }

    user.customerId = draftInvoice?.customer_id;
    setActiveInvoiceId({
      activeInvoiceId: state?.id || queryParam,
      activeInvoiceSubject: 'customer_agreements',
    });
    navigate('/invoice-recurring-edit', {
      state: {
        recuuringParam: params,
        from: 'edit',
        name: draftInvoice?.customer_name,
      },
    });
  };

  const RecurringFileUpload = async (id_s) => {
    dispatch(
      PostRecurringInvoiceFileUploadState({
        document: id_s,
        activeInvoiceSubject: 'customer_agreements',
        invoiceId: state?.id || queryParam,
        documentType: draftInvoice?.document_type,
      }),
    );
  };

  const CancelRecurring = () => {
    if (!state?.recurringAccess?.cancel_recurring_invoices) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setDrawer((prev) => ({ ...prev, deletePopup: true }));
  };

  const setTableTitle = () => {
    const taxTypeSGST =
      draftInvoice?.agreement_line_items?.length > 0 &&
      (draftInvoice?.agreement_line_items?.filter((val) =>
        val?.invoice_tax_items[0]?.tax_id?.includes('sgst'),
      ) ||
        draftInvoice?.agreement_line_items?.filter((val) =>
          val?.invoice_tax_items[0]?.tax_id?.includes('cgst'),
        ));
    const taxTypeIGST =
      draftInvoice?.agreement_line_items?.length > 0 &&
      draftInvoice?.agreement_line_items?.filter((val) =>
        val?.invoice_tax_items[0]?.tax_id?.includes('igst'),
      );
    if (taxTypeSGST.length > 0) {
      return (
        <>
          <StyledTableCell align="right">
            <>
              SGST @
              {taxTypeSGST[0]?.invoice_tax_items[0]?.rate ||
                taxTypeSGST[0]?.invoice_tax_items[1]?.rate}
              %
            </>
          </StyledTableCell>
          <StyledTableCell align="right">
            <>
              CGST @
              {taxTypeSGST[0]?.invoice_tax_items[0]?.rate ||
                taxTypeSGST[0]?.invoice_tax_items[1]?.rate}
              %
            </>
          </StyledTableCell>
        </>
      );
    }
    return (
      <>
        <StyledTableCell align="right">
          <>
            IGST @
            {taxTypeIGST[0]?.invoice_tax_items[0]?.rate ||
              taxTypeIGST[0]?.invoice_tax_items[1]?.rate}
            %
          </>
        </StyledTableCell>
      </>
    );
  };

  const setTableCellValue = (value, currency) => {
    const taxType =
      draftInvoice?.agreement_line_items?.length > 0 &&
      (draftInvoice?.agreement_line_items?.filter((val) =>
        val?.invoice_tax_items[0]?.tax_id?.includes('sgst'),
      ) ||
        draftInvoice?.agreement_line_items?.filter((val) =>
          val?.invoice_tax_items[0]?.tax_id?.includes('cgst'),
        ));
    if (taxType.length > 0) {
      return (
        <>
          <Mui.TableCell align="right">
            {(value?.invoice_tax_items.length > 0 &&
              value?.invoice_tax_items[0]?.tax_id.includes('sgst') &&
              customCurrency(currency?.iso_code, currency?.locale).format(
                value?.invoice_tax_items[0]?.amount,
              )) ||
              (value?.invoice_tax_items[1]?.tax_id.includes('sgst') &&
                customCurrency(currency?.iso_code, currency?.locale).format(
                  value?.invoice_tax_items[1]?.amount,
                )) ||
              0}
          </Mui.TableCell>
          <Mui.TableCell align="right">
            {(value?.invoice_tax_items.length > 0 &&
              value?.invoice_tax_items[0]?.tax_id.includes('cgst') &&
              customCurrency(currency?.iso_code, currency?.locale).format(
                value?.invoice_tax_items[0]?.amount,
              )) ||
              (value?.invoice_tax_items[1]?.tax_id.includes('cgst') &&
                customCurrency(currency?.iso_code, currency?.locale).format(
                  value?.invoice_tax_items[1]?.amount,
                )) ||
              0}
          </Mui.TableCell>
        </>
      );
    }
    return (
      <>
        <Mui.TableCell align="right">
          {(value?.invoice_tax_items.length > 0 &&
            value?.invoice_tax_items[0]?.tax_id.includes('igst') &&
            customCurrency(currency?.iso_code, currency?.locale).format(
              value?.invoice_tax_items[0]?.amount,
            )) ||
            (value?.invoice_tax_items[1]?.tax_id.includes('igst') &&
              customCurrency(currency?.iso_code, currency?.locale).format(
                value?.invoice_tax_items[1]?.amount,
              )) ||
            0}
        </Mui.TableCell>
      </>
    );
  };
  if (recurringLoad === null) {
    return null;
  }
  return (
    <>
      {/* {draftInvoice.length === 0 ? (
        <span style={{ margin: 'auto' }}>No Recurring Invoices</span>
      ) : (
        ''
      )} */}
      {device === 'desktop' ? (
        <div className={css.newReccuring}>
          <div className={css.topDiv}>
            <div className={css.firstColumn}>
              <p className={css.activeState}>{draftInvoice?.status || '-'}</p>
              <p className={css.agreementText}>
                Agreement of {draftInvoice?.customer_name || '-'}
              </p>
            </div>
            <div>
              <div
                className={css.secondColumnInner}
                onClick={() => {
                  EditRecurring();
                }}
              >
                <img style={{ width: '15px' }} src={editPencil} alt="edit" />
                <p className={css.editText}>Edit Recurring Invoice</p>
              </div>
            </div>
          </div>

          <div className={css.middleDiv}>
            <div className={css.topDiv}>
              <p className={css.invoiceItem}>Invoice Item</p>
              <div
                onClick={() => {
                  setRecurringPdf(true);
                  recurringPdfDownload(state?.id || queryParam);
                }}
              >
                <p className={css.viewSample}>View Sample Invoice</p>
              </div>
            </div>
            <div>
              <Mui.TableContainer>
                <Mui.Table aria-label="simple Mui.table">
                  <Mui.TableHead style={{ height: '40px' }}>
                    <StyledTableRow>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell align="right">
                        Taxable value
                      </StyledTableCell>
                      {setTableTitle()}
                      <StyledTableCell align="right">Total</StyledTableCell>
                    </StyledTableRow>
                  </Mui.TableHead>
                  <Mui.TableBody>
                    {draftInvoice?.agreement_line_items?.length > 0 ? (
                      draftInvoice?.agreement_line_items?.map((val) => (
                        <Mui.TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '& .MuiTableCell-root': {
                              fontFamily: 'Lexend !important',
                              fontWeight: 300,
                              fontSize: '14px',
                              color: '#283049',
                            },
                          }}
                        >
                          <Mui.TableCell
                            component="th"
                            scope="row"
                            sx={{ width: '40%' }}
                          >
                            {val?.description || '-'}
                          </Mui.TableCell>
                          <Mui.TableCell align="right">
                            {customCurrency(
                              draftInvoice?.currency?.iso_code,
                              draftInvoice?.currency?.locale,
                            ).format(val?.total)}
                          </Mui.TableCell>
                          {setTableCellValue(val, draftInvoice?.currency)}
                          <Mui.TableCell align="right">
                            {customCurrency(
                              draftInvoice?.currency?.iso_code,
                              draftInvoice?.currency?.locale,
                            ).format(val?.total)}
                          </Mui.TableCell>
                        </Mui.TableRow>
                      ))
                    ) : (
                      <Mui.Typography align="center">
                        No Data Found
                      </Mui.Typography>
                    )}
                  </Mui.TableBody>
                </Mui.Table>
              </Mui.TableContainer>
            </div>
          </div>

          <div className={css.lastDiv}>
            <div className={css.aggDetails}>
              <div className={css.topHead}>
                <p className={css.title}>Agreement Details</p>
              </div>

              <div className={css.middle}>
                {[
                  {
                    name: 'Start Date',
                    value:
                      (draftInvoice?.start_date &&
                        moment(draftInvoice?.start_date).format(
                          'DD-MM-YYYY',
                        )) ||
                      '-',
                  },
                  {
                    name: 'End Date',
                    value:
                      (draftInvoice?.end_date &&
                        moment(draftInvoice?.end_date).format('DD-MM-YYYY')) ||
                      '-',
                  },
                  {
                    name: 'Schedules ON',
                    value:
                      (draftInvoice?.start_date &&
                        moment(draftInvoice?.start_date).format(
                          'DD-MM-YYYY',
                        )) ||
                      '-',
                  },
                  {
                    name: 'Status',
                    value: draftInvoice?.status || '-',
                  },
                  {
                    name: 'Invoice Value',
                    value:
                      draftInvoice?.currency &&
                      customCurrency(
                        draftInvoice?.currency?.iso_code,
                        draftInvoice?.currency?.locale,
                      ).format(draftInvoice?.total_amount),
                  },
                ]?.map((innerVal) => (
                  <div className={css.aggInnerDiv}>
                    <p className={css.keyPTag}>{innerVal.name}</p>
                    <p
                      className={
                        innerVal.name === 'Status'
                          ? `${css.valuePTag} ${css.activeState}`
                          : css.valuePTag
                      }
                    >
                      {innerVal.value}
                    </p>
                  </div>
                ))}
                <div className={css.aggInnerDiv}>
                  <div
                    onClick={() => {
                      // if (!draftInvoice?.document_url) {
                      setUploadDialog(true);
                      // }
                    }}
                  >
                    <p
                      className={css.keyPTagUpload}
                      style={{
                        cursor: draftInvoice?.document_url
                          ? 'context-menu'
                          : 'pointer',
                      }}
                    >
                      {draftInvoice?.document_name
                        ? 'Reupload Agreement'
                        : 'Upload Agreement'}
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      if (!draftInvoice?.document_url) {
                        setUploadDialog(true);
                      } else {
                        setViewBill(true);
                        setFile(draftInvoice?.document_url);
                      }
                    }}
                  >
                    <p
                      className={css.valuePTagUpload}
                      style={{
                        cursor: !draftInvoice?.document_url
                          ? 'context-menu'
                          : 'pointer',
                      }}
                    >
                      {draftInvoice?.document_name || 'Please Upload file.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={css.footer} onClick={() => CancelRecurring()}>
                <p className={css.cancel}>Cancel Agreement</p>
              </div>
            </div>

            <div className={css.dispatch}>
              <div className={css.topHead}>
                <p className={css.title}>DISPATCH HISTORY</p>
              </div>

              <div>
                <Mui.TableContainer className={`${classes.tableContainer}`}>
                  <Mui.Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <Mui.TableHead className={classes.thead}>
                      {[
                        'INVOICE ID',
                        'CREATED DATE',
                        'BILL AMOUNT',
                        'STATUS',
                      ].map((i) => (
                        <Mui.TableCell className={classes.cell}>
                          {i}
                        </Mui.TableCell>
                      ))}
                    </Mui.TableHead>
                    <Mui.TableBody>
                      {tableValue?.length > 0 ? (
                        tableValue?.map((val) => (
                          <Mui.TableRow>
                            <Mui.TableCell className={classes.tcell}>
                              {val?.invoice_number}
                            </Mui.TableCell>
                            <Mui.TableCell className={classes.tcell}>
                              {moment(val?.created_at).format('DD-MM-YYYY')}
                            </Mui.TableCell>
                            <Mui.TableCell className={classes.amtCell}>
                              {customCurrency(
                                val?.currency?.iso_code,
                                val?.currency?.locale,
                              ).format(val?.invoice_value)}
                            </Mui.TableCell>
                            <Mui.TableCell>
                              <p className={classes.statusCell}>
                                {val?.status}
                              </p>
                            </Mui.TableCell>
                          </Mui.TableRow>
                        ))
                      ) : (
                        <Mui.TableCell colSpan={4}>
                          <Mui.Typography align="center">
                            Invoice as not yet generated!
                          </Mui.Typography>
                        </Mui.TableCell>
                      )}
                    </Mui.TableBody>
                  </Mui.Table>
                </Mui.TableContainer>
              </div>
            </div>
          </div>

          <UploadDialog
            open={uploadDialog}
            onClose={() => setUploadDialog(false)}
            uploadedData={(val) => RecurringFileUpload(val?.id)}
            title="Agreement"
          />

          <ReceivablesPopOver
            open={drawer.deletePopup}
            handleClose={() =>
              setDrawer((prev) => ({ ...prev, deletePopup: false }))
            }
            position="center"
          >
            {/* deleteInvoice(activeItem.id) */}
            <div className={css.effortlessOptions}>
              <h3>Cancel this Invoice</h3>
              <p>Are you sure you want to Cancel this Invoice?</p>

              {/* </ul> */}
              <div
                className={css.addCustomerFooter}
                style={{ marginBottom: '10px' }}
              >
                <Mui.Button
                  disableElevation
                  disableFocusRipple
                  disableTouchRipple
                  variant="contained"
                  className={css.secondary}
                  style={{
                    padding: '15px 35px',
                    textTransform: 'initial',
                    backgroundColor: '#fff',
                  }}
                  onClick={() =>
                    setDrawer((prev) => ({ ...prev, deletePopup: false }))
                  }
                >
                  Cancel
                </Mui.Button>
                <Mui.Button
                  disableElevation
                  disableFocusRipple
                  disableTouchRipple
                  variant="contained"
                  className={`${css.primary}`}
                  style={{
                    padding: '15px 35px',
                    textTransform: 'initial',
                    width: 'auto',
                    backgroundColor: '#f08b32',
                  }}
                  onClick={() => {
                    dispatch(
                      DeleteRecurringInvoiceState({
                        activeInvoiceSubject: 'customer_agreements',
                        invoiceId: state?.id || queryParam,
                      }),
                    );
                  }}
                >
                  &nbsp; OK &nbsp;
                </Mui.Button>
              </div>
            </div>
          </ReceivablesPopOver>
          <Mui.Dialog
            PaperProps={{
              elevation: 3,
              style: {
                width: '86%',
                height: file.includes('.pdf') ? '100%' : '',
                // position: 'absolute',

                overflow: 'visible',
                borderRadius: 16,
                cursor: 'pointer',
              },
            }}
            open={viewBill}
            onClose={() => setViewBill(false)}
          >
            <Mui.Stack direction="row" justifyContent="flex-end" p={1}>
              <a href={file} target="_blank" rel="noreferrer" download>
                <img src={download} alt="download" />
              </a>
            </Mui.Stack>
            <Mui.DialogContent style={{ position: 'relative' }}>
              <Mui.Grid className={css.iframeViewDocument}>
                {file.includes('.jpeg') ||
                file.includes('.png') ||
                file.includes('.pdf') === false ? (
                  <img src={file} alt="upload" style={{ width: '100%' }} />
                ) : (
                  Array.from({ length: pageNumber }, (_, i) => i + 1).map(
                    (i) => (
                      <Document
                        file={file}
                        className={css.pdfStyle}
                        loading="  "
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page pageNumber={i} className={css.page} />
                      </Document>
                    ),
                  )
                )}
              </Mui.Grid>
            </Mui.DialogContent>
          </Mui.Dialog>
        </div>
      ) : (
        <Mui.Grid
          container
          style={{
            height: 'inherit',
            borderRadius: '25px',
            backgroundColor: '#F2F2F0',
          }}
        >
          <Mui.Grid item xs={12} lg={12} md={12}>
            <Mui.Box sx={{ width: '100%' }}>
              <Mui.Stack spacing={1}>
                <Mui.Stack
                  direction="row"
                  justifyContent="space-between"
                  style={{ margin: '4%' }}
                >
                  <Mui.Stack direction="column" style={{ marginTop: '7px' }}>
                    <Mui.Grid
                      style={{
                        fontWeight: '500',
                        fontSize: '13px',
                        lineHeight: '15px',
                        /* identical to box height, or 115% */

                        display: 'flex',
                        alignItems: 'center',

                        color: '#283049',
                      }}
                    >
                      {draftInvoice.customer_name || '-'} / YOUR RECURRING
                      INVOICES
                    </Mui.Grid>
                    <Mui.Divider
                      style={{
                        marginTop: '5px',
                        borderRadius: '8px',
                        width: '16px',
                        height: '3px',
                        backgroundColor: '#F08B32',
                      }}
                      variant="fullWidth"
                    />{' '}
                  </Mui.Stack>
                  <Mui.Grid>
                    <Mui.Grid
                      style={{
                        border: '1px solid #F08B32',
                        borderRadius: '50%',
                        height: '26px',
                        width: '24px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        EditRecurring();
                      }}
                    >
                      <img
                        style={{ margin: '12%', width: '15px' }}
                        src={editPencil}
                        alt="edit"
                      />
                    </Mui.Grid>
                  </Mui.Grid>
                </Mui.Stack>

                <Mui.Stack
                  direction="row"
                  width="100%"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Item
                    style={{
                      backgroundColor: '#E5E5E5',
                      width: '100%',
                      paddingLeft: '4%',
                      paddingRight: '4%',
                      borderRadius: '0px',
                      // textAlignLast: 'center',
                    }}
                  >
                    <Mui.Stack direction="row" justifyContent="space-between">
                      <Mui.Grid
                        style={{
                          fontWeight: '700',
                          fontSize: '12px',
                          lineHeight: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#000000',
                        }}
                      >
                        {draftInvoice.narration || '-'}
                      </Mui.Grid>
                      <Mui.Grid
                        style={{
                          fontWeight: '700',
                          fontSize: '13px',
                          lineHeight: '16px',
                          color: '#000000',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {draftInvoice?.currency &&
                          customCurrency(
                            draftInvoice?.currency?.iso_code,
                            draftInvoice?.currency?.locale,
                          ).format(Number(draftInvoice?.total_amount))}
                      </Mui.Grid>
                    </Mui.Stack>
                    <Mui.Stack
                      direction="row"
                      justifyContent="space-between"
                      style={{ marginTop: '3%' }}
                    >
                      <Mui.Grid
                        style={{
                          fontWeight: '400',
                          fontSize: '12px',
                          lineHeight: '15px',
                          display: 'flex',
                          alignItems: 'center',

                          color: '#000000',
                        }}
                      >
                        {moment(draftInvoice.start_date).format('DD-MM-YYYY')}
                      </Mui.Grid>
                      <Mui.Grid>
                        <img src={circleOk} alt="okay" />
                      </Mui.Grid>
                    </Mui.Stack>
                  </Item>
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Box>
          </Mui.Grid>
        </Mui.Grid>
      )}
      <Mui.Dialog
        open={recurringPdf}
        id="basic-menu-sort"
        onClose={() => setRecurringPdf(false)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            minWidth: '75%',
            padding: '5px',
            borderRadius: 16,
          },
        }}
      >
        <Mui.DialogContent>
          {/* <Mui.Stack
            style={{ overflow: 'auto', margin: '1rem' }}
            dangerouslySetInnerHTML={{ __html: html }}
          /> */}
          <Mui.Stack
            style={{
              backgroundColor: 'white',
              height: '85vh',
              width: '100%',
            }}
          >
            {!html && InvoicePdfLoad()}
            {html && (
              <iframe
                srcDoc={html?.replace(
                  'div.nobreak{page-break-inside:avoid}',
                  'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}',
                )}
                title="html"
                frameBorder="0"
                className={css.scrolling}
              />
            )}
          </Mui.Stack>
        </Mui.DialogContent>
      </Mui.Dialog>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};
export default RecurringInvoiceHistory;
