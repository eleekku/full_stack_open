```mermaid

sequenceDiagram
participant Browser
participant Server

Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
activate Server
Server-->>Browser: HTTP 201 Created with the new resource data
deactivate Server

Note right of Browser: The JavaScript callback is triggered to update the notes display
