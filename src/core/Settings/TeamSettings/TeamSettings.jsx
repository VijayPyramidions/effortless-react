import React from 'react';
import * as Mui from '@mui/material';
import RightArrow from '@assets/rightArrow.svg';
import { styled } from '@mui/material/styles';
import Input from '@components/Input/Input.jsx';
import member from '@assets/person.svg';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from '@services/Validation.jsx';
import * as css from './teamSettings.scss';
import CustomCheckbox from '../../../components/Checkbox/Checkbox';

const deviceOut = localStorage.getItem('device_detect');

const TextfieldStyle = (props) => {
  return (
    <Input
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      theme="light"
      className={css.textfieldMini}
      required
    />
  );
};

const StyledDialog = Mui.styled(Mui.Dialog)(() => {
  return {
    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
      borderRadius: '28px',
    },
  };
});
const BootstrapInput = styled(Mui.InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: deviceOut === 'desktop' ? 4 : 30,
    position: 'relative',
    boxShadow: '0px 0px 4px rgb(0 0 0 / 10%)',
    backgroundColor: '#F2F2F0',
    border: '1px solid #ced4da',
    fontSize: 16,
    width: deviceOut === 'desktop' ? '50%' : '100%',
    padding: '10px 12px 10px 40px',
  },
}));
const intialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Analyst',
};
const VALIDATION = {
  firstName: {
    errMsg: 'Please provide first name',
    test: (v) => validateRequired(v),
  },
  lastName: {
    errMsg: 'Please provide last name',
    test: (v) => validateRequired(v),
  },

  email: {
    errMsg: 'Please provide valid email',
    test: validateEmail,
  },
  phone: {
    errMsg: 'Please provide valid mobile no.',
    test: validatePhone,
  },
};
const TeamSettings = () => {
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const { organization, user, openSnackBar, enableLoading, loading } =
    React.useContext(AppContext);
  const [teamData, setTeamData] = React.useState();
  const [searchData, setSearchData] = React.useState('');
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [showDrawer1, setShowDrawer1] = React.useState(false);
  const [showDrawer2, setShowDrawer2] = React.useState(false);
  const [popover, setPopover] = React.useState(false);
  const [popover1, setPopover1] = React.useState(false);
  const [popover2, setPopover2] = React.useState(false);
  const [memberShow, setMemberShow] = React.useState();
  const [memberRole, setMemberRole] = React.useState({
    analyst: true,
    manager: false,
    admin: false,
  });
  const [mainState, setMainState] = React.useState(intialState);
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);

  const device = localStorage.getItem('device_detect');
  const [selectedMember, setSelectedMember] = React.useState();

  const onCloseDrawer = () => {
    setShowDrawer(false);
    setMemberRole({ analyst: true, manager: false, admin: false });
    setMainState(intialState);
    setValidationErr(initialValidationErr);
  };
  const FetchData = (searchVal) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/members?search=${searchVal || ''}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        // console.log('reshere', res);
        setTeamData(res.data);
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const DeactivateMember = (id) => {
    RestApi(`organizations/${organization.orgId}/members/${id}`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then(() => {
        // console.log('reshere', res);
        setPopover1(false);
        FetchData();

        // setTeamData(res.data);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.INFO,
        });
      });
    // console.log(id, 'hereid');
  };
  const ChangeMember = () => {
    setShowDrawer2(true);
    // setShowDrawer1(false);
  };
  const ShowMembers = (id) => {
    RestApi(`organizations/${organization.orgId}/members/${id?.id}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        setMemberShow(res);
        setShowDrawer1(true);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  React.useEffect(() => {
    if (memberShow?.id) {
      RestApi(`organizations/${organization.orgId}/members/${memberShow?.id}`, {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          role: selectedMember,
        },
      })
        .then((res) => {
          ShowMembers(res);
        })
        .catch((res) => {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.INFO,
          });
        });
    }
  }, [selectedMember]);

  const SelectMember = (e) => {
    setShowDrawer2(false);
    setShowDrawer1(true);
    setSelectedMember(e);
    // console.log(e);
  };
  const EditMember = () => {
    return (
      <Mui.Stack
        className={
          device === 'desktop' ? css.headerMainStack : css.headerStackMobile
        }
      >
        <Mui.Stack direction="row" className={css.headerStack}>
          <Mui.Typography className={css.header}>
            {memberShow?.name}
          </Mui.Typography>
          {device === 'desktop' ? (
            ''
          ) : (
            <CloseIcon
              className={css.headerIcon}
              onClick={() => setShowDrawer1(false)}
            />
          )}
        </Mui.Stack>

        <Mui.Stack spacing={2} alignItems="center" mt={2}>
          <TextfieldStyle label="Email ID" value={memberShow?.email} />
          <TextfieldStyle
            label="Phone Number"
            value={memberShow?.mobile_number}
          />
          <TextfieldStyle label="Role" value={memberShow?.role} disabled />
          <Mui.Button
            variant="contained"
            className={css.filledBtn1}
            onClick={ChangeMember}
          >
            <Mui.Typography className={css.filledBtnText1}>
              change this member role
            </Mui.Typography>
          </Mui.Button>
          <Mui.Button
            variant="contained"
            className={css.unfilledBtn}
            onClick={() =>
              // DeactivateMember(memberShow.id)
              setPopover1(true)
            }
          >
            <Mui.Typography className={css.unfilledBtnText}>
              Deactivate this member
            </Mui.Typography>
          </Mui.Button>
        </Mui.Stack>
        {/* </>
        ))} */}
      </Mui.Stack>
    );
  };

  const termiate = () => {
    DeactivateMember(memberShow.id);
    // setPopover1(false);
    setPopover2(true);
  };

  const CreateMember = () => {
    RestApi(`organizations/${organization.orgId}/members`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        name: `${mainState.firstName} ${mainState.lastName}`,
        email: mainState.email,
        mobile_number: mainState.phone,
        role:
          (memberRole.analyst && 'Analyst') || memberRole.manager
            ? 'Manager'
            : 'Admin',
      },
    })
      .then((res) => {
        // console.log('reshere', res);
        // setTeamData(res.data);
        if (res && res.error) {
          openSnackBar({
            message: Object.values(res.errors).join(),
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res.message) {
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res && !res.error) {
          setMainState(intialState);
          setMemberRole({ analyst: true, manager: false, admin: false });
          setShowDrawer(false);
          setPopover(true);
        }
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  React.useEffect(() => {
    FetchData();
    // console.log('hse', searchData);
  }, []);

  const validateAllFields = (stateParam) => {
    const stateData = stateParam || mainState;
    return Object.keys(VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };
  const closePopover = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    CreateMember();
    // setShowDrawer(false);
    // setPopover(true);
  };
  const MemberAdded = () => {
    setPopover(false);
    return FetchData();
  };
  const Members = [
    {
      role: 'Analyst',
    },
    {
      role: 'Manager',
    },
    {
      role: 'Admin',
    },
  ];
  const reValidate = (name, value) => {
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };
  const onInputChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    reValidate(name, value);
    setMainState((s) => ({ ...s, [name]: value }));
  };
  return (
    <>
      {device === 'desktop' ? (
        <Mui.Stack className={css.desktop}>
          <Mui.Stack className={css.desktopSubStack}>
            <SelectBottomSheet
              open={showDrawer}
              onClose={onCloseDrawer}
              triggerComponent={
                <Mui.Stack
                  direction="row"
                  spacing={1}
                  style={{ cursor: 'pointer' }}
                >
                  <PersonAddAltIcon className={css.personIcon} />
                  <Mui.Typography
                    component="div"
                    className={css.heading}
                    onClick={() => setShowDrawer(true)}
                  >
                    Add a New Employee
                  </Mui.Typography>
                </Mui.Stack>
              }
            >
              <Mui.Stack className={css.headerMainStack}>
                <Mui.Stack direction="row" className={css.headerStack}>
                  <Mui.Typography className={css.header}>
                    ADD A NEW EMPLOYEE
                  </Mui.Typography>
                  {device === 'desktop' ? (
                    ''
                  ) : (
                    <CloseIcon
                      className={css.headerIcon}
                      onClick={onCloseDrawer}
                    />
                  )}
                </Mui.Stack>
                <Mui.Stack spacing={5} alignItems="center" mt={2}>
                  <Mui.Stack direction="row" className={css.nameStack}>
                    <TextfieldStyle
                      label="First Name"
                      style={{ width: '46%' }}
                      onChange={onInputChange}
                      name="firstName"
                      value={mainState.firstName}
                      onBlur={reValidate}
                      error={validationErr.firstName}
                      helperText={
                        validationErr.firstName
                          ? VALIDATION?.firstName?.errMsg
                          : ''
                      }
                    />
                    <TextfieldStyle
                      label="Last Name"
                      style={{ width: '50%' }}
                      onChange={onInputChange}
                      value={mainState.lastName}
                      name="lastName"
                      onBlur={reValidate}
                      error={validationErr.lastName}
                      helperText={
                        validationErr.lastName
                          ? VALIDATION?.lastName?.errMsg
                          : ''
                      }
                    />
                  </Mui.Stack>

                  <TextfieldStyle
                    label="Email ID"
                    onChange={onInputChange}
                    value={mainState.email}
                    name="email"
                    onBlur={reValidate}
                    error={validationErr.email}
                    helperText={
                      validationErr.email ? VALIDATION?.email?.errMsg : ''
                    }
                  />
                  <TextfieldStyle
                    label="Phone Number"
                    onChange={onInputChange}
                    value={mainState.phone}
                    name="phone"
                    type="number"
                    onBlur={reValidate}
                    error={validationErr.phone}
                    helperText={
                      validationErr.phone ? VALIDATION?.phone?.errMsg : ''
                    }
                  />
                  <Mui.Stack className={css.checkboxStack}>
                    <Mui.Stack className={css.checkboxStack1}>
                      <Mui.Typography className={css.heading}>
                        Role
                      </Mui.Typography>
                      <Mui.Stack>
                        <Mui.Stack direction="row" className={css.list}>
                          <CustomCheckbox
                            checked={memberRole.analyst}
                            onChange={() =>
                              setMemberRole({
                                analyst: true,
                                manager: false,
                                admin: false,
                              })
                            }
                          />
                          <Mui.Typography>Analyst</Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack direction="row" className={css.list}>
                          <CustomCheckbox
                            checked={memberRole.manager}
                            onChange={() =>
                              setMemberRole({
                                analyst: false,
                                manager: true,
                                admin: false,
                              })
                            }
                          />
                          <Mui.Typography>Manager</Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack direction="row" className={css.list}>
                          <CustomCheckbox
                            checked={memberRole.admin}
                            onChange={() =>
                              setMemberRole({
                                analyst: false,
                                manager: false,
                                admin: true,
                              })
                            }
                          />
                          <Mui.Typography>Admin</Mui.Typography>
                        </Mui.Stack>
                      </Mui.Stack>
                    </Mui.Stack>
                  </Mui.Stack>

                  <Mui.Button
                    variant="contained"
                    className={css.filledBtn}
                    onClick={() => closePopover()}
                  >
                    <Mui.Typography className={css.filledBtnText}>
                      Create Member Profile
                    </Mui.Typography>
                  </Mui.Button>
                </Mui.Stack>
              </Mui.Stack>
            </SelectBottomSheet>

            <Mui.Typography component="div" className={css.subHeading}>
              New Members
            </Mui.Typography>
            <Mui.Stack>
              <SearchIcon className={css.searchIcon} />
              <BootstrapInput
                value={searchData}
                placeholder="Search for a Employee Member"
                onChange={(e) => {
                  setSearchData(e.target.value);
                  if (e.target.value?.length > 2) {
                    FetchData(e.target.value);
                  }
                  if (e.target.value?.length === 0) {
                    FetchData();
                  }
                }}
              />
            </Mui.Stack>

            <Mui.Stack spacing={2} className={css.listStack}>
              {teamData
                ?.filter((val) => val?.active)
                ?.map((c) => (
                  <Mui.Stack
                    direction="row"
                    spacing={2}
                    className={css.avatarStack}
                    onClick={() => ShowMembers(c)}
                  >
                    <Mui.Avatar>{c?.initial}</Mui.Avatar>
                    <Mui.Typography component="div" className={css.name}>
                      {c?.name}
                    </Mui.Typography>
                  </Mui.Stack>
                ))}
              {teamData &&
                teamData?.filter((val) => val?.active)?.length === 0 && (
                  <Mui.Typography align="center">
                    {loading ? 'Data is being fetched' : 'No Data Found'}
                  </Mui.Typography>
                )}
            </Mui.Stack>
          </Mui.Stack>
        </Mui.Stack>
      ) : (
        <Mui.Stack className={css.mainStack}>
          <Mui.Card className={css.card1}>
            <Mui.Stack className={css.stack1}>
              <Mui.Typography className={css.heading}>
                NEW MEMBERS
              </Mui.Typography>
              <Mui.Stack mt={2} spacing={2}>
                <Mui.Grid container className={css.contentStack}>
                  <Mui.Grid xs={2}>
                    <Mui.Avatar
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #dfdfdf',
                      }}
                      onClick={() => setShowDrawer(true)}
                    >
                      <img src={member} alt="person" />
                    </Mui.Avatar>
                  </Mui.Grid>
                  <Mui.Grid xs={9}>
                    <SelectBottomSheet
                      open={showDrawer}
                      onClose={onCloseDrawer}
                      triggerComponent={
                        <Mui.Typography
                          className={css.text}
                          onClick={() => setShowDrawer(true)}
                        >
                          Add a New Employee
                        </Mui.Typography>
                      }
                    >
                      <Mui.Stack className={css.headerStackMobile}>
                        {/* <Puller /> */}
                        <Mui.Stack direction="row" className={css.headerStack}>
                          <Mui.Typography className={css.header}>
                            ADD A NEW EMPLOYEE
                          </Mui.Typography>
                          <CloseIcon
                            className={css.headerIcon}
                            onClick={() => onCloseDrawer()}
                          />
                        </Mui.Stack>
                        <Mui.Stack spacing={5} alignItems="center" mt={2}>
                          <Mui.Stack direction="row" className={css.nameStack}>
                            <TextfieldStyle
                              label="First Name"
                              style={{ width: '46%' }}
                              onChange={onInputChange}
                              name="firstName"
                              value={mainState.firstName}
                              onBlur={reValidate}
                              error={validationErr.firstName}
                              helperText={
                                validationErr.firstName
                                  ? VALIDATION?.firstName?.errMsg
                                  : ''
                              }
                            />
                            <TextfieldStyle
                              label="Last Name"
                              style={{ width: '50%' }}
                              onChange={onInputChange}
                              value={mainState.lastName}
                              name="lastName"
                              onBlur={reValidate}
                              error={validationErr.lastName}
                              helperText={
                                validationErr.lastName
                                  ? VALIDATION?.lastName?.errMsg
                                  : ''
                              }
                            />
                          </Mui.Stack>

                          <TextfieldStyle
                            label="Email ID"
                            onChange={onInputChange}
                            value={mainState.email}
                            name="email"
                            onBlur={reValidate}
                            error={validationErr.email}
                            helperText={
                              validationErr.email
                                ? VALIDATION?.email?.errMsg
                                : ''
                            }
                          />
                          <TextfieldStyle
                            label="Phone Number"
                            onChange={onInputChange}
                            value={mainState.phone}
                            name="phone"
                            type="number"
                            onBlur={reValidate}
                            error={validationErr.phone}
                            helperText={
                              validationErr.phone
                                ? VALIDATION?.phone?.errMsg
                                : ''
                            }
                          />
                          <Mui.Stack className={css.checkboxStack}>
                            <Mui.Stack className={css.checkboxStack1}>
                              <Mui.Typography className={css.heading}>
                                Role
                              </Mui.Typography>
                              <Mui.Stack>
                                <Mui.Stack direction="row" className={css.list}>
                                  <CustomCheckbox
                                    checked={memberRole.analyst}
                                    onChange={() =>
                                      setMemberRole({
                                        analyst: true,
                                        manager: false,
                                        admin: false,
                                      })
                                    }
                                  />
                                  <Mui.Typography>Analyst</Mui.Typography>
                                </Mui.Stack>
                                <Mui.Stack direction="row" className={css.list}>
                                  <CustomCheckbox
                                    checked={memberRole.manager}
                                    onChange={() =>
                                      setMemberRole({
                                        analyst: false,
                                        manager: true,
                                        admin: false,
                                      })
                                    }
                                  />
                                  <Mui.Typography>Manager</Mui.Typography>
                                </Mui.Stack>
                                <Mui.Stack direction="row" className={css.list}>
                                  <CustomCheckbox
                                    checked={memberRole.admin}
                                    onChange={() =>
                                      setMemberRole({
                                        analyst: false,
                                        manager: false,
                                        admin: true,
                                      })
                                    }
                                  />
                                  <Mui.Typography>Admin</Mui.Typography>
                                </Mui.Stack>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>

                          <Mui.Button
                            variant="contained"
                            className={css.filledBtn}
                            onClick={() => closePopover()}
                          >
                            <Mui.Typography className={css.filledBtnText}>
                              Create Member Profile
                            </Mui.Typography>
                          </Mui.Button>
                        </Mui.Stack>
                      </Mui.Stack>
                    </SelectBottomSheet>
                  </Mui.Grid>
                  <Mui.Grid xs={1} onClick={() => setShowDrawer(true)}>
                    <img src={RightArrow} alt="RightArrow" />
                  </Mui.Grid>
                </Mui.Grid>
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Card>

          <Mui.Card className={css.card2}>
            <Mui.Stack className={css.stack1}>
              <Mui.Typography className={css.heading}>
                NEW MEMBERS
              </Mui.Typography>
              <Mui.Stack mt={2}>
                <SearchIcon className={css.searchIcon} />
                <BootstrapInput
                  placeholder="Search for a Employee"
                  onChange={(e) => setSearchData(e.target.value)}
                />
              </Mui.Stack>
              {/* <Mui.Stack className={css.list}>
                <Mui.Stack spacing={2} className={css.listHere}> */}
              <Mui.Stack spacing={2} className={css.listHere}>
                {teamData
                  ?.filter((val) => val?.active)
                  ?.map((c) => (
                    <Mui.Stack
                      direction="row"
                      spacing={2}
                      className={css.avatarStack}
                      onClick={() => ShowMembers(c)}
                    >
                      <Mui.Avatar>{c?.initial}</Mui.Avatar>
                      <Mui.Typography component="div" className={css.name}>
                        {c?.name}
                      </Mui.Typography>
                    </Mui.Stack>
                  ))}
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Card>
        </Mui.Stack>
      )}

      <StyledDialog open={popover}>
        <Mui.Grid
          container
          style={{
            padding: '20px',
            justifyContent: 'center',
            textAlignLast: 'center',
          }}
        >
          <Mui.Typography
            variant="h6"
            align="left"
            style={{ width: '100%', padding: '10px 0' }}
          >
            Member Profile has been successfully Created
          </Mui.Typography>
          <Mui.Button
            variant="contained"
            className={css.filledBtn}
            onClick={MemberAdded}
          >
            <Mui.Typography className={css.filledBtnText}>Back</Mui.Typography>
          </Mui.Button>
        </Mui.Grid>
      </StyledDialog>

      <SelectBottomSheet
        anchor="bottom"
        variant="temporary"
        open={showDrawer1}
        onClose={() => setShowDrawer1(false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <EditMember />
      </SelectBottomSheet>

      <StyledDialog open={popover1}>
        <Mui.Stack className={css.deactivate} spacing={2}>
          <Mui.Typography className={css.deactivateHeading1}>
            Deactivate this Member
          </Mui.Typography>
          <Mui.Typography className={css.deactivateHeading2}>
            ARE YOU SURE YOU WANT TO DEACTIVATE THIS MEMBER?
          </Mui.Typography>
          <Mui.Typography className={css.deactivateHeading3}>
            Please note that terminating this Member will result in the loss of
            data and their expulsion from your Effortless Team.
          </Mui.Typography>
          <Mui.Stack className={css.deactivateBtnStack} direction="row">
            <Mui.Button
              variant="outlined"
              className={css.cancelBtn}
              onClick={() => setPopover1(false)}
            >
              <Mui.Typography className={css.cancelBtnText}>
                cancel
              </Mui.Typography>
            </Mui.Button>
            <Mui.Button
              variant="contained"
              className={css.terminateBtn}
              onClick={() => termiate()}
            >
              <Mui.Typography className={css.terminateBtnText}>
                Terminate
              </Mui.Typography>
            </Mui.Button>
          </Mui.Stack>
        </Mui.Stack>
      </StyledDialog>

      <StyledDialog open={popover2}>
        <Mui.Grid
          container
          style={{ padding: '20px', justifyContent: 'center' }}
        >
          <Mui.Typography
            variant="h6"
            align="left"
            style={{ width: '100%', padding: '10px 0' }}
          >
            Member Profile has been successfully Terminated
          </Mui.Typography>
          <Mui.Button
            variant="contained"
            className={css.filledBtn}
            onClick={() => {
              setPopover2(false);
              setShowDrawer1(false);
              setMemberRole({ analyst: true, manager: false, admin: false });
            }}
          >
            <Mui.Typography className={css.filledBtnText}>Back</Mui.Typography>
          </Mui.Button>
        </Mui.Grid>
      </StyledDialog>

      <SelectBottomSheet
        triggerComponent={<div style={{ display: 'none' }} />}
        open={showDrawer2}
        onClose={() => {
          setShowDrawer2(false);
          setMemberRole({ analyst: true, manager: false, admin: false });
        }}
        addNewSheet
      >
        <Mui.Stack
          className={
            device === 'desktop' ? css.headerMainStack : css.headerStackMobile
          }
        >
          {/* {device === 'mobile' && <Puller />} */}
          <Mui.Stack direction="row" className={css.headerStack} mt={2}>
            <Mui.Typography className={css.header}>
              ADD A NEW EMPLOYEE
            </Mui.Typography>
            {device === 'mobile' && (
              <CloseIcon
                className={css.headerIcon}
                onClick={() => setShowDrawer2(false)}
              />
            )}
          </Mui.Stack>
          <Mui.Stack>
            {Members.map((c) => {
              return (
                <Mui.Stack
                  direction="row"
                  className={css.list}
                  onClick={() => SelectMember(c?.role)}
                >
                  <CustomCheckbox
                    onClick={() => SelectMember(c?.role)}
                    checked={memberShow?.role === c?.role}
                  />
                  <Mui.Typography>{c?.role}</Mui.Typography>
                </Mui.Stack>
              );
            })}
          </Mui.Stack>
        </Mui.Stack>
      </SelectBottomSheet>
    </>
  );
};

export default TeamSettings;
