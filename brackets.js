/*===========================*/
/*======== Gloabals =========*/
/*===========================*/
var Entries = [];


/*===========================*/
/*===== On Window Load ======*/
/*===========================*/
window.onload = function() {
    listenForEntry();
    Entries = [];
}


/*===========================*/
/*===== Event Listeners =====*/
/*===========================*/
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
    var newEntry = new Entry(input.value);
    input.value = '';
    alert("Added " + newEntry.Name + "!");
    addEntryToList(newEntry);
}

function addEntryToList(newEntry) {
    Entries.push(newEntry);
    var newEntryDiv = document.createElement('div');
    newEntryDiv.innerHTML = newEntry.Name;
    document.getElementById("entryList").appendChild(newEntryDiv);
}


class Entry {
    constructor(name, seed=null) {
        this.Name = name;
        this.Seed = seed;
    }
}