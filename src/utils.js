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
