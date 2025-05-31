

function handleConfigFormSubmit(event) {
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
    window.pywebview.api.send_to_app({type:'config',data})
        .then(response => {
            console.log("Python replied:", response);
        });
}