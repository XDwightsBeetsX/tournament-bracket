/*===========================*/
/*======== Globals ==========*/
/*===========================*/
var Entries = [];


/*===========================*/
/*===== Window Loading ======*/
/*===========================*/
window.onload = function() {
    // Sets up Globals and Event Listeners
    listenForEntry();
    Entries = [];
}

window.onbeforeunload = function() {
    // Prevents unintentional refreshing, which loses data
    return "Data will be lost if you leave the page, are you sure?";
};


/*===========================*/
/*===== Event Listeners =====*/
/*===========================*/
function listenForEntry() {
    // Allows user to shortcut clicking the button by pressing 'Enter' 
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
    // Reads in new entry and resets the input box
    var input = document.getElementById("entry");
    var val = input.value;
    if (val != null && val != ''){
        var newEntry = new Entry(val);
        addEntryToList(newEntry);
    }
    input.value = '';    
}

function addEntryToList(newEntry) {
    // Makes a new div on the page with the entry name
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