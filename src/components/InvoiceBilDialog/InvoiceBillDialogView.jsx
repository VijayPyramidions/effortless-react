import React, { useState, useEffect, useContext } from 'react';
import { Stack, Dialog, DialogContent } from '@mui/material';
import { useDispatch } from 'react-redux';
import AppContext from '@root/AppContext.jsx';
import JSBridge from '@nativeBridge/jsbridge';
import download from '@assets/WebAssets/download.svg';
import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';

import * as css from './InvoiceBill.scss';

export const InvoiceDialogView = ({ invoiceAction, setInvoiceAction }) => {
  const { organization, user } = useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  const dispatch = useDispatch();
  const [html, sethtml] = useState({
    value: null,
    id: '',
    name: '',
  });

  const handleDownloadClickInvoice = async (res) => {
    if (device === 'desktop') {
      const image = await fetch(res.pdf);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'receivable-invoice';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      JSBridge.downloadLink(res.pdf);
    }
  };

  const pdfGeneration = () => {
    dispatch(enableLoading(true));
    axiosInst
      .get(
        `organizations/${organization?.orgId}/invoices/${html?.id}/url?type=pdf`,
      )
      .then((res) => {
        if (res?.data && !res?.data?.error) {
          handleDownloadClickInvoice(res?.data);
        } else {
          dispatch(
            openSnackbar({
              message:
                res?.data?.message ||
                Object.values(res?.data?.errors).join(', '),
              type: MESSAGE_TYPE.ERROR,
            }),
          );
        }
        dispatch(enableLoading(false));
      });
  };

  const recurringPdfDownload = (r_id, name) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', user.activeToken);
    myHeaders.append(
      'Cookie',
      'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f',
    );

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/invoices/${r_id}.html`,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        sethtml({ value: result, name, id: r_id });
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (Object?.keys(invoiceAction || {})?.length > 0) {
      if (invoiceAction?.open) {
        recurringPdfDownload(invoiceAction?.id, invoiceAction?.name);
      }
    }
  }, [JSON.stringify(invoiceAction || {})]);

  return (
    <Dialog
      open={invoiceAction?.open}
      id="basic-menu-sort"
      onClose={() => {
        sethtml({
          value: null,
          id: '',
          name: '',
        });
        setInvoiceAction({
          open: false,
          id: '',
          name: '',
        });
      }}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      PaperProps={{
        elevation: 3,
        style: {
          minWidth: '75%',
          padding: '5px',
          borderRadius: 16,
        },
      }}
    >
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => pdfGeneration()}>
            <img src={download} alt="download" />
          </div>
        </div>
        <Stack
          style={{
            backgroundColor: 'white',
            height: '85vh',
            width: '100%',
          }}
        >
          <iframe
            srcDoc={html?.value?.replace(
              'div.nobreak{page-break-inside:avoid}',
              'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}',
            )}
            title="html"
            frameBorder="0"
            className={css.scrolling}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
