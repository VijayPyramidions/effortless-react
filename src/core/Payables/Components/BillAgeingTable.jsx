import React from 'react';
import DropdownIcon from '@mui/icons-material/KeyboardArrowDown';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { Grid } from '@mui/material';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import moment from 'moment';
import * as css from '../Ageing/Ageing.scss';

const BillAgeingTable = ({
  data: {
    name,
    net_balance: totalAmount,
    total_debits: totalDebit,
    age_buckets: ageBucket,
    unsettled_credits: unSettled,
    id,
  },
  value,
  anchorElDateP,
}) => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [idVal, setIdVal] = React.useState('');
  const [oldId, setOldId] = React.useState();
  const navigate = Router.useNavigate();

  const { organization, user, openSnackBar } = React.useContext(AppContext);

  const fetchAgeingData = async () => {
    if (!open && oldId !== idVal) {
      setOldId(idVal);
      await RestApi(
        `organizations/${
          organization.orgId
        }/payables/ageing/${id}?${`date=${moment(anchorElDateP.value).format(
          'YYYY-MM-DD',
        )}`}${value && `&report_view=${value}`}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((res) => {
          if (res && !res.error) {
            if (res?.message === 'Vendor not found') {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.ERROR,
              });
            } else {
              setIdVal(id);
              setData(res);
              setOpen(!open);
            }
          } else if (res?.message === 'Vendor not found') {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.ERROR,
            });
          } else {
            openSnackBar({
              message: res?.message || 'Unknown Error Occured',
              type: MESSAGE_TYPE.ERROR,
            });
          }
        })
        .catch(() => {
          openSnackBar({
            message: `Sorry we will look into it`,
            type: MESSAGE_TYPE.ERROR,
          });
        });
    } else if (!open && oldId === idVal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleClick = async () => {
    fetchAgeingData();
  };

  return (
    <>
      <Grid
        container
        className={css.secContainer}
        key={id}
        onClick={() => {
          if (!open) {
            handleClick(id);
          } else {
            setOpen(!open);
          }
        }}
      >
        <Mui.Stack width="92%" margin={open ? '2% 4% 0 4%' : '2% 4%'}>
          <Mui.Box
            sx={{
              background: '#FFF',
              height: 'fit-content',
              display: 'flex',
              padding: '15px',
              flexDirection: 'column',
              boxShadow: '0px 4px 8px rgb(0 0 0 / 6%)',
              borderRadius: '5px 5px 0 0',
            }}
          >
            <Mui.Stack
              sx={{ width: '100%' }}
              direction="row"
              justifyContent="space-around"
            >
              <div style={{ width: '90%' }}>
                <Mui.Typography className={css.topName}>{name}</Mui.Typography>
              </div>
              <div style={{ width: '10%' }}>
                <DropdownIcon
                  className={!open ? css.iconRotate : css.iconDrop}
                />
              </div>
            </Mui.Stack>

            <Mui.Stack direction="row">
              <Mui.Stack
                sx={{ width: '65%' }}
                direction="column"
                justifyContent="space-around"
              >
                <div style={{ width: '100%' }}>
                  <Mui.ListItemText
                    primary={
                      <Mui.Typography className={css.boxTitle}>
                        Current Outstanding
                      </Mui.Typography>
                    }
                    secondary={
                      <Mui.Typography className={css.netBalance}>
                        {FormattedAmount(totalAmount)}
                      </Mui.Typography>
                    }
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <Mui.ListItemText
                    primary={
                      <Mui.Typography className={css.boxTitle}>
                        Advance
                      </Mui.Typography>
                    }
                    secondary={
                      <Mui.Typography className={css.topMisses}>
                        {FormattedAmount(ageBucket?.advance)}
                      </Mui.Typography>
                    }
                  />
                </div>
              </Mui.Stack>

              <Mui.Stack
                sx={{ width: '35%' }}
                direction="column"
                justifyContent="space-around"
              >
                <div style={{ width: '100%' }}>
                  <Mui.ListItemText
                    primary={
                      <Mui.Typography className={css.boxTitle}>
                        Total Payables
                      </Mui.Typography>
                    }
                    secondary={
                      <Mui.Typography className={css.debit}>
                        {FormattedAmount(totalDebit)}
                      </Mui.Typography>
                    }
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <Mui.ListItemText
                    primary={
                      <Mui.Typography className={css.boxTitle}>
                        Unsettled Payments
                      </Mui.Typography>
                    }
                    secondary={
                      <Mui.Typography className={css.topMisses}>
                        {FormattedAmount(unSettled)}
                      </Mui.Typography>
                    }
                  />
                </div>
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Box>
        </Mui.Stack>
      </Grid>

      {open && (
        <Mui.Stack width="92%" margin="0 4% 2% 4%">
          {value === 'monthwise' ? (
            <Mui.Box
              sx={{
                background: '#F8F8F8',
                height: 'fit-content',
                display: 'flex',
                padding: '10px 35px',
                flexDirection: 'column',
                boxShadow: '0px 4px 8px rgb(0 0 0 / 6%)',
                borderRadius: '0 0 5px 5px',
              }}
              onClick={() => {
                setOpen(!open);
                // navigate('/receivables-ageing-view', {
                //   state: { tableId: id },
                // });
                // changeSubView('receivablesAgeingView', id);
              }}
            >
              {Object.entries(data?.months || {})?.map((text) => (
                <Mui.Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="10px 0"
                >
                  <Mui.Typography className={css.due}>
                    {text[0] !== 'net_balance' &&
                    text[0] !== 'total_debits' &&
                    text[0] !== 'unsettled_credits' &&
                    text[0] !== 'earlier_than'
                      ? moment(text[0]).format('DD MMM YYYY')
                      : text[0]?.split('_')?.join(' ')}
                  </Mui.Typography>
                  <Mui.Typography className={css.dueAmt}>
                    {FormattedAmount(text[1])}
                  </Mui.Typography>
                </Mui.Stack>
              ))}
            </Mui.Box>
          ) : (
            <Mui.Box
              sx={{
                background: '#F8F8F8',
                height: 'fit-content',
                display: 'flex',
                padding: '10px 35px',
                flexDirection: 'column',
                boxShadow: '0px 4px 8px rgb(0 0 0 / 6%)',
                borderRadius: '0 0 5px 5px',
              }}
              onClick={() => {
                setOpen(!open);
              }}
            >
              {data?.by_buckets?.map((val) => (
                <Mui.Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="10px 0"
                >
                  <Mui.Typography className={css.due}>
                    {val?.age_bucket}
                  </Mui.Typography>
                  <Mui.Typography className={css.dueAmt}>
                    {FormattedAmount(val?.amount)}
                  </Mui.Typography>
                </Mui.Stack>
              ))}
            </Mui.Box>
          )}
          <div
            style={{ background: '#FFF', display: 'flex', padding: '5px 50px' }}
          >
            <Mui.Button
              variant="contained"
              className={css.primaryView}
              onClick={() => {
                navigate('/payables-ageing-view', {
                  state: {
                    tableId: id,
                    selectedDate: anchorElDateP?.value,
                    wise: value,
                  },
                });
              }}
              disableTouchRipple
              disableElevation
              fullWidth
              sx={{ textTransform: 'capitalize' }}
            >
              View More
            </Mui.Button>
          </div>
        </Mui.Stack>
      )}
    </>
  );
};

export default BillAgeingTable;
