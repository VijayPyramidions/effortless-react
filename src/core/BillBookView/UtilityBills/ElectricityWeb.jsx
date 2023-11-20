import React, { useEffect, useState, useContext, memo, useRef } from 'react';
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

const ElectricityWeb = ({ propValues }) => {
  const classes = useStyles();
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
          setBillInfoDetail(res);
          setPayAmount((prev) => ({
            ...prev,
            title: FormattedAmount(res.total_amount || 0),
          }));
          handleActionSheetChange();
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
    await RestApi(`bbps_billers?category=Electricity&search=${search}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (!res.message || !res.error) {
          const result = res?.data?.reduce((x, y) => {
            (x[y.biller_coverage] = x[y.biller_coverage] || []).push(y);
            return x;
          }, {});

          setProviders(result);
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
      <Typography className={css.descforprovider}>
        Set up your Monthly Electricity Payment Process
      </Typography>
      {!providerChange ? (
        <Stack>
          <Typography variant="h4" className={css.servicetitle}>
            Select your Electricity Provider
          </Typography>
          <Stack className={css.providersearchwrp}>
            <img
              src={searchicon}
              alt="search icon"
              className={css.searchicon}
            />
            <input
              type="search"
              placeholder="Search Electricity Provider"
              className={css.searchinput}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              ref={searchRef}
            />
          </Stack>
          <Stack className={css.listitemwrp}>
            {Object.keys(providers || {})?.length !== 0 ? (
              <>
                {Object.keys(providers || {})?.map((keyitem) => (
                  <>
                    <Typography className={css.broadbandlabe}>
                      {keyitem}
                    </Typography>
                    <List dense className={css.listelectricity}>
                      {providers[keyitem]?.map((row) => (
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
                                  src="https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/unknown_electricity.svg"
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
                    </List>
                  </>
                ))}
              </>
            ) : (
              <List dense className={css.listelectricity}>
                <ListItem className={css.listitem}>
                  <ListItemButton className={css.listitembtn}>
                    <ListItemText
                      primary={
                        loading ? 'Loading...' : 'Provider not found...!'
                      }
                      className={`${css.listitemtext} ${classes.listItemText}`}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            )}
          </Stack>
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
                  src="https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bbps_biller_logos/unknown_electricity.svg"
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

export default memo(ElectricityWeb);
