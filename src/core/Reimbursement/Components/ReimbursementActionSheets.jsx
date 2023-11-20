import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Stack,
  Typography,
  IconButton,
  Box,
  Divider,
  Dialog,
} from '@mui/material';

import { getOneReimbursement } from '@action/Store/Reducers/Settings/ReimburssementSettingsState';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import red_color_delete from '@assets/red_color_delete.svg';
import cash_reimbursement_icon from '@assets/cash_reimbursement_icon.svg';
import advanceimg from '@assets/advanceimg.svg';
import { IndianCurrency } from '@components/utils';

import * as css from '../ReimbursementContainer.scss';
import { TableCont } from './AdvanceTable';
import { ImageUpload } from './WithBill';

export const DeleteContent = ({ handleNo, handleYes, type }) => {
  // const device = localStorage.getItem('device_detect');
  return (
    <div className={css.deleteddialog}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.deletehead}>
          {type === 'trip' && 'Delete Trip'}{' '}
          {type === 'advance' && 'Delete Advance'}{' '}
          {type === 'claim' && 'Delete Claim'}
        </Typography>
        {/* {device === 'mobile' && (
          <IconButton onClick={() => handleNo()}>
            <CloseIcon />
          </IconButton>
        )} */}
      </Stack>

      <Typography className={css.descriptiontext}>
        Are you sure, you want to delete this {type === 'trip' && 'Trip'}{' '}
        {type === 'advance' && 'Advance'} {type === 'claim' && 'Claim'}?
      </Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          No
        </Button>
        <Button className={css.primaryButton} onClick={() => handleYes()}>
          Yes
        </Button>
      </Stack>
    </div>
  );
};

