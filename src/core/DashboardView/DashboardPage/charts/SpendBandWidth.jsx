import React from 'react';
import AppContext from '@root/AppContext.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as Mui from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import * as css from '../dashboardStyles.scss';

const useStyles = makeStyles(() => ({
  heading: {
    fontSize: '15px !important',
    textTransform: 'capitalize',
    fontWeight: '200 !important',
    marginBottom: '12px !important',
  },
  headingDesktop: {
    fontSize: '16px !important',
    textTransform: 'capitalize',
    fontWeight: '500 !important',
  },
  innerStack: {
    margin: '30px 15px',
  },
  stacks: {
    margin: '1rem !important',
    boxShadow: '6px 7px 10px #e6e6e6, -6px -3px 10px #e6e6e6 !important',
    height: '324px',
    borderRadius: '16px !important',
    width: 'auto',
  },
  headingAmount: {
    fontSize: '30px !important',
    fontWeight: '700 !important',
    marginBottom: '10px',
  },
  headingAmountDesktop: {
    fontSize: '18px !important',
    fontWeight: '700 !important',
    marginBottom: '10px',
  },
  subMenu: {
    letterSpacing: '0em !important',
    fontSize: '13px !important',
    fontWeight: '300 !important',
    color: '#273049C2',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  subMenuDesktop: {
    letterSpacing: '0em !important',
    fontSize: '14px !important',
    fontWeight: '300 !important',
    color: '#273049C2',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  subMenuDesktopWithoutCap: {
    letterSpacing: '0em !important',
    fontSize: '14px !important',
    fontWeight: '300 !important',
    color: '#273049C2',
    textTransform: 'none',
    textAlign: 'left',
  },
  subMenu1: {
    fontSize: '13px !important',
    fontWeight: '500 !important',
    textAlign: 'right',
  },
  subMenu1Desktop: {
    fontSize: '14px !important',
    fontWeight: '600 !important',
    textAlign: 'right',
  },
  submenuStack: {
    margin: '1rem',
    alignItems: 'center',
  },
  submenuStack1: {
    width: '280px',
    justifyContent: 'space-between',
  },
  span: {
    backgroundColor: '#EDEDED',
    width: '300px',
    height: '1px',
    marginTop: '0.6rem',
    marginLeft: '1rem',
  },
  gridContainer: {
    marginTop: '40px !important',
  },
  itemContainer: {
    paddingLeft: '0px !important',
  },
  commonStack: {
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: '1rem',
  },
  commonStack1Desktop: {
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '1.3rem 0 0 0',
  },
  spendBandwidthContent: {
    '& hr:last-of-type': {
      display: 'none',
    },
  },
}));

const SpendBandWidth = (props) => {
  const { userPermissions } = React.useContext(AppContext);
  const { info, spendBandwidthValue, loanBorrwings } = props;
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const [userRolesBanking, setUserRolesBanking] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Banking || {})?.length > 0) {
      setUserRolesBanking({ ...userPermissions?.Banking });
    }
  }, [userPermissions]);

  const data = [
    {
      name: ' Fixed Deposit',
      amount: info?.fixed_deposit ? Math.round(Number(info?.fixed_deposit)) : 0,
    },
    {
      name: ' Un-Utilized Overdraft',
      amount: info?.unused_overdraft ? Math.round(Number(info?.unused_overdraft)) : 0,
    },
    {
      name: 'Cash and Bank',
      amount: Math.round(Number(info?.cash || 0) + Number(info?.bank_accounts || 0)),
    },
  ];
  return device === 'desktop' ? (
    <>
      <Mui.Stack
        style={{
          background: '#fff',
          boxShadow: '0px 0px 40px rgb(48 73 191 / 5%)',
          borderRadius: '16px',
          padding: '20px',
          height: '296px',
        }}
        spacing={2}
        onClick={() => {
          if (!userRolesBanking?.Banking) {
            setHavePermission({ open: true, back: () => {
              setHavePermission({ open: false });
            }, });
            return;
          }
          navigate('/banking');
        }} 
      >
        <Mui.Stack direction="row" className={classes.commonStack}>
          <Mui.Typography noWrap className={classes.headingDesktop}>
            spend bandwidth
          </Mui.Typography>
          <Mui.Typography noWrap className={classes.headingAmountDesktop}>
          {FormattedAmount(Math.round(Number(spendBandwidthValue)))}
          </Mui.Typography>
        </Mui.Stack>
        <div className={classes.spendBandwidthContent}>
          {data.map((c) => {
            return (
              <>
                <Mui.Stack
                  direction="row"
                  className={classes.commonStack1Desktop}
                >
                  <Mui.Typography noWrap className={classes.subMenuDesktopWithoutCap}>
                    {c.name}
                  </Mui.Typography>
                  <Mui.Typography noWrap className={classes.subMenu1Desktop}>
                    {FormattedAmount(c?.amount)}
                  </Mui.Typography>
                </Mui.Stack>
                <Mui.Divider
                  style={{ opacity: '0.2', margin: '1.3rem 0 0 0' }}
                />
              </>
            );
          })}
        </div>
      </Mui.Stack>
      {loanBorrwings?.datasets?.length > 0 && (
        <Mui.Stack
          style={{
            margin: '20px 0 0 0 ',
            background: '#fff',
            boxShadow: '0px 0px 40px rgb(48 73 191 / 5%)',
            borderRadius: '16px',
            padding: '20px',
          }}
          spacing={2}
        >
          <Mui.Stack direction="row" className={classes.commonStack}>
            <Mui.Typography noWrap className={classes.headingDesktop}>
              Borrowings
            </Mui.Typography>
            <Mui.Typography noWrap className={classes.headingAmountDesktop}>
              {FormattedAmount(loanBorrwings?.total_amount)}
            </Mui.Typography>
          </Mui.Stack>
          <div className={classes.spendBandwidthContent}>
            {loanBorrwings?.datasets?.map((c) => {
              return (
                <>
                  <Mui.Stack
                    direction="row"
                    className={classes.commonStack1Desktop}
                  >
                    <Mui.Typography noWrap className={classes.subMenuDesktop}>
                      {c?.label || '-'}
                    </Mui.Typography>
                    <Mui.Typography noWrap className={classes.subMenu1Desktop}>
                      {FormattedAmount(c?.amount)}
                    </Mui.Typography>
                  </Mui.Stack>
                  <Mui.Divider
                    style={{ opacity: '0.2', margin: '1.3rem 0 0 0' }}
                  />
                </>
              );
            })}
          </div>
        </Mui.Stack>
      )}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  ) : (<>
    <Mui.Stack style={{ width: '100%' }} onClick={() => {
      if (!userRolesBanking?.Banking) {
        setHavePermission({ open: true, back: () => {
          setHavePermission({ open: false });
        }, });
        return;
      }
      navigate('/banking');
    }} >
      <Mui.Card className={`${classes.stacks} ${css.firstchart}`}>
        <Mui.Stack className={classes.innerStack}>
          <Mui.Stack style={{ width: '100%', alignItems: 'center' }}>
            <Mui.Typography noWrap className={classes.heading}>
              spend bandwidth
            </Mui.Typography>
            <Mui.Typography noWrap className={classes.headingAmount}>
              {FormattedAmount(Math.round(Number(spendBandwidthValue)))}
            </Mui.Typography>
          </Mui.Stack>
          <Mui.Grid
            container
            spacing={2}
            mt={4}
            className={classes.gridContainer}
          >
            <Mui.Grid xs={6} item>
              <Mui.Typography noWrap className={classes.subMenu}>
                fixed deposit
              </Mui.Typography>
            </Mui.Grid>
            <Mui.Grid xs={6} item className={classes.itemContainer}>
              <Mui.Typography noWrap className={classes.subMenu1}>
                {FormattedAmount(Math.round(Number(info?.fixed_deposit)))}
              </Mui.Typography>
            </Mui.Grid>
            <span className={classes.span} />
            <Mui.Grid xs={6} item>
              <Mui.Typography noWrap className={classes.subMenu}>
                Un-utilized Overdraft
              </Mui.Typography>
            </Mui.Grid>
            <Mui.Grid xs={6} item className={classes.itemContainer}>
              <Mui.Typography noWrap className={classes.subMenu1}>
                {FormattedAmount(Math.round(Number(info?.unused_overdraft)))}
              </Mui.Typography>
            </Mui.Grid>
            <span className={classes.span} />
            <Mui.Grid xs={6} item>
              <Mui.Typography noWrap className={classes.subMenu} sx={{textTransform: 'none'}}>
                Cash and Bank
              </Mui.Typography>
            </Mui.Grid>
            <Mui.Grid xs={6} item className={classes.itemContainer}>
              <Mui.Typography noWrap className={classes.subMenu1}>
                {FormattedAmount(
                  Math.round(Number(info?.cash || 0) + Number(info?.bank_accounts || 0)),
                )}
              </Mui.Typography>
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Stack>
      </Mui.Card>
    </Mui.Stack>
    {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default SpendBandWidth;
