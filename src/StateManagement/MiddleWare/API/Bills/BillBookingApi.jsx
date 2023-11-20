import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetExpenseAccountsApi = async (category) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/accounts?category_type=${category}&billable_assets=true`
  );
};

export const updateTdsApi = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/entities/${data.vendor.id}?can_deduct_tds=${data.canDeductTds}&type=vendor&tds_alert_confirmed=true`
  );
};

export const GetVendorUnsettledDetailsApi = async (vendorId) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_unsettled?unsettled_advance=true&vendor_id=${vendorId}`
  );
};

export const GetVendorListDetailsApi = async (data) => {
  getOrganization();

  if (!data?.allParties)
    return await axiosInst.get(
      `organizations/${organization.orgId}/entities?type[]=vendor&search=${
        data.searchVal || ''
      }&page=${data.pageNum || 1}`
    );

  return await axiosInst.get(
    `organizations/${organization.orgId}/entities?search=${
      data.searchVal || ''
    }&page=${data.pageNum || 1}`
  );
};

export const GetOrgLocationDetailsApi = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/locations`);
};

export const GetOrgSettingDetailsApi = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/settings`);
};

export const GetAllLocationDetailsApi = async (id) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendors/${id}/locations?show=all`
  );
};

export const GetOcrDetails = async (data) => {
  getOrganization();

  if (data?.id)
    return await axiosInst.patch(
      `organizations/${organization.orgId}/vendor_bills/${data?.id}?ocr=true`,
      data?.payload
    );

  return await axiosInst.post(
    `organizations/${organization.orgId}/vendor_bills?ocr=true`,
    data?.payload
  );
};

export const PostEntityDetailDetailsApi = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/entities/${data.id}/create_entity_type`,
    data.payload
  );
};

export const GetOrgGstDetailApi = async (data) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/gstins`,
    data
  );
};

export const PostVendorBills = async (data) => {
  getOrganization();
  if (data?.id)
    return await axiosInst.post(
      `organizations/${organization.orgId}/vendor_bills/${data?.id}`,
      data.payload
    );

  return await axiosInst.post(
    `organizations/${organization.orgId}/vendor_bills`,
    data.payload
  );
};
