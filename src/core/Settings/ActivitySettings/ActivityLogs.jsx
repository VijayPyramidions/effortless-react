import React from 'react';
import * as Router from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import RestApi, {
  METHOD,
  BASE_URL
} from '@services/RestApi.jsx';
import { Button, Popover } from '@material-ui/core';
import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MultipleDatePopover from '../../../components/DatePopover/DatePopover';

import * as css from './Activity.scss';

const useStyles = makeStyles({
  MonthButton: {
    border: '1px solid #e4e4e4',
    borderRadius: '4px',
    padding: '0px',
    fontFamily: 'Lexend, sans-serif !important',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: '16px',
    lineHeight: '16px',
    color: '#000000',
    textTransform: 'capitalize',
    background: 'none !important',
    width: '236px',
    justifyContent: 'flex-start',
    '& .MuiButton-startIcon': {
      background: '#f6f6f7',
      padding: '10px',
    },
    '& .MuiButton-endIcon': {
      marginLeft: 'auto !important',
      padding: '10px',
    },
  },
  activityTable: {},
  tablehead: {
    background: '#f7f7f7 !important',
  },
});

const ActivityLogs = () => {
  const classes = useStyles();
  const {
    organization,
    user,
    enableLoading,
    openSnackBar,
    setActiveInvoiceId
  } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const [PopoverState, setPopoverState] = React.useState({ Export: null, Date: null });
  const [DateFilter, setDateFilter] = React.useState({view: '', fromDate: '', toDate: ''});
  const ExportPop = PopoverState?.Export;
  const [ActivityData, setActivityData] = React.useState([]);
  const [FilterDate, setFilterDate] = React.useState();
  const [Pagination, setPagination] = React.useState({});
  
  const GetActivity = (pageNum) => {
    let filter = '';
    if (FilterDate?.fromDate && FilterDate?.toDate) {
      filter = `start_date=${moment(FilterDate?.fromDate)?.format('YYYY-MM-DD')}&end_date=${moment(FilterDate?.toDate)?.format('YYYY-MM-DD')}`;
    }
    enableLoading(!!(pageNum === 1 || !pageNum));
      RestApi(
        `organizations/${organization.orgId}/user_activities?page=${pageNum || 1}&${filter}`,
        {
          method: METHOD.GET,
          headers: {
            authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((res) => {
          enableLoading(false);
          if (res && !res.error) {
            if (res?.page === 1) {
              setActivityData(res?.data?.map((val) => ({ ...val, id: uuidv4() })),);
            } else {
              setActivityData((prev) => ([...prev, ...res?.data?.map((val) => ({ ...val, id: uuidv4() })) ]));
            }
            setPagination({ current_page: res?.page, total_page: res?.pages });
          } else if (res?.error) {
            openSnackBar({
              message: res?.message || 'Unknown Error Occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch(() => {
          openSnackBar({
            message: 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        });
  };

  React.useEffect(() => {
    if (Object.keys(Pagination)?.length === 0){
      GetActivity();
    }
    if (Pagination?.current_page < Pagination?.total_page){
      GetActivity(Pagination?.current_page + 1);
    }
  }, [Pagination]);

  const InvoiceView = (val) => {
    user.customerId = val?.labels?.customer_id;
    setActiveInvoiceId({
      activeInvoiceId: val?.parent_id,
    });
    if (val?.parent_id) {
      navigate(`/invoice-approved-pdf?id=${val?.parent_id}`, {
        state: {
          id: val?.labels?.customer_id,
          type: 'approved',
          name: val?.labels?.customer_name,
          documentType: val?.document_type,
          startDateDef: val?.date,
          // approvedAccess: userRoles,
        },
      });
    }
  };

  const BillView = (val) => {
    if (val?.parent_id) {
      navigate(`/bill-yourbills`, {state: {id: val?.parent_id}});
    }
  };

  const PeopleView = (val) => { 
    let tab;
      if (val?.activity_type?.includes('customer')) {
        tab = 'tab1';
      } else if (val?.activity_type?.includes('vendor')) {
        tab = 'tab2';
      }
    if (val?.parent_id) {
      navigate(`/people`, { state: { choose: tab, selectedId: val?.parent_id } });
      }
  };

  const PeopleViewLabel = (val) => { 
    const tab = val?.show;
    if (val?.labels?.parent_id) {
      navigate(`/people`, { state: { choose: tab, selectedId: val?.labels?.parent_id } });
      }
  };

  const ActivityDetails = ({ value }) => {
    const ACTIVITY = [{
      type: 'Invoice',
      show: 'tab1',
      click: (val) => InvoiceView(val),
    }, {
      type: 'VendorBill',
      show: 'tab2',
      click: (val) => BillView(val),
    }, {
      type: 'Entity',
      show: 'Entity',
      click: (val) => PeopleView(val),
      }];
    const [ActivityType, setActivityType] = React.useState({});
    React.useEffect(() => {
      setActivityType(ACTIVITY?.find(val => val?.type === value?.parent_type));
    }, [value?.activity_type]);
    return (
       <div className={css.detailsDiv}>
        {value?.labels?.parent_id && <div onClick={() => ActivityType?.click(value)}>
          <p className={`${css.detailsField} ${css.pointerClass}`}>
              {value?.activity || ''}
            </p></div> || <div>
          <p className={css.detailsField}>
              {value?.activity || ''}
            </p></div>}
            {(value?.labels?.parent_name && value?.labels?.parent_id && value?.parent_type !== 'Entity') && <div onClick={() => PeopleViewLabel({...value, show: ActivityType?.show})}><p className={css.detailsSecondField}>for {value?.labels?.parent_name || '-'}</p></div>}
          </div>
    );
   };

    const ActivityColumn = [{
        field: 'date',
        headerName: 'Date',
        flex: 1,
        renderCell: (params) => {
          return (
            <p className={css.dateField}>
            {moment.utc(params.row?.date)?.format('MMM DD, YYYY HH:MM')}
          </p>
          );
        },
      sortable: false,
        maxWidth: 150,
      },{
        field: 'activity',
        headerName: 'Activity Details',
        flex: 1,
      renderCell: (params) => {
        return (
          <ActivityDetails value={params?.row} />
        );
        },
        sortable: false,
      },{
        field: 'description',
        headerName: 'Description',
        flex: 1,
        renderCell: (params) => {
          return (
            <div className={css.descriptionDiv}>
              <p  className={css.descriptionField}>
                  {params.row?.description || ''}
              </p>
              <p  className={css.descriptionSecondField}>
                  by {params.row?.name || '-'}
          </p>
            </div>
          );
        },
        sortable: false,
      },
      // {
      //   field: 'action',
      //   headerName: 'Action',
      //   flex: 1,
      //   renderCell: (params) => {
      //     return (
      //       <p className={css.actionField}>
      //       {params.row?.action || ''}
      //     </p>
      //     );
      //   },
      // sortable: false,
      //   maxWidth: 200
      // }
    ];
  
      const onPeriodChange = (fromDate, toDate, name) => {
        setPopoverState((prev) => ({ ...prev, Date: null }));
        // const tempValue =
        //   `${moment(fromDate).format('DD MMM YY')} - ${moment(toDate).format(
        //     'DD MMM YY',
        //   )}` || '';
        setDateFilter({ view: name, fromDate, toDate });
        setFilterDate({ fromDate: moment(fromDate)?.format('YYYY-MM-DD'), toDate: moment(toDate)?.format('YYYY-MM-DD') });
      };

  React.useEffect(() => {
    if (FilterDate?.fromDate && FilterDate?.toDate) {
      GetActivity(1);
    }
   }, [FilterDate]);
    
      const onPeriodClose = () => {
        setPopoverState((prev) => ({ ...prev, Date: null }));
      };
  
      const triggerDownlaod = (param, downloadFormat) => {
        // if (device === 'mobile') {
        //   JSBridge.downloadWithAuthentication(
        //     param ? `${BASE_URL}/organizations/${organization.orgId}/user_activities.xlsx?${param}` : `${BASE_URL}/organizations/${organization.orgId}/user_activities.xlsx`,
        //   );
        // } else {
          enableLoading(true);
          fetch(
            param ? `${BASE_URL}/organizations/${organization.orgId}/user_activities.${downloadFormat}?${param}` : `${BASE_URL}/organizations/${organization.orgId}/user_activities.${downloadFormat}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${user.activeToken}`,
              },
            },
          )
            .then((response) => response.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Activity log';
              document.body.appendChild(a);
              a.click();
              a.remove();
            });
          enableLoading(false);
        // }
      };

  return (
    <div className={css.activityLogs}>
      <div className={css.headTab}>
        <Button
          startIcon={<DateRangeIcon />}
          endIcon={<KeyboardArrowDownOutlinedIcon />}
          className={classes.MonthButton}
          onClick={(e) => setPopoverState((prev) => ({...prev, Date: e?.currentTarget}))}
        >
          {DateFilter?.view || 'Select Date'}
        </Button>

        <Button
          className={css.exportButton}
          endIcon={<KeyboardArrowDownOutlinedIcon className={css.endIcon} />}
          onClick={(e) => setPopoverState((prev) => ({...prev, Export: e?.currentTarget}))}
        >
          Export As
        </Button>
      </div>

      <Box
        className={css.tableDiv}
      >
        <DataGridPro
          rows={ActivityData}
          columns={ActivityColumn}
          density="compact"
        headerHeight={80}
          disableColumnReorder
          disableColumnResize
          hideFooter
          disableSelectionOnClick
          disableColumnMenu
          sx={{
            background: '#fff',
            borderRadius: '0px',
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
                background: '#f7f7f7',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'break-spaces',
                textAlign: 'center',
                lineHeight: '20px',
                fontFamily: 'Lexend !important',
                fontWeight: '400 !important',
                fontSize: '13px',
              },
              '& .MuiDataGrid-cell': {
                fontFamily: 'Lexend !important',
                fontWeight: '400 !important',
                fontSize: '13px',
                maxHeight: 'none !important',
                padding: '16px 10px'
              },
            '& .MuiDataGrid-row': {
              borderBottom: '1px solid #DBDBDB',
              maxHeight: 'none !important',
              alignItems: 'start'
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#FFF"
            },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-renderingZone': {
            maxHeight: 'none !important',
        },
          }}
        />
      </Box>

      <Popover
        open={ExportPop}
        anchorEl={PopoverState?.Export}
        onClose={() => setPopoverState((prev) => ({ ...prev, Export: null }))}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            maxHeight: 500,
            width: '250px',
            padding: '10px 16px',
            borderRadius: 2,
            marginTop: 10,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div>
          <div className={css.popoverList} onClick={() => {
            if (FilterDate?.fromDate && FilterDate?.toDate) {
              triggerDownlaod(`start_date=${moment(FilterDate?.fromDate)?.format('YYYY-MM-DD')}&end_date=${moment(FilterDate?.toDate)?.format('YYYY-MM-DD')}`, 'pdf');
            } else {
              triggerDownlaod(null, 'pdf');
            }
            setPopoverState((prev) => ({ ...prev, Export: null }));
          }}>
            <p>PDF</p>
          </div>
          <div className={css.popoverList} onClick={() => {
            if (FilterDate?.fromDate && FilterDate?.toDate) {
              triggerDownlaod(`start_date=${moment(FilterDate?.fromDate)?.format('YYYY-MM-DD')}&end_date=${moment(FilterDate?.toDate)?.format('YYYY-MM-DD')}`, 'xlsx');
            } else {
              triggerDownlaod(null, 'xlsx');
            }
            setPopoverState((prev) => ({ ...prev, Export: null }));
          }}>
            <p>XLSX ( Microsoft Excel)</p>
          </div>
        </div>
      </Popover>

      <MultipleDatePopover
        anchorEl={PopoverState?.Date}
        onClose={onPeriodClose}
        onPeriodChange={onPeriodChange}
        popoverStyle={{
          padding: '10px 16px',
          borderRadius: 2,
          marginTop: 10,
        }}
        fromWidth="205px"
      />
    </div>
  );
};

export default ActivityLogs;