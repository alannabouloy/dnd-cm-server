# DND Campaign Manager Server

This is the API server for the DnD Campaign Manager project. This API is built using RESTful practices and connects to a database.  

## Endpoints

The API has 11 endpoints:

1. `/api/users`  will give you access to the list of users in the database and will support GET and POST requests. 

2. `/api/users/:username` will give you access to a specific user with corresponding id in the database and will support GET, PATCH, and DELETE requests. This is a protected endpoint and will require authorization to access. 

3. `/api/user_campaigns` will give you access to all of the campaigns associated with a specific user based on the username and will support GET and POST requests. It is a protected endpoint and will require authorization to access. 

4. `/api/user_campaigns/:campaign_id` will give you access to a specific campaign and all of the details of that campaign. It will support GET, PATCH, and DELETE requests, and is a protected endpoint which requires user authorization to access. 

5. `/api/user_notes/:campaign_id` will access all of the notes associated with a campaign that the user is authorized to view. It will support GET and POST requests. It is a protected endpoint and requires authorization to access. 

6. `/api/user_notes/:campaign_id/note_id` will access a specific note. It will support GET, PATCH, and DELETE requests and is a protected endpoint which requires authorization to access. 

7. `/api/campaigns` will access a list of all public campaigns. This will only support GET requests.

8. `/api/campaigns/:campaign_id` will access the details of a public campaign. This will only support GET requests. 

9. `/api/notes/:campaign_id` will access all of the public notes available for a public campaign. It will only support GET requests.

10. `/api/notes/:campaign_id/:note_id` will access a specific note within a public campaign. It will only support GET requests. 

11. `/api/auth/login` will authenticate the user using a POST request and return a JWT token which is used for protected endpoints going forward. 


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

