import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const EntityUpdate_Api = async ({ paidToId, payload }) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization?.orgId}/entities/${paidToId}/create_entity_type`,
    { ...payload }
  );
};

export const postBillSettlement_Api = async (payload) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization?.orgId}/yodlee_bank_accounts/categorization`,
    { ...payload }
  );
};

export const GetContraBanks_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization?.orgId}/bank_accounts/connected_bankings`
  );
};
