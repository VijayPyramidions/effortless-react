import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetReceivablesRemainder_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/email_templates`
  );
};

export const PostCreateReceivablesRemainder_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/email_templates`,
    {...param?.newRemainderPayload}
  );
};

export const DeleteReceivablesRemainder_API = async (param) => {
  getOrganization();
  return await axiosInst.delete(`organizations/${organization.orgId}/email_templates/${param?.remainderTemplateId || ''}`);
};

export const GetReceivablesDuplicateRemainder_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/email_templates/${param?.remainderTemplateId || ''}/duplicate_reminder`
  );
};

export const PatchUpdateReceivablesRemainder_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/email_templates/${param?.remainderTemplateId || '' || ''}`,
    {...param?.editRemainderPayload}
  );
};