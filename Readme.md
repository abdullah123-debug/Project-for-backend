VideoHub Backend

A scalable backend system for a video-sharing platform featuring user authentication, interactive features, and smooth data handling.

Overview
VideoHub Backend powers a dynamic video-sharing application, enabling users to upload videos, interact through likes/dislikes and comments, and manage subscriptions.
Built with Node.js, Express.js, and MongoDB, this backend focuses on secure authentication, efficient API design, and seamless integration with frontend applications.

Tech Stack

Node.js
Express.js
MongoDB / Mongoose
JWT (JSON Web Tokens) for secure authentication
Multer / Cloud Storage (if applicable) for file uploads

Features
User Authentication
Signup / Login using JWT
Password hashing
Protected routes for authorized actions

Video Management

Upload videos
Fetch all videos / single video
Delete user videos
Track views and metadata

RESTful APIs
Well-structured and scalable APIs designed for smooth communication with the frontend.

API Endpoints Snapshot
Auth
Method	Endpoint	Description
POST	/auth/signup	Register user
POST	/auth/login	Login user

Videos
Method	Endpoint	Description
POST	/videos/upload	Upload a video
GET	/videos/	Fetch all videos
GET	/videos/:id	Fetch a video
DELETE	/videos/:id	Remove a video

Comments

Method	Endpoint	Description
POST	/comments/:videoId	Add comment
GET	/comments/:videoId	Get comments

Interactions

Method	Endpoint	Description
POST	/likes/:videoId	Like/Dislike a video
POST	/subscribe/:userId	Subscribe/Unsubscribe
