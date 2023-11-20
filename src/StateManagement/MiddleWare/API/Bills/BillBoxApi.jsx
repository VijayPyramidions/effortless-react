import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetBillBoxBills_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_bills?page=${
      data?.pageNum || 1
    }&scanned=${data?.scanned}&user_id=${data?.userId || ''}&search=${
      data?.searchText || ''
    }`
    // &scanned=${data?.scanned}
  );
};

export const GetVendorBillsCount_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_bills/dashboard`
  );
};

export const GetVendorBillDetails_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_bills/${data?.bill_id}`
  );
};

export const DeleteVendorBill_API = async (data) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/vendor_bills/${data?.bill_id}`
  );
};
