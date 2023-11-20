import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  GetEmployeeEntityState,
  ClearSateEmployeeEntity,
} from '@action/Store/Reducers/General/GeneralState';

import useDebounce from '@components/Debounce/Debounce.jsx';
import SearchIcon from '@material-ui/icons/Search';
import AppContext from '@root/AppContext.jsx';
import { CustomSearchLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';
import * as css from './employeeList.scss';

export const EmployeeList = ({ handleClick }) => {
  const { currentUserInfo } = useContext(AppContext);

  const dispatch = useDispatch();
  const { employeeEntity, employeeLoad } = useSelector(
    (value) => value.General
  );

  const device = localStorage.getItem('device_detect');
  const [EmployeeData, setEmployeeData] = useState([]);
  const [query, setQuery] = useState(false);
  const debounceQuery = useDebounce(query);

  const fetchTeamApi = (searchVal) => {
    dispatch(
      GetEmployeeEntityState({
        allParties: false,
        pageNum: 1,
        searchText: searchVal || '',
        location: false,
      })
    );
  };

  useEffect(() => {
    if (debounceQuery !== false) {
      fetchTeamApi(debounceQuery);
    }
  }, [debounceQuery]);

  useEffect(() => {
    if (Object.keys(employeeEntity || {})?.length > 0) {
      if (employeeEntity?.page === 1) {
        setEmployeeData(employeeEntity?.data);
      } else {
        setEmployeeData((prev) => [...prev, ...employeeEntity?.data]);
      }
    }
  }, [employeeEntity]);

  useEffect(() => {
    fetchTeamApi();
    return () => {
      dispatch(ClearSateEmployeeEntity());
    };
  }, []);

  return (
    <div className={css.employeeList}>
      <p className={css.headerText}>Paid By</p>
      <p className={css.subHeader}>Select who has paid the bill</p>
      <div className={css.searchFilterFull}>
        <SearchIcon className={css.searchFilterIcon} />{' '}
        <input
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder="Search Employee"
          value={query || ''}
          className={css.searchFilterInputBig}
          autoFocus
        />
      </div>
      <div
        className={css.scrollDiv}
        style={{ height: device === 'desktop' ? '70vh' : '360px' }}
      >
        {employeeLoad === null && EmployeeData?.length === 0 && (
          <div>
            <CustomSearchLoadingSkeleton />
          </div>
        )}
        {EmployeeData?.length > 0 &&
          employeeLoad === 'dataLoad' &&
          EmployeeData?.map((val) => (
            <div
              className={css.employeeDiv}
              key={val?.id}
              onClick={() => handleClick(val)}
            >
              <p className={css.employeeP}>
                {val?.name} {currentUserInfo?.entity_id === val?.id && '(YOU)'}
              </p>
            </div>
          ))}
        {EmployeeData?.length === 0 && employeeLoad === 'dataLoad' && (
          <p className={css.noData}>No Data Found</p>
        )}
      </div>
    </div>
  );
};
