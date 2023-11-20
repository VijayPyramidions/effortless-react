import React from 'react';
import * as Router from 'react-router-dom';
import * as Mui from '@mui/material';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import FileUpload from '@components/FileUpload/FileUpload.jsx';
import { makeStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import Slide from '@material-ui/core/Slide';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import {
  // validateName,
  validateEmail,
  // validatePhone,
  validateGst,
  validateIfsc,
  validatePincode,
  validateAddress,
  // validateNoSymbol,
  validateRequired,
  validateAccountNumber,
  validatePan,
} from '@services/Validation.jsx';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import { DirectUpload } from '@rails/activestorage';

import Input, { MobileNumberFormatCustom } from '@components/Input/Input.jsx';
import * as themes from '@root/theme.scss';

import uploadBanking from '@assets/uploadBanking.svg';
import Upload from '../../../assets/WebAssets/feather_upload-cloud.svg';
import * as css from './InvoiceSettings.scss';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';

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
  paper: { minWidth: '500px' },
  appBar: { backgroundColor: '#fff' },
}));

const btnCssOutOutlined = {
  marginBottom: '15px',
  background: '#fff',
  padding: '8px 15px',
  color: '#F08B32',
  border: '1px solid #F08B32',
  borderRadius: 15,
};

const CustomRadio = withStyles({
  root: {
    color: '#f08b32',
    '&$checked': {
      color: '#f08b32',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const btnCssOutContained = {
  background: '#F08B32',
  color: '#FFF',
  padding: '8px 15px',
  marginBottom: '15px',
  borderRadius: 15,
  width: '380px',
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

const BUSINESS_PROFILE = [
  {
    label: 'Email Id',
    name: 'email',
    type: 'email',
    test: validateEmail,
    errMsg: 'Enter Valid Email',
  },
  {
    label: 'Legal Business Name',
    name: 'legal_business_name',
    type: 'text',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
  },
  {
    label: 'Business Type',
    name: 'business_type',
    type: 'text',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
  },
  {
    label: 'Sub-Merchant Name',
    name: 'name',
    type: 'text',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
  },
  {
    label: 'Phone Number',
    name: 'phone',
    type: 'number',
    test: validateRequired,
    errMsg: 'Enter Valid Phone',
  },
  {
    label: 'Business Category',
    name: 'business_category',
    type: 'text',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
  },
  {
    label: 'Business Sub-Category',
    name: 'business_sub_category',
    type: 'text',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
  },
];
const BUSINESS_ADDRESS = [
  {
    label: 'Business Address Line 01',
    name: 'street1',
    test: validateAddress,
    errMsg: 'Enter valid Address',
  },
  {
    label: 'Business Address Line 02',
    name: 'street2',
    test: validateAddress,
    errMsg: 'Enter valid Address',
  },
  {
    label: 'Town/City',
    name: 'city',
    test: validateRequired,
    errMsg: 'Enter Valid City',
  },
  {
    label: 'Pincode',
    name: 'postal_code',
    test: validatePincode,
    errMsg: 'Enter Valid Pincode',
  },
  {
    label: 'State',
    name: 'state',
    test: validateRequired,
    errMsg: 'Enter Valid State',
  },
];
const BUSINESS_IDENTITY = [
  {
    label: 'LLPIN Number',
    name: 'user_llp_number',
    test: validateRequired,
    errMsg: 'Enter Valid LLPIN',
    showList: ['llp'],
  },
  {
    label: 'CIN Number',
    name: 'cin_number',
    test: validateRequired,
    errMsg: 'Enter Valid CIN',
    showList: ['public_limited', 'private_limited'],
  },
  {
    label: 'Company PAN Number',
    name: 'company_pan_number',
    test: validatePan,
    errMsg: 'Enter Valid Pan',
    showList: [
      'public_limited',
      'private_limited',
      'llp',
      'partnership',
      'trust',
      'society',
      'ngo',
    ],
  },
  {
    label: 'Personal PAN Number',
    name: 'user_pan_number',
    test: validatePan,
    errMsg: 'Enter Valid Pan',
    showList: [
      'proprietorship',
      'public_limited',
      'private_limited',
      'llp',
      'partnership',
      'trust',
      'society',
      'ngo',
      'not_yet_registered',
    ],
  },
  {
    label: 'GST Number',
    name: 'gst_number',
    test: validateGst,
    errMsg: 'Enter Valid GST',
    showList: [
      'proprietorship',
      'public_limited',
      'private_limited',
      'llp',
      'partnership',
      'trust',
      'society',
      'ngo',
    ],
  },
  {
    label: 'Personal PAN card',
    name: 'userPanDoc',
    // personal_pan
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['proprietorship'],
  },
  {
    label: 'Business PAN Card',
    name: 'businessPanDoc',
    // business_pan_url
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: [
      'public_limited',
      'private_limited',
      'llp',
      'partnership',
      'trust',
      'society',
      'ngo',
    ],
  },
  {
    label: 'Business Proof URL',
    name: 'business_url',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
    showList: ['not_yet_registered'],
  },
  {
    label: 'Individual Proof of Address',
    name: 'proofOfAddress',
    // address_proof_document
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'text',
    showList: [
      'proprietorship',
      'public_limited',
      'private_limited',
      'llp',
      'partnership',
      'trust',
      'society',
      'ngo',
      'not_yet_registered',
    ],
  },
  {
    label: 'Business Proof of Address',
    name: 'businessProofOfAddress',
    // business_proof_url
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: [
      'proprietorship',
      'public_limited',
      'private_limited',
      'llp',
      'partnership',
      'trust',
      'society',
      'ngo',
    ],
  },
  {
    label: 'Other Document',
    name: 'otherDocument',
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['ngo'],
  },
  {
    label: 'Donation',
    name: 'donation',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
    type: 'upload',
    showList: ['trust', 'society'],
  },
];
const BANK_DETAILS = [
  {
    label: "Account Holder's Name",
    name: 'beneficiary_name',
    test: validateRequired,
    errMsg: 'Enter Valid Details',
  },
  {
    label: 'IFSC Code',
    name: 'beneficiary_ifsc_code',
    test: validateIfsc,
    errMsg: 'Enter Valid IFSC Code',
  },
  {
    label: 'Bank Account Number',
    name: 'beneficiary_account_number',
    test: validateAccountNumber,
    errMsg: 'Enter Valid Account Details',
  },
  {
    label: 'UPI ID',
    name: 'upi',
    test: validateRequired,
    errMsg: 'Enter Valid UPI ID',
  },
];

const INDIVIDUAL_PROOF_TYPE = [
  {
    label: 'Aadhar Front',
    name: 'aadharFront',
    // address_proof_document
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['aadhar'],
    key: 'aadhar_front',
  },
  {
    label: 'Aadhar Back',
    name: 'aadharBack',
    // address_proof_document
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['aadhar'],
    key: 'aadhar_back',
  },
  {
    label: 'Voter ID Front',
    name: 'voterFront',
    // address_proof_document
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['voter_id'],
    key: 'voter_id_front',
  },
  {
    label: 'Voter ID Back',
    name: 'voterBack',
    // address_proof_document
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['voter_id'],
    key: 'voter_id_back',
  },
  {
    label: 'Passport Front',
    name: 'passportFront',
    // address_proof_document
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['passport'],
    key: 'passport_front',
  },
  {
    label: 'Passport Back',
    name: 'passportBack',
    // address_proof_document
    test: validateRequired,
    errMsg: 'Enter Valid Document',
    type: 'upload',
    showList: ['passport'],
    key: 'passport_back',
  },
];

const BUSINESS_TYPE = [
  { label: 'Proprietorship', name: 'proprietorship' },
  { label: 'Partnership', name: 'partnership' },
  { label: 'Private Limited', name: 'private_limited' },
  { label: 'Public Limited', name: 'public_limited' },
  { label: 'LLP', name: 'llp' },
  { label: 'NGO', name: 'ngo' },
  { label: 'Trust', name: 'trust' },
  { label: 'Society', name: 'society' },
  { label: 'Not Yet Registered', name: 'not_yet_registered' },
];

const INDIVIDUAL_PROOF = [
  { label: 'Aadhar', name: 'aadhar' },
  { label: 'Voter ID', name: 'voter_id' },
  { label: 'Passport', name: 'passport' },
];

const BUSINESS_CATEGORY = [
  { label: 'Financial Services', name: 'financial_services' },
  { label: 'Education', name: 'education' },
  { label: 'Healthcare', name: 'healthcare' },
  { label: 'Utilities', name: 'utilities' },
  { label: 'Government', name: 'government' },

  { label: 'Logistics', name: 'logistics' },
  { label: 'Tours and Travel', name: 'tours_and_travel' },
  { label: 'Transport', name: 'transport' },
  { label: 'Ecommerce', name: 'ecommerce' },
  { label: 'Food', name: 'food' },

  { label: 'IT and Software', name: 'it_and_software' },
  { label: 'Gaming', name: 'gaming' },
  { label: 'Media and Entertainment', name: 'media_and_entertainment' },
  { label: 'Services', name: 'services' },
  { label: 'Housing', name: 'housing' },

  { label: 'Not for Profit', name: 'not_for_profit' },
  { label: 'Social', name: 'social' },
  { label: 'Others', name: 'others' },
];

const RADIO_DISPLAY = {
  proprietorship: 'Proprietorship',
  partnership: 'Partnership',
  private_limited: 'Private Limited',
  public_limited: 'Public Limited',
  llp: 'LLP',
  ngo: 'NGO',
  trust: 'Trust',
  society: 'Society',
  not_yet_registered: 'Not Yet Registered',

  financial_services: 'Financial Services',
  education: 'Education',
  healthcare: 'Healthcare',
  utilities: 'Utilities',
  government: 'Government',
  logistics: 'Logistics',
  tours_and_travel: 'Tours and Travel',
  transport: 'Transport',
  ecommerce: 'Ecommerce',
  food: 'Food',
  it_and_software: 'IT and Software',
  gaming: 'Gaming',
  media_and_entertainment: 'Media and Entertainment',
  services: 'Services',
  housing: 'Housing',
  not_for_profit: 'Not for Profit',
  social: 'Social',
  others: 'Others',

  aadhar: 'Aadhar',
  passport: 'Passport',
  voter_id: 'Voter ID',
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

let initialState = {};

const RazorPayMerchant = () => {
  const { state } = Router.useLocation();
  const navigate = Router.useNavigate();
  const classes = useStyles();
  const { organization, enableLoading, user, openSnackBar, userPermissions } =
    React.useContext(AppContext);
  const [BUSINESS_SUB_CATEGORY, setBUSINESS_SUB_CATEGORY] = React.useState([]);
  const [MODAL_TYPE, setMODAL_TYPE] = React.useState();

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  const uploadNavigatePerm = (route, stateParam) => { 
    setHavePermission({
      open: true,
      back: () => {
        setHavePermission({ open: false });
        if (stateParam) {
          navigate(route, stateParam);
        } else if(route) {
          navigate(route || '/settings');
        }
      },
    });
  }; 

  React.useEffect(() => {
      if (Object.keys(userPermissions?.Settings || {})?.length > 0) {
        if (!userPermissions?.Settings?.Settings) {
          uploadNavigatePerm('/settings');
        }
        setUserRoles({ ...userPermissions?.Settings });
      }
  }, [userPermissions]);

  React.useEffect(() => {
    if (Object.keys(userRoles?.['Razorpay Setup'] || {})?.length > 0) {
      if (!userRoles?.['Razorpay Setup']?.view_razorpay_submerchant) {
        uploadNavigatePerm('/settings');
      } else if (!userRoles?.['Razorpay Setup']?.create_razorpay_submerchant && !state?.response) {
        uploadNavigatePerm('/settings');
      } else if (!userRoles?.['Razorpay Setup']?.edit_razorpay_submerchant && state?.response) {
        uploadNavigatePerm('/settings');
      }
    }
  }, [userRoles?.['Razorpay Setup']]);
  
  React.useEffect(() => {
    setMODAL_TYPE({
      'Business Type': BUSINESS_TYPE,
      'Business Category': BUSINESS_CATEGORY,
      'Business Sub-Category': BUSINESS_SUB_CATEGORY,
      'Individual Proof of Address': INDIVIDUAL_PROOF,
    });
  }, [BUSINESS_SUB_CATEGORY]);
  const [forUploadPan, setForUploadPan] = React.useState({
    id: '',
    fileName: '',
  });
  const [forUploadId, setForUploadId] = React.useState({
    id: '',
    fileName: '',
  });
  const [forUploadPersonalPan, setForUploadPersonalPan] = React.useState({
    id: '',
    fileName: '',
  });
  const [forUploadBuisId, setForUploadBuisId] = React.useState({
    id: '',
    fileName: '',
  });
  const [forUploadOther, setForUploadOther] = React.useState({
    id: '',
    fileName: '',
  });
  const [forUpload80GCert, setForUpload80GCert] = React.useState({
    id: '',
    fileName: '',
  });
  const [frontID, setFrontID] = React.useState({
    id: '',
    fileName: '',
    type: '',
  });
  const [backID, setBackID] = React.useState({
    id: '',
    fileName: '',
    type: '',
  });

  const [toggleModal, setToggleModal] = React.useState(false);
  const [dialog, setDialog] = React.useState('');
  const [open, setOpen] = React.useState({ dialog: false, value: '' });
  const [inputData, setInputData] = React.useState({});
  const [validationErr, setValidationErr] = React.useState({});
  const [validState, setValidState] = React.useState({});
  const [RADIO_DISPLAY_VALUES, setRADIO_DISPLAY_VALUES] =
    React.useState(RADIO_DISPLAY);
  const [openModel, setOpenModel] = React.useState(false);
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

  React.useEffect(() => {
    // let temp = {};
    const temp0 = BUSINESS_PROFILE.reduce(
      (a, v) => ({ ...a, [v.name]: v }),
      {},
    );
    const temp1 = BUSINESS_ADDRESS.reduce(
      (a, v) => ({ ...a, [v.name]: v }),
      {},
    );
    const temp2 = BUSINESS_IDENTITY?.filter((val) =>
      val.showList?.includes(inputData?.business_type || 'not_yet_registered'),
    ).reduce((a, v) => ({ ...a, [v.name]: v }), {});
    const temp3 = BANK_DETAILS.reduce((a, v) => ({ ...a, [v.name]: v }), {});

    const mainTemp = { ...temp0, ...temp1, ...temp2, ...temp3 };
    setValidState(mainTemp);
    const initialValidationErr = Object.keys(mainTemp).map((k) => ({
      [k]: false,
    }));
    setValidationErr(initialValidationErr);
  }, [inputData?.business_type]);

  React.useEffect(() => {
    if (state?.response?.account_status === 'not_yet_created') {
      setOpenModel(true);
    }
  }, [state]);

  React.useEffect(() => {
    // let temp = {};
    const deleteArray = [
      'aadharBack',
      'aadharFront',
      'aadhar_front',
      'aadhar_back',
      'voterFront',
      'voterBack',
      'voter_id_front',
      'voter_id_back',
      'passportFront',
      'passportBack',
      'passport_front',
      'passport_back',
    ];

    deleteArray.map((val) => delete inputData[val]);
    deleteArray.map((val) => delete validationErr[val]);
    deleteArray.map((val) => delete validState[val]);

    const temp = INDIVIDUAL_PROOF_TYPE?.filter((val) =>
      val.showList?.includes(inputData?.proofOfAddress),
    ).reduce((a, v) => ({ ...a, [v.name]: v }), {});

    const temp2 = INDIVIDUAL_PROOF_TYPE?.filter((val) =>
      val.showList?.includes(inputData?.proofOfAddress),
    ).reduce((a, v) => ({ ...a, [v.name]: '' }), {});

    setInputData((prev) => ({ ...prev, ...temp2 }));
    const mainTemp = { ...temp };
    setValidState((prev) => ({ ...prev, ...mainTemp }));
    const initialValidationErr = Object.keys(mainTemp).map((k) => ({
      [k]: false,
    }));
    setValidationErr((prev) => ({ ...prev, ...initialValidationErr }));
  }, [inputData?.proofOfAddress]);

  const fetchSubCategory = () => {
    enableLoading(true);
    RestApi(`razorpay_business_sub_categories`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setRADIO_DISPLAY_VALUES({
          ...RADIO_DISPLAY,
          ...res?.data[inputData?.business_category]?.reduce(
            (a, v) => ({ ...a, [v]: v.split('_').join(' ') }),
            {},
          ),
        });

        const temp2 = [];
        res?.data[inputData?.business_category]?.reduce(
          (a, v) =>
            temp2.push({
              label: v.split('_').join(' '),
              name: v.toLowerCase(),
            }),
          {},
        );
        setBUSINESS_SUB_CATEGORY(temp2);
        enableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        enableLoading(false);
      });
  };

  const handleClickOpen = (val, stateForUpload) => {
    if (val === 'false' || val === 'true') {
      const donationVal = val === 'false' ? 'true' : 'false';
      if (val === 'false') {
        BUSINESS_IDENTITY.push({
          label: '80G Certificate',
          name: 'form80gurl',
          // form_80g_url
          test: validateRequired,
          errMsg: 'Enter Valid Document',
          type: 'upload',
          showList: ['trust', 'society'],
        });
        setInputData((s) => ({ ...s, donation: donationVal, form80gurl: '' }));
        setValidState((p) => ({
          ...p,
          form80gurl: {
            label: '80G Certificate',
            name: 'form80gurl',
            test: validateRequired,
            errMsg: 'Enter Valid Document',
            type: 'upload',
            showList: ['trust', 'society'],
          },
        }));
        setValidationErr((s) => ({ ...s, form80gurl: false }));
      } else if (val === 'true') {
        delete BUSINESS_IDENTITY[
          BUSINESS_IDENTITY.findIndex((data) => data?.name === 'form80gurl')
        ];
        const intialVal = inputData;
        const stateForValidation = validState;
        delete intialVal?.form80gurl;
        delete intialVal?.form_80g_url;
        delete stateForValidation?.form80gurl;
        setInputData({ ...intialVal, donation: donationVal });
        setValidState(stateForValidation);
        // setValidationErr(s => ({ ...s, form80gurl: false }));
      }
    } else {
      setOpen({ dialog: true, value: val, uploadState: stateForUpload });
    }
  };

  const handleClose1 = () => {
    setOpen({ dialog: false, value: '' });
  };

  const syncNow = () => {
    handleClose1();

    // handleClose1();
    // enableLoading(true);
    // RestApi(`organizations/${organization.orgId}/tally_backup`, {
    //   method: METHOD.POST,
    //   payload: { tally_backup: ids },
    //   headers: {
    //     Authorization: `Bearer ${user.activeToken}`,
    //   },
    // }).then((res) => {
    //   console.log(res);
    //   enableLoading(false);
    // });
  };

  React.useEffect(() => {
    if (open.value === 'pan') {
      setInputData((prev) => {
        return {
          ...prev,
          businessPanDoc: forUploadPan?.fileName,
          business_pan_url: forUploadPan?.id,
        };
      });
      setValidationErr((s) => ({ ...s, businessPanDoc: false }));
    }
    // else if (open.value === 'id') {
    //   setInputData((prev) => {
    //     return {
    //       ...prev,
    //       proofOfAddress: forUploadId?.fileName,
    //       address_proof_document: forUploadId?.id,
    //     };
    //   });
    //   setValidationErr((s) => ({ ...s, proofOfAddress: false }));
    // }
    else if (open.value === '80G') {
      setInputData((prev) => {
        return {
          ...prev,
          form80gurl: forUpload80GCert?.fileName,
          form_80g_url: forUpload80GCert?.id,
        };
      });
      setValidationErr((s) => ({ ...s, form80gurl: false }));
    } else if (open.value === 'others') {
      setInputData((prev) => {
        return {
          ...prev,
          otherDocument: forUploadOther?.fileName,
          other_proof_document: forUploadOther?.id,
        };
      });
      setValidationErr((s) => ({ ...s, otherDocument: false }));
    } else if (open.value === 'buisId') {
      setInputData((prev) => {
        return {
          ...prev,
          businessProofOfAddress: forUploadBuisId?.fileName,
          business_proof_url: forUploadBuisId?.id,
        };
      });
      setValidationErr((s) => ({ ...s, businessProofOfAddress: false }));
    } else if (open.value === 'personalPan') {
      setInputData((prev) => {
        return {
          ...prev,
          userPanDoc: forUploadPersonalPan?.fileName,
          personal_pan: forUploadPersonalPan?.id,
        };
      });
      setValidationErr((s) => ({ ...s, userPanDoc: false }));
    } else if (
      open.value === 'aadharFront' ||
      open.value === 'voterFront' ||
      open.value === 'passportFront'
    ) {
      setInputData((prev) => {
        return {
          ...prev,
          [frontID?.type]: frontID?.fileName,
          [frontID?.key]: frontID?.id,
        };
      });
      setValidationErr((s) => ({ ...s, [frontID?.type]: false }));
    } else if (
      open.value === 'aadharBack' ||
      open.value === 'voterBack' ||
      open.value === 'passportBack'
    ) {
      setInputData((prev) => {
        return {
          ...prev,
          [backID?.type]: backID?.fileName,
          [backID?.key]: backID?.id,
        };
      });
      setValidationErr((s) => ({ ...s, [backID?.type]: false }));
    }
  }, [
    forUploadPan,
    forUploadId,
    forUpload80GCert,
    forUploadBuisId,
    forUploadOther,
    forUploadPersonalPan,
    frontID,
    backID,
  ]);

  React.useEffect(() => {
    // if (state.merchantType === 'new') {
    const tempState = [];
    BUSINESS_PROFILE.forEach((profile) => {
      tempState.push(profile.name);
    });
    BUSINESS_ADDRESS.forEach((profile) => {
      tempState.push(profile.name);
    });
    BUSINESS_IDENTITY.forEach((profile) => {
      if (profile.showList?.includes('not_yet_registered')) {
        tempState.push(profile.name);
      }
    });
    BANK_DETAILS.forEach((profile) => {
      tempState.push(profile.name);
    });

    initialState = tempState.reduce((accumulator, value) => {
      return { ...accumulator, [value]: '' };
    }, {});
    setInputData(initialState);
    // } else {
    //   const tempState = [];
    //   BUSINESS_PROFILE.forEach((profile) => {
    //     tempState.push(profile.name);
    //   });
    //   BUSINESS_ADDRESS.forEach((profile) => {
    //     tempState.push(profile.name);
    //   });
    //   initialState = tempState.reduce((accumulator, value) => {
    //     return { ...accumulator, [value]: '' };
    //   }, {});
    //   setInputData(initialState);
    // }
  }, []);

  React.useEffect(() => {
    if (inputData?.business_category !== '') {
      setValidationErr((s) => ({ ...s, business_category: false }));
      fetchSubCategory();
    }
    delete inputData?.business_sub_category;
  }, [inputData?.business_category]);

  React.useEffect(() => {
    if (inputData?.business_sub_category !== '') {
      setValidationErr((s) => ({ ...s, business_sub_category: false }));
    }
  }, [inputData?.business_sub_category]);

  React.useEffect(() => {
    const tempState = [];
    // const initalData = inputData;
    const {
      business_pan_url,
      businessPanDoc,
      address_proof_document,
      proofOfAddress,
      personal_pan,
      userPanDoc,
      business_proof_url,
      businessProofOfAddress,
      other_proof_document,
      otherDocument,
      donation,
      form_80g_url,
      form80gurl,
      ...initalData
    } = inputData;
    // const stateForValidation = validState;
    if (inputData?.business_type?.length > 0) {
      BUSINESS_IDENTITY.forEach((profile) => {
        delete initalData[profile?.name];
        if (profile.showList?.includes(inputData?.business_type)) {
          tempState.push(profile.name);
        }
      });
      delete BUSINESS_IDENTITY[
        BUSINESS_IDENTITY.findIndex((data) => data?.name === 'form80gurl')
      ];
      initialState = tempState.reduce((accumulator, value) => {
        if (
          (inputData?.business_type === 'trust' && value === 'donation') ||
          (inputData?.business_type === 'society' && value === 'donation')
        ) {
          return { ...accumulator, [value]: 'false' };
        }
        return { ...accumulator, [value]: '' };
      }, {});

      setInputData({ ...initalData, ...initialState });
      // setValidState(stateForValidation);
      setValidationErr((s) => ({ ...s, business_type: false }));
    }
  }, [inputData?.business_type]);

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
          const { city, state: stateRes } = res;

          setInputData((s) => ({
            ...s,
            city,
            state: stateRes,
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

  const handleClose = () => {
    setToggleModal((prev) => ({ ...prev, open: false }));
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !validState?.[name]?.test?.(value),
    }));
  };

  const inputFieldHandler = (e, name) => {
    if (name !== 'phone') {
      e.persist();
    }
    reValidate(e);
    setInputData((prev) => {
      return {
        ...prev,
        [name]: e.target.value,
      };
    });
    if (name === 'pincode' && e.target.value.length === 6) {
      fetchPincodeDetails(e.target.value);
    }
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(inputData[v]);
      return a;
    }, {});
  };

  const submitForm = () => {
    // console.log(inputData, validationErr);
    // console.log(inputData);
    const sectionValidation = {};

    Object.keys(validState).forEach((k) => {
      sectionValidation[k] = validState[k];
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else if (valid) {
      const {
        businessPanDoc,
        proofOfAddress,
        userPanDoc,
        businessProofOfAddress,
        otherDocument,
        donation,
        form80gurl,
        aadharBack,
        aadharFront,
        voterFront,
        voterBack,
        passportFront,
        passportBack,
        ...payload
      } = inputData;

      enableLoading(true);

      RestApi(`organizations/${organization.orgId}/razorpay/submerchants`, {
        method: METHOD.POST,
        payload,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      })
        .then((res) => {
          console.log(res);
          setOpenModel(true);
          enableLoading(false);
        })
        .catch((err) => {
          console.log(err);
          enableLoading(false);
        });
    }
  };

  const clickHandler = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/razorpay/submerchant_onboarding`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        console.log(res);
        enableLoading(false);
        navigate('/settings-otherPaymentOptions');
      })
      .catch((err) => {
        console.log(err);
        enableLoading(false);
        navigate('/settings-otherPaymentOptions');
      });
  };

  return (
    <>
      <Mui.Stack style={{ backgroundColor: '#fff' }} px={5} py={2} spacing={3}>
        <Mui.Typography variant="h6">
          {/* {state?.merchantType === 'new' ? 'New Merchant' : 'Existing Merchant'} */}
          New Merchant
        </Mui.Typography>
        <Mui.Typography>Business Profile</Mui.Typography>
        {BUSINESS_PROFILE.map((profile) => {
          if (
            profile.label === 'Business Type' ||
            profile.label === 'Business Category' ||
            profile.label === 'Business Sub-Category'
          ) {
            return (
              <Input
                name={profile.name}
                label={profile.label}
                variant="standard"
                Fieldselect
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  onClick: () => setToggleModal({ profile, open: true }),
                }}
                InputProps={{
                  endAdornment: (
                    <Mui.InputAdornment position="start">
                      <KeyboardArrowDownIcon
                        onClick={() => setToggleModal({ profile, open: true })}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Mui.InputAdornment>
                  ),
                }}
                onBlur={reValidate}
                onChange={() => {
                  reValidate(
                    profile.name,
                    RADIO_DISPLAY_VALUES[inputData[profile.name]],
                  );
                }}
                value={RADIO_DISPLAY_VALUES[inputData[profile.name]] || ''}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid #A0A4AF',
                  cursor: 'pointer !important',
                }}
                type="text"
                text={profile.label === 'Business Sub-Category' && 'capitalize'}
                // required
                error={validationErr[profile.name]}
                helperText={validationErr[profile.name] ? profile?.errMsg : ''}
              />
            );
          }

          return profile.name === 'phone' ? (
            <Input
              name={profile.name}
              label={profile.label}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => inputFieldHandler(e, profile.name)}
              onBlur={reValidate}
              value={inputData[profile.name]}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              InputProps={{
                inputComponent: MobileNumberFormatCustom,
              }}
              type="text"
              //   required
              error={validationErr[profile.name]}
              helperText={validationErr[profile.name] ? profile?.errMsg : ''}
            />
          ) : (
            <Input
              name={profile.name}
              label={profile.label}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => inputFieldHandler(e, profile.name)}
              onBlur={reValidate}
              value={inputData[profile.name]}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type="text"
              //   required
              error={validationErr[profile.name]}
              helperText={validationErr[profile.name] ? profile?.errMsg : ''}
            />
          );
        })}
        <Mui.Typography>Business Address</Mui.Typography>
        {BUSINESS_ADDRESS.map((profile) => (
          <Input
            name={profile.name}
            label={profile.label}
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={reValidate}
            // onChange={(e) => {}}
            onChange={(e) => inputFieldHandler(e, profile.name)}
            value={inputData[profile.name]}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            type="text"
            // required
            error={validationErr[profile.name]}
            helperText={validationErr[profile.name] ? profile?.errMsg : ''}
          />
        ))}
        {/* {state?.merchantType === 'new' && ( */}
        <>
          <Mui.Typography>Business Identity</Mui.Typography>
          {BUSINESS_IDENTITY.filter((val) =>
            val.showList?.includes(
              inputData?.business_type
                ? inputData?.business_type
                : 'not_yet_registered',
            ),
          ).map((profile) => {
            if (profile.type === 'upload') {
              return (
                <Input
                  name={profile.name}
                  label={profile.label}
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  Fieldselect
                  onBlur={reValidate}
                  inputProps={{
                    onClick: () => {
                      if (profile.name === 'businessPanDoc') {
                        handleClickOpen('pan', setForUploadPan);
                      } else if (profile.name === 'proofOfAddress') {
                        handleClickOpen('id', setForUploadId);
                      } else if (profile.name === 'donation') {
                        handleClickOpen(inputData[profile.name]);
                      } else if (profile.name === 'businessProofOfAddress') {
                        handleClickOpen('buisId', setForUploadBuisId);
                      } else if (profile.name === 'otherDocument') {
                        handleClickOpen('others', setForUploadOther);
                      } else if (profile.name === 'form80gurl') {
                        handleClickOpen('80G', setForUpload80GCert);
                      } else if (profile.name === 'userPanDoc') {
                        handleClickOpen('personalPan', setForUploadPersonalPan);
                      }
                    },
                  }}
                  onChange={() => {
                    reValidate(profile.name, inputData[profile.name]);
                  }}
                  InputProps={{
                    endAdornment: (
                      <Mui.InputAdornment position="start">
                        {profile.name === 'donation' ? (
                          <ToggleSwitch
                            checked={inputData.donation !== 'false'}
                            onChange={() => {
                              handleClickOpen(inputData[profile.name]);
                            }}
                          />
                        ) : (
                          <AttachFileIcon
                            onClick={() => {
                              if (profile.name === 'businessPanDoc') {
                                handleClickOpen('pan', setForUploadPan);
                              } else if (profile.name === 'proofOfAddress') {
                                handleClickOpen('id', setForUploadId);
                              } else if (profile.name === 'donation') {
                                handleClickOpen(inputData[profile.name]);
                              } else if (
                                profile.name === 'businessProofOfAddress'
                              ) {
                                handleClickOpen('buisId', setForUploadBuisId);
                              } else if (profile.name === 'otherDocument') {
                                handleClickOpen('others', setForUploadOther);
                              } else if (profile.name === 'form80gurl') {
                                handleClickOpen('80G', setForUpload80GCert);
                              } else if (profile.name === 'userPanDoc') {
                                handleClickOpen(
                                  'personalPan',
                                  setForUploadPersonalPan,
                                );
                              }
                            }}
                            sx={{
                              transform: 'rotate(45deg)',
                              cursor: 'pointer',
                            }}
                          />
                        )}
                      </Mui.InputAdornment>
                    ),
                  }}
                  // onChange={(e) => inputFieldHandler(e, profile.name)}
                  value={inputData[profile.name]}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  type="text"
                  // required
                  error={validationErr[profile.name]}
                  helperText={
                    validationErr[profile.name] ? profile?.errMsg : ''
                  }
                />
              );
            }

            if (profile.label === 'Individual Proof of Address') {
              return (
                <>
                  <Input
                    name={profile.name}
                    label={profile.label}
                    variant="standard"
                    Fieldselect
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      onClick: () => setToggleModal({ profile, open: true }),
                    }}
                    InputProps={{
                      endAdornment: (
                        <Mui.InputAdornment position="start">
                          <KeyboardArrowDownIcon
                            onClick={() =>
                              setToggleModal({ profile, open: true })
                            }
                            sx={{ cursor: 'pointer' }}
                          />
                        </Mui.InputAdornment>
                      ),
                    }}
                    onBlur={reValidate}
                    onChange={() => {
                      reValidate(
                        profile.name,
                        RADIO_DISPLAY_VALUES[inputData[profile.name]],
                      );
                    }}
                    value={RADIO_DISPLAY_VALUES[inputData[profile.name]] || ''}
                    fullWidth
                    theme="light"
                    rootStyle={{
                      border: '1px solid #A0A4AF',
                      cursor: 'pointer !important',
                    }}
                    type="text"
                    // required
                    error={validationErr[profile.name]}
                    helperText={
                      validationErr[profile.name] ? profile?.errMsg : ''
                    }
                  />

                  {INDIVIDUAL_PROOF_TYPE.filter((val) =>
                    val.showList?.includes(
                      inputData?.proofOfAddress
                        ? inputData?.proofOfAddress
                        : '',
                    ),
                  ).map((profileInner) => (
                    <Input
                      name={profileInner.name}
                      label={profileInner.label}
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      Fieldselect
                      onBlur={reValidate}
                      inputProps={{
                        onClick: () => {
                          const temp = profileInner.name.includes('Back')
                            ? setBackID
                            : setFrontID;
                          temp((prev) => ({
                            ...prev,
                            type: profileInner.name,
                            key: profileInner.key,
                          }));
                          handleClickOpen(profileInner.name, temp);
                        },
                      }}
                      onChange={() => {
                        reValidate(
                          profileInner.name,
                          inputData[profileInner.name],
                        );
                      }}
                      InputProps={{
                        endAdornment: (
                          <Mui.InputAdornment position="start">
                            <AttachFileIcon
                              onClick={() => {
                                const temp = profileInner.name.includes('Back')
                                  ? setBackID
                                  : setFrontID;
                                temp((prev) => ({
                                  ...prev,
                                  type: profileInner.name,
                                  key: profileInner.key,
                                }));
                                handleClickOpen(profileInner.name, temp);
                              }}
                              sx={{
                                transform: 'rotate(45deg)',
                                cursor: 'pointer',
                              }}
                            />
                          </Mui.InputAdornment>
                        ),
                      }}
                      value={inputData[profileInner.name]}
                      fullWidth
                      theme="light"
                      rootStyle={{
                        border: '1px solid #A0A4AF',
                      }}
                      type="text"
                      // required
                      error={validationErr[profileInner.name]}
                      helperText={
                        validationErr[profileInner.name]
                          ? profileInner?.errMsg
                          : ''
                      }
                    />
                  ))}
                </>
              );
            }
            return (
              <Input
                name={profile.name}
                label={profile.label}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={reValidate}
                onChange={(e) => inputFieldHandler(e, profile.name)}
                value={inputData[profile.name]?.toUpperCase()}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                type="text"
                // required
                error={validationErr[profile.name]}
                helperText={validationErr[profile.name] ? profile?.errMsg : ''}
              />
            );
          })}
          <Mui.Typography>Bank Details</Mui.Typography>
          {BANK_DETAILS.map((profile) => (
            <Input
              name={profile.name}
              label={profile.label}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={reValidate}
              onChange={(e) => inputFieldHandler(e, profile.name)}
              value={inputData[profile.name]?.toUpperCase()}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type="text"
              // required
              error={validationErr[profile.name]}
              helperText={validationErr[profile.name] ? profile?.errMsg : ''}
            />
          ))}
        </>
        <Mui.Box textAlign="center">
          <Mui.Button
            style={btnCssOutContained}
            onClick={() => submitForm()}
            variant="contained"
          >
            Confirm Details
          </Mui.Button>
        </Mui.Box>
      </Mui.Stack>
      <Mui.Dialog
        open={toggleModal.open}
        onClose={handleClose}
        classes={{ paper: classes.paper }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Mui.DialogTitle id="alert-dialog-title">
          {toggleModal?.profile?.label}
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.DialogContentText id="alert-dialog-description">
            {toggleModal?.profile?.label === 'Business Sub-Category' &&
              MODAL_TYPE['Business Sub-Category']?.length === 0 && (
                <h4 style={{ margin: '0 20%', color: '#EA0000' }}>
                  Select Business Category
                </h4>
              )}
            <FormControl component="fieldset">
              <RadioGroup
                column
                aria-label="position"
                name="position"
                value={
                  toggleModal?.profile?.label
                    ? inputData[toggleModal.profile.name]
                    : ''
                }
              >
                {toggleModal?.profile?.label &&
                  MODAL_TYPE[toggleModal.profile.label].map((option) => (
                    <FormControlLabel
                      value={option.name}
                      control={
                        <CustomRadio
                          onClick={() => {
                            setInputData((prev) => {
                              return {
                                ...prev,
                                [toggleModal.profile.name]: option.name,
                              };
                            });
                            setToggleModal((prev) => ({
                              ...prev,
                              open: false,
                            }));
                          }}
                        />
                      }
                      label={
                        <p
                          style={{
                            textTransform:
                              toggleModal?.profile?.label ===
                              'Business Sub-Category'
                                ? 'capitalize'
                                : 'none',
                          }}
                        >
                          {' '}
                          {option.label}
                        </p>
                      }
                    />
                  ))}
              </RadioGroup>
            </FormControl>
          </Mui.DialogContentText>
        </Mui.DialogContent>
      </Mui.Dialog>
      <Dialog
        fullScreen
        open={open.dialog}
        onClose={handleClose1}
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
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose1}
                aria-label="close"
                textAlign="right"
              >
                <CloseIcon />
              </IconButton>
            </Mui.Box>
            <Mui.Box
              style={{
                display: 'flex',
                flexFlow: 'column nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
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
                  funCall={(e) => syncNow(e)}
                  fromCompany
                  acceptType="image/png, image/jpeg, application/pdf, .xlsx"
                />
              </Mui.Button>
            </Mui.Box>
          </>
        )}
      </Dialog>
      <Mui.Dialog
        open={openModel}
        onClose={() => setOpenModel(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Mui.DialogTitle id="alert-dialog-title">
          Razorpay Verification
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.DialogContentText id="alert-dialog-description">
            Confirm to Register Razorpay&#39;s system?
          </Mui.DialogContentText>
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Mui.Box
              sx={{
                width: '380px',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Mui.Button
                style={btnCssOutOutlined}
                onClick={() => {
                  setOpenModel(false);
                  navigate('/settings-otherPaymentOptions');
                }}
              >
                No
              </Mui.Button>
              <Mui.Button
                style={btnCssOutContained}
                sx={{ width: '25% !important' }}
                onClick={() => clickHandler()}
              >
                Confirm
              </Mui.Button>
            </Mui.Box>
          </Mui.Box>
        </Mui.DialogActions>
      </Mui.Dialog>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default RazorPayMerchant;
