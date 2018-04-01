/// <reference path='jquery-2.2.0.js' />
$(function () {


    $('body').on('click', 'a', function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });


    // Handle events
    $('label').click(function () { setOptions() });
    $('input').click(function () { setOptions() });
    $('#optionsButton').click(function () { toggleOptionsDiv() });
    $('#title').click(function () { toggleOptionsDiv() });
    //$('#editListOfLenny').click(function () { toggleEditorDiv() });
    $('#createNewListSpan').click(function () { createNewListSpan() });
    $('#createNewListButton').click(function () { createNewListButton() });

    // Variable to store all the options for future use
    var options = null;
    var messageAllowed = true;
    // Retrieve the options on page iniatialization
    getOptions();
    // Load the main page
    loadLenny();



    // ---------------------------------



    // Function to save the options and update the current options via getOptions()
    function setOptions() {
        chrome.storage.local.set({
            showCopiedInformationDialogue: document.getElementById('showCopiedInformationDialogue').checked,
            quickLoad: document.getElementById('quickLoad').checked,
            closeExtensionAfterSelection: document.getElementById('closeExtensionAfterSelection').checked
        });
        getOptions();
    }

    // Function to retrieve the options from the storage
    function getOptions() {
        chrome.storage.local.get([
            'showCopiedInformationDialogue',
            'quickLoad',
            'closeExtensionAfterSelection'
        ],
            function (result) {
                options = result;
                document.getElementById('showCopiedInformationDialogue').checked = result.showCopiedInformationDialogue;
                document.getElementById('quickLoad').checked = result.quickLoad;
                document.getElementById('closeExtensionAfterSelection').checked = result.closeExtensionAfterSelection;
            });
    }

    // Load Lennies in the main page
    function loadLenny(loadFile) {
        if (typeof loadFile === 'undefined') { loadFile = 'defaultList.json' }
        $.getJSON('../json/' + loadFile, function (json) {
            var lennyList = [];
            // Click event handler
            $('main').delegate('.item', 'click', function (e) {
                // copy to clipboard
                e.target.setSelectionRange(0, e.target.value.length);
                document.execCommand('copy');
                e.target.setSelectionRange(0, 0);

                // Options - Copied item dialogue pop-up
                if (options.showCopiedInformationDialogue == true) {
                    // Display copied item
                    showMessage("Ctrl + V to paste<br />" + $(e.target).text());
                }

                // Options - Close extension after selection
                if (options.closeExtensionAfterSelection == true) {
                    window.close();
                }
            });
            // Lenni list filler
            $.each(json, function (index, value) {
                lennyList.push(value);
            });
            // Populate the html with the lennies
            for (i = 0; i < lennyList.length; i++) {
                var size = lennyList[i].length < 17 ? '17' : lennyList[i].length;
                $('main').append('<textarea class="item" readonly="readonly" cols="' + size + '">' + lennyList[i] + '</textarea>');
            }
        });
    }

    function showMessage(message, persistence) {
        if (typeof persistence === 'undefined') { persistence = 1 }
        setTimeout(function () { messageAllowed = true; }, 200 + 600 * persistence);
        if (messageAllowed) {
            $('#messageDiv').html(message);
            $('#messageDiv').fadeIn(200);
            $('#messageDiv').fadeOut(600 * persistence);
            messageAllowed = false;
        }
    }

    // Toggle the options page
    function toggleOptionsDiv() {
        if (options.quickLoad == false) {
            $('#optionsDiv').toggle(500);
            $('main').toggle(500);
        }
        else {
            $('#optionsDiv').toggle(0);
            $('main').toggle(0);
        }

        if ($('#title').html() == 'Options') {
            $('#title').html('Yet another Lenny');
        }
        else {
            $('#title').html('Options');
        }
    }

    // Toggle editorDiv
    function toggleEditorDiv() {
            $('#editorDiv').toggle(0);
    }

    function createNewListSpan() {
        $('#createNewListDiv > div').toggle();
    }

    function createNewListButton() {
        var newFileName = $('#createNewListInput').val();
        if (newFileName.length < 1) {
            showMessage('File name too shot<br />Try longer name', 3);
        }
        else {
            // TODO Chrome storage ...

            chrome.storage.local.get([
            'lists'
            ],
            function (result) {
                var oldLists = result.lists;

                chrome.storage.local.set({
                    lists: result.lists
                });
            });
        }
    }
});