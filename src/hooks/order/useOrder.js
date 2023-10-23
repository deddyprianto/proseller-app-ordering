import React from 'react';
const useOrder = () => {
  const [listPreorder, setListPreorder] = React.useState([]);
  const [defaultOrder, setDefaultOrder] = React.useState([]);
  const [availDate, setAvailDate] = React.useState(null);
  const [listSelfSelection, setListSelfSlection] = React.useState([]);
  const PRODUCT_ROUNDING = 'R0001';

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

  const calculateRoundingItem = data => {
    let amountRounding = null;
    const filterData = data?.details?.filter(
      item => item?.product?.references?.[0]?.value === PRODUCT_ROUNDING,
    );
    if (filterData?.length > 0) {
      const mapAmount = filterData?.map(value => value?.nettAmount);
      let totalAmount = mapAmount?.reduce((a, b) => a + b);
      if (totalAmount < 0) {
        totalAmount = totalAmount * -1;
      }
      amountRounding = totalAmount;
    }
    return amountRounding;
  };

  const itemListWithoutRounding = data => {
    const filterData = data?.details?.filter(
      item => item?.product?.references?.[0]?.value !== PRODUCT_ROUNDING,
    );
    return filterData;
  };

  return {
    groupingeOrder,
    listPreorder,
    defaultOrder,
    availDate,
    listSelfSelection,
    calculateRoundingItem,
    itemListWithoutRounding,
  };
};

export default useOrder;
