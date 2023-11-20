import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetVendorBillDetailsState,
  ClearStateGetVendorBillDetails,
} from '@action/Store/Reducers/Bills/BillBoxState';

import {
  Box,
  Stack,
  Typography,
  Button,
  Dialog,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';

import view_bills from '@assets/BillsLogo/view_bills.svg';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import * as css from '../UploadYourBillContainer.scss';

const MultipleBillsRecord = ({ multipleBills, setMultipleBills, stateFromUpload }) => {
  const navigate = useNavigate();
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const dispatch = useDispatch();
  const { VendorBillDetails } = useSelector((value) => value.BillBox);

  const handleRemoveClick = (id) => {
    const tempBills = multipleBills?.bills?.filter(
      (val) => val !== id,
    );
    if (tempBills?.length === 0) {
      navigate('/bill-box-email', { state: stateFromUpload?.stateForBack });
    } else {
      setMultipleBills({
        ...multipleBills,
        bills: tempBills,
        selectedBill: tempBills?.[0],
        selectedBillState: {},
      });
      navigate('/bill-upload', {
        state: {
          ...stateFromUpload, multipleBills: tempBills, selected: VendorBillDetails
        },
      },
      );
    }
   };

  useEffect(() => {
    if (
      multipleBills?.selectedBill &&
      Object.keys(multipleBills?.selectedBillState || {})?.length === 0
    ) {
      dispatch(
        GetVendorBillDetailsState({ bill_id: multipleBills?.selectedBill })
      );
    }
  }, [multipleBills?.selectedBill]);

  useEffect(() => {
    if (Object.keys(VendorBillDetails || {})?.length > 0) {
      setMultipleBills({
        ...multipleBills,
        selectedBillState: VendorBillDetails,
      });
      dispatch(ClearStateGetVendorBillDetails());
    }
  }, [VendorBillDetails]);

  useEffect(() => {
    return () => {
      dispatch(ClearStateGetVendorBillDetails());
    };
  }, []);

  return (
    <>
      <Stack
        sx={{
          borderTop: '1px solid #E4E4E4',
          height: desktopView ? '64px' : 'auto',
          width: desktopView ? 'calc(100% - 40px)' : 'calc(100% - 16px)',
          overflow: 'auto',
        }}
        gap="16px"
        direction="row"
        alignItems="center"
        padding={desktopView ? '0 20px' : '8px 8px 0'}
      >
        {multipleBills?.bills?.map((val, index) => (
          <Stack alignItems='center' direction='row' 
          sx={{
            opacity: val === multipleBills?.selectedBill ? 1 : 0.5,
            minWidth: 'auto',
            background: desktopView
              ? 'rgba(132, 129, 138, 0.10) !important'
              : 'rgb(216 216 216) !important',
          }}
          className={css.multiplebillbox}>
            <Box
            className={css.multiplebillboxtext}
            onClick={() =>
              setMultipleBills({
                ...multipleBills,
                selectedBill: val,
                selectedBillState: {},
              })
            }
            component={Button}
          >
            <img
              src={view_bills}
              alt="viewBill"
              style={{ width: '14px', height: '14px' }}
            />
            <>Bill {index + 1}</>
          </Box>
            <IconButton style={{ padding: '2px' }} onClick={() => handleRemoveClick(val)}>
              <HighlightOffIcon  style={{  fontSize: '16px' }} />
            </IconButton>
            </Stack>
        ))}
      </Stack>
    </>
  );
};

export default MultipleBillsRecord;

export const MultipleBillSuccessDialog = ({ setState, multipleBills }) => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const SuccessCont = () => (
    <div className={css.successcontentmultiple}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.deletehead}>Bill Status</Typography>
      </Stack>

      <Typography className={css.descriptiontext}>
        Bill{' '}
        {multipleBills?.previousState?.indexOf(multipleBills?.previousId || 0) +
          1}{' '}
        successfully recorded in Effortless! <br />
        {Number(multipleBills?.state?.length) -
          Number(multipleBills?.data?.bills?.length)}{' '}
        out of {multipleBills?.state?.length} bills recorded.
      </Typography>

      <Stack alignItems="center" justifyContent="center">
        <Button className={css.primaryButton} onClick={() => setState({})}>
          Next Bill
        </Button>
      </Stack>
    </div>
  );

  return desktopView ? (
    <Dialog
      open
      onClose={() => setState({})}
      PaperProps={{ style: { width: 400, borderRadius: 12 } }}
    >
      <SuccessCont />
    </Dialog>
  ) : (
    <SelectBottomSheet
      open
      onClose={() => setState({})}
      triggerComponent={<div style={{ display: 'none' }} />}
      addNewSheet
    >
      <SuccessCont />
    </SelectBottomSheet>
  );
};
