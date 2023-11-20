import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import SettingsCard from '@components/SettingsCard/SettingsCard';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import { invoiceSettingsCard } from '../SettingsImages';
import * as css from '../SettingsMenu.scss';

const card2 = [
  // {
  //   id: 1,
  //   lable: 'Invoice Designs',
  //   icon: invoiceSettingsCard.invoiceDesigns,
  //   route: '/settings-invoiceDesigns',
  //   width: 20,
  // },
  {
    id: 1,
    lable: 'Custom Fields',
    icon: invoiceSettingsCard.contactDetailsOnInvoice,
    route: '/settings-invoice-contactDetails',
    width: 20,
  },
  {
    id: 2,
    lable: 'Terms and Conditions',
    icon: invoiceSettingsCard.termsAndConditions,
    route: '/settings-invoice-termsAndConditions',
    width: 20,
  },
  {
    id: 3,
    lable: 'Signature',
    icon: invoiceSettingsCard.signature,
    route: '/settings-invoice-signature',
    width: 20,
  },
  {
    id: 4,
    lable: 'Other Payments',
    icon: invoiceSettingsCard.otherPaymentOptions,
    route: '/settings-otherPaymentOptions',
    width: 20,
  },
  {
    id: 5,
    lable: 'Additional Settings',
    icon: invoiceSettingsCard.additionalSettings,
    route: '/settings-invoice-additionalSettings',
    width: 20,
  },
  {
    id: 5,
    lable: 'E-Invoice Settings',
    icon: invoiceSettingsCard.additionalSettings,
    route: '/settings-e-invoice',
    width: 20,
  },
];

function InvoiceSettings() {
  const device = localStorage.getItem('device_detect');
  const { changeSubView } = useContext(AppContext);
  const navigate = Router.useNavigate();

  const { organization, logo, userPermissions } = React.useContext(AppContext);
  const [userRolesSettings, setUserRolesSettings] = React.useState({});
  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

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
      setUserRolesInvoicing({ ...userPermissions?.Invoicing });
      setUserRolesSettings({ ...userPermissions?.Settings });
    }
  }, [userPermissions]);

  const handlePageChange = (route, id) => {
    if (id === 1) {
      if (!userRolesInvoicing['Custom Fields'].view_custom_fields) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
    } else if (id === 3) {
      if (!userRolesInvoicing.Signatures.view_organization_signature) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
    } else if (id === 4) {
      if (!userRolesSettings['Razorpay Setup']?.view_razorpay_submerchant) {
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

  const CompanyInfoCard = () => {
    return (
      <div className={css.companyInfoCardContainer}>
        <div className={css.companyInfoCardWrapper}>
          <div className={css.organizationName}>
            {organization && organization.name}
          </div>
          <div className={css.spacing} />
          <div
            className={css.updateDetails}
            onClick={() => handlePageChange('/settings-BusinessDetails')}
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
        <div className={css.stack2}>
          {card2.map((c) => (
            <div
              className={css.generalStack}
              onClick={() => {
                if (c.id === 1) {
                  if (!userRolesInvoicing['Custom Fields'].view_custom_fields) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                } else if (c.id === 3) {
                  if (
                    !userRolesInvoicing.Signatures.view_organization_signature
                  ) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                } else if (c.id === 4) {
                  if (
                    !userRolesSettings['Razorpay Setup']
                      ?.view_razorpay_submerchant
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
                navigate(c.route);
              }}
            >
              <Mui.Avatar
                style={{
                  border: '1px solid #bdbdbd',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
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
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
}

export default InvoiceSettings;
