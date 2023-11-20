import { Divider } from '@material-ui/core';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as Mui from '@mui/material';
import { styled } from '@material-ui/core/styles';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RightArrow from '@assets/rightArrow.svg';
import * as Router from 'react-router-dom';
import { additionalSettingsCard } from '../SettingsImages';
import LutFormSettings from './LutFormSettings';
import * as css from './InvoiceSettings.scss';

const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

function AdditionalSettings() {
  const {
    organization,
    user,
    enableLoading,
    openSnackBar,
    changeSubView,
    userPermissions,
    setEstimateName,
  } = useContext(AppContext);
  const navigate = Router.useNavigate();
  const handlePageChange = (route) => {
    changeSubView(route);
    navigate(route);
  };
  // const [cardTemp] = React.useState(card1);
  const device = localStorage.getItem('device_detect');
  const [lutSheet, setLutSheet] = React.useState({ open: false });
  const [Preference, setPreference] = React.useState('estimate');
  const [LocalState, setLocalState] = React.useState({
    view: 'save',
    value: [],
  });
  const [SalesPerson, setSalesPerson] = React.useState(false);
  const [logoToggle, setLogoToggle] = React.useState(true);
  const [computerizedSign, setComputerizedSign] = React.useState(false);

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
    }
  }, [userPermissions]);

  const PreviousLUT = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/lut_documents`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res?.error) {
          if (res?.data?.length === 0) {
            setLocalState({ type: 'save', value: [] });
          } else {
            setLocalState({ type: 'update', value: res?.data });
          }
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const UpdateLut = (mainState) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/lut_document`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        lut_number: mainState?.LUTNumber,
        document: mainState?.LUTFileId,
      },
    })
      .then((res) => {
        if (res && !res?.error) {
          openSnackBar({
            message: 'Updated Successfully',
            type: MESSAGE_TYPE.INFO,
          });
          PreviousLUT();
          setLutSheet((prev) => ({ ...prev, open: false }));
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const FetchSalesPerson = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/settings`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res?.error) {
          if (res?.message) {
            openSnackBar({
              message: res?.message || 'Unknown Error occured',
              type: MESSAGE_TYPE.ERROR,
            });
            return;
          }
          setSalesPerson(res?.sales_person_invoicing);
          setLogoToggle(res?.show_brand_name_on_invoice);
          setComputerizedSign(res?.computerized_invoice_signature);
          setEstimateName(res?.estimate_name);
          setPreference(res?.estimate_name);
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  React.useEffect(() => {
    PreviousLUT();
    FetchSalesPerson();
  }, []);

  const UpdateSalesPerson = (salesBoolean) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/settings/update_sales_person`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          sales_person_invoicing: salesBoolean,
        },
      }
    )
      .then((res) => {
        if (res && !res?.error) {
          openSnackBar({
            message: res?.message || 'Updated Successfully',
            type: res?.message ? MESSAGE_TYPE.ERROR : MESSAGE_TYPE.INFO,
          });
          FetchSalesPerson();
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const updateEstimateName = (name) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/settings`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        estimate_name: name,
      },
    })
      .then((res) => {
        if (res && !res?.error) {
          openSnackBar({
            message: res?.message || 'Updated Successfully',
            type: res?.message ? MESSAGE_TYPE.ERROR : MESSAGE_TYPE.INFO,
          });
          setEstimateName(res?.estimate_name);
          setPreference(res?.estimate_name);
        } else {
          openSnackBar({
            message:
              (res?.errors && Object.values(res?.errors).join()) ||
              'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const updateSettingData = (evtName, isActive) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/settings?${evtName}=${isActive}`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res?.error) {
          openSnackBar({
            message: res?.message || 'Updated Successfully',
            type: res?.message ? MESSAGE_TYPE.ERROR : MESSAGE_TYPE.INFO,
          });
        } else {
          openSnackBar({
            message:
              (res?.errors && Object.values(res?.errors).join()) ||
              'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        setLogoToggle(res?.show_brand_name_on_invoice);
        setComputerizedSign(res?.computerized_invoice_signature);
        enableLoading(false);
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const handleChange = (event) => {
    if (event?.target?.name === 'salesPerson') {
      UpdateSalesPerson(event?.target?.checked);
    }
    if (event.target.name === 'show_brand_name_on_invoice') {
      updateSettingData('show_brand_name_on_invoice', event.target.checked);
    }
    if (event.target.name === 'computerized_invoice_signature') {
      updateSettingData('computerized_invoice_signature', event.target.checked);
    }
  };

  const card1 = [
    {
      id: 1,
      lable: 'Invoice Approval Workflow',
      icon: additionalSettingsCard.invoiceApprovalWorkflow,
      type: 'toggle',
      isActive: true,
    },
    {
      id: 2,
      lable: 'Email Subject & Body',
      icon: additionalSettingsCard.emailSubjectBody,
      type: 'button',
      route: '/settings-invoice-EmailSubjectBody',
      isActive: true,
    },
    {
      id: 3,
      lable: 'Enter LUT Number',
      icon: additionalSettingsCard.addtionalHash,
      type: 'add',
      value: 'Add',
      isActive: true,
    },
    {
      id: 4,
      lable: 'Choose Your Preference',
      icon: additionalSettingsCard.addtionalHash,
      type: 'customSelect',
      isActive: true,
    },
    {
      id: 5,
      lable: 'Enable Salesperson Role',
      icon: additionalSettingsCard.salesPerson,
      type: 'toggle',
      isActive: SalesPerson,
      key: 'salesPerson',
      change: (e) => handleChange(e),
    },
    {
      id: 6,
      lable: 'Show Effortless logo on invoice',
      icon: additionalSettingsCard.addtionalHash,
      type: 'toggle',
      isActive: logoToggle,
      key: 'show_brand_name_on_invoice',
      change: (e) => handleChange(e),
    },
    {
      id: 7,
      lable: 'Enable Computerized Signature in Invoice',
      icon: additionalSettingsCard.addtionalHash,
      type: 'toggle',
      isActive: computerizedSign,
      key: 'computerized_invoice_signature',
      change: (e) => handleChange(e),
    },
  ];

  const CardView = ({ item, length }) => {
    return (
      <div
        className={
          item?.type === 'customSelect' &&
          device === 'mobile' &&
          css.customSelect
        }
      >
        <div className={css.ToggleCardContainer}>
          <div
            className={
              device === 'desktop' ? css.iconWrapperDesktop : css.iconWrapper
            }
          >
            <img className={css.icon} src={item.icon} alt={item.lable} />
          </div>
          {(item.type === 'toggle' && (
            <Mui.FormGroup style={{ width: '100%' }}>
              <Mui.FormControlLabel
                style={{ justifyContent: 'space-between' }}
                label={item.lable}
                labelPlacement="start"
                control={
                  <ToggleSwitch
                    checked={item?.isActive}
                    name={item?.key}
                    onChange={(e) => item?.change(e)}
                  />
                }
              />
            </Mui.FormGroup>
          )) || (
            <div
              onClick={() => {
                if (item.id === 2) {
                  if (
                    !userRolesInvoicing['Email Subject & Body']
                      ?.view_email_templates
                  ) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  handlePageChange(item.route);
                }
                if (item?.id === 3)
                  setLutSheet((prev) => ({ ...prev, open: true }));
              }}
              className={css.arrowWrapperOver}
            >
              <div className={css.lable}>{item.lable} </div>
              <div className={css.arrowWrapper}>
                {item?.type === 'button' && (
                  <img src={RightArrow} alt={item.lable} />
                )}
                {item?.type === 'add' && (
                  <div>
                    <p className={css.RightAdd}>
                      {(LocalState?.value?.length > 0 &&
                        LocalState?.value?.filter((val) => val.current_fy)[0]
                          .lut_number) ||
                        item?.value}
                    </p>
                  </div>
                )}
                {item?.type === 'customSelect' && device === 'desktop' && (
                  <div className={css.mainButton}>
                    <div
                      className={
                        Preference === 'estimate'
                          ? css.selected
                          : css.unSelected
                      }
                      onClick={() => {
                        updateEstimateName('estimate');
                      }}
                    >
                      <p>Estimate</p>
                    </div>
                    <div
                      className={
                        Preference === 'proforma'
                          ? css.selected
                          : css.unSelected
                      }
                      onClick={() => {
                        updateEstimateName('proforma');
                      }}
                    >
                      <p>Proforma</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {item?.type === 'customSelect' && device === 'mobile' && (
          <div className={css.mainButton}>
            <div
              className={
                Preference === 'estimate' ? css.selected : css.unSelected
              }
              onClick={() => {
                updateEstimateName('estimate');
              }}
            >
              <p>Estimate</p>
            </div>
            <div
              className={
                Preference === 'proforma' ? css.selected : css.unSelected
              }
              onClick={() => {
                updateEstimateName('proforma');
              }}
            >
              <p>Proforma</p>
            </div>
          </div>
        )}
        {length !== item.id && (
          <div className={css.divider}>
            <Divider />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={
          device === 'desktop'
            ? css.contactDetailsOnInvoiceContainerDesktop
            : css.contactDetailsOnInvoiceContainer
        }
      >
        <div className={css.card}>
          {card1?.map((item, ind) => {
            return (
              <div key={item.id}>
                {ind !== 0 && <CardView item={item} length={card1.length} />}
              </div>
            );
          })}
        </div>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
      <SelectBottomSheet
        open={lutSheet?.open}
        onClose={() => setLutSheet((prev) => ({ ...prev, open: false }))}
        triggerComponent={<></>}
        addNewSheet
      >
        {device === 'mobile' && <Puller />}
        <LutFormSettings
          type={LocalState?.type}
          onClose={() => setLutSheet((prev) => ({ ...prev, open: false }))}
          submitValue={(val) => UpdateLut(val)}
          LocalState={LocalState?.value}
        />
      </SelectBottomSheet>
    </>
  );
}

export default AdditionalSettings;
