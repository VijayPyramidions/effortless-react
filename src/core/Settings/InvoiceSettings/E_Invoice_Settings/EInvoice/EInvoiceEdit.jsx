import React, { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';

import * as css from '../EInvoiceSettingsMain.scss';

const EInvoiceEdit = ({ showFields, editFields, updateEInvoice }) => {
  const [EditAction, setEditAction] = useState([]);

  const EditBoxClick = (name, clicked) => {
    setEditAction((prevItemList) => {
      const updatedItemList = prevItemList.map((item) => {
        if (item?.name === name) {
          return { ...item, clicked: !clicked };
        }
        return item;
      });
      return updatedItemList;
    });
  };

  const arraysHaveSameValues = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((value) => arr2?.includes(value));
  };

  useEffect(() => {
    setEditAction(
      showFields?.map((val) => ({
        name: val?.split('_')?.join(' '),
        clicked: !!editFields?.find((item) => item === val),
        id: val,
      }))
    );
  }, [showFields]);

  useEffect(() => {
    if (EditAction?.length > 0) {
      const selectFields = EditAction?.filter((val) => val?.clicked)?.map(
        (val) => val?.id
      );
      if (!arraysHaveSameValues(selectFields, editFields)) {
        updateEInvoice({ editable_fields: selectFields });
      }
    }
  }, [EditAction]);
  return (
    <Stack className={css.einvoiceedit} gap="16px">
      <Stack gap="12px" direction="row" flexWrap="wrap">
        {EditAction?.map((item) => (
          <Box
            className={
              item?.clicked ? `${css.selectedbox}` : `${css.unselectedbox}`
            }
            onClick={() => EditBoxClick(item?.name, item?.clicked)}
            key={item?.name}
          >
            {item?.name}
          </Box>
        ))}
      </Stack>
      <p className={css.descriptiontext}>
        However, the edited transactions will not be in sync with the
        transaction in the IRP.{' '}
      </p>
    </Stack>
  );
};

export default EInvoiceEdit;
