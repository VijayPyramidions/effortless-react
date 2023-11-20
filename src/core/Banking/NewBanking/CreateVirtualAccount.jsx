// /* eslint-disable no-unused-vars */
import React, { useState, useContext, memo } from 'react';
import { useDispatch } from 'react-redux';

import { DirectUpload } from '@rails/activestorage';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import { Box, Button, Stack, Typography } from '@mui/material';

import {
  getBankList,
  closeVirtualAccount,
  openTranPassword,
} from '@action/Store/Reducers/Banking/BankingState';

import { InputText } from '@components/Input/Input';
import { convertKeysToSnakeCase } from '@components/utils';
import {
  validateEmail,
  validateRequired,
  validatePhone,
  validateURL,
} from '@services/Validation';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import * as css from './bankingnew.scss';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      required
      theme="light"
      className={css.textfieldStyle}
    />
  );
};

const VALIDATION = {
  businessName: {
    errMsg: 'Please Provide Business Name',
    test: (v) => validateRequired(v),
  },
  brandName: {
    errMsg: 'Please Provide Brand Name',
    test: (v) => validateRequired(v),
  },
  businessNature: {
    errMsg: 'Please Provide Nature of Business ',
    test: (v) => validateRequired(v),
  },
  websiteUrl: {
    errMsg: 'Please Provide Valid Website URL',
    test: (v) => validateURL(v),
  },
  businessCategory: {
    errMsg: 'Please Provide Business Category',
    test: (v) => validateRequired(v),
  },
  contactPerson: {
    errMsg: 'Please Provide Contact Person Name',
    test: (v) => validateRequired(v),
  },
  email: {
    errMsg: 'Please Provide Valid Email ID',
    test: validateEmail,
  },
  mobileNumber: {
    errMsg: 'Please Provide Valid Mobile No.',
    test: validatePhone,
  },
  addressLine1: {
    errMsg: 'Please Provide Address Line 1',
    test: (v) => validateRequired(v),
  },
  addressLine2: {
    errMsg: 'Please Provide Address Line 2',
    test: (v) => validateRequired(v),
  },
  certificateOfIncorporation: {
    errMsg: 'Please upload certificate of incorporation',
    test: (v) => validateRequired(v),
  },
  gstCertificate: {
    errMsg: 'Please upload GST certificate',
    test: (v) => validateRequired(v),
  },
  cancelledCheque: {
    errMsg: 'Please upload cancelled cheque',
    test: (v) => validateRequired(v),
  },
  directorPan1: {
    errMsg: 'Please upload director 1 pan',
    test: (v) => validateRequired(v),
  },
  directorAadhar1: {
    errMsg: 'Please upload director 1 aadhar',
    test: (v) => validateRequired(v),
  },
  directorPan2: {
    errMsg: 'Please upload director 2 pan',
    test: (v) => validateRequired(v),
  },
  directorAadhar2: {
    errMsg: 'Please upload director 2 aadhar',
    test: (v) => validateRequired(v),
  },
};

