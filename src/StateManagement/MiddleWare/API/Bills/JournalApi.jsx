import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetJournalsDetailsApi = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/journals`);
};

export const GetOneJournalDetailApi = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/journals/${id}`
  );
};

export const PostJournalDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/journals`,
    data
  );
};

export const UpdateJournalDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/journals/${data?.id}`,
    data?.payload
  );
};

export const DeleteJournalDetailApi = async (id) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/journals/${id}`
  );
};

export const GetJournalDescDetailsApi = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/journals/description_dropdown`
  );
};

export const GetJournalAccountsDetailsApi = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/accounts?category_type=${data.category}&journal=true&search=${data.search}`
  );
};

export const GetJournalContactsDetailsApi = async (search) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/entities?type[]=promoter&type[]=lender&type[]=customer&type[]=vendor&type[]=debtor&type[]=bank&type[]=employee&type[]=shareholder&type[]=owner&type[]=government&search=${search}`
  );
};
