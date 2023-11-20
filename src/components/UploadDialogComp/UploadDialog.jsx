import * as React from 'react';
import * as Mui from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import {
  // RestApi,
  // METHOD,
  BASE_URL,
} from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import { DirectUpload } from '@rails/activestorage';
import * as css from './upload.scss';
import UploadIconDialog from '../../assets/salaryCostUpload.png';

const UploadDialog = (props) => {
  const { open, onClose, title, uploadedData } = props;
  const {
    // organization,
    enableLoading,
    // user,
    openSnackBar,
  } = React.useContext(AppContext);
  const fileref = React.useRef();
  const dragfropref = React.useRef();
  const [uploadSucess, setUploadSucess] = React.useState({
    upload: false,
    id: '',
    name: '',
    type: '',
  });
  const [dialog, setDialog] = React.useState('');
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const onFileUpload = (e, directFile) => {
    const file = directFile ? e : e?.target?.files?.[0];
    setDialog('file');
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    enableLoading(true);
    upload.create((error, blob) => {
      enableLoading(false);
      if (error) {
        openSnackBar(error);
      } else {
        const id = blob?.signed_id;
        const name = blob?.filename;
        const type = blob?.content_type;
        setUploadSucess({ upload: true, name, id, type });
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

  React.useEffect(() => {
    dragfropref?.current?.addEventListener('dragover', HandleFileDrag);
    dragfropref?.current?.addEventListener('drop', HandleFileDrop);

    return () => {
      dragfropref?.current?.removeEventListener('dragover', HandleFileDrag);
      dragfropref?.current?.removeEventListener('drop', HandleFileDrop);
    };
  }, [dragfropref?.current]);

  return (
    <Mui.Dialog
      open={open}
      onClose={() => {
        onClose();
        setDialog('');
        setUploadSucess({ upload: false, id: '', name: '', type: '' });
      }}
      PaperProps={{
        elevation: 3,
        style: {
          borderRadius: 32,
          width: '420px',
          height: 'auto',
        },
      }}
    >
      <div className={css.salaryUpload}>
        <div className={css.header}>
          <p className={css.headerP}>Upload {title || '-'}</p>
          <div
            onClick={() => {
              onClose();
              setDialog('');
              setUploadSucess({ upload: false, id: '', name: '', type: '' });
            }}
            className={css.headerX}
          >
            X
          </div>
        </div>

        {dialog === '' && (
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
              <div className={css.uploadCont} ref={dragfropref}>
                <img
                  src={UploadIconDialog}
                  alt="upload"
                  style={{ width: '60px' }}
                />
                <p className={css.dragP}>Upload {title || '-'}</p>
                <div className={css.browseCont}>
                  <UploadIcon style={{ color: '#fff' }} />
                  <p className={css.browseP}>Browse</p>
                </div>
              </div>
            </label>
          </>
        )}

        {dialog === 'file' && (
          <div className={css.uploadCont}>
            <img alt="img" src={UploadIconDialog} style={{ width: '60px' }} />
            <p className={css.dragP}>Upload In Progress</p>
            <div style={{ width: '80%' }}>
              <Mui.LinearProgress
                variant="determinate"
                value={progress}
                color="warning"
              />
            </div>
          </div>
        )}

        {dialog === 'uploaded' && (
          <div className={css.uploadCont}>
            <img alt="img" src={UploadIconDialog} style={{ width: '60px' }} />
            <p className={css.dragP}>{uploadSucess?.name}</p>
            <p className={css.dragP}>Uploaded Successfully</p>
          </div>
        )}

        <div
          className={css.uploadButton}
          onClick={() => {
            if (uploadSucess?.upload) {
              uploadedData(uploadSucess);
              onClose();
              setDialog('');
              setUploadSucess({ upload: false, id: '', name: '', type: '' });
            }
          }}
        >
          <p className={css.uploadP}>Upload</p>
        </div>
      </div>
    </Mui.Dialog>
  );
};
export default UploadDialog;
