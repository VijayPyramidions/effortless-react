import * as React from 'react';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import moment from 'moment';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import sucessAnimation from '@root/Lotties/paymentSucess.json';
import Lottie from 'react-lottie';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import { DirectUpload } from '@rails/activestorage';
import featherupload from '../../../assets/featherupload.svg';
import * as css from './salarycost.scss';

const defaultOptionsSuccess = {
  loop: true,
  autoplay: true,
  animationData: sucessAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const SalaryCost = () => {
  const { organization, enableLoading, user, openSnackBar } =
    React.useContext(AppContext);
  const navigate = Router.useNavigate();
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
  const [selected, setSelected] = React.useState({
    month: new Date(),
    year: new Date(),
  });

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

  const salaryFileUpload = () => {
    enableLoading(true);
    const tempDate = `01 ${selected?.month.toLocaleString('default', {
      month: 'short',
    })} ${moment(selected?.year).format('YYYY')}`;

    RestApi(`organizations/${organization.orgId}/salary_costs`, {
      method: METHOD.POST,
      payload: {
        file: uploadSucess?.id,
        salary_month: tempDate,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setUploadSucess((prev) => ({ ...prev, upload: true }));
        } else {
          openSnackBar({
            message:
              Object.values(res?.errors).join() || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((e) => {
        enableLoading(false);
        openSnackBar({
          message: Object.values(e?.errors).join() || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

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
        setUploadSucess((prev) => ({ ...prev, name, id, type }));
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

  const onMonthChange = (e) => {
    setSelected({ month: e.toDate(), year: e.toDate() });
  };

  const onYearChange = (e) => {
    setSelected({
      month: selected?.month,
      year: e.format('yyyy'),
    });
  };

  return (
    <div className={css.salaryCost}>
      <p className={css.headerP}>Salary Cost</p>

      <div className={css.firstRow}>
        <div className={css.month}>
          <div className={css.inner}>
            <p className={css.top}>Month</p>
            <p className={css.bottom}>
              {selected?.month.toLocaleString('default', { month: 'long' })}
            </p>
          </div>
          <OnlyDatePicker
            selectedDate={
              new Date(
                moment(selected?.year).format('YYYY'),
                new Date(selected?.month).getMonth(),
                new Date().getDate(),
              )
            }
            onChange={onMonthChange}
            id="month"
          />
        </div>
        <div className={css.year}>
          <div className={css.inner}>
            <p className={css.top}>Year</p>
            <p className={css.bottom}>
              {moment(selected?.year).format('YYYY')}
            </p>
          </div>
          <OnlyDatePicker
            selectedDate={selected?.year}
            onChange={onYearChange}
            id="year"
          />
        </div>
      </div>

      {(dialog === '' || dialog === 'file') && (
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
                style={{ width: '120px' }}
              />
              <p className={css.uploadP}>Upload Your Salary Cost</p>
              <p className={css.typeP}>JPG, PNG or PDF</p>
              <div className={css.browseCont}>
                <p className={css.browseP}>Browse</p>
              </div>
            </div>
          </label>
        </>
      )}

      {dialog === 'file' && (
        <div className={css.thirdRow}>
          <p className={css.dragP}>Uploading</p>
          <div style={{ width: '100%', margin: '10px 0' }}>
            <Mui.LinearProgress
              variant="determinate"
              value={progress}
              color="warning"
            />
          </div>
        </div>
      )}

      {dialog === 'uploaded' && (
        <div className={css.secondRow}>
          <img src={featherupload} alt="upload" style={{ width: '120px' }} />
          <p className={css.uploadP}>Successfully Salary Cost Uploaded</p>
          <p className={css.typeP}>{uploadSucess?.name}</p>
        </div>
      )}

      {dialog === 'uploaded' && (
        <div className={css.uploadButton} onClick={() => salaryFileUpload()}>
          <p className={css.uploadP}>Upload</p>
        </div>
      )}

      <Mui.Dialog
        open={uploadSucess?.upload}
        onClose={() => {
          setDialog('');
          setUploadSucess({ upload: false, id: '', name: '', type: '' });
          setSelected({
            month: new Date(),
            year: new Date(),
          });
          navigate('/bill');
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
        <div style={{ padding: '10px 0' }}>
          <div style={{ height: '250px' }}>
            <Lottie options={defaultOptionsSuccess} />
          </div>
          <div className={css.finalCont}>
            <p className={css.successP}>Successfully Salary Cost Uploaded</p>
            {/* <p className={css.contP}>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p> */}
            <div
              className={css.okButton}
              onClick={() => {
                setDialog('');
                setUploadSucess({
                  upload: false,
                  id: '',
                  name: '',
                  type: '',
                });
                setSelected({
                  month: new Date(),
                  year: new Date(),
                });
                navigate('/bill');
              }}
            >
              <p className={css.okP}>Ok</p>
            </div>
          </div>
        </div>
      </Mui.Dialog>
    </div>
  );
};

export default SalaryCost;
