import * as React from 'react';
import * as Mui from '@mui/material';
import paymentProcessing from '@assets/paymentProcessing.svg';
import paySuccess from '@assets/paySuccess.svg';

// import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';
import * as css from './Processing.scss';

const Done = () => {
  // const { changeSubView } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();

  //   React.useEffect(() => {
  //     if (state === null) {
  //       navigate('/banking');
  //     }
  //   }, [state]);

  //   const [color, setColor] = React.useState(true);
  return (
    <>
      <Mui.Stack className={css.marginHead}>
        <Mui.Grid className={css.marginGrid}>
          <Mui.Stack className={css.card}>
            <Mui.Grid>
              <img
                src={
                  state?.status === 'success' ? paySuccess : paymentProcessing
                }
                height="156px"
                alt="done"
              />
            </Mui.Grid>
            <Mui.Grid className={css.paymentDescription}>
              {state?.status !== 'success'
                ? 'Payment Sent for Approval'
                : 'Payment Successful'}
            </Mui.Grid>
            <Mui.Grid
              style={{
                fontWeight: '300',
                fontSize: '13px',
                lineHeight: '21px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: '10px',
                color: '#6E6E6E',
              }}
            >
              {state?.status === 'success'
                ? 'Your Payment has been Processed. Please await more details. You will be notified shortly'
                : 'You will be notified once approved.'}
            </Mui.Grid>

            <Mui.Button
              style={{
                backgroundColor: '#F08B32',
                borderRadius: '18px',
                padding: '0.5rem',
                fontWeight: '500',
                width: '212px',
                height: '38px',
                fontSize: '14px',
                color: 'white',
                alignSelf: 'center',
                marginTop: '51px',
                textTransform: 'capitalize',
                marginBottom: '29px',
                whiteSpace: 'nowrap',
              }}
              onClick={() => {
                // changeSubView('categorizeTransactions');
                navigate('/payment');
              }}
            >
              Visit Payments
            </Mui.Button>
            <Mui.Grid
              className={css.goBack}
              onClick={() => {
                navigate('/dashboard');
              }}
            >
              Go Back to Banking Dashboard
            </Mui.Grid>
          </Mui.Stack>
        </Mui.Grid>
      </Mui.Stack>
    </>
  );
};
export default Done;
