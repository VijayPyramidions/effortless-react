import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import JSBridge from '@nativeBridge/jsbridge';

import { useDispatch } from 'react-redux';
import {
  GetBillBoxBillsState,
  GetVendorBillsCountState,
} from '@action/Store/Reducers/Bills/BillBoxState';

import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { DirectUpload } from '@rails/activestorage';

import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import {
  Box,
  Button,
  Stack,
  Typography,
  Grid,
} from '@mui/material';

import {
  Dialog,
  DialogContent,
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import AppContext from '@root/AppContext.jsx';
import { Document, Page } from 'react-pdf'
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import * as css from './billboxscan.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const BillBoxScan = ({ setBillScan }) => {
  const { organization, registerEventListeners, deRegisterEventListener } =
    useContext(AppContext);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [drawer, setDrawer] = useState({});
  const [billState, setBillState] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [response, setRespone] = useState({});

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const getOcrData = (id) => {
    dispatch(enableLoading(true));
    axiosInst
      .post(`organizations/${organization.orgId}/vendor_bills?ocr=true`, {
        file: id,
        scanned: true,
      })
      .then((res) => {
        if (res && !res?.data?.error) {
          setRespone(res?.data);
          setBillState((prev) => ({ ...prev, billUrl: res?.data?.file_url }));
          dispatch(enableLoading(false));
        } else {
          dispatch(enableLoading(false));
          const errorValues = Object.values(res?.data?.errors);
          dispatch(
            openSnackbar({
              message: errorValues.join(', '),
              type: 'error',
            })
          );
          setBillState({});
          setRespone({});
        }
      })
      .catch((e) => {
        console.log('getOcrDataError', e);
        dispatch(
          openSnackbar({
            message: 'Unknown error occured',
            type: 'error',
          })
        );
        setBillScan(false);
        handleDrawer('uploadType', false);
        dispatch(enableLoading(false));
      });
  };

  const onFileUpload = (e, directFile) => {
    const file = directFile ? e : e?.target?.files?.[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    dispatch(enableLoading(true));
    upload.create((error, blob) => {
      dispatch(enableLoading(false));
      if (error) {
        dispatch(
          openSnackbar({
            message: error,
            type: 'error',
          })
        );
      } else {
        const id = blob?.signed_id;
        const name = blob?.filename;
        const type = blob?.content_type;
        setBillState((prev) => ({
          ...prev,
          billName: name,
          billType: type,
          billId: id,
        }));
        getOcrData(id);
      }
    });
  };

  const fillOcrByFirebaseML = async (res) => {
    res?.preventDefault();
    const resp = JSON.parse(res.detail.value);
    console.log(resp, 'resp');
    const {
      base64: base64Arg,
      filename: filenameArg,
      idDocType: fileType,
    } = resp;

    // Call ML API OCR Data while getting base64 from native

    if (base64Arg) {
      const base64Str = `data:${fileType};base64,${base64Arg}`;
      const fetchRes = await fetch(base64Str);
      const blob = await fetchRes.blob();
      // eslint-disable-next-line no-undef
      const file = new File([blob], filenameArg, { type: fileType });
      onFileUpload(file, true);
    }
  };

  useEffect(() => {
    registerEventListeners({ name: 'BillboxOcr', method: fillOcrByFirebaseML });
    return () =>
      deRegisterEventListener({
        name: 'BillboxOcr',
        method: fillOcrByFirebaseML,
      });
  }, []);

  useEffect(() => {
    if (billState?.billUrl) {
      handleDrawer('uploadType', false);
      handleDrawer('billViewDialog', true);
    }
  }, [billState]);
  return (
    <>
      {/* <SelectBottomSheet
        open={drawer?.uploadType}
        onClose={() => {
          setBillScan(false);
          handleDrawer('uploadType', false);
        }}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <Puller />
        <Box className={css.upload_type}>
          <Typography className={css.headcont}>Bill Upload</Typography>
          <Stack direction="row" justifyContent="space-between" p="0 20px">
            <input
              id="upload"
              name="avatar"
              type="file"
              hidden
              accept="image/png, image/jpeg, application/pdf"
              onChange={onFileUpload}
            />
            <Button
              className={css.primaryButton}
              onClick={() => JSBridge.ocrByScan('ocrDetails')}
            >
              Scan
            </Button>

            {window.isDevice() === true ? (
              <Button
                className={css.primaryButton}
                onClick={() => JSBridge.ocrByBrowse('ocrDetails')}
              >
                Browse
              </Button>
            ) : (
              <label className={css.primaryButton} htmlFor="upload">
                Browse
              </label>
            )}
          </Stack>
        </Box>
      </SelectBottomSheet> */}

      <Dialog
        fullScreen
        open={drawer?.billViewDialog}
        // onClose={() => {
        //   handleDrawer('billViewDialog', false);
        // }}
        PaperProps={{
          elevation: 3,
          style: {
            width: '100%',
            height: billState?.billUrl?.includes('.pdf') ? '100%' : '',
            overflow: 'visible',
            cursor: 'pointer',
            background: '#fff',
          },
        }}
      >
        <DialogContent style={{ position: 'relative' }}>
          <Grid className={css.iframeViewDocument}>
            {billState?.billUrl?.includes('.jpeg') ||
            billState?.billUrl?.includes('.png') ||
            billState?.billUrl?.includes('.pdf') === false ? (
              <img
                src={billState?.billUrl}
                alt="upload"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                <Document
                  file={billState?.billUrl}
                  className={css.pdfStyle}
                  loading="  "
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={i} className={css.page} />
                </Document>
              ))
            )}
          </Grid>
        </DialogContent>
      </Dialog>

      <SelectBottomSheet
        open={drawer?.billViewDialog}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <Puller />
        <Box className={css.upload_type}>
          <Typography className={css.headcont}>Choose One</Typography>
          <Stack gap="20px" p="0 56px 20px">
            <Button
              className={css.primaryButton}
              onClick={() => {
                deRegisterEventListener({
                  name: 'BillboxOcr',
                  method: fillOcrByFirebaseML,
                });
                setBillScan(false);
                navigate('/bill-upload', {
                  state: {
                    continueFlow: {
                      name: 'billBoxScan',
                      selected: response,
                      billState,
                    },
                  },
                });
              }}
              sx={{ borderRadius: '8px !important' }}
            >
              Record Expense Now
            </Button>

            <Button
              className={css.secondarybutton}
              onClick={() => {
                deRegisterEventListener({
                  name: 'BillboxOcr',
                  method: fillOcrByFirebaseML,
                });
                dispatch(
                  GetBillBoxBillsState({
                    scanned: true,
                  })
                );
                dispatch(GetVendorBillsCountState());
                dispatch(
                  openSnackbar({
                    message: 'Your Bill Has been Saved',
                    type: 'info',
                  })
                );
                setBillScan(false);
              }}
              sx={{ borderRadius: '8px !important' }}
            >
              Save For Later
            </Button>
          </Stack>
        </Box>
      </SelectBottomSheet>
    </>
  );
};

export default BillBoxScan;
