import React, { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Stack, Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import SyncDashborad from './SyncDashboard';
import SyncConfigure from './SyncConfigure';
import SyncHistory from './SyncHistory';
import SyncMapping from './SyncMapping';

import * as css from './tallyreversesync.scss';

const TallyReverseSync = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(location?.state?.tab || 'Dashboard');

  const handleChange = (event, newValue) => setTabValue(newValue);

  return (
    <Stack className={css.synccontainer}>
      <TabContext value={tabValue}>
        <Box className={css.tabwrp}>
          <TabList
            onChange={handleChange}
            className={css.tablist}
            sx={{
              '& .MuiTabs-indicator': {
                background: ' #F08B32',
                height: '1.5px',
              },
            }}
          >
            <Tab
              label="Dashboard"
              value="Dashboard"
              className={
                tabValue === 'Dashboard'
                  ? `${css.tabs} ${css.active}`
                  : css.tabs
              }
            />
            <Tab
              label="Configure"
              value="Configure"
              className={
                tabValue === 'Configure'
                  ? `${css.tabs} ${css.active}`
                  : css.tabs
              }
            />
            <Tab
              label="History"
              value="History"
              className={
                tabValue === 'History' ? `${css.tabs} ${css.active}` : css.tabs
              }
            />
            <Tab
              label="Mapping"
              value="Mapping"
              className={
                tabValue === 'Mapping' ? `${css.tabs} ${css.active}` : css.tabs
              }
            />
          </TabList>
        </Box>
        <TabPanel value="Dashboard" className={css.tabpanel}>
          <SyncDashborad />
        </TabPanel>
        <TabPanel value="Configure" className={css.tabpanel}>
          <SyncConfigure />
        </TabPanel>
        <TabPanel value="History" className={css.tabpanel}>
          <SyncHistory />
        </TabPanel>
        <TabPanel value="Mapping" className={css.tabpanel}>
          <SyncMapping />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default memo(TallyReverseSync);
