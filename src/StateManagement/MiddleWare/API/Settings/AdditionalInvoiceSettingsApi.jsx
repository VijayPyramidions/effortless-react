import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetEstimateName_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/settings`
  );
};

export const PatchEstimateName_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/settings`,
    { ...param?.eInvoicePayload }
  );
};
