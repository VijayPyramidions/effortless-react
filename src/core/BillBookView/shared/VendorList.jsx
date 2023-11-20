import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import * as css from './VendorList.scss';

const VendorList = (props) => {
  const {
    vendorList,
    onClick,
    addNewVendor,
    disableAdd,
    selected: selectedIds = [],
  } = props;
  // const [selected, setSelected] = useState(selectedProp || []);
  // function onClick(v) {
  //   if (multiple) return;
  //   onClickProp(v);
  // }
  // useEffect(() => {
  //   setSelected(selectedProp);
  // }, [selectedProp]);
  return (
    <div className={`${css.vendorListContainer} ${css.mainVendorComponent}`}>
      <div className={css.vendorList}>
        {vendorList.map((v) => (
          <div
            className={`${css.vendorOptions} ${
              selectedIds?.includes(v.id) ? css.selected : ''
            }`}
            onClick={() => onClick(v)}
            key={v.id}
            role="menuitem"
          >
            <div className={`${css.vendorName}`}>{v.name}</div>
            {selectedIds?.includes(v.id) ? (
              <CheckCircleIcon className={css.selectedIcon} />
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
      {!disableAdd && (
        <div
          className={`${css.vendorOptions} ${css.addVendorBtn}`}
          onClick={addNewVendor}
          role="button"
        >
          + Add new Vendor
        </div>
      )}
    </div>
  );
};

export default VendorList;
