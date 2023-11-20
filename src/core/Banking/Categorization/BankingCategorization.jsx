/* eslint-disable no-use-before-define */

import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import AppContext from '@root/AppContext.jsx';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import PageTitle from '@core/DashboardView/PageTitle';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';
import { LicenseInfo } from '@mui/x-license-pro';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Slide from '@mui/material/Slide';
import Loader from '@components/ProcessLoading';
import * as css from './categorization.scss';
import './MuiAddonStyles.css';
import { typesettings } from './BankCategorization/TransactionTypeSettings';
import { CategorizationTemplate } from './BankCategorization/BankCategorization_Template';
import { DropDowns } from './BankCategorization/DropDownOptions';
import { getTemplate } from './BankCategorization/GetCategorizationTemplate';
import { checkEntriesbeforeUpdate } from './BankCategorization/CheckAndUpdateEntries';
import {
  nextCategorization,
  prevCategorization,
} from './BankCategorization/BankCategorization_Navigation';
import { MainTemplateGeneration } from './BankCategorization/BankCategorization_Header_Footer_Template';
import {
  fetchunsettledBills,
  addAdvance,
  getContraBanks,
  getEditableData,
} from './BankCategorization/BankCategorization_getData';
import { SetAdvanceTotalandScreenAdjustments } from './BankCategorization/BankCategorization_Screen_Value_Adjustments';
import {
  showadvancedeactive,
  showadvance,
} from './BankCategorization/BankCategorization_Calculate_Advance';
import { RowUpdate } from './BankCategorization/BankCategorization_RowUpdate';
import { ClickUpdate } from './BankCategorization/BankCategorization_Click_Update';
import {
  changeCollapse,
  handleScroll,
  autofillselections,
} from './BankCategorization/BankCategorization_Handle_Collapse_AutoFill';
import { updateResidueRows } from './BankCategorization/BankCategorization_Residue_Update';
// Used for any usage of mouse clicks like clicking on another row from the row/col entry and update the data
import { TowardsSelect } from './BankCategorization/BankCategorization_Towards_Select';
import { taxCalculate } from './BankCategorization/BankCategorization_TaxCalculate';
import {
  catcheck,
  confirmcleardata,
} from './BankCategorization/BankCategorization_Navigation_Data_Utilities';
import { displayTowardsdropdown } from './BankCategorization/BankCategorization_Towards';
import { LayoutSet } from './BankCategorization/BankCategorization_Layoutset';
import {
  EditDataUpdate,
  EditDataUpdate_next,
  DataandTemplateset,
} from './BankCategorization/BankCategorization_EditData_Update';
import {
  domupdate,
  NarrationGet,
  uploadfields,
  uploadfields_mobile,
  DomReplacement,
  IncomeCategorySelectt,
  TowardsTag,
  FileUploadProcess,
} from './BankCategorization/BankCategorization_CustomFunctions';
import { MainTemplateCollections } from './BankCategorization/BankCategorization_MainTemplateCollections';
import { showPlaceholder } from './BankDetails/NumberConvertor';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

