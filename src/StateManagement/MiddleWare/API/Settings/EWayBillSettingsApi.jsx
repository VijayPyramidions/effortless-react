import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetEWayBill_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/e_way_bill_settings`
  );
};

export const PostEWayBill_API = async () => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/e_way_bill_settings`
  );
};

export const PatchEWayBill_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/e_way_bill_settings`,
    { ...param?.eWayBillPayload }
  );
};

export const DeleteEWayBill_API = async () => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/e_way_bill_settings`
  );
};
