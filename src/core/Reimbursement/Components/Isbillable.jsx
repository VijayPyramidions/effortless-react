import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetCustomerEntityState } from '@action/Store/Reducers/General/GeneralState';

import CreateCustomerDialogNew from '@components/CreateNew/CustomerNew/CreateCustomerDialogNew';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import CustomSearch from '@components/SearchSheet/CustomSearch.jsx';

const Isbillable = ({ localState, hanldeChange, ShowType }) => {
  const dispatch = useDispatch();
  const { customerEntity } = useSelector((value) => value.General);

  const [drawer, setDrawer] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const [pagination, setPagination] = useState({
    totalPage: 1,
    currentPage: 1,
  });

  const handleTriggerSheet = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const getCustomer = (a, searchVal, pageNum) => {
    dispatch(
      GetCustomerEntityState({
        allParties: false,
        pageNum: pageNum || 1,
        searchText: searchVal || '',
        location: false,
      })
    );
  };

  useEffect(() => {
    if (customerEntity?.data) {
      if (customerEntity?.page === 1) {
        setCustomerList(customerEntity?.data);
      } else {
        setCustomerList((prev) => [...prev, ...customerEntity?.data]);
      }
      setPagination({
        totalPage: customerEntity?.pages,
        currentPage: customerEntity?.page,
      });
    }
  }, [JSON.stringify(customerEntity || {})]);

  useEffect(() => {
    if (ShowType !== 'view') getCustomer();
  }, [ShowType]);

  return (
    <div style={{ pointerEvents: ShowType === 'view' && 'none' }}>
      <SelectBottomSheet
        name="Customer"
        // onBlur={reValidate}
        // error
        // helperText
        label="Select Client"
        open={drawer?.customerlist}
        value={localState?.client?.name}
        onTrigger={() => handleTriggerSheet('customerlist', true)}
        onClose={() => handleTriggerSheet('customerlist', false)}
        required
        id="overFlowHidden"
      >
        <CustomSearch
          showType="Customer"
          customerList={customerList}
          callFunction={getCustomer}
          handleLocationParties={(val) => {
            handleTriggerSheet('customerlist', false);
            hanldeChange(
              { target: { name: 'client', value: val } },
              { client_id: val?.id }
            );
          }}
          handleAllParties={(val) => {
            handleTriggerSheet('customerlist', false);
            hanldeChange(
              { target: { name: 'client', value: val } },
              { client_id: val?.id }
            );
          }}
          addNewOne={() => {
            handleTriggerSheet('customerlist', false);
            handleTriggerSheet('addcustomer', true);
          }}
          hideLocation
          hideToggle
          hideEdit
          pagination={pagination}
          setPagination={setPagination}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        name="addcustomer"
        open={drawer?.addcustomer}
        triggerComponent={<></>}
        onTrigger={() => handleTriggerSheet('addcustomer', true)}
        onClose={() => handleTriggerSheet('addcustomer', false)}
      >
        <CreateCustomerDialogNew
          addCusomerComplete={() => {
            getCustomer();
            handleTriggerSheet('addcustomer', false);
            handleTriggerSheet('customerlist', true);
          }}
          handleBottomSheet={() => handleTriggerSheet('addcustomer', false)}
          showCustomerAvail={() => {}}
        />
      </SelectBottomSheet>
    </div>
  );
};

export default Isbillable;
