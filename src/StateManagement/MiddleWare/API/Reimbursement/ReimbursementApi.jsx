import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetClaimsDetails_Api = async (payload) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/claims?type=${
      payload?.type
    }&status=${payload?.status?.toLowerCase() || ''}`
  );
};

export const PostClaimsDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/reimbursements/claims`,
    data
  );
};

export const GetOneClaimDetails_Api = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/claims/${id}`
  );
};

export const UpdateClaimDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/reimbursements/claims/${data.id}`,
    data
  );
};

export const DeleteClaimDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/reimbursements/claims/${data.id}`
  );
};

export const GetReimbursementAdvancesDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursement_groups/advances?employee_id=${data.empId}&reimbursement_group_id=${data.reimbursementId}`
  );
};

export const GetTripsDetails_Api = async (payload) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/trips?type=${
      payload?.type
    }&status=${payload?.status?.toLowerCase() || ''}`
  );
};

export const PostTripDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/reimbursements/trips`,
    data
  );
};

export const EditTripDetails_Api = async (data) => {
  getOrganization();

  return await axiosInst.patch(
    `organizations/${organization.orgId}/reimbursements/trips/${data?.id}`,
    data
  );
};

export const DeleteTripDetails_Api = async (id) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/reimbursements/trips/${id}`
  );
};

export const GetManagersDetails_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/claims/show_managers`
  );
};

export const GetEmployeesDetails_Api = async (searchVal) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/members?search=${searchVal || ''}`
  );
};

export const PostFollowUpDetail_Api = async (data) => {
  getOrganization();
  if (data?.type === 'trip')
    return await axiosInst.post(
      `organizations/${organization.orgId}/reimbursements/trips/${data.id}/follow_up`,
      data.payload
    );

  return await axiosInst.post(
    `organizations/${organization.orgId}/reimbursements/claims/${data.id}/reimbursement_follow_up`,
    data.payload
  );
};

export const GetTripExpensesDetail_Api = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/trips/${id}`
  );
};

export const ApproveClaimDetail_Api = async (id) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/reimbursements/claims/${id}/approve_reimbursement`
  );
};

export const RejectClaimDetail_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/reimbursements/claims/${
      data.id
    }/reject_reimbursement?reason=${data?.reason || ''}`
  );
};

export const RaiseClaimDetail_Api = async (id) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/reimbursements/trips/${id}/bulk_claims`
  );
};

export const GetOCRDataDetail_Api = async (data) => {
  getOrganization();
  if(data?.id){
    return await axiosInst.patch(
      `organizations/${organization.orgId}/reimbursements/claims/${data?.id}`,
      { file: data?.billId,reimbursement_policy_id:data?.reimbursement_policy_id }
    );
    }
    return await axiosInst.post(
      `organizations/${organization.orgId}/reimbursements/claims`,
      { file: data?.billId,reimbursement_policy_id:data?.reimbursement_policy_id }
    );
  
};

export const FetchOCRDataDetail_Api = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/reimbursements/claims/${data?.id}`
  );
};

export const GetVoucher_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/payment_vouchers?entity_type=employee`,
    { ...data }
  );
};

export const VoucherItems_Api = async (data) => {
  getOrganization();
  if (data.type === 'get')
    return await axiosInst.get(
      `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items`
    );

  return await axiosInst.post(
    `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items`,
    { ...data.body }
  );
};

export const DeleteVoucherItem_Api = async (data) => {
  getOrganization();
  if (data.type === 'delete')
    return await axiosInst.delete(
      `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items/${data.id}`
    );

  return await axiosInst.patch(
    `organizations/${organization.orgId}/payment_vouchers/${data.VoucherId}/items/${data.id}`,
    { ...data.body }
  );
};

export const AdjustAdvanceItem_Api = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/reimbursement_groups/${data.id}/advances`,
    { ...data.payload }
  );
};

export const TripAdjustItem_Api = async (tripId) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/reimbursements/trips/${tripId}/adjust_advance`
  );
};
