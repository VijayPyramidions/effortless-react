/* eslint-disable no-nested-ternary */

import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJournalContacts } from '@action/Store/Reducers/Bills/JournalState';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import Searchicon from '@assets/searchjournal.svg';
import * as css from './journal.scss';

const ContactsDropDown = ({ onChange, onClose, data, from }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);

  const { journalContacts } = useSelector((state) => state.Journal);

  const handleItemClick = (value) => () => {
    onChange(value);
    onClose();
  };

  useEffect(() => {
    if (from === 'sync') setOptions(data);
    else setOptions(journalContacts);
  }, [journalContacts, data]);

  useEffect(() => {
    let debounceTimeout;
    if (from === 'sync') {
      if (search?.length > 0) {
        setOptions(
          data?.filter((filterVal) =>
            filterVal?.name?.toLowerCase()?.includes(search?.toLowerCase())
          )
        );
      } else {
        setOptions(data);
      }
    } else if (from === 'journal') {
      debounceTimeout = setTimeout(() => {
        dispatch(getJournalContacts(search));
      }, 1000);
    }

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [search]);

  return (
    <Stack className={css.contactselect}>
      <Stack className={css.searchwrp}>
        <img src={Searchicon} alt="search" className={css.searchicon} />
        <input
          type="search"
          placeholder={
            from === 'sync' ? 'Search accounts' : 'Search Customer, Vendor'
          }
          className={css.searchinput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>
      <List className={css.contactlist}>
        {options?.length > 0 ? (
          <>
            {options?.map((item) => (
              <ListItem
                className={css.listitem}
                key={
                  item?.id ? `${item?.id}_${item?.primary_relationship}` : item
                }
                secondaryAction={
                  from === 'journal' && (
                    <Stack
                      className={`${css.relationship} ${
                        css[item.primary_relationship]
                      }`}
                    >
                      <span>{item.primary_relationship}</span>
                    </Stack>
                  )
                }
              >
                <ListItemButton
                  className={css.listbtn}
                  onClick={handleItemClick(item)}
                >
                  <ListItemAvatar className={css.listitemavatar}>
                    <Avatar className={css.listavatar}>
                      {item?.name ? item.name.slice(0, 1) : item?.slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      item?.name
                        ? item.name.length > 26
                          ? from === 'sync'
                            ? `${item.name.slice(
                                0,
                                26
                              )}... ${`(${item.account_type})`}`
                            : `${item.name.slice(0, 26)}...`
                          : from === 'sync'
                          ? `${item.name} ${`(${item.account_type})`}`
                          : item.name
                        : item.length > 26
                        ? `${item.slice(0, 26)}...`
                        : item
                    }
                    className={css.listtext}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        ) : (
          <ListItem className={css.listitem}>
            <ListItemButton className={css.listbtn}>
              <ListItemText primary="No data" className={css.listtext} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Stack>
  );
};

export default memo(ContactsDropDown);
