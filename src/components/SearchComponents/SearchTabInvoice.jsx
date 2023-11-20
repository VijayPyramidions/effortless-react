import React from 'react';
import AppContext from '@root/AppContext.jsx';
import * as Router from 'react-router-dom';
import moment from 'moment';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import * as css from './searchComponents.scss';

const INVOICE_TYPES = [
  {
    text: 'Tax Invoice',
    payload: 'tax_invoice',
  },
  {
    text: 'Estimate',
    payload: 'estimate',
  },
  {
    text: 'Credit Note',
    payload: 'credit_note',
  },
  {
    text: 'Debit Note',
    payload: 'debit_note',
  },
];

const SearchTabInvoice = ({ Data, TabClose }) => {
  const { userPermissions, setActiveInvoiceId, globalSearch } =
    React.useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  const navigate = Router.useNavigate();
  const [userRolesInvoicing, setUserRolesInvoicing] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Invoicing || {})?.length > 0) {
      // if (!userPermissions?.Invoicing?.Invoicing) {
      //   setHavePermission({
      //     open: true,
      //     back: () => {
      //       setHavePermission({ open: false });
      //     },
      //   });
      // }
      setUserRolesInvoicing({ ...userPermissions?.Invoicing });
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
      navigate(route, state, { replace: true });
    } else {
      navigate(route);
    }
    TabClose();
  };

  const INVOICE_ROUTE = [
    {
      name: 'draft',
      path: 'invoice-draft-new',
      viewAllPath: 'invoice-draft',
      state: (val) => {
        setActiveInvoiceId({
          activeInvoiceId: val?.id,
        });
        return { type: 'draft' };
      },
      estimate: userRolesInvoicing?.Estimate?.edit_estimate,
      taxInvoice: userRolesInvoicing?.['Tax Invoice']?.edit_invoices,
    },
    {
      name: 'approved',
      path: 'invoice-approved-pdf',
      viewAllPath: 'invoice-approved',
      state: (val) => ({
        id: val?.id,
        type: 'approved',
        name: val?.parent_name,
        documentType: val?.additional_data?.type,
        startDateDef: val?.additional_data?.date,
        approvedAccess: userRolesInvoicing,
      }),
      estimate: userRolesInvoicing?.Estimate?.view_estimate,
      taxInvoice: userRolesInvoicing?.['Tax Invoice']?.view_invoices,
    },
    {
      name: 'cancelled',
      path: 'invoice-approved-pdf',
      viewAllPath: 'invoice-approved',
      state: (val) => ({
        id: val?.id,
        type: 'approved',
        name: val?.parent_name,
        documentType: val?.additional_data?.type,
        startDateDef: val?.additional_data?.date,
        approvedAccess: userRolesInvoicing,
      }),
      estimate: userRolesInvoicing?.Estimate?.view_estimate,
      taxInvoice: userRolesInvoicing?.['Tax Invoice']?.view_invoices,
    },
    {
      name: 'unapproved',
      path: 'invoice-unapproved-pdf',
      viewAllPath: 'invoice-unapproved',
      state: (val) => ({
        id: val?.id,
        type: 'unApproved',
        params: 5,
        documentType: val?.document_type,
        approvedAccess: userRolesInvoicing,
      }),
      estimate: userRolesInvoicing?.Estimate?.view_estimate,
      taxInvoice: userRolesInvoicing?.['Tax Invoice']?.view_invoices,
    },
    {
      name: 'recurring',
      path: 'invoice-recurring-view',
      viewAllPath: 'invoice-recurring',
      state: (val) => ({
        id: val?.id,
        recurringAccess: userRolesInvoicing?.Contract,
      }),
      estimate: userRolesInvoicing?.Contract?.view_recurring_invoices,
      taxInvoice: userRolesInvoicing?.Contract?.view_recurring_invoices,
    },
  ];

  const RouteClick = (name, type, val) => {
    const temp = INVOICE_ROUTE?.find((ele) => ele?.name === name);
    if (type === 'viewAll') {
      RouteWithPermission(
        userRolesInvoicing?.Invoicing,
        `/${temp?.viewAllPath}`,
        {
          state: { search_text: globalSearch },
        },
      );
    } else if (type === 'each') {
      RouteWithPermission(
        val?.additional_data?.type === 'estimate'
          ? temp?.estimate
          : temp?.taxInvoice,
        `/${temp?.path}?id=${val?.id}`,
        {
          state: temp?.state(val),
        },
      );
    }
  };

  return (
    <>
      {Object.keys(ResData || {})?.map((name) => (
        <div className={css.searchTabDetails}>
          <div className={css.header}>
            <p className={css.headerText}>{name}</p>
            <div onClick={() => RouteClick(name, 'viewAll')}>
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
                {name !== 'recurring' && (
                  <div className={css.bottomTextCont}>
                    {element?.additional_data?.date && (
                      <p className={css.bottomDate}>
                        {moment(element?.additional_data?.date)?.format(
                          'DD/MM/YYYY',
                        )}
                      </p>
                    )}
                    <p className={css.bottomInfo}>
                      {
                        INVOICE_TYPES?.find(
                          (invType) =>
                            invType?.payload === element?.additional_data?.type,
                        )?.text
                      }{' '}
                      <span style={{ fontWeight: 200 }}>Created by</span>{' '}
                      {element?.additional_data?.created_by}
                    </p>
                  </div>
                )}
                {name === 'recurring' && (
                  <div
                    className={css.bottomTextContRecurring}
                    style={{
                      flexDirection: device === 'mobile' ? 'column' : 'row',
                    }}
                  >
                    <p className={css.bottomDate}>
                      <span style={{ fontWeight: 200 }}>Start Date</span>
                      {element?.additional_data?.start_date
                        ? moment(element?.additional_data?.start_date)?.format(
                            'DD/MM/YYYY',
                          )
                        : '-'}
                    </p>

                    <p className={css.bottomDate}>
                      <span style={{ fontWeight: 200 }}>Created On</span>
                      {element?.additional_data?.created_at
                        ? moment(element?.additional_data?.created_at)?.format(
                            'DD/MM/YYYY',
                          )
                        : '-'}
                    </p>
                  </div>
                )}
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

export default SearchTabInvoice;
