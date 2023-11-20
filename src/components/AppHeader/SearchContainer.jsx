import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '@root/AppContext';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import useDebounce from '@components/Debounce/Debounce.jsx';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Backdrop,
  Modal,
  Fade,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SearchIconModule, XCircle } from '@components/SvgIcons/SvgIcons.jsx';
import SearchTabs from '@components/SearchComponents/SearchTabs.jsx';
import RecentSearch from '../SearchComponents/RecentSearch';

// import * as css from './SearchContainer.scss';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 560,
  bgcolor: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.08)',
  outline: 'none',
  minHeight: 500,
};

const SearchContainer = ({ open, handleClose }) => {
  const { organization, user, openSnackBar, globalSearch, setGlobalSearch } =
    React.useContext(AppContext);
  const [searchQuery, setSearchQuery] = React.useState('');
  const device = localStorage.getItem('device_detect');
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [SearchData, setSearchData] = React.useState({});
  const [RecentData, setRecentData] = React.useState([]);
  const navigate = useNavigate();
  const pathName = window.location.pathname;

  const debouncedForSearchQuery = useDebounce(searchQuery);

  const GlobalSearchFunction = (query) => {
    setSearchLoading(true);

    RestApi(`organizations/${organization.orgId}/searches?search=${query}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setSearchLoading(false);
        if (res && !res.error) {
          setSearchData(res?.data);
        } else {
          openSnackBar({
            message:
              Object?.values(res?.errors || {}).join() ||
              'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((e) => {
        setSearchLoading(false);
        openSnackBar({
          message:
            Object?.values(e?.errors || {}).join() || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const RecentSearchFunction = () => {
    setSearchLoading(true);

    RestApi(`organizations/${organization.orgId}/searches/history`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setSearchLoading(false);
        if (res && !res.error) {
          if (res?.data?.length > 0) {
            setRecentData(res?.data);
          } else {
            setRecentData([]);
          }
        }
      })
      .catch((e) => {
        setSearchLoading(false);
        openSnackBar({
          message:
            Object?.values(e?.errors || {}).join() || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const CreateRecentSearchFunction = (query, id) => {
    RestApi(`organizations/${organization.orgId}/searches`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        search: query,
        parent_id: id,
      },
    });
  };

  const RecentSearchDeletion = () => {
    setSearchLoading(true);

    RestApi(`organizations/${organization.orgId}/searches/delete_history`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setSearchLoading(false);
        if (res && !res.error) {
          setRecentData([]);
        }
      })
      .catch(() => {
        setSearchLoading(false);
      });
  };

  const requestBank = (v_ids, contactId) => {
    // if (!userRolesPeople?.Employees?.create_employees && click === 'tab3') {
    //   setHavePermission({
    //     open: true,
    //     back: () => {
    //       setHavePermission({ open: false });
    //     },
    //   });
    //   return;
    // }
    if (contactId) {
      RestApi(
        `organizations/${organization.orgId}/bank_approvals/send_mail/${v_ids}?contact_id=${contactId}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((res) => {
          if (res && res.error) {
            setTimeout(() => {
              openSnackBar({
                message: res?.message || 'Unknown Error Occured',
                type: MESSAGE_TYPE.ERROR,
              });
            }, 1000);
          } else if (res && !res.error) {
            setTimeout(() => {
              openSnackBar({
                message: res?.message,
                type: MESSAGE_TYPE.INFO,
              });
            }, 1000);
          } else {
            setTimeout(() => {
              openSnackBar({
                message: res?.message || 'Unknown Error Occured',
                type: MESSAGE_TYPE.ERROR,
              });
            }, 1000);
          }
        })
        .catch((res) => {
          setTimeout(() => {
            openSnackBar({
              message: res?.message || 'Unknown Error Occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }, 1000);
        });
    } else {
      openSnackBar({
        message: 'Contact Id  is not avaialble',
        type: MESSAGE_TYPE.ERROR,
      });
    }
  };

  const FetchContactsId = (v_ids) => {
    setSearchLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendors/${v_ids}/contacts?show=all`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      // eslint-disable-next-line consistent-return
      .then((res) => {
        setSearchLoading(false);
        if (res && !res.error) {
          const tempCont = res?.data?.filter((val) => val?.active);
          requestBank(v_ids, tempCont?.[0]?.id || '');
        }
        if (res && res.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        setSearchLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const CloseWithTab = () => {
    setGlobalSearch('');
    setSearchQuery('');
    handleClose();
  };

  React.useEffect(() => {
    setSearchQuery(globalSearch);
  }, [globalSearch]);

  React.useEffect(() => {
    if ((open || device === 'mobile') && debouncedForSearchQuery?.trim()) {
      GlobalSearchFunction(debouncedForSearchQuery);
    } else if (
      (open || device === 'mobile') &&
      !debouncedForSearchQuery?.trim()
    ) {
      RecentSearchFunction();
    }
  }, [debouncedForSearchQuery, open]);

  React.useEffect(() => {
    if (desktopView && pathName === '/search') {
      navigate('/dashboard');
    }
  }, [desktopView]);

  return device === 'desktop' ? (
    <Box>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
          setSearchQuery('');
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIconModule />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchQuery && (
                      <XCircle
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (searchQuery) {
                            setSearchQuery('');
                            setGlobalSearch('');
                          } else {
                            handleClose();
                          }
                        }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              autoFocus
              sx={{
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '20px 0',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': {
                    border: 'none',
                    borderBottom: '1px solid #ECECEC',
                  },
                  '&:hover fieldset': {
                    borderBottom: '1px solid #ECECEC',
                  },
                },
              }}
              focused={false}
              placeholder="Search anything"
              value={searchQuery}
              onChange={(e) => {
                setGlobalSearch(e?.target?.value);
                setSearchQuery(e?.target?.value);
              }}
            />
            {searchLoading && (
              <Box sx={{ height: '375px', display: 'flex' }}>
                <CircularProgress sx={{ color: '#F08B32', margin: 'auto' }} />
              </Box>
            )}
            {debouncedForSearchQuery?.trim() && !searchLoading && (
              <SearchTabs
                Data={SearchData}
                TabClose={CloseWithTab}
                CreateRecentSearch={(val) =>
                  CreateRecentSearchFunction(val?.name, val?.id)
                }
                FetchContactsId={FetchContactsId}
              />
            )}
            {!debouncedForSearchQuery?.trim() && !searchLoading && (
              <RecentSearch
                RecentSearchDeletion={RecentSearchDeletion}
                RecentData={RecentData}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  ) : (
    <>
      {searchLoading && (
        <Box sx={{ height: '375px', display: 'flex', width: '100%' }}>
          <CircularProgress sx={{ color: '#F08B32', margin: 'auto' }} />
        </Box>
      )}
      {debouncedForSearchQuery?.trim() && !searchLoading && (
        <SearchTabs
          Data={SearchData}
          TabClose={CloseWithTab}
          CreateRecentSearch={(val) =>
            CreateRecentSearchFunction(val?.name, val?.id)
          }
          FetchContactsId={FetchContactsId}
        />
      )}
      {!debouncedForSearchQuery?.trim() && !searchLoading && (
        <RecentSearch
          RecentSearchDeletion={RecentSearchDeletion}
          RecentData={RecentData}
        />
      )}
    </>
  );
};

export default SearchContainer;
