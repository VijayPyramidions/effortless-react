import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { getJournalAccounts } from '@action/Store/Reducers/Bills/JournalState';
import Searchicon from '@assets/searchjournal.svg';
import trip_empty from '@assets/trip_empty.svg';

import * as css from './journal.scss';

const TabDropDown = ({ category, onChange, onClose }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const { journalAccounts, dataLoad } = useSelector((state) => state.Journal);

  const handleClickItem = (value) => () => {
    onChange(value);
    onClose();
  };

  useEffect(() => {
    dispatch(getJournalAccounts({ category, search }));
  }, [dispatch, search]);

  return (
    <Stack className={css.tabcontent}>
      <Stack className={css.searchwrp}>
        <img src={Searchicon} alt="search" className={css.searchicon} />
        <input
          type="search"
          className={css.searchinput}
          placeholder="Search "
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </Stack>
      <List className={css.tablist}>
        {journalAccounts.length > 0 ? (
          <>
            {journalAccounts?.map((item) => (
              <ListItem className={css.listitem} key={item.id}>
                <ListItemButton
                  className={css.listbtn}
                  onClick={handleClickItem(item)}
                >
                  <ListItemText primary={item.name} className={css.listtext} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        ) : (
          <>
            <ListItem className={css.listitemnodata}>
              {!dataLoad.account ? (
                <ListItemAvatar className={css.listavatar}>
                  <Avatar
                    src={trip_empty}
                    alt="no data"
                    className={css.nodataavatar}
                  />
                </ListItemAvatar>
              ) : (
                <ListItemText primary="Loading..." className={css.listtext} />
              )}
            </ListItem>
          </>
        )}
      </List>
    </Stack>
  );
};

export default memo(TabDropDown);
