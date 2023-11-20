import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { TabContext, TabPanel } from '@mui/lab';

import EInvoice from './EInvoice/EInvoice';
import EWayBill from './EWayBill/EWayBill';

import * as css from './EInvoiceSettingsMain.scss';

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
  tabPanel: {
    overflow: 'auto',
    background: '#fff',
    borderRadius: '8px',
    padding: '20px 24px !important',
  },
  tabPanelmobile: {
    overflow: 'auto',
    background: '#fff',
    borderRadius: '8px',
    padding: '0px !important',
  },
});

const EInvoiceSettings = () => {
  const classes = useStyles();

  const device = localStorage.getItem('device_detect');
  const [value, setValue] = useState('e-invoice');

  const handleChange = (e, newValue) => {
    e.stopPropagation();

    setValue(newValue);
  };
  return (
    <div className={css.einvoicesettings}>
      <TabContext value={value}>
        <Box
          style={{
            borderBottom: 1,
            borderColor: (device === 'mobile' && 'divider') || '#fff',
            background: '#fff',
            borderRadius: '8px 8px 0 0',
            height: '100%',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            className={`${classes.tabs}`}
          >
            {['e-invoice', 'e-way bill']?.map((val) => (
              <Tab label={val} value={val} className={css.tabButtons} />
            ))}
          </Tabs>
          {['e-invoice', 'e-way bill']?.map((val) => (
            <TabPanel
              value={val}
              className={
                device === 'mobile' ? classes.tabPanelmobile : classes.tabPanel
              }
              id={val}
              style={{
                maxHeight: 'calc(100vh - 200px)',
              }}
            >
              {val === 'e-invoice' && <EInvoice />}
              {val === 'e-way bill' && <EWayBill />}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </div>
  );
};

export default EInvoiceSettings;
