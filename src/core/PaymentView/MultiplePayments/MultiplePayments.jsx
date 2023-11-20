/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import {
  validatePrice,
  validateRequired,
  validateGst,
} from '@services/Validation.jsx';
import AppContext from '@root/AppContext.jsx';
import { Button, makeStyles, Chip } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import { toInr } from '@services/Utils.js';
import Input from '@components/Input/Input.jsx';
// import VendorList from '@core/PaymentView/shared/VendorList';
import * as Router from 'react-router-dom';
import PageTitle from '@core/DashboardView/PageTitle';
import SuccessView from '@core/BillBookView/shared/SuccessView';
import VendorSelection from './VendorSelection';
import VendorBillSelection from './VendorBillSelection';
import VendorBillEdit from './VendorBillEdit';
import VendorBillList from './VendorBillList';
import VendorBillSummary from './VendorBillSummary';
import * as css from './MultiplePayments.scss';

const useStyles = makeStyles(() => ({
  chips: {
    minWidth: '80px',
    margin: '0 10px',
  },
  active: {
    background: '#f2d4cd',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
    fontWeight: 'bold',
  },
}));

export const VIEW = {
  VendorSelection: 1,
  BillSelection: 2,
  BillEdit: 3,
  BillList: 4,
  BillSummary: 5,
  Success: 6,
};

export const actionBtnName = {
  1: 'Next',
  2: 'Next',
  3: 'Done',
  4: 'Confirm',
};

export const editList = [
  { id: 'delete', label: 'Delete' },
  { id: 'edit', label: 'Edit' },
];

export const bankAccountList = [
  { id: '1', label: 'HDFC - XXXXXXXXXXXX0394' },
  { id: '2', label: 'HDFC - XXXXXXXXXXXX8945' },
];

