import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

// Email Bills

export const GetEmailUserList_API = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/email_users`);
};

export const GetEmailBillsList_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    data?.emailListId
      ? `organizations/${organization.orgId}/email_users/${
          data?.emailUserId
        }/email_bills?page=${data?.pageNum || 1}&email_list_id=${
          data?.emailListId || ''
        }&search=${data?.searchText || ''}`
      : `organizations/${organization.orgId}/email_users/${
          data?.emailUserId
        }/email_bills?page=${data?.pageNum || 1}&search=${
          data?.searchText || ''
        }`
  );
};

export const GetEmailBillsProviderCategory_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/expense_categories`
  );
};

export const PostNewProvider_API = async (data) => {
  getOrganization();
  if (data?.type === 'edit') {
    return await axiosInst.patch(
      `organizations/${organization.orgId}/email_users/${data?.emailUserId}/email_lists/${data?.emailListId}`,
      data?.payload
    );
  }
  return await axiosInst.post(
    `organizations/${organization.orgId}/email_users/${data?.emailUserId}/email_lists`,
    data?.payload
  );
};

export const PostNewEmailUser_API = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/email_users`,
    data?.payload
  );
};

export const PostEmailSync_API = async (data) => {
  getOrganization();
  if (data?.syncNow) {
    return await axiosInst.post(
      `organizations/${organization.orgId}/email_users/${data?.emailUserId}/sync_now`,
      data?.payload
    );
  }
  return await axiosInst.patch(
    `organizations/${organization.orgId}/email_users/${data?.emailUserId}`,
    data?.payload
  );
};

export const DeleteEmail_API = async (data) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/email_users/${data?.emailUserId}`
  );
};

export const GetSingleEmailBill_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/email_users/${data?.emailUserId}/email_bills/${data?.emailBillId}`
  );
};

export const DeleteEmailBill_API = async (data) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/email_users/${data?.emailUserId}/email_bills/${data?.emailBillId}`
  );
};

export const DeleteEmailProvider_API = async (data) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/email_users/${data?.emailUserId}/email_lists/${data?.emailListId}`
  );
};

// Email List

export const GetAllEmailListData_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/email_users/${
      data?.emailUserId
    }/email_lists?page=${data?.pageNum || 1}`
  );
};
