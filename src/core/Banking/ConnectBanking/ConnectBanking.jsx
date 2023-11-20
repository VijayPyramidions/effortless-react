import React from 'react';
import * as Mui from '@mui/material';
import amigoImg from '@assets/amico@2x.svg';
import close from '@assets/close.svg';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import TransactionPassword from '@core/PaymentView/TransactionVerify/TransactionPassword';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Router from 'react-router-dom';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { BankAccount } from './BankAccount';
import { OtherBankAccount } from './OtherBankAccount';
import * as css from './OtherBankAccount.scss';

export const ConnectBanking = ({
  setCongratsDrawer,
  congratsDrawer,
  setCloseInfoModal,
  setConnectBankRef,
}) => {
  const listRef = React.useRef();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    organization,
    user,
    enableLoading,
    openSnackBar,
    connect,
    setConnect,
  } = React.useContext(AppContext);
  const { state } = Router.useLocation();
  const [bankDetail, setBankDetail] = React.useState('');
  const [hideShowInfoDiv, setHideShowInfoDiv] = React.useState();
  // const [congratsDrawer, setCongratsDrawer] = React.useState(false);
  React.useEffect(() => {
    if (setCloseInfoModal) {
      setCloseInfoModal(hideShowInfoDiv);
      setTimeout(() => {
        setConnectBankRef(listRef);
      }, 500);
    } else if (state?.setCloseInfoModal) {
      state?.setCloseInfoModal(hideShowInfoDiv);
      setTimeout(() => {
        setConnectBankRef(listRef);
      }, 500);
    }
  }, [hideShowInfoDiv]);

  React.useEffect(() => {
    if (connect === true) {
      setHideShowInfoDiv(false);
    }
  }, [connect]);

  const FetchConnectedBank = () => {
    RestApi(
      `organizations/${organization?.orgId}/bank_accounts/connected_bankings`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          setBankDetail(res.data);
        } else if (res.error) {
          openSnackBar({
            message: res.message || 'Sorry,Something went Wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    FetchConnectedBank();
    if (connect === true) {
      setHideShowInfoDiv(false);
    } else {
      setHideShowInfoDiv(true);
    }
  }, []);

  return (
    <>
      {connect === false && bankDetail?.connected_banking?.length === 0 && (
        <div
          id={mobile ? 'connectedBankingMobile' : 'connectedBankingDesktop'}
          className={
            mobile
              ? css.connectedBankingInfoMobile
              : css.connectedBankingInfoDesktop
          }
          style={{ display: hideShowInfoDiv ? 'flex' : 'none' }}
          ref={hideShowInfoDiv ? listRef : () => {}}
        >
          <div className={css.imgDiv}>
            <img src={amigoImg} alt="Amigo Img" />
          </div>
          <div className={css.infoDiv}>
            <h3>Registration Process:</h3>
            <ol>
              <li>Enter your bank Details in the form</li>
              <li>
                Approve your request in ICICI’s Connected Banking Approvals
                page:{' '}
                <a
                  href="https://cibnext.icicibank.com/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=ICI"
                  target="_blank"
                  rel="noreferrer"
                >
                  ICICI Corporate Login
                </a>
              </li>
              <li>
                Press the “Sync Now” button to fetch the registation status
              </li>
            </ol>
            <img
              src={close}
              alt="close"
              onClick={() => {
                setHideShowInfoDiv(false);
              }}
              role="presentation"
            />
          </div>
          {mobile && (
            <div className={css.connectBtn}>
              <Mui.Stack
                direction="row"
                alignItem="center"
                className={css.btnHead}
              >
                <Mui.Button
                  className={css.btn}
                  onClick={async () => {
                    // await setHideShowInfoDiv(false);
                    // setTimeout(() => {
                    setConnect(true);
                    // }, 10);

                    // connection(true);
                  }}
                >
                  Add Account
                </Mui.Button>
              </Mui.Stack>
            </div>
          )}
        </div>
      )}
      <Mui.Grid container spacing={2}>
        {mobile && connect === true ? (
          <Mui.Grid
            item
            lg={7}
            xs={12}
            md={12}
            sx={{ bgcolor: mobile ? '#ffffff' : '' }}
          >
            <OtherBankAccount
              connect={connect}
              setConnect={setConnect}
              FetchConnectedBank={FetchConnectedBank}
              mobile={mobile}
              setCongratsDrawer={setCongratsDrawer}
            />
          </Mui.Grid>
        ) : (
          <>
            <Mui.Grid
              item
              lg={7}
              xs={12}
              md={12}
              sx={{ marginRight: mobile ? '10px' : '' }}
            >
              <BankAccount
                bankDetail={bankDetail}
                setConnect={setConnect}
                connect={connect}
                FetchConnectedBank={FetchConnectedBank}
                setCongratsDrawer={setCongratsDrawer}
              />
            </Mui.Grid>
            <Mui.Grid item lg={5} xs={12} md={12} overflow="hidden">
              <OtherBankAccount
                connect={connect}
                setConnect={setConnect}
                FetchConnectedBank={FetchConnectedBank}
                mobile={mobile}
                setCongratsDrawer={setCongratsDrawer}
              />
            </Mui.Grid>
          </>
        )}
      </Mui.Grid>
      <SelectBottomSheet
        name="congratsDrawer"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={congratsDrawer}
        addNewSheet
        maxHeight="45vh"
      >
        <TransactionPassword onClose={() => setCongratsDrawer(false)} />
      </SelectBottomSheet>
    </>
  );
};
