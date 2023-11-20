import * as React from 'react';
import * as Mui from '@mui/material';
import * as MuiIcon from '@mui/icons-material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { Document, Page } from 'react-pdf'
import * as Router from 'react-router-dom';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import moment from 'moment';
import deleteBin from '@assets/binRed.svg';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import editYourBills from '@assets/editYourBills.png';
import viewYourBills from '@assets/viewYourBills.png';
// import BorderColorIcon from '@mui/icons-material/BorderColor';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import * as css from './Ageing.scss';
// import ReceivablesPopOver from '../Components/ReceivablesPopover';

const Agreement = ({ id }) => {
  const {
    organization,
    user,
    // changeSubView,
    enableLoading,
    // setActiveInvoiceId,
    openSnackBar,
    loading,
  } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  // const agreementTitle = [
  //   'INVOICE ID ',
  //   'INVOICE DATE',
  //   'DELIVERY DATE',
  //   'BILL AMOUNT',
  //   'STATUS',
  // ];
  const [drawer, setDrawer] = React.useState({
    deletePopup: false,
    agreementId: '',
    yourBills: false,
  });
  const [html, sethtml] = React.useState({ url: '', open: false });
  const [custAg, setCustAg] = React.useState([]);
  const [BottomSheet, setBottomSheet] = React.useState(false);
  const [tableDetails, setTableDetails] = React.useState([]);
  const [dialogDelete, setDialogDelete] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);

  const paymentStatusListWithBill = [
    { id: 'company_cash', label: 'Paid with Company Cash' },
    { id: 'paid_as_advance', label: 'Paid as Advance' },
    { id: 'to_pay', label: 'To Pay' },
    { id: 'company_card', label: 'Paid with Company Card' },
    { id: 'personal', label: 'Paid Personally' },
  ];

  const device = localStorage.getItem('device_detect');

  const getVendors = () => {
    enableLoading(true);
    RestApi(
      // `organizations/${organization.orgId}/accounts/${pageParams}/profiles`,
      `organizations/${organization.orgId}/vendor_bills?vendor_id=${id}`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          // if (res?.data?.length > 0) {
          setCustAg(res?.data);
          // }
        }
      })
      .catch((err) => {
        enableLoading(false);
        console.log(err);
      });
  };
  React.useEffect(() => {
    getVendors();
  }, [id]);

  // const deleteRecurringInvoice = () => {
  //   enableLoading(true);
  //   RestApi(
  //     `organizations/${organization.orgId}/customer_agreements/${drawer.agreementId}`,
  //     {
  //       method: METHOD.DELETE,
  //       headers: {
  //         Authorization: `Bearer ${user.activeToken}`,
  //       },
  //     },
  //   ).then((res) => {
  //     if (res && !res.error) {
  //       openSnackBar({
  //         message: 'Cancelled Successfully',
  //         type: MESSAGE_TYPE.INFO,
  //       });
  //       enableLoading(false);
  //       navigate('/invoice-recurring');
  //     } else if (res && res.error) {
  //       enableLoading(false);
  //       openSnackBar({
  //         message: Object.values(res.errors).join(', '),
  //         type: MESSAGE_TYPE.ERROR,
  //       });
  //     }
  //   });
  // };
  console.log(custAg);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  const titles = [
    'Name',
    'Bill Number',
    'Status',
    'Date',
    'Payment Amount',
    '  ',
  ];
  const deleteBill = (ids) => {
    setDialogDelete(false);
    enableLoading(true);

    RestApi(`organizations/${organization.orgId}/vendor_bills/${ids}`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res?.error || res?.message) {
          openSnackBar({
            message: res?.message || 'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else {
          getVendors();
          setBottomSheet(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const editbill = (ide) => {
    enableLoading(true);

    RestApi(
      `organizations/${organization.orgId}/vendor_bills/${ide}/versions`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res?.message) {
          openSnackBar({
            message: res?.message || 'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else {
          navigate('/bill-upload', {
            state: { selected: res },
          });
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  return (
    <div>
      {device === 'mobile' && <p className={css.titleHead}>Your Bills</p>}
      <Mui.Grid container>
        {(device === 'desktop' && (
          <div style={{ width: '70%', margin: '2% 5%' }}>
            {custAg?.length > 0 && (
              <Mui.TableContainer
                sx={{
                  borderRadius: 5,
                  // minHeight: 600,
                  maxHeight: '59vh',
                  maxWidth: '100%',
                }}
              >
                <Mui.Table
                  stickyHeader
                  size="medium"
                  style={{ background: '#ffff' }}
                >
                  <Mui.TableHead
                    sx={{
                      bgcolor: '#0000',
                      fontSize: '13px',
                      borderColor: (theme) => theme.palette.grey[100],
                    }}
                  >
                    {titles?.map((title) => (
                      <Mui.TableCell>
                        <Mui.Typography
                          noWrap
                          variant="body2"
                          className={css.tableHead}
                        >
                          {title}
                        </Mui.Typography>
                      </Mui.TableCell>
                    ))}
                  </Mui.TableHead>

                  <Mui.TableBody>
                    {custAg
                      ?.filter((y) => y.status !== 'draft')
                      ?.map((item) => (
                        <Mui.TableRow
                          onClick={() => {
                            setBottomSheet(true);
                            setTableDetails([item]);
                          }}
                          sx={{
                            borderColor: (theme) => theme.palette.grey[100],
                            cursor: 'pointer',
                          }}
                        >
                          <Mui.TableCell className={css.tableCell}>
                            <Mui.Typography
                              noWrap
                              variant="body2"
                              className={css.tableFont}
                            >
                              {(item?.vendor &&
                                item?.vendor.name?.toLowerCase()) ||
                                '-'}
                            </Mui.Typography>
                            <Mui.Typography
                              noWrap
                              variant="body2"
                              className={css.tableFontSm}
                            >
                              {item?.payment_mode || '-'}
                            </Mui.Typography>
                          </Mui.TableCell>
                          <Mui.TableCell className={css.tableCell}>
                            <Mui.Typography
                              noWrap
                              variant="body2"
                              className={css.tableBillNumber}
                            >
                              {item?.document_number || '-'}
                            </Mui.Typography>
                          </Mui.TableCell>
                          <Mui.TableCell className={css.tableCell}>
                            <Mui.Typography
                              noWrap
                              variant="body2"
                              className={css.tableStatus}
                            >
                              {item?.status || '-'}
                            </Mui.Typography>
                          </Mui.TableCell>

                          <Mui.TableCell className={css.tableCell}>
                            <Mui.Typography
                              noWrap
                              variant="body2"
                              className={css.tableDate}
                            >
                              {moment(item?.document_date).format('DD-MM-YYYY')}
                            </Mui.Typography>
                          </Mui.TableCell>
                          <Mui.TableCell
                            className={css.tableCell}
                            style={{
                              width: '20px',
                            }}
                            align="right"
                          >
                            <Mui.Typography
                              noWrap
                              variant="body2"
                              className={css.tableAmount}
                            >
                              ₹{' '}
                              {Number(item?.amount || 0).toLocaleString(
                                'en-IN',
                              )}
                            </Mui.Typography>
                          </Mui.TableCell>
                          <Mui.TableCell className={css.tableCell}>
                            <Mui.Typography noWrap variant="body2">
                              <MuiIcon.MoreVert />
                            </Mui.Typography>
                          </Mui.TableCell>
                        </Mui.TableRow>
                      ))}
                    {/* ))} */}
                  </Mui.TableBody>
                </Mui.Table>
              </Mui.TableContainer>
            )}
            {custAg?.length === 0 && (
              <Mui.Typography align="center">
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </Mui.Typography>
            )}
          </div>
        )) || (
          <>
            {custAg?.length > 0 &&
              custAg
                ?.filter((y) => y.status !== 'draft')
                ?.map((item) => {
                  return (
                    <Mui.Grid item md={12} className={css.newMaindiv}>
                      {/* <Mui.Grid></Mui.Grid> */}
                      <div
                        key={item.id}
                        className={css.main}
                        onClick={() => {
                          setDrawer((prev) => ({ ...prev, yourBills: true }));
                          setTableDetails([item]);
                        }}
                      >
                        <div className={css.infoItem}>
                          <div className={css.infoTitle}>
                            {item.vendor && item.vendor.name?.toLowerCase()}
                          </div>
                          {item.status === 'draft' && (
                            <div className={css.draftLabel}>Draft</div>
                          )}
                        </div>
                        <div className={css.infoItem}>
                          <p className={css.key}>Bill Number</p>
                          <p className={css.value}>
                            {item.document_number || '-'}
                          </p>
                        </div>
                        <div className={css.infoItem}>
                          <p className={css.key}>Payment Amount</p>
                          <p className={css.value}>
                            ₹{' '}
                            {Number(item?.amount || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setDialogDelete(true);
                        }}
                        className={css.keyDelete}
                      >
                        <img src={deleteBin} alt="delete" />{' '}
                      </div>
                    </Mui.Grid>
                  );
                })}
            {custAg?.length === 0 && (
              <Mui.Typography align="center" sx={{ margin: 'auto' }}>
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </Mui.Typography>
            )}
            <SelectBottomSheet
              open={dialogDelete}
              addNewSheet
              onClose={() => {
                setDialogDelete(false);
              }}
              triggerComponent={<span style={{ display: 'none' }} />}
            >
              <Mui.Grid className={css.deleteMainDiv}>
                <Mui.Grid>
                  <Mui.Typography className={css.deletetitle}>
                    Heads Up !
                  </Mui.Typography>

                  <Mui.Divider
                    className={css.deleteDivider}
                    variant="fullWidth"
                  />
                </Mui.Grid>
                <Mui.Grid className={css.deleteDescription}>
                  {' '}
                  Are you sure that you want to delete this Bill?
                </Mui.Grid>
                <Mui.Stack direction="row" className={css.buttonWidth}>
                  <Mui.Button
                    className={css.CancelButton}
                    onClick={() => {
                      setDialogDelete(false);
                    }}
                  >
                    Cancel
                  </Mui.Button>
                  <Mui.Button
                    className={css.submitButton}
                    onClick={() => {
                      deleteBill(tableDetails[0]?.id);
                    }}
                  >
                    Confirm
                  </Mui.Button>
                </Mui.Stack>
              </Mui.Grid>
            </SelectBottomSheet>
          </>
        )}
      </Mui.Grid>
      <SelectBottomSheet
        name="yourBills"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={BottomSheet}
        onTrigger={() => setBottomSheet(true)}
        onClose={() => setBottomSheet(false)}
        maxHeight="45vh"
      >
        <Mui.Stack className={css.padLeft}>
          {/* {tableDetails?.map((e) => ( */}
          <>
            <Mui.Grid className={css.yourBillsViewEditIcon}>
              <Mui.Grid
                style={{
                  paddingBottom: '32px',
                  fontSize: '16px',
                }}
                className={css.BottomSheetContent}
              >
                {tableDetails[0]?.document_number || '-'}
              </Mui.Grid>
              <div
                onClick={() => {
                  editbill(tableDetails[0]?.id);
                }}
              >
                <img
                  src={editYourBills}
                  className={css.editButtonss}
                  alt="delete"
                />
              </div>
            </Mui.Grid>
            <Mui.Stack className={css.padBottom}>
              <Mui.Grid className={css.bottomSheetTitle}>Vendor</Mui.Grid>
              <Mui.Grid className={css.BottomSheetContent}>
                {(tableDetails[0]?.vendor && tableDetails[0]?.vendor.name) ||
                  '-'}
              </Mui.Grid>
            </Mui.Stack>
            <Mui.Stack className={css.padBottom}>
              <Mui.Grid className={css.bottomSheetTitle}>Amount</Mui.Grid>
              <Mui.Grid className={css.BottomSheetContent}>
                ₹ {Number(tableDetails[0]?.amount || 0).toLocaleString('en-IN')}
              </Mui.Grid>
            </Mui.Stack>
            <Mui.Stack className={css.padBottom}>
              <Mui.Grid className={css.bottomSheetTitle}>
                Expense Category
              </Mui.Grid>
              <Mui.Grid className={css.BottomSheetContent}>
                {tableDetails[0]?.expense_category?.name || '-'}
              </Mui.Grid>
            </Mui.Stack>
            <Mui.Stack className={css.padBottom}>
              <Mui.Grid className={css.bottomSheetTitle}>Payment Mode</Mui.Grid>
              <Mui.Grid className={css.BottomSheetContent}>
                {tableDetails[0]?.payment_mode || '-'}
              </Mui.Grid>
            </Mui.Stack>
            <Mui.Stack className={css.padBottom}>
              <Mui.Grid className={css.bottomSheetTitle}>Description</Mui.Grid>
              <Mui.Grid className={css.BottomSheetContent}>
                {tableDetails[0]?.description || '-'}
              </Mui.Grid>
            </Mui.Stack>
            <Mui.Stack direction="row" className={css.buttonWidthWeb}>
              <Mui.Button
                className={css.deleteWeb}
                onClick={() => setDialogDelete(true)}
              >
                Delete
              </Mui.Button>
              {tableDetails[0]?.file_url && (
                <Mui.Button
                  className={css.viewBillDesktop}
                  onClick={() => {
                    sethtml({ url: tableDetails[0]?.file_url, open: true });
                  }}
                >
                  View Bill Uploaded
                </Mui.Button>
              )}
              <Mui.Dialog
                PaperProps={{
                  elevation: 3,
                  style: {
                    width: '86%',
                    // position: 'absolute',

                    overflow: 'visible',
                    borderRadius: 16,
                    cursor: 'pointer',
                  },
                }}
                open={dialogDelete}
                onClose={() => setDialogDelete(false)}
              >
                <Mui.DialogContent>
                  <Mui.Grid
                  // className={css.deleteMainDiv}
                  >
                    <Mui.Grid>
                      <Mui.Typography className={css.deletetitle}>
                        Heads Up !
                      </Mui.Typography>

                      <Mui.Divider
                        className={css.deleteDivider}
                        variant="fullWidth"
                      />
                    </Mui.Grid>
                    <Mui.Grid className={css.deleteDescriptionDesktop}>
                      {' '}
                      Are your sure that you want to delete this bill?
                    </Mui.Grid>
                    <Mui.Grid className={css.deleteDescriptionDesktop2}>
                      {' '}
                      Please note that all data associated with this bill will
                      be permanently deleted.
                    </Mui.Grid>
                    <Mui.Stack direction="row" className={css.buttonWidth}>
                      <Mui.Button
                        className={css.CancelButton}
                        onClick={() => {
                          setDialogDelete(false);
                        }}
                      >
                        Cancel
                      </Mui.Button>
                      <Mui.Button
                        className={css.submitButton}
                        onClick={() => {
                          deleteBill(tableDetails[0]?.id);
                        }}
                      >
                        Confirm
                      </Mui.Button>
                    </Mui.Stack>
                  </Mui.Grid>
                </Mui.DialogContent>
              </Mui.Dialog>
            </Mui.Stack>
          </>
          {/* ))} */}
        </Mui.Stack>
      </SelectBottomSheet>
      {/* <ReceivablesPopOver
        open={drawer.deletePopup}
        handleClose={() =>
          setDrawer((prev) => ({ ...prev, deletePopup: false }))
        }
        position="center"
      > */}
      {/* deleteInvoice(activeItem.id) */}
      {/* <div className={css.effortlessOptionsPop}>
          <h3>Cancel this Invoice</h3>
          <p>Are you sure you want to Cancel this Invoice?</p> */}

      {/* </ul> */}
      {/* <div
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
                // padding: '15px 35px',
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
                // padding: '15px 35px',
                textTransform: 'initial',
                width: 'auto',
                backgroundColor: '#f08b32',
              }}
              onClick={() => {
                deleteRecurringInvoice();
              }}
            >
              &nbsp; OK &nbsp;
            </Mui.Button>
          </div>
        </div>
      </ReceivablesPopOver> */}
      <Mui.Dialog
        PaperProps={{
          elevation: 3,
          style: {
            width: '86%',
            height: html?.url?.includes('.pdf') ? '100%' : '',
            // position: 'absolute',

            overflow: 'visible',
            borderRadius: 16,
            cursor: 'pointer',
          },
        }}
        open={html?.open}
        onClose={() => sethtml({ url: '', open: false })}
      >
        <Mui.DialogContent style={{ position: 'relative' }}>
          <Mui.Grid className={css.iframeViewDocument}>
            {html?.url.includes('.jpeg') ||
            html?.url.includes('.png') ||
            html?.url.includes('.pdf') === false ? (
              <img src={html?.url} alt="upload" style={{ width: '100%' }} />
            ) : (
              Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                <Document
                  file={html?.url}
                  className={css.pdfStyle}
                  loading="  "
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={i} className={css.page} />
                </Document>
              ))
            )}
          </Mui.Grid>
        </Mui.DialogContent>
      </Mui.Dialog>

      <SelectBottomSheet
        triggerComponent
        open={drawer.yourBills}
        name="yourBill"
        onClose={() => setDrawer((prev) => ({ ...prev, yourBills: false }))}
        addNewSheet
      >
        <div className={css.mainContainer}>
          {tableDetails[0]?.document_number && (
            <Mui.Grid className={css.yourBillsViewEditIcon}>
              <div className={[css.headerContainer]}>
                <div className={css.headerLabel}>
                  {tableDetails[0]?.document_number
                    ? tableDetails[0]?.document_number
                    : '-'}
                </div>
                <span className={css.headerUnderline} />
              </div>
              <Mui.Stack direction="row" className={css.viewAndEditMobile}>
                {tableDetails[0]?.file_url && (
                  <Mui.Grid
                    onClick={() => {
                      sethtml({ url: tableDetails[0]?.file_url, open: true });
                    }}
                  >
                    <img
                      src={viewYourBills}
                      className={css.editButtonss}
                      alt="viewYourbills"
                    />{' '}
                  </Mui.Grid>
                )}
                <Mui.Grid
                  onClick={() => {
                    editbill(tableDetails[0]?.id);
                  }}
                >
                  <img
                    src={editYourBills}
                    className={css.editButtonss}
                    alt="editYourBills"
                  />{' '}
                </Mui.Grid>
              </Mui.Stack>
            </Mui.Grid>
          )}
          <div className={css.parentDrawerContainer}>
            <p className={css.label}>Vendor</p>
            <p className={css.value}>
              {(tableDetails[0]?.vendor && tableDetails[0]?.vendor.name) || '-'}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Amount</p>
            <p className={css.value}>
              ₹ {Number(tableDetails[0]?.amount || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Expense Category</p>
            <p className={css.value}>
              {(tableDetails[0]?.expense_category &&
                tableDetails[0]?.expense_category.name) ||
                '-'}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Payment Mode</p>
            <p className={css.value}>
              {tableDetails[0]?.payment_mode &&
                paymentStatusListWithBill?.find(
                  (v) => v.id === tableDetails[0]?.payment_mode,
                ).label}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Description</p>
            <p className={css.value}>{tableDetails[0]?.description || '-'}</p>
          </div>
        </div>
      </SelectBottomSheet>
    </div>
  );
};

export default Agreement;
