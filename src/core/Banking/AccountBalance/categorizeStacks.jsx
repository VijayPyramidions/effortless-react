import * as React from 'react';
import * as Mui from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import paid from '@assets/paid.svg';
import downArrow from '@assets/downArrow.svg';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import paid2 from '@assets/recv.svg';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';
import Reciept from './Reciept';
import Payments from './Payments';
// import Income from './Income';
import Expense from './Expense';
import { CommonDrawer } from './CommonDrawer';
import * as css from './categorize.scss';

const CategorizeStacks = ({ e, cssForOneCard, minWidth, setTrigger }) => {
  const [BottomSheetNumber, setBottomSheetNumber] = React.useState(false);
  const [categoryTitle, setcategoryTitle] = React.useState('');
  const [totalAmt, setTotalAmt] = React.useState(0);

  const useStyles = makeStyles(() => ({
    root: {},
    icon: {
      color: '#F08B32 !important',
    },
    expenseInput: {
      backgroundColor: 'rgba(237, 237, 237, 0.15)',
      border: '0.7px solid rgba(153, 158, 165, 0.39)',
      width: '93%',
      minHeight: '34px',
    },
    lastStack: {
      marginLeft: '10px',
      marginRight: '10px',
    },
  }));
  const classes = useStyles();
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
  };
  const { organization, user, enableLoading } = React.useContext(AppContext);

  const [categoryUi, setcategoryUi] = React.useState('');
  const [img, setImg] = React.useState('');
  const [drpDownValue, setdrpDownValue] = React.useState({
    name: 'Select your customer',
  });
  const [ExpenseDatas, setExpenseDatas] = React.useState({});
  // eslint-disable-next-line no-unused-vars
  const [submit, setSubmit] = React.useState('');
  const [submitState, setSubmitState] = React.useState();
  const [notes, setNotes] = React.useState('');
  const [accId, setAccId] = React.useState('');
  const [submitAmount, setSubmitAmount] = React.useState('');

  const [category, setCategory] = React.useState('income');
  // const [checkedValues,setCheckedValues]=React.useState([]);
  const navigate = Router.useNavigate();

  const submitExpenseCategorization = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/yodlee_bank_accounts/categorization`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          bank_txn_id: e.id,
          account_id: drpDownValue.id,
          type: 'expense',
          // amount: ExpenseDatas.amount,
          // tax_amount: ExpenseDatas.taxAmt,
          amount: ExpenseDatas.amount,
          tax_amount: ExpenseDatas.taxAmt,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setSubmit(res);
        if (res.message === 'Categorization successful') {
          // changeSubView('done');
          navigate('/banking-categorize-done', {
            state: { fromCategorize: 'done' },
          });
        }
      }
    });
    enableLoading(false);
  };

  const submitIncomeCategorization = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/yodlee_bank_accounts/categorization`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          bank_txn_id: e.id,
          account_id: drpDownValue.id,
          narration: notes,
          type: category,
          amount: submitAmount,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setSubmit(res);
        if (res.message === 'Categorization successful') {
          // changeSubView('done');
          navigate('/banking-categorize-done', {
            state: { fromCategorize: 'done' },
          });
        }
      }
      enableLoading(false);
    });
  };

  const filterTds = () => {
    const submission =
      notes === ''
        ? {
            bank_txn_id: e.id,
            entity_id: drpDownValue.id,
            account_id: accId,
            type: category,
            bills: submitState,
          }
        : {
            bank_txn_id: e.id,
            entity_id: drpDownValue.id,
            account_id: accId,
            narration: notes,
            amount: Math.abs(Number(e?.amount)),
            type: category,
            // bills: submitState
          };
    return submission;
  };
  const submitCategorization = () => {
    // filterTds()
    if (categoryUi === 'EXPENSE') {
      submitExpenseCategorization();
    } else if (categoryUi === 'INCOME') {
      submitIncomeCategorization();
    } else {
      enableLoading(true);
      RestApi(
        `organizations/${organization.orgId}/yodlee_bank_accounts/categorization`,
        {
          method: METHOD.POST,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
          payload: filterTds(),
        },
      ).then((res) => {
        if (res && !res.error) {
          setSubmit(res);
          if (res.message === 'Categorization successful') {
            // changeSubView('done');
            navigate('/banking-categorize-done', {
              state: { fromCategorize: 'done' },
            });
          }
        }
      });
    }
    enableLoading(false);
  };

  React.useEffect(() => {
    setcategoryUi(e.type);
  }, []);

  const ExpenseData = (rec) => {
    setExpenseDatas(rec);
    // fetchBankDetails2(rec.id);
  };

  // React.useEffect(()=>{
  //   if(submitState){
  //     let sumAmt;
  //     submitState.forEach((element)=>{
  //       sumAmt += Number(element.amount);
  //     });
  //     setTotalAmt(sumAmt);
  //   }
  // },[submitState]);

  // const checkedFunction=(rec)=>{
  // const newArr= [];
  // if(checkedValues.length>0){
  //       checkedValues.forEach((element) => {
  //         if (element.txn_line_id === rec.txn_line_id) {

  //           const filtered = checkedValues.filter(
  //             (v) => v.txn_line_id !== rec.txn_line_id ,
  //             );
  //             console.log('called1',filtered);
  //           setCheckedValues(filtered);
  //           }else{
  //             console.log('called2');
  //             // newArr=checkedValues.map((e)=>e);
  //             checkedValues.push(rec);
  //             // setCheckedValues(newArr);
  //           }
  //         });
  //   }
  //   else if(checkedValues.length===0){

  //     newArr.push(rec);
  //     setCheckedValues(newArr);
  //   }

  // };
  const getData = (rec) => {
    // console.log('recieved', rec);
    // if(checked==='check'){
    //   checkedFunction(rec);
    // };
    const newArr = submitState || [];
    let sumAmt = 0;
    const addData =
      newArr &&
      newArr.find((element) => element.txn_line_id === rec.txn_line_id);
    if (addData) {
      newArr.forEach((element) => {
        if (element.txn_line_id === rec.txn_line_id) {
          Object.assign(element, rec);
        }
      });
    } else {
      newArr.push(rec);
    }
    newArr.forEach((element) => {
      if (element?.amount) {
        const convert = element?.amount?.replace(/,/g, '');
        sumAmt = Number(sumAmt) + (Number(convert) || 0);
      }
    });
    setTotalAmt(sumAmt);
    // setSubmitState( newArr
    // .filter((val)=>
    // val!=={txn_line_id: '0', amount: '0'}
    // );
    // setSubmitState(val);
    const filtered = newArr.filter(
      (v) => v.txn_line_id !== '0' && v.amount !== 0 && v.amount !== '0',
    );
    setSubmitState(filtered);
  };
  // console.log('inputDatas', submitState);

  const passData = (rec) => {
    getData({ txn_line_id: '0', amount: '0' });
    // setTotalAmt(0);
    setdrpDownValue(rec);
    // fetchBankDetails2(rec.id);
  };
  React.useEffect(() => {
    setBottomSheetNumber(false);
  }, [drpDownValue]);

  // const [category, setCategory] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const handleChangeSelectReceipt = (val) => {
    // setCategory12(category, 'val.target.value');
    // console.log('category', val);
    // setCategorize({'dropdown':val.target.value});
  };
  const drawer = (prop) => {
    // setCategorize(prop);
    setcategoryUi(prop);
  };

  React.useEffect(() => {
    if (categoryUi === 'INCOME') {
      setCategory('income');

      setcategoryTitle('Income Category');
      setdrpDownValue({ name: 'select an income category' });
      // setdrpDownValue('Se')
      setImg(paid);
    } else if (categoryUi === 'receipt') {
      setcategoryTitle('Received From');
      setdrpDownValue({ name: 'select your customer' });

      setImg(paid);
    } else if (categoryUi === 'payment') {
      setcategoryTitle('Paid to');
      setdrpDownValue({ name: 'select your vendor' });

      setImg(paid2);
    } else if (categoryUi === 'EXPENSE') {
      setcategoryTitle('Expense Category');
      setdrpDownValue({ name: 'select an expense Category' });

      setImg(paid2);
    }
  }, [categoryUi]);

  //  console.log('submittion', e);

  return (
    <Mui.Grid
      className={
        cssForOneCard !== undefined ? css.cardwhiteForOneCard : css.cardwhite
      }
      style={{ minWidth: minWidth && '30%', height: '36rem' }}
    >
      <Mui.Stack
        id={e?.id}
        key={e?.id}
        direction="column"
        spacing={1}
        className={css.overflw}
      >
        <Mui.Grid
          id={e}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Mui.Grid style={{ display: 'flex', flexDirection: 'column' }}>
            <Mui.Grid className={css.head}>{e?.bank_name}</Mui.Grid>
            <Mui.Grid className={css.accNum}>{e?.account_number}</Mui.Grid>
          </Mui.Grid>
          <Mui.Stack direction="row">
            <Mui.Grid>
              <img src={img} alt="recv" />
            </Mui.Grid>
            <Mui.Grid>{FormattedAmount(e?.amount)}</Mui.Grid>
          </Mui.Stack>
        </Mui.Grid>

        <Mui.Grid className={css.date}>{e?.date}</Mui.Grid>
        <Mui.Stack direction="row" justifyContent="space-between">
          <Mui.Grid className={css.description}>
            <Mui.Typography className={css.description1}>
              {e?.simple_narration}
            </Mui.Typography>
          </Mui.Grid>{' '}
          <Mui.Grid
            style={{
              // border: '0.5px solid #C5C5C5',
              height: 'fit-content',
              padding: '6px',
            }}
          >
            {Number(e?.amount) > 0 ? (
              <Mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryUi}
                onChange={handleChangeSelectReceipt}
                MenuProps={menuProps}
                inputProps={{
                  classes: { root: classes.root, icon: classes.icon },
                }}
                className={css.select}
              >
                <Mui.MenuItem
                  value="receipt"
                  className={css.dropdownFont}
                  onClick={() => {
                    setSubmitAmount(Math.abs(e?.amount));
                    drawer('receipt');
                    // handleClick('receipt');
                  }}
                >
                  Reciept
                </Mui.MenuItem>
                <Mui.MenuItem
                  value="INCOME"
                  className={css.dropdownFont}
                  onClick={() => {
                    setSubmitAmount(Math.abs(e?.amount));
                    drawer('INCOME');
                    // handleClick('INCOME');
                  }}
                >
                  Income
                </Mui.MenuItem>
                {/* <Mui.MenuItem
              value="payment"
              className={css.dropdownFont}
              onClick={() => {
                drawer('payment');
                // handleClick('payment');
              }}
            >
              Payment
            </Mui.MenuItem>
            <Mui.MenuItem
              value="EXPENSE"
              className={css.dropdownFont}
              onClick={() => {
                drawer('EXPENSE');
                // handleClick('EXPENSE');
              }}
            >
              Expense
            </Mui.MenuItem> */}
              </Mui.Select>
            ) : (
              <Mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryUi}
                onChange={handleChangeSelectReceipt}
                MenuProps={menuProps}
                inputProps={{
                  classes: { root: classes.root, icon: classes.icon },
                }}
                className={css.select}
              >
                {/* <Mui.MenuItem
            value="receipt"
            className={css.dropdownFont}
            onClick={() => {
              drawer('receipt');
              // handleClick('receipt');
            }}
          >
            Reciept
          </Mui.MenuItem>
          <Mui.MenuItem
            value="INCOME"
            className={css.dropdownFont}
            onClick={() => {
              drawer('INCOME');
              // handleClick('INCOME');
            }}
          >
            Income
          </Mui.MenuItem> */}
                <Mui.MenuItem
                  value="payment"
                  className={css.dropdownFont}
                  onClick={() => {
                    setSubmitAmount(Math.abs(e?.amount));
                    drawer('payment');
                    // handleClick('payment');
                  }}
                >
                  Payment
                </Mui.MenuItem>
                <Mui.MenuItem
                  value="EXPENSE"
                  className={css.dropdownFont}
                  onClick={() => {
                    // setSubmitAmount(Math.abs(e?.amount));
                    drawer('EXPENSE');
                    // handleClick('EXPENSE');
                  }}
                >
                  Expense
                </Mui.MenuItem>
              </Mui.Select>
            )}
            {/* <Mui.Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={categoryUi}
            onChange={handleChangeSelectReceipt}
            MenuProps={menuProps}
            inputProps={{
              classes: { root: classes.root, icon: classes.icon },
            }}
            className={css.select}
          >
            <Mui.MenuItem
              value="receipt"
              className={css.dropdownFont}
              onClick={() => {
                drawer('receipt');
                // handleClick('receipt');
              }}
            >
              Reciept
            </Mui.MenuItem>
            <Mui.MenuItem
              value="INCOME"
              className={css.dropdownFont}
              onClick={() => {
                drawer('INCOME');
                // handleClick('INCOME');
              }}
            >
              Income
            </Mui.MenuItem>
            <Mui.MenuItem
              value="payment"
              className={css.dropdownFont}
              onClick={() => {
                drawer('payment');
                // handleClick('payment');
              }}
            >
              Payment
            </Mui.MenuItem>
            <Mui.MenuItem
              value="EXPENSE"
              className={css.dropdownFont}
              onClick={() => {
                drawer('EXPENSE');
                // handleClick('EXPENSE');
              }}
            >
              Expense
            </Mui.MenuItem>
          </Mui.Select> */}{' '}
          </Mui.Grid>
        </Mui.Stack>

        <Mui.Grid
          style={{
            fontWeight: '700',
            fontSize: '13px',
            lineHeight: '16px',

            color: '#333333',
          }}
        >
          {categoryTitle}
        </Mui.Grid>
        <Mui.Stack direction="column">
          <SelectBottomSheet
            name="moreAction"
            triggerComponent={
              <Mui.Grid
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  background: 'rgba(242, 242, 240, 0.3)',
                  boxShadow: 'inset 0px 0px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  height: '38px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  // setSubmitAmount(Math.abs(e?.amount));
                  setBottomSheetNumber(true);
                }}
              >
                <Mui.Grid
                  className={css.bottomMenu}
                  // onClick={() => {
                  //   // setSubmitAmount(Math.abs(e?.amount));
                  //   setBottomSheetNumber(true);
                  // }}
                >
                  {drpDownValue.name}
                </Mui.Grid>
                <Mui.Grid style={{ margin: '7px' }}>
                  <img src={downArrow} alt="arrow" />
                </Mui.Grid>
              </Mui.Grid>
            }
            open={BottomSheetNumber}
            onTrigger={() => setBottomSheetNumber(true)}
            onClose={() => setBottomSheetNumber(false)}
            maxHeight="45vh"
            addNewSheet
          >
            <CommonDrawer
              state={categoryUi}
              handleClick={passData}
              setBottomSheetNumber={setBottomSheetNumber}
              setTrigger={setTrigger}
            />
          </SelectBottomSheet>
        </Mui.Stack>
        {categoryUi === 'receipt' ? (
          <>
            <Reciept
              id={e}
              mappingDetails={drpDownValue}
              onget={getData}
              totalAmt={totalAmt}
              // setTotalAmt={setTotalAmt}
              setCategory={setCategory}
              setNotes={setNotes}
              notes={notes}
              setAccId={setAccId}
              // handleClick={passData}
            />
          </>
        ) : (
          ''
        )}

        {categoryUi === 'payment' ? (
          <>
            <Payments
              id={e}
              mappingDetails={drpDownValue}
              onget={getData}
              totalAmt={totalAmt}
              // setTotalAmt={setTotalAmt}
              setCategory={setCategory}
              setNotes={setNotes}
              notes={notes}
              setAccId={setAccId}
              // handleClick={passData}
            />
          </>
        ) : (
          ''
        )}

        {/* {categoryUi === 'INCOME' ? (
        <>
          <Income id={e} 
          // handleClick={passData}
           />
        </>
      ) : (
        ''
      )} */}

        {categoryUi === 'EXPENSE' ? (
          <>
            <Expense
              id={e}
              setCategory={setCategory}
              ExpenseDat={ExpenseData}
              // handleClick={passData}
            />
          </>
        ) : (
          ''
        )}
      </Mui.Stack>

      <Mui.Grid style={{ textAlign: 'center' }}>
        <Mui.Button
          className={css.lastbutton}
          sx={{
            opacity: totalAmt > Math.abs(Number(e?.amount)) ? 0.4 : 1,
          }}
          disabled={totalAmt > Math.abs(Number(e?.amount))}
          onClick={() => {
            if (totalAmt <= Math.abs(Number(e?.amount))) {
              submitCategorization();
            }
          }}
        >
          Categorize Now
        </Mui.Button>
      </Mui.Grid>
    </Mui.Grid>
  );
};
export default CategorizeStacks;
