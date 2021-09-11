window.onload = function () {
    const model = document.querySelector('#crop-modal');
    const myModal = new bootstrap.Modal(model, {});
    const baseCroppin = $('#crop-images').croppie({
        viewport: {
            width: 200,
            height: 200
        },
        boundary: {
            width: 300,
            height: 300
        },
        showzoomer: true
    });
    function readableFile(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            baseCroppin
                .croppie('bind', {
                    url: event.target.result
                })
                .then(() => {
                    $('.cr-slider').attr({
                        min: 0.5,
                        max: 1.5
                    });
                });
        };
        reader.readAsDataURL(file);
    }

    $('#profilePicFile').on('change', function (e) {
        if (this.files[0]) {
            readableFile(this.files[0]);
            myModal.show();
            new bootstrap.Modal(model, {
                backdrop: 'static',
                keyboard: false
            });
        }
    });

    $('#cancle-modal').on('click', (e) => {
        document.querySelector('#profilePicsForm').reset();
        myModal.hide();
        // setTimeout(() => {
        //     baseCroppin.croppie('destroy');
        // }, 1000);
    });

    $('#closes').on('click', (e) => {
        document.querySelector('#profilePicsForm').reset();
        myModal.hide();
        // setTimeout(() => {
        //     baseCroppin.croppie('destroy');
        // }, 1000);
    });

    $('#cropImageBtn').on('click', () => {
        baseCroppin
            .croppie('result', 'blob')
            .then((blob) => {
                const formData = new FormData();

                const file = document.querySelector('#profilePicFile').files[0];

                const name = generateFileName(file.name);
                formData.append('profilePics', blob, name);

                const headers = new Headers();
                headers.append('Accept', 'Application/JSON');

                const req = new Request('/upload/profilePics', {
                    method: 'POST',
                    headers,
                    mode: 'cors',
                    body: formData
                });

                return fetch(req);
            })
            .then((res) => {
                const data = res.json();
                return data;
            })
            .then((data) => {
                if (data) {
                    document.querySelector('#removeProfilePics').style.display = 'block';
                    document.querySelector('#setprofileimg').src = data.profilePics;
                    document.querySelector('#profilePicsForm').reset();
                    myModal.hide();

                    // setTimeout(() => {

                    //     baseCroppin.croppie('destroy');
                    // }, 1000);
                }
            });
    });

    $('#removeProfilePics').on('click', (e) => {
        const req = new Request('/upload/profilePics', {
            method: 'DELETE',
            mode: 'cors'
        });

        fetch(req)
            .then((res) => res.json())
            .then((data) => {
                document.querySelector('#removeProfilePics').style.display = 'none';
                document.querySelector('#setprofileimg').src = data.profilePics;
                document.querySelector('#profilePicsForm').reset();
            })
            .catch((err) => {
                // myModal.hide();
                // setTimeout(() => {

                //     baseCroppin.croppie('destroy');
                // }, 1000);
                console.log(err);
                alert('Server Error Ocert');
            });
        e.preventDefault();
    });
};

function generateFileName(name) {
    const types = /(\.jpeg|\.jpg|\.png|\.gif)/;
    return name.replace(types, '.png');
}
