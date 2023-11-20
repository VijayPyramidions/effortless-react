/* eslint-disable no-else-return */

import React from 'react';
import * as Mui from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import { withStyles, styled, InputAdornment } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import cameraIcon from '@assets/camera.svg';
import { pincodeKeyPress, OnlyAlphaNumeric } from '@components/utils';
import SelectBusiness from '@components/Select/SelectBusiness.jsx';
import PageTitle from '@core/DashboardView/PageTitle';
import * as css2 from '@core/DashboardView/DashboardViewContainer.scss';
// import pencil from '@assets/pencil.svg';
// import plus from '@assets/plus.svg';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import Input from '@components/Input/Input.jsx';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { DirectUpload } from '@rails/activestorage';
import * as Router from 'react-router-dom';
import AppContext from '@root/AppContext.jsx';
import CloseIcon from '@mui/icons-material/Close';
import JSBridge from '@nativeBridge/jsbridge';
import Checkbox from '@material-ui/core/Checkbox';
import * as themes from '@root/theme.scss';
import {
  validateGst,
  validatePincode,
  validateAddress,
  validateNoSymbol,
  validateRequired,
  validateIfsc,
  validateSwiftCode
} from '@services/Validation.jsx';
import CinNumberSheet from './components/CinNumber';
import * as css from './BusinessDetails.scss';
import * as mainCss from '../../../App.scss';
import CustomCheckbox from '../../../components/Checkbox/Checkbox';
import upload from '../../../assets/uploadFromPhone.svg';
import InputBusiness from '../../../components/Input/inputBusiness';

