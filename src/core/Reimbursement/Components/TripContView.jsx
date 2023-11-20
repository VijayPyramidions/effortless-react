import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import {
  Stack,
  Button,
  Box,
  IconButton,
  Popover,
  Typography,
  Dialog,
} from '@mui/material';
import { styled } from '@material-ui/core/styles';
import {
  getAllTrips,
  setDrawer,
  clearReimbursementPerformanceAction,
  setTripViewState,
  deleteTrip,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';
import // enableLoading,
//   openSnackbar,
'@action/Store/Reducers/Errors/Errors';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import edit_settings from '@assets/edit_settings.svg';
import trash from '@assets/trash.svg';

import {
  Add as AddIcon,
  MoreVertRounded as MoreVertRoundedIcon,
} from '@mui/icons-material';

import { StatusComponents } from '../Reimbursement';
// import { TRIP_TYPE } from './Utils';
import AddTrip from './AddTrip';
import * as css from '../ReimbursementContainer.scss';
import { IndianCurrency } from '../../../components/utils';
import { DeleteContent } from './ReimbursementActionSheets';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const TripContView = ({
  setTripSheet,
  handleCardClick,
  editTripDetail,
  addTripDetails,
}) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allTripDetails, drawer, tripPerformActions } = useSelector(
    (value) => value.Reimbursement
  );

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deleteTripEl, setDeleteTripEl] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(getAllTrips({ type: 'outstanding_and_settlement' }));
  }, []);

  useEffect(() => {
    if (tripPerformActions === 'trip_added_successfully')
      dispatch(setDrawer({ name: 'addTrip', value: false }));
    return () => {
      dispatch(clearReimbursementPerformanceAction());
    };
  }, [tripPerformActions]);

  return (
    <div className={css.reimursementsheet}>
      {device === 'desktop' && <p className={css.headertext}>Your Trip</p>}
      <div className={css.tripcont}>
        <Box component={Stack} gap="16px">
          <Stack className={css.tripheadview}>
            <p className={css.headtext}>On Going Trip</p>
            <Button
              className={css.primaryButton}
              onClick={() => {
                if (device === 'mobile') {
                  dispatch(setDrawer({ name: 'addTrip', value: true }));
                } else {
                  addTripDetails();
                }
              }}
              sx={{
                border: device === 'mobile' ? 'none' : '1px solid #f08b32',
              }}
            >
              <AddIcon />
              Add New Trip
            </Button>
          </Stack>

          {allTripDetails?.filter((item) => !item.trip_completed)?.length ===
            0 && <p style={{ textAlign: 'center' }}>No Data Found.</p>}

          {allTripDetails?.map((item) => (
            <>
              {!item.trip_completed && (
                <Box
                  className={css.tripcard}
                  component={Stack}
                  gap="12px"
                  key={item?.id}
                  onClick={() => {
                    dispatch(
                      setTripViewState(
                        item?.status === 'submitted' ? 'view_trip' : 'edit_view'
                      )
                    );

                    if (device === 'mobile') {
                      navigate('/reimbursement-trip-claim', {
                        state: {
                          selectedTrip: item,
                        },
                      });
                    } else {
                      handleCardClick(item);
                    }
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap="8px">
                      <p className={css.datefield}>
                        {moment(item?.start_date)?.format('MMM-DD-YY')}
                      </p>
                      <p className={css.cardtext}>{item?.name || ''}</p>
                    </Stack>
                    {item.status !== 'approved' &&
                      item.status !== 'paid' &&
                      item.status !== 'partially_paid' &&
                      item.status !== 'declined' && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrip(item);
                            setAnchorEl(e.currentTarget);
                          }}
                          sx={{ padding: 0 }}
                        >
                          <MoreVertRoundedIcon />
                        </IconButton>
                      )}
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap="8px" alignItems="center">
                      <p className={css.cardtext}>Total Expense</p>
                      <p className={css.amounttext}>
                        {IndianCurrency.format(item?.amount || 0)}
                      </p>
                    </Stack>
                    {/* <Box
                  className={css.boxcontent}
                  sx={{
                    background: TRIP_TYPE?.find(
                      (val) => val?.payload === item?.type
                    )?.background,
                    color: TRIP_TYPE?.find((val) => val?.payload === item?.type)
                      ?.color,
                  }}
                >
                  {TRIP_TYPE?.find((val) => val?.payload === item?.type)?.text}
                </Box> */}
                    {StatusComponents[item.status]}
                    {/* {StatusComponents.submitted} */}
                  </Stack>
                </Box>
              )}
            </>
          ))}
        </Box>

        <Box component={Stack} gap="16px">
          <Stack className={css.tripheadview}>
            <p className={css.headtext}>Completed Trip</p>
          </Stack>

          {allTripDetails?.filter((item) => item.trip_completed)?.length ===
            0 && <p style={{ textAlign: 'center' }}>No Data Found.</p>}

          {allTripDetails?.map((item) => (
            <>
              {item.trip_completed && (
                <Box
                  className={css.tripcard}
                  component={Stack}
                  gap="12px"
                  key={item?.id}
                  onClick={() => {
                    dispatch(
                      setTripViewState(
                        item?.status === 'submitted' ? 'view_trip' : 'edit_view'
                      )
                    );
                    if (device === 'mobile') {
                      navigate('/reimbursement-trip-claim', {
                        state: { selectedTrip: item },
                      });
                    } else {
                      handleCardClick(item);
                    }
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {' '}
                    <Stack direction="row" gap="8px" alignItems="center">
                      <p className={css.datefield}>
                        {moment(item?.start_date)?.format('MMM-DD-YY')}
                      </p>
                      <p className={css.cardtext}>{item?.name || ''}</p>
                    </Stack>
                    <Stack>
                      {item.status !== 'approved' &&
                        item.status !== 'paid' &&
                        item.status !== 'partially_paid' &&
                        item.status !== 'declined' && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTrip(item);
                              setAnchorEl(e.currentTarget);
                            }}
                            sx={{ padding: 0 }}
                          >
                            <MoreVertRoundedIcon />
                          </IconButton>
                        )}
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap="8px" alignItems="center">
                      <p className={css.cardtext}>Total Expense</p>
                      <p className={css.amounttext}>
                        {IndianCurrency.format(item?.amount || 0)}
                      </p>
                    </Stack>
                    {/* <Box
                      className={css.boxcontent}
                      sx={{
                        background: TRIP_TYPE?.find(
                          (val) => val?.payload === item?.type
                        )?.background,
                        color: TRIP_TYPE?.find(
                          (val) => val?.payload === item?.type
                        )?.color,
                      }}
                    >
                      {
                        TRIP_TYPE?.find((val) => val?.payload === item?.type)
                          ?.text
                      }
                    </Box> */}
                    {StatusComponents[item.status]}
                  </Stack>
                </Box>
              )}
            </>
          ))}
        </Box>
      </div>

      <SelectBottomSheet
        open={drawer.addTrip}
        onClose={() => dispatch(setDrawer({ name: 'addTrip', value: false }))}
        triggerComponent={<></>}
      >
        {device === 'mobile' && <Puller />}
        <AddTrip
          type="new"
          setTripSheet={setTripSheet}
          onClose={() => dispatch(setDrawer({ name: 'addTrip', value: false }))}
        />
      </SelectBottomSheet>

      <Popover
        // id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack className={css.actioncontainer}>
          <Button
            className={css.actionitem}
            onClick={() => {
              editTripDetail(selectedTrip);
              setAnchorEl(null);
            }}
          >
            <img
              src={edit_settings}
              alt="Edit Trip"
              loading="lazy"
              className={css.actionicon}
            />
            <Typography className={css.actionlabel}>Edit Trip</Typography>
          </Button>
          <Button
            className={css.actionitem}
            onClick={() => {
              setDeleteTripEl(true);
              setAnchorEl(null);
            }}
          >
            <img
              src={trash}
              alt="Edit Trip"
              loading="lazy"
              className={css.actionicon}
            />
            <Typography className={css.actionlabel}>Delete</Typography>
          </Button>
        </Stack>
      </Popover>

      <Dialog
        open={deleteTripEl && device === 'desktop'}
        PaperProps={{ style: { width: '416px', borderRadius: '16px' } }}
        onClose={() => setDeleteTripEl(false)}
      >
        <DeleteContent
          handleNo={() => setDeleteTripEl(false)}
          handleYes={() => {
            dispatch(deleteTrip(selectedTrip.id));
            setDeleteTripEl(false);
          }}
          type="trip"
        />
      </Dialog>
      <SelectBottomSheet
        open={deleteTripEl && device === 'mobile'}
        triggerComponent={<></>}
        onClose={() => setDeleteTripEl(false)}
        styleDrawerMinHeight="auto"
      >
        <Puller />
        <DeleteContent
          handleNo={() => setDeleteTripEl(false)}
          handleYes={() => {
            dispatch(deleteTrip(selectedTrip.id));
            setDeleteTripEl(false);
          }}
          type="trip"
        />
      </SelectBottomSheet>
    </div>
  );
};

export default TripContView;
