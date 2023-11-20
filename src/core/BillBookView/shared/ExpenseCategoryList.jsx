import React, { useContext, useState, useEffect } from 'react';
import * as Mui from '@mui/material';
// import Input from '@components/Input/Input.jsx';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as themes from '@root/theme.scss';
import { Button, makeStyles } from '@material-ui/core';
import Radio from '@mui/material/Radio';
import {
  validateNoSymbol,
  //  validateRequired
} from '@services/Validation.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import SelectBottomSheet from '../../../components/SelectBottomSheet/SelectBottomSheet';
import * as css from './ExpenseCategoryList.scss';

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

const ExpenseCategoryList = (props) => {
  const { expenseCategoryList, onClick, categoryListOpen, assetCategoryList,getAssetCategory,getExpenseCategory } =
    props;
  const [drawer, setDrawer] = useState(false);
  const [category, setCategory] = useState('Expense');

  const [query, setQuery] = useState('');

  const handleBottomSheet = (value) => {
    setDrawer(false);
    console.log('value', value);
  };
  const device = localStorage.getItem('device_detect');

  return (
    <div
      className={css.expenseCategoryListContainer}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Mui.Box className={css.categoryHead}>
        <Mui.Typography className={css.categoryTitle}>
          Select Category Details
        </Mui.Typography>
        <span className={css.headerUnderline1} />
        <Mui.Typography className={css.categorysubTitle}>
          Select Category Type and Sub-Type from the list
        </Mui.Typography>
      </Mui.Box>
      <Mui.Box className={css.categorySelection}>
        <Mui.Button
          className={category === 'Expense' ? css.selectedBtn : css.btn}
          onClick={() => setCategory('Expense')}
        >
          Expense
        </Mui.Button>
        <Mui.Button
          className={category === 'Asset' ? css.selectedBtn : css.btn}
          onClick={() => setCategory('Asset')}
        >
          Asset
        </Mui.Button>
      </Mui.Box>
      {category === 'Expense' ? (
        <>
          <CategoryChoose
            onClick={onClick}
            CategoryList={expenseCategoryList}
            setQuery={setQuery}
            query={query}
            device={device}
            placeholder="Search Expense Category"
          />
          <AddExpenseTrigger
            btnName="Expense"
            onAdd={(d) => onClick(d)}
            categoryListOpen={categoryListOpen}
            drawer={drawer}
            setDrawer={setDrawer}
            handleBottomSheet={handleBottomSheet}
            CategoryList={expenseCategoryList}
            getExpenseCategory={getExpenseCategory}
            getAssetCategory={getAssetCategory}
          />
        </>
      ) : (
        <>
          <CategoryChoose
            onClick={onClick}
            CategoryList={assetCategoryList}
            setQuery={setQuery}
            query={query}
            device={device}
            placeholder="Search Asset Category"
          />
          <AddExpenseTrigger
            btnName="Asset"
            onAdd={(d) => onClick(d)}
            categoryListOpen={categoryListOpen}
            drawer={drawer}
            setDrawer={setDrawer}
            handleBottomSheet={handleBottomSheet}
            CategoryList={assetCategoryList}
            getExpenseCategory={getExpenseCategory}
            getAssetCategory={getAssetCategory}
          />
        </>
      )}
    </div>
  );
};

export default ExpenseCategoryList;

export const CategoryChoose = ({
  onClick,
  CategoryList,
  setQuery,
  query,
  device,
  placeholder,
}) => {
  const CategoryListFilter = CategoryList?.filter((post) => {
    if (query === '') {
      return post;
    }
    if (post?.name?.toLowerCase()?.includes(query?.toLowerCase())) {
      return post;
    }
    return false;
  });
  return (
    <Mui.Box className={css.mainContainer}>
      <div className={css.searchFilter}>
        <SearchIcon className={css.searchFilterIcon} />
        <input
          placeholder={placeholder}
          onChange={(event) => setQuery(event.target.value)}
          className={css.searchFilterInputBig}
        />
      </div>
      <div
        className={css.expenseList}
        style={{ height: device === 'mobile' ? '43vh' : '60vh' }}
      >
        {CategoryListFilter?.length === 0 || !CategoryListFilter ? (
          <Mui.Typography align="center">No Data Found</Mui.Typography>
        ) : (
          <>
            {CategoryListFilter &&
              CategoryListFilter?.map((e) => (
                <div
                  className={css.categoryOptions}
                  onClick={() => onClick(e)}
                  // key={e.id}
                  // role="menuitem"
                >
                  <Button className={css.categoryOptionsText}>
                    {e.name?.toLowerCase()}
                  </Button>
                </div>
              ))}
          </>
        )}
      </div>
    </Mui.Box>
  );
};

