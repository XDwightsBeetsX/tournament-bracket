/*===========================*/
/*===== On Window Load ======*/
/*===========================*/
window.onload = function() {
    listenForEntry();
}

function listenForEntry() {
    var input = document.getElementById('entry');
    input.addEventListener('keyup', function(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            var submitButton = document.getElementById('btn-entry-submit');
            submitButton.click();
        }
    });
}


/*===========================*/
/*========= Dynamic =========*/
/*===========================*/
function newEntry() {
    var input = document.getElementById("entry");
    var entry = input.value;
    input.value = '';
    alert("Added " + entry + "!");
}
