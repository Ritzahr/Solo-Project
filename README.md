My first Solo project. 

Link to hosted version: https://nc-news-api-qqkg.onrender.com/
Summary: This is my first solo project and it is an API that interacts with a news-page-like database, serving the user news articles, comments regarding the articles and some basic data on users who've commented.
Dependencies requried: supertest, husky, jest, express, pg, pg-format.

To clone repo, please copy the link provided on the <CODE> button at the top right of the repo files, and hit git clone in your terminal with the URL pasted. 
Regarding dependencies:
  -Please install husky, jest and supertest as Dev dependencies, using npm install <dependency> -D.
  -Please install express, pg and pg-format as normal dependencies, using the command npm install (without the -D). 
  
To setup database, seed and run tests, please follow the below instructions:
 - In the terminal use the command: npm run setup-dbs
 - Then use: npm run seed, to fill the database with data.
 - When test suites are all setup, run the tests using the npm run test command, ensure that within package.json "scripts" has "test" set as "jest"
 - As part of the setup you will need to create two .env files, one with the extension ".development" and one with the extentsion ".test".
 - Each of the files will need to contain a "PGDATABASE=" that will equal the name of the databases, namely nc_news and nc_news_test, ensure they are each present within their own env files.
 - Make sure to add those files to the .gitignore file to hide them for safety reasons.

Node v21.5.0 and PostgreSQL 14.11 required for this project. 