export const HeadsUpContent = ({ handleNo, handleYes }) => {
  const device = localStorage.getItem('device_detect');
  return (
    <div className={css.headsupdialog}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.headsuphead}>Heads Up</Typography>
        {device === 'mobile' && (
          <IconButton onClick={() => handleNo()}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>

      <Typography className={css.descriptiontext}>
        Did you provide your Organization’s GST Number for this Expense?
      </Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          No
        </Button>
        <Button className={css.primaryButton} onClick={() => handleYes()}>
          Yes
        </Button>
      </Stack>
    </div>
  );
};

export const WarningContent = ({ handleWarning }) => {
  const device = localStorage.getItem('device_detect');
  return (
    <div className={css.warningdialog}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.warninghead}>Warning</Typography>
        {device === 'mobile' && (
          <IconButton onClick={() => handleWarning()}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>

      <Typography className={css.descriptiontext}>
        Your are expected to provide Company GST Number under such
        circumstances.
      </Typography>

      <Typography className={css.descriptiontext}>
        Please note that failure to comply to this practice will result in your
        next Reimbursement claim to be blocked by default.
      </Typography>

      <Stack direction="row" justifyContent="center" alignItems="center">
        <Button className={css.secondarybutton} onClick={() => handleWarning()}>
          I Understand
        </Button>
      </Stack>
    </div>
  );
};

export const RequestAdvance = ({ handleNo, handleYes, tripName }) => {
  return (
    <div className={css.advancedialog}>
      <img
        src={cash_reimbursement_icon}
        style={{ width: '106px' }}
        alt="advance"
      />
      <Typography className={css.advancehead}>
        Request Advance This Trip
      </Typography>

      <Typography className={css.descriptiontext}>
        {`Would you like to add Advance for ${
          tripName || '-'
        } from your Manager?`}
      </Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          Proceed
        </Button>
        <Button className={css.approveButton} onClick={() => handleYes()}>
          Request Advance
        </Button>
      </Stack>
    </div>
  );
};

export const PayAdvance = ({ handleNo, handleYes }) => {
  return (
    <div className={css.advancedialog}>
      <img
        src={cash_reimbursement_icon}
        style={{ width: '106px' }}
        alt="advance"
      />
      <Typography className={css.advancehead}> This Trip</Typography>

      <Typography className={css.descriptiontext}>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint.
      </Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          Exit
        </Button>
        <Button className={css.primaryButton} onClick={() => handleYes()}>
          Pay Advance
        </Button>
      </Stack>
    </div>
  );
};

export const CustomizedStepper = ({ stepperList, active }) => {
  return (
    <Stack direction="column" className={css.customisedstepper}>
      {stepperList?.map((val, i) => (
        <>
          <Stack direction="row" gap="12px" alignItems="start" minHeight="48px">
            <div style={{ marginTop: '4px' }}>
              <div
                style={{
                  height: '16px',
                  width: '16px',
                  border:
                    val?.id <= active
                      ? '1px solid #2F9682'
                      : '1px solid #BFBFBF',
                  borderRadius: '30px',
                  display: 'flex',
                }}
              >
                <span
                  style={{
                    height: '6px',
                    width: '6px',
                    background: val?.id <= active ? '#2F9682' : '#BFBFBF',
                    margin: 'auto',
                    borderRadius: '30px',
                  }}
                />
              </div>
              {i !== stepperList?.length - 1 && (
                <div
                  style={{
                    height: '24px',
                    width: 0,
                    marginLeft: '8px',
                    border:
                      val?.id <= active - 1
                        ? '1px dashed #2F9682'
                        : '1px dashed #BFBFBF',
                  }}
                />
              )}
            </div>

            <Stack gap="4px" alignItems="start" sx={{ marginTop: '4px' }}>
              <Typography className={css.labeltext}>
                {val?.name}
                {' : '}
                <span className={css.valuetext}>{val?.label || '-'}</span>
              </Typography>
              {/* {val?.type !== 'payment' && val?.label && (
                <Typography className={css.valuetext}>{val?.label}</Typography>
              )} */}
              {val.rejectedBy && (
                <Typography className={css.valuetext}>
                  <spn className={css.rejectlable}>Rejected By : </spn>
                  {val?.rejectedBy || '-'}
                </Typography>
              )}
              {val.approvedBy && (
                <Typography className={css.valuetext}>
                  <spn className={css.rejectlable}>Approved By : </spn>
                  {val?.approvedBy || '-'}
                </Typography>
              )}
              {val?.type === 'declined' && (
                <Typography className={css.paymenttextreject}>
                  <span className={css.reasonlabel}>Reason : </span>{' '}
                  {val?.reason}
                </Typography>
              )}
              {val?.type === 'payment' && (
                <>
                  {val?.status === 'paid' && val?.label && (
                    <Typography className={css.paymenttext}>
                      Your Bill is <span>Paid On {val?.label}</span>
                    </Typography>
                  )}
                  {val?.status === 'partially_paid' && (
                    <Stack gap="12px">
                      <Typography className={css.partialvalue}>
                        Your Bill is <span>Partially Paid</span>
                        <section>On {val?.label}</section>
                      </Typography>
                      <Typography className={css.partialpaid}>
                        Paid Amount: <span>{val?.paidamt}</span>
                      </Typography>
                      <Typography className={css.partialbalance}>
                        Balance Amount: <span>{val?.balanceamt}</span>
                      </Typography>
                    </Stack>
                  )}
                </>
              )}
            </Stack>
          </Stack>
          {/* {i !== stepperList?.length - 1 && (
            <div
              style={{
                height: '24px',
                marginTop: '2px',
                width: 0,
                marginLeft: '8px',
                border:
                  val?.id <= active - 1
                    ? '1px dashed #2F9682'
                    : '1px dashed #BFBFBF',
              }}
            />
          )} */}
        </>
      ))}
    </Stack>
  );
};

export const TripDetailsMobileSheet = ({ deleteClick }) => {
  const navigate = useNavigate();
  const [activeStepper, setActiveStepper] = useState({
    active: 0,
    showData: [],
  });
  const [drawer, setDrawer] = useState(false);

  const { managers, oneClaimDetails } = useSelector(
    (state) => state.Reimbursement
  );

  useEffect(() => {
    if (oneClaimDetails?.id) {
      if (oneClaimDetails?.status === 'paid')
        setActiveStepper({
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(oneClaimDetails?.claimed_on)?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(oneClaimDetails?.approved_on)?.format(
                'DD MMM YYYY'
              ),
              id: 2,
              type: 'approve',
              approvedBy: oneClaimDetails?.approver_details?.name || '-',
            },
            {
              name: 'Payment on',
              label: moment(oneClaimDetails?.paid_on)?.format('DD MMM YYYY'),
              id: 3,
              type: 'payment',
              status: 'paid',
            },
          ],
        });
      else if (oneClaimDetails?.status === 'partially_paid')
        setActiveStepper({
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(oneClaimDetails?.claimed_on)?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(oneClaimDetails?.approved_on)?.format(
                'DD MMM YYYY'
              ),
              id: 2,
              type: 'approve',
              approvedBy: oneClaimDetails?.approver_details?.name || '-',
            },
            {
              name: 'Payment on',
              label: moment(oneClaimDetails?.paid_on)?.format('DD MMM YYYY'),
              id: 3,
              type: 'payment',
              status: 'partially_paid',
              paidamt: oneClaimDetails?.paid_amount || 0,
              balanceamt:
                oneClaimDetails?.amount - oneClaimDetails?.paid_amount || 0,
            },
          ],
        });
      else if (oneClaimDetails?.status === 'declined')
        setActiveStepper({
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(oneClaimDetails?.claimed_on)?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Rejected',
              label: moment(oneClaimDetails?.cancelled_on)?.format(
                'DD MMM YYYY'
              ),
              id: 2,
              reason: oneClaimDetails?.reject_reason || 'Contact your manager.',
              type: 'declined',
              rejectedBy: oneClaimDetails?.canceller_details?.name || '-',
            },
          ],
        });
    }
  }, [oneClaimDetails?.id]);

  return (
    <div className={css.tripdetailmobile}>
      <Stack
        direction="row"
        justifyContent="space-between"
        margin="20px"
        alignItems="center"
      >
        <Box component={Stack} gap="12px" direction="row">
          <img src={advanceimg} alt="claim" style={{ width: '40px' }} />
          <Stack gap="4px">
            <Typography className={css.categoryhead}>Category</Typography>
            <Typography className={css.categorytype}>Advance</Typography>
          </Stack>
        </Box>
      </Stack>

      <Divider />

      <Box margin="12px 20px" component={Stack} gap="12px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <Stack gap="6px">
            <Typography className={css.categoryhead}>Amount</Typography>
            <Typography className={css.totalamt}>
              {IndianCurrency.format(oneClaimDetails?.amount || 0)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" width="100%">
          <Typography width="20%" className={css.triplabel}>
            Manager
          </Typography>
          <Typography width="5%" className={css.triplabel}>
            -
          </Typography>
          <Typography sx={{ flexGrow: 1 }} className={css.tripvalue}>
            {managers?.find(
              (item) => item?.manager_id === oneClaimDetails?.manager_id
            )?.name || '-'}
          </Typography>
        </Stack>

        <Stack direction="row" width="100%">
          <Typography width="20%" className={css.triplabel}>
            Trip
          </Typography>
          <Typography width="5%" className={css.triplabel}>
            -
          </Typography>
          <Typography sx={{ flexGrow: 1 }} className={css.tripvalue}>
            {oneClaimDetails?.description || '-'}
          </Typography>
        </Stack>
      </Box>

      <Divider />

      <Box margin="12px 20px" component={Stack} gap="12px">
        {oneClaimDetails?.status === 'paid' && (
          <Typography
            className={css.viewdesc}
            component={Button}
            onClick={() => setDrawer(true)}
          >
            Reimbursements to Adjust ?
          </Typography>
        )}
        {oneClaimDetails?.id &&
          (oneClaimDetails?.status === 'paid' ||
            oneClaimDetails?.status === 'declined') && (
            <CustomizedStepper
              stepperList={activeStepper?.showData}
              active={activeStepper?.active}
            />
          )}
      </Box>

      {oneClaimDetails?.status !== 'paid' &&
        oneClaimDetails?.status !== 'approved' &&
        oneClaimDetails?.status !== 'declined' && (
          <Stack
            direction="row"
            width="calc(100% - 48px)"
            padding="24px"
            justifyContent="space-between"
          >
            <Button className={css.deleteButton} onClick={() => deleteClick()}>
              <img
                src={red_color_delete}
                alt="delete"
                style={{ width: '14px' }}
              />
              Delete Trip
            </Button>
            <Button
              className={css.editButton}
              onClick={() =>
                navigate('/reimbursement-trip-advance-request', {
                  state: { action: 'update', tab: 'advance' },
                })
              }
            >
              <DriveFileRenameOutlineIcon sx={{ fontSize: '16px' }} />
              Edit
            </Button>
          </Stack>
        )}

      <SelectBottomSheet
        name="advance"
        open={drawer}
        triggerComponent={<></>}
        onTrigger={() => setDrawer(true)}
        onClose={() => setDrawer(false)}
      >
        <Box className={css.advancetable}>
          <>
            <Stack direction="row" padding="12px" alignItems="center" gap="8px">
              <IconButton onClick={() => setDrawer(false)}>
                <KeyboardArrowLeftRoundedIcon />
              </IconButton>
              <Typography component="p" className={css.advancetextheader}>
                Reimbursements to Adjust
              </Typography>
            </Stack>
            <TableCont
              TableData={[
                {
                  date: '20-12-2023',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit... ',
                  amount: '42000',
                },
                {
                  date: '20-12-2023',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit... ',
                  amount: '42000',
                },
                {
                  date: '20-12-2023',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit... ',
                  amount: '42000',
                },
              ]}
              length={50}
            />
          </>
          <Button className={css.primaryButton}>Knock Off</Button>
        </Box>
      </SelectBottomSheet>
    </div>
  );
};

