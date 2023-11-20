import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetPayemenstDetails_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/dashboard/payments`
  );
};

export const GetVendorPayments_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_unsettled?grouped=true`
  );
};

export const MakeQuickPayment_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/quick_payments`,
    { ...data }
  );
};

export const FetchVirtualAccount_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/effortless_virtual_accounts`
  );
};

export const GetBankAccountsDetails_Api = async (VoucherId) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/payment_vouchers/${VoucherId}/bank_accounts`
  );
};
