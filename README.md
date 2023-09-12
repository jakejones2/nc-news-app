# Daily Express.js

_Daily Express.js_ a front-end React app that serves (currently generic) information from my [Articles API](https://github.com/jakejones2/articles-api) back end. Content kindly provided by the **Northcoders** bootcamp!

Try it out [here!](https://nc-news-68e5d5.netlify.app/)

## About

You can browse the main feed (on the top left) without logging in. Filter and scroll through article preview cards, clicking on the title or image to access the full article and its comments. You can also click on users to access their profile and see what they have been up to!

To vote for articles, post comments, create articles and more, click **Sign In** on the top left. Here you can use the default profile _Tickle122_. Alternatively, create your own protected account via the **Sign Up** button. Keep your password safe - there is no recovery system in place yet.

To vote, click the star icon. Articles and comments you have voted for will be gold in colour. To comment, navigate to the article proper, and click on the comments drop down below the main text. Here there is an input box to post new comments.

In the end I decided on a hybrid **pagination** and **infinite scrolling** system. When on the first page, keep scrolling to the bottom to generate new content. However, if you click **next** on the pages and filters bar, you will revert to normal pagination for faster navigation and url parameterization.

## Setup

1. Clone the repo with `git clone https://github.com/jakejones2/nc-news-app`
2. Cd into the new folder, and run `npm install` to install all dependencies
3. To start a local server, run `npm run dev`, and follow the link in the terminal.

## To do

### Features

- Implement random article button
- Implement searching for articles
- Build pagination and querying when viewing a user's liked articles/comments
- Add a logo for logged in users (without squishing the nav bar too much)
- Have the site remember the user's place within scrolled content for intuitive back button motion

### Code

- Apply a CSS naming convention
- Improve SEO
- Sort order of h tags for better accessibility
- Manage 404s better
- Improve error handling on the Profile page
- Built a test suite
- Research custom hooks and break up some larger components
- Get better at React!
