#  To-Do App with ChatGPT Integration

# Installing Server Dependencies

- First, navigate to the server directory:
cd server

- Run the following command to install dependencies:
npm install

- After installation, return to the root directory:
cd ..

# Installing Client Dependencies

- Navigate to the client directory:
cd client

- Install dependencies:
npm install

- Return to the root directory:
cd ..


# Installing Root-Level Dependencies

- Run the following command in the root directory:
npm install 

# Setting Up the .env File for the Server (server/.env)

MONGO_URI=mongodb+srv://playablefactory:playablefactory@todoapp.fq9bv.mongodb.net/?retryWrites=true&w=majority&appName=todoapp
PORT=5000
JWT_SECRET=playablefactory
OPENAI_KEY=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


# Starting the Project
- In the root directory, run the following command to start the project:
npm start

# How the Application Works
 
 When you launch the application, the login screen will appear first. If you already have an account, simply log in to access the page with your existing tasks. If you don't have an account, click the "Don't you have an account?" button to navigate to the register screen and create a new account. Once registered, you can log in and access the tasks.

If you attempt to go directly to the task page without logging in, you won't be able to perform any actions due to insufficient permissions.

On the task page, you can click the Create button to add a new task. Once the task is created, you can view it and update it by clicking the Update button under the Actions section. You can also mark the task as completed. Additionally, you can click the + sign on the left side of a task to view the help text related to that task.

There is a search input where you can search tasks by their tags or title.

# NOTE #
There may be some missing features or bugs in the project, but I have done my best within the given time frame.

