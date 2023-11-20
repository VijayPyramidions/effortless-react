import React from 'react';
// import moment from 'moment';
import { Button, makeStyles, styled } from '@material-ui/core';
import { Document, Page } from 'react-pdf'
import download from '@assets/WebAssets/download.svg';
import * as Mui from '@mui/material';
import * as themes from '@root/theme.scss';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
// import * as Router from 'react-router-dom';
import { validateRequired } from '@services/Validation.jsx';
import UploadDialog from '../../../components/UploadDialogComp/UploadDialog';
import Input from '../../../components/Input/Input.jsx';
import * as css from './InvoiceSettings.scss';

const VALIDATION = {
  LUTNumber: {
    errMsg: 'Please enter LUT number',
    test: (v) => validateRequired(v),
  },
  financialYear: {
    errMsg: 'Please enter financial year',
    test: (v) => validateRequired(v),
  },
  LUTFileId: {
    errMsg: 'Please upload file',
    test: (v) => validateRequired(v),
  },
};

const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const useStyles = makeStyles(() => ({
  root: {
    background: '#FFF',
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));

const LutFormSettings = ({ type, onClose, submitValue, LocalState }) => {
  const classes = useStyles();
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const device = localStorage.getItem('device_detect');
  const [mainState, setMainState] = React.useState({
    LUTNumber: '',
    financialYear: `${new Date().getFullYear()?.toString()?.substr(-2)}-${(new Date().getFullYear() + 1)?.toString()?.substr(-2)}`,
    LUTFileName: '',
    LUTFileId: '',
  });
  const [uploadDialog, setUploadDialog] = React.useState(false);
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const [ViewPrevious, setViewPrevious] = React.useState(false);
  const [viewBill, setViewBill] = React.useState(false);
  const [file, setFile] = React.useState('');
  const [checkPrev, setCheckPrev] = React.useState();

  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  const ViewUploadBill = (url) => {
    setViewBill(true);
    setFile(url);
  };

  const handleDownloadClick = async () => {
    const image = await fetch(file);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'LUT Form';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const validateAllFields = (stateParam) => {
    const stateData = stateParam;
    return Object.keys(VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };

  const OnSubmit = () => {
    const { LUTFileName, ...tempState } = mainState;
    const v = validateAllFields(tempState);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    setValidationErr((s) => ({ ...s, ...v }));
    submitValue(mainState);
  };

  React.useEffect(() => {
    if (LocalState?.length > 0 && type === 'update') {
      const temp = LocalState?.filter(val => val.current_fy)[0];
      setMainState(prev => ({ ...prev, LUTNumber: temp?.lut_number }));
      if (LocalState?.filter(val => val.current_fy === false).length > 0) {
        setCheckPrev(true);
      } else {
        setCheckPrev(false);
      }
    }
  }, [LocalState]);

  const PreviousTable = () => (
    <div>
      <Mui.TableContainer sx={{
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        '& .MuiTableRow-head': {
          background: '#FAFAFA'
        },
        '& .MuiTableCell-root': {
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }
      }}>
        <Mui.Table>
          <Mui.TableHead>
            <Mui.TableRow>
              <Mui.TableCell>
                Year
              </Mui.TableCell>
              <Mui.TableCell>
                LUT Certificate
              </Mui.TableCell>
            </Mui.TableRow>
          </Mui.TableHead>
          <Mui.TableBody>
            {LocalState?.map(val => (!val?.current_fy && <>
              <Mui.TableRow>

                <Mui.TableCell>
                  {val?.fy_name}
                </Mui.TableCell>
                <Mui.TableCell style={{ color: '#2C3DF2' }} onClick={() => { ViewUploadBill(val?.document_url); }}>
                  {val?.document_name}
                </Mui.TableCell>

              </Mui.TableRow>
            </>))}
          </Mui.TableBody>
        </Mui.Table>
      </Mui.TableContainer>
    </div>
  );

  return (
    <>
      <div className={css.lutForm}>
        <div className={css.firstCont}>
          <p className={css.headerP}>
            {type === 'update' ? 'Edit' : 'Add'} LUT Number
          </p>
          {(device === 'mobile' && type === 'update' && checkPrev) && (
            <div
              onClick={() => setViewPrevious(!ViewPrevious)}
            >
              <p className={css.notListedP}>
                View Previous LUT Details ?
              </p>
            </div>
          )}
        </div>
        <div className={css.lutCenter}>
          <Input
            name="LUTNumber"
            label="Enter LUT Number"
            variant="standard"
            className={`${css.greyBorder} ${classes.root}`}
            value={mainState?.LUTNumber}
            InputLabelProps={{ shrink: true }}
            fullWidth
            type="text"
            onChange={(e) =>
              setMainState((prev) => ({ ...prev, LUTNumber: e?.target?.value }))
            }
            theme="light"
            // onKeyDown={(e) =>
            //   ['e', 'E', '-', '+', '.'].includes(e.key) && e.preventDefault()
            // }
            onBlur={reValidate}
            error={validationErr.LUTNumber}
            helperText={
              validationErr.LUTNumber ? VALIDATION?.LUTNumber?.errMsg : ''
            }
          />

          <Input
            name="financialYear"
            label="Select Financial Year"
            variant="standard"
            className={`${css.greyBorder} ${classes.root}`}
            value={mainState?.financialYear}
            InputLabelProps={{ shrink: true }}
            fullWidth
            // onChange={(e) =>
            //   setMainState((prev) => ({ ...prev, financialYear: e?.target?.value }))
            // }
            theme="light"
            onBlur={reValidate}
            error={validationErr.financialYear}
            helperText={
              validationErr.financialYear ? VALIDATION?.financialYear?.errMsg : ''
            }
          />

          <div className={css.uploadFileDiv}>
            <p className={css.uploadHead}>
              <span>Upload LUT Certificate</span>
              {LocalState?.filter(val => val.current_fy)[0]?.document_url && <span style={{ color: '#2C3DF2' }} onClick={() => { ViewUploadBill(LocalState?.filter(val => val.current_fy)[0]?.document_url); }}>View Uploaded file</span>}
            </p>
            <div className={css.uploadFileButtonDiv}>
              <input
                type="button"
                value="Choose File"
                onClick={() => setUploadDialog(true)}
                className={css.uploadFileButton}
              />
              <p className={css.uploadFileP}>
                {mainState?.LUTFileName || 'File Name'}
              </p>
            </div>
            {validationErr.LUTFileId && <p style={{ color: '#d8000c', fontSize: '.5rem' }}> {VALIDATION?.LUTFileId?.errMsg}</p>}
          </div>
        </div>
        <div className={css.buttonDiv}>
          <Button className={css.secondary} onClick={() => onClose()}>
            Back
          </Button>
          <Button className={css.primary} onClick={() => OnSubmit()}>
            {type === 'update' ? 'Update' : 'Save'}
          </Button>
        </div>
        {(type === 'update' && device === 'desktop' && checkPrev) && <div className={css.viewPrevious}>
          <div onClick={() => setViewPrevious(!ViewPrevious)}><p className={css.notListedP}>
            View Previous LUT Details ?
          </p></div>

          {ViewPrevious && <PreviousTable />}
        </div>}
        <UploadDialog
          open={uploadDialog}
          onClose={() => setUploadDialog(false)}
          uploadedData={(val) => {
            setMainState((prev) => ({
              ...prev,
              LUTFileName: val?.name,
              LUTFileId: val?.id,
            }));
            setValidationErr((prev) => ({ ...prev, LUTFileId: false }));
          }
          }
          title="Agreement"
        />
        <SelectBottomSheet
          open={device === 'mobile' && ViewPrevious}
          triggerComponent={<></>}
          onClose={() => setViewPrevious(false)}
          addNewSheet
        >
          <Puller />
          <div>
            <p className={css.previousPTag}>Previous LUT Details</p>
            <PreviousTable />
          </div>
        </SelectBottomSheet>
      </div>
      <Mui.Dialog
        PaperProps={{
          elevation: 3,
          style: {
            width: '86%',
            height: file.includes('.pdf') ? '100%' : '',
            // position: 'absolute',

            overflow: 'visible',
            borderRadius: 16,
            cursor: 'pointer',
          },
        }}
        open={viewBill}
        onClose={() => setViewBill(false)}
      >
        {device === 'desktop' && <Mui.Stack
          direction="row"
          justifyContent="flex-end"
          p={1}
          onClick={() => handleDownloadClick()}
        >
          {/* <a href={file} target="_blank" rel="noreferrer" download> */}
          <img src={download} alt="download" />
          {/* </a> */}
        </Mui.Stack>}
        <Mui.DialogContent style={{ position: 'relative' }}>
          <Mui.Grid className={css.iframeViewDocument}>
            {file.includes('.jpeg') ||
              file.includes('.png') ||
              file.includes('.pdf') === false ? (
              <img src={file} alt="upload" style={{ width: '100%' }} />
            ) : (
              Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                <Document
                  file={file}
                  className={css.pdfStyle}
                  loading="  "
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={i} className={css.page} />
                </Document>
              ))
            )}
          </Mui.Grid>
        </Mui.DialogContent>
      </Mui.Dialog>
    </>
  );
};

export default LutFormSettings;
