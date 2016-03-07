##Fifty-Fifty##

App for table sharing at a coffee shop. 

[Thread tracking development thought-process](https://github.com/chasestarr/ideas/issues/5)

To get this project running locally:


1. Clone the repo to your local machine
2. Run npm install within the base repo folder
3. Create a "yelpConfig.js" file within the "./config" folder. I'm not sharing my yelp API keys - please insert your own into a js object like below:
```
module.exports = {
    consumer_key: <CONSUMER_KEY>,
    consumer_secret: <CONSUMER_SECRET>,
    token: <TOKEN>,
    token_secret: <TOKEN_SECRET
};
```
4. Install MongoDB and use the "fifty-fifty" db name. Collection is called "restuarants"
5. run "gulp serve" to start the server at http://localhost:3000/


