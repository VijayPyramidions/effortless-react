/* eslint-disable no-else-return */
/* eslint-disable no-extra-boolean-cast */
import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetReimbursementsDetails_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/settings?show=all`
  );
};

export const PostReimbursementDetails_Api = async (data) => {
  getOrganization();
  if (data.type !== 'Vehicle')
    return await axiosInst.post(
      `organizations/${organization.orgId}/reimbursements/settings`,
      { ...data }
    );
  else
    return await axiosInst.post(
      `organizations/${organization.orgId}/reimbursements/settings/${data.id}/create_version`,
      { ...data }
    );
};

export const PatchReimbursementDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/reimbursements/settings/${data.id}`,
    { ...data }
  );
};

export const GetOneReimbursementDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.get(
    !data.vehicleType
      ? `organizations/${organization.orgId}/reimbursements/settings/${data.id}`
      : `organizations/${organization.orgId}/reimbursements/settings/${data.id}?vehicle_type=${data.vehicleType}`
  );
};

export const GetMileageHistoryDetails_Api = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/settings/${id}/view_history`
  );
};
