window.onload = function () {
    const likeBtn = document.querySelector('#likebtn');
    const dislikeBtn = document.querySelector('#dislikebtn');

    likeBtn.addEventListener('click', (e) => {
        const postId = likeBtn.dataset.post;

        reqLikeDislike('likes', postId)
            .then((res) => res.json())
            .then((data) => {
                
                if (data.liked) {
                    
                    let likeText = '<i class="far fa-thumbs-up"></i>liked';
                    likeText += ` ${data.totalLikes}`;
                    let dislikeText = '<i class="far fa-thumbs-down"></i> dislike ';
                    dislikeText += `${data.totalDislikes > 0 ? data.totalDislikes : 0}`;
                    likeBtn.className = 'cursor active';
                    likeBtn.innerHTML = likeText;

                    dislikeBtn.className = 'cursor';
                    dislikeBtn.innerHTML = dislikeText;
                } else {
                    let likeText = '<i class="far fa-thumbs-up"></i>like';
                    likeText += ` ${data.totalLikes}`;
                    // let dislikeText = '<i class="far fa-thumbs-down"></i> dislike ';
                    // dislikeText += `${data.totalDislikes > 0 ? data.totalDislikes : 0}`;
                    likeBtn.className = 'cursor';
                    likeBtn.innerHTML = likeText;

                    // dislikeBtn.className = 'cursor';
                    // dislikeBtn.innerHTML = dislikeText;
                }
            })
            .catch((err) => {
                console.log(err);
                
                alert(err);
            });
    });

    dislikeBtn.addEventListener('click', (e) => {
        const postId = dislikeBtn.dataset.post;
        reqLikeDislike('dislikes', postId)
            .then((res) => res.json())
            .then((data) => {
                if (data.disliked) {
                    
                    let dislikeText = '<i class="far fa-thumbs-down"></i>disliked';
                    dislikeText += ` ${data.totaldislikes}`;
                    let likeText = '<i class="far fa-thumbs-up"></i>like';
                    likeText += `${data.totalLikes > 0 ? data.totalLikes : 0}`;
                    dislikeBtn.className = 'cursor active';
                    dislikeBtn.innerHTML = dislikeText;

                    likeBtn.className = 'cursor';
                    likeBtn.innerHTML = likeText;
                } else {
                    let dislikeText = '<i class="far fa-thumbs-down"></i>dislike';
                    dislikeText += ` ${data.totaldislikes}`;
                    // let likeText = '<i class="far fa-thumbs-up"></i>like';
                    // likeText += `${data.totalLikes > 0 ? data.totalLikes : 0}`;
                    dislikeBtn.className = 'cursor';
                    dislikeBtn.innerHTML = dislikeText;

                    // likeBtn.className = 'cursor';
                    // likeBtn.innerHTML = likeText;
                }
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            });
    });
    function reqLikeDislike(type, postId) {
        const headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        headers.append('Content-Type', 'Application/JSON');

        const req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors'
        });

        return fetch(req);
    }
};
