import React, { memo } from 'react';
import {
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { makeStyles } from '@material-ui/core/styles';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import * as css from '../bankingmobile.scss';

export const useStyles = makeStyles({
  SelectListItem: {
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    '&.Mui-selected': {
      background: 'none !important',
      '& .MuiListItemText-primary': {
        color: '#F08B32 !important',
        fontWeight: '300 !important',
      },
    },
  },
});

const BottomSelectList = ({
  onClose,
  handleChange,
  selectedValue,
  title,
  data,
}) => {
  const classes = useStyles();
  return (
    <Stack className={css.bottommodalcontainer}>
      <Stack className={css.emptyBar} />
      {title !== 'hide' && (
        <Stack className={css.headerWrp}>
          <Typography variant="h4" className={css.accpreftitle}>
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseRoundedIcon sx={{ width: '16px', height: '16px' }} />
          </IconButton>
        </Stack>
      )}
      <List sx={{ paddingTop: '0px', margin: '0 -20px' }}>
        {data?.map((row) => (
          <ListItem
            className={`${css.listitem}`}
            sx={{ paddingLeft: '20px !important' }}
            onClick={handleChange(row)}
            key={row}
          >
            <ListItemButton
              selected={selectedValue === row}
              className={classes.SelectListItem}
            >
              <ListItemText primary={row} className={css.listtext} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* {title === 'hide' && 
         <ListItem
         className={`${css.listitem}`}
         sx={{ paddingLeft: '20px !important' }}
         onClick={handleChange('custom')}
       >
         <ListItemButton
           selected={selectedValue}
           className={classes.SelectListItem}
         >
           <ListItemText primary={row} className={css.listtext} />
         </ListItemButton>
       </ListItem>
        } */}
      </List>
    </Stack>
  );
};

export default memo(BottomSelectList);
