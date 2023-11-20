/* eslint-disable no-nested-ternary */

import * as React from 'react';
import * as Mui from '@mui/material';
import SearchIcon from '@assets/search.svg';
import AppContext from '@root/AppContext.jsx';
import { styled } from '@material-ui/core';
import CustomSearch from '@components/SearchSheet/CustomSearch.jsx';
import { InvoiceCustomer } from '@components/Invoice/EditForm.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import IconButton from '@material-ui/core/IconButton';
import InfiniteScroll from 'react-infinite-scroll-component';
import InputAdornment from '@material-ui/core/InputAdornment';
import CreateCustomerDialogNew from '@components/CreateNew/CustomerNew/CreateCustomerDialogNew';
import TeamBottomSheet from '@components/CreateNew/TeamNew/TeamBottomSheet';
import AddCategory from './AddCategory';
import * as css from './categorize.scss';
import * as cssaddon from './CommonDrawer.scss';
import AlertDialog from '../Categorization/ConfirmationDialog';
// let keyval;

const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

let opModal = false;
let alertdisplaymessage = '';
let alertwarning = '';
let selbutton = '';
let closebutton = false;

let initbutton = false;
let operation = '';

export const CommonDrawer = ({
  state,
  handleClick,
  setBottomSheetNumber,
  // setTrigger,
  purposeDetails,
  selectedOption,
  party,
  transactiontype,
  purposename,
  basetowardsdata,
  buttonarray,
  buttoncolors,
  contrabanks,
  defaultTransactionType,
  taxidentification,
  typesettings,
  stateData,
  locationName,
}) => {
  const device = localStorage.getItem('device_detect');

  // const [BottomSheetNumber, setBottomSheetNumber] = React.useState(false);
  const [addCategory, setAddCategory] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [setvalue, setValue] = React.useState('');
  const [addVcCategory, setAddVcCategory] = React.useState('');
  const [addVcCategory1, setAddVcCategory1] = React.useState('');
  const [drawer, setDrawer] = React.useState({
    edit: false,
    editVendor: false,
  });
  const [editValue, setEditValue] = React.useState({});
  const [userList, setUserList] = React.useState([]);
  const [changePurposeDetails, setchangePurposeDetails] = React.useState([]);
  const ButtonArray = buttonarray;
  const ButtonBackColor = buttoncolors;

  const addnewvendor = () => {
    setAddCategory(true);
  };

  const { organization, user, enableLoading, openSnackBar } =
    React.useContext(AppContext);
  const [txn, setTxn] = React.useState([]);

  const [selectedButton, setSelectedButton] = React.useState('');
  const [selectedPurposeButton, setSelectedPurposeButton] = React.useState('');
  const [dataLoading, setDataLoading] = React.useState(true);
  //  const [valuePurpose,setvaluePurpose] = React.useState("");
  const [AlertOpen, setAlertOpen] = React.useState(false);
  const [AddNew, setAddNew] = React.useState(false);
  const [CustomerAddNew, setCustomerAddNew] = React.useState(false);
  const [employeeAddNew, setemployeeAddNew] = React.useState(false);
  const [alreadyset, setalreadyset] = React.useState('');
  const [showteamdata, setShowTeamData] = React.useState({});
  const [editcustomerValue, seteditcustomerValue] = React.useState({});
  const [editpromoterValue, seteditpromoterValue] = React.useState({});
  const [editlenderValue, seteditlenderValue] = React.useState({});
  const [customerEdit, setcustomerEdit] = React.useState(false);
  const [lenderEdit, setlenderEdit] = React.useState(false);
  const [promoterEdit, setpromoterEdit] = React.useState(false);
  const [entitytype, setentityType] = React.useState('');
  const [PromoterAddNew, setPromoterAddNew] = React.useState(false);
  const [LenderAddNew, setLenderAddNew] = React.useState(false);
  const [LocationList, setLocationList] = React.useState();
  const [showLocation, setShowLocation] = React.useState(false);
  const selectedGovernmentParty = [
    {
      id: 'Corporate Tax',
      entityType: 'government_corporate_tax',
    },
    {
      id: 'Employee Provident fund (EPF)',
      entityType: 'government_pf',
    },
    {
      id: 'Employee state insurance scheme (ESI)',
      entityType: 'government_esi',
    },
    {
      id: 'Goods and Services Tax (GST)',
      entityType: 'government_gst',
    },
    {
      id: 'Tax Deducted at source (TDS)',
      entityType: 'government_tds',
    },
    {
      id: 'Income Tax (IT)',
      entityType: 'government_income_tax',
    },
    {
      id: 'Others',
      entityType: 'government_others',
    },
    {
      id: 'Customs Duty',
      entityType: 'government_custom_duty',
    },
    {
      id: 'Professional Tax (PT)',
      entityType: 'government_pt',
    },
  ];

  const FetchLocations = () => {
    RestApi(`organizations/${organization.orgId}/locations`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      setLocationList(res.data);
    });
  };

  const getParties = async (val, searchVal) => {
    if (!val) {
      setUserList([]);
      setDataLoading(false);
      return;
    }
    if (selectedButton && selectedButton.toUpperCase() === 'OTHER BANKS') {
      setUserList(contrabanks);
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    await RestApi(
      selectedButton && selectedButton.toLowerCase() !== 'all parties'
        ? `organizations/${
            organization.orgId
          }/entities?type[]=${selectedButton.toLowerCase()}&search=${
            searchVal || ''
          }`
        : `organizations/${organization.orgId}/entities?search=${
            searchVal || ''
          }`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        setDataLoading(false);
        if (res && !res.error && res.data) {
          setUserList(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setUserList([]);
        setDataLoading(false);
      });
  };

  const getVendors = async (allParties, searchVal) => {
    await enableLoading(true);
    await RestApi(
      !allParties
        ? `organizations/${organization.orgId}/entities?type[]=${
            state === 'receipt' ? 'customer' : 'vendor'
          }&search=${searchVal || ''}`
        : `organizations/${organization.orgId}/entities?search=${
            searchVal || ''
          }`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error && res.data) {
          setUserList(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
        enableLoading(false);
      });
    enableLoading(false);
  };

  React.useEffect(() => {
    if (selectedButton && selectedButton.toUpperCase() === 'CUSTOMER') {
      operation = 'add';
      setentityType('customer');
      setCustomerAddNew(true);
    }
    if (selectedButton && selectedButton.toUpperCase() === 'VENDOR') {
      addnewvendor();
    }
    if (selectedButton && selectedButton.toUpperCase() === 'EMPLOYEE') {
      operation = 'new';
      setemployeeAddNew(true);
    }
    if (selectedButton && selectedButton.toUpperCase() === 'LENDER') {
      operation = 'add';
      setentityType('lender');
      //  setLenderAddNew(true);
      addnewvendor();
    }
    if (selectedButton && selectedButton.toUpperCase() === 'PROMOTER') {
      operation = 'add';
      setentityType('promoter');
      //  setPromoterAddNew(true);
      addnewvendor();
    }
  }, [AddNew]);

  React.useEffect(() => {
    if (
      selectedButton &&
      selectedButton.toUpperCase() === 'OTHER BANKS' &&
      !initbutton
    ) {
      setUserList(contrabanks);
      initbutton = false;
    } else if (selectedButton) {
      const pdetail = [];
      if (
        basetowardsdata &&
        basetowardsdata.length > 0 &&
        state === 'CUSTOM POPUPS PURPOSE'
      ) {
        basetowardsdata.forEach((data) => {
          let foundanother = false;
          if (
            data?.entity_type?.toLowerCase()?.split('_')[0] !== 'government'
          ) {
            if (data.entity_type) {
              const splitvalue = data.entity_type.toUpperCase().split('_')[0];
              if (splitvalue) {
                if (
                  selectedButton &&
                  splitvalue.toUpperCase() === selectedButton.toUpperCase()
                ) {
                  foundanother = true;
                }
              }
            }
            if (
              selectedButton &&
              data.entity_type &&
              (data.entity_type.toLowerCase() ===
                selectedButton.toLowerCase() ||
                foundanother)
            ) {
              let taxselected = false;
              taxidentification.forEach((tax) => {
                if (party.name.toUpperCase() === tax.name.toUpperCase()) {
                  if (
                    data.entity_type.toUpperCase() ===
                    `${party.type.toUpperCase()}_${tax.tag.toUpperCase()}`
                  ) {
                    taxselected = true;
                    data?.purpose?.forEach((purpose) => {
                      if (
                        typesettings[party.type.toLowerCase()] &&
                        typesettings[party.type.toLowerCase()][
                          purpose.toLowerCase()
                        ] &&
                        typesettings[party.type.toLowerCase()][
                          purpose.toLowerCase()
                        ].inflow &&
                        defaultTransactionType === 'Receipt'
                      ) {
                        pdetail.push(purpose);
                      }
                      if (
                        typesettings[party.type.toLowerCase()] &&
                        typesettings[party.type.toLowerCase()][
                          purpose.toLowerCase()
                        ] &&
                        typesettings[party.type.toLowerCase()][
                          purpose.toLowerCase()
                        ].outflow &&
                        defaultTransactionType === 'Payment'
                      ) {
                        pdetail.push(purpose);
                      }
                    });
                  }
                }
              });
              if (!taxselected) {
                data?.purpose?.forEach((purpose) => {
                  if (
                    typesettings[selectedButton.toLowerCase()] &&
                    typesettings[selectedButton.toLowerCase()][
                      purpose.toLowerCase()
                    ] &&
                    typesettings[selectedButton.toLowerCase()][
                      purpose.toLowerCase()
                    ].inflow &&
                    defaultTransactionType === 'Receipt'
                  ) {
                    pdetail.push(purpose);
                  }
                  if (
                    typesettings[selectedButton.toLowerCase()] &&
                    typesettings[selectedButton.toLowerCase()][
                      purpose.toLowerCase()
                    ] &&
                    typesettings[selectedButton.toLowerCase()][
                      purpose.toLowerCase()
                    ].outflow &&
                    defaultTransactionType === 'Payment'
                  ) {
                    pdetail.push(purpose);
                  }
                });
              }
            }
            if (
              selectedButton?.toLowerCase() === 'other banks' &&
              data?.entity_type === 'other_banks'
            ) {
              data?.purpose?.forEach((purpose) => {
                if (
                  typesettings['other banks'][purpose?.toLowerCase()]?.inflow &&
                  defaultTransactionType === 'Receipt'
                ) {
                  pdetail.push(purpose);
                }
                if (
                  typesettings['other banks'][purpose.toLowerCase()]?.outflow &&
                  defaultTransactionType === 'Payment'
                ) {
                  pdetail.push(purpose);
                }
              });
            }
          } else {
            selectedGovernmentParty.forEach((ele) => {
              if (ele.id?.toLowerCase() === party?.name?.toLowerCase()) {
                if (
                  data?.entity_type?.toLowerCase() ===
                  ele?.entityType?.toLowerCase()
                ) {
                  data?.purpose?.forEach((purpose) => {
                    if (
                      typesettings[selectedButton.toLowerCase()] &&
                      typesettings[selectedButton.toLowerCase()][
                        purpose.toLowerCase()
                      ] &&
                      typesettings[selectedButton.toLowerCase()][
                        purpose.toLowerCase()
                      ].inflow &&
                      defaultTransactionType === 'Receipt'
                    ) {
                      pdetail.push(purpose);
                    }
                    if (
                      typesettings[selectedButton.toLowerCase()] &&
                      typesettings[selectedButton.toLowerCase()][
                        purpose.toLowerCase()
                      ] &&
                      typesettings[selectedButton.toLowerCase()][
                        purpose.toLowerCase()
                      ].outflow &&
                      defaultTransactionType === 'Payment'
                    ) {
                      pdetail.push(purpose);
                    }
                  });
                }
              }
            });
          }
        });
      }
      const ndatas = {};
      pdetail.forEach((pdata) => {
        if (!ndatas[pdata]) {
          ndatas[pdata] = true;
        }
      });
      setUserList([]);
      setchangePurposeDetails(Object.keys(ndatas));
      getParties(selectedButton, '');
      //        setValue(`${state}_${selectedButton}`);
      initbutton = false;
    }
  }, [selectedButton]);

  const confirmdatachange = (response) => {
    if (response.answer === 'Yes') {
      const pdetail = [];
      if (
        selbutton.toUpperCase() === 'OTHER BANKS' &&
        state === 'CUSTOM POPUPS PURPOSE'
      ) {
        initbutton = true;
        contrabanks.forEach((bank) => {
          pdetail.push(bank.name);
        });
      } else if (
        basetowardsdata &&
        basetowardsdata.length > 0 &&
        state === 'CUSTOM POPUPS PURPOSE'
      ) {
        let taxselected = false;
        basetowardsdata.forEach((data) => {
          if (
            data.entity_type &&
            data.entity_type.toLowerCase() === selbutton.toLowerCase()
          ) {
            taxidentification.forEach((tax) => {
              if (party.name.toUpperCase() === tax.name.toUpperCase()) {
                if (
                  data.entity_type.toUpperCase() ===
                  `${party.type.toUpperCase()}_${tax.tag.toUpperCase()}`
                ) {
                  taxselected = true;
                  data?.purpose?.forEach((purpose) => {
                    if (
                      typesettings[selbutton.toLowerCase()] &&
                      typesettings[selbutton.toLowerCase()][
                        purpose.toLowerCase()
                      ] &&
                      typesettings[party.type.toLowerCase()][
                        purpose.toLowerCase()
                      ].inflow &&
                      defaultTransactionType === 'Receipt'
                    ) {
                      pdetail.push(purpose);
                    }
                    if (
                      typesettings[selbutton.toLowerCase()] &&
                      typesettings[selbutton.toLowerCase()][
                        purpose.toLowerCase()
                      ] &&
                      typesettings[party.type.toLowerCase()][
                        purpose.toLowerCase()
                      ].outflow &&
                      defaultTransactionType === 'Payment'
                    ) {
                      pdetail.push(purpose);
                    }
                  });
                }
              }
            });
            if (!taxselected) {
              data?.purpose?.forEach((purpose) => {
                if (
                  typesettings[selbutton.toLowerCase()] &&
                  typesettings[selbutton.toLowerCase()][
                    purpose.toLowerCase()
                  ] &&
                  typesettings[selbutton.toLowerCase()][purpose.toLowerCase()]
                    .inflow &&
                  defaultTransactionType === 'Receipt'
                ) {
                  pdetail.push(purpose);
                }
                if (
                  typesettings[selbutton.toLowerCase()] &&
                  typesettings[selbutton.toLowerCase()][
                    purpose.toLowerCase()
                  ] &&
                  typesettings[selbutton.toLowerCase()][purpose.toLowerCase()]
                    .outflow &&
                  defaultTransactionType === 'Payment'
                ) {
                  pdetail.push(purpose);
                }
              });
            }
          }
        });
      }
      setchangePurposeDetails(pdetail);
      setSelectedButton(selbutton);
      setSelectedPurposeButton(selbutton);
      // selbutton = "";
    }
    setAlertOpen(false);
    opModal = false;
  };

  const fetchBankDetails = (prop) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/${prop}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          // setTxn(res.data.map((c) => c));
          setTxn(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        enableLoading(false);
      });
    enableLoading(false);
  };

  const getdefinedCategoriesList_Receipt = async (value1, searchVal) => {
    const categoryList = [];
    categoryList.push({
      id: 'incomecategorization',
      name: 'Income',
      short_name: 'Income',
    });
    categoryList.push({
      id: 'others',
      name: 'Receipts',
      short_name: 'Receipts',
    });
    let newdata;
    if (searchVal) {
      newdata = categoryList.filter(
        (datas) =>
          datas.name.toUpperCase().indexOf(searchVal.toUpperCase()) > -1
      );
    } else {
      newdata = categoryList;
    }
    setUserList(newdata);
  };

  const getdefinedCategoriesList_Payment = async (value1, searchVal) => {
    const categoryList = [];
    categoryList.push({
      id: 'expensecategorization',
      name: 'Expenses',
      short_name: 'Expenses',
    });
    categoryList.push({
      id: 'others',
      name: 'Payments',
      short_name: 'Payments',
    });
    let newdata;
    if (searchVal) {
      newdata = categoryList.filter(
        (datas) =>
          datas.name.toUpperCase().indexOf(searchVal.toUpperCase()) > -1
      );
    } else {
      newdata = categoryList;
    }
    setUserList(newdata);
  };

  const getBankList = async (value1, searchVal) => {
    await enableLoading(true);
    const url = `organizations/${organization.orgId}/yodlee_bank_accounts/bank_listing`;
    await RestApi(url, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error && res.data) {
          if (searchVal) {
            const newdata = res?.data.filter(
              (datas) =>
                datas.account_name
                  .toUpperCase()
                  .indexOf(searchVal.toUpperCase()) > -1
            );
            const ndata = newdata.map((datanew) => {
              datanew.name = datanew.account_name;
              datanew.short_name = datanew.account_name;
              datanew.active = true;
              return datanew;
            });
            setUserList(ndata);
          } else {
            const ndata = res.data.map((datanew) => {
              datanew.name = datanew.account_name;
              datanew.short_name = datanew.account_name;
              datanew.active = true;
              return datanew;
            });
            setUserList(ndata);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        enableLoading(false);
      });
    enableLoading(false);
  };

  React.useEffect(() => {
    if (state === 'INCOME') {
      fetchBankDetails('income_categories');
      setValue('income');
      setAddVcCategory('category');
      setAddVcCategory1('category');
    } else if (state === 'receipt') {
      getVendors();
      if (state === 'CUSTOM POPUPS') {
        setValue('payment');
        setAddVcCategory('vendor');
      } else {
        setValue('reciept');
        setAddVcCategory('customer');
      }
      // setAddVcCategory1('for Customer');
    } else if (state === 'payment') {
      getVendors();
      setValue('payment');
      setAddVcCategory('Vendor');
      // setAddVcCategory1('for Vendor');
    } else if (state === 'EXPENSE') {
      fetchBankDetails('expense_categories');
      setValue('expense');
      setAddVcCategory('category');
      setAddVcCategory1('category');
    } else if (state === 'BANKLIST') {
      getBankList(false, '');
      setValue('receipt');
      setAddVcCategory('customer');
    } else if (state === 'CATEGORYLIST_1') {
      getdefinedCategoriesList_Receipt(false, '');
      setValue('receipt');
      setAddVcCategory('customer');
    } else if (state === 'CATEGORYLIST_2') {
      getdefinedCategoriesList_Payment(false, '');
      setValue('receipt');
      setAddVcCategory('customer');
    } else if (state === 'CUSTOM POPUPS') {
      if (!alreadyset) {
        if (basetowardsdata && basetowardsdata.type) {
          // initbutton = true;
          setSelectedButton(basetowardsdata.type.toLowerCase());
        } else if (!basetowardsdata || !basetowardsdata.type) {
          if (transactiontype === 'Receipt') {
            setSelectedButton('customer');
          } else {
            setSelectedButton('vendor');
          }
        }
      }
    } else if (state === 'CUSTOM POPUPS PURPOSE') {
      initbutton = true;
      setSelectedButton(selectedOption?.toLowerCase());
      setSelectedPurposeButton(selectedOption);
      //      setvaluePurpose("");
    }
  }, [state, addCategory]);

  // const [storeProp, setstoreProp] = React.useState('');
  // const Reciept = ['Vendor 01', 'Vendor 01', 'Vendor 01', 'Vendor 01'];
  // const payment = ['category 01', 'category 01', 'category 01', 'category 01'];
  // const Income = ['category 01', 'category 01', 'category 01', 'category 01'];
  // const expense = ['category 01', 'category 01', 'category 01', 'category 01'];
  //   const customer = ['Customer 01', 'Customer 01', 'Customer 01', 'Customer 01'];

  // const mappingList = () => {
  //     setstoreProp(vendor);
  //   setBottomSheetNumber(true);
  // };
  //  const keyval=(state.Reciept===true)?Reciept:(state.payment===true)?payment:(state.Income===true)?Income:expense;

  // React.useEffect(() => {
  //   if (state.Income) {

  //     keyval = txn;
  //     setValue('income');
  //   } else if (state.Reciept) {
  //     keyval = txn;
  //   } else if (state.payment) {
  //     keyval = txn;
  //   } else {
  //     keyval = txn;
  //     setValue('expense');
  //   }
  // }, [txn]);
  const filteredUsers = query
    ? txn.filter((val) => {
        return val?.name?.toLowerCase().includes(query?.toLowerCase());
      })
    : txn;
  // const handleCloseCategory =(prop)=>{
  //   console.log("loggings,prop",prop);
  //   setAddCategory('false');
  // };
  const setAddCategory1 = (prp) => {
    if (state === 'INCOME') {
      fetchBankDetails('income_categories');
      setValue('income');
    } else if (state === 'receipt') {
      getVendors();
      setValue('reciept');
    } else if (state === 'payment') {
      getVendors();
      setValue('payment');
    } else if (state === 'EXPENSE') {
      fetchBankDetails('expense_categories');

      setValue('expense');
    } else if (state === 'BANKLIST') {
      getBankList(false, '');
      setValue('receipt');
    } else if (state === 'CATEGORYLIST_1') {
      getdefinedCategoriesList_Receipt(false, '');
      setValue('receipt');
    } else if (state === 'CATEGORYLIST_2') {
      getdefinedCategoriesList_Payment(false, '');
      setValue('receipt');
    }
    setAddCategory(prp);
  };

  const setselectedButton = (event, evalue) => {
    event.preventDefault();
    if (state === 'CUSTOM POPUPS') {
      setSelectedButton(evalue);
    }
    if (state === 'CUSTOM POPUPS PURPOSE') {
      if (party?.type?.toLowerCase() !== evalue?.toLowerCase()) {
        if (
          state === 'CUSTOM POPUPS PURPOSE' &&
          (selectedOption.toUpperCase() === 'OTHER BANKS' ||
            selectedOption.toUpperCase() === 'GOVERNMENT')
        ) {
          return;
        }
        selbutton = evalue;
        opModal = true;
        closebutton = true;
        alertdisplaymessage = (
          <Mui.Box>
            <div className={cssaddon.bodyText} style={{ marginBottom: 18 }}>
              {party.name} is registerd as a {party.type}.
            </div>
            <div className={cssaddon.bodyText} style={{ marginBottom: 22 }}>
              Would you like to add {party.name} as {selbutton} as well.
            </div>
          </Mui.Box>
        );
        alertwarning = 'Heads Up';
        setAlertOpen(true);
      } else if (party?.type?.toLowerCase() === evalue?.toLowerCase()) {
        selbutton = evalue;
        confirmdatachange({ answer: 'Yes' });
      }
    }
  };

  const getOthers = (val1, val2) => {
    if (state === 'CATEGORYLIST_1') {
      getdefinedCategoriesList_Receipt(val1, val2);
    }
    if (state === 'CATEGORYLIST_2') {
      getdefinedCategoriesList_Payment(val1, val2);
    }
    if (state === 'CUSTOM POPUPS') {
      getParties(val1, val2);
    }
  };

  const handleWithLocation = (element) => {
    if (selectedButton.toLowerCase() === 'other banks') {
      if (
        stateData?.bankDetails?.bankId === element?.bank_account_id &&
        transactiontype === 'Payment'
      ) {
        openSnackBar({
          message: "Sorry, Same account can't be selected",
          type: 'error',
        });
      } else {
        handleClick({
          name:
            element.sub_account_group === 'Cash Accounts'
              ? element.display_name
              : element.account_name,
          id: element.bank_account_id,
          type: 'OTHER BANKS',
          taxpercentage: undefined,
          provider: element.service_provider,
          providerId: element.service_provider === 'yodlee' ? element?.id : element?.bank_account_id,
        });
      }
    } else {
      handleClick({
        name: element?.name,
        id: element?.id,
        type: element?.primary_relationship,
        taxpercentage: element?.tax_percentage,
      });
    }
    setBottomSheetNumber(false);
  };

  const onTriggerDrawerForEdit = (name, element) => {
    setEditValue(element);
    if (selectedButton && selectedButton.toLowerCase() === 'vendor') {
      if (device === 'desktop') {
        setDrawer((d) => ({ ...d, [name]: true }));
      }
      if (device === 'mobile') {
        // setBottomSheetNumber(false);
        // setTrigger({ show: 'add', type: state, editValue: element });
        setDrawer((d) => ({ ...d, [name]: true }));
      }
    }
    if (selectedButton && selectedButton.toLowerCase() === 'customer') {
      seteditcustomerValue(element);
      setcustomerEdit(true);
    }
    if (selectedButton && selectedButton.toLowerCase() === 'employee') {
      setShowTeamData(element);
      operation = 'edit';
      setemployeeAddNew(true);
    }
    if (selectedButton && selectedButton.toLowerCase() === 'lender') {
      seteditlenderValue(element);
      setlenderEdit(true);
    }
    if (selectedButton && selectedButton.toLowerCase() === 'promoter') {
      seteditpromoterValue(element);
      setpromoterEdit(true);
    }
  };

  const setResults = (bval) => {
    if (bval) {
      setSelectedButton(bval);
      setValue(`${state}_${bval}`);
      setalreadyset(bval);
    }
    setAddNew(!AddNew);
  };

  const customsearch1 =
    state === 'CUSTOM POPUPS PURPOSE' ? (
      ''
    ) : (
      <CustomSearch
        showType={
          state === 'BANKLIST' ||
          state === 'CATEGORYLIST_1' ||
          state === 'CATEGORYLIST_2'
            ? state
            : `${state}_${selectedButton}`
        }
        customerList={userList}
        loading={dataLoading}
        callFunction={state !== 'BANKLIST' ? getOthers : getBankList}
        handleLocationParties={handleWithLocation}
        handleAllParties={(ps) =>
          handleClick({
            name: ps?.name,
            id: ps?.id,
            type: ps?.primary_relationship,
          })
        }
        addNewOne={(bvalue) =>
          state !== 'CUSTOM POPUPS' ? setAddCategory(true) : setResults(bvalue)
        }
        openDrawer={onTriggerDrawerForEdit}
        basetowardsdata={basetowardsdata}
        allpartiescolors={ButtonBackColor}
        selbutton={selectedButton}
        hideLocation
        option={state}
        transactiontype={transactiontype}
      />
    );

  const customsearch2 =
    state === 'CUSTOM POPUPS PURPOSE' ? (
      ''
    ) : (
      <CustomSearch
        showType={state === 'receipt' ? 'Customer' : 'Vendor'}
        customerList={userList}
        loading={dataLoading}
        callFunction={state !== 'BANKLIST' ? getVendors : getBankList}
        handleLocationParties={handleWithLocation}
        handleAllParties={(ps) =>
          handleClick({
            name: ps?.name,
            id: ps?.id,
            type: ps?.primary_relationship,
          })
        }
        addNewOne={(bvalue) =>
          state !== 'CUSTOM POPUPS' ? setAddCategory(true) : setResults(bvalue)
        }
        allpartiescolors={ButtonBackColor}
        selbutton={selectedButton}
        hideLocation
        option={state}
        transactiontype={transactiontype}
      />
    );

  const nativeSelector = (id) => {
    const elements = document.querySelectorAll(id);
    const results = [];
    for (let i = 0; i < elements.length; i += 1) {
      if (
        elements[i].hasChildNodes() &&
        elements[i].childNodes[0].nodeType === 3
      ) {
        results.push(elements[i].childNodes[0]);
      }
    }
    return results;
  };

  React.useEffect(() => {
    let textnodes = nativeSelector('.SelectBottomSheet_childContainer2');
    let _nv = '';
    for (let i = 0, len = textnodes.length; i < len; i += 1) {
      _nv = textnodes[i].nodeValue;
      textnodes[i].nodeValue = _nv.replace(/]/g, '');
    }
    textnodes = nativeSelector('.SelectBottomSheet_childContainer');
    _nv = '';
    for (let i = 0, len = textnodes.length; i < len; i += 1) {
      _nv = textnodes[i].nodeValue;
      textnodes[i].nodeValue = _nv.replace(/]/g, '');
    }
  }, [selectedPurposeButton]);

  const purposeChange = (event, value) => {
    if (value?.toLowerCase() === 'payment of gst') {
      setShowLocation(true);
      event?.preventDefault();
      return;
    }
    event.stopPropagation();
    setShowLocation(false);
    let clickeddata = {};
    if (
      selectedButton &&
      selectedButton.toUpperCase() === selectedOption.toUpperCase()
    ) {
      clickeddata = {
        name: value,
        id: '',
        type: 'Purpose',
        otype: selectedOption,
        etype: selectedButton,
      };
    } else {
      clickeddata = {
        name: value,
        id: '',
        type: 'Purpose',
        otype: selectedOption,
        etype: selectedButton,
      };
    }
    let taxselected = false;
    if (
      basetowardsdata &&
      basetowardsdata.length > 0 &&
      state === 'CUSTOM POPUPS PURPOSE'
    ) {
      basetowardsdata.forEach((sdata) => {
        let foundanother = false;
        if (sdata.entity_type) {
          const splitvalue = sdata.entity_type.toUpperCase().split('_')[0];
          if (splitvalue) {
            if (
              selectedButton &&
              splitvalue.toUpperCase() === selectedButton.toUpperCase()
            ) {
              foundanother = true;
            }
          }
        }
        if (
          sdata.entity_type &&
          (sdata.entity_type.toLowerCase() === selectedButton.toLowerCase() ||
            foundanother)
        ) {
          taxidentification.forEach((tax) => {
            if (party.name.toUpperCase() === tax.name.toUpperCase()) {
              if (
                sdata.entity_type.toUpperCase() ===
                `${party.type.toUpperCase()}_${tax.tag.toUpperCase()}`
              ) {
                taxselected = true;
                sdata?.purpose?.forEach((purpose) => {
                  if (
                    purpose.toUpperCase() === value.toUpperCase() &&
                    typesettings[party.type.toLowerCase()][
                      purpose.toLowerCase()
                    ].inflow &&
                    defaultTransactionType === 'Receipt'
                  ) {
                    clickeddata.id = sdata.id;
                  }
                  if (
                    purpose.toUpperCase() === value.toUpperCase() &&
                    typesettings[party.type.toLowerCase()][
                      purpose.toLowerCase()
                    ].outflow &&
                    defaultTransactionType === 'Payment'
                  ) {
                    clickeddata.id = sdata.id;
                  }
                });
              }
            }
          });
          if (!taxselected) {
            sdata?.purpose?.forEach((purpose) => {
              if (
                purpose.toUpperCase() === value.toUpperCase() &&
                typesettings[selbutton.toLowerCase()] &&
                typesettings[selbutton.toLowerCase()][purpose.toLowerCase()] &&
                typesettings[selbutton.toLowerCase()][purpose.toLowerCase()]
                  .inflow &&
                defaultTransactionType === 'Receipt'
              ) {
                clickeddata.id = sdata.id;
              }
              if (
                purpose.toUpperCase() === value.toUpperCase() &&
                typesettings[selbutton.toLowerCase()] &&
                typesettings[selbutton.toLowerCase()][purpose.toLowerCase()] &&
                typesettings[selbutton.toLowerCase()][purpose.toLowerCase()]
                  .outflow &&
                defaultTransactionType === 'Payment'
              ) {
                clickeddata.id = sdata.id;
              }
            });
          }
        }
        if (
          selectedButton.toLowerCase().split(' ')[0] ===
            sdata?.entity_type?.toLowerCase().split('_')[0] &&
          selectedButton.toLowerCase() === 'other banks'
        ) {
          if (value?.toLowerCase() === 'contra entry') {
            clickeddata.id = party?.id;
            clickeddata.provider = party?.provider;
            clickeddata.providerId = party?.providerId;
          } else {
            sdata?.purpose?.forEach((purpose) => {
              if (
                purpose.toUpperCase() === value.toUpperCase() &&
                typesettings['other banks'] &&
                typesettings['other banks'][purpose.toLowerCase()] &&
                typesettings['other banks'][purpose.toLowerCase()].inflow &&
                defaultTransactionType === 'Receipt'
              ) {
                clickeddata.id = sdata.id;
              }
              if (
                purpose.toUpperCase() === value.toUpperCase() &&
                typesettings['other banks'] &&
                typesettings['other banks'][purpose.toLowerCase()] &&
                typesettings['other banks'][purpose.toLowerCase()].outflow &&
                defaultTransactionType === 'Payment'
              ) {
                clickeddata.id = sdata.id;
              }
            });
          }
        }
      });
      basetowardsdata.forEach((sdata) => {
        if (sdata?.entity_type?.toLowerCase() === 'government_income_tax') {
          if (sdata?.purpose?.includes(value)) {
            clickeddata.id = sdata?.id;
          }
        }
      });
    }
    handleClick(clickeddata);
  };

  const onLocationChange = (event, value) => {
    event.stopPropagation();
    const clickeddata = {
      name: 'Payment of GST',
      id: '',
      type: 'Purpose',
      otype: selectedOption,
      etype: selectedButton,
      gstin: '',
    };

    if (
      basetowardsdata &&
      basetowardsdata.length > 0 &&
      state === 'CUSTOM POPUPS PURPOSE'
    ) {
      basetowardsdata.forEach((sdata) => {
        if (
          selectedButton.toLowerCase().split(' ')[0] ===
            sdata?.entity_type?.toLowerCase().split('_')[0] &&
          selectedButton.toLowerCase() === 'government'
        ) {
          sdata?.purpose?.forEach((purpose) => {
            if (
              purpose.toUpperCase() === 'PAYMENT OF GST' &&
              typesettings?.government['payment of gst']?.outflow &&
              defaultTransactionType === 'Payment' &&
              value?.gstin?.id === sdata?.gstin_id
            ) {
              clickeddata.id = sdata.id;
              clickeddata.gstin = sdata?.gstin_id;
            }
          });
        }
      });
    }
    handleClick(clickeddata);
  };

  React.useEffect(() => {
    if (party?.name?.toLowerCase() === 'goods and services tax (gst)')
      FetchLocations();
  }, [party]);

  React.useEffect(() => {
    if (purposename?.toLowerCase() === 'payment of gst') {
      setShowLocation(true);
    } else {
      setShowLocation(false);
    }
  }, [purposename]);

  return (
    <>
      <Mui.Grid
        container
        className={
          device === 'desktop' ? css.commonDrawerDesktop : css.commonDrawer
        }
      >
        <Mui.Grid
          item
          xs={12}
          lg={12}
          md={12}
          sm={12}
          className={
            (state === 'INCOME' || state === 'EXPENSE') && css.spaceFourSides
          }
        >
          {(state === 'INCOME' || state === 'EXPENSE') && (
            <Mui.Stack
              spacing={1}
              className={
                device === 'desktop' ? css.mainStackDesktop : css.mainStack
              }
            >
              <Mui.Grid
                item
                xs={12}
                lg={12}
                md={12}
                sm={12}
                // className={classes.alignContent}
              >
                <Mui.Stack
                // direction="column"
                // style={{
                //   alignItems: 'flexStart',
                //   justifyContent: 'space-between',
                //   // marginBottom: '-13px',
                // }}
                >
                  <Mui.Stack className={css.searchBarStack}>
                    <Mui.TextField
                      placeholder={`Search ${addVcCategory1}`}
                      onChange={(event) => setQuery(event.target.value)}
                      value={query}
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment>
                            <IconButton>
                              <img src={SearchIcon} alt="Well Done" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Mui.Stack>
                  <Mui.Stack
                    direction="column"
                    className={
                      device === 'desktop'
                        ? css.listStackDesktop
                        : css.listStack
                    }
                  >
                    <Mui.Stack
                      className={
                        device === 'desktop' ? css.listDesktop : css.list
                      }
                    >
                      {filteredUsers &&
                        filteredUsers?.map((e) => (
                          <>
                            <Mui.Stack className={css.vendorListPointer}>
                              <Mui.Typography
                                className={css.vendorList}
                                onClick={() => {
                                  handleClick({
                                    name: e.name,
                                    id: e.id,
                                    type: e.primary_relationship,
                                    tdspercentage: e.tds_percentage,
                                  });
                                }}
                              >
                                {' '}
                                {e.name?.toLowerCase()}
                              </Mui.Typography>
                              <Mui.Divider
                                variant="fullWidth"
                                className={
                                  device === 'desktop'
                                    ? css.dividerDesktop
                                    : css.divider
                                }
                              />
                            </Mui.Stack>
                          </>
                        ))}
                    </Mui.Stack>
                  </Mui.Stack>
                </Mui.Stack>
              </Mui.Grid>
            </Mui.Stack>
          )}
          {(state === 'receipt' ||
            state === 'payment' ||
            state === 'BANKLIST' ||
            state === 'CATEGORYLIST_1' ||
            state === 'CATEGORYLIST_2' ||
            state === 'CUSTOM POPUPS' ||
            state === 'CUSTOM POPUPS PURPOSE') && (
            <div>
              <Mui.Stack
                spacing={1}
                className={
                  device === 'desktop'
                    ? cssaddon.mainStackDesktop
                    : cssaddon.mainStack
                }
              >
                {state === 'CUSTOM POPUPS'
                  ? [
                      <Mui.Box className={cssaddon.popupTitle}>
                        Select Party
                      </Mui.Box>,
                      <Mui.Box className={cssaddon.popupSubTitle}>
                        Choose the party associated with your Transaction
                      </Mui.Box>,
                    ]
                  : ''}
                {state === 'CUSTOM POPUPS PURPOSE'
                  ? [
                      <Mui.Box className={cssaddon.purposepopupTitle}>
                        Select Purpose
                      </Mui.Box>,
                      <Mui.Box className={cssaddon.purposepopupSubTitle01}>
                        Step 01: Select Relationship
                      </Mui.Box>,
                    ]
                  : ''}

                {state === 'CUSTOM POPUPS' ||
                state === 'CUSTOM POPUPS PURPOSE' ? (
                  <Mui.Stack className={cssaddon.optionButtons}>
                    <Mui.Grid container>
                      {ButtonArray.map((button) => {
                        if (selectedOption) {
                          if (
                            state === 'CUSTOM POPUPS PURPOSE' &&
                            selectedOption
                          ) {
                            if (
                              selectedOption.toUpperCase() === 'GOVERNMENT' ||
                              selectedOption.toUpperCase() === 'OTHER BANKS'
                            ) {
                              if (
                                selectedOption.toUpperCase() !==
                                button.toUpperCase()
                              ) {
                                return '';
                              }
                            }
                            if (
                              selectedOption.toUpperCase() !== 'GOVERNMENT' &&
                              selectedOption.toUpperCase() !== 'OTHER BANKS'
                            ) {
                              if (
                                button.toUpperCase() === 'GOVERNMENT' ||
                                button.toUpperCase() === 'OTHER BANKS'
                              ) {
                                return '';
                              }
                            }
                          }
                        }
                        return (
                          <span className={cssaddon.customButtonHolder}>
                            {selectedButton &&
                            selectedButton.toUpperCase() ===
                              button.toUpperCase() ? (
                              <Mui.Grid item xs={4} lg={4} md={4} sm={4}>
                                <Mui.Button
                                  uppercase={false}
                                  className={[
                                    cssaddon.custompopupsButtons,
                                    cssaddon.custompopupsButtonsSelected,
                                  ].join(' ')}
                                  onClick={(event) =>
                                    setselectedButton(event, `${button}`)
                                  }
                                >
                                  {button}
                                </Mui.Button>
                              </Mui.Grid>
                            ) : (
                              <Mui.Grid>
                                <Mui.Button
                                  className={cssaddon.custompopupsButtons}
                                  onClick={(event) =>
                                    setselectedButton(event, `${button}`)
                                  }
                                >
                                  {button}
                                </Mui.Button>
                              </Mui.Grid>
                            )}
                          </span>
                        );
                      })}
                    </Mui.Grid>
                  </Mui.Stack>
                ) : (
                  ''
                )}
                {state === 'CUSTOM POPUPS PURPOSE' ? (
                  <Mui.Box className={cssaddon.purposepopupSubTitle02}>
                    Step 02: Select Nature of Transaction
                  </Mui.Box>
                ) : (
                  ''
                )}
                {changePurposeDetails.length > 0 ? (
                  <InfiniteScroll
                    dataLength={changePurposeDetails?.length}
                    height={
                      device === 'desktop'
                        ? party?.name?.toLowerCase() ===
                          'goods and services tax (gst)'
                          ? 'auto'
                          : '65vh'
                        : party?.name?.toLowerCase() ===
                          'goods and services tax (gst)'
                        ? 'auto'
                        : '50vh'
                    }
                    scrollThreshold="20px"
                    initialScrollY="100px"
                    loader={<h4 style={{ margin: '28px 26px' }}>Loading...</h4>}
                    style={{ width: '100%' }}
                  >
                    <Mui.FormControl style={{ width: '100%' }}>
                      <Mui.FormLabel id="purposeGroup" />
                      <Mui.RadioGroup
                        aria-labelledby="purposeGroup"
                        name="purposeGroup"
                        value={purposename}
                        onChange={purposeChange}
                      >
                        {(`${state}_${selectedButton}` ===
                          'CUSTOM POPUPS PURPOSE_other banks' ||
                          `${state}_${selectedButton}` ===
                            'CUSTOM POPUPS PURPOSE_other banks') && (
                          <Mui.FormControlLabel
                            className={cssaddon.radioOption}
                            value="Contra Entry"
                            control={
                              <Mui.Radio
                                defaultValue={purposename}
                                className={cssaddon.radioColor}
                                // disabled={stateData?.bankDetails?.bankId === party?.id && transactiontype === 'Reciept'}
                                sx={{
                                  '&.Mui-checked': {
                                    color: '#f08b32 !important',
                                  },
                                }}
                              />
                            }
                            disabled={
                              stateData?.bankDetails?.bankId === party?.id &&
                              transactiontype === 'Receipt' &&
                              (`${state}_${selectedButton}` ===
                                'CUSTOM POPUPS PURPOSE_other banks' ||
                                `${state}_${selectedButton}` ===
                                  'CUSTOM POPUPS PURPOSE_other banks')
                            }
                            sx={{
                              '&.Mui-disabled': {
                                cursor: 'not-allowed',
                                '.CommonDrawer_radioLabel': {
                                  color: 'rgba(0, 0, 0, 0.38) !important',
                                },
                              },
                            }}
                            label={
                              <span className={cssaddon.radioLabel}>
                                Contra Entry
                              </span>
                            }
                          />
                        )}
                        {changePurposeDetails.length > 0
                          ? changePurposeDetails &&
                            changePurposeDetails.length > 0 &&
                            changePurposeDetails.map((purpose) => {
                              return (
                                <Mui.FormControlLabel
                                  className={cssaddon.radioOption}
                                  value={purpose}
                                  control={
                                    <Mui.Radio
                                      className={cssaddon.radioColor}
                                      sx={{
                                        '&.Mui-checked': {
                                          color: '#f08b32 !important',
                                        },
                                      }}
                                      defaultValue={purposename}
                                    />
                                  }
                                  disabled={
                                    stateData?.bankDetails?.bankId !==
                                      party?.id &&
                                    transactiontype === 'Receipt' &&
                                    (`${state}_${selectedButton}` ===
                                      'CUSTOM POPUPS PURPOSE_other banks' ||
                                      `${state}_${selectedButton}` ===
                                        'CUSTOM POPUPS PURPOSE_other banks')
                                  }
                                  sx={{
                                    '&.Mui-disabled': {
                                      cursor: 'not-allowed',
                                      '.CommonDrawer_radioLabel': {
                                        color: 'rgba(0, 0, 0, 0.38) !important',
                                      },
                                    },
                                  }}
                                  label={
                                    <span className={cssaddon.radioLabel}>
                                      {purpose}
                                    </span>
                                  }
                                />
                              );
                            })
                          : purposeDetails &&
                            purposeDetails.length > 0 &&
                            purposeDetails.map((purpose) => {
                              return (
                                <Mui.FormControlLabel
                                  className={cssaddon.radioOption}
                                  value={purpose}
                                  control={
                                    <Mui.Radio defaultValue={purposename} />
                                  }
                                  label={
                                    <span className={cssaddon.radioLabel}>
                                      {purpose}
                                    </span>
                                  }
                                />
                              );
                            })}
                      </Mui.RadioGroup>
                    </Mui.FormControl>
                  </InfiniteScroll>
                ) : (
                  <Mui.FormControl style={{ width: '100%' }}>
                    <Mui.FormLabel id="purposeGroup" />
                    <Mui.RadioGroup
                      aria-labelledby="purposeGroup"
                      name="purposeGroup"
                      value={purposename}
                      onChange={purposeChange}
                    >
                      {(`${state}_${selectedButton}` ===
                        'CUSTOM POPUPS PURPOSE_other banks' ||
                        `${state}_${selectedButton}` ===
                          'CUSTOM POPUPS PURPOSE_other banks') && (
                        <Mui.FormControlLabel
                          className={cssaddon.radioOption}
                          value="Contra Entry"
                          control={
                            <Mui.Radio
                              defaultValue={purposename}
                              className={cssaddon.radioColor}
                              sx={{
                                '&.Mui-checked': {
                                  color: '#f08b32 !important',
                                },
                              }}
                            />
                          }
                          sx={{
                            '&.Mui-disabled': {
                              cursor: 'not-allowed',
                              '.CommonDrawer_radioLabel': {
                                color: 'rgba(0, 0, 0, 0.38) !important',
                              },
                            },
                          }}
                          disabled={
                            stateData?.bankDetails?.bankId === party?.id &&
                            transactiontype === 'Receipt' &&
                            (`${state}_${selectedButton}` ===
                              'CUSTOM POPUPS PURPOSE_other banks' ||
                              `${state}_${selectedButton}` ===
                                'CUSTOM POPUPS PURPOSE_other banks')
                          }
                          label={
                            <span className={cssaddon.radioLabel}>
                              Contra Entry
                            </span>
                          }
                        />
                      )}
                    </Mui.RadioGroup>
                  </Mui.FormControl>
                )}
                {state === 'CUSTOM POPUPS PURPOSE' &&
                party?.name?.toLowerCase() === 'goods and services tax (gst)' &&
                showLocation ? (
                  <Mui.Box className={cssaddon.purposepopupSubTitle02}>
                    Step 03: Select Location
                  </Mui.Box>
                ) : (
                  ''
                )}

                {state === 'CUSTOM POPUPS PURPOSE' &&
                  party?.name?.toLowerCase() ===
                    'goods and services tax (gst)' &&
                  showLocation &&
                  LocationList?.length > 0 && (
                    <InfiniteScroll
                      dataLength={LocationList?.length}
                      height={device === 'desktop' ? '62vh' : '50vh'}
                      scrollThreshold="20px"
                      initialScrollY="100px"
                      loader={
                        <h4 style={{ margin: '28px 26px' }}>Loading...</h4>
                      }
                      style={{ width: '100%' }}
                    >
                      <Mui.FormControl style={{ width: '100%' }}>
                        <Mui.FormLabel id="locationGroup" />
                        <Mui.RadioGroup
                          aria-labelledby="locationGroup"
                          name="locationGroup"
                          defaultValue={locationName}
                          // onChange={(e) => onLocationChange(e,locatin)}
                        >
                          {LocationList &&
                            LocationList?.length > 0 &&
                            LocationList?.map((location) => {
                              return (
                                <>
                                  {location?.active  && location?.gstin?.id && (
                                    <Mui.FormControlLabel
                                      className={cssaddon.radioOption}
                                      value={location?.gstin?.id}
                                      control={
                                        <Mui.Radio
                                          onChange={(e) =>
                                            onLocationChange(e, location)
                                          }
                                          className={cssaddon.radioColor}
                                          sx={{
                                            '&.Mui-checked': {
                                              color: '#f08b32 !important',
                                            },
                                          }}
                                          // defaultValue={location?.gstin?.id}
                                        />
                                      }
                                      sx={{
                                        '&.Mui-disabled': {
                                          cursor: 'not-allowed',
                                          '.CommonDrawer_radioLabel': {
                                            color:
                                              'rgba(0, 0, 0, 0.38) !important',
                                          },
                                        },
                                      }}
                                      label={
                                        <span
                                          className={cssaddon.radioLabel}
                                          onChange={(e) =>
                                            onLocationChange(e, location)
                                          }
                                        >
                                          {location.gstin.gstin} - 
                                          {location.state}
                                        </span>
                                      }
                                    />
                                  )}
                                </>
                              );
                            })}
                        </Mui.RadioGroup>
                      </Mui.FormControl>
                    </InfiniteScroll>
                  )}
              </Mui.Stack>
              {(state === 'BANKLIST' ||
                state === 'CATEGORYLIST_1' ||
                state === 'CATEGORYLIST_2' ||
                selectedButton) &&
              state !== 'CUSTOM POPUPS PURPOSE'
                ? customsearch1
                : customsearch2}
            </div>
          )}
          <SelectBottomSheet
            name="moreAction"
            triggerComponent={
              <Mui.Grid
                className={
                  device === 'desktop'
                    ? css.commonDrawerDesktopBtn
                    : css.commonDrawerBtn
                }
                onClick={() => {
                  if (state !== 'CUSTOM POPUPS PURPOSE') {
                    addnewvendor();
                  }
                  // setAddCategory(true);
                }}
                style={{
                  display:
                    state === 'receipt' ||
                    state === 'payment' ||
                    state === 'BANKLIST' ||
                    state === 'CATEGORYLIST_1' ||
                    state === 'CATEGORYLIST_2'
                      ? 'none'
                      : '',
                }}
              >
                {state === 'BANKLIST' ||
                state === 'CATEGORYLIST_1' ||
                state === 'CATEGORYLIST_2' ||
                state === 'CUSTOM POPUPS' ||
                state === 'CUSTOM POPUPS PURPOSE'
                  ? ''
                  : `+ Add New ${addVcCategory}`}
              </Mui.Grid>
            }
            open={addCategory}
            onTrigger={() => setAddCategory(true)}
            onClose={() => setAddCategory(false)}
            maxHeight="45vh"
          >
            <Mui.Grid container style={{ overflow: 'hidden' }}>
              <Mui.Grid
                item
                xs={12}
                lg={12}
                md={12}
                sm={12}
                style={{
                  marginBottom: '2rem',
                  marginTop: '2rem',
                  marginLeft: '1rem',
                  marginRight: '1rem',
                }}
              >
                <Mui.Stack>
                  <Mui.Grid
                    item
                    sm={12}
                    lg={12}
                    md={12}
                    //   className={classes.alignContent}
                  >
                    <AddCategory
                      handleClose={setAddCategory1}
                      handleParent1={handleClick}
                      //  handleClose={(item)=>setAddCategory1(item)}
                      val={setvalue}
                      getParties={getParties}
                      selectedButton={selectedButton}
                      //         setLenderAddNew(false);
                      // getParties(selectedButton, '');
                    />
                  </Mui.Grid>
                </Mui.Stack>
              </Mui.Grid>
            </Mui.Grid>
          </SelectBottomSheet>
        </Mui.Grid>
      </Mui.Grid>
      {AlertOpen ? (
        <AlertDialog
          initopen={opModal}
          closebutton={closebutton}
          handleClick={confirmdatachange}
          name={alertdisplaymessage}
          message={alertwarning}
          buttontext1="Yes"
          buttontext2="No"
          ptype={device}
        />
      ) : (
        ''
      )}

      <SelectBottomSheet
        name="edit"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={drawer.edit}
        onTrigger={() => setDrawer((d) => ({ ...d, edit: true }))}
        onClose={() => setDrawer((d) => ({ ...d, edit: false }))}
        maxHeight="45vh"
      >
        <div style={{ padding: '15px' }}>
          {device === 'mobile' && <Puller />}
          <div style={{ padding: '5px 0' }} className={css.headerContainer}>
            <p className={css.headerLabel}>{editValue?.name}</p>
            <span className={css.headerUnderline} />
          </div>
          <InvoiceCustomer
            showValue={editValue}
            handleBottomSheet={(ps) =>
              setDrawer((d) => ({ ...d, [ps]: false }))
            }
            type={state === 'receipt' ? 'customers' : 'vendors'}
          />
        </div>
      </SelectBottomSheet>

      {CustomerAddNew ? (
        <SelectBottomSheet
          id="overFlowHidden"
          name="addCustomer"
          triggerComponent={<></>}
          open={CustomerAddNew}
          // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addCustomer: true }));
          }}
          onClose={() => {
            setCustomerAddNew(false);
          }}
          addNewSheet
        >
          <CreateCustomerDialogNew
            addCusomerComplete={async () => {
              await getParties(selectedButton, '');
              setCustomerAddNew(false);
            }}
            handleBottomSheet={() => {}}
            sheetType={operation}
            entitytype={entitytype}
          />
        </SelectBottomSheet>
      ) : (
        ''
      )}

      {employeeAddNew ? (
        <SelectBottomSheet
          id="overFlowHidden"
          name="addEmployee"
          triggerComponent={<></>}
          open={employeeAddNew}
          // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addemployee: true }));
          }}
          onClose={() => {
            setemployeeAddNew(false);
          }}
          addNewSheet
        >
          <TeamBottomSheet
            sheetType={operation}
            showData={showteamdata}
            handleBottomSheetClose={() => setemployeeAddNew(false)}
            listCall={() => getParties(selectedButton, '')}
            // editClick={() => {
            //   if (deviceDetect === 'mobile') {
            //     setEditForm(true);
            //     setDrawer((prev) => ({ ...prev, teamDrawer: false }));
            //   }
            // }}
          />
        </SelectBottomSheet>
      ) : (
        ''
      )}

      {LenderAddNew ? (
        <SelectBottomSheet
          id="overFlowHidden"
          name="addCustomer"
          triggerComponent={<></>}
          open={LenderAddNew}
          // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addCustomer: true }));
          }}
          onClose={() => {
            setLenderAddNew(false);
          }}
          addNewSheet
        >
          <CreateCustomerDialogNew
            addCusomerComplete={() => {
              setLenderAddNew(false);
              getParties(selectedButton, '');
            }}
            handleBottomSheet={() => {}}
            sheetType={operation}
            entitytype={entitytype}
          />
        </SelectBottomSheet>
      ) : (
        ''
      )}

      {PromoterAddNew ? (
        <SelectBottomSheet
          id="overFlowHidden"
          name="addCustomer"
          triggerComponent={<></>}
          open={PromoterAddNew}
          // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addCustomer: true }));
          }}
          onClose={() => {
            setPromoterAddNew(false);
          }}
          addNewSheet
        >
          <CreateCustomerDialogNew
            addCusomerComplete={() => {
              setPromoterAddNew(false);
              getParties(selectedButton, '');
            }}
            handleBottomSheet={() => {}}
            sheetType={operation}
            entitytype={entitytype}
          />
        </SelectBottomSheet>
      ) : (
        ''
      )}

      {customerEdit ? (
        <SelectBottomSheet
          id="overFlowHidden"
          name="addEmployee"
          triggerComponent={<></>}
          style={{ overflowY: 'auto' }}
          open={customerEdit}
          // // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addcustomer: true }));
          }}
          onClose={() => {
            setcustomerEdit(false);
          }}
          addNewSheet
        >
          <div style={{ width: '100%' }}>
            <div
              style={{ padding: '5px 0', margin: '1rem' }}
              className={css.headerContainer}
            >
              <p className={css.headerLabel}>{editcustomerValue?.name}</p>
              <span className={css.headerUnderline} />
            </div>
            <InvoiceCustomer
              showValue={editValue}
              handleBottomSheet={() => {
                setcustomerEdit(false);
                setDrawer((prev) => ({ ...prev, customerDrawer: false }));
                setEditValue({
                  value: editcustomerValue,
                  type: '',
                  show: 'edit',
                });
              }}
              type="customers"
              entitytype="customer"
              buttons="no"
            />
          </div>
        </SelectBottomSheet>
      ) : (
        ''
      )}

      {lenderEdit ? (
        <SelectBottomSheet
          id="overFlowHidden"
          name="addEmployee"
          triggerComponent={<></>}
          style={{ overflowY: 'auto' }}
          open={lenderEdit}
          // // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addcustomer: true }));
          }}
          onClose={() => {
            setlenderEdit(false);
          }}
          addNewSheet
        >
          <div style={{ width: '100%' }}>
            <div
              style={{ padding: '5px 0', margin: '1rem' }}
              className={css.headerContainer}
            >
              <p className={css.headerLabel}>{editlenderValue?.name}</p>
              <span className={css.headerUnderline} />
            </div>
            <InvoiceCustomer
              showValue={editValue}
              handleBottomSheet={() => {
                setlenderEdit(false);
                setDrawer((prev) => ({ ...prev, customerDrawer: false }));
                setEditValue({
                  value: editlenderValue,
                  type: '',
                  show: 'edit',
                });
              }}
              type="lender"
              entitytype="lender"
              buttons="no"
            />
          </div>
        </SelectBottomSheet>
      ) : (
        ''
      )}

      {promoterEdit ? (
        <SelectBottomSheet
          id="overFlowHidden"
          name="addEmployee"
          triggerComponent={<></>}
          style={{ overflowY: 'auto' }}
          open={promoterEdit}
          // // value={taxValue}
          onTrigger={() => {
            setDrawer((prev) => ({ ...prev, addcustomer: true }));
          }}
          onClose={() => {
            setpromoterEdit(false);
          }}
          addNewSheet
        >
          <div style={{ width: '100%' }}>
            <div
              style={{ padding: '5px 0', margin: '1rem' }}
              className={css.headerContainer}
            >
              <p className={css.headerLabel}>{editpromoterValue?.name}</p>
              <span className={css.headerUnderline} />
            </div>
            <InvoiceCustomer
              showValue={editValue}
              handleBottomSheet={() => {
                setpromoterEdit(false);
                setDrawer((prev) => ({ ...prev, customerDrawer: false }));
                setEditValue({
                  value: editpromoterValue,
                  type: '',
                  show: 'edit',
                });
              }}
              type="promoter"
              entitytype="promoter"
              buttons="no"
            />
          </div>
        </SelectBottomSheet>
      ) : (
        ''
      )}
    </>
  );
};
