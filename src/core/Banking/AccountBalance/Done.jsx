import * as React from 'react';
import * as Mui from '@mui/material';
import tick from '@assets/ticDone.svg';
// import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';

const Done = () => {
  // const { changeSubView } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();

  React.useEffect(() => {
    if (state === null) {
      navigate('/banking');
    }
  }, [state]);
  const device = localStorage.getItem('device_detect');

  //   const [color, setColor] = React.useState(true);
  return (
    <>
      <Mui.Grid
        container
        spacing={3}
        style={{
          margin: 'inherit',
          height: 'min-content',
        }}
      >
        <Mui.Stack
          direction="column"
          style={{
            marginTop: '1rem',
            marginLeft: '1.5rem',
          }}
        >
          <Mui.Typography
            alignSelf="start
                    "
          >
            Categorize Transactions
          </Mui.Typography>
          <Mui.Divider
            style={{
              borderRadius: '4px',
              width: '10px',
              height: '1px',
              backgroundColor: '#F08B32',
            }}
            variant="fullWidth"
          />
        </Mui.Stack>
        <Mui.Grid
          item
          xs={12}
          lg={12}
          md={12}
          sm={12}
          style={{
            padding: '0rem',
            margin: '1rem',
            marginTop: '1.5rem',
            backgroundColor: 'white',
            overflow: 'hidden',
            boxShadow:
              '0px 4px 44px rgba(114, 92, 193, 0.15), 0px -7px 23px rgba(0, 0, 0, 0.02)',
            borderRadius: '18px',
          }}
        >
          <Mui.Box sx={{ width: '100%' }}>
            <Mui.Grid item xs={12} lg={12} md={12} sm={12}>
              <Mui.Stack
                direction="column"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                style={{ marginTop: '50px' }}
              >
                <Mui.Grid>
                  <img src={tick} alt="done" />
                </Mui.Grid>
                <Mui.Grid
                  style={{
                    fontWeight: '500',
                    fontSize: '36px',
                    lineHeight: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    marginTop: '10px',
                    color: '#283049',
                  }}
                >
                  Done
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
                  Transaction has been Categorized..
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
                    if (device === 'mobile') {
                      navigate('/banking-categorize');
                    } else {
                      navigate('/banking');
                    }
                  }}
                >
                  Return to Categorization...
                </Mui.Button>
                <Mui.Grid
                  style={{
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '18px',
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    paddingBottom: '86px',
                    color: 'rgba(40, 48, 73, 0.7)',
                  }}
                  onClick={() => {
                    navigate('/dashboard');
                  }}
                >
                  Go Back to Banking Dashboard
                </Mui.Grid>
              </Mui.Stack>
            </Mui.Grid>
          </Mui.Box>
        </Mui.Grid>
      </Mui.Grid>
    </>
  );
};
export default Done;
