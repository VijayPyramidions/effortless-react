import React, {
  useState,
  useContext,
  // useEffect
} from 'react';
// import { DropdownIcon } from '@components/SvgIcons/SvgIcons.jsx';
import SearchIcon2 from '@assets/search.svg';
import DownloadAgeing from '@assets/DownloadAgeing.svg';
import DownloadIcon from '@mui/icons-material/Download';
import JSBridge from '@nativeBridge/jsbridge';
import SearchIcon from '@material-ui/icons/Search';
import * as themes from '@root/theme.scss';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
// import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { Grid, makeStyles, Chip } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
// import CustomFilterPro from '@components/ProCustomFilter/CustomFilterPro';
import { DataGridPremium } from '@mui/x-data-grid-premium';
// import { FormattedAmount } from '@components/formattedValue/FormattedValue';
// import * as theme from '@root/theme.scss';
import * as Mui from '@mui/material';
import AppContext from '@root/AppContext.jsx';
// import RupeesReceivables from '@assets/WebAssets/RupeesReceivables.svg';
import * as Router from 'react-router-dom';
import moment from 'moment';

import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import * as cssTextField from '../Components/SearchTextfield';
// import ReceivablesPopOver from '../Components/ReceivablesPopover';
import BillAgeingTable from '../Components/BillAgeingTable.jsx';
import * as css from './Ageing.scss';

