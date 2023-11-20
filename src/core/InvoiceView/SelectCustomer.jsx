import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetIndividualEntityState,
  ClearSateIndividualEntity,
} from '@action/Store/Reducers/General/GeneralState';
import { styled } from '@material-ui/core';
import * as Mui from '@mui/material';
import CustomerDetails from '@core/InvoiceView/Shared/CustomerDetails';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import CustomSearch from '@components/SearchSheet/CustomSearch.jsx';
import { InvoiceCustomer } from '@components/Invoice/EditForm.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import CreateCustomerDialogNew from '../../components/CreateNew/CustomerNew/CreateCustomerDialogNew';
import { step1 } from './InvoiceImages.js';
import * as css from './CreateInvoiceContainer.scss';

// const StyledDrawer = styled(Drawer)((props) => ({
//   '& .MuiPaper-root': {
//     minHeight: props.minHeight,
//     maxHeight: props.maxHeight,
//     height: props.height,
//     borderRadius: props.borderRadius,
//     width: props.width,
//     overflow: props.overflow,
//   },
// }));

const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const SelectCustomer = (props) => {
  const {
    customerListValue,
    allStates,
    allCountries,
    onCreateCustomer,
    errorMessage,
    setCustomerId,
    gstData,
    customerId,
    // empty,
    setCustName,
    // setItemList,
    // desktop,
    hideChange,
    callFunction,
    setCustomerLocationId,
    setEditCustomer,
    setInvoiceView,
    pagination,
    setPagination,
    customerCreation,
  } = props;
  const dispatch = useDispatch();
  const { individualEntityData, individualEntityChangeDataLoad } = useSelector(
    (value) => value.General,
  );
  const [selectedData, setSelectedData] = useState();
  const [drawer, setDrawer] = useState({
    search: false,
    addCustomer: false,
    edit: false,
  });
  // const [intialData, setIntialData] = useState(customerListValue);
  const [title, setTitle] = useState('');
  const [editValue, setEditValue] = useState({});
  const device = localStorage.getItem('device_detect');
  const [havePermission, setHavePermission] = React.useState({ open: false });

  const toggleView = (view) => {
    if (view === 'gstCheck') {
      setTitle('Add a New Customer - 1 of 2');
    } else if (view === 'addDetails') {
      setTitle('Add a New Customer - 2 of 2');
    }
  };

  useEffect(() => {
    toggleView('gstCheck');
  }, []);

  React.useEffect(() => {
    if (Object.keys(individualEntityData || {})?.length > 0) {
      setSelectedData(individualEntityData);
      setCustName(individualEntityData?.name);
      setTimeout(() => {
        dispatch(ClearSateIndividualEntity());
      }, 2000);
    }
  }, [JSON.stringify(individualEntityData)]);

  // useEffect(() => {
  //   setIntialData(customerListValue);
  // }, [customerListValue]);

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
    if (name === 'search') {
      callFunction();
    }
  };

  const handleClose = async () => {
    // setSelectedData([]);
    // setIntialData(customerListValue);
    // setCustomerId('');
    // setItemList([]);
    // empty();
    await onTriggerDrawer('search');
  };

  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  const onTriggerDrawerForEdit = (name, element) => {
    setEditValue(element);
    handleBottomSheet('search');
    if (device === 'desktop') {
      setDrawer((d) => ({ ...d, [name]: true }));
    }
    if (device === 'mobile') {
      setInvoiceView(false);
      setEditCustomer({ open: true, editValue: element });
    }
  };

  const handleGst = (element) => {
    if (element?.primary_relationship !== 'customer') {
      dispatch(
        GetIndividualEntityState({
          entityId: element?.id,
          entityType: element?.primary_relationship,
          createRelation: 'customer',
        }),
      );
    }
    setCustomerId(element.id);
    handleBottomSheet('search');
  };

  const handleWithLocation = (element, locationId) => {
    if (element?.primary_relationship !== 'customer') {
      dispatch(
        GetIndividualEntityState({
          entityId: element?.id,
          entityType: element?.primary_relationship,
          createRelation: 'customer',
        }),
      );
    }
    setCustomerLocationId(locationId);
    setCustomerId(element.id);
    handleBottomSheet('search');
  };
  const TriggerAddVendor = () => {
    if (!customerCreation) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    onTriggerDrawer('addCustomer');
    handleBottomSheet('search');
  };

  React.useEffect(() => {
    if (customerId && individualEntityChangeDataLoad === null) {
      dispatch(
        GetIndividualEntityState({
          entityId: customerId,
          entityType: 'customer',
        }),
      );
    }
  }, [customerId]);

  return (
    <section className={css.step1Section}>
      <div className={css.card}>
        <div className={css.row1}>
          <div className={css.step}>
            Step 01:
            <span className={css.stepLable}>Select Customer</span>
          </div>
        </div>

        {customerId ? (
          <div className={css.row2}>
            <CustomerDetails
              // customerData={intialData}
              selectedData={selectedData}
              handleGst={handleGst}
              handleClose={handleClose}
              allStates={allStates}
              allCountries={allCountries}
              onCreateCustomer={onCreateCustomer}
              errorMessage={errorMessage}
              title={title}
              toggleView={toggleView}
              gstData={gstData}
              hideChange={hideChange}
            />
          </div>
        ) : (
          <div className={css.row2}>
            <Mui.Tooltip title="Search Customer" placement="bottom-end">
              <div
                className={css.searchInput}
                style={{ cursor: 'pointer' }}
                onClick={() => onTriggerDrawer('search')}
              >
                <img
                  className={css.searchIcon}
                  src={step1.search}
                  alt="search"
                />
              </div>
            </Mui.Tooltip>

            <Mui.Tooltip title="Add Customer" placement="bottom-end">
              <div onClick={TriggerAddVendor} style={{ cursor: 'pointer' }}>
                <img src={step1.selectCustomer} alt="selectCustomer" />
              </div>
            </Mui.Tooltip>
          </div>
        )}
        <SelectBottomSheet
          id="overFlowHidden"
          name="addCustomer"
          triggerComponent={<></>}
          open={drawer?.addCustomer}
          // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addCustomer: true }));
          }}
          onClose={() => {
            handleBottomSheet('addCustomer');
            toggleView('gstCheck');
          }}
          addNewSheet
        >
          <CreateCustomerDialogNew
            addCusomerComplete={(cus_id) => {
              handleBottomSheet('addCustomer');
              onCreateCustomer(cus_id);
            }}
            handleBottomSheet={() => {
              handleBottomSheet('addCustomer');
            }}
          />
        </SelectBottomSheet>
        <SelectBottomSheet
          id="overFlowHidden"
          name="search"
          triggerComponent={<></>}
          open={drawer.search}
          onTrigger={onTriggerDrawer}
          onClose={() => {
            handleBottomSheet('search');
            setPagination({
              totalPage: 1,
              currentPage: 1,
            });
          }}
          maxHeight="45vh"
          addNewSheet
        >
          {/* {!addVendor ? ( */}
          <div style={{ height: 'auto' }}>
            <CustomSearch
              showType="Customer"
              customerList={customerListValue}
              callFunction={callFunction}
              handleLocationParties={handleWithLocation}
              handleAllParties={handleGst}
              addNewOne={TriggerAddVendor}
              openDrawer={onTriggerDrawerForEdit}
              pagination={pagination}
              setPagination={setPagination}
            />
          </div>
        </SelectBottomSheet>
        <SelectBottomSheet
          name="edit"
          triggerComponent={<div style={{ display: 'none' }} />}
          open={drawer.edit}
          onTrigger={onTriggerDrawer}
          onClose={handleBottomSheet}
          maxHeight="45vh"
        >
          <div style={{ padding: '15px' }}>
            {device === 'mobile' && <Puller />}
            <div style={{ padding: '5px 0' }}>
              <p className={css.valueHeader}>{editValue?.name}</p>
            </div>
            <InvoiceCustomer
              showValue={editValue}
              handleBottomSheet={handleBottomSheet}
              type="customers"
              openFrom="invoiceContainer"
            />
          </div>
        </SelectBottomSheet>
        {havePermission.open && (
          <PermissionDialog onClose={() => havePermission.back()} />
        )}
      </div>
    </section>
  );
};

export default SelectCustomer;
