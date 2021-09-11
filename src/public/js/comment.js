class ApiRequest {
    static GeneratRequest(url, method, body) {
        const headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        headers.append('Content-Type', 'Application/JSON');

        const req = new Request(url, {
            method,
            headers,
            body: JSON.stringify(body),
            mode: 'cors'
        });

        return req;
    }
}
// const { ApiRequest } = require('./ajax/apiRequest');

window.onload = function () {
    const commentText = document.querySelector('#cMessage');
    const submit = document.querySelector('#submit');
    const commentHolder = document.querySelectorAll('.comment');
    const commentHolderArea = document.querySelector('.commentlist');
    const noComment = document.querySelector('.no-comment');
    const replyFiled = document.querySelector('#cName');
    const replyDiv = document.querySelector('.form-field');

    // all event listener function
    eventListerner();

    function eventListerner() {
        submit.addEventListener('click', commentCreater);
    }
    function commentCreater(e) {
        if (commentText.value) {
            const postId = commentText.dataset.post;
            const data = {
                body: commentText.value
            };

            const req = ApiRequest.GeneratRequest(`/api/comments/${postId}`, 'POST', data);
            fetch(req)
                .then((res) => res.json())
                .then((featchData) => {
                    if (commentHolderArea.children[0].className === 'no-comment') {
                        commentHolderArea.removeChild(commentHolderArea.children[0]);
                    }
                    const commnetElement = createCommentElement(featchData);
                    commentHolderArea.insertBefore(commnetElement, commentHolderArea.children[0]);
                    commentText.value = '';
                })
                .catch((err) => {
                    alert(err.message);
                });
        } else {
            alert('Please Enter a Calid Comment ');
        }
        e.preventDefault();
    }

    commentHolderArea.addEventListener('click', (e) => {
        if (e.target.className === 'comment-reply-link') {
            const replyInput =                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.children;
            if (
                replyInput[2].className === 'form-field'
                && replyInput[2].firstElementChild.classList[1] === 'field-disable'
            ) {
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.children[2].firstElementChild.classList.remove(
                    'field-disable'
                );
                const enterReply =
                    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.children[2]
                        .firstElementChild;

                enterReply.addEventListener('keypress', (event) => {
                    if (event.target.name === 'cName') {
                        if (event.key === 'Enter') {
                            const commentId = event.target.dataset.comment;
                            const replyValue = event.target.value;
                            if (replyValue) {
                                const data = {
                                    body: replyValue
                                };
                                const req = ApiRequest.GeneratRequest(
                                    `/api/comments/replies/${commentId}`,
                                    'POST',
                                    data
                                );
                                fetch(req)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        const replysdata = createReply(data);

                                        const parent = event.target.parentElement.parentElement;

                                        parent.insertBefore(
                                            replysdata,
                                            parent.children[parent.children.length]
                                        );
                                        event.target.value = '';
                                        // const parent = e.target.parentElement.parentElement
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        alert(err.message);
                                    });
                            } else {
                                alert('enter valid reply');
                            }
                        }
                    }
                });
            }
        } else {
            // e.target.parentNode.parentNode.parentNode.parentNode.parentNode.lastElementChild.firstElementChild.className =
            //     'full-width field-disable';
        }
    });
};

function featchAPI(req) {
    let featchData;
    fetch(req)
        .then((res) => res.json())
        .then((data) => {
            featchData = data;
        })
        .catch((err) => {
            alert(err.message);
        });

    return featchData;
}
function createCommentElement(comment) {
    const createComentElement = `
<div class="comment__avatar">
<img class="avatar" src="${comment.user.profilePics}" alt="profilePics"
width="50" height="50">
</div>

<div class="comment__content">

<div class="comment__info">
<div class="comment__author">
${comment.user.username}
</div>

<div class="comment__meta">
<div class="comment__time">

</div>
<div class="comment__reply">
<a class="comment-reply-link" >Reply</a>
</div>
</div>
</div>

<div class="comment__text">
<p>
${comment.body}
</p>
</div>

</div>
<div class="form-field">
<input name="cName" id="cName" class="full-width field-disable"
placeholder="press enter to reply" value="" type="text" data-comment="${comment._id}">
</div>                                    
`;
    const liElement = document.createElement('li');
    liElement.className = 'depth-1 comment';
    liElement.innerHTML = createComentElement;
    return liElement;
}

function createReply(reply) {
    const replay = `
    
<li class="depth-2 comment">

    <div class="comment__avatar">
        <img class="avatar"
            src="${reply.profilePics}" alt=""
            width="50" height="50">
    </div>

    <div class="comment__content">

        <div class="comment__info">
            <div class="comment__author">
            ${reply.username}
            </div>

            <div class="comment__meta">
                <div class="comment__time">
                    
                </div>
                
            </div>
        </div>

        <div class="comment__text">
            <p>
                ${reply.body}
            </p>
        </div>

    </div>
 

</li>
    `;

    // <div class="comment__reply">
    //                 <a class="comment-reply-link"
    //                    >Reply</a>
    //             </div>
    //         <div class="form-field">
    // <input name="cName" id="cName" class="full-width field-disable"
    // placeholder="press enter to reply" value="" type="text" data-comment="${reply.user}">
    // </div>
    const ulElement = document.createElement('ul');
    ulElement.className = 'children';
    ulElement.innerHTML = replay;
    return ulElement;
}
