# twiter_analytic

## Getting Started

Follow these steps to install dependencies, set up MySQL, and run the Express app locally.

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MySQL](https://www.mysql.com/)

### Set Up MySQL

1. Install MySQL on your machine.

2. Create a new database and user for the application.

   ```sql
   CREATE DATABASE db_twitter;
   CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON db_twitter.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;

## Install Dependencies and Run the App
git clone https://github.com/anaclet922/twiter_analytic.git && cd twiter_analytic && npm install && npm start
