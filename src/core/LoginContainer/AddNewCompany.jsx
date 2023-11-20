import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Mui from '@mui/material';
import { verifyPan } from '@action/Store/Reducers/General/GeneralState';

import Input from '@components/Input/Input.jsx';
import { pincodeKeyPress } from '@components/utils';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import * as Router from 'react-router-dom';
import uploadBanking from '@assets/uploadBanking.svg';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, InputAdornment } from '@material-ui/core';
import FileUpload from '@components/FileUpload/FileUpload.jsx';
import * as themes from '@root/theme.scss';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import {
  validateGst,
  validatePincode,
  validateRequired,
  validateCin,
  validatePan,
} from '@services/Validation.jsx';
import Select from '@components/Select/Select.jsx';
import AppContext from '@root/AppContext.jsx';
import * as mainCss from '../../App.scss';
import { CheckCinWithGST } from '../../components/Helper/MyHelper';
import Upload from '../../assets/WebAssets/feather_upload-cloud.svg';
import * as css from './CompanyData.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: '#F2F2F2',
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

const styledUploadLable = {
  background: '#F08B32',
  color: '#FFF',
  padding: '12px 15px',
  borderRadius: 15,
  width: '200px',
  marginTop: '45px',
  textAlign: 'center',
  cursor: 'pointer',
};

const VALIDATION = {
  name: {
    errMsg: 'Enter valid Organization Name',
    test: validateRequired,
  },
  gstin: {
    errMsg: 'Please provide valid GST',
    test: validateGst,
  },
  pincode: {
    errMsg: 'Enter valid Pincode',
    test: validatePincode,
  },
  address_line1: {
    errMsg: 'Enter valid Organization Address',
    test: validateRequired,
  },
  // address_line2: {
  //   errMsg: 'Enter valid Address',
  //   test: validateRequired,
  // },
  city: {
    errMsg: 'Enter valid City',
    test: validateRequired,
  },
  state: {
    errMsg: 'Enter valid State',
    test: validateRequired,
  },
  country: {
    errMsg: 'Enter valid Country',
    test: validateRequired,
  },
  // companyLogo: {
  //     errMsg: 'Upload Logo',
  //   test: validateRequired,
  // }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Mui.Slide direction="up" ref={ref} {...props} />;
});

const intialState = {
  name: '',
  gstin: '',
  pincode: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: 'Tamil Nadu',
  country: 'India',
  companyLogo: '',
  noGst: false,
  cin_number: '',
  pan: '',
};

