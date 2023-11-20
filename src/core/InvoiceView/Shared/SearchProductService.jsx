import React, { useState, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import * as Mui from '@mui/material';
import * as css from '../CreateInvoiceContainer.scss';

const SearchProductService = (props) => {
  const {
    productData,
    serviceData,
    setAddProduct,
    handleSelected,
    handleClick,
    setProSer,
    proSer,
    wholeData,
    taxType,
    noteTypeWithShow,
  } = props;
  const themes = Mui.useTheme();
  const [query, setQuery] = useState('');
  const [viewProduct, setViewProduct] = useState(proSer === 'products');
  const desktopView = Mui.useMediaQuery(themes.breakpoints.up('sm'));
  const [showData, setShowData] = useState(
    proSer === 'products' ? productData : serviceData,
  );

  useEffect(() => {
    const setData =
      wholeData &&
      wholeData.filter((post) => {
        if (query === '') {
          return viewProduct ? productData : serviceData;
        }
        if (post.text.toLowerCase().includes(query.toLowerCase())) {
          return post;
        }
        return false;
      });
    if (query === '') {
      setShowData(viewProduct ? productData : serviceData);
    } else {
      setShowData(setData);
    }
  }, [query, viewProduct, productData, serviceData]);

  return (
    <div className={css.searchProduct} style={{ height: 'auto' }}>
      {desktopView ? (
        <>
          <div className={css.valueHeader}>
            Select Your {viewProduct ? 'Product' : 'Service'}{' '}
          </div>
          <div className={css.valueHeaderSub}>
            Select the {viewProduct ? 'Product' : 'Service'} you want to add in
            your Invoice
          </div>
        </>
      ) : (
        <div className={css.valueHeader}>Select Your Item</div>
      )}

      {/* <div className={css.searchFilter}>
        <SearchIcon />{' '}
        <input
          placeholder={`Search for ${viewProduct ? 'Product' : 'Service'}`}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div> */}
      <div className={css.productSelection}>
        <Button
          className={viewProduct ? css.selectedBtn : css.btn}
          variant="text"
          onClick={() => {
            setViewProduct(true);
          }}
        >
          Product
        </Button>
        <Button
          className={!viewProduct ? css.selectedBtn : css.btn}
          variant="text"
          onClick={() => {
            setViewProduct(false);
          }}
        >
          Service
        </Button>
      </div>
      <div className={css.searchFilterFull}>
        <SearchIcon className={css.searchFilterIcon} />{' '}
        <input
          placeholder={`Search for ${viewProduct ? 'Product' : 'Service'}`}
          onChange={(event) => setQuery(event.target.value)}
          className={css.searchFilterInputBig}
        />
      </div>
      <div
        style={{
          overflow: 'auto',
          minHeight: desktopView ? '57vh' : '47vh',
          maxHeight: desktopView ? '58vh' : '48vh',
        }}
      >
        {viewProduct ? (
          <div>
            {showData &&
              !noteTypeWithShow?.show &&
              showData
                // &&
                //   showData
                //     .filter((post) => {
                //       if (query === '') {
                //         return post;
                //       }
                //       if (productsData.text.toLowerCase().includes(query.toLowerCase())) {
                //         return post;
                //       }
                //       return false;
                //     })
                ?.map((element) => (
                  <div
                    className={css.valueWrapper}
                    onClick={() => {
                      handleSelected(element);
                      setProSer(viewProduct ? 'products' : 'services');
                    }}
                  >
                    <Button
                      className={`${css.value} ${css.captalize}`}
                      htmlFor="temp-id"
                    >
                      {element.text?.toLowerCase()}
                    </Button>
                    <hr />
                  </div>
                ))}
            {showData?.length === 0 && !noteTypeWithShow?.show && (
              <Mui.Typography align="center">No Data Found</Mui.Typography>
            )}
          </div>
        ) : (
          <div>
            {showData &&
              !noteTypeWithShow?.show &&
              showData
                // &&
                //   serviceData
                //     .filter((post) => {
                //       if (query === '') {
                //         return post;
                //       }
                //       if (post.text.toLowerCase().includes(query.toLowerCase())) {
                //         return post;
                //       }
                //       return false;
                //     })
                ?.map((element) => (
                  <div
                    className={css.valueWrapper}
                    onClick={() => {
                      handleSelected(element);
                      setProSer(viewProduct ? 'products' : 'services');
                    }}
                  >
                    <Button
                      className={`${css.value} ${css.captalize}`}
                      htmlFor="temp-id"
                    >
                      {element.text.toLowerCase()}
                    </Button>
                    <hr />
                  </div>
                ))}
            {showData?.length === 0 && !noteTypeWithShow?.show && (
              <Mui.Typography align="center">No Data Found</Mui.Typography>
            )}
          </div>
        )}
        {noteTypeWithShow?.show && (
          <p
            style={{
              color: '#e0513e',
              fontWeight: '700',
              margin: '0px 25px 25px 25px',
            }}
          >
            {!noteTypeWithShow?.customer
              ? 'Please Select Customer.'
              : 'Please Select Invoice.'}
          </p>
        )}
      </div>
      {taxType !== 'credit_note' && (
        <div
          className={css.valueWrapper}
          onClick={() => {
            setAddProduct(true);
            handleClick('addProductService');
            setProSer(viewProduct ? 'products' : 'services');
          }}
        >
          <span className={css.highlightedValue}>
            + Add new {viewProduct ? 'Product' : 'Service'}{' '}
          </span>
          <hr />
        </div>
      )}
    </div>
  );
};

export default SearchProductService;
