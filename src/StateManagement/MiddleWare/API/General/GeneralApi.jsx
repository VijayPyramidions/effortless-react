import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetState_API = async () => axiosInst.get(`states`);

// entityType - param pass from GeneralWorkers

export const GetEntityValue_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    !param?.allParties
      ? `organizations/${organization.orgId}/entities?type[]=${
          param?.entityType
        }&location=${param?.location || false}&search=${
          param?.searchText || ''
        }&page=${param?.pageNum || 1}`
      : `organizations/${organization.orgId}/entities?search=${
          param?.searchText || ''
        }&location=${param?.location || false}&page=${param?.pageNum || 1}`
  );
};

export const GetIndividualEntity_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    param?.createRelation
      ? `organizations/${organization.orgId}/entities/${
          param?.entityId || ''
        }?type=${param?.entityType || ''}&create_relation=${
          param?.createRelation
        }`
      : `organizations/${organization.orgId}/entities/${
          param?.entityId || ''
        }?type=${param?.entityType || ''}&location=${
          param?.entiyLocation || false
        }`
  );
};

export const GetPincodeDetails_API = async (param) => {
  getOrganization();
  return await axiosInst.get(`pincode_lookups?pincode=${param?.pincode}`);
};

export const VerifyPanDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(`pan_verifications`, {
    pan: data.pan,
    organization_id: organization.orgId,
  });
};

export const GetMemberList_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/members?search=${
      param?.searchText || ''
    }&page=${param?.pageNum || 1}`
  );
};
