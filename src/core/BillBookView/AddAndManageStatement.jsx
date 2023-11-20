import React from 'react';
import * as Mui from '@mui/material';
import moment from 'moment';
// import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { DataGrid } from '@mui/x-data-grid';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { Document, Page } from 'react-pdf'
import Input from '@components/Input/Input.jsx';
import { makeStyles, Chip, styled } from '@material-ui/core';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import deleteBin from '@assets/binRed.svg';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@material-ui/icons/Search';
import SearchIcon2 from '@assets/search.svg';
import viewYourBills from '@assets/viewYourBills.png';
import editYourBills from '@assets/editYourBills.png';
// import addmngDownload from '@assets/addmngDownload.svg';
// import addManageVendor from '@assets/addManageVendor.svg';
import AppContext from '@root/AppContext.jsx';
import {
  CheckedIcon,
  UncheckedIcon,
} from '@core/PaymentView/MultiplePayments/VendorBillSelection';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import * as themes from '@root/theme.scss';
import * as Router from 'react-router-dom';
import Calender from '../InvoiceView/Calander';
import * as css from './AddAndManage.scss';
import * as yourBillsCss from './YourBills.scss';

const useStyles = makeStyles(() => ({
  chips: {
    marginRight: '5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
      cursor: 'pointer',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
  },
  searchInput: {
    margin: '10px 20px',
    padding: '5px 10px 0 0',
    height: '100%',
    '& .MuiTextField-root': {
      paddingLeft: '8px',
      marginBottom: '8px',
      border: '1px solid rgb(180 175 174)',
      height: '7% !important',
    },
    '& .MuiInput-root': {
      height: '56px !important',
    },
  },
  checkbox: {
    padding: 0,
    paddingTop: 4,
    '& .MuiSvgIcon-root': {
      fontSize: '2.4rem',
      fill: 'transparent',
    },
  },
  selectedchips: {
    minWidth: '80px',
    margin: '0 6px 0 0',
    background: '#fdf1e6',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
  },
}));
const sortOptions = [
  { id: 1, name: 'Recent payments' },
  { id: 2, name: 'Bill amount Low to High' },
  { id: 3, name: 'Bill amount High to Low' },
  { id: 4, name: 'A-Z' },
];

