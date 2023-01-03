# STodoList-server

<p>Backend application for STodoList made by using nodejs, typescript, prisma and mongodb.</p>

## Requirements

- Nodejs <= 14.x and npm <= 8.x
- Typescript 4.x
- [Express](https://expressjs.com/) 
- [Prisma](https://www.prisma.io/)

## Installation

- Cloning the repo
  
  ```console
   
    git clone https://github.com/Besufikad17/STodoList-server.git

   ```
- Navigating to project directory

    ```console

     cd STodoList-server
    ```
- Installing depedencies

    ```console

     npm install
    ```
- Running the server
   
   ```console
    npm run dev
   ```

## Usage

### Endpoints

| Endpoint       | Body/Params                    | Request type | URL             |
|----------------|--------------------------------|--------------|-----------------|
| Signup         | { email, username, password }  | POST         | /api/signup     |
| Login          | { username, password }         | POST         | /api/login      |
| GetTodoList    | Parmas: id <string>            | GET          | /api/todos/:id  |
| UpdateTodoList | Parmas: id <string>            | PUT          | /api/update/:id |
| ExportTodoList | Parmas: id <string>            | GET          | /api/export/:id |
