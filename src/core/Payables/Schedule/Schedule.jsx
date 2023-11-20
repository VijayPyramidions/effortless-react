import * as React from 'react';
// import * as Router from 'react-router-dom';
import { Button } from '@material-ui/core';
import AppContext from '@root/AppContext.jsx';
import * as css from './Schedule.scss';
import TableComponent from '../../../components/Table/Table';

const Schedule = () => {
  const { changeSubView } = React.useContext(AppContext);
  // const navigate = Router.useNavigate();

  const sampleHeaderData = [
    { title: 'DELIVERED TO', key: 'deliveredTo' },
    { title: 'LAST CAMPAIGN SENT', key: 'compaginSent' },
  ];

  const sampleRowData = [
    { deliveredTo: 'xxxxxxxx', compaginSent: 'xxxxxxxx' },
    { deliveredTo: '', compaginSent: '' },
    { deliveredTo: '', compaginSent: '' },
    { deliveredTo: '', compaginSent: '' },
  ];

  // const device = localStorage.getItem('device_detect');
  // const pathName = window.location.pathname;

  // React.useEffect(() => {
  //   if (pathName.includes('Schedule') && device === 'mobile') {
  //     navigate('/receivables');
  //   }
  // }, [pathName, device]);

  return (
    <div className={css.topMisses}>
      <div className={css.valueHeader}>Your Current Campaigns</div>
      <div className={css.tableWrapper}>
        <TableComponent header={sampleHeaderData} data={sampleRowData} />
      </div>
      <a href className={css.showMore}>
        Show More
      </a>
      <Button
        variant="contained"
        className={css.primary}
        onClick={() => changeSubView('createNewCampaign')}
        disableTouchRipple
        disableElevation
      >
        Create a New Campaign
      </Button>
    </div>
  );
};

export default Schedule;
