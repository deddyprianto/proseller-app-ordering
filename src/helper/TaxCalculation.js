const _ = require('lodash');
// const uuidV4 = require("uuid4");

const calculateTAX = async (
  products,
  returnData,
  event,
  listAllProducts = [],
) => {
  let surchargeData = {
    type: 'FixAmount',
    value: 0,
  };

  if (
    typeof returnData.orderingMode !== 'undefined' &&
    typeof returnData.outlet.surcharge !== 'undefined'
  ) {
    if (returnData.orderingMode === 'TAKEAWAY') {
      if (typeof returnData.outlet.surcharge.takeAway !== 'undefined') {
        surchargeData = returnData.outlet.surcharge.takeAway;
      }
    } else if (returnData.orderingMode === 'DINEIN') {
      if (typeof returnData.outlet.surcharge.dineIn !== 'undefined') {
        surchargeData = returnData.outlet.surcharge.dineIn;
      }
    } else if (returnData.orderingMode === 'DELIVERY') {
      if (typeof returnData.outlet.surcharge.delivery !== 'undefined') {
        surchargeData = returnData.outlet.surcharge.delivery;
      }
    }
  }

  let setPercentage = (amount, discountableAmount) => {
    if (parseFloat(discountableAmount) === 0) return '0%';
    if (typeof amount !== 'undefined')
      // return roundToTwo(parseFloat(amount) / parseFloat(discountableAmount) * 100);
      return (parseFloat(amount) / parseFloat(discountableAmount)) * 100;
    else return '0%';
  };

  let setAmount = (percentage, discountableAmount) => {
    if (parseFloat(discountableAmount) === 0) return 0;
    if (typeof percentage !== 'undefined')
      // return roundToTwo(parseFloat(discountableAmount) * parseFloat(percentage) / 100);
      return (parseFloat(discountableAmount) * parseFloat(percentage)) / 100;
    else return 0;
  };

  let setAmountBeforeSurcharge = (amountAfterDisc, taxPercentage) => {
    if (typeof taxPercentage === 'undefined') {
      taxPercentage = 0;
    }
    let taxPercentageAmount = parseFloat(taxPercentage) / 100;
    // return roundToTwo(parseFloat(amountAfterDisc) / (1 + taxPercentageAmount));
    return parseFloat(amountAfterDisc) / (1 + taxPercentageAmount);
  };

  let setSurchargeAmount = amount => {
    if (typeof surchargeData === 'undefined') {
      return 0;
    }
    if (typeof surchargeData.value === 'undefined') {
      return 0;
    }
    surchargeData.value = Number(surchargeData.value);
    if (isNaN(surchargeData.value)) {
      return 0;
    }
    if (surchargeData.type === 'ByPercentage') {
      // return roundToTwo(parseFloat(amount) * parseFloat(surchargeData.value) / 100);
      return (parseFloat(amount) * parseFloat(surchargeData.value)) / 100;
    }

    return surchargeData.value;
  };

  let setTaxAmount = (taxableAmount, taxPercentage) => {
    // return roundToTwo(parseFloat(taxableAmount) * parseFloat(taxPercentage) / 100);
    return (parseFloat(taxableAmount) * parseFloat(taxPercentage)) / 100;
  };

  let setNettAmount = (originalAmount, minValue, roundType) => {
    originalAmount = parseFloat(originalAmount);
    minValue = parseFloat(minValue);

    let roundedAmount = 0;
    let diff = originalAmount % minValue;
    if (diff === 0) return originalAmount;

    let downValue = originalAmount - diff;
    let upValue = downValue + minValue;

    let downDiff = Math.abs(originalAmount - downValue);
    let upDiff = Math.abs(originalAmount - upValue);

    let nearestValue = 0;
    if (downDiff < upDiff) nearestValue = downValue;
    else nearestValue = upValue;

    if (roundType === 'Down') roundedAmount = downValue;
    else if (roundType === 'Up') roundedAmount = upValue;
    else roundedAmount = nearestValue;

    return roundedAmount;
  };

  let roundToTwo = num => {
    return +(Math.round(num + 'e+2') + 'e-2');
  };

  let totalField = [
    {
      total: 'totalGrossAmount',
      unit: 'grossAmount',
    },
    {
      total: 'totalDiscountAmount',
      unit: 'totalDiscAmount',
    },
    {
      total: 'totalTaxableAmount',
      unit: 'taxableAmount',
    },
    {
      total: 'totalTaxAmount',
      unit: 'taxAmount',
    },
    {
      total: 'totalNettAmount',
      unit: 'nettAmount',
    },
    {
      total: 'totalAmountBeforeSurcharge',
      unit: 'amountBeforeSurcharge',
    },
    {
      total: 'totalSurchargeAmount',
      unit: 'surchargeAmount',
    },
  ];
  for (let i = 0; i < totalField.length; i++) {
    returnData[totalField[i].total] = 0;
  }

  for (let i = 0; i < products.length; i++) {
    if (typeof products[i]['id'] === 'undefined') {
      // products[i]['id'] = uuidV4();
      products[i]['id'] = 'uuidV4()';
    }
    products[i]['sequence'] = i + 1;

    // 1. calculate grossAmount
    products[i]['unitPrice'] =
      typeof products[i]['unitPrice'] !== 'undefined'
        ? products[i]['unitPrice']
        : parseFloat(products[i].product['retailPrice']);
    products[i]['grossAmount'] =
      products[i]['grossAmount'] ||
      parseFloat(products[i].quantity) * parseFloat(products[i]['unitPrice']);
    // 2. set discount parameter
    if (products[i].product['isNonDiscountable'] === false) {
      if (typeof products[i]['discountableAmount'] !== 'number') {
        products[i]['discountableAmount'] = products[i]['grossAmount'];
      }
      if (typeof products[i]['lineDiscPercentage'] !== 'number') {
        products[i]['lineDiscPercentage'] =
          typeof products[i]['lineDiscPercentage'] !== 'undefined'
            ? products[i]['lineDiscPercentage']
            : setPercentage(
                products[i]['lineDiscAmount'],
                products[i]['discountableAmount'],
              );
      }
      if (typeof products[i]['lineDiscAmount'] !== 'number') {
        products[i]['lineDiscAmount'] =
          typeof products[i]['lineDiscAmount'] !== 'undefined'
            ? products[i]['lineDiscAmount']
            : setAmount(
                products[i]['lineDiscPercentage'],
                products[i]['discountableAmount'],
              );
      }
      if (typeof products[i]['billDiscAmount'] !== 'number') {
        products[i]['billDiscAmount'] =
          typeof products[i]['billDiscAmount'] !== 'undefined'
            ? products[i]['billDiscAmount']
            : 0;
      }
    } else {
      products[i]['discountableAmount'] = 0;
      products[i]['lineDiscPercentage'] = 0;
      products[i]['lineDiscAmount'] = 0;
      products[i]['billDiscAmount'] = 0;
    }
    if (typeof products[i]['totalDiscAmount'] !== 'number') {
      products[i]['totalDiscAmount'] =
        parseFloat(products[i]['lineDiscAmount']) +
        parseFloat(products[i]['billDiscAmount']);
    }
    if (typeof products[i]['amountAfterDisc'] !== 'number') {
      products[i]['amountAfterDisc'] =
        parseFloat(products[i]['grossAmount']) -
        parseFloat(products[i]['totalDiscAmount']);
    }

    // 3. calculate tax
    if (typeof products[i]['taxPercentage'] !== 'number') {
      if (
        products[i].product['taxRuleID'] === 'NO-TAX' ||
        typeof products[i].product['taxRuleID'] === 'undefined'
      ) {
        products[i]['taxPercentage'] = 0;
      } else {
        products[i]['taxPercentage'] =
          typeof returnData['outlet']['taxPercentage'] === 'undefined'
            ? 0
            : parseFloat(returnData['outlet']['taxPercentage']);
      }
    }

    if (typeof products[i]['amountBeforeSurcharge'] !== 'number') {
      products[i]['amountBeforeSurcharge'] =
        products[i].product['taxRuleID'] === 'INC-TAX'
          ? setAmountBeforeSurcharge(
              products[i]['amountAfterDisc'],
              products[i]['taxPercentage'],
            )
          : products[i]['amountAfterDisc'];
    }
    if (typeof products[i]['surchargeAmount'] !== 'number') {
      products[i]['surchargeAmount'] = setSurchargeAmount(
        products[i]['amountBeforeSurcharge'],
      );
    }
    if (typeof products[i]['taxableAmount'] !== 'number') {
      products[i]['taxableAmount'] =
        products[i]['surchargeAmount'] + products[i]['amountBeforeSurcharge'];
    }

    if (typeof products[i]['taxAmount'] !== 'number') {
      products[i]['taxAmount'] = setTaxAmount(
        products[i]['taxableAmount'],
        products[i]['taxPercentage'],
      );
    }

    if (typeof products[i]['amountAfterTax'] !== 'number') {
      products[i]['amountAfterTax'] =
        parseFloat(products[i]['taxableAmount']) +
        parseFloat(products[i]['taxAmount']);
    }

    // 4. set rounding value
    if (typeof products[i]['roundingAmount'] !== 'undefined') {
      products[i]['roundingAmount'] =
        typeof returnData.outlet['roundingAmount'] === 'undefined'
          ? 0
          : parseFloat(returnData.outlet['roundingAmount']);
    }
    if (typeof products[i]['nettAmount'] !== 'number') {
      products[i]['nettAmount'] =
        typeof returnData.outlet['roundingRule'] === 'undefined' ||
        returnData.outlet['roundingRule'] === 'None'
          ? products[i]['amountAfterTax']
          : setNettAmount(
              products[i]['amountAfterTax'],
              products[i]['roundingAmount'],
              returnData.outlet['roundingRule'],
            );
    }
    products[i]['modifiers'] =
      typeof products[i]['modifiers'] !== 'undefined'
        ? products[i]['modifiers']
        : [];

    if (products[i]['modifiers'].length > 0) {
      for (let j = 0; j < products[i]['modifiers'].length; j++) {
        let modifiers = products[i]['modifiers'][j];
        if (modifiers.modifier && modifiers.modifier.details) {
          for (let k = 0; k < modifiers.modifier.details.length; k++) {
            let details = modifiers.modifier.details[k];
            if (typeof details.productID !== 'undefined') {
              details.productID = details.productID.startsWith('product::')
                ? details.productID
                : `product::${details.productID}`;
            }

            // try to get product details from product service
            let productResult = _.find(listAllProducts, {
              sortKey: details.productID,
            });

            if (typeof productResult !== 'undefined') {
              let productField = [
                'id',
                'name',
                'categoryID',
                'categoryName',
                'defaultImageURL',
                'retailPrice',
                'taxRuleID',
                'isNonDiscountable',
                'barcode',
              ];
              let productTemp = {};
              // todo : check if this works
              for (let j = 0; j < productField.length; j++) {
                if (typeof productResult[productField[j]] !== 'undefined')
                  productTemp[productField[j]] = productResult[productField[j]];
              }
              // todo : add references
              if (typeof productResult.references !== 'undefined') {
                productTemp.references = productResult.references;
              } else {
                productTemp.references = [];
              }

              details.product = {...productTemp};
              if (typeof details.product.barcode === 'undefined') {
                details.product.barcode = details.barcode;
              }
            }
          }
        }
      }
    }

    for (let j = 0; j < totalField.length; j++) {
      // products[i][totalField[j].unit] = parseFloat(products[i][totalField[j].unit])
      if (typeof products[i][totalField[j].unit] !== 'undefined') {
        returnData[totalField[j].total] += parseFloat(
          products[i][totalField[j].unit],
        );
      }
    }

    // for (let j = 0; j < totalField.length; j++) {
    //     returnData[totalField[j].total] = roundToTwo(parseFloat(returnData[totalField[j].total]));
    // }
  }

  let inclusiveTax = 0;
  let exclusiveTax = 0;
  for (let i = 0; i < products.length; i++) {
    if (products[i].product['taxRuleID'] === 'INC-TAX') {
      if (typeof products[i].taxAmount !== 'undefined') {
        inclusiveTax += products[i].taxAmount;
      }
    } else {
      if (typeof products[i].taxAmount !== 'undefined') {
        exclusiveTax += products[i].taxAmount;
      }
    }
  }

  returnData['details'] = products;
  returnData.inclusiveTax = inclusiveTax;
  returnData.exclusiveTax = exclusiveTax;

  let decimalFields = Object.getOwnPropertyNames(returnData);
  for (let field of decimalFields) {
    if (typeof returnData[field] === 'number') {
      returnData[field] = roundToTwo(returnData[field]);
    }
  }

  if (typeof returnData.details !== 'undefined') {
    if (returnData.details.length > 0) {
      for (let i = 0; i < returnData.details.length; i++) {
        let detailsDecimalFields = Object.getOwnPropertyNames(
          returnData.details[i],
        );
        for (let field of detailsDecimalFields) {
          if (typeof returnData.details[i][field] === 'number') {
            returnData.details[i][field] = roundToTwo(
              returnData.details[i][field],
            );
          }
        }
      }
    }
  }

  return returnData;
};

export default calculateTAX;