export const paymentStatusListWithBill = [
  { id: 'company_cash', label: 'Paid with Company Cash' },
  { id: 'paid_as_advance', label: 'Paid as Advance' },
  { id: 'to_pay', label: 'To Pay' },
  { id: 'company_card', label: 'Paid with Company Card' },
  { id: 'personal', label: 'Paid Personally' },
  { id: 'company_account', label: 'Paid with Company Account' },
];
const initialState = {
  vendors: [],
  sort: '',
  date: '',
};
const AddAndManageStatement = () => {
  // const classes = useStyles();
  const { state } = Router.useLocation();
  const { organization, user, enableLoading } = React.useContext(AppContext);
  // dummy
  const Puller = styled(Mui.Box)(() => ({
    width: '50px',
    height: 6,
    backgroundColor: '#C4C4C4',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
  }));
  const TextfieldStyle = (props) => {
    return (
      <Input
        {...props}
        variant="standard"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        theme="light"
        className={css.textfieldMain}
      />
    );
  };
  // const [click, setClick] = React.useState('tab1');

  // const titles = ['Name', 'Gmail', 'Last Bill Recieved On', ' ', ' ', ' '];

  // const data = [
  //   {
  //     avatar: <Mui.Avatar>J</Mui.Avatar>,
  //     name: 'jay',
  //     contactName: 'sing',
  //     overDue: '145',
  //   },
  // ];

  const device = localStorage.getItem('device_detect');
  const classes = useStyles();

  const [states, setState] = React.useState(initialState);
  const [addDrawer, setAddDrawer] = React.useState(false);
  const [emailList, setEmailList] = React.useState([]);
  const [anchorElForList, setAnchorElForList] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [anchorElCalendar, setAnchorElCalendar] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [file, setFile] = React.useState('');
  const [viewBill, setViewBill] = React.useState(false);
  const [dialogDelete, setDialogDelete] = React.useState(false);

  const open = Boolean(anchorEl);
  const [fromDate, setFromDate] = React.useState(null);
  const [selectedBill, setSelectedBill] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(1);
  const [search, setSearch] = React.useState('');

  // const [state, setState] = useState(initialState);
  const openCalendar = Boolean(anchorElCalendar);
  const [webValue, setWebValue] = React.useState({
    fromDate: null,
    toDate: null,
    customerID: null,
    orderBy: null,
  });
  const [drawer, setDrawer] = React.useState({
    date: false,
    vendor: false,
    sort: false,
    download: false,
    viewBill: false,
    startDate: false,
    endDate: false,
  });
  // const handleClick = (event, component) => {
  //   if (component === 'calendar') {
  //     setAnchorElCalendar(event.currentTarget);
  //   }
  //   // else if (component === 'startDate') {
  //   //   setAnchorElStartDate(event.currentTarget);
  //   // } else if (component === 'endDate') {
  //   //   setAnchorElEndDate(event.currentTarget);
  //   // }
  //   else if (component === 'list') {
  //     setAnchorElForList(event.currentTarget);
  //   } else {
  //     setAnchorEl(event.currentTarget);
  //   }
  // };
  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
    // setLoading(false);
  };
  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
    // if (data) {
    //   setState((s) => ({ ...s, [name]: data }));
    // }
    // setSearchQuery('');
  };
  const handleBottomSheetClose = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (data) {
      setState((s) => ({ ...s, [name]: data }));
    }
    setSearchQuery('');
  };
  const handleRowSelection = (val) => {
    handleBottomSheet('viewBill');
    setSelectedBill(val);
  };
  // console.log(drawer);

  const onInputChange = (e) => {
    setSearchQuery(e?.target?.value);
  };

  const handleValueChange = (v, checked) => {
    const newVendors = state.vendors.map((item) => {
      if (item.id === v.id) {
        const updatedItem = {
          ...item,
          check: checked,
        };
        return updatedItem;
      }

      return { ...item };
    });
    // setVendorList(newVendors);
    setState({ ...state, vendors: newVendors });
    handleBottomSheetClose('vendors', newVendors);
  };
  React.useEffect(() => {
    const filterBills = search
      ? emailList?.filter((val) =>
          val?.vendor?.name
            ?.trim()
            ?.toLowerCase()
            ?.includes(search.trim().toLowerCase()),
        )
      : emailList;
    setEmailList(filterBills);
  }, [search]);
  // const column = [
  //   {
  //     id: '1',
  //     name: 'sateesh',
  //     last_bill_date: '25-5-2022',
  //   },
  //   {
  //     id: '11',
  //     name: 'sateeshbro',
  //     last_bill_date: '25-5-2022',
  //   },
  //   {
  //     id: '111',
  //     name: 'sateeshkumar',
  //     last_bill_date: '25-5-2022',
  //   },
  //

  const handleStartDate = (val) => {
    if (device === 'mobile') {
      setFromDate(val);
      setDrawer((d) => ({ ...d, startDate: false }));
    } else {
      setWebValue((prev) => ({
        ...prev,
        fromDate: val,
      }));
    }
  };
  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };
  const handleEndDate = (val) => {
    if (device === 'mobile') {
      setToDate(val);
      setDrawer((d) => ({ ...d, endDate: false }));
    } else {
      setWebValue((prev) => ({
        ...prev,
        toDate: val,
      }));
    }
  };
  const viewBillsApi = async () => {
    let filter = '';
    filter = `source_type=email&email_list_id=${state.datas.id}`;
    // const vendorId =
    // states &&
    // states.vendors &&
    // states.vendors.filter((f) => f.check).map((v) => v.id);

    // if (vendorId && vendorId.length === 1) {
    // filter += `vendor_id=${vendorId}`;
    // filter +=`${state.datas.id}`;
    // } else if (vendorId && vendorId.length > 1) {
    //   vendorId.forEach((v) => {
    //     filter += `vendor_ids[]=${v}&`;
    //   });
    // }

    // DONT DELETE THIS IS SORTBY API INTEGRATION/WE SORTED DATAS USING LOCAL VAR STORAGE METHOD
    // if(sortingData){
    //     if(sortingData.id===1){
    //       filter +=`&order_by=date&order=desc`;
    //     }else if(sortingData.id===2){
    //       filter +=`&order_by=amount&order=asc`;
    //     }else if(sortingData.id===3){
    //       filter +=`&order_by=amount&order=desc`;
    //     }else if(sortingData.id===4){
    //       filter +=`&order_by=name&order=asc`;
    //     }
    //   };
    if (toDate) {
      const toDataStr = moment(toDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      filter +=
        filter === '' ? `end_date=${toDataStr}` : `&end_date=${toDataStr}`;
    }

    if (fromDate) {
      const fromDataStr = moment(fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      filter +=
        filter === ''
          ? `start_date=${fromDataStr}`
          : `&start_date=${fromDataStr}`;
    }

    // let filter = {};
    // filter=`source_type=email&email_user_id=${state.datas.id}`;
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendor_bills?${filter}`,
      // `organizations/${organization.orgId}/vendor_bills?source_type=email&email_list_id=${state.datas.id}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          res.data.map((a) => Object.assign(a, { check: false }));
          setEmailList(res.data);
          // setState({ ...state, vendors: res.data });
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    viewBillsApi();
    if (fromDate && toDate) {
      setAnchorElCalendar(null);
    }
  }, [toDate, fromDate]);

  const onSortChange = (v) => {
    handleBottomSheetClose('sort', v);
    if (v.id === 4) {
      emailList.sort((a, b) =>
        a?.vendor?.name
          .toLowerCase()
          .localeCompare(b?.vendor?.name.toLowerCase()),
      );
      setEmailList(emailList);
    } else if (v.id === 2) {
      const newData = emailList.sort((a, b) => {
        return (a.amount || 0) - (b.amount || 0);
      });
      setEmailList([...newData]);
    } else if (v.id === 3) {
      const newData = emailList.sort((a, b) => {
        return (b.amount || 0) - (a.amount || 0);
      });
      setEmailList([...newData]);
    } else if (v.id === 1) {
      emailList.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setEmailList(emailList);
    }
  };
  React.useEffect(() => {
    viewBillsApi();
  }, [state]);

  // const patchOneEmailApi = (id, idname, idemail) => {
  //   enableLoading(true);
  //   if (syncEmails) {
  //     syncEmails.forEach((list) => {
  //       RestApi(
  //         `organizations/${organization.orgId}/email_users/${list.id}/email_lists/${id}`,
  //         {
  //           method: METHOD.POST,
  //           headers: {
  //             Authorization: `Bearer ${user.activeToken}`,
  //           },
  //           payload: { name: idname, email: idemail, fetch: true },
  //         },
  //       )
  //         .then((res) => {
  //           setAddDrawer('');
  //           enableLoading(false);
  //           if (res && !res.error) {
  //             // const listData = res.data.filter(element => !element.fetch);
  //             res.data.forEach((ele) => {
  //               console.log('response', ele);
  //               // setEmailList((prev) => [...prev, ele]);
  //             });
  //             fetchEmailList();
  //             // setEmailList(prev => prev.push(res.data));
  //           } else if (res && res.message) {
  //             openSnackBar({
  //               message: res.message,
  //               type: MESSAGE_TYPE.ERROR,
  //             });
  //             enableLoading(false);
  //             fetchEmailList();
  //             setAddDrawer('');
  //           } else if (res.error) {
  //             const errorMessages = Object.values(res.errors);
  //             openSnackBar({
  //               message: errorMessages.join(', '),
  //               type: MESSAGE_TYPE.ERROR,
  //             });
  //             setAddDrawer('');
  //           }
  //           enableLoading(false);
  //         })
  //         .catch((e) => {
  //           const errorMessages = Object?.values(e?.errors);
  //           openSnackBar({
  //             message: errorMessages?.join(', '),
  //             type: MESSAGE_TYPE.ERROR,
  //           });
  //           setAddDrawer('');
  //         });
  //     });
  //   }
  // };

  const columns = [
    // {
    //   field: '',
    //   // headerName: '',
    //   maxWidth: 50,
    //   sortable: false,
    //   renderCell: () => {
    //     return <Checkbox />;
    //   },
    // },
    {
      field: 'name',
      headerName: 'NAME',
      // maxWidth: 200,
      flex: 1,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>NAME</Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <div
            className={css.cosDiv}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            <Mui.Typography className={css.cosName}>
              {/* {cellValues?.row?.vendor?.name?.toLowerCase()} */}
              {cellValues?.value === null
                ? '-'
                : cellValues?.value?.toLowerCase()}
            </Mui.Typography>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      // maxWidth: 100,
      flex: 1,
      // sortable: false,

      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Status
          </Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      // sortable: false,
      renderCell: (cellValues) => {
        return (
          <Mui.Typography
            className={css.content}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            {cellValues?.value?.toLowerCase()}
          </Mui.Typography>
        );
      },
    },

    {
      field: 'document_date',
      headerName: 'document_date',
      // minWidth: 125,
      flex: 1,

      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>Date</Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      renderCell: (cellValues) => {
        return (
          <div
            className={css.cosDivmoneyIR}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            {/* <CurrencyRupeeIcon className={css.money} /> */}
            <Mui.Typography className={css.headingStackText}>
              {/* {`${cellValues.value}`} */}
              {cellValues?.value === null
                ? '-'
                : cellValues?.value?.toLowerCase()}
            </Mui.Typography>
          </div>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'amount',
      minWidth: 10,
      sortable: false,
      renderHeader: () => (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Amount
          </Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      // flex:1,
      renderCell: (cellValues) => {
        return (
          <div
            className={css.cosDivmoneyIR}
            onClick={() => handleRowSelection(cellValues?.row)}
          >
            {/* <CurrencyRupeeIcon className={css.money} /> */}
            <Mui.Typography className={css.headingStackText}>
              {FormattedAmount(cellValues?.value)}
            </Mui.Typography>
          </div>
        );
      },
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   minWidth: 10,
    //   sortable: false,
    //   // flex:1,
    //   renderCell: (val) => {
    //     return (
    //       <ToggleSwitch
    //         defaultChecked={val.value !== 'unprocessed'}
    //         // style={{
    //         //   '&. Component-root-59 .MuiSwitch-track': {
    //         //     backgroundColor: 'red',
    //         //   },
    //         // }}
    //       />
    //     );
    //   },
    // },
  ];

  // const postEmailList = () => {
  //   enableLoading(true);
  //   if (syncEmails) {
  //     syncEmails.forEach((list) => {
  //       RestApi(
  //         `organizations/${organization.orgId}/email_users/${list.id}/email_lists`,
  //         {
  //           method: METHOD.POST,
  //           headers: {
  //             Authorization: `Bearer ${user.activeToken}`,
  //           },
  //           payload: { name: inputname, email: Email },
  //         },
  //       )
  //         .then((res) => {
  //           setAddDrawer('');
  //           enableLoading(false);
  //           if (res && !res.error) {
  //             // const listData = res.data.filter(element => !element.fetch);
  //             res.data.forEach((ele) => {
  //               console.log('response', ele);
  //               // setEmailList((prev) => [...prev, ele]);
  //             });
  //             fetchEmailList();
  //             // setEmailList(prev => prev.push(res.data));
  //           } else if (res && res.message) {
  //             openSnackBar({
  //               message: res.message,
  //               type: MESSAGE_TYPE.ERROR,
  //             });
  //             enableLoading(false);
  //             fetchEmailList();
  //             setAddDrawer('');
  //           } else if (res.error) {
  //             const errorMessages = Object.values(res.errors);
  //             openSnackBar({
  //               message: errorMessages.join(', '),
  //               type: MESSAGE_TYPE.ERROR,
  //             });
  //             setAddDrawer('');
  //           }
  //           enableLoading(false);
  //         })
  //         .catch((e) => {
  //           const errorMessages = Object?.values(e?.errors);
  //           openSnackBar({
  //             message: errorMessages?.join(', '),
  //             type: MESSAGE_TYPE.ERROR,
  //           });
  //           setAddDrawer('');
  //         });
  //     });
  //   }
  // };

  return device === 'mobile' ? (
    <Mui.Stack width="100%" className={yourBillsCss.addmanagemobile}>
      <div className={yourBillsCss.yourBillsContainer}>
        <div className={yourBillsCss.headerMainContainer}>
          <div className={yourBillsCss.headerContainer}>
            <div className={yourBillsCss.headerLabel}>Your Bills</div>
            <span className={yourBillsCss.headerUnderline} />
          </div>
          {/* <div className={yourBillsCss.headerContainer}>
            <div className={yourBillsCss.draftHeader} onClick={() => setDraft(true)}>
              Drafts
            </div>
          </div> */}
        </div>
        <div className={yourBillsCss.searchContainer}>
          <div
            className={classes.chips}
            onClick={() => onTriggerDrawer('date')}
          >
            <Chip
              label="Date"
              icon={<KeyboardArrowDownIcon />}
              className={yourBillsCss.chipLabel}
            />
          </div>
          {/* <div
            className={classes.chips}
            onClick={() => onTriggerDrawer('vendor')}
          >
            <Chip
              label="Vendor"
              icon={<KeyboardArrowDownIcon />}
              className={yourBillsCss.chipLabel}
            />
          </div> */}
          <div
            className={classes.chips}
            onClick={() => onTriggerDrawer('sort')}
          >
            <Chip
              label="Sort"
              icon={<KeyboardArrowDownIcon />}
              className={yourBillsCss.chipLabel}
            />
          </div>
          {/* <div
            onClick={() => onTriggerDrawer('download')}
            className={css.downloadImg}
          >
            <img src={DownloadImg} alt="Well Done" />
          </div> */}
        </div>
      </div>
      {emailList.length === 0 && (
        <div className={css.nodatas}>No Data Found</div>
      )}
      <div className={yourBillsCss.yourBillInfoContainer}>
        {emailList.length > 0 &&
          emailList
            // .filter((y) => (draft ? y.status === 'draft' : true))
            .map((item) => {
              return (
                <Mui.Grid className={yourBillsCss.newMaindiv}>
                  {/* <Mui.Grid></Mui.Grid> */}
                  <div
                    key={item.id}
                    className={yourBillsCss.main}
                    onClick={() => {
                      handleRowSelection(item);
                      // onTriggerDrawer('yourBill');
                      // setSelectedBill(item);
                      // openRecordAnExpense(item);
                    }}
                  >
                    <div className={yourBillsCss.infoItem}>
                      <div className={yourBillsCss.infoTitle}>
                        {item.vendor && item.vendor.name?.toLowerCase()}
                      </div>
                      {item.status === 'draft' && (
                        <div className={yourBillsCss.draftLabel}>Draft</div>
                      )}
                    </div>
                    <div className={yourBillsCss.infoItem}>
                      <p className={yourBillsCss.key}>Bill Number</p>
                      <p className={yourBillsCss.value}>
                        {item.document_number || '-'}
                      </p>
                    </div>
                    <div className={yourBillsCss.infoItem}>
                      <p className={yourBillsCss.key}>Payment Amount</p>
                      <p className={yourBillsCss.value}>
                        {FormattedAmount(item?.amount)}
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setDialogDelete(true);
                    }}
                    className={yourBillsCss.keyDelete}
                  >
                    <img src={deleteBin} alt="delete" />{' '}
                  </div>
                </Mui.Grid>
              );
            })}
      </div>
      <SelectBottomSheet
        open={addDrawer}
        addNewSheet
        onClose={() => {
          setAddDrawer(false);
        }}
        triggerComponent={<span style={{ display: 'none' }} />}
      >
        <Puller />
        <Mui.Stack className={css.addStack}>
          <Mui.Typography className={css.heading}>
            Add a Provider’s Email ID
          </Mui.Typography>
          <TextfieldStyle label="Email ID*" />
          <TextfieldStyle label="Nickname" />
          <Mui.Stack className={css.btnStack}>Add Now</Mui.Stack>
        </Mui.Stack>
      </SelectBottomSheet>
      <SelectBottomSheet
        triggerComponent
        open={drawer.date}
        name="date"
        onClose={() => {
          handleBottomSheetClose('date');
        }}
        addNewSheet
      >
        <div className={css.dateWrapper}>
          {/* <MuiDatePicker
            selectedDate={fromDate}
            label="Start Date"
            onChange={(m) => setFromDate(m.format('YYYY-MM-DD'))}
          /> */}

          <div
            style={{
              border: '1px solid #A0A4AF',
              borderRadius: '10px',
              width: '90%',
              padding: '5px',
              margin: '10px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontStyle: 'light',
                color: '#283049',
              }}
            >
              Start Date
            </div>
            <div
              style={{
                marginLeft: '5px',
                marginTop: '5px',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#283049',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: '5px',
              }}
            >
              <input
                type="text"
                value={
                  fromDate === null
                    ? 'dd-mm-yy'
                    : moment(fromDate).format('DD-MM-YYYY')
                }
                style={{
                  pointerEvents: 'none',
                  width: '70%',
                  border: 'none',
                }}
              />

              <SelectBottomSheet
                name="startDate"
                addNewSheet
                triggerComponent={
                  <CalendarIcon
                    style={{ width: 20, color: '#949494' }}
                    onClick={() => {
                      onTriggerDrawer('startDate');
                    }}
                  />
                }
                open={drawer.startDate}
                // value={taxValue}
                onTrigger={onTriggerDrawer}
                onClose={() => {
                  setDrawer((d) => ({ ...d, startDate: false }));
                }}
                // maxHeight="45vh"
              >
                <Calender
                  head="Select Start Date"
                  button="Select"
                  handleDate={handleStartDate}
                />
              </SelectBottomSheet>
            </div>
          </div>
        </div>
        <div className={css.dateWrapper}>
          {/* <MuiDatePicker
            selectedDate={toDate}
            label="End Date"
            onChange={(m) => setToDate(m.format('YYYY-MM-DD'))}
          /> */}

          <div
            style={{
              border: '1px solid #A0A4AF',
              borderRadius: '10px',
              width: '90%',
              padding: '5px',
              margin: '10px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontStyle: 'light',
                color: '#283049',
              }}
            >
              End Date
            </div>
            <div
              style={{
                marginLeft: '5px',
                marginTop: '5px',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#283049',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: '5px',
              }}
            >
              <input
                type="text"
                style={{
                  pointerEvents: 'none',
                  width: '70%',
                  border: 'none',
                }}
                value={
                  toDate === null
                    ? 'dd-mm-yy'
                    : moment(toDate).format('DD-MM-YYYY')
                }
              />
              <SelectBottomSheet
                name="endDate"
                addNewSheet
                triggerComponent={
                  <CalendarIcon
                    style={{ width: 20, color: '#949494' }}
                    onClick={() => {
                      onTriggerDrawer('endDate');
                    }}
                  />
                }
                open={drawer.endDate}
                // value={taxValue}
                onTrigger={onTriggerDrawer}
                onClose={() => {
                  setDrawer((d) => ({ ...d, endDate: false }));
                }}
                // maxHeight="45vh"
              >
                <Calender
                  head="Select End Date"
                  button="Select"
                  handleDate={handleEndDate}
                />
              </SelectBottomSheet>
            </div>
          </div>
        </div>
      </SelectBottomSheet>
      <SelectBottomSheet
        triggerComponent
        open={drawer.viewBill}
        name="yourBill"
        onClose={() => {
          handleBottomSheetClose('viewBill');
        }}
        addNewSheet
      >
        <div className={css.mainContainer}>
          {selectedBill.document_number && (
            <Mui.Grid className={css.yourBillsViewEditIcon}>
              <div className={[css.headerContainer]}>
                <div className={css.headerLabel}>
                  {selectedBill.document_number
                    ? selectedBill.document_number
                    : '-'}
                </div>
                <span className={css.headerUnderline} />
              </div>
              <Mui.Stack direction="row" className={css.viewAndEditMobile}>
                <Mui.Grid
                  onClick={() => {
                    setViewBill(true);
                    setFile(selectedBill.file_url);
                  }}
                  style={{ display: selectedBill.file_url ? '' : 'none' }}
                >
                  <img
                    src={viewYourBills}
                    className={css.editButton}
                    alt="viewYourbills"
                  />{' '}
                </Mui.Grid>
                <Mui.Grid>
                  <img
                    src={editYourBills}
                    className={css.editButton}
                    alt="editYourBills"
                  />{' '}
                </Mui.Grid>
              </Mui.Stack>
            </Mui.Grid>
          )}
          <div className={css.parentDrawerContainer}>
            <p className={css.label}>Vendor</p>
            <p className={css.value}>
              {(selectedBill.vendor && selectedBill.vendor.name) || '-'}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Amount</p>
            <p className={css.value}>{FormattedAmount(selectedBill?.amount)}</p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Expense Category</p>
            <p className={css.value}>
              {(selectedBill.expense_category &&
                selectedBill.expense_category.name) ||
                '-'}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Payment Mode</p>
            <p className={css.value}>
              {selectedBill?.payment_mode &&
                paymentStatusListWithBill?.find(
                  (v) => v.id === selectedBill.payment_mode,
                ).label}
              {/* {(selectedBill.payment_mode === 'to_pay' ? 'To Pay' : '') || '-'} */}
            </p>
          </div>
          {/* <div className={css.drawerContainer}>
                <p className={css.label}>Location</p>
                <p className={css.value}>{selectedBill.location || ''}</p>
              </div> */}
          <div className={css.drawerContainer}>
            <p className={css.label}>Description</p>
            <p className={css.value}>{selectedBill.description || '-'}</p>
          </div>
        </div>
      </SelectBottomSheet>

      <SelectBottomSheet
        open={dialogDelete}
        addNewSheet
        onClose={() => {
          setDialogDelete(false);
        }}
        triggerComponent={<span style={{ display: 'none' }} />}
      >
        <Mui.Grid className={yourBillsCss.deleteMainDiv}>
          <Mui.Grid>
            <Mui.Typography className={yourBillsCss.deletetitle}>
              Heads Up !
            </Mui.Typography>

            <Mui.Divider
              className={yourBillsCss.deleteDivider}
              variant="fullWidth"
            />
          </Mui.Grid>
          <Mui.Grid className={yourBillsCss.deleteDescription}>
            {' '}
            Are you sure that you want to delete this Bill?
          </Mui.Grid>
          <Mui.Stack direction="row" className={yourBillsCss.buttonWidth}>
            <Mui.Button
              className={yourBillsCss.CancelButton}
              // onClick={() => {
              //   postEmailList();
              // }}
            >
              Cancel
            </Mui.Button>
            <Mui.Button
              className={yourBillsCss.submitButton}
              // onClick={() => {
              //   postEmailList();
              // }}
            >
              Confirm
            </Mui.Button>
          </Mui.Stack>
        </Mui.Grid>
      </SelectBottomSheet>
      <SelectBottomSheet
        triggerComponent
        open={drawer.sort}
        name="sort"
        onClose={() => {
          handleBottomSheetClose('sort');
        }}
        addNewSheet
      >
        <div className={yourBillsCss.list}>
          {sortOptions.map((v) => (
            <div
              className={yourBillsCss.categoryOptions}
              // onClick={() => onSortChange(v)}
              onClick={() => {
                onSortChange(v);
                handleBottomSheetClose('sort');
              }}
              key={v.id}
              role="menuitem"
            >
              {v.name}
            </div>
          ))}
        </div>
      </SelectBottomSheet>
      <Mui.Dialog
        PaperProps={{
          elevation: 3,
          style: {
            width: '86%',
            height: file.includes('.pdf') ? '100%' : '',
            // position: 'absolute',

            // overflow: 'visible',
            borderRadius: 16,
            cursor: 'pointer',
          },
        }}
        open={viewBill}
        onClose={() => setViewBill(false)}
      >
        <Mui.DialogContent className={yourBillsCss.DocumentViewerAddAndManage}>
          <Mui.Grid className={css.iframeViewDocument}>
            {/* <iframe
                src={file?.replace(
                  'div.nobreak{page-break-inside:avoid}',
                  'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}',
                )}
                title="html"
                frameBorder="0"
                // scrolling="no"
                // seamless="seamless"
                className={css.scrolling}
              /> */}
            {file.includes('.jpeg') ||
            file.includes('.png') ||
            file.includes('.pdf') === false ? (
              <img src={file} alt="upload" style={{ width: '100%' }} />
            ) : (
              Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                // <TransformWrapper>
                //   <TransformComponent>
                <Document
                  file={file}
                  className={css.pdfStyle}
                  loading="  "
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={i} className={css.page} />
                </Document>
                // </TransformComponent>
                // </TransformWrapper>
              ))
            )}
          </Mui.Grid>
        </Mui.DialogContent>
      </Mui.Dialog>
    </Mui.Stack>
  ) : (
    // web

    <>
      {' '}
      {/* {syncEmails?.length > 0 !== null ? ( */}
      <>
        <div style={{ padding: '0px  0px 0px 0px', width: '100%' }}>
          {/* {click === 'tab1' ? ( */}
          <Mui.Stack direction="column" className={css.stackAdd}>
            <Mui.Stack direction="row" alignItems="normal">
              <Mui.Typography className={css.addTitle}>
                {state?.email}
              </Mui.Typography>
            </Mui.Stack>
          </Mui.Stack>
          <Mui.Stack direction="column" className={css.stackAdd}>
            <Mui.Typography className={css.addTitle}>
              Bills From {state?.datas?.name}
            </Mui.Typography>
          </Mui.Stack>
          <Mui.Stack direction="row" justifyContent="space-between">
            <Mui.Stack direction="row">
              <div
                className={css.searchFilter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0px 0px 40px rgba(48, 73, 191, 0.05)',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  height: '34px',
                  width: '87%',
                  paddingLeft: '5%',
                }}
              >
                <SearchIcon
                  style={{ color: '#af9d9d' }}
                  className={css.searchFilterIcon}
                />{' '}
                <input
                  placeholder="Search for..."
                  className={css.searchFilterInput}
                  style={{
                    border: 'none',
                    overflow: 'auto',
                    fontSize: '14px',
                    fontWeight: '500',
                    width: '100%',
                    marginLeft: '4px',
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* <Mui.Stack
                onClick={(e) => {
                  handleClick(e, 'calendar');
                }}
                direction="row"
                className={css.webAccountPage3}
              >
                <Mui.Grid className={css.webAccControlFont}>Date</Mui.Grid>
                <Mui.Grid className={css.webDownArrow}>
                  <KeyboardArrowDownIcon className={css.webArrowDown} />
                </Mui.Grid>
              </Mui.Stack> */}

              {/* <Mui.Stack
                direction="row"
                className={css.webAccountPage3}
                onClick={(event) => handleClick(event, 'list')}
              >
                <Mui.Grid className={css.webAccControlFont}>Vendor</Mui.Grid>
                <Mui.Grid className={css.webDownArrow}>
                  <img
                    src={addManageVendor}
                    className={css.webAddManageVendor}
                    alt="addAndManage"
                  />
                </Mui.Grid>
              </Mui.Stack> */}
            </Mui.Stack>
            {/* <Mui.Stack direction="row"> */}
            {/* <Mui.Stack
                direction="row"
                onClick={(e) => {
                  onTriggerDrawer('sort');
                  handleClick(e);
                }}
                className={css.webAccountPage3}
              >
                <Mui.Grid className={css.webAccControlFont}>Sort by</Mui.Grid>
                <Mui.Grid className={css.webDownArrow}>
                  <KeyboardArrowDownIcon className={css.webArrowDown} />
                </Mui.Grid>
              </Mui.Stack> */}
            {/* <img
                src={addmngDownload}
                className={css.addManageDownload}
                alt="addAndManage"
              /> */}
            {/* </Mui.Stack> */}
          </Mui.Stack>
          {/* ) : (
              <Mui.Stack direction="column" className={css.stackAdd}>
                <Mui.Typography className={css.addTitle}>Remove</Mui.Typography>
                <Mui.Typography className={css.add}>
                  List of Providers whose Emails are scanned for Bills :{' '}
                </Mui.Typography>
              </Mui.Stack>
            )} */}
          <Mui.Stack spacing={2} className={css.ptContainer}>
            <Mui.Box className={css.datagridBox}>
              <DataGrid
                rows={emailList}
                columns={columns}
                // onCellClick={OnClickFunction}
                // pageSize={5}
                rowsPerPageOptions={[]}
                // checkboxSelection
                // disableSelectionOnClick
                autoHeight
                components={{
                  NoRowsOverlay: () => (
                    <Mui.Stack
                      height="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      No Data Found
                    </Mui.Stack>
                  ),
                }}
                sx={{
                  '.MuiDataGrid-columnSeparator': {
                    display: 'none',
                  },
                  '.MuiDataGrid-main': {
                    borderRadius: '30px',
                  },
                  '.MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader:first-of-type, .MuiDataGrid-row .MuiDataGrid-cell:first-of-type':
                    {
                      paddingLeft: '35px',
                    },
                  '&.MuiDataGrid-root': {
                    border: 'none',
                    background: '#fff',
                    borderRadius: '30px',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontSize: '14px',
                    Font: 'Lexend',
                    Weight: 500,
                  },
                  '& .MuiDataGrid-footerContainer': {
                    display: 'none',
                  },
                  '& .MuiDataGrid-columnHeader:focus,.MuiDataGrid-cell:focus,.MuiDataGrid-columnHeader:focus-within,,.MuiDataGrid-cell:focus-within':
                    {
                      outline: 'none',
                    },
                  '& .MuiDataGrid-row.Mui-selected ': {
                    background: 'none',
                  },
                  '& .MuiDataGrid-row.Mui-selected:hover ': {
                    background: 'rgba(0, 0, 0, 0.04)',
                  },
                  '& .MuiDataGrid-columnHeader--moving': {
                    backgroundColor: 'white !important',
                  },
                  // '& .MuiDataGrid-menuIcon': {
                  //   display: 'none',
                  // },
                  // '& .MuiDataGrid-sortIcon': {
                  //   visibility: 'hidden',
                  //   color: 'white !important',
                  // },
                  // '& .css-ltf0zy-MuiDataGrid-iconButtonContainer': {
                  //   backgroundColor: 'red !important',
                  //   visibility: 'hidden !important',
                  //   position: 'absolute',
                  //   top: 0,
                  //   height: '1px',
                  // },
                }}
              />
            </Mui.Box>

            <Mui.Popover
              id="basic-menu-sort"
              anchorEl={anchorElCalendar}
              open={openCalendar}
              onClose={() => setAnchorElCalendar(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                elevation: 3,
                style: {
                  maxHeight: 500,
                  width: '40ch',
                  padding: '18px',
                  borderRadius: 20,
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div className={css.dateWrapper}>
                {/* <MuiDatePicker
                      selectedDate={fromDate}
                      label="Start Date"
                      onChange={(m) => setFromDate(m.format('YYYY-MM-DD'))}
                    /> */}
                <span>Select the start and end date to filter</span>
                <hr className={css.forline} />
                <div className={css.startDateDiv}>
                  <div
                    style={{
                      fontSize: '11px',

                      fontStyle: 'light',

                      color: '#283049',
                    }}
                  >
                    Start Date
                  </div>

                  <div
                    style={{
                      marginLeft: '5px',
                      marginTop: '5px',
                      fontSize: '14px',
                      fontStyle: 'bold',
                      color: '#283049',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      margin: '5px',
                    }}
                  >
                    <input
                      type="text"
                      value={
                        webValue.fromDate
                          ? moment(webValue.fromDate).format('DD-MM-YYYY')
                          : 'dd-mm-yyyy'
                      }
                      style={{
                        width: '100%',
                        border: 'none',
                        padding: 5,
                      }}
                    />
                    <OnlyDatePicker
                      // className={css.avatarForDate}
                      selectedDate={fromDate || new Date()}
                      // label={new Date(invoiceDate).toLocaleDateString()}
                      onChange={handleStartDate}
                    />
                  </div>
                </div>
              </div>
              <div className={css.dateWrapper}>
                {/* <MuiDatePicker
                    selectedDate={toDate}
                    label="End Date"
                    onChange={(m) => setToDate(m.format('YYYY-MM-DD'))}
                  /> */}
                <div className={css.startDateDiv}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontStyle: 'light',
                      color: '#283049',
                    }}
                  >
                    End Date
                  </div>

                  <div
                    style={{
                      marginLeft: '5px',
                      marginTop: '5px',
                      fontSize: '14px',
                      fontStyle: 'bold',
                      color: '#283049',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      margin: '5px',
                    }}
                  >
                    <input
                      type="text"
                      value={
                        webValue.toDate
                          ? moment(webValue.toDate).format('DD-MM-YYYY')
                          : 'dd-mm-yyyy'
                      }
                      style={{
                        width: '100%',
                        border: 'none',
                        padding: 5,
                      }}
                    />

                    <OnlyDatePicker
                      // className={css.avatarForDate}
                      selectedDate={toDate || new Date()}
                      // label={new Date(invoiceDate).toLocaleDateString()}
                      onChange={handleEndDate}
                    />
                  </div>
                </div>
                <Mui.Button
                  contained
                  className={css.applyDateButton}
                  onClick={() => {
                    // setCustomerID(false);
                    setFromDate(webValue.fromDate);
                    setToDate(webValue.toDate);
                    // setOrderBy('');
                    // setValue('');
                    setAnchorElCalendar({
                      ...anchorElCalendar,
                      date: null,
                    });
                  }}
                  disabled={!webValue.fromDate || !webValue.toDate}
                >
                  Apply Filters
                </Mui.Button>
              </div>
            </Mui.Popover>

            <Mui.Popover
              id="basic-menu-list"
              anchorEl={anchorElForList}
              open={Boolean(anchorElForList)}
              onClose={() => {
                setAnchorElForList(null);
                handleBottomSheet('date');
              }}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                elevation: 3,
                style: {
                  maxHeight: 500,
                  width: '35ch',
                  padding: '5px',
                  overflow: 'hidden',
                  borderRadius: 20,
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div className={classes.searchInput}>
                <span>Select Vendor</span>
                <hr className={css.forline} />
                <Input
                  name="search"
                  placeholder="Search Vendor"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    type: 'text',
                    startAdornment: (
                      <img
                        src={SearchIcon2}
                        alt="search"
                        className={css.searchVendor}
                      />
                    ),
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                />
                <div
                  style={{
                    minHeight: 'auto',
                    maxHeight: '49vh',
                    overflow: 'auto',
                  }}
                >
                  {states &&
                    states.vendors &&
                    states.vendors
                      ?.filter((val) =>
                        val.name
                          .toLowerCase()
                          .includes(searchQuery?.toLowerCase()),
                      )
                      .map((item) => {
                        return (
                          <div
                            className={css.checkboxList}
                            key={item.id}
                            role="menuitem"
                          >
                            <Checkbox
                              className={classes.checkbox}
                              checked={item.check}
                              inputProps={{ id: item.name }}
                              value={false}
                              icon={<UncheckedIcon />}
                              checkedIcon={<CheckedIcon />}
                              onChange={(e) => {
                                handleValueChange(item, e.target.checked);
                              }}
                            />
                            <div className={css.checkboxLabel}>
                              {(item?.name).toLowerCase()}
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            </Mui.Popover>

            <Mui.Popover
              id="basic-menu-sort"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                elevation: 3,
                style: {
                  maxHeight: 500,
                  width: '35ch',
                  padding: '5px',
                  borderRadius: 20,
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div className={css.effortlessOptions}>
                <div className={css.sortPopoverHeading}>
                  <span>Sort by</span>
                  <hr className={css.forline} />
                </div>
                <ul
                  className={css.optionsWrapper}
                  style={{ listStyleType: 'none' }}
                >
                  {sortOptions.map((e) => (
                    <li className={css.items} aria-hidden="true">
                      <Mui.RadioGroup
                        value={webValue.orderBy}
                        onChange={(event) => {
                          setWebValue({
                            ...webValue,
                            orderBy: event.target.value,
                          });
                        }}
                      >
                        <Mui.FormControlLabel
                          value={e.name}
                          control={<Mui.Radio style={{ color: '#F08B32' }} />}
                          label={e.name}
                        />
                      </Mui.RadioGroup>
                    </li>
                  ))}
                </ul>
                <Mui.Button
                  contained
                  className={css.applyFiltersButton}
                  onClick={() => {
                    onSortChange(
                      sortOptions.find(
                        (data) => data.name === webValue?.orderBy,
                      ),
                    );
                    setAnchorEl(null);
                  }}
                >
                  Apply Filters
                </Mui.Button>
              </div>
            </Mui.Popover>

            <SelectBottomSheet
              triggerComponent
              open={drawer.viewBill}
              name="yourBill"
              onClose={() => {
                handleBottomSheetClose('viewBill');
              }}
              addNewSheet
            >
              <Mui.Stack className={yourBillsCss.padLeft}>
                <>
                  <Mui.Grid className={yourBillsCss.yourBillsViewEditIcon}>
                    <Mui.Grid
                      style={{
                        paddingBottom: '32px',
                        fontSize: '16px',
                      }}
                      className={yourBillsCss.BottomSheetContent}
                    >
                      {selectedBill?.document_number || '-'}
                    </Mui.Grid>
                    <img
                      src={editYourBills}
                      className={yourBillsCss.editButton}
                      alt="delete"
                    />{' '}
                  </Mui.Grid>
                  <Mui.Stack className={yourBillsCss.padBottom}>
                    <Mui.Grid className={yourBillsCss.bottomSheetTitle}>
                      Vendor
                    </Mui.Grid>
                    <Mui.Grid className={yourBillsCss.BottomSheetContent}>
                      {(selectedBill?.vendor && selectedBill?.vendor.name) ||
                        '-'}
                    </Mui.Grid>
                  </Mui.Stack>
                  <Mui.Stack className={yourBillsCss.padBottom}>
                    <Mui.Grid className={yourBillsCss.bottomSheetTitle}>
                      Amount
                    </Mui.Grid>
                    <Mui.Grid className={yourBillsCss.BottomSheetContent}>
                      {FormattedAmount(selectedBill?.amount)}
                    </Mui.Grid>
                  </Mui.Stack>
                  <Mui.Stack className={yourBillsCss.padBottom}>
                    <Mui.Grid className={yourBillsCss.bottomSheetTitle}>
                      Expense Category
                    </Mui.Grid>
                    <Mui.Grid className={yourBillsCss.BottomSheetContent}>
                      {selectedBill?.expense_category?.name || '-'}
                    </Mui.Grid>
                  </Mui.Stack>
                  <Mui.Stack className={yourBillsCss.padBottom}>
                    <Mui.Grid className={yourBillsCss.bottomSheetTitle}>
                      Payment Mode
                    </Mui.Grid>
                    <Mui.Grid className={yourBillsCss.BottomSheetContent}>
                      {selectedBill?.payment_mode || '-'}
                    </Mui.Grid>
                  </Mui.Stack>
                  {/* <Mui.Stack className={yourBillsCss.padBottom}>
                            <Mui.Grid className={yourBillsCss.bottomSheetTitle}>
                              Location
                            </Mui.Grid>
                            <Mui.Grid className={yourBillsCss.BottomSheetContent}>
                              {e.location}
                            </Mui.Grid>
                          </Mui.Stack> */}
                  <Mui.Stack className={yourBillsCss.padBottom}>
                    <Mui.Grid className={yourBillsCss.bottomSheetTitle}>
                      Description
                    </Mui.Grid>
                    <Mui.Grid className={yourBillsCss.BottomSheetContent}>
                      {selectedBill?.description || '-'}
                    </Mui.Grid>
                  </Mui.Stack>
                  <Mui.Stack
                    direction="row"
                    className={yourBillsCss.buttonWidthWeb}
                  >
                    <Mui.Button
                      className={yourBillsCss.deleteWeb}
                      onClick={() => setDialogDelete(true)}
                    >
                      Delete
                    </Mui.Button>
                    <Mui.Button
                      style={{ display: selectedBill.file_url ? '' : 'none' }}
                      className={yourBillsCss.viewBillDesktop}
                      onClick={() => {
                        setViewBill(true);
                        setFile(selectedBill.file_url);
                      }}
                    >
                      View Bill Uploaded
                    </Mui.Button>
                    <Mui.Dialog
                      PaperProps={{
                        elevation: 3,
                        style: {
                          width: '86%',
                          // position: 'absolute',

                          overflow: 'visible',
                          borderRadius: 16,
                          cursor: 'pointer',
                        },
                      }}
                      open={dialogDelete}
                      onClose={() => setDialogDelete(false)}
                    >
                      <Mui.DialogContent>
                        <Mui.Grid
                        // className={yourBillsCss.deleteMainDiv}
                        >
                          <Mui.Grid>
                            <Mui.Typography
                              className={yourBillsCss.deletetitle}
                            >
                              Heads Up !
                            </Mui.Typography>

                            <Mui.Divider
                              className={yourBillsCss.deleteDivider}
                              variant="fullWidth"
                            />
                          </Mui.Grid>
                          <Mui.Grid
                            className={yourBillsCss.deleteDescriptionDesktop}
                          >
                            {' '}
                            Are your sure that you want to delete this bill?
                          </Mui.Grid>
                          <Mui.Grid
                            className={yourBillsCss.deleteDescriptionDesktop2}
                          >
                            {' '}
                            Please note that all data associated with this bill
                            will be permanently deleted.
                          </Mui.Grid>
                          <Mui.Stack
                            direction="row"
                            className={yourBillsCss.buttonWidth}
                          >
                            <Mui.Button
                              className={yourBillsCss.CancelButton}
                              // onClick={() => {
                              //   postEmailList();
                              // }}
                            >
                              Cancel
                            </Mui.Button>
                            <Mui.Button
                              className={yourBillsCss.submitButton}
                              // onClick={() => {
                              //   postEmailList();
                              // }}
                            >
                              Confirm
                            </Mui.Button>
                          </Mui.Stack>
                        </Mui.Grid>
                      </Mui.DialogContent>
                    </Mui.Dialog>
                  </Mui.Stack>
                </>
              </Mui.Stack>
            </SelectBottomSheet>

            <Mui.Dialog
              PaperProps={{
                elevation: 3,
                style: {
                  width: '86%',
                  height: file.includes('.pdf') ? '100%' : '',
                  // position: 'absolute',

                  // overflow: 'visible',
                  borderRadius: 16,
                  cursor: 'pointer',
                },
              }}
              open={viewBill}
              onClose={() => setViewBill(false)}
            >
              <Mui.DialogContent
                className={yourBillsCss.DocumentViewerAddAndManage}
              >
                <Mui.Grid className={css.iframeViewDocument}>
                  {/* <iframe
                src={file?.replace(
                  'div.nobreak{page-break-inside:avoid}',
                  'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}',
                )}
                title="html"
                frameBorder="0"
                // scrolling="no"
                // seamless="seamless"
                className={css.scrolling}
              /> */}
                  {file.includes('.jpeg') ||
                  file.includes('.png') ||
                  file.includes('.pdf') === false ? (
                    <img src={file} alt="upload" style={{ width: '100%' }} />
                  ) : (
                    Array.from({ length: pageNumber }, (_, i) => i + 1).map(
                      (i) => (
                        // <TransformWrapper>
                        //   <TransformComponent>
                        <Document
                          file={file}
                          className={css.pdfStyle}
                          loading="  "
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={i} className={css.page} />
                        </Document>
                        // </TransformComponent>
                        // </TransformWrapper>
                      ),
                    )
                  )}
                </Mui.Grid>
              </Mui.DialogContent>
            </Mui.Dialog>
          </Mui.Stack>
        </div>
      </>
      {/* ) : (
        <></>
      )} */}
    </>
  );
};

export default AddAndManageStatement;
