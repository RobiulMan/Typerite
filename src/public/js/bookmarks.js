window.onload = function () {
    const bookmarks = document.querySelectorAll('.bookmark-btn');
    [...bookmarks].forEach((item) => {
        item.addEventListener('click', (event) => {
            const targets = event.target.parentElement;
            if (event.target.classList[0] === 'far') {
                const headers = new Headers();
                headers.append('Accept', 'Application/JSON');

                const req = new Request(`/api/bookmarks/${targets.dataset.post}`, {
                    method: 'GET',
                    headers,
                    mode: 'cors'
                });

                fetch(req)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.bookmarks) {
                            targets.className = 'bookmark-btn active';
                        } else {
                            targets.className = 'bookmark-btn ';
                        }
                    })
                    .catch((err) => {
                        console.error(err.response.data);
                        alert(err.response.data.error);
                    });
            }

            event.stopPropagation();
        });
    });
};
/**

 */
