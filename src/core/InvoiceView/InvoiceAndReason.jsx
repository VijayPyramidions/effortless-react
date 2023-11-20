import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetRasiedInvoiceListState } from '@action/Store/Reducers/Invoice/InvoiceState';
import AppContext from '@root/AppContext.jsx';
// import RestApi, { METHOD } from '@services/RestApi.jsx';
import moment from 'moment';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { IconButton, Radio } from '@mui/material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, makeStyles, styled, Box } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import { validateRequired } from '@services/Validation.jsx';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@material-ui/icons/Search';
import Calender from './Calander';
import Input from '../../components/Input/Input.jsx';

import * as css from './CreditNoteReason.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: '#FFF',
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
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const VALIDATION = {
  referenceNum: {
    errMsg: 'Please provide refernce number',
    test: (v) => validateRequired(v),
  },
};

const InvoiceAndReason = ({ selectCustomer, callFunction, taxType }) => {
  const [BottomSheet, setBottomSheet] = React.useState({
    Invoice: false,
    Reason: false,
  });

  const device = localStorage.getItem('device_detect');

  const submitValue = (value, from) => {
    callFunction(value, from);
  };

  return (
    <div className={css.invoiceAndReason}>
      <div className={css.card}>
        <div className={css.row1}>
          <div className={css.step}>
            Step 02:
            <span className={css.stepLable}>Select Invoice and Reason</span>
          </div>
        </div>
        <div className={css.mainFields}>
          <div
            className={css.innerField}
            onClick={() =>
              setBottomSheet((prev) => ({ ...prev, Invoice: true }))
            }
          >
            <p>
              {selectCustomer?.original_invoice_reference_number ||
                'Select an Invoice'}
            </p>
            <IconButton>
              <KeyboardArrowDownIcon />
            </IconButton>
          </div>
          <div
            className={css.innerField}
            onClick={() =>
              setBottomSheet((prev) => ({ ...prev, Reason: true }))
            }
          >
            <p>{selectCustomer?.return_reason || 'Select a Reason'}</p>
            <IconButton>
              <KeyboardArrowDownIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <SelectBottomSheet
        open={BottomSheet?.Invoice}
        triggerComponent={<></>}
        onClose={() => setBottomSheet((prev) => ({ ...prev, Invoice: false }))}
        addNewSheet
      >
        {device === 'mobile' && <Puller />}
        <Invoice
          customerId={selectCustomer?.customer_id}
          onClose={() =>
            setBottomSheet((prev) => ({ ...prev, Invoice: false }))
          }
          onsubmit={submitValue}
          radio={selectCustomer?.original_invoice_reference_number || ''}
          taxType={taxType}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={BottomSheet?.Reason}
        triggerComponent={<></>}
        onClose={() => setBottomSheet((prev) => ({ ...prev, Reason: false }))}
        addNewSheet
      >
        {device === 'mobile' && <Puller />}
        <Reason
          onClose={() => setBottomSheet((prev) => ({ ...prev, Reason: false }))}
          onsubmit={submitValue}
          radio={selectCustomer?.return_reason || ''}
          taxType={taxType}
        />
      </SelectBottomSheet>
    </div>
  );
};

