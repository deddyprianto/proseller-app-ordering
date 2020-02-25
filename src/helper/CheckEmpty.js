module.exports = {
  isEmptyObject: obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  },
  isEmptyArray: arr => {
    let data = Array.isArray(arr) && arr.length;
    if (data > 0) {
      return false;
    }
    return true;
  },
};
