import React from 'react';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import { Avatar } from '@mui/material';
import useDebounce from '@components/Debounce/Debounce.jsx';
import SearchIcon from '@material-ui/icons/Search';
import * as css from './salesPerson.scss';

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

const CheckedIcon = styled('span')({
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

const SalesPersonList = (props) => {
    const { ParamSalesPersonList, listFunction, onclose, callFunction, ParamSelectedSalesPerson, title } = props;
    const [searchQuery, setSearchQuery] = React.useState('');
    const [SelectedSalesPerson, setSelectedSalesPerson] = React.useState(ParamSelectedSalesPerson || '');
  const debounceSearch = useDebounce(searchQuery);

  React.useEffect(() => {
    listFunction(debounceSearch);
  }, [debounceSearch]);
    
  const submitValue = (value) => { 
    setSelectedSalesPerson(value);
    callFunction({ sales_person_id: value });
    onclose();
  };
    
  return (
    <div className={css.salesPerson}>
      <div className={css.firstCont}>
        <p className={css.headerP}>{title || 'Select Sales person'}</p>

        <div className={css.searchFilterFull}>
          <input
            placeholder="Search Sales person"
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

      <div className={css.centerScrollCont}>
        {ParamSalesPersonList?.length > 0 && ParamSalesPersonList?.map((element) => <div className={css.salesListDiv} key={element?.id} onClick={() => submitValue(element?.id)}>
          <Radio
            disableRipple
            color="default"
            checkedIcon={<CheckedIcon />}
            icon={<BpIcon />}
            value={element?.id}
            checked={SelectedSalesPerson === element?.id}
          />
          <Avatar sx={{bgcolor: '#A8AEBE'}}>{element?.name?.split('')?.[0]}</Avatar>
            <p>{element?.name}</p>
        </div>)}
        {ParamSalesPersonList?.length === 0 && <p
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

export default SalesPersonList;
