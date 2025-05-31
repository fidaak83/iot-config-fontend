var notyf = new Notyf();

function handleConfigFormSubmit(event, type) {
    event.preventDefault(); // Prevent page reload

    const form = event.target;
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log("Form data:", data);
    // return data; // You can also send it to Python here
    // Call Python method via pywebview's exposed API

    send_to_app({ type: type, data })

}

function send_to_app(data) {
    window.pywebview.api.send_to_app(data)
        .then(response => {
            // Display a success notification
            notyf.success(response);
            console.log("Python replied:", response);
        });
}

function getComs() {
    window.pywebview.api.get_com_ports().then(response => {
        // notyf.success(JSON.stringify(response));
        // return
        const list = document.getElementById('comList'); // Ensure your <ul> has id="comList"
        list.innerHTML = ''; // Clear old entries

        response.forEach((c, index) => {
            const id = `helper-radio-${index}`;
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="flex p-2 rounded-sm hover:bg-gray-600">
                    <div class="flex items-center h-5">
                        <input id="${id}" name="helper-radio" type="radio" value="${c.serial}"
                            class="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2"
                            onchange="onRadioChange(event)">
                    </div>
                    <div class="ms-2 text-sm">
                        <label for="${id}" class="font-medium text-gray-300">
                            <div>${c.serial}</div>
                            <p class="text-xs font-normal text-gray-300">${c.device}</p>
                        </label>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
        notyf.success('COM list updated');
    });
}


function onRadioChange(event) {
    const selected = event.target;
    const value = selected.value;


    // console.log("Selected value:", value);
    send_to_app({ type: 'com', com: value })

    // You can now call your custom logic here
    // exampleFunction(selected.value, title, description);
}
document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('input[name="helper-radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', onRadioChange);
    });
});

function exit() {
    send_to_app({ type: 'exit' })
}