import * as React from 'react';
import * as Mui from '@mui/material';
import * as themes from '@root/theme.scss';
import { Button, makeStyles } from '@material-ui/core';
import Radio from '@mui/material/Radio';
import { validateNoSymbol, validateRequired } from '@services/Validation.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import Input from '@components/Input/Input.jsx';
import * as css from '../../BillBookView/shared/ExpenseCategoryList.scss';
import VendorCustomerCategory from './VendorCustomerCategory';
import AddVendorManual from '../../../components/CreateNew/VendorNew/AddVendorManual.jsx';
// import CreateCustomerDialogNew from '../../InvoiceView/CreateCustomerDialogNew';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
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
  },
  searchInput: {
    margin: '0 20px',
    padding: '5px 10px 0 0',
    '& .MuiTextField-root': {
      paddingLeft: '8px',
      marginBottom: '8px',
      border: '0.7px solid rgba(153, 158, 165, 0.39)',
    },
    '& .MuiInput-root': {
      height: '56px !important',
    },
  },
}));
const AddCategory = ({ val, handleClose, handleParent1,getParties,selectedButton }) => {
  const classes = useStyles();
  const VALIDATION = {
    categoryTitle: {
      errMsg: 'Please provide valid Title',
      test: validateNoSymbol,
    },
    desc: {
      errMsg: 'Please fill the description',
      test: validateRequired,
    },
  };
  const [selectedTds, setSelectedTds] = React.useState('');
  const { organization, user, openSnackBar } = React.useContext(AppContext);

  const [tdsList, setTdsList] = React.useState([]);
  const [state, setState] = React.useState({
    categoryTitle: '',
  });
  const [validationErr, setValidationErr] = React.useState({
    categoryTitle: false,
    desc: false,
  });
  const getEventNameValue = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    return [name, value];
  };
  const reValidate = (e) => {
    const [name, value] = getEventNameValue(e);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };
  const onInputChange = (e) => {
    reValidate(e);
    const [name, value] = getEventNameValue(e);
    setState((s) => ({ ...s, [name]: value }));
  };
  // const onAddCategory = () => {
  //   saveCategory();
  // };
  const handleChange = (event) => {
    setSelectedTds(event.target.value);
  };
  const controlProps = (item) => ({
    checked: selectedTds === item,
    onChange: handleChange,
    value: item,
  });
  const getTdsList = () => {
    RestApi(`organizations/${organization.orgId}/expense_categories/tds_list`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setTdsList(res.data);
        }
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown error occured',
          type: 'error',
        });
      });
  };

  // add customer
  // const [ vendorCustomer,setVendorCustomer]=React.useState('');

  // const handleCloseCategory2 =(prop)=>{
  //   // setVendorCustomer('false');
  //   handleClose(false);
  // };

  React.useEffect(() => {
    getTdsList();
  }, []);

  const addVendorComplete = (status) => {
    if (status === 'success') {
      handleClose(false);
    }
  };
  return (
    <>
      {val === 'payment' && (
        <AddVendorManual
          addVendorComplete={(status, value) => {
            if (status === 'success') {
              addVendorComplete(status, value);
            }
            if (status === 'exists') {
              handleParent1(value);
            }
          }}
        />
      )}
      {val.toLowerCase().split('_')[1] === 'vendor' && (
        <AddVendorManual
          addVendorComplete={(status, value) => {
            if (status === 'success') {
              getParties(selectedButton, '');
              addVendorComplete(status, value);
            }
            if (status === 'exists') {
              handleParent1(value);
            }
          }}
        />
      )}
      {val.toLowerCase().split('_')[1] === 'lender' && (
        <AddVendorManual
          addVendorComplete={(status, value) => {
            if (status === 'success') {
              getParties(selectedButton, '');
              addVendorComplete(status, value);
            }
            if (status === 'exists') {
              handleParent1(value);
            }
          }}
          type="lender"
        />
      )}

      {val.toLowerCase().split('_')[1] === 'promoter' && (
        <AddVendorManual
          addVendorComplete={(status, value) => {
            if (status === 'success') {
              getParties(selectedButton, '');
              addVendorComplete(status, value);
            }
            if (status === 'exists') {
              handleParent1(value);
            }
          }}
          type="promoter"
        />
      )}
      {val === 'income' && (
        <>
          <Mui.Stack>
            <Mui.Typography>Add an Income Category</Mui.Typography>
            <Mui.Divider
              style={{
                borderRadius: '4px',
                width: '13px',
                height: '1.7px',
                marginTop: '5px',
                marginBottom: '7%',
                backgroundColor: '#F08B32',
              }}
              variant="fullWidth"
            />
            <div className={css.bodyContainer}>
              <Input
                name="categoryTitle"
                onBlur={reValidate}
                className={`${classes.root}`}
                label="Category Title"
                variant="standard"
                value={state.categoryTitle}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={onInputChange}
                error={validationErr.categoryTitle}
                helperText={
                  validationErr.categoryTitle
                    ? VALIDATION?.categoryTitle?.errMsg
                    : ''
                }
                theme="light"
              />
            </div>
            <Button
              style={{ marginTop: '9%' }}
              variant="contained"
              className={css.lastbutton}
              // onClick={onAddCategory}
              size="medium"
            >
              Add Category
            </Button>
          </Mui.Stack>
        </>
      )}
      {val === 'reciept' && (
        <VendorCustomerCategory
          handleClose2={handleClose}
          handleParent2={handleParent1}
        />
        //   <AddVendorManual
        //   removeBankStore="true"
        //   handleParent2={handleParent1}
        //   addVendorComplete={addVendorComplete}
        // />
      )}
      {val.toLowerCase().split('_')[1] === 'customer' && (
        <VendorCustomerCategory
          handleClose2={handleClose}
          handleParent2={handleParent1}
        />
        //   <AddVendorManual
        //   removeBankStore="true"
        //   handleParent2={handleParent1}
        //   addVendorComplete={addVendorComplete}
        // />
      )}
      {val === 'expense' && (
        <Mui.Stack
          direction="column"
          style={{
            alignItems: 'flexStart',
            justifyContent: 'space-between',
            // marginBottom: '-13px',
          }}
        >
          <div className={css.addExpenseTriggerContainer}>
            <div className={css.headerContainer}>
              <div className={css.headerLabel}>Add an Expense Category</div>
              <span className={css.headerUnderline} />
            </div>
            <div className={css.bodyContainer}>
              <Input
                name="categoryTitle"
                onBlur={reValidate}
                className={`${classes.root}`}
                label="Category Title"
                variant="standard"
                value={state.categoryTitle}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={onInputChange}
                error={validationErr.categoryTitle}
                helperText={
                  validationErr.categoryTitle
                    ? VALIDATION?.categoryTitle?.errMsg
                    : ''
                }
                theme="light"
              />
              <div>
                <div
                  style={{
                    color: '#6E6E6E',
                    fontSize: '12px',
                    lineHeight: '15px',
                  }}
                >
                  TDS category
                </div>
                <div
                  style={{
                    borderRadius: 10,
                    border: '1px solid #DDDDDD',
                    marginTop: '5px',
                    paddingTop: '11px',
                    paddingBottom: '11px',
                  }}
                >
                  {tdsList.map((item, index) => {
                    return (
                      <div
                        key={item.name}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flex: 1,
                          }}
                        >
                          <div
                            style={{ marginRight: '13px', marginLeft: '13px' }}
                          >
                            <Radio {...controlProps(item.name)} />
                          </div>

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                color: '#283049',
                                fontSize: '12px',
                                lineHeight: '15px',
                                fontWeight: 'bold',
                                marginBottom: '4px',
                              }}
                            >
                              {item.name}
                            </div>
                            <div
                              style={{
                                color: '#283049',
                                fontSize: '10px',
                                lineHeight: '13px',
                              }}
                            >
                              {item.description}
                            </div>
                          </div>

                          <div
                            style={{
                              marginRight: '13px',
                              marginLeft: '13px',
                              fontSize: '20px',
                              lineHeight: '25px',
                              color: '#283049',
                            }}
                          >
                            {item.percentage && `${item.percentage} %`}
                          </div>
                        </div>
                        {tdsList.length !== index + 1 && (
                          <div
                            style={{
                              height: '0.5px',
                              backgroundColor: '#DDDDDD',
                              marginBottom: '9px',
                              marginTop: '9px',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="contained"
                className={css.primaryButton}
                // onClick={onAddCategory}
                size="medium"
              >
                Create Expense Category
              </Button>
            </div>
          </div>
        </Mui.Stack>
      )}
    </>
  );
};
export default AddCategory;
