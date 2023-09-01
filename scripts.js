// this event listener  is to prevent the All Notes Section from refreshing i.e saved notes being erased on refresh of page

//document.addEventListener(eventType, namedCallbackFunction);   syntax for event listener --

function DisplaySavedTextInACard(savedText, Key) {
  debugger;
  let card = document.createElement('div');
  let randomIdentifier = Math.random().toString(36).substring(2, 8);  // used for making unique id's for each 3 dots in all cards.
  let Idfor3Dots = `${Key} ${randomIdentifier}`;  // this unique id is given to each 3 dots in each card.

  card.className = 'card mt-2';
  card.innerHTML = `
  <div class="card-header d-flex justify-content-end">
    <i class="fas fa-ellipsis-v"  id="${Idfor3Dots}" onclick="ShowDeleteModalOnClick(event)"></i>   
  </div>
  <div class="card-body">
    <p class="card-text text-truncate" style="max-width: 100%;">${savedText}</p>
  </div>
`;

  let ulElement = document.getElementById('notes-list');
  let liElement = document.createElement('li');
  liElement.className = 'list-group-item';
  liElement.id = Key;  // giving each li an id which can be targeted for deletion, the id is key for note- text saved in local storage...
  liElement.appendChild(card);
  ulElement.appendChild(liElement);

}


function SaveNotes() {
  debugger;
  let noteInput = document.getElementById('note-input');
  let text = noteInput.value;
  const currentDate = new Date();
  const DateNow = currentDate.toLocaleDateString('en-GB');  // 'en-GB' represents the dd/mm/yyyy format
  const TimeNow = currentDate.toLocaleTimeString('en-US', { hour12: false });  // 24-hour format

  if (text !== "") {  // if text entered in textarea is not null, store it in local storage.         
    let noteKey = `${DateNow} ${TimeNow}`;
    localStorage.setItem(noteKey, text);  // saves text to local storage.


    let savedText = text;
    // now the below code is to fetch the saved notes from local storage and display under All Notes Section 

    DisplaySavedTextInACard(savedText, noteKey);

    // now the saved notes will be displayed below the All Notes Section....
    // but after hitting on save button, we also want the text to clear out in note-input, therefore use ClearNotes function to clear notes.
    ClearNotes();
  }

}

// this function is to clear notes when clear button is clicked--
function ClearNotes() {
  debugger;
  let noteInput = document.getElementById('note-input');
  document.getElementById('note-input').value = "";  // clear the text or make it empty i.e note-input 's value attribute is made "".
}


function PreventSavedNotesFromErasingOnReload() {
  debugger;
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i); // Get the key (name) of the item at index i
    let value = localStorage.getItem(key); // Get the value associated with the key i.e the saved text
    let savedText_at_ith_key = value;
    if (savedText_at_ith_key !== "") {
      DisplaySavedTextInACard(savedText_at_ith_key, key);

    }
  }

}

document.addEventListener('DOMContentLoaded', PreventSavedNotesFromErasingOnReload);  // this event listener on event - reload i.e DOMContentLoaded calls function PreventSavedNotesFromErasingOnReload which

// prevents notes from getting erased on reload of page.

// function to delete each notes..

function ShowDeleteModalOnClick(event) {  // each time modal is clicked same key is getting added
  debugger;
  // get Id of the 3dots
  let targetElement = event.target;
  let timestapKey = targetElement.id;  // unfiltered key
  let arraykey = timestapKey.split(" ");
  let actualkey = arraykey[0] + " " + arraykey[1];  // the key or actual key i.e key for the li element

  //on click show the modal...
  let modal = document.getElementById("optionsModal");
  console.log(modal);// just to check if modal is accessible.
  let timestampElement = modal.querySelector('#timestampKey');   // targetting timestapKey element in modal.
  console.log(timestampElement);
  let InsertDateTimeNode = document.createTextNode(actualkey);
  timestampElement.appendChild(InsertDateTimeNode);    // timestamp is inserted after created on, which also acts as a key, later we will retrieve it delete function.
  // Show a Bootstrap modal, we need to use Jquery here as  Javascript code - modal.style.display = "block"; won't work here
  $('#optionsModal').modal('show');

}

function ClearTimeStampInsideModalOnClosing() {
  debugger;
  let modal = document.getElementById("optionsModal"); // just to check if modal is accessible.
  console.log(modal);
  let timestampElement = modal.querySelector('#timestampKey'); // corrected id
  const timestampText = timestampElement.textContent;  // get the text  i.e  "SomeDate SomeTime"
  console.log(timestampText);
  timestampElement.textContent = "";  // removing timestamp i.e date time(key)
  console.log(timestampElement.textContent);
}

function DeleteNote() {
  debugger;
  let modal = document.getElementById("optionsModal");
  // grab the key or timestamp from timestapKey Id....
  let timestampElement = modal.querySelector('#timestampKey');
  const timestampText = timestampElement.textContent;  // get the text  i.e  "Created On : SomeDate SomeTime"
  console.log(timestampText);
  let key = timestampText.trim();      // get the actual key

  localStorage.removeItem(key);  // deleting value associated with - key

  let liElement_to_beDeleted = document.getElementById(key);
  console.log(liElement_to_beDeleted);
  if (liElement_to_beDeleted) {   // if such element exists then remove it from displaying in DOM i.e document
    liElement_to_beDeleted.remove(); // Removes the element from the DOM
  }

  // window.location.reload();    //not required but helpful
  // close the modal after delete.
  CloseModal();
}

// some extra functions---
function CloseModal() {
  //clear timestamp whenever we close the modal
  ClearTimeStampInsideModalOnClosing();
  $('#optionsModal').modal('hide');

}