export const ExpenseDetailsMobileSheet = ({ data, deleteClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeStepper, setActiveStepper] = useState({
    active: 0,
    showData: [],
  });

  const { reimbursements } = useSelector(
    (state) => state.ReimbursementSettings
  );
  const { userPermissions } = useContext(AppContext);

  // const [viewDesc, setViewDesc] = useState(false);
  const [imageDrawer, setImageDrawer] = useState(false);
  const [havePermission, setHavePermission] = useState(false);

  useEffect(() => {
    if (Object.keys(data || {})?.length > 0) {
      if (data?.status === 'submitted' || data?.status === 'approved')
        setActiveStepper({
          active: data?.status === 'paid' ? 3 : 2,
          showData: [
            {
              name: 'Submitted on',
              label: data?.date
                ? moment(data?.claimed_on)?.format('DD MMM YYYY')
                : '',
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: data?.approved_on
                ? moment(data?.approved_on)?.format('DD MMM YYYY')
                : '',
              id: 2,
              type: 'approve',
              approvedBy: data?.approver_details?.name || '-',
            },
            {
              name: 'Payment on',
              label: data?.paid_on
                ? moment(data?.paid_on)?.format('DD MMM YYYY')
                : '',
              id: 3,
              type: 'payment',
            },
          ],
        });
      else if (data?.status === 'declined')
        setActiveStepper({
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(data?.claimed_on)?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Rejected',
              label: data?.cancelled_on
                ? moment(data?.cancelled_on)?.format('DD MMM YYYY')
                : '',
              id: 2,
              reason: data?.reject_reason || 'Contact your manager.',
              type: 'declined',
              rejectedBy: data?.canceller_details?.name || '-',
            },
          ],
        });
    }
  }, [data]);
  return (
    <>
      <div className={css.tripdetailmobile}>
        <Stack
          direction="row"
          justifyContent="space-between"
          margin="20px"
          alignItems="center"
        >
          <Box component={Stack} gap="12px" direction="row">
            <img
              src={
                reimbursements?.find((item) => item.name === data?.name)?.icon
              }
              alt="claim"
              style={{ width: '40px' }}
            />
            <Stack gap="4px">
              <Typography className={css.categoryhead}>Category</Typography>
              <Typography className={css.categorytype}>{data?.name}</Typography>
            </Stack>
          </Box>
          {data?.billable && <Box className={css.categorystatus}>Billable</Box>}
        </Stack>

        <Divider />

        <Box margin="12px 20px" component={Stack} gap="12px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Stack gap="6px">
              <Typography className={css.categoryhead}>Amount</Typography>
              <Typography className={css.totalamt}>
                {IndianCurrency.format(data?.amount || 0)}
              </Typography>
            </Stack>
            {data?.file_url && (
              <Typography
                className={css.viewbill}
                component={Button}
                onClick={() => setImageDrawer(true)}
              >
                View Bill
              </Typography>
            )}
          </Stack>

          {data?.name !== 'Own Vehicle Expenses' && (
            <Stack direction="row" width="100%">
              <Typography width="20%" className={css.triplabel}>
                Vendor
              </Typography>
              <Typography width="5%" className={css.triplabel}>
                -
              </Typography>
              <Typography sx={{ flexGrow: 1 }} className={css.tripvalue}>
                {data?.vendor_name || '-'}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" width="100%">
            <Typography width="20%" className={css.triplabel}>
              Client
            </Typography>
            <Typography width="5%" className={css.triplabel}>
              -
            </Typography>
            <Typography sx={{ flexGrow: 1 }} className={css.tripvalue}>
              {data?.client_name || '-'}
            </Typography>
          </Stack>
        </Box>

        <Divider />

        <Box margin="12px 20px" component={Stack} gap="12px">
          {/* {!viewDesc && (
          <Typography
            className={css.viewdesc}
            component={Button}
            onClick={() => setViewDesc(true)}
          >
            View Description
          </Typography>
        )} */}

          {/* {viewDesc && ( */}
          <Stack className={css.descwrapper}>
            <Typography className={css.desclabel}>Description</Typography>
            <Typography className={css.desct}>
              {data?.description || '-'}
            </Typography>
          </Stack>
          {/* // )} */}

          {(data?.status === 'paid' ||
            data?.status === 'declined' ||
            data?.status === 'approved') && (
            <CustomizedStepper
              stepperList={activeStepper?.showData}
              active={activeStepper?.active}
            />
          )}
        </Box>

        {/* <Box margin="12px 20px" component={Stack} gap="12px" alignItems="center">
        <Button className={css.secondarybutton}>Follow Up</Button>
      </Box> */}

        {data?.status !== 'paid' &&
          data?.status !== 'approved' &&
          data?.status !== 'declined' && (
            <Stack
              direction="row"
              width="calc(100% - 48px)"
              padding="24px"
              justifyContent="space-between"
            >
              <Button
                className={css.deleteButton}
                onClick={() => {
                  if (
                    userPermissions?.Reimbursement?.['Reimbursement Claims']
                      ?.delete_reimbursement_claim
                  )
                    deleteClick();
                  else setHavePermission(true);
                }}
              >
                <img
                  src={red_color_delete}
                  alt="delete"
                  style={{ width: '14px' }}
                />
                Delete Claim
              </Button>
              <Button
                className={css.editButton}
                onClick={() => {
                  // dispatch(
                  //   getOneReimbursement({
                  //     id: data?.reimbursement_policy_id,
                  //   })
                  // );
                  if (
                    userPermissions?.Reimbursement?.['Reimbursement Claims']
                      ?.edit_reimbursement_claim
                  ) {
                    if (data?.name === 'Own Vehicle Expenses')
                      navigate('/reimbursement-mileage', {
                        state: {
                          data,
                          action: 'update',
                          tab: 'outstanding',
                        },
                      });
                    else {
                      dispatch(
                        getOneReimbursement({
                          id: data?.reimbursement_policy_id,
                        })
                      );

                      navigate('/reimbursement-expense', {
                        state: {
                          data,
                          action: 'update',
                          tab: 'outstanding',
                        },
                      });
                    }
                  } else setHavePermission(true);
                }}
              >
                <DriveFileRenameOutlineIcon sx={{ fontSize: '16px' }} />
                Edit
              </Button>
            </Stack>
          )}

        <Dialog
          open={imageDrawer}
          onClose={() => setImageDrawer(false)}
          PaperProps={{
            elevation: 3,
            style: {
              borderRadius: 16,
              padding: '16px',
            },
          }}
        >
          <ImageUpload
            localState={{ ...data, bill_details: { url: data?.file_url } }}
            style={{ height: '500px', width: '500px' }}
          />
        </Dialog>
      </div>
      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}
    </>
  );
};
