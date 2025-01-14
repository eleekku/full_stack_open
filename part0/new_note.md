```mermaid

sequenceDiagram
participant Browser
participant Server

Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
activate Server
Note left of Server: Server sends a redirection response to Notes page
Server-->>Browser: HTTP 302 Redirect
deactivate Server

Note right of Browser: Browser reloads the Notes page using the redirect URL

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/notes
activate Server
Server-->>Browser: HTML file
deactivate Server

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate Server
Server-->>Browser: CSS file
deactivate Server

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
activate Server
Server-->>Browser: JavaScript file
deactivate Server

Note right of Browser: Browser executes the JavaScript to fetch the data for rendering notes

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate Server
Server-->>Browser: JSON data with notes [{ "content": "HTML is easy", "date": "2023-3-9" }, ...]
deactivate Server

Note right of Browser: The fetched data is used to render notes on the Notes page

Browser->>Server: GET https://studies.cs.helsinki.fi/favicon.ico
activate Server
Server-->>Browser: Favicon file
deactivate Server
