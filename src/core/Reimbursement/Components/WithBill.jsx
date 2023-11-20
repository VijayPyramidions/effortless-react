/* eslint-disable no-lonely-if */

import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import JSBridge from '@nativeBridge/jsbridge';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Stack, Grid } from '@mui/material';
import { Typography } from '@material-ui/core';
import { GetVendorEntityState } from '@action/Store/Reducers/General/GeneralState';
import VendorList from '@components/Vendor/VendorList';
import { Document, Page } from 'react-pdf'

import {
  getOCRData,
  fetchOCRData,
  clearReimbursementOCRData,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

import { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { DirectUpload } from '@rails/activestorage';
// import { Document, Page } from 'react-pdf';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import CustomSearch from '@components/SearchSheet/CustomSearch.jsx';

import Input from '@components/Input/Input.jsx';

import featherupload from '@assets/featherupload.svg';
import fileCancel from '@assets/fileCancel.svg';
import show_image from '@assets/show_image.svg';
import * as css from '../ReimbursementContainer.scss';

const WithBill = ({
  actiontype,
  localState,
  hanldeChange,
  ShowType,
  reValidate,
  validationErr,
  setDrawerState,
  drawerState,
}) => {
  const { registerEventListeners, deRegisterEventListener } =
    useContext(AppContext);
  const fileref = useRef();
  const dragfropref = useRef();
  const dispatch = useDispatch();
  const { reimbursementOCRData } = useSelector((value) => value.Reimbursement);
  const { vendorEntity } = useSelector((value) => value.General);

  const [drawer, setDrawer] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [pagination, setPagination] = useState({
    totalPage: 1,
    currentPage: 1,
  });
  const [uploadFileCall, setUploadFileCall] = useState({});
  const [showTextData, setShowTextData] = useState(false);
  const [toShowBtn, setToShowBtn] = React.useState(false);
  const [isVendorAvailable, setIsVendorAvailable] = useState(false);
  const [dntCheckbox, setDntCheckbox] = useState(false);
  const handleTriggerSheet = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const getVendor = (a, searchVal, pageNum) => {
    dispatch(
      GetVendorEntityState({
        allParties: false,
        pageNum: pageNum || 1,
        searchText: searchVal || '',
        location: false,
      })
    );
  };

  const onTriggerDrawer = (name) => {
    setTimeout(() => {
      // let sheetName = name;
      // if (!userRolesPeople?.Vendors?.create_vendors && name === 'addManually') {
      //   setHavePermission({
      //     open: true,
      //     back: () => {
      //       setHavePermission({ open: false });
      //     },
      //   });
      //   return;
      // }
      // if (name === 'vendor') {
      //   getVendor();
      // }

      // if (name === 'reload') {
      //   fetchGSTDetails(localState.gst);
      // }

      // if (name === 'addManually' || name === 'list') {
      //   setTrigger(name);
      //   sheetName = 'vendor';
      // } else if (
      //   localState?.vendor?.id &&
      //   (name === 'addManually' || name === 'list')
      // ) {
      //   setTrigger('list');
      //   sheetName = 'vendor';
      // }
      // setDrawer((d) => ({ ...d, [sheetName]: true }));
      if (name === 'list') {
        getVendor();
        handleTriggerSheet('addvendor', false);
        handleTriggerSheet('vendorlist', true);
      }

      if (name === 'addManually') {
        handleTriggerSheet('vendorlist', false);
        handleTriggerSheet('addvendor', true);
      }
    }, 300);
  };

  const handleDoNotTrackVendor = async (data) => {
    // setHasNoGstin(data);
    // const stateName = 'doNotTrack';
    // const validationName = 'vendor';
    // setValidationErr((v) => ({
    //   ...v,
    //   [validationName]: false,
    // }));
    // setLocalState((s) => ({ ...s, [stateName]: data }));
    setDntCheckbox(data);
    hanldeChange(
      {
        target: {
          name: 'vendor',
          value: data
            ? {
                id: null,
                name: 'Do Not Track Vendor',
              }
            : {
                id: null,
                name: '',
              },
        },
      },
      { vendor_id: null }
    );
    if (data) handleTriggerSheet('vendorlist', false);
    // handleBottomSheet('vendor', data ? 'Do not track' : '');
    // if (data) {
    //   await saveBills(true, {
    //     vendor_id: null,
    //     id: billId,
    //   });
    // }
  };

  const onFileUpload = (e, directFile) => {
    const file = directFile ? e : e?.target?.files?.[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    dispatch(enableLoading(true));
    upload.create((error, blob) => {
      dispatch(enableLoading(false));
      if (error) {
        dispatch(
          openSnackbar({
            message: error?.message || 'Sorry Something went wrong',
            type: 'error',
          })
        );
      } else {
        const id = blob?.signed_id;
        const name = blob?.filename;
        const type = blob?.content_type;
        // const fileLoaded = window.URL.createObjectURL(file);
        // hanldeChange(
        //   {
        //     target: {
        //       name: 'bill_details',
        //       value: { name, id, type, url: fileLoaded },
        //     },
        //   },
        //   { file: id }
        // );
        setUploadFileCall({ name, id, type });
        if (localState?.id)
          dispatch(
            getOCRData({
              billId: id,
              id: localState?.id,
              for: 'billPatch',
              reimbursement_policy_id: localState?.reimbursementPolicyId,
            })
          );
        else
          dispatch(
            getOCRData({
              billId: id,
              reimbursement_policy_id: localState?.reimbursementPolicyId,
              for: 'billPatch',
            })
          );
        // dispatch(getOCRData({ billId: id ,id:localState?.id,reimbursement_policy_id: localState?.reimbursementPolicyId,}));
      }
    });
  };

  const HandleFileDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const HandleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    onFileUpload(file, true);
  };

  const clearData = () => {
    fileref.current.value = null;
    hanldeChange(
      {
        target: {
          name: 'bill_details',
          value: {},
        },
      },
      { file: '' }
    );
    setUploadFileCall({});
    dispatch(clearReimbursementOCRData());
    hanldeChange(
      {
        target: {
          name: 'vendor',
          value: {},
        },
      },
      { vendor_id: null }
    );
    hanldeChange({
      target: {
        name: 'taxable_value',
        value: 0,
      },
    });
    hanldeChange({
      target: {
        name: 'cgst_amount',
        value: 0,
      },
    });
    hanldeChange({
      target: {
        name: 'igst_amount',
        value: 0,
      },
    });
  };

  useEffect(() => {
    dragfropref?.current?.addEventListener('dragover', HandleFileDrag);
    dragfropref?.current?.addEventListener('drop', HandleFileDrop);

    return () => {
      dragfropref?.current?.removeEventListener('dragover', HandleFileDrag);
      dragfropref?.current?.removeEventListener('drop', HandleFileDrop);
    };
  }, [dragfropref?.current]);

  useEffect(() => {
    if (vendorEntity?.data) {
      if (vendorEntity?.page === 1) {
        setVendorList(vendorEntity?.data);
      } else {
        setVendorList((prev) => [...prev, ...vendorEntity?.data]);
      }
      setPagination({
        totalPage: vendorEntity?.pages,
        currentPage: vendorEntity?.page,
      });
    }
  }, [JSON.stringify(vendorEntity || {})]);

  useEffect(() => {
    getVendor();
  }, []);

  useEffect(() => {
    if (Object?.keys(reimbursementOCRData || {})?.length > 0) {
      if (Object.keys(uploadFileCall || {})?.length > 0) {
        hanldeChange(
          {
            target: {
              name: 'bill_details',
              value: { ...uploadFileCall, url: reimbursementOCRData?.file_url },
            },
          },
          { file: uploadFileCall?.id }
        );
        setUploadFileCall({});
      }
      if (reimbursementOCRData?.ocr_processing) {
        dispatch(enableLoading(true));
        setTimeout(() => {
          dispatch(enableLoading(true));
          dispatch(fetchOCRData({ id: reimbursementOCRData?.id }));
          return () => {};
        }, 2000);
      } else {
        dispatch(enableLoading(false));
        if (reimbursementOCRData?.new_vendor?.name) {
          hanldeChange(
            {
              target: {
                name: 'vendor',
                value: {
                  id: null,
                  name: reimbursementOCRData?.new_vendor?.name,
                },
              },
            },
            { vendor_id: null }
          );
        } else {
          if (dntCheckbox) {
            hanldeChange(
              {
                target: {
                  name: 'vendor',
                  value: {
                    id: null,
                    name: 'Do Not Track Vendor',
                  },
                },
              },
              { vendor_id: null }
            );
          } else {
            hanldeChange(
              {
                target: {
                  name: 'vendor',
                  value: {
                    id: reimbursementOCRData?.vendor?.id,
                    name: reimbursementOCRData?.vendor?.name,
                  },
                },
              },
              { vendor_id: reimbursementOCRData?.vendor?.id }
            );
          }
        }

        hanldeChange({
          target: {
            name: 'taxable_value',
            value: Number(reimbursementOCRData?.taxable_value),
          },
        });
        hanldeChange({
          target: {
            name: 'cgst_amount',
            value: Number(reimbursementOCRData?.cgst_amount),
          },
        });
        hanldeChange({
          target: {
            name: 'igst_amount',
            value: Number(reimbursementOCRData?.igst_amount),
          },
        });
      }
    }
  }, [reimbursementOCRData]);

  useMemo(() => {
    if (actiontype !== 'new') {
      if (localState.vendor?.id) {
        setShowTextData(true);
        setIsVendorAvailable(true);
        setDntCheckbox(false);
      } else {
        setShowTextData(false);
        setIsVendorAvailable(false);
        // setDntCheckbox(true);
      }
    }
  }, [localState?.vendor?.id]);

  useMemo(() => {
    if (dntCheckbox) {
      setToShowBtn(true);
    } else {
      setToShowBtn(isVendorAvailable);
    }
  }, [isVendorAvailable, dntCheckbox]);

  const fillOcrByFirebaseML = async (res) => {
    const resp = JSON.parse(res.detail.value);
    // console.log('LOOPCHECK fillOcrByFirebaseML');
    const {
      // name,
      // amount,
      // invoiceNo,
      // date,
      // description,
      // location,
      // paymentStatus,
      // vendor,
      // isOnline,
      base64: base64Arg,
      filename: filenameArg,
      idDocType: fileType,
    } = resp;

    // setFilename(filenameArg);
    // setBase64(base64Arg);

    // if (!isOnline) {
    //   setLocalState((s) => {
    //     const newState = {
    //       ...s,
    //       name,
    //       amount,
    //       invoiceNo,
    //       date,
    //       description,
    //       location,
    //       paymentStatus,
    //       vendor,
    //     };
    //     return newState;
    //   });
    //   return;
    // }

    // Call ML API OCR Data while getting base64 from native

    if (base64Arg) {
      const base64Str = `data:${fileType};base64,${base64Arg}`;
      const fetchRes = await fetch(base64Str);
      const blob = await fetchRes.blob();
      // eslint-disable-next-line no-undef
      const file = new File([blob], filenameArg, { type: fileType });
      // console.log(
      //   '🚀 ~ file: UploadYourBillContainer.jsx ~ line 433 ~ saveBills ~ file',
      //   file,
      // );
      // console.log('LOOPCHECK if base64Arg');
      onFileUpload(file, true);
      // fileSignedId = await fileUploadOnSave(file);
    }
  };

  useEffect(() => {
    registerEventListeners({
      name: 'reimbursementOcr',
      method: fillOcrByFirebaseML,
    });
    return () =>
      deRegisterEventListener({
        name: 'reimbursementOcr',
        method: fillOcrByFirebaseML,
      });
  }, []);

  return (
    <Stack
      direction="column"
      gap="26px"
      style={{ pointerEvents: ShowType === 'view' && 'none' }}
    >
      <>
        <input
          type="file"
          ref={fileref}
          name="file"
          id="file"
          className="inputfile"
          accept="image/png, image/jpeg, application/pdf"
          onChange={onFileUpload}
          hidden
        />
        {Object?.keys(localState?.bill_details || {})?.length === 0 &&
          (window.isDevice() === true ? (
            <span
              onClick={() => JSBridge.ocrByBrowse('reimbursementOcr')}
              role="presentation"
            >
              <div className={css.secondRow} ref={dragfropref}>
                <img
                  src={featherupload}
                  alt="upload"
                  style={{ width: '40px' }}
                />
                <p className={css.uploadP}>Upload Your Bill Here</p>
                <p className={css.typeP}>JPG, PNG or PDF</p>
                <div className={css.browseCont}>
                  <p className={css.browseP}>Browse</p>
                </div>
              </div>
            </span>
          ) : (
            <label htmlFor="file">
              <div className={css.secondRow} ref={dragfropref}>
                <img
                  src={featherupload}
                  alt="upload"
                  style={{ width: '40px' }}
                />
                <p className={css.uploadP}>Upload Your Bill Here</p>
                <p className={css.typeP}>JPG, PNG or PDF</p>
                <div className={css.browseCont}>
                  <p className={css.browseP}>Browse</p>
                </div>
              </div>
            </label>
          ))}
        {Object?.keys(localState?.bill_details || {})?.length > 0 && (
          <div className={css.thirdRow}>
            <ImageUpload localState={localState} style={{ opacity: '.5' }} />
            {ShowType !== 'view' && (
              <div
                // onClick={() => handleTriggerSheet('showimage', true)}
                onClick={() =>
                  setDrawerState({ ...drawerState, showimage: true })
                }
                className={css.showimage}
              >
                <img src={show_image} alt="show" />
              </div>
            )}
          </div>
        )}
      </>
      {Object?.keys(localState?.bill_details || {})?.length > 0 && (
        <div className={css.filenameContainer}>
          <Typography className={css.fileNameLabel}>
            {localState?.bill_details?.name}
          </Typography>
          <div
            onClick={() => {
              clearData();
            }}
          >
            <img
              src={fileCancel}
              alt="file Cancel"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
        </div>
      )}
      <SelectBottomSheet
        name="Vendor"
        // onBlur={reValidate}
        // error
        // helperText
        label="Select Vendor"
        open={drawer?.vendorlist}
        value={localState?.vendor?.name}
        // onTrigger={() => handleTriggerSheet('vendorlist', true)}
        onTrigger={onTriggerDrawer}
        onClose={() => handleTriggerSheet('vendorlist', false)}
        required
        id="recordBillVendor"
        showAddText={showTextData ? 'Add This Vendor' : 'Add Vendor'}
        toShow={toShowBtn}
      >
        <CustomSearch
          showType="Vendor"
          customerList={vendorList}
          callFunction={getVendor}
          handleLocationParties={(val) => {
            handleTriggerSheet('vendorlist', false);
            hanldeChange(
              { target: { name: 'vendor', value: val } },
              { vendor_id: val?.id }
            );
          }}
          handleAllParties={(val) => {
            handleTriggerSheet('vendorlist', false);
            hanldeChange(
              { target: { name: 'vendor', value: val } },
              { vendor_id: val?.id }
            );
          }}
          addNewOne={() => {
            handleTriggerSheet('vendorlist', false);
            handleTriggerSheet('addvendor', true);
          }}
          dntCheckbox={dntCheckbox}
          onDoNotTrackVendor={(ps) => handleDoNotTrackVendor(ps)}
          hideLocation
          hideToggle
          hideEdit
          pagination={pagination}
          setPagination={setPagination}
          from="expenseReimbursement"
          details={reimbursementOCRData}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        name="addvendor"
        open={drawer?.addvendor}
        triggerComponent={<></>}
        onTrigger={() => handleTriggerSheet('addvendor', true)}
        onClose={() => handleTriggerSheet('addvendor', false)}
        id="overFlowHidden"
      >
        <VendorList
          trigger="addManually"
          onClick={(val) => {
            handleTriggerSheet('addvendor', false);
            hanldeChange(
              { target: { name: 'vendor', value: val } },
              { vendor_id: val?.id }
            );
          }}
          updateVendorList={getVendor}
          continueFlow={() => handleTriggerSheet('addvendor', false)}
          closeAddVendor={() => handleTriggerSheet('addvendor', false)}
          panEnable
          details={reimbursementOCRData}
        />
      </SelectBottomSheet>

      <Input
        required
        label="Taxable Value"
        variant="standard"
        name="taxable_value"
        onBlur={reValidate}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        theme="light"
        rootStyle={{
          border: '1px solid rgba(153, 158, 165, 0.39)',
        }}
        type="number"
        onWheel={(e) => e.target.blur()}
        placeholder="0"
        error={validationErr?.taxable_value}
        helperText={validationErr?.taxable_value ? 'Enter Valid Amount' : ''}
        onChange={(e) => hanldeChange(e)}
        value={localState?.taxable_value}
        disabled={ShowType === 'view'}
      />
      <Input
        required
        label="CGST"
        variant="standard"
        name="cgst_amount"
        onBlur={reValidate}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        theme="light"
        rootStyle={{
          border: '1px solid rgba(153, 158, 165, 0.39)',
        }}
        type="number"
        onChange={(e) => hanldeChange(e)}
        onWheel={(e) => e.target.blur()}
        placeholder="0"
        value={localState?.cgst_amount}
        disabled={ShowType === 'view'}
      />
      <Input
        required
        label="SGST"
        variant="standard"
        name="cgst_amount"
        onBlur={reValidate}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        theme="light"
        rootStyle={{
          border: '1px solid rgba(153, 158, 165, 0.39)',
        }}
        type="number"
        onChange={(e) => hanldeChange(e)}
        onWheel={(e) => e.target.blur()}
        placeholder="0"
        value={localState?.cgst_amount}
        disabled={ShowType === 'view'}
      />
      <Input
        required
        label="IGST"
        variant="standard"
        name="igst_amount"
        onBlur={reValidate}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        theme="light"
        rootStyle={{
          border: '1px solid rgba(153, 158, 165, 0.39)',
        }}
        type="number"
        onChange={(e) => hanldeChange(e)}
        onWheel={(e) => e.target.blur()}
        placeholder="0"
        value={localState?.igst_amount}
        disabled={ShowType === 'view'}
      />
      <Dialog
        open={drawer?.showimage}
        onClose={() => handleTriggerSheet('showimage', false)}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: 16,
            padding: '16px',
          },
        }}
      >
        <>
          <ImageUpload
            localState={localState}
            style={{ height: '500px', width: '500px' }}
          />
        </>
      </Dialog>
    </Stack>
  );
};

export default WithBill;

export const ImageUpload = ({ localState, style }) => {
  const device = localStorage.getItem('device_detect');
  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
  };

  return (
    <Stack alignItems="center" justifyContent="center">
      {((device === 'mobile' &&
        localState?.bill_details?.url?.includes('.jpeg')) ||
      localState?.bill_details?.url?.includes('.png') ||
      localState?.bill_details?.url?.includes('.pdf') === false ? (
        <img
          src={localState?.bill_details?.url}
          alt="bill"
          className={css.imgtag}
          style={{ ...style }}
        />
      ) : (
        <Grid className={css.iframeViewDocument}>
          {Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
            <Document
              file={localState?.bill_details?.url}
              className={css.pdfStyle}
              loading="Loading document..."
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={i} className={css.page} />
            </Document>
          ))}
        </Grid>
      )) || (
        <iframe
          title="pdfViewer"
          frameBorder="0"
          src={localState?.bill_details?.url}
          style={{ ...style }}
        />
      )}
    </Stack>
  );
};
