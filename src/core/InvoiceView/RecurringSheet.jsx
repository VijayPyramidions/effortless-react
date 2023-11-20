import React, { useState, useEffect } from 'react';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/styles';
import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';
import * as Mui from '@mui/material';
// import * as MuiIcon from '@mui/icons-material';
// import * as css from './CreateInvoiceContainerNew.scss';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import AppContext from '@root/AppContext.jsx';
import RecurringDateDialog from './RecurringDateDialog';
import Calender from './Calander';
// import MuiSelect from '../../components/Select/Select';

function RecurringSheet(props) {
  const {
    remainderData,
    day,
    endDateData,
    startDateData,
    setStartDate,
    setEndDate,
    setRemainder,
    setSendDate,
    custName,
  } = props;
  const [drawer, setDrawer] = useState({
    startDate: false,
    endDate: false,
    datePopup: false,
  });

  // const PopOverStyle = withStyles(() => ({
  //   root: {
  //     '& ..css-3bmhjh-MuiPaper-root-MuiPopover-paper': {
  //       top: '600px',
  //     },
  //   },
  // }))(Mui.Popover);
  const WhiteBackgroundCheckbox = withStyles((theme) => ({
    root: {
      '& .MuiSvgIcon-root': {
        fill: 'white',
        '&:hover': {
          backgroundColor: 'rgba(153, 158, 165, 0.4)',
        },
      },
      '&$checked': {
        '& .MuiIconButton-label': {
          position: 'relative',
          zIndex: 0,
          border: '1px solid #F08B32',
          borderRadius: 3,
          width: '19px',
          height: '19px',
        },
        '& .MuiIconButton-label:after': {
          content: '""',
          left: 2,
          top: 2,
          height: 15,
          width: 15,
          position: 'absolute',
          backgroundColor: '#F08B32',
          zIndex: -1,
          borderColor: 'transparent',
        },
      },
      '&:not($checked) .MuiIconButton-label': {
        position: 'relative',
        zIndex: 0,
        border: '1px solid #bbbbbb',
        borderRadius: 3,
        width: '19px',
        height: '19px',
      },
      '&:not($checked) .MuiIconButton-label:after': {
        content: '""',
        left: 2,
        top: 2,
        height: 15,
        width: 15,
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: -1,
        borderColor: 'transparent',
      },
      '& .MuiSwitch-track': {
        backgroundColor: 'green !important',
      },
    },
    color: theme,
    checked: {},
  }))(Checkbox);

  const [start, setStart] = useState(startDateData);
  const [openPop, setOpenPop] = useState(null);
  const [popValue, setPopValue] = useState('');
  const [valueRadio, setValueRadio] = React.useState();

  // const Number = Array.from(Array(32).keys());
  const HandlePop = () => {
    setOpenPop(!openPop);
  };
  const { setDates } = React.useContext(AppContext);
  const [end, setEnd] = useState(endDateData);

  // const [days, setDays] = useState(day);
  // const [remainderDay, setRemainderDay] = useState(remainderData);
  const [remainderCheckbox, setRemainderCheckbox] = useState(true);
  const device = localStorage.getItem('device_detect');
  // const [selected, setSelected] = useState(1);
  const [intialDays, setIntialDays] = useState({
    90: false,
    60: false,
    30: false,
    15: false,
    7: false,
    1: false,
  });

  const daysData = [
    {
      id: 1,
      lable: '90 Days',
      value: 90,
      selected: intialDays[90],
    },
    {
      id: 2,
      lable: '60 Days',
      value: 60,
      selected: intialDays[60],
    },
    {
      id: 3,
      lable: '30 Days',
      value: 30,
      selected: intialDays[30],
    },
    {
      id: 4,
      lable: '15 Days',
      value: 15,
      selected: intialDays[15],
    },
    {
      id: 5,
      lable: '7 Days',
      value: 7,
      selected: intialDays[7],
    },
    {
      id: 6,
      lable: '1 Days',
      value: 1,
      selected: intialDays[1],
    },
  ];

  // const sam = [90, 30, 7];

  React.useEffect(() => {
    setPopValue(day);
  }, [day]);

  React.useEffect(() => {
    if (remainderData && remainderData?.length > 0) {
      remainderData.map((val) =>
        setIntialDays((prev) => ({ ...prev, [val]: true })),
      );
    }
  }, []);

  React.useEffect(() => {
    setRemainder(
      Object.entries(intialDays)
        .map(([key, value]) => value && +key)
        .filter(Boolean),
    );
  }, [JSON.stringify(intialDays)]);

  const handleStartDate = (val) => {
    setStart(new Date(val).toLocaleDateString('fr-CA'));
    setDrawer((d) => ({ ...d, startDate: false }));
  };

  const handleEndDate = (val) => {
    setEnd(new Date(val).toLocaleDateString('fr-CA'));
    setDrawer((d) => ({ ...d, endDate: false }));
  };

  useEffect(() => {
    if (props) {
      // setDays(day);
      // setRemainderDay(remainderData);
      setEnd(endDateData || '');
      setStart(startDateData);
    }
  }, []);

  // useEffect(() => {
  //   if (remainderData) {
  //     setSelected(
  //       daysData.find((ele) => ele.value === Number(remainderData))?.id,
  //     );
  //   }
  //   console.log(remainderDay, days, selected);
  // }, [remainderData]);

  useEffect(() => {
    if (start) {
      if (end === null) {
        setStart(start);
      } else if (new Date(start) > new Date(end)) {
        setStart('');
      } else {
        setStartDate(start);
      }
    }
  }, [start]);

  useEffect(() => {
    if (end) {
      if (new Date(end) < new Date(start)) {
        setEnd('');
      } else {
        setEndDate(end);
      }
    }
  }, [end]);

  // useEffect(() => {
  //     setSendDate(popValue);
  // }, [popValue]);

  // useEffect(() => {
  //   if (days) {
  //     setRemainder(days);
  //   }
  // }, [days]);

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };
  React.useEffect(() => {
    setDates({ status: true, startDate: { start }, endDate: { end } });
  }, [end]);

  return (
    <div className={css.newInvoiceContainer}>
      <div>
        <section>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '20px',
              marginTop: '2.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  border: '1px solid #A0A4AF',
                  borderRadius: '10px',
                  width: '40%',
                  padding: '5px',
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    value={
                      start === ''
                        ? 'dd-mm-yyyy'
                        : new Date(start)
                            .toLocaleDateString('fr-CA')
                            .split('-')
                            .reverse()
                            .join('-')
                    }
                    style={{
                      pointerEvents: 'none',
                      width: '70%',
                      border: 'none',
                    }}
                  />

                  {device === 'desktop' && (
                    <OnlyDatePicker
                      className={css.recurringDate}
                      selectedDate={start || new Date()}
                      // // label={new Date(invoiceDate).toLocaleDateString()}
                      onChange={handleStartDate}
                    />
                  )}
                  {device === 'mobile' && (
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
                  )}
                </div>
              </div>
              <div
                style={{
                  border: '1px solid #A0A4AF',
                  borderRadius: '10px',
                  width: '40%',
                  padding: '5px',
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                      end === ''
                        ? 'dd-mm-yyyy'
                        : new Date(end)
                            .toLocaleDateString('fr-CA')
                            .split('-')
                            .reverse()
                            .join('-')
                    }
                  />
                  {device === 'desktop' && (
                    <OnlyDatePicker
                      className={css.recurringDate}
                      selectedDate={end || new Date()}
                      // // label={new Date(invoiceDate).toLocaleDateString()}
                      onChange={handleEndDate}
                    />
                  )}
                  {device === 'mobile' && (
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
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <WhiteBackgroundCheckbox
                checked={remainderCheckbox}
                onChange={() => setRemainderCheckbox(!remainderCheckbox)}
              />
              <div
                style={{
                  flex: 1,
                  padding: '5px',
                  fontStyle: 'light',
                  fontSize: '11px',
                }}
              >
                Send Reminders as the Agreement concludes
              </div>
            </div>
            {remainderCheckbox && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  columnGap: '10px',
                  rowGap: '1em',
                  marginBottom: '20px',
                }}
              >
                {daysData.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        // setDays(item.value);
                        // setSelected(item.id);
                        setIntialDays((prev) => ({
                          ...prev,
                          [item.value]: !intialDays[item.value],
                        }));
                      }}
                      style={
                        !item.selected
                          ? {
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '30px',
                              height: '40px',
                              border: '1px solid #A0A4AF',
                              cursor: 'pointer',
                            }
                          : {
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '30px',
                              height: '40px',
                              backgroundColor: 'rgba(240, 139, 50, 0.12)',
                              border: '1px solid #F08B32',
                              cursor: 'pointer',
                            }
                      }
                    >
                      <div
                        style={
                          !item.selected
                            ? {
                                textAlign: 'center',
                                color: '#6E6E6E',
                                fontSize: '13px',
                              }
                            : {
                                textAlign: 'center',
                                color: '#F08B32',
                                fontSize: '13px',
                              }
                        }
                      >
                        {item.lable}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {device === 'desktop' ? (
            <Mui.Stack className={css.dispatchStackDesktop}>
              <Mui.Stack
                direction="row"
                className={css.dispatchStackMainDesktop}
              >
                <Mui.Typography className={css.text1}>
                  Please select the Day of the Month you would like to send this
                  Invoice to {`${custName}`}
                </Mui.Typography>
                <Mui.Stack
                  style={{ cursor: 'pointer' }}
                  onClick={() => HandlePop()}
                  className={css.text2Stack}
                >
                  <Mui.Typography className={css.text2}>
                    send invoice on
                  </Mui.Typography>
                  <Mui.Typography
                    onClick={() => HandlePop()}
                    style={{ cursor: 'pointer' }}
                  >
                    {popValue}
                  </Mui.Typography>
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
          ) : (
            <Mui.Stack className={css.dispatchStack}>
              <Mui.Stack direction="row" className={css.dispatchStackMain}>
                <Mui.Stack>
                  <Mui.Typography className={css.text1}>
                    Confirm Dispatch Date
                  </Mui.Typography>
                  <Mui.Typography className={css.text2}>
                    Send a Recurring Invoice to {`${custName}`} on this day,
                    every month, till the End of the Agreement.
                  </Mui.Typography>
                </Mui.Stack>
                <Mui.Stack className={css.inputStack} direction="row">
                  <Mui.Typography
                    style={{ cursor: 'pointer' }}
                    onClick={() => HandlePop()}
                  >
                    {popValue}
                  </Mui.Typography>
                  <KeyboardArrowDownIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => HandlePop()}
                    className={css.arrow}
                  />
                  {/* <PopOverStyle
                    open={openPop}
                    // anchorEl={HandlePop}
                    onClose={() => HandlePop()}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                  >
                    <Mui.Stack style={{ width: '20rem', height: '10rem' }}>
                      <Mui.Grid container>
                        {Number.map((c) => (
                          <Mui.Grid xs={2}>
                            <Mui.Stack
                              className={css.numberStackNew}
                              onClick={() => {
                                setPopValue(c);
                                setSendDate(c);
                              }}
                            >
                              <Mui.Typography>{c}</Mui.Typography>
                            </Mui.Stack>
                          </Mui.Grid>
                        ))}
                      </Mui.Grid>
                    </Mui.Stack>
                  </PopOverStyle> */}
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
          )}
        </section>
      </div>
      <RecurringDateDialog
        openPop={openPop}
        HandlePop={HandlePop}
        valueRadio={valueRadio}
        setValueRadio={setValueRadio}
        drawer={drawer.datePopup}
        setPopValue={setPopValue}
        setSendDate={setSendDate}
        setDrawer={setDrawer}
      />
    </div>
  );
}

export default RecurringSheet;