const CreateVirtualAccount = ({ onClose }) => {
  const dispatch = useDispatch();
  const { organization, currentUserInfo } = useContext(AppContext);

  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));

  const initialState = {
    businessName: organization?.name,
    brandName: '',
    businessNature: '',
    websiteUrl: '',
    businessCategory: '',
    contactPerson: '',
    email: currentUserInfo.email,
    mobileNumber: currentUserInfo.mobileNumber,
    addressLine1: '',
    addressLine2: '',
    certificateOfIncorporation: null,
    gstCertificate: null,
    cancelledCheque: null,
    businessPan: null,
    directorPan1: null,
    directorAadhar1: null,
    directorPan2: null,
    directorAadhar2: null,
  };

  const [state, setState] = useState(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  const [fileName, setFileName] = useState({});

  const getEventNameValue = (ps, val) => {
    const name = !val ? ps?.target?.name : ps;

    const value = !val ? ps?.target?.value : val;
    return [name, value];
  };

  const reValidate = (ps, val) => {
    const [name, value] = getEventNameValue(ps, val);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const validateAllFields = (stateParam) => {
    const stateData = stateParam || state;
    return Object.keys(VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };

  const Valid = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return false;
    }
    return true;
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setState((s) => ({ ...s, [name]: value }));
  };

  const onFileChange = (e) => {
    const file = e?.target?.files[0];
    const { name } = e?.target;
    if (file) {
      reValidate(e);
      const url = `${BASE_URL}/direct_uploads`;
      const upload = new DirectUpload(file, url);

      dispatch(enableLoading(true));

      upload.create((error, blob) => {
        dispatch(enableLoading(false));

        if (error)
          dispatch(
            openSnackbar({ message: error?.message, type: MESSAGE_TYPE.ERROR })
          );
        else {
          const filename =
            file.name.length > 12
              ? `${file.name.slice(0, 12)}...${file.name.slice(-8)}`
              : file.name;

          setFileName((prev) => ({ ...prev, [name]: filename }));
          setState((prev) => ({ ...prev, [name]: blob?.signed_id }));
        }
      });
    }
  };

  const onFileRemove = (name) => () => {
    setFileName((prev) => ({
      ...prev,
      [name]: '',
    }));
    setState((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const SubmitDetails = async () => {
    if (Valid()) {
      dispatch(enableLoading(true));
      const array = convertKeysToSnakeCase(state);
      await axiosInst
        .post(
          `organizations/${organization.orgId}/effortless_virtual_accounts`,
          {
            ...array,
          }
        )
        .then(({ data }) => {
          dispatch(enableLoading(false));

          if (data && !data.error) {
            dispatch(getBankList());

            axiosInst
              .post(
                `organizations/${organization.orgId}/effortless_virtual_accounts/${data?.id}/register`
              )
              .then((res) => {
                if (res?.data && !res.data.error) {
                  if (
                    !currentUserInfo?.transactionPasswordEnabled ||
                    (currentUserInfo?.transactionPasswordEnabled &&
                      +new Date(
                        currentUserInfo?.transactionPasswordExpireDate
                      ) <= +new Date())
                  )
                    dispatch(openTranPassword('effortless'));

                  dispatch(
                    openSnackbar({
                      message: res.data.message,
                      type: MESSAGE_TYPE.INFO,
                    })
                  );
                }

                onClose();
              });
          } else {
            dispatch(
              openSnackbar({
                message: Object.values(data?.errors).join(','),
                type: MESSAGE_TYPE.ERROR,
              })
            );
          }
        })
        .catch((e) => {
          console.log(e);
          onClose();
          dispatch(enableLoading(false));
        });
    }
  };

  return (
    <Box className={css.formContainer}>
      <Typography variant="h4" className={css.fromContainer_header}>
        Basic Details
      </Typography>
      <TextfieldStyle
        label="Company Name"
        name="businessName"
        className={css.textFieldSize}
        defaultValue={
          state.businessName === ''
            ? currentUserInfo?.name
            : state?.businessName
        }
        error={validationErr.businessName}
        helperText={
          validationErr.businessName ? VALIDATION?.businessName?.errMsg : ''
        }
        onBlur={reValidate}
        onChange={onInputChange}
      />

      <TextfieldStyle
        label="Brand Name"
        name="brandName"
        className={css.textFieldSize}
        value={state.brandName}
        error={validationErr.brandName}
        helperText={
          validationErr.brandName ? VALIDATION?.brandName?.errMsg : ''
        }
        onBlur={reValidate}
        onChange={onInputChange}
      />

      <TextfieldStyle
        label="Nature of Business"
        name="businessNature"
        className={css.textFieldSize}
        defaultValue={
          state.businessNature === ''
            ? currentUserInfo?.businessNature
            : state?.businessNature
        }
        error={validationErr.businessNature}
        helperText={
          validationErr.businessNature ? VALIDATION?.businessNature?.errMsg : ''
        }
        onBlur={reValidate}
        onChange={onInputChange}
      />

      <TextfieldStyle
        label="Website URL"
        name="websiteUrl"
        className={css.textFieldSize}
        defaultValue={state?.websiteUrl}
        error={validationErr.websiteUrl}
        helperText={
          validationErr.websiteUrl ? VALIDATION?.websiteUrl?.errMsg : ''
        }
        onBlur={reValidate}
        onChange={onInputChange}
      />
      <TextfieldStyle
        label="Business Category"
        name="businessCategory"
        className={css.textFieldSize}
        defaultValue={state?.businessCategory}
        error={validationErr.businessCategory}
        helperText={
          validationErr.businessCategory
            ? VALIDATION?.businessCategory?.errMsg
            : ''
        }
        onBlur={reValidate}
        onChange={onInputChange}
      />
      <TextfieldStyle
        label="Contact Person"
        name="contactPerson"
        className={css.textFieldSize}
        error={validationErr.contactPerson}
        helperText={
          validationErr.contactPerson ? VALIDATION?.contactPerson?.errMsg : ''
        }
        defaultValue={state.contactPerson}
        onBlur={reValidate}
        onChange={onInputChange}
      />
      <TextfieldStyle
        label="Contact Person&rsquo;s Email ID"
        name="email"
        className={css.textFieldSize}
        error={validationErr.email}
        helperText={validationErr.email ? VALIDATION?.email?.errMsg : ''}
        defaultValue={state.email}
        onBlur={reValidate}
        onChange={onInputChange}
      />
      <TextfieldStyle
        label="Director’s Phone No"
        name="mobileNumber"
        type="number"
        className={css.textFieldSize}
        error={validationErr.mobileNumber}
        helperText={
          validationErr.mobileNumber ? VALIDATION?.mobileNumber?.errMsg : ''
        }
        defaultValue={state?.mobileNumber}
        onChange={onInputChange}
      />

      <TextfieldStyle
        label="Address Line 1"
        name="addressLine1"
        inputProps={{ maxLength: 45 }}
        value={state?.addressLine1}
        className={css.textFieldSize}
        error={validationErr.addressLine1}
        helperText={
          validationErr.addressLine1 ? VALIDATION?.addressLine1?.errMsg : ''
        }
        onBlur={reValidate}
        onChange={onInputChange}
      />

      <TextfieldStyle
        label="Address Line 2"
        name="addressLine2"
        inputProps={{ maxLength: 45 }}
        value={state?.addressLine2}
        className={css.textFieldSize}
        error={validationErr.addressLine2}
        helperText={
          validationErr.addressLine2 ? VALIDATION?.addressLine2?.errMsg : ''
        }
        onBlur={reValidate}
        onChange={onInputChange}
      />

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="incorpcert"
          className={
            validationErr.certificateOfIncorporation
              ? [css.fileLabel, css.error].join(' ')
              : css.fileLabel
          }
        >
          Upload your Certificate of Incorporation
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="incorpcert"
            className={css.fileInput}
            name="certificateOfIncorporation"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.certificateOfIncorporation
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.certificateOfIncorporation || 'File Name'}
            <CloseRoundedIcon
              className={css.closeIcon}
              onClick={onFileRemove('certificateOfIncorporation')}
            />
          </span>
        </div>
        {validationErr.certificateOfIncorporation && (
          <span className={css.validateError}>
            {VALIDATION?.certificateOfIncorporation?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="gstcert"
          className={
            validationErr.gstCertificate
              ? [css.fileLabel, css.error].join(' ')
              : css.fileLabel
          }
        >
          Upload your GST Certificate
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="gstcert"
            className={css.fileInput}
            name="gstCertificate"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.gstCertificate
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.gstCertificate || 'File Name'}
            <CloseRoundedIcon
              className={css.closeIcon}
              onClick={onFileRemove('gstCertificate')}
            />
          </span>
        </div>

        {validationErr.gstCertificate && (
          <span className={css.validateError}>
            {VALIDATION?.gstCertificate?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="cheque"
          className={
            validationErr.cancelledCheque
              ? [css.fileLabel, css.error].join(' ')
              : css.fileLabel
          }
        >
          Upload a Cancelled Cheque
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="cheque"
            className={css.fileInput}
            name="cancelledCheque"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.cancelledCheque
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.cancelledCheque || 'File Name'}
            <CloseRoundedIcon
              className={css.closeIcon}
              onClick={onFileRemove('cancelledCheque')}
            />
          </span>
        </div>

        {validationErr.cancelledCheque && (
          <span className={css.validateError}>
            {VALIDATION?.cancelledCheque?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="bisspan"
          className={[css.fileLabel, css.notrequired].join(' ')}
        >
          Upload Business PAN Details
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="bisspan"
            className={css.fileInput}
            name="businessPan"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.businessPan
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.businessPan || 'File Name'}
            <CloseRoundedIcon className={css.closeIcon} />
          </span>
        </div>
        {validationErr.businessPan && (
          <span className={css.validateError}>
            {VALIDATION?.businessPan?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="directorpan1"
          className={
            validationErr.directorPan1
              ? [css.fileLabel, css.error].join(' ')
              : css.fileLabel
          }
        >
          Upload Director #01&rsquo;s PAN Details
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="directorpan1"
            className={css.fileInput}
            name="directorPan1"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.directorPan1
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.directorPan1 || 'File Name'}
            <CloseRoundedIcon
              className={css.closeIcon}
              onClick={onFileRemove('directorPan1')}
            />
          </span>
        </div>
        {validationErr.directorPan1 && (
          <span className={css.validateError}>
            {VALIDATION?.directorPan1?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="directoraadhar1"
          className={
            validationErr.directorAadhar1
              ? [css.fileLabel, css.error].join(' ')
              : css.fileLabel
          }
        >
          Upload Director #01&rsquo;s Aadhar Details
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="directoraadhar1"
            className={css.fileInput}
            name="directorAadhar1"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.directorAadhar1
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.directorAadhar1 || 'File Name'}
            <CloseRoundedIcon
              className={css.closeIcon}
              onClick={onFileRemove('directorAadhar1')}
            />
          </span>
        </div>
        {validationErr.directorAadhar1 && (
          <span className={css.validateError}>
            {VALIDATION?.directorAadhar1?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="directorpan2"
          className={
            validationErr.directorPan2
              ? [css.fileLabel, css.error].join(' ')
              : css.fileLabel
          }
        >
          Upload Director #02&rsquo;s PAN Details
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="directorpan2"
            className={css.fileInput}
            name="directorPan2"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.directorPan2
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.directorPan2 || 'File Name'}
            <CloseRoundedIcon
              className={css.closeIcon}
              onClick={onFileRemove('directorPan2')}
            />
          </span>
        </div>
        {validationErr.directorPan2 && (
          <span className={css.validateError}>
            {VALIDATION?.directorPan2?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.inputFileWrap}>
        <label
          htmlFor="directoraadhar2"
          className={
            validationErr.directorAadhar2
              ? [css.fileLabel, css.error].join(' ')
              : css.fileLabel
          }
        >
          Upload Director #02&rsquo;s Aadhar Details
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="directoraadhar2"
            className={css.fileInput}
            name="directorAadhar2"
            onChange={onFileChange}
          />
          <span
            className={
              fileName?.directorAadhar2
                ? [css.fileName, css.fileSelected].join(' ')
                : css.fileName
            }
          >
            {fileName?.directorAadhar2 || 'File Name'}
            <CloseRoundedIcon
              className={css.closeIcon}
              onClick={onFileRemove('directorAadhar2')}
            />
          </span>
        </div>
        {validationErr.directorAadhar2 && (
          <span className={css.validateError}>
            {VALIDATION?.directorAadhar2?.errMsg}
          </span>
        )}
      </Stack>

      <Stack className={css.fromContainer_btnwrp}>
        <Button
          className={css.fromContainer_cancelbtn}
          onClick={() => dispatch(closeVirtualAccount())}
        >
          Cancel
        </Button>
        <Button
          className={css.fromContainer_successbtn}
          onClick={SubmitDetails}
        >
          Proceed To Create
        </Button>
      </Stack>
    </Box>
  );
};

export default memo(CreateVirtualAccount);
