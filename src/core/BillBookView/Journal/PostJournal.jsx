import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

import { DirectUpload } from '@rails/activestorage';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Dialog, Popover } from '@material-ui/core';
import {
  setDrawer,
  postJournal,
  deleteJournal,
  updateJournal,
} from '@action/Store/Reducers/Bills/JournalState';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import deleteIcon from '@assets/trashdelete.svg';
import editIcon from '@assets/editicon_.svg';
import move from '@assets/move.svg';
import { IndianCurrency, totalKeySum } from '@components/utils';

import { InputText } from '@components/Input/Input';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { SelectFieldExpense } from '@components/Select/Select';
// eslint-disable-next-line
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  CloseRounded as CloseRoundedIcon,
  ExpandMoreRounded as ExpandMoreRoundedIcon,
  AddRounded as AddRoundedIcon,
  CurrencyRupeeRounded as CurrencyRupeeRoundedIcon,
} from '@mui/icons-material';
import { validateRequired } from '@services/Validation';

import { TabList, TabPanel, TabContext } from '@mui/lab';
import * as css from './journal.scss';
import TabDropDown from './TabDropDown';
import ContactsDropDown from './ContactsDropDown';
// import BillViewDialog from '../components/BillViewDialog';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      theme="light"
    />
  );
};

const VALIDATION = {
  description: {
    errMsg: 'Please Provide Description',
    test: (v) => validateRequired(v),
  },
  month: {
    errMsg: 'Please Select Month',
    test: (v) => validateRequired(v),
  },
  year: {
    errMsg: 'Please Select Year',
    test: (v) => validateRequired(v),
  },
  date: {
    errMsg: 'Please Select date',
    test: (v) => validateRequired(v),
  },
  amount: {
    errMsg: 'Please Enter Amount',
    test: (v) => validateRequired(v),
  },
  note: {
    errMsg: 'Please Enter Note',
    test: (v) => validateRequired(v),
  },
  // file: {
  //   errMsg: 'Please Upload Attachment',
  //   test: (v) => validateRequired(v),
  // },
};

const accCategory = ['Asset', 'Liability', 'Equity'];

