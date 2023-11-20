/* @flow */
/**
 * @fileoverview  Fill in organizational Details
 */

import React, { useState, useContext, useEffect } from 'react';
import JSBridge from '@nativeBridge/jsbridge';
import Button from '@material-ui/core/Button';
import { InputAdornment } from '@material-ui/core';
import Input from '@components/Input/Input.jsx';
import { pincodeKeyPress } from '@components/utils';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { SingleSelect } from '@components/Select/Select.jsx';
import Grid from '@material-ui/core/Grid';
import * as Mui from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import {
  validateGst,
  validatePincode,
  validateRequired,
  validateCin,
  validatePan,
} from '@services/Validation.jsx';
import FileUpload from '@components/FileUpload/FileUpload.jsx';
import * as Router from 'react-router-dom';
import uploadBanking from '@assets/uploadBanking.svg';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { CheckCinWithGST } from '../../components/Helper/MyHelper';
import Upload from '../../assets/WebAssets/feather_upload-cloud.svg';
import * as mainCss from '../../App.scss';
import * as css from './SignInContainer.scss';
import login from '../../assets/loginScreen.svg';
// import flowerLogo from '../../assets/flowerLogo.svg';
import flowerLogo from '../../assets/WebLogo.png';

import ellipse from '../../assets/Ellipse 6.svg';
import CustomCheckbox from '../../components/Checkbox/Checkbox';

const VALIDATOR = {
  orgName: (v) => validateRequired(v),
  gstNo: (v) => validateGst(v),
  cin: (v) => validateCin(v),
  addrOne: (v) => validateRequired(v),
  addrTwo: () => {
    return true;
  },
  city: (v) => validateRequired(v),
  pincode: (v) => validatePincode(v),
  state: (v) => validateRequired(v),
  country: (v) => validateRequired(v),
  pan: (v) => validatePan(v),
};
const ValidationErrMsg = {
  orgName: 'Enter organization name',
  gstNo: 'Enter valid GST No.',
  cin: 'Enter CIN Number',
  addrOne: 'Enter address',
  addrTwo: 'Enter address',
  city: 'Enter city name',
  pincode: 'Enter valid pincode name',
  state: 'Enter valid state name',
  country: 'Enter valid country name',
  pan: 'Enter Valid Pan No',
};

const styledUploadLable = {
  background: '#F08B32',
  color: '#FFF',
  padding: '12px 15px',
  borderRadius: 15,
  width: '320px',
  marginTop: '45px',
  textAlign: 'center',
  cursor: 'pointer',
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Mui.Slide direction="up" ref={ref} {...props} />;
});

const initialValidationErr = {
  orgName: false,
  gstNo: false,
  cin: false,
  addrOne: false,
  addrTwo: false,
  city: false,
  pincode: false,
  state: false,
  country: false,
  pan: false,
};

export const IntroHeader = () => (
  <div className={css.introHeaderContainer}>
    <span className={css.appName}>Effortless</span>
    <span className={css.appDescription}>Fill in your Business Details</span>
  </div>
);

