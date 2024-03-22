

# InvigoPulse

InvigoPulse is a one-stop solution for both Inventory and Deadstock Management.

## Description

InvigoPulse provides comprehensive management for inventory and deadstock, offering features to streamline processes and optimize inventory control. The project consists of two main components: a backend server and a client application.

## Getting Started

To get started with InvigoPulse, follow the steps below:

### Prerequisites

Ensure you have the following software installed on your machine:

- Node.js
- npm (Node Package Manager)
- MySQL Server
- React Js
### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/ritu456286/InvigoPulse.git
```

2. Navigate to the `client` folder and install dependencies:

```bash
cd client
npm install
```

3. Navigate to the `backend` folder and install dependencies:

```bash
cd backend
npm install
```

### Database Setup

1. Navigate to the `backend/sql-connect` directory:

```bash
cd backend/sql-connect
```

2. Run each of the database connection scripts (`dbcon1.js` to `dbcon7.js`) in order to set up your database connection.

```bash
node dbcon1.js
node dbcon2.js
...
node dbcon7.js
```

### Running the Backend Server

1. After setting up the database connection, navigate back to the `backend` directory:

```bash
cd ..
```

2. Start the backend server:

```bash
nodemon index.js
```

The backend server should now be running on `http://localhost:3000`.

### Running the Client Application

1. Navigate to the `client` directory if you haven't already:

```bash
cd ../client
```

2. Start the client application:

```bash
npm start
```

The client application should now be running on `http://localhost:3000`.

## Usage

- Access the client application by navigating to `http://localhost:3000` in your web browser.
- Use the various features provided by InvigoPulse to manage inventory and deadstock efficiently.

