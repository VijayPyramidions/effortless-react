import axiosInst from '@action/ApiConfig/AxiosInst';

let organization = JSON.parse(localStorage.getItem('selected_organization'));

const getOrganization = () => {
  organization = JSON.parse(localStorage.getItem('selected_organization'));
};

export const GetInvoiceDashboard_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/invoices/dashboard?date=${param?.durationDate}`
  );
};

export const GetInvoiceDashboardForCustomer_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/invoices/dashboard/${param?.customerid}?date=${param?.durationDate}`
  );
};

export const GetInvoiceDraft_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/invoices/drafts?order=${
      param?.order || ''
    }&order_by=${param?.orderBy || 'date'}&${
      param?.filterCustomer || ''
    }&start_date=${param?.fromDate || ''}&end_date=${
      param?.toDate || ''
    }&page=${param?.numPage || 1}`
  );
};

export const GetInvoiceOrgLocation_API = async () => {
  getOrganization();
  return await axiosInst.get(`organizations/${organization.orgId}/locations`);
};

export const GetInvoiceCustomerLocation_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/customers/${param?.customerId}/locations`
  );
};

export const GetInvoiceItems_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    param?.invoiceId
      ? `organizations/${organization.orgId}/items?type=invoice&customer_id=${param?.customerId}&invoice_id=${param?.invoiceId}`
      : `organizations/${organization.orgId}/items?type=invoice&customer_id=${
          param?.customerId || ''
        }`
  );
};

export const PostCreateInvoiceItems_API = async (param) => {
  getOrganization();
  return await axiosInst.post(`organizations/${organization.orgId}/items`, {
    ...param?.invoiceItemCreateParam,
  });
};

export const PatchUpdateInvoiceItems_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/items/${param?.itemId}`,
    { ...param?.invoiceItemUpdateParam }
  );
};

export const GetInvoiceCurrency_API = async () => {
  getOrganization();
  return await axiosInst.get(`currencies`);
};

export const GetInvoiceBankData_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${
      organization.orgId
    }/bank_accounts?active=true&search_text=${param?.searchText || ''}`
  );
};

export const GetInvoiceSalesPerson_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${
      organization.orgId
    }/members/role_users?role=Sales Person&search_text=${
      param?.searchText || ''
    }`
  );
};

export const PostInvoiceCreateNew_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }`,
    { ...param?.createNewPayload }
  );
};

export const PatchInvoiceUpdate_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }/${param?.invoiceId}`,
    { ...param?.updateInvoiceParam }
  );
};

export const GetInvoiceById_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }/${param?.invoiceId}`
  );
};

export const PostCustomerLocation_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/customers/${param?.customerId}/locations`,
    { ...param?.customerLocationCreateParam }
  );
};

export const PostGenerateNewInvoice_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${param?.invoiceId}/generates`
  );
};

export const DeleteInvoice_API = async (param) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }/${param?.invoiceId}`
  );
};

export const GetFetchLineItems_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }/${param?.invoiceId || ''}/line_items`
  );
};

export const PostCreateLineItems_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }/${param?.invoiceId}/line_items`,
    { ...param?.lineItemCreateParam }
  );
};

export const PatchUpdateLineItems_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }/${param?.invoiceId}/line_items/${param?.lineItemId}`,
    { ...param?.lineItemUpdateParam }
  );
};

export const DeleteLineItems_API = async (param) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/${
      param?.activeInvoiceSubject || 'invoices'
    }/${param?.invoiceId}/line_items/${param?.lineItemId}`
  );
};

export const GetInvoiceUnapproved_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/invoices/unapproved?order=${
      param?.order || ''
    }&order_by=${param?.orderBy || ''}&${
      param?.filterCustomer || ''
    }&start_date=${param?.fromDate || ''}&end_date=${
      param?.toDate || ''
    }&page=${param?.numPage || 1}`
  );
};

export const GetInvoiceApproved_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    param?.from === 'e_way_bill'
      ? `organizations/${organization.orgId}/invoices/approved?page=${
          param?.numPage || 1
        }&without_e_way_bills=${!!param?.without_e_way_bills}&e_way_bill_excluded=${!!param?.e_way_bill_excluded}&type=${
          param?.typeFilter || ''
        }&status=${param?.statusFilter || ''}&order=${param?.order || ''}&${
          param?.filterCustomer || ''
        }&start_date=${param?.fromDate || ''}&end_date=${param?.toDate || ''}`
      : `organizations/${organization.orgId}/invoices/approved?type=${
          param?.typeFilter || ''
        }&status=${param?.statusFilter || ''}&order=${
          param?.order || ''
        }&order_by=${param?.orderBy || ''}&${
          param?.filterCustomer || ''
        }&start_date=${param?.fromDate || ''}&end_date=${
          param?.toDate || ''
        }&page=${param?.numPage || 1}`
  );
};

