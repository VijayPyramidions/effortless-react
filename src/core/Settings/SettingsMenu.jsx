import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import SettingsCard from '@components/SettingsCard/SettingsCard';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
// import Logo from '@assets/logo.svg';
import * as Router from 'react-router-dom';
// import { styled } from '@mui/material/styles';
import * as Mui from '@mui/material';
import { settingsCard1 } from './SettingsImages';
import * as css from './SettingsMenu.scss';
// import settingsIcon from '../../assets/settingsIcon.svg';

// const Avatar = styled(Mui.Avatar)(() => ({
//   '& .MuiAvatar-root': {
//     backgroundColor: 'white',
//   },
// }));

// const card3 = [
//   {
//     id: 1,
//     lable: 'Tutorials ',
//     icon: settingsCard2.tutorials,
//     route: 'tutorials',
//     upcoming: true,
//   },
//   {
//     id: 2,
//     lable: 'About',
//     icon: settingsCard2.about,
//     route: 'about',
//     upcoming: true,
//   },
//   {
//     id: 3,
//     lable: 'Give us a Rating',
//     icon: settingsCard2.giveUsRating,
//     route: 'giveUsRating',
//     upcoming: true,
//   },
//   {
//     id: 4,
//     lable: 'Contact us',
//     icon: settingsCard2.contactUs,
//     route: 'contactUs',
//     upcoming: true,
//   },
// ];

