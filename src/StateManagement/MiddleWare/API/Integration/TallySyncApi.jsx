import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetSyncDetailApi = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/sync_triggers`
  );
};

export const GetOneSyncDetailApi = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/sync_triggers/${id}`
  );
};

export const PostSyncDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/sync_triggers`,
    data
  );
};

export const GetSyncHistoryDetailApi = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/sync_triggers/show_history`
  );
};

export const GetSyncSummaryDetailApi = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/sync_triggers/${id}/summary`
  );
};

// sync log

export const GetLogDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/export_logs?sync_trigger_id=${data?.id}&page=${data?.page}`
  );
};

// config

export const GetSyncConfigDetailApi = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/tally_configs/show`
  );
};

export const PostSyncConfigDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/tally_configs`,
    data
  );
};

export const UpdateSyncConfigDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/tally_configs/update`,
    data
  );
};

// mapping

export const GetSyncMappingDetailApi = async (source) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/account_mappings?source=${source}`
  );
};

export const PostSyncMappingDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/account_mappings/${data?.id}`,
    data?.payload
  );
};

export const PostSyncMappingSuperDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/account_mappings/submit_to_super_accountant`,
    data
  );
};
