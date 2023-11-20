import React from 'react';
import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';
import JSBridge from '@nativeBridge/jsbridge';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { Avatar } from '@mui/material';
import { CallIconSearch } from '@components/SvgIcons/SvgIcons.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import * as css from './searchComponents.scss';

const SearchTabPeople = ({
  Data,
  TabClose,
  CreateRecentSearch,
  FetchContactsId,
}) => {
  const { userPermissions } = React.useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  const navigate = Router.useNavigate();
  const [userRolesPeople, setUserRolesPeople] = React.useState({});
  const [userRolesReceviables, setUserRolesReceviables] = React.useState({});
  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  // const [userRolesExpense, setUserRolesExpense] = React.useState({});
  const [userRolesPayments, setUserRolesPayments] = React.useState({});
  const [userRolesPayables, setUserRolesPayables] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.People || {})?.length > 0) {
      // if (!userPermissions?.People?.People) {
      //   setHavePermission({
      //     open: true,
      //     back: () => {
      //       setHavePermission({ open: false });
      //     },
      //   });
      // }
      setUserRolesPeople({ ...userPermissions?.People });
      setUserRolesReceviables({ ...userPermissions?.Receivables });
      setUserRolesInvoicing({ ...userPermissions?.Invoicing });
      // setUserRolesExpense({ ...userPermissions?.Expense });
      setUserRolesPayments({ ...userPermissions?.Payments });
      setUserRolesPayables({ ...userPermissions?.Payables });
    }
  }, [userPermissions]);
  const { count, ...ResData } = Data;
  const RouteWithPermission = (permission, route, state, val) => {
    if (!permission) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    CreateRecentSearch(val);
    if (state) {
      navigate(route, state);
    } else {
      navigate(route);
    }
    TabClose();
  };
  const PEOPLE_LIST = {
    customer: {
      bottomPanel: [
        {
          name: 'Follow-Up',
          click: (val) =>
            RouteWithPermission(
              userPermissions?.People?.People,
              `/people`,
              {
                state: {
                  choose: 'tab1',
                  selectedId: val?.id,
                  followUp: true,
                  selectedName: val?.name,
                },
              },
              val,
            ),
        },
        {
          name: 'Raise an Invoice',
          click: (val) =>
            RouteWithPermission(
              userRolesInvoicing.Invoicing,
              '/people-invoice-new',
              {
                state: {
                  people: {
                    id: val?.id,
                  },
                },
              },
              val,
            ),
        },
        {
          name: 'View Invoice',
          click: (val) =>
            RouteWithPermission(
              userRolesReceviables['Customer Ageing']?.view_receivable_ageing,
              '/receivables-ageing-view',
              {
                state: {
                  tableId: val?.id,
                  selectedDate: new Date(),
                  wise: '',
                  from: 'people',
                  open: 'openbills',
                },
              },
              val,
            ),
        },
        {
          name: 'View Relationship',
          click: (val) =>
            RouteWithPermission(
              userRolesReceviables['Customer Ageing']?.view_receivable_ageing,
              '/receivables-ageing-view',
              {
                state: {
                  tableId: val?.id,
                  selectedDate: new Date(),
                  wise: '',
                  from: 'people',
                  open: 'relationship',
                },
              },
              val,
            ),
        },
      ],
      tab: 'tab1',
      main: 'Customers',
      subMain: 'view_customers',
    },
    vendor: {
      bottomPanel: [
        {
          name: 'Pay an Advance',
          click: (val) =>
            RouteWithPermission(
              userRolesPayments?.Payment?.create_payment,
              `/payment-advancepayments`,
              {
                state: {
                  fromVendorSelection: {
                    id: val,
                    path: '/payment',
                  },
                },
              },
              val,
            ),
        },
        {
          name: 'Settle Open Bills',
          click: (val) =>
            RouteWithPermission(
              userRolesPayments?.Payment?.create_payment,
              '/payment-makepayment',
              {
                state: {
                  fromVendorSelection: {
                    id: val?.id,
                    path: '/payment',
                  },
                },
              },
              val,
            ),
          key: 'settle_open_bills',
        },
        {
          name: 'Request Bank Details',
          click: (val) => {
            if (!userRolesPeople?.Vendors?.create_vendors) {
              setHavePermission({
                open: true,
                back: () => {
                  setHavePermission({ open: false });
                },
              });
              return;
            }
            FetchContactsId(val?.id);
          },
          key: 'request_bank_details',
        },
        {
          name: 'View Relationship',
          click: (val) =>
            RouteWithPermission(
              userRolesPayables['Vendor Ageing']?.view_payable_ageing,
              '/payables-ageing-view',
              {
                state: {
                  tableId: val.id,
                  selectedDate: new Date(),
                  wise: '',
                  from: 'people',
                  open: 'relationship',
                  fromVendorSelection: true,
                  path: '/people',
                  backState: { choose: 'tab2' },
                },
              },
              val,
            ),
        },
      ],
      tab: 'tab2',
      main: 'Vendors',
      subMain: 'view_vendors',
    },
    employee: {
      bottomPanel: [],
      tab: 'tab3',
      main: 'Employees',
      subMain: 'view_employees',
    },
  };

  const RouteClick = (people, type, val) => {
    if (type === 'each') {
      RouteWithPermission(
        userRolesPeople?.[people?.main]?.[people?.subMain],
        `/people`,
        {
          state: {
            choose: people?.tab,
            selectedId: val?.parent_id,
            selectedName: val?.name,
          },
        },
        val,
      );
    }
  };

  return (
    <>
      {Object.keys(ResData || {})?.map((name) => (
        <div className={css.searchTabDetails}>
          <div className={css.header}>
            <p className={css.headerText}>{name}</p>
          </div>

          {ResData?.[name]?.map((element) => (
            <div className={css.bodyContPeople}>
              <div className={css.topCont}>
                <div
                  className={css.fistCont}
                  onClick={() =>
                    RouteClick(
                      {
                        main: PEOPLE_LIST?.[name]?.main,
                        subMain: PEOPLE_LIST?.[name]?.subMain,
                        tab: PEOPLE_LIST?.[name]?.tab,
                      },
                      'each',
                      element,
                    )
                  }
                >
                  <Avatar className={css.searchAvatar}>
                    {element?.name?.split('')[0]}
                  </Avatar>
                  <div className={css.searchHeadText}>
                    <p className={css.searchTitle}>{element?.name}</p>
                    <p className={css.searchAmount}>
                      O/S : {FormattedAmount(element?.amount)}
                    </p>
                  </div>
                </div>
                {device === 'mobile' && (
                  <div
                    onClick={() => {
                      JSBridge.callPhoneNumber(
                        `${element?.additional_data?.mobile_number}`,
                      );
                    }}
                  >
                    <CallIconSearch className={css.callIcon} />
                  </div>
                )}
              </div>

              {PEOPLE_LIST?.[name]?.bottomPanel?.length > 0 && (
                <div className={css.bottomCont}>
                  {PEOPLE_LIST?.[name]?.bottomPanel?.map((val) => {
                    return val?.key ? (
                      (element?.additional_data?.[val?.key] && (
                        <div
                          className={css.bottomBox}
                          onClick={() => {
                            if (val?.click) {
                              val?.click({
                                id: element?.parent_id,
                                name: element?.name,
                              });
                            }
                          }}
                        >
                          <p className={css.bottomText}>{val?.name}</p>
                        </div>
                      )) || <></>
                    ) : (
                      <div
                        className={css.bottomBox}
                        onClick={() => {
                          if (val?.click) {
                            val?.click({
                              id: element?.parent_id,
                              name: element?.name,
                            });
                          }
                        }}
                      >
                        <p className={css.bottomText}>{val?.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default SearchTabPeople;