const AddNewCompany = ({ handleClose }) => {
  const {
    organization,
    enableLoading,
    user,
    openSnackBar,
    validateSession,
    // addOrganization,
    setLogo,
  } = React.useContext(AppContext);

  const dispatch = useDispatch();
  const { panValidationResponse } = useSelector((state) => state.General);

  const classes = useStyles();
  const navigate = Router.useNavigate();
  const device = localStorage.getItem('device_detect');
  const [allStates, setAllStates] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [open, setOpen] = React.useState({ dialog: false, value: '' });
  const [uploadLogo, setUploadLogo] = React.useState({
    id: '',
    fileName: '',
  });
  const [dialog, setDialog] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [mainState, setMainState] = React.useState(intialState);
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);

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

  React.useEffect(() => {
    setMainState((prev) => {
      return {
        ...prev,
        companyLogo: uploadLogo?.fileName,
        logo_id: uploadLogo?.id,
      };
    });
  }, [uploadLogo]);

  const fetchAllStates = () => {
    enableLoading(true);
    RestApi(`states`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setAllStates(
            res.data.map((l) => ({
              payload: l.state_name,
              text: l.state_name,
            })),
          );
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const fetchCountries = () => {
    RestApi('countries', {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setCountries(
          res.data.map((c) => ({
            payload: c.name,
            text: c.name,
          })),
        );
      }
    });
  };

  const getGstAddress = (gstin) => {
    enableLoading(true);
    RestApi(`gstins`, {
      method: METHOD.POST,
      payload: {
        organization_id: organization.orgId,
        gstin: gstin.toUpperCase(),
        // gstin_type: type,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (Object.keys(res).length > 0) {
            const {
              name,
              address_line1,
              address_line2,
              city,
              state: stateRes,
              pincode,
              country,
            } = res;

            setMainState((s) => ({
              ...s,
              name,
              address_line1: address_line1?.substring(0, 45),
              address_line2: address_line2?.substring(0, 45),
              city,
              state: stateRes,
              pincode,
              country,
            }));
          } else {
            throw new Error();
          }
        }
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Incorrect GST or unable to retrieve address`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const fetchPincodeDetails = (code) => {
    enableLoading(true);
    RestApi(`pincode_lookups?pincode=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          const { city, state: stateRes, country } = res;

          setMainState((s) => ({
            ...s,
            city,
            state: stateRes,
            country,
          }));
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Pincode error`,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  React.useEffect(() => {
    fetchAllStates();
    fetchCountries();
  }, []);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(mainState[v]);
      return a;
    }, {});
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value =
      ps?.target?.type === 'checkbox' ? ps?.target?.checked : ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    if (
      name === 'cin_number' &&
      (mainState?.cin_number?.length > 0 || CheckCinWithGST(mainState?.gstin))
    ) {
      setValidationErr((s) => ({ ...s, [name]: !validateCin(value) }));
    } else if (name === 'cin_number' && mainState?.cin_number?.length === 0) {
      setValidationErr((v) => ({
        ...v,
        [name]: false,
      }));
    } else if (name === 'pan' && mainState?.pan?.length > 0) {
      setValidationErr((s) => ({ ...s, [name]: !validatePan(value) }));
    } else if (name === 'pan' && mainState?.cin_number?.length === 0) {
      setValidationErr((v) => ({
        ...v,
        [name]: false,
      }));
    } else {
      setValidationErr((v) => ({
        ...v,
        [name]: !VALIDATION?.[name]?.test?.(value),
      }));
    }
  };

  React.useMemo(() => {
    if (mainState?.name !== '') {
      reValidate({ target: { name: 'name', value: mainState?.name } });
    }
  }, [mainState?.name]);

  React.useMemo(() => {
    if (mainState?.address_line1 !== '') {
      reValidate({
        target: { name: 'address_line1', value: mainState?.address_line1 },
      });
    }
  }, [mainState?.address_line1]);

  // React.useMemo(() => {
  //   if (mainState?.address_line2 !== '') {
  //     reValidate({
  //       target: { name: 'address_line2', value: mainState?.address_line2 },
  //     });
  //   }
  // }, [mainState?.address_line2]);

  React.useMemo(() => {
    if (mainState?.city !== '') {
      reValidate({ target: { name: 'city', value: mainState?.city } });
    }
  }, [mainState?.city]);

  React.useMemo(() => {
    if (mainState?.pincode !== '') {
      reValidate({ target: { name: 'pincode', value: mainState?.pincode } });
    }
  }, [mainState?.pincode]);

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);

    if (name === 'noGst' && value) {
      setMainState((prev) => ({ ...prev, noGst: value, gstin: '' }));
      setValidationErr((s) => ({ ...s, gstin: false }));
    } else if (name === 'noGst' && !value) {
      setMainState((prev) => ({ ...prev, noGst: value }));
    }
    // if (name === 'noGst' && !value) {
    //   setValidationErr((s) => ({ ...s, pan: false }));
    //   setState((prev) => ({ ...prev, pan: '' }));
    // }

    if (name === 'address_line1' || name === 'address_line2')
      setMainState((s) => ({
        ...s,
        [name]: value?.substring(0, 45),
      }));
    else
      setMainState((s) => ({
        ...s,
        [name]:
          name === 'gstin' || name === 'cin_number'
            ? value.toUpperCase()
            : value,
      }));

    if (name === 'gstin' && value.length === 15) getGstAddress(value);

    if (name === 'pincode' && value.length === 6) fetchPincodeDetails(value);

    if (name === 'pan' && value.length === 10)
      dispatch(verifyPan({ pan: value.toUpperCase(), type: 'company' }));
    if (name === 'pan' && (value === '' || value.length < 10))
      setMainState((s) => ({
        ...s,
        name: '',
      }));
  };

  const UploadLogo = (o_id) => {
    RestApi(`organizations/${o_id}/logos`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        image: mainState?.logo_id,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setLogo(res.image_url);
          openSnackBar({
            message: `Updated Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
          // navigate('/dashboard');
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const organizationFunction = (o_id) => {
    RestApi(`organizations/${o_id}/locations`, {
      method: METHOD.POST,
      payload: {
        address_line1: mainState?.address_line1,
        address_line2: mainState?.address_line2,
        city: mainState?.city,
        state: mainState?.state,
        pincode: mainState?.pincode,
        country: mainState?.country,
        gstin: !mainState?.noGst
          ? mainState?.gstin?.toLocaleUpperCase()
          : undefined,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res) {
          if (res.error) {
            openSnackBar({
              message: Object.values(res.errors)[0],
              type: MESSAGE_TYPE.ERROR,
            });
            enableLoading(false);
            return;
          }
          // setSessionToken({ activeToken: state.activeToken });
          // setUserInfo({ userInfo: state.userInfo });
          // const orgId = o_id;
          // const orgName = mainState?.name;
          // const shortName = mainState?.short_name ? mainState.short_name : '';
          // // validateSession(user.activeToken, { orgId, orgName });
          // localStorage.setItem(
          //   'selected_organization',
          //   JSON.stringify({ orgId, orgName, shortName }),
          // );
          // addOrganization({ orgId, orgName, shortName });
          if (device === 'mobile') {
            handleClose();
          }
          navigate('/dashboard');
        }
        enableLoading(false);
      })
      .catch((error) => {
        enableLoading(false);
        throw new Error(error);
      });

    RestApi(`organizations/${o_id}/current_user_details`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res) {
          if (res.error) {
            enableLoading(false);
          }
        }
        enableLoading(false);
      })
      .catch((error) => {
        enableLoading(false);
        throw new Error(error);
      });

    RestApi(`organizations/${o_id}/logos`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setLogo(res?.data[0]?.image_url);
      })
      .catch(() => {
        console.log('Logo Error');
      });
  };

  const submitAddress = () => {
    enableLoading(true);
    RestApi('organizations', {
      method: METHOD.POST,
      payload: {
        name: mainState?.name,
        gstin: !mainState?.noGst
          ? mainState?.gstin?.toLocaleUpperCase()
          : undefined,
        cin_number:
          mainState?.cin_number === '' ? undefined : mainState?.cin_number,
        pan_number: mainState.noGst ? mainState.pan : undefined,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res) {
          if (res.error) {
            openSnackBar({
              message: Object.values(res.errors)[0],
              type: MESSAGE_TYPE.ERROR,
            });
            enableLoading(false);
            return;
          }
          const orgId = res?.id ? res.id : '';
          const orgName = res?.name ? res.name : '';
          const shortName = res?.short_name ? res?.short_name : '';

          // const orgId = o_id;
          // const orgName = mainState?.name;
          // const shortName = mainState?.short_name ? mainState.short_name : '';
          // validateSession(user.activeToken, { orgId, orgName });
          localStorage.setItem(
            'selected_organization',
            JSON.stringify({ orgId, orgName, shortName }),
          );
          // addOrganization({ orgId, orgName, shortName });

          validateSession(user.activeToken, { orgId, orgName, shortName });
          organizationFunction(res?.id);
          if (mainState?.logo_id) {
            UploadLogo(res?.id);
          }
          // navigate('/dashboard');
        }
        enableLoading(false);
      })
      .catch((error) => {
        enableLoading(false);
        throw new Error(error);
      });
  };

  const onSubmit = () => {
    const addrValidate = {};
    Object.keys(VALIDATION).forEach((k) => {
      addrValidate[k] = VALIDATION[k];
    });
    if (mainState?.noGst) {
      addrValidate.pan = {
        errMsg: 'Please provide valid PAN',
        test: validatePan,
        // page: 1,
      };
    }

    // if (mainState?.noGst && mainState?.pan?.length === 0) {
    //   // delete addrValidate.pan;
    //   setValidationErr((s) => ({ ...s, pan: false }));
    // }

    if (!mainState?.noGst && mainState?.pan?.length === 0) {
      delete addrValidate.pan;
      setValidationErr((s) => ({ ...s, pan: false }));
    }

    if (mainState.noGst) {
      const { gstin, ...sectionValidation } = addrValidate;
      const v = validateAllFields(sectionValidation);
      const valid = Object.values(v).every((val) => !val);
      if (!valid) {
        setValidationErr((s) => ({ ...s, ...v }));
      } else {
        setValidationErr((s) => ({ ...s, ...v }));
        submitAddress();
      }
      return;
    }
    if (
      mainState?.cin_number?.length > 0 ||
      CheckCinWithGST(mainState?.gstin)
    ) {
      addrValidate.cin_number = {
        test: validateCin,
      };
    } else {
      setValidationErr((s) => ({ ...s, cin_number: false }));
    }
    const v = validateAllFields(addrValidate);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else {
      setValidationErr((s) => ({ ...s, ...v }));
      submitAddress();
    }
  };
  useEffect(() => {
    if (panValidationResponse && panValidationResponse.type === 'company') {
      setMainState((s) => ({
        ...s,
        name: panValidationResponse.name,
      }));
    }
  }, [panValidationResponse]);

  return (
    <div className={css.mainAddNewComapny}>
      {device === 'mobile' && (
        <div
          style={{ padding: '5px 0', margin: '1rem' }}
          className={css.headerContainer}
        >
          <p className={css.headerLabel}>Add New Company</p>
          {/* <span className={css.headerUnderline} /> */}
        </div>
      )}
      <div
        className={css.addNewCompany}
        style={{
          margin: device === 'desktop' ? '0 100px' : '',
          padding: device === 'desktop' ? '40px 50px 30px' : '20px',
          height: device === 'desktop' ? '65vh' : '',
        }}
      >
        <Mui.Grid container spacing={3}>
          <Mui.Grid item xs={12}>
            <Input
              name="gstin"
              label="GST Number"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: '#F2F2F2',
              }}
              onBlur={reValidate}
              error={validationErr.gstin}
              helperText={validationErr.gstin ? VALIDATION?.gstin?.errMsg : ''}
              onChange={onInputChange}
              value={mainState?.gstin}
              disabled={mainState.noGst}
              required
            />
          </Mui.Grid>
          <Mui.Grid pt={1} pl={3}>
            <Mui.FormControlLabel
              control={
                <Mui.Checkbox
                  checked={mainState.noGst}
                  className={css.checkbox}
                />
              }
              label={
                <p className={css.bottomText}>
                  My Business does not have a GSTIN
                </p>
              }
              name="noGst"
              onChange={onInputChange}
            />
          </Mui.Grid>
          {mainState.noGst && (
            <Mui.Grid item xs={12}>
              <Input
                name="pan"
                onBlur={reValidate}
                error={validationErr.pan}
                helperText={validationErr.pan ? 'Please provide valid Pan' : ''}
                rootStyle={{
                  border: '1px solid #A0A4AF',
                  background: '#F2F2F2',
                }}
                label="Pan Number"
                variant="standard"
                value={mainState?.pan?.toUpperCase()}
                InputLabelProps={{
                  shrink: true,
                }}
                // InputProps={{
                //   type: 'text',
                //   endAdornment: vendorAvailable ? <CheckCircle /> : null,
                // }}
                fullWidth
                onChange={onInputChange}
                theme="light"
                text="capital"
                required
              />
            </Mui.Grid>
          )}
          {!mainState.noGst && (
            <Mui.Grid item xs={12}>
              <Input
                name="cin_number"
                label="CIN Number"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid #A0A4AF',
                  background: '#F2F2F2',
                }}
                onBlur={reValidate}
                error={validationErr.cin_number}
                helperText={
                  validationErr.cin_number ? 'Enter Valid CIN Number' : ''
                }
                onChange={onInputChange}
                value={mainState?.cin_number}
                required={validationErr.cin_number}
              />
            </Mui.Grid>
          )}
          <Mui.Grid item xs={12}>
            <Input
              name="name"
              label="Organization Name"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: '#F2F2F2',
              }}
              onBlur={reValidate}
              error={validationErr.name}
              helperText={validationErr.name ? VALIDATION?.name?.errMsg : ''}
              onChange={onInputChange}
              value={mainState?.name}
              required
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Input
              name="address_line1"
              label="Organization Address 1"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: '#F2F2F2',
              }}
              inputProps={{ maxLength: 45 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" className={mainCss.endInput}>
                    {`${mainState?.address_line1?.length || 0}/45`}
                  </InputAdornment>
                ),
              }}
              onBlur={reValidate}
              error={validationErr.address_line1}
              helperText={
                validationErr.address_line1
                  ? VALIDATION?.address_line1?.errMsg
                  : ''
              }
              onChange={onInputChange}
              value={mainState?.address_line1}
              required
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Input
              name="address_line2"
              label="Organization Address 2"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: '#F2F2F2',
              }}
              inputProps={{ maxLength: 45 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" className={mainCss.endInput}>
                    {`${mainState?.address_line2?.length || 0}/45`}
                  </InputAdornment>
                ),
              }}
              onBlur={reValidate}
              // error={validationErr.address_line2}
              // helperText={
              //   validationErr.address_line2
              //     ? VALIDATION?.address_line2?.errMsg
              //     : ''
              // }
              onChange={onInputChange}
              value={mainState?.address_line2}
              required
            />
          </Mui.Grid>
          <Mui.Grid item xs={6}>
            <Input
              name="city"
              label="City"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: '#F2F2F2',
              }}
              onBlur={reValidate}
              error={validationErr.city}
              helperText={validationErr.city ? VALIDATION?.city?.errMsg : ''}
              onChange={onInputChange}
              value={mainState?.city}
              required
            />
          </Mui.Grid>

          <Mui.Grid item xs={6}>
            <Input
              name="pincode"
              label="Pin Code"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: '#F2F2F2',
              }}
              onBlur={reValidate}
              error={validationErr.pincode}
              helperText={
                validationErr.pincode ? VALIDATION?.pincode?.errMsg : ''
              }
              onChange={onInputChange}
              value={mainState?.pincode}
              required
              onKeyPress={pincodeKeyPress}
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Select
              name="state"
              onBlur={reValidate}
              error={validationErr.state}
              helperText={validationErr.state ? VALIDATION?.state?.errMsg : ''}
              className={`${css.greyBorder} ${classes.root}`}
              label="State"
              variant="standard"
              options={allStates}
              defaultValue={mainState?.state}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
              required
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Select
              name="country"
              onBlur={reValidate}
              error={validationErr.country}
              ry
              helperText={
                validationErr.country ? VALIDATION?.country?.errMsg : ''
              }
              className={`${css.greyBorder} ${classes.root}`}
              label="Country"
              variant="standard"
              options={countries}
              defaultValue={mainState?.country}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Input
              name="companyLogo"
              label="Company Logo"
              variant="standard"
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: '#F2F2F2',
                cursor: 'pointer !important',
              }}
              onClick={() => {
                setOpen({
                  dialog: true,
                  value: 'logo',
                  uploadState: setUploadLogo,
                });
              }}
              InputProps={{
                endAdornment: (
                  <AttachFileIcon
                    onClick={() => {
                      setOpen({
                        dialog: true,
                        value: 'logo',
                        uploadState: setUploadLogo,
                      });
                    }}
                    sx={{
                      transform: 'rotate(45deg)',
                      cursor: 'pointer',
                    }}
                  />
                ),
              }}
              // onBlur={reValidate}
              // error={validationErr.companyLogo}
              // helperText={
              //   validationErr.companyLogo
              //     ? VALIDATION?.companyLogo?.errMsg
              //     : ''
              // }
              onChange={onInputChange}
              value={mainState?.companyLogo}
              // required
            />
          </Mui.Grid>
        </Mui.Grid>
      </div>
      <div className={css.buttonBott}>
        <Mui.Button
          onClick={() => onSubmit()}
          className={css.primaryButton}
          sx={{ width: device === 'desktop' ? '30%' : '70%' }}
        >
          Save Details
        </Mui.Button>
      </div>

      <Mui.Dialog
        // fullScreen
        PaperProps={{
          elevation: 3,
          style: {
            width: '80%',
            padding: '15px 15px 25px',
          },
        }}
        open={open.dialog}
        onClose={() => setOpen({ dialog: false, value: '' })}
        TransitionComponent={Transition}
      >
        {dialog === 'file' ? (
          <Mui.Stack>
            <Mui.Box className={css.cardBox}>
              <Mui.CardMedia
                component="img"
                src={Upload}
                className={css.cardMediaImg}
              />
            </Mui.Box>
            <Mui.Typography align="center" className={css.dialogTypography}>
              Upload In Progress
            </Mui.Typography>
            <Mui.Box className={css.headProgress}>
              <Mui.LinearProgress
                variant="determinate"
                value={progress}
                color="warning"
                className={css.progress}
              />
            </Mui.Box>
          </Mui.Stack>
        ) : (
          <>
            <Mui.Box
              style={{
                padding: '0 15px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Mui.IconButton
                edge="start"
                color="inherit"
                onClick={() => setOpen({ dialog: false, value: '' })}
                aria-label="close"
                textAlign="right"
              >
                <CloseIcon />
              </Mui.IconButton>
            </Mui.Box>
            <Mui.Box
              style={{
                display: 'flex',
                flexFlow: 'column nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                // height: '90vh',
              }}
            >
              <img
                src={uploadBanking}
                style={{ width: '170px' }}
                alt="upload"
              />

              <Mui.Button
                variant="outlined"
                component="label"
                fullWidth
                disableElevation
                disableTouchRipple
                style={styledUploadLable}
              >
                Browse
                <FileUpload
                  setForUpload={open?.uploadState}
                  FieldSet={(event) => setDialog(event)}
                  funCall={() => setOpen({ dialog: false, value: '' })}
                  fromCompany
                  acceptType="image/png, image/jpeg, application/pdf, .xlsx"
                />
              </Mui.Button>
            </Mui.Box>
          </>
        )}
      </Mui.Dialog>
    </div>
  );
};

export default AddNewCompany;
