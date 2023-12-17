# twiter_analytic

## Getting Started

Follow these steps to install dependencies, set up MySQL, and run the Express app locally.

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MySQL](https://www.mysql.com/)
- [Reference_File](https://github.com/anaclet922/twiter_analytic/releases/tag/refence_file)

### Set Up MySQL

1. Install MySQL on your machine.

    ```If you don't have time to run extrat route, import db_twitter.sql```

2. Create a new database and user for the application.

   ```sql
   CREATE DATABASE db_twitter;
   CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON db_twitter.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;

## Install Dependencies and Run the App
git clone https://github.com/anaclet922/twiter_analytic.git && cd twiter_analytic && npm install && npm start

## Routes

1. ```/test``` (to test if server is reacheable)
2. ```/delete_all``` (to delete all data in database; if you want to run more extract route or you get new reference file)
3. ```/q2 (with some``` query paramaters to get users recommendation)