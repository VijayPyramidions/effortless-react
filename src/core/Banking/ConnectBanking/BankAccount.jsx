/* eslint-disable no-nested-ternary  */
import React from 'react';
import * as Mui from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Router from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import NoBankAccount from '@assets/NoBankAccount.svg';
import DeleteIcon from '@assets/trash-icon-red.svg';
import * as css from './BankAccount.scss';
import BankLogo from '../../../assets/WebAssets/surface1.svg';

export const BankAccount = ({ bankDetail, FetchConnectedBank }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const color = ['#FFFFFF', '#ECFBFFB2', '#FFEFE0'];
  const [DeleteId, setId] = React.useState('');
  const navigate = Router.useNavigate();
  const { organization, user, enableLoading, openSnackBar, setConnect } =
    React.useContext(AppContext);

  const Disconnect = () => {
    RestApi(
      `organizations/${organization?.orgId}/bank_users/${DeleteId}/unregister?id=${DeleteId}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setOpen(false);
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res.error) {
          setOpen(false);
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
        }
        FetchConnectedBank();
        enableLoading(false);
      })
      .catch((e) => {
        setOpen(false);
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });

        enableLoading(false);
      });
  };

  const fetchBankDetailsStatus = (id, accountnumber, amount) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/icici_bank_accounts/${id}/txns`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          if (res?.data.length > 0) {
            navigate('/banking-banklist-account', {
              state: {
                value: {
                  response: res.data,
                  data: res,
                  accName: 'ICICI Bank',
                  amt: amount,
                  accNum: accountnumber,
                  id,
                },
                key: 'connectedBankingTransactions',
              },
            });
          } else if (res?.data.length === 0) {
            openSnackBar({
              message: 'No Transactions Found',
              type: MESSAGE_TYPE.WARNING,
            });
          }
          enableLoading(false);
        } else if (res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const SyncNow = (id) => {
    RestApi(`organizations/${organization?.orgId}/bank_users/${id}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          // setOpen(false);
          if (res?.data?.length > 0) {
            FetchConnectedBank();
            openSnackBar({
              message: res?.message,
              type: MESSAGE_TYPE.INFO,
            });
          }
        } else if (res.error) {
          // setOpen(false);
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        // setOpen(false);
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });

        enableLoading(false);
      });
  };
  return (
    <>
      <Mui.Box className={css.mainBox}>
        {mobile ? (
          <Mui.Stack direction="row" justifyContent="space-between">
            <Mui.Typography sx={{ mb: mobile ? '' : 1 }}>
              ICICI Bank Account
            </Mui.Typography>
            <Mui.Button
              className={css.connect}
              onClick={() => {
                setConnect(true);
              }}
            >
              Connect Now
            </Mui.Button>
          </Mui.Stack>
        ) : (
          <Mui.Typography sx={{ mb: mobile ? '' : 1 }}>
            ICICI Bank Account
          </Mui.Typography>
        )}

        <Mui.Grid
          container
          spacing={2}
          direction={mobile ? 'row' : ''}
          flexWrap={mobile ? 'nowrap' : 'warp'}
          overflow="scroll"
        >
          {bankDetail?.connected_banking?.length > 0 &&
          bankDetail?.connected_banking
            ?.map((text) => text?.service_provider?.toLowerCase() === 'icici')
            ?.every((v) => v === true) ? (
            <>
              {bankDetail?.connected_banking?.map((text, index) => {
                return (
                  <Mui.Grid
                    item
                    lg={6}
                    md={12}
                    xs={12}
                    sx={{ marginRight: mobile ? '10px' : '' }}
                  >
                    <Card
                      id={text?.id}
                      title={text?.name}
                      amount={FormattedAmount(text?.balance)}
                      accountnumber={text?.account_number}
                      Ifsc={text?.ifsc_code}
                      color={color?.reverse()[index]}
                      DeleteId={DeleteId}
                      setId={setId}
                      Disconnect={Disconnect}
                      bankId={text?.bank_user_id}
                      setOpen={setOpen}
                      open={open}
                      status={text?.registration_status}
                      SyncNow={SyncNow}
                      fetchBankDetailsStatus={fetchBankDetailsStatus}
                    />
                  </Mui.Grid>
                );
              })}
            </>
          ) : (
            <>
              <Mui.Grid item xs={12} style={{ margin: '10px 0 0' }}>
                <Mui.Card
                  className={css.amountPaper}
                  style={{
                    borderRadius: '18px 18px 0px 0px',
                    background: 'transparent',
                    boxShadow: 'none',
                  }}
                >
                  <Mui.CardMedia component="img" image={NoBankAccount} />
                  <p className={css.noBankText}>No Bank Accounts Connected.</p>
                </Mui.Card>
              </Mui.Grid>
            </>
          )}
        </Mui.Grid>
      </Mui.Box>
      <Mui.Dialog
        open={open}
        PaperProps={{ sx: { p: 2, borderRadius: '12px', maxWidth: '300px' } }}
        maxWidth="xs"
        onClose={() => setOpen(false)}
      >
        <Mui.Stack>
          <Mui.Typography className={css.dialogtitle}>
            Disconnect Bank Account
          </Mui.Typography>
          <span className={css.headerUnderline} />
          <Mui.Typography className={css.dialogsubtitle}>
            Are you sure that you want to disconnect this Bank Account?
          </Mui.Typography>
        </Mui.Stack>
        <Mui.Stack direction="row" spacing={2} className={css.btnstack}>
          <Mui.Button className={css.outlineBtn} onClick={() => setOpen(false)}>
            no
          </Mui.Button>
          <Mui.Button className={css.containedBtn} onClick={Disconnect}>
            yes
          </Mui.Button>
        </Mui.Stack>
      </Mui.Dialog>
    </>
  );
};

export const Card = ({
  id,
  title,
  amount,
  accountnumber,
  Ifsc,
  color,
  setId,
  // Disconnect,
  bankId,
  setOpen,
  // open,
  status,
  SyncNow,
  fetchBankDetailsStatus,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Mui.Card
        elevation={0}
        className={`${!status ? css.cardBlur : ''} ${css.card}`}
        sx={{
          backgroundColor: color,
          width: mobile ? '30vh' : 'auto',
          mt: mobile ? '30px' : '',
          cursor: mobile ? '' : 'pointer',
        }}
        onClick={() => {
          fetchBankDetailsStatus(id, accountnumber, amount);
        }}
      >
        {status ? (
          <Mui.Stack direction="row" justifyContent="flex-end">
            <Mui.Typography
              className={css.disconnect}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setId(bankId);
                setOpen(true);
              }}
            >
              Disconnect
            </Mui.Typography>
          </Mui.Stack>
        ) : (
          <Mui.Stack direction="row" justifyContent="flex-end">
            <Mui.Typography
              className={`${css.disconnect} ${
                mobile ? css.syncBtn : css.syncBtnDesktop
              }`}
              onClick={() => {
                SyncNow(bankId);
                // setOpen(true);
              }}
            >
              Sync Now
            </Mui.Typography>
            <div
              className={mobile ? css.DeleteIconDiv : css.DeleteIconDivDesktop}
              // style={{display: mobile? 'inline-flex !important' : ''}}
              onClick={(e) => {
                e.stopPropagation();
                setId(bankId);
                setOpen(true);
              }}
            >
              <Mui.CardMedia
                className={css.deleteIcon}
                component="img"
                src={DeleteIcon}
                alt="Delete Icon"
              />
            </div>
          </Mui.Stack>
        )}

        <Mui.CardMedia
          className={css.logo}
          component="img"
          src={BankLogo}
          alt="Bank"
        />
        <Mui.Typography className={css.title}>{title}</Mui.Typography>
        <Mui.Typography className={css.amount}>{amount}</Mui.Typography>
        <Mui.Stack
          direction="row"
          justifyContent="space-between"
          className={css.amountHead}
        >
          <Mui.Stack>
            <Mui.Typography noWrap className={css.account}>
              A/C No
            </Mui.Typography>
            <Mui.Typography className={css.accountnumber}>
              {accountnumber}
            </Mui.Typography>
          </Mui.Stack>
          <Mui.Stack>
            <Mui.Typography noWrap className={css.ifsc}>
              IFSC
            </Mui.Typography>
            <Mui.Typography className={css.ifscnumber}>{Ifsc}</Mui.Typography>
          </Mui.Stack>
        </Mui.Stack>
      </Mui.Card>
      {/* <Mui.Dialog
        open={open}
        PaperProps={{ sx: { p: 2, borderRadius: '12px', maxWidth: '300px' } }}
        maxWidth="xs"
        onClose={() => setOpen(false)}
      >
        <Mui.Stack>
          <Mui.Typography className={css.dialogtitle}>
            Disconnect Bank Account
          </Mui.Typography>
          <span className={css.headerUnderline} />
          <Mui.Typography className={css.dialogsubtitle}>
            Are you sure that you want to disconnect this Bank Account?
          </Mui.Typography>
        </Mui.Stack>
        <Mui.Stack direction="row" spacing={2} className={css.btnstack}>
          <Mui.Button className={css.outlineBtn} onClick={() => setOpen(false)}>
            no
          </Mui.Button>
          <Mui.Button className={css.containedBtn} onClick={Disconnect}>
            yes
          </Mui.Button>
        </Mui.Stack>
      </Mui.Dialog> */}
    </>
  );
};
