import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetExpenseList_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_bills/accounted_bills?page=${
      data?.pageNum || 1
    }&group_by=expense_account&start_date=${data?.fromDate || ''}&end_date=${
      data?.endDate || ''
    }`
  );
};

export const GetAccountedBillsList_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_bills/accounted_bills/${
      data?.expense_id
    }?page=${data?.pageNum || 1}&group_by=expense_account&start_date=${
      data?.fromDate || ''
    }&end_date=${data?.endDate || ''}&period=${data?.period}`
  );
};

export const PostAccountedBillVersion_API = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/vendor_bills/${data?.bill_id}/versions`
  );
};