const useStyles = makeStyles(() => ({
  camBtn: {
    borderRadius: '20px !important',
    border: '1px solid #F08B32  !important',
    padding: '5px 10px',
  },
  camBtnText: {
    textTransform: 'capitalize',
    color: '#F08B32',
  },
  camBtnDesktop: {
    borderRadius: '20px !important',
    border: '1px solid #F08B32  !important',
    padding: '0.5rem 1rem',
  },
  camBtnTextDesktop: {
    textTransform: 'capitalize',
    color: '#F08B32',
  },
  headerStack: {
    justifyContent: 'space-between',
    margin: '15px',
  },
  headerStack1: {
    justifyContent: 'space-between',
    margin: '30px 15px 10px 20px',
  },

  header: {
    color: '#2E3A59 !important',
    fontSize: '13px !important',
    fontWeight: '600 !important',
    textTransform: 'capitalize',
    alignSelf: 'center',
  },
  headerIcon: {
    color: '#2E3A59 !important',
  },
  filledBtn: {
    borderRadius: '20px !important',
    backgroundColor: '#F08B32 !important',
    width: '203px !important',

    marginTop: '2rem !important',
  },
  filledBtnText: {
    textTransform: 'capitalize',
    color: 'white',
    fontSize: '14px !important',
  },

  businessTypeModuleStack: {
    alignItems: 'center',
    marginLeft: '1rem',
    paddingTop: '1rem',
  },
  divider: {
    width: '80%',
    marginLeft: '2rem !important',
    paddingTop: '1rem',
  },
  upiStack: {
    border: '1px solid #EDEDED',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  upiStackText1: {
    fontSize: '12px !important',
    fontWeight: '500 !important',
    color: '#283049 !important',
    width: '263px !important',
    marginLeft: '1rem !important',
  },
  upiStackText2: {
    fontSize: '10px !important',
    fontWeight: '300 !important',
    color: '#283049 !important',
    width: '261px !important',
    marginLeft: '1rem !important',
  },
  link: {
    color: '#2F9682 !important',
    fontSize: '11px !important',
    fontWeight: '500 !important',
    marginLeft: '1rem !important',
    textDecorationLine: 'underline',
  },
  switchStack: {
    width: '100%',
    height: '60px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    justifyContent: 'space-between',
    border: '1.5px solid #999EA5',
    alignItems: 'center',
  },
  marginDesign: {
    margin: '2rem 0.5rem',
  },
  updload: {
    width: '140px',
    height: '45px',
    backgroundColor: '#f08b32 !important',
    boxShadow: '0px 15.0367px 21.481px rgba(0, 0, 0, 0.1)',
    borderRadius: '20px !important',
  },
  uploadBtn: {
    width: '140px',
    height: '45px',
    backgroundColor: '#f08b32 !important',
    boxShadow: '0px 15.0367px 21.481px rgba(0, 0, 0, 0.1)',
    borderRadius: '20px !important',
  },
  uploadBtnText: {
    fontWeight: '500',
    fontSize: '28',
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
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
export const TextfieldStyleBusiness = (props) => {
  const { textTransformChange } = props;
  return (
    <InputBusiness
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      textTransformChange={textTransformChange || ''}
      theme="light"
      style={{
        border: '1px solid #999ea563',
        marginBottom: '15px',
      }}
    />
  );
};

// const TextfieldStyle = (props) => {
//   return (
//     <Input
//       {...props}
//       variant="standard"
//       InputLabelProps={{
//         shrink: true,
//       }}
//       fullWidth
//       theme="light"
//       className={css.textfieldMain}
//     />
//   );
// };
function BusinessDetails() {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const BusinessTypeData = [
    {
      text: 'Individual',
      value: 'Individual',
    },
    {
      text: 'Partnership',
      value: 'Partnership',
    },
    {
      text: 'LLP',
      value: 'LLP',
    },
    {
      text: 'Company',
      value: 'Company',
    },
    {
      text: 'Trust',
      value: 'Trust',
    },
    {
      text: 'Hindu Undivided Family',
      value: 'Hindu Undivided Family',
    },
    {
      text: 'Association of Persons',
      value: 'Association of Persons',
    },
    {
      text: 'Body of Individuals',
      value: 'Body of Individuals',
    },
    {
      text: 'Government Agency',
      value: 'Government Agency',
    },
    {
      text: 'Artificial Juridical Person',
      value: 'Artificial Juridical Person',
    },
    {
      text: 'Local Authority',
      value: 'Local Authority',
    },
    {
      text: 'Other',
      value: 'Other',
    },
  ];
  const {
    organization,
    user,
    enableLoading,
    openSnackBar,
    setLogo,
    registerEventListeners,
    deRegisterEventListener,
    addOrgName,
    logo,
    validateSession,
    setUserInfo,
    userPermissions,
  } = React.useContext(AppContext);
  const [validChange, setValidChange] = React.useState(false);

  const initialState = validChange
    ? {
        address1: '',
        address2: '',
        pincodeData: '',
        cityData: '',
        stateData: '',
        countryData: '',
        defaultLocations: false,
        gstn: '',
        noGst: false,
      }
    : { accountHolder: '', bank: '', accountno: '', ifsc: '',swift:"", noIfsc:false,branch: '' };

  const [data, setData] = React.useState();
  const [addressState, setAddressState] = React.useState(initialState);
  const [infoData, setInfoData] = React.useState();
  const [nameData, setNameData] = React.useState();
  const [cinNumber, setCinNumber] = React.useState({
    original: '',
    change: '',
  });
  const [imageData, setImageData] = React.useState();
  const [bankData, setBankData] = React.useState();
  const [bankEditData, setBankEditData] = React.useState();
  const [addressEditData, setAddressEditData] = React.useState();
  const [allStates, setAllStates] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [addressDrawer, setAddressDrawer] = React.useState(false);
  const [editValue, setEditValue] = React.useState(false);
  const [deleteValue, setDeleteValue] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [deleteThis, setDeleteThis] = React.useState('');

  const [businessType, setBusinessType] = React.useState();
  const [deleteOrgDialog, setDeleteOrgDialog] = React.useState(false);
  const [businessTypeChange, setBusinessTypeChange] = React.useState([]);
  const [editBusiness, setEditBusiness] = React.useState(false);
  const navigate = Router.useNavigate();

  const [userRolesSettings, setUserRolesSettings] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Settings || {})?.length > 0) {
      if (!userPermissions?.Settings['Company Details'].view_company_details) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/settings');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRolesSettings({ ...userPermissions?.Settings });
    }
  }, [userPermissions]);

  const [drawer, setDrawer] = React.useState({
    camera: false,
    businessName: false,
    businessPhNo: false,
    GSTNo: false,
    businessAddress: false,
    UPIId: false,
    bankDetails: false,
    businessType: false,
  });
  const Puller = styled(Mui.Box)(() => ({
    width: '50px',
    height: 6,
    backgroundColor: '#C4C4C4',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
  }));
  const openDrawer = (name) => {
    if (name) {
      setDrawer((d) => ({ ...d, [name]: true }));
    }
  };
  const closeDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };
  const handleSwiftKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const onPinCodeChange = (e) => {
    enableLoading(true);
    RestApi(`pincode_lookups?pincode=${e}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setAddressState((s) => ({
            ...s,
            cityData: res?.city,
            countryData: res?.country,
            stateData: res?.state,
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

  const VALIDATION = validChange
    ? {
        address1: {
          errMsg: 'Enter valid Business Address',
          test: validateAddress,
        },
        cityData: {
          errMsg: 'Enter valid City',
          test: validateNoSymbol,
        },
        pincodeData: {
          errMsg: 'Enter valid Pincode',
          test: validatePincode,
        },
        stateData: {
          errMsg: 'Enter valid State',
          test: validateRequired,
        },
        countryData: {
          errMsg: 'Enter valid Country',
          test: validateRequired,
        },
        gstn: {
          errMsg: 'Please provide valid GST',
          test: validateGst,
        },
      }
    : {
        accountno: {
          errMsg: 'Enter valid Bank Account No',
          test: validateRequired,
        },
        accountHolder: {
          errMsg: 'Enter valid Account Holder Name',
          test: validateRequired,
        },
        ifsc: {
          errMsg: 'Enter valid IFSC',
          test: validateIfsc,
        },
        swift: {
          errMsg: 'Enter valid Swift code',
          test: validateSwiftCode,
        },
        bank: {
          errMsg: 'Enter valid Bank Name',
          test: validateRequired,
        },
        branch: {
          errMsg: 'Enter valid Bank Branch',
          test: validateRequired,
        },
      };

  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const validateAllFields = (stateParam) => {
    const stateData = stateParam || addressState;
    if (!addressState?.noGst) {
      if(addressState?.noIfsc){
        return Object.keys(VALIDATION).reduce((a, v) => {
          const paramValue = a;
          paramValue[v] = v!== 'ifsc' && !VALIDATION?.[v]?.test(stateData[v]);
          return paramValue;
        }, {});
      } else {
        return Object.keys(VALIDATION).reduce((a, v) => {
          const paramValue = a;
          paramValue[v] = v!== 'swift' && !VALIDATION?.[v]?.test(stateData[v]);
          return paramValue;
        }, {});
      }
      
    }
    return Object.keys(VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = v !== 'gstn' && !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };
  const Valid = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      // return;
    }
    setValidationErr((s) => ({ ...s, ...v }));
    return valid;
  };
  const reValidate = (name, values) => {
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(values),
    }));
  };
  React.useEffect(() => {
    if (addressState?.address1?.length > 0) {
      reValidate('address1', addressState?.address1);
    }
  }, [addressState?.address1]);
  React.useEffect(() => {
    if (addressState?.pincodeData?.length > 0) {
      reValidate('pincodeData', addressState?.pincodeData);
    }
  }, [addressState?.pincodeData]);
  React.useEffect(() => {
    if (addressState?.cityData?.length > 0) {
      reValidate('cityData', addressState?.cityData);
    }
  }, [addressState?.cityData]);
  React.useEffect(() => {
    if (addressState?.countryData?.length > 0) {
      reValidate('countryData', addressState?.countryData);
    }
  }, [addressState?.countryData]);
  React.useEffect(() => {
    if (addressState?.stateData?.length > 0) {
      reValidate('stateData', addressState?.stateData);
    }
  }, [addressState?.stateData]);
  const OnGstinChange = (gstVal) => {
    enableLoading(true);
    RestApi('gstins', {
      method: METHOD.POST,
      payload: {
        gstin: gstVal.toUpperCase(),
        organization_id: organization.orgId,
        gstin_type: 'Customer',
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          setAddressState((s) => ({
            ...s,
            address1: res?.address_line1?.substring(0, 45),
            address2: res?.address_line2?.substring(0, 45),
            pincodeData: res?.pincode,
            cityData: res?.city,
            countryData: res?.country,
            stateData: res?.state,
          }));
        }
      })
      .catch(() => {
        openSnackBar({
          message: `GSTIN error`,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };
  React.useEffect(() => {
    if (addressState?.branch?.length > 0) {
      reValidate('branch', addressState?.branch);
    }
  }, [addressState?.branch]);
  React.useEffect(() => {
    if (addressState?.bank?.length > 0) {
      reValidate('bank', addressState?.bank);
    }
  }, [addressState?.bank]);
  const onIFSCCodeChange = (e) => {
    enableLoading(true);
    RestApi(`ifsc?ifsc=${e}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);

        if (res && !res.error) {
          setAddressState((s) => ({
            ...s,
            bank: res?.BANK,
            branch: res?.BRANCH,
          }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const handleAccountPress = (e) =>
    ['e', 'E', '-', '+', '.'].includes(e.key) && e.preventDefault();
  const onInputChange = (e) => {
    const name = e?.target?.name;
    const values =
      e?.target?.name === 'noGst' || e?.target?.name === 'noIfsc'? e?.target?.checked : e?.target?.value;
    reValidate(name, values);
    if (name === 'noGst' && values) {
      setValidationErr((s) => ({ ...s, gstn: false }));
    }

    if (name === 'noIfsc' && values) {
      setValidationErr((s) => ({ ...s, swift: false }));
    } else if (name === 'noGst' && !values) {
      setValidationErr((s) => ({ ...s, ifsc: false }));
    }

    if (name === 'pincodeData' && values.length === 6) {
      onPinCodeChange(e.target.value);
    }

    if (name === 'gstn' && values.length === 15) {
      OnGstinChange(e.target.value);
    }
    if (name === 'ifsc' && values.length === 11) {
      onIFSCCodeChange(e.target.value);
    }

    setAddressState((s) => ({ ...s, [name]: values }));
  };

  const drawerState = (item) => {
    switch (item) {
      case 'Business Name':
        return 'businessName';
      case 'Business CIN Number 11':
        return 'businessPhNo';
      case 'GST Number':
        return 'GSTNo';
      case 'Business Address':
        return 'businessAddress';
      case 'UPI ID':
        return 'UPIId';
      case 'Bank Details':
        return 'bankDetails';
      case 'Business Type':
        return 'businessType';
      case 'Select Business Type':
        return 'businessType';
      default:
        return ' ';
    }
  };
  // const DetailsCard = ({ name, children, icon, alt }) => {
  //   return (
  //     <div
  //       className={
  //         device === 'desktop'
  //           ? css.detailsCardContainerDesktop
  //           : css.detailsCardContainer
  //       }
  //       onClick={() => {
  //         openDrawer(drawerState(name));
  //       }}
  //     >
  //       <div className={css.headerWrapper}>
  //         <div className={css.label}>{name}</div>
  //         <div
  //           className={
  //             name === 'Bank Details' ? css.imageWrapperip : css.imageWrapperi
  //           }
  //           onClick={() => {
  //             openDrawer(drawerState(name));
  //           }}
  //         >
  //           {icon && (
  //             <img
  //               className={css.image}
  //               src={icon}
  //               alt={alt}
  //               style={{ cursor: 'pointer' }}
  //             />
  //           )}
  //         </div>
  //       </div>
  //       {children && children}
  //     </div>
  //   );
  // };

  const DetailsCardSelect = ({ name, children, icon, sx }) => {
    return (
      <div
        className={
          device === 'desktop'
            ? css.detailsCardContainerDesktop
            : css.detailsCardContainer
        }
        style={sx}
      >
        <div className={css.headerWrapper}>
          <div className={css.label}>{name}</div>
          <div
            className={
              name === 'Bank Details' ? css.imageWrapperip : css.imageWrapperi
            }
            onClick={() => {
              if (name !== 'Business Type') openDrawer(drawerState(name));
            }}
          >
            {name !== 'Business Type' && name !== 'Business PAN Number' && (
              <Mui.IconButton className={css.iconDesign}>{icon}</Mui.IconButton>
            )}
          </div>
        </div>
        {children && children}
      </div>
    );
  };
  const Dialog = withStyles({
    root: {
      '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
        borderRadius: '16px',
      },
    },
  })(Mui.Dialog);

  const DeactivateOrganization = () => {
    RestApi(`organizations/${organization.orgId}`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then(async (res) => {
        if (res && !res.error) {
          await validateSession(user.activeToken);
          await localStorage.removeItem('selected_organization');
          await localStorage.removeItem('PageWithParams');

          // navigate('/dashboard');
          setTimeout(() => {
            openSnackBar({
              message: res.message || 'Organization deleted successfully.',
              type: MESSAGE_TYPE.INFO,
            });
            navigate('/dashboard');
          }, 500);
          setTimeout(() => {
            const organizationId = JSON.parse(
              localStorage.getItem('selected_organization')
            ).orgId;
            RestApi(`organizations/${organizationId}/logos`, {
              method: METHOD.GET,
              headers: {
                Authorization: `Bearer ${user.activeToken}`,
              },
            })
              .then((resp) => {
                setLogo(resp?.data[0]?.image_url);
              })
              .catch(() => {
                console.log('Logo Error');
              });
          }, 2000);
        } else if (res.error) {
          openSnackBar({
            message:
              res.message || 'Something went wrong. We will look into it',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message || 'Something went wrong. We will look into it',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const FetchLocations = () => {
    RestApi(`organizations/${organization.orgId}/locations`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      setData(res.data);
    });
  };

  const FetchData = () => {
    RestApi(`states`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      setAllStates(
        res.data.map((l) => ({
          payload: l.state_name,
          text: l.state_name,
        }))
      );
    });
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
    RestApi(`organizations/${organization.orgId}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      setInfoData(res);
      setNameData(res?.name);
      setBusinessType(res?.business_type);
      setBusinessTypeChange(
        BusinessTypeData?.filter((e) => e.value === res.business_type)[0]?.text
      );
    });
    FetchLocations();
    RestApi(`organizations/${organization.orgId}/bank_accounts`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      setBankData(res?.data);
    });
    RestApi(`organizations/${organization.orgId}/settings`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error)
        setCinNumber({ original: res.cin_number, change: res.cin_number });
    });
  };
  const onFileUpload = (e, directFile) => {
    enableLoading(true);
    const file = directFile ? e : e?.target?.files?.[0];
    const url = `${BASE_URL}/direct_uploads`;
    const uploadHere = new DirectUpload(file, url);
    uploadHere
      .create((error, blob) => {
        if (error) {
          console.log('DirectUpload error business details', error);
        } else {
          console.log('DirectUpload blob business details', blob);
          const id = blob?.signed_id;
          setImageData(id);
        }
        enableLoading(false);
      })
      .catch((res) => {
        console.log(res);
        enableLoading(false);
      });
  };

  const fetchLogoData = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/logos?show=all  `, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setLogo(res?.data[0]?.image_url);
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const UploadLogo = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/logos`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        image: imageData,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          closeDrawer('camera');
          FetchData();
          fetchLogoData();
          openSnackBar({
            message: `Updated Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        console.log('upload error', e);
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (device === 'desktop' && imageData) {
      UploadLogo();
    }
  }, [imageData]);
  const UpdateOrganisationName = () => {
    RestApi(`organizations/${infoData.id}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        name: nameData,
      },
    }).then((res) => {
      if (res && !res.error) {
        if (device === 'mobile') {
          addOrgName({ orgName: res?.name, shortName: res?.short_name });
          const tempList = user?.userInfo?.data?.filter(
            (val) => val?.id !== res?.id
          );
          setUserInfo({ userInfo: { data: [...tempList, { ...res }] } });
          localStorage.setItem(
            'selected_organization',
            JSON.stringify({
              orgId: res?.id,
              orgName: res?.name,
              shortName: res?.short_name,
            })
          );
          closeDrawer('businessName');
          FetchData();
          setEditBusiness(false);
        } else {
          addOrgName({ orgName: res?.name, shortName: res?.short_name });
          const tempList = user?.userInfo?.data?.filter(
            (val) => val?.id !== res?.id
          );
          setUserInfo({ userInfo: { data: [...tempList, { ...res }] } });
          localStorage.setItem(
            'selected_organization',
            JSON.stringify({
              orgId: res?.id,
              orgName: res?.name,
              shortName: res?.short_name,
            })
          );
          navigate('/settings');
        }
      } else {
        openSnackBar({
          message: Object.values(res?.errors).join() || 'Unknown error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
  };

  const UpdateCINNumber = () => {
    if (cinNumber?.change?.length === 21) {
      RestApi(`organizations/${organization.orgId}/settings`, {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          cin_number: cinNumber?.change,
        },
      })
        .then((res) => {
          if (res && !res.error) {
            setCinNumber({ original: res.cin_number, change: res.cin_number });
            closeDrawer('businessPhNo');
          } else {
            openSnackBar({
              message:
                Object.values(res?.errors).join() || 'Unknown error occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch(() => {
          closeDrawer('businessPhNo');
          openSnackBar({
            message: 'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        });
    }
  };

  const BusinessTypeApi = () => {
    RestApi(`organizations/${organization.orgId}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        business_type: businessType,
      },
    }).then((res) => {
      if (res && !res.error) {
        closeDrawer('businessType');
        FetchData();
        openSnackBar({
          message: `Updated Successfully`,
          type: MESSAGE_TYPE.INFO,
        });
      } else {
        openSnackBar({
          message: res?.errors?.business_type,
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
  };
  const CreateBank = () => {
    if (Valid()) {
      RestApi(`organizations/${organization.orgId}/bank_accounts`, {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          account_holder_name: addressState?.accountHolder,
          bank_account_name: addressState?.bank,
          bank_branch: addressState?.branch,
          bank_account_number: addressState?.accountno,
          bank_ifsc_code: addressState?.noIfsc ? null : addressState?.ifsc?.toUpperCase(),
          bank_swift_code: addressState?.noIfsc ? addressState?.swift?.toUpperCase() : null,
          default: addressState?.defaultLocations,
        },
      })
        .then((res) => {
          if (res && !res.error) {
            openSnackBar({
              message: `Bank Account added successfully`,
              type: MESSAGE_TYPE.INFO,
            });
            FetchData();
            setAddressDrawer(false);
            setDrawerOpen(false);
            setAddressState(() => ({
              accountHolder: '',
              bank: '',
              accountno: '',
              ifsc: '',
              swift: '',
              branch: '',
              defaultLocations: false,
            }));
          } else {
            openSnackBar({
              message:
                Object.values(res?.errors || {})?.join() ||
                res.message ||
                'Unknown error occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch((res) => {
          openSnackBar({
            message:
              Object.values(res?.errors || {})?.join() ||
              res.message ||
              'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        });
    }
  };
  const CreateLocations = () => {
    const payloadParams = addressState?.gstn
      ? {
          address_line1: addressState.address1,
          address_line2: addressState.address2,
          city: addressState.cityData,
          pincode: addressState.pincodeData,
          state: addressState.stateData,
          country: addressState.countryData,
          gstin: addressState.gstn,
          default: addressState.defaultLocations,
        }
      : {
          address_line1: addressState.address1,
          address_line2: addressState.address2,
          city: addressState.cityData,
          pincode: addressState.pincodeData,
          state: addressState.stateData,
          country: addressState.countryData,
          default: addressState.defaultLocations,
        };
    if (Valid()) {
      RestApi(`organizations/${organization.orgId}/locations`, {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: payloadParams,
      }).then((res) => {
        if (res && !res.error) {
          openSnackBar({
            message: `Business Address added successfully`,
            type: MESSAGE_TYPE.INFO,
          });
          FetchData();
          setAddressDrawer(false);
          setDrawerOpen(false);
          setAddressState(() => ({
            address1: '',
            address2: '',
            pincodeData: '',
            cityData: '',
            stateData: '',
            countryData: '',
            gstn: '',
          }));
        }
      });
    }
  };
  React.useEffect(() => {
    FetchData();
  }, []);
  const onCloseAddress = () => {
    setValidationErr((s) => ({
      ...s,
      address1: false,
      address2: false,
      pincodeData: false,
      cityData: false,
      stateData: false,
      countryData: false,
      gstn: false,
    }));
    setAddressDrawer(false);
    setEditValue(false);
    setDeleteValue(false);
    setAddressState(() => ({
      address1: '',
      address2: '',
      pincodeData: '',
      cityData: '',
      stateData: '',
      countryData: '',
      gstn: '',
    }));
  };

  const onCloseBank = () => {
    setValidationErr((s) => ({
      ...s,
      ifsc: false,
      swift: false,
      accountno: false,
      accountHolder: false,
      bank: false,
      branch: false,
    }));
    setDrawerOpen(false);
    setEditValue(false);
    setDeleteValue(false);
    setAddressState(() => ({
      accountHolder: '',
      bank: '',
      accountno: '',
      ifsc: '',
      swift:'',
      branch: '',
    }));
  };
  const DeleteOncloseDialog = () => {
    setDeleteDialog(false);
  };

  const DeleteOncloseOrgDialog = () => {
    setDeleteOrgDialog(false);
  };

  const DeleteAddressDialog = () => {
    setDeleteThis('address');
    setDeleteDialog(true);
  };
  const DeleteBankDialog = () => {
    setDeleteThis('bank');
    setDeleteDialog(true);
  };

  const BankDeleteDrawer = (c) => {
    setValidChange(false);
    setEditValue(false);
    setDeleteValue(true);
    setDrawerOpen(true);
    setBankEditData(c);
    setAddressState((s) => ({
      ...s,
      accountno: c?.bank_account_number,
      bank: c?.bank_account_name,
      branch: c?.bank_branch,
      ifsc: c?.bank_ifsc_code,
      swift:c?.bank_swift_code,
      accountHolder: c?.name,
    }));
  };

  const DeleteBank = () => {
    RestApi(
      `organizations/${organization.orgId}/bank_accounts/${bankEditData?.id}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    ).then((res) => {
      if (res?.deactivate) {
        setDeleteDialog(false);
        setDrawerOpen(false);
        openSnackBar({
          message: `Business Bank Details deleted successfully`,
          type: MESSAGE_TYPE.INFO,
        });
        FetchData();
      } else {
        setDeleteDialog(false);
        openSnackBar({
          message: res?.message,
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
  };
  const DeleteAddressDrawer = (c) => {
    setValidChange(true);
    setEditValue(false);
    setDeleteValue(true);
    setAddressDrawer(true);
    setAddressEditData(c);
    setAddressState((s) => ({
      ...s,
      address1: c?.address_line1,
      address2: c?.address_line2,
      cityData: c?.city,
      pincodeData: c?.pincode,
      stateData: c?.state,
      countryData: c?.country,
      gstn: c?.gstin?.gstin,
    }));

    if (!c.gstin) setAddressState((s) => ({ ...s, noGst: true }));
    if (!c.ifsc) setAddressState((s) => ({ ...s, noIfsc: true }));
    if (!c.swift) setAddressState((s) => ({ ...s, noIfsc: false }));
  };
  const DeleteAddress = () => {
    RestApi(
      `organizations/${organization.orgId}/locations/${addressEditData?.id}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    ).then((res) => {
      if (res && !res.error) {
        setDeleteDialog(false);
        setAddressDrawer(false);
        openSnackBar({
          message: `Business Address deleted successfully`,
          type: MESSAGE_TYPE.INFO,
        });
        FetchData();
      } else if (res?.error) {
        openSnackBar({
          message: res?.message,
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
  };

  const EditLocations = () => {
    setValidChange(true);
    const payloadParams = addressState?.gstn
      ? {
          address_line1: addressState.address1,
          address_line2: addressState.address2,
          city: addressState.cityData,
          pincode: addressState.pincodeData,
          state: addressState.stateData,
          country: addressState.countryData,
          gstin: addressState.gstn,
          default: addressState.defaultLocations,
        }
      : {
          address_line1: addressState.address1,
          address_line2: addressState.address2,
          city: addressState.cityData,
          pincode: addressState.pincodeData,
          state: addressState.stateData,
          country: addressState.countryData,
          default: addressState.defaultLocations,
        };

    if (Valid()) {
      RestApi(
        `organizations/${organization.orgId}/locations/${addressEditData?.id}`,
        {
          method: METHOD.PATCH,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
          payload: payloadParams,
        }
      )
        .then((res) => {
          if (res && !res.error) {
            openSnackBar({
              message: `Updated Successfully`,
              type: MESSAGE_TYPE.INFO,
            });
            setAddressState(initialState);
            FetchData();
            setAddressDrawer(false);
          } else {
            openSnackBar({
              message: res?.message || `Unknown Error Occured`,
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const EditBank = () => {
    if(Valid()){
    RestApi(
      `organizations/${organization.orgId}/bank_accounts/${bankEditData?.id}`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          bank_account_name: addressState?.bank,
          bank_branch: addressState?.branch,
          bank_account_number: addressState?.accountno,
          bank_ifsc_code: addressState?.noIfsc ? null : addressState?.ifsc?.toUpperCase(),
          bank_swift_code: addressState?.noIfsc ? addressState?.swift?.toUpperCase() : null,
          account_holder_name: addressState?.accountHolder,
          default: addressState?.defaultLocations,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          openSnackBar({
            message: `Updated Successfully`,
            type: MESSAGE_TYPE.INFO,
          });
          FetchData();
          setDrawerOpen(false);
          setAddressState(() => ({
            accountHolder: '',
            bank: '',
            accountno: '',
            ifsc: '',
            swift:'',
            branch: '',
          }));
        } else {
          openSnackBar({
            message:
              Object.values(res?.errors || {})?.join() ||
              res.message ||
              'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        openSnackBar({
          message:
            Object.values(res?.errors || {})?.join() ||
            res.message ||
            'Unknown error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
    }
  };
  const AddressDrawerOpen = (c) => {
    setValidChange(true);
    setEditValue(true);
    setDeleteValue(false);
    setAddressDrawer(true);
    setAddressEditData(c);
    setAddressState((s) => ({
      ...s,
      address1: c?.address_line1,
      address2: c?.address_line2,
      pincodeData: c?.pincode,
      cityData: c?.city,
      stateData: c?.state,
      countryData: c?.country,
      gstn: c?.gstin?.gstin,
      defaultLocations: c?.default,
      noGst: () => {
        if (c?.gstin?.gstin === undefined) {
          return true;
        } else if (c?.gstin?.gstin === null) {
          return true;
        } else if (c?.gstin?.gstin === '') {
          return true;
        } else {
          return false;
        }
      },
    }));
  };
  const BankDrawerOpen = (c) => {
    setValidChange(false);
    setEditValue(true);
    setDeleteValue(false);
    setDrawerOpen(true);
    setBankEditData(c);
    setAddressState((s) => ({
      ...s,
      accountno: c?.bank_account_number,
      bank: c?.bank_account_name,
      branch: c?.bank_branch,
      ifsc: c?.bank_ifsc_code,
      swift: c?.bank_swift_code,
      accountHolder: c?.name,
      defaultLocations: c?.default,
      noIfsc: () => {
        if (c?.bank_ifsc_code === undefined) {
          return true;
        } else if (c?.bank_ifsc_code === null) {
          return true;
        } else if (c?.bank_ifsc_code === '') {
          return true;
        } else {
          return false;
        }
      },
    }));
  };
  const Delete = () => {
    if (deleteThis === 'address') {
      DeleteAddress();
    }
    if (deleteThis === 'bank') {
      DeleteBank();
    }
  };
  const AddaddressNew = () => {
    setValidChange(true);
    setAddressDrawer(true);
    setEditValue(false);
    setDeleteValue(false);
    setAddressState((s) => ({
      ...s,
      address1: '',
      address2: '',
      pincodeData: '',
      cityData: '',
      stateData: '',
      countryData: '',
      gstn: '',
      noGst: false,
    }));
  };
  const BankNew = () => {
    setValidChange(false);
    setDrawerOpen(true);
    setEditValue(false);
    setDeleteValue(false);
    setAddressState(() => ({
      accountHolder: '',
      bank: '',
      accountno: '',
      ifsc: '',
      swift:'',
      branch: '',
      noIfsc:false,
    }));
  };
  const fillOcrByFirebaseML = async (res) => {
    const resp = JSON.parse(res.detail.value);
    const { base64, filename } = resp;
    let blobValue;

    if (base64) {
      const base64Str = `data:image/jpeg;base64,${base64}`;
      await fetch(base64Str)
        .then(async (fetchRes) => {
          await fetchRes
            .blob()
            .then((blobData) => {
              // const file = new File([blobData], filename, { type: 'image/*' });
              // onFileUpload(file, true);
              blobValue = blobData;
            })
            .catch((e) => console.log('base64 blob err', e));
        })
        .catch((e) => console.log('base64 err', e));

      // const fetchRes = await fetch(base64Str);
      // const blob = await fetchRes.blob();
      // eslint-disable-next-line no-undef
      const file = new File([blobValue], filename, { type: 'image/png' });
      onFileUpload(file, true);
    }
  };

  React.useEffect(() => {
    registerEventListeners({
      name: 'logoDetails',
      method: fillOcrByFirebaseML,
    });
    return () =>
      deRegisterEventListener({
        name: 'logoDetails',
        method: fillOcrByFirebaseML,
      });
  }, []);

  React.useEffect(()=>{
    if(!addressState?.ifsc ||addressState?.swift) setAddressState((s) => ({...s,noIfsc: true}));
    else if(addressState?.ifsc ||!addressState?.swift) setAddressState((s) => ({...s,noIfsc: false}));
  },[addressState?.ifsc,addressState?.swift]);

  return (
    <>
      <PageTitle
        title="Business Details"
        onClick={() => {
          if (editBusiness && device === 'mobile') {
            setEditBusiness(false);
          } else {
            navigate(-1);
          }
        }}
      />
      <div
        className={
          device === 'mobile'
            ? // ? css.dashboardBodyContainer
              css2.dashboardBodyContainerhideNavBar
            : css2.dashboardBodyContainerDesktop
        }
      >
        <div
          className={
            device === 'desktop'
              ? css.businessDetailsContainerDesktop
              : css.businessDetailsContainer
          }
        >
          {device === 'desktop' ? (
            <Mui.Stack>
              <Mui.Stack
                direction="row"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span className={css.contactIcon}>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/png, image/jpeg"
                    hidden
                    onChange={(e) => onFileUpload(e)}
                  />
                  <label htmlFor="avatar">
                    <div className={css.imageWrapper}>
                      <img src={cameraIcon} alt="logo" />
                    </div>
                  </label>
                </span>
                {infoData && (
                  <div style={{ width: '90%' }}>
                    <TextfieldStyleBusiness
                      label="Business Name"
                      defaultValue={infoData?.name}
                      onChange={(e) => setNameData(e.target.value)}
                      textTransform
                    />
                  </div>
                )}
              </Mui.Stack>
              {/* {infoData && (
            <TextfieldStyleBusiness
              label="Business CIN Number desk"
              value={cinNumber?.change}
              onChange={(e) => setCinNumber((prev) => ({...prev, change: e.target.value}))}
            />
          )} */}
              {cinNumber.change ? (
                <CinNumberSheet
                  infoData={infoData}
                  cinNumber={cinNumber}
                  setCinNumber={setCinNumber}
                />
              ) : (
                <>
                  <DetailsCardSelect
                    name="Business Pan Number"
                    sx={{ marginBottom: '16px' }}
                    // icon={
                    //   <MuiIcons.KeyboardArrowDown className={css.iconStyle} />
                    // }
                    // alt="editImage"
                  >
                    <Mui.Typography className={css.typeFont}>
                      {infoData?.pan_number?.toUpperCase()}
                    </Mui.Typography>
                  </DetailsCardSelect>
                </>
              )}
              {infoData && (
                <>
                  <DetailsCardSelect
                    name="Business Type"
                    icon={
                      <MuiIcons.KeyboardArrowDown className={css.iconStyle} />
                    }
                    alt="editImage"
                  >
                    <Mui.Typography className={css.typeFont}>
                      {businessTypeChange}
                    </Mui.Typography>
                  </DetailsCardSelect>
                </>
              )}

              <Mui.Typography
                style={{
                  marginBottom: '1rem',
                  marginTop: '1rem',
                  fontWeight: '500',
                  fontSize: '22px',
                }}
              >
                Business Address
              </Mui.Typography>
              <Mui.Grid container>
                <Mui.Grid item lg={12} md={12}>
                  <Mui.Grid container spacing={3}>
                    {data
                      ?.filter((val) => val?.active)
                      ?.map((c, i) => {
                        return (
                          <Mui.Grid item lg={4} md={6} pt={2} pb={2}>
                            <Mui.Paper className={css.addressPaper}>
                              <Mui.CardContent className={css.addressCard}>
                                <Mui.Stack
                                  direction="row"
                                  className={css.locationStack}
                                >
                                  <Mui.Typography className={css.heading}>
                                    Business Location {i + 1}
                                  </Mui.Typography>
                                  {!c?.default && (
                                    <DeleteOutlineOutlinedIcon
                                      className={css.icon}
                                      onClick={() => {
                                        if (
                                          !userRolesSettings['Company Details']
                                            .delete_company_details
                                        ) {
                                          setHavePermission({
                                            open: true,
                                            back: () => {
                                              setHavePermission({
                                                open: false,
                                              });
                                            },
                                          });
                                          return;
                                        }
                                        DeleteAddressDrawer(c);
                                      }}
                                    />
                                  )}
                                  <ModeEditOutlineOutlinedIcon
                                    className={css.icon}
                                    onClick={() => {
                                      if (
                                        !userRolesSettings['Company Details']
                                          .edit_company_details
                                      ) {
                                        setHavePermission({
                                          open: true,
                                          back: () => {
                                            setHavePermission({ open: false });
                                          },
                                        });
                                        return;
                                      }
                                      AddressDrawerOpen(c);
                                    }}
                                  />
                                </Mui.Stack>
                                <Mui.Stack className={css.textStack}>
                                  <Mui.Typography className={css.textDetails}>
                                    {c?.address_line1}
                                  </Mui.Typography>
                                  <Mui.Typography className={css.textDetails}>
                                    {c?.address_line2},{c?.city},
                                  </Mui.Typography>
                                  <Mui.Typography className={css.textDetails}>
                                    {c?.state}-{c?.pincode}
                                  </Mui.Typography>
                                  <Mui.Typography className={css.textDetails}>
                                    {c?.country}
                                  </Mui.Typography>
                                </Mui.Stack>
                              </Mui.CardContent>

                              <Mui.Divider
                                style={{ color: '#6e6e6e', height: '0px' }}
                              />
                              <Mui.Stack
                                direction="row"
                                className={css.GSTNStack}
                              >
                                <Mui.Typography className={css.GSTNtext}>
                                  GSTIN:
                                </Mui.Typography>
                                <Mui.Typography className={css.GSTNNo}>
                                  {c?.gstin?.gstin || '-'}
                                </Mui.Typography>
                              </Mui.Stack>
                            </Mui.Paper>
                          </Mui.Grid>
                        );
                      })}
                  </Mui.Grid>
                </Mui.Grid>
              </Mui.Grid>

              <Mui.Stack style={{ alignItems: 'flex-end' }}>
                <Mui.Stack
                  className={css.newaddBtn}
                  onClick={() => {
                    if (
                      !userRolesSettings['Company Details']
                        .create_company_details
                    ) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    AddaddressNew();
                  }}
                >
                  add another address
                </Mui.Stack>
              </Mui.Stack>
              <Mui.Typography
                style={{
                  marginBottom: '1rem',
                  fontWeight: '500',
                  fontSize: '22px',
                }}
              >
                Bank Details
              </Mui.Typography>

              <Mui.Grid container>
                <Mui.Grid item lg={12} md={12}>
                  <Mui.Grid container spacing={3}>
                    {bankData
                      ?.filter((c) => c?.active)
                      .map((c, i) => {
                        return (
                          <Mui.Grid item lg={4} md={6} pt={2} pb={2}>
                            <Mui.Paper className={css.addressPaper}>
                              <Mui.CardContent className={css.addressCard}>
                                <Mui.Stack
                                  direction="row"
                                  className={css.locationStack}
                                >
                                  <Mui.Typography className={css.heading}>
                                    Account Number {i + 1}
                                  </Mui.Typography>
                                  {!c.default && (
                                    <DeleteOutlineOutlinedIcon
                                      className={css.icon}
                                      onClick={() => {
                                        if (
                                          !userRolesSettings['Company Details']
                                            .delete_company_details
                                        ) {
                                          setHavePermission({
                                            open: true,
                                            back: () => {
                                              setHavePermission({
                                                open: false,
                                              });
                                            },
                                          });
                                          return;
                                        }
                                        BankDeleteDrawer(c);
                                      }}
                                    />
                                  )}
                                  <ModeEditOutlineOutlinedIcon
                                    className={css.icon}
                                    onClick={() => {
                                      if (
                                        !userRolesSettings['Company Details']
                                          .edit_company_details
                                      ) {
                                        setHavePermission({
                                          open: true,
                                          back: () => {
                                            setHavePermission({ open: false });
                                          },
                                        });
                                        return;
                                      }
                                      BankDrawerOpen(c);
                                    }}
                                  />
                                </Mui.Stack>
                                <Mui.Stack className={css.textStackBank}>
                                  <Mui.Typography className={css.textBank}>
                                    Bank:
                                    <span className={css.subtext}>
                                      {c?.bank_account_name}
                                    </span>
                                  </Mui.Typography>
                                  <Mui.Typography className={css.textBank}>
                                    Account No:
                                    <span className={css.subtext}>
                                      {c?.bank_account_number}
                                    </span>
                                  </Mui.Typography>
                                  {c?.bank_ifsc_code &&
                                  <Mui.Typography className={css.textBank}>
                                    IFSC Code:
                                    <span className={css.subtext}>
                                      {c?.bank_ifsc_code}
                                    </span>
                                  </Mui.Typography>
                      }
                                  {c?.bank_swift_code && <Mui.Typography className={css.textBank}>
                                    Swift Code:
                                    <span className={css.subtext}>
                                      {c?.bank_swift_code}
                                    </span>
                                  </Mui.Typography>
                      }
                                  <Mui.Typography className={css.textBank}>
                                    Branch:
                                    <span className={css.subtext}>
                                      {c?.bank_branch}
                                    </span>
                                  </Mui.Typography>
                                  <Mui.Typography className={css.textBank}>
                                    Beneficiary Name:
                                    <span className={css.subtext}>
                                      {c?.name}
                                    </span>
                                  </Mui.Typography>
                                </Mui.Stack>
                              </Mui.CardContent>
                            </Mui.Paper>
                          </Mui.Grid>
                        );
                      })}
                  </Mui.Grid>
                </Mui.Grid>
              </Mui.Grid>

              <Mui.Stack style={{ alignItems: 'flex-end' }}>
                <Mui.Stack
                  className={css.newaddBtn}
                  onClick={() => {
                    if (
                      !userRolesSettings['Company Details']
                        .create_company_details
                    ) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    BankNew();
                  }}
                >
                  add another account
                </Mui.Stack>
              </Mui.Stack>
              <Mui.Stack
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '4rem',
                }}
              >
                <Mui.Button
                  className={css.updateBtn}
                  disableTouchRipple
                  disableElevation
                  onClick={() => {
                    if (
                      !userRolesSettings['Company Details'].edit_company_details
                    ) {
                      setHavePermission({
                        open: true,
                        back: () => {
                          setHavePermission({ open: false });
                        },
                      });
                      return;
                    }
                    if (nameData?.length > 0) {
                      UpdateOrganisationName();
                    }
                    UpdateCINNumber();
                  }}
                >
                  <Mui.Typography className={css.updateBtnText}>
                    Update
                  </Mui.Typography>
                </Mui.Button>
              </Mui.Stack>
            </Mui.Stack>
          ) : (
            <>
              {!editBusiness && (
                <div className={css.newBusiness}>
                  <div className={css.firstCont}>
                    {/* <div className={css.logoDiv}> */}
                    <Mui.Avatar
                      sx={{
                        borderRadius: logo ? 0 : '50%',
                        width: logo ? 'auto' : '60px',
                        height: 'auto',
                        '& .MuiAvatar-img': {
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        },
                      }}
                      className={css.logoDiv}
                      src={
                        logo ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${organization?.name}&chars=2`
                      }
                    />
                    {/* <img src={logo} className={css.logo} alt="logo" /> */}
                    {/* </div> */}
                    <div
                      onClick={() => {
                        if (
                          !userRolesSettings['Company Details']
                            .edit_company_details
                        ) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        setEditBusiness(true);
                      }}
                    >
                      <p className={css.editTxt}>Edit Business Details</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p className={css.titleTxt}>Business Name</p>
                      <div className={css.bottomP}>
                        <p className={css.bottomTxt}>{infoData?.name || '-'}</p>
                      </div>
                    </div>

                    <hr />

                    {cinNumber.change ? (
                      <div>
                        <p className={css.titleTxt}>Business CIN Number</p>
                        <div className={css.bottomP}>
                          <p className={css.bottomTxt}>
                            {cinNumber?.change?.toLocaleUpperCase() || '-'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className={css.titleTxt}>Business PAN Number</p>
                        <div className={css.bottomP}>
                          <p className={css.bottomTxt}>
                            {infoData?.pan_number?.toLocaleUpperCase() || '-'}
                          </p>
                        </div>
                      </div>
                    )}

                    <hr />

                    <div>
                      <p className={css.titleTxt}>Addresses</p>
                      <div className={css.bottomP}>
                        {data
                          ?.filter((c) => c?.active)
                          ?.map((val) => (
                            <p className={css.bottomTxt}>
                              {val?.address_line1} - {val?.city} -{' '}
                              {val?.pincode}
                            </p>
                          ))}
                        {data?.filter((c) => c?.active)?.length === 0 && (
                          <p className={css.bottomTxt}>-</p>
                        )}
                      </div>
                    </div>

                    <hr />

                    <div>
                      <p className={css.titleTxt}>Bank Details</p>
                      <div className={css.bottomP}>
                        {bankData?.filter((c) => c?.active)?.length > 0 &&
                          bankData
                            ?.filter((c) => c?.active)
                            .map((val) => (
                              <p className={css.bottomTxt}>
                                {val?.name || '-'}
                              </p>
                            ))}
                        {bankData?.filter((c) => c?.active)?.length === 0 && (
                          <p className={css.bottomTxt}>-</p>
                        )}
                      </div>
                    </div>

                    <hr />

                    <div>
                      <p className={css.titleTxt}>Business Type</p>
                      <div className={css.bottomP}>
                        <p className={css.bottomTxt}>
                          {infoData?.business_type || '-'}
                        </p>
                      </div>
                    </div>

                    <hr />
                  </div>

                  <div
                    className={css.finalCont}
                    onClick={() => {
                      if (
                        !userRolesSettings['Company Details']
                          .delete_company_details
                      ) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      setDeleteOrgDialog(true);
                    }}
                  >
                    <p className={css.deactivate}>Deactivate Account</p>
                  </div>
                </div>
              )}

              {editBusiness && (
                <div className={css.newBusinessEdit}>
                  <div className={css.logoUpload}>
                    <SelectBottomSheet
                      name="contact"
                      addNewSheet
                      triggerComponent={
                        <span className={css.contactIconForLogo}>
                          <div
                            className={css.imageWrapper}
                            onClick={() => setDrawer({ camera: true })}
                          >
                            <img
                              className={css.image}
                              src={cameraIcon}
                              alt="logo"
                            />
                          </div>
                        </span>
                      }
                      open={drawer.camera}
                      onClose={() => {
                        closeDrawer('camera');
                      }}
                    >
                      <Mui.Stack
                        spacing={2}
                        alignItems="center"
                        className={classes.marginDesign}
                      >
                        <Mui.Stack
                          direction="row"
                          style={{
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Mui.Typography className={classes.header}>
                            Upload Logo
                          </Mui.Typography>
                          <CloseIcon
                            className={classes.headerIcon}
                            onClick={() => {
                              closeDrawer('camera');
                            }}
                          />
                        </Mui.Stack>
                        <div
                          onClick={() => {
                            JSBridge.browseLogo();
                          }}
                        >
                          <Mui.Stack
                            direction="row"
                            className={classes.camBtn}
                            // onClick={() => {
                            //   JSBridge.browseLogo('logo');
                            // }}
                          >
                            <img
                              src={upload}
                              alt={upload}
                              style={{ marginRight: '1rem' }}
                            />
                            <Mui.Typography className={classes.camBtnText}>
                              upload from phone
                            </Mui.Typography>
                          </Mui.Stack>
                        </div>
                        <Mui.Button
                          className={classes.updload}
                          onClick={() => UploadLogo()}
                          style={{ opacity: imageData ? 1 : 0.3 }}
                          disabled={!imageData}
                        >
                          <Mui.Typography
                            style={{ color: 'white', fontSize: '18px' }}
                          >
                            Upload
                          </Mui.Typography>
                        </Mui.Button>
                      </Mui.Stack>
                    </SelectBottomSheet>
                    <div onClick={() => setDrawer({ camera: true })}>
                      <p className={css.uploadTxt}>Upload New Logo</p>
                    </div>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <Input
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Business Name"
                      value={nameData}
                      variant="standard"
                      name="businessName"
                      onChange={(e) => setNameData(e.target.value)}
                      // onBlur={reValidate}
                      error={!validateRequired(nameData)}
                      helperText={
                        !validateRequired(nameData)
                          ? 'Please Enter Valid name'
                          : ''
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      theme="light"
                    />
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <CinNumberSheet
                      infoData={infoData}
                      cinNumber={cinNumber}
                      setCinNumber={setCinNumber}
                    />
                  </div>

                  <div
                    className={css.addressCSS}
                    style={{
                      borderBottom:
                        data?.filter((c) => c?.active)?.length === 0 &&
                        '0.7px solid #999ea563',
                    }}
                  >
                    <div className={css.headCont}>
                      <p>Addresses</p>
                      <Mui.IconButton onClick={() => AddaddressNew()}>
                        <AddIcon sx={{ color: '#F08B32' }} />
                      </Mui.IconButton>
                    </div>

                    {data
                      ?.filter((c) => c?.active)
                      ?.map((val) => (
                        <div className={css.addrCont}>
                          <div className={css.addrTitleCont}>
                            <p className={css.addrTitleTxt}>{val?.city}</p>
                            <div className={css.addrTitleDiv}>
                              <Mui.IconButton>
                                <ModeEditOutlineOutlinedIcon
                                  style={{ color: '#A0A4AF' }}
                                  onClick={() => AddressDrawerOpen(val)}
                                />
                              </Mui.IconButton>

                              {!val?.default && (
                                <Mui.IconButton>
                                  <DeleteOutlineOutlinedIcon
                                    style={{ color: '#FF0000' }}
                                    onClick={() => DeleteAddressDrawer(val)}
                                  />
                                </Mui.IconButton>
                              )}
                            </div>
                          </div>
                          <p className={css.entireAddr}>
                            {val?.address_line1}, {val?.address_line2},{' '}
                            {val?.city}, {val?.state} - {val?.pincode}
                          </p>
                        </div>
                      ))}

                    {data?.filter((c) => c?.active)?.length === 0 && (
                      <p style={{ margin: '10px 15px' }}>-</p>
                    )}
                  </div>

                  <div
                    className={css.bankCSS}
                    style={{
                      borderBottom:
                        bankData?.filter((c) => c?.active)?.length === 0 &&
                        '0.7px solid #999ea563',
                    }}
                  >
                    <div className={css.headCont}>
                      <p>Bank Details</p>
                      <Mui.IconButton onClick={() => BankNew()}>
                        <AddIcon sx={{ color: '#F08B32' }} />
                      </Mui.IconButton>
                    </div>

                    {bankData
                      ?.filter((c) => c?.active)
                      ?.map((val) => (
                        <div className={css.addrCont}>
                          <div className={css.addrTitleCont}>
                            <p className={css.addrTitleTxt}>
                              {val?.bank_account_name}
                            </p>
                            <div className={css.addrTitleDiv}>
                              <Mui.IconButton>
                                <ModeEditOutlineOutlinedIcon
                                  style={{ color: '#A0A4AF' }}
                                  onClick={() => BankDrawerOpen(val)}
                                />
                              </Mui.IconButton>

                              {!val.default && (
                                <Mui.IconButton>
                                  <DeleteOutlineOutlinedIcon
                                    style={{ color: '#FF0000' }}
                                    onClick={() => BankDeleteDrawer(val)}
                                  />
                                </Mui.IconButton>
                              )}
                            </div>
                          </div>
                          <p className={css.entireAddr}>
                            {val?.bank_account_number}
                          </p>
                        </div>
                      ))}

                    {bankData?.filter((c) => c?.active)?.length === 0 && (
                      <p style={{ margin: '10px 15px' }}>-</p>
                    )}
                  </div>

                  <div style={{ margin: '20px 0' }}>
                    {/* <DetailsCard name="Select Business Type">
                      <Mui.Typography>
                        {businessTypeChange || '-'}
                      </Mui.Typography>
                    </DetailsCard> */}
                  </div>
                  <div style={{ margin: '20px 0', display: 'flex' }}>
                    <Mui.Button
                      className={css.outlinedButton}
                      style={{ padding: '10px 30px', margin: 'auto' }}
                      onClick={() => {
                        if (nameData?.length > 0) {
                          UpdateOrganisationName();
                        }
                        UpdateCINNumber();
                      }}
                    >
                      Save Business Details
                    </Mui.Button>
                  </div>
                </div>
              )}

              {/* <Mui.Stack className={css.firstRow} mt={2}>
            <SelectBottomSheet
              name="contact"
              addNewSheet
              triggerComponent={
                <span className={css.contactIconForLogo}>
                  <div
                    className={css.imageWrapper}
                    onClick={() => setDrawer({ camera: true })}
                  >
                    <img className={css.image} src={cameraIcon} alt="logo" />
                  </div>
                </span>
              }
              open={drawer.camera}
              onClose={() => {
                closeDrawer('camera');
              }}
            >
              <Mui.Stack
                spacing={2}
                alignItems="center"
                className={classes.marginDesign}
              >
                <Mui.Stack
                  direction="row"
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <Mui.Typography className={classes.header}>
                    Upload Logo
                  </Mui.Typography>
                  <CloseIcon
                    className={classes.headerIcon}
                    onClick={() => {
                      closeDrawer('camera');
                    }}
                  />
                </Mui.Stack>
                <div>
                  <Mui.Stack
                    direction="row"
                    className={classes.camBtn}
                    onClick={() => {
                      JSBridge.browseLogo('logo');
                    }}
                  >
                    <img
                      src={upload}
                      alt={upload}
                      style={{ marginRight: '1rem' }}
                    />
                    <Mui.Typography className={classes.camBtnText}>
                      upload from phone
                    </Mui.Typography>
                  </Mui.Stack>
                </div>
                <Mui.Button
                  className={classes.updload}
                  onClick={() => UploadLogo()}
                  style={{ opacity: imageData ? 1 : 0.3 }}
                  disabled={!imageData}
                >
                  <Mui.Typography style={{ color: 'white', fontSize: '18px' }}>
                    Upload
                  </Mui.Typography>
                </Mui.Button>
              </Mui.Stack>
            </SelectBottomSheet>

            <SelectBottomSheet
              name="contact"
              addNewSheet
              triggerComponent={
                <Mui.Stack
                  className={
                    device === 'desktop' ? css.busiNameDesktop : css.busiName
                  }
                >
                  <DetailsCard
                    name="Business Name"
                    icon={pencil}
                    alt="editImage"
                  >
                    {infoData?.name}
                  </DetailsCard>
                </Mui.Stack>
              }
              open={drawer.businessName}
            >
              <Mui.Stack className={classes.headerStack}>
                <Puller />
                <Mui.Stack
                  direction="row"
                  style={{ justifyContent: 'space-between' }}
                >
                  <Mui.Typography className={classes.header}>
                    business name
                  </Mui.Typography>
                  <CloseIcon
                    className={classes.headerIcon}
                    onClick={() => {
                      closeDrawer('businessName');
                    }}
                  />
                </Mui.Stack>
                <Mui.Stack spacing={2} alignItems="center" mt={2}>
                  <TextfieldStyle
                    label="Enter Business Name"
                    defaultValue={infoData?.name}
                    onChange={(e) => setNameData(e.target.value)}
                  />
                  <Mui.Button
                    variant="contained"
                    className={classes.filledBtn}
                    onClick={() => UpdateOrganisationName()}
                  >
                    <Mui.Typography className={classes.filledBtnText}>
                      save business name
                    </Mui.Typography>
                  </Mui.Button>
                </Mui.Stack>
              </Mui.Stack>
            </SelectBottomSheet>
          </Mui.Stack>

          <div className={css.spacer} />
          <SelectBottomSheet
            name="contact"
            addNewSheet
            triggerComponent={
              <span className={css.contactIcon}>
                <DetailsCard
                  name="Business CIN Number"
                  icon={pencil}
                  alt="editImage"
                >
                  {cinNumber?.original}
                </DetailsCard>
              </span>
            }
            open={drawer.businessPhNo}
            onClose={() => {
              closeDrawer('businessPhNo');
              setCinNumber((prev) => ({ ...prev, change: prev?.original }));
            }}
          >
            <Mui.Stack className={classes.headerStack}>
              <Puller />
              <CinNumberSheet
                infoData={infoData}
                closeDrawer={closeDrawer}
                cinNumber={cinNumber}
                setCinNumber={setCinNumber}
                UpdateCINNumber={UpdateCINNumber}
              />
            </Mui.Stack>
          </SelectBottomSheet>
          <div className={css.spacer} />

          <Mui.Stack className={css.detailsCardContainer}>
            <Mui.Stack className={css.headerWrapper}>
              <div className={css.label}>Business Address</div>
              <div
                className={css.imageWrapperi}
                onClick={() => AddaddressNew()}
              >
                <img className={css.image} src={plus} alt="Icon" />
              </div>
            </Mui.Stack>
            {data
              ?.filter((val) => val?.active)
              ?.map((c) => {
                return (
                  <Mui.Stack
                    direction="row"
                    style={{
                      justifyContent: 'space-between',
                      padding: '5px 0px',
                    }}
                  >
                    <Mui.Typography style={{ textTransform: 'capitalize' }}>
                      {c?.city}
                    </Mui.Typography>
                    <Mui.Stack
                      direction="row"
                      style={{ justifyContent: 'space-between', width: '80px' }}
                    >
                      <DeleteOutlineOutlinedIcon
                        style={{ color: 'grey' }}
                        onClick={() => DeleteAddressDrawer(c)}
                      />
                      <ModeEditOutlineOutlinedIcon
                        style={{ color: 'grey' }}
                        onClick={() => AddressDrawerOpen(c)}
                      />
                    </Mui.Stack>
                  </Mui.Stack>
                );
              })}
          </Mui.Stack>
          <div className={css.spacer} />

          <Mui.Stack className={css.detailsCardContainer}>
            <Mui.Stack className={css.headerWrapper}>
              <div className={css.label}>Bank Details</div>
              <div className={css.imageWrapperi} onClick={() => BankNew()}>
                <img className={css.image} src={plus} alt="Icon" />
              </div>
            </Mui.Stack>
            {bankData
              ?.filter((c) => c?.active)
              .map((c) => {
                return (
                  <Mui.Stack
                    direction="row"
                    style={{
                      justifyContent: 'space-between',
                      padding: '5px 0px',
                    }}
                  >
                    <Mui.Typography
                      style={{ textTransform: 'capitalize', width: '170px' }}
                    >
                      {c?.name}
                    </Mui.Typography>
                    <Mui.Stack
                      direction="row"
                      style={{ justifyContent: 'space-between', width: '80px' }}
                    >
                      <DeleteOutlineOutlinedIcon
                        style={{ color: 'grey' }}
                        onClick={() => BankDeleteDrawer(c)}
                      />
                      <ModeEditOutlineOutlinedIcon
                        style={{ color: 'grey' }}
                        onClick={() => BankDrawerOpen(c)}
                      />
                    </Mui.Stack>
                  </Mui.Stack>
                );
              })}
          </Mui.Stack>
          <div className={css.spacer} />
          <Mui.Stack mb={2}>
            <DetailsCard name="Business Type" icon={pencil} alt="editImage">
              <Mui.Typography>{businessTypeChange}</Mui.Typography>
            </DetailsCard>
          </Mui.Stack> */}
            </>
          )}
          <SelectBottomSheet
            triggerComponent={<div style={{ display: 'none' }} />}
            open={addressDrawer}
            addNewSheet
            onClose={() => onCloseAddress()}
          >
            {device === 'mobile' ? <Puller /> : ''}
            <Mui.Stack direction="row" className={classes.headerStack}>
              <Mui.Typography className={classes.header}>
                Business Address
              </Mui.Typography>
              {device === 'mobile' && (
                <CloseIcon
                  className={classes.headerIcon}
                  onClick={() => {
                    onCloseAddress();
                  }}
                />
              )}
            </Mui.Stack>
            <form>
              <Mui.Stack style={{ margin: '0 16px' }} spacing={1}>
                <TextfieldStyleBusiness
                  disabled={addressState.noGst}
                  label="GSTIN"
                  name="gstn"
                  required
                  textTransformChange="uppercase"
                  onChange={onInputChange}
                  value={addressState?.gstn}
                  onBlur={reValidate}
                  error={validationErr.gstn}
                  helperText={
                    validationErr.gstn ? VALIDATION?.gstn?.errMsg : ''
                  }
                  onKeyPress={OnlyAlphaNumeric}
                />
                {!addressState?.gstn && (
                  <div className={css.noGst}>
                    <Checkbox
                      name="noGst"
                      checked={addressState.noGst}
                      onChange={onInputChange}
                    />
                    <div htmlFor="whatsappNotify" className={css.label}>
                      Does Not Have a GST Number
                    </div>
                  </div>
                )}
                <TextfieldStyleBusiness
                  label="Business Address Line 01"
                  name="address1"
                  required
                  // textTransformChange="capitalize"
                  value={addressState?.address1}
                  onChange={onInputChange}
                  onBlur={reValidate}
                  error={validationErr.address1}
                  helperText={
                    validationErr.address1 ? VALIDATION?.address1?.errMsg : ''
                  }
                  inputProps={{ maxLength: 45 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={mainCss.endInput}
                      >
                        {`${addressState?.address1?.length || 0}/45`}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextfieldStyleBusiness
                  label="Business Address Line 02"
                  name="address2"
                  // textTransformChange="capitalize"
                  value={addressState?.address2}
                  onChange={onInputChange}
                  inputProps={{ maxLength: 45 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={mainCss.endInput}
                      >
                        {`${addressState?.address2?.length || 0}/45`}
                      </InputAdornment>
                    ),
                  }}
                />
                <Mui.Stack
                  direction="row"
                  justifyContent="spaceBetween"
                  style={{ width: '100%' }}
                  spacing={2}
                >
                  <TextfieldStyleBusiness
                    label="Town/City"
                    name="cityData"
                    required
                    textTransformChange="capitalize"
                    value={addressState?.cityData}
                    onChange={onInputChange}
                    style={{ width: '70%' }}
                    onBlur={reValidate}
                    error={validationErr.cityData}
                    helperText={
                      validationErr.cityData ? VALIDATION?.cityData?.errMsg : ''
                    }
                  />
                  <TextfieldStyleBusiness
                    label="Pin Code"
                    name="pincodeData"
                    required
                    textTransformChange="capitalize"
                    value={addressState?.pincodeData}
                    onChange={onInputChange}
                    style={{ width: '30%', height: '0px' }}
                    onBlur={reValidate}
                    error={validationErr.pincodeData}
                    helperText={
                      validationErr.pincodeData
                        ? VALIDATION?.pincodeData?.errMsg
                        : ''
                    }
                    inputProps={{
                      type: 'tel',
                      maxLength: 6,
                    }}
                    onKeyPress={pincodeKeyPress}
                  />
                </Mui.Stack>

                <SelectBusiness
                  name="stateData"
                  label="State"
                  variant="standard"
                  options={allStates}
                  fullWidth
                  theme="light"
                  required
                  onChange={onInputChange}
                  defaultValue={addressState?.stateData}
                  style={{
                    margin: '5px 0px 15px 0px',
                  }}
                  borderChange="1px solid  rgb(153, 158, 165)"
                  onBlur={reValidate}
                  error={validationErr.stateData}
                  helperText={
                    validationErr.stateData ? VALIDATION?.stateData?.errMsg : ''
                  }
                />
                <SelectBusiness
                  name="countryData"
                  label="Country"
                  variant="standard"
                  options={countries}
                  fullWidth
                  theme="light"
                  onChange={onInputChange}
                  defaultValue={addressState?.countryData}
                  style={{
                    margin: '5px 0px 15px 0px',
                  }}
                  borderChange="1px solid rgb(153, 158, 165)"
                  onBlur={reValidate}
                  error={validationErr.countryData}
                  helperText={
                    validationErr.countryData
                      ? VALIDATION?.countryData?.errMsg
                      : ''
                  }
                />

                {editValue || (!editValue && !deleteValue) ? (
                  <div className={css.defaultDiv}>
                    <CustomCheckbox
                      name="defaultLocations"
                      onChange={() =>
                        setAddressState((s) => ({
                          ...s,
                          defaultLocations: !addressState?.defaultLocations,
                        }))
                      }
                      checked={addressState?.defaultLocations}
                    />
                    <h5>Set This As Your Default Business Address</h5>
                  </div>
                ) : (
                  ''
                )}
              </Mui.Stack>

              {!editValue &&
                !deleteValue &&
                (device === 'desktop' ? (
                  <Mui.Stack
                    className={css.createStack}
                    onClick={() => CreateLocations()}
                    mb={4}
                  >
                    <Mui.Stack className={css.create}>
                      {/* Create */}
                      Save Business Address
                    </Mui.Stack>
                  </Mui.Stack>
                ) : (
                  <div style={{ margin: '20px 0', display: 'flex' }}>
                    <Mui.Button
                      className={css.outlinedButton}
                      style={{ padding: '10px 30px', margin: 'auto' }}
                      onClick={() => CreateLocations()}
                    >
                      Save Business Address
                    </Mui.Button>
                  </div>
                ))}
              {editValue &&
                (device === 'desktop' ? (
                  <Mui.Stack
                    className={css.createStack}
                    onClick={() => EditLocations()}
                    mb={4}
                  >
                    <Mui.Stack className={css.create}>
                      Update Business Address
                    </Mui.Stack>
                  </Mui.Stack>
                ) : (
                  <div style={{ margin: '20px 0', display: 'flex' }}>
                    <Mui.Button
                      className={css.outlinedButton}
                      style={{ padding: '10px 30px', margin: 'auto' }}
                      onClick={() => EditLocations()}
                    >
                      Save Business Address
                    </Mui.Button>
                  </div>
                ))}
              {deleteValue &&
                (device === 'desktop' ? (
                  <Mui.Stack
                    className={css.createStack}
                    onClick={() => DeleteAddressDialog()}
                    mb={4}
                  >
                    <Mui.Stack className={css.delete}>
                      Delete This Business Address
                    </Mui.Stack>
                  </Mui.Stack>
                ) : (
                  <div style={{ margin: '20px 0', display: 'flex' }}>
                    <Mui.Button
                      className={css.deleteOutlinedButton}
                      style={{ padding: '10px 30px', margin: 'auto' }}
                      onClick={() => DeleteAddressDialog()}
                    >
                      Remove Address
                    </Mui.Button>
                  </div>
                ))}
            </form>
          </SelectBottomSheet>
          <SelectBottomSheet
            open={drawerOpen}
            addNewSheet
            onClose={() => onCloseBank()}
            triggerComponent={<div style={{ display: 'none' }} />}
          >
            {' '}
            {device === 'mobile' ? <Puller /> : ''}
            <Mui.Stack direction="row" className={classes.headerStack}>
              <Mui.Typography className={classes.header}>
                Bank Details
              </Mui.Typography>
              {device === 'mobile' && (
                <CloseIcon
                  className={classes.headerIcon}
                  onClick={() => {
                    onCloseBank();
                  }}
                />
              )}
            </Mui.Stack>
            <Mui.Stack m={2} mb={4} spacing={1}>
              <TextfieldStyleBusiness
                label="Bank Account Number"
                required
                type="number"
                name="accountno"
                textTransformChange="capitalize"
                value={addressState?.accountno}
                onChange={(event) => {
                  if (event?.target?.value >= 0) {
                    onInputChange(event);
                  }
                }}
                onBlur={reValidate}
                error={validationErr.accountno}
                helperText={
                  validationErr.accountno ? VALIDATION?.accountno?.errMsg : ''
                }
                onKeyDown={handleAccountPress}
                InputProps={{
                  inputProps: {
                    min: 0,
                  },
                }}
              />

              <div className={css.noIfsc}>
                <Checkbox
                  name="noIfsc"
                  checked={addressState.noIfsc}
                  onChange={onInputChange}
                />
                <div htmlFor="whatsappNotify" className={css.label}>
                  I do not have IFSC code
                </div>
              </div>
                
              {!addressState?.noIfsc ?<TextfieldStyleBusiness
                label="IFSC Code"
                style={{ width: '70%' }}
                required
                name="ifsc"
                textTransformChange="uppercase"
                value={addressState?.ifsc}
                onChange={onInputChange}
                onBlur={reValidate}
                error={validationErr.ifsc}
                helperText={validationErr.ifsc ? VALIDATION?.ifsc?.errMsg : ''}
                onKeyPress={handleIfscKeyPress}
              />
              :
              <TextfieldStyleBusiness
                label="Swift Code"
                style={{ width: '70%' }}
                required
                name="swift"
                textTransformChange="uppercase"
                value={addressState?.swift}
                onChange={onInputChange}
                onBlur={reValidate}
                error={validationErr.swift}
                helperText={validationErr.swift ? VALIDATION?.swift?.errMsg : ''}
                onKeyPress={handleSwiftKeyPress}
              />
}
              <Mui.Stack
                direction="row"
                justifyContent="spaceBetween"
                style={{ width: '100%', marginTop: '15px' }}
                spacing={2}
              >
                <TextfieldStyleBusiness
                  label="Bank"
                  required
                  name="bank"
                  textTransformChange="capitalize"
                  onChange={onInputChange}
                  style={{ width: '30%', height: '0px' }}
                  value={addressState?.bank}
                  onBlur={reValidate}
                  error={validationErr.bank}
                  helperText={
                    validationErr.bank ? VALIDATION?.bank?.errMsg : ''
                  }
                />{' '}
                <TextfieldStyleBusiness
                  label="Branch"
                  required
                  name="branch"
                  textTransformChange="capitalize"
                  style={{ width: '30%', height: '0px' }}
                  value={addressState?.branch}
                  onChange={onInputChange}
                  onBlur={reValidate}
                  error={validationErr.branch}
                  helperText={
                    validationErr.branch ? VALIDATION?.branch?.errMsg : ''
                  }
                />
              </Mui.Stack>
              <TextfieldStyleBusiness
                label="Account Holder’s Name"
                required
                name="accountHolder"
                textTransformChange="capitalize"
                value={addressState?.accountHolder}
                onChange={onInputChange}
                onBlur={reValidate}
                error={validationErr.accountHolder}
                helperText={
                  validationErr.accountHolder
                    ? VALIDATION?.accountHolder?.errMsg
                    : ''
                }
              />
              {editValue || (!editValue && !deleteValue) ? (
                <div className={css.defaultDiv}>
                  <CustomCheckbox
                    name="defaultAccount"
                    onChange={() =>
                      setAddressState((s) => ({
                        ...s,
                        defaultLocations: !addressState?.defaultLocations,
                      }))
                    }
                    checked={addressState?.defaultLocations}
                  />
                  <h5>Set This As Your Default Bank Account</h5>
                </div>
              ) : (
                ''
              )}
            </Mui.Stack>
            {!editValue &&
              !deleteValue &&
              (device === 'desktop' ? (
                <Mui.Stack
                  className={css.createStack}
                  onClick={() => CreateBank()}
                  mb={4}
                >
                  <Mui.Stack className={css.create}>
                    Save This Bank Detail
                  </Mui.Stack>
                </Mui.Stack>
              ) : (
                <div style={{ margin: '20px 0', display: 'flex' }}>
                  <Mui.Button
                    className={css.outlinedButton}
                    style={{ padding: '10px 30px', margin: 'auto' }}
                    onClick={() => CreateBank()}
                  >
                    Save Bank Detail
                  </Mui.Button>
                </div>
              ))}
            {editValue &&
              (device === 'desktop' ? (
                <Mui.Stack
                  className={css.createStack}
                  onClick={() => EditBank()}
                  mb={4}
                >
                  <Mui.Stack className={css.create}>
                    Update This Bank Detail
                  </Mui.Stack>
                </Mui.Stack>
              ) : (
                <div style={{ margin: '20px 0', display: 'flex' }}>
                  <Mui.Button
                    className={css.outlinedButton}
                    style={{ padding: '10px 30px', margin: 'auto' }}
                    onClick={() => EditBank()}
                  >
                    Save Bank Detail
                  </Mui.Button>
                </div>
              ))}
            {deleteValue &&
              (device === 'desktop' ? (
                <Mui.Stack
                  className={css.createStack}
                  onClick={() => DeleteBankDialog()}
                  mb={4}
                >
                  <Mui.Stack className={css.delete}>
                    Delete This Bank Detail
                  </Mui.Stack>
                </Mui.Stack>
              ) : (
                <div style={{ margin: '20px 0', display: 'flex' }}>
                  <Mui.Button
                    className={css.deleteOutlinedButton}
                    style={{ padding: '10px 30px', margin: 'auto' }}
                    onClick={() => DeleteBankDialog()}
                  >
                    Remove Bank Detail
                  </Mui.Button>
                </div>
              ))}
          </SelectBottomSheet>
          <SelectBottomSheet
            name="contact"
            triggerComponent={<span style={{ display: 'none' }} />}
            open={drawer.businessType}
            addNewSheet
            onClose={() => {
              closeDrawer('businessType');
            }}
          >
            <Mui.Stack direction="row" className={classes.headerStack1}>
              <Mui.Typography className={classes.header}>
                business type
              </Mui.Typography>
              {device === 'mobile' && (
                <CloseIcon
                  className={classes.headerIcon}
                  onClick={() => {
                    closeDrawer('businessType');
                  }}
                />
              )}
            </Mui.Stack>

            {BusinessTypeData.map((c) => {
              return (
                <>
                  <Mui.Stack
                    direction="row"
                    className={classes.businessTypeModuleStack}
                  >
                    <Mui.FormControlLabel
                      control={
                        <CustomCheckbox checked={c?.value === businessType} />
                      }
                      label={c?.text}
                      value={c?.value}
                      onChange={(e) => setBusinessType(e.target.value)}
                    />
                  </Mui.Stack>
                </>
              );
            })}
            <Mui.Stack alignItems="center" mb={4}>
              <Mui.Button
                variant="contained"
                className={classes.filledBtn}
                onClick={BusinessTypeApi}
              >
                <Mui.Typography className={classes.filledBtnText}>
                  save business Type
                </Mui.Typography>
              </Mui.Button>
            </Mui.Stack>
          </SelectBottomSheet>
          <Dialog open={deleteDialog} onClose={() => DeleteOncloseDialog()}>
            <Mui.Stack className={css.DeleteStack}>
              <Mui.Typography className={css.heading}>Delete</Mui.Typography>
              <Mui.Typography className={css.content}>
                Are you sure you want to delete the selected account
              </Mui.Typography>
              <Mui.Stack direction="row" className={css.btnStack}>
                <Mui.Stack className={css.cancel} onClick={DeleteOncloseDialog}>
                  Cancel
                </Mui.Stack>
                <Mui.Stack className={css.delete} onClick={Delete}>
                  Delete
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
          </Dialog>

          <Dialog
            open={deleteOrgDialog}
            onClose={() => DeleteOncloseOrgDialog()}
          >
            <Mui.Stack className={css.DeleteStack}>
              <Mui.Typography className={css.heading}>Delete</Mui.Typography>
              <Mui.Typography className={css.content}>
                Are you sure you want to delete the selected account
              </Mui.Typography>
              <Mui.Stack direction="row" className={css.btnStack}>
                <Mui.Stack
                  className={css.cancel}
                  onClick={DeleteOncloseOrgDialog}
                >
                  Cancel
                </Mui.Stack>
                <Mui.Stack
                  className={css.delete}
                  onClick={DeactivateOrganization}
                >
                  Delete
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
          </Dialog>
        </div>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
}

export default BusinessDetails;
