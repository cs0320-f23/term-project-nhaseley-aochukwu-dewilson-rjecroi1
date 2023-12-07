# term-project-nhaseley-aochukwu-dewilson-rjecroi1-

### Setup
Installing firebase: 
npm install firebase@10.7.0 --save

Run frontend:
cd into term-project, then front, then run npm run dev

### APIs utilized
To find distance between selected location on map and intern's work address: [Distance Matrix API](https://distancematrix.ai/distance-matrix-api)

To convert intern's work address and rental addresses to coordinates in order to use that API: [Geocoding API](https://distancematrix.ai/geocoding-api)

Example endpoint: 
http://localhost:4500/filter?workAddress=69%20Brown%20St%20Providence%20RI&address=196%20Sparks%20Ave%20Pelham%20NY%2010803

Result:
{"converted_work_latitude":41.8275262,"converted_work_longitude":-71.4027859,"duration":"2 hour 44 mins","distance":"161.1 mi","origin":"40.908732400000005,-73.8118781","destination":"41.8275262,-71.4027859","converted_selected_longitude":-73.8118781,"converted_selected_latitude":40.908732400000005,"formatted_work_address":"69 Brown St, Providence, RI 02912, USA","status":"OK"}
