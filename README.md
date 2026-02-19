# JIS Companion (Unofficial)

Unofficial version of the JIS Companion app built with React Native and Expo.

## Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## Application Structure

```mermaid
flowchart TD
    classDef default stroke:#333,stroke-width:1px,fontSize:13px;
    classDef screen fill:transparent,stroke:#1565c0,rx:5,ry:5;
    classDef logic fill:transparent,stroke:#ef6c00,rhombus;
    classDef container fill:transparent,stroke:#9e9e9e,stroke-dasharray: 5 5;
    classDef tab fill:transparent,stroke:#2e7d32,stroke-width:2px;
    classDef subgraphStyle fill:transparent,stroke:#666,stroke-width:2px;
    linkStyle default interpolate linear;

    Root[Root Layout]:::container
    AuthCheck{Is Logged In?}:::logic
    Login[Login Screen]:::screen

    subgraph Tabs [Main Tab Navigation]
        TabLayout["Tab Layout"]:::container
        HomeTab["Home"]:::tab
        AcademicsTab["Academics"]:::tab
        FeesTab["Fees"]:::tab
        ProfileTab["Profile"]:::tab
    end

    subgraph DetailedViews [Detailed Views]
        Library[Library]:::screen
        Feedback[Feedback]:::screen
        VirtLabs[Virtual Labs]:::screen
        ClassDetails[Class Details]:::screen
    end

    Root --> AuthCheck
    AuthCheck -->|No| Login
    AuthCheck -->|Yes| TabLayout

    TabLayout --> HomeTab & AcademicsTab & FeesTab & ProfileTab

    HomeTab -.-> Library
    HomeTab -.-> Feedback
    HomeTab -.-> VirtLabs

    AcademicsTab -.-> ClassDetails

    style Tabs fill:transparent,stroke:#2e7d32,stroke-width:2px
    style DetailedViews fill:transparent,stroke:#1565c0,stroke-width:2px
```

## Data Flow Architecture

This diagram illustrates how the application fetches and processes data from the JIS Group API.

```mermaid
sequenceDiagram
    participant UI as Component (Screens)
    participant Store as State Store (Zustand)
    participant Service as API Service
    participant Client as Axios Client
    participant API as JIS Group API

    Note over UI, Store: User triggers action

    UI->>Store: 1. dispatchAction()
    activate Store

    Store->>Service: 2. fetchRequestedData()
    activate Service

    Service->>Client: 3. apiClient.get('/endpoint')
    activate Client

    Client->>API: 4. HTTP GET Request
    activate API
    API-->>Client: 5. JSON Response
    deactivate API

    Client-->>Service: 6. AxiosResponse
    deactivate Client

    Service->>Service: 7. Validate & Transform Data
    Service-->>Store: 8. Return Clean Data
    deactivate Service

    Store->>Store: 9. Update State
    Store-->>UI: 10. Re-render with New Data
    deactivate Store
```

## Requirements

- Node.js
- Expo CLI
- iOS Simulator or Android Emulator (for mobile development)

## Disclaimer

This is an unofficial app and is not affiliated with or endorsed by JIS.

## License

MIT
