import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetEInvoiceState,
  PostEInvoiceState,
  PatchEInvoiceState,
  DeleteEInvoiceState,
  ClearStateGetEInvoice,
} from '@action/Store/Reducers/Settings/EInvoiceSettingsState';
import {
  Box,
  Stack,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormGroup,
  FormControlLabel,
} from '@mui/material';

import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';

import { EInvoiceForm } from './EInvoiceForm';
import EInvoiceEdit from './EInvoiceEdit';

import * as css from '../EInvoiceSettingsMain.scss';

const EInvoiceData = [
  {
    id: 'e-invoice',
    headtext: 'E-Invoice',
    descriptiontext:
      'To connect Effortless with the Invoice Registration Portal (IRP), you need to generate a username and password by registering Masters India as your GST Suvidha Provider in the IRP.',
    accordion: true,
    key: 'is_active',
  },
  // {
  //   id: 'e-invoice_edit',
  //   headtext: 'Enable edits to pushed transactions?',
  //   descriptiontext:
  //     'Once you enable edits to transactions pushed to the Invoice Registration Portal (IRP), you can edit the following fields',
  //   accordion: true,
  //   key: 'is_editable',
  // },
  {
    id: 'e-invoice_automate',
    headtext: 'Automate E-Invoicing',
    descriptiontext:
      'Once you enable automate E-invoicing, All B2B invoices created will be sent to IRP while generating the invoice automatically.',
    accordion: false,
    key: 'is_automated',
  },
  {
    id: 'e-invoice_testing',
    headtext: 'E-Invoicing Testing',
    descriptiontext:
      'Enabling this option will allow you to test E-Invoicing in production, it will not affect your original E-Invoice.',
    accordion: false,
    key: 'testing_enabled',
  },
];

const EInvoice = () => {
  const device = localStorage.getItem('device_detect');
  const dispatch = useDispatch();
  const { EInvoiceState, EInvoiceUpdateDataLoad } = useSelector(
    (value) => value.EInvoiceSettings
  );
  const [invoiceCheckAction, setInvoiceCheckAction] = useState([]);

  const CheckboxFunction = (id_s, state) => {
    if (id_s === 'e-invoice' && state) {
      dispatch(PostEInvoiceState());
    } else if (id_s === 'e-invoice' && !state) {
      dispatch(DeleteEInvoiceState());
    } else {
      const tempKey = EInvoiceData?.find((val) => val?.id === id_s)?.key;
      dispatch(PatchEInvoiceState({ eInvoicePayload: { [tempKey]: state } }));
    }
  };

  const updateEInvoice = (param) => {
    dispatch(PatchEInvoiceState({ eInvoicePayload: param }));
  };

  useEffect(() => {
    dispatch(GetEInvoiceState());
    return () => {
      dispatch(ClearStateGetEInvoice());
    };
  }, []);

  useEffect(() => {
    if (EInvoiceUpdateDataLoad === 'updated') {
      dispatch(GetEInvoiceState());
    }
  }, [EInvoiceUpdateDataLoad]);

  useEffect(() => {
    if (Object.keys(EInvoiceState || {})?.length > 0) {
      setInvoiceCheckAction([
        { id: 'e-invoice', checked: EInvoiceState?.is_active },
        { id: 'e-invoice_edit', checked: EInvoiceState?.is_editable },
        { id: 'e-invoice_automate', checked: EInvoiceState?.is_automated },
        { id: 'e-invoice_testing', checked: EInvoiceState?.testing_enabled },
      ]);
    }
  }, [EInvoiceState]);

  return (
    <div
      className={css.einvoicemod}
      style={{ gap: device === 'mobile' ? 0 : '16px' }}
    >
      {EInvoiceData?.map((val) => (
        <Accordion
          className={
            device === 'mobile'
              ? `${css.einvoicecardmobile} ${css.einvoicecard}`
              : css.einvoicecard
          }
          expanded={
            !!invoiceCheckAction?.find((item) => item?.id === val?.id)
              ?.checked && val?.accordion
          }
          key={val?.id}
        >
          <AccordionSummary
            sx={{
              margin: 0,
              padding: device === 'desktop' ? '0 28px 0 16px' : 0,
              // '& .MuiAccordionSummary-content': {
              //   margin: '0 !important',
              // },
            }}
          >
            <Stack direction="column" gap="12px" width="100%">
              <Stack
                direction="row"
                alignItems={device === 'mobile' ? 'start' : 'center'}
                width="100%"
                justifyContent="space-between"
              >
                <Stack direction="column" gap="8px" width="85%">
                  <Stack direction="row" alignItems="center" gap="16px">
                    <p className={css.headtext}>{val?.headtext}</p>
                    {Object.values(EInvoiceState?.irp_credentials || {})
                      ?.length > 0 &&
                      !EInvoiceState?.is_authenticated &&
                      val?.id === 'e-invoice' &&
                      EInvoiceState?.is_active && (
                        <Box className={css.invalidcredentials}>
                          Invalid Credentials
                        </Box>
                      )}
                  </Stack>
                  {device === 'desktop' && (
                    <p className={css.descriptiontext}>
                      {val?.descriptiontext}
                    </p>
                  )}
                </Stack>
                <FormGroup style={{ alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <ToggleSwitch
                        checked={
                          !!invoiceCheckAction?.find(
                            (item) => item?.id === val?.id
                          )?.checked
                        }
                        onClick={(e) => {
                          e?.stopPropagation();
                        }}
                        onChange={(e) =>
                          CheckboxFunction(
                            val?.id,
                            e?.target?.checked,
                            val?.accordion
                          )
                        }
                      />
                    }
                    sx={{
                      margin: 0,

                      '&.Mui-disabled': {
                        cursor: 'not-allowed !important',
                      },
                    }}
                    disabled={
                      val?.id !== 'e-invoice' &&
                      !invoiceCheckAction?.find(
                        (item) => item?.id === 'e-invoice'
                      )?.checked
                    }
                  />
                </FormGroup>
              </Stack>
              {device === 'mobile' && (
                <div>
                  <p className={css.descriptiontext}>{val?.descriptiontext}</p>
                </div>
              )}
            </Stack>
          </AccordionSummary>

          <AccordionDetails
            style={{ borderTop: '1px solid #e5e5e5', padding: 16 }}
            onClick={(e) => {
              e?.stopPropagation();
            }}
            key={val?.id}
          >
            {val?.id === 'e-invoice' && (
              <EInvoiceForm
                formValues={{
                  einvoicedate: EInvoiceState?.effective_from,
                  username: EInvoiceState?.irp_credentials?.username || '',
                  password: EInvoiceState?.irp_credentials?.password || '',
                  clientid: EInvoiceState?.irp_credentials?.client_id || '',
                  clientsecret:
                    EInvoiceState?.irp_credentials?.client_secret || '',
                }}
                formType={
                  Object.keys(EInvoiceState?.irp_credentials || {})?.length > 0
                    ? 'edit'
                    : 'add'
                }
                updateEInvoice={(param) => updateEInvoice(param)}
                invoiceAction={invoiceCheckAction}
              />
            )}
            {val?.id === 'e-invoice_edit' && (
              <EInvoiceEdit
                showFields={EInvoiceState?.permitted_fields}
                editFields={EInvoiceState?.editable_fields}
                updateEInvoice={(param) => updateEInvoice(param)}
              />
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default EInvoice;
