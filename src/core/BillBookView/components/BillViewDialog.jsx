import React, { useState } from 'react';
import { Stack, Dialog, DialogContent, Grid } from '@mui/material';

import { Document, Page } from 'react-pdf'

import download from '@assets/WebAssets/download.svg';

import * as css from './BillComponent.scss';

const BillViewDialog = ({ file_url, onClose }) => {
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  const handleDownloadClick = async () => {
    const image = await fetch(file_url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'bill';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Dialog
      PaperProps={{
        elevation: 3,
        style: {
          width: '86%',
          height: file_url?.includes('.pdf') ? '100%' : '',
          overflow: 'visible',
          borderRadius: 16,
          cursor: 'pointer',
        },
      }}
      open
      onClose={() => onClose()}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        p={1}
        onClick={() => handleDownloadClick()}
      >
        <img src={download} alt="download" />
      </Stack>
      <DialogContent style={{ position: 'relative' }}>
        <Grid className={css.iframeViewDocument}>
          {file_url?.includes('.jpeg') ||
          file_url?.includes('.png') ||
          file_url?.includes('.pdf') === false ? (
            <img src={file_url} alt="upload" style={{ width: '100%' }} />
          ) : (
            Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
              <Document
                file={file_url}
                className={css.pdfStyle}
                loading="  "
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={i} className={css.page} />
              </Document>
            ))
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default BillViewDialog;
