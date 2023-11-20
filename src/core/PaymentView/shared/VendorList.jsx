import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import AppContext from '@root/AppContext.jsx';
import * as css from './VendorList.scss';

export const CheckedIcon = (props) => {
  return (
    <svg
      {...props}
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9218 0.188289C11.1685 -0.0627628 11.5684 -0.0627628 11.815 0.188289C12.0617 0.43934 12.0617 0.846374 11.815 1.09743L4.23607 8.81171C3.98942 9.06276 3.58953 9.06276 3.34288 8.81171L0.184985 5.59743C-0.0616617 5.34637 -0.0616617 4.93934 0.184985 4.68829C0.431632 4.43724 0.831526 4.43724 1.07817 4.68829L3.78947 7.44801L10.9218 0.188289Z"
        fill="#F08B32"
      />
    </svg>
  );
};
const VendorList = (props) => {
  const {
    onClick,
    vendorList,
    selected: selectedIds = [],
    popOverScroll,
    callFunction,
  } = props;
  const { loading } = React.useContext(AppContext);
  // eslint-disable-next-line no-unused-vars
  // const [searchTerm, setSearchTerm] = useState();
  // const [vendors, setVendors] = useState(vendorList);
  const [query, setQuery] = useState('');

  // const onInputChange = (e) => {
  //   const { value } = e.target;
  //   setSearchTerm(value);

  //   const searchVendorList =
  //     vendorList &&
  //     vendorList.filter(
  //       (item) => item && item.name.toLowerCase().indexOf(value) > -1,
  //     );
  //   setVendors(searchVendorList);
  // };

  const device = localStorage.getItem('device_detect');

  return (
    <div
      className={css.vendorListContainer}
      style={{ height: device === 'desktop' ? '100%' : '80vh' }}
    >
      <div
        className={css.searchFilter}
        style={{ height: device === 'desktop' ? '' : '10vh' }}
      >
        <SearchIcon className={css.searchFilterIcon} />
        <input
          placeholder="Search Vendors"
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value?.length === 0) {
              callFunction();
            }
            if (event.target.value?.length > 2) {
              callFunction(event?.target?.value);
            }
          }}
          className={css.searchFilterInputBig}
          value={query}
        />
      </div>
      <div
        className={css.expenseList}
        style={{
          height:
            device === 'desktop'
              ? (popOverScroll && 'calc(100vh - 515px)') || ''
              : '65vh',
        }}
      >
        {vendorList.length > 0 &&
          vendorList?.map((v) => (
            <div
              className={`${css.vendorOptions} ${
                selectedIds?.includes(v.id) ? css.selected : ''
              }`}
              onClick={() => onClick(v)}
              key={v.id}
              role="menuitem"
            >
              <div>
                <div
                  className={`${css.icon} ${
                    selectedIds?.includes(v.id)
                      ? css.checkedIcon
                      : css.uncheckedIcon
                  }`}
                >
                  {selectedIds?.includes(v.id) ? <CheckedIcon /> : null}
                </div>
              </div>

              <div className={`${css.vendorName}`}>{v.short_name}</div>
            </div>
          ))}
        {vendorList && vendorList?.length === 0 && (
          <Typography align="center">
            {loading ? 'Data is being fetched' : 'No Data Found'}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default VendorList;
