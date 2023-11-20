import React, { useEffect } from 'react';
import { Avatar, CircularProgress, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetCustomerEntityState,
} from '@action/Store/Reducers/General/GeneralState';
import useDebounce from '@components/Debounce/Debounce.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchIcon from '@material-ui/icons/Search';
import { CustomSearchLoadingSkeleton } from '../../../../components/SkeletonLoad/SkeletonLoader';
import CustomCheckbox from '../../../../components/Checkbox/Checkbox';
import * as css from '../receivablesSettings.scss';

const RemainderCustomerList = ({CustomerListSubmitFunc, preFilledCustomer}) => {
  const { customerLoad, customerEntity } = useSelector(
  (value) => value.General,
);
const dispatch = useDispatch();
const device = localStorage.getItem('device_detect');
    const [searchQuery, setSearchQuery] = React.useState('');
  const [hasMoreItems, sethasMoreItems] = React.useState(true);
  const [customerList, setCustomerList] = React.useState([]);
    const [selectCustomerList, setSelectCustomerList] = React.useState([]);
  const debounceSearch = useDebounce(searchQuery);
  
  React.useEffect(() => { 
    dispatch(
      GetCustomerEntityState({
        allParties: false,
        searchText: debounceSearch,
        pageNum: 1,
        location: false,
      }),
    );
  }, [debounceSearch]);

  const loadMore = () => {
    if (customerEntity?.pages > 1) {
      dispatch(
        GetCustomerEntityState({
          allParties: false,
          searchText: '',
          pageNum: customerEntity?.page + 1,
          location: false,
        }),
      );
    }
  };

  React.useEffect(() => { 
    if (Object.keys(customerEntity || {})?.length > 0) {
      if (customerEntity?.page === 1) {
        setCustomerList(customerEntity?.data);
      } else {
        setCustomerList((prev) => [...prev, ...customerEntity?.data]);
      }
      sethasMoreItems(customerEntity?.page !== customerEntity?.pages);
    } 

    if(customerEntity?.page !== customerEntity?.pages){
      loadMore();
    }
    
  }, [JSON.stringify(customerEntity)]);


  const handleValueChange = (ele) => {
    if (selectCustomerList?.length === 0 || selectCustomerList?.filter((item) => item?.id === ele?.id)?.length === 0) {
      setSelectCustomerList((prev) => [...prev, ele]);
    } else {
      const checkedList = selectCustomerList?.filter((item) => item?.id !== ele?.id);
      setSelectCustomerList(checkedList);
    }
  };

  useEffect(() => { 
    if (preFilledCustomer?.length > 0 && customerList?.length > 0) {
      const custListData = [];
      preFilledCustomer?.forEach((val) => {
        custListData.push(customerList?.filter((custData) => (custData?.id === val))?.[0]);
      });
      setSelectCustomerList(custListData);
    }
  }, [preFilledCustomer, customerList]);
    
  return (
    <div className={css.remainderCustomerList}>
      <div className={css.firstCont}>
        <p className={css.headerP}>Select Customer</p>

        <div className={css.searchFilterFull}>
          <input
            placeholder="Search Customer"
              onChange={(event) => {
                event.persist();
                setSearchQuery(event?.target?.value);
              }}
              value={searchQuery}
            className={css.searchFilterInputBig}
          />
          <SearchIcon className={css.searchFilterIcon} />
        </div>
      </div>

      <div className={css.midContent}>
        <CustomCheckbox
          checked={(customerList?.length === selectCustomerList?.length && customerList?.length > 0) || (customerEntity?.count === selectCustomerList?.length && customerList?.length > 0) }
          style={{ padding: 5, color: '#F08B32' }}
          onChange={(event) => {
          if (event?.target?.checked) {
            setSelectCustomerList(customerList);
          } else {
            setSelectCustomerList([]);
          }
          }}
          disabled={customerList?.length === 0}
        />
        <p>Select All</p>
      </div>

      <div className={css.centerScrollCont} id="draftContent" style={{height:device ==='desktop' ? '70vh' : '55vh'}}>

      {customerLoad === null && (
            <div>
              <CustomSearchLoadingSkeleton />
            </div>
        )} 
        <InfiniteScroll
                        dataLength={customerList?.length}
                        next={() => loadMore()}
                        scrollThreshold="20px"
                        hasMore={hasMoreItems}
                        loader={
                          customerLoad && <div style={{ display: 'flex' }}>
                            <CircularProgress
                              style={{ color: '#F08B32', margin: 'auto' }}
                            />
                          </div>
                        }
                        scrollableTarget="draftContent"
                      >
              {customerLoad && customerList?.map((element) => <div className={css.customerListDiv} key={element?.id}
                  onClick={() => {
                    handleValueChange(element);
                  }}
              >
                  <CustomCheckbox style={{color: '#F08B32'}} checked={selectCustomerList?.filter((item) => item?.id === element?.id)?.length === 1} />
          <Avatar sx={{bgcolor: '#A8AEBE'}}>{element?.name?.split('')?.[0]}</Avatar>
            <p>{element?.short_name}</p>
              </div>)}
              </InfiniteScroll>
        {customerLoad && customerEntity?.data?.length === 0 && <p
                style={{
                  fontWeight: '700',
                  margin: '0px 25px 25px 25px',
                }}
              >
                No Data Found
              </p>}
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', margin: '15px 0 15px' }}
      >
        <Button disabled={selectCustomerList?.length === 0} className={css.primaryButton} onClick={() => CustomerListSubmitFunc(selectCustomerList)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default RemainderCustomerList;
