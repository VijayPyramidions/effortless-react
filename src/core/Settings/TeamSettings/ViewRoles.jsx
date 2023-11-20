import React, { useState, memo } from 'react';
// import * as Router from 'react-router-dom';
import { Box, Stack, IconButton, Typography, Button } from '@mui/material';
// import Switch from '@components/ToggleSwitch/ToggleSwitch';
import AppContext from '@root/AppContext';
import RestApi, { METHOD } from '@services/RestApi';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { styled, Switch } from '@material-ui/core';
import * as css from './teamSettings.scss';

const ToggleSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-root': {
    marginRight: '-13px',
  },
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    cursor:'default',
    '&.Mui-disabled': {
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        color: 'rgb(240, 139, 50)',
        width: 12,
        height: 12,
        marginTop: '4.73px',
      },
      '& + .MuiSwitch-track': {
        backgroundColor: 'white',
        opacity: 1,
        border: 'none',
      },
    },
    '&.Mui-checked': {
      transform: 'translateX(12.8px)',
      cursor: 'default',
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        color: '#FFFFFF',
        width: 12,
        height: 12,
        marginTop: '4.8px',
      },
      '& + .MuiSwitch-track': {
        backgroundColor: '#F08B3280',
        opacity: 1,
        border: '1px solid rgba(240, 139, 50, 0.5);',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      border: '76px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: '#33cf4d',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    color: '#F08B32',
    width: 12,
    height: 12,
    marginTop: '4.73px',
  },
  '& .MuiSwitch-track': {
    borderRadius: 16,
    backgroundColor: '#F2F2F0',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    border: '1px solid rgba(240, 139, 50, 0.5)',
    width: 28,
    height: 16,
  },
}));

const ViewRoles = (props) => {
  const { memberData, EditPermission } = props;
  const { organization, user, openSnackBar, enableLoading } =
    React.useContext(AppContext);
  const [RolesSetting, setRolesSetting] = useState([]);

  const FetchMemberData = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/members/${memberData?.user_id}/permissions`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          setRolesSetting(res);
        } else {
          openSnackBar({
            message: res?.errors || res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.errors || res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  React.useEffect(() => {
    FetchMemberData();
  }, [memberData?.id]);

  return (
    <>
      <Box className={css.viewrolescontainer}>
        <Typography variant="h3" className={css.header}>
          Permissions for {memberData?.name}
        </Typography>
        <Stack className={css.rolesinputcontainer}>
          <Stack className={css.inputwrp}>
            <Stack className={css.editiconwrp}>
              <Typography className={css.roletxt}>Role</Typography>
              <IconButton className={css.editicon} />
            </Stack>
            <Typography className={css.rolesvalue}>
              {memberData?.role}
            </Typography>
          </Stack>
        </Stack>
        <Stack className={css.permissionwrp}>
          <Typography variant="h3" className={css.listheader}>
            Permissions List
          </Typography>
          {RolesSetting?.permissions?.map((val) => (
            <Stack className={css.listitemwrp}>
              <Typography className={css.listtext}>{val.name}</Typography>
              <ToggleSwitch className={css.listcheck} checked={val.active} />
            </Stack>
          ))}
        </Stack>
        <div className={css.editpermbtnwrp}>
          <Button
            onClick={() =>
              EditPermission('/settings-teamSettings-Role', {
                state: {
                  selectedTab: 'tab1',
                  type: 'member',
                  name: memberData?.name,
                  id_s: RolesSetting?.role_id,
                  role: memberData?.role,
                  member_id_s: memberData?.user_id,
                  permissions: RolesSetting?.permissions,
                },
              })
            }
            className={css.editpermbtn}
          >
            Edit Permissions
          </Button>
        </div>
      </Box>
    </>
  );
};

export default memo(ViewRoles);
