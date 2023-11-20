/* @flow */
/**
 * @fileoverview  Fill in organizational Details
 */

import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { Button, makeStyles } from '@material-ui/core';
import * as Mui from '@mui/material';

import AppContext from '@root/AppContext';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import InputAdornment from '@mui/material/InputAdornment';
import { SearchIconModule, XCircle } from '@components/SvgIcons/SvgIcons.jsx';
import { TextField } from '@mui/material';

import sel from '../../assets/allcompsel.svg';

import * as css from './DashboardViewContainer.scss';
import OrganizationList from '../Notification/OrganizationList';
import BankingCategorizationHeader from '../Banking/CategorizationNew/MobileBankingHeader/BankingCategorizationHeader';

const useStyles = makeStyles({
  submitButton: {
    borderRadius: '18px',
    backgroundColor: 'var(--colorPrimaryButton)',
    margin: '15px 0',
    color: 'var(--colorWhite)',
    minWidth: '90px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: 'var(--colorPrimaryButton)',
    },
  },
  pageTitle: {
    fontSize: '24px !important',
    fontWeight: 'normal',
  },
});

const PageTitle = ({
  title,
  actionBtnLabel,
  onClick,
  onClickAction,
  bankingCategorizationData,
}) => {
  const classes = useStyles();
  const themes = Mui.useTheme();
  const device = localStorage.getItem('device_detect');
  const desktopView = Mui.useMediaQuery(themes.breakpoints.up('sm'));
  const [searchCompany, setSearchCompany] = useState(false);
  const { selectedOrg, globalSearch, setGlobalSearch } = useContext(AppContext);

  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`${css.pageTitleContainer} ${
          desktopView && css.pageTitleContainerDesktop
        }`}
      >
        {onClick && (
          <ArrowBackIosOutlinedIcon
            onClick={() => {
              if (pathname === '/search') {
                onClick();
                setGlobalSearch('');
              } else {
                onClick();
              }
            }}
            className={(!desktopView && css.icon) || css.icon2}
          />
        )}
        <div
          className={
            title === 'Dashboard'
              ? (desktopView && `${css.pageTitle2}`) ||
                `${css.pageTitle} ${classes.pageTitle}`
              : (desktopView && `${css.pageTitle3}`) ||
                `${css.pageTitle} ${classes.pageTitle}`
          }
          style={{
            flexDirection: pathname === '/notification' ? 'row' : 'column',
          }}
        >
          <Helmet>
            <title>{title}- Effortless</title>
          </Helmet>
          {device === 'desktop' && (
            <p className={css.pageTitleUnderLine}>{title}</p>
          )}
          {device === 'mobile' && pathname !== '/search' && title}

          {device === 'mobile' && pathname === '/search' && (
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIconModule />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {globalSearch && (
                      <XCircle
                        onClick={() => {
                          if (globalSearch) {
                            setGlobalSearch('');
                          } else {
                            onClick();
                          }
                        }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '100%',
                background: '#fff',
                borderRadius: '4px',
                '& .MuiInputBase-input': {
                  padding: '5px 0',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': {
                    border: 'none',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  },
                },
              }}
              focused={false}
              placeholder="Search Anything"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e?.target?.value)}
              autoFocus
            />
          )}

          {pathname === '/notification' && device === 'mobile' && (
            <Mui.IconButton
              sx={{ width: '28px', height: '28px' }}
              onClick={() => setSearchCompany(true)}
            >
              {selectedOrg === 'all' && <Mui.Avatar src={sel} />}
              {selectedOrg !== 'all' && (
                <>
                  {selectedOrg.logo ? (
                    <Mui.Avatar src={selectedOrg.log} />
                  ) : (
                    <Mui.Avatar>
                      {selectedOrg?.short_name?.charAt(0).toUpperCase()}
                    </Mui.Avatar>
                  )}
                </>
              )}
            </Mui.IconButton>
          )}
        </div>

        <div>
          {actionBtnLabel && (
            <Button
              variant="outlined"
              className={classes.submitButton}
              onClick={onClickAction}
              size="medium"
            >
              {actionBtnLabel}
            </Button>
          )}
        </div>

        <SelectBottomSheet
          triggerComponent
          open={searchCompany}
          name="Select Organization"
          onClose={() => setSearchCompany(false)}
          addNewSheet
        >
          <OrganizationList onClose={() => setSearchCompany(false)} />
        </SelectBottomSheet>
      </div>
      {device === 'mobile' && pathname === '/banking-categorization' && (
        <BankingCategorizationHeader HeaderData={bankingCategorizationData} />
      )}
    </>
  );
};

export default PageTitle;
