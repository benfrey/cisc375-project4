# Dynamic Web Application - CISC375: Web Development Project #4

1. git clone https://github.com/<user>/<project>
2. cd <project>
3. Copy my local version of 'stpaul_crime.sqlite3' to the 'db' folder
4. npm install
5. node server.js
6. Visit your homepage in a browser (http://localhost:8000)

# Project components
Implement the following to earn 45/60 points (grade: C)

- ~~Show a map using the Leaflet API **(Grant - done)**~~
  - ~~Pan and zoom available with mouse click-and-drag and scroll wheel interaction (done)~~
  - ~~Limit pan and zoom so map does not display regions outside of St. Paul (done)~~
  - ~~HINT: zoom levels 11-18 are good (done)~~
  - ~~NOTE: this is already the default setup in the starter code! (done)~~
  - ~~Have an input box and 'Go' button for a user to type a location (lat/long coordinates, address, etc.) (Ben will do UI - done)~~
  - ~~Map should update when location is entered and 'Go' button pressed (Grant - done)~~
  - ~~Input box text should update with new location (lat/long coordinates or address) when map is panned/zoomed (grant - done)~~
    - ~~NOTE: updating once pan/zoom has ended is recommended - constantly updating this during a pan will overwhelm the system (done)~~
    - ~~Use the Nominatim API (https://nominatim.org/release-docs/develop/api/Overview/ (Links to an external site.) (Links to an external site.)) to convert between address and lat/long (Grant)~~
    - ~~Clamp input values if lat/long is outside of St. Paul's bounding box (Grant - done)~~
- ~~Retrieve data from your St. Paul Crime API (Logan - done)~~
  - ~~By default, include 1,000 most recent crimes in the database (done)~~
  - ~~Populate a table with one row per crime (use neighborhood_name rather than neighborhood_number, and incident_type rather than code) (Ben can do)~~
    - ~~Table should be ordered with most recent on top (done)~~
    - ~~Only show crimes that occurred in neighborhoods visible on the map (Logan??? where you at man?)~~
      - ~~HINT: get lat/long coordinates for the NW and SE corners of the map to use as the min/max lat/long coordinates~~
  - ~~Draw markers on the map for each neighborhood (Grant - done)~~
    - ~~Marker should have popup to show the number of crimes committed in that neighborhood (Grant - done)~~
- "About the Project" page (Ben)
  - ~~Short bio about each team member (including a photo)~~
  - ~~Description of the tools (frameworks, APIs, etc.) you used to create the application (done)~~
  - ~~Video demo of the application (2 - 4 minutes) - include voiceover (Ben will still do)~~
  - ~~Can natively embed or upload to YouTube and embed (Ben will still do)~~
  - ~~Six interesting findings that you discovered using your application (Ben will still do)~~

~~Implement additional features to earn a B or A (5 pts each) (all done)~~

- ~~Create UI controls to filter crime data (Ben)~~
  - ~~Filter based on the following~~
    - ~~incident_type: list of checkboxes per incident_type (done)~~
      - ~~OK (in fact recommended) to aggregate similar incident types (e.g. codes 1800 - 1885 are all sub-categories of 'Narcotics') (done)~~
    - ~~neighborhood_name: list of checkboxes per neighborhood_name (done)~~
    - ~~date range: select a start and end date (only show crimes between those dates) (done)~~
    - ~~time range: select a start and end time (only show crimes that occurred between those times of day) (done)~~
    - ~~max incidents: select maximum number of incidents to retrieve / show (done)~~
  - ~~Changing a filter should trigger a new request to the St. Paul Crime API (see next point - done)~~
    - ~~It's OK to have a separate 'Update' button, so users can change many filters before triggering a new request (we have update button - done)~~
- ~~Style the background color of rows in the table to categorize crimes as "violent crimes" (crimes against another person), "property crimes" (crimes against a person's or business' property), or "other crimes" (anything else) (Logan - done)~~
  - ~~You can categorize as you see fit - here's a link with more info to help though: https://www.justia.com/criminal/offenses/ (Links to an external site.) (done)~~
  - ~~Also include a legend for the colors (Ben can do)~~
- ~~Add a marker to the map at exact crime location when selected from the table (Grant - done)~~
  - ~~Make marker a different color / icon than the markers for the total crimes per neighborhood (Ben will still do)~~
  - ~~Create a popup with date, time, incident, and delete button (Ben will still do)~~
  - ~~Note addresses are slightly obscured (e.g. '98X UNIVERSITY AV W' or 'THOMAS AV & VICTORIA') (done)~~
    - ~~For addresses with an 'X' in the address number, you can replace it with a '0' (e.g. '90X UNIVERSITY AV W' would become '980 UNIVERSITY AV W'). Careful not to replace all X's though - there could be an X in the street name! (done)~~
    
