import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import {
//   // enableLoading,
//   openSnackbar,
// } from '@action/Store/Reducers/Errors/Errors';
import {
  setDrawer,
  clearReimbursementPerformanceAction,
  setTripViewState,
  getManagers,
  // setTripSave,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

// import { Box } from '@mui/material';
// import { styled } from '@material-ui/core/styles';
// import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import AddTrip from './AddTrip';
import TripContView from './TripContView';
import TripDetailsView from './TripDetailsView';
import ExpenseRequirementForm from './ExpenseRequirementForm';
import { RequestTripAdvanceForm } from './TripAdvanceForm';
// import { RequestAdvance } from './ReimbursementActionSheets';
import MileageRequirementForm from './MileageRequirementForm';

// const Puller = styled(Box)(() => ({
//   width: '50px',
//   height: 6,
//   backgroundColor: '#C4C4C4',
//   borderRadius: 3,
//   position: 'absolute',
//   top: 8,
//   left: 'calc(50% - 15px)',
// }));

const TripRequirementForm = ({ type, setValue, selectedtripDetail, sheet }) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { tripExpenseRes, tripPerformActions } = useSelector(
    (value) => value.Reimbursement
  );

  const [TripSheet, setTripSheet] = useState(sheet || 'main');
  const [addTripView, setAddTripView] = useState(type);
  const [selectedTip, setSelectedTip] = useState(selectedtripDetail || {});

  // const [tripName, setTripName] = useState('');

  useEffect(() => {
    if (
      device === 'desktop' &&
      window.location.pathname === '/reimbursement-trip'
    ) {
      navigate('/reimbursement');
    }
  }, []);

  useEffect(() => {
    if (
      device === 'desktop' &&
      window.location.pathname === '/reimbursement-trip'
    ) {
      navigate('/reimbursement');
    }
    dispatch(getManagers());
  }, []);

  useEffect(() => {
    if (tripExpenseRes === 'expenseadded') {
      setTripSheet('trip_view');
    }
  }, [tripExpenseRes]);

  useEffect(() => {
    if (
      tripPerformActions === 'trip_added_successfully' ||
      tripPerformActions === 'trip_updated_successfully'
    ) {
      setTripSheet('main');
      dispatch(setDrawer({ name: 'confirmRequestAdvance', value: true }));
      setSelectedTip({});
    }
    return () => {
      dispatch(clearReimbursementPerformanceAction());
    };
  }, [tripPerformActions]);

  return (
    <>
      {TripSheet === 'main' && (
        <TripContView
          setTripSheet={setTripSheet}
          editTripDetail={(val) => {
            setSelectedTip(val);
            setTripSheet('add');
            setAddTripView('update');
          }}
          addTripDetails={() => {
            setSelectedTip('');
            setTripSheet('add');
            setAddTripView('new');
          }}
          handleCardClick={(val) => {
            setTripSheet('trip_view');
            setSelectedTip(val);
            dispatch(
              setTripViewState(
                val?.status === 'submitted' ? 'view_trip' : 'edit_view'
              )
            );
          }}
          setValue={setValue}
        />
      )}

      {TripSheet === 'add' && (
        <AddTrip
          type={addTripView}
          setTripSheet={setTripSheet}
          setValue={setValue}
          selectedTip={selectedTip}
        />
      )}

      {TripSheet === 'request_advance' && (
        <RequestTripAdvanceForm type={type} setTripSheet={setTripSheet} />
      )}

      {TripSheet === 'trip_view' && (
        <TripDetailsView
          selectedTip={selectedTip}
          setTripSheet={setTripSheet}
          setValue={setValue}
          from={sheet}
        />
      )}

      {TripSheet === 'trip_expense' && (
        <ExpenseRequirementForm
          action="new"
          id={selectedTip.id}
          selectedTip={selectedTip}
          setTripSheet={(e) => setTripSheet(e)}
          from="trip"
          setValue={setValue}
        />
      )}

      {TripSheet === 'mileage' && (
        <MileageRequirementForm
          action="new"
          id={selectedTip.id}
          selectedTrip={selectedTip}
          setTripSheet={setTripSheet}
          from="trip"
          setValue={setValue}
        />
      )}

      {/* <Dialog
        open={drawer?.confirmRequestAdvance && device === 'desktop'}
        PaperProps={{ style: { width: '416px', borderRadius: '16px' } }}
        onClose={() =>
          dispatch(setDrawer({ name: 'confirmRequestAdvance', value: false }))
        }
      >
        <RequestAdvance
          handleNo={() => {
            dispatch(
              setDrawer({ name: 'confirmRequestAdvance', value: false })
            );
            setTripSheet('trip_view');
            const oneTripDtail = tripDetails?.filter(
              (item) => item?.id === tripSave?.id
            );
            if (oneTripDtail.length > 0) {
              setSelectedTip({ ...oneTripDtail[0] });
              dispatch(setTripSave(null));
            } else
              dispatch(
                openSnackbar({
                  type: 'error',
                  message: 'Trip detail not found',
                })
              );
          }}
          tripName={tripName}
          handleYes={() => {
            dispatch(
              setDrawer({ name: 'confirmRequestAdvance', value: false })
            );
            dispatch(setDrawer({ name: 'requestAdvance', value: true }));
          }}
        />
      </Dialog> */}
      {/* <SelectBottomSheet
        open={drawer?.confirmRequestAdvance && device === 'mobile'}
        triggerComponent={<></>}
        onClose={() =>
          dispatch(setDrawer({ name: 'confirmRequestAdvance', value: false }))
        }
      >
        <Puller />
        <RequestAdvance
          handleNo={() => {
            dispatch(
              setDrawer({ name: 'confirmRequestAdvance', value: false })
            );
            setTripName('');

            const oneTripDtail = tripDetails?.filter(
              (item) => item?.id === tripSave?.id
            );
            if (oneTripDtail.length > 0) {
              navigate('/reimbursement-trip-claim', {
                state: { selectedTrip: { ...oneTripDtail[0] } },
              });
              dispatch(setTripSave(null));
            } else
              dispatch(
                openSnackbar({
                  type: 'error',
                  message: 'Trip detail not found',
                })
              );
          }}
          tripName={tripName}
          handleYes={() => {
            dispatch(
              setDrawer({ name: 'confirmRequestAdvance', value: false })
            );
            navigate('/reimbursement-trip-advance-request', {
              state: { action: 'new', tab: 'advance', data: {} },
            });
            setTripName('');
          }}
        />
      </SelectBottomSheet> */}
    </>
  );
};

export default TripRequirementForm;
