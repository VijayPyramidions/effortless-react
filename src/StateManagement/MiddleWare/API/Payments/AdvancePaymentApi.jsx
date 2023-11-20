import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const CreateUpdateAdvPaymentDetail_Api = async (data) => {
  getOrganization();

  if (data.type === 'post')
    return await axiosInst.post(
      `organizations/${organization.orgId}/advance_payments`,
      { ...data.payload }
    );
  if (data.type === 'get')
    return await axiosInst.get(
      `organizations/${organization.orgId}/advance_payments/${data.id}`,
      { ...data.payload }
    );

  return await axiosInst.patch(
    `organizations/${organization.orgId}/advance_payments/${data.id}`,
    { ...data.payload }
  );
};

export const GetExpenceCategoryDetails_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/expense_categories`
  );
};

export const GetAssetCategoryDetails_Api = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/accounts?category_type=asset&billable_assets=true`
  );
};

export const GetVendorListDetails_Api = async (data) => {
  getOrganization();
  return await axiosInst.get(
    !data.allParties
      ? `organizations/${organization.orgId}/entities?type[]=vendor&search=${
          data.searchVal || ''
        }`
      : `organizations/${organization.orgId}/entities?search=${
          data.searchVal || ''
        }`
  );
};
