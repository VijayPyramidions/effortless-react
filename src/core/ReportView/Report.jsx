import * as React from 'react';
import * as Mui from '@mui/material';
import moment from 'moment';
import SearchIcon2 from '@material-ui/icons/Search';
import InputAdornment from '@mui/material/InputAdornment';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
// import reportMan from '@assets/reportMan.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Visibility from '@material-ui/icons/Visibility';
import MultipleDatePopover from '../../components/DatePopover/DatePopover';
import * as css from './report.scss';

const inputFlow = [
  {
    name: 'Trial balance',
    section: ['Period', 'Select Account'],
    finalSection: [
      {
        question: 'What is a Trial Balance?',
        paragraph:
          'Trial Balance provides essential information for Small and Medium-size Business Owners to ensure the accuracy of their financial records, prepare accurate financial statements, and identify any missing transactions or accounts.',
        link: '',
      },
    ],
    download: {
      url: 'reports/trial_balances.xlsx',
      param: ['from_date', 'to_date', 'account_id'],
    },
    reportType: 'trial_balance',
  },
  {
    name: 'Balance Sheet',
    section: ['Period'],
    finalSection: [
      {
        question: 'What is a Balance Sheet?',
        paragraph:
          'Balance Sheet provides a snapshot of a company`s financial position, detailing what it owns (its assets), what it owes (its liabilities), and what is left over for the owners (its equity).',
        link: '',
      },
    ],
    download: { url: 'reports/balance_sheet.xlsx', param: ['month', 'page'] },
    reportType: 'balance_sheet',
  },
  {
    name: 'Income Statment',
    section: ['Period'],
    finalSection: [
      {
        question: 'What is a Income Statement?',
        paragraph:
          'An income statement, also known as a profit and loss statement, is a financial statement that shows a company`s revenues, expenses, and net income or loss over a specific period of time.',
        link: '',
      },
    ],
    download: { url: 'reports/income_statements.xlsx', param: ['month'] },
    reportType: 'income_statement',
  },
  {
    name: 'Cashflow Report',
    section: ['Period'],
    finalSection: [
      {
        question: 'What is a Cashflow Report?',
        paragraph:
          'A Cashflow reports provide critical information for Small and Medium-size Business Owners to manage their cash flow effectively, make informed investment decisions, and monitor their financial performance.',
        link: '',
      },
    ],
    download: {
      url: 'reports/cash_flow.xlsx',
      param: ['from_date', 'to_date'],
    },
    reportType: 'cash_flow',
  },
  // {
  //   name: 'Transaction Report',
  //   section: ['Period'],
  //   finalSection: [
  //     {
  //       question: 'What is a Transaction Report?',
  //       paragraph:
  //         'A Transaction Report provides essential information for Small and Medium-size Business Owners to manage their finances effectively, identify business trends, and prepare accurate financial statements.',
  //       link: '',
  //     },
  //   ],
  //   download: { url: 'txns.xlsx', param: ['start_date', 'end_date'] },
  // },
  {
    name: 'More Reports',
    section: ['Report Name', 'Period'],
    finalSection: [
      {
        question: 'What is a Transaction Report?',
        paragraph:
          'A Transaction Report provides essential information for Small and Medium-size Business Owners to manage their finances effectively, identify business trends, and prepare accurate financial statements.',
        link: '',
      },
    ],
    download: {
      url: [
        'reports/collection_forecast.xlsx',
        'reports/sales.xlsx',
        'txns.xlsx',
      ],
      param: ['from_date', 'to_date', 'start_date', 'end_date'],
    },
  },
];

