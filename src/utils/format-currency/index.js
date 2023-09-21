export const formatCurrency = (val, type = "comma") => {
    // remove sign if negative
    let sign = 1;
    if (val < 0) {
      sign = -1;
      val = -val;
    }
  
    // trim the number decimal point if it exists
    let num = val.toString().includes(".")
      ? val.toString().split(".")[0]
      : val.toString();
  
    if (type === "space") {
      while (/(\d+)(\d{4})/.test(num.toString())) {
        // insert space to 4th first position to the match number
        num = num.toString().replace(/(\d+)(\d{4})/, `$2 $1`);
      }
    }
    if (type === "comma") {
      while (/(\d+)(\d{3})/.test(num.toString())) {
        // insert comma to 4th last position to the match number
        num = num.toString().replace(/(\d+)(\d{3})/, `$1,$2`);
      }
    }
  
    // add number after decimal point
    if (val.toString().includes(".")) {
      num = num + "." + val.toString().split(".")[1];
    }
  
    // return result with - sign if negative
    return sign < 0 ? "-" + num : num;
  };

export const handleCurrency = (currency) => {
    let tmpPrice = formatCurrency(currency);
    let priceArr = tmpPrice.split(",");
    let price = "";
    for(let i = 0; i < priceArr.length; i++){
        price += priceArr[i];
    }
    return price;
    // setFieldValue('price', price);
    // setPriceAsset(formatCurrency(price));
}
  
  