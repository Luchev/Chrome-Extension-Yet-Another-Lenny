/// <reference path='jquery-2.2.0.js' />
$(function () {
    $('label').click(function () { setOptions() });
    $('input').click(function () { setOptions() });

    getOptions();
    
    function resetOptions() {
        chrome.storage.sync.set({
            showCopiedInformationDialogue: false
        });
    }

    function setOptions() {
        chrome.storage.sync.set({
            showCopiedInformationDialogue: document.getElementById('showCopiedInformationDialogue').checked
        });
    }

    function getOptions() {
        chrome.storage.sync.get([
            'showCopiedInformationDialogue'
            ],
            function (result) {
                document.getElementById('showCopiedInformationDialogue').checked = result.showCopiedInformationDialogue;
        });
    }

});