import React from 'react';
import * as Router from 'react-router-dom';
import { Dialog } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import VendorOnboarding from './VendorOnBoarding';
import VendorOnboardingBank from './VendorOnboardingBank';

const GenericQueryForm = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [titleHead, setTitleHead] = React.useState({ name: '' });
  const navigate = Router.useNavigate();
  const name = new URLSearchParams(window.location.search).get('name');
  const user_id = new URLSearchParams(window.location.search).get('id');
  const organization_id = new URLSearchParams(window.location.search).get(
    'organization_id',
  );
  // const user_token = new URLSearchParams(window.location.search).get('token');
  const organization_name = new URLSearchParams(window.location.search).get(
    'organization_name',
  );
  const entity_name = new URLSearchParams(window.location.search).get(
    'entity_name',
  );
  const user_email = new URLSearchParams(window.location.search).get(
    'user_email',
  );
  const entity_type = new URLSearchParams(window.location.search).get(
    'entity_type',
  );
  const search_param = window.location.search;

  React.useEffect(() => {
    const listName = [
      {
        id: 'vendorOnboarding',
        value: `${
          entity_type === 'vendor' ? 'Vendor' : 'Employee'
        } Onboarding Form`,
      },
      {
        id: 'vendorOnboarding-bank',
        value: `${
          entity_type === 'vendor' ? 'Vendor' : 'Employee'
        } Onboarding Form`,
      },
    ];
    setTitleHead({
      name:
        `${entity_name} - ${
          listName?.find((val) => val?.id === name)?.value
        }` || '',
      user_id,
      organization_id,
      organization_name,
      search_param,
      entity_name,
      user_email,
    });
  }, [name]);
  return (
    <Dialog open onClose={() => navigate(-1)} fullScreen={fullScreen}>
      {name === 'vendorOnboarding' && (
        <VendorOnboarding titleHead={titleHead} />
      )}
      {name === 'vendorOnboarding-bank' && (
        <VendorOnboardingBank titleHead={titleHead} />
      )}
      {(!name || titleHead?.name === '') && (
        <img
          src="https://static.vecteezy.com/system/resources/previews/005/867/675/original/human-thinking-illustration-design-concept-vector.jpg"
          alt="Loading"
        />
      )}
    </Dialog>
  );
};

export default GenericQueryForm;
