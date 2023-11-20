import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';

export const fetchExpenseCategoryDetails = (
  organization,
  user,
  openSnackBar,
  transferData
) => {
  const params = {
    category_type: 'expense_category',
  };
  const tquery = Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  const query = `?${tquery}`;
  const urls = `organizations/${organization?.orgId}/accounts${query}`;
  RestApi(urls, {
    method: METHOD.GET,
    headers: {
      Authorization: `Bearer ${user?.activeToken}`,
    },
  })
    .then((res) => {
      transferData(res, 1);
    })
    .catch((e) => {
      openSnackBar({
        message: e.message,
        type: MESSAGE_TYPE.INFO,
      });
    });
};

export const fetchIncomeCategoryDetails = (
  organization,
  user,
  openSnackBar,
  transferData
) => {
  const urls = `organizations/${organization?.orgId}/income_categories`;
  RestApi(urls, {
    method: METHOD.GET,
    headers: {
      Authorization: `Bearer ${user?.activeToken}`,
    },
  })
    .then((res) => {
      transferData(res, 2);
    })
    .catch((e) => {
      openSnackBar({
        message: e.message,
        type: MESSAGE_TYPE.INFO,
      });
    });
};

export const fetchTowardsDetails = (
  organization,
  user,
  openSnackBar,
  transferData
) => {
  const urls = `organizations/${organization?.orgId}/accounts/categorization_account_list`;
  RestApi(urls, {
    method: METHOD.GET,
    headers: {
      Authorization: `Bearer ${user?.activeToken}`,
    },
  })
    .then((res) => {
      transferData(res, 3);
    })
    .catch((e) => {
      openSnackBar({
        message: e.message,
        type: MESSAGE_TYPE.INFO,
      });
    });
};

export const fetchBankTransactions = (
  restricttodate,
  fdate,
  tdate,
  bankid,
  fromDate,
  toDate,
  completedPages,
  organization,
  user,
  openSnackBar,
  transferData
) => {
  const finaldata = {};
  let fromdate = new Date();
  let todate = new Date();
  if (!restricttodate) {
    let fmonth = String(fromDate.getMonth() + 1);
    if (fmonth.length < 2) {
      fmonth = `0${fmonth}`;
    }
    let tmonth = String(toDate.getMonth() + 1);
    if (tmonth.length < 2) {
      tmonth = `0${tmonth}`;
    }
    let fday = String(fromDate.getDate());
    if (fday.length < 2) {
      fday = `0${fday}`;
    }
    let tday = String(toDate.getDate());
    if (tday.length < 2) {
      tday = `0${tday}`;
    }
    fromdate = `${fromDate.getFullYear()}-${fmonth}-${fday}`;
    todate = `${toDate.getFullYear()}-${tmonth}-${tday}`;
    finaldata.fromdate = fromdate;
    finaldata.todate = todate;
  } else {
    let nfdate = '';
    if (!fdate) {
      nfdate = fromDate;
    } else {
      nfdate = fdate;
    }
    let ntdate = '';
    if (!tdate) {
      ntdate = toDate;
    } else {
      ntdate = tdate;
    }
    let fmonth = String(nfdate.getMonth() + 1);
    if (fmonth.length < 2) {
      fmonth = `0${fmonth}`;
    }
    let tmonth = String(ntdate.getMonth() + 1);
    if (tmonth.length < 2) {
      tmonth = `0${tmonth}`;
    }
    let fday = String(nfdate.getDate());
    if (fday.length < 2) {
      fday = `0${fday}`;
    }
    let tday = String(ntdate.getDate());
    if (tday.length < 2) {
      tday = `0${tday}`;
    }
    fromdate = `${nfdate.getFullYear()}-${fmonth}-${fday}`;
    todate = `${ntdate.getFullYear()}-${tmonth}-${tday}`;
    finaldata.fromdate = fromdate;
    finaldata.todate = todate;
  }

  const params = {
    from_date: fromdate,
    to_date: todate,
    sort_by: 'date:asc',
    page: completedPages,
  };

  const tquery = Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  const query = `?${tquery}`;
  let url = '';
  //        if (bankid){
  url = `organizations/${organization?.orgId}/yodlee_bank_accounts/${bankid}/txns${query}`;
  //       }else{
  //            url = `organizations/${organization?.orgId}/yodlee_bank_accounts/${SelectedBankID}/txns${query}`;
  //        }
  RestApi(url, {
    method: METHOD.GET,
    headers: {
      Authorization: `Bearer ${user?.activeToken}`,
    },
  })
    .then((res) => {
      if (res && !res.error) {
        if (res.message) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.WARNING,
          });
        } else if (!res.message) {
          if (res && res.data) {
            finaldata.res = res;
          } else if (!res || (res && res.data.length === 0)) {
            const retdata = { data: [] };
            finaldata.res = retdata;
          }
          transferData(finaldata, 4);
        }
      }
      transferData(finaldata, 4);
    })
    .catch((e) => {
      console.log(e);
      openSnackBar({
        message: e.message,
        type: MESSAGE_TYPE.INFO,
      });
    });
};

export const fetchBankDetails = (
  organization,
  user,
  openSnackBar,
  transferData
) => {
  RestApi(
    `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing`,
    {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    }
  )
    .then((res) => {
      if (res && !res.error) {
        if (res.message) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.WARNING,
          });
        } else {
          if (res.data && res.data.length === 0) {
            const retval = { data: [] };
            return retval;
          }
          transferData(res, 5);
        }
      }
      const retval = {};
      retval.data = [];
      transferData(retval, 5);
      return retval;
      //            enableLoading(false);
    })
    .catch((e) => {
      openSnackBar({
        message: e.message,
        type: MESSAGE_TYPE.INFO,
      });
    });
};
