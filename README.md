# Daily Express.js

_Daily Express.js_ a front-end React app that serves information from my [Articles API](https://github.com/jakejones2/articles-api) back end.

## About

You can browse the main feed (on the top left) without logging in. Filter and scroll through article preview cards, clicking on the title or image to access the full article and its comments. You can also click on users to access their profile, and see what they have been up to!

To vote for articles, post comments, create articles and more, click **Sign In** on the top left. Here you can use the default profile _Tickle122_. Alternatively, create your own protected account via the **Sign Up** button. Keep your password safe - there is no recovery system in place yet.

To vote, click the star icon. To comment, navigate to the article proper, and click on the comments drop down below the main text. Here there is an input box to post new comments.

In the end I decided on a hybrid **pagination** and **infinite scrolling** system. When on the first page, keep scrolling to the bottom to generate new content. However, if you click **next** on the pages and filters bar, you will revert to normal pagination for faster navigation and url parameterization.

## Setup

1. Clone the repo with `git clone https://github.com/jakejones2/nc-news-app`
2. Cd into the new folder, and run `npm install` to install all dependencies
3. To start a local server, run `npm run dev`, and follow the link in the terminal.

## To do

### Features

- Implement random article
- Implement searching
- Build pagination and querying into viewing a user's liked articles/comments
- Add a logo for logged in users without squishing nav bar too much
- Have site remember place within scrolled content for intuitive back button motion

### Code

- Apply a CSS naming convention
- Manage 404s better, unneccessary in some places
- Improve error handling on Profile page
- Built a test suite
- Research custom react hooks and break up some larger components
