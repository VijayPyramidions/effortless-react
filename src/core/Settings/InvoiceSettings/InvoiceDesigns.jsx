import React from 'react';
import * as Mui from '@mui/material';
import * as css from './InvoiceSettings.scss';
import pdfeg from '../../../assets/pdfeg.png';

const device = localStorage.getItem('device_detect');
const InvoiceDesigns = () => {
  const Data = [
    {
      name: 'Template 1',
      content:
        'Professional resume template. Plenty of information, no clutter.',
    },
    {
      name: 'Template 2',
      content:
        'Professional resume template. Plenty of information, no clutter.',
    },
    {
      name: 'Template 3',
      content:
        'Professional resume template. Plenty of information, no clutter.',
    },
    {
      name: 'Template 4',
      content:
        'Professional resume template. Plenty of information, no clutter.',
    },
  ];
  return device === 'desktop' ? (
    <Mui.Stack className={css.invoiceDesignStack}>
      <Mui.Typography className={css.heading}>
        Select a template for the Invoice design
      </Mui.Typography>
      <Mui.Stack direction="row" className={css.invoiceDesignStack2}>
        {Data.map((c) => (
          <Mui.Stack className={css.cardStack}>
            <Mui.Card>
              <Mui.CardContent>
                <Mui.Typography gutterBottom className={css.t1} component="div">
                  {c.name}
                </Mui.Typography>
                <Mui.Typography className={css.t2}>{c.content}</Mui.Typography>
              </Mui.CardContent>
              <Mui.CardMedia
                component="img"
                height="150"
                image={pdfeg}
                alt="green iguana"
              />
            </Mui.Card>
          </Mui.Stack>
        ))}
      </Mui.Stack>
    </Mui.Stack>
  ) : (
    <div>InvoiceDesigns</div>
  );
};

export default InvoiceDesigns;
