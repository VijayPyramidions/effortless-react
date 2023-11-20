import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ClearStateReceivablesRemainder } from '@action/Store/Reducers/Settings/ReceivablesSettingsState';
import { Box, Tab, Tabs } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { TabContext, TabPanel } from '@mui/lab';
import Campaign from './Campaign';
import * as css from './receivablesSettings.scss';

const useStyles = makeStyles({
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#F08B32',
      height: 2,
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#F08B32',
      fontWeight: 500,
      fontSize: '16px',
    },
  },
  tabPanel: {
    overflow: 'auto',
    background: '#fff',
    height: 'calc(100vh - 255px)',
    borderRadius: '8px',
  },
});

const ReceivablesSettings = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const device = localStorage.getItem('device_detect');
  const [value, setValue] = useState('campaigns');

  const handleChange = (e, newValue) => {
    e.stopPropagation();

    setValue(newValue);
  };

  useEffect(() => {
    dispatch(ClearStateReceivablesRemainder());
  }, []);

  return (
    <div className={css.receivablessettings}>
      <TabContext value={value}>
        <Box
          style={{
            borderBottom: 1,
            borderColor: (device === 'mobile' && 'divider') || '#fff',
            background: '#fff',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            className={`${classes.tabs} ${css.tablist}`}
          >
            {['campaigns']?.map((val) => (
              <Tab label={val} value={val} className={css.tabButtons} />
            ))}
          </Tabs>
        </Box>
        {['campaigns']?.map((val) => (
          <TabPanel
            value={val}
            className={classes.tabPanel}
            id={val}
            style={{ marginTop: device === 'mobile' ? 0 : '16px', height: device === 'mobile' ? '100%' : 'unset'}}
          >
            <Campaign />
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
};

export default ReceivablesSettings;
