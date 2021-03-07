
const new_mail_arrived_check_checkbox = document.getElementById('new_mail_arrived_check');
const folder_selected_checkbox = document.getElementById('folder_selected_check');

function storeSettings() {

    function getNewMailStatus() {
        const new_mail_arrived_check = new_mail_arrived_check_checkbox;
        return new_mail_arrived_check.checked;
    }
  
    function getFlolderSelectedStatus() {
        const folder_selected_check = folder_selected_checkbox;
        return folder_selected_check.checked;
    }
 
    const new_mail_arrived_check = getNewMailStatus();
    const folder_selected_check = getFlolderSelectedStatus();
    browser.storage.local.set({
        new_mail_arrived_check,
        folder_selected_check
    });
}

function updateUI(restoredSettings) {
    if (restoredSettings.new_mail_arrived_check) {
        new_mail_arrived_check_checkbox.checked = restoredSettings.new_mail_arrived_check.checked;
    }
    if (restoredSettings.folder_selected_check) {
        folder_selected_checkbox.checked = restoredSettings.folder_selected_check.checked;
    }
}

function onError(e) {
    console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
