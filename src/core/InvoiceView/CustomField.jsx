/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */

import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Mui from '@mui/material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import { styled } from '@material-ui/core/styles';
import * as css from './PaymentTermCss.scss';

const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const CustomField = ({
  selectCustomer,
  callFunction,
  customFieldPermission,
}) => {
  const { invoiceCustomFiled } = useSelector((value) => value.Invoice);
  const [havePermission, setHavePermission] = React.useState({ open: false });
  const [drawer, setDrawer] = React.useState({
    customField: false,
    exapndCustom: false,
  });
  const device = localStorage.getItem('device_detect');
  const [customObject, setCustomObject] = React.useState();
  const [userObject, setUserObject] = React.useState({});

  React.useEffect(() => {
    setCustomObject(
      invoiceCustomFiled?.data?.filter((ele) => ele.active === true),
    );
  }, [invoiceCustomFiled]);

  // React.useEffect(() => {
  //   if (selectCustomer?.custom_data) {
  //     dispatch(GetInvoiceCustomFieldsState());
  //   }
  //   setUserObject(selectCustomer?.custom_data);
  // }, [selectCustomer?.custom_data]);

  React.useEffect(() => {
    setUserObject(selectCustomer?.custom_data);
  }, [selectCustomer?.custom_data]);

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  return (
    <>
      <div
        className={css.mainDivCustom}
        onClick={() => {
          if (!customFieldPermission?.view_custom_fields) {
            setHavePermission({
              open: true,
              back: () => {
                setHavePermission({ open: false });
              },
            });
            return;
          }
          setDrawer((prev) => ({
            ...prev,
            exapndCustom: !drawer.exapndCustom,
          }));
        }}
      >
        <p className={css.custom}>Custom Fields</p>
        <ExpandMoreIcon
          sx={{
            transition: '.5s',
            transform: drawer.exapndCustom
              ? 'rotate(180deg)'
              : 'rotate(360deg)',
          }}
        />
      </div>
      {drawer.exapndCustom && (
        <div>
          {customObject?.map((val) => (
            <div className={css.createCustom}>
              <p className={css.createCustomPTag}>{val.name}</p>
              <input
                type="text"
                name={val.field_name}
                value={
                  (userObject &&
                    Object.keys(userObject).length !== 0 &&
                    Object.entries(userObject)?.filter(
                      ([key]) => key === val.field_name,
                    )[0][1]) ||
                  ''
                }
                placeholder={
                  (userObject &&
                    Object.keys(userObject).length !== 0 &&
                    Object.entries(userObject)?.filter(
                      ([key]) => key === val.field_name,
                    )[0][1]) ||
                  '-'
                }
                onChange={(event) => {
                  event.persist();
                  if (!customFieldPermission?.edit_custom_fields) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  setUserObject((prev) => ({
                    ...prev,
                    [event?.target?.name]: event?.target?.value,
                  }));
                }}
                className={css.createCustomInput}
              />
            </div>
          ))}

          {customObject?.length > 0 && (
            <div
              style={{
                margin: '25px 0 15px 0',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Mui.Button
                variant="contained"
                className={css.primary}
                style={{ padding: 15, textTransform: 'initial' }}
                onClick={() => {
                  if (!customFieldPermission?.edit_custom_fields) {
                    setHavePermission({
                      open: true,
                      back: () => {
                        setHavePermission({ open: false });
                      },
                    });
                    return;
                  }
                  callFunction({ custom_data: userObject });
                }}
              >
                Confirm Custom Fields
              </Mui.Button>
            </div>
          )}
          {customObject?.length === 0 && (
            <p
              style={{
                color: '#e0513e',
                fontWeight: '700',
                margin: '0px 25px 25px 25px',
              }}
            >
              No Custom Field to show
            </p>
          )}
        </div>
      )}
      <SelectBottomSheet
        name="customField"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={drawer.customField}
        onTrigger={onTriggerDrawer}
        onClose={handleBottomSheet}
        // maxHeight="45vh"
        addNewSheet
      >
        <>
          {device === 'mobile' && <Puller />}
          <div style={{ padding: '15px' }}>
            <div style={{ padding: '5px 0' }}>
              <p className={css.valueHeader}>Custom Fields</p>
            </div>
          </div>
        </>
      </SelectBottomSheet>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default memo(CustomField);