const useStyles = makeStyles(() => ({
  chips: {
    marginRight: '5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
    },
    '& .MuiChip-icon': {
      marginRight: '2px',
      marginLeft: '2px',
    },
  },
  chipsWeb: {
    marginRight: '20px',
    '& .MuiChip-root': {
      background: 'white',
      flexDirection: 'row-reverse !important',
      justifyContent: 'space-between',
      height: '36px',
      border: '1px solid #999ea566 !important',
      borderRadius: '4px !important',
    },
    '& .MuiChip-icon': {
      marginRight: '12px',
    },
    '& ..MuiChip-label': {
      fontSize: '12px',
      fontWeight: 400,
    },
  },
  searchInput: {
    margin: '0 20px',
    padding: '5px 10px 0 0',
    '& .MuiTextField-root': {
      paddingLeft: '8px',
      marginBottom: '8px',
      border: '1px solid rgb(180 175 174)',
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

  table: {
    minWidth: 650,
  },
  sticky: {
    position: 'sticky',
    left: 0,
    background: 'white',
    borderRight: '1px solid #F5F5F5',
    borderBottom: '1px solid #F5F5F5 !important',
  },
}));

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function Agening({ userRoles }) {
  const classes = useStyles();
  const navigate = Router.useNavigate();

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [totals, setTotals] = useState([]);
  const [month, setMonth] = useState('By Bucket ( Days )');
  const [value2, setValue2] = useState('');
  const device = localStorage.getItem('device_detect');

  const { organization, enableLoading, user, loading, openSnackBar } =
    useContext(AppContext);
  const [anchorElDateP, setAnchorElDateP] = React.useState({
    value: new Date(),
    opened: null,
  });

  const [columnHeader, setColumnHeader] = React.useState('');

  const [filterCustListTemp, setFilterCustListTemp] = React.useState([]);

  const [anchorElMonth, setAnchorElMonth] = React.useState(null);
  const [valueOptionsFilter, setValueOptionsFilter] = React.useState([]);

  React.useEffect(() => {
    if (
      Object.keys(userRoles?.['Vendor Ageing'] || {})?.length > 0 &&
      userRoles?.['Vendor Ageing']?.view_payable_ageing
    ) {
      enableLoading(true);
      RestApi(
        `organizations/${organization.orgId}/payables/ageing?${`date=${moment(
          anchorElDateP.value
        ).format('YYYY-MM-DD')}`}${value2 && `&report_view=${value2}`}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        }
      )
        .then((res) => {
          if (res && !res.error && !res?.message) {
            setTotals(res?.totals);
            setData(res?.data);
            setData2(res);
          }
          enableLoading(false);
        })
        .catch(() => {
          enableLoading(false);
          openSnackBar({
            message: `Sorry we will look into in`,
            type: MESSAGE_TYPE.ERROR,
          });
        });
    }
  }, [
    organization.orgId,
    user.activeToken,
    anchorElDateP.value,
    value2,
    userRoles?.['Vendor Ageing'],
  ]);

  const triggerDownlaod = () => {
    if (device === 'mobile') {
      JSBridge.downloadWithAuthentication(
        `${BASE_URL}/organizations/${
          organization.orgId
        }/payables/ageing.xlsx?${`date=${moment(anchorElDateP.value).format(
          'YYYY-MM-DD'
        )}`}${value2 && `&report_view=${value2}`}`
      );
    } else {
      enableLoading(true);
      fetch(
        // `${BASE_URL}/organizations/${organization.orgId}/receivables/ageing.xlsx`,
        // `${BASE_URL}/organizations/${organization.orgId}/receivables/ageing.xlsx?report_view=monthwise`,
        `${BASE_URL}/organizations/${
          organization.orgId
        }/payables/ageing.xlsx?${`date=${moment(anchorElDateP.value).format(
          'YYYY-MM-DD'
        )}`}${value2 && `&report_view=${value2}`}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        }
      )
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ageing';
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      enableLoading(false);
    }
  };

  const [searchValue, setSearchValue] = React.useState('');
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  // const sortedData =
  //   value === 'Ascending'
  //     ? data?.sort((a, b) => a?.total_amount - b?.total_amount)
  //     : data?.sort((a, b) => b?.total_amount - a?.total_amount);

  React.useEffect(() => {
    if (searchValue?.length === 0) {
      setFilteredUsers(data);
    } else {
      const temp = data.filter((val) => {
        return val?.name?.toLowerCase().includes(searchValue?.toLowerCase());
      });
      setFilteredUsers(temp);
    }
  }, [searchValue, data]);

  React.useEffect(() => {
    if (filterCustListTemp?.length === 0) {
      setFilteredUsers(data);
    } else {
      const temp = data.filter((val) => {
        return filterCustListTemp?.includes(val.id);
      });
      setFilteredUsers(temp);
    }
  }, [filterCustListTemp]);

  React.useEffect(() => {
    setData([]);
    setData2([]);
    setTotals([]);
  }, [value2]);

  React.useEffect(() => {
    if (device === 'desktop') {
      const temp = Array.from(
        new Set(data?.map((invoice) => invoice?.name))
      ).map((customerName) => ({ value: customerName, label: customerName }));
      setValueOptionsFilter(temp);
    }
  }, [device, data]);

  const Bucket = (e) => {
    setMonth(e);
    if (e === 'By Bucket ( Days )') {
      setValue2('');
    } else if (e === 'By Billing Month') {
      setValue2('monthwise');
    }
    setAnchorElMonth(null);
  };

  const handleClick = (params) => {
    if (params?.id === 'auto-generated-group-footer-root') {
      return;
    }

    const { field, row } = params;
    if (
      field === 'name' ||
      field === 'total_debits' ||
      field === 'net_balance'
    ) {
      navigate('/payables-ageing-view', {
        state: {
          tableId: row?.id,
          selectedDate: anchorElDateP.value,
          wise: value2,
          tabState: 'total',
        },
      });
    } else if (field === 'unsettled_credits') {
      navigate('/payables-ageing-view', {
        state: {
          tableId: row?.id,
          selectedDate: anchorElDateP.value,
          wise: value2,
          tabState: 'unsettled_cr',
        },
      });
    } else {
      navigate('/payables-ageing-view', {
        state: {
          tableId: row?.id,
          selectedDate: anchorElDateP.value,
          wise: value2,
          tabState: `${field.split('?.')?.[1]}_cr`,
        },
      });
    }
  };

  const columnsAgeingDay = [
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (params) => params.value,
      minWidth: 350,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
      cellClassName: 'nameField',
      flex: 1,
    },
    {
      field: 'net_balance',
      headerName: 'Net Balance',
      type: 'number',
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'age_buckets?.not_due',
      headerName: 'Not Due',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.not_due,
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'age_buckets?.1_to_30',
      headerName: '1 To 30',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.['1_to_30'],
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'age_buckets?.31_to_60',
      headerName: '31 To 60',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.['31_to_60'],
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'age_buckets?.61_to_120',
      headerName: '61 To 120',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.['61_to_120'],
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'age_buckets?.121_to_180',
      headerName: '121 To 180',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.['121_to_180'],
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'age_buckets?.181_to_360',
      headerName: '181 To 360',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.['181_to_360'],
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'age_buckets?.above_360',
      headerName: 'Above 360',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.above_360,
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'total_debits',
      headerName: 'Total Credits',
      type: 'number',
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
      // align: 'center',
    },
    {
      field: 'age_buckets?.advance',
      headerName: 'Advance',
      type: 'number',
      valueGetter: (params) => params.row.age_buckets?.advance,
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'unsettled_credits',
      headerName: 'Unsettled Debits',
      type: 'number',
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: 'negative-amount',
      align: 'center',
    },
  ];

  const handleScroll = (event) => {
    const currentPosition = event.target.scrollLeft;
    setScrollPosition(currentPosition);
  };

  React.useEffect(() => {
    setTimeout(() => { 
      const element = document.querySelector('.MuiDataGrid-cellContent');
      if (element) {
      element.classList.add('MuiDataGrid-footerCell');
      element.innerHTML = 'Total';
  }
    }, 100);
  }, [document.querySelector('.MuiDataGrid-cellContent'), filteredUsers, scrollPosition]);
  return (
    <div className={css.ageing}>
      {device === 'mobile' ? (
        <>
          <Mui.Typography className={css.titleHead}>
            Vendor Ageing
          </Mui.Typography>
          <Grid item xs={12} className={css.mainContainer}>
            <CssTextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={SearchIcon2} alt="Well Done" />
                  </InputAdornment>
                ),
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <div
                //       className={css.monthSelection}
                //       onClick={() => setDrawer(true)}
                //     >
                //       <div className={css.text}>Sort by</div>
                //       <DropdownIcon className={css.icon} />
                //     </div>
                //   </InputAdornment>
                // ),
                style: {
                  backgroundColor: '#F2F2F0',
                  borderRadius: 20,
                  height: '40px',
                },
              }}
              placeholder="Search for a Vendor"
              fullWidth
              variant="outlined"
              className={css.MuiOutlinedInputRoot}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Grid>
          <>
            <Mui.Stack
              direction="row"
              className={css.dropDownsOverflow}
              alignItems="center"
              sx={{
                margin: '3% 0 0 2%',
                width: '96%',
              }}
            >
              <Mui.Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                className={css.marginSortBy}
              >
                <div className={classes.chips}>
                  <Chip
                    label={
                      <Mui.Grid
                        style={{
                          fontSize: '10px',
                          width: '100px',
                          textOverflow: 'elipsis',
                        }}
                      >
                        Report View : {month}
                      </Mui.Grid>
                    }
                    icon={<KeyboardArrowDown />}
                    className={css.chipLabel2}
                    onClick={(event) => setAnchorElMonth(event.currentTarget)}
                  />
                </div>
              </Mui.Stack>
              <Mui.Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                className={css.marginSortBy}
              >
                <div className={classes.chips}>
                  <Chip
                    label={
                      <Mui.Grid
                        style={{
                          fontSize: '10px',
                          width: '90px',
                          textOverflow: 'elipsis',
                        }}
                      >
                        As of{' '}
                        {moment(anchorElDateP.value).format('DD MMM YYYY')}
                      </Mui.Grid>
                    }
                    icon={<KeyboardArrowDown />}
                    className={css.chipLabel2}
                    onClick={(event) =>
                      setAnchorElDateP({
                        value: anchorElDateP.value,
                        opened: event.currentTarget,
                      })
                    }
                  />
                </div>
              </Mui.Stack>
              {filteredUsers?.length > 0 && (
                <div
                  className={css.dowloadIcon}
                  onClick={() => triggerDownlaod()}
                  style={{ marginLeft: '10px' }}
                >
                  <img src={DownloadAgeing} width="30px" alt="Well Done" />
                </div>
              )}
            </Mui.Stack>
          </>
          {!loading && filteredUsers?.length > 0 ? (
            <Grid item xs={12} style={{ margin: '10px 0 0 0px' }}>
              {filteredUsers.map((val) => (
                <>
                  <BillAgeingTable
                    value={value2}
                    anchorElDateP={anchorElDateP}
                    data={val}
                    key={`${val.id}`}
                  />
                </>
              ))}
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Mui.Typography sx={{ m: '25%' }} align="center">
                {loading ? 'Data is being fetched' : 'No data Found '}
              </Mui.Typography>
            </Grid>
          )}
        </>
      ) : (
        <>
          {/* WEB */}
          <Mui.Typography className={css.ageingTitle}>
            {' '}
            Vendor Ageing
          </Mui.Typography>

          <Mui.Stack
            direction="row"
            className={css.searchAndSort}
            alignItems="center"
          >
            <Mui.Grid className={css.searchFilterPaya}>
              <SearchIcon style={{ color: '#af9d9d' }} />{' '}
              <input
                placeholder="Search For a Vendor"
                onChange={(event) => setSearchValue(event.target.value)}
                value={searchValue}
                className={css.textFieldFocus}
                style={{
                  border: 'none',
                  overflow: 'auto',
                  fontSize: '110px',
                  height: '30px',
                  width: '100%',
                }}
              />
            </Mui.Grid>

            <>
              <Mui.Stack
                direction="row"
                className={css.dropDownsOverflow}
                alignItems="center"
              >
                <Mui.Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className={css.marginSortBy}
                >
                  <div className={classes.chipsWeb}>
                    <Chip
                      style={{ width: '270px' }}
                      label={
                        <p style={{ margin: 0 }}>
                          Report View :{' '}
                          <span style={{ color: '#F08B32' }}>{month}</span>
                        </p>
                      }
                      icon={<KeyboardArrowDown />}
                      className={css.chipLabel2}
                      onClick={(event) => setAnchorElMonth(event.currentTarget)}
                    />
                  </div>
                </Mui.Stack>
                <Mui.Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className={css.marginSortBy}
                >
                  <div className={classes.chipsWeb}>
                    <Chip
                      style={{ width: '178px' }}
                      label={
                        <p style={{ margin: 0 }}>
                          As of{' '}
                          {moment(anchorElDateP.value).format('DD MMM YYYY')}
                        </p>
                      }
                      icon={<KeyboardArrowDown />}
                      className={css.chipLabel2}
                      onClick={(event) =>
                        setAnchorElDateP({
                          value: anchorElDateP.value,
                          opened: event.currentTarget,
                        })
                      }
                    />
                  </div>
                </Mui.Stack>
                {filteredUsers?.length > 0 && (
                  <Mui.Tooltip title="Download" placement="bottom-end">
                    <div
                      className={css.dowloadIconWeb}
                      onClick={() => triggerDownlaod()}
                    >
                      <DownloadIcon style={{ color: '#FFF' }} />
                      <p style={{ margin: 0, color: '#fff' }}>Download</p>
                    </div>
                  </Mui.Tooltip>
                )}
              </Mui.Stack>
            </>
          </Mui.Stack>
          {value2 === 'monthwise' && totals?.earlier_than !== undefined ? (
            <THead
              totals={totals}
              filteredUsers={filteredUsers}
              data2={data2}
              anchorElDateP={anchorElDateP}
              wise={value2}
              columnHeader={columnHeader}
              setColumnHeader={setColumnHeader}
              setFilterCustListTemp={setFilterCustListTemp}
              valueOptionsFilter={valueOptionsFilter}
            />
          ) : (
            <>
              {/* {!loading && filteredUsers?.length > 0 ? ( */}
              <Mui.Box
                sx={{
                  height: '80%',
                  width: '100%',
                  '& .left-align--header': {
                    '.MuiDataGrid-columnHeaderDraggableContainer': {
                      flexDirection: 'row !important',
                    },
                    '.MuiDataGrid-columnHeaderTitleContainer': {
                      flexDirection: 'row !important',
                    },
                    textAlign: 'left',
                  },
                  '& .negative-amount': {
                    color: '#950909',
                  },
                  '& .nameField': {
                    whiteSpace: 'break-spaces !important',
                  },
                }}
                onScroll={handleScroll}
              >
                <DataGridPremium
                  rows={filteredUsers}
                  columns={columnsAgeingDay}
                  // getRowHeight={() => 'auto'}
                  rowHeight={70}
                  hideFooter
                  disableRowSelectionOnClick
                  disableColumnReorder
                  disableColumnPinning
                  disableRowGrouping
                  // disableAggregation
                  disableColumnSelector
                  onCellClick={handleClick}
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
                  initialState={{
                    aggregation: {
                      model: {
                        net_balance: 'sum',
                        'age_buckets?.not_due': 'sum',
                        age_buckets: 'sum',
                        'age_buckets?.1_to_30': 'sum',
                        'age_buckets?.31_to_60': 'sum',
                        'age_buckets?.61_to_120': 'sum',
                        'age_buckets?.121_to_180': 'sum',
                        'age_buckets?.181_to_360': 'sum',
                        'age_buckets?.above_360': 'sum',
                        total_debits: 'sum',
                        'age_buckets?.advance': 'sum',
                        unsettled_credits: 'sum',
                      },
                    },
                  }}
                  sx={{
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #D6D8DB',
                    '& .MuiDataGrid-columnHeadersInner': {
                      background: '#F7F7F7',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      whiteSpace: 'break-spaces',
                      textAlign: 'center',
                      lineHeight: '20px',
                      fontFamily: "'Lexend', sans-serif !important",
                      fontWeight: '400 !important',
                      fontSize: '13px',
                    },
                    '& .MuiDataGrid-cell': {
                      fontFamily: "'Lexend', sans-serif !important",
                      fontWeight: '300 !important',
                      fontSize: '13px',
                    },
                    '& .MuiDataGrid-pinnedRows': {
                      borderBottomRightRadius: '8px !important',
                      borderBottomLeftRadius: '8px !important',
                    },
                    '& .MuiDataGrid-footerCell': {
                      fontWeight: '400 !important',
                      color: '#313a4e !important',
                    },
                    '& .MuiDataGrid-row': {
                      cursor: 'pointer',
                      borderBottom: '1px solid #D6D6D6 !important',
                    },
                    '& .MuiDataGrid-cell--textRight, .MuiDataGrid-cell--textCenter':
                      {
                        whiteSpace: 'nowrap',
                      },
                    '& .MuiDataGrid-columnHeaders': {
                      borderRadius: '8px 8px 0 0',
                    },
                    '& .MuiDataGrid-aggregationColumnHeaderLabel': {
                      display: 'none',
                    },
                  }}
                />
              </Mui.Box>
              {/* ) : (
                <Mui.Typography align="center">
                  {loading ? 'Data is being fetched' : 'No data Found '}
                </Mui.Typography>
              )} */}
            </>
          )}
        </>
      )}
      <Mui.Popover
        style={{ cursor: 'pointer' }}
        id="basic-menu-sort"
        anchorEl={anchorElMonth}
        PaperProps={{
          sx: {
            width: device === 'mobile' ? '148px' : '270px',
            border: '0.5px solid #C7C7C7',
            boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            marginTop: '10px',
          },
        }}
        open={Boolean(anchorElMonth)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => setAnchorElMonth(null)}
      >
        <div>
          {['By Bucket ( Days )', 'By Billing Month'].map((val) => (
            <div onClick={() => Bucket(val)} className={css.DivTagPopover}>
              <p className={css.PTagPopover}>{val}</p>
            </div>
          ))}
        </div>
      </Mui.Popover>

      <Mui.Popover
        id="basic-menu-sort"
        anchorEl={anchorElDateP.opened}
        open={Boolean(anchorElDateP.opened)}
        PaperProps={{
          sx: {
            width: device === 'mobile' ? '37vw' : '178px',
            border: '0.5px solid #C7C7C7',
            boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            marginTop: '10px',
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => setAnchorElDateP((prev) => ({ ...prev, opened: null }))}
        sx={{ cursor: 'pointer', width: '100%' }}
      >
        <div>
          {[-1, 0, 1, 2, 3, 4].map((i) => (
            <div
              onClick={() =>
                setAnchorElDateP({
                  value:
                    i === -1
                      ? new Date()
                      : new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() - i,
                          0
                        ),
                  opened: null,
                })
              }
              className={css.DivTagPopover}
            >
              <p className={css.PTagPopover}>
                {i === -1
                  ? moment().format('DD MMM YYYY')
                  : moment(
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() - i,
                        0
                      )
                    ).format('DD MMM YYYY')}
              </p>
            </div>
          ))}
        </div>
      </Mui.Popover>
    </div>
  );
}

