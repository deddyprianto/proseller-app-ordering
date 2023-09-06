import React from 'react';
const useOrder = () => {
  const [listPreorder, setListPreorder] = React.useState([]);
  const [defaultOrder, setDefaultOrder] = React.useState([]);
  const [availDate, setAvailDate] = React.useState(null);
  const [listSelfSelection, setListSelfSlection] = React.useState([]);

  const groupingeOrder = items => {
    const isNotPreorder = items.filter(item => !item.isPreOrderItem);
    const isPreOrder = items.filter(item => item.isPreOrderItem);
    const isSelfSelection = items.filter(
      item => item.product.allowSelfSelection,
    );
    const sortPreOrder = isPreOrder.sort(
      (a, b) =>
        new Date(b?.product?.productAvailableDate).getTime() -
        new Date(a?.product?.productAvailableDate).getTime(),
    );
    setAvailDate(sortPreOrder[0]?.product?.productAvailableDate);
    setListPreorder(isPreOrder);
    setDefaultOrder(isNotPreorder);
    setListSelfSlection(isSelfSelection);
  };
  return {
    groupingeOrder,
    listPreorder,
    defaultOrder,
    availDate,
    listSelfSelection,
  };
};

export default useOrder;
