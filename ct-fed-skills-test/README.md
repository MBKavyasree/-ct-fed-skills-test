# Coalition FED Skills Test Submission

This submission is a single-page responsive dashboard implemented with plain HTML, CSS, and JavaScript.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Chart.js (for blood pressure graph)

## API

- Endpoint: `https://fedskillstest.coalitiontechnologies.workers.dev`
- Method: `GET`
- Auth: Basic Auth
  - Username: `coalition`
  - Password: `skills-test`

The Basic Auth value is generated in code with `btoa(username + ':' + password)` rather than hardcoding a pre-encrypted token.

## Scope Implemented

- Displays data for Jessica Taylor only
- Profile card and patient demographics
- Diagnosis history blood pressure chart (last 6 months)
- Vital cards (respiratory rate, temperature, heart rate)
- Diagnostic list table
- Lab results list
- Responsive layout for desktop/tablet/mobile

## Run

Open `index.html` in a browser.

## Zip for Submission

Create one zip containing:

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
