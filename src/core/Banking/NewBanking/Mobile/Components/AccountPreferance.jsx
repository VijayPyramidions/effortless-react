import React, { memo } from 'react';
import {
  IconButton,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';

import * as css from '../bankingmobile.scss';

const AccountPreferance = ({
  onClose,
  handleChangeAccountHeader,
  AccHeaderState,
}) => {
  return (
    <Stack className={css.bottommodalcontainer}>
      <Stack className={css.emptyBar} />
      <Stack className={css.headerWrp}>
        <Typography variant="h4" className={css.accpreftitle}>
          Select Perference
        </Typography>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon sx={{ width: '16px', height: '16px' }} />
        </IconButton>
      </Stack>
      <List sx={{ paddingTop: '0px', margin: '0 -20px' }}>
        {AccHeaderState.map((val) => (
          <ListItem
            key={val.name}
            className={`${css.listitem}`}
            onClick={handleChangeAccountHeader(val)}
          >
            <Checkbox
              icon={<CircleUnchecked />}
              checkedIcon={<CircleCheckedFilled />}
              checked={val.check}
              sx={{
                color: '#E5E5E5',
                marginLeft: '9px',

                '&.Mui-checked': {
                  color: '#F08B32',
                },
              }}
              onChange={handleChangeAccountHeader(val)}
            />
            <ListItemText primary={val.name} className={css.listtext} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default memo(AccountPreferance);
