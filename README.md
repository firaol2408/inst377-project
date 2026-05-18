Title: NBA Stat Comparison Tool

Description: This site is a nba stat lookup and comparison tool, for comparing both box and advanced statistics
of current nba players. It was made for nba stat enthusiasts, as well as anyone who is 
into ranking and comparing players.

Target Browsers: This application was designed for any modern devices, 
on windows, ios, or android, on browsers including Chrome, Safari, Edge, and more.

Developer Manual:

Installation:

Clone the repository:

- git clone <your-repo-url>
    
Required Software and Tools:

- npm/node
- vercel
- supabase

Create a .env file in the root of the project and put this inside:
- SUPABASE_URL= link to the supabase project
- SUPABASE_KEY= key from supabase project(in settings)

Running the Application
Locally:
Start the server locally in the terminal: 
- node server.js

Then open your browser and go to:
http://localhost:3000

On Vercel:
- Link the git repo and a vercel project, and can open it on the main page


Running Tests
- I don't have any tests currently, but manually testing can be done by:

Running the server locally and searching for a known NBA player (e.g. "LeBron James")
and making sure that the tables get populated. Also use insomnia for mock api calls to make sure
the api works.

API Endpoints
1. GET '/api/searches' (gets searches from database)
2. POST '/api/searches' (records searches in the database)
2. GET'/api/player/:playerId' (gets data from the NBA_GO api)


Known Bugs

Player IDs in the api have a pretty weird naming convention, and the formula I used to generate the IDs
might not work for all players, mainly those with short last names(<4 characters),
which in that case will just return a generic error


Roadmap for Future Development
- Visuals are still pretty basic, could definitely make it more inviting
- Fix player ID generation to handle edge cases and support more players reliably.
- Add season filtering so users can compare players from a specific year rather than career averages.


