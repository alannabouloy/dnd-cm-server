# DND Campaign Manager Server

This is the API server for the DnD Campaign Manager project. This API is built using RESTful practices and connects to a database.  

## Endpoints

The API has 10 endpoints:

1. `/users`  will give you access to the list of users in the database and will support GET and POST requests. 
2. `/users/:user_id` will give you access to a specific user with corresponding id in the database and will support GET, PATCH, and DELETE requests.
3. `/users/:user_id/campaigns` will give you access to all of the campaigns associated with a specific user and will support GET and POST requests.
4. `/users/:user_id/campaigns/:campaign_id` will give you access to a specific campaign and all of the details of that campaign. It will support GET, PATCH, and DELETE requests, but only users with permissions will be able to delete campaigns, and doing so will delete all notes associated with that campaign. 
5. `users/:user_id/campaigns/:campaign_id/notes` will access all of the notes associated with a campaign that the user is authorized to view. It will support GET and POST requests. 
6. `users/:user_id/campaigns/:campaign_id/notes/note_id` will access a specific note. It will support GET, PATCH, and DELETE requests. Only author of the note will be able to DELETE. 
7. `/campaigns` will access a list of all public campaigns. This will only support GET requests. 
8. `/campaigns/:campaign_id` will access the details of a public campaign. This will only support GET requests. 
9. `/campaigns/:campaign_id/notes` will access all of the public notes available for a public campaign. It will only support GET requests.
10. `/campaigns/:campaign_id/notes/note_id` will access a specific note within a public campaign. It will only support GET requests. 

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

