/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import AppContext from '@root/AppContext.jsx';
import { Button } from '@mui/material';
import * as Mui from '@material-ui/core';
import MagicLink from './MagicLink.jsx';
import AddVendorManual from '../CreateNew/VendorNew/AddVendorManual.jsx';
import * as css from './VendorList.scss';
import SuccessView from '../SuccessView/SuccessView.jsx';

const VendorList = (props) => {
  const {
    vendorList,
    onClick,
    onDoNotTrackVendor,
    disableAdd,
    selected: selectedIds = [],
    continueFlow,
    updateVendorList,
    hideDoNotTrack,
    dntCheckbox,
    trigger,
    details,
    panEnable,
    // handleBottomSheet
    // setDntCheckbox
  } = props;
  const [pageView, setPageView] = useState(trigger || 'list'); // list, magicLink, addManually, successView
  // const { openSnackBar, changeSubView } = useContext(AppContext);
  const [selected, setSelected] = useState(dntCheckbox);
  const [query, setQuery] = useState('');
  // const [selected, setSelected] = useState(selectedProp || []);
  // function onClick(v) {
  //   if (multiple) return;
  //   onClickProp(v);
  // }
  // useEffect(() => {
  //   setSelected(selectedProp);
  // }, [selectedProp]);

  const showList = () => {
    updateVendorList();
    setPageView('list');
  };

  const addNewVendor = () => {
    console.log(
      '🚀 ~ file: VendorList.jsx ~ line 26 ~ addNewVendor ~ addNewVendor',
      addNewVendor,
    );
    setPageView('addManually');
  };

  const addManually = () => {
    setPageView('addManually');
  };

  const addVendorComplete = (status, resData) => {
    // status - 'success' or 'exists'

    if (status === 'success') {
      // openSnackBar({
      //   message: 'Vendor Added Successfully',
      //   type: 'info',
      // });
      updateVendorList();
      onClick(resData);
    }
    if (status === 'exists') {
      onClick(resData);
      showList();
    }
  };

  const magicLinkComplete = () => {
    continueFlow();
  };

  const continueBillBooking = () => {
    showList();
  };

  const handleChange = () => {
    setSelected(!selected);
    onDoNotTrackVendor(!selected);
  };
  const device = localStorage.getItem('device_detect');
  return (
    (pageView === 'list' && (
      <div
        className={`${css.vendorListContainer} ${css.mainVendorComponent}`}
        style={{ maxHeight: device === 'mobile' ? '80vh' : '100vh' }}
      >
        {hideDoNotTrack ? null : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: 'rgba(240, 139, 50, 0.5)',
              borderRadius: '5px',
              padding: '5px',
              margin: '5px 20px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Mui.Checkbox
              checked={selected}
              style={{ color: '#FFFFFF' }}
              onClick={handleChange}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: '#000000',
                  fontSize: '14px',
                  lineHeight: '18px',
                  marginBlock: '7px',
                }}
              >
                “Do Not Track” Vendor for this Transaction
              </div>
              <div
                style={{
                  color: '#000000',
                  fontSize: '11px',
                  lineHeight: '14px',
                  fontWeight: '300',
                }}
              >
                Only use this option for small expenses (under Rs. 5,000 a year)
                and vendors who do not give you GST credit by mentioning your
                GSTIN in their invoices
              </div>
            </div>
          </div>
        )}
        <div className={css.searchFilter}>
          <SearchIcon className={css.searchFilterIcon} />
          <input
            placeholder="Search Vendor"
            onChange={(event) => setQuery(event.target.value)}
            className={css.searchFilterInputBig}
          />
        </div>
        <div
          className={css.vendorList}
          style={{
            minHeight: device === 'desktop' ? '450px' : 'auto',
            overflow: device === 'desktop' ? '' : 'auto',
            maxHeight: device === 'desktop' ? '' : '50vh',
          }}
        >
          {vendorList &&
            vendorList
              .filter((post) => {
                if (query === '') {
                  return post;
                }
                if (post.name.toLowerCase().includes(query.toLowerCase())) {
                  return post;
                }
                return false;
              })
              .map((v) => (
                <div
                  className={`${css.vendorOptions} ${
                    selectedIds?.includes(v.id) ? css.selected : ''
                  }`}
                  onClick={() => !selected && onClick(v)}
                  key={v.id}
                  role="menuitem"
                >
                  <Button className={css.BtnvalueText}>
                    {(v?.name).toLowerCase()}
                  </Button>
                  {selectedIds?.includes(v.id) ? (
                    <CheckCircleIcon className={css.selectedIcon} />
                  ) : (
                    ''
                  )}
                </div>
              ))}
        </div>
        {!disableAdd && (
          <div
            className={`${css.vendorOptions} ${css.addVendorBtn}`}
            onClick={addNewVendor}
            role="button"
            style={{ margin: '0 20px', height: '5vh !important' }}
          >
            + Add new Vendor
          </div>
        )}
      </div>
    )) ||
    (pageView === 'magicLink' && (
      <MagicLink
        addManually={addManually}
        magicLinkComplete={magicLinkComplete}
      />
    )) ||
    (pageView === 'addManually' && (
      <AddVendorManual
        addVendorComplete={addVendorComplete}
        onCancel={magicLinkComplete}
        details={details}
        panEnable={panEnable}
      />
    )) ||
    (pageView === 'successView' && (
      <SuccessView
        description={`Magic link has been sent to your Customer
      Please await their input.`}
        onClick={continueBillBooking}
        btnTitle="Continue"
        btnStyle="outlined"
        hideDashboardBtn
      />
    ))
  );
};

export default VendorList;
