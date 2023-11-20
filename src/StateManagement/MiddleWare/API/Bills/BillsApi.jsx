import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetVendorBillDetails_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_bills/${data?.bill_id}`
  );
};

export const PatchVendorBillDetails_API = async (data) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/vendor_bills/${data?.bill_id}?in_queue=false`
  );
};

export const DeleteVendorBill_API = async (data) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/vendor_bills/${data?.bill_id}`
  );
};

export const GetBillsList_API = async (data) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/vendor_bills?page=${
      data?.pageNum || 1
    }${data?.filter}`
  );
};