export const GetInvoiceRecurring_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/customer_agreements?page=${
      param?.numPage || 1
    }`
  );
};

export const GetRecurringInvoiceHistoryById_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/customer_agreements/${param?.invoiceId}/invoices`
  );
};

export const PostRecurringInvoiceFileUpload_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/customer_agreements/${param?.invoiceId}`,
    { document: param?.document, document_type: param?.documentType }
  );
};

export const PostInvoiceBulkUpload_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/${param?.apiURL}`,
    { ...param?.payloadData }
  );
};

export const GetStatusInvoiceBulkUpload_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/data_uploads/${param?.dataId}`
  );
};

export const GetInvoiceCustomFields_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/invoice_custom_fields`
  );
};

export const PostCancelApprovedInvoice_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${param?.invoiceId}/cancellations`
  );
};

export const PostDeclineUnApprovedInvoice_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${param?.invoiceId}/declines`
  );
};

export const PostApproveUnApprovedInvoice_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/batches/approve`,
    { ids: param?.selectedCustomer }
  );
};

export const GetSingleItemsDetails_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/items/${param?.updateItemId || ''}`
  );
};

export const GetItemsProductsList_API = async () => {
  getOrganization();
  return await axiosInst.get(`products`);
};

export const GetItemsServicesList_API = async () => {
  getOrganization();
  return await axiosInst.get(`services`);
};

export const GetInvoiceDeliverEmailTemplate_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/email_templates?mail_type=${
      param?.documentType === 'estimate' ? 'Estimate' : 'Invoice'
    }&show_default=true`
  );
};

export const GetInvoiceDeliverContactList_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/customers/${
      param?.customerId || ''
    }/contacts`
  );
};

export const PostInvoiceDeliverToCustomer_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/document_email_notifications`,
    { ...param?.deliverPayload }
  );
};

export const PostInvoiceDeliverNewContact_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/customers/${param?.customerId}/contacts`,
    { ...param?.newContactPayload }
  );
};

export const GetInvoiceUnsettledPayments_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/customer_unsettled?customer_id=${
      param?.customerId || ''
    }&unsettled_advance=true`
  );
};

export const GetRasiedInvoiceList_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/invoices?page=1&customer_id=${
      param?.customerId || ''
    }`
  );
};

export const PostEstimateToTaxInvoice_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/generate_estimate`
  );
};

export const PostInvoiceVersion_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/versions`
  );
};

export const RetryEInvoiceDetail_Api = async (invoiceId) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${invoiceId}/e_invoices/retry`
  );
};
export const PatchInvoiceUpdateEWayBill_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/e_way_bills/draft`,
    { ...param?.createEWayBill }
  );
};
export const PostInvoiceEWayBill_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/e_way_bills`,
    { ...param?.createEWayBill }
  );
};
export const PostTransportersCreate_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/transporters`,
    { ...param?.createTransporters }
  );
};

export const GetTransportersList_API = async () => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/transporters`
  );
};

export const GetInvoiceGeneratedEWayBills_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/e_way_bills?page=${
      param?.numPage || 1
    }&type=${param?.typeFilter || ''}&status=${
      param?.statusFilter || ''
    }&order=${param?.order || ''}&${param?.filterCustomer || ''}&start_date=${
      param?.fromDate || ''
    }&end_date=${param?.toDate || ''}`
  );
};

export const GetIndividualInvoiceEWayBill_API = async (param) => {
  getOrganization();
  return await axiosInst.get(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/e_way_bills/${param?.EWayBillId || ''}`
  );
};

export const DeleteInvoiceEWayBillPDF_API = async (param) => {
  getOrganization();
  return await axiosInst.delete(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/e_way_bills/${param?.EWayBillId || ''}`
  );
};

export const PostInvoiceEWayBillNewVehicle_API = async (param) => {
  getOrganization();
  return await axiosInst.post(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/e_way_bills/${param?.EWayBillId || ''}/transportation_details`,
    { ...param?.updateEWayBill }
  );
};

export const PatchDeactivateInvoiceEWayBill_API = async (param) => {
  getOrganization();
  return await axiosInst.patch(
    `organizations/${organization.orgId}/invoices/${
      param?.invoiceId || ''
    }/e_way_bills/${param?.EWayBillId || ''}`
  );
};
