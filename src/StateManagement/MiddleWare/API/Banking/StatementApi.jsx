import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetBankTxns_Api = async (data) => {
  getOrganization();
  return await axiosInst.get(
    data.provider === 'yodlee'
      ? `organizations/${organization?.orgId}/yodlee_bank_accounts/${data?.account_id}/txns?${data.params}`
      : `organizations/${organization?.orgId}/icici_bank_accounts/${data?.account_id}/txns?${data.params}`
  );
};

export const MoveTransaction_Api = async (data) => {
  getOrganization();

  return await axiosInst.patch(
    `organizations/${organization?.orgId}/yodlee_bank_accounts/${data?.id}/txn_update`,
    { ...data.payload }
  );
};
export const SyncTransactionDetails_Api = async (data) => {
  getOrganization();

  return await axiosInst.get(
    data.service_provider === 'yodlee'
      ? `organizations/${organization?.orgId}/yodlee_bank_accounts/${data?.id}/sync`
      : `organizations/${organization?.orgId}/icici_bank_accounts/${data?.bank_account_id}/sync`
  );
};