const FillOrgDetailsContainer = () => {
  const {
    addOrganization,
    enableLoading,
    setCurrentUserInfo,
    setSessionToken,
    setUserInfo,
    openSnackBar,
    setLogo,
    addOrgId,
    addOrgName,
  } = useContext(AppContext);

  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [initialPage, setIntialPage] = useState(true);
  const [gstNo, setGstNo] = useState('');
  const [cin, setCin] = useState('');
  const [pan, setPan] = useState('');
  const [addrOne, setAddrOne] = useState('');
  const [addrTwo, setAddrTwo] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [orgState, setOrgState] = useState('');
  const [country, setCountry] = useState('');
  const [checkGSTIN, setCheckGSTIN] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const { state } = Router.useLocation();
  const navigate = Router.useNavigate();
  const [open, setOpen] = React.useState({ dialog: false, value: '' });
  const [uploadLogo, setUploadLogo] = React.useState({
    id: '',
    fileName: '',
  });
  const [dialog, setDialog] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [companyLogo, setCompanyLogo] = React.useState({
    companyLogoName: '',
    logo_id: '',
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

  React.useEffect(() => {
    setCompanyLogo({
      companyLogoName: uploadLogo?.fileName,
      logo_id: uploadLogo?.id,
    });
  }, [uploadLogo]);

  const validateAllfields = () => {
    const orgNameValid = VALIDATOR?.orgName?.(orgName);
    const gstNoValid = checkGSTIN ? true : VALIDATOR?.gstNo?.(gstNo);
    const panNoValid = !checkGSTIN ? true : VALIDATOR?.pan?.(pan);
    let cinNumberValid = true;
    if (checkGSTIN) {
      cinNumberValid = true;
    } else if (cin?.length > 0 || CheckCinWithGST(gstNo)) {
      cinNumberValid = VALIDATOR?.cin?.(cin);
    }

    const addrOneValid = VALIDATOR?.addrOne?.(addrOne);
    const addrTwoValid = VALIDATOR?.addrTwo?.(addrTwo);
    const cityValid = VALIDATOR?.city?.(city);
    const pincodeValid = VALIDATOR?.pincode?.(pincode);
    const stateValid = VALIDATOR?.state?.(orgState);
    const countryValid = VALIDATOR?.country?.(country);

    if (
      !addrOneValid ||
      !addrTwoValid ||
      !cityValid ||
      !pincodeValid ||
      !stateValid ||
      !countryValid ||
      !orgNameValid ||
      !gstNoValid ||
      !cinNumberValid ||
      !panNoValid
    ) {
      setValidationErr((s) => ({
        ...s,
        addrOne: !addrOneValid,
        addrTwo: !addrTwoValid,
        city: !cityValid,
        pincode: !pincodeValid,
        state: !stateValid,
        country: !countryValid,
        orgName: !orgNameValid,
        gstNo: !gstNoValid,
        cin: !cinNumberValid,
        pan: !panNoValid,
      }));
    }
  };

  useEffect(() => {
    if (pincode) {
      setTimeout(async () => {
        await validateAllfields();
      }, 300);
    }
  }, [pincode]);

  const getGstAddr = (gstVal) => {
    enableLoading(true);

    RestApi('gstins', {
      method: METHOD.POST,
      payload: {
        gstin: gstVal.toUpperCase(),
      },
      headers: {
        Authorization: `Bearer ${state.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setAddrOne((res?.address_line1?.substring(0, 45) || '')?.toString());
          setAddrTwo((res?.address_line2?.substring(0, 45) || '')?.toString());
          setOrgName(res?.name || '');
          setCity(res?.city || '');
          setCountry('India');
          setOrgState(res?.state || '');
          setPincode(res?.pincode || '');
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const fetchPincodeDetails = (code) => {
    enableLoading(true);
    RestApi(`pincode_lookups?pincode=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${state.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setCity(res?.city);
          setCountry(res?.country);
          setOrgState(res?.state);
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

  const UploadLogo = (o_id) => {
    RestApi(`organizations/${orgId || o_id}/logos`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${state.activeToken}`,
      },
      payload: {
        image: companyLogo?.logo_id,
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

  const onSubmit1 = () => {
    if (!orgId) {
      if (initialPage) {
        const orgNameValid = VALIDATOR?.orgName?.(orgName);
        const gstNoValid = checkGSTIN ? true : VALIDATOR?.gstNo?.(gstNo);
        const panNoValid = !checkGSTIN ? true : VALIDATOR?.pan?.(pan);
        let cinNumberValid = true;
        if (checkGSTIN) {
          cinNumberValid = true;
        } else if (cin?.length > 0 || CheckCinWithGST(gstNo)) {
          cinNumberValid = VALIDATOR?.cin?.(cin);
        }
        if (!orgNameValid || !gstNoValid || !cinNumberValid || !panNoValid) {
          setValidationErr((s) => ({
            ...s,
            orgName: !orgNameValid,
            gstNo: !gstNoValid,
            cin: !cinNumberValid,
            pan: !panNoValid,
          }));
          return;
        }
        setIntialPage(false);
        return;
      }

      if (!initialPage) {
        const addrOneValid = VALIDATOR?.addrOne?.(addrOne);
        const addrTwoValid = VALIDATOR?.addrTwo?.(addrTwo);
        const cityValid = VALIDATOR?.city?.(city);
        const pincodeValid = VALIDATOR?.pincode?.(pincode);
        const stateValid = VALIDATOR?.state?.(orgState);
        const countryValid = VALIDATOR?.country?.(country);

        if (
          !addrOneValid ||
          !addrTwoValid ||
          !cityValid ||
          !pincodeValid ||
          !stateValid ||
          !countryValid
        ) {
          setValidationErr((s) => ({
            ...s,
            addrOne: !addrOneValid,
            addrTwo: !addrTwoValid,
            city: !cityValid,
            pincode: !pincodeValid,
            state: !stateValid,
            country: !countryValid,
          }));
          return;
        }
        enableLoading(true);
        RestApi('organizations', {
          method: METHOD.POST,
          payload: {
            name: orgName,
            gstin: gstNo === '' ? undefined : gstNo?.toUpperCase(),
            cin_number: cin || undefined,
            pan_number: checkGSTIN ? undefined : pan?.toUpperCase(),
            address_line1: addrOne,
            address_line2: addrTwo,
            city,
            state: orgState,
            pincode,
            country,
          },
          headers: {
            Authorization: `Bearer ${state.activeToken}`,
          },
        })
          .then((res) => {
            if (res) {
              if (res.error) {
                openSnackBar({
                  message: Object.values(res.errors)[0],
                  type: MESSAGE_TYPE.ERROR,
                });
                setErrorMessage(Object.values(res.errors)[0]);
                enableLoading(false);
                return;
              }
              setOrgId(res?.id);
              addOrganization({
                orgName,
                orgId: res.id,
                gstNo,
                shortName: res?.short_name,
              });
              // setAddrOne(res?.address_line1);
              // setCity(res?.city);
              // setCountry(res?.country);
              // setOrgState(res?.state);
              // setPincode(res?.pincode);
              setErrorMessage('');
              if (companyLogo?.logo_id) {
                UploadLogo(res?.id);
              }
              RestApi(`organizations/${res?.id}/current_user_details`, {
                method: METHOD.GET,
                headers: {
                  Authorization: `Bearer ${state.activeToken}`,
                },
              })
                .then((resVal) => {
                  if (resVal) {
                    if (resVal.error) {
                      setErrorMessage(resVal.message);
                      enableLoading(false);
                    }
                    setSessionToken({ activeToken: state.activeToken });
                    setUserInfo({ userInfo: state.userInfo });
                    setCurrentUserInfo({ currentUserInfo: resVal });
                    localStorage.setItem(
                      'selected_organization',
                      JSON.stringify({
                        orgId: res?.data[0]?.id,
                        orgName: res?.data[0]?.name,
                        shortName: res?.data[0]?.short_name,
                      }),
                    );
                    addOrgId({ orgId: res?.data[0]?.id });
                    addOrgName({
                      orgName: res?.data[0]?.name,
                      shortName: res?.data[0]?.short_name,
                    });
                    // if (device === 'mobile') {
                    JSBridge.sessionInfo();
                    JSBridge.currentUserData();
                    // }
                    navigate('/dashboard', { state: { from: 'bankReq' } });
                  }
                  enableLoading(false);
                })
                .catch((error) => {
                  setErrorMessage('Something went wrong');
                  enableLoading(false);
                  throw new Error(error);
                });
            }
            enableLoading(false);
          })
          .catch((error) => {
            setErrorMessage('Something went wrong');
            enableLoading(false);
            throw new Error(error);
          });
      }
    }
  };
  const onSubmit = () => {
    if (!orgId) {
      const orgNameValid = VALIDATOR?.orgName?.(orgName);
      const gstNoValid = checkGSTIN ? true : VALIDATOR?.gstNo?.(gstNo);
      const panNoValid = !checkGSTIN ? true : VALIDATOR?.pan?.(pan);
      let cinNumberValid = true;
      if (checkGSTIN) {
        cinNumberValid = true;
      } else if (cin?.length > 0 || CheckCinWithGST(gstNo)) {
        cinNumberValid = VALIDATOR?.cin?.(cin);
      }

      const addrOneValid = VALIDATOR?.addrOne?.(addrOne);
      const addrTwoValid = VALIDATOR?.addrTwo?.(addrTwo);
      const cityValid = VALIDATOR?.city?.(city);
      const pincodeValid = VALIDATOR?.pincode?.(pincode);
      const stateValid = VALIDATOR?.state?.(orgState);
      const countryValid = VALIDATOR?.country?.(country);

      if (
        !addrOneValid ||
        !addrTwoValid ||
        !cityValid ||
        !pincodeValid ||
        !stateValid ||
        !countryValid ||
        !orgNameValid ||
        !gstNoValid ||
        !cinNumberValid ||
        !panNoValid
      ) {
        setValidationErr((s) => ({
          ...s,
          addrOne: !addrOneValid,
          addrTwo: !addrTwoValid,
          city: !cityValid,
          pincode: !pincodeValid,
          state: !stateValid,
          country: !countryValid,
          orgName: !orgNameValid,
          gstNo: !gstNoValid,
          cin: !cinNumberValid,
          pan: !panNoValid,
        }));
        return;
      }

      enableLoading(true);
      RestApi('organizations', {
        method: METHOD.POST,
        payload: {
          name: orgName,
          gstin: gstNo === '' ? undefined : gstNo?.toUpperCase(),
          cin_number: cin || undefined,
          pan_number: checkGSTIN ? pan?.toUpperCase() : undefined,
          address_line1: addrOne,
          address_line2: addrTwo,
          city,
          state: orgState,
          pincode,
          country,
        },
        headers: {
          Authorization: `Bearer ${state.activeToken}`,
        },
      })
        .then((res) => {
          if (res) {
            if (res.error) {
              openSnackBar({
                message: Object.values(res.errors)[0],
                type: MESSAGE_TYPE.ERROR,
              });
              setErrorMessage(Object.values(res.errors)[0]);
              enableLoading(false);
              return;
            }
            setOrgId(res?.id);
            addOrganization({
              orgName,
              orgId: res.id,
              gstNo,
              shortName: res?.short_name,
            });
            // setAddrOne(res?.address_line1);
            // setCity(res?.city);
            // setCountry(res?.country);
            // setOrgState(res?.state);
            // setPincode(res?.pincode);
            setErrorMessage('');
            if (companyLogo?.logo_id) {
              UploadLogo(res?.id);
            }
            RestApi(`organizations/${res?.id}/current_user_details`, {
              method: METHOD.GET,
              headers: {
                Authorization: `Bearer ${state.activeToken}`,
              },
            })
              .then((resVal) => {
                if (resVal) {
                  if (resVal.error) {
                    setErrorMessage(resVal.message);
                    enableLoading(false);
                  }
                  setSessionToken({ activeToken: state.activeToken });
                  setUserInfo({ userInfo: state.userInfo });
                  setCurrentUserInfo({ currentUserInfo: resVal });
                  localStorage.setItem(
                    'selected_organization',
                    JSON.stringify({
                      orgId: res?.data[0]?.id,
                      orgName: res?.data[0]?.name,
                      shortName: res?.data[0]?.short_name,
                    }),
                  );
                  addOrgId({ orgId: res?.data[0]?.id });
                  addOrgName({
                    orgName: res?.data[0]?.name,
                    shortName: res?.data[0]?.short_name,
                  });
                  navigate('/companydata');
                }
                enableLoading(false);
              })
              .catch((error) => {
                setErrorMessage('Something went wrong');
                enableLoading(false);
                throw new Error(error);
              });
          }
          enableLoading(false);
        })
        .catch((error) => {
          setErrorMessage('Something went wrong');
          enableLoading(false);
          throw new Error(error);
        });
    }
  };

  const fetchCountries = () => {
    RestApi('countries', {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${state?.activeToken}`,
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

  const fetchStates = () => {
    RestApi('states', {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${state?.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setStates(
          res.data.map((c) => ({
            payload: c.state_name,
            text: c.state_name,
          })),
        );
      }
    });
  };

  useEffect(() => {
    if (!state) {
      navigate('/signup');
    } else {
      fetchCountries();
      fetchStates();
    }
  }, []);

  const onInputBlur = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    if (name === 'cin' && (cin?.length > 0 || CheckCinWithGST(gstNo))) {
      setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
    } else if (name === 'cin' && cin?.length === 0) {
      setValidationErr((s) => ({ ...s, [name]: false }));
    } else {
      setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
    }
  };

  const validatePAN = async (panNum) => {
    enableLoading(true);

    await RestApi(`/pan_verifications`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${state.activeToken}`,
      },
      payload: {
        pan: panNum,
      },
    })
      .then((data) => {
        enableLoading(false);
        if (!data.error) setOrgName(data.name);
        else
          openSnackBar({
            message: data.message || 'Something went wrong',
            type: MESSAGE_TYPE.ERROR,
          });
      })
      .catch((e) => {
        enableLoading(false);
        openSnackBar({
          message: e?.response?.data?.message || 'Something went wrong',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const onInputChange = (setter) => (e) => {
    onInputBlur(e);
    setter(e?.target?.value);

    if (e?.target?.name === 'gstNo' && e?.target?.value?.length === 15)
      getGstAddr(e?.target?.value);

    if (e?.target?.name === 'pincode' && e?.target?.value?.length === 6)
      fetchPincodeDetails(e?.target?.value);

    if (e.target.name === 'pan' && e.target.value.length === 10)
      validatePAN(e.target.value.toUpperCase());
    if (e.target.name === 'pan' && e.target.value.length < 10) setOrgName('');
  };

  const theme = Mui.useTheme();
  const desktopView = Mui.useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      {desktopView ? (
        <>
          <Mui.Grid container>
            <Mui.Grid md={6} className={css.loginImageContainer}>
              <Mui.Stack className={css.imageStack}>
                <img src={login} alt="img" className={css.imageStyle} />
              </Mui.Stack>
            </Mui.Grid>
            <Mui.Grid md={6} xs={12}>
              <Mui.Stack className={css.loginFormContainer}>
                <Mui.Stack direction="row" sx={{ mt: '70vh' }}>
                  <img
                    src={flowerLogo}
                    alt="flowerLogo"
                    style={{ width: '250px' }}
                  />
                  {/* <img src={fontLogo} alt="fontLogo" />
                  <Mui.Typography className={css.fontlogo}>
                    effortless
                  </Mui.Typography> */}
                </Mui.Stack>

                <Mui.Stack style={{ marginTop: '0.5rem' }}>
                  <Mui.Typography className={css.loginFont}>
                    Fill in your Business Details
                  </Mui.Typography>
                  <Mui.Typography className={css.loginSubFont}>
                    The Finance OS for your Business
                  </Mui.Typography>
                </Mui.Stack>

                <Mui.Stack spacing={3} className={css.marginT}>
                  <Mui.Stack className={css.inputStack}>
                    <Input
                      name="gstNo"
                      onBlur={onInputBlur}
                      error={validationErr.gstNo}
                      helperText={
                        validationErr.gstNo ? ValidationErrMsg.gstNo : ''
                      }
                      label="GSTIN"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setGstNo)}
                      text="capital"
                      disabled={checkGSTIN}
                      value={checkGSTIN ? '' : gstNo}
                    />
                  </Mui.Stack>
                  <Mui.Stack
                    direction="row"
                    alignItems="center"
                    style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                  >
                    <CustomCheckbox
                      style={{ color: 'white' }}
                      onChange={() => {
                        setCheckGSTIN(!checkGSTIN);
                        setGstNo('');
                      }}
                    />
                    <Mui.Typography className={css.checkboxText}>
                      My Business does not have a GSTIN
                    </Mui.Typography>
                  </Mui.Stack>

                  {!checkGSTIN && (
                    <Mui.Stack
                      className={css.inputStack}
                      style={{ marginTop: '-0.1rem' }}
                    >
                      <Input
                        name="cin"
                        onBlur={onInputBlur}
                        error={validationErr.cin}
                        helperText={
                          validationErr.cin ? ValidationErrMsg.cin : ''
                        }
                        label="CIN Number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        className={css.inputField}
                        onChange={onInputChange(setCin)}
                        text="capital"
                        // disabled={checkGSTIN}
                        value={cin}
                      />
                    </Mui.Stack>
                  )}

                  {checkGSTIN && (
                    <Mui.Stack
                      className={css.inputStack}
                      style={{ marginTop: '-0.1rem' }}
                    >
                      <Input
                        name="pan"
                        onBlur={onInputBlur}
                        error={validationErr.pan}
                        helperText={
                          validationErr.pan ? ValidationErrMsg.pan : ''
                        }
                        label="PAN Number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        className={css.inputField}
                        onChange={onInputChange(setPan)}
                        text="capital"
                        // disabled={checkGSTIN}
                        value={pan}
                      />
                    </Mui.Stack>
                  )}
                  <Mui.Stack className={css.inputStack}>
                    <Input
                      name="orgName"
                      onBlur={onInputBlur}
                      error={validationErr.orgName}
                      helperText={
                        validationErr.orgName ? ValidationErrMsg.orgName : ''
                      }
                      label="ORGANIZATION NAME"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                        fontSize: '10px',
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setOrgName)}
                      value={orgName}
                    />
                  </Mui.Stack>
                  <Mui.Stack className={css.inputStack}>
                    <Input
                      name="addrOne"
                      onBlur={onInputBlur}
                      error={validationErr.addrOne}
                      helperText={
                        validationErr.addrOne ? ValidationErrMsg.addrOne : ''
                      }
                      value={addrOne}
                      label="ORGANIZATION ADDRESS 1"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 45 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={mainCss.endInput}
                          >
                            {`${addrOne?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setAddrOne)}
                    />
                  </Mui.Stack>
                  <Mui.Stack className={css.inputStack}>
                    <Input
                      name="addrTwo"
                      onBlur={onInputBlur}
                      // error={validationErr.addrTwo}
                      // helperText={
                      //   validationErr.addrTwo ? ValidationErrMsg.addrTwo : ''
                      // }
                      value={addrTwo}
                      label="ORGANIZATION ADDRESS 2"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 45 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={mainCss.endInput}
                          >
                            {`${addrTwo?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setAddrTwo)}
                    />
                  </Mui.Stack>
                  <Mui.Stack className={css.inputStack}>
                    <Input
                      name="city"
                      onBlur={onInputBlur}
                      error={validationErr.city}
                      helperText={
                        validationErr.city ? ValidationErrMsg.city : ''
                      }
                      value={city}
                      label="CITY"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setCity)}
                    />
                  </Mui.Stack>

                  <Mui.Stack className={css.inputStack}>
                    <Input
                      name="pincode"
                      onBlur={onInputBlur}
                      error={validationErr.pincode}
                      helperText={
                        validationErr.pincode ? ValidationErrMsg.pincode : ''
                      }
                      value={pincode}
                      label="PINCODE"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        type: 'tel',
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setPincode)}
                      onKeyPress={pincodeKeyPress}
                    />
                  </Mui.Stack>
                  <Mui.Stack className={css.inputStack}>
                    <SingleSelect
                      name="country"
                      onBlur={onInputBlur}
                      error={validationErr.country}
                      helperText={
                        validationErr.country ? ValidationErrMsg.country : ''
                      }
                      label="COUNTRY"
                      options={countries}
                      defaultValue={country}
                      onChange={onInputChange(setCountry)}
                      fullWidth
                      fromFill
                      readO={!checkGSTIN}
                    />
                  </Mui.Stack>

                  <Mui.Stack className={css.inputStack}>
                    <SingleSelect
                      name="state"
                      onBlur={onInputBlur}
                      error={validationErr.state}
                      helperText={
                        validationErr.state ? ValidationErrMsg.state : ''
                      }
                      label="STATE"
                      options={states}
                      defaultValue={orgState}
                      onChange={onInputChange(setOrgState)}
                      fullWidth
                      fromFill
                      style={{
                        marginBottom: '0px',
                      }}
                    />
                  </Mui.Stack>
                  <Mui.Stack className={css.inputStack}>
                    <Input
                      name="companyLogo"
                      label="Company Logo"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      className={css.inputField}
                      rootStyle={{
                        border: '1px solid #49382a',
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
                      placeholder="Upload Here"
                      // onBlur={reValidate}
                      // error={validationErr.companyLogo}
                      // helperText={
                      //   validationErr.companyLogo
                      //     ? VALIDATION?.companyLogo?.errMsg
                      //     : ''
                      // }
                      onChange={onInputChange}
                      value={companyLogo?.companyLogoName}
                      // required
                    />
                  </Mui.Stack>
                  {/* <Mui.Stack
                    direction="row"
                    alignItems="center"
                    style={{ marginTop: '1rem' }}
                  >
                    <CustomCheckbox style={{ color: 'white' }} />
                    <Mui.Typography className={css.checkboxText}>
                      I agree to all the Terms and Privacy policy{' '}
                    </Mui.Typography>
                  </Mui.Stack> */}

                  {errorMessage && (
                    <div className={css.errorContainer}>
                      <InfoOutlinedIcon fontSize="small" />{' '}
                      <span className={css.errorText}>{errorMessage}</span>
                    </div>
                  )}

                  <Mui.Stack
                    direction="row"
                    spacing={2}
                    className={css.marginT}
                  >
                    <Button
                      variant="contained"
                      className={css.submitBtn}
                      fullWidth
                      onClick={onSubmit}
                    >
                      <Mui.Typography className={css.loginBtnText}>
                        create account
                      </Mui.Typography>
                    </Button>
                  </Mui.Stack>

                  <Mui.Stack className={css.ellipseStack}>
                    <img
                      src={ellipse}
                      alt="ellipse"
                      style={{ width: '70px' }}
                    />
                  </Mui.Stack>
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Grid>
          </Mui.Grid>
        </>
      ) : (
        <div className={css.loginContainer}>
          <IntroHeader />
          <div className={`${css.signInContainer} ${css.orgDetailsForm}`}>
            {initialPage && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Input
                      name="gstNo"
                      onBlur={onInputBlur}
                      error={validationErr.gstNo}
                      helperText={
                        validationErr.gstNo ? ValidationErrMsg.gstNo : ''
                      }
                      label="GSTIN"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setGstNo)}
                      text="capital"
                      disabled={checkGSTIN}
                      value={gstNo}
                    />
                  </Grid>
                  <Mui.Stack
                    direction="row"
                    alignItems="center"
                    style={{ margin: '0.5rem' }}
                  >
                    <CustomCheckbox
                      style={{ color: 'white' }}
                      onChange={() => {
                        setCheckGSTIN(!checkGSTIN);
                        setGstNo('');
                      }}
                    />
                    <Mui.Typography
                      className={css.checkboxText}
                      style={{ color: '#FFF', fontSize: '12px' }}
                    >
                      My Business does not have a GSTIN
                    </Mui.Typography>
                  </Mui.Stack>
                  {!checkGSTIN && (
                    <Grid item xs={12}>
                      <Input
                        name="cin"
                        onBlur={onInputBlur}
                        error={validationErr.cin}
                        helperText={
                          validationErr.cin ? ValidationErrMsg.cin : ''
                        }
                        label="CIN Number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        className={css.inputField}
                        onChange={onInputChange(setCin)}
                        text="capital"
                        // disabled={checkGSTIN}
                        value={cin}
                      />
                    </Grid>
                  )}
                  {checkGSTIN && (
                    <Grid item xs={12}>
                      <Input
                        name="pan"
                        onBlur={onInputBlur}
                        error={validationErr.pan}
                        helperText={
                          validationErr.pan ? ValidationErrMsg.pan : ''
                        }
                        label="PAN Number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        className={css.inputField}
                        onChange={onInputChange(setPan)}
                        text="capital"
                        // disabled={checkGSTIN}
                        value={pan}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Input
                      name="orgName"
                      onBlur={onInputBlur}
                      error={validationErr.orgName}
                      helperText={
                        validationErr.orgName ? ValidationErrMsg.orgName : ''
                      }
                      label="ORGANIZATION NAME"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setOrgName)}
                      value={orgName}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {!initialPage && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Input
                      name="addrOne"
                      onBlur={onInputBlur}
                      error={validationErr.addrOne}
                      helperText={
                        validationErr.addrOne ? ValidationErrMsg.addrOne : ''
                      }
                      value={addrOne}
                      label="ORGANIZATION ADDRESS 1"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 45 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={mainCss.endInput}
                          >
                            {`${addrOne?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setAddrOne)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      name="addrTwo"
                      onBlur={onInputBlur}
                      // error={validationErr.addrTwo}
                      // helperText={
                      //   validationErr.addrTwo ? ValidationErrMsg.addrTwo : ''
                      // }
                      value={addrTwo}
                      label="ORGANIZATION ADDRESS 2"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 45 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={mainCss.endInput}
                          >
                            {`${addrTwo?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      className={css.inputField}
                      onChange={onInputChange(setAddrTwo)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className={css.splitHalf}>
                      <div className={css.half}>
                        <Input
                          name="city"
                          onBlur={onInputBlur}
                          error={validationErr.city}
                          helperText={
                            validationErr.city ? ValidationErrMsg.city : ''
                          }
                          value={city}
                          label="CITY"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          className={css.inputField}
                          onChange={onInputChange(setCity)}
                        />
                      </div>
                      <div className={css.half}>
                        <Input
                          name="pincode"
                          onBlur={onInputBlur}
                          error={validationErr.pincode}
                          helperText={
                            validationErr.pincode
                              ? ValidationErrMsg.pincode
                              : ''
                          }
                          value={pincode}
                          label="PINCODE"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            type: 'tel',
                          }}
                          fullWidth
                          className={css.inputField}
                          onChange={onInputChange(setPincode)}
                          onKeyPress={pincodeKeyPress}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <SingleSelect
                      name="country"
                      onBlur={onInputBlur}
                      error={validationErr.country}
                      helperText={
                        validationErr.country ? ValidationErrMsg.country : ''
                      }
                      label="COUNTRY"
                      options={countries}
                      defaultValue={country}
                      onChange={onInputChange(setCountry)}
                      fullWidth
                      fromFill
                      style={{
                        marginBottom: '24px',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SingleSelect
                      name="state"
                      onBlur={onInputBlur}
                      error={validationErr.state}
                      helperText={
                        validationErr.state ? ValidationErrMsg.state : ''
                      }
                      label="STATE"
                      options={states}
                      defaultValue={orgState}
                      onChange={onInputChange(setOrgState)}
                      fullWidth
                      fromFill
                      style={{
                        marginBottom: '24px',
                      }}
                    />
                  </Grid>
                  <Mui.Grid item xs={12}>
                    <Input
                      name="companyLogo"
                      label="Company Logo"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      theme="light"
                      className={css.inputField}
                      rootStyle={{
                        border: '1px solid #49382a',
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
                      // placeholder="Upload Here"
                      // onBlur={reValidate}
                      // error={validationErr.companyLogo}
                      // helperText={
                      //   validationErr.companyLogo
                      //     ? VALIDATION?.companyLogo?.errMsg
                      //     : ''
                      // }
                      onChange={onInputChange}
                      value={companyLogo?.companyLogoName}
                      // required
                    />
                  </Mui.Grid>
                </Grid>
              </>
            )}

            {errorMessage && (
              <div className={css.errorContainer}>
                <InfoOutlinedIcon fontSize="small" />{' '}
                <span className={css.errorText}>{errorMessage}</span>
              </div>
            )}

            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={onSubmit1}
              style={{ margin: '20px 0' }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
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
    </>
  );
};

export default FillOrgDetailsContainer;
