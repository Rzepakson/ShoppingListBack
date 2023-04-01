
# Zakupsy - create shop lists [backend]

## 📝Description of the project 

This app is backend and API to the frontend Zakupsy app [which is here](https://github.com/Rzepakson/ShoppingListBack). This app allows to create, delete and read shopping lists and products by specific endpoints and HTTP methods. It also allows to register new user and their logging in and logging out. 

### You can see how this app works with frontend via this URL: [rzepakson.networkmanager.pl](rzepakson.networkmanager.pl)

## 💡Solutions used in this project

- encrypting passwords is performed by bcrypt
- this project has records project pattern
- project has 3 records: list, productList and user
- project routes are divided into 3 routers
- project shares types with frontend
- used database is mysql
- toll for manage database is phpMyAdmin
- database has 3 tables - each table represents one record
- database relation type is one to many
- ids are created by uuid package

## ⚙️How to install and run the project locally

`npm i` - installation of packages included in package.json

`ts-node index.ts` - run the project

`tsnd index.ts` - run the project with live changes

## 👨‍💻Technologies used
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 💪Things to do:
- authentication via JWT token
- sending confirmation email after registration
- fix future bugs
