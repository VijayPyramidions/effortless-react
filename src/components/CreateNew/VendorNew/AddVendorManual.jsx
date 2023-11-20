import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  verifyPan,
  setPanResponse,
} from '@action/Store/Reducers/General/GeneralState';
import { pincodeKeyPress } from '@components/utils';
import Input, { MobileNumberFormatCustom } from '@components/Input/Input';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { Grid, makeStyles, InputAdornment } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import JSBridge from '@nativeBridge/jsbridge';
import { ContactIcon, CheckCircle } from '@components/SvgIcons/SvgIcons';
import Select, { SingleSelect } from '@components/Select/Select';
import {
  // validateName,
  // validateEmail,
  validateGst,
  validateIfsc,
  validatePincode,
  validateAddress,
  validateNoSymbol,
  validateRequired,
  validatePan,
} from '@services/Validation';
import * as mainCss from '../../../App.scss';
import * as css from './AddVendorManual.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
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

const PageTitle = ['1 of 3', '2 0f 3', '3 of 3'];

const initialState = {
  // page 1 - GSTIN
  gst: '',
  noGst: false,
  pan: '',
  address1: '',
  address2: '',
  pincode: '',
  city: '',
  state: '',
  country: 'India',
  vendorName: '',
  // Page 2 - Details
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  // Page 3 - Banking
  accountNo: '',
  ifsc: '',
  bankName: '',
  bankBranch: '',
  validateBankAccount: false,
};

