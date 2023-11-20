import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetBankLists_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing`
  );
};

export const SyncIciciAccount_Api = async (bankaAcountId) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization?.orgId}/bank_users/${bankaAcountId}`
  );
};

export const SetAccPreference_Api = async (name) => {
  getOrganization();

  return name
    ? await axiosInst.patch(`organizations/${organization.orgId}/settings`, {
        founder_account_name: name,
      })
    : await axiosInst.get(`organizations/${organization.orgId}/settings`);
};

export const GetBorrowingList_Api = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/borrowings`);
};

export const GetEMIStatement_Api = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/borrowings/${id}`
  );
};

export const GetLoanDetails_Api = async (type) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/borrowings/other_loans?promoter=${
      type === 'Loan from Others' ? 'false' : 'true'
    }`
  );
};

export const SyncAccount_Api = async (data) => {
  getOrganization();
  const type =
    data?.type === 'enable' ? 'enable_bank_sync' : 'disable_bank_sync';
  return await axiosInst.patch(
    `organizations/${organization.orgId}/bank_accounts/${data.id}/${type}`
  );
};

export const UpdateAccountStatus_Api = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/bank_accounts/${data.acccountID}`,
    {
      account_status: data.status,
    }
  );
};

export const DeleteAccount_Api = async (accountId) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/bank_accounts/${accountId}`
  );
};

export const GetLenders_Api = async (search) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/entities?type[]=lender&search=${search}`
  );
};

export const AddBorrowing_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/borrowings`,
    {
      ...data,
    }
  );
};

export const OtherBankAddManually_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/bank_accounts`,
    {
      ...data,
    }
  );
};

export const AddCashAccountDetail_Api = async () => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/bank_accounts`,
    {
      account_type_sub_category: 'cash',
    }
  );
};

export const EditCashAccountDetail_Api = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/bank_accounts/${data.id}`,
    {
      ...data.payload,
    }
  );
};

export const DeleteCashAccountDetail_Api = async (id) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/bank_accounts/${id}`,
    {
      id,
      deactivate: true,
    }
  );
};

export const MergeBankAccountDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/merge_bank_requests`,
    data
  );
};
