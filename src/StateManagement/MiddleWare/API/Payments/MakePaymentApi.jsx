import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetUnSettledVendorBills_Api = async (vendorId) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_unsettled?${
      vendorId ? `vendor_id=${vendorId}` : 'grouped=true'
    }`
  );
};

export const PostPaymentVoucher_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/payment_vouchers`,
    { ...data }
  );
};

export const GetPaymentBankAccounts_Api = async (VoucherId) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/payment_vouchers/${VoucherId}/bank_accounts`
  );
};

export const CreateGetVoucherItems_Api = async (data) => {
  getOrganization();
  if (data.type === 'get')
    return await axiosInst.get(
      `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items`
    );

  return await axiosInst.post(
    `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items`,
    { ...data.body }
  );
};

export const DeleteUpdateVoucherDetail_Api = async (data) => {
  getOrganization();
  if (data.type === 'delete')
    return await axiosInst.delete(
      `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items/${data.id}`
    );

  return await axiosInst.patch(
    `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items/${data.id}`,
    { ...data.body }
  );
};

export const BulkDeleteVouchersDetail_Api = async (data) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/delete_items?${data.queryParam}`
  );
};

export const RefreshVoucherItemDetail_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/quick_payments`,
    { ...data }
  );
};

export const RetryPaymentsMethod_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/payment_orders`,
    { ...data }
  );
};
