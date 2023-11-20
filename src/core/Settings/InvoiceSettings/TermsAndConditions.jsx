import React from 'react';
import * as Mui from '@mui/material';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';

import { styled } from '@mui/material/styles';
import * as css from './InvoiceSettings.scss';

const device2 = localStorage.getItem('device_detect');

const BootstrapInput = styled(Mui.InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 10,
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid #ced4da',
    fontSize: device2 === 'mobile' ? 12 : 16,
    width: '100%',
    padding: '10px 12px',
    // transition: theme.transitions.create([
    //   'border-color',
    //   'background-color',
    //   'box-shadow',
    // ]),
    // Use the system font instead of the default Roboto font.
    //   fontFamily: [
    //     '-apple-system',
    //     'BlinkMacSystemFont',
    //     '"Segoe UI"',
    //     'Roboto',
    //     '"Helvetica Neue"',
    //     'Arial',
    //     'sans-serif',
    //     '"Apple Color Emoji"',
    //     '"Segoe UI Emoji"',
    //     '"Segoe UI Symbol"',
    //   ].join(','),
    //   '&:focus': {
    //     boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    //     borderColor: theme.palette.primary.main,
    //   },
  },
}));
const TermsAndConditions = () => {
  const { organization, user } = React.useContext(AppContext);
  const [data, setData] = React.useState();
  const [open, setOpen] = React.useState(false);

  // const [data1, setData1] = React.useState();
  const navigate = Router.useNavigate();
  const device = localStorage.getItem('device_detect');

  const FetchData = () => {
    // RestApi(`organizations/${organization.orgId}/members/${id}`, {
    //   method: METHOD.DELETE,
    //   headers: {
    //     Authorization: `Bearer ${user.activeToken}`,
    //   },
    // })
    RestApi(`organizations/${organization.orgId}/settings`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      setData(res?.default_terms);
    });
  };
  const Update = () => {
    RestApi(
      `organizations/${organization.orgId}/settings?default_terms=${encodeURIComponent(data)}`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then(() => {
      navigate('/settings-invoiceSettings');
      // setData(res?.default_terms);
    });
  };
  React.useEffect(() => {
    FetchData();
  }, []);

  return device === 'desktop' ? (
    <Mui.Stack className={css.TermsHeadCond}>
      <BootstrapInput
        placeholder="Type your Subject here..."
        multiline
        rows={15}
        // defaultValue={data?.trim()}
        // onChange={OnInputChange(setData)}

        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      {/* <Mui.TextField
        
        value={data}
        onChange={(e) => setData(e.target.value)}
        /> */}
      <Mui.Stack className={css.stackTerms}>
        <Mui.Button className={css.b1} onClick={() => Update()}>
          <div className={css.b1txt}>Save </div>
        </Mui.Button>
      </Mui.Stack>
      <Mui.Dialog open={open} onClose={() => setOpen(false)}>
        <Mui.Stack style={{ padding: '5rem 8rem 5rem 8rem' }}>
          <Mui.Typography>Saved</Mui.Typography>
        </Mui.Stack>
      </Mui.Dialog>
    </Mui.Stack>
  ) : (
    <Mui.Stack sx={{ p: '4%', pt: '6%' }} className={css.TermsHead}>
      <Mui.Stack className={css.TermsHead1Terms}>
        <Mui.Stack className={css.TermsHead2}>
          <Mui.Typography>Write your Terms & Conditions</Mui.Typography>
          <Mui.Stack mt={2}>
            <BootstrapInput
              placeholder="Type your Subject here..."
              multiline
              rows={10}
              defaultValue={data?.trim()}
              onChange={(e) => setData(e.target.value)}
            />
          </Mui.Stack>
        </Mui.Stack>
      </Mui.Stack>
      {/* <Mui.Stack className={css.stackTerms}> */}

      <Mui.Link className={css.TermsCond} onClick={() => Update()}>
        save your terms and conditions
      </Mui.Link>
    </Mui.Stack>
  );
};

export default TermsAndConditions;
