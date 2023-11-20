import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ClearStateInvoiceToBeGenerated,
  ClearStateInvoiceGeneratedEWayBills,
} from '@action/Store/Reducers/Invoice/InvoiceEWayBillState';

import { Box, Button, Tab, Tabs } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { TabContext, TabPanel } from '@mui/lab';

import ToBeGenerated from './ToBeGenerated';
import GeneratedEWayBill from './GeneratedEWayBill';
import UnassociatedEWayBill from './UnassociatedEWayBill';

import * as css from './EWayBillStyle.scss';

const useStyles = makeStyles({
  tabs: {
    borderBottom: '1px solid #E5E5E5',
    '& .MuiTabs-indicator': {
      backgroundColor: '#F08B32',
      height: 2,
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#F08B32',
      fontWeight: 500,
      fontSize: '14px',
    },
  },
  tabPanelmobile: {
    overflow: 'auto',
    background: '#fff',
    borderRadius: '8px',
    padding: '0px !important',
  },
});

const EWayBillInvoice = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { InvoiceToBeGeneratedState, InvoiceGeneratedEWayBillsState } =
    useSelector((value) => value.InvoiceEWayBill);
  const { EWayBillStateAppSidePanel } = useSelector(
    (value) => value.EWayBillSettings
  );
  const { state } = useLocation();
  const device = localStorage.getItem('device_detect');
  const EWayButton = [
    { name: 'To Be Generated', id: 'to_be_generated' },
    { name: 'Generated E-Way Bills', id: 'generated_e_way_bill' },
    // { name: 'Unassociate E-Way Bills', id: 'unassociate_e_way_bill' },
  ];
  const [ShowButton, setShowButton] = useState(
    state?.fromPdf || 'to_be_generated'
  );

  const handleChange = (e, newValue) => {
    e.stopPropagation();

    setShowButton(newValue);
  };

  useEffect(() => {
    if (!EWayBillStateAppSidePanel?.active) {
      navigate('/invoice');
    }
  }, [EWayBillStateAppSidePanel?.active]);

  useEffect(() => {
    if (
      Object?.keys(InvoiceToBeGeneratedState || {})?.length > 0 &&
      ShowButton !== 'to_be_generated'
    ) {
      dispatch(ClearStateInvoiceToBeGenerated());
    } else if (
      Object?.keys(InvoiceGeneratedEWayBillsState || {})?.length > 0 &&
      ShowButton !== 'generated_e_way_bill'
    ) {
      dispatch(ClearStateInvoiceGeneratedEWayBills());
    }
  }, [
    JSON.stringify(InvoiceToBeGeneratedState),
    JSON.stringify(InvoiceGeneratedEWayBillsState),
    ShowButton,
  ]);

  return device === 'desktop' ? (
    <div className={css.ewaybilldesktop}>
      <Box className={css.topbox}>
        {EWayButton?.map((data) => (
          <Button
            className={
              ShowButton === data?.id
                ? `${css.topbutton} ${css.selected}`
                : `${css.topbutton}`
            }
            onClick={() => setShowButton(data?.id)}
          >
            {data?.name}
          </Button>
        ))}
      </Box>

      {ShowButton === 'to_be_generated' && <ToBeGenerated />}
      {ShowButton === 'generated_e_way_bill' && <GeneratedEWayBill />}
      {ShowButton === 'unassociate_e_way_bill' && <UnassociatedEWayBill />}
    </div>
  ) : (
    <div className={css.ewaybillmobile}>
      <Box padding="20px">
        <p className={css.headertext}>
          {EWayButton?.find((val) => val?.id === ShowButton)?.name}
        </p>
      </Box>
      <TabContext value={ShowButton}>
        <Box
          style={{
            borderBottom: 1,
            borderColor: 'divider',
            borderRadius: '8px 8px 0 0',
            height: 'calc(100% - 62px)',
          }}
        >
          <Tabs
            value={ShowButton}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            className={`${classes.tabs}`}
          >
            {EWayButton?.map((val) => (
              <Tab
                label={val?.name}
                value={val?.id}
                className={css.tabButtons}
              />
            ))}
          </Tabs>
          {EWayButton?.map((val) => (
            <TabPanel
              value={val?.id}
              className={classes.tabPanelmobile}
              id={val?.id}
              // style={{
              //   maxHeight: 'calc(100% - 120px)',
              // }}
            >
              {ShowButton === 'to_be_generated' && <ToBeGenerated />}
              {ShowButton === 'generated_e_way_bill' && <GeneratedEWayBill />}
              {ShowButton === 'unassociate_e_way_bill' && (
                <UnassociatedEWayBill />
              )}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </div>
  );
};

export default EWayBillInvoice;

export const data = [
  {
    id: '953ab65c-4b7c-4149-9dd2-dd672aff2bcc',
    created_at: '2023-07-28T16:19:22.593Z',
    updated_at: '2023-07-28T16:19:46.634Z',
    invoice_number: 'Invoice-05807',
    invoice_date: '2023-07-28',
    generator_id: 'a2b6f9e6-dc22-4cc3-b63d-a00607fc0755',
    generator_name: 'Harish ',
    approved: false,
    delivered: false,
    invoice_value: '2000.0',
    customer_id: 'c55fbc21-0c82-44c8-b448-feca34a5b3d9',
    customer_agreement_id: null,
    customer_name: 'Agrya',
    document_type: 'tax_invoice',
    sales_person_id: '5db16058-fe8e-4a02-a355-c08a621196bc',
    currency: {
      name: 'Indian Rupee',
      locale: 'en-US',
      iso_code: 'INR',
      symbol: '&#x20B9;',
      rounding: 1,
      subunit: 'Paisa',
      readable_symbol: '₹',
      comma_style: 0,
    },
  },
  {
    id: '1cb88154-8c5b-4883-896f-787d438824b0',
    created_at: '2023-07-28T16:18:08.212Z',
    updated_at: '2023-07-28T16:18:29.667Z',
    invoice_number: 'Invoice-05806',
    invoice_date: '2023-07-28',
    generator_id: 'a2b6f9e6-dc22-4cc3-b63d-a00607fc0755',
    generator_name: 'Harish ',
    approved: false,
    delivered: false,
    invoice_value: '2000.0',
    customer_id: '388a98bc-5b05-48d5-8100-7246e1f9e7f4',
    customer_agreement_id: null,
    customer_name: 'Abiram',
    document_type: 'tax_invoice',
    sales_person_id: '5404c073-1424-4494-8be7-b5ab361be8ae',
    currency: {
      name: 'Indian Rupee',
      locale: 'en-US',
      iso_code: 'INR',
      symbol: '&#x20B9;',
      rounding: 1,
      subunit: 'Paisa',
      readable_symbol: '₹',
      comma_style: 0,
    },
  },
  {
    id: '0b450cc4-bd33-44ab-ae48-06bd8c6efc96',
    created_at: '2023-07-28T16:22:31.351Z',
    updated_at: '2023-07-28T16:23:20.094Z',
    invoice_number: 'Invoice-05809',
    invoice_date: '2023-07-28',
    generator_id: 'a2b6f9e6-dc22-4cc3-b63d-a00607fc0755',
    generator_name: 'Harish ',
    approved: false,
    delivered: false,
    invoice_value: '2000.0',
    customer_id: 'acbdd75b-9563-48f0-ac2b-7bbad9c8f343',
    customer_agreement_id: null,
    customer_name: '2.M/S INDIAN OIL CORPORATION LTD.',
    document_type: 'tax_invoice',
    sales_person_id: '9e87b052-9317-4486-95bb-9d53dea0b58c',
    currency: {
      name: 'Indian Rupee',
      locale: 'en-US',
      iso_code: 'INR',
      symbol: '&#x20B9;',
      rounding: 1,
      subunit: 'Paisa',
      readable_symbol: '₹',
      comma_style: 0,
    },
  },
  {
    id: '563cfd2e-0285-4415-a606-3862dc4822e8',
    created_at: '2023-07-28T16:09:06.616Z',
    updated_at: '2023-07-28T16:09:28.340Z',
    invoice_number: 'Invoice-05803',
    invoice_date: '2023-07-28',
    generator_id: 'a2b6f9e6-dc22-4cc3-b63d-a00607fc0755',
    generator_name: 'Harish ',
    approved: false,
    delivered: false,
    invoice_value: '2000.0',
    customer_id: 'acbdd75b-9563-48f0-ac2b-7bbad9c8f343',
    customer_agreement_id: null,
    customer_name: '2.M/S INDIAN OIL CORPORATION LTD.',
    document_type: 'tax_invoice',
    sales_person_id: '9e87b052-9317-4486-95bb-9d53dea0b58c',
    currency: {
      name: 'Indian Rupee',
      locale: 'en-US',
      iso_code: 'INR',
      symbol: '&#x20B9;',
      rounding: 1,
      subunit: 'Paisa',
      readable_symbol: '₹',
      comma_style: 0,
    },
  },
  {
    id: '1e93c60f-f66b-4bc8-9761-99cdd2562906',
    created_at: '2023-06-26T03:30:06.697Z',
    updated_at: '2023-06-26T03:30:07.867Z',
    invoice_number: 'Invoice-05589',
    invoice_date: '2023-06-26',
    generator_id: '760326e4-ba65-496a-aa67-60f6840444ba',
    generator_name: 'siva bala 1',
    approved: false,
    delivered: false,
    invoice_value: '8000.0',
    customer_id: '2ad8f15e-0d35-499d-abc3-004be0a2d3d9',
    customer_agreement_id: '543c52e6-f7da-4012-afb7-b01074122f1d',
    customer_name: '1.M/S INDIAN OIL CORPORATION LIMITED',
    document_type: 'tax_invoice',
    sales_person_id: null,
    currency: {
      name: 'Indian Rupee',
      locale: 'en-US',
      iso_code: 'INR',
      symbol: '&#x20B9;',
      rounding: 1,
      subunit: 'Paisa',
      readable_symbol: '₹',
      comma_style: 0,
    },
  },
  {
    id: 'd60b1d0c-8f59-45cc-a692-efe72cd3992e',
    created_at: '2023-07-26T03:30:11.337Z',
    updated_at: '2023-07-26T03:30:13.408Z',
    invoice_number: 'Invoice-05666',
    invoice_date: '2023-07-26',
    generator_id: '760326e4-ba65-496a-aa67-60f6840444ba',
    generator_name: 'siva bala 1',
    approved: false,
    delivered: false,
    invoice_value: '8000.0',
    customer_id: '2ad8f15e-0d35-499d-abc3-004be0a2d3d9',
    customer_agreement_id: '543c52e6-f7da-4012-afb7-b01074122f1d',
    customer_name: '1.M/S INDIAN OIL CORPORATION LIMITED',
    document_type: 'tax_invoice',
    sales_person_id: null,
    currency: {
      name: 'Indian Rupee',
      locale: 'en-US',
      iso_code: 'INR',
      symbol: '&#x20B9;',
      rounding: 1,
      subunit: 'Paisa',
      readable_symbol: '₹',
      comma_style: 0,
    },
  },
];
