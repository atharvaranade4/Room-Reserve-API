# 330_FinalProject
## Self-Evaluation <br>

### What I learnt: <br>
Learned about the structure of Express back-end development and how to build an application and implement CRUD routes. I learned how to use MongoDB, write basic routes as well as advanced MongoDB operations. How to integrate middleware and use unit-tests. Definitely need more practice with tests.For the final project the test coverage is a little over 80%.

### What worked:
- Taking up a simple case study scenario helped.This allowed more time to work on writing code and finding best ways to create CRUD routes rather than get caught up on the end goal.
- Using different complexities of modelSchema was helpful. This helped choose indexes and allowed for better testing,
- Using POSTMAN instead of building a simple frontend UI was helpful as it put me in the shoes of a purely backend developer thus requiring me to test the routes using an API testing environment.
- Using authentication and authorization helped understand how a real app would function.
- This also led to a deeper understanding of what fields can be changed through a user input vs manipulated through the database on the backend.

### What did not work:
- Adding tests at the end was tiresome and frustrating.
- Struggled adding authentication for the room/ route tests
- Struggled adding checks for finding rooms, buildings in the database for tests.
- Need more practice using .aggregate()

### What would I do differently?
- Setup routes and tests simultaneously!!
- Setup a new model that inputs time and finds time duration.
- If there was more time, I would have liked to write more granular tests.
- Build a simple front-end UI app.
<br>
Overall a great learning experience!



## Project Proof of Concept <br>

Express server setup complete <br>
MongoDB Connection established <br>

- Database populated with user, room and building data using POSTMAN

- 3 model-schema created: <br>
  - user-model, room-model and building-model
- DAOs:
  - userDAO: complete. 
  - roomDAO: in-progress. Implemented text search and aggregate (lookup and sort)
  - buildingDAO: in-progress
  
- Routes:
  - user-Model: POST/ route, GET/ route, PUT/ route, DELETE/ route setup complete.
  - room-Model: POST/ route and POST with aggregate/lookup complete. DELETE route complete.
  - building-Model: POST/ route, GET/ route, DELETE-route complete

- Authentication and authorization routes complete.

### TO-DO:

- PUT/ routes, GET/ routes

- Writing tests

- Adding additional filter/aggregate/lookup for building model.
