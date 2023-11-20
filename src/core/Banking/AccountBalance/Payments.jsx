import * as React from 'react';
import * as Mui from '@mui/material';
import { makeStyles } from '@material-ui/core';

import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import * as themes from '@root/theme.scss';

// import downArrow from '@assets/downArrow.svg';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import Input from '@components/Input/Input.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
// import { CommonDrawer } from './CommonDrawer';
// import InputCategoriz from '../inputCategorize';
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
const Payments = ({
  mappingDetails,
  onget,
  totalAmt,
  setCategory,
  setNotes,
  setAccId,
  notes,
  id,
}) => {
  //  console.log('gettingReciept', id, mappingDetails);
  // console.log('gettingReciept', typeof mappingDetails.id);
  const classes = useStyles();

  // const { changeSubView } = React.useContext(AppContext);
  const { organization, openSnackBar, enableLoading, user } =
    React.useContext(AppContext);

  // const [popOver, setPopOver] = React.useState(null);
  const [towards, setTowards] = React.useState([]);
  const [radio, SetRadio] = React.useState('Select Something');
  const [radioCategory, SetRadioCategory] = React.useState('Select Something');
  const [checkall, setcheckall] = React.useState(false);
  const [SelectedId, setSelectedId] = React.useState('');

  // React.useEffect(() => {
  //   setPopOver(null);
  // }, [radio]);

  const [billDetail, setBillDetail] = React.useState([]);
  React.useEffect(() => {
    onget({ txn_line_id: '0', tds_amount: '0' });
  }, [billDetail]);
  const typing = (e) => {
    setNotes(e.target.value);
  };
  // const fetchBillDetails = () => {
  //   if (mappingDetails?.id === undefined) {
  //     enableLoading(false);
  //   } else {
  //     enableLoading(true);
  //     RestApi(
  //       `organizations/${organization.orgId}/vendor_unsettled?vendor_id=${mappingDetails?.id}`,
  //       {
  //         method: METHOD.GET,
  //         headers: {
  //           Authorization: `Bearer ${user.activeToken}`,
  //         },
  //       },
  //     )
  //       .then((res) => {
  //         if (res && !res.error) {
  //           // setTxn(res.data.map((c) => c));
  //           setBillDetail(res.data);
  //         }
  //         // console.log('then1', res);
  //       })
  //       .catch((e) => {
  //         openSnackBar({
  //           message: Object.values(e.errors).join(),
  //           type: MESSAGE_TYPE.ERROR,
  //         });
  //         enableLoading(false);
  //       });
  //     enableLoading(false);
  //   }
  // };
  React.useEffect(() => {
    if (typeof mappingDetails.id === 'string') {
      // fetchBillDetails();
      setCategory('payment_to_party');
    }
  }, [mappingDetails]);

  // console.log('fetchDetails', billDetail);
  // const newArr = [];
  // const arrangementOfTowards = async() => {
  //   await towards?.forEach((e) => {
  //     if (e.account_type_sub_category === 'accounts_payable') {
  //       newArr.unshift(e);
  //     } else {
  //       newArr.push(e);
  //     }
  //   });
  //   setTowards(newArr);
  // };
  const apiTowards = async () => {
    // enableLoading(true);
    await RestApi(
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
        // console.log('then1', res);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
    // arrangementOfTowards();
    enableLoading(false);
  };
  const apiTowardsLastFilter = (accountId) => {
    setAccId(accountId);
    // enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendor_unsettled?vendor_id=${mappingDetails?.id}&account_id=${accountId}`,
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

  const deleteLastVal = (e, type) => {
    const tempArr = billDetail.map((item) => {
      if (item.id === e.id) {
        if (type === 'tds') {
          item.tdsInput = '';
        } else if (type === 'amount') {
          item.amountInput = '';
        }
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
    });
    setBillDetail(billDetail);
  };
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
  // const [cardValue,setcardValue]=React.useState('');
  // React.useEffect(()=>{
  //     setcardValue(id?.amount>0 ? (id?.amount):((id?.amount).toString().slice(1)));
  // },[id]);
  const validNumber = new RegExp(/^\d*\.?\d*$/);

  return (
    <>
      <Mui.Stack direction="row">
        <Mui.Grid xs={3} className={css.towardsTds}>
          Towards
        </Mui.Grid>
        <Mui.Grid
          xs={9}
          md={0}
          sm={0}
          lg={0}
          className={css.stackTowards}
          // onClick={() => {
          //   apiTowards();
          // }}
        >
          <FormControl sx={{ m: 1, width: '95%' }} variant="standard">
            {/* <InputLabel id="demo-customized-select-label">Towards</InputLabel> */}

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={radio}
              // onClick={(e) => {
              //   setPopOver(e.currentTarget);
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
                    value.account_type_sub_category === 'accounts_payable',
                ),
                ...towards.filter(
                  (value) =>
                    value.account_type_sub_category !== 'accounts_payable',
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
                      SetRadioCategory(e.outflow_description);
                      setNotes('');
                      SetRadio(event.target.value);
                      setSelectedId(e.id);
                      apiTowardsLastFilter(e.id);
                    }}
                  >
                    <FormControlLabel
                      onClick={() => {}}
                      value={`${e?.name?.toLowerCase()}(${e?.outflow_description?.toLowerCase()})`}
                      control={<Radio style={{ color: '#F08B32' }} />}
                      label={
                        <p
                          className={css.menu}
                        >{`${e?.name?.toLowerCase()} (${e?.outflow_description?.toLowerCase()})`}</p>
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
      </Mui.Stack>

      {/* <Mui.Grid
            className={`${css.PaymentDropDownToward} ${css.PaymentDropDownTowardWithWebView}`}
            onClick={(e) => {
              setPopOver(e.currentTarget);
            }}
          >
            <Mui.Grid className={css.PaymentDropDownTowardFont}>
              {radio}
            </Mui.Grid>
            <Mui.Grid style={{ marginRight: '15px' }}>
              <img src={downArrow} alt="arrow" />
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Grid>
      </Mui.Stack>

      <Mui.Menu
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
              //   'Loan Repayment',
              //   'Deposit Refunded',
              //   'Deposit Made',
              //   'Loans Given',
              //   'Owner’s Drawings',
              // ]
              [
                ...towards.filter(
                  (value) =>
                    value.account_type_sub_category === 'accounts_payable',
                ),
                ...towards.filter(
                  (value) =>
                    value.account_type_sub_category !== 'accounts_payable',
                ),
              ]?.map((e) => (
                <li key={e.id} aria-hidden="true">
                  <RadioGroup
                    // className={css.modeOfCommunication}
                    value={radio}
                    onChange={(event) => {
                      SetRadioCategory(e.outflow_description);
                      setNotes('');
                      SetRadio(event.target.value);
                      apiTowardsLastFilter(e.id);
                    }}
                  >
                    <FormControlLabel
                      value={`${e?.name?.toLowerCase()}(${e?.outflow_description?.toLowerCase()})`}
                      control={<Radio style={{ color: '#F08B32' }} />}
                      label={
                        <p
                          className={css.modeOFcom}
                          style={{ textTransform: 'capitalize' }}
                        >{`${e?.name?.toLowerCase()}(${e?.outflow_description?.toLowerCase()})`}</p>
                      }
                    />
                  </RadioGroup>
                </li>
              ))
            }
          </ul>
        </div>
      </Mui.Menu> */}

      {(radioCategory === 'Customer Refund / Advance' ||
        radioCategory === 'Bill Settlement') && (
        <Mui.Stack direction="column">
          <Mui.Grid direction="row" className={css.TowardsHead}>
            <Mui.Grid xs={0} md={0} sm={0} lg={0} className={css.checkBoxGrid}>
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
                  // onClick={() => selectedCust(val)}
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
          {billDetail.length > 0 &&
            billDetail?.map((e) => (
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
                    // value={+(e?.net_balance)+1000}
                    type="text"
                    placeholder="Enter Amount"
                    className={css.inputF}
                    disabled={e ? !e.selected : false}
                    onChange={(v) => {
                      const convert = v?.target?.value.replace(/,/g, '');
                      if (validNumber.test(convert)) {
                        tdsAmount(v.target.value, e, 'tds');
                        onget({
                          txn_line_id: e?.id,
                          tds_amount: v.target.value,
                        });
                      } else if (!v.target.value) {
                        onget({
                          txn_line_id: e?.id,
                          tds_amount: 0,
                        });
                        deleteLastVal(e, 'tds');
                      }
                    }}
                    value={
                      e.selected
                        ? ((e.tdsInput >= 0 ||
                            e.tdsInput === '' ||
                            validNumber.test(e.tdsInput) ||
                            e?.tdsInput?.includes('.') === true) &&
                            FormattedAmount(+e?.tdsInput)) ||
                          ''
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
                    onChange={(v) => {
                      const convert = v?.target?.value.replace(/,/g, '');
                      // const validNumber = new RegExp(/^\d*\.?\d*$/);
                      if (validNumber.test(convert)) {
                        tdsAmount(v.target.value, e, 'amount');
                        onget({ txn_line_id: e?.id, amount: v.target.value });
                      }
                      // else if(convert===""&&(!(/^[a-zA-Z]+$/.test(convert)))){
                      else if (!v.target.value) {
                        onget({ txn_line_id: e?.id, amount: 0 });
                        deleteLastVal(e, 'amount');
                      }
                    }}
                    value={
                      e.selected
                        ? ((e.amountInput >= 0 || e.amountInput === '') &&
                            FormattedAmount(+e?.amountInput)) ||
                          ''
                        : 'Enter Amount'
                    }
                  />
                </Mui.Grid>
              </Mui.Grid>
            ))}
          {billDetail.length === 0 && <Mui.Grid>No Datas Found</Mui.Grid>}
          {billDetail.length > 0 && billDetail && (
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
                  color:
                    totalAmt > id.amount?.toString().slice(1)
                      ? 'red'
                      : '#283049',
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

      {(radioCategory === 'Loan Repayment' ||
        radioCategory === 'Director Loan Repaid' ||
        radioCategory === 'Deposit Repaid' ||
        radioCategory === 'Deposit Refund Received' ||
        radioCategory === 'Loan Collection' ||
        radioCategory === 'Share Application Money Refund') && (
        <Mui.Stack direction="column">
          <Mui.Grid direction="row" className={css.TowardsHead}>
            <Mui.Grid xs={0} md={0} sm={0} lg={0} className={css.checkBoxGrid}>
              <Mui.Typography className={css.checkBox}>
                <Mui.Checkbox
                  onChange={() => {
                    const newtempArr = billDetail?.map((e) => ({
                      ...e,
                      selected: !checkall,
                    }));
                    setcheckall(!checkall);
                    setBillDetail([...newtempArr]);
                  }}
                  checked={checkall}
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
          {billDetail.length > 0 &&
            billDetail?.map((e) => (
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
                  {/* {inputCategorize} */}
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
            ))}
          {billDetail.length === 0 && <Mui.Grid>No Datas Found</Mui.Grid>}
          {billDetail.length > 0 && billDetail && (
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

      {(radioCategory === 'New Deposit' ||
        radioCategory === 'Advance Given') && (
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
          {/* ))} */}
        </Mui.Stack>
      )}

      {radioCategory === 'Drawings' && (
        <Mui.Stack direction="column">
          <Mui.Grid className={css.note}>Notes</Mui.Grid>
          {/* {billDetail?.map((e) => ( */}

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
              // value={e.narration}
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
          {/* ))} */}
        </Mui.Stack>
      )}
    </>
  );
};
export default Payments;
