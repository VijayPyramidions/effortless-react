import React, { useEffect, useContext, useState } from 'react';
import Lottie from 'react-lottie';
import { Button, Stack, Typography } from '@mui/material';
// import sucessAnimation from '@root/Lotties/payuploadsuccess.json';
import sucessAnimation from '@root/Lotties/paymentSucess.json';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import * as css from './uploadbankdetails.scss';
import FileUpload from './FileUpload';

const msgs = [
  {
    id: 1,
    msgtitle: 'Oh No!...',
    msgdesc:
      "We are unable to update all your Vendors' Bank Details. Please try again.",
  },
  {
    id: 2,
    msgtitle: 'Please Note...',
    msgdesc:
      'We were able to only partially update your Vendor Bank Details. You can try again or proceed to making payments.',
  },
];

const BankUploads = ({ onClose, data, RefreshVouchers }) => {
  const InitialState = {
    Upload: false,
    Option: 'Vendor',
    FileProcessId: 0,
    msgpopup: false,
    msgid: '',
    msgtitle: '',
    msgdesc: '',
  };
  const { organization, user, enableLoading, openSnackBar } =
    useContext(AppContext);
  const [HoldOnState, setHoldOnState] = useState(InitialState);
  const [FileProcess, setFileProcess] = useState(0);

  const defaultOptionsSuccess = {
    loop: true,
    autoplay: true,
    animationData: sucessAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const HandleSuccess = (val) => {
    if (val === 'partial_success')
      setHoldOnState({
        ...HoldOnState,
        Option: 'UpStatus',
        msgid: msgs[0].id,
        msgtitle: msgs[0].msgtitle,
        msgdesc: msgs[0].msgdesc,
      });
    else if (val === 'success')
      setHoldOnState({ ...HoldOnState, Option: 'Fileupload' });
    else if (val === 'failed')
      setHoldOnState({
        ...HoldOnState,
        Option: 'UpStatus',
        msgid: msgs[1].id,
        msgtitle: msgs[1].msgtitle,
        msgdesc: msgs[1].msgdesc,
      });
  };

  const GetFileID = (id) => {
    setHoldOnState({
      ...HoldOnState,
      FileProcessId: id,
    });
  };

  const HandleDataProcessing = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/data_uploads/${HoldOnState.FileProcessId}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res?.error) {
          if (res.status === 'processing') setFileProcess((prev) => prev + 1);
          else if (res.status === 'partial_success')
            HandleSuccess('partial_success');
          else if (res.status === 'success') HandleSuccess('success');
          else if (res.status === 'failed') HandleSuccess('failed');
        } else openSnackBar(res?.message, MESSAGE_TYPE.ERROR);
      })
      .catch((e) => {
        openSnackBar(e.message, MESSAGE_TYPE.ERROR);
      });
  };

  const HandleProceed = (opt) => {
    if (Number(opt) === 0) HandleDataProcessing();
    else RefreshVouchers();
  };
  // const Dialog = withStyles({
  //   root: {
  //     '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
  //       backgroundColor: 'transparent',
  //       boxShadow: 'none',
  //       marginBottom: 60,
  //       marginRight: 24,
  //     },
  //     '& .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop': {
  //       background: 'transparent',
  //     },
  //     '& .css-hz1bth-MuiDialog-container': {
  //       justifyContent: 'end',
  //       alignItems: 'end',
  //     },
  //   },
  // })(Mui.Dialog);

  useEffect(() => {
    if (FileProcess > 0) HandleDataProcessing();
  }, [FileProcess]);

  return (
    <>
      <Stack className={css.holdonwrapper}>
        {HoldOnState.Option === 'Vendor' && (
          <Stack className={`${css.uploadfiles} ${css.HoldOn}`}>
            <Typography className={css.paytitle}>
              Effortless Payments
            </Typography>
            <Typography className={css.paymsg}>Hold On!</Typography>

            {!HoldOnState.Upload ? (
              <>
                <Typography className={css.paydiscription}>
                  {`You are unable to process payments due to ${
                    data.bankless_entities
                  }
                 ${
                   data.bankless_entities > 1 ? 'Vendors' : 'Vendor'
                 } because you do not have their bank accounts.`}
                </Typography>
                <Stack className={css.paybtnwrapper}>
                  <Button
                    className={css.paybtnno}
                    onClick={() =>
                      setHoldOnState({ ...HoldOnState, Upload: true })
                    }
                  >
                    Upload Details
                  </Button>
                  <Button className={css.paybtnyes} onClick={onClose}>
                    Proceed Anyway
                  </Button>
                </Stack>
              </>
            ) : (
              <FileUpload
                success={HandleSuccess}
                GetFileID={GetFileID}
                vendorIds={data.bankless_entity_ids}
                excel
              />
            )}
          </Stack>
        )}
        {HoldOnState.Option === 'Fileupload' && (
          <Stack
            sx={{ backgroundColor: '#FFFFFF' }}
            className={`${css.successwrap} ${css.contsucc}`}
          >
            <Stack className={css.successanimation}>
              <Lottie options={defaultOptionsSuccess} />
            </Stack>
            <Typography className={css.uploadmsg}>Upload Successful</Typography>
            <Typography className={css.uploaddesc}>
              All your Vendors&apos; Bank Details are now up-to-date. You can
              now complete your Vendor Payments.
            </Typography>
          </Stack>
        )}
        {/* <Dialog
        open={HoldOnState.msgpopup}
        onClose={() => setHoldOnState({ ...HoldOnState, msgpopup: false })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      > */}
        {HoldOnState.Option === 'UpStatus' && (
          <Stack className={css.msgpopupwrap}>
            <Typography className={css.msgpopuptitle}>
              {/* {HoldOnState.msgtitle} */}
              {msgs[1].msgtitle}
            </Typography>
            <Typography className={css.msgpopupdesc}>
              {/* {HoldOnState.msgdesc} */}
              {msgs[1].msgdesc}
              {}
            </Typography>
            <Stack className={css.msgbtnwrap}>
              <Button className={css.msgnobtn} onClick={onClose}>
                No
              </Button>
              <Button
                className={css.msgyesbtn}
                onClick={() => HandleProceed(msgs.msgid)}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        )}
        {/* </Dialog> */}
      </Stack>
    </>
  );
};

export default BankUploads;
