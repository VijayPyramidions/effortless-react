import * as Mui from '@mui/material';
// import * as MuiIcons from '@mui/icons-material';
import * as React from 'react';
import Input from '@components/Input/Input.jsx';
// import { makeStyles } from '@material-ui/core';
// import * as themes from '@root/theme.scss';
// import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import * as css from '@components/Invoice/InvoiceCurrency.scss';

// const useStyles = makeStyles(() => ({
//   root: {
//     background: themes.colorInputBG,
//     // border: '0.7px solid',
//     borderColor: themes.colorInputBorder,
//     borderRadius: '8px',
//     margin: '0px !important',
//     '& .MuiInputLabel-root': {
//       margin: '0px',
//       color: `${themes.colorInputLabel} !important`,
//     },
//     '& .MuiInput-root': {
//       marginTop: '24px',
//     },
//     '& .MuiInput-multiline': {
//       paddingTop: '10px',
//     },
//     '& .MuiSelect-icon': {
//       color: `${themes.colorInputLabel} !important`,
//     },
//     '& .MuiSelect-select': {
//       borderColor: themes.colorInputBorder,
//     },
//     '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
//       marginTop: '-10px',
//     },
//   },
// }));

export const PeopleUser = ({
  showValue,
  handleBottomSheet,
  type,
  editClick,
}) => {
  const { organization, enableLoading, user } = React.useContext(AppContext);
  const [localState, setLocalState] = React.useState({
    name: '-',
    // type: '',
    gstin: '-',
    address: '-',
    contactName: '-',
    contactPhone: '-',
    contactEmail: '-',
    contactId: '',
    bankName: '-',
    accNumber: '-',
    ifsc: '-',
  });
  const [contact, setContacts] = React.useState([]);

  //   const device = localStorage.getItem('device_detect');

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[a-zA-Z0-9\b]+$/.test(key))) {
       event.preventDefault();
    }
  };

  const fetchAllContacts = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/${type}s/${showValue?.id}/contacts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          // const tempCont = res?.data?.filter((val) => val?.active);
          const tempContact = res?.data?.reverse();
          setContacts(tempContact);
          if (tempContact?.length > 0) {
            setLocalState((prev) => ({
              ...prev,
              contactName: tempContact?.[0]?.name,
              contactPhone: tempContact?.[0]?.mobile_number,
              contactEmail: tempContact?.[0]?.email,
              contactId: tempContact?.[0]?.id,
            }));
          }
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const fetchBankDetails = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/${type}s/${showValue?.id}/bank_details`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setLocalState((prev) => ({
            ...prev,
            bankName: res?.data?.[0]?.account_holder_name,
            ifsc: res?.data?.[0]?.bank_ifsc_code,
            accNumber: res?.data?.[0]?.bank_account_number,
          }));
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const fetchAllAddress = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/${type}s/${showValue?.id}/locations`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          // const tempAddr = res?.data?.filter((val) => val?.active);
          const addr = res?.data?.[0]?.address_line2
            ? `${res?.data?.[0]?.address_line1}, ${res?.data?.[0]?.address_line2}, ${res?.data?.[0]?.city}, ${res?.data?.[0]?.state}, ${res?.data?.[0]?.country}, ${res?.data?.[0]?.pincode}`
            : `${res?.data?.[0]?.address_line1}, ${res?.data?.[0]?.city}, ${res?.data?.[0]?.state}, ${res?.data?.[0]?.country}, ${res?.data?.[0]?.pincode}`;
          if (res?.data?.length > 0) {
            setLocalState((prev) => ({
              ...prev,
              gstin: res?.data?.[0]?.gstin || '-',
              address: res?.data?.[0] ? addr : '-',
            }));
          }
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useState(() => {
    setLocalState((prev) => ({
      ...prev,
      name: showValue?.name,
      // gstin: temp?.gstin || '-',
      // address: temp ? addr : '-',
    }));
    fetchAllContacts();
    fetchAllAddress();
    if (type === 'vendor' && showValue?.bank_detail) {
      fetchBankDetails();
    }
    // fetchAllAddress();
  }, [showValue]);

  return (
    <>
      <Mui.Box sx={{ p: 4 }}>
        <Mui.Grid container spacing={3}>
          <Mui.Grid item xs={12}>
            <Mui.Typography
              className={css.head}
              sx={{ textTransform: 'capitalize' }}
            >
              {type} Details
            </Mui.Typography>
          </Mui.Grid>

          <Mui.Grid item xs={12}>
            <Input
              name="name"
              label={type === 'vendor' ? 'Vendor Name' : 'Customer Name'}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={localState?.name}
              required
              disabled
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Input
              name="gstin"
              label="GSTIN"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={localState?.gstin}
              required
              disabled
            />
          </Mui.Grid>

          <Mui.Grid item xs={12}>
            <Input
              name="address"
              label="Address"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={localState?.address}
              multiline
              rows={5}
              required
              disabled
            />
          </Mui.Grid>

          {type === 'vendor' && (
            <>
              <Mui.Grid item xs={12}>
                <hr style={{ border: '1px solid', width: '90%' }} />
              </Mui.Grid>

              <Mui.Grid item xs={12}>
                <Mui.Typography className={css.head}>
                  Bank Details
                </Mui.Typography>
              </Mui.Grid>

              <Mui.Grid item xs={12}>
                <Input
                  name="bankName"
                  label="Account Holder’s Name"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  value={localState?.bankName}
                  required
                  disabled
                />
              </Mui.Grid>
              <Mui.Grid item xs={12}>
                <Input
                  name="accNumber"
                  label="Account N0."
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  value={localState?.accNumber}
                  required
                  disabled
                />
              </Mui.Grid>
              <Mui.Grid item xs={12}>
                <Input
                  name="ifsc"
                  label="IFSC Code"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  value={localState?.ifsc}
                  required
                  disabled
                  onKeyPress={handleIfscKeyPress}
                />
              </Mui.Grid>
            </>
          )}

          <Mui.Grid item xs={12}>
            <hr style={{ border: '1px solid', width: '90%' }} />
          </Mui.Grid>

          <Mui.Grid item xs={12}>
            <Mui.Typography className={css.head}>
              Contact Details
            </Mui.Typography>
          </Mui.Grid>

          <Mui.Grid item xs={12}>
            <Mui.Stack
              sx={{ gap: '10px', overflow: 'overlay' }}
              direction="row"
            >
              {contact?.map((val) => (
                <Mui.Avatar
                  className={css.avatar}
                  sx={{
                    border:
                      val?.id === localState?.contactId
                        ? '2px solid #f08b32'
                        : '2px solid #fff',
                  }}
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${val?.name}&chars=2`}
                  onClick={() => {
                    setLocalState((prev) => ({
                      ...prev,
                      contactName: val?.name,
                      contactPhone: val?.mobile_number,
                      contactEmail: val?.email,
                      contactId: val?.id,
                    }));
                  }}
                />
              ))}
            </Mui.Stack>
          </Mui.Grid>

          <Mui.Grid item xs={12}>
            <Input
              name="contactName"
              label="Contact Name"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={localState?.contactName}
              required
              disabled
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Input
              name="contactPhone"
              label="Contact Number."
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={localState?.contactPhone}
              required
              disabled
            />
          </Mui.Grid>
          <Mui.Grid item xs={12}>
            <Input
              name="contactEmail"
              label="Contact Email"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={localState?.contactEmail}
              required
              disabled
            />
          </Mui.Grid>

          <Mui.Grid item xs={12}>
            <Mui.Stack direction="row" justifyContent="space-between">
              <Mui.Button
                className={css.btnOutlinePeople}
                onClick={() => {
                  handleBottomSheet();
                }}
              >
                Back
              </Mui.Button>
              <Mui.Button
                className={css.btnContainPeople}
                onClick={() => {
                  editClick();
                }}
              >
                Edit {type} Details
              </Mui.Button>
            </Mui.Stack>
          </Mui.Grid>
        </Mui.Grid>
      </Mui.Box>
    </>
  );
};
