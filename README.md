# College Analytics & Reporting Portal

An interactive web dashboard for real-time visualization, department-level metric tracking, and academic performance analysis across student cohorts.

## Live Demo
[View Live Application]([https://ronitbera.github.io/college-analytics-portal/](https://ronitbera.github.io/college-analytics-portal/))

---

## Key Features
* **Dynamic KPI Tracking:** Calculates total student count, average CGPA, and placement percentage on the fly based on active filters.
* **Interactive Data Visualizations:** Built with Chart.js to render department enrollment bar charts and CGPA distribution breakdown doughnuts.
* **Multi-Parameter Filtering:** Filter records by department, placement status, or perform instant fuzzy searches by student name and roll ID.
* **Responsive Layout:** Engineered using modern CSS Grid and Flexbox for seamless usability across desktop and mobile screens.
* **Asynchronous Architecture:** Decoupled UI logic prepared for REST API integration and dynamic JSON payload updates.

---

## Tech Stack
* **Frontend:** HTML5, CSS3 (CSS Grid & Flexbox, Custom Properties), Vanilla JavaScript (ES6+)
* **Libraries:** [Chart.js](https://www.chartjs.org/)
* **Version Control & Hosting:** Git, GitHub, GitHub Pages

---

## Project Structure
```text
college-analytics-portal/
├── index.html        # App structure, semantic layout, and dashboard containers
├── style.css         # Custom responsive styling and CSS grid systems
├── app.js            # State management, filter pipelines, and Chart.js logic
└── README.md         # Documentation
