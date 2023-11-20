import React from 'react';
import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';
import moment from 'moment';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import * as css from './searchComponents.scss';

const paymentStatusListWithBill = [
  { id: 'company_cash', label: 'Paid with Company Cash' },
  { id: 'paid_as_advance', label: 'Paid as Advance' },
  { id: 'to_pay', label: 'To Pay' },
  { id: 'company_card', label: 'Paid with Company Card' },
  { id: 'personal', label: 'Paid Personally' },
  { id: 'company_account', label: 'Paid with Company Account' },
];

const SearchTabBill = ({ Data, TabClose }) => {
  const { userPermissions, globalSearch } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const [userRolesExpense, setUserRolesExpense] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });
  React.useEffect(() => {
    if (Object.keys(userPermissions?.Expense || {})?.length > 0) {
      // if (!userPermissions?.Expense?.Expense) {
      //   setHavePermission({
      //     open: true,
      //     back: () => {
      //       setHavePermission({ open: false });
      //     },
      //   });
      // }
      setUserRolesExpense({ ...userPermissions?.Expense });
    }
  }, [userPermissions]);
  const { count, ...ResData } = Data;

  const RouteWithPermission = (permission, route, state) => {
    if (!permission) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    if (state) {
      navigate(route, state);
    } else {
      navigate(route);
    }
    TabClose();
  };

  const EXPENSE_ROUTE = [
    {
      name: 'draft',
      path: 'bill-draft',
      state: (val) => ({ id: val?.id }),
      stateView: () => ({ search_text: globalSearch }),
      showName: 'Draft Bills',
    },
    {
      name: 'accounted',
      path: 'bill-yourbills',
      state: (val) => ({ id: val?.id }),
      stateView: () => ({ search_text: globalSearch }),
      showName: 'Your Bills',
    },
    {
      name: 'in_queue',
      path: 'bill-queue',
      state: (val) => ({ id: val?.id }),
      stateView: () => ({ search_text: globalSearch }),
      showName: 'Bills in Queue',
    },
  ];

  const RouteClick = (name, type, val) => {
    const temp = EXPENSE_ROUTE?.find((ele) => ele?.name === name);
    if (type === 'viewAll') {
      RouteWithPermission(userRolesExpense?.Expense, `/${temp?.path}`, {
        state: temp?.stateView(val),
      });
    } else if (type === 'each') {
      RouteWithPermission(
        userRolesExpense?.['Bill Booking']?.view_bills,
        `/${temp?.path}?id=${val?.id}`,
        { state: temp?.state(val) },
      );
    }
  };

  return (
    <>
      {Object.keys(ResData || {})?.map((name) => (
        <div className={css.searchTabDetails}>
          <div className={css.header}>
            <p className={css.headerText}>
              {EXPENSE_ROUTE?.find((data) => data?.name === name)?.showName ||
                '-'}
            </p>
            <div onClick={() => RouteClick(name, 'viewAll', ResData?.[name])}>
              <p className={css.viewText}>View All</p>
            </div>
          </div>

          {ResData?.[name]?.map((element, index) => (
            <div className={css.bodyContInvoice}>
              <div className={css.eachCont}>
                <div className={css.topTextCont}>
                  <div className={css.topfirstTextCont}>
                    <span>{index + 1}.</span>
                    <div onClick={() => RouteClick(name, 'each', element)}>
                      <p className={css.topId}>{element?.name || '-'}</p>
                    </div>
                  </div>
                  <p className={css.topAmonut}>
                    {FormattedAmount(element?.amount)}
                  </p>
                </div>
                <div className={css.bottomTextContBill}>
                  {/* <p className={css.bottomDate}>
                    {element?.additional_data?.date
                      ? moment(element?.additional_data?.date)?.format(
                          'DD/MM/YYYY',
                        )
                      : '-'}
                  </p> */}
                  <p className={css.bottomInfo}>
                    {element?.additional_data?.date && (
                      <span className={css.bottomDate}>
                        {moment(element?.additional_data?.date)?.format(
                          'DD/MM/YYYY',
                        )}
                      </span>
                    )}
                    <span style={{ fontWeight: 200 }}>Payment Mode</span>{' '}
                    {
                      paymentStatusListWithBill?.find(
                        (data) =>
                          data?.id === element?.additional_data?.payment_mode,
                      )?.label
                    }{' '}
                    {element?.additional_data?.status === 'accounted' && (
                      <>
                        <span style={{ fontWeight: 200 }}>Status</span>{' '}
                        {element?.additional_data?.status}
                      </>
                    )}
                  </p>
                </div>
              </div>
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

export default SearchTabBill;
