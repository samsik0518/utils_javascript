/***************************************************************************
 This customRequire function load src after all dependencies loaded
 Type of parameter src is a string
 Type of dependencies is an array of string
 Type of success_callback is function
 This function will be updated for handling dependencies of dependencies
 **************************************************************************/

var customRequire = function (src, dependencies, success_callback) {
    console.log("There is/are " + dependencies.length + " dependencies")
    var load = function (dependenciesUrl, index, success_callback) {
        var script = document.createElement('script');
        script.src = dependenciesUrl;
        script.onload = function () {
            console.log(dependenciesUrl + ' loaded');
            if(index<dependencies.length-1){
                load(dependencies[index+1], index+1);
            }else if(index === dependencies.length-1){
                load(src, index+1);
            }else{
                if(success_callback && typeof success_callback === "function") {
                    success_callback();
                }
            }
        };
        script.onerror = function () {
            throw new Error(dependenciesUrl + ' load failed.');
        };
        document.head.appendChild(script);
    }
    load(dependencies[0], 0, success_callback);
}


/***************************************************************************
 This function sort array of object by their field name.
 Usage:
    Let assume variable A is an array of Object with field name 'fieldForSort'
    Then, call it like below
    var sortedArray = A.sort('fieldForSort');
 **************************************************************************/
var sortByObjectFiledName = function(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/***************************************************************************
 This function add leading '0' to number with specific digit.
 Usage:
    var a = 123;
    var result = numberToDigitString(a, 8);
 Result:
    result is '00000123'
 **************************************************************************/
var numberToDigitString = function (number, digit){
    return ("0" + number).slice(-digit);
}

/***************************************************************************
 This function check whether a XMLHTTPRequest is succeed or failed.
 Usage:
 var xhr = new XMLHttpRequest();
 xhr.open('GET', 'pathToRequest');
 xhr.onreadystatechange = function () {
    if (XMLHTTPRequestSuccess(this)) {
    }
    else {
    }
  }
 xhr.send();
 **************************************************************************/
function XMLHTTPRequestSuccess(_this) {
    return _this.readyState === XMLHttpRequest.DONE && (_this.status >= 200 && _this.status < 300)
}
/***************************************************************************
 This function remove an element of array with specific value
 **************************************************************************/
var arrayRemove = function (arr, value) { return arr.filter(function(ele){ return ele != value; });}

/***************************************************************************
 This function remove an element of array with specific value
 **************************************************************************/
var getRoundedNumberWithLocaleFormat = function (number, decimal) {
    if(typeof number == 'number'){
        return Math.round(number).toLocaleString('ko', {maximumFractionDigits: decimal});
    }
    else if(typeof number == 'string'){
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(number)){
            number = number.replace(pattern, "$1,$2");
        }
        return number;
    }
    else {
        throw new Error('It is not a number or a string.');
    }
}
/***************************************************************************
 This function is a promise wrapper of XMLHTTPRequest
 **************************************************************************/
var promiseRequest = function (obj){
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(function(key){
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = function(){
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        };
        xhr.onerror = function(){
            reject(xhr.statusText);
        }
        xhr.send(obj.body);
    });
}
/***************************************************************************
 This function add select options to existing select element.
 Type of selectContainer is an element of select to add options.
 Type of data is array of object.
 Type of valueForUse is an object with dataValue and dataText.

    valueForUse.dataValue is a string which is a field of data object contains.
    valueForUse.dataValue will be used for option value.

    valueForUse.dataText is a string which is a field of data object contains.
    valueForUse.dataText will be used for option innerText.

 **************************************************************************/
var addOptionsToSelection = function (selectContainer, data, valueForUse, defaultOption){
    if(!Array.isArray(data)){
        throw new Error('Input data is not an array');
    }
    if(!selectContainer){
        throw new Error('There is no select element')
    }
    if(!valueForUse){
        throw new Error('No information to set select option value and innerText');
    }
    if(defaultOption){
        var option = document.createElement('option');
        option.value = defaultOption.dataValue;
        option.innerText = defaultOption.dataText;
        selectContainer.appendChild(option);
    }
    for (var i = 0; i < data.length; i++) {
        var option       = document.createElement('option');
        option.value     = data[i][valueForUse.dataValue];
        option.innerText = data[i][valueForUse.dataText];
        selectContainer.appendChild(option);
    }
}
/***************************************************************************
 This function compare img aspect ratio with parentNode of img.

 If img is wider than parentNode, this function add 'horizontal' to img.
 Else, this function add 'vertical' to img.

 To make effect of 'object-fit', add css like below:
    .horizontal {
        height: 100%;
        width: auto;
    }
    .vertical {
        width: 100%;
        height: auto;
    }

  !! This function uses classList WEB API
  !! To use this function on IE, it requires Polyfill
 **************************************************************************/

var setDirection = function (img) {
    if (img.naturalWidth / img.naturalHeight / img.parentNode.offsetWidth * img.parentNode.offsetHeight > 1) {
        img.classList.add('horizontal');
    } else {
        img.classList.add('vertical');
    }
}
/***************************************************************************
 This function return date with formaet below:
    2020-NOV-28
 Usage:
    var formattedDate = getFormattedDate(Date.now());
 **************************************************************************/
var getFormattedDate= function (date){
    var date = new Date(date).toLocaleDateString().replace(/. /g, '-');
    var temp = date.split('-')
    var month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    temp[1] = month[Number(temp[1]) - 1]
    return temp[0] + '-' + temp[1] + '-' + temp[2].split('.')[0];
}

/***************************************************************************
 This function run shallow copy of object
 **************************************************************************/
var clone = function (obj) {
    if (obj === null || typeof(obj) !== 'object')
        return obj;

    var copy = obj.constructor();

    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }

    return copy;
}

var isEqualArrayOfObject = function (a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        var isEqual = new Array(a.length);
        for (var j = 0; j < isEqual.length; j++) {
            isEqual[j] = false;
        }
        for (var j = 0; j < b.length; j++) {
            if (isEquivalent(a[i], b[i])) {
                isEqual[j] = true;
            }
        }
        for (var j = 0; j < isEqual.length; j++) {
            if (!isEqual[j]) {
                return false;
            }
        }
        return true;
    }
}

var isEquivalent = function (a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

var loadImgAsBase64 = function (url, success, failure) {
    let canvas = document.createElement('canvas');
    let img = document.createElement('img');
    img.src = url;

    // This is optional
    img.crossOrigin = "Anonymous";

    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        canvas = null;

        // If you only want to blob data of img, just pass dataURL to callback
        // If you want to use not only blob data, but also want to use original img data,
        // pass both dataURL and img to callback
        success(dataURL, img);
    }
    img.onerror = function () {
        failure();
    }
}