const Invoice = ({ customerId, onClose, onsubmit, radio, taxType }) => {
  // const {
  //   organization,
  //   enableLoading,
  //   user,
  //   openSnackBar,
  // loading,
  // } = React.useContext(AppContext);
  const dispatch = useDispatch();
  const { createInvoiceState } = useSelector((value) => value.Invoice);
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [invoiceList, setInvoiceList] = React.useState([]);
  const [otherInvoice, setOtherInvoice] = React.useState(false);
  const [RadioSec, setRadioSec] = React.useState('');
  const [mainState, setMainState] = React.useState({
    referenceNum: '',
    referenceDate: new Date(),
  });
  const [validationErr, setValidationErr] = React.useState({
    referenceNum: false,
  });
  const [filterList, setFilterList] = React.useState('');
  const [drawer, setDrawer] = React.useState(false);

  React.useEffect(() => {
    if (searchQuery === '') {
      setFilterList(invoiceList);
    } else {
      const temp = invoiceList?.filter((val) =>
        val?.number
          ?.toLocaleLowerCase()
          ?.includes(searchQuery?.toLocaleLowerCase()),
      );
      setFilterList(temp);
    }
  }, [invoiceList, searchQuery]);

  React.useEffect(() => {
    if (radio && invoiceList?.length > 0) {
      const temp = invoiceList?.find((val) => val?.number === radio);
      setRadioSec(temp?.id);
    }
  }, [radio, invoiceList]);

  React.useEffect(() => {
    if (Object.keys(createInvoiceState?.rasiedInvoiceList || {})?.length > 0) {
      setInvoiceList(createInvoiceState?.rasiedInvoiceList?.data);
    }
  }, [JSON.stringify(createInvoiceState?.rasiedInvoiceList)]);

  React.useEffect(() => {
    if (customerId) {
      dispatch(GetRasiedInvoiceListState({ customerId }));
    }
  }, [customerId]);

  const handleRadioChange = (value) => {
    setRadioSec(value);
  };

  const validateAllFields = () => {
    const stateData = mainState;
    return Object.keys(VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };

  const submitValue = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    onsubmit({
      original_invoice_reference_number: mainState?.referenceNum,
      original_invoice_reference_date: moment(mainState.referenceDate).format(
        'YYYY-MM-DD',
      ),
      original_invoice_id: mainState?.id,
    });
    onClose();
  };

  const submitValueNotList = () => {
    if (RadioSec) {
      const temp = invoiceList?.find((val) => val?.id === RadioSec);
      onsubmit(
        {
          original_invoice_reference_number: temp?.number,
          original_invoice_reference_date: moment(temp?.invoiced_at).format(
            'YYYY-MM-DD',
          ),
          original_invoice_id: temp?.id,
        },
        { name: 'invoiceReason', invoice_id: RadioSec },
      );
      onClose();
    }
  };

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };
  const onInputChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    reValidate(e);
    setMainState((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const device = localStorage.getItem('device_detect');

  return (
    <div
      className={
        device === 'desktop'
          ? `${css.Invoice} ${css.designWeb}`
          : `${css.Invoice} ${css.designMobile}`
      }
    >
      <div className={css.firstCont}>
        <p className={css.headerP}>
          {otherInvoice ? 'Invoice Not Listed ?' : 'Select Invoice'}
        </p>
        {device === 'mobile' && (
          <div onClick={() => setOtherInvoice(!otherInvoice)}>
            <p className={css.notListedP}>
              {otherInvoice ? 'Invoice Available ?' : 'Invoice Not Listed ?'}
            </p>
          </div>
        )}
      </div>
      <p className={css.infoP}>
        {otherInvoice
          ? 'Please Fill in the below details to add a new customer to your Invoice'
          : `Select an Invoice to which you want to add your ${
              taxType === 'credit_note' ? 'Credit Note' : 'Debit Note'
            }`}
      </p>
      {customerId && !otherInvoice && (
        <>
          <div className={css.searchFilterFull}>
            <SearchIcon className={css.searchFilterIcon} />
            <input
              placeholder="Search for an Invoice"
              onChange={(event) => {
                event.persist();
                setSearchQuery(event?.target?.value);
              }}
              value={searchQuery}
              className={css.searchFilterInputBig}
            />
          </div>

          <div
            className={css.centerScroll}
            style={{ height: device === 'desktop' ? '370px' : '300px' }}
          >
            {(filterList?.length > 0 &&
              filterList?.map((element) => (
                <div className={css.fullCont}>
                  <Radio
                    sx={{
                      color: '#F08B32',
                      '&.Mui-checked': {
                        color: '#F08B32',
                      },
                    }}
                    checked={RadioSec === element?.id}
                    value={element?.id}
                    onChange={(e) => handleRadioChange(e?.target?.value)}
                  />
                  <div
                    className={css.secondCont}
                    onClick={() => handleRadioChange(element?.id)}
                  >
                    <div className={css.innerFirstCont}>
                      <p className={css.invoiceId}>{element?.number}</p>
                      <p className={css.invoiceName}>
                        {element?.billing_party_location_json?.name}
                      </p>
                    </div>
                    <div className={css.innerSecondCont}>
                      <p className={css.invoiceRate}>
                        {/* {FormattedAmount(element?.invoice_items[0]?.total)} */}
                        {element?.invoice_items.length > 0
                          ? FormattedAmount(
                              element?.invoice_items?.reduce(
                                (acc, val) => acc + parseInt(val?.total, 10),
                                0,
                              ),
                            )
                          : FormattedAmount(0)}
                      </p>
                      <p className={css.invoiceDate}>
                        {moment(element?.invoiced_at).format('DD MMM YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
              ))) || (
              <p style={{ textAlign: 'center', fontWeight: 700, margin: 5 }}>
                No Invoices found
              </p>
            )}
          </div>

          <div className={css.buttonDiv}>
            <Button className={css.secondary} onClick={() => onClose()}>
              Back
            </Button>
            <Button
              className={css.primary}
              onClick={() => submitValueNotList()}
              disabled={!RadioSec}
            >
              Select
            </Button>
          </div>

          {device === 'desktop' && (
            <div
              className={css.notListed}
              onClick={() => setOtherInvoice(true)}
            >
              <p className={css.notListedP}>Invoice Not Listed?</p>
            </div>
          )}
        </>
      )}

      {customerId && otherInvoice && (
        <div>
          <div className={css.otherFields}>
            <div>
              <Input
                required
                className={`${css.greyBorder} ${classes.root}`}
                label="Reference No."
                variant="standard"
                name="referenceNum"
                onChange={onInputChange}
                value={mainState.referenceNum}
                onBlur={reValidate}
                error={validationErr.referenceNum}
                helperText={
                  validationErr.referenceNum
                    ? VALIDATION?.referenceNum?.errMsg
                    : ''
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
              />
            </div>
            <div>
              {device === 'desktop' && (
                <SelectBottomSheet
                  name="referenceDate"
                  id="dateForDesktop"
                  onBlur={reValidate}
                  error={validationErr.referenceDate}
                  helperText={
                    validationErr.referenceDate
                      ? VALIDATION?.referenceDate?.errMsg
                      : ''
                  }
                  label="Reference Date"
                  value={moment(mainState.referenceDate).format('DD-MM-YYYY')}
                  required
                  dateChange={(name, data) =>
                    setMainState((s) => ({
                      ...s,
                      referenceDate: new Date(data),
                    }))
                  }
                  selectedDate={mainState.referenceDate}
                  max
                  min={1}
                />
              )}
              {device === 'mobile' && (
                <div
                  style={{
                    border: '1px solid #c9cbcc',
                    borderRadius: '10px',
                    width: 'calc(100% - 20px)',
                    padding: '10px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontStyle: 'light',
                      color: '#283049',
                    }}
                  >
                    Reference Date.<sup style={{ color: 'red' }}>*</sup>
                  </div>

                  <div
                    style={{
                      fontSize: '14px',
                      fontStyle: 'bold',
                      color: '#283049',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '5px',
                    }}
                  >
                    <input
                      type="text"
                      value={moment(mainState.referenceDate).format(
                        'DD-MM-YYYY',
                      )}
                      style={{
                        pointerEvents: 'none',
                        width: '70%',
                        border: 'none',
                      }}
                    />

                    <SelectBottomSheet
                      name="startDate"
                      addNewSheet
                      triggerComponent={
                        <CalendarIcon
                          style={{ width: 20, color: '#949494' }}
                          onClick={() => {
                            setDrawer(true);
                          }}
                        />
                      }
                      open={drawer}
                      onTrigger={() => {
                        setDrawer(false);
                      }}
                      onClose={() => {
                        setDrawer(false);
                      }}
                    >
                      <Calender
                        head="Select Date"
                        button="Select"
                        handleDate={(data) => {
                          setMainState((s) => ({
                            ...s,
                            referenceDate: new Date(data),
                          }));
                          setDrawer(false);
                        }}
                        max
                        min
                      />
                    </SelectBottomSheet>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={css.buttonDiv}>
            <Button
              className={css.secondary}
              onClick={() => setOtherInvoice(false)}
            >
              Back
            </Button>
            <Button className={css.primary} onClick={() => submitValue()}>
              Save and Continue
            </Button>
          </div>
        </div>
      )}

      {!customerId && (
        <p
          style={{
            color: '#e0513e',
            fontWeight: '700',
            margin: '0px 25px 25px 25px',
          }}
        >
          Please Select Customer
        </p>
      )}
    </div>
  );
};

const Reason = ({ onClose, onsubmit, radio, taxType }) => {
  const classes = useStyles();
  const {
    // organization,
    // enableLoading,
    // user,
    openSnackBar,
    // loading,
  } = React.useContext(AppContext);
  const ReasonList =
    taxType === 'credit_note'
      ? [
          'Sales Return',
          'Post-Sale Discount',
          'Deficiency In Services',
          'Correction In Invoice',
          'Change in POS',
          'Finalization of  Provisional Assessment',
          'Others',
        ]
      : [
          'Changes in the taxable value',
          'Changes in the quantity',
          'Returns or rejected goods',
          'Additional goods or services provided',
          'Freight or transportation charges',
          'Other adjustments',
        ];
  const [reasonRadio, setReasonRadio] = React.useState('');
  const [otherReason, setOtherReason] = React.useState('');

  const handleRadioChange = (target) => {
    setReasonRadio(target);
  };

  React.useEffect(() => {
    if (radio) {
      if (
        radio?.toLocaleLowerCase() === 'others' ||
        radio?.toLocaleLowerCase() === 'other adjustments' ||
        !ReasonList?.includes(radio)
      ) {
        setReasonRadio('Others');
        setOtherReason(radio);
      } else if (ReasonList?.includes(radio)) {
        setReasonRadio(radio);
      }
    }
  }, [radio]);

  const submitValue = () => {
    if (reasonRadio === 'Others' || reasonRadio === 'Other adjustments') {
      if (otherReason) {
        onsubmit({ return_reason: otherReason });
        onClose();
      } else {
        openSnackBar({
          message: 'Enter Other Reason',
          type: MESSAGE_TYPE.ERROR,
        });
      }
    } else if (reasonRadio) {
      onsubmit({ return_reason: reasonRadio });
      onClose();
    }
  };

  return (
    <div className={css.Reason}>
      <p className={css.headerP}>Select a Return Reason</p>
      <p className={css.infoP}>
        Please Fill in the below details to add a new customer to your Invoice
      </p>

      <div>
        <div>
          {ReasonList?.map((val) => (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <Radio
                style={{
                  color: '#F08B32',
                }}
                checked={val === reasonRadio}
                onChange={(e) => handleRadioChange(e?.target?.value)}
                value={val}
              />
              <div onClick={() => handleRadioChange(val)}>
                <p
                  style={{
                    margin: '10px 0',
                    cursor: 'pointer',
                  }}
                >
                  {val}
                </p>
              </div>
            </div>
          ))}
        </div>
        {(reasonRadio === 'Others' || reasonRadio === 'Other adjustments') && (
          <div>
            <Input
              name="description"
              label="Enter Reason"
              variant="standard"
              className={`${css.greyBorder} ${classes.root}`}
              value={otherReason}
              InputLabelProps={{ shrink: true }}
              fullWidth
              onChange={(event) => setOtherReason(event?.target?.value)}
              theme="light"
              multiline
              rows={4}
            />
          </div>
        )}
      </div>
      <div className={css.buttonDiv}>
        <Button className={css.secondary} onClick={() => onClose()}>
          Back
        </Button>
        <Button className={css.primary} onClick={() => submitValue()}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default InvoiceAndReason;
