import * as React from 'react';
import * as Mui from '@mui/material';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core';

import downArrow from '@assets/downArrow.svg';
import AppContext from '@root/AppContext.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import Input from '@components/Input/Input.jsx';
import * as themes from '@root/theme.scss';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import * as css from './categorize.scss';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    // marginTop: theme.spacing(3),
  },
  '& .MuiSelect-nativeInput': {
    opacity: 1,
    width: '85%',
    overflow: 'auto',
    top: 8,
    left: 5,
    height: '15px',

    // background: "rgba(242, 242, 240, 0.3)",
    // boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.1)",
    border: 'transparent',
    textTransform: 'capitalize',
  },
  '& .MuiInputBase-input': {
    // borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    maxHeight: '8px !important',
    height: '8px',
    minHeight: '8px !important',
    borderRadius: '8px',

    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      background: 'rgba(242, 242, 240, 0.3)',
      boxShadow: 'inset 0px 0px 4px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      borderColor: '#inset 0px 0px 4px rgba(0, 0, 0, 0.1)',
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

const useStyles = makeStyles(() => ({
  // root: {},
  icon: {
    color: '#F08B32 !important',
  },
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    height: '100px',
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

// eslint-disable-next-line no-unused-vars
const Reciept = ({
  id,
  mappingDetails,
  onget,
  totalAmt,
  setCategory,
  setNotes,
  notes,
  setAccId,
}) => {
  //  console.log('gettingReciept',   mappingDetails);
  const classes = useStyles();

  const { organization, openSnackBar, enableLoading, user } =
    React.useContext(AppContext);

  const [billDetail, setBillDetail] = React.useState([]);
  // const [ billDetail, setBillDetail] = React.useState([]);
  const [towards, setTowards] = React.useState([]);
  // const [popOver, setPopOver] = React.useState(null);
  const [popOverOpen, setPopOverOpen] = React.useState(null);

  const [popOverPercentage, setPopOverPercentage] = React.useState('0%');

  const [radio, SetRadio] = React.useState('Select Something');
  const [radioCategory, SetRadioCategory] = React.useState('Select Something');

  const [checkall, setcheckall] = React.useState(false);
  // const openPopOver = Boolean(popOver);
  const openPopOverPercent = Boolean(popOverOpen);
  const [SelectedId, setSelectedId] = React.useState('');

  // React.useEffect(() => {
  //   setPopOver(null);
  // }, [radio]);
  React.useEffect(() => {
    onget({ txn_line_id: '0', tds_amount: '0' });
  }, [billDetail]);
  const fetchBillDetails = () => {
    if (mappingDetails?.id === undefined) {
      enableLoading(false);
    } else {
      // enableLoading(true);
      RestApi(
        `organizations/${organization.orgId}/customer_unsettled?customer_id=${mappingDetails?.id}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((res) => {
          if (res && !res.error) {
            // setTxn(res.data.map((c) => c));
            setBillDetail(res.data);
          }
          // console.log('then1', res);
        })
        .catch((e) => {
          openSnackBar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        });
      enableLoading(false);
    }
  };

  const apiTowards = () => {
    // enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/accounts/categorization_account_list`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          // setTxn(res.data.map((c) => c));
          setTowards(res.data);
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };
  const apiTowardsLastFilter = (accountId) => {
    setAccId(accountId);
    // enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/customer_unsettled?customer_id=${mappingDetails?.id}&account_id=${accountId}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          // setTxn(res.data.map((c) => c));
          // setBillDetail(res.data);
          const newArr = res?.data ? res.data : [];
          newArr.map((e) => ({
            ...e,
            selected: false,
          }));
          setBillDetail([...newArr]);
          // setBillDetail(res.data);
        }
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
    enableLoading(false);
  };

  // console.log('billDetail', billDetail);

  // const newArr = [];
  // const arrangementOfTowards = () => {
  //   towards?.forEach((e) => {
  //     if (e.account_type_sub_category === 'accounts_receivable') {
  //       newArr.unshift(e);
  //     } else {
  //       newArr.push(e);
  //     }
  //   });
  //   setTowards(newArr);
  // };
  // React.useEffect(() => {
  //   arrangementOfTowards();
  // }, [towards]);
  React.useEffect(() => {
    fetchBillDetails();
    setCategory('receipt_from_party');
  }, [mappingDetails]);

  React.useEffect(() => {
    if (
      mappingDetails.name !== 'select your vendor' &&
      mappingDetails.name !== 'Select your customer' &&
      mappingDetails.name !== 'select your customer'
    ) {
      apiTowards();
      apiTowardsLastFilter(SelectedId);
    }
  }, [mappingDetails.name]);
  const typing = (e) => {
    setNotes(e.target.value);
  };
  const onsinglecheckChange = (e) => {
    const tempArr = billDetail.map((item) => {
      const itemtemp = item;
      if (itemtemp.id === e.id) {
        if (!itemtemp.selected) {
          setcheckall(false);
        }
        itemtemp.selected = !item.selected;
        delete item.tdsInput;
        delete item.amountInput;

        return item;
      }
      return item;
    });
    setBillDetail(tempArr);
  };
  const del = () => {
    const tempArr = billDetail.map((item) => {
      if (item?.tdsInput || item?.amountInput) {
        delete item?.tdsInput;
        delete item?.amountInput;
      }
      return item;
    });
    setBillDetail(tempArr);
  };
  const tdsAmount = (inputAmount, input, type) => {
    const convert = inputAmount.replace(/,/g, '');
    billDetail.forEach((e) => {
      if (e.id === input.id) {
        if (type === 'tds') {
          e.tdsInput = convert;
        } else if (type === 'amount') {
          e.amountInput = convert;
        }
      }
      // return e;
    });
    setBillDetail(billDetail);
  };

  // const getUserInputs =() =>{
  //   setuserDatas()
  // }
  // categorize button
  // const [ billSubmit, setBillSubmit] = React.useState([]);

  // const fetchBillSubmits = () => {
  //   // enableLoading(true);
  //   RestApi(
  //     `organizations/${organization.orgId}/yodlee_bank_accounts/categorization`,
  //     {
  //       method: METHOD.POST,
  //       headers: {
  //         Authorization: `Bearer ${user.activeToken}`,
  //       },
  //       payload: {
  //         bank_txn_id: "6b10a395-467c-41ad-ab31-a2a35ab8f1da",
  //         party_id: "1f87939f-979c-4430-856e-42033ddd5f15",
  //         type:  'receipt_from_party',
  //         bills: [
  //           {
  //             txn_line_id: "02535304-1a65-4a4f-930b-ba7c961a3b8e",
  //             amount: 75450,
  //             tds_amount: 1000
  //           },
  //           {
  //             txn_line_id: "02535304-1a65-4a4f-930b-ba7c961a3b8e",
  //           amount: 60450,
  //             tds_amount: 6045
  //           }
  //         ]
  //       }
  //     },
  //   ).then((res) => {
  //     if (res && !res.error) {
  //       // setTxn(res.data.map((c) => c));
  //       setBillSubmit(res.data);

  //      }
  //     console.log('then1',res);
  //     // enableLoading(false);
  //   });
  // };
  // console.log('then1',billSubmit);

  // if(mappingDetails?.name!=='Select your customer'){
  //   fetchBillDetails();
  // }

  const [tdsPercent, setTdsPercent] = React.useState(100);
  React.useEffect(() => {
    setTdsPercent(
      Number(
        popOverPercentage === 'Custom' ? 0 : popOverPercentage.replace('%', ''),
      ) / 100,
    );
    // if (popOverPercentage === '2%') {
    // setTdsPercent(popOverPercentage / 100);
    // } else {
    //   setTdsPercent(100 / 100);
    // }
  }, [popOverPercentage]);
  // const [age, setAge] = React.useState('');
  // const handleChange = (event) => {
  //   setAge(event.target.value);
  //   setPopOver(null);
  // };
  // console.log('target2', popOver);
  const deleteLastVal = (e, type) => {
    const tempArr = billDetail.map((item) => {
      if (item.id === e.id) {
        if (type === 'tds') {
          item.tdsInput = 0;
        } else if (type === 'amount') {
          item.amountInput = 0;
        }
      }
      return item;
    });
    setBillDetail(tempArr);
  };
  return (
    <>
      <Mui.Stack direction="row">
        <Mui.Grid xs={3} className={css.towardsTds}>
          Towards
        </Mui.Grid>

        {/* old popup */}
        <Mui.Grid
          xs={9}
          md={0}
          sm={0}
          lg={0}
          className={css.stackTowards}
          // onClick={() => {
          //   setPopOver('open');
          // }}
        >
          {/* <Mui.Grid
            className={`${css.PaymentDropDownToward} ${css.PaymentDropDownTowardWithWebView}`}
            
          > */}
          {/* <Mui.Grid
              className={css.PaymentDropDownTowardFont}
              // onClick={(e) => {
              //   setPopOver(e.currentTarget);
              // }}
            >
              {radio}
            </Mui.Grid>
            <Mui.Grid style={{ marginRight: '15px' }}>
              <img src={downArrow} alt="arrow" />
            </Mui.Grid> */}

          <FormControl sx={{ m: 1, width: '95%' }} variant="standard">
            {/* <InputLabel id="demo-customized-select-label">Towards</InputLabel> */}

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={radio}
              // onClick={() => {
              //   setPopOver('open');
              // }}
              // onChange={handleChange}
              // open={openPopOver}
              // openPopOver
              // onClose={() => {
              //   // console.log("target",e.currentTarget);
              //   setPopOver(null);
              // }}
              // styles={customStyles}
              input={<BootstrapInput />}
              MenuProps={{
                elevation: 3,
                sx: {
                  '& .MuiPaper-root': { bgcolor: 'background.default' },
                  maxHeight: 250,
                  minWidth: 50,
                  maxWidth: 78,
                  top: 0,
                },
              }}
            >
              {[
                ...towards.filter(
                  (value) =>
                    value.account_type_sub_category === 'accounts_receivable',
                ),
                ...towards.filter(
                  (value) =>
                    value.account_type_sub_category !== 'accounts_receivable',
                ),
              ]?.map((e) => (
                <MenuItem
                  value={e.id}
                  // onChange={() => setPopOver(null)}
                  aria-hidden="true"
                >
                  <RadioGroup
                    // className={css.modeOfCommunication}
                    value={radio}
                    onChange={(event) => {
                      SetRadioCategory(e.inflow_description);
                      setNotes('');
                      SetRadio(event.target.value);
                      setSelectedId(e.id);
                      apiTowardsLastFilter(e.id);
                    }}
                  >
                    <FormControlLabel
                      onClick={() => {}}
                      value={`${e?.name?.toLowerCase()}(${e?.inflow_description?.toLowerCase()})`}
                      control={<Radio style={{ color: '#F08B32' }} />}
                      label={
                        <p
                          className={css.menu}
                        >{`${e?.name?.toLowerCase()} (${e?.inflow_description?.toLowerCase()})`}</p>
                      }
                    />
                  </RadioGroup>
                </MenuItem>
              ))}

              {/* <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>
          </FormControl>
        </Mui.Grid>
        {/* </Mui.Grid> */}
      </Mui.Stack>
      {/* <Mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={radio}
                onClick={(e) => {
                  setPopOver(e.currentTarget);
                }}
                  // onChange={handleChangeSelectReceipt}
                MenuProps={menuProps}
                inputProps={{
                  classes: { root: classes.root, icon: classes.icon },
                }}
                className={css.select}
              >
                {[
            ...towards.filter(
              (value) =>
                value.account_type_sub_category === 'accounts_receivable'
            ),
            ...towards.filter(
              (value) =>
                value.account_type_sub_category !== 'accounts_receivable'
            ),
          ]?.map((e) => (
            <MenuItem
              value={e.id}
              onChange={() => setPopOver(null)}
              aria-hidden="true"
            >
              <RadioGroup
                // className={css.modeOfCommunication}
                value={radio}
                onChange={(event) => {
                  SetRadioCategory(e.inflow_description);
                  setNotes('');
                  SetRadio(event.target.value);
                  apiTowardsLastFilter(e.id);
                }}
              >
                <FormControlLabel
                  onClick={() => {}}
                  value={`${e?.name?.toLowerCase()}(${e?.inflow_description?.toLowerCase()})`}
                  control={<Radio style={{ color: '#F08B32' }} />}
                  label={
                    <p
                      className={css.modeOFcom}
                      style={{ textTransform: 'capitalize' }}
                    >{`${e?.name?.toLowerCase()}(${e?.inflow_description?.toLowerCase()})`}</p>
                  }
                />
              </RadioGroup>
            </MenuItem>
          ))} */}

      {/* <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
      {/* </FormControl> */}

      {/* <Mui.Menu
        id="basic-menu-sort"
        anchorEl={popOver}
        open={openPopOver}
        onClose={() => setPopOver(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            maxHeight: 241,
            width: '30ch',
            boxShadow: '0px 0px 40px rgba(48, 73, 191, 0.05)',
            borderRadius: '16px',
            padding: '23px',
          },
        }}
      >
        <div className={css.effortlessOptions2}>
          <span className={css.title}>Towards</span>
          <ul className={css.optionsWrapper}>
            {
              // [
              //   'Bill Settlement',
              //   'Loan Collection',
              //   'Deposit Refund Received',
              //   'Deposit Received',
              //   'Owner Contribution',
              // ]
              [
                ...towards.filter(
                  (value) =>
                    value.account_type_sub_category === 'accounts_receivable',
                ),
                ...towards.filter(
                  (value) =>
                    value.account_type_sub_category !== 'accounts_receivable',
                ),
              ]?.map((e) => (
                <li key={e.id} aria-hidden="true">
                  <RadioGroup
                    // className={css.modeOfCommunication}
                    value={radio}
                    onChange={(event) => {
                      SetRadioCategory(e.inflow_description);
                      setNotes('');
                      SetRadio(event.target.value);
                      apiTowardsLastFilter(e.id);
                    }}
                  >
                    <FormControlLabel
                      onClick={() => {}}
                      value={`${e?.name?.toLowerCase()}(${e?.inflow_description?.toLowerCase()})`}
                      control={<Radio style={{ color: '#F08B32' }} />}
                      label={
                        <p
                          className={css.modeOFcom}
                          style={{ textTransform: 'capitalize' }}
                        >{`${e?.name?.toLowerCase()}(${e?.inflow_description?.toLowerCase()})`}</p>
                      }
                    />
                  </RadioGroup>
                </li>
              ))
            }
          </ul>
        </div>
      </Mui.Menu> */}
      {(radioCategory === 'Bill Settlement' ||
        radioCategory === 'Vendor Refund / Advance') && (
        <>
          <Mui.Stack direction="row">
            <Mui.Grid className={css.towardsTds}>TDS</Mui.Grid>
            <Mui.Grid xs={0} md={0} sm={0} lg={0} className={css.stackTowards}>
              <Mui.Grid
                className={css.PaymentDropDownToward}
                style={{ width: '100px', cursor: 'pointer' }}
                onClick={(e) => {
                  setPopOverOpen(e.currentTarget);
                }}
              >
                <Mui.Grid
                  className={css.PaymentDropDownTowardFont}
                  // onClick={(e) => {
                  //   setPopOverOpen(e.currentTarget);
                  // }}
                >
                  {popOverPercentage}
                </Mui.Grid>
                <Mui.Grid style={{ marginRight: '15px' }}>
                  <img src={downArrow} alt="arrow" />
                </Mui.Grid>
              </Mui.Grid>
            </Mui.Grid>
            <Mui.Menu
              id="basic-menu-sort"
              anchorEl={popOverOpen}
              open={openPopOverPercent}
              onClose={() => setPopOverOpen(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                elevation: 3,
                style: {
                  maxHeight: 241,
                  width: '30ch',
                  boxShadow: '0px 0px 40px rgba(48, 73, 191, 0.05)',
                  borderRadius: '16px',
                  padding: '23px',
                },
              }}
            >
              <div className={css.effortlessOptions2}>
                <span className={css.title}>TDS</span>
                <ul className={css.optionsWrapper}>
                  {
                    // [
                    //   'Bill Settlement',
                    //   'Loan Collection',
                    //   'Deposit Refund Received',
                    //   'Deposit Received',
                    //   'Owner Contribution',
                    // ]
                    ['0%', '1%', '2%', '5%', '10%', 'Custom']?.map((e) => (
                      <li key={e} aria-hidden="true">
                        <RadioGroup
                          // className={css.modeOfCommunication}
                          value={popOverPercentage}
                          onChange={(event) => {
                            setPopOverPercentage(event.target.value);
                            setPopOverOpen(null);
                          }}
                        >
                          <FormControlLabel
                            onClick={() => {}}
                            value={e}
                            control={<Radio style={{ color: '#F08B32' }} />}
                            label={<p className={css.modeOFcom}>{e}</p>}
                          />
                        </RadioGroup>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </Mui.Menu>
          </Mui.Stack>
          <Mui.Stack direction="column">
            <Mui.Grid direction="row" className={css.TowardsHead}>
              <Mui.Grid
                xs={0}
                md={0}
                sm={0}
                lg={0}
                className={css.checkBoxGrid}
              >
                <Mui.Typography className={css.checkBox}>
                  <Mui.Checkbox
                    size="small"
                    onChange={() => {
                      del();
                      const newtempArr = billDetail?.map((e) => ({
                        ...e,
                        selected: !checkall,
                      }));
                      setcheckall(!checkall);
                      setBillDetail([...newtempArr]);
                    }}
                    checked={checkall}
                    style={{ color: '#F08B32' }}
                  />
                </Mui.Typography>
              </Mui.Grid>
              <Mui.Grid xs={3} md={3} sm={3} lg={3} className={css.fonts}>
                Bill no
              </Mui.Grid>
              <Mui.Grid xs={3} md={3} sm={3} lg={3} className={css.fonts}>
                Pending
              </Mui.Grid>
              <Mui.Grid xs={3} md={3} sm={3} lg={3} className={css.fonts}>
                TDS
              </Mui.Grid>
              <Mui.Grid xs={3} md={3} sm={3} lg={3} className={css.adjustments}>
                Adjustment
              </Mui.Grid>
            </Mui.Grid>

            {billDetail?.length === 0 && (
              <Mui.Grid className={css.towardsTds}>No Datas Found</Mui.Grid>
            )}
            {billDetail?.length > 0 &&
              billDetail?.map((e) => {
                return (
                  <Mui.Grid
                    direction="row"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: '3px',
                    }}
                  >
                    <Mui.Grid
                      xs={0}
                      md={0}
                      sm={0}
                      lg={0}
                      className={css.checkBoxGrid}
                    >
                      <Mui.Typography className={css.checkBox}>
                        <Mui.Checkbox
                          size="small"
                          onChange={() => {
                            onsinglecheckChange(e);
                          }}
                          checked={!!e.selected}
                          style={{ color: '#F08B32' }}
                        />
                      </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Grid
                      xs={3}
                      md={3}
                      sm={3}
                      lg={3}
                      style={{
                        fontSize: '10px',
                        fontWeight: '400',
                        marginRight: '2px',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {e?.document_number}
                    </Mui.Grid>
                    <Mui.Grid
                      xs={3}
                      md={3}
                      sm={3}
                      lg={3}
                      style={{
                        fontSize: '10px',
                        fontWeight: '400',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {FormattedAmount(parseInt(e?.net_balance, 10))}
                    </Mui.Grid>
                    <Mui.Grid
                      xs={3}
                      md={3}
                      sm={3}
                      lg={3}
                      style={{
                        fontSize: '10px',
                        fontWeight: '400',
                        color: '#34AA44',
                      }}
                    >
                      {/* {inputCategorize} */}

                      <input
                        type="text"
                        placeholder="Enter Amount"
                        disabled={e ? !e.selected : false}
                        className={css.inputF}
                        onChange={(v) => {
                          const convert = v?.target?.value.replace(/,/g, '');
                          // if (/^[0-9]+$/.test(convert)) {
                          const validNumber = new RegExp(/^\d*\.?\d*$/);
                          if (validNumber.test(convert)) {
                            tdsAmount(v.target.value, e, 'tds');
                            onget({
                              txn_line_id: e?.id,
                              tds_amount: v.target.value,
                            });
                          } else if (!v.target.value) {
                            deleteLastVal(e, 'tds');
                            onget({
                              txn_line_id: e?.id,
                              tds_amount: 0,
                            });
                          }
                        }}
                        value={
                          e.selected
                            ? ((e.tdsInput >= 0 || e.tdsInput === '') &&
                                FormattedAmount(e?.tdsInput)) ||
                              (e.tdsInput === undefined
                                ? FormattedAmount(+e?.net_balance * tdsPercent)
                                : FormattedAmount(e?.tdsInput))
                            : 'Enter Amount'
                        }
                      />
                    </Mui.Grid>
                    <Mui.Grid
                      xs={3}
                      md={3}
                      sm={3}
                      lg={3}
                      style={{
                        fontSize: '10px',
                        fontWeight: '400',
                        marginLeft: '3px',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Enter Amount"
                        disabled={e ? !e.selected : false}
                        className={css.inputF}
                        required={e.selected}
                        onChange={(v) => {
                          const convert = v?.target?.value.replace(/,/g, '');
                          const validNumber = new RegExp(/^\d*\.?\d*$/);
                          if (
                            validNumber.test(convert) ||
                            v?.target?.value.includes('.')
                          ) {
                            tdsAmount(v.target.value, e, 'amount');

                            // onget({ txn_line_id: e?.id, tds_amount:+(e?.net_balance)*tdsPercent });
                            onget(
                              {
                                txn_line_id: e?.id,
                                amount: v.target.value,
                                // tds_amount: +e?.net_balance * tdsPercent,
                              },
                              'check',
                            );
                          } else if (!v.target.value) {
                            deleteLastVal(e, 'amount');
                            onget({ txn_line_id: e?.id, amount: 0 });
                          }
                        }}
                        value={
                          e.selected
                            ? ((e.amountInput >= 0 ||
                                e.tdsInput === '' ||
                                e?.amountInput?.includes('.') === true) &&
                                FormattedAmount(e?.amountInput)) ||
                              ''
                            : 'Enter Amount'
                        }
                      />
                    </Mui.Grid>
                  </Mui.Grid>
                );
              })}

            {billDetail?.length > 0 && billDetail && (
              <Mui.Grid
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: '15px',
                  justifyContent: 'right',
                }}
              >
                {mappingDetails?.id !== undefined ? (
                  <>
                    <Mui.Grid
                      xs={3}
                      md={3}
                      sm={3}
                      lg={3}
                      style={{
                        fontWeight: '500',
                        fontSize: '11px',
                        lineHeight: '14px',
                        color: '#283049',
                      }}
                    >
                      Total settlement
                    </Mui.Grid>
                    <Mui.Grid
                      xs={3}
                      md={3}
                      sm={3}
                      lg={3}
                      style={{
                        fontWeight: '500',
                        fontSize: '11px',
                        lineHeight: '14px',
                        color: totalAmt > id.amount ? 'red' : '#283049',
                      }}
                    >
                      {FormattedAmount(totalAmt)}
                    </Mui.Grid>
                  </>
                ) : (
                  ''
                )}
              </Mui.Grid>
            )}
          </Mui.Stack>
        </>
      )}

      {(radioCategory === 'Deposit Redemption' ||
        radioCategory === 'Advance Returned' ||
        radioCategory === 'Owner Contribution Received') && (
        <Mui.Stack direction="column">
          <Mui.Grid direction="row" className={css.TowardsHead}>
            <Mui.Grid xs={0} md={0} sm={0} lg={0} className={css.checkBoxGrid}>
              <Mui.Typography className={css.checkBox}>
                <Mui.Checkbox
                  size="small"
                  // onClick={() => selectedCust(val)}
                  style={{ color: '#F08B32' }}
                />
              </Mui.Typography>
            </Mui.Grid>

            <Mui.Grid xs={3} md={3} sm={3} lg={3} style={{ fontSize: '12px' }}>
              Doc No
            </Mui.Grid>
            <Mui.Grid xs={3} md={3} sm={3} lg={3} style={{ fontSize: '12px' }}>
              Notes
            </Mui.Grid>
            <Mui.Grid xs={3} md={3} sm={3} lg={3} style={{ fontSize: '12px' }}>
              Pending
            </Mui.Grid>
            <Mui.Grid xs={3} md={3} sm={3} lg={3} style={{ fontSize: '12px' }}>
              Adjustment
            </Mui.Grid>
          </Mui.Grid>
          {billDetail?.length === 0 && (
            <Mui.Grid className={css.towardsTds}>No Datas Found</Mui.Grid>
          )}
          {billDetail?.length > 0 &&
            billDetail?.map((e) => {
              return (
                <Mui.Grid
                  direction="row"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '3px',
                  }}
                >
                  <Mui.Grid
                    xs={0}
                    md={0}
                    sm={0}
                    lg={0}
                    className={css.checkBoxGrid}
                  >
                    <Mui.Typography className={css.checkBox}>
                      <Mui.Checkbox
                        size="small"
                        checked={e.selected}
                        // onClick={() => selectedCust(val)}
                        style={{ color: '#F08B32' }}
                      />
                    </Mui.Typography>
                  </Mui.Grid>
                  <Mui.Grid
                    xs={3}
                    md={3}
                    sm={3}
                    lg={3}
                    style={{
                      fontSize: '10px',
                      fontWeight: '400',
                      marginRight: '2px',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {e?.document_number}
                  </Mui.Grid>
                  <Mui.Grid xs={3} md={3} sm={3} lg={3} className={css.inputF1}>
                    <Mui.Typography className={css.inputf2}>
                      {e.narration}
                    </Mui.Typography>
                  </Mui.Grid>
                  <Mui.Grid
                    xs={3}
                    md={3}
                    sm={3}
                    lg={3}
                    style={{
                      fontSize: '10px',
                      fontWeight: '400',
                      color: '#34AA44',
                    }}
                  >
                    {FormattedAmount(parseInt(e?.net_balance, 10))}
                  </Mui.Grid>
                  <Mui.Grid
                    xs={3}
                    md={3}
                    sm={3}
                    lg={3}
                    style={{
                      fontSize: '10px',
                      fontWeight: '400',
                      marginLeft: '3px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter Amount"
                      disabled={e ? !e.selected : false}
                      className={css.inputF}
                      onChange={(v) => {
                        // setTotalAmt(0);
                        onget({ txn_line_id: e?.id, amount: v.target.value });
                      }}
                    />
                  </Mui.Grid>
                </Mui.Grid>
              );
            })}
          {billDetail?.length > 0 && billDetail && (
            <Mui.Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '15px',
                justifyContent: 'right',
              }}
            >
              <Mui.Grid xs={3} md={3} sm={3} lg={3} />
              <Mui.Grid xs={3} md={3} sm={3} lg={3} />
              <Mui.Grid
                xs={3}
                md={3}
                sm={3}
                lg={3}
                style={{
                  fontWeight: '500',
                  fontSize: '11px',
                  lineHeight: '14px',
                  color: '#283049',
                }}
              >
                {mappingDetails.id === undefined ? '' : 'Total settlement'}
              </Mui.Grid>
              <Mui.Grid
                xs={3}
                md={3}
                sm={3}
                lg={3}
                style={{
                  fontWeight: '500',
                  fontSize: '11px',
                  lineHeight: '14px',
                  color: '#283049',
                  paddingLeft: '5px',
                }}
              >
                {mappingDetails.id === undefined
                  ? ''
                  : FormattedAmount(totalAmt)}
              </Mui.Grid>
            </Mui.Grid>
          )}
          <Mui.Grid
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: '16px',
              justifyContent: 'right',
              alignItems: 'baseline',
            }}
          >
            {/* <Mui.Grid
            xs={3}
            md={3}
            sm={3}
            lg={3}
            style={{
              fontWeight: '500',
              fontSize: '11px',
              lineHeight: '14px',
              color: '#333333',
            }}
          >
            On Account
          </Mui.Grid>
          <Mui.Grid
            xs={3}
            md={3}
            sm={3}
            lg={3}  
            style={{
              marginLeft: '3px',
            }}
          >
            <InputCategoriz />
          </Mui.Grid> */}
          </Mui.Grid>
        </Mui.Stack>
      )}

      {(radioCategory === 'Director Loan Taken' ||
        radioCategory === 'Deposit Taken' ||
        radioCategory === 'Loan Taken' ||
        radioCategory === 'Deposit Given' ||
        radioCategory === 'Loan Given' ||
        radioCategory === 'Share Application Money Received') && (
        <Mui.Stack direction="column">
          <Mui.Grid className={css.note}>Notes</Mui.Grid>
          {/* {billDetail?.map((e) => ( */}

          <Mui.Grid>
            <Input
              multiline
              name="Notes"
              value={notes}
              onChange={typing}
              // value={e.narration}

              // onBlur={reValidate}
              // error={validationErr.vendorName}
              // helperText={
              //   validationErr.vendorName
              //     ? VALIDATION?.vendorName?.errMsg
              //     : ''
              // }
              className={`${css.greyBorder} ${classes.root}`}
              label="Notes"
              variant="standard"
              // value={state.vendorName}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              // onChange={onInputChange}
              theme="light"
            />
          </Mui.Grid>
        </Mui.Stack>
      )}
      {radioCategory === 'Owner Contribution Received' && (
        <Mui.Stack direction="column">
          <Mui.Grid className={css.note}>Notes</Mui.Grid>
          <Mui.Grid>
            <Input
              multiline
              name="Notes"
              // onBlur={reValidate}
              // error={validationErr.vendorName}
              // helperText={
              //   validationErr.vendorName
              //     ? VALIDATION?.vendorName?.errMsg
              //     : ''
              // }
              className={`${css.greyBorder} ${classes.root}`}
              label=""
              variant="standard"
              // value={state.vendorName}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              // onChange={onInputChange}
              theme="light"
            />
            <Mui.Grid className={css.uploadEmi}>
              <Input
                multiline
                name="Notes"
                // onBlur={reValidate}
                // error={validationErr.vendorName}
                // helperText={
                //   validationErr.vendorName
                //     ? VALIDATION?.vendorName?.errMsg
                //     : ''
                // }
                className={`${css.greyBorder} ${classes.root}`}
                style={{ height: '40px' }}
                label=""
                variant="standard"
                // value={state.vendorName}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                // onChange={onInputChange}
                theme="light"
              />
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Stack>
      )}
    </>
  );
};
export default Reciept;
