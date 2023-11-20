import React, { useState, useEffect, useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetIndividualInvoiceEWayBillState,
  DeleteInvoiceEWayBillPDFState,
  // PatchDeactivateInvoiceEWayBillState,
  ClearEWayBillPDFActionState,
} from '@action/Store/Reducers/Invoice/InvoiceEWayBillState';
import PageTitle from '@core/DashboardView/PageTitle';

import { Stack, Box, IconButton, Button, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BASE_URL } from '@action/ApiConfig/AxiosInst';

import JSBridge from '@nativeBridge/jsbridge';

import { Document, Page } from 'react-pdf'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AddIcon from '@mui/icons-material/Add';

// import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { makeStyles } from '@material-ui/core/styles';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';
import closex from '../../../assets/closex.svg';
import download from '../../../assets/downns.svg';
import pencilEdit from '../../../assets/pencilEdit.svg';

import { InvoicePdfLoad } from '../../../components/SkeletonLoad/SkeletonLoader';
import DeliverInvoiceToCustomer from '../DeliverInvoiceToCustomer';

import * as css from './EWayBillStyle.scss';

const useStyles = makeStyles({
  menutext: {
    color: '#283049 !important',
    fontFamily: 'Lexend, sans-serif !important',
    fontSize: '14px !important',
    fontStyle: 'normal !important',
    fontWeight: '400 !important',
    lineHeight: 'normal !important',
    borderBottom: '1px solid rgba(199, 199, 199, 0.50) !important',
  },
});
const GenerateEWayBillPdf = () => {
  const { organization, user, setActiveInvoiceId } = useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  const dispatch = useDispatch();
  const { EWayBillPDFDataState, EWayBillPDFActionState } = useSelector(
    (value) => value.InvoiceEWayBill
  );
  const navigate = useNavigate();
  const { state } = useLocation();

  const classes = useStyles();
  const [PdfState, setPdfState] = useState({});
  const [html, sethtml] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [drawer, setDrawer] = useState({});
  const [HideCancel, setHideCancel] = useState(false);

  const TriggerDrawer = (name, bool) => {
    setDrawer((prev) => ({ ...prev, [name]: bool }));
  };
  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };
  const pdfmessage = () => {
    if (
      PdfState?.status === 'approved' ||
      PdfState?.status === 'vehicle_updated'
    ) {
      return '#2F9682';
    }
    if (
      PdfState?.status === 'pending' ||
      PdfState?.status === 'vehicle_updating'
    ) {
      return '#F08B32';
    }
    return '#F00';
  };


  const pdfGeneration = (type) => {
        if (device === 'desktop') {
          window.open(PdfState?.pdf_url, '_blank', 'popup');
        } else {
          JSBridge.shareLink({file_name: `E_Way_bill_${PdfState?.invoice_number}`, pdf: html}, type);
        }
  };

  useEffect(() => {
    if (Object.keys(PdfState || {})?.length > 0) {
      setActiveInvoiceId({
        activeInvoiceId: PdfState?.invoice_id,
      });
      if (
        PdfState?.pdf_url &&
        PdfState?.status !== 'approval_failed' &&
        PdfState?.status !== 'pending'
      ) {
        sethtml(PdfState?.pdf_url);
      } else if (device === 'desktop') {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', user.activeToken);
        myHeaders.append(
          'Cookie',
          'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f'
        );
        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };

        fetch(
          `${BASE_URL}/organizations/${organization?.orgId}/invoices/${PdfState?.invoice_id}/e_way_bills/${PdfState?.id}.html`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            sethtml(result);
          })
          .catch((error) => console.log('error', error));
      } else if (device === 'mobile') {
        sethtml(PdfState?.pdf_url);
      }
    }
  }, [JSON.stringify(PdfState)]);

  useEffect(() => {
    if (state?.fromCreate !== 'new_e_way_bill') {
      setHideCancel(true);
    }
  }, [state?.fromCreate]);

  useEffect(() => {
    if (EWayBillPDFActionState === 'e_way_bill_cancelled') {
      navigate('/invoice-e-waybill');
    } else if (EWayBillPDFActionState === 'e_way_bill_destroyed') {
      navigate(`/invoice-e-waybill-edit?id=${PdfState?.invoice_id}`, {
        state: {
          EWayBillResponse: PdfState,
          from: 'e_way_bill_pdf',
        },
      });
    }
    return () => {
      dispatch(ClearEWayBillPDFActionState());
    };
  }, [EWayBillPDFActionState]);

  useEffect(() => {
    if (Object.keys(state?.EWayBillResponse || {})?.length > 0) {
      dispatch(
        GetIndividualInvoiceEWayBillState({
          invoiceId: state?.EWayBillResponse?.invoice_id,
          EWayBillId: state?.EWayBillResponse?.id,
        })
      );
    } else {
      navigate('/invoice-e-waybill');
    }
  }, [state?.EWayBillResponse]);

  useEffect(() => {
    if (Object.keys(EWayBillPDFDataState || {})?.length > 0) {
      setPdfState(EWayBillPDFDataState);
    }
  }, [EWayBillPDFDataState]);

  return (
    <>
      <PageTitle
        title="E-Way Bills"
        onClick={() => {
          navigate('/invoice-e-waybill', { state: { fromPdf: state?.from } });
        }}
      />
      <div
        className={
          device === 'mobile'
            ? cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
      >
        <Box
          className={device === 'desktop' ? css.cancelbar : css.cancelbarmobile}
          style={{
            display: HideCancel && 'none',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <p className={css.canceltext}>
              Heads Up! You have 24 hours to Cancel this E-Way Bill before it
              becomes permanent.
            </p>
            {device === 'desktop' && (
              <IconButton onClick={() => setHideCancel(true)}>
                <CloseIcon sx={{ color: '#283049', cursor: 'pointer' }} />
              </IconButton>
            )}
          </Stack>
        </Box>
        <div
          className={
            device === 'desktop'
              ? css.genratedewaybilldesktop
              : css.genratedewaybillmobile
          }
        >
          <p
            className={HideCancel ? css.statustextnew : css.statustext}
            style={{ color: pdfmessage() }}
          >
            {PdfState?.message || 'E-Way Bill PDF'}
          </p>
          {device === 'desktop' && (
            <Stack
              height={HideCancel ? 'calc(100% - 20px)' : 'calc(100% - 80px)'}
              direction="row"
            >
              <Box className={css.ewaybillpdf}>
                {!html && InvoicePdfLoad()}
                {html &&
                  ((PdfState?.pdf_url &&
                    PdfState?.status !== 'approval_failed' &&
                    PdfState?.status !== 'pending' && (
                      <Document
                        file={html}
                        className={css.scrolling}
                        loading="  "
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page pageNumber={1} />
                      </Document>
                    )) || (
                    <iframe
                      srcDoc={html?.replace(
                        'div.nobreak{page-break-inside:avoid}',
                        'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}'
                      )}
                      title="html"
                      frameBorder="0"
                      className={css.scrolling}
                    />
                  ))}
              </Box>

              <Box className={css.pdfactionbox}>
                {(PdfState?.status === 'approved' ||
                  PdfState?.status === 'vehicle_updated' ||
                  PdfState?.status === 'approval_failed' ||
                  PdfState?.status === 'vehicle_update_failed') && (
                  <Box
                    sx={{
                      background: '#2F9682',
                      '&:hover': {
                        background: '#2F9682',
                      },
                    }}
                    className={css.actionbtn}
                    component={IconButton}
                    onClick={() => {
                      navigate(
                        `/invoice-e-waybill-edit?id=${PdfState?.invoice_id}`,
                        {
                          state: {
                            EWayBillResponse: PdfState,
                            from: 'e_way_bill_pdf',
                          },
                        }
                      );
                    }}
                  >
                    <img
                      src={pencilEdit}
                      alt="pencilEdit"
                      style={{ width: '22px' }}
                    />
                  </Box>
                )}

                {/* <Box
                sx={{
                  background: '#7C3EA1',
                  '&:hover': {
                    background: '#7C3EA1',
                  },
                }}
                className={css.actionbtn}
                component={IconButton}
                onClick={() => {
                  TriggerDrawer('delivertocustomer', true);
                }}
              >
                <MailOutlineIcon style={{ width: '22px', color: '#FFF' }} />
              </Box> */}

                <Box
                  sx={{
                    background: '#F08B32',
                    '&:hover': {
                      background: '#F08B32',
                    },
                  }}
                  className={css.actionbtn}
                  component={IconButton}
                  onClick={() => pdfGeneration()}
                  // download
                  // href={html}
                  // target="_blank"
                >
                  <img
                    src={download}
                    alt="download"
                    style={{ width: '22px' }}
                  />
                </Box>

                {(PdfState?.status === 'approved' ||
                  PdfState?.status === 'vehicle_updated') && (
                  <Box
                    sx={{
                      background: '#E40505',
                      '&:hover': {
                        background: '#E40505',
                      },
                    }}
                    className={css.actionbtn}
                    component={IconButton}
                    onClick={() =>
                      dispatch(
                        DeleteInvoiceEWayBillPDFState({
                          invoiceId: PdfState?.invoice_id,
                          EWayBillId: PdfState?.id,
                        })
                      )
                    }
                  >
                    <img src={closex} alt="closex" style={{ width: '22px' }} />
                  </Box>
                )}
              </Box>
            </Stack>
          )}

          {device === 'mobile' && (
            <div className={HideCancel ? css.pdffieldsfornew : css.pdffields}>
              {Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                <TransformWrapper>
                  <TransformComponent
                    wrapperStyle={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '16px',
                    }}
                  >
                    <Document
                      file={html}
                      className={css.pdfStyle}
                      loading="  "
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={i} />
                    </Document>
                  </TransformComponent>
                </TransformWrapper>
              ))}
              <div className={css.pdfbuttonfields}>
                {(PdfState?.status === 'approved' ||
                  PdfState?.status === 'vehicle_updated') && (
                  <Button
                    className={css.cancelpdfButton}
                    onClick={() =>
                      dispatch(
                        DeleteInvoiceEWayBillPDFState({
                          invoiceId: PdfState?.invoice_id,
                          EWayBillId: PdfState?.id,
                        })
                      )
                    }
                  >
                    Cancel E-Way Bill
                  </Button>
                )}
                {null && (
                  <Button className={css.primaryButton}>View Details</Button>
                )}
                {(PdfState?.status === 'approval_failed' ||
                  PdfState?.status === 'vehicle_update_failed') && (
                  <Button
                    className={css.primaryButton}
                    onClick={() => {
                      navigate(
                        `/invoice-e-waybill-edit?id=${PdfState?.invoice_id}`,
                        {
                          state: {
                            EWayBillResponse: PdfState,
                            from: 'e_way_bill_pdf',
                          },
                        }
                      );
                    }}
                  >
                    <img
                      src={pencilEdit}
                      alt="pencilEdit"
                      style={{ width: '22px' }}
                    />
                    Edit
                  </Button>
                )}
                {(PdfState?.status === 'approved' ||
                  PdfState?.status === 'vehicle_updated') && (
                  <Button
                    className={css.primaryButton}
                    onClick={() => {
                      navigate(
                        `/invoice-e-waybill-edit?id=${PdfState?.invoice_id}`,
                        {
                          state: {
                            EWayBillResponse: PdfState,
                            from: 'e_way_bill_pdf',
                          },
                        }
                      );
                    }}
                  >
                    <AddIcon sx={{ fontSize: '14px' }} />
                    Add Vehicle
                  </Button>
                )}
                <Button
                  className={css.secondaryButton}
                  onClick={() => TriggerDrawer('moreaction', true)}
                >
                  More Actions
                </Button>
              </div>
            </div>
          )}

          <SelectBottomSheet
            open={drawer.moreaction}
            onClose={() => TriggerDrawer('moreaction', false)}
            triggerComponent={<div style={{ display: 'none' }} />}
            addNewSheet
          >
            <div style={{ padding: '20px' }}>
              <p className={css.headertextforsheet}>More Action</p>
              {[
                // { name: 'Deliver to Customer' },
                { name: 'Share', param: 'share' },
                { name: 'Download as PDF', param: 'download' },
              ].map((val) => (
                <MenuItem
                  key={val?.name}
                  value={val?.name}
                  onClick={() => {
                    TriggerDrawer('moreaction', false);
                    pdfGeneration(val?.param);
                  }}
                  className={classes.menutext}
                  style={{ padding: '6px 0' }}
                >
                  {val?.name}
                </MenuItem>
              ))}
            </div>
          </SelectBottomSheet>
          <SelectBottomSheet
            open={drawer.delivertocustomer}
            onClose={() => TriggerDrawer('delivertocustomer', false)}
            triggerComponent={<div style={{ display: 'none' }} />}
            addNewSheet
          >
            <DeliverInvoiceToCustomer
              fromSheet={() => TriggerDrawer('delivertocustomer', false)}
            />
          </SelectBottomSheet>
        </div>
      </div>
    </>
  );
};

export default GenerateEWayBillPdf;