export const AddExpenseTrigger = ({
  onAdd,
  btnName,
  handleBottomSheet,
  categoryListOpen,
  setDrawer,
  drawer,
  CategoryList,
  getAssetCategory,
  getExpenseCategory
}) => {
  const VALIDATION = {
    categoryTitle: {
      errMsg: 'Please provide valid Title',
      test: validateNoSymbol,
    },
    desc: {
      errMsg: 'Please Select Tds Category',
      test: validateNoSymbol,
      // test: validateRequired,
    },
  };
  const { organization, user, openSnackBar } = useContext(AppContext);
  const [tdsList, setTdsList] = useState([]);
  const [state, setState] = useState({
    categoryTitle: '',
  });
  const [selectedTds, setSelectedTds] = useState(null);
  const [selectedTdsStatus, setSelectedTdsStatus] = useState(false);

  const [validationErr, setValidationErr] = useState({
    categoryTitle: false,
  });

  const classes = useStyles();
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

  const tdsSelection = () => {
    if (selectedTds === '') {
      setSelectedTdsStatus(true);
    } else {
      setSelectedTdsStatus(false);
    }
  };

  useEffect(() => {
    tdsSelection();
  }, [selectedTds]);

  const onInputChange = (e) => {
    reValidate(e);
    const [name, value] = getEventNameValue(e);
    setState((s) => ({ ...s, [name]: value }));
  };
  const validateAllFields = () => {
    return Object.keys(VALIDATION).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !VALIDATION?.[v]?.test(state[v]);
      return a;
    }, {});
  };

  const handleChange = (event) => {
    setSelectedTds(event.target.value);
    // tdsSelection();
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
          setTdsList(btnName === 'Expense' ? res.data : []);
        } else if (res?.error) {
          openSnackBar({
            message: res?.message || 'Sorry Something went wrong',
            type: 'error',
          });
        }
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown error occured',
          type: 'error',
        });
      });
  };
  useEffect(() => {
    if (categoryListOpen) {
      getTdsList();
    }
  }, [categoryListOpen]);

  const saveCategory = () => {
    if (btnName === 'Expense') {
      RestApi(`organizations/${organization.orgId}/accounts`, {
        method: METHOD.POST,
        payload: {
          name: state.categoryTitle,
          tds_section: selectedTds,
          category_type: 'expense_category',
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      })
        .then((res) => {
          if (res && !res.error) {
            onAdd(res);
            getExpenseCategory();
          } else if (res?.error) {
            openSnackBar({
              message: res?.message || 'Sorry Something went wrong',
              type: 'error',
            });
          }
        })
        .catch((e) => {
          console.log("saveCategoryErr",e);
          openSnackBar({
            message: 'Unknown error occured',
            type: 'error',
          });
        });
    } else {
      RestApi(`organizations/${organization.orgId}/accounts`, {
        method: METHOD.POST,
        payload: {
          name: state.categoryTitle,
          tds_section: selectedTds,
          category_type: 'asset',
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      })
        .then((res) => {
          if (res && !res.error) {
            onAdd(res);
            getAssetCategory();
          } else if (res?.error) {
            openSnackBar({
              message: res?.message || 'Sorry Something went wrong',
              type: 'error',
            });
          }
        })
        .catch((e) => {
          console.log("saveCategoryErr1",e);
          openSnackBar({
            message: 'Unknown error occured',
            type: 'error',
          });
        });
    }
  };
  const onAddCategory = () => {
    // tdsSelection();
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      setSelectedTds('');
      return;
    }
    saveCategory();
  };

  return (
    <SelectBottomSheet
      triggerComponent={
        <div
          className={`${css.categoryOptions} ${css.addExpenseCategoryBtn}`}
          onClick={() => {
            setDrawer(true);
          }}
          role="button"
          style={{
            height: '5%',
            padding: '10px 20px 0px',
            bottom: ' 0',
            backgroundColor: 'white',
            position: 'fixed',
            width: '100%',
            cursor: 'default',
          }}
        >
          + Add new {btnName} category
        </div>
      }
      open={drawer}
      onClose={() => {
        handleBottomSheet();
        setSelectedTdsStatus(false);
        setValidationErr({
          categoryTitle: false,
        });
      }}
    >
      <div className={css.addExpenseTriggerContainer}>
        <div className={css.headerContainer}>
          <div className={css.headerLabel}>Add an {btnName} Category</div>
          <span className={css.headerUnderline} />
        </div>
        <div className={css.bodyContainer}>
          <Autocomplete
            id="expense-category-list"
            name="categoryTitle"
            onBlur={reValidate}
            className={`${classes.root}`}
            freeSolo
            options={CategoryList?.map((option) => option?.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                name="categoryTitle"
                label="Category Title"
                error={validationErr.categoryTitle}
                onChange={onInputChange}
              />
            )}
            onChange={(e) => {
              const selectedOne = CategoryList?.find(
                (option) => option.name === e?.target?.innerHTML
              );
              onAdd(selectedOne);
            }}
            theme="light"
          />
          <div className={css.errorTitle}>
            {validationErr.categoryTitle
              ? VALIDATION?.categoryTitle?.errMsg
              : ''}
          </div>
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
              {tdsList.filter((ele) => ele.tds_type === btnName?.toLowerCase())
                ?.length === 0 ? (
                <Mui.Typography align="center">No Data Found </Mui.Typography>
              ) : (
                <>
                  {tdsList
                    .filter(
                      (ele) =>
                        ele.tds_type === btnName?.toLowerCase() ||
                        ele.tds_type === 'both'
                    )
                    .map((item, index) => {
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
                              style={{
                                marginRight: '13px',
                                marginLeft: '13px',
                              }}
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
                          {tdsList.filter(
                            (ele) =>
                              ele.tds_type === btnName?.toLowerCase() ||
                              ele.tds_type === 'both'
                          )?.length !==
                            index + 1 && (
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
                </>
              )}
            </div>

            <div className={css.error}>
              {selectedTdsStatus ? 'Please Select Tds Category' : ''}
            </div>
          </div>

          <Button
            variant="contained"
            className={css.primaryButton}
            onClick={onAddCategory}
            size="medium"
          >
            Create {btnName} Category
          </Button>
        </div>
      </div>
    </SelectBottomSheet>
  );
};
