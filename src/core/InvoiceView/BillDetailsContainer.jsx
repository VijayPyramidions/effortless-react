import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import * as css from './CreateInvoiceContainer.scss';

const BillDetailsContainer = (props) => {
  const {
    lineItems,
    onProductUpdate,
    setSelectedItems,
    selectedItems,
    deleteLineItem,
    setApplyDiscount,
    applyDiscount,
  } = props;

  const handler = (element, type) => {
    if (type === 'decrementer') {
      if (Number(element.quantity) > 1) {
        onProductUpdate(element.id, 'quantity', Number(element.quantity) - 1);
      } else {
        setSelectedItems(selectedItems.filter((s) => s !== element.item_id));
        deleteLineItem(element.id);
      }
    } else if (type === 'incrementer') {
      if (Number(element.quantity) >= 1) {
        onProductUpdate(element.id, 'quantity', Number(element.quantity) + 1);
      }
    }
  };

  const billCounter = lineItems.map((element) => (
    <div className={css.billList}>
      <div className={css.productDetails}>
        <span className={css.itemName}>{element.item_name}</span>
        <span className={css.itemRate}>{FormattedAmount(element?.rate)}</span>
      </div>
      <div key={element.id} className={css.incrementerDecrementer}>
        <Button
          onClick={() => handler(element, 'decrementer')}
          key={element.id}
          className={css.decreaseBtn}
        >
          <RemoveIcon />
        </Button>
        {/* {element.quantity} */}
        <span className={css.quantityCount}>{Number(element.quantity)}</span>

        <Button
          onClick={() => handler(element, 'incrementer')}
          key={element.id}
          className={css.increaseBtn}
        >
          <AddIcon />
        </Button>
      </div>
    </div>
  ));

  return (
    <div className={css.selectDataContainer}>
      <div className={css.selectDataHeader}>
        <span className={css.selectDataTitle}>Step 3: Bill Details</span>
      </div>
      {lineItems && lineItems.length > 0 && (
        <div className={css.selectDataBody}>
          {console.log(lineItems)}
          {billCounter}
          {/* <hr /> */}
          <div
            style={{ display: !applyDiscount ? 'flex' : 'none' }}
            className={css.discountSection}
            onClick={() => setApplyDiscount(true)}
          >
            <hr />
            <div className={css.content}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.99959 8.79959H9.59959H7.99959ZM14.3996 15.1996H15.9996H14.3996ZM15.9996 7.99959L7.99959 15.9996L15.9996 7.99959ZM10.8812 1.26359L9.07479 3.06679C8.77874 3.36337 8.37704 3.53027 7.95799 3.53079H5.11319C4.69394 3.53079 4.29186 3.69734 3.9954 3.9938C3.69894 4.29026 3.53239 4.69234 3.53239 5.11159V7.95639C3.53187 8.37545 3.36497 8.77714 3.06839 9.07319L1.26359 10.8828C0.967254 11.1792 0.800781 11.5812 0.800781 12.0004C0.800781 12.4196 0.967254 12.8216 1.26359 13.118L3.07159 14.9244C3.21823 15.0711 3.33453 15.2452 3.41387 15.4368C3.49321 15.6284 3.53403 15.8338 3.53399 16.0412V18.886C3.53399 19.7596 4.24119 20.4668 5.11479 20.4668H7.95959C8.37879 20.4668 8.78039 20.6332 9.07639 20.9308L10.8844 22.7372C11.1808 23.0335 11.5828 23.2 12.002 23.2C12.4212 23.2 12.8232 23.0335 13.1196 22.7372L14.926 20.9292C15.2223 20.6332 15.624 20.4669 16.0428 20.4668H18.8876C19.3068 20.4668 19.7089 20.3002 20.0054 20.0038C20.3018 19.7073 20.4684 19.3052 20.4684 18.886V16.0412C20.4684 15.622 20.6348 15.2204 20.9324 14.9244L22.7388 13.1164C23.0351 12.82 23.2016 12.418 23.2016 11.9988C23.2016 11.5796 23.0351 11.1776 22.7388 10.8812L20.9308 9.07479C20.6348 8.77848 20.4685 8.37682 20.4684 7.95799V5.11319C20.4684 4.69394 20.3018 4.29186 20.0054 3.9954C19.7089 3.69894 19.3068 3.53239 18.8876 3.53239H16.0428C15.6237 3.53187 15.222 3.36497 14.926 3.06839L13.1164 1.26359C12.82 0.967254 12.418 0.800781 11.9988 0.800781C11.5796 0.800781 11.1776 0.967254 10.8812 1.26359V1.26359Z"
                  stroke="#283049"
                  strokeWidth="1.6"
                />
              </svg>
              <span className={css.text}>Apply Discount</span>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18L16 12L10 6"
                stroke="black"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetailsContainer;
