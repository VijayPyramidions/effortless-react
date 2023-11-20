import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';

import {
  getTripExpenses,
  setTripExpenseRes,
  postFollowUp,
  raiseClaim,
  getOneClaim,
  setTripViewState,
  setRaiseClaimResponse,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';
import {
  getOneReimbursement,
  getReimbursements,
} from '@action/Store/Reducers/Settings/ReimburssementSettingsState';

import {
  Typography,
  Stack,
  IconButton,
  Box,
  Button,
  Divider,
  Popover,
  Dialog,
} from '@mui/material';
import { styled } from '@material-ui/core/styles';
import trip_empty from '@assets/trip_empty.svg';
import trip_claim_pic from '@assets/trip_claim_pic.svg';
import trip_dash_line from '@assets/trip_dash_line.svg';
import raise_claim from '@assets/raise_claim.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import editIcon from '@assets/edit-2.svg';
import edit_settings from '@assets/edit_settings.svg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import view_bill from '@assets/view_bill.svg';

import { IndianCurrency } from '@components/utils';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import ExpenseRequirementForm from './ExpenseRequirementForm';
import * as css from '../ReimbursementContainer.scss';
import { ImageUpload } from './WithBill';
import MileageRequirementForm from './MileageRequirementForm';
import { CustomizedStepper } from './ReimbursementActionSheets';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const TripDetailsView = ({ selectedTip, setTripSheet, setValue, from }) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [selectedExpense, setSelectedExpense] = useState({});
  const localSelectedTrip = selectedTip || state?.selectedTrip;
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawer, setDrawer] = useState({});
  const [imageDrawer, setImageDrawer] = useState({ open: false, data: {} });
  const [localState, setLocalState] = useState({});

  const {
    tripExpense,
    tripExpenseRes,
    oneClaimDetails,
    TripViewState,
    raiseClaimResponse,
  } = useSelector((value) => value.Reimbursement);
  const { reimbursements } = useSelector(
    (value) => value.ReimbursementSettings
  );

  const onEditExpense = (e, data) => {
    e.stopPropagation();
    setAnchorEl(e?.currentTarget);
    dispatch(setTripExpenseRes(null));
    const policy = reimbursements.find(
      (item) => item.id === data.reimbursement_policy_id
    );

    setSelectedExpense({
      ...data,
      id: data.reimbursement_id,
      reimbursement_policy_id: policy?.id,
    });
    let arr;

    if (data.name === 'Own Vehicle Expenses')
      arr = {
        id: policy?.id,
        vehicleType: data?.vehicle_type || 'bike',
      };
    else arr = { id: policy?.id };

    dispatch(getOneReimbursement(arr));
    dispatch(getOneClaim(data?.reimbursement_id));
  };

  const raiseTripClaim = () => {
    // const tempArr = [...tripExpense.data];
    // const reimbursementId = tempArr.map((item) => item.reimbursement_id);
    dispatch(raiseClaim(tripExpense?.reimbursement_group?.id));
  };

  useEffect(() => {
    if (
      device === 'desktop' &&
      window.location.pathname === '/reimbursement-trip-claim'
    ) {
      navigate('/reimbursement');
    }
    dispatch(getReimbursements());
  }, []);

  useEffect(() => {
    if (tripExpenseRes === 'expenseupdated') {
      setDrawer({ ...drawer, expense: false, mileage: false });
    }
  }, [tripExpenseRes]);

  useEffect(() => {
    dispatch(getTripExpenses(localSelectedTrip?.id));
  }, [localSelectedTrip]);

  useEffect(() => {
    switch (tripExpense?.reimbursement_group?.status) {
      case 'draft':
        dispatch(setTripViewState('edit_view'));
        break;
      case 'approved':
      case 'paid':
      case 'declined':
      case 'submitted':
        dispatch(setTripViewState('view_trip'));
        break;
      default:
        dispatch(setTripViewState('edit_view'));
    }
  }, [tripExpense?.reimbursement_group]);

  useEffect(() => {
    if (
      raiseClaimResponse &&
      raiseClaimResponse === 'claim raised' &&
      device === 'mobile'
    ) {
      navigate('/reimbursement-trip');
      dispatch(setRaiseClaimResponse(null));
    }
  }, [raiseClaimResponse]);

  useEffect(() => {
    if (tripExpense?.reimbursement_group) {
      let stepper;
      if (
        tripExpense?.reimbursement_group?.status === 'paid' ||
        tripExpense?.reimbursement_group?.status === 'approved' ||
        state?.data?.status === 'paid' ||
        state?.data?.status === 'approved'
      )
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                tripExpense?.reimbursement_group?.claimed_on ||
                  state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(
                tripExpense?.reimbursement_group?.approved_on ||
                  state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                tripExpense?.reimbursement_group?.approver_details?.name ||
                state?.data?.approver_details?.name ||
                '-',
            },
            {
              name: 'Payment on',
              label: moment(
                tripExpense?.reimbursement_group?.paid_on ||
                  state?.data?.paid_on
              )?.format('DD MMM YYYY'),
              id: 3,
              type: 'payment',
              status: 'paid',
            },
          ],
        };
      else if (
        tripExpense?.reimbursement_group?.status === 'partially_paid' ||
        state?.data?.status === 'partially_paid'
      )
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                tripExpense?.reimbursement_group?.claimed_on ||
                  state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(
                tripExpense?.reimbursement_group?.approved_on ||
                  state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                tripExpense?.reimbursement_group?.approver_details?.name ||
                state?.data?.approver_details?.name ||
                '-',
            },
            {
              name: 'Payment on',
              label: moment(
                tripExpense?.reimbursement_group?.paid_on ||
                  state?.data?.paid_on
              )?.format('DD MMM YYYY'),
              id: 3,
              type: 'payment',
              status: 'partially_paid',
              paidamt: tripExpense?.reimbursement_group?.paid_amount
                ? tripExpense?.reimbursement_group?.paid_amount || 0
                : state?.data?.paid_amount || 0,
              balanceamt: tripExpense?.reimbursement_group?.amount
                ? tripExpense?.reimbursement_group?.amount -
                    tripExpense?.reimbursement_group?.paid_amount || 0
                : state?.data?.amount - state?.data?.paid_amount || 0,
            },
          ],
        };
      if (
        tripExpense?.reimbursement_group?.status === 'approved' ||
        state?.data?.status === 'approved'
      )
        stepper = {
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                tripExpense?.reimbursement_group?.claimed_on ||
                  state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(
                tripExpense?.reimbursement_group?.approved_on ||
                  state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                tripExpense?.reimbursement_group?.approver_details?.name ||
                state?.data?.approver_details?.name ||
                '-',
            },
          ],
        };
      else if (
        tripExpense?.reimbursement_group?.status === 'declined' ||
        state?.data?.status === 'declined'
      )
        stepper = {
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                tripExpense?.reimbursement_group?.claimed_on ||
                  state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Rejected on',
              label:
                tripExpense?.reimbursement_group?.cancelled_on ||
                state?.data?.rejected_on,
              id: 2,
              reason:
                tripExpense?.reimbursement_group?.reject_reason ||
                state?.data?.rejected_on ||
                'Contact your manager.',
              type: 'declined',
              rejectedBy:
                tripExpense?.reimbursement_group?.canceller_details?.name ||
                state?.data?.canceller_details?.name ||
                '-',
            },
          ],
        };

      setLocalState((prev) => ({
        ...prev,
        stepperActive: stepper?.active || 0,
        stepperData: stepper?.showData || [],
      }));
    }
  }, [tripExpense?.reimbursement_group]);

  return (
    <div className={css.reimursementsheet}>
      <div
        className={
          device === 'mobile'
            ? `${css.tripdetailssheet} ${css.tripdetailssheetmobile}`
            : css.tripdetailssheet
        }
      >
        {device === 'desktop' && (
          <Stack
            direction="row"
            margin="24px 0px"
            alignItems="center"
            gap="8px"
          >
            {from !== 'trip_view' && (
              <IconButton onClick={() => setTripSheet('main')}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography component="p" className={css.detailsheader}>
              Trip Claim
            </Typography>
          </Stack>
        )}

        <Box
          className={
            device === 'mobile'
              ? `${css.tripdetailcard} ${css.tripdetailcardmobile}`
              : css.tripdetailcard
          }
        >
          <Stack direction="row" width="100%">
            <Stack gap="20px" width="40%">
              <Box component={Stack} gap="8px">
                <Typography className={css.titlehead}>TRIP FROM</Typography>
                <Typography className={css.placecont}>
                  {localSelectedTrip?.name}
                </Typography>
              </Box>
              <Box component={Stack} gap="8px">
                <Typography className={css.titlehead}>START DATE</Typography>
                <Typography className={css.bodycont}>
                  {localSelectedTrip?.start_date}
                </Typography>
              </Box>
              <Box component={Stack} gap="8px">
                <Typography className={css.titlehead}>Advance</Typography>
                <Typography className={css.amountcont}>
                  {IndianCurrency.format(
                    tripExpense?.reimbursement_group?.advance_amount || 0
                  )}
                </Typography>
              </Box>
            </Stack>

            <Stack width="20%" justifyContent="center" padding="12px">
              <img src={trip_dash_line} alt="dash" />
            </Stack>

            <Stack gap="20px" width="40%" alignItems="end">
              <img src={trip_claim_pic} alt="trp" style={{ height: '40px' }} />
              <Box component={Stack} gap="8px" alignItems="end">
                <Typography className={css.titlehead}>END DATE</Typography>
                <Typography className={css.bodycont}>
                  {localSelectedTrip?.end_date}
                </Typography>
              </Box>
              <Box component={Stack} gap="8px" alignItems="end">
                <Typography className={css.titlehead}>REIMBURSEMENT</Typography>
                <Typography className={css.bodycont}>
                  {IndianCurrency.format(
                    tripExpense?.reimbursement_group?.claim_amount || 0
                  )}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>
        {TripViewState === 'view_trip' &&
          tripExpense?.data?.length > 0 &&
          tripExpense?.reimbursement_group?.status !== 'paid' &&
          tripExpense?.reimbursement_group?.status !== 'approved' &&
          tripExpense?.reimbursement_group?.status !== 'declined' && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                className={css.addexpensebutton}
                onClick={() => dispatch(setTripViewState('edit_view'))}
              >
                <img src={editIcon} alt="edit" style={{ width: '12px' }} />
                {/* <AddIcon className={css.tripicon} /> */}
                <Typography component="p" className={css.addexpense}>
                  Edit
                </Typography>
              </Button>
              <Button
                className={css.addexpensebutton}
                onClick={() =>
                  dispatch(
                    postFollowUp({
                      id: selectedTip?.id || localSelectedTrip?.id,
                      type: 'trip',
                      payload: {
                        from: 'notifications@goeffortless.co',
                      },
                    })
                  )
                }
              >
                <PersonAddAltIcon className={css.tripicon} />
                <Typography component="p" className={css.addexpense}>
                  Follow Up
                </Typography>
              </Button>
            </Stack>
          )}

        {TripViewState === 'edit_view' &&
          tripExpense?.data?.length > 0 &&
          (localSelectedTrip?.status === 'draft' ||
            localSelectedTrip?.status === 'submitted') && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                className={css.addexpensebutton}
                onClick={() => {
                  if (device === 'desktop') {
                    setTripSheet('trip_expense');
                  } else {
                    setDrawer({ ...drawer, expense: true });
                  }
                }}
              >
                <AddIcon className={css.addicon} />
                <Typography component="p" className={css.addexpense}>
                  Add Expense
                </Typography>
              </Button>

              <Button className={css.addexpensebutton} onClick={raiseTripClaim}>
                <img src={raise_claim} alt="raise" />
                <Typography component="p" className={css.addexpense}>
                  Raise Claim
                </Typography>
              </Button>
            </Stack>
          )}

        {tripExpense?.data?.length === 0 &&
          (localSelectedTrip?.status === 'draft' ||
            localSelectedTrip?.status === 'submitted') && (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Button
                className={css.addexpensebutton}
                onClick={() => {
                  if (device === 'desktop') {
                    setTripSheet('trip_expense');
                  } else {
                    setDrawer({ ...drawer, expense: true });
                  }
                }}
              >
                <AddIcon className={css.addicon} />
                <Typography component="p" className={css.addexpense}>
                  Add Expense
                </Typography>
              </Button>
            </Stack>
          )}

        {selectedTip?.status !== 'paid' &&
          selectedTip?.status !== 'approved' &&
          selectedTip?.status !== 'declined' &&
          localSelectedTrip?.status !== 'paid' &&
          localSelectedTrip?.status !== 'declined' &&
          localSelectedTrip?.status !== 'approved' && <Divider />}
        {tripExpense?.data?.length === 0 && (
          <Stack marginTop="64px" alignItems="center">
            <img
              src={trip_empty}
              alt="empty_trip"
              style={{ margin: '0 auto 20px' }}
            />
            <Typography component="p" style={{ fontSize: '14px' }}>
              Add Your Trip Expense
            </Typography>
          </Stack>
        )}

        {tripExpense?.data?.length > 0 && (
          <div className={css.expenselist}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography component="p" className={css.listheader}>
                Your Expense List
              </Typography>
              {/* <Box className={css.billablebox}>Billable</Box> */}
            </Stack>

            {tripExpense?.data?.map((val) => (
              <Box
                className={css.tripexpensecard}
                component={Stack}
                gap="8px"
                key={val?.reimbursement_id}
              >
                <Stack gap="8px" direction="row">
                  <Typography className={css.datefield}>
                    {moment(val?.date)?.format('DD-MM-YYYY')}
                  </Typography>
                  <Typography className={css.expensefiled}>
                    {val?.name}
                  </Typography>
                </Stack>
                <Stack gap="8px" direction="row">
                  <Typography className={css.lefttext}>Your Claim:</Typography>
                  <Typography className={css.amounttext}>
                    {val?.amount}
                  </Typography>
                </Stack>
                <Typography className={css.descriptiontext}>
                  <span className={css.lefttext} style={{ marginRight: '8px' }}>
                    Description:
                  </span>
                  {val?.description}
                </Typography>
                <div className={css.cardaction}>
                  {TripViewState === 'view_trip' && !!val.file_url && (
                    <Typography
                      className={css.viewbill}
                      component={Button}
                      onClick={() => {
                        setAnchorEl(null);
                        setImageDrawer((prev) => ({
                          ...prev,
                          open: true,
                          data: {
                            bill_details: {
                              url: val?.file_url,
                              type: 'application/jpg',
                            },
                          },
                        }));
                      }}
                    >
                      View Bill
                    </Typography>
                  )}
                  {TripViewState === 'edit_view' &&
                    tripExpense?.reimbursement_group?.status !== 'paid' &&
                    tripExpense?.reimbursement_group?.status !== 'approved' &&
                    tripExpense?.reimbursement_group?.status !== 'declined' && (
                      <IconButton onClick={(e) => onEditExpense(e, val)}>
                        <MoreVertIcon />
                      </IconButton>
                    )}
                </div>
              </Box>
            ))}
          </div>
        )}

        {(tripExpense?.reimbursement_group?.status === 'paid' ||
          tripExpense?.reimbursement_group?.status === 'declined' ||
          tripExpense?.reimbursement_group?.status === 'approved') && (
          <Stack sx={{ marginTop: '12px' }}>
            <CustomizedStepper
              stepperList={localState?.stepperData}
              active={localState?.stepperActive}
            />
          </Stack>
        )}

        <Dialog
          open={imageDrawer.open}
          onClose={() => setImageDrawer((prev) => ({ ...prev, open: false }))}
          PaperProps={{
            elevation: 3,
            style: {
              borderRadius: 16,
              padding: '16px',
            },
          }}
        >
          <ImageUpload
            localState={{
              ...imageDrawer.data,
              // bill_details: { url: imageDrawer?.data?.file_url },
            }}
            style={{ height: '500px', width: '500px' }}
          />
        </Dialog>

        <Popover
          id="basic-menu-sort"
          anchorEl={anchorEl}
          PaperProps={{
            sx: {
              width: '164px',
              boxShadow:
                '0px 9px 42px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
            },
          }}
          open={Boolean(anchorEl) && device === 'desktop'}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={() => setAnchorEl(null)}
        >
          <div>
            <div
              className={css.popoverelement}
              onClick={() => {
                setAnchorEl(null);
                if (selectedExpense?.name === 'Own Vehicle Expenses')
                  setDrawer({ ...drawer, mileage: true });
                else {
                  setDrawer({ ...drawer, expense: true });
                  // dispatch(
                  //   getOneReimbursement({
                  //     id: selectedExpense?.reimbursement_policy_id,
                  //   })
                  // );
                }
              }}
            >
              <img src={edit_settings} alt="edit" />

              <p className={css.popovertext}>Edit Expense</p>
            </div>
            {!!selectedExpense.file_url && (
              <div
                className={css.popoverelement}
                onClick={() => {
                  setImageDrawer((prev) => ({
                    ...prev,
                    open: true,
                    data: {
                      bill_details: {
                        url: selectedExpense.file_url,
                        type: 'application/jpg',
                      },
                    },
                  }));
                }}
              >
                <img src={view_bill} alt="view" />
                <p className={css.popovertext}>View Bill</p>
              </div>
            )}
          </div>
        </Popover>

        <SelectBottomSheet
          open={Boolean(anchorEl) && device === 'mobile'}
          onClose={() => setAnchorEl(null)}
          triggerComponent={<></>}
        >
          <Puller />
          <div>
            <div
              className={css.popoverelement}
              onClick={() => {
                setAnchorEl(null);
                if (selectedExpense?.name === 'Own Vehicle Expenses')
                  navigate('/reimbursement-expense', {
                    state: {
                      claimTripDetails: localSelectedTrip,
                      data: selectedExpense,
                      action: 'view',
                      tab: 'advance',
                      id: localSelectedTrip?.id,
                    },
                  });
                else
                  navigate('/reimbursement-expense', {
                    state: {
                      claimTripDetails: localSelectedTrip,
                      data: selectedExpense,
                      action: 'view',
                      tab: 'advance',
                      id: localSelectedTrip?.id,
                    },
                  });
              }}
            >
              <img src={edit_settings} alt="edit" />

              <p className={css.popovertext}>Edit Expense</p>
            </div>
            {!!selectedExpense.file_url && (
              <div
                className={css.popoverelement}
                onClick={() => {
                  setAnchorEl(null);
                  setImageDrawer((prev) => ({
                    ...prev,
                    open: true,
                    data: {
                      bill_details: {
                        url: selectedExpense.file_url,
                        type: 'application/jpg',
                      },
                    },
                  }));
                }}
              >
                <img src={view_bill} alt="delete" />
                <p className={css.popovertext}>View Bill</p>
              </div>
            )}
          </div>
        </SelectBottomSheet>

        <SelectBottomSheet
          open={drawer?.expense}
          onClose={() => setDrawer({ ...drawer, expense: false })}
          triggerComponent={<></>}
        >
          <Puller />
          <ExpenseRequirementForm
            action="new"
            data={selectedExpense}
            id={localSelectedTrip?.id}
            claimTripDetails={localSelectedTrip}
            onClose={() => setDrawer({ ...drawer, expense: false })}
            openMileage={() =>
              setDrawer({ ...drawer, mileage: true, action: true })
            }
            setValue={setValue}
          />
        </SelectBottomSheet>

        <SelectBottomSheet
          open={drawer?.mileage}
          onClose={() =>
            setDrawer({ ...drawer, mileage: false, action: false })
          }
          triggerComponent={<></>}
        >
          <Puller />
          <MileageRequirementForm
            action={drawer?.action ? 'new' : 'view'}
            data={oneClaimDetails}
            from={drawer?.action && 'mobileTrip'}
            locationState={drawer?.action && state}
            id={localSelectedTrip?.id}
            setValue={setValue}
            selectedTrip={localSelectedTrip}
          />
        </SelectBottomSheet>
      </div>
    </div>
  );
};

export default TripDetailsView;
