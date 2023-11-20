import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetOrganizationSettingsDetails_Api = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/settings`);
};

export const PatchOrganizationSettingsDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/settings`,
    data?.payload
  );
};
