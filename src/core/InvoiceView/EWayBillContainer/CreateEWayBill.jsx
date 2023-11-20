import React, { useState, useEffect, useContext } from 'react';
// import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  PatchInvoiceUpdateEWayBillState,
  PostInvoiceEWayBillState,
  ClearStateGetInvoiceEWayBill,
  PostInvoiceEWayBillNewVehicleState,
} from '@action/Store/Reducers/Invoice/InvoiceEWayBillState';
import AppContext from '@root/AppContext.jsx';

import { validateVehicleNumber } from '@services/Validation.jsx';

import {
  Stack,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import { BASE_URL } from '@action/ApiConfig/AxiosInst';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

import {
  openSnackbar,
  // enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import CreateEWayBillPartA from './CreateEWayBillPartA';
import CreateEWayBillPartB from './CreateEWayBillPartB';
import CreateEWayBillPartC from './CreateEWayBillPartC';
import { InvoicePdfLoad } from '../../../components/SkeletonLoad/SkeletonLoader';

import * as css from './EWayBillStyle.scss';

const CreateEWayBill = () => {
  const { organization, user } = useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  const dispatch = useDispatch();
  const { InvoiceEWayBillState } = useSelector(
    (value) => value.InvoiceEWayBill
  );
  const navigate = useNavigate();
  const { state } = useLocation();
  const queryParam = new URLSearchParams(window.location.search).get('id');
  const [html, sethtml] = useState();
  const [accordionCheck, setAccordionCheck] = useState({
    partA: true,
    partB: true,
  });
  const [NewVehicle, setNewVehicle] = useState(false);
  const [localState, setLocalState] = useState({
    sub_type: 'supply',
    transportation_details: {
      mode: 'road',
      vehicle_type: 'regular',
      document_date: null,
    },
  });
  const [localStateNewVehicle, setLocalStateNewVehicle] = useState({});

  const updateEWayBillParams = (pass, from) => {
    if (from === 'partB') {
      setLocalState({
        ...localState,
        transportation_details: {
          ...localState?.transportation_details,
          ...pass,
        },
      });
    } else if (from === 'partC') {
      setLocalStateNewVehicle({ ...localStateNewVehicle, ...pass });
    } else {
      setLocalState({ ...localState, ...pass });
    }
  };

  const onSubmitEWayBill = () => {
    if (
      !localState?.transporter_id ||
      !localState?.distance ||
      localState?.distance <= 0
    ) {
      dispatch(
        openSnackbar({
          message: 'Please fill required fields in Part A',
          type: 'error',
        })
      );
    } else if (
      (localState?.transportation_details?.mode === 'road' &&
        !localState?.transportation_details?.vehicle_number) ||
      (localState?.transportation_details?.mode !== 'road' &&
        (!localState?.transportation_details?.document_number ||
          !localState?.transportation_details?.document_date))
    ) {
      dispatch(
        openSnackbar({
          message: 'Please fill required fields in Part B',
          type: 'error',
        })
      );
    } else {
      if (
        !validateVehicleNumber(
          localState?.transportation_details?.vehicle_number
        ) &&
        localState?.transportation_details?.mode === 'road'
      ) {
        dispatch(
          openSnackbar({
            message: 'Enter Valid Vehicle Number',
            type: 'error',
          })
        );
        return;
      }
      dispatch(
        PostInvoiceEWayBillState({
          createEWayBill: { ...localState },
          invoiceId: queryParam,
        })
      );
    }
  };

  const onUpdateEWayBill = () => {
    if (
      (localStateNewVehicle?.mode === 'road' &&
        !localStateNewVehicle?.vehicle_number) ||
      (localStateNewVehicle?.mode !== 'road' &&
        (!localStateNewVehicle?.document_number ||
          !localStateNewVehicle?.document_date)) ||
      !localStateNewVehicle?.from_state ||
      !localStateNewVehicle?.from_place ||
      !localStateNewVehicle?.reason ||
      !localStateNewVehicle?.remarks
    ) {
      dispatch(
        openSnackbar({
          message: 'Please fill required fields',
          type: 'error',
        })
      );
    } else {
      if (
        !validateVehicleNumber(localStateNewVehicle?.vehicle_number) &&
        localStateNewVehicle?.mode === 'road'
      ) {
        dispatch(
          openSnackbar({
            message: 'Enter Valid Vehicle Number',
            type: 'error',
          })
        );
        return;
      }
      dispatch(
        PostInvoiceEWayBillNewVehicleState({
          updateEWayBill: { ...localStateNewVehicle },
          invoiceId: queryParam,
          EWayBillId: state?.EWayBillResponse?.id,
        })
      );
    }
  };

  useEffect(() => {
    if (!queryParam) {
      navigate('/invoice-e-waybill');
    }
  }, [queryParam]);

  useEffect(() => {
    let accept = true;
    if (
      window.location.pathname === '/invoice-e-waybill-edit' &&
      (state?.EWayBillResponse?.status === 'approved' ||
        state?.EWayBillResponse?.status === 'vehicle_updated' ||
        state?.EWayBillResponse?.status === 'vehicle_update_failed')
    ) {
      accept = false;
    }
    if (device === 'desktop') {
      if (accept) {
        dispatch(
          PatchInvoiceUpdateEWayBillState({
            createEWayBill: localState,
            invoiceId: queryParam,
          })
        );
      }

      fetch(
        accept
          ? `${BASE_URL}/organizations/${organization.orgId}/invoices/${queryParam}/e_way_bills/draft.html`
          : `${BASE_URL}/organizations/${organization.orgId}/invoices/${queryParam}/e_way_bills/${state?.EWayBillResponse?.id}/transportation_details/draft.html`,
        {
          headers: {
            Authorization: user.activeToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: accept
            ? JSON.stringify(localState)
            : JSON.stringify(localStateNewVehicle),
        }
      )
        .then((response) => response.text())
        .then((result) => {
          sethtml(result);
        })
        .catch((error) => console.log('error', error));
    }
  }, [JSON.stringify(localState), JSON.stringify(localStateNewVehicle)]);

  useEffect(() => {
    if (Object.keys(InvoiceEWayBillState || {})?.length > 0) {
      navigate('/invoice-e-waybill-pdf', {
        state: {
          EWayBillResponse: InvoiceEWayBillState,
          fromUpdate: 'update_e_way_bill',
        },
      });
    }
    return () => {
      dispatch(ClearStateGetInvoiceEWayBill());
    };
  }, [InvoiceEWayBillState]);

  useEffect(() => {
    if (Object.keys(state?.EWayBillResponse || {})?.length > 0) {
      setLocalState({
        distance: state?.EWayBillResponse?.distance || 0,
        transaction_sub_type: state?.EWayBillResponse?.sub_type || '',
        transporter_id: state?.EWayBillResponse?.transporter_id,
        transportation_details: {
          mode: state?.EWayBillResponse?.transportation_details?.[0]?.mode,
          vehicle_type:
            state?.EWayBillResponse?.transportation_details?.[0]?.vehicle_type,
          document_date: state?.EWayBillResponse?.transportation_details?.[0]
            ?.document_date
            ? new Date(
                state?.EWayBillResponse?.transportation_details?.[0]?.document_date
              )
            : null,
          vehicle_number:
            state?.EWayBillResponse?.transportation_details?.[0]
              ?.vehicle_number,
          document_number:
            state?.EWayBillResponse?.transportation_details?.[0]
              ?.document_number,
        },
      });
      if (state?.EWayBillResponse?.transportation_details?.length > 1) {
        setAccordionCheck({
          partA: false,
          partB: false,
        });
      }
      if (state?.EWayBillResponse?.status === 'vehicle_update_failed') {
        setNewVehicle(true);
      }
    }
  }, [state?.EWayBillResponse]);

  return (
    <div
      className={
        device === 'desktop'
          ? `${css.createewaybilldesktop}`
          : `${css.createewaybilldesktop} ${css.createewaybillmobile}`
      }
    >
      <Stack height="100%" width="100%" direction="row" gap="32px">
        {device === 'desktop' && (
          <Box className={css.ewaybillpdf}>
            {!html && InvoicePdfLoad()}
            {html && (
              <iframe
                srcDoc={html?.replace(
                  'div.nobreak{page-break-inside:avoid}',
                  'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}'
                )}
                title="html"
                frameBorder="0"
                className={css.scrolling}
              />
            )}
          </Box>
        )}
        <Box
          className={css.ewaybillfieldsbox}
          style={{
            width: device === 'desktop' ? '460px' : 'calc(100% - 40px)',
          }}
        >
          {device === 'desktop' && (
            <p className={css.headertext}>Create E-Way Bill</p>
          )}
          <Stack
            direction="column"
            gap="20px"
            maxHeight={
              device === 'desktop' ? 'calc(100% - 116px)' : 'calc(100% - 80px)'
            }
            overflow="auto"
          >
            <Accordion
              className={css.ewaybillaccordian}
              expanded={accordionCheck?.partA}
              onChange={() =>
                setAccordionCheck({
                  ...accordionCheck,
                  partA: !accordionCheck?.partA,
                })
              }
              sx={{ '&.Mui-expanded': { margin: '0 !important' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <p className={css.accordianheadertext}>Part A</p>
              </AccordionSummary>
              <AccordionDetails className={css.accordiandetails}>
                <CreateEWayBillPartA
                  updateEWayBillParams={updateEWayBillParams}
                  EWayBillStatus={
                    state?.EWayBillResponse?.status === 'approved' ||
                    state?.EWayBillResponse?.status ===
                      'vehicle_update_failed' ||
                    state?.EWayBillResponse?.status === 'vehicle_updated'
                  }
                />{' '}
              </AccordionDetails>
            </Accordion>

            <Accordion
              className={css.ewaybillaccordian}
              expanded={accordionCheck?.partB}
              onChange={() =>
                setAccordionCheck({
                  ...accordionCheck,
                  partB: !accordionCheck?.partB,
                })
              }
              sx={{ '&.Mui-expanded': { margin: '0 !important' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <p className={css.accordianheadertext}>Part B</p>
              </AccordionSummary>
              <AccordionDetails className={css.accordiandetails}>
                <CreateEWayBillPartB
                  updateEWayBillParams={updateEWayBillParams}
                  EWayBillStatus={
                    state?.EWayBillResponse?.status === 'approved' ||
                    state?.EWayBillResponse?.status ===
                      'vehicle_update_failed' ||
                    state?.EWayBillResponse?.status === 'vehicle_updated'
                  }
                />{' '}
              </AccordionDetails>
            </Accordion>

            {state?.EWayBillResponse?.transportation_details?.length > 1 &&
              state?.EWayBillResponse?.transportation_details?.map(
                (value, index) => {
                  return index === 0 ? (
                    <></>
                  ) : (
                    <Accordion
                      className={css.ewaybillaccordian}
                      sx={{ '&.Mui-expanded': { margin: '0 !important' } }}
                      key={value?.id}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <p className={css.accordianheadertext}>Part B</p>
                      </AccordionSummary>
                      <AccordionDetails className={css.accordiandetails}>
                        {state?.EWayBillResponse?.status ===
                          'vehicle_update_failed' &&
                        index ===
                          state?.EWayBillResponse?.transportation_details
                            ?.length -
                            1 ? (
                          <CreateEWayBillPartC
                            updateEWayBillParams={updateEWayBillParams}
                            showValue={value}
                            typeCheck="edit"
                          />
                        ) : (
                          <CreateEWayBillPartC
                            updateEWayBillParams={(val) => console.log(val)}
                            showValue={value}
                            typeCheck="view"
                          />
                        )}
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              )}

            {NewVehicle &&
              state?.EWayBillResponse?.status !== 'vehicle_update_failed' && (
                <Accordion
                  className={css.ewaybillaccordian}
                  expanded
                  sx={{ '&.Mui-expanded': { margin: '0 !important' } }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <p className={css.accordianheadertext}>Part B</p>
                  </AccordionSummary>
                  <AccordionDetails className={css.accordiandetails}>
                    <CreateEWayBillPartC
                      updateEWayBillParams={updateEWayBillParams}
                      typeCheck="create"
                    />{' '}
                  </AccordionDetails>
                </Accordion>
              )}
          </Stack>
          <Stack alignItems="center" marginTop="32px">
            {!NewVehicle &&
              (state?.EWayBillResponse?.status === 'approved' ||
                state?.EWayBillResponse?.status === 'vehicle_updated') && (
                <Stack
                  direction="row"
                  gap="4px"
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setNewVehicle(true);
                    setAccordionCheck({
                      partA: false,
                      partB: false,
                    });
                  }}
                  marginBottom="20px"
                  justifyContent="center"
                >
                  <AddIcon sx={{ color: '#f08b32', fontSize: '14px' }} />
                  <p className={css.addNew}>Add Vechicle</p>
                </Stack>
              )}
            {(state?.EWayBillResponse?.status === 'approval_failed' ||
              Object.keys(state?.EWayBillResponse || {})?.length === 0) && (
              <Button
                className={css.primaryButton}
                onClick={() => onSubmitEWayBill()}
              >
                Generate E-Way Bill
              </Button>
            )}

            {(state?.EWayBillResponse?.status === 'approved' ||
              state?.EWayBillResponse?.status === 'vehicle_update_failed' ||
              state?.EWayBillResponse?.status === 'vehicle_updated') &&
              NewVehicle && (
                <Button
                  className={css.primaryButton}
                  onClick={() => onUpdateEWayBill()}
                >
                  Update E-Way Bill
                </Button>
              )}
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

export default CreateEWayBill;
