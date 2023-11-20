import React, { useEffect, useContext, useRef, useState } from 'react';
import Uploadimg from '@assets/featherupload.svg';
import filePng from '@assets/file.png';
import JSBridge from '@nativeBridge/jsbridge';
import { Button, Stack, Typography } from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { BASE_URL, METHOD } from '@services/RestApi.jsx';
import { DirectUpload } from '@rails/activestorage';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import excelIcon from '@assets/excel.svg';
import * as css from './uploadbankdetails.scss';

const FileUpload = ({ success, GetFileID, vendorIds, excel }) => {
  const { organization, user, enableLoading, openSnackBar } =
    useContext(AppContext);

  const fileref = useRef();
  const dragfropref = useRef();
  const device = localStorage.getItem('device_detect');

  const InitialState = {
    FileName: '',
    FileUploadID: '',
    FileProcessId: '',
    FileLoadPercentage: 35,
  };
  const [FileState, setFileState] = useState(InitialState);
  const [FileUploadOpt, setFileUploadOpt] = useState(false);
  const [FileProcess, setFileProcess] = useState(0);
  const HanldeFileUpload = (e) => {
    setFileState({
      ...FileState,
      FileName: e.target.files[0].name,
    });
    setFileUploadOpt(true);
    enableLoading(true);
    const file = e?.target?.files[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    upload.create((error, blob) => {
      if (error) {
        openSnackBar({ message: error?.message, type: MESSAGE_TYPE.ERROR });
      } else {
        enableLoading(false);

        setFileState({
          ...FileState,
          FileUploadID: blob?.signed_id,
          FileName: blob?.filename,
          FileLoadPercentage: 100,
        });
        GetFileID(blob?.signed_id);
      }
    });
  };

  const ClearFile = () => {
    setFileState(InitialState);
    GetFileID(0);
    setFileUploadOpt(false);
  };

  const Onbrowse = () => {
    if (device === 'desktop') fileref.current.click();
    else JSBridge.ocrByBrowse();
  };

  const HandleFileDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const HandleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileState({
      ...FileState,
      FileName: e.dataTransfer.files[0].name,
    });

    const file = e.dataTransfer.files[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);

    setFileUploadOpt(true);
    enableLoading(true);
    upload.create((error, blob) => {
      enableLoading(false);
      if (error) {
        openSnackBar({ message: error?.message, type: MESSAGE_TYPE.ERROR });
      } else {
        enableLoading(false);

        setFileState({
          ...FileState,
          FileUploadID: blob?.signed_id,
          FileName: blob?.filename,
          FileLoadPercentage: 100,
        });
      }
    });
  };

  const HanldeTempDownLoad = () => {
    enableLoading(true);
    fetch(`${BASE_URL}/organizations/${organization.orgId}/bank_details.xlsx`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: { vendor_ids: vendorIds },
    })
      .then((response) => response.blob())
      .then((blob) => {
        enableLoading(false);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  const OnSubmit = async () => {
    enableLoading(true);

    await RestApi(`organizations/${organization.orgId}/bank_details/upload`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        file: FileState.FileUploadID,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res?.error) {
          setFileState({ ...FileState, FileProcessId: res.id });
          if (res.status === 'processing') setFileProcess((prev) => prev + 1);
          else if (res.status === 'partial_success') success('partial_success');
          else if (res.status === 'success') success('success');
          else if (res.status === 'failed') success('failed');
        } else
          openSnackBar({ message: res?.message, type: MESSAGE_TYPE.ERROR });
      })
      .catch((e) => {
        openSnackBar({ message: e.message, type: MESSAGE_TYPE.ERROR });
      });
  };

  const HandleDataProcessing = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/data_uploads/${FileState.FileProcessId}`,
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
          else if (res.status === 'partial_success') success('partial_success');
          else if (res.status === 'success') success('success');
          else if (res.status === 'failed') success('failed');
        } else
          openSnackBar({ message: res?.message, type: MESSAGE_TYPE.ERROR });
      })
      .catch((e) => {
        openSnackBar({ message: e.message, type: MESSAGE_TYPE.ERROR });
      });
  };

  useEffect(() => {
    if (FileProcess > 0 && FileProcess < 4) HandleDataProcessing();
  }, [FileProcess]);

  // useEffect(() => {
  //   if (FileState.FileName !== '' && FileState.FileLoadPercentage < 100) {
  //     setTimeout(() => {
  //       setFileState({
  //         ...FileState,
  //         FileLoadPercentage: FileState.FileLoadPercentage + 20,
  //       });
  //     }, 500);
  //   }
  // }, [FileUploadOpt, FileState.FileLoadPercentage]);

  useEffect(() => {
    dragfropref?.current?.addEventListener('dragover', HandleFileDrag);
    dragfropref?.current?.addEventListener('drop', HandleFileDrop);

    return () => {
      dragfropref?.current?.removeEventListener('dragover', HandleFileDrag);
      dragfropref?.current?.removeEventListener('drop', HandleFileDrop);
    };
  }, []);

  return (
    <Stack className={css.FileUpload}>
      <input
        ref={fileref}
        type="file"
        name="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={HanldeFileUpload}
        hidden
      />
      {FileUploadOpt ? (
        <>
          <Stack className={css.filenamewrap}>
            <Stack className={css.fileicon}>
              <img src={excel ? excelIcon : filePng} alt="download" />
            </Stack>
            <Stack className={css.filenmprogwrap}>
              <Typography className={css.filename}>
                {FileState.FileName}
              </Typography>
              <Stack className={css.progress}>
                <Stack
                  className={css.progress_1}
                  sx={{ width: `${FileState.FileLoadPercentage}%` }}
                />
              </Stack>
              <Typography
                className={css.percentage}
              >{`${FileState.FileLoadPercentage} %`}</Typography>
            </Stack>
            <span className={css.clearFile} onClick={ClearFile}>
              <CloseRoundedIcon />
            </span>
          </Stack>
        </>
      ) : (
        <>
          <label htmlFor="file">
            <Stack
              className={css.payuploadcontainer}
              ref={dragfropref}
              sx={
                device === 'desktop'
                  ? { marginBottom: '32px' }
                  : { marginBottom: '24px' }
              }
            >
              <img src={Uploadimg} alt="upload" style={{ width: '88.92px' }} />
              <Typography className={css.payvendortext}>
                Upload Vendor Bank details
              </Typography>
              <Typography className={css.paydroptext}>Drag and Drop</Typography>
              <Button className={css.paybrowsebtn} onClick={Onbrowse}>
                Browse
              </Button>
            </Stack>
          </label>
        </>
      )}
      <Button className={css.paytempdownload} onClick={HanldeTempDownLoad}>
        Download Template
      </Button>
      <Stack sx={device === 'desktop' && { paddingLeft: '8px' }}>
        <Typography className={css.payhdiscription_1}>
          Effortless Recommends:
        </Typography>
        <Typography className={css.paydiscription_1}>
          Due to the significantly high number of Vendors whose bank details
          need to be updated, we recommend you share them via an excel file.
        </Typography>
      </Stack>
      <Button
        sx={
          device === 'desktop'
            ? { margin: '0 51px 3px' }
            : { margin: '0 14px 11px' }
        }
        className={css.paysavebtn}
        onClick={OnSubmit}
      >
        Save Bank Details
      </Button>
    </Stack>
  );
};

export default FileUpload;