const CustomSelect = ({ value, setDropField, error, helperText }) => {
  return (
    <>
      <div
        className={css.selectField}
        onClick={(e) => setDropField(e?.currentTarget)}
      >
        <div className={css.selectFieldPDiv}>
          <p
            style={{
              color: value ? '#000' : '#B2B2B2',
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            {value || 'Select one'}
          </p>
        </div>
        <div className={css.selectArrow}>
          <KeyboardArrowDownIcon />
        </div>
      </div>
      {error && <span className={css.helperText}>{helperText}</span>}
    </>
  );
};

const Report = () => {
  const {
    organization,
    enableLoading,
    user,
    currentUserInfo,
    // openSnackBar
  } = React.useContext(AppContext);
  const [radioSec, setRadioSec] = React.useState('Trial balance');
  const [inputSection, setInputSection] = React.useState([]);
  const [dropField, setDropField] = React.useState(null);
  const [dropFieldAcc, setDropFieldAcc] = React.useState(null);
  const [dropFieldMoreReports, setDropFieldMoreReports] = React.useState(null);
  const [selectDate, setSelectDate] = React.useState('');
  const [selectAcc, setSelectAcc] = React.useState('');
  const [selectReport, setSelectReport] = React.useState('');
  const [date, setDate] = React.useState({ startDate: '', endDate: '' });
  const [selectedAccObj, setSelectedAccObj] = React.useState({});
  const [selectedReportObj, setSelectedReportObj] = React.useState({});
  const [validation, setValidtion] = React.useState({});
  const [accList, setAccList] = React.useState([]);
  const moreReportList = [
    { id: 'future_collections', name: 'Future Collections' },
    { id: 'total_sales_report', name: 'Total Sales Report' },
    { id: 'transaction_report', name: 'Transaction Report' },
  ];
  const [searchQuery, setSearchQuery] = React.useState('');

  const AccountList = () => {
    RestApi(`organizations/${organization.orgId}/accounts`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setAccList(res?.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    setValidtion({});
    const temp = inputFlow?.find((val) => val?.name === radioSec);
    temp?.section?.map((val) =>
      setValidtion((prev) => ({ ...prev, [val]: false })),
    );
    setInputSection(temp);
    if (radioSec === 'Trial balance' && accList?.length === 0) {
      AccountList();
    }
  }, [radioSec]);

  const handleChangeRadio = (event) => {
    setSelectDate('');
    setSelectAcc('');
    setSelectReport('');
    setSelectedAccObj({});
    setRadioSec(event?.target?.value);
  };

  const triggerViewReport = () => {
    // console.log('selectedReportObj', selectedReportObj, inputSection);
    RestApi(`organizations/${organization.orgId}/magic_links`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        membership_id: currentUserInfo?.membershipId,
        report_type: inputSection?.reportType,
        start_date: moment(date?.startDate)?.format('YYYY-MM-DD'),
        end_date: moment(date?.endDate)?.format('YYYY-MM-DD'),
      },
    }).then((response) => {
      if (response?.url) {
        window.open(response?.url, '_blank');
      }
    });
    enableLoading(false);
  };

  const triggerDownlaod = () => {
    let Param;
    if (inputSection?.name === 'Balance Sheet') {
      Param = `${inputSection?.download?.param[0]}=${moment()?.format(
        'MMM YYYY',
      )}`;
    } else if (inputSection?.name === 'Income Statment') {
      Param = `${inputSection?.download?.param[0]}=${moment()?.format('MMMM')}`;
    } else if (inputSection?.name === 'Trial balance') {
      Param = `${inputSection?.download?.param[0]}=${moment(
        date?.startDate,
      )?.format('DD-MM-YYYY')}&${inputSection?.download?.param[1]}=${moment(
        date?.endDate,
      ).format('DD-MM-YYYY')}&${inputSection?.download?.param[2]}=${
        selectedAccObj?.id || ''
      }`;
    } else if (inputSection?.name === 'More Reports') {
      console.log('selectedReportObj', selectedReportObj);
      if (selectReport === 'Future Collections') {
        Param = '';
      } else if (selectReport === 'Total Sales Report') {
        Param = `${inputSection?.download?.param[0]}=${moment(
          date?.startDate,
        )?.format('DD-MM-YYYY')}&${inputSection?.download?.param[1]}=${moment(
          date?.endDate,
        ).format('DD-MM-YYYY')}`;
      } else if (selectReport === 'Transaction Report') {
        Param = `${inputSection?.download?.param[2]}=${moment(
          date?.startDate,
        )?.format('DD-MM-YYYY')}&${inputSection?.download?.param[3]}=${moment(
          date?.endDate,
        ).format('DD-MM-YYYY')}`;
      }
    } else {
      Param = `${inputSection?.download?.param[0]}=${moment(
        date?.startDate,
      )?.format('DD-MM-YYYY')}&${inputSection?.download?.param[1]}=${moment(
        date?.endDate,
      ).format('DD-MM-YYYY')}`;
    }
    enableLoading(true);
    let downloadUrl;
    if (inputSection?.name === 'More Reports') {
      if (selectReport === 'Future Collections') {
        downloadUrl = inputSection?.download?.url[0];
      } else if (selectReport === 'Total Sales Report') {
        downloadUrl = inputSection?.download?.url[1];
      } else if (selectReport === 'Transaction Report') {
        downloadUrl = inputSection?.download?.url[2];
      }
    } else {
      downloadUrl = inputSection?.download?.url;
    }
    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/${downloadUrl}?${Param}`,
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
        a.download =
          inputSection?.name === 'More Reports'
            ? selectReport
            : inputSection?.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    enableLoading(false);
  };

  const onsubmit = () => {
    if (inputSection?.name === 'Trial balance') {
      if (!selectDate) {
        setValidtion((prev) => ({ ...prev, Period: true }));
      }
      // if (!selectAcc) {
      //   setValidtion((prev) => ({ ...prev, 'Select Account': true }));
      // }
      if (selectDate) {
        triggerDownlaod();
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      // if (!selectDate || !selectReport) {
      //   if(selectReport !== 'Future Collections'){
      //   if (!selectDate) setValidtion({ Period: true });
      // }
      //   if (!selectReport)
      //     setValidtion((prev) => ({ ...prev, 'Report Name': true }));
      // } else {
      //   triggerDownlaod();
      // }
      if (selectReport !== 'Future Collections') {
        if (!selectDate) {
          setValidtion({ Period: true });
          return;
        }
      }
      if (!selectReport && inputSection?.name === 'More Reports') {
        setValidtion((prev) => ({ ...prev, 'Report Name': true }));
        return;
      }

      triggerDownlaod();
    }
  };

  const onViewReport = () => {
    if (inputSection?.name === 'Trial balance') {
      if (!selectDate) {
        setValidtion((prev) => ({ ...prev, Period: true }));
      }
      // if (!selectAcc) {
      //   setValidtion((prev) => ({ ...prev, 'Select Account': true }));
      // }
      if (selectDate) {
        triggerViewReport();
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      // if (!selectDate || !selectReport) {
      //   if(selectReport !== 'Future Collections'){
      //   if (!selectDate) setValidtion({ Period: true });
      // }
      //   if (!selectReport)
      //     setValidtion((prev) => ({ ...prev, 'Report Name': true }));
      // } else {
      //   triggerDownlaod();
      // }
      if (selectReport !== 'Future Collections') {
        if (!selectDate) {
          setValidtion({ Period: true });
          return;
        }
      }
      if (!selectReport && inputSection?.name === 'More Reports') {
        setValidtion((prev) => ({ ...prev, 'Report Name': true }));
        return;
      }

      triggerViewReport();
    }
  };

  const onPeriodChange = (fromDate, toDate) => {
    setDropField(null);
    const tempValue =
      `${moment(fromDate).format('DD MMM YY')} - ${moment(toDate).format(
        'DD MMM YY',
      )}` || '';
    setSelectDate(tempValue);
    setValidtion((prev) => ({ ...prev, Period: !tempValue }));
    setDate({
      startDate: fromDate,
      endDate: toDate,
    });
  };

  const onPeriodClose = () => {
    setDropField(null);
    setValidtion((prev) => ({ ...prev, Period: !selectDate }));
  };
  return (
    <div className={css.reportMain}>
      <div className={css.firstCont}>
        <p className={css.headP}>Download Reports</p>
        <div>
          <Mui.RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={radioSec}
            name="radio-buttons-group"
            onChange={handleChangeRadio}
            className={css.radioField}
          >
            {[
              'Trial balance',
              'Balance Sheet',
              'Income Statment',
              'Cashflow Report',
              // 'Transaction Report',
              'More Reports',
            ]?.map((val) => (
              <Mui.FormControlLabel
                value={val}
                control={
                  <Mui.Radio
                    sx={{
                      color: '#F08B32',
                      '&.Mui-checked': {
                        color: '#F08B32',
                      },
                    }}
                  />
                }
                label={<p className={css.radioP}>{val}</p>}
              />
            ))}
          </Mui.RadioGroup>
        </div>

        <div className={css.finalCont}>
          <div className={css.inner}>
            {inputSection?.section?.map((element) => (
              <div className={css.eachField}>
                {inputSection?.name === 'Trial balance' && (
                  <>
                    {element === 'Period' && (
                      <>
                        <p className={css.labelP}>{element}</p>
                        <div>
                          <CustomSelect
                            setDropField={setDropField}
                            value={selectDate}
                            error={validation?.Period}
                            helperText={
                              validation?.Period ? 'Select Period' : ''
                            }
                          />
                        </div>
                      </>
                    )}
                    {element === 'Select Account' && (
                      <>
                        <p className={css.labelP}>{element}</p>
                        <div>
                          <CustomSelect
                            setDropField={setDropFieldAcc}
                            value={selectAcc}
                            // error={validation?.['Select Account']}
                            // helperText={
                            //   validation?.['Select Account']
                            //     ? 'Select Account'
                            //     : ''
                            // }
                          />
                        </div>
                      </>
                    )}
                  </>
                )}{' '}
                {inputSection?.name === 'More Reports' && (
                  <>
                    {element === 'Report Name' && (
                      <>
                        <p className={css.labelP}>{element}</p>
                        <div>
                          <CustomSelect
                            setDropField={setDropFieldMoreReports}
                            value={selectReport}
                            error={validation?.['Report Name']}
                            helperText={
                              validation?.['Report Name'] ? 'Select Report' : ''
                            }
                          />
                        </div>
                      </>
                    )}
                    {element === 'Period' &&
                      selectReport !== 'Future Collections' && (
                        <>
                          <p className={css.labelP}>{element}</p>
                          <div>
                            <CustomSelect
                              setDropField={setDropField}
                              value={selectDate}
                              error={validation?.Period}
                              helperText={
                                validation?.Period ? 'Select Period' : ''
                              }
                            />
                          </div>
                        </>
                      )}
                  </>
                )}
                {inputSection?.name !== 'More Reports' &&
                  inputSection?.name !== 'Trial balance' && (
                    <>
                      {element === 'Period' && (
                        <>
                          <p className={css.labelP}>{element}</p>
                          <div>
                            <CustomSelect
                              setDropField={setDropField}
                              value={selectDate}
                              error={validation?.Period}
                              helperText={
                                validation?.Period ? 'Select Period' : ''
                              }
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
              </div>
            ))}
            <div className={css.buttonDown}>
              <Mui.Button
                onClick={() => onsubmit()}
                className={css.primaryButton}
              >
                <SaveAltIcon />
                Download
              </Mui.Button>
              {inputSection?.name !== 'More Reports' && (
                <Mui.Button
                  onClick={() => onViewReport()}
                  className={css.primaryButton}
                >
                  <Visibility />
                  View Report
                </Mui.Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className={css.secondCont}>
        <div className={css.topCont}>
          <img src={reportMan} alt="agent" />
          <p className={css.headP}>SuperAccountant’s Insights</p>
        </div>
        {inputSection?.finalSection?.map((val) => (
          <div>
            <p className={css.questions}>{val?.question}</p>
            <p className={css.paragraph}>{val?.paragraph}</p>

            <a href="/" className={css.link}>
              Read More
            </a>
          </div>
        ))}
      </div> */}

      <MultipleDatePopover
        anchorEl={dropField}
        onClose={onPeriodClose}
        onPeriodChange={onPeriodChange}
        popoverStyle={{
          padding: '5px',
          overflow: 'visible',
          borderRadius: 5,
        }}
        fromWidth="220px"
        DateType="Financial"
      />
      <Mui.Popover
        anchorEl={dropFieldAcc}
        open={Boolean(dropFieldAcc)}
        onClose={() => {
          setDropFieldAcc(null);
          // setValidtion((prev) => ({ ...prev, 'Select Account': !selectAcc }));
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            width: '220px',
            padding: '5px',
            overflow: 'visible',
            borderRadius: 5,
          },
        }}
      >
        <>
          <Mui.TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon2 />
                </InputAdornment>
              ),
            }}
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                padding: '8px 0',
              },
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  border: '1px solid #c4c4c4',
                },
              },
            }}
            focused={false}
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <div className={css.dropDown}>
            {accList
              ?.filter((ele) =>
                ele?.name
                  ?.toLocaleLowerCase()
                  ?.includes(searchQuery?.toLocaleLowerCase()),
              )
              ?.map((val) => (
                <div
                  onClick={() => {
                    setDropFieldAcc(null);
                    setSelectedAccObj(val);
                    setSelectAcc(val?.name);
                    setValidtion((prev) => ({
                      ...prev,
                      'Select Account': !val?.name,
                    }));
                  }}
                >
                  <p className={css.dropDownP}>{val?.name}</p>
                </div>
              ))}
            {accList?.filter((ele) =>
              ele?.name
                ?.toLocaleLowerCase()
                ?.includes(searchQuery?.toLocaleLowerCase()),
            )?.length === 0 && (
              <div>
                <p className={css.dropDownNoDataP}>No Data</p>
              </div>
            )}
          </div>
        </>
      </Mui.Popover>
      <Mui.Popover
        anchorEl={dropFieldMoreReports}
        open={Boolean(dropFieldMoreReports)}
        onClose={() => {
          setDropFieldMoreReports(null);
          setValidtion((prev) => ({ ...prev, 'Report Name': !selectReport }));
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            width: '220px',
            padding: '5px',
            overflow: 'visible',
            borderRadius: 5,
          },
        }}
      >
        <>
          <Mui.TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon2 />
                </InputAdornment>
              ),
            }}
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                padding: '8px 0',
              },
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  border: '1px solid #c4c4c4',
                },
              },
            }}
            focused={false}
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <div className={css.dropDown}>
            {moreReportList
              ?.filter((ele) =>
                ele?.name
                  ?.toLocaleLowerCase()
                  ?.includes(searchQuery?.toLocaleLowerCase()),
              )
              ?.map((val) => (
                <div
                  onClick={() => {
                    setDropFieldMoreReports(null);
                    setSelectedReportObj(val);
                    setSelectReport(val?.name);
                    setValidtion((prev) => ({
                      ...prev,
                      'Report Name': !val?.name,
                    }));
                  }}
                >
                  <p className={css.dropDownP}>{val?.name}</p>
                </div>
              ))}
            {moreReportList?.filter((ele) =>
              ele?.name
                ?.toLocaleLowerCase()
                ?.includes(searchQuery?.toLocaleLowerCase()),
            )?.length === 0 && (
              <div>
                <p className={css.dropDownNoDataP}>No Data</p>
              </div>
            )}
          </div>
        </>
      </Mui.Popover>
    </div>
  );
};

export default Report;
