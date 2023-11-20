import React, { useState, useEffect, useRef, useContext } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import AppContext from '@root/AppContext.jsx';
import { Box, Typography, Stack, Button } from '@mui/material';

import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { DirectUpload } from '@rails/activestorage';

import Input from '@components/Input/Input.jsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import featherupload from '../../../assets/feather_upload-cloud.svg';

// import { customCurrency } from '@components/formattedValue/FormattedValue';

import * as css from './salarycost.scss';

const SalaryCostAction = () => {
  const { organization } = useContext(AppContext);

  const dispatch = useDispatch();

  const [localState, setLocalState] = useState({
    date: moment().format('MMMM, YYYY'),
  });

  const fileref = useRef();
  const dragfropref = useRef();
  const [uploadSucess, setUploadSucess] = useState({
    upload: false,
    id: '',
    name: '',
    type: '',
  });

  const salaryFileUpload = () => {
    if (uploadSucess?.id === '') {
      console.log(localState);
      dispatch(
        openSnackbar({
          message: 'Upload Salary Cost file.',
          type: 'error',
        })
      );
      return;
    }
    dispatch(enableLoading(true));
    const tempDate = `01 ${localState?.date?.month.toLocaleString('default', {
      month: 'short',
    })} ${moment(localState?.date?.year).format('YYYY')}`;

    axiosInst
      .post(`organizations/${organization.orgId}/salary_costs`, {
        file: uploadSucess?.id,
        salary_month: tempDate,
      })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setUploadSucess((prev) => ({ ...prev, upload: true }));
        } else {
          dispatch(
            openSnackbar({
              message:
                Object.values(res?.errors).join() || 'Unknown Error Occured',
              type: 'error',
            })
          );
        }
      })
      .catch((e) => {
        dispatch(enableLoading(false));
        dispatch(
          openSnackbar({
            message: Object.values(e?.errors).join() || 'Unknown Error Occured',
            type: 'error',
          })
        );
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
            message: 'Unknown error occured',
            type: 'error',
          })
        );
      } else {
        const id = blob?.signed_id;
        const name = blob?.filename;
        const type = blob?.content_type;
        setUploadSucess((prev) => ({ ...prev, name, id, type }));
      }
    });
  };

  const HandleFileDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const HandleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    onFileUpload(file, true);
  };

  useEffect(() => {
    dragfropref?.current?.addEventListener('dragover', HandleFileDrag);
    dragfropref?.current?.addEventListener('drop', HandleFileDrop);

    return () => {
      dragfropref?.current?.removeEventListener('dragover', HandleFileDrag);
      dragfropref?.current?.removeEventListener('drop', HandleFileDrop);
    };
  }, [dragfropref?.current]);

  return (
    <Box className={css.salarycostaction}>
      <Typography className={css.titlecont}>Upload Salary Cost</Typography>
      <Typography className={css.descriptioncont}>
        Set up your Monthly Payment.
      </Typography>

      <Stack>
        <Box sx={{ padding: '0 32px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="date"
              id="dateForDesktop"
              inputFormat="MMMM, YYYY"
              InputProps={{ disableUnderline: true }}
              value={
                localState?.date
                  ? moment(localState?.date).format('MMMM, YYYY')
                  : ''
              }
              onChange={(e) => {
                setLocalState((prev) => ({
                  ...prev,
                  date: e?.$d,
                }));
              }}
              views={['month', 'year']}
              renderInput={(params) => (
                <Input
                  {...params}
                  required
                  label="Month & Year"
                  variant="standard"
                  name="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid rgba(153, 158, 165, 0.39)',
                    borderRadius: '12px',
                    background: '#ededed26',
                  }}
                  // error={validationErr?.date}
                  // helperText={
                  //   validationErr?.date ? 'Enter Valid Document Date' : ''
                  // }
                  // disabled={}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Stack gap="12px" mt="24px">
          <Typography className={css.labelcont}>
            Upload your Salary Cost
          </Typography>

          {uploadSucess?.id === '' && (
            <>
              <input
                type="file"
                ref={fileref}
                name="file"
                id="file"
                className="inputfile"
                accept="image/png, image/jpeg, application/pdf"
                onChange={onFileUpload}
                hidden
              />
              <label htmlFor="file">
                <div className={css.secondRow} ref={dragfropref}>
                  <img
                    src={featherupload}
                    alt="upload"
                    style={{ width: '24px', height: '24px' }}
                  />
                  <Typography className={css.typeP}>JPG, PNG or PDF</Typography>
                  <div className={css.browseCont}>
                    <Typography className={css.browseP}>Browse</Typography>
                  </div>
                </div>
              </label>
            </>
          )}

          {uploadSucess?.id && uploadSucess?.name && (
            <div className={css.secondRow}>
              <img
                src={featherupload}
                alt="upload"
                style={{ width: '24px', height: '24px' }}
              />
              <p className={css.uploadP}>Successfully Salary Cost Uploaded</p>
              <p className={css.typeP}>{uploadSucess?.name}</p>
            </div>
          )}
        </Stack>

        <Stack sx={{ padding: '24px 40px' }}>
          <Button
            className={css.primaryButton}
            onClick={() => salaryFileUpload()}
          >
            Send for Superaccountant
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SalaryCostAction;
