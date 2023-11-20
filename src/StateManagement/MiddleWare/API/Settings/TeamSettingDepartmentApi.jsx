import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetDepartmentDetailsApi = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/departments`);
};

export const GetOneDepartmentDetailApi = async (depId) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/departments/${depId}`
  );
};

export const PostDepartmentDetailsApi = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/departments`,
    data
  );
};

export const UpdateDepartmentDetailsApi = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/departments/${data.id}`,
    data.payload
  );
};

export const DeleteDepartmentDetailApi = async (depId) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/departments/${depId}`
  );
};

export const GetManagerDetailsApi = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/departments/manager_list`
  );
};
