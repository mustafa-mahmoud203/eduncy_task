# Project Setup Instructions

### 1. Clone the Project

After cloning this project, follow the steps below to set it up.

### 2. Add an `.env` File

Add an `.env` file in the root directory with the following content:
```bash
DATABASE_URL="postgresql://root:123123@postgres_db:5432/crm_contact_db?schema=public"
PORT=3000
NODE_ENV="Production"
POSTGRES_USER="root"
POSTGRES_PASSWORD=123123
POSTGRES_DB="crm_contact_db"
```
### 3. Run this 2 commands
```bash
npm i
npx prisma generate
```
### 4. Run the Project with Docker

To start the project using Docker, use the following command:
```bash
docker-compose up --build
```
### 5. Access the API At 
```bash
 http://localhost:3000
```

# Testing



# API Documentation

### Example Endpoints
#### 1. **POST /contacts**
   - **Description**: Create a new contact.
   - **Request**:
     - **Request Body**:
       ```json
       {
          "first_name":"Mustafa",
          "last_name":"Mahmoud",
          "email":"Mustafa@gmail.com",
          "company":"eduncy",
          "balance":20000
        }
       ```
   - **Response**:
     ```json
           {
              "message": "Done",
              "data": {
                  "id": "d2c3e893-1425-4f5c-a9e9-e3d7431d581a",
                  "first_name": "Mustafa",
                  "last_name": "Mahmoud",
                  "email": "Mustafa@gmail.com",
                  "company": "eduncy",
                  "balance": "20000",
                  "isDeleted": false,
                  "createdAt": "2025-02-09T14:55:19.359Z",
                  "updatedAt": "2025-02-09T14:55:19.359Z"
                 }
           }
    ```

#### 2. **GET /contacts**
   - **Description**: List contacts with filtering by company, is_deleted, and created_after.
   - **Request**:(No request body needed)
   - **Response**:
     ```json
     {
        "message": "Done",
        "length": 2,
        "data": [
           
            {
                "id": "d2c3e893-1425-4f5c-a9e9-e3d7431d581a",
                "first_name": "Mustafa",
                "last_name": "Mahmoud",
                "email": "Mustafa@gmail.com",
                "company": "eduncy",
                "balance": "20000",
                "isDeleted": false,
                "createdAt": "2025-02-09T14:55:19.359Z",
                "updatedAt": "2025-02-09T14:55:19.359Z"
            },
            {
                "id": "3533d3a2-ceeb-4074-8020-37226e0f9f44",
                "first_name": "mohamed",
                "last_name": "mahmoud",
                "email": "mohamed@gmail.com",
                "company": "google",
                "balance": "18000",
                "isDeleted": false,
                "createdAt": "2025-02-09T14:16:56.529Z",
                "updatedAt": "2025-02-09T14:16:56.529Z"
            }
        ]
    }
   ```
#### 3. **GET /contacts/{id}**
   - **Description**: Fetch a specific contact by ID.
   - **Request**:
     - **URL Parameter**:
       - `id`: UUID
   - **Response**:
     ```json
     {
        "message": "Done",
        "data": {
            "id": "d2c3e893-1425-4f5c-a9e9-e3d7431d581a",
            "first_name": "Mustafa",
            "last_name": "Mahmoud",
            "email": "Mustafa@gmail.com",
            "company": "eduncy",
            "balance": "20000",
            "isDeleted": false,
            "createdAt": "2025-02-09T14:55:19.359Z",
            "updatedAt": "2025-02-09T14:55:19.359Z"
        }
    }
   ```
#### 4. **PATCH /contacts/{id}**
   - **Description**: Update a specific contact by ID.
   - **Request**:
     - **URL Parameter**:
       - `id`: UUID
     - **Request Body**:
       ```json
       {
          "email":"mostgafa_educty@gmail.com",
          "isDeleted":true
        }
       ```
   - **Response**:
     ```json
        {
          "message": "Done",
          "data": {
              "id": "d2c3e893-1425-4f5c-a9e9-e3d7431d581a",
              "first_name": "Mustafa",
              "last_name": "Mahmoud",
              "email": "mostgafa_educty@gmail.com",
              "company": "eduncy",
              "balance": "20000",
              "isDeleted": true,
              "createdAt": "2025-02-09T14:55:19.359Z",
              "updatedAt": "2025-02-09T15:05:50.324Z"
        }
    }
   ```
#### 5. **DELETE /contacts/{id}**
   - **Description**: Soft delete a specific Contact by ID.
   - **Request**:
     - **URL Parameter**:
       - `id`: UUID
   - **Response**:
     ```json
           {
              "message": "Contact has been deleted."
          }
     ```
#### 6. **POST /contacts/transfer**
   - **Description**: Transfer balance between two contacts.
   - **Request**:
     - **Request Body**:
       ```json
         {
          "from_contact_id":"d2c3e893-1425-4f5c-a9e9-e3d7431d581a" (uuid),
          "to_contact_id":"3533d3a2-ceeb-4074-8020-37226e0f9f44"   (uuid),
          "amount":7000
        }
       ```
   - **Response**:
     ```json
         {
            "message": "The balance has been transferred successfully"
         }
     ```

#### 7. **GET /contacts/{id}/audit**
   - **Description**:  Fetch historical versions of a specific contact.
   - **Request**:
     - **URL Parameter**:
       - `id`: UUID
   - **Response**:
     ```json
       {
          "message": "Done",
          "length": 1,
          "data": [
              {
                  "id": "e59f797a-db0e-4751-a8d7-426d42162c24",
                  "contactID": "3533d3a2-ceeb-4074-8020-37226e0f9f44",
                  "changes": {
                      "new": {
                          "balance": 25000
                      },
                      "old": {
                          "balance": 18000
                      }
                  },
                  "changeType": "UPDATE",
                  "timestamp": "2025-02-09T15:16:01.797Z"
              }
          ]
      }
     ```

# Stopping the Application

To stop the running Docker containers, press CTRL + C in the terminal where the containers are running. To remove stopped containers and networks, you can run:

```bash
docker-compose down
```
