import React, { useEffect, useContext, useState } from 'react';
import Lottie from 'react-lottie';
import { Stack, Typography, Button } from '@mui/material';
import sucessAnimation from '@root/Lotties/payuploadsuccess.json';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';

import FileUpload from '../FileUpload';
import * as css from '../uploadbankdetails.scss';

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

  useEffect(() => {
    if (FileProcess > 0) HandleDataProcessing();
  }, [FileProcess]);

  return (
    <Stack className={css.headupcontainer}>
      <div className={css.baricon} />

      {HoldOnState.Option === 'Vendor' && (
        <>
          {!HoldOnState.Upload ? (
            <Stack className={css.headupwrap}>
              <Typography className={css.headuptitle}>Heads Up</Typography>
              <Typography className={css.headupdesc}>
                {`You are unable to process payments due to ${
                  data.bankless_entities
                }
                 ${
                   data.bankless_entities > 1 ? 'Vendors' : 'Vendor'
                 } because you do not have their bank accounts.`}
              </Typography>
              <Typography className={css.headupinfo}>
                Click here to update Bank Details for these selected vendors.
              </Typography>
              <Stack className={css.headupbtnwrap}>
                <Button
                  className={css.headupnobtn}
                  onClick={() =>
                    setHoldOnState({ ...HoldOnState, Upload: true })
                  }
                >
                  Upload Details
                </Button>
                <Button className={css.headupyesbtn} onClick={onClose}>
                  Peoceed Anyway
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack className={css.fileuploadwrap}>
              <Typography className={css.paytitle}>
                Effortless Payments
              </Typography>
              <Typography className={css.paymsg}>Heads Up</Typography>
              <FileUpload success={HandleSuccess} GetFileID={GetFileID} />
            </Stack>
          )}
        </>
      )}
      {HoldOnState.Option === 'Fileupload' && (
        <Stack className={css.uploadsuccwrap}>
          <Stack className={css.successanimation}>
            <Lottie options={defaultOptionsSuccess} />
          </Stack>
          <Typography className={css.uploadmsg}>Upload Successful</Typography>
          <Typography className={css.uploaddesc}>
            All your Vendors&apos; Bank Details are now up-to-date. You can now
            complete your Vendor Payments.
          </Typography>
        </Stack>
      )}
      {HoldOnState.Option === 'UpStatus' && (
        <Stack className={css.msgwrap}>
          <Typography className={css.msgtitle}>
            {HoldOnState.msgtitle}
          </Typography>
          <Typography className={css.msgupdesc}>
            {HoldOnState.msgdesc}
          </Typography>

          <Stack className={css.msgbtnwrap}>
            <Button className={css.msgnobtn} onClick={onClose}>
              No
            </Button>
            <Button
              className={css.msgyesbtn}
              onClick={() => HandleProceed(HoldOnState.msgid)}
            >
              Yes
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default BankUploads;
