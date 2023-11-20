import React, { useState } from 'react';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import ExpenseRequirementForm from './Components/ExpenseRequirementForm';
import MilageRequirementForm from './Components/MileageRequirementForm';
import TripRequirementForm from './Components/TripRequirementForm';

const Reimbursement = () => {
  const [drawer, setDrawer] = useState({
    expense: false,
    milage: false,
    trip: false,
  });

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };
  return (
    <>
      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.expense}
        onClose={() => handleDrawer('expense', false)}
      >
        <ExpenseRequirementForm type="new" />
      </SelectBottomSheet>
      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.milage}
        onClose={() => handleDrawer('milage', false)}
      >
        <MilageRequirementForm type="new" />
      </SelectBottomSheet>
      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.trip}
        onClose={() => handleDrawer('trip', false)}
      >
        <TripRequirementForm type="new" />
      </SelectBottomSheet>
    </>
  );
};

export default Reimbursement;
