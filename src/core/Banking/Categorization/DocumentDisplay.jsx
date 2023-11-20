import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

import L from 'leaflet';
import { PDFJS } from 'pdfjs-dist';
import PDFLayer from './PDFLayer';

export default function DocumentDisplay(props) {
  const { handleClick, documentLink, invoice, initopen } = props;
  const [openModal, setOpenModal] = React.useState(initopen);

  const handleClose = () => {
    handleClick({ status: 'closed' });
    setOpenModal(!openModal);
  };

  PDFJS.workerSrc = './worker.js';

  const document = L.map('document', {
    minZoom: 4,
    maxZoom: 16,
  });

  document.setView([40.697632, -98.461165], 4);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(document);

  new PDFLayer({
    pdf: documentLink,
    page: 1,
    minZoom: document.getMinZoom(),
    maxZoom: document.getMaxZoom(),
    bounds: new L.LatLngBounds(
      [-0.308849, -123.453116],
      [49.923578, -57.619317],
    ),
    attribution: ' ',
  }).addTo(document);

  return (
    <Dialog
      open={openModal}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxHeight: '98%',
        },
      }}
    >
      <DialogTitle>Invoice - `${invoice}`</DialogTitle>
      <DialogContent dividers>
        <div id="document" />
      </DialogContent>
    </Dialog>
  );
}
