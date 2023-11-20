import * as React from 'react';
import AppContext from '@root/AppContext.jsx';
import { BASE_URL } from '@services/RestApi.jsx';
import { DirectUpload } from '@rails/activestorage';

function FileUpload({
  setForUpload,
  funCall,
  fromCompany,
  acceptType,
  FieldSet,
}) {
  const { enableLoading, openSnackBar } = React.useContext(AppContext);

  const uploadTrigger = (e, val) => {
    const file = e?.target?.files?.[val];
    if (FieldSet) FieldSet('file');
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    enableLoading(true);
    upload.create((error, blob) => {
      enableLoading(false);
      if (error) {
        openSnackBar(error);
      } else {
        const id = blob?.signed_id;
        const name = blob?.filename;
        // if (type === 'upload') {
        if (fromCompany) {
          setForUpload((prev) => ({ ...prev, id, fileName: name }));
          if (FieldSet) FieldSet('');
          funCall(id);
        } else {
          setForUpload((prev) => [...prev, { id, fileName: name }]);
        }
        // } else if (type === 'download') {
        //   setForDownload({ id, fileName: name });
        // } else {
        //   setForDownload();
        //   setForUpload();
        // }
      }
    });
  };
  // React.useEffect(()=>{
  //     uploadTrigger();
  // },[]);

  return (
    <input
      type="file"
      hidden
      accept={acceptType || '.xlsx'}
      onChange={(e) => {
        if (e.target.files?.length === 1) {
          // setNum(e.target.files?.length);
          uploadTrigger(e, 0);
        } else if (e.target.files?.length > 1) {
          for (let i = 0; i < e.target.files?.length; i += 1) {
            uploadTrigger(e, i);
          }
        }
      }}
      data-direct-upload-url="<%= rails_direct_uploads_url %>"
      // multiple
    />
  );
}
export default FileUpload;
