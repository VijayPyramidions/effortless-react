import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetEInvoice_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/e_invoice_settings`
  );
};

export const PostEInvoice_API = async () => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/e_invoice_settings`
  );
};

export const PatchEInvoice_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/e_invoice_settings`,
    { ...param?.eInvoicePayload }
  );
};

export const DeleteEInvoice_API = async () => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/e_invoice_settings`
  );
};
