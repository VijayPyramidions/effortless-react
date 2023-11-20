import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
} from '@mui/material';

import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import BPBS from '@assets/phonePostpaid/bpbs.svg';
import searchicon from '@assets/search_1.svg';

import { useStyles } from '../utils';
import BillInfo from '../Components/BillInfo';
import BillDetail from '../Components/BillDetail';
import ProceedToPay from '../../../PaymentView/shared/ProceedToPay';
import ForgetPassword from '../../../PaymentView/TransactionVerify/ForgetPassword';

import * as css from '../utilitybills.scss';

const Phone = () => {
  const classes = useStyles();
  const { user, openSnackBar, enableLoading, organization } =
    useContext(AppContext);

  const navigate = useNavigate();
  const searchRef = useRef();

  const [search, setSearch] = useState('');
  const [providers, setProviders] = useState([]);

  const [selectedProvider, setSelectedProvider] = useState({});
  const [providerChange, setproviderChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState({});
  const [drawer_, setDrawer_] = useState({});
  const [billInfoDetails, setBillInfoDetail] = useState([]);
  const [inputParams, setInputParams] = useState({});

  const [bankAccounts, setBankAccounts] = useState({});
  const [voucher, setVoucher] = useState({});
  const [payAmount, setPayAmount] = useState({
    active: true,
    title: '',
    subTitle: '',
  });

  const handleProviderClick = (prd) => () => {
    setSelectedProvider(prd);
    setproviderChange(true);
  };

  const ViewBillDetails = () => {
    setOpenDrawer((prev) => ({ ...prev, billInfo: false, billDetail: true }));
  };

  const billInfoClose = () => {
    setOpenDrawer((prev) => ({ ...prev, billInfo: true, billDetail: false }));
  };

  const hanldePaymentClose = () => {
    setOpenDrawer((prev) => ({ ...prev, billInfo: false, billDetail: false }));
    navigate('/bill-utility');
  };

  const onInputChange = (dataType) => (e) => {
    const { name, value } = e.target;
    const regex = /^$|^[0-9\b]+$/;

    if (dataType === 'NUMERIC') {
      if (regex.test(value))
        setInputParams({
          ...inputParams,
          [name]: value,
        });
    } else setInputParams({ ...inputParams, [name]: value });
  };

  const getBillInfoDetails = async () => {
    const data = [];
    let errorstate = false;

    Object.keys(inputParams || {}).forEach((item, index) => {
      if (selectedProvider?.input_params[index]?.regEx) {
        const pattern = new RegExp(
          selectedProvider.input_params[index].regEx,
          'i'
        );
        if (pattern.test(inputParams[item]))
          data.push({ key: item.replace('_', ' '), value: inputParams[item] });
        else {
          openSnackBar({
            message: `Enter valid ${item.replace('_', ' ')}`,
            type: MESSAGE_TYPE.ERROR,
          });
          errorstate = true;
        }
      } else
        data.push({ key: item.replace('_', ' '), value: inputParams[item] });
    });

    if (Object.keys(inputParams || {}).length === 0)
      openSnackBar({
        message: `Enter valid fields`,
        type: MESSAGE_TYPE.ERROR,
      });

    if (errorstate || Object.keys(inputParams || {}).length === 0) return;

    enableLoading(true);
    await RestApi(`organizations/${organization.orgId}/bbps_accounts`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        bbps_biller_id: selectedProvider?.id,
        input_params: data,
      },
    })
      .then((res) => {
        enableLoading(false);

        if (!res.errors && !res.message && !res.error) {
          setOpenDrawer((prev) => ({ ...prev, billInfo: true }));
          setBillInfoDetail(res);
          setPayAmount((prev) => ({
            ...prev,
            title: FormattedAmount(res.total_amount || 0),
          }));
        } else
          openSnackBar({
            message:
              res?.message ||
              res.errors?.map((error) => error.input_value).join(', ') ||
              res?.error ||
              'Something Wrong',
            type: MESSAGE_TYPE.WARNING,
          });
      })
      .catch((e) => {
        openSnackBar({
          message: e.message || Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const getServiceProviders = async () => {
    await RestApi(`bbps_billers?category=Mobile Postpaid&search=${search}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (!res.message || !res.error) {
          setProviders(res.data);
          setLoading(false);
        } else if (res?.message || res?.error) {
          openSnackBar({
            message: res?.message || 'Something Wrong',
            type: MESSAGE_TYPE.WARNING,
          });
        }
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown Error Occured',
      type: 'error',
    });
  };

  const getBankAccounts = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/payment_vouchers/${billInfoDetails.fetch_id}/bank_accounts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (res.message === 'You are not allowed to perform this action') {
            showError(res.message);
          } else {
            setBankAccounts(res.data);
            setOpenDrawer((prev) => ({ ...prev, billPayment: true }));
          }
        } else {
          showError(res.message);
        }
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  const getPaymentVoucher = async () => {
    enableLoading(true);

    await RestApi(
      `organizations/${organization.orgId}/bbps_fetches/${billInfoDetails.fetch_id}/bbps_payments`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.message) {
          setVoucher(res);
          getBankAccounts();
        } else {
          showError(res.message);
        }
      })
      .catch((e) => {
        showError(e);
        enableLoading(false);
      });
  };

  useEffect(() => {
    searchRef?.current?.focus();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProviders([]);
      getServiceProviders();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <Box className={css.utilitycontainter}>
      {!providerChange ? (
        <Stack>
          <Typography variant="h4" className={css.servicetitle}>
            Select your Provider
          </Typography>
          <Stack className={css.providersearchwrp}>
            <img
              src={searchicon}
              alt="search icon"
              className={css.searchicon}
            />
            <input
              type="search"
              placeholder="Search Provider"
              className={css.searchinput}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              ref={searchRef}
            />
          </Stack>
          <Typography className={css.broadbandlabe}>All Provider</Typography>
          <List dense className={css.list}>
            {providers?.length > 0 ? (
              <>
                {providers?.map((row) => (
                  <ListItem className={css.listitem} key={row.id}>
                    <ListItemButton
                      onClick={handleProviderClick(row)}
                      className={css.listitembtn}
                    >
                      <ListItemAvatar className={css.listitemavatar}>
                        <Avatar
                          alt="provider icon"
                          src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/${row.source_id}.svg`}
                          className={css.avatar}
                        >
                          <img
                            src="https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/unknown_mobile_broadband.svg"
                            alt="fallback"
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={row.name}
                        className={`${css.listitemtext} ${classes.listItemText}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            ) : (
              <ListItem className={css.listitem}>
                <ListItemButton className={css.listitembtn}>
                  <ListItemText
                    primary={loading ? 'Loading...' : 'Provider not found...!'}
                    className={`${css.listitemtext} ${classes.listItemText}`}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Stack>
      ) : (
        <Stack className={css.getbillcontainer}>
          <Stack className={css.selectedproviderwrp}>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar
                src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/${selectedProvider.source_id}.svg`}
                className={css.avatar}
              >
                <img
                  src="https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/unknown_mobile_broadband.svg"
                  alt="fallback"
                />
              </Avatar>
              <Typography className={css.providername}>
                {selectedProvider.name}
              </Typography>
            </Stack>

            <Button
              className={css.changebtn}
              onClick={() => setproviderChange(false)}
            >
              Change
            </Button>
          </Stack>
          <Box>
            {selectedProvider?.input_params?.map((item) => (
              <Box key={item.paramName.replace(' ', '_')}>
                <Typography className={css.desc} htmlFor="in">
                  {item.paramName}
                </Typography>

                <Stack className={css.inputwpr}>
                  <input
                    type="text"
                    placeholder={`Enter your ${item.paramName}`}
                    className={css.numberinput}
                    name={item.paramName.replace(' ', '_')}
                    value={inputParams[item.paramName.replace(' ', '_')] || ''}
                    onChange={onInputChange(item.dataType)}
                    minLength={item?.minLength}
                    maxLength={item?.maxLength}
                  />
                </Stack>
              </Box>
            ))}

            <Button className={css.submitbtn} onClick={getBillInfoDetails}>
              Get Bill
            </Button>
          </Box>
        </Stack>
      )}

      <Stack className={css.bpbswrp}>
        <Typography className={css.bpbstitle}>
          Secured by Bharat BillPay
        </Typography>
        <Avatar src={BPBS} alt="bpbs" className={css.bpbslogo} />
      </Stack>

      <SelectBottomSheet
        triggerComponent
        open={openDrawer.billInfo}
        name="Bill Details"
        onClose={() => setOpenDrawer((prev) => ({ ...prev, billInfo: false }))}
        addNewSheet
      >
        <BillInfo
          ViewBillDetails={ViewBillDetails}
          paytype="Postpaid Bill"
          billInfoDetails={billInfoDetails}
          selectedProvider={selectedProvider}
          mobile={inputParams}
          phone
          OnSubmit={() => getPaymentVoucher()}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={openDrawer.billDetail}
        name="Bill Info"
        onClose={billInfoClose}
        addNewSheet
      >
        <BillDetail
          onClose={billInfoClose}
          phone="show"
          billInfoDetails={billInfoDetails}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={openDrawer.billPayment}
        name="Pay Bill"
        onClose={() =>
          setOpenDrawer((prev) => ({ ...prev, billPayment: false }))
        }
        addNewSheet
      >
        <ProceedToPay
          payNow={payAmount}
          payType
          bankAccounts={bankAccounts}
          paymentVoucharId={voucher?.id}
          BBPSFetchId={billInfoDetails?.fetch_id}
          paidAmount={billInfoDetails?.total_amount}
          onClose={hanldePaymentClose}
          ShowTransForgPass={() =>
            setOpenDrawer((prev) => ({ ...prev, showTransPass: true }))
          }
          showVerifyPassword={[drawer_, setDrawer_]}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={openDrawer.showTransPass}
        name="forgetPassword"
        hideClose
      >
        <ForgetPassword
          onClose={() =>
            setOpenDrawer((prev) => ({ ...prev, showTransPass: false }))
          }
        />
      </SelectBottomSheet>
    </Box>
  );
};

export default Phone;
