const getValueArrayOfObj = (data) => {
    if (Array.isArray(data)) {
        return data;
    }
    return Object.keys(data).map((key, index) => {
        return data[key];
    });
}
const getAllKey = (data, key) => {
    var arrayObj = [];
    var lstImage = [];
    arrayObj = getValueArrayOfObj(data);
    while (arrayObj.length > 0) {
        var obj = arrayObj[0];
        arrayObj.splice(0, 1);
        if (typeof (obj) != "object") {
            continue;
        }
        var lstKey = getValueArrayOfObj(obj);
        lstKey.forEach(element => {
            if (element[key]) {
                lstImage.push(element[key]);

            } else {
                arrayObj.push(element);
            }
        });
    }
    return lstImage;
}
export { getAllKey }