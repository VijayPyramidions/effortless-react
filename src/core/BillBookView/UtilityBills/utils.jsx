import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  listItemText: {
    '& .MuiListItemText-primary': {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.374px',
      color: '#000000',
    },
  },
}));
