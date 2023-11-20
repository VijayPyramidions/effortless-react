import React, { useEffect, useState, useContext, memo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

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
  IconButton,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import RestApi, { METHOD } from '@services/RestApi';
import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import BPBS from '@assets/phonePostpaid/bpbs.svg';
import searchicon from '@assets/search_1.svg';

import { useStyles } from './utils';

import * as css from './utilitybills.scss';

const PhoneInternetWeb = ({ propValues }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { user, openSnackBar, enableLoading, organization } =
    useContext(AppContext);

  const [
    setBillInfoDetail,
    selectedProvider,
    setSelectedProvider,
    setPayAmount,
    inputParams,
    setInputParams,
    handleActionSheetChange,
    serviceType,
  ] = propValues;

  const searchRef = useRef();

  const [search, setSearch] = useState('');
  const [providers, setProviders] = useState([]);
  const [providerChange, setproviderChange] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleProviderClick = (prd) => () => {
    setSelectedProvider(prd);
    setproviderChange(true);
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
      dispatch(
        openSnackbar({
          message: `Enter valid fields`,
          type: MESSAGE_TYPE.ERROR,
        })
      );

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
          setBillInfoDetail(res);
          setPayAmount((prev) => ({
            ...prev,
            title: FormattedAmount(res.total_amount || 0),
          }));
          handleActionSheetChange();
        } else
          dispatch(
            openSnackbar({
              message:
                res?.message ||
                res.errors?.map((error) => error.input_value).join(', ') ||
                res?.error ||
                'Something Wrong',
              type: MESSAGE_TYPE.WARNING,
            })
          );
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
    await RestApi(
      `bbps_billers?category=${
        serviceType === 'phone' ? 'Mobile Postpaid' : 'Broadband Postpaid'
      }&search=${search}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
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
      {serviceType === 'phone' ? (
        <Typography className={css.descforprovider}>
          Set up your Monthly Payment for Phone Bill Services
        </Typography>
      ) : (
        <Typography className={css.descforprovider}>
          Set up your Monthly Payment for Internet Services
        </Typography>
      )}
      {!providerChange ? (
        <Stack>
          <Typography variant="h4" className={css.servicetitle}>
            {` Select your ${
              serviceType === 'phone' ? 'Provider' : 'Broadband Company'
            }`}
          </Typography>
          <Stack className={css.providersearchwrp}>
            <img
              src={searchicon}
              alt="search icon"
              className={css.searchicon}
            />
            <input
              type="search"
              placeholder={`Search ${
                serviceType === 'phone' ? 'Provider' : 'Broadband Company'
              }`}
              className={css.searchinput}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              ref={searchRef}
            />
          </Stack>
          <Typography className={css.broadbandlabe}>
            {serviceType === 'phone'
              ? 'All Provider'
              : '    Top Broadband / Landline Operator'}
          </Typography>
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
              <IconButton
                className={css.backbtn}
                onClick={() => setproviderChange(false)}
              >
                <ArrowBackRoundedIcon />
              </IconButton>

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
          </Stack>
          <Box>
            {selectedProvider?.input_params?.map((item) => (
              <Box key={item.paramName.replace(' ', '_')}>
                <Typography className={css.desc}>{item.paramName}</Typography>

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
    </Box>
  );
};

export default memo(PhoneInternetWeb);