const MultiplePayments = ({ className, singleVendorPayment }) => {
  const { changeSubView, organization, enableLoading, user, openSnackBar } =
    useContext(AppContext);
  const navigate = Router.useNavigate();
  const classes = useStyles();
  const [vendorList, setVendorList] = useState([]);
  const [bankAccount, setBankAccount] = useState([]);
  // const [state, setState] = useState(initialState);
  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEW.SelectVendor);
  const [title, setTitle] = useState('');
  // Vendor Selection View
  const [vendorSelected, setVendorSelected] = useState([]);

  // Vendor Bill Selection View
  const [selectedBills, setSelectedBills] = useState([]);

  // Bill List View
  const [deleteMode, setDeleteMode] = useState(false);

  // Bill Edit
  const [paymentVoucher, setPaymentVoucher] = useState();
  const [voucherItems, setVoucherItems] = useState([]);

  const [drawer, setDrawer] = useState({
    edit: false,
    bankAccount: false,
  });

  const getBanksByVendor = async (vendorId) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendors/${vendorId}/bank_details`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          res.data.map((a) =>
            Object.assign(a, {
              label: `${
                a.bank_name
              }- **** **** **** ${a?.bank_account_number?.substr(
                a?.bank_account_number.length - 4,
                4
              )}`,
            })
          );
          setBankAccount(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const moveToBillSelection = () => {
    setPage(VIEW.BillSelection);
  };

  const onPageNext = async () => {
    // validate
    if (page === VIEW.VendorSelection && vendorSelected.length <= 0) return;
    if (page === VIEW.VendorSelection) {
      setSelectedBills([]);
    }
    if (page === VIEW.BillSelection && selectedBills.length <= 0) return;

    if (page === VIEW.BillEdit) {
      const toPayInvalid = voucherItems.some((vi) => {
        const voucherBill = selectedBills.find(
          (sb) => sb.id === vi.txn_line_id
        );
        return voucherBill.net_balance < vi.amount;
      });
      if (toPayInvalid) {
        openSnackBar({
          message: 'To Pay should be less than pending amount',
          type: 'error',
        });
        return;
      }
    }

    if (page < 6) setPage((p) => p + 1);
    // change

    // general reset page
    if (deleteMode) setDeleteMode(false);
  };

  const onPagePrev = () => {
    if (page > 1) setPage((p) => p - 1);
    if (page === 1 || page === 6) changeSubView('paymentView');
  };

  const onInputChange = (ps) => {
    const [name, value] = getEventNameValue(ps);
    // setState((s) => ({ ...s, [name]: value }));
  };

  const handleBottomSheet = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (name === 'edit') {
      if (data?.id === 'edit') onPagePrev();
      if (data?.id === 'delete') setDeleteMode(true);
    }
    // if (data) setState((s) => ({ ...s, [name]: data }));
    // if (state[name] && !data) return;
  };

  const vendorClick = (v) => {
    handleBottomSheet('vendor', v);
    const newVendors = vendorList.map((item) => {
      if (item.id === v.id) {
        const updatedItem = {
          ...item,
        };

        return updatedItem;
      }

      return { ...item };
    });
    setVendorList(newVendors);
  };

  return (
    <>
      <PageTitle
        title="Payments"
        onClick={onPagePrev}
        onClickAction={onPageNext}
        actionBtnLabel={actionBtnName[page]}
      />
      <div
        className={`${className} ${
          page === VIEW.BillEdit ? css.billEditView : ''
        }
                ${page === VIEW.BillList ? css.billListView : ''}`}
      >
        <div className={`${css.multiplePaymentContainer}`}>
          <div className={`${css.headerContainer} `}>
            <div className={css.headerLabel}>
              {singleVendorPayment
                ? 'Vendor Payments'
                : 'Multiple Vendor Payments'}
            </div>
            {page === VIEW.BillList && (
              <SelectBottomSheet
                name="edit"
                triggerComponent={
                  <div
                    className={`${css.edit}`}
                    onClick={() => setDrawer((ps) => ({ ...ps, edit: true }))}
                    role="button"
                  >
                    Edit
                  </div>
                }
                open={drawer.edit}
                onClose={() => handleBottomSheet('edit')}
              >
                <div className={css.bottomSheet}>
                  <div className={css.label}>
                    Would you like to delete or edit these Invoices?
                  </div>
                  {editList.map((ps) => (
                    <div
                      className={`${css.categoryOptions} ${
                        ps.id === 'delete' ? css.delete : ''
                      }`}
                      onClick={() => handleBottomSheet('edit', ps)}
                      key={ps.id}
                      role="menuitem"
                    >
                      {ps.label}
                    </div>
                  ))}
                </div>
              </SelectBottomSheet>
            )}
            <span className={css.headerUnderline} />
          </div>
          <div className={css.bodyContainer}>
            {page === VIEW.VendorSelection && (
              <VendorSelection
                {...{ vendorSelected, setVendorSelected, singleVendorPayment }}
              />
            )}
            {page === VIEW.BillSelection && (
              <VendorBillSelection
                {...{
                  selectedBills,
                  setSelectedBills,
                  vendorSelected,
                  setPaymentVoucher,
                  setVoucherItems,
                }}
              />
            )}
            {page === VIEW.BillEdit && (
              <VendorBillEdit
                {...{
                  selectedBills,
                  paymentVoucher,
                  setPaymentVoucher,
                  voucherItems,
                  setVoucherItems,
                }}
              />
            )}
            {page === VIEW.BillList && (
              <VendorBillList
                {...{
                  selectedBills,
                  setSelectedBills,
                  paymentVoucher,
                  voucherItems,
                  setVoucherItems,
                  deleteMode,
                  moveToBillSelection,
                }}
              />
            )}
            {page === VIEW.BillSummary && (
              <VendorBillSummary
                {...{
                  selectedBills,
                  setSelectedBills,
                  vendorSelected,
                  paymentVoucher,
                  onPageNext,
                  voucherItems,
                }}
              />
            )}
            {page === VIEW.Success && (
              <SuccessView
                title="Payment Successful"
                description={`You have paid ${
                  voucherItems.length
                } invoices of ${vendorSelected.length} vendor${
                  vendorSelected.length > 1 ? 's' : ''
                } successfully`}
                btnTitle="Visit Payment"
                onClick={() => {
                  changeSubView('paymentView');
                  navigate('/payment');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiplePayments;
