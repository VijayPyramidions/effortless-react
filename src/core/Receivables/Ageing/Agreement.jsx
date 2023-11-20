import * as React from 'react';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import moment from 'moment';
import BorderColorImg from '@assets/Redit';
import DeleteIcon from '@assets/RedDelete';
import AppContext from '@root/AppContext.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import * as css from './Ageing.scss';
import ReceivablesPopOver from '../Components/ReceivablesPopover';

const Agreement = ({ id, customerAgreement, RecurringAccess }) => {
  const {
    organization,
    user,
    // changeSubView,
    enableLoading,
    setActiveInvoiceId,
    openSnackBar,
    loading,
  } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const agreementTitle = [
    'INVOICE ID ',
    'INVOICE DATE',
    'DELIVERY DATE',
    'BILL AMOUNT',
    'STATUS',
  ];
  const [value, setValue] = React.useState([]);
  const [drawer, setDrawer] = React.useState({
    deletePopup: false,
    agreementId: '',
    pdf: false,
  });
  const [html, sethtml] = React.useState();
  const [custAg, setCustAg] = React.useState();

  React.useEffect(() => {
    enableLoading(true);
    setValue([]);
    if (customerAgreement?.length > 0) {
      setCustAg(customerAgreement);
    } else {
      RestApi(
        // `organizations/${organization.orgId}/accounts/${pageParams}/profiles`,
        `organizations/${organization.orgId}/customer_agreements?customer_id=${id}`,
        {
          method: METHOD.GET,
          headers: {
            authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((res) => {
          enableLoading(false);
          if (res && !res.error) {
            // setValue(res?.data);
            if (res?.data?.length > 0) {
              setCustAg(res?.data);
            } else {
              setValue([]);
            }
          } else if (res?.error) {
            openSnackBar({
              message: res?.message || 'Unknown Error Occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch(() => {
          openSnackBar({
            message: 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        });
    }
  }, [id, customerAgreement]);

  React.useEffect(() => {
    for (let i = 0; i < custAg?.length; i += 1) {
      // console.log(res?.data[i]);
      enableLoading(true);
      RestApi(
        // `organizations/${organization.orgId}/accounts/${pageParams}/profiles`,
        `organizations/${organization.orgId}/customer_agreements/${custAg[i]?.id}/invoices`,
        {
          method: METHOD.GET,
          headers: {
            authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((response) => {
          enableLoading(false);
          if (response && !response.error) {
            setValue((prev) =>
              value === [] ? response?.data : [...prev, response?.data],
            );
          } else if (response?.error) {
            openSnackBar({
              message: response?.message || 'Unknown Error Occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch(() => {
          openSnackBar({
            message: 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        });
    }
  }, [custAg]);
  const device = localStorage.getItem('device_detect');

  const upcomingInvoice = (dayOfCreation) => {
    if (Number(dayOfCreation) > new Date().getDate()) {
      return `Bills on ${moment(
        new Date(
          `${dayOfCreation}/${moment().format('MMM')}/${moment().format(
            'YYYY',
          )}`,
        ),
      ).format('MMM DD')}`;
    }
    if (Number(dayOfCreation) <= new Date().getDate()) {
      return `Bills on ${moment(
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

  const recurringPdfDownload = (r_id) => {
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
      `${BASE_URL}/organizations/${organization.orgId}/customer_agreements/${r_id}.html`,
      // `https://staging.goeffortless.co/api/v1/organizations/6b1dbb37-a966-405f-90dc-3e49e2c30be4/invoices/d914dfb6-5ba4-4ee2-acaf-f69a68bb3910.html`,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        sethtml(result);
      })
      .catch((error) => console.log('error', error));
  };

  const deleteRecurringInvoice = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/customer_agreements/${drawer.agreementId}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          openSnackBar({
            message: 'Cancelled Successfully',
            type: MESSAGE_TYPE.INFO,
          });
          navigate('/invoice-recurring');
        } else if (res?.error) {
          openSnackBar({
            message:
              Object.values(res.errors).join(', ') || 'Unkonwn Error Occurred',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const EditRecurring = (data) => {
    const tempPerm = RecurringAccess('edit_recurring_invoices');
    if (tempPerm) {
      setActiveInvoiceId({
        activeInvoiceId: data[0].customer_agreement_id,
        activeInvoiceSubject: 'customer_agreements',
      });
      navigate('/invoice-recurring-edit', {
        state: {
          recuuringParam: {
            type: 'recurring',
            id: data[0].customer_agreement_id,
          },
          from: 'edit',
          name: data[0]?.customer_name,
        },
      });
    }
  };

  const CancelRecurring = (data) => {
    const tempPerm = RecurringAccess('cancel_recurring_invoices');
    if (tempPerm) {
      setDrawer((prev) => ({
        ...prev,
        agreementId: data[0].customer_agreement_id,
        deletePopup: true,
      }));
    }
  };

  return (
    <div>
      {/* {device === 'mobile' && (
        <p className={css.titleHead}>Recurring Invoices</p>
      )} */}
      <Mui.Grid container>
        {(device === 'desktop' &&
          (custAg &&
          custAg?.length > 0 &&
          value &&
          value?.length > 0 &&
          value?.flat()?.length > 0 ? (
            value?.map(
              (data) =>
                data?.length > 0 && (
                  <Mui.Grid
                    item
                    xs={12}
                    md={12}
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', md: 'flex-end' },
                      marginBottom: '15px',
                    }}
                  >
                    <Mui.TableContainer
                      sx={{
                        borderRadius: '16px', // minHeight: 600,
                        width: '70%',
                        maxHeight: '55vh',
                      }}
                    >
                      <Mui.Table
                        stickyHeader
                        size="medium"
                        style={{
                          paddingRight: '10px',
                          paddingLeft: '10px',
                          background: '#fff',
                          borderRadius: '16px',
                        }}
                      >
                        <Mui.TableHead
                          sx={{
                            background: '#fff',
                            fontSize: '13px',
                            borderColor: (theme) => theme.palette.grey[100],
                          }}
                        >
                          <Mui.TableRow>
                            {agreementTitle?.map((title) => (
                              <Mui.TableCell key={title}>
                                <Mui.Typography
                                  noWrap
                                  variant="body2"
                                  fontSize="13px"
                                  color="#283049"
                                  fontWeight="500"
                                >
                                  {title}
                                </Mui.Typography>
                              </Mui.TableCell>
                            ))}
                          </Mui.TableRow>
                        </Mui.TableHead>
                        <Mui.TableBody>
                          {data?.map((val) => (
                            <Mui.TableRow
                              sx={{
                                borderColor: (theme) => theme.palette.grey[100],
                              }}
                            >
                              <>
                                <Mui.TableCell
                                  sx={{
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    setDrawer((prev) => ({
                                      ...prev,
                                      pdf: true,
                                    }));
                                    recurringPdfDownload(
                                      data[0].customer_agreement_id,
                                    );
                                  }}
                                >
                                  <Mui.Typography
                                    sx={{
                                      color: '#1F4FB9!important',
                                    }}
                                    className={css.amount}
                                  >
                                    {val?.invoice_number}
                                  </Mui.Typography>
                                </Mui.TableCell>

                                <Mui.TableCell>
                                  <Mui.Typography noWrap className={css.amount}>
                                    {moment(val?.date).format('DD MMM YYYY')}
                                  </Mui.Typography>
                                </Mui.TableCell>

                                <Mui.TableCell>
                                  <Mui.Typography noWrap className={css.amount}>
                                    {val?.delivered_at === null
                                      ? '-'
                                      : moment(val?.delivered_at).format(
                                          'DD MMM YYYY',
                                        )}
                                  </Mui.Typography>
                                </Mui.TableCell>

                                <Mui.TableCell align="right">
                                  <Mui.Typography
                                    noWrap
                                    className={css.noOfInvoices}
                                    style={{
                                      color:
                                        Number(val?.total_value) >= 0
                                          ? '#000'
                                          : '#950909',
                                    }}
                                  >
                                    {FormattedAmount(val?.total_value)}
                                  </Mui.Typography>
                                </Mui.TableCell>

                                <Mui.TableCell>
                                  <Mui.Typography className={css.amount}>
                                    <div
                                      className={
                                        !val?.delivered
                                          ? css.active
                                          : css.dispatched
                                      }
                                    >
                                      {val?.delivered ? 'Dispatched' : 'Active'}
                                    </div>
                                  </Mui.Typography>
                                </Mui.TableCell>
                              </>
                            </Mui.TableRow>
                          ))}
                        </Mui.TableBody>
                      </Mui.Table>
                    </Mui.TableContainer>
                    <Mui.Grid
                      item
                      xs={12}
                      md={4}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <div className={css.agreementNewInfo}>
                        <p className={css.aggPeriod}>Agreement Period</p>
                        {[
                          {
                            key: 'start_date',
                            name: 'Start Date',
                            value:
                              (custAg?.find(
                                (val) =>
                                  val?.id === data[0]?.customer_agreement_id,
                              )?.start_date &&
                                moment(
                                  custAg?.find(
                                    (val) =>
                                      val?.id ===
                                      data[0]?.customer_agreement_id,
                                  )?.start_date,
                                ).format('DD-MM-YYYY')) ||
                              '-',
                          },
                          {
                            name: 'End Date',
                            key: 'end_date',
                            value:
                              (custAg?.find(
                                (val) =>
                                  val?.id === data[0]?.customer_agreement_id,
                              )?.end_date &&
                                moment(
                                  custAg?.find(
                                    (val) =>
                                      val?.id ===
                                      data[0]?.customer_agreement_id,
                                  )?.end_date,
                                ).format('DD-MM-YYYY')) ||
                              '-',
                          },
                          {
                            name: 'Amount',
                            key: 'total_amount',
                            value:
                              (custAg?.find(
                                (val) =>
                                  val?.id === data[0]?.customer_agreement_id,
                              )?.total_amount &&
                                FormattedAmount(
                                  custAg?.find(
                                    (val) =>
                                      val?.id ===
                                      data[0]?.customer_agreement_id,
                                  )?.total_amount,
                                )) ||
                              '-',
                          },
                          {
                            name: 'Upcoming Invoice',
                            key: 'narration',
                            value: upcomingInvoice(
                              custAg?.find(
                                (val) =>
                                  val?.id === data[0]?.customer_agreement_id,
                              )?.day_of_creation,
                              FormattedAmount(
                                custAg?.find(
                                  (val) =>
                                    val?.id === data[0]?.customer_agreement_id,
                                )?.total_amount,
                              ),
                            ),
                          },
                        ]?.map((innerVal) => (
                          <div className={css.aggInnerDiv}>
                            <p className={css.keyPTag}>{innerVal.name}</p>
                            <p className={css.valuePTag}>{innerVal.value}</p>
                          </div>
                        ))}
                      </div>
                      <Mui.Stack
                        p="0 0 0 10px"
                        flexDirection={{
                          xs: device === 'mobile' ? 'column' : 'row',
                          md: 'column',
                        }}
                        width="100%"
                        alignItems="center"
                      >
                        <Mui.Button
                          className={css.editButton}
                          onClick={() => {
                            EditRecurring(data);
                          }}
                        >
                          <span style={{ display: 'flex' }}>
                            <BorderColorIcon />
                          </span>
                          Edit Recurring Invoice
                        </Mui.Button>
                        <Mui.Button
                          className={css.cancelButton}
                          onClick={() =>
                            CancelRecurring(data)
                          }
                        >
                          <span style={{ display: 'flex' }}>
                            <HighlightOffIcon />
                          </span>
                          Cancel the Agreement
                        </Mui.Button>
                      </Mui.Stack>
                    </Mui.Grid>
                  </Mui.Grid>
                ),
            )
          ) : (
            <Mui.Typography align="center" width="100%">
              {loading ? 'Data is being fetched' : 'No Data Found'}
            </Mui.Typography>
          ))) || (
          <>
            {(custAg &&
              custAg?.length > 0 &&
              value &&
              value?.length > 0 &&
              value?.flat()?.length > 0 &&
              value?.map(
                (data) =>
                  data?.length > 0 && (
                    <Mui.Stack
                      direction="column"
                      width="100%"
                      padding="10px 25px"
                      mb="15px"
                    >
                      <div className={css.newAggPeriodMob}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center',
                          }}
                        >
                          <p className={css.agreementP}>Agreement Period</p>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: 10,
                              alignItems: 'center',
                            }}
                          >
                            <Mui.IconButton
                              onClick={() => {
                                EditRecurring(data);
                              }}
                              sx={{
                                background: '#FDF3EA',
                                height: 30,
                                width: 30,
                              }}
                            >
                              <img src={BorderColorImg} alt="edit" />
                            </Mui.IconButton>
                            <Mui.IconButton
                              onClick={() =>
                                CancelRecurring(data)
                              }
                              sx={{
                                background: '#FFE5E5',
                                height: 30,
                                width: 30,
                              }}
                            >
                              <img src={DeleteIcon} alt="delete" />
                            </Mui.IconButton>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 30,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                              }}
                            >
                              <p className={css.headTextAgg}>Start Date</p>
                              <p className={css.subTextAgg}>
                                {(custAg?.find(
                                  (val) =>
                                    val?.id === data[0]?.customer_agreement_id,
                                )?.start_date &&
                                  moment(
                                    custAg?.find(
                                      (val) =>
                                        val?.id ===
                                        data[0]?.customer_agreement_id,
                                    )?.start_date,
                                  ).format('DD-MM-YYYY')) ||
                                  '-'}
                              </p>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                              }}
                            >
                              <p className={css.headTextAgg}>End Date</p>
                              <p className={css.subTextAgg}>
                                {(custAg?.find(
                                  (val) =>
                                    val?.id === data[0]?.customer_agreement_id,
                                )?.end_date &&
                                  moment(
                                    custAg?.find(
                                      (val) =>
                                        val?.id ===
                                        data[0]?.customer_agreement_id,
                                    )?.end_date,
                                  ).format('DD-MM-YYYY')) ||
                                  '-'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                                alignItems: 'flex-end',
                              }}
                            >
                              <p className={css.headTextAgg}>Amount</p>
                              <p
                                style={{ color: '#F08B32' }}
                                className={css.subTextAgg}
                              >
                                {(custAg?.find(
                                  (val) =>
                                    val?.id === data[0]?.customer_agreement_id,
                                )?.total_amount &&
                                  FormattedAmount(
                                    custAg?.find(
                                      (val) =>
                                        val?.id ===
                                        data[0]?.customer_agreement_id,
                                    )?.total_amount,
                                  )) ||
                                  '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 4,
                            }}
                          >
                            <p className={css.headTextAgg}>Upcoming Invoice</p>
                            <p className={css.subTextAgg}>
                              {upcomingInvoice(
                                custAg?.find(
                                  (val) =>
                                    val?.id === data[0]?.customer_agreement_id,
                                )?.day_of_creation,
                                FormattedAmount(
                                  custAg?.find(
                                    (val) =>
                                      val?.id ===
                                      data[0]?.customer_agreement_id,
                                  )?.total_amount,
                                ),
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        {data?.map((val) => (
                          <>
                            <Mui.Box>
                              <Mui.Stack
                                justifyContent="space-between"
                                direction="row"
                              >
                                <Mui.Typography
                                  onClick={() => {
                                    setDrawer((prev) => ({
                                      ...prev,
                                      pdf: true,
                                    }));
                                    recurringPdfDownload(
                                      data[0].customer_agreement_id,
                                    );
                                  }}
                                  className={css.blackHeadAgId}
                                >
                                  {val?.invoice_number || '-'}
                                </Mui.Typography>
                                <Mui.Typography className={css.greyDataAgDate}>
                                  {moment(val?.date).format('DD MMM YYYY')}
                                </Mui.Typography>
                              </Mui.Stack>
                              <Mui.Stack
                                mt="10px"
                                justifyContent="space-around"
                                direction="row"
                              >
                                <Mui.ListItemText
                                  primary={
                                    <Mui.Typography
                                      align="left"
                                      className={css.greyDataAg}
                                    >
                                      Delivery Date
                                    </Mui.Typography>
                                  }
                                  secondary={
                                    <Mui.Typography
                                      align="left"
                                      className={css.blackHeadAg}
                                    >
                                      {val?.delivered_at === null
                                        ? '-'
                                        : moment(val?.delivered_at).format(
                                            'DD MMM YYYY',
                                          )}
                                    </Mui.Typography>
                                  }
                                />
                                <Mui.ListItemText
                                  primary={
                                    <Mui.Typography
                                      align="center"
                                      className={css.greyDataAg}
                                    >
                                      Bill Amount
                                    </Mui.Typography>
                                  }
                                  secondary={
                                    <Mui.Typography
                                      align="center"
                                      className={css.blackHeadAg}
                                    >
                                      {FormattedAmount(val?.total_value)}
                                    </Mui.Typography>
                                  }
                                />
                                <Mui.ListItemText
                                  primary={
                                    <Mui.Typography
                                      align="right"
                                      className={css.greyDataAg}
                                    >
                                      Status
                                    </Mui.Typography>
                                  }
                                  secondary={
                                    <Mui.Typography
                                      align="right"
                                      className={css.statusAg}
                                      style={{
                                        color: val?.delivered
                                          ? '#f08b32'
                                          : '#00A676',
                                      }}
                                    >
                                      {val?.delivered ? 'Dispatched' : 'Active'}
                                    </Mui.Typography>
                                  }
                                />
                              </Mui.Stack>
                            </Mui.Box>
                            <Mui.Divider />
                          </>
                        ))}
                      </div>
                    </Mui.Stack>
                  ),
              )) || (
              <Mui.Typography width="100%" align="center">
                {loading ? 'Data is being fetched' : 'No Data Found'}
              </Mui.Typography>
            )}
          </>
        )}
      </Mui.Grid>
      <ReceivablesPopOver
        open={drawer.deletePopup}
        handleClose={() =>
          setDrawer((prev) => ({ ...prev, deletePopup: false }))
        }
        position="center"
      >
        {/* deleteInvoice(activeItem.id) */}
        <div className={css.effortlessOptionsPop}>
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
      </ReceivablesPopOver>
      <Mui.Dialog
        open={drawer.pdf}
        id="basic-menu-sort"
        onClose={() => setDrawer((prev) => ({ ...prev, pdf: false }))}
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
            <iframe
              srcDoc={html?.replace(
                'div.nobreak{page-break-inside:avoid}',
                'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}',
              )}
              title="html"
              frameBorder="0"
              className={css.scrolling}
            />
          </Mui.Stack>
        </Mui.DialogContent>
      </Mui.Dialog>
    </div>
  );
};

export default Agreement;
