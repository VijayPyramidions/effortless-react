import React from 'react';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
// import AppContext from '@root/AppContext.jsx';
// import RestApi, { METHOD } from '@services/RestApi.jsx';
import useDebounce from '@components/Debounce/Debounce.jsx';
// import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import SearchIcon from '@material-ui/icons/Search';
import * as css from './selectBank.scss';

const BpIcon = styled('span')(() => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: '#f5f8fa',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#ebf1f5',
  },
}));

const BankCheckedIcon = styled('span')({
  borderRadius: '50%',
  width: 16,
  height: 16,
  backgroundColor: '#f08b32',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#f08b32',
  },
});

const SelectBankAccount = ({ ParamBankList, callFunction, listFunction, onclose, ParamSelectedBank }) => {
  const device = localStorage.getItem('device_detect');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [BankList, setBankList] = React.useState([]);
  const [selectAccount, setSelectAccount] = React.useState(ParamSelectedBank || '');
  const debounceSearch = useDebounce(searchQuery);
  
  React.useEffect(() => { 
      setBankList(ParamBankList);
  }, [ParamBankList]);

  React.useEffect(() => {
    listFunction(debounceSearch);
  }, [debounceSearch]);
  
  const submitValue = (value) => { 
    setSelectAccount(value);
    callFunction({ bank_account_id: value });
    onclose();
  };
    
  return (
    <div className={css.selectBankAccount}>
      <div className={css.firstCont}>
        <p className={css.headerP}>Select Bank Account</p>

        <div className={css.searchFilterFull}>
          <input
            placeholder="Search Bank Account"
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

      <div className={css.centerScrollCont} style={{height: device === 'mobile' ? '60vh' : '78vh'}}>
        {BankList?.length > 0 && BankList?.map((element) => <div className={css.bankListDiv} key={element?.id}>
          <Radio
            disableRipple
            color="default"
            checkedIcon={<BankCheckedIcon />}
            icon={<BpIcon />}
            value={element?.id}
            checked={selectAccount === element?.id}
            onClick={(e) => submitValue(e?.target?.value)}
          />
          <div className={css.bankListInner} onClick={() => submitValue(element?.id)}>
            <div className={css.bankListDetails}>
              <p className={css.bankLeft}>Beneficiary Name:</p>
              <p className={css.bankRight}>{element?.display_name || '-'}</p>
                      </div>
                      <div className={css.bankListDetails}>
              <p className={css.bankLeft}>Bank and Branch:</p>
              <p className={css.bankRight}>{element?.bank_account_name || '-'}, {element?.bank_branch || '-'}</p>
                      </div>
                      <div className={css.bankListDetails}>
              <p className={css.bankLeft}>Account No:</p>
              <p className={css.bankRight}>{element?.bank_account_number || '-'}</p>
                      </div>
                      <div className={css.bankListDetails}>
              {element?.bank_ifsc_code && <><p className={css.bankLeft}>IFSC Code:</p>
              <p className={css.bankRight}>{element?.bank_ifsc_code || '-'}</p></>}
              {element?.bank_swift_code && <><p className={css.bankLeft}>Swift Code:</p>
              <p className={css.bankRight}>{element?.bank_swift_code || '-'}</p></>}
            </div>
          </div>
        </div>)}
        {BankList?.length === 0 && <p
                style={{
                  fontWeight: '700',
                  margin: '0px 25px 25px 25px',
                }}
              >
                No Data Found
              </p>}
          </div>
 
    </div>
  );
};

export default SelectBankAccount;
