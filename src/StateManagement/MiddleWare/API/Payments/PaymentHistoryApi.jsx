import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetPaymentHistoryDetail_Api = async (data) => {
  getOrganization();
  return data.tab === 'vendor'
    ? await axiosInst.get(
        `organizations/${organization.orgId}/payment_histories?${
          data.filter
        }&page=${data.pageNum || 1}`
      )
    : await axiosInst.get(
        `organizations/${organization.orgId}/inbound_transfers?${
          data.filter
        }&page=${data.pageNum || 1}`
      );
};

export const GetVendorDataDetail_Api = async (searchVal) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/entities?type[]=vendor&search=${
      searchVal || ''
    }`
  );
};