export const THead = ({
  totals,
  filteredUsers,
  anchorElDateP,
  wise,
  // columnHeader,
  // setColumnHeader,
  // setFilterCustListTemp,
  // customerList,
  valueOptionsFilter,
}) => {
  const navigate = Router.useNavigate();
  const [monthList, setMonthList] = React.useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  // const [totalMonth, setTotalMonth] = React.useState({});

  const Earlier = new Date(
    Object.keys(totals)
      ?.slice()
      ?.reverse()
      ?.filter(
        (text) =>
          text !== 'net_balance' &&
          text !== 'total_debits' &&
          text !== 'unsettled_credits' &&
          text !== 'earlier_than'
      )
      .slice(-1)[0]
  ).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const handleClick = (params) => {
    if (params?.id === 'auto-generated-group-footer-root') {
      return;
    }

    const { field, row } = params;
    if (
      field === 'name' ||
      field === 'net_balance' ||
      field === 'total_debits'
    ) {
      navigate('/payables-ageing-view', {
        state: {
          tableId: row?.id,
          selectedDate: anchorElDateP.value,
          wise,
          tabState: 'total',
        },
      });
    } else if (field === 'unsettled_credits') {
      navigate('/payables-ageing-view', {
        state: {
          tableId: row?.id,
          selectedDate: anchorElDateP.value,
          wise,
          tabState: 'unsettled_cr',
        },
      });
    } else if (field === 'earlier_than') {
      navigate('/payables-ageing-view', {
        state: {
          tableId: row?.id,
          selectedDate: anchorElDateP.value,
          wise,
          tabState: `earlier_than_${Earlier?.replace(
            ' ',
            '_'
          )?.toLocaleLowerCase()}`,
        },
      });
    } else {
      navigate('/payables-ageing-view', {
        state: {
          tableId: row?.id,
          selectedDate: anchorElDateP.value,
          wise,
          tabState:
            moment(field).format('MMM_YYYY')?.toLocaleLowerCase() || 'total',
        },
      });
    }
  };

  const monthCal = () => {
    Object.keys(totals)
      ?.slice()
      ?.reverse()
      ?.filter(
        (text) =>
          text !== 'net_balance' &&
          text !== 'total_debits' &&
          text !== 'unsettled_credits' &&
          text !== 'earlier_than'
      )
      ?.map((text) =>
        setMonthList((prev) => [
          ...prev,
          {
            field: text,
            headerName: moment(text).format('MMM-YYYY'),
            type: 'number',
            valueGetter: (params) => params.row?.months?.[text],
            valueFormatter: (params) => {
              if (params?.value < 0) {
                return `(${currencyFormatter.format(Math.abs(params?.value))})`;
              }
              return currencyFormatter.format(params?.value || 0);
            },
            headerClassName: 'left-align--header',
            cellClassName: (params) => {
              return params.value < 0 && 'negative-amount';
            },
          },
        ])
      );
  };
  React.useEffect(() => {
    setMonthList([]);
    monthCal();
  }, [totals, filteredUsers]);

  const columnsAgeingMonth = [
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (params) => params.value,
      minWidth: 350,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
      cellClassName: 'nameField',
      flex: 1,
    },
    {
      field: 'net_balance',
      headerName: 'Net Balance',
      type: 'number',
      valueGetter: (params) => params?.row?.net_balance,
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    ...monthList,
    {
      field: 'earlier_than',
      headerName: `Earlier Than ${Earlier?.replace(' ', '-')}`,
      type: 'number',
      valueGetter: (params) => params?.row?.months?.earlier_than,
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'total_debits',
      headerName: 'Total Credits',
      type: 'number',
      valueGetter: (params) => params?.row?.total_debits,
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      align: 'center',
      cellClassName: (params) => {
        return params.value < 0 && 'negative-amount';
      },
    },
    {
      field: 'unsettled_credits',
      headerName: 'Unsettled Debits',
      type: 'number',
      valueGetter: (params) => params?.row?.unsettled_credits,
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      headerClassName: 'left-align--header',
      align: 'center',
      cellClassName: 'negative-amount',
    },
  ];

  const handleScroll = (event) => {
    const currentPosition = event.target.scrollLeft;
    setScrollPosition(currentPosition);
  };

  React.useEffect(() => {
    setTimeout(() => { 
      const element = document.querySelector('.MuiDataGrid-cellContent');
      if (element) {
      element.classList.add('MuiDataGrid-footerCell');
      element.innerHTML = 'Total';
  }
    }, 100);
  }, [document.querySelector('.MuiDataGrid-cellContent'), filteredUsers, scrollPosition]);
  return (
    <>
      <Mui.Box
        sx={{
          height: '80%',
          width: '100%',
          '& .left-align--header': {
            '.MuiDataGrid-columnHeaderDraggableContainer': {
              flexDirection: 'row !important',
            },
            '.MuiDataGrid-columnHeaderTitleContainer': {
              flexDirection: 'row !important',
            },
            textAlign: 'left',
          },
          '& .negative-amount': {
            color: '#950909',
          },
          '& .nameField': {
            whiteSpace: 'break-spaces !important',
          },
        }}
        onScroll={handleScroll}
      >
        <DataGridPremium
          rows={filteredUsers}
          columns={columnsAgeingMonth}
          // getRowHeight={() => 'auto'}
          rowHeight={70}
          hideFooter
          disableRowSelectionOnClick
          disableColumnReorder
          disableColumnPinning
          disableRowGrouping
          // disableAggregation
          disableColumnSelector
          onCellClick={handleClick}
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
          initialState={{
            aggregation: {
              model: Object.fromEntries(
                Object.keys(totals || {}).map((key) => [key, 'sum'])
              ),
            },
          }}
          sx={{
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #D6D8DB',
            '& .MuiDataGrid-columnHeadersInner': {
              background: '#F7F7F7',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'break-spaces',
              textAlign: 'center',
              lineHeight: '20px',
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: '400 !important',
              fontSize: '13px',
            },
            '& .MuiDataGrid-cell': {
              fontFamily: "'Lexend', sans-serif !important",
              fontWeight: '300 !important',
              fontSize: '13px',
            },
            '& .MuiDataGrid-pinnedRows': {
              borderBottomRightRadius: '8px !important',
              borderBottomLeftRadius: '8px !important',
            },
            '& .MuiDataGrid-footerCell': {
              fontWeight: '400 !important',
              color: '#313a4e !important',
            },
            // '& .MuiDataGrid-main + div': { overflow: 'overlay' },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              borderBottom: '1px solid #D6D6D6 !important',
            },
            '& .MuiDataGrid-cell--textRight': {
              whiteSpace: 'nowrap',
            },
            '& .MuiDataGrid-columnHeaders': {
              borderRadius: '8px 8px 0 0',
            },
            '& .MuiDataGrid-aggregationColumnHeaderLabel': {
              display: 'none',
            },
          }}
        />
      </Mui.Box>
    </>
  );
};
