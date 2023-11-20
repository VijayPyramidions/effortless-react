import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import CreateProductService from '@core/InvoiceView/CreateProductService';
import * as css from '../CreateInvoiceContainer.scss';

const ProductServiceDetails = (props) => {
  const {
    customerData,
    handleSelected,
    // isOpen,
    onCreateProduct,
    errorMessage,
    toggleView,
    selectedItems,
    setSelectedElement,
    fetchLineItems,
    selectedTab,
  } = props;
  const [drawer, setDrawer] = useState({
    addProductService: false,
  });
  const [selectedPayload, setSelectedPayload] = useState();

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name) => {
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      setSelectedPayload([]);
      selectedItems.forEach((element) => {
        setTimeout(() => {
          setSelectedPayload((old) => [...old, element]);
        }, 100);
      });
    } else {
      setSelectedPayload([]);
    }
  }, [selectedItems]);

  const handleData = async (element) => {
    if (selectedItems && selectedItems.length > 0) {
      const tempData = selectedItems;
      const exists = selectedItems.includes(element);

      if (exists) {
        handleSelected(
          tempData.filter((c) => {
            return c !== element;
          }),
        );
      } else {
        const result = tempData;
        result.push(element);
        handleSelected(result);
      }
    } else {
      const result = [];
      result.push(element);
      handleSelected(result);
    }
  };

  return (
    <div className={css.productDetailsContainer}>
      <div className={css.customerDetailsWrapper}>
        {customerData &&
          customerData.map((element) => (
            <div
              className={
                selectedPayload && selectedPayload.includes(element.payload)
                  ? css.selectedProductWrapper
                  : css.customerList
              }
              onClick={() => {
                handleData(element.payload);
                setSelectedElement(element);
              }}
            >
              <div className={css.customerIntialWrapper}>
                <span className={css.customerIntial}>{element.initial}</span>
              </div>
            </div>
          ))}
        <div className={css.customerList}>
          <SelectBottomSheet
            name="addProductService"
            triggerComponent={
              <div
                className={css.customerIntialWrapper}
                onClick={() => onTriggerDrawer('addProductService')}
              >
                <span className={css.customerIntial}>
                  <AddIcon />
                </span>
              </div>
            }
            open={drawer.addProductService}
            onTrigger={onTriggerDrawer}
            onClose={handleBottomSheet}
            maxHeight="45vh"
          >
            <div className={css.valueHeader}>
              Create a New Product or Service
            </div>
            <CreateProductService
              toggleView={toggleView}
              handleBottomSheet={handleBottomSheet}
              onSubmit={onCreateProduct}
              errorMessage={errorMessage}
              drawerName="addProductService"
              fetchLineItems={fetchLineItems}
              selectedTab={selectedTab}
            />
          </SelectBottomSheet>
        </div>
      </div>
    </div>
  );
};

export default ProductServiceDetails;