const PostJournal = ({ setDesc }) => {
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    id: '',
    description: '',
    month: moment(),
    year: moment(),
    date: null,
    number: '',
    amount: '',
    file: null,
    fileName: '',
    note: '',
    edit: false,
    rejectReason: null,
  });
  const [tranDetail, setTranDetail] = useState([
    {
      id: uuid(),
      account: null,
      entity: null,
      debit: '',
      credit: '',
      accountErr: false,
      entityErr: false,
      amount: false,
    },
    {
      id: uuid(),
      account: null,
      entity: null,
      debit: '',
      credit: '',
      accountErr: false,
      entityErr: false,
      amount: false,
    },
  ]);

  const [validationErr, setValidationErr] = useState({});
  const [accountEl, setAccountEl] = useState(null);
  const [contactEl, setContactEl] = useState(null);
  const [tabValue, setTabValue] = useState('1');
  const [oneRow, setOneRow] = useState(null);
  // const [viewAttach, setViewAttach] = useState(false);

  const { oneJournal, jouralDesc, journalNumber, drawer } = useSelector(
    (state) => state.Journal
  );

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const reValidate = (e) => {
    const { name, value } = e?.target;
    setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
  };

  const onInputChange = (e) => {
    reValidate(e);
    const { name, value } = e?.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (name === 'description') setDesc(value);
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e?.target;

    const updateData = tranDetail?.map((item) => {
      if (item.id === id) {
        if (name === 'debit')
          return { ...item, [name]: value, credit: '', amount: false };

        return { ...item, [name]: value, debit: '', amount: false };
      }
      return item;
    });

    setTranDetail(updateData);
  };

  const handleAccountChange = (value) => {
    const updateData = tranDetail?.map((item) => {
      if (item.id === oneRow.id)
        return { ...item, account: value, accountErr: false };
      return item;
    });

    setTranDetail(updateData);
  };

  const handleContactChange = (value) => {
    const updateData = tranDetail?.map((item) => {
      if (item.id === oneRow.id)
        return {
          ...item,
          entity: value,
          entityErr: false,
        };
      return item;
    });

    setTranDetail(updateData);
  };

  const handleDownloadClick = async () => {
    if (oneJournal?.file_url) {
      const image = await fetch(oneJournal?.file_url);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement('a');
      link.href = imageURL;
      link.download = oneJournal?.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else dispatch(openSnackbar({ type: 'error', message: 'file not found' }));
  };

  const onFileChange = (e) => {
    const file = e?.target?.files[0];
    const { name } = e?.target;
    if (file) {
      reValidate(e);
      const url = `${BASE_URL}/direct_uploads`;
      const upload = new DirectUpload(file, url);

      dispatch(enableLoading(true));

      upload.create((error, blob) => {
        dispatch(enableLoading(false));

        if (error)
          dispatch(
            openSnackbar({ message: error?.message, type: MESSAGE_TYPE.ERROR })
          );
        else {
          const fileName =
            file.name.length > 12
              ? `${file.name.slice(0, 12)}...${file.name.slice(-8)}`
              : file.name;

          setFormState((prev) => ({
            ...prev,
            [name]: blob?.signed_id,
            fileName,
          }));
        }
      });
    }
  };

  const addNewRow = () => {
    const row = {
      id: uuid(),
      account: null,
      entity: null,
      debit: '',
      credit: '',
      accountErr: false,
      entityErr: false,
      amount: false,
    };

    setTranDetail((prev) => [...prev, row]);
  };

  const removeRow = (id) => {
    const filteredData = [];
    tranDetail?.forEach((item) => {
      if (item.id !== id) filteredData.push(item);
    });
    setTranDetail(filteredData);
  };

  const validationCheck = () => {
    let validateItems = {};
    if (formState.description === 'Others') {
      const { month, year, amount, edit, id, fileName, ...restitems } =
        VALIDATION;
      validateItems = restitems;
    } else {
      const { date, number, edit, id, fileName, ...restitems } = VALIDATION;
      validateItems = restitems;
    }

    const validateErrors = Object.keys(validateItems).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(formState[v]);
      return paramValue;
    }, {});

    const valid = Object.values(validateErrors).every((val) => !val);

    if (!valid) {
      setValidationErr((prev) => ({ ...prev, ...validateErrors }));
      return false;
    }

    return true;
  };

  const validationTranCheck = () => {
    const validationAllCheck = [];

    const validateError = tranDetail.map((item) => {
      validationAllCheck.push({
        accountErr: !item.account,
        entityErr: accCategory?.includes(item?.account?.account_type)
          ? !item.entity
          : false,
        amount: !item.credit && !item.debit,
      });
      return {
        ...item,
        accountErr: !item.account,
        entityErr: !item.entity,
        amount: !item.credit && !item.debit,
      };
    });

    setTranDetail(validateError);

    const isAllValid = validationAllCheck.every((item) =>
      Object.values(item).every((value) => !value)
    );

    if (isAllValid) return true;

    return false;
  };

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    const tempData = Array.from(tranDetail);
    const [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setTranDetail(tempData);
  };

  const onSubmit = (status) => () => {
    if (validationCheck()) {
      const { date, number, fileName, edit, rejectReason, ...restItems } =
        formState;

      const data = {
        ...restItems,
        month: moment(formState.month).format('MMMM'),
        year: moment(formState.year).format('YYYY'),
        status,
      };

      // eslint-disable-next-line
      if (!!data?.id) dispatch(updateJournal({ id: data.id, payload: data }));
      else dispatch(postJournal(data));
    }
  };

  const onOtherSubmit = () => {
    if (validationCheck() && validationTranCheck()) {
      const transformedArray = tranDetail?.map((item) => {
        let amount = 0;
        if (item.debit) amount = parseFloat(item.debit);
        else if (item.credit) amount = -parseFloat(item.credit);
        return {
          account_id: item.account.id,
          entity_id: item.entity ? item.entity.id : null,
          amount,
        };
      });

      const {
        month,
        year,
        fileName,
        edit,
        amount,
        rejectReason,
        ...restItems
      } = formState;

      // eslint-disable-next-line
      if (!!restItems?.id)
        dispatch(
          updateJournal({
            id: restItems.id,
            payload: {
              ...restItems,
              transaction_details: transformedArray,
              status: 'recorded',
            },
          })
        );
      else
        dispatch(
          postJournal({
            ...restItems,
            transaction_details: transformedArray,
            status: 'recorded',
          })
        );
    }
  };

  useEffect(() => {
    if (Object.keys(oneJournal || {}).length > 0) {
      setFormState((prev) => ({
        ...prev,
        id: oneJournal?.id,
        description: oneJournal?.description,
        month: moment(oneJournal?.date, 'YYYY-MM-DD'),
        year: moment(oneJournal?.date, 'YYYY-MM-DD'),
        date: oneJournal?.date,
        amount: oneJournal?.amount,
        note: oneJournal?.note,
        status: oneJournal?.status,
        file: oneJournal?.signed_id,
        fileName: oneJournal?.file_name,
        edit: !!oneJournal?.id,
        rejectReason: oneJournal?.reject_reason
          ? oneJournal?.reject_reason
          : null,
      }));
      setDesc(oneJournal?.description);

      if (oneJournal.transaction_details.length > 0) {
        const data = oneJournal?.transaction_details?.map((item) => ({
          id: uuid(),
          account: item?.account,
          entity: item?.entity,
          debit: item.amount > 0 ? item.amount : '',
          credit: item.amount < 0 ? -item.amount : '',
          accountErr: false,
          entityErr: false,
          amount: false,
        }));

        setTranDetail(data);
      }
    }
  }, [oneJournal]);

  useEffect(() => {
    if (journalNumber)
      setFormState((prev) => ({ ...prev, number: journalNumber }));
  }, [journalNumber]);

  return (
    <>
      <Popover
        open={Boolean(accountEl)}
        anchorEl={accountEl}
        onClose={() => {
          setAccountEl(null);
          setTabValue('1');
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className={css.memuPopover}
        sx={{
          '& .MuiPaper-elevation': {
            borderRadius: '8px',
            background: '#FFF',
            boxShadow: '0px -1px 0px 0px rgba(0, 0, 0, 0.10) initial',
          },
        }}
      >
        <TabContext value={tabValue}>
          <Box className={css.tabBox}>
            <TabList
              onChange={handleTabChange}
              className={css.tablistwrp}
              sx={{
                '& .Mui-selected': {
                  color: '#F08B32 !important',
                  fontWeight: '400 !important',
                },
                '& .MuiTabs-indicator': {
                  background: '#F08B32 !important',
                  height: '1.5px !important',
                },
              }}
            >
              <Tab label="Assets" value="1" className={css.tab} />
              <Tab label="Expense" value="2" className={css.tab} />
              <Tab label="Liability" value="3" className={css.tab} />
              <Tab label="Equity" value="4" className={css.tab} />
              <Tab label="Income" value="5" className={css.tab} />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0 }}>
            <TabDropDown
              category="asset"
              onChange={(e) => handleAccountChange(e)}
              onClose={() => setAccountEl(null)}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: 0 }}>
            <TabDropDown
              category="expense_category"
              onChange={(e) => handleAccountChange(e)}
              onClose={() => setAccountEl(null)}
            />
          </TabPanel>
          <TabPanel value="3" sx={{ padding: 0 }}>
            <TabDropDown
              category="liability"
              onChange={(e) => handleAccountChange(e)}
              onClose={() => setAccountEl(null)}
            />
          </TabPanel>
          <TabPanel value="4" sx={{ padding: 0 }}>
            <TabDropDown
              category="equity"
              onChange={(e) => handleAccountChange(e)}
              onClose={() => setAccountEl(null)}
            />
          </TabPanel>
          <TabPanel value="5" sx={{ padding: 0 }}>
            <TabDropDown
              category="income_category"
              onChange={(e) => handleAccountChange(e)}
              onClose={() => setAccountEl(null)}
            />
          </TabPanel>
        </TabContext>
      </Popover>
      <Popover
        open={Boolean(contactEl)}
        anchorEl={contactEl}
        onClose={() => {
          setContactEl(null);
          setTabValue('1');
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className={css.contactPopover}
        sx={{
          '& .MuiPaper-elevation': {
            borderRadius: '8px',
            background: '#FFF',
            boxShadow: '0px -1px 0px 0px rgba(0, 0, 0, 0.10) initial',
          },
        }}
      >
        <ContactsDropDown
          onChange={(e) => handleContactChange(e)}
          onClose={() => setContactEl(null)}
          from='journal'
        />
      </Popover>
      <Stack className={css.addpostcontainer}>
        <Stack className={css.marginContainer} sx={{ marginTop: '32px' }}>
          <Stack className={css.heaederwrp}>
            <Typography className={css.title}>Add New Journal</Typography>
            {oneJournal?.file_url && (
              <Button className={css.viewattach} onClick={handleDownloadClick}>
                Download Attachement
              </Button>
            )}
          </Stack>
          {formState.description === 'Others' && (
            <Divider sx={{ margin: '0 -32px 16px -32px' }} />
          )}
          <Stack className={css.postform}>
            <SelectFieldExpense
              label="Description"
              name="description"
              className={
                // eslint-disable-next-line
                !!formState?.id
                  ? `${css.textfieldStyle} ${
                      formState.description === 'Others' && css.maxWidth
                    } ${css.disabled} ${css.mt_11}`
                  : `${css.textfieldStyle}  ${
                      formState.description === 'Others' && css.maxWidth
                    } ${css.mt_11}`
              }
              defaultValue={formState?.description}
              required
              options={[...jouralDesc, 'Others']?.map((item) => ({
                name: item,
                id: item,
              }))}
              onChange={onInputChange}
              error={validationErr.description}
              helperText={
                validationErr.description ? VALIDATION?.description?.errMsg : ''
              }
              PaperProps={{
                style: {
                  flexGrow: 1,
                  marginTop: 8,
                  minWidth: 496,
                  borderRadius: 8,
                },
              }}
              MenuItemProps={{
                color: '#283049',
                fontFamily: 'Lexend, sans-serif !important',
                fontSize: '13px',
                fontStyle: 'normal',
                fontWeight: '400',
                borderBottom: '1px solid rgba(199, 199, 199, 0.50)',
              }}
              style={{ marginBottom: '0' }}
              disabled={!!formState?.id}
            />
            {formState.description !== 'Others' && (
              <>
                <Stack className={css.monthselect}>
                  <Stack
                    className={
                      formState?.edit
                        ? `${css.datecontainer} ${css.disabled}`
                        : css.datecontainer
                    }
                  >
                    <Stack flex={1} sx={{ pointerEvents: 'none' }}>
                      <label htmlFor="month" className={css.label}>
                        Select Month
                      </label>

                      <input
                        id="month"
                        type="text"
                        className={css.input}
                        value={moment(formState?.month).format('MMMM')}
                      />
                    </Stack>

                    <OnlyDatePicker
                      id="month"
                      color="#6E6E6E"
                      selectedDate={formState?.month}
                      maxDate={moment()}
                      onChange={(e) =>
                        onInputChange({
                          target: { name: 'month', value: e._d },
                        })
                      }
                    />
                  </Stack>
                  <Stack
                    className={
                      formState?.edit
                        ? `${css.datecontainer} ${css.disabled}`
                        : css.datecontainer
                    }
                  >
                    <Stack flex={1} sx={{ pointerEvents: 'none' }}>
                      <label htmlFor="year" className={css.label}>
                        Select Year
                      </label>

                      <input
                        id="year"
                        type="text"
                        className={css.input}
                        value={moment(formState?.year).format('YYYY')}
                      />
                    </Stack>

                    <OnlyDatePicker
                      id="year"
                      color="#6E6E6E"
                      selectedDate={formState?.year}
                      onChange={(e) =>
                        onInputChange({ target: { name: 'year', value: e._d } })
                      }
                    />
                  </Stack>
                </Stack>
                <TextfieldStyle
                  label="Amount"
                  name="amount"
                  type="number"
                  required
                  className={
                    formState?.edit
                      ? `${css.textfieldStyle} ${css.disabled}`
                      : css.textfieldStyle
                  }
                  value={formState?.amount}
                  onBlur={reValidate}
                  onChange={onInputChange}
                  onWheel={(e) => e.target.blur()}
                  error={validationErr.amount}
                  helperText={
                    validationErr.amount ? VALIDATION?.amount?.errMsg : ''
                  }
                  disabled={formState?.edit}
                />
              </>
            )}

            {formState.description === 'Others' && (
              <>
                <Stack
                  className={
                    formState?.edit
                      ? `${css.datecontainer}  ${css.maxWidth} ${css.disabled}`
                      : `${css.datecontainer}  ${css.maxWidth}`
                  }
                >
                  <Stack flex={1} sx={{ pointerEvents: 'none' }}>
                    <label
                      htmlFor="date"
                      className={
                        validationErr.date
                          ? `${css.label} ${css.error}`
                          : css.label
                      }
                    >
                      Date
                    </label>

                    <input
                      id="date"
                      type="text"
                      className={css.input}
                      value={
                        formState?.date &&
                        moment(formState?.date).format('DD-MM-YYYY')
                      }
                    />
                  </Stack>

                  <OnlyDatePicker
                    color="#6E6E6E"
                    selectedDate={formState?.date}
                    onChange={(e) =>
                      onInputChange({ target: { name: 'date', value: e._d } })
                    }
                    maxDate="disable"
                  />
                  {validationErr.date && (
                    <span className={css.validateError}>
                      {VALIDATION?.date?.errMsg}
                    </span>
                  )}
                </Stack>
                <TextfieldStyle
                  label="Journal Number"
                  name="number"
                  required
                  className={`${css.textfieldStyle} ${css.disabled}  ${css.maxWidth}`}
                  value={formState?.number}
                  onBlur={reValidate}
                  onChange={(e) => {
                    const pattern = /^[0-9]*$/;

                    if (pattern.test(e?.target?.value) || e.target.value === '')
                      onInputChange(e);
                  }}
                  error={validationErr.number}
                  helperText={
                    validationErr.number ? VALIDATION?.number?.errMsg : ''
                  }
                  disabled
                />
              </>
            )}
            <Stack className={css.inputFileWrap}>
              {!formState?.edit && (
                <>
                  <Typography
                    className={
                      // validationErr.file
                      //   ? [css.fileLabel, css.error].join(' ')
                      css.fileLabel
                    }
                  >
                    Upload Attachment
                  </Typography>
                  <div
                    className={
                      formState?.edit
                        ? `${css.fileInputWrap} ${css.disabled}`
                        : css.fileInputWrap
                    }
                  >
                    <input
                      type="file"
                      id="journal-file"
                      className={css.fileInput}
                      name="file"
                      onChange={onFileChange}
                    />
                    <label htmlFor="journal-file" className={css.choosefile}>
                      Choose a file
                    </label>
                    <span
                      className={
                        formState?.fileName
                          ? [css.fileName, css.fileSelected].join(' ')
                          : css.fileName
                      }
                    >
                      {formState?.fileName || 'File Name'}

                      <CloseRoundedIcon
                        className={css.closeIcon}
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            file: null,
                            fileName: '',
                          }))
                        }
                      />
                    </span>
                  </div>

                  {/* {validationErr.file && (
                <span className={css.validateError}>
                  {VALIDATION?.file?.errMsg}
                </span>
              )} */}
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
        {formState.description === 'Others' && (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <TableContainer className={css.tablecontainer}>
                <Table>
                  <TableHead className={css.tablehead}>
                    <TableRow className={css.tablerow}>
                      <TableCell sx={{ padding: '0 0 0 12px' }} />
                      <TableCell sx={{ paddingLeft: 0 }}>Account</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Debits</TableCell>
                      <TableCell>Credits</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <Droppable droppableId="droppable-1">
                    {(provider) => (
                      <TableBody
                        className={css.tablebody}
                        ref={provider.innerRef}
                        {...provider.droppableProps}
                      >
                        {tranDetail.map((item, ind) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={ind}
                          >
                            {(providers) => (
                              <TableRow
                                className={css.tablerow}
                                {...providers.draggableProps}
                                ref={providers.innerRef}
                              >
                                <TableCell
                                  {...providers.dragHandleProps}
                                  sx={{ padding: '0 0 0 12px' }}
                                >
                                  <img src={move} alt="move" />
                                </TableCell>
                                <TableCell sx={{ paddingLeft: 0 }}>
                                  <Stack>
                                    <Stack
                                      className={
                                        item.accountErr
                                          ? `${css.select} ${css.error}`
                                          : `${css.select} ${
                                              formState.edit && css.disabled
                                            }`
                                      }
                                      onClick={(e) => {
                                        setAccountEl(e.currentTarget);
                                        setOneRow(item);
                                      }}
                                    >
                                      <input
                                        className={css.input}
                                        value={item?.account?.name}
                                      />
                                      <ExpandMoreRoundedIcon
                                        className={css.icon}
                                      />
                                    </Stack>
                                    {item.accountErr && (
                                      <Typography className={css.errlabel}>
                                        Please select the account
                                      </Typography>
                                    )}
                                  </Stack>
                                </TableCell>
                                <TableCell>
                                  {accCategory.includes(
                                    item?.account?.account_type
                                  ) ? (
                                    <Stack>
                                      <Stack
                                        className={
                                          item.entityErr
                                            ? `${css.select} ${css.error}`
                                            : `${css.select} ${
                                                formState.edit && css.disabled
                                              }`
                                        }
                                        onClick={(e) => {
                                          setContactEl(e.currentTarget);
                                          setOneRow(item);
                                        }}
                                      >
                                        <input
                                          className={css.input}
                                          value={item?.entity?.name}
                                        />
                                        <ExpandMoreRoundedIcon
                                          className={css.icon}
                                        />
                                      </Stack>
                                      {item.entityErr && (
                                        <Typography className={css.errlabel}>
                                          Please select the contact
                                        </Typography>
                                      )}
                                    </Stack>
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Stack>
                                    <Stack
                                      className={
                                        item.amount
                                          ? `${css.debitcredit} ${css.error}`
                                          : `${css.debitcredit} ${
                                              formState.edit && css.disabled
                                            }`
                                      }
                                    >
                                      <CurrencyRupeeRoundedIcon
                                        className={css.curricon}
                                      />

                                      <input
                                        className={css.input}
                                        type="number"
                                        name="debit"
                                        value={item?.debit}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={(e) =>
                                          handleInputChange(e, item.id)
                                        }
                                      />
                                    </Stack>
                                    {item.amount && (
                                      <Typography className={css.errlabel}>
                                        Please enter the amount
                                      </Typography>
                                    )}
                                  </Stack>
                                </TableCell>
                                <TableCell>
                                  <Stack>
                                    <Stack
                                      className={
                                        item.amount
                                          ? `${css.debitcredit} ${css.error}`
                                          : `${css.debitcredit} ${
                                              formState.edit && css.disabled
                                            }`
                                      }
                                    >
                                      <CurrencyRupeeRoundedIcon
                                        className={css.curricon}
                                      />

                                      <input
                                        className={css.input}
                                        type="number"
                                        name="credit"
                                        value={item?.credit}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={(e) =>
                                          handleInputChange(e, item.id)
                                        }
                                      />
                                    </Stack>
                                    {item.amount && (
                                      <Typography className={css.errlabel}>
                                        Please enter the amount
                                      </Typography>
                                    )}
                                  </Stack>
                                </TableCell>
                                <TableCell align="center">
                                  {tranDetail?.length > 2 && (
                                    <IconButton
                                      className={`${css.closebtn} ${
                                        formState.edit && css.disabled
                                      }`}
                                      onClick={() => removeRow(item.id)}
                                    >
                                      <CloseRoundedIcon
                                        className={css.closeicon}
                                      />
                                    </IconButton>
                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provider.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </Table>
              </TableContainer>
            </DragDropContext>

            <Stack className={css.totalcontaner}>
              <Stack className={css.addnewRow}>
                <Button
                  className={css.addrowbtn}
                  onClick={addNewRow}
                  disabled={formState.edit}
                >
                  <AddRoundedIcon className={css.plusicon} /> Add another line
                </Button>
              </Stack>

              <Stack className={css.credittotal}>
                <Stack className={css.totalamountwrp}>
                  <Typography className={css.totallabel}>
                    Total Amount
                  </Typography>
                  <Typography className={css.totalamt}>
                    {IndianCurrency.format(totalKeySum(tranDetail, 'debit'))}
                  </Typography>
                  <Typography className={css.totalamt}>
                    {IndianCurrency.format(totalKeySum(tranDetail, 'credit'))}
                  </Typography>
                </Stack>
                <Stack className={css.borderdashed} />
                <Stack className={css.diffwrp}>
                  <Typography className={css.difflabel}>Difference</Typography>
                  <Typography className={css.diffamt}>
                    {Math.abs(
                      totalKeySum(tranDetail, 'debit') -
                        totalKeySum(tranDetail, 'credit')
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </>
        )}
        <Stack className={css.marginContainer}>
          <TextfieldStyle
            label="Note"
            name="note"
            required
            className={
              formState?.edit
                ? `${css.textfieldStyle} ${css.disabled}`
                : css.textfieldStyle
            }
            multiline
            rows={3}
            value={formState?.note}
            onBlur={reValidate}
            onChange={onInputChange}
            error={validationErr.note}
            helperText={validationErr.note ? VALIDATION?.note?.errMsg : ''}
            disabled={formState?.edit}
          />

          {formState?.rejectReason && (
            <TextfieldStyle
              label="Your Reject Reason "
              // name="note"
              className={`${css.textfieldStyle} ${css.disabled} ${css.mt20}`}
              multiline
              rows={3}
              value={formState?.rejectReason}
              // onBlur={reValidate}
              // onChange={onInputChange}
              // error={validationErr.note}
              // helperText={validationErr.note ? VALIDATION?.note?.errMsg : ''}
              disabled
            />
          )}

          {formState.edit ? (
            <Stack
              className={
                formState.status !== 'In Review'
                  ? css.editbtnwrapper
                  : `${css.editbtnwrapper} ${css.inreview}`
              }
            >
              <Button
                className={css.deletebtn}
                onClick={() =>
                  dispatch(setDrawer({ name: 'delete', value: true }))
                }
              >
                <img src={deleteIcon} alt="delete" />
                Delete
              </Button>
              {formState.status !== 'In Review' && (
                <Button
                  className={css.editbtn}
                  onClick={() =>
                    setFormState((prev) => ({ ...prev, edit: false }))
                  }
                >
                  <img src={editIcon} alt="edit" />
                  Edit
                </Button>
              )}
            </Stack>
          ) : (
            <>
              {formState.description !== 'Others' ? (
                <Stack
                  className={
                    formState?.status !== 'Reject'
                      ? css.submitbtnwrapper
                      : `${css.submitbtnwrapper} ${css.reject}`
                  }
                >
                  <Button
                    className={css.superpostbtn}
                    onClick={onSubmit('in_queue')}
                  >
                    Send to SuperAccountant
                  </Button>
                  {formState?.status !== 'Reject' && (
                    <Button
                      className={css.postbtn}
                      onClick={onSubmit('recorded')}
                    >
                      Record Journal
                    </Button>
                  )}
                </Stack>
              ) : (
                <Stack className={css.subotherbtnwrapper}>
                  <Button
                    className={css.cancelbtn}
                    onClick={() => {
                      if (!formState?.id) {
                        setFormState((prev) => ({ ...prev, description: '' }));
                        setDesc('');
                      }
                      dispatch(setDrawer({ name: 'open', value: false }));
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className={css.otherpostbtn}
                    onClick={onOtherSubmit}
                    disabled={
                      !(
                        totalKeySum(tranDetail, 'debit') > 0 &&
                        totalKeySum(tranDetail, 'credit') > 0 &&
                        Math.abs(
                          totalKeySum(tranDetail, 'debit') -
                            totalKeySum(tranDetail, 'credit')
                        ) === 0
                      )
                    }
                  >
                    Record Journal
                  </Button>
                </Stack>
              )}
            </>
          )}
        </Stack>
      </Stack>
      <Dialog
        open={drawer.delete}
        PaperProps={{
          style: { width: '416px', borderRadius: '16px', background: '#FFF' },
        }}
      >
        <Stack className={css.deleteContainer}>
          <Typography variant="h2" className={css.title}>
            Delete
          </Typography>
          <Typography variant="subtitle" className={css.subtitle}>
            Are you sure want to delete this journal ?
          </Typography>
          <Stack className={css.btnwrapper}>
            <Button
              className={css.nobtn}
              onClick={() =>
                dispatch(setDrawer({ name: 'delete', value: false }))
              }
            >
              No
            </Button>
            <Button
              className={css.yesbtn}
              onClick={() => dispatch(deleteJournal(formState?.id))}
            >
              Yes
            </Button>
          </Stack>
        </Stack>
      </Dialog>

      {/* {viewAttach && (
        <BillViewDialog
          file_url={oneJournal?.file_url}
          onClose={() => setViewAttach(false)}
        />
      )} */}
    </>
  );
};

export default memo(PostJournal);
