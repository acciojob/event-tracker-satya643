# Event Tracker Calendar

A simple React-based calendar application that allows users to add, edit, and delete events with filtering options.

## Features

- **Event Creation**: Click on any date to create a new event
- **Event Editing**: Click on existing events to edit their details
- **Event Deletion**: Remove events through the edit popup
- **Event Filtering**: Three filter buttons to view:
  - All Events
  - Past Events (pink background)
  - Upcoming Events (green background)
- **Calendar Navigation**: Navigate between months using Previous/Next buttons

## Technologies Used

- React 16.13.1
- Moment.js for date handling
- Custom CSS for styling
- Webpack for bundling

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
 npm start

3. Build for production:
 npm run build


## Usage

1. **Creating Events**: Click on any date in the calendar to open the event creation popup
2. **Editing Events**: Click on an existing event to open the edit/delete popup
3. **Filtering Events**: Use the three buttons at the top to filter events by type
4. **Navigation**: Use the Previous/Next buttons to navigate between months

## Event Colors

- **Past Events**: Pink background (rgb(222, 105, 135))
- **Upcoming Events**: Green background (rgb(140, 189, 76))

## Project Structure

```
src/
├── components/
│   └── App.js          # Main application component
├── styles/
│   └── App.css         # Application styles
└── index.js            # Application entry point
```

## Browser Compatibility

The application works in all modern browsers that support React 16+.
