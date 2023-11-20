/* @flow */
/**
 * @fileoverview  AppHeader
 */
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetBankingState } from '@action/Store/Reducers/Banking/BankingState';
import AppContext from '@root/AppContext.jsx';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import topIcon from '@assets/WebAssets/topIcon.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InputAdornment from '@mui/material/InputAdornment';
import NotificationContainer from '@components/AppHeader/NotificationContainer.jsx';
import SearchContainer from '@components/AppHeader/SearchContainer.jsx';
import * as css from '@core/DashboardView/DashboardViewContainer.scss';
import {
  SearchIcon,
  NotificationIcon,
  BurgerMenuIcon,
  SuperIcon,
  LogoutWebNew,
  LockIcon,
  ProfileIcon,
  NewOrgIcon,
  SearchIconLight,
} from '@components/SvgIcons/SvgIcons.jsx';
// import superWebIcon from '../../assets/superWebIcon.svg';

const AppHeader = (props) => {
  const {
    toggleSidePanel,
    // notificationList,
    // changeSubView,
    user,
    currentUserInfo,
    setSessionToken,
    setUserInfo,
    addOrganization,
    organization,
    logo,
    // getCurrentUser,
    setGlobalSearch,
    NotificationOrganization,
    setLogo,
    setCurrentUserInfo,
  } = useContext(AppContext);

  const dispatch = useDispatch();
  const { pathname } = Router.useLocation();

  const { hideSearchIcon, hideNotificationIcon } = props;
  const [openNotification, setOpenNotification] = useState(false);
  const themes = Mui.useTheme();
  const desktopView = Mui.useMediaQuery(themes.breakpoints.up('sm'));
  const device = localStorage.getItem('device_detect');
  const userNameFont = user?.userName;
  const symbol = userNameFont?.slice(0, 1);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [anchorElForOrganization, setAnchorElForOrganization] =
    React.useState(null);

  const navigate = Router.useNavigate();
  const handleClick = (event, component) => {
    if (component === 'calendar') {
      // setAnchorElCalendar(event.currentTarget);
    } else {
      setAnchorEl(true);
    }
  };
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openSearch, setOpenSearch] = React.useState(false);

  // const setAppHeader = () => {
  //   if (device === 'mobile') {
  //     if (document.querySelector('.DashboardViewContainer_appHeader')) {
  //       document.querySelector(
  //         '.DashboardViewContainer_appHeader',
  //       ).style.display = 'flex';
  //     }

  //     if (
  //       document.querySelector(
  //         '.DashboardViewContainer_dashboardBodyContainerhideNavBar',
  //       )
  //     ) {
  //       document.querySelector(
  //         '.DashboardViewContainer_dashboardBodyContainerhideNavBar',
  //       ).style.background = 'none';
  //       document.querySelector(
  //         '.DashboardViewContainer_dashboardBodyContainerhideNavBar',
  //       ).style.height = 'calc(100% - 115px)';
  //     }

  //     if (
  //       document.querySelector('.DashboardViewContainer_pageTitleContainer')
  //     ) {
  //       document.querySelector(
  //         '.DashboardViewContainer_pageTitleContainer',
  //       ).style.background = 'none';
  //     }
  //     if (
  //       document.querySelector('.DashboardViewContainer_dashboardContainer')
  //     ) {
  //       document.querySelector(
  //         '.DashboardViewContainer_dashboardContainer',
  //       ).style.background = 'none';
  //     }
  //     if (
  //       document.querySelector(
  //         '.DashboardViewContainer_dashboardBodyContainerhideNavBar',
  //       )
  //     ) {
  //       document.querySelector(
  //         '.DashboardViewContainer_dashboardBodyContainerhideNavBar',
  //       ).style.background = 'var(--colorGreyBg)';
  //     }
  //   }
  // };

  // useEffect(() => {
  //   setAppHeader();
  // }, [device]);
  return (
    <div
      className={
        device === 'mobile'
          ? `${css.appHeader}`
          : `${css.appHeader} ${css.appHeaderUpdate}`
      }
      style={{
        height: device === 'desktop' ? '80px' : 'auto',
        padding: device === 'desktop' ? '0px' : '15px 15px 0px',
        display:
          (pathname === '/notification' ||
            pathname === '/banking-categorization') &&
          device !== 'desktop' &&
          'none',
      }}
    >
      {desktopView === false ? (
        <>
          <div className={css.left}>
            <BurgerMenuIcon className={css.icons} onClick={toggleSidePanel} />
          </div>
          <div className={css.right}>
            {!hideSearchIcon && (
              <div
                onClick={() => {
                  // setAppHeader();
                  navigate('/search');
                }}
              >
                <SearchIcon className={`${css.icons} ${css.searchIcon}`} />
              </div>
            )}

            {!hideNotificationIcon && (
              <div
                className={css.notifyContainer}
                onClick={() => {
                  // setAppHeader();
                  navigate('/notification');
                }}
              >
                <NotificationIcon className={css.icons} />
              </div>
            )}
          </div>
          <NotificationContainer
            open={openNotification}
            handleClose={() => setOpenNotification(false)}
          />
          <div
            style={{ paddingLeft: '0.5rem' }}
            onClick={() => {
              // setAppHeader();
              navigate('/support');
            }}
          >
            <SuperIcon style={{ fontSize: '36px' }} />
          </div>
        </>
      ) : (
        <div className={css.appHeaderMain}>
          <div
            className={css.organizationCont}
            onClick={(e) => setAnchorElForOrganization(e?.currentTarget)}
          >
            <Mui.Avatar
              className={css.orgAvatar}
              src={
                logo ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${organization?.shortName}&chars=2`
              }
            />
            <p className={css.orgName}>{organization?.shortName}</p>
            <KeyboardArrowDownIcon className={css.arrowIcon} />
          </div>
          <div
            className={css.organizationContSearch}
            onClick={() => setOpenSearch(true)}
          >
            <SearchIconLight className={css.icon} />
            <p className={css.name}>Search Anything</p>
          </div>
          <Mui.Avatar
            src={topIcon}
            onClick={() => setOpenNotification(true)}
            className={css.notifyAvatar}
          />
          <Mui.Avatar
            className={css.profileAvatar}
            onClick={(e) => handleClick(e, 'organixation')}
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${symbol}&chars=1`}
          />
        </div>
      )}
      <Mui.Dialog
        open={anchorEl}
        onClose={() => setAnchorEl(false)}
        PaperProps={{
          style: {
            position: 'absolute',
            top: '80px',
            margin: 0,
            right: '24px',
            borderRadius: 10,
          },
        }}
      >
        <div style={{ padding: '15px', width: '175px' }}>
          <div
            className={css.appBarAccountSymbol}
            width="100%"
            onClick={() => setAnchorEl(false)}
          >
            <div>
              <Mui.Avatar
                className={css.avatarForPopover}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${symbol}&chars=1`}
              />
            </div>
            <div className={css.itemsEmail}>
              {currentUserInfo && currentUserInfo.email}
            </div>
          </div>
          {[
            {
              name: 'My Profile',
              icon: <ProfileIcon />,
              click: () => {
                setAnchorEl(false);
              },
            },
            {
              name: 'Change Password',
              icon: <LockIcon />,
              click: () => {
                setAnchorEl(false);
              },
            },
            {
              name: 'Logout',
              icon: <LogoutWebNew />,
              click: () => {
                setUserInfo({ userInfo: null });
                setSessionToken({ activeToken: null });
                setCurrentUserInfo({ currentUserInfo: {} });
                localStorage.removeItem('user_info');
                localStorage.removeItem('current_user_info');
                localStorage.removeItem('session_token');
                localStorage.removeItem('selected_organization');
                localStorage.removeItem('PageWithParams');
                navigate('/');
              },
            },
          ]?.map((val) => (
            <div className={css.contList} onClick={() => val?.click()}>
              {val?.icon}
              <p>{val?.name}</p>
            </div>
          ))}
        </div>
      </Mui.Dialog>

      <Mui.Dialog
        open={anchorElForOrganization}
        onClose={() => setAnchorElForOrganization(false)}
        PaperProps={{
          style: {
            position: 'absolute',
            top: '80px',
            margin: 0,
            right: '430px',
            borderRadius: 8,
          },
        }}
      >
        <div className={css.companyList}>
          <div>
            <Mui.TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIconLight />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '16px 0',
                  fontFamily: 'Inter !important',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: '#7E7C7C',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': {
                    border: 'none',
                    borderBottom: '1px solid #c4c4c4',
                  },
                  '&:hover fieldset': {
                    borderBottom: '1px solid #c4c4c4',
                  },
                },
              }}
              focused={false}
              placeholder="Search a Company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
            />
          </div>

          <div
            className={css.addNew}
            onClick={() => {
              setAnchorEl(false);
              setAnchorElForOrganization(null);
              navigate('/add-new-organization');
            }}
          >
            <NewOrgIcon />
            <p>Add New Company</p>
          </div>

          <div className={css.organizationList}>
            {user &&
              user?.userInfo?.data
                ?.filter((ele) =>
                  ele?.name
                    ?.toLocaleLowerCase()
                    ?.includes(searchQuery?.toLocaleLowerCase()),
                )
                ?.map((val) => (
                  <div
                    className={
                      organization.orgId === val?.id
                        ? `${css.organizationListInner} ${css.selectedOrg}`
                        : `${css.organizationListInner}`
                    }
                    key={`index${val.id}`}
                    onClick={() => {
                      if (organization.orgId !== val?.id) {
                        const orgId = val?.id || '';
                        const orgName = val?.name || '';
                        const shortName = val?.short_name || '';
                        setLogo(val?.logo);
                        localStorage.setItem(
                          'selected_organization',
                          JSON.stringify({
                            orgId,
                            orgName,
                            shortName,
                          }),
                        );
                        addOrganization({
                          orgId,
                          orgName,
                          shortName,
                        });
                        NotificationOrganization(val);
                        setAnchorElForOrganization(null);
                        setAnchorEl(false);
                        navigate('/dashboard');
                        dispatch(resetBankingState());
                      }
                    }}
                  >
                    {val?.logo ? (
                      <Mui.Avatar className={css.orgAvatar} src={val?.logo} />
                    ) : (
                      <Mui.Avatar
                        className={css.orgAvatar}
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${val?.name}&chars=2`}
                      />
                    )}
                    <p>{val?.name}</p>
                  </div>
                ))}
            {user &&
              user?.userInfo?.data?.filter((ele) =>
                ele?.name
                  ?.toLocaleLowerCase()
                  ?.includes(searchQuery?.toLocaleLowerCase()),
              )?.length === 0 && (
                <div
                  className={css.organizationListInner}
                  style={{ cursor: 'default' }}
                >
                  {' '}
                  <p>Not in list</p>{' '}
                </div>
              )}
          </div>
        </div>
      </Mui.Dialog>
      {openNotification && (
        <NotificationContainer
          open={openNotification}
          handleClose={() => setOpenNotification(false)}
        />
      )}
      {openSearch && (
        <SearchContainer
          open={openSearch}
          handleClose={() => {
            setOpenSearch(false);
            setGlobalSearch('');
          }}
        />
      )}
    </div>
  );
};
export default AppHeader;
