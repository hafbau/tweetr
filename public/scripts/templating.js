// escaping input from the user safeguard against xss
const escape = (str) => {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = (tweetData, handle) => {
  const likes = tweetData.likes;
  const likesCount = likes ? likes.length : 0;
  const off = (likes && likes.includes(handle)) ? 'off' : '';
  let html = `<article class="radius-general" data-this-tweet="${tweetData._id}">
                <header>
                  <img alt="avatar" class="tweet-avatar" src="${escape(tweetData.user.avatars.regular)}" 
                  height="80px" width="80px">
                  <h2 class="author">${escape(tweetData.user.name)}</h2>
                  <address class="author-handle">${escape(tweetData.user.handle)}</address>
                </header>
                <blockquote class="tweet-body" cited="${escape(tweetData.user.name)}">
                  <p>${escape(tweetData.content.text)}</p>
                </blockquote>
                <footer>
                  <time datetime="${(new Date(tweetData.created_at)).toUTCString()}">${formatTime(tweetData.created_at)}</time>
                  <ul class="tweet-actions float-right">
                    <li><i class="fa fa-flag" aria-hidden="true" data-tweetr-action-type="flags">0</i></li>
                    <li><i class="fa fa-retweet" aria-hidden="true" data-tweetr-action-type="shares">0</i></li>
                    <li><i class="fa fa-heart ${off}" aria-hidden="true" data-tweetr-action-type="likes">${likesCount}</i></li>
                  </ul>
                </footer>
              </article>`
  return $(html);
};

const loggedInNav = (handle) => {
  const html = `<span>${handle}</span>
      <button class="compose radius-general float-right"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Compose</button>
      <form method="post" action="/logout">
        <button class="logout">Logout</button>
      </form>`;

  return $(html);
}
