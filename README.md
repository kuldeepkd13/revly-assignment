
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

### Login User

 - Endpoint: 
 ```http
  POST /user/login
   ```
- Description: Logs in a user and generates an authentication token.


### Update Status

- Endpoint: 
```http
 PUT /user/updateStatus
   ```
- Description: User can update there status .


## Doubt Routes

### Create Doubt
 - Endpoint: 
 ```http
 POST /doubt/createDoubt
   ```
 - Description: Create a new doubt and assign it to an available tutor.


### Submit Doubt Solution

- Endpoint:
```http
 PATCH /doubt/doubtSolution/:doubtId
   ```
- Description: Submit a solution for a specific doubt (by the assigned tutor).


### List All Doubts
- Endpoint: 
```http
GET /doubt/allDoubt
   ```
- Description: Get a list of all doubts asked by the student.


### Doubt History
- Endpoint:
```http
 GET /doubt/doubtHistory
   ```
- Description: Get the doubt history with doubt descriptions and solutions


## Tutor Routes

 ### Update Tutor Ping
- Endpoint: 
```http
POST /tutor/ping
   ```
- Description: Update tutor ping time.
