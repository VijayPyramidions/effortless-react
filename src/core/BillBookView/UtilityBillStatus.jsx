import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';

export default function UtilityBillStatus() {
  const { changeSubView } = useContext(AppContext);
  const onClick = (view) => {
    changeSubView(view);
  };
  return (
    <div>
      <div>UtilityBillStatus</div>
      <div onClick={() => onClick('utilityBillsView')}> + Add </div>
    </div>
  );
}
