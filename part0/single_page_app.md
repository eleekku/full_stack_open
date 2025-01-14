```mermaid

sequenceDiagram
participant Browser
participant Server

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa
activate Server
Server-->>Browser: Returns the HTML file
deactivate Server

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate Server
Server-->>Browser: Delivers main.css
deactivate Server

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
activate Server
Server-->>Browser: Sends spa.js
deactivate Server

Note right of Browser: Browser processes the JavaScript to fetch note data from the server

Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate Server
Server-->>Browser: JSON data [{ "content": "HTML is easy", "date": "2023-3-9" }, ...]
deactivate Server

Note right of Browser: Notes are rendered on the page by the callback function

Browser->>Server: GET https://studies.cs.helsinki.fi/favicon.ico
activate Server
Server-->>Browser: Sends favicon
deactivate Server
