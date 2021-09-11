window.onload = function () {
    tinymce.init({
        selector: '#postarea',
        plugins:
            'a11ychecker advcode casechange preview formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker image code',
        toolbar:
            'a11ycheck preview casechange checklist code formatpainter pageembed permanentpen table undo redo | link image | code',
        toolbar_mode: 'floating',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        automatic_uploads: true,
        images_upload_url: '/upload/postimages',
        images_upload_handler: postImagesUpload
    });
    function postImagesUpload(blobInfo, success, failure) {
        const header = new Headers();
        header.append('Accept', 'Applications/JSON');

        const formData = new FormData();
        formData.append('post-image', blobInfo.blob(), blobInfo.filename());

        const req = new Request('/upload/postimages', {
            method: 'POST',
            header,
            mode: 'cors',
            body: formData
        });

        return fetch(req)
            .then((res) => res.json())
            .then((data) => success(data.imgeurl))
            .catch(() => failure('HTTP Error'));
    }
};
