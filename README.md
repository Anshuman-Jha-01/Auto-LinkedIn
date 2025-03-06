# Auto LinkedIn - AI-Powered Job Search Automation

Auto LinkedIn is an AI-powered job search automation tool that scrapes LinkedIn job listings, analyzes job descriptions using Google's Generative AI, and sends detailed job insights directly to the user's email. The tool utilizes Puppeteer for web automation, Cheerio for web scraping, and Nodemailer for email delivery.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

---

## Project Overview

Auto LinkedIn automates the job search process by logging into LinkedIn, extracting job listings based on user input, analyzing job descriptions with AI, and sending a detailed analysis via email. This allows job seekers to save time and get a better understanding of job roles before applying.

---

## Features

- **Automated LinkedIn Job Search:** Uses Puppeteer to log in and scrape job listings.
- **AI-Powered Job Analysis:** Leverages Google's Generative AI to extract insights from job descriptions.
- **Email Notifications:** Sends job analysis reports via email using Nodemailer.
- **Dynamic Web Interface:** Built with Express.js and EJS templates for seamless user interaction.
- **Error Handling and Logging:** Provides smooth user experience with error handling.

---

## Technologies Used

### **Backend:**
- Node.js (Express.js)
- Puppeteer (Web Scraping)
- Cheerio (HTML Parsing)
- Nodemailer (Email Delivery)
- dotenv (Environment Variable Management)
- Google Generative AI SDK

### **Frontend:**
- HTML, CSS, Bootstrap
- EJS (Embedded JavaScript Templates)

---

## Installation

### Prerequisites
- Install [Node.js](https://nodejs.org/) (v14 or higher)
- Install [Google Generative AI API Key](https://ai.google.dev/)
- Have a LinkedIn account ready for job search

### Steps to Set Up the Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anshuman-Jha-01/Auto-LinkedIn.git
   cd Auto-LinkedIn
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add the following:
   ```env
   GEMINI_API_KEY=your_google_api_key
   ```
4. **Run the application:**
   ```bash
   node script.js
   ```

---

## Usage

1. **Start the server:** Run `node script.js` to start the Express.js server on port 8080.
2. **Access the homepage:** Navigate to `http://localhost:8080/` in your browser.
3. **Enter job details:** Provide LinkedIn login credentials and email for job alerts.
4. **Check email:** The job analysis will be sent to the provided email within minutes.

---

## Project Structure

```bash
/Auto-LinkedIn
│── /public                    # Static files
│     ├── icons/               # Favicon folder
│     └── styles-blue.css      # Styling for UI
│── /views                     # EJS templates
│     ├── home.ejs             # Homepage UI
│     ├── sent.ejs             # Confirmation page
│     └── error.ejs            # Error page
│── script.js                  # Main server file with automation logic
│── package.json               # Dependencies
│── .env                       # Environment variables
└── README.md                  # Project documentation
```

---

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