LicenseInfo.setLicenseKey(
  'e8185c84beb4956b5b6eb26765b7b0a1Tz01NDk0NixFPTE3MDA5MDAyNzQwNDQsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);
let defaultTransactionType = '';
let tdefaultTransactionType = '';
const updatedColumn = { key: '', value: '' };
let selectedData = {};
let changedTDSvalues = {};
changedTDSvalues = {};
let editableTDSvalues = {};
editableTDSvalues = {};
let editableAdjustmentvalues = {};
let taxamountexcluded = false;
let doonly = 0;
let doonlynotes = 0;
let doonlyi = 0;
let doonlycat = 0;
let rupdate = 0;
const enterednotes = {};
const maxTDSPercentage = 10;
let selectedItem = {};
let updatelinecounter = 0;
let modifycount = 0;
let catMoveStatus = 0;
let totalfieldlist = [];
let advancefieldlist = [];
let showtotalfieldlist = {};
let showadvancefieldlist = {};
let widthcalculatefields = [];
let opModal = false;
let ucheckedids = {};
let enteredforCard = {};
const mobilereduce = 90;
let paidto = {};
let mnTransactionType = '';
let alertdisplaymessage = '';
let alertwarning = '';
let resettemplate = false;
let clickedforallfill = false;
let alternatekeys = [];
const selectDescription = 'Click to Select';
let changedTransactions = {};
let selectedCategorizationType = '';
let categorized = {};
categorized = {};
let specialtotallinghelper = {};
let considerAmountField = '';
let documentnumberfield = '';
let modifiedRowIDS = [];
let itemdrawerClickStatus = {};
let selectedPurposeName = selectDescription;
let buttontext1 = 'Yes';
let buttontext2 = 'No';
let totalarr = [];
let paytitle1 = '';
let paytitle2 = '';
const collapsetimer = null;
let collapserequired = false;
let totalrequired = false;
let advancerequired = false;
let addtransaction = true;
let revisedDocumentType = '';
let paidvalue = '';
let collapseprocess = false;
let hidetds = true;
let accountnamefield = '';
let specialTotal = false;
let mainclear = false;
let changedTowards = {};
let anothercategorization = false;
let isrefund = false;
let closebutton = false;
let editadvancenumber = '';
let editclicked = false;
// let advancedetails = {};
let currentposition;

const checkboxDefault_desktop =
  '<div style = "z-index:1000000;margin-left:-10px;pointer-events:all;margin-top:0px;" class="MuiDataGrid-cell--withRenderer MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell"  data-colindex="0" aria-colindex="1" aria-colspan="1" tabindex="0" style="min-width: 100px; max-width: 100px; min-height: 28px; max-height: 28px;"><span class="MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary custombutton-MuiButtonBase-root-MuiCheckbox-root"  id = "selectionclickable"><input class="PrivateSwitchBase-input custombutton" type="checkbox" data-indeterminate="false"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium custombutton-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxOutlineBlankIcon"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg><span class="MuiTouchRipple-root custombutton-MuiTouchRipple-root"></span></span></div>';
const checkboxChecked_desktop =
  '<div style = "z-index:1000000;margin-left:-10px;pointer-events:all;margin-top:0px;" class="MuiDataGrid-cell--withRenderer MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell"  data-colindex="0" aria-colindex="1" aria-colspan="1" tabindex="0" style="min-width: 100px; max-width: 100px; min-height: 29px; max-height: 29px;"><span class="MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary Mui-checked custombutton-MuiButtonBase-root-MuiCheckbox-root"  id = "selectionclickable"><input class="PrivateSwitchBase-input custombutton" id="selectionofvalue_1e35ae11-ae4b-4173-a26f-ee5a007252ed" type="checkbox" data-indeterminate="false"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium custombutton-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxIcon"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg><span class="MuiTouchRipple-root custombutton-MuiTouchRipple-root"></span></span></div>';
const checkboxDefault_mobile =
  '<div style = "max-width: 20px !important;min-width: 15px !important;z-index:1000000;margin-left:-8px !important;pointer-events:all;margin-top:1px;" class="MuiDataGrid-cell--withRenderer MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell"  data-colindex="0" aria-colindex="1" aria-colspan="1" tabindex="0" style="min-width: 100px; max-width: 100px; min-height: 28px; max-height: 28px;"><span class="MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary custombutton-MuiButtonBase-root-MuiCheckbox-root" id = "selectionclickable"><input class="PrivateSwitchBase-input custombutton" type="checkbox" data-indeterminate="false"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium custombutton-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxOutlineBlankIcon"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg><span class="MuiTouchRipple-root custombutton-MuiTouchRipple-root"></span></span></div>';
const checkboxChecked_mobile =
  '<div style = "max-width: 20px !important;min-width: 15px !important;z-index:1000000;margin-left:-8px !important;pointer-events:all;margin-top:1px;" class="MuiDataGrid-cell--withRenderer MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell"  data-colindex="0" aria-colindex="1" aria-colspan="1" tabindex="0" style="min-width: 100px; max-width: 100px; min-height: 29px; max-height: 29px;"><span class="MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary Mui-checked custombutton-MuiButtonBase-root-MuiCheckbox-root" id = "selectionclickable"><input class="PrivateSwitchBase-input custombutton" style = "color:#F08B32" id="selectionofvalue_1e35ae11-ae4b-4173-a26f-ee5a007252ed" type="checkbox" data-indeterminate="false"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium custombutton-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxIcon"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg><span class="MuiTouchRipple-root custombutton-MuiTouchRipple-root"></span></span></div>';

const advancecheckboxChecked_desktop =
  '<div style = "z-index:1000000;margin-left:-10px;pointer-events:all;margin-top:0px;" class="MuiDataGrid-cell--withRenderer MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell" data-field="selection" data-colindex="0" aria-colindex="1" aria-colspan="1" tabindex="0" style="min-width: 100px; max-width: 100px; min-height: 29px; max-height: 29px;"><span class="MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary Mui-checked custombutton-MuiButtonBase-root-MuiCheckbox-root"  id = "advanceselectionclickable"><input class="PrivateSwitchBase-input custombutton" id="selectionofvalue_1e35ae11-ae4b-4173-a26f-ee5a007252ed" type="checkbox" data-indeterminate="false"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium custombutton-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxIcon"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg><span class="MuiTouchRipple-root custombutton-MuiTouchRipple-root"></span></span></div>';
const advancecheckboxChecked_mobile =
  '<div style = "z-index:1000000;margin-left:-10px;pointer-events:all;margin-top:0px;" class="MuiDataGrid-cell--withRenderer MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell" data-field="selection" data-colindex="0" aria-colindex="1" aria-colspan="1" tabindex="0" style="min-width: 30px; max-width: 30px; min-height: 29px; max-height: 29px;"><span class="MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary Mui-checked custombutton-MuiButtonBase-root-MuiCheckbox-root"  id = "advanceselectionclickable"><input class="PrivateSwitchBase-input custombutton" id="selectionofvalue_1e35ae11-ae4b-4173-a26f-ee5a007252ed" type="checkbox" data-indeterminate="false"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium custombutton-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxIcon"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg><span class="MuiTouchRipple-root custombutton-MuiTouchRipple-root"></span></span></div>';

let showuploadmessage = false;

let editedresponse = null;
// let initialdisplay = true;
// let autofilledelementcount = 0;
let recentcategorizationdone = false;

const ButtonArray = [
  'All Parties',
  'Customer',
  'Vendor',
  'Employee',
  'Lender',
  'Promoter',
  'Government',
  'Other Banks',
];
const ButtonBackColor = {
  customer: { bgcolor: 'rgba(32, 201, 172, 0.1)', color: '#20C9AC' },
  vendor: { bgcolor: 'rgba(0, 165, 255, 0.1)', color: '#00A5FF' },
  employee: { bgcolor: 'rgba(255, 160, 67, 0.1)', color: '#00A5FF' },
  lender: { bgcolor: 'rgba(255, 160, 67, 0.1)', color: '#FFA043' },
  promoter: { bgcolor: 'rgba(252, 52, 0, 0.1)', color: '#FC3400' },
  government: { bgcolor: 'rgba(132, 129, 138, 0.1)', color: '#2E2C34' },
  'other banks': { bgcolor: 'rgba(182, 180, 186, 0.1)', color: '#84818A' },
};
const cButtonArray = [
  'Customer',
  'Vendor',
  'Employee',
  'Lender',
  'Promoter',
  'Government',
  'Other Banks',
];
const taxidentification = [
  { name: 'Goods and Services Tax (GST)', tag: 'gst' },
  { name: 'Tax Deducted at source (TDS)', tag: 'tds' },
];
let modifieddetails = false;

const Categorization = () => {
  const { organization, user, openSnackBar,openPanelContext } = React.useContext(AppContext);
  const navigate = useNavigate();
  const device = localStorage.getItem('device_detect');
  const location = useLocation();
  const [showLoader, setshowLoader] = useState(0);
  const [advancedetails,setAdvanceDetails] = useState({});
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const [pickerType, setPickerType] = useState(
    window.innerWidth < 600 ? 'mobile' : 'desktop'
  );
  const mainElementCategorize = useRef();
  const gridElement = useRef();
  const [GridHeight, setGridHeight] = useState(0);
  const [gridSize, setGridSize] = useState(200);
  const [tdsdefaultvalue, settdsdefaultvalue] = useState(0);
  const [currentPage, setcurrentPage] = useState(-2);
  const [categorizeData, setcategorizeData] = useState({ data: [] });
  const [BottomSheetNumber, setBottomSheetNumber] = useState(false);
  const disptype = 'Others';

  const [dispType, setdispType] = useState(disptype);

  const [selectedTowardsName, setselectedTowardsName] = useState({
    name: selectDescription,
    id: 'categorizationInitial',
  });

  const [paidTo, setpaidTo] = useState({
    name: selectDescription,
    id: 'categorizationInitial',
  });
  const [templatecolumns, setTemplateColumns] = useState({
    transactionColumnsDesktop: [],
    transactionColumnsMobile: [],
  });
  const [template, setTemplate] = useState({});
  const noTransactionMessage = 'No Transactions for this period.';
  const noTransactionElement = (
    <Stack className={css.noRowsMessage}>{noTransactionMessage}</Stack>
  );
  const noTransactionElementOverall = (
    <Stack className={css.noRowsMessageOverall}>{noTransactionMessage}</Stack>
  );

  const [updateEditedColumn, setupdateEditedColumn] = useState(false);
  const [TDS, setTDS] = useState(tdsdefaultvalue);
  const [updatebasedata, setupdatebasedata] = useState(false);
  const [rowHeight, setRowHeight] = useState(62);
  const [temppos, setTempPos] = useState(0);
  currentposition = localStorage.getItem('pagestart');
  const [lineUpdate, setlineUpdate] = useState(false);
  const maxupdatelinecounter = 3;
  const [pagination, setPagination] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [updateCheckSelections, setupdateCheckSelections] = useState(false);
  const [updateNotes, setupdateNotes] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [ModifiedRowIDS, setModifiedRowIDS] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [triggerRowModification, settriggerRowModification] = useState(true);
  const [triggerRowModificationCardRow, settriggerRowModificationCardRow] =
    useState(true);

  const [AlertOpen, setAlertOpen] = useState(false);
  const [classforpercentage, setclassforpercentage] =
    useState('percentagehidden');
  const [updatetemplate, setUpdateTemplate] = useState(Math.random());
  const [updateincometemplate, setUpdateIncomeTemplate] = useState(
    Math.random()
  );
  const [updateexpensetemplate, setUpdateExpenseTemplate] = useState(
    Math.random()
  );

  const [selectedIncomeCategoryName, setselectedIncomeCategoryName] = useState({
    name: selectDescription,
    id: 'categorizationInitial',
  });
  const [Template1, setTemplate1] = useState('');
  const [Template2, setTemplate2] = useState('');
  const [Template3, setTemplate3] = useState('');
  const [Template4, setTemplate4] = useState('');
  const [Template5, setTemplate5] = useState('');
  const [Template6, setTemplate6] = useState('');

  const [SelectedIncomeCategory, setSelectedIncomeCategory] = useState(true);
  const [SelectedTowards, setSelectedTowards] = useState(true);
  const [catbuttonheight, setCatButtonHeight] = useState(0);
  selectedCategorizationType = location.state.selectedtype;
  const [hitTop, setHitTop] = useState(true);
  const [hitBottom, setHitBottom] = useState(true);
  const [Narration, setNarration] = useState('');
  const [clickedID, setclickedID] = useState('');
  const [clickedProcess, setclickedProcess] = useState(false);
  const [NarrationElement, setNarrationElement] = useState(false);
  const [buttonInProcess, setbuttonInProcess] = useState(true);
  const [purposeDetails, setpurposeDetails] = useState([]);
  const [mainTransactionType, setMainTransactionType] =
    useState(selectDescription);

  const [showAdvance, setshowAdvance] = useState(false);

  const [multipleAutoFill, setmultipleAutoFill] = useState(false);
  const [advancevoucher, setadvancevoucher] = useState('');
  const [totalallocatedtext, settotalallocatedtext] = useState('');
  const [totalallocatedbills, settotalallocatedbills] = useState('');
  const [totalallocated, settotalallocated] = useState(0);
  const billloadheading = 'no';
  const fileuploadinputRef = useRef(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [UploadText, setUploadText] = React.useState('');
  const [fileuploaded, setfileuploaded] = React.useState({});
  const [hideTDS, sethideTDS] = useState(true);
  const [contraBanks, setcontraBanks] = useState([]);
  const [triggerContraBanks, settriggerContraBanks] = useState(false);
  const [inittowards, setinittowards] = useState(false);
  const [residueUpdated, setresidueUpdated] = useState(false);
  const [recalculate, setRecalculate] = useState(false);
  const [TriggerClickItem, setTriggerClickItem] = useState(false);
  const [paycheck, setPayCheck] = useState('');
  const [vreference, setVReference] = useState('');
  const [resetnarration, setResetNarration] = useState(false);
  const [initthis, setinitthis] = useState(0);
  const [editaddstatus, seteditaddstatus] = useState(false);
  const [categorizationDone, setcategorizationDone] = useState(false);
  const [templateName, settemplateName] = useState('');

  //    let editstate = false;
  //    if (location.state.status === "Edit"){
  //        editstate = true;
  //    }
  const [isedit, setisedit] = useState(false);
  // const [resettodefault,setresettodefault] = useState(0);

  defaultTransactionType =
    location.state.alldata.data[
      `${
        typeof currentposition === 'undefined' ||
        location.state.alldata.data.length < currentposition
          ? location.state.row
          : currentposition
      }`
    ]?.amount > 0
      ? 'Receipt'
      : 'Payment';
  tdefaultTransactionType =
    location.state.alldata.data[
      `${
        typeof currentposition === 'undefined' ||
        location.state.alldata.data.length < currentposition
          ? location.state.row
          : currentposition
      }`
    ]?.amount > 0
      ? 'Receipt'
      : 'Payment';
  const StringtoNumber = (value) => {
    let derivedval = String(value).split(' ')[1];
    if (!derivedval) {
      derivedval = String(value);
    }
    if (!derivedval) {
      derivedval = '0.00';
    }
    derivedval = parseFloat(derivedval.split(',').join(''));
    return derivedval;
  };

  const updateBottomSheetNumber = (value) => {
    setBottomSheetNumber(value);
  };

  const updateSelectedIncomeCategory = (value) => {
    setSelectedIncomeCategory(value);
  };

  const updateSelectedTowards = (value) => {
    setSelectedTowards(value);
  };

  const updateTemplateColumns = (value) => {
    setTemplateColumns(value);
  };

  const updateNarration = (value) => {
    setNarration(value);
  };

  const updateisrefund = (value) => {
    isrefund = value;
  };

  const updateVReference = (value) => {
    setVReference(value);
  };

  const updatespecialTotal = (value) => {
    specialTotal = value;
  };

  const updateaccountnamefield = (value) => {
    accountnamefield = value;
  };

  const updateshowuploadmessage = (value) => {
    showuploadmessage = value;
  };

  const updatePayCheck = (value) => {
    setPayCheck(value);
  };

  const updaterevisedDocumentType = (value) => {
    revisedDocumentType = value;
  };

  const updateRowHeight = (value) => {
    setRowHeight(value);
  };

  const updatePagination = (value) => {
    setPagination(value);
  };

  const updatetaxamountexcluded = (value) => {
    taxamountexcluded = value;
  };

  const updateNarrationElement = (value) => {
    setNarrationElement(value);
  };

  const updateclassforpercentage = (value) => {
    setclassforpercentage(value);
  };

  const updateaddtransaction = (value) => {
    addtransaction = value;
  };

  const updatewidthcalculatefields = (value) => {
    widthcalculatefields = value;
  };

  const updatetotalfieldlist = (value) => {
    totalfieldlist = value;
  };

  const updateadvancefieldlist = (value) => {
    advancefieldlist = value;
  };

  const updateshowadvancefieldlist = (value) => {
    showadvancefieldlist = value;
  };

  const updateconsiderAmountField = (value) => {
    considerAmountField = value;
  };

  const updatedocumentnumberfield = (value) => {
    documentnumberfield = value;
  };

  const updatetotalrequired = (value) => {
    totalrequired = value;
  };

  const updateadvancerequired = (value) => {
    advancerequired = value;
  };

  const updatepaytitle1 = (value) => {
    paytitle1 = value;
  };

  const updatepaytitle2 = (value) => {
    paytitle2 = value;
  };

  const updatealternatekeys = (value) => {
    alternatekeys = value;
  };

  const updateUploadText = (value) => {
    setUploadText(value);
  };

  const updatehidetds = (value) => {
    hidetds = value;
  };

  const updateshowtotalfieldlist = (value) => {
    showtotalfieldlist = value;
  };

  const updatecollapserequired = (value) => {
    collapserequired = value;
  };

  const updateAlertOpen = (value) => {
    setAlertOpen(value);
  };

  const updatemultipleAutoFill = (value) => {
    setmultipleAutoFill(value);
  };

  const updateopModal = (value) => {
    opModal = value;
  };

  const updateanothercategorization = (value) => {
    anothercategorization = value;
  };

  const updatealertdisplaymessage = (value) => {
    alertdisplaymessage = value;
  };

  const updatealertwarning = (value) => {
    alertwarning = value;
  };

  const updatebuttontext1 = (value) => {
    buttontext1 = value;
  };

  const updatebuttontext2 = (value) => {
    buttontext2 = value;
  };

  const updateclosebutton = (value) => {
    closebutton = value;
  };

  const updateclickedforallfill = (value) => {
    clickedforallfill = value;
  };

  const updatebuttonInProcess = (value) => {
    setbuttonInProcess(value);
  };

  const updaterecentcategorizationdone = (value) => {
    recentcategorizationdone = value;
  };

  const updatetotalarr = (value) => {
    totalarr = value;
  };

  const updateshowLoader = (value) => {
    setshowLoader(value);
  };

  const updatecategorizationDone = (value) => {
    setcategorizationDone(value);
  };

  const updateTempPos = (value) => {
    setTempPos(value);
  };

  const updateHitTop = (value) => {
    setHitTop(value);
  };

  const updateHitBottom = (value) => {
    setHitBottom(value);
  };

  const updateisedit = (value) => {
    setisedit(value);
  };

  const updatetdefaultTransactionType = (value) => {
    defaultTransactionType = value;
  };

  const updatecollapseprocess = (value) => {
    collapseprocess = value;
  };

  const updateResetNarration = (value) => {
    setResetNarration(value);
  };

  const updateinitthis = (value) => {
    setinitthis(value);
  };

  const updateselectedIncomeCategoryName = (value) => {
    setselectedIncomeCategoryName(value);
  };

  const updateTemplate = (value) => {
    setTemplate(value);
  };

  const updateupdatebasedata = (value) => {
    setupdatebasedata(value);
  };

  const updateselectedPurposeName = (value) => {
    selectedPurposeName = value;
  };

  const updatechangedTDSvalues = (value, key) => {
    changedTDSvalues[key] = value;
  };

  const updatedoonlyi = (value) => {
    doonlyi = value;
  };

  const updatedoonly = (value) => {
    doonly = value;
  };

  const updatecategorizeData = (value) => {
    setcategorizeData(value);
  };

  const updatepaidTo = (value, key) => {
    if (typeof key === 'undefined') {
      setpaidTo(value);
    } else {
      paidto[key] = value;
    }
  };

  const getpaidtoclone = () => {
    return paidto;
  };

  const updatepaidto = (value) => {
    paidto = value;
  };

  const updateeditableTDSvalues = (value, id) => {
    if (typeof id === 'undefined') {
      editableTDSvalues = {};
    } else {
      editableTDSvalues[id] = value;
    }
  };

  const updateselectedTowardsName = (value) => {
    setselectedTowardsName(value);
  };

  const updateUpdateExpenseTemplate = (value) => {
    setUpdateExpenseTemplate(value);
  };

  const updatedefaultTransactionType = (value) => {
    defaultTransactionType = value;
  };

  const updateGridSize = (value) => {
    setGridSize(value);
  };

  const updateTemplate1 = (value) => {
    setTemplate1(value);
  };

  const updateTemplate2 = (value) => {
    setTemplate2(value);
  };

  const updateTemplate3 = (value) => {
    setTemplate3(value);
  };

  const updateTemplate4 = (value) => {
    setTemplate4(value);
  };

  const updateTemplate5 = (value) => {
    setTemplate5(value);
  };

  const updateTemplate6 = (value) => {
    setTemplate6(value);
  };

  const updateTDS = (value) => {
    setTDS(value);
  };

  const updateRecalculate = (value) => {
    setRecalculate(value);
  };

  const updateadvancevoucher = (value) => {
    setadvancevoucher(value);
  };

  const updateshowAdvance = (value) => {
    setshowAdvance(value);
  };

  const updatetemplateName = (value) => {
    settemplateName(value);
  };

  const updatespecialtotallinghelper = (value) => {
    specialtotallinghelper = value;
  };

  const updateitemdrawerClickStatus = (value, id) => {
    if (typeof id === 'undefined') {
      itemdrawerClickStatus = {};
    } else {
      itemdrawerClickStatus[id] = value;
    }
  };

  const updateeditadvancenumber = (value) => {
    editadvancenumber = value;
  };

  const updateadvancedetails = (value) => {
    if (!value) {
      // advancedetails = {};
      setAdvanceDetails({});
    } else {
      // advancedetails = value;
      setAdvanceDetails(value);
    }
  };

  const updatemodifieddetails = (value) => {
    modifieddetails = value;
  };

  const updatecontraBanks = (value) => {
    setcontraBanks(value);
  };

  const updatecurrentPage = (value) => {
    setcurrentPage(value);
  };

  const updateCatButtonHeight = (value) => {
    setCatButtonHeight(value);
  };

  const getchanged = () => {
    return changedTransactions;
  };

  const updaterupdate = (value) => {
    rupdate = value;
  };

  const updateeditableAdjustmentvalues = (value, id) => {
    if (typeof id === 'undefined') {
      editableAdjustmentvalues = {};
    } else {
      editableAdjustmentvalues[id] = value;
    }
  };

  const updateditclicked = (value) => {
    editclicked = value;
  };

  const updatetotalallocated = (value) => {
    settotalallocated(value);
  };

  const updatetotalallocatedbills = (value) => {
    settotalallocatedbills(value);
  };

  const updatetotalallocatedtext = (value) => {
    settotalallocatedtext(value);
  };

  const updatechangedTransactions = (value, id, ival, idd) => {
    if (typeof idd === 'undefined') {
      if (typeof id === 'undefined') {
        changedTransactions = value;
      } else {
        changedTransactions[id] = value;
      }
    } else {
      if (!changedTransactions[id]) {
        changedTransactions[id] = {};
      }
      if (idd === 1) {
        changedTransactions[id].taxamount = ival;
      }
      if (idd === 2) {
        changedTransactions[id].adjustment = ival;
      }
      if (idd === 3) {
        changedTransactions[id].pendingAmountVal = ival;
      }
    }
  };

  const updatetriggerRowModification = (value) => {
    settriggerRowModification(value);
  };

  const updateModifiedRowIDS = (value) => {
    setModifiedRowIDS((prev) => [...prev, value]);
  };

  const updatemodifiedRowIDS = (value, key) => {
    if (key === 1) {
      modifiedRowIDS.push(value);
    }
    if (key === 2) {
      modifiedRowIDS = value;
    }
  };

  const updateselectedData = (value) => {
    selectedData = value;
  };

  const updateselectedItem = (value) => {
    selectedItem = value;
  };

  const updateupdatelinecounter = (value) => {
    updatelinecounter = value;
  };

  const updateUpdateTemplate = (value) => {
    setUpdateTemplate(value);
  };

  const updateucheckedids = (value) => {
    ucheckedids = value;
  };

  const updateTriggerClickItem = (value) => {
    setTriggerClickItem(value);
  };

  const updateeditedresponse = (value) => {
    editedresponse = value;
  };

  const updateMainTransactionType = (value) => {
    setMainTransactionType(value);
  };

  const updatepurposeDetails = (value) => {
    setpurposeDetails(value);
  };

  const updatemodifycount = (value) => {
    modifycount = value;
  };

  const updateupdateCheckSelections = (value) => {
    setupdateCheckSelections(value);
  };

  const updatecatMoveStatus = (value) => {
    catMoveStatus = value;
  };

  const updatemainclear = (value) => {
    mainclear = value;
  };

  const updatetriggerContraBanks = (value) => {
    settriggerContraBanks(value);
  };

  const updateresettemplate = (value) => {
    resettemplate = value;
  };

  const updatechangedTowards = (value) => {
    changedTowards = value;
  };

  const updatemnTransactionType = (value) => {
    mnTransactionType = value;
  };

  const updatedispType = (value) => {
    setdispType(value);
  };

  const getpaidvalue = () => {
    return paidvalue;
  };

  const updateinittowards = (value) => {
    setinittowards(value);
  };

  const updatecategorized = (value) => {
    categorized = value;
  };

  const updatefileuploaded = (value) => {
    setfileuploaded(value);
  };

  const getlocation = () => {
    return location;
  };

  const getchangedTDSvalues = () => {
    return changedTDSvalues;
  };

  const geteditableTDSvalues = () => {
    return editableTDSvalues;
  };

  const geteditableAdjustmentvalues = () => {
    return editableAdjustmentvalues;
  };

  const getchangedTransactions = () => {
    return changedTransactions;
  };

  const getitemdrawerClickStatus = () => {
    return itemdrawerClickStatus;
  };

  const updateWinWidth = (value) => {
    setWinWidth(value);
  };

  const updateGridHeight = (value) => {
    setGridHeight(value);
  };

  const updatetdsdefaultvalue = (value) => {
    settdsdefaultvalue(value);
  };

  useEffect(() => {
    if (classforpercentage === 'percentagehidden') {
      if (paidto?.type?.toLowerCase() === 'vendor') {
        sethideTDS(false);
        hidetds = false;
      } else {
        sethideTDS(true);
        hidetds = true;
      }
    } else {
      sethideTDS(false);
      hidetds = false;
    }
  }, [classforpercentage, paidTo]);

  useEffect(() => {
    setPickerType(localStorage.getItem('device_detect'));
    if (
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      )
    ) {
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      ).style.background =
        'linear-gradient(#401E01 10%,  rgb(255,255,255) 20%)';
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        ).style.borderRadius =
          '0px';
    }
    let hbottom = false;
    let htop = false;
    if (
      typeof currentposition !== 'undefined' &&
      location.state.alldata.data.length > currentposition
    ) {
      hbottom = true;
    }
    if (typeof currentposition !== 'undefined' && currentposition === 0) {
      htop = true;
    }
    setHitBottom(hbottom);
    setHitTop(htop);

    return () => {
      if (document.querySelector('.DashboardViewContainer_appHeader')) {
        document.querySelector(
          '.DashboardViewContainer_appHeader'
        ).style.display = 'flex';
      }

      if (
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        )
      ) {
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        ).style.background = 'none';
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        ).style.height = 'calc(100% - 115px)';
      }

      if (
        document.querySelector('.DashboardViewContainer_pageTitleContainer')
      ) {
        document.querySelector(
          '.DashboardViewContainer_pageTitleContainer'
        ).style.background = 'none';
      }
      if (
        document.querySelector('.DashboardViewContainer_dashboardContainer')
      ) {
        document.querySelector(
          '.DashboardViewContainer_dashboardContainer'
        ).style.background = 'none';
      }
      if (
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        )
      ) {
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        ).style.background = 'var(--colorGreyBg)';
      }
    };
  }, []);
  const changePage = (apiref, event, value) => {
    apiref.current.setPage(value - 1);
  };

  const CustomPagination = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    return (
      <Pagination
        count={pageCount}
        page={page + 1}
        key={page + 1}
        onChange={(event, value) => changePage(apiRef, event, value)}
      />
    );
  };

  useEffect(() => {
    if (rowHeight === 62) {
      if (!pagination) {
        setRowHeight(63);
      } else {
        setRowHeight(89);
      }
    } else {
      setTimeout(() => {
        if (!pagination) {
          setRowHeight(63);
        } else {
          setRowHeight(89);
        }
      }, 1000);
    }
  }, [updatebasedata]);

  useEffect(() => {
    SetAdvanceTotalandScreenAdjustments(
      mainElementCategorize,
      paycheck,
      categorizeData,
      selectedTowardsName,
      updatetotalallocated,
      updatetotalallocatedbills,
      updatetotalallocatedtext,
      revisedDocumentType,
      pickerType,
      changeCollapse,
      gridSize,
      currentPage,
      totalrequired,
      advancerequired,
      updateCatButtonHeight,
      showAdvance,
      showadvance,
      advancefieldlist,
      geteditableTDSvalues,
      alternatekeys,
      collapserequired,
      handleScroll,
      totalallocated,
      collapseprocess,
      totalfieldlist,
      addAdvance,
      paidTo,
      organization,
      user,
      updateadvancevoucher,
      updateVReference,
      updateshowLoader,
      openSnackBar,
      editadvancenumber,
      updateshowAdvance,
      updateanothercategorization,
      updateopModal,
      updatealertdisplaymessage,
      updatealertwarning,
      updatebuttontext1,
      updatebuttontext2,
      updateclosebutton,
      updateAlertOpen,
      accountnamefield,
      totalarr,
      updatetotalarr,
      advancecheckboxChecked_desktop,
      advancecheckboxChecked_mobile,
      showadvancedeactive,
      advancevoucher,
      considerAmountField,
      widthcalculatefields,
      defaultTransactionType,
      updatecollapseprocess,
      showadvancefieldlist,
      showtotalfieldlist,
      getlocation,
      documentnumberfield,
      getchangedTransactions,
      advancedetails,
      hideTDS,
      TDS,
      editedresponse,
      getitemdrawerClickStatus,
      updateitemdrawerClickStatus,
      TriggerClickItem,
      updateTriggerClickItem,
      getchanged,
      updatespecialTotal,
      editclicked
    );
  }, [
    currentPage,
    gridSize,
    categorizeData,
    winWidth,
    showAdvance,
    advancevoucher,
    localStorage.getItem('itemstatus'),
  ]);

  const handlePageChange = (d) => {
    setcurrentPage(d);
  };

  const residueUpdate = () => {
    doonlycat = 0;
    setresidueUpdated(!residueUpdated);
  };

  useEffect(() => {
    if (updateEditedColumn) {
      selectedData[updatedColumn.key] = updatedColumn.value;
      setupdateEditedColumn(false);
      residueUpdate();
    }
  }, [updateEditedColumn, selectedData]);

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      const updatedRow = RowUpdate(
        categorizeData,
        specialTotal,
        getchangedTransactions,
        updatechangedTDSvalues,
        updatechangedTransactions,
        updatetriggerRowModification,
        selectedData,
        newRow,
        selectedItem,
        getlocation,
        paidto,
        isrefund,
        geteditableAdjustmentvalues,
        considerAmountField,
        revisedDocumentType,
        getchangedTDSvalues,
        geteditableTDSvalues,
        hideTDS,
        TDS,
        mainElementCategorize,
        updateModifiedRowIDS,
        updatemodifiedRowIDS,
        modifiedRowIDS,
        updatecategorizeData,
        updateupdatelinecounter,
        updatedoonly,
        pickerType,
        updateselectedData,
        updateselectedItem
      );
      setTimeout(() => {
        setUpdateTemplate(!updatetemplate);
      }, 1000);
      return updatedRow;
    },
    [categorizeData]
  );

  useEffect(() => {
    if (clickedforallfill) {
      if (revisedDocumentType === 'TYPE1') {
        const nndata = autofillselections(
          categorizeData,
          specialTotal,
          getlocation,
          geteditableAdjustmentvalues,
          getchangedTransactions,
          updatechangedTransactions,
          isrefund,
          considerAmountField,
          paidto,
          hidetds
        );
        clickedforallfill = false;
        setcategorizeData(nndata);
      }
    }
  }, [multipleAutoFill, categorizeData]);

  const handleModalOpen = () => {
    if (localStorage.getItem('itemstatus') === 'Edit') {
      return;
    }
    if (Object.keys(changedTransactions).length > 0) {
      anothercategorization = false;
      opModal = true;
      alertdisplaymessage =
        'It will clear all the allocations. Do you want to continue?';
      alertwarning = 'Warning !!!';
      buttontext1 = 'Yes';
      buttontext2 = 'No';
      closebutton = true;
      setAlertOpen(true);
    } else {
      clickedforallfill = true;
      setmultipleAutoFill(!multipleAutoFill);
    }
  };

  useEffect(() => {
    domupdate(
      categorizeData,
      mainElementCategorize,
      pickerType,
      checkboxChecked_desktop,
      checkboxChecked_mobile,
      checkboxDefault_desktop,
      checkboxDefault_mobile,
      handleModalOpen
    );
  }, [categorizeData]);

  useEffect(() => {
    if (
      selectedItem &&
      selectedItem.length > 0 &&
      categorizeData &&
      categorizeData.data &&
      categorizeData.data.length > 0 &&
      updatelinecounter < maxupdatelinecounter
    ) {
      const filtereddata = categorizeData.data.filter((itemdata) => {
        return itemdata.id === selectedItem[0];
      });
      selectedData = { ...filtereddata[0] };
      setlineUpdate(!lineUpdate);
    }
    updatelinecounter += 1;
  }, [categorizeData, lineUpdate]);

  const TransactionSelected = (selecteditem) => {
    if (pickerType === 'mobile' && revisedDocumentType === 'TYPE1') {
      changeCollapse(
        '',
        selecteditem[0],
        mainElementCategorize,
        getitemdrawerClickStatus,
        updateitemdrawerClickStatus,
        TriggerClickItem,
        updateTriggerClickItem,
        pickerType
      );
    }
    if (selecteditem.length === 1) {
      [selectedItem] = [selecteditem];
      setlineUpdate(!lineUpdate);
      updatelinecounter = 0;
    } else if (selecteditem.length > 1) {
      [selectedItem] = [selecteditem[selecteditem.length - 1]];
      setlineUpdate(!lineUpdate);
      updatelinecounter = 0;
    }
  };

  const editTaxAmount = (eve) => {
    if (eve.value) {
      updatedColumn.key = 'taxamount';
      updatedColumn.value = String(eve.value);
      if (selectedItem && selectedItem[0]) {
        if (!changedTransactions[selectedItem[0]]) {
          changedTransactions[selectedItem[0]] = {};
        }
        let taxamount = eve.value;
        if (categorizeData && categorizeData.data) {
          categorizeData.data.forEach((cats) => {
            if (cats.id === selectedItem[0]) {
              if (
                StringtoNumber(taxamount) >
                StringtoNumber(cats[considerAmountField])
              ) {
                taxamount = StringtoNumber(cats[considerAmountField]);
              }
            }
          });
        }
        changedTransactions[selectedItem[0]].taxamount = String(taxamount);
      }
      setupdateEditedColumn(true);
    }
  };

  const editAdjustmentAmount = (eve) => {
    if (eve.value) {
      updatedColumn.key = 'adjustment';
      updatedColumn.value = String(eve.value);
      if (selectedItem && selectedItem[0]) {
        if (!changedTransactions[selectedItem[0]]) {
          changedTransactions[selectedItem[0]] = {};
        }
        changedTransactions[selectedItem[0]].adjustment = String(eve.value);
      }
      setupdateEditedColumn(true);
    }
  };

  useEffect(() => {
    if (
      categorizeData &&
      categorizeData.data &&
      doonlynotes < 1 &&
      updateNotes
    ) {
      const newdata = categorizeData.data.map((categorize) => {
        if (enterednotes[categorize.id]) {
          categorize.notes = enterednotes[categorize.id];
        } else {
          categorize.notes = '';
        }
        return categorize;
      });
      const deriveddata = { data: newdata };
      setcategorizeData(deriveddata);
      setupdateNotes(false);
      doonlynotes += 1;
    }
  }, [updateNotes, categorizeData]);

  const setfocusSelect = (event) => {
    if (event.target.value) {
      return event.target.select();
    }
    setclickedID(' ');
    return false;
  };

  const autoFillValues = (event, id) => {
    event.stopPropagation();
    if (localStorage.getItem('itemstatus') === 'Edit' && !editclicked) {
      return;
    }
    let clickproceed = false;
    if (categorizeData && categorizeData.data) {
      categorizeData.data.forEach((data) => {
        if (data.id === id && StringtoNumber(data.cash) > 0) {
          clickproceed = true;
        }
      });
    }
    if (!clickproceed) {
      if (
        changedTransactions[id] &&
        changedTransactions[id].adjustment &&
        StringtoNumber(changedTransactions[id].adjustment) <= 0
      ) {
        return;
      }
      if (!changedTransactions[id] || !changedTransactions[id].adjustment) {
        return;
      }
    }
    updateitemdrawerClickStatus(event.target.checked, id);
    changeCollapse(
      event,
      id,
      mainElementCategorize,
      getitemdrawerClickStatus,
      updateitemdrawerClickStatus,
      TriggerClickItem,
      updateTriggerClickItem,
      pickerType
    );
    setclickedID(id);
    if (changedTransactions[id]) {
      setclickedProcess(false);
    } else {
      setclickedProcess(true);
    }
  };

  const updateValue = (id, event, type) => {
    enteredforCard = { id, value: showPlaceholder(event.target.value), type };
    setclickedID('');
    settriggerRowModificationCardRow(!triggerRowModificationCardRow);
  };

  const openUpCard = (id, event, type) => {
    const adjvalue = event.target.value;
    const tamount = StringtoNumber(adjvalue);
    if (tamount > 0 && type) {
      changeCollapse(
        event,
        id,
        mainElementCategorize,
        getitemdrawerClickStatus,
        updateitemdrawerClickStatus,
        TriggerClickItem,
        updateTriggerClickItem,
        pickerType
      );
    }
  };

  useEffect(() => {
    if (selectedItem && selectedItem[0] && doonlycat < 2) {
      const brow = localStorage.getItem('pagestart');
      const bddata = location.state.alldata.data[brow];
      let vamount = bddata.amount;
      if (vamount < 0) {
        vamount *= -1;
      }
      let catsdata = categorizeData;
      Object.keys(changedTransactions).forEach((ckey) => {
        if (ckey === selectedItem[0]) {
          catsdata = updateResidueRows(
            ckey,
            changedTransactions[ckey],
            catsdata,
            categorizeData,
            getchangedTransactions,
            paidto,
            updatechangedTransactions,
            geteditableAdjustmentvalues,
            specialTotal,
            isrefund,
            considerAmountField,
            revisedDocumentType,
            hideTDS,
            TDS,
            updatetriggerRowModification,
            updatemodifiedRowIDS,
            updateModifiedRowIDS,
            getlocation,
            updatechangedTDSvalues,
            getchangedTDSvalues,
            geteditableTDSvalues,
            modifiedRowIDS,
            updateupdatelinecounter
          );
        }
      });
      setcategorizeData(catsdata);
      doonlycat += 1;
      setUpdateTemplate(!updatetemplate);
    }
  }, [residueUpdated, categorizeData]);

  const showtooltip = false;
  useEffect(() => {
    paidvalue = paidTo.id;
    paidto.id = paidTo.id;
    paidto.name = paidTo.name;
    if (paidTo.id === 'categorizationInitial') {
      selectedPurposeName = selectDescription;
    }
    changedTransactions = {};
    changedTransactions = {};
    editableTDSvalues = {};
  }, [paidTo]);

  const displayIncomeCategorydropdown = () => {
    setSelectedIncomeCategory(false);
  };

  const displayPartypopup = () => {
    if (localStorage.getItem('itemstatus') === 'Add') {
      setBottomSheetNumber(true);
    }
  };

  const handleFileUploadClick = () => {
    fileuploadinputRef.current.click();
  };

  const handleFileUploadChange = (event) => {
    FileUploadProcess(
      event,
      updateopModal,
      updateanothercategorization,
      updatealertdisplaymessage,
      updatealertwarning,
      updatebuttontext1,
      updatebuttontext2,
      updateclosebutton,
      updateAlertOpen,
      showuploadmessage,
      updatefileuploaded,
      updateUpdateTemplate.apply,
      updatetemplate
    );
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFileUpload = (handlefile) => {
    const fileObj = handlefile;
    if (!fileObj) {
      return;
    }
    if (handlefile[0].type !== 'application/pdf') {
      opModal = true;
      anothercategorization = false;
      alertdisplaymessage = 'Only PDF file format is supported.';
      alertwarning = 'Warning !!!';
      buttontext1 = '';
      buttontext2 = 'Ok';
      closebutton = true;
      setAlertOpen(true);
      return;
    }
    setfileuploaded(handlefile[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleCloseFileUploaded = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setfileuploaded({});
    setUpdateTemplate(!updatetemplate);
  };

  const expensetemplate = '';
  const uploadfield = uploadfields(
    dragActive,
    handleDrag,
    fileuploadinputRef,
    handleFileUploadChange,
    handleFileUploadClick,
    handleDrop,
    UploadText,
    fileuploaded,
    handleCloseFileUploaded
  );
  const uploadfield_mobile = uploadfields_mobile(
    dragActive,
    handleDrag,
    fileuploadinputRef,
    handleFileUploadChange,
    handleFileUploadClick,
    handleDrop,
    UploadText
  );

  const getNarration = () => {
    return NarrationGet(
      selectedPurposeName,
      pickerType,
      currentposition,
      getlocation
    );
  };

  const getselectedtowards = () => {
    let desc = '';
    if (selectedTowardsName.name === 'Others') {
      desc = selectDescription;
    } else if (selectedTowardsName.name !== 'Others') {
      if (selectedPurposeName === selectDescription) {
        desc =
          selectedPurposeName.length > 15
            ? `${selectedPurposeName.substr(0, 15)}..`
            : selectedPurposeName;
      } else {
        desc =
          selectedPurposeName.length > 14
            ? `${selectedPurposeName.substr(0, 14)}..`
            : selectedPurposeName;
      }
    }
    return desc;
  };

  const getpaidto = () => {
    let name = '';
    if (paidTo && paidTo.name && paidTo.name.length > 15) {
      if (paidto.name === selectDescription) {
        name = paidTo.name.substr(0, 14);
      } else {
        name = paidTo.name.substr(0, 15);
      }
    } else {
      name = paidTo.name;
    }
    return name;
  };

  const updateMainTemplateGeneration = (value) => {
    MainTemplateGeneration(
      value,
      selectedCategorizationType,
      pickerType,
      updateTemplate1,
      updateTemplate2,
      updateTemplate3,
      updateTemplate4,
      updateTemplate5,
      updateTemplate6,
      updatebasedata,
      updateupdatebasedata,
      updateTDS,
      tdsdefaultvalue,
      updatedoonly,
      updateRecalculate,
      displayPartypopup,
      defaultTransactionType,
      paidTo,
      getpaidto,
      getselectedtowards,
      selectedTowardsName,
      displayTowardsdropdown,
      mainElementCategorize,
      maxTDSPercentage,
      TDS,
      selectedIncomeCategoryName,
      resetnarration,
      displayIncomeCategorydropdown,
      getNarration,
      getlocation,
      currentposition,
      paidto,
      updatepurposeDetails,
      getpaidvalue,
      typesettings,
      contraBanks,
      taxidentification,
      updateSelectedTowards,
      getpaidtoclone
    );
  };

  const nextData = (event) => {
    nextCategorization(
      event,
      categorized,
      updatecategorizationDone,
      getlocation,
      selectedTowardsName,
      updatetdefaultTransactionType,
      updateHitTop,
      updateHitBottom,
      updateResetNarration,
      updateinitthis,
      updateisedit,
      updatecollapseprocess,
      updatechangedTransactions,
      updateselectedIncomeCategoryName,
      updateTempPos,
      updateTemplate,
      updateupdatebasedata,
      updateMainTemplateGeneration,
      updateselectedPurposeName,
      updatechangedTDSvalues,
      updateeditableTDSvalues,
      updatedoonlyi,
      updatedoonly,
      updatecategorizeData,
      updateclassforpercentage,
      updatepaidTo,
      updatepaidto,
      updateselectedTowardsName,
      updateUpdateExpenseTemplate,
      updatedefaultTransactionType,
      recentcategorizationdone,
      resetnarration,
      selectDescription,
      updatebasedata,
      dispType,
      updateexpensetemplate,
      updateshowLoader
    );
  };

  const prevData = (event) => {
    prevCategorization(
      event,
      categorized,
      updatecategorizationDone,
      getlocation,
      selectedTowardsName,
      updatetdefaultTransactionType,
      updateHitTop,
      updateHitBottom,
      updateResetNarration,
      updateinitthis,
      updateisedit,
      updatecollapseprocess,
      updatechangedTransactions,
      updateselectedIncomeCategoryName,
      updateTempPos,
      updateTemplate,
      updateupdatebasedata,
      updateMainTemplateGeneration,
      updateselectedPurposeName,
      updatechangedTDSvalues,
      updateeditableTDSvalues,
      updatedoonlyi,
      updatedoonly,
      updatecategorizeData,
      updateclassforpercentage,
      updatepaidTo,
      updatepaidto,
      updateselectedTowardsName,
      updateUpdateExpenseTemplate,
      updatedefaultTransactionType,
      recentcategorizationdone,
      resetnarration,
      selectDescription,
      updatebasedata,
      dispType,
      updateexpensetemplate,
      updateshowLoader
    );
  };

  const movefromExpense = (success) => {
    if (success) {
      const brow = localStorage.getItem('pagestart');
      if (brow < location.state.alldata.data.length - 1) {
        nextData('');
      } else {
        prevData('');
      }
    }
  };

  useEffect(() => {
    ClickUpdate(
      categorizeData,
      clickedID,
      geteditableAdjustmentvalues,
      pickerType,
      clickedProcess,
      specialTotal,
      mainElementCategorize,
      updateucheckedids,
      getchangedTransactions,
      updatechangedTransactions,
      getlocation,
      getchangedTDSvalues,
      ucheckedids,
      updatechangedTDSvalues,
      paidTo,
      isrefund,
      taxCalculate,
      updatetotalallocated,
      updatetotalallocatedbills,
      updatetotalallocatedtext,
      updatecategorizeData,
      updateUpdateTemplate,
      hidetds,
      TDS,
      revisedDocumentType,
      taxamountexcluded,
      selectedTowardsName,
      updatetemplate,
      recalculate,
      geteditableTDSvalues,
      updateRecalculate,
      paidto,
      editedresponse,
      considerAmountField,
      editclicked
    );
  }, [clickedID, clickedProcess, TriggerClickItem]);

  useEffect(() => {
    if (pickerType === 'mobile') {
      const newdata = { data: {} };
      newdata.data = categorizeData.data.map((data) => {
        if (data.id === enteredforCard.id) {
          if (!enteredforCard.value) {
            enteredforCard.value = '0.00';
          }
          const derivedval = StringtoNumber(enteredforCard.value);
          data[enteredforCard.type] = showPlaceholder(derivedval);
          if (derivedval === 0) {
            if (enteredforCard.type !== 'taxamount') {
              data.checked = false;
              data.modified = false;
            }
          } else {
            data.checked = true;
            data.modified = true;
          }
        }
        return data;
      });
      if (enteredforCard.type === 'taxamount') {
        changedTDSvalues[enteredforCard.id] = true;
        newdata.data = taxCalculate(
          categorizeData.data,
          TDS,
          recalculate,
          taxamountexcluded,
          getchangedTDSvalues,
          geteditableTDSvalues,
          isrefund,
          getlocation,
          hidetds,
          updateRecalculate,
          revisedDocumentType,
          paidto,
          getchangedTransactions,
          updatechangedTransactions,
          editedresponse,
          considerAmountField,
          ucheckedids
        );
      }
      setcategorizeData(newdata);
      setUpdateTemplate(!updatetemplate);
    }
  }, [triggerRowModificationCardRow]);

  const ExpenseDone = () => {
    updateanothercategorization(true);
    updateopModal(true);
    updatealertdisplaymessage('Categorization done');
    updatealertwarning('Information');
    updatebuttontext1('');
    updatebuttontext2('Ok');
    updateclosebutton(false);
    updateAlertOpen(true);
    templateset(' ');
  };

  const templateset = (Name) => {
    setTemplate(
      getTemplate(
        Name,
        paidTo,
        updateisrefund,
        updateVReference,
        updatespecialTotal,
        updateaccountnamefield,
        updateshowuploadmessage,
        updatePayCheck,
        collapsetimer,
        mainElementCategorize,
        updaterevisedDocumentType,
        updateRowHeight,
        updatePagination,
        updatetaxamountexcluded,
        updateNarrationElement,
        updateclassforpercentage,
        updateaddtransaction,
        tdefaultTransactionType,
        selectedTowardsName,
        taxCalculate,
        updatewidthcalculatefields,
        updatetotalfieldlist,
        updateadvancefieldlist,
        updateshowadvancefieldlist,
        updateconsiderAmountField,
        updatedocumentnumberfield,
        updatetotalrequired,
        updateadvancerequired,
        updatepaytitle1,
        updatepaytitle2,
        updatealternatekeys,
        updateUploadText,
        selectedIncomeCategoryName,
        resettemplate,
        TDS,
        categorizeData,
        selectedCategorizationType,
        updatehidetds,
        hidetds,
        updateTemplateColumns,
        hideTDS,
        paycheck,
        paytitle1,
        paytitle2,
        editaddstatus,
        autoFillValues,
        showtooltip,
        considerAmountField,
        geteditableTDSvalues,
        setfocusSelect,
        residueUpdate,
        editAdjustmentAmount,
        paidto,
        editTaxAmount,
        itemdrawerClickStatus,
        isrefund,
        changeCollapse,
        openUpCard,
        updateValue,
        defaultTransactionType,
        geteditableAdjustmentvalues,
        updateNarration,
        specialTotal,
        Narration,
        updateshowtotalfieldlist,
        updatecollapserequired,
        noTransactionElement,
        handlePageChange,
        TransactionSelected,
        gridElement,
        rowHeight,
        templatecolumns,
        setNarration,
        CustomPagination,
        processRowUpdate,
        GridHeight,
        catbuttonheight,
        gridSize,
        updateGridSize,
        uploadfield,
        uploadfield_mobile,
        handleScroll,
        expensetemplate,
        movefromExpense,
        billloadheading,
        updatetemplateName,
        updateTriggerClickItem,
        recalculate,
        taxamountexcluded,
        getchangedTDSvalues,
        getlocation,
        updateRecalculate,
        revisedDocumentType,
        getchangedTransactions,
        updatechangedTransactions,
        editedresponse,
        ucheckedids,
        getitemdrawerClickStatus,
        updateitemdrawerClickStatus,
        TriggerClickItem,
        pickerType,
        editclicked,
        ExpenseDone
      )
    );
  };

  useEffect(() => {
    if (revisedDocumentType === 'TYPE2' && rupdate < 3 && vreference) {
      EditDataUpdate(
        getlocation,
        editedresponse,
        modifieddetails,
        updatecategorizeData,
        considerAmountField,
        vreference,
        addtransaction,
        taxamountexcluded,
        updaterupdate,
        rupdate,
        taxCalculate,
        TDS,
        recalculate,
        getchangedTDSvalues,
        geteditableTDSvalues,
        isrefund,
        updateRecalculate,
        hidetds,
        revisedDocumentType,
        paidto,
        getchangedTransactions,
        updatechangedTransactions,
        ucheckedids
      );
      rupdate += 1;
      if (
        selectedTowardsName.etype &&
        selectedTowardsName.etype.toUpperCase() === 'OTHER BANKS' &&
        editclicked &&
        localStorage.getItem('itemstatus') === 'Edit'
      ) {
        templateset('OTHER BANKS');
      }
    }
  }, [vreference, categorizeData]);

  useEffect(() => {
    if (
      localStorage.getItem('itemstatus') === 'Edit' &&
      (revisedDocumentType.toUpperCase() === 'TYPE2' ||
        revisedDocumentType.toUpperCase() === 'TYPE1')
    ) {
      setTimeout(() => {
        updateNarration(editedresponse.categorization_narration);
        if (
          mainElementCategorize &&
          mainElementCategorize.current &&
          mainElementCategorize.current.querySelector(
            '.categorization_textEntry'
          )
        ) {
          mainElementCategorize.current
            .querySelector('.categorization_textEntry')
            .querySelector('textarea').innerHTML =
            editedresponse.categorization_narration;
        }
      }, 2000);
    }
    if (
      revisedDocumentType.toUpperCase() === 'TYPE2' &&
      localStorage.getItem('itemstatus') === 'Add'
    ) {
      if (doonlyi < 1) {
        if (
          categorizeData &&
          categorizeData.data &&
          categorizeData.data.length
        ) {
          EditDataUpdate_next(
            categorizeData,
            advancevoucher,
            TDS,
            recalculate,
            taxamountexcluded,
            getchangedTDSvalues,
            geteditableTDSvalues,
            isrefund,
            getlocation,
            hidetds,
            updateRecalculate,
            revisedDocumentType,
            paidto,
            getchangedTransactions,
            updatechangedTransactions,
            editedresponse,
            considerAmountField,
            ucheckedids,
            updateNarration,
            mainElementCategorize,
            updateeditableTDSvalues,
            updatecategorizeData,
            taxCalculate,
            modifieddetails
          );
          doonlyi += 1;
        }
      }
    }
    if (
      selectedTowardsName.etype &&
      selectedTowardsName.etype.toUpperCase() === 'OTHER BANKS' &&
      editclicked &&
      localStorage.getItem('itemstatus') === 'Edit'
    ) {
      templateset('OTHER BANKS');
    }
  }, [advancevoucher, categorizeData, TDS]);

  useEffect(() => {
    if (dispType !== 'Income' && dispType !== 'Expenses') {
      setTemplate(Math.random());
      if (
        selectedTowardsName.etype &&
        selectedTowardsName.etype.toUpperCase() === 'OTHER BANKS'
      ) {
        contraBanks.forEach((bank) => {
          if (bank.id === selectedTowardsName.id) {
            setTimeout(() => {
              templateset('OTHER BANKS');
            }, 1500);
          }
        });
      } else {
        location.state.masterslist.towards.data.forEach((toward) => {
          if (toward.id === selectedTowardsName.id) {
            templateset(selectedPurposeName);
          }
        });
      }
    } else {
      if (dispType === 'Expenses') {
        templateset('Expense');
      }
      if (dispType === 'Income') {
        templateset('Income');
      }
      if (!dispType) {
        templateset(' ');
      }
    }
  }, [updatetemplate, dispType, contraBanks, TDS]);

  useEffect(() => {
    if (dispType !== 'Expenses' && dispType !== 'Income') {
      if (
        selectedTowardsName.etype &&
        selectedTowardsName.etype.toUpperCase() === 'OTHER BANKS'
      ) {
        contraBanks.forEach((bank) => {
          if (bank.id === selectedTowardsName.id) {
            templateset(selectedPurposeName);
          }
        });
      } else {
        location.state.masterslist.towards.data.forEach((toward) => {
          if (toward.id === selectedTowardsName.id) {
            templateset(selectedPurposeName);
          }
        });
      }
    }
  }, [categorizeData, contraBanks]);

  const domReplacement = () => {
    DomReplacement(mainElementCategorize);
  };

  const editCategorization = () => {
    editclicked = false;
    seteditaddstatus(false);
    editclicked = true;
    seteditaddstatus(true);
    fetchunsettledBills(
      false,
      paidTo,
      selectedPurposeName,
      updaterevisedDocumentType,
      templateName,
      tdefaultTransactionType,
      updateshowLoader,
      updatecategorizeData,
      editclicked,
      updatemodifieddetails,
      organization,
      user,
      updateadvancevoucher,
      updateVReference,
      updateshowAdvance,
      showadvancedeactive,
      editedresponse,
      updateeditadvancenumber,
      revisedDocumentType,
      updateitemdrawerClickStatus,
      getchangedTransactions,
      updatechangedTransactions,
      taxamountexcluded,
      updateeditableTDSvalues,
      updateadvancedetails,
      specialTotal,
      updatespecialTotal,
      domReplacement,
      updatecurrentPage,
      updateCatButtonHeight,
      editadvancenumber,
      taxCalculate,
      categorizeData,
      hidetds,
      paidto,
      updateaddtransaction,
      updaterupdate,
      selectedTowardsName,
      openSnackBar,
      updatedoonlyi,
      updatedoonly,
      updatecollapseprocess,
      considerAmountField,
      geteditableTDSvalues,
      getchangedTDSvalues,
      isrefund,
      updateeditableAdjustmentvalues,
      updatechangedTDSvalues,
      TDS,
      updatespecialtotallinghelper,
      autofillselections,
      updatebasedata,
      updateupdatebasedata,
      dispType,
      contraBanks,
      updateTemplate,
      updateisrefund,
      updateaccountnamefield,
      updateshowuploadmessage,
      updatePayCheck,
      collapsetimer,
      mainElementCategorize,
      updateRowHeight,
      updatePagination,
      updatetaxamountexcluded,
      updateNarrationElement,
      updateclassforpercentage,
      updatewidthcalculatefields,
      updatetotalfieldlist,
      updateadvancefieldlist,
      updateshowadvancefieldlist,
      updateconsiderAmountField,
      updatedocumentnumberfield,
      updatetotalrequired,
      updateadvancerequired,
      updatepaytitle1,
      updatepaytitle2,
      updatealternatekeys,
      updateUploadText,
      selectedIncomeCategoryName,
      resettemplate,
      selectedCategorizationType,
      updatehidetds,
      updateTemplateColumns,
      hideTDS,
      paycheck,
      paytitle1,
      paytitle2,
      editaddstatus,
      autoFillValues,
      showtooltip,
      setfocusSelect,
      residueUpdate,
      editAdjustmentAmount,
      editTaxAmount,
      changeCollapse,
      openUpCard,
      updateValue,
      defaultTransactionType,
      geteditableAdjustmentvalues,
      updateNarration,
      Narration,
      updateshowtotalfieldlist,
      updatecollapserequired,
      noTransactionElement,
      handlePageChange,
      TransactionSelected,
      gridElement,
      rowHeight,
      templatecolumns,
      CustomPagination,
      processRowUpdate,
      GridHeight,
      gridSize,
      updateGridSize,
      uploadfield,
      uploadfield_mobile,
      handleScroll,
      expensetemplate,
      movefromExpense,
      billloadheading,
      specialtotallinghelper,
      getitemdrawerClickStatus,
      catbuttonheight,
      getlocation,
      updateinitthis,
      advancedetails,
      updateditclicked,
      pickerType,
      recalculate,
      updateRecalculate,
      ucheckedids
    );
  };

  useEffect(() => {
    if (
      selectedIncomeCategoryName.id !== 'categorizationInitial' &&
      selectedIncomeCategoryName.id
    ) {
      if (
        selectedIncomeCategoryName &&
        selectedIncomeCategoryName.id.length > 0
      ) {
        location.state.masterslist.incomecategories.data.forEach((income) => {
          if (income.id === selectedIncomeCategoryName.id) {
            templateset('Income');
          }
        });
      }
    }
  }, [selectedIncomeCategoryName]);

  useEffect(() => {
    setTimeout(() => {
      setinitthis(Math.random());
    }, 1000);
    getContraBanks(
      organization,
      user,
      updatecontraBanks,
      openSnackBar,
      updateshowLoader
    );
  }, []);

  useEffect(() => {
    if (
      paidTo &&
      paidTo.id &&
      paidTo.id.length > 0 &&
      paidTo.id !== 'categorizationInitial' &&
      selectedTowardsName &&
      selectedTowardsName.id &&
      selectedTowardsName.id.length > 0 &&
      selectedTowardsName.id !== 'categorizationInitial'
    ) {
      if (
        selectedTowardsName.name === 'Expenses' ||
        selectedTowardsName.name === 'Income'
      ) {
        if (selectedTowardsName && selectedTowardsName.id.length > 0) {
          location.state.masterslist.towards.data.forEach((toward) => {
            if (toward.id === selectedTowardsName.id) {
              templateset(selectedPurposeName);
            }
          });
        }
      } else {
        fetchunsettledBills(
          false,
          paidTo,
          selectedPurposeName,
          updaterevisedDocumentType,
          templateName,
          tdefaultTransactionType,
          updateshowLoader,
          updatecategorizeData,
          editclicked,
          updatemodifieddetails,
          organization,
          user,
          updateadvancevoucher,
          updateVReference,
          updateshowAdvance,
          showadvancedeactive,
          editedresponse,
          updateeditadvancenumber,
          revisedDocumentType,
          updateitemdrawerClickStatus,
          getchangedTransactions,
          updatechangedTransactions,
          taxamountexcluded,
          updateeditableTDSvalues,
          updateadvancedetails,
          specialTotal,
          updatespecialTotal,
          domReplacement,
          updatecurrentPage,
          updateCatButtonHeight,
          editadvancenumber,
          taxCalculate,
          categorizeData,
          hidetds,
          paidto,
          updateaddtransaction,
          updaterupdate,
          selectedTowardsName,
          openSnackBar,
          updatedoonlyi,
          updatedoonly,
          updatecollapseprocess,
          considerAmountField,
          geteditableTDSvalues,
          getchangedTDSvalues,
          isrefund,
          updateeditableAdjustmentvalues,
          updatechangedTDSvalues,
          TDS,
          updatespecialtotallinghelper,
          autofillselections,
          updatebasedata,
          updateupdatebasedata,
          dispType,
          contraBanks,
          updateTemplate,
          updateisrefund,
          updateaccountnamefield,
          updateshowuploadmessage,
          updatePayCheck,
          collapsetimer,
          mainElementCategorize,
          updateRowHeight,
          updatePagination,
          updatetaxamountexcluded,
          updateNarrationElement,
          updateclassforpercentage,
          updatewidthcalculatefields,
          updatetotalfieldlist,
          updateadvancefieldlist,
          updateshowadvancefieldlist,
          updateconsiderAmountField,
          updatedocumentnumberfield,
          updatetotalrequired,
          updateadvancerequired,
          updatepaytitle1,
          updatepaytitle2,
          updatealternatekeys,
          updateUploadText,
          selectedIncomeCategoryName,
          resettemplate,
          selectedCategorizationType,
          updatehidetds,
          updateTemplateColumns,
          hideTDS,
          paycheck,
          paytitle1,
          paytitle2,
          editaddstatus,
          autoFillValues,
          showtooltip,
          setfocusSelect,
          residueUpdate,
          editAdjustmentAmount,
          editTaxAmount,
          changeCollapse,
          openUpCard,
          updateValue,
          defaultTransactionType,
          geteditableAdjustmentvalues,
          updateNarration,
          Narration,
          updateshowtotalfieldlist,
          updatecollapserequired,
          noTransactionElement,
          handlePageChange,
          TransactionSelected,
          gridElement,
          rowHeight,
          templatecolumns,
          CustomPagination,
          processRowUpdate,
          GridHeight,
          gridSize,
          updateGridSize,
          uploadfield,
          uploadfield_mobile,
          handleScroll,
          expensetemplate,
          movefromExpense,
          billloadheading,
          specialtotallinghelper,
          getitemdrawerClickStatus,
          catbuttonheight,
          getlocation,
          updateinitthis,
          advancedetails,
          updateditclicked,
          pickerType,
          recalculate,
          updateRecalculate,
          ucheckedids
        );
      }
    }
    if (
      mainElementCategorize &&
      mainElementCategorize.current &&
      mainElementCategorize.current.querySelector('#CategorizeMoveButtons')
    ) {
      setCatButtonHeight(
        mainElementCategorize.current.querySelector('#CategorizeMoveButtons')
          .offsetHeight
      );
    }
    if (paidTo.id === 'categorizationInitial') {
      setcategorizationDone(recentcategorizationdone);
    } else {
      setcategorizationDone(false);
    }
  }, [paidTo, selectedTowardsName]);

  useEffect(() => {
    setTemplate(Math.random());
    templateset('Income');
  }, [updateincometemplate]);

  useEffect(() => {
    setTemplate(Math.random());
    templateset('Expense');
  }, [updateexpensetemplate]);

  useLayoutEffect(() => {
    setshowLoader(0);
    LayoutSet(
      mainElementCategorize,
      updateWinWidth,
      updateGridHeight,
      pickerType,
      domReplacement,
      mobilereduce,
      catbuttonheight
    );
    return () => {
      if (document.querySelector('.DashboardViewContainer_appHeader')) {
        document.querySelector(
          '.DashboardViewContainer_appHeader'
        ).style.display = 'flex';
      }

      if (
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        )
      ) {
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        ).style.background = 'none';
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        ).style.height = 'calc(100% - 115px)';
      }

      if (
        document.querySelector('.DashboardViewContainer_pageTitleContainer')
      ) {
        document.querySelector(
          '.DashboardViewContainer_pageTitleContainer'
        ).style.background = 'none';
      }
      if (document.querySelector(".DashboardViewContainer_dashboardContainer")) {
        document.querySelector(".DashboardViewContainer_dashboardContainer").style.background = "none";
      }
      if (
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        )
      ) {
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        ).style.background =
          'var(--colorGreyBg)';
      }
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setPickerType('mobile');
    } else {
      setPickerType('desktop');
    }
  }, [winWidth]);

  useEffect(() => {
    if (mainElementCategorize && mainElementCategorize.current) {
      const topelement = mainElementCategorize.current.firstChild;
      if (mainElementCategorize.current.querySelector('#datagridbox')) {
        if (pickerType === 'desktop') {
          const netheight =
            mainElementCategorize.current.parentNode.parentNode.parentNode
              .offsetHeight -
            topelement.offsetHeight -
            mobilereduce -
            70;
          mainElementCategorize.current.querySelector(
            '#datagridbox'
          ).style.height = `${netheight}px`;
          setTimeout(() => {
            if (mainElementCategorize.current.querySelector('#datagridbox')) {
              const epos =
                mainElementCategorize.current.querySelector('#datagridbox')
                  .offsetWidth - 10;
              mainElementCategorize.current.querySelector(
                '.categorization_CategorizationNextBox'
              ).style.left = `${epos}px`;
            }
          }, 500);
        } else {
          mainElementCategorize.current.querySelector(
            '#datagridbox'
          ).style.height = `70%`;
          mainElementCategorize.current.querySelector(
            '#datagridbox'
          ).style.position = 'relative';
          mainElementCategorize.current.querySelector(
            '#datagridbox'
          ).style.float = 'left';
        }
      }
    }
  }, [pickerType, GridHeight,openPanelContext]);

  useEffect(() => {
    if (triggerContraBanks) {
      const purposedetails = [];
      contraBanks.forEach((bankdetails) => {
        purposedetails.push(bankdetails.name);
      });
      setpurposeDetails(purposedetails);
    }
  }, [triggerContraBanks, contraBanks]);

  useEffect(() => {
    if (
      mainElementCategorize &&
      mainElementCategorize.current &&
      mainElementCategorize.current.querySelector('#incomecategoryname')
    ) {
      mainElementCategorize.current.querySelector(
        '#incomecategoryname'
      ).innerHTML = selectedIncomeCategoryName.name;
    }
    setUpdateIncomeTemplate(Math.random());
  }, [selectedIncomeCategoryName]);

  useEffect(() => {
    if (
      mainElementCategorize &&
      mainElementCategorize.current &&
      mainElementCategorize.current.querySelector('#paidto')
    ) {
      if (pickerType === 'mobile') {
        if (paidTo.name === selectDescription) {
          mainElementCategorize.current.querySelector('#paidto').innerHTML =
            paidTo.name?.length > 15
              ? `${paidTo.name.substr(0, 15)}...`
              : paidTo.name;
        } else {
          mainElementCategorize.current.querySelector('#paidto').innerHTML =
            paidTo.name?.length > 14
              ? `${paidTo.name?.substr(0, 14)}...`
              : paidTo.name;
        }
      } else {
        mainElementCategorize.current.querySelector('#paidto').innerHTML =
          paidTo.name?.length > 30
            ? `${paidTo.name?.substr(0, 30)}...`
            : paidTo.name;
      }
    }
    setUpdateTemplate(Math.random());
  }, [paidTo]);

  useEffect(() => {
    TowardsTag(
      updateUpdateTemplate,
      mainElementCategorize,
      selectedPurposeName,
      pickerType
    );
  }, [selectedTowardsName, mainTransactionType, selectedPurposeName]);

  useEffect(() => {
    setUpdateExpenseTemplate(Math.random());
  }, [dispType]);

  const IncomeCategorySelect = (id) => {
    IncomeCategorySelectt(
      id,
      updateSelectedIncomeCategory,
      SelectedIncomeCategory,
      updateselectedIncomeCategoryName,
      getlocation
    );
  };

  useEffect(() => {
    if (localStorage.getItem('itemstatus') === 'Edit') {
      getEditableData(
        getlocation,
        updateshowLoader,
        updateeditedresponse,
        organization,
        user,
        currentposition,
        openSnackBar,
        updatepaidTo,
        updatepaidto,
        updateselectedPurposeName,
        updateselectedTowardsName,
        TowardsSelect,
        updatetriggerContraBanks,
        mainElementCategorize,
        updateresettemplate,
        updateSelectedTowards,
        updateUpdateTemplate,
        updatechangedTowards,
        paidTo,
        updatemnTransactionType,
        updateMainTransactionType,
        updatedispType,
        contraBanks,
        updatetemplate,
        taxidentification,
        paidto,
        defaultTransactionType,
        mobilereduce,
        pickerType,
        SelectedTowards,
        updateinittowards,
        inittowards,
        mnTransactionType,
        updateadvancevoucher,
        updateVReference,
        editadvancenumber,
        showadvance,
        updateshowAdvance,
        updateanothercategorization,
        updateopModal,
        updatealertdisplaymessage,
        updatealertwarning,
        updatebuttontext1,
        updatebuttontext2,
        updateclosebutton,
        updateAlertOpen,
        getchanged,
        updatetotalarr,
        setpaidTo,
        updatespecialTotal,
        updatemodifieddetails
      );
    }
  }, [localStorage.getItem('itemstatus'), isedit]);

  useEffect(() => {
    MainTemplateCollections(
      updatedispType,
      selectedCategorizationType,
      pickerType,
      updateTemplate1,
      updateTemplate2,
      updateTemplate3,
      updateTemplate4,
      updateTemplate5,
      updateTemplate6,
      updatebasedata,
      updateupdatebasedata,
      updateTDS,
      tdsdefaultvalue,
      updatedoonly,
      updateRecalculate,
      displayPartypopup,
      defaultTransactionType,
      paidTo,
      getpaidto,
      getselectedtowards,
      selectedTowardsName,
      displayTowardsdropdown,
      mainElementCategorize,
      maxTDSPercentage,
      TDS,
      selectedIncomeCategoryName,
      resetnarration,
      displayIncomeCategorydropdown,
      getNarration,
      getlocation,
      currentposition,
      paidto,
      updatepurposeDetails,
      getpaidvalue,
      typesettings,
      contraBanks,
      taxidentification,
      updateSelectedTowards,
      getpaidtoclone,
      disptype
    );
  }, []);

  useEffect(() => {
    if (doonly < 1 && !taxamountexcluded && recalculate) {
      DataandTemplateset(
        taxCalculate,
        TDS,
        recalculate,
        taxamountexcluded,
        getchangedTDSvalues,
        geteditableTDSvalues,
        isrefund,
        getlocation,
        hidetds,
        updateRecalculate,
        revisedDocumentType,
        paidto,
        getchangedTransactions,
        updatechangedTransactions,
        editedresponse,
        considerAmountField,
        ucheckedids,
        categorizeData,
        updateTemplate,
        updatecategorizeData,
        dispType,
        selectedTowardsName,
        contraBanks,
        templateset,
        selectedPurposeName
      );
      doonly += 1;
    } else {
      doonly = 0;
    }
  }, [TDS, categorizeData, recalculate, contraBanks]);

  const clickToSave = () => {
    checkEntriesbeforeUpdate(
      organization,
      user,
      paidTo,
      updateshowLoader,
      changedTowards,
      categorizeData,
      revisedDocumentType,
      updateAlertOpen,
      getlocation,
      updatemultipleAutoFill,
      getchangedTransactions,
      updateopModal,
      updateanothercategorization,
      updatealertdisplaymessage,
      updatealertwarning,
      updatebuttontext1,
      updatebuttontext2,
      updateclosebutton,
      updateclickedforallfill,
      updatebuttonInProcess,
      openSnackBar,
      updaterecentcategorizationdone,
      selectedTowardsName,
      Narration,
      defaultTransactionType,
      totalarr,
      updatecategorizationDone,
      considerAmountField,
      selectedPurposeName,
      isrefund,
      updatechangedTransactions,
      updatetotalarr
    );
  };

  const buttonstatus1 =
    (localStorage.getItem('itemstatus') === 'Add' && initthis) ||
    editaddstatus ? (
      <Button
        disabled
        onMouseLeave={(event) => {
          event.preventDefault();
          return false;
        }}
        onMouseEnter={(event) => {
          event.preventDefault();
          return false;
        }}
        id="categorizenow"
        onClick={clickToSave}
        className={
          dispType === 'Expenses'
            ? css.categorizedNowExpenses
            : css.categorizeNow
        }
      >
        Categorize Now
      </Button>
    ) : (
      <Box
        id="editcategoizebutton"
        className={
          dispType === 'Expenses'
            ? css.categorizedNowExpenses
            : css.categorizeNow
        }
      >
        Categorized
      </Box>
    );

  const buttonstatus2 =
    (localStorage.getItem('itemstatus') === 'Add' && initthis) ||
    editaddstatus ? (
      <div className={css.buttonband}>
        <Button
          disabled
          onMouseLeave={(event) => {
            event.preventDefault();
            return false;
          }}
          onMouseEnter={(event) => {
            event.preventDefault();
            return false;
          }}
          id="categorizenow"
          onClick={clickToSave}
          className={
            dispType === 'Expenses'
              ? css.categorizedNowExpenses
              : css.categorizeNow
          }
        >
          Categorize Now
        </Button>
      </div>
    ) : (
      <div id="editcategoizebutton" className={css.buttonband}>
        <Box
          id="categorizenow"
          className={
            dispType === 'Expenses'
              ? css.categorizedNowExpenses
              : css.categorizeNow
          }
        >
          Categorized
        </Box>
      </div>
    );

  const buttonstatus3 =
    localStorage.getItem('itemstatus') === 'Add' && initthis ? (
      <Button
        onMouseLeave={(event) => {
          event.preventDefault();
          return false;
        }}
        onMouseEnter={(event) => {
          event.preventDefault();
          return false;
        }}
        id="categorizenow"
        onClick={clickToSave}
        className={
          dispType === 'Expenses'
            ? css.categorizedNowExpenses
            : css.categorizeNow
        }
      >
        Categorize Now
      </Button>
    ) : (
      <Box
        id="editcategoizebutton"
        className={
          dispType === 'Expenses'
            ? css.categorizedNowExpenses
            : css.categorizeNow
        }
      >
        Categorized
      </Box>
    );

  const buttonstatus4 =
    localStorage.getItem('itemstatus') === 'Add' && initthis ? (
      <div className={css.buttonband}>
        <Button
          onMouseLeave={(event) => {
            event.preventDefault();
            return false;
          }}
          onMouseEnter={(event) => {
            event.preventDefault();
            return false;
          }}
          id="categorizenow"
          onClick={clickToSave}
          className={
            dispType === 'Expenses'
              ? css.categorizedNowExpenses
              : css.categorizeNow
          }
        >
          Categorize Now
        </Button>
      </div>
    ) : (
      <div id="editcategoizebutton" className={css.buttonband}>
        <Box
          className={
            dispType === 'Expenses'
              ? css.categorizedNowExpenses
              : css.categorizeNow
          }
        >
          Categorized
        </Box>
      </div>
    );
  const zvar = `${
    localStorage.getItem('itemstatus') === 'Add' && initthis
      ? 'bankCategorizationgrid'
      : 'editcategorization'
  }`;

  const buttoninprocess = buttonInProcess ? (
    <Button
      onMouseLeave={(event) => {
        event.preventDefault();
        return false;
      }}
      onMouseEnter={(event) => {
        event.preventDefault();
        return false;
      }}
      id="categorizenow"
      onClick={clickToSave}
      className={css.categorizeNow}
    >
      Categorize Now
    </Button>
  ) : (
    <Button
      disabled
      onMouseLeave={(event) => {
        event.preventDefault();
        return false;
      }}
      onMouseEnter={(event) => {
        event.preventDefault();
        return false;
      }}
      id="categorizenow"
      onClick={clickToSave}
      className={css.categorizeNow}
    >
      Categorize Now
    </Button>
  );
  const button1 = (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        sm={localStorage.getItem('itemstatus') === 'Add' && initthis ? 4.5 : 3}
        id="Categorizationgridbottom"
      >
        <div style={{ paddingLeft: '.5vw' }}>{Template4}</div>
      </Grid>
      <Grid
        style={{ paddingLeft: '2vw' }}
        item
        xs={12}
        sm={2}
        id="Categorizationgridbottom"
      >
        {Template5}
      </Grid>
      <Grid
        style={{ paddingLeft: '2vw' }}
        item
        xs={12}
        sm={2}
        id="Categorizationgridbottom"
      >
        {Template6}
      </Grid>
      <Grid
        id={zvar}
        item
        xs={12}
        className={
          localStorage.getItem('itemstatus') === 'Edit' && initthis
            ? css.editcategoizebutton
            : ''
        }
        sm={
          localStorage.getItem('itemstatus') === 'Add' && initthis ? 3.5 : 2.7
        }
        style={{ paddingRight: '10px', marginTop: '-5px' }}
      >
        {buttonInProcess ? buttonstatus3 : buttonstatus1}
      </Grid>
      {localStorage.getItem('itemstatus') === 'Edit' && initthis ? (
        <Grid
          item
          xs={12}
          className={
            localStorage.getItem('itemstatus') === 'Edit' && initthis
              ? css.editcategoizebutton
              : ''
          }
          sm={1.8}
          style={{
            paddingRight: '1.1vw',
            marginLeft: '20px',
            marginTop: '-5px',
          }}
          id="bankCategorizationgrid"
        >
          <div className={css.buttonbandedit}>
            <Button
              style={{ background: '#ffffff', color: '#F08B32' }}
              onMouseLeave={(event) => {
                event.preventDefault();
                return false;
              }}
              onMouseEnter={(event) => {
                event.preventDefault();
                return false;
              }}
              id="categorizenow"
              onClick={editCategorization}
              className={
                dispType === 'Expenses'
                  ? css.categorizedNowExpenses
                  : css.categorizeEdit
              }
            >
              Edit
            </Button>
          </div>
        </Grid>
      ) : (
        ''
      )}
    </Grid>
  );
  const button2 = (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} id="Categorizationgridbottom">
        {buttonInProcess ? buttonstatus4 : buttonstatus2}
      </Grid>
    </Grid>
  );
  const mobilecategorizebutton =
    localStorage.getItem('itemstatus') === 'Add' && initthis ? (
      buttoninprocess
    ) : (
      <div className={css.mobilebuttonbandedit}>
        <Button
          onMouseLeave={(event) => {
            event.preventDefault();
            return false;
          }}
          onMouseEnter={(event) => {
            event.preventDefault();
            return false;
          }}
          id="categorizenow"
          onClick={editCategorization}
          className={
            dispType === 'Expenses'
              ? css.categorizedNowExpenses
              : css.categorizeNow
          }
        >
          Edit
        </Button>
      </div>
    );

  return (
    <>
      <PageTitle
        title="Categorization"
        onClick={() => {
          if(location.state.from === 'categorize-txn') navigate('/banking');
          else navigate(-1);
        }}
      />
      <div
        className={
          device === 'mobile'
            ? // ? css.dashboardBodyContainerBankList
            cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
      >
        {' '}
        <div className="telement">
          <Loader showloader={showLoader} />
          <CategorizationTemplate
            hitBottom={hitBottom}
            hitTop={hitTop}
            mainElementCategorize={mainElementCategorize}
            catcheck={catcheck}
            getlocation={getlocation}
            currentposition={currentposition}
            dispType={dispType}
            classforpercentage={classforpercentage}
            Template1={Template1}
            Template2={Template2}
            Template3={Template3}
            Template4={Template4}
            Template5={Template5}
            Template6={Template6}
            selectedPurposeName={selectedPurposeName}
            categorizeData={categorizeData}
            selectedTowardsName={selectedTowardsName}
            closebutton={closebutton}
            pickerType={pickerType}
            Transition={Transition}
            opModal={opModal}
            confirmcleardata={confirmcleardata}
            alertdisplaymessage={alertdisplaymessage}
            alertwarning={alertwarning}
            buttontext1={buttontext1}
            buttontext2={buttontext2}
            AlertOpen={AlertOpen}
            pagination={pagination}
            template={template}
            button1={button1}
            button2={button2}
            temppos={temppos}
            GridHeight={GridHeight}
            paidTo={paidTo}
            noTransactionElementOverall={noTransactionElementOverall}
            NarrationElement={NarrationElement}
            taxamountexcluded={taxamountexcluded}
            categorizationDone={categorizationDone}
            revisedDocumentType={revisedDocumentType}
            selectDescription={selectDescription}
            totalallocated={totalallocated}
            totalallocatedbills={totalallocatedbills}
            totalallocatedtext={totalallocatedtext}
            initthis={initthis}
            buttonInProcess={buttonInProcess}
            mobilecategorizebutton={mobilecategorizebutton}
            updatecategorized={updatecategorized}
            updatechangedTDSvalues={updatechangedTDSvalues}
            updateeditableTDSvalues={updateeditableTDSvalues}
            updateMainTransactionType={updateMainTransactionType}
            updateselectedPurposeName={updateselectedPurposeName}
            updatepurposeDetails={updatepurposeDetails}
            updatepaidto={updatepaidto}
            updateucheckedids={updateucheckedids}
            updatetotalarr={updatetotalarr}
            updatepaidTo={updatepaidTo}
            updateselectedIncomeCategoryName={updateselectedIncomeCategoryName}
            updateTemplate={updateTemplate}
            updateupdatebasedata={updateupdatebasedata}
            updatetotalallocated={updatetotalallocated}
            updatetotalallocatedbills={updatetotalallocatedbills}
            updatetotalallocatedtext={updatetotalallocatedtext}
            updatecategorizeData={updatecategorizeData}
            updateNarration={updateNarration}
            updateResetNarration={updateResetNarration}
            updatebuttonInProcess={updatebuttonInProcess}
            updateclassforpercentage={updateclassforpercentage}
            updatefileuploaded={updatefileuploaded}
            updateeditableAdjustmentvalues={updateeditableAdjustmentvalues}
            nextData={nextData}
            prevData={prevData}
            updatechangedTransactions={updatechangedTransactions}
            updatemnTransactionType={updatemnTransactionType}
            mnTransactionType={mnTransactionType}
            updateselectedTowardsName={updateselectedTowardsName}
            updatebasedata={updatebasedata}
            resetnarration={resetnarration}
            updatecatMoveStatus={updatecatMoveStatus}
            updatemainclear={updatemainclear}
            setNarration={setNarration}
            settotalallocated={settotalallocated}
            settotalallocatedbills={settotalallocatedbills}
            settotalallocatedtext={settotalallocatedtext}
            setcategorizeData={setcategorizeData}
            mainclear={mainclear}
            anothercategorization={anothercategorization}
            updateAlertOpen={updateAlertOpen}
            updateopModal={updateopModal}
            updatemodifycount={updatemodifycount}
            paidto={paidto}
            updateupdateCheckSelections={updateupdateCheckSelections}
            specialTotal={specialTotal}
            isrefund={isrefund}
            TDS={TDS}
            catMoveStatus={catMoveStatus}
            getchangedTransactions={getchangedTransactions}
            recalculate={recalculate}
            getchangedTDSvalues={getchangedTDSvalues}
            geteditableTDSvalues={geteditableTDSvalues}
            hidetds={hidetds}
            modifycount={modifycount}
          />
          <DropDowns
            BottomSheetNumber={BottomSheetNumber}
            updateBottomSheetNumber={updateBottomSheetNumber}
            tdefaultTransactionType={tdefaultTransactionType}
            purposeDetails={purposeDetails}
            paidTo={paidTo}
            ButtonArray={ButtonArray}
            ButtonBackColor={ButtonBackColor}
            contraBanks={contraBanks}
            taxidentification={taxidentification}
            TowardsSelect={TowardsSelect}
            SelectedTowards={SelectedTowards}
            selectedPurposeName={selectedPurposeName}
            getlocation={getlocation}
            SelectedIncomeCategory={SelectedIncomeCategory}
            updateSelectedIncomeCategory={updateSelectedIncomeCategory}
            IncomeCategorySelect={IncomeCategorySelect}
            updateSelectedTowards={updateSelectedTowards}
            cButtonArray={cButtonArray}
            defaultTransactionType={defaultTransactionType}
            typesettings={typesettings}
            mobilereduce={mobilereduce}
            paidto={paidto}
            updateselectedTowardsName={updateselectedTowardsName}
            updatetemplate={updatetemplate}
            updatepaidTo={updatepaidTo}
            pickerType={pickerType}
            updateinittowards={updateinittowards}
            inittowards={inittowards}
            mnTransactionType={mnTransactionType}
            addAdvance={addAdvance}
            organization={organization}
            user={user}
            updateadvancevoucher={updateadvancevoucher}
            updateVReference={updateVReference}
            updateshowLoader={updateshowLoader}
            openSnackBar={openSnackBar}
            editadvancenumber={editadvancenumber}
            showadvance={showadvance}
            updateshowAdvance={updateshowAdvance}
            updateanothercategorization={updateanothercategorization}
            updateopModal={updateopModal}
            updatealertdisplaymessage={updatealertdisplaymessage}
            updatealertwarning={updatealertwarning}
            updatebuttontext1={updatebuttontext1}
            updatebuttontext2={updatebuttontext2}
            updateclosebutton={updateclosebutton}
            updateAlertOpen={updateAlertOpen}
            getchanged={getchanged}
            updatetotalarr={updatetotalarr}
            updatetriggerContraBanks={updatetriggerContraBanks}
            updateresettemplate={updateresettemplate}
            updatechangedTowards={updatechangedTowards}
            updatedispType={updatedispType}
            updateselectedPurposeName={updateselectedPurposeName}
            updateUpdateTemplate={updateUpdateTemplate}
            updatemnTransactionType={updatemnTransactionType}
            updateMainTransactionType={updateMainTransactionType}
            setpaidTo={setpaidTo}
            mainElementCategorize={mainElementCategorize}
            updateRecalculate={updateRecalculate}
            editedresponse={editedresponse}
            ucheckedids={ucheckedids}
            updatepurposeDetails={updatepurposeDetails}
            updatecategorizationDone={updatecategorizationDone}
            selectDescription={selectDescription}
            templateset={templateset}
            updatetotalallocated={updatetotalallocated}
            updatetotalallocatedbills={updatetotalallocatedbills}
            updatetotalallocatedtext={updatetotalallocatedtext}
            updateclassforpercentage={updateclassforpercentage}
            updatetdsdefaultvalue={updatetdsdefaultvalue}
            updatepaidto={updatepaidto}
            updatespecialTotal={updatespecialTotal}
            updatemodifieddetails={updatemodifieddetails}
            editclicked={editclicked}
          />
        </div>
      </div>
    </>
  );
};

export default Categorization;
