/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AppContext from '@root/AppContext.jsx';
import { Button, makeStyles, Chip, Checkbox, SvgIcon } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import { toInr } from '@services/Utils.js';
import * as css from './MultiplePayments.scss';

export const CheckedIcon = (props) => {
  return (
    <SvgIcon
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_537_5)">
        <rect x="8" y="4" width="24" height="24" rx="4" fill="white" />
        <rect
          x="8.5"
          y="4.5"
          width="23"
          height="23"
          rx="3.5"
          stroke="#F08B32"
        />
      </g>
      <path
        d="M24.9218 11.1883C25.1685 10.9372 25.5684 10.9372 25.815 11.1883C26.0617 11.4393 26.0617 11.8464 25.815 12.0974L18.2361 19.8117C17.9894 20.0628 17.5895 20.0628 17.3429 19.8117L14.185 16.5974C13.9383 16.3464 13.9383 15.9393 14.185 15.6883C14.4316 15.4372 14.8315 15.4372 15.0782 15.6883L17.7895 18.448L24.9218 11.1883Z"
        fill="#F08B32"
      />
      <defs>
        <filter
          id="filter0_d_537_5"
          x="0"
          y="0"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.172549 0 0 0 0 0.152941 0 0 0 0 0.219608 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_537_5"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_537_5"
            result="shape"
          />
        </filter>
      </defs>
    </SvgIcon>
  );
};
export const UncheckedIcon = (props) => {
  return (
    <SvgIcon
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_2_1426)">
        <rect x="8" y="4" width="24" height="24" rx="4" fill="white" />
        <rect
          x="8.5"
          y="4.5"
          width="23"
          height="23"
          rx="3.5"
          stroke="#DBE2EA"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2_1426"
          x="0"
          y="0"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.172549 0 0 0 0 0.152941 0 0 0 0 0.219608 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2_1426"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2_1426"
            result="shape"
          />
        </filter>
      </defs>
    </SvgIcon>
  );
};

const mockChips = [
  'All',
  'ACME Inc.',
  'ISSE Corpss',
  'ISSE Corps',
  'ISSE Corpz',
  'ISSE Corp',
];

const mockBills = [
  {
    name: 'ACME INC - Consulting',
    date: '23-November-2021',
    invoice: 'CMNO-12-222-123',
    total: '30000',
    pending: '15000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '24-November-2021',
    invoice: 'DMNO-12-222-423',
    total: '20000',
    pending: '12000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '23-November-2021',
    invoice: 'FMNO-12-222-123',
    total: '10000',
    pending: '5000',
  },
  {
    name: 'ACME INC - Consulting',
    date: '23-November-2021',
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
}));

const filterAllObj = {
  id: 'all',
  name: 'All',
};

export default function VendorBillSelection(props) {
  const {
    selectedBills,
    setSelectedBills,
    vendorSelected,
    setPaymentVoucher,
    setVoucherItems,
  } = props;
  const { organization, enableLoading, user, openSnackBar } =
    useContext(AppContext);

  const classes = useStyles();

  const [filter, selectFilter] = useState(filterAllObj);

  const [billData, setBillData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const filterData = (fData) => {
    setFilteredData(
      fData.id === 'all'
        ? billData
        : billData.filter((d) => d.vendor_id === fData.id),
    );
  };

  const onSelectFilter = (vs) => {
    selectFilter(vs);
    filterData(vs);
  };

  const getVendorBills = () => {
    let queryParams = '';
    vendorSelected.forEach((v) => {
      queryParams += `vendor_ids[]=${v.id}&`;
    });
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendor_unsettled?${queryParams}`,
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
          setBillData(res.data);
          setFilteredData(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const handleCheckbox = (e, billObj) => {
    const { checked } = e.target;
    if (checked) setSelectedBills((sb) => [...sb, billObj]);
    if (!checked)
      setSelectedBills((sb) => sb.filter((sbObj) => sbObj.id !== billObj.id));
  };

  useEffect(() => {
    setPaymentVoucher();
    setVoucherItems([]);
    getVendorBills();
  }, []);

  return (
    <div className={css.vendorBillSelection}>
      <div className={css.filterContainer}>
        <div
          className={`${css.filterItem} ${
            filter.id === 'all' ? css.selected : ''
          }`}
          onClick={() => onSelectFilter(filterAllObj)}
          role="menuitem"
        >
          {filterAllObj.name}
        </div>
        {vendorSelected.map((vs) => (
          <div
            key={vs.id}
            className={`${css.filterItem} ${
              vs.id === filter.id ? css.selected : ''
            }`}
            onClick={() => onSelectFilter(vs)}
            role="menuitem"
          >
            {vs.name}
          </div>
        ))}
      </div>
      <div className={css.billList}>
        {filteredData.map((b, i) => (
          <label
            key={b.id}
            className={`${css.billItem} ${
              i % 2 === 0 ? css.alternateColor : ''
            }`}
            htmlFor={b.id}
          >
            <div className={css.checkbox}>
              {/* <input id={b.id} type="checkbox" value={false} /> */}
              <Checkbox
                className={classes.checkbox}
                inputProps={{ id: b.id }}
                checked={selectedBills.some((sb) => sb.id === b.id)}
                onChange={(e) => handleCheckbox(e, b)}
                icon={<UncheckedIcon />}
                checkedIcon={<CheckedIcon />}
              />
            </div>
            <div className={css.info}>
              <div className={css.title}>{b.vendor_name}</div>
              <div className={css.row}>
                <div className={css.label}>Date of Payment</div>
                <div className={css.value}>{b.date}</div>
              </div>
              <div className={css.row}>
                <div className={css.label}>Invoice Number</div>
                <div className={css.value}>{b.document_number}</div>
              </div>
              <div className={css.row}>
                <div className={css.label}>Total Amount</div>
                <div className={css.value}>Rs. {toInr(b.amount)}</div>
              </div>
              <div className={css.row}>
                <div className={css.label}>Pending Amount</div>
                <div className={css.value}>Rs. {toInr(b.net_balance)}</div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
