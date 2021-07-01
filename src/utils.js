/*===========================*/
/*======= Utilities =========*/
/*===========================*/

function deepCopy(array) {
    newArr = [];
    array.forEach(element => {
        newArr.push(element);
    });
    return newArr;
}

function getEntryName() {
    return document.getElementById(ID_E_NAME).value;
}
