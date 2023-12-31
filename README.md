# Brown Intern Summer Housing

- **Repository Link:** https://github.com/cs0320-f23/term-project-nhaseley-aochukwu-dewilson-rjecroi1.git
- **Project Description:** Brown Intern Summer Housing - Boston (BISH - Boston) is a housing locator application made for students at Brown University seeking summer intern housing in the Boston area. Landlords can also use the application to post listings for their rental homes in Boston. This project utilizes a TypeScript/React frontend, Java backend and Firestore database with Google Authentication upon registration and login.

### How to Use:

#### For a Brown Intern:
1. Register
   - By including your name, brown email, password for the application, and your work address
2. Log in
   - using your Brown email and the password you created above
   - You will be directed to login though google authentication. Make sure the email you
     registered with is the same email your passing in for google authentication
3. Feel free to browse by looking at potential housing options. Toggle and therefore filter between price points and/or distances between your work address and a number of available listings posted by our application's landlords. Select any listing and you will be navigated for a page dedicated to more information about that listing.

#### For a Landlord:
1. Register
   - By including your name, brown email, password for the application, and your phone number
2. Log in
   - Using your google email and the password you created above
   - You will be directed to login though google authentication. Make sure the email you
     registered with is the same email your passing in for google authentication
3. Feel free to post new listings by completing the post new listing form and browse through listings you
   have already posted

#### For an Administrator:
1. Register
   - By including your name, brown email, password for the application 
2. Log in
   - using your google email and the password you created above
   - You will be directed to login though google authentication. Make sure the email you
     registered with is the same email your passing in for google authentication
3. Navigate to your admin homepage, which allows you to see lists of all the interns, 
and landlords and verify the accounts of lanlords for security purposes.

## Setup

-  npm install react-router-dom

Installing firebase:

-  npm install firebase@10.7.0 --save

Installing MapBox:

-  npm install
-  npm install react-map-gl
-  npm install mapbox-gl

Installing Playwright

-  npm install playwright

Running the Frontend
- cd term-project
- cd front
- npm run dev

Running the Backend
- Navigate to term-project/back/src/main/java/edu/brown/cs/student/main/Server.java and run this file using your IDE of choice.

### APIs utilized

To find distance between selected location on map and intern's work address: [Distance Matrix API](https://distancematrix.ai/distance-matrix-api)

To convert intern's work address and rental addresses to coordinates in order to use that API: [Geocoding API](https://distancematrix.ai/geocoding-api)

Example endpoint:
http://localhost:4500/filter?workAddress=69%20Brown%20St%20Providence%20RI&address=315%20Thayer%20St%20Providence%20RI

Result:
{"converted_work_latitude":41.8275262,"converted_work_longitude":-71.4027859,"duration":"4 mins","formatted_address":"315 Thayer St, Providence, RI 02906, USA","distance":"0.3 mi","origin":"41.830695,-71.4008249","destination":"41.8275262,-71.4027859","converted_selected_longitude":-71.4008249,"converted_selected_latitude":41.830695,"formatted_work_address":"69 Brown St, Providence, RI 02912, USA","status":"OK"}

# Components
## Front End:

1. **AdminPage.tsx:**
   This component handles the user interface for the admin page. Allows admin to verify landlords. Displays lists of landlords and interns
2. **App.tsx:**
   The "main entry point: for the React application, where components are rendered and routes are defined.
3. **Homepage.tsx:**
   Represents the homepage of the application. Displays are mission statement and project name
4. **LandlordsHomepage.tsx:**
   Provides the user interface homepage for landlords. Allows alndlord that is logged in to view
   their lisitng. In addition, landlords are able to post new listings.
5. **Listings.tsx:**
   Displays a list of available rental listings, allowing interns/ users to browse through and select specific listings for more details. allows an intern to toggle the lists of lisitng based on price and distance based on their respective work adress
6. **LoginPage.tsx:**
   Uses Google authentication Manages the user authentication process, providing login forms for students, landlords, and administrators.
7. **Navbar.tsx:**
   Creates the navigation bar component, offering links to different sections of the application.
8. **Navlinks.tsx:**
   Defines the navigation links component, containing links to various pages like login, registration, and listings.
9. **RegistrationPage.tsx:**
   Handles user registration for different roles (student, landlord, admin), providing the necessary forms to register
10. **RentalInfoPage.tsx:**
    Displays detailed information about a selected rental listing, including address, bedrooms, details, and price.

### CSS styling for each component:
1. **AdminPage.css**
2. **App.css**
3. **Homepage.css**
4. **Index.css**
5. **LandlordsHompage.css**
6. **Listings.css**
7. **LoginPage.css**
8. **Navbar.css**
9.  **RegistrationForm.css**
10. **RentalInfoPage.css**

## Backend
**Server.java:**
   Represents the main class for the server, initializes SparkJava, and defines API endpoints. 
   Allows for the retrieval of data from the APIs.

### Coordinate Data:
2. **CoordinateApiResponse.java**
   Contains the response structure for coordinate data from an external API.
3. **CoordinateData.java**
   Interface defining methods to retrieve coordinate data.
4. **CoordinateDataSource.java**
   Implements the CoordinateData interface and handles fetching real coordinate data.
5. **CoordinateMockedData.java**
   Provides mock responses for testing the handling of distance data.
   
### Distance Data:
6. apiKeys
7. **DistanceApiRepsonse.java:**
   Represents the response structure for distance data from an external API.
8. **DistanceData.java:**
   Interface defining methods to retrieve distance data.
9. **DistanceDataSource.java:**
   Implements the DistanceData interface and handles fetching real distance data.
10. **DistanceMockedData.java:**
   Provides mock responses for testing the handling of distance data.

### Distance Handler:
11. **FilterHandler.java:**
    Handles filtering by distance, integrating coordinate and distance data.

# Features 
**Google Firebase:** 
- hosts the database for our project which stores the accounts of administrators, Landlords, and Interns
**mapBox:**
-  allows users to see listing on a map includes drop pins at the location the listing is at. clicking on the drop pin sends you a page which provides the description of the selected listing

**For Security:** 
- The use of **Google Authentication:**
- Admin account to verify accounts 

**For Accessibilty:** 
- Aria Labels 
    -  Including Aria Roles, attributes, and descriptions
- High Color Constrast in UI
- Keyboard navigation 
    

# Testing
## Frontend:
- Integration testing with Playwright

## Backend testing:
- Unit testing in Java
- Mock testing in Java