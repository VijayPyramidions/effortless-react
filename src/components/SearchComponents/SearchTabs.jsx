import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { TabContext, TabPanel } from '@mui/lab';

import globalSearchNoData from '@assets/globalSearchNoData.svg';

import SearchTabPeople from './SearchTabPeople';
import SearchTabInvoice from './SearchTabInvoice';
import SearchTabBill from './SearchTabBill';
import SearchTabPayment from './SearchTabPayment';
import SearchTabAccount from './SearchTabAccount';

// import RestApi, { METHOD } from '@services/RestApi';
// import AppContext from '@root/AppContext';

import * as css from './searchComponents.scss';

const useStyles = makeStyles({
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#F08B32',
      height: 2,
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#F08B32',
      fontWeight: 400,
      fontSize: '16px',
    },
  },
  tabPanel: {
    padding: '0px !important',
    overflow: 'auto',
  },
});

const SearchTabs = (props) => {
  const { Data, TabClose, CreateRecentSearch, FetchContactsId } = props;
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const [value, setValue] = useState('entity');

  const handleChange = (e, newValue) => {
    e.stopPropagation();

    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {Object?.keys(Data || {})?.length > 0 && (
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              paddingTop: device === 'mobile' ? '12px' : 0,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              className={`${classes.tabs} ${css.tablist}`}
            >
              {['entity', 'invoice', 'bill']?.map((val) => (
                <Tab
                  label={
                    <>
                      {val === 'entity' ? 'People' : val}
                      <span
                        className={
                          value === val
                            ? css.searchtabactive
                            : css.searchtabcount
                        }
                      >
                        {Data?.[val]?.count || 0}
                      </span>
                    </>
                  }
                  value={val}
                  className={css.tabButtons}
                />
              ))}
            </Tabs>
          </Box>
          {['entity', 'invoice', 'bill']?.map((val) => (
            <TabPanel
              value={val}
              className={classes.tabPanel}
              sx={{
                height: device === 'mobile' ? 'calc(100% - 60px)' : '375px',
                marginBottom: '10px',
              }}
              id={val}
            >
              <SearchTabDetails
                type={val}
                typeData={Data?.[val]}
                TabClose={TabClose}
                CreateRecentSearch={CreateRecentSearch}
                FetchContactsId={FetchContactsId}
              />
            </TabPanel>
          ))}
        </TabContext>
      )}
      {Object?.keys(Data || {})?.length === 0 && <NoData />}
    </Box>
  );
};

export default SearchTabs;

const SearchTabDetails = ({
  type,
  typeData,
  TabClose,
  CreateRecentSearch,
  FetchContactsId,
}) => {
  return (
    <>
      {Object.keys(typeData || {})?.length === 0 && <NoData />}
      {Object.keys(typeData || {})?.length > 0 && type === 'entity' && (
        <SearchTabPeople
          Data={typeData}
          TabClose={TabClose}
          CreateRecentSearch={CreateRecentSearch}
          FetchContactsId={FetchContactsId}
        />
      )}
      {Object.keys(typeData || {})?.length > 0 && type === 'invoice' && (
        <SearchTabInvoice Data={typeData} TabClose={TabClose} />
      )}
      {Object.keys(typeData || {})?.length > 0 && type === 'payments' && (
        <SearchTabPayment Data={typeData} TabClose={TabClose} />
      )}
      {Object.keys(typeData || {})?.length > 0 && type === 'bill' && (
        <SearchTabBill Data={typeData} TabClose={TabClose} />
      )}
      {Object.keys(typeData || {})?.length > 0 && type === 'Account' && (
        <SearchTabAccount Data={typeData} TabClose={TabClose} />
      )}
    </>
  );
};

const NoData = () => {
  return (
    <div className={css.searchNoData}>
      <img src={globalSearchNoData} alt="noData" />
      <p className={css.noDataText}>No Results Found</p>
    </div>
  );
};
