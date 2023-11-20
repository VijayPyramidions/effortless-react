import React, {useRef, useEffect, useState} from "react";
import { useDispatch } from 'react-redux';
import {Box, Button, Dialog, Stack,LinearProgress} from '@mui/material';
import { DirectUpload } from '@rails/activestorage';
import { BASE_URL } from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import bankingcloudupload from '../../../../assets/banking_cloud-upload.svg';
import * as css from './CategorizationCenter.scss';

const EMISchdeuleCategorization = ({setCategorizationState}) => {
  const device = localStorage.getItem('device_detect');
  const fileref = useRef();
  const dragfropref = useRef();
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState({});
  const [dialog, setDialog] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress > 90 && oldProgress < 99) {
          return 98;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const drawerAction = (name, action) => { 
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };
  
  const onFileUpload = async (e, directFile) => {
    const file = directFile ? e : e?.target?.files?.[0];
    setDialog('file');
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    dispatch(enableLoading(true));
    await upload.create((error, blob) => {
      dispatch(enableLoading(false));
      if (error) {
        console.log(error);
      } else {
        const id = blob?.signed_id;
        const name = blob?.filename;
        const type = blob?.content_type;
        drawerAction('uploadSuccess', true);
        setUploadedFile({ name, id, type });
        console.log({ name, id, type });
        setCategorizationState(prev => ({...prev,file:{name,id,type}}));
        setDialog('uploaded');
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

      {(dialog === '' || dialog === 'file') && <label htmlFor="file">
      <Box className={dialog === 'file' && device === 'desktop' ? `${css.salaryandwagescategorization} ${css.uploadDone}` : css.salaryandwagescategorization} ref={dragfropref}  style={{height: device === 'mobile' && 'auto', padding: device === 'mobile' && '15px 0'}}>
        <Stack alignItems="center">
        <img
                src={bankingcloudupload}
                alt="upload"
                style={{ width: '60px' }}
          />
          <p className={css.uploadtext}>Upload EMI Schedule Sheet</p>

          <Button onClick={() => fileref.current.click()} className={css.primaryButton}><FileUploadIcon /> Browse</Button>
        </Stack>
        </Box>
      </label>}

      {dialog === 'uploaded' && 
      <Box className={dialog === 'file' && device === 'desktop' ? `${css.salaryandwagescategorization} ${css.uploadDone}` : css.salaryandwagescategorization} ref={dragfropref}  style={{height: device === 'mobile' && 'auto', padding: device === 'mobile' && '15px 0'}}>
        <Stack alignItems="center" gap='5%'>
        <img
                src={bankingcloudupload}
                alt="upload"
                style={{ width: '60px' }}
          />
          <p className={css.uploadtext}>Successfully EMI Schedule Sheet Uploaded</p>

          <p className={css.uploadtext}>{uploadedFile?.name}</p>
            
        </Stack>
        </Box>}

        {dialog === 'file' && (
        <div className={css.thirdRow}>
          <p className={css.dragP}>Uploading</p>
          <div style={{ width: '100%', margin: '10px 0' }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color="warning"
            />
          </div>
        </div>
      )}

      <Dialog
        open={drawer.uploadSuccess && device === 'desktop'}
        onClose={() => drawerAction('uploadSuccess', false)}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: 32,
            width: '420px',
            height: 'auto',
          },
        }}
      >
        <div className={css.successDialog}>
          <div className={css.header}>
            <p className={css.headerP}>Heads Up !</p>
            <div
              onClick={() => {
                drawerAction('uploadSuccess', false);
              }}
              className={css.headerX}
            >
              X
            </div>
          </div>
          <div>
            <p className={css.descriptiontext}>Thanks for sharing these details with us.</p>

            <p className={css.descriptiontext}>
            Our SuperAccountant will be in touch with you shortly to ensure that your Salary Transaction has been accurately categorized.
            </p>

            <Button
              onClick={() => {
                drawerAction('uploadSuccess', false);
              }}
              className={css.primaryButton}>Continue</Button>
          </div>
        </div>
      </Dialog>

      <SelectBottomSheet
        open={drawer.uploadSuccess && device === 'mobile'}
        onClose={() => drawerAction('uploadSuccess', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <div className={css.successDialog}>
          <div className={css.header}>
            <p className={css.headerP}>Heads Up !</p>
            <div
              onClick={() => {
                drawerAction('uploadSuccess', false);
              }}
              className={css.headerX}
              style={{background: '#FFF'}}
            >
              X
            </div>
          </div>
          <div>
            <p className={css.descriptiontext}>Thanks for sharing these details with us.</p>

            <p className={css.descriptiontext}>
            Our SuperAccountant will be in touch with you shortly to ensure that your Salary Transaction has been accurately categorized.
            </p>

            <Button
              onClick={() => {
                drawerAction('uploadSuccess', false);
              }}
              sx={{marginTop: '65px !important'}}
              className={css.primaryButton}>Continue</Button>
          </div>
        </div>
      </SelectBottomSheet>
        </>);
};
 
export default EMISchdeuleCategorization;