function Settings() {
  const device = localStorage.getItem('device_detect');
  const {
    changeSubView,
    currentUserInfo,
    logo,
    organization,
    userPermissions,
  } = useContext(AppContext);
  const navigate = Router.useNavigate();

  const [userRolesSettings, setUserRolesSettings] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  const card2 =
    currentUserInfo?.role === 'Founder'
      ? [
          {
            id: 1,
            lable: 'Invoice Settings',
            icon: settingsCard1.invoiceSettings,
            route: '/settings-invoiceSettings',
          },
          {
            id: 2,
            lable: 'Account Settings',
            icon: settingsCard1.accountSettings,
            route: '/settings-accountSettings',
          },
          // {
          //   id: 3,
          //   lable: 'Team Settings',
          //   icon: settingsCard1.teamSettings,
          //   route: '/settings-teamSettings',
          // },
          {
            id: 3,
            lable: 'Reminder Settings',
            icon: settingsCard1.reminderSettings,
            route: '/settings-reminderSettings',
          },
          {
            id: 4,
            lable: 'Receivables Settings',
            icon: settingsCard1.invoiceSettings,
            route: '/settings-receivables',
          },
          {
            id: 4,
            lable: 'Expenses Settings',
            icon: settingsCard1.expenseSetting,
            route: '/settings-ExpenseSettings',
          },
          {
            id: 5,
            lable: 'Reimbursements',
            width: 20,
            icon: settingsCard1.invoiceSettings,
            route: '/settings-reimbursement-policy',
          },
        ]
      : [
          {
            id: 1,
            lable: 'Invoice Settings',
            icon: settingsCard1.invoiceSettings,
            route: '/settings-invoiceSettings',
          },
          {
            id: 2,
            lable: 'Account Settings',
            icon: settingsCard1.accountSettings,
            route: '/settings-accountSettings',
          },
          // {
          //   id: 3,
          //   lable: 'Team Settings',
          //   icon: settingsCard1.teamSettings,
          //   route: '/settings-teamSettings',
          // },
          {
            id: 3,
            lable: 'Reminder Settings',
            icon: settingsCard1.reminderSettings,
            route: '/settings-reminderSettings',
          },
          {
            id: 4,
            lable: 'Receivables Settings',
            icon: settingsCard1.invoiceSettings,
            route: '/settings-receivables',
          },
          {
            id: 4,
            lable: 'Expenses Settings',
            icon: settingsCard1.expenseSetting,
            route: '/settings-ExpenseSettings',
          },
          // {
          //   id: 5,
          //   lable: 'Reimbursements',
          //   width: 20,
          //   icon: settingsCard1.invoiceSettings,
          //   route: '/settings-reimbursement-policy',
          // },
        ];

  const cardMain =
    currentUserInfo?.role === 'Founder'
      ? [
          {
            id: 1,
            lable: 'Invoice Settings',
            icon: settingsCard1.invoiceSettings,
            width: 20,
            route: '/settings-invoiceSettings',
          },
          {
            id: 2,
            lable: 'Expenses Settings',
            width: 20,
            icon: settingsCard1.expenseSetting,
            route: '/settings-ExpenseSettings',
          },
          {
            id: 7,
            lable: 'Account Settings',
            width: 20,
            icon: settingsCard1.accountSettings,
            route: '/settings-accountSettings',
          },
          {
            id: 3,
            lable: 'Team Settings',
            width: 20,
            icon: settingsCard1.teamSettings,
            route: '/settings-teamSettings',
          },
          {
            id: 4,
            lable: 'Reminder Settings',
            width: 20,
            icon: settingsCard1.reminderSettings,
            route: '/settings-reminderSettings',
          },
          {
            id: 5,
            lable: 'Activity Logs',
            width: 20,
            icon: settingsCard1.accountSettings,
            route: '/settings-activity',
          },
          {
            id: 6,
            lable: 'Receivables Settings',
            width: 20,
            icon: settingsCard1.invoiceSettings,
            route: '/settings-receivables',
          },
          {
            id: 7,
            lable: 'Reimbursements',
            width: 20,
            icon: settingsCard1.invoiceSettings,
            route: '/settings-reimbursement-policy',
          },
          // {
          //   id: 6,
          //   lable: 'About',
          //   width: 20,
          //   icon: settingsCard2.about,
          //   route: 'about',
          // },
          // {
          //   id: 7,
          //   lable: 'Give us a Rating',
          //   width: 20,
          //   icon: settingsCard2.giveUsRating,
          //   route: 'giveUsRating',
          // },
          // {
          //   id: 8,
          //   lable: 'Contact us',
          //   width: 20,
          //   icon: settingsCard2.contactUs,
          //   route: 'contactUs',
          // },
        ]
      : [
          {
            id: 1,
            lable: 'Invoice Settings',
            icon: settingsCard1.invoiceSettings,
            width: 20,
            route: '/settings-invoiceSettings',
          },
          {
            id: 2,
            lable: 'Expenses Settings',
            width: 20,
            icon: settingsCard1.expenseSetting,
            route: '/settings-ExpenseSettings',
          },
          {
            id: 7,
            lable: 'Account Settings',
            width: 20,
            icon: settingsCard1.accountSettings,
            route: '/settings-accountSettings',
          },
          {
            id: 3,
            lable: 'Team Settings',
            width: 20,
            icon: settingsCard1.teamSettings,
            route: '/settings-teamSettings',
          },
          {
            id: 4,
            lable: 'Reminder Settings',
            width: 20,
            icon: settingsCard1.reminderSettings,
            route: '/settings-reminderSettings',
          },
          {
            id: 5,
            lable: 'Activity Logs',
            width: 20,
            icon: settingsCard1.accountSettings,
            route: '/settings-activity',
          },
          {
            id: 6,
            lable: 'Receivables Settings',
            width: 20,
            icon: settingsCard1.invoiceSettings,
            route: '/settings-receivables',
          },
          // {
          //   id: 7,
          //   lable: 'Reimbursements',
          //   width: 20,
          //   icon: settingsCard1.invoiceSettings,
          //   route: '/settings-reimbursement-policy',
          // },
          // {
          //   id: 6,
          //   lable: 'About',
          //   width: 20,
          //   icon: settingsCard2.about,
          //   route: 'about',
          // },
          // {
          //   id: 7,
          //   lable: 'Give us a Rating',
          //   width: 20,
          //   icon: settingsCard2.giveUsRating,
          //   route: 'giveUsRating',
          // },
          // {
          //   id: 8,
          //   lable: 'Contact us',
          //   width: 20,
          //   icon: settingsCard2.contactUs,
          //   route: 'contactUs',
          // },
        ];

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Settings || {})?.length > 0) {
      if (!userPermissions?.Settings?.Settings) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRolesSettings({ ...userPermissions?.Settings });
    }
  }, [userPermissions]);

  const handlePageChange = (route, id) => {
    if (id === 2) {
      if (!userRolesSettings['Manage Account Settings'].view_user_profile) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
    } else if (id === 5) {
      if (
        !userRolesSettings['Reimbursement Policy'].view_reimbursement_policy
      ) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
    }
    changeSubView(route);
    navigate(route);
  };
  const [upcomingDia, setUpcomingDia] = React.useState(false);
  const CompanyInfoCard = () => {
    return (
      <div className={css.companyInfoCardContainer}>
        <div className={css.companyInfoCardWrapper}>
          <div className={css.organizationName}>
            {organization && organization.name}
          </div>
          <div className={css.spacing} />
          <div
            onClick={() => {
              if (!userRolesSettings['Company Details'].view_company_details) {
                setHavePermission({
                  open: true,
                  back: () => {
                    setHavePermission({ open: false });
                  },
                });
                return;
              }
              handlePageChange('/settings-BusinessDetails');
            }}
            className={css.updateDetails}
          >
            Update Details
          </div>
        </div>
        {/* <div className={css.forLogoCont}> */}
        <Mui.Avatar
          sx={{
            borderRadius: device === 'desktop' ? 0 : '50%',
            width: '60px',
            height: '60px',
            // width: logo ? '100%' : 'auto',
            // height: logo ? 'auto' : '100%',
            '& .MuiAvatar-img': {
              width: logo ? '100%' : '100%',
              objectFit: 'contain',
            },
          }}
          src={
            logo ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${organization?.name}&chars=2`
          }
        />
        {/* </div> */}
      </div>
    );
  };

  return device === 'desktop' ? (
    <>
      <div className={css.settingsContainerDesktop}>
        <div className={css.stack1}>
          <div className={css.profileStack}>
            <Mui.Avatar
              sx={{
                borderRadius: logo ? 0 : '50%',
                width: logo ? 'auto' : 'auto',
                height: '50%',
                '& .MuiAvatar-img': {
                  width: logo ? 'auto' : '100%',
                },
              }}
              src={
                logo ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${organization?.name}&chars=2`
              }
            />
            <div className={css.profileStackH1}>{organization?.name}</div>
            <div
              className={css.profileStackH2stack}
              onClick={() => {
                if (
                  !userRolesSettings['Company Details'].view_company_details
                ) {
                  setHavePermission({
                    open: true,
                    back: () => {
                      setHavePermission({ open: false });
                    },
                  });
                  return;
                }
                navigate('/settings-BusinessDetails');
              }}
            >
              <div className={css.profileStackH2}>Edit Profile</div>
            </div>
          </div>
        </div>
        <div className={css.general}>General settings</div>
        <div className={css.stack2}>
          {cardMain.map((c) => (
            <div
              className={css.generalStack}
              onClick={() => {
                if (c.id === 2) {
                  if (
                    !userRolesSettings['Manage Account Settings']
                      .view_user_profile
                  ) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  navigate(c.route);
                } else if (c.id === 3) {
                  if (!userRolesSettings['Team Settings'].view_team_settings) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  navigate(c.route);
                } else if (c.id === 7) {
                  if (
                    !userRolesSettings['Reimbursement Policy']
                      .view_reimbursement_policy
                  ) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  navigate(c.route);
                } else {
                  navigate(c.route);
                }
              }}
            >
              <Mui.Avatar
                style={{
                  border: '1px solid #bdbdbd',
                  backgroundColor: 'white',
                }}
              >
                <img
                  src={c.icon}
                  alt="settings"
                  className={css.profileStackimg}
                  style={{ width: c.width }}
                />
              </Mui.Avatar>
              <div className={css.generalStackText}>{c.lable}</div>
            </div>
          ))}
        </div>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  ) : (
    <>
      <div className={css.settingsContainer}>
        <div className={css.cardContainer}>
          <CompanyInfoCard />
        </div>
        <div className={css.spacing} />
        <div className={css.cardContainer}>
          <div className={css.cardTitle}>General</div>
          {card2.map((item) => {
            return (
              <div key={item.id}>
                <SettingsCard
                  length={card2.length}
                  id={item.id}
                  icon={item.icon}
                  lable={item.lable}
                  route={item.route}
                  handlePageChange={handlePageChange}
                />
              </div>
            );
          })}
        </div>
        <div className={css.spacing} />
        {/* <div className={css.cardContainer}>
        {card3.map((item) => {
          return (
            <div key={item.id}>
              <SettingsCard
                length={card3.length}
                id={item.id}
                icon={item.icon}
                lable={item.lable}
                route={item.route}
                upcoming={item.upcoming}
                setUpcomingDia={setUpcomingDia}
                handlePageChange={handlePageChange}
              />
            </div>
          );
        })}
      </div> */}
        <div className={css.spacing} />
        <Mui.Dialog
          open={upcomingDia}
          onClose={() => setUpcomingDia(false)}
          sx={{ borderRadius: '40px !important' }}
        >
          <Mui.Stack style={{ padding: '1rem' }}>
            <Mui.Typography variant="h6">Whoa!</Mui.Typography>
            <Mui.Typography>This feature is coming soon!</Mui.Typography>
          </Mui.Stack>
        </Mui.Dialog>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
}

export default Settings;
