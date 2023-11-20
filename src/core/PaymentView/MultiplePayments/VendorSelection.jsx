/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AppContext from '@root/AppContext.jsx';
import { Button, makeStyles, Chip, Checkbox, SvgIcon } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import { useToggle } from '@services/CustomHooks.jsx';
import { toInr } from '@services/Utils.js';
import VendorList from '@components/Vendor/VendorList';
import AddNewVendor from '@core/BillBookView/shared/AddVendor';

import * as css from './MultiplePayments.scss';

const mockBills = [
  {
    name: 'ACME INC - Consulting',
    date: '23-Nov-2021',
    invoice: 'CMNO-12-222-123',
    total: '30000',
    pending: '15000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '24-Nov-2021',
    invoice: 'DMNO-12-222-423',
    total: '20000',
    pending: '12000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '23-Nov-2021',
    invoice: 'FMNO-12-222-123',
    total: '10000',
    pending: '5000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '23-Nov-2021',
    invoice: 'GMNO-12-222-123',
    total: '30000',
    pending: '18000',
  },
];

const useStyles = makeStyles(() => ({
  checkbox: {
    padding: 0,
    '& .MuiSvgIcon-root': {
      fontSize: '2.4rem',
      fill: 'transparent',
    },
  },
  chips: {
    minWidth: '80px',
    margin: '5px 5px',
  },
  active: {
    background: '#f2d4cd',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
    fontWeight: 400,
  },
  root: {
    '& .MuiInputLabel-root': {
      fontWeight: 400,
      color: '#6E6E6E',
    },
  },
}));

export default function VendorSelection(props) {
  const { vendorSelected, setVendorSelected, singleVendorPayment } = props;
  const classes = useStyles();
  const { changeSubView, organization, enableLoading, user } =
    useContext(AppContext);
  const [drawer, setDrawer] = useState(false);
  const [vendorView, setVendorView] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [groupedVendorList, setGroupedVendorList] = useState([]);

  const getVendors = async () => {
    enableLoading(true);

    RestApi(`organizations/${organization.orgId}/entities?type[]=vendor`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          res.data.map((a) => Object.assign(a));
          setVendorList(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const onCloseVendor = () => {
    setVendorView(false);
    getVendors();
  };

  const onAddVendor = () => {
    setVendorView(true);
  };
  const onClickVendor = (vendorId) => {
    if (singleVendorPayment && vendorSelected.length <= 1) {
      const clickedVendor = vendorList.find((vl) => vl.id === vendorId);
      setVendorSelected([clickedVendor]);
      setDrawer(false);
      return;
    }

    const clickedVendor = vendorList.find((vl) => vl.id === vendorId);
    const selected = vendorSelected.some((vs) => vs.id === clickedVendor.id);
    if (selected) {
      setVendorSelected((pv) => [...pv].filter((p) => p.id !== vendorId));
    } else {
      setVendorSelected((pv) => [...pv, clickedVendor]);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  const getGroupedVendors = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendor_unsettled?grouped=true`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setGroupedVendorList(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  useEffect(() => {
    getVendors();
    getGroupedVendors();
  }, []);

  return (
    <div className={`${css.vendorSelection}`}>
      {!vendorView && (
        <div className={css.inputContainer}>
          <div className={css.label}>
            Select {singleVendorPayment ? 'Vendor' : 'Multiple Vendors'}
          </div>
          <SelectBottomSheet
            name="vendor"
            // error={validationErr.vendor}
            // helperText={
            //     validationErr.vendor ? VALIDATION?.vendor?.errMsg : ''
            // }
            label="Vendor"
            open={drawer}
            value={vendorSelected.map((v) => v?.name)}
            onTrigger={() => setDrawer(true)}
            onClose={() => setDrawer(false)}
            multiple={!singleVendorPayment}
          >
            <VendorList
              vendorList={vendorList}
              selected={
                !singleVendorPayment ? vendorSelected.map((v) => v.id) : null
              }
              disableAdd
              onClick={(v) => onClickVendor(v.id)}
              addNewVendor={() => onAddVendor()}
            />
          </SelectBottomSheet>
          {singleVendorPayment ? (
            <div className={css.vendorChipContainer}>
              {groupedVendorList.map((v) => {
                const selected = vendorSelected.some((vs) => vs.id === v.id);
                return (
                  <Chip
                    className={`${classes.chips} ${
                      selected ? classes.active : ''
                    }`}
                    label={v.name}
                    variant="outlined"
                    onClick={() => {
                      onClickVendor(v.id);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className={css.vendorCards}>
              {groupedVendorList.map((v) => {
                const selected = vendorSelected.some((vs) => vs.id === v.id);
                return (
                  <div
                    key={`${v.id}`}
                    className={`${css.vendorCardItem} ${
                      selected ? css.selected : ''
                    }`}
                    onClick={() => onClickVendor(v.id)}
                    role="menuitem"
                  >
                    <div className={css.title}>{v?.name}</div>
                    <div className={css.amount}>
                      Rs. {toInr(v?.total_net_balance)}
                    </div>
                    <div className={css.count}>{toInr(v?.total_count)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {vendorView && <AddNewVendor onCloseVendor={onCloseVendor} />}
    </div>
  );
}
