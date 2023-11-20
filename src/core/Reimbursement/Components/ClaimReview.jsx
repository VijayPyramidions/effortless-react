import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import {
  getTripExpenses,
  setTripExpenseRes,
  postFollowUp,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

import {
  Typography,
  Stack,
  IconButton,
  Box,
  Button,
  Divider,
  Popover,
  Dialog,
  // Dialog,
} from '@mui/material';
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
// import { ImageUpload } from './WithBill';

const ClaimReview = ({ selectedTip, setTripSheet }) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [TripViewState, setTripViewState] = useState('view_trip');
  const [selectedExpense, setSelectedExpense] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawer, setDrawer] = useState({});

  const [imageDrawer, setImageDrawer] = useState({ open: false, data: {} });

  const { tripExpense, tripExpenseRes } = useSelector(
    (state) => state.Reimbursement
  );
  const { reimbursements } = useSelector(
    (state) => state.ReimbursementSettings
  );

  const onEditExpense = (e, data) => {
    e.stopPropagation();
    setAnchorEl(e?.currentTarget);
    dispatch(setTripExpenseRes(null));
    const policy = reimbursements.find((item) => item.name === data.name);
    setSelectedExpense({
      ...data,
      id: data.reimbursement_id,
      reimbursement_policy_id: policy.id,
    });
  };

  useEffect(() => {
    if (
      device === 'desktop' &&
      window.location.pathname === '/reimbursement-trip-claim'
    ) {
      navigate('/reimbursement');
    }
  }, []);

  useEffect(() => {
    if (tripExpenseRes === 'expenseupdated') {
      setDrawer({ ...drawer, expense: false });
    }
  }, [tripExpenseRes]);

  useEffect(() => {
    dispatch(getTripExpenses(selectedTip.id));
  }, []);

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
            <IconButton onClick={() => setTripSheet('main')}>
              <ArrowBackIcon />
            </IconButton>
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
                  {selectedTip?.name}
                </Typography>
              </Box>
              <Box component={Stack} gap="8px">
                <Typography className={css.titlehead}>START DATE</Typography>
                <Typography className={css.bodycont}>
                  {moment(selectedTip?.start_date, 'YYYY-MM-DD')?.format(
                    'MMM DD, YYYY'
                  )}
                </Typography>
              </Box>
              <Box component={Stack} gap="8px">
                <Typography className={css.titlehead}>Advance</Typography>
                <Typography className={css.amountcont}>
                  {IndianCurrency.format(selectedTip?.amount || 0)}
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
                  {moment(selectedTip?.end_date, 'YYYY-MM-DD')?.format(
                    'MMM DD, YYYY'
                  )}
                </Typography>
              </Box>
              <Box component={Stack} gap="8px" alignItems="end">
                <Typography className={css.titlehead}>REIMBURSEMENT</Typography>
                <Typography className={css.bodycont}>
                  {IndianCurrency.format(selectedTip?.reimburse_amount || 0)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {TripViewState === 'view_trip' && tripExpense?.data?.length > 0 && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              className={css.addexpensebutton}
              onClick={() => setTripViewState('edit_view')}
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
                    id: selectedTip.id,
                    trip: 'expense',
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

        {TripViewState === 'edit_view' && tripExpense?.data?.length > 0 && (
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

            <Button
              className={css.addexpensebutton}
              onClick={() => setTripViewState('view_trip')}
            >
              <img src={raise_claim} alt="raise" />
              <Typography component="p" className={css.addexpense}>
                Raise Claim
              </Typography>
            </Button>
          </Stack>
        )}

        {tripExpense?.data?.length === 0 && (
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

        <Divider />

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
              <Box className={css.billablebox}>Billable</Box>
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
                  {TripViewState === 'view_trip' && (
                    <Typography
                      className={css.viewbill}
                      component={Button}
                      onClick={() => {
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
                  {TripViewState === 'edit_view' && (
                    <IconButton onClick={(e) => onEditExpense(e, val)}>
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </div>
              </Box>
            ))}
          </div>
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
              bill_details: { url: imageDrawer?.data?.file_url },
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
          open={Boolean(anchorEl)}
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
              }}
            >
              <img src={edit_settings} alt="edit" />

              <div
                className={css.popovertext}
                onClick={() => {
                  setAnchorEl(null);
                  setDrawer({ ...drawer, expense: true });
                }}
              >
                Edit Expense
              </div>
            </div>
            <div
              className={css.popoverelement}
              onClick={() => {
                setAnchorEl(null);
              }}
            >
              <img src={view_bill} alt="delete" />
              <p className={css.popovertext}>View Bill</p>
            </div>
          </div>
        </Popover>

        <SelectBottomSheet
          open={drawer?.expense}
          onClose={() => setDrawer({ ...drawer, expense: false })}
          triggerComponent={<></>}
        >
          <ExpenseRequirementForm
            action="view"
            data={selectedExpense}
            id={selectedTip.id}
          />
        </SelectBottomSheet>
      </div>
    </div>
  );
};

export default ClaimReview;