const AddVendorManual = ({
  onCancel,
  addVendorComplete,
  // veendorList
  details,
  // for people
  showVendorAvail,
  type,
}) => {
  const classes = useStyles();

  const {
    organization,
    enableLoading,
    user,
    openSnackBar,
    registerEventListeners,
    removeBankStore,
    loading,
  } = useContext(AppContext);

  const device = localStorage.getItem('device_detect');

  const dispatch = useDispatch();
  const { panValidationResponse } = useSelector((state) => state.General);

  const etype = () => {
    if (type === 'lender') {
      return 'Lender';
    }
    if (type === 'promoter') {
      return 'Promoter';
    }
    return 'Vendor';
  };

  const [state, setState] = useState(initialState);
  const [page, setPage] = useState(1);
  const [vendorAvailable, setVendorAvailable] = useState('');
  const [allStates, setAllStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [removeBank, setremoveBank] = useState(false);

  const VALIDATION =
    device === 'mobile'
      ? {
          gst: {
            errMsg: 'Please provide valid GST',
            test: validateGst,
            page: 1,
          },
          pincode: {
            errMsg: 'Enter valid Pincode',
            test:
              state?.country?.toLowerCase() === 'india'
                ? validatePincode
                : ()=>true,
            page: 1,
          },
          address1: {
            errMsg: 'Enter valid Address',
            test: validateAddress,
            page: 1,
          },
          // address2: {
          //   errMsg: 'Enter valid Address',
          //   test: validateAddress,
          //   page: 1,
          // },
          city: {
            errMsg: 'Enter valid City',
            test: validateNoSymbol,
            page: 1,
          },
          state: {
            errMsg: 'Enter valid State',
            test: validateRequired,
            page: 1,
          },
          country: {
            errMsg: 'Enter valid Country',
            test: validateRequired,
            page: 1,
          },
          vendorName: {
            errMsg: 'Enter valid Name',
            test: validateRequired,
            page: 1,
          },
          contactName: {
            errMsg: 'Please provide valid Contact Name',
            test: () => true,
            page: 2,
          },
          contactPhone: {
            errMsg: 'Please provide valid Contact Phone',
            test: () => true,
            page: 2,
          },
          contactEmail: {
            errMsg: 'Please provide valid Contact Email',
            test: () => true,
            page: 2,
          },
          accountNo: {
            errMsg: 'Enter valid Account',
            test: validateRequired,
            page: 3,
          },
          ifsc: {
            errMsg: 'Enter valid IFSC',
            test: validateIfsc,
            page: 3,
          },
          bankName: {
            errMsg: 'Enter valid Bank Name',
            test: validateRequired,
            page: 3,
          },
          bankBranch: {
            errMsg: 'Enter valid Bank Branch',
            test: validateRequired,
            page: 3,
          },
        }
      : {
          gst: {
            errMsg: 'Please provide valid GST',
            test: validateGst,
            page: 1,
            tick: true,
          },
          pincode: {
            errMsg: 'Enter valid Pincode',
            test:
              state?.country?.toLowerCase() === 'india'
                ? validatePincode
                : ()=>true,
            page: 1,
          },
          address1: {
            errMsg: 'Enter valid Address',
            test: validateAddress,
            page: 1,
          },
          // address2: {
          //   errMsg: 'Enter valid Address',
          //   test: validateAddress,
          //   page: 1,
          // },
          city: {
            errMsg: 'Enter valid City',
            test: validateNoSymbol,
            page: 1,
          },
          state: {
            errMsg: 'Enter valid State',
            test: validateRequired,
            page: 1,
          },
          country: {
            errMsg: 'Enter valid Country',
            test: validateRequired,
            page: 1,
          },
          vendorName: {
            errMsg: 'Enter valid Name',
            test: validateRequired,
            page: 1,
          },
          contactName: {
            errMsg: 'Please provide valid Contact Name',
            test: () => true,
            page: 1,
          },
          contactPhone: {
            errMsg: 'Please provide valid Contact Phone',
            test: () => true,
            page: 1,
          },
          contactEmail: {
            errMsg: 'Please provide valid Contact Email',
            test: () => true,
            page: 1,
          },
          accountNo: {
            errMsg: 'Enter valid Account',
            test: validateRequired,
            page: 1,
            from: 'skip',
          },
          ifsc: {
            errMsg: 'Enter valid IFSC',
            test: validateIfsc,
            page: 1,
            from: 'skip',
          },
          bankName: {
            errMsg: 'Enter valid Bank Name',
            test: validateRequired,
            page: 1,
            from: 'skip',
          },
          bankBranch: {
            errMsg: 'Enter valid Bank Branch',
            test: validateRequired,
            page: 1,
            from: 'skip',
          },
        };
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));

  const [validationErr, setValidationErr] = useState({
    ...initialValidationErr,
    pan: false,
  });

  React.useEffect(() => {
    if (vendorAvailable && showVendorAvail) {
      showVendorAvail(vendorAvailable);
    }
    if (!vendorAvailable && showVendorAvail) {
      showVendorAvail();
    }
  }, [vendorAvailable]);

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };

  React.useEffect(() => {
    if (details?.new_vendor && Object.keys(details?.new_vendor).length > 0) {
      const {
        name,
        address_line1: address1,
        address_line2: address2,
        pincode,
        city,
        state: stateDetails,
        country,
        gstin: gst,
        account_number: accountNo,
        bank_name: bankName,
        ifsc_code: ifsc,
      } = details?.new_vendor;
      setState((s) => ({
        ...s,
        gst: gst || '',
        // noGst: !gst,
        vendorName: name || '',
        address1: address1 || '',
        address2: address2 || '',
        pincode: pincode || '',
        city: city || '',
        state: stateDetails || '',
        country: country || '',
        accountNo: accountNo || '',
        bankName: bankName || '',
        ifsc: ifsc || '',
      }));
    }
  }, [details]);

  // console.log('vendoravailable', vendorAvailable);
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
            }))
          );
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };
  React.useEffect(() => {
    if (removeBankStore === 'true') {
      setremoveBank(true);
    }
  }, [removeBank]);
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
          }))
        );
      }
    });
  };

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown error occured',
      type: MESSAGE_TYPE.ERROR,
    });
  };

  const showSuccess = (message) => {
    openSnackBar({
      message: message || 'Last operation was successful',
      type: MESSAGE_TYPE.INFO,
    });
  };

  const existingVendorFlow = () => {
    addVendorComplete('exists', {
      id: vendorAvailable.vendor_id,
      name: vendorAvailable.vendor_name,
    });
  };
  const addVendor = async (key, requestBankDetails) => {
    // TODO - kbt - Call POST /vendor
    enableLoading(true);
    const payload = key
      ? {
          name: state.vendorName,
          type: etype()?.toLowerCase() || 'vendor',
          pan_number: state.pan === '' ? undefined : state?.pan?.toUpperCase(),
          contacts: [
            {
              name: state?.contactName === '' ? undefined : state?.contactName,
              mobile_number:
                state?.contactPhone === '' ? undefined : state?.contactPhone,
              email:
                state?.contactEmail === '' ? undefined : state?.contactEmail,
            },
          ],
          location: [
            {
              address_line1: state.address1,
              address_line2: state.address2,
              city: state.city,
              gstin: state?.gst?.toUpperCase(),
              pincode: state.pincode,
              state: state.state,
              country: state.country,
            },
          ],
          request_bank_details: requestBankDetails,
        }
      : {
          name: state.vendorName,
          type: etype()?.toLowerCase() || 'vendor',
          pan_number: state.pan === '' ? undefined : state?.pan?.toUpperCase(),
          contacts: [
            {
              name: state?.contactName === '' ? undefined : state?.contactName,
              mobile_number:
                state?.contactPhone === '' ? undefined : state?.contactPhone,
              email:
                state?.contactEmail === '' ? undefined : state?.contactEmail,
            },
          ],
          location: [
            {
              address_line1: state.address1,
              address_line2: state.address2,
              city: state.city,
              gstin: state?.gst?.toUpperCase(),
              pincode: state.pincode,
              state: state.state,
              country: state.country,
            },
          ],
          bank_details: [
            {
              bank_name: state.bankName,
              bank_account_number: state.accountNo,
              bank_branch_name: state.bankBranch,
              bank_ifsc_code: state.ifsc,
              beneficiary_mobile: state?.contactPhone,
              account_holder_name: state.contactName,
            },
          ],
        };
    await RestApi(`organizations/${organization.orgId}/entities`, {
      method: METHOD.POST,
      payload,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          // setIsVendorAvailable(true);
          addVendorComplete('success', res);
          showSuccess(res?.message || `${etype()} Successfully Added`);
        } else {
          const msg =
            res?.message ||
            res?.error ||
            Object?.values(res?.errors)?.join(',');
          showError(msg);
        }
        enableLoading(false);
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  const getGstAddress = (gstin) => {
    enableLoading(true);
    RestApi(`gstins`, {
      method: METHOD.POST,
      payload: {
        organization_id: organization.orgId,
        gstin: gstin?.toUpperCase(),
        gstin_type: 'Vendor',
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (res && res.vendor_id) {
            setVendorAvailable(res);
          } else {
            setVendorAvailable('');
            if (Object.keys(res).length > 0) {
              const {
                address_line1: address1,
                address_line2: address2,
                city,
                state: stateRes,
                pincode,
                country,
              } = res;
              // const vendorName = res.vendor_name ? res.vendor_name : res.name;
              // if(res.vendor_name){

              // }
              // res.vendor_name ? const {vendor_name: vendorName} = res : const {name: vendorName};
              // if(res.vendor_name){
              //   const {
              //     vendor_name: vendorName,
              //   } = res;
              // } else {
              //   const {
              //     name: vendorName,
              //   } = res;
              // }

              setState((s) => ({
                ...s,
                address1: address1?.substring(0, 45),
                address2: address2?.substring(0, 45),
                city,
                state: stateRes,
                pincode,
                vendorName: res.vendor_name ? res.vendor_name : res.name,
                country,
              }));
            } else {
              // setState(initialState);
              setState((s) => ({
                ...s,
                address1: '',
                address2: '',
                city: '',
                state: '',
                pincode: '',
                vendorName: '',
                country: 'India',
              }));
              throw new Error();
            }
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

  const getBankDetails = (code) => {
    enableLoading(true);
    RestApi(`ifsc?ifsc=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const { BANK: bankName, BRANCH: bankBranch } = res;
          setState((s) => ({
            ...s,
            bankName,
            bankBranch,
          }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  useMemo(() => {
    if (state?.ifsc && state?.ifsc.length === 11) {
      getBankDetails(state?.ifsc);
    }
  }, [state?.ifsc]);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(state[v]);
      return a;
    }, {});
  };

  const onPageNext = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      if (VALIDATION[k]?.page === page) {
        sectionValidation[k] = VALIDATION[k];
      }
    });
    // if (state?.noGst && panEnable) {
    //   sectionValidation.pan = {
    //     errMsg: 'Please provide valid PAN',
    //     test: validatePan,
    //     page: 1,
    //   };
    //   delete sectionValidation.gst;
    // } else if (state?.noGst && !panEnable) {
    //   delete sectionValidation.gst;
    // }
    if (state?.noGst) {
      delete sectionValidation.gst;
    }
    if (state?.noGst && state?.pan?.length > 0) {
      sectionValidation.pan = {
        errMsg: 'Please provide valid PAN',
        test: validatePan,
        page: 1,
      };
    }
    if (state?.noGst && state?.pan?.length === 0) {
      delete sectionValidation.pan;
      setValidationErr((s) => ({ ...s, pan: false }));
    }
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    // No validation if checkbox ticked in page 1
    // const bypass = page === 1 && state.noGst;
    // if (!panEnable && !valid) {
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    if (valid && page === 1) {
      // if (state.noGst && state.vendorName !== '') {
      //   setPage((p) => p + 1);
      // } else if (state.gst === '' || state.vendorName === '') {
      //   if (state.gst === '') {
      //     setValidationErr((s) => ({ ...s, gst: true }));
      //   }
      //   if (state.vendorName === '') {
      //     setValidationErr((s) => ({ ...s, vendorName: true }));
      //   }
      // } else {
      setPage((p) => p + 1);
      // }
    }
    if (valid && page === 2) {
      setPage((p) => p + 1);
    }
    if (valid && page === 3) addVendor();
  };

  const onPagePrev = () => {
    if (page > 1) setPage((p) => p - 1);
    if (page === 1) onCancel();
  };

  const onPageNextForWeb = (key, requestBankDetails) => {
    enableLoading(true);
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      if (!state.noGst) {
        if (!key && VALIDATION[k]?.page === page) {
          sectionValidation[k] = VALIDATION[k];
        } else if (
          key &&
          VALIDATION[k]?.page === page &&
          !VALIDATION[k]?.from
        ) {
          sectionValidation[k] = VALIDATION[k];
        }
      } else if (state.noGst) {
        if (!key && VALIDATION[k]?.page === page && !VALIDATION[k]?.tick) {
          sectionValidation[k] = VALIDATION[k];
        } else if (
          key &&
          VALIDATION[k]?.page === page &&
          !VALIDATION[k]?.from &&
          !VALIDATION[k]?.tick
        ) {
          sectionValidation[k] = VALIDATION[k];
        }
      }
    });
    if (state?.noGst) {
      delete sectionValidation.gst;
    }
    if (state?.noGst && state?.pan?.length > 0) {
      sectionValidation.pan = {
        errMsg: 'Please provide valid PAN',
        test: validatePan,
        page: 1,
      };
    }
    if (state?.noGst && state?.pan?.length === 0) {
      delete sectionValidation.pan;
      setValidationErr((s) => ({ ...s, pan: false }));
    }
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    enableLoading(false);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else {
      if (key) {
        addVendor(true, requestBankDetails);
      }
      if (!key) {
        addVendor();
      }
    }
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value =
      ps?.target?.type === 'checkbox'
        ? ps?.target?.checked
        : (name === 'gst' && ps?.target?.value?.toUpperCase()) ||
          ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    const bypass = name === 'gst' && state.noGst;
    if (name === 'pan') {
      setValidationErr((v) => ({
        ...v,
        [name]: value?.length > 0 ? !validatePan(value) : false,
      }));
    } else {
      setValidationErr((v) => ({
        ...v,
        [name]: !bypass && !VALIDATION[name]?.test?.(value),
      }));
    }
  };

  React.useEffect(() => {
    if (state?.vendorName !== '') {
      reValidate({ target: { name: 'vendorName', value: state?.vendorName } });
    }
  }, [state?.vendorName]);
  React.useEffect(() => {
    if (state?.address1 !== '') {
      reValidate({ target: { name: 'address1', value: state?.address1 } });
    }
  }, [state?.address1]);
  // React.useEffect(() => {
  //   if (state?.address2 !== '') {
  //     reValidate({ target: { name: 'address2', value: state?.address2 } });
  //   }
  // }, [state?.address2]);
  React.useEffect(() => {
    if (state?.pincode !== '') {
      reValidate({ target: { name: 'pincode', value: state?.pincode } });
    }
  }, [state?.pincode]);
  React.useEffect(() => {
    if (state?.state !== '') {
      reValidate({ target: { name: 'state', value: state?.state } });
    }
  }, [state?.state]);
  React.useEffect(() => {
    if (state?.city !== '') {
      reValidate({ target: { name: 'city', value: state?.city } });
    }
  }, [state?.city]);

  React.useEffect(() => {
    if (state?.bankBranch !== '') {
      reValidate({ target: { name: 'bankBranch', value: state?.bankBranch } });
    }
  }, [state?.bankBranch]);
  React.useEffect(() => {
    if (state?.bankName !== '') {
      reValidate({ target: { name: 'bankName', value: state?.bankName } });
    }
  }, [state?.bankName]);

  React.useEffect(() => {
    if (state?.ifsc !== '') {
      reValidate({ target: { name: 'ifsc', value: state?.ifsc } });
    }
  }, [state?.ifsc]);

  // const checkVendorExistence = (gstin) => {
  //   enableLoading(true);
  //   const payload = {
  //     organization_id: organization.orgId,
  //     gstin: gstin.toUpperCase(),
  //     gstin_type: 'Vendor',
  //   };
  //   RestApi(`gstins`, {
  //     method: METHOD.POST,
  //     payload,
  //     headers: {
  //       Authorization: `Bearer ${user.activeToken}`,
  //     },
  //   })
  //     .then((res) => {
  //       if (res && res.vendor_id) {
  //         setVendorAvailable(res);
  //       } else {
  //         setVendorAvailable('');
  //       }
  //       enableLoading(false);
  //     })
  //     .catch(() => {
  //       enableLoading(false);
  //       openSnackBar({
  //         message: `Incorrect GST or unable to retrieve address`,
  //         type: MESSAGE_TYPE.ERROR,
  //       });
  //     });
  // };
  const validateBankAccount = () => {
    const payload = {
      ifsc: state.ifsc,
      account_number: state.accountNo,
      name: state.beneficiaryName,
      mobile: state?.contactPhone,
      organization_id: organization.orgId,
    };
    RestApi(`bank_details_verifications`, {
      method: METHOD.POST,
      payload,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error && res.verified) {
        showSuccess('Verification Successful');
      } else {
        showError(res?.message || 'Verification Not Successful');
      }
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
        if (res && !res.error && Object.keys(res || {})?.length > 0) {
          const { city, state: stateRes, country } = res;

          setState((s) => ({
            ...s,
            city,
            state: stateRes,
            country,
          }));
        }
        if (Object.keys(res || {})?.length === 0) {
          setValidationErr((s) => ({ ...s, pincode: true }));
          setState((s) => ({
            ...s,
            city: '',
            state: '',
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

  const onInputChange = (ps) => {
    const [name, value] = getEventNameValue(ps);
    if (name === 'contactPhone' && value?.toString().length > 0) reValidate(ps);
    else if (name !== 'contactPhone') reValidate(ps);

    if (name === 'noGst' && value)
      setValidationErr((s) => ({ ...s, gst: false }));

    if (name === 'noGst' && !value) {
      setValidationErr((s) => ({ ...s, pan: false }));
      setState((prev) => ({ ...prev, pan: '' }));
    }
    setState((s) => ({
      ...s,
      [name]: name === 'gst' ? value.toUpperCase() : value,
    }));
    // checkVendorExistence(value);

    if (name === 'gst' && value.length === 15) getGstAddress(value);
    else if (name === 'gst' && value.length === 0) setVendorAvailable('');

    if (name === 'ifsc' && value.length === 11) getBankDetails(value);

    if (name === 'copyContactNameAsVendor' && value)
      setState((s) => ({ ...s, vendorName: s.contactName }));

    if (name === 'validateBankAccount' && value) validateBankAccount();
    if (
      state?.country?.toLowerCase() === 'india' &&
      name === 'pincode' &&
      value.length === 6
    )
      fetchPincodeDetails(value);
    if (name === 'pan' && value.length === 10)
      dispatch(verifyPan({ pan: value.toUpperCase(), type: 'vendor' }));
    if (name === 'pan' && (value === '' || value.length < 10))
      setState((s) => ({
        ...s,
        vendorName: '',
      }));
  };

  const handleCustomer = (ele) => {
    setTimeout(() => {
      console.log(ele);

      setState((s) => ({
        ...s,
        contactName: ele.Name,
        contactPhone: ele.phone,
        contactEmail: ele.email,
      }));
      // setIndividualName(ele.Name);
      // setMobileNo(ele.Phoneno);
    }, 100);
    // handleBottomSheet1('contact');
  };

  const getContacts = () => {
    // enableLoading(true);
    JSBridge.getContactsVendor();
    // onTriggerDrawer('contact');
    // setContactDetails(JSON.parse(localStorage.getItem('contact_details')));
  };

  const setContacts = (response) => {
    // JSBridge.getContacts();
    // onTriggerDrawer('contact');
    // setContactDetails(JSON.parse(response.detail.value));
    handleCustomer(JSON.parse(response.detail.value));
    // enableLoading(false);
  };

  useEffect(() => {
    if (panValidationResponse && panValidationResponse.type === 'vendor') {
      setState((s) => ({
        ...s,
        vendorName: panValidationResponse.name,
      }));
    }
  }, [panValidationResponse]);

  useEffect(() => {
    registerEventListeners({
      name: 'contactDetailsDataVendor',
      method: setContacts,
    });
    fetchAllStates();
    fetchCountries();
    return () => dispatch(setPanResponse(null));
  }, []);

  return (
    <div
      className={css.magicLinkContainer}
      style={{ padding: device === 'mobile' ? '20px' : '' }}
    >
      {device === 'mobile' && (
        <>
          <div className={css.headerContainer}>
            <div className={css.headerLabelForEdit}>
              Add a New {etype()} - {PageTitle[page - 1]}
            </div>
            <span className={css.headerUnderline} />
          </div>
          <div className={css.inputContainer}>
            {page === 1 && (
              <>
                <Input
                  disabled={state.noGst}
                  name="gst"
                  onBlur={reValidate}
                  error={validationErr.gst}
                  helperText={validationErr.gst ? VALIDATION?.gst?.errMsg : ''}
                  className={`${css.greyBorder} ${classes.root}`}
                  label="GSTIN"
                  variant="standard"
                  value={state.gst}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    type: 'text',
                    endAdornment: vendorAvailable ? <CheckCircle /> : null,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  required
                />
                {!vendorAvailable && state.gst === '' && (
                  <div className={css.noGst}>
                    <Checkbox
                      name="noGst"
                      checked={state.noGst}
                      onChange={onInputChange}
                    />
                    <div htmlFor="whatsappNotify" className={css.label}>
                      My {etype()} Does Not Have a GST Number
                    </div>
                  </div>
                )}

                {state.noGst && (
                  <Input
                    name="pan"
                    onBlur={reValidate}
                    error={validationErr.pan}
                    helperText={
                      validationErr.pan ? 'Please provide valid Pan' : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Pan Number"
                    variant="standard"
                    value={state?.pan?.toUpperCase()}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // InputProps={{
                    //   type: 'text',
                    //   endAdornment: vendorAvailable ? <CheckCircle /> : null,
                    // }}
                    inputProps={{
                      maxLength: 10,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    text="capital"
                    required
                  />
                )}

                {!vendorAvailable && page === 1 && (
                  <>
                    <Input
                      name="vendorName"
                      onBlur={reValidate}
                      error={validationErr.vendorName}
                      helperText={
                        validationErr.vendorName
                          ? VALIDATION?.vendorName?.errMsg
                          : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label={`${etype()} Name`}
                      variant="standard"
                      value={state.vendorName}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      required
                    />

                    <Input
                      name="address1"
                      onBlur={reValidate}
                      error={validationErr.address1}
                      helperText={
                        validationErr.address1
                          ? VALIDATION?.address1?.errMsg
                          : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Address line 1"
                      variant="standard"
                      value={state.address1}
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
                            {`${state?.address1?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      required
                    />

                    <Input
                      name="address2"
                      onBlur={reValidate}
                      // error={validationErr.address2}
                      // helperText={
                      //   validationErr.address2
                      //     ? VALIDATION?.address2?.errMsg
                      //     : ''
                      // }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Address line 2"
                      variant="standard"
                      value={state.address2}
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
                            {`${state?.address2?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      required
                    />
                    <div className={css.twoFields}>
                      <Input
                        name="pincode"
                        onBlur={reValidate}
                        error={
                          state?.country?.toLowerCase() === 'india' &&
                          validationErr.pincode
                        }
                        helperText={
                          state?.country?.toLowerCase() === 'india' &&
                          validationErr.pincode
                            ? VALIDATION?.pincode?.errMsg
                            : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Pin Code"
                        variant="standard"
                        value={state.pincode}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          type: state?.country?.toLowerCase() === 'india' ? 'tel' : 'text',
                          maxLength:
                            state?.country?.toLowerCase() === 'india' && 6,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        required
                        onKeyPress={
                          state?.country?.toLowerCase() === 'india' &&
                          pincodeKeyPress
                        }
                      />
                      <Input
                        name="city"
                        onBlur={reValidate}
                        error={validationErr.city}
                        helperText={
                          validationErr.city ? VALIDATION?.city?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Town/City"
                        variant="standard"
                        value={state.city}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        required
                      />
                    </div>
                    <div className={css.twoFields}>
                      {/* <Input
                         name="state"
                         onBlur={reValidate}
                         error={validationErr.state}
                         helperText={
                           validationErr.state ? VALIDATION?.state?.errMsg : ''
                         }
                         className={`${css.greyBorder} ${classes.root}`}
                         label="State"
                         variant="standard"
                         value={state.state}
                         InputLabelProps={{
                           shrink: true,
                         }}
                         fullWidth
                         onChange={onInputChange}
                         theme="light"
                       /> */}
                      <SingleSelect
                        name="state"
                        onBlur={reValidate}
                        error={validationErr.state}
                        helperText={
                          validationErr.state ? VALIDATION?.state?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="State"
                        variant="standard"
                        options={allStates}
                        defaultValue={state?.state}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={onInputChange}
                        theme="light"
                        required
                      />
                      {/* <Select
                        name="state"
                        onBlur={reValidate}
                        error={validationErr.state}
                        helperText={
                          validationErr.state ? VALIDATION?.state?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="State"
                        variant="standard"
                        options={allStates}
                        defaultValue={state?.state}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                      /> */}
                      {/* <Input
                         name="country"
                         onBlur={reValidate}
                         error={validationErr.country}
                         ry
                         helperText={
                           validationErr.country
                             ? VALIDATION?.country?.errMsg
                             : ''
                         }
                         className={`${css.greyBorder} ${classes.root}`}
                         label="Country"
                         variant="standard"
                         value={state.country}
                         InputLabelProps={{
                           shrink: true,
                         }}
                         fullWidth
                         onChange={onInputChange}
                         theme="light"
                       /> */}
                      <Select
                        name="country"
                        onBlur={reValidate}
                        error={validationErr.country}
                        ry
                        helperText={
                          validationErr.country
                            ? VALIDATION?.country?.errMsg
                            : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Country"
                        variant="standard"
                        options={countries}
                        defaultValue={state.country}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                      />
                    </div>
                  </>
                )}
              </>
            )}
            {page === 2 && (
              <>
                <Grid item xs={12} style={{ position: 'relative' }}>
                  <Input
                    name="contactName"
                    onBlur={reValidate}
                    error={validationErr.contactName}
                    helperText={
                      validationErr.contactName
                        ? VALIDATION?.contactName?.errMsg
                        : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Contact Name"
                    variant="standard"
                    value={state.contactName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    // required
                  />
                  <span className={css.contactIcon} onClick={getContacts}>
                    <ContactIcon />
                  </span>
                  {/* <SelectBottomSheet
                     name="contact"
                     triggerComponent={
                       <span className={css.contactIcon} onClick={getContacts}>
                         <ContactIcon />
                       </span>
                     }
                     open={drawer.contact}
                     onTrigger={onTriggerDrawer}
                     onClose={handleBottomSheet1}
                     maxHeight="45vh"
                   >
                     <div
                       className={css.searchFilter}
                       style={{
                         display: 'flex',
                         alignItems: 'center',
                         margin: '15px',
                         padding: '15px',
                         border: '1px solid #af9d9d',
                         borderRadius: '10px',
                       }}
                     >
                       <SearchIcon style={{ color: '#af9d9d' }} />{' '}
                       <input
                         placeholder="Search for Customer"
                         onChange={(event) => setQuery(event.target.value)}
                         className={css.textFieldFocus}
                         style={{ border: 'none' }}
                       />
                     </div>
                     {contactDetails &&
                       contactDetails
                         .filter((post) => {
                           if (query === '') {
                             return post;
                           }
                           if (
                             post.Name.toLowerCase().includes(
                               query.toLowerCase(),
                             ) ||
                             post.Phoneno.toLowerCase().includes(
                               query.toLowerCase(),
                             )
                           ) {
                             return post;
                           }
                           return false;
                         })
                         .map((element) => (
                           <div
                             className={css.valueWrapper}
                             onClick={() => handleCustomer(element)}
                             style={{ padding: '5px' }}
                           >
                             <span
                               className={css.value}
                               style={{ padding: '5px 20px' }}
                             >
                               {element.Name}
                             </span>
                             <br />
                             <span
                               className={css.value}
                               style={{ padding: '5px 25px' }}
                             >
                               {element.Phoneno}
                             </span>
                             <hr />
                           </div>
                         ))}
                   </SelectBottomSheet> */}
                </Grid>
                <Input
                  name="contactPhone"
                  onBlur={reValidate}
                  error={validationErr.contactPhone}
                  helperText={
                    validationErr.contactPhone
                      ? VALIDATION?.contactPhone?.errMsg
                      : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Contact Phone Number"
                  variant="standard"
                  value={state.contactPhone}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    type: 'tel',
                  }}
                  InputProps={{
                    inputComponent: MobileNumberFormatCustom,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  // required
                />
                <Input
                  name="contactEmail"
                  onBlur={reValidate}
                  error={validationErr.contactEmail}
                  helperText={
                    validationErr.contactEmail
                      ? VALIDATION?.contactEmail?.errMsg
                      : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Contact Email ID"
                  variant="standard"
                  value={state.contactEmail}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  required
                />
              </>
            )}
            {page === 3 && (
              <>
                <Input
                  name="accountNo"
                  onBlur={reValidate}
                  error={validationErr.accountNo}
                  helperText={
                    validationErr.accountNo ? VALIDATION?.accountNo?.errMsg : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Account Number"
                  variant="standard"
                  value={state.accountNo}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  required
                  type="number"
                />
                <Input
                  name="ifsc"
                  onBlur={reValidate}
                  error={validationErr.ifsc}
                  helperText={
                    validationErr.ifsc ? VALIDATION?.ifsc?.errMsg : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="IFSC Code"
                  variant="standard"
                  value={state.ifsc}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  text="capital"
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  onKeyPress={handleIfscKeyPress}
                  required
                />
                <div className={css.twoFields}>
                  <Input
                    name="bankName"
                    onBlur={reValidate}
                    error={validationErr.bankName}
                    helperText={
                      validationErr.bankName ? VALIDATION?.bankName?.errMsg : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Bank Name"
                    variant="standard"
                    value={state.bankName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    required
                  />
                  <Input
                    name="bankBranch"
                    onBlur={reValidate}
                    error={validationErr.bankBranch}
                    helperText={
                      validationErr.bankBranch
                        ? VALIDATION?.bankBranch?.errMsg
                        : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Bank Branch"
                    variant="standard"
                    value={state.bankBranch}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    required
                  />
                </div>
                <div className={css.bankValidationCheck}>
                  <Checkbox
                    name="validateBankAccount"
                    checked={state.validateBankAccount}
                    onChange={onInputChange}
                  />
                  <div className={css.info}>
                    <div className={css.title}>Validate Bank Account</div>
                    <div className={css.description}>
                      On checking the box, Rs. 1 will be deducted for validation
                      purpose.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {!vendorAvailable && (
            <>
              <div className={css.actionContainer}>
                <Button
                  variant="outlined"
                  className={css.outlineButton}
                  onClick={() => onPagePrev()}
                  size="medium"
                >
                  Back
                </Button>
                <Button
                  onClick={() => onPageNext()}
                  size="medium"
                  className={css.submitButton}
                >
                  {page === 3 ? 'Save and Finish ' : 'Save and Continue'}
                </Button>
              </div>
              {page === 3 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        height: '3px',
                        flex: 1,
                        backgroundColor: '#8B8B8B',
                      }}
                    />
                    <div style={{ marginRight: '10px', marginLeft: '10px' }}>
                      OR
                    </div>
                    <div
                      style={{
                        height: '3px',
                        flex: 1,
                        backgroundColor: '#8B8B8B',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      backgroundColor: '#49AD99',
                      borderRadius: '18px',
                      padding: '20px',
                      marginBottom: '20px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => addVendor(true)}
                    disabled={loading}
                  >
                    <MailOutlineIcon style={{ color: '#FFFFFF' }} />

                    <div
                      style={{
                        color: '#FFFFFF',
                        fontSize: '14px',
                        lineHeight: '18px',
                        marginLeft: '10px',
                      }}
                      disabled={loading}
                    >
                      Request Payment Details from {etype()}
                    </div>
                  </div>
                  <div
                    style={{
                      border: '1px solid #49AD99',
                      borderRadius: '18px',
                      padding: '20px',
                      cursor: 'pointer',
                    }}
                    onClick={() => addVendor(true)}
                    disabled={loading}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#49AD99',
                        fontSize: '14px',
                        lineHeight: '18px',
                      }}
                      disabled={loading}
                    >
                      Skip for Now and Continue
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {!showVendorAvail && vendorAvailable && (
            <div className={css.vendorAvailable}>
              <p>
                {vendorAvailable.vendor_name} is already a part of your list
              </p>
              <p>Would you like to record a bill?</p>

              <Button
                onClick={() => existingVendorFlow()}
                size="medium"
                className={css.submitButton}
              >
                Record Bill for {vendorAvailable.vendor_name}
              </Button>
            </div>
          )}
        </>
      )}
      {device === 'desktop' && (
        <>
          <div
            className={css.headerContainer}
            style={{ margin: '3vh 3vw 0', height: '6vh' }}
          >
            <div className={css.headerLabelForEdit}>Add a New {etype()}</div>
          </div>
          <div
            style={{
              overflow: 'auto',
              padding: '0 20px 20px',
              maxHeight: '85vh',
              minHeight: 'auto',
            }}
          >
            <div className={css.inputContainer}>
              {/* {page === 1 ||
             (device === 'desktop' && ( */}
              {/* <> */}
              <Input
                disabled={state.noGst}
                name="gst"
                onBlur={reValidate}
                error={validationErr.gst}
                helperText={validationErr.gst ? VALIDATION?.gst?.errMsg : ''}
                className={`${css.greyBorder} ${classes.root}`}
                label="GSTIN"
                variant="standard"
                value={state.gst}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  type: 'text',
                  endAdornment: vendorAvailable ? <CheckCircle /> : null,
                }}
                fullWidth
                onChange={onInputChange}
                theme="light"
                required
              />
              {!vendorAvailable && state.gst === '' && (
                <div className={css.noGst}>
                  <Checkbox
                    name="noGst"
                    checked={state.noGst}
                    onChange={onInputChange}
                  />
                  <div htmlFor="whatsappNotify" className={css.label}>
                    My {etype()} Does Not Have a GST Number
                  </div>
                </div>
              )}

              {state.noGst && (
                <Input
                  name="pan"
                  onBlur={reValidate}
                  error={validationErr.pan}
                  helperText={
                    validationErr.pan ? 'Please provide valid Pan' : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Pan Number"
                  variant="standard"
                  value={state?.pan?.toUpperCase()}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // InputProps={{
                  //   type: 'text',
                  //   endAdornment: vendorAvailable ? <CheckCircle /> : null,
                  // }}
                  inputProps={{
                    maxLength: 10,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  text="capital"
                  required
                />
              )}

              {!vendorAvailable && (
                <>
                  <>
                    <Input
                      name="vendorName"
                      onBlur={reValidate}
                      error={validationErr.vendorName}
                      helperText={
                        validationErr.vendorName
                          ? VALIDATION?.vendorName?.errMsg
                          : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label={`${etype()} Name`}
                      variant="standard"
                      value={state.vendorName}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      required
                    />

                    <Input
                      name="address1"
                      onBlur={reValidate}
                      error={validationErr.address1}
                      helperText={
                        validationErr.address1
                          ? VALIDATION?.address1?.errMsg
                          : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Address line 1"
                      variant="standard"
                      value={state.address1}
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
                            {`${state?.address1?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      required
                    />
                    <Input
                      name="address2"
                      onBlur={reValidate}
                      // error={validationErr.address2}
                      // helperText={
                      //   validationErr.address2
                      //     ? VALIDATION?.address2?.errMsg
                      //     : ''
                      // }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Address line 2"
                      variant="standard"
                      value={state.address2}
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
                            {`${state?.address2?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                    />
                    <div className={css.twoFields}>
                      <Input
                        name="pincode"
                        onBlur={reValidate}
                        error={
                          state?.country?.toLowerCase() === 'india' &&
                          validationErr.pincode
                        }
                        helperText={
                          state?.country?.toLowerCase() === 'india' &&
                          validationErr.pincode
                            ? VALIDATION?.pincode?.errMsg
                            : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Pin Code"
                        variant="standard"
                        value={state.pincode}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          type:  state?.country?.toLowerCase() === 'india' ? 'tel' : 'text',
                          maxLength:
                            state?.country?.toLowerCase() === 'india' && 6,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        required
                        onKeyPress={
                          state?.country?.toLowerCase() === 'india' &&
                          pincodeKeyPress
                        }
                      />
                      <Input
                        name="city"
                        onBlur={reValidate}
                        error={validationErr.city}
                        helperText={
                          validationErr.city ? VALIDATION?.city?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Town/City"
                        variant="standard"
                        value={state.city}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        required
                      />
                    </div>
                    <div className={css.twoFields}>
                      {/* <Input
                       name="state"
                       onBlur={reValidate}
                       error={validationErr.state}
                       helperText={
                         validationErr.state ? VALIDATION?.state?.errMsg : ''
                       }
                       className={`${css.greyBorder} ${classes.root}`}
                       label="State"
                       variant="standard"
                       value={state.state}
                       InputLabelProps={{
                         shrink: true,
                       }}
                       fullWidth
                       onChange={onInputChange}
                       theme="light"
                     /> */}

                      <SingleSelect
                        name="state"
                        onBlur={reValidate}
                        error={validationErr.state}
                        helperText={
                          validationErr.state ? VALIDATION?.state?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="State"
                        variant="standard"
                        options={allStates}
                        defaultValue={state?.state}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={onInputChange}
                        theme="light"
                        required
                      />

                      {/* <Select
                      name="state"
                      onBlur={reValidate}
                      error={validationErr.state}
                      helperText={
                        validationErr.state ? VALIDATION?.state?.errMsg : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="State"
                      variant="standard"
                      options={allStates}
                      defaultValue={state?.state}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                    /> */}

                      {/* <Input
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
                       value={state.country}
                       InputLabelProps={{
                         shrink: true,
                       }}
                       fullWidth
                       onChange={onInputChange}
                       theme="light"
                     /> */}
                      {/* <SingleSelect
                  name="country"
                  onBlur={reValidate}
                  error={validationErr.country}
                  helperText={validationErr.country ? VALIDATION?.country?.errMsg : ''}
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Country"
                  variant="standard"
                  options={countries}
                  defaultValue={state?.country}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={onInputChange}
                  theme="light"
                  required
                /> */}
                      <Select
                        name="country"
                        onBlur={reValidate}
                        error={validationErr.country}
                        ry
                        helperText={
                          validationErr.country
                            ? VALIDATION?.country?.errMsg
                            : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Country"
                        variant="standard"
                        options={countries}
                        defaultValue={state.country}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                      />
                    </div>
                  </>
                  {/* </> */}
                  <>
                    <Grid item xs={12} style={{ position: 'relative' }}>
                      <Input
                        name="contactName"
                        onBlur={reValidate}
                        error={validationErr.contactName}
                        helperText={
                          validationErr.contactName
                            ? VALIDATION?.contactName?.errMsg
                            : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Contact Name"
                        variant="standard"
                        value={state.contactName}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        // required
                      />
                      {/* <SelectBottomSheet
                   name="contact"
                   triggerComponent={
                     <span className={css.contactIcon} onClick={getContacts}>
                       <ContactIcon />
                     </span>
                   }
                   open={drawer.contact}
                   onTrigger={onTriggerDrawer}
                   onClose={handleBottomSheet1}
                   maxHeight="45vh"
                 >
                   <div
                     className={css.searchFilter}
                     style={{
                       display: 'flex',
                       alignItems: 'center',
                       margin: '15px',
                       padding: '15px',
                       border: '1px solid #af9d9d',
                       borderRadius: '10px',
                     }}
                   >
                     <SearchIcon style={{ color: '#af9d9d' }} />{' '}
                     <input
                       placeholder="Search for Customer"
                       onChange={(event) => setQuery(event.target.value)}
                       className={css.textFieldFocus}
                       style={{ border: 'none' }}
                     />
                   </div>
                   {contactDetails &&
                     contactDetails
                       .filter((post) => {
                         if (query === '') {
                           return post;
                         }
                         if (
                           post.Name.toLowerCase().includes(
                             query.toLowerCase(),
                           ) ||
                           post.Phoneno.toLowerCase().includes(
                             query.toLowerCase(),
                           )
                         ) {
                           return post;
                         }
                         return false;
                       })
                       .map((element) => (
                         <div
                           className={css.valueWrapper}
                           onClick={() => handleCustomer(element)}
                           style={{ padding: '5px' }}
                         >
                           <span
                             className={css.value}
                             style={{ padding: '5px 20px' }}
                           >
                             {element.Name}
                           </span>
                           <br />
                           <span
                             className={css.value}
                             style={{ padding: '5px 25px' }}
                           >
                             {element.Phoneno}
                           </span>
                           <hr />
                         </div>
                       ))}
                 </SelectBottomSheet> */}
                    </Grid>
                    <Input
                      name="contactPhone"
                      onBlur={reValidate}
                      error={validationErr.contactPhone}
                      helperText={
                        validationErr.contactPhone
                          ? VALIDATION?.contactPhone?.errMsg
                          : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Contact Phone Number"
                      variant="standard"
                      value={state.contactPhone}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        type: 'tel',
                      }}
                      InputProps={{
                        inputComponent: MobileNumberFormatCustom,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      // required
                    />
                    <Input
                      name="contactEmail"
                      onBlur={reValidate}
                      error={validationErr.contactEmail}
                      helperText={
                        validationErr.contactEmail
                          ? VALIDATION?.contactEmail?.errMsg
                          : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Contact Email ID"
                      variant="standard"
                      value={state.contactEmail}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      // required
                    />
                  </>
                  {!removeBank ? (
                    <>
                      <Input
                        name="accountNo"
                        onBlur={reValidate}
                        error={validationErr.accountNo}
                        helperText={
                          validationErr.accountNo
                            ? VALIDATION?.accountNo?.errMsg
                            : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Account Number"
                        variant="standard"
                        value={state.accountNo}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        required
                        type="number"
                      />
                      <Input
                        name="ifsc"
                        onBlur={reValidate}
                        error={validationErr.ifsc}
                        helperText={
                          validationErr.ifsc ? VALIDATION?.ifsc?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="IFSC Code"
                        variant="standard"
                        value={state.ifsc}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onKeyPress={handleIfscKeyPress}
                        text="capital"
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        required
                      />
                      <div className={css.twoFields}>
                        <Input
                          name="bankName"
                          onBlur={reValidate}
                          error={validationErr.bankName}
                          helperText={
                            validationErr.bankName
                              ? VALIDATION?.bankName?.errMsg
                              : ''
                          }
                          className={`${css.greyBorder} ${classes.root}`}
                          label="Bank Name"
                          variant="standard"
                          value={state.bankName}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          onChange={onInputChange}
                          theme="light"
                          required
                        />
                        <Input
                          name="bankBranch"
                          onBlur={reValidate}
                          error={validationErr.bankBranch}
                          helperText={
                            validationErr.bankBranch
                              ? VALIDATION?.bankBranch?.errMsg
                              : ''
                          }
                          className={`${css.greyBorder} ${classes.root}`}
                          label="Bank Branch"
                          variant="standard"
                          value={state.bankBranch}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          onChange={onInputChange}
                          theme="light"
                          required
                        />
                      </div>
                      <div
                        className={`${css.bankValidationCheck} ${css.removeSpace}`}
                      >
                        <Checkbox
                          name="validateBankAccount"
                          checked={state.validateBankAccount}
                          onChange={onInputChange}
                        />
                        <div className={css.info}>
                          <div className={css.title}>Validate Bank Account</div>
                          <div className={css.description}>
                            On checking the box, Rs. 1 will be deducted for
                            validation purpose.
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </>
              )}
            </div>
            {!vendorAvailable && (
              <>
                <div className={css.actionContainer}>
                  <Button
                    variant="outlined"
                    className={css.outlineButton}
                    onClick={() => onPagePrev()}
                    size="medium"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => onPageNextForWeb()}
                    size="medium"
                    className={css.submitButton}
                  >
                    Save and Finish
                  </Button>
                </div>
                {/* {page === 3 && ( */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        height: '3px',
                        flex: 1,
                        backgroundColor: '#8B8B8B',
                      }}
                    />
                    <div style={{ marginRight: '10px', marginLeft: '10px' }}>
                      OR
                    </div>
                    <div
                      style={{
                        height: '3px',
                        flex: 1,
                        backgroundColor: '#8B8B8B',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      backgroundColor: '#49AD99',
                      borderRadius: '18px',
                      padding: '20px',
                      marginBottom: '20px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => onPageNextForWeb(true, true)}
                  >
                    <MailOutlineIcon style={{ color: '#FFFFFF' }} />

                    <div
                      style={{
                        color: '#FFFFFF',
                        fontSize: '14px',
                        lineHeight: '18px',
                        marginLeft: '10px',
                      }}
                    >
                      Request Bank Details from {etype()}
                    </div>
                  </div>
                  <div
                    style={{
                      border: '1px solid #49AD99',
                      borderRadius: '18px',
                      padding: '20px',
                      cursor: 'pointer',
                    }}
                    onClick={() => onPageNextForWeb(true, false)}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#49AD99',
                        fontSize: '14px',
                        lineHeight: '18px',
                      }}
                    >
                      Skip for Now and Continue
                    </div>
                  </div>
                </div>
                {/* )} */}
              </>
            )}
            {!showVendorAvail && vendorAvailable && (
              <div className={css.vendorAvailable}>
                <p>
                  {vendorAvailable.vendor_name} is already a part of your list
                </p>
                <p>Would you like to record a bill?</p>
                <Button
                  onClick={() => existingVendorFlow()}
                  size="medium"
                  className={css.submitButton}
                >
                  Record Bill for {vendorAvailable.vendor_name}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AddVendorManual;
