import * as React from 'react';
import * as Mui from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';

import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import PageTitle from '@core/DashboardView/PageTitle';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';
import { InvoiceCustomer } from '@components/Invoice/EditForm.jsx';
import CategorizeStacks from './categorizeStacks';
import * as css from './categorize.scss';

const CategorizeTransactions = ({ datas, minWidth }) => {
  // eslint-disable-next-line no-unused-vars
  const { organization, openSnackBar, user, amt, enableLoading } =
    React.useContext(AppContext);
  const [txn, setTxn] = React.useState([]);
  const [txn2, setTxn2] = React.useState([]);
  const [pgNum, setpgNum] = React.useState(1);
  const [totalPages, settotalPages] = React.useState(1);
  // eslint-disable-next-line no-unused-vars
  const [count, setCount] = React.useState(0);
  const navigate = Router.useNavigate();
  const [trigger, setTrigger] = React.useState({
    show: 'list',
    editValue: {},
    type: 'receipt',
  });

  const fetchBankDetails = () => {
    // enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/bank_uncategorized?page=${pgNum}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setTxn(res.bank_txn_ids);
          settotalPages(res.pages);
          setCount(res.count);
        }
        // enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const device = localStorage.getItem('device_detect');

  const fetchBankDetails2 = (prop) => {
    // enableLoading(true);
    RestApi(`organizations/${organization.orgId}/bank_uncategorized/${prop}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res.id) {
          setTxn2((prev) => [...prev, res]);
        } else if (res?.message === 'Txn is not found') {
          navigate(-1);
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e?.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
    enableLoading(false);
  };

  const loadMore = async () => {
    await txn.map((e) => fetchBankDetails2(e));
  };

  React.useEffect(() => {
    if (datas === undefined) {
      setpgNum(1);
    }
  }, []);

  React.useEffect(() => {
    async function loadData() {
      setTxn2([]);
      setTxn([]);

      if (pgNum <= totalPages) {
        if (datas === undefined) {
          await fetchBankDetails();
        } else {
          await fetchBankDetails2(datas);
        }
      }
    }
    loadData();
  }, [pgNum]);

  React.useEffect(() => {
    loadMore();
  }, [txn]);

  const pagination = (e, v) => {
    setpgNum(v);
  };
  // React.useEffect(() => {
  //   if (device === 'desktop') {
  //     navigate('/banking');
  //   }
  // }, []);
  return (
    <>
      {device === 'mobile' && (
        <PageTitle
          title="Banking"
          onClick={() => {
            if (trigger?.show === 'add') {
              setTrigger({ show: 'list', editValue: {} });
            } else {
              navigate('/banking');
            }
          }}
        />
      )}
      <div
        className={
          device === 'mobile' && cssDash.dashboardBodyContainerhideNavBar
        }
        style={{ width: '100%' }}
      >
        {(trigger?.show === 'list' &&
          (txn2?.length > 0 ? (
            <>
              <Mui.Grid container spacing={3} className={css.container}>
                <Mui.Grid
                  item
                  xs={12}
                  lg={12}
                  md={12}
                  sm={12}
                  className={css.innerContainer}
                >
                  <Mui.Stack
                    height="100%"
                    direction="column"
                    spacing={1}
                    justifyContent="space-between"
                  >
                    {device === 'mobile' && (
                      <Mui.Grid
                        style={{
                          marginLeft: '1.2rem',
                          marginTop: '2rem',
                        }}
                      >
                        Categorize Transactions
                        <Mui.Divider
                          style={{
                            borderRadius: '4px',
                            width: '13px',
                            height: '1.7px',
                            marginTop: '7px',
                            backgroundColor: '#F08B32',
                          }}
                          variant="fullWidth"
                        />
                      </Mui.Grid>
                    )}
                    <Mui.Grid
                      item
                      xs={12}
                      lg={12}
                      md={12}
                      sm={12}
                      className={css.insideCard}
                    >
                      {txn2.map((e) => (
                        <CategorizeStacks
                          e={e}
                          cssForOneCard={datas}
                          minWidth={minWidth}
                          setTrigger={setTrigger}
                        />
                      ))}
                    </Mui.Grid>
                    {(txn2.length && datas !== undefined) < 0 ? (
                      <></>
                    ) : (
                      <Mui.Pagination
                        className={css.paginatedButton}
                        count={totalPages}
                        page={pgNum}
                        onChange={pagination}
                      />
                    )}
                  </Mui.Stack>
                </Mui.Grid>
              </Mui.Grid>
            </>
          ) : (
            <div style={{ width: '100%', height: '10rem', display: 'flex' }}>
              <Mui.CircularProgress
                style={{ margin: 'auto', color: '#f08b32' }}
              />
            </div>
          ))) || (
          <div style={{ width: '100%' }}>
            <div
              style={{ padding: '5px 0', margin: '1rem' }}
              className={css.headerContainer}
            >
              <p className={css.headerLabel}>{trigger?.editValue?.name}</p>
              <span className={css.headerUnderline} />
            </div>
            <InvoiceCustomer
              showValue={trigger?.editValue}
              handleBottomSheet={() =>
                setTrigger({ show: 'list', editValue: {} })
              }
              type={trigger?.type === 'receipt' ? 'customers' : 'vendors'}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default CategorizeTransactions;
