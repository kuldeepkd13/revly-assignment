
# Real-Time Doubt Solving Platform

## Description

The Real-Time Doubt Solving Platform is a Node.js-based backend application designed to facilitate real-time doubt resolution between students and tutors. It provides endpoints for user registration, login, doubt creation, doubt solution submission, and doubt history retrieval.

## Tech Stack

**Server:** Node, Express

# API Endpoints

## User Routes

### Register User

   - Endpoint: 
```http
POST /user/register
```
   - Description: Registers a new user in the system.

   - Request Body:
```http
{
  "email": "Useremail",
  "password": "userPassword",
  "name": "userName",
  "userType": "UserType(either a Student or a Tutor)",
  "userLanguage": "language used by user ",
  "subjectExpertise": "The subjects in which the user has expertise (applicable for tutors)" ,
  "classGrade": " class or grade of the user"
}

```

- Response:
  - 200 OK on successful registration.
  - 400 Bad Request if the user already exists or missing required fields.
  - 500 Internal Server Error for server issues.

### Login User

 - Endpoint:
 
```http
POST /user/login
```
- Description: Logs in a user and generates an authentication token.

- Request Body:
```http
{
  "email": "Useremail",
  "password": "userPassword"
}

```

- Response:
  - 200 OK on successful login with a token.
  - 400 Bad Request if the email or password is incorrect.
  - 500 Internal Server Error for server issues.


### Update Status

- Endpoint: 
```http
PUT /user/updateStatus
```
- Description: User can update there status .

- Request Body:
```http
{
  "active": true/false,
}

```

- Response:
  - 200 OK on successful status update.
  - 400 Bad Request if the user is not found or status is already set.
  - 404 Not Found if the user does not exist.


## Doubt Routes

### Create Doubt
 - Endpoint: 
 ```http
POST /doubt/createDoubt
```
 - Description: Create a new doubt and assign it to an available tutor.

- Request Body:
```http
{
  "doubtSubject": "DoubtSubject",
  "doubtDescription": "DoubtDescription"
}
```

- Response:
  - 200 OK on successful doubt creation with assigned tutor information.
  - 404 Not Found if no eligible tutors are found.
  - 400 Bad Request for other errors.


### Submit Doubt Solution

- Endpoint:
```http
PATCH /doubt/doubtSolution/:doubtId
```
- Description: Submit a solution for a specific doubt (by the assigned tutor).

- Request Body:
```http
{
  "tutorAnswer": "TutorAnswer"
}

```

- Response:
  - 200 OK on successful doubt solution.
  - 404 Not Found if the doubt is not found or you are not the assigned tutor.
  - 400 Bad Request for other errors.


### List All Doubts
- Endpoint: 
```http
GET /doubt/allDoubt
```
- Description: Get a list of all doubts asked by the student.

- Response:
  - 200 OK with a list of doubts.
  - 400 Bad Request if no doubts are created.


### Doubt History
- Endpoint:
```http
GET /doubt/doubtHistory
```
- Description: Get the doubt history with doubt descriptions and solutions

- Response:
  - 200 OK with a list of doubts and solutions.
  - 400 Bad Request if no doubt history is available.


## Tutor Routes

 ### Update Tutor Ping
- Endpoint: 
```http
POST /tutor/ping
```
- Description: Update tutor ping time.

- Response:
  - 200 OK on successful ping update.
  - 404 Not Found if the tutor is not found.
  - 500 Internal Server Error for server issues.
