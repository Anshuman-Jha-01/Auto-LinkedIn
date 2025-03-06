if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const path = require("path");

const PORT = 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("views",path.join(__dirname,"/views"));
app.set("public",path.join(__dirname,"/public"));
app.use(express.static("public"));
app.set("view engine","ejs");


app.listen(PORT, () => {
  console.log("Server initialized at port 8080");
  
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.post("/job", (req, res) => {
  let {linkedin_email,linkedin_password,nodemailer_email,nodemailer_password,job_title} = req.body;  
  job_title = job_title.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
  // searchJobs(linkedin_email,linkedin_password,nodemailer_email,nodemailer_password,job_title);
  res.render("sent.ejs");
});


// AI setup
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// AI code for generating job analysis
async function getJobAnalysis(jobDescriptions,nodemailer_email,nodemailer_password) {
  const prompt = `I will provide you with an array of objects where each object contains the link and the description of a job. Your task is to analyze each job description and provide the analysis in the following format: 
   - Job Title (add the link here) 
   - Location 
   - Job Type (Full-time, part-time, internship, remote) 
  
   - Key Responsibilities: 
  
   - Required Skills & Qualifications: 
  
   - Relevant Keywords: 
  
   - Contact details (if available) 
  
   - Additional tips:
   
  Finally, present all of the analysis of all job description in HTML card with proper inline CSS styling. Enclose everything with a div tag with main_container class. 
  Make sure to present the analysis for each job included in the array.

  Use the following example as reference for styling:

    <div class="job_card" style="border: 1px solid #ddd; margin-bottom: 20px; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; margin-bottom: 5px;">
          Job Title: Full-Stack Developer (<a href="https://www.linkedin.com/jobs/view/4173594223/?eBP=CwEAAAGVZo7mZHnguKdGJcm2MTApiHdnU1jCBuCB5MKCiWx0Lo4vPuS__WJDZaj-5EQIYz8pCgnkfJA8GS107isC6nYHh4Vzk2iE7Rrsjb9xkXCBDOYQbKkx0qdC3JePmiI50ntLRjMDXbU4jvviVvZcFBFK2DE4adLRJKT-jYcJ_laZIOrRTydVa-dQ_tL6qlVpF_fVAcWRBjuhZO9HhwGO97rER_ajG1JqabYFgRkMuM6-8lsyw7FfbxLr60O1tHxtPNYM4x8eFj_rZQL3jatPLVh86k5maMCZAmlFf-MCugqNK4qTJBSW4p0uxrKQpu0nwq7m6KQygpZhFvXjQG7q1C_L6HgkmaQzYozNQ4gK0s62tP4TDlwoALiCHhA86J9wzeOPnwli_WNuktRHyFYcdL_eRooiQUrTfB0XqdGzFbQw25QnzkBTqzhyQqfO4Mfi9VJajyVMcbJXfA8&amp;refId=55WirAaHNj747Ln3K1ystQ%3D%3D&amp;trackingId=tqE6P8i5SuU4PTsupZZ7qQ%3D%3D&amp;trk=flagship3_search_srp_jobs" style="color: #0073b1; text-decoration: none;">Apply Here</a>)
        </h3>
        <p style="margin-bottom: 5px;"><b>Location:</b> Kathmandu, Nepal</p>
        <p style="margin-bottom: 10px;"><b>Job Type:</b> Full-time</p>
    
        <h4 style="margin-bottom: 5px;">Key Responsibilities:</h4>
        <ul style="margin-top: 0; padding-left: 20px; margin-bottom: 10px;">
          <li>Develop, maintain, and optimize web applications using Django and Vue.js.</li>
          <li>Write clean, efficient, and well-documented code.</li>
          <li>Design and implement responsive user interfaces using HTML, CSS, and JavaScript.</li>
          <li>Build and manage Progressive Web Applications (PWA) for mobile-friendly solutions.</li>
          <li>Handle database management using MySQL or PostgreSQL and execute SQL queries.</li>
          <li>Work closely with cross-functional teams.</li>
          <li>Troubleshoot and debug applications.</li>
          <li>Stay updated with the latest technologies.</li>
        </ul>
    
        <h4 style="margin-bottom: 5px;">Required Skills &amp; Qualifications:</h4>
        <ul style="margin-top: 0; padding-left: 20px; margin-bottom: 10px;">
          <li>Minimum 3 years of experience in Full-Stack Development.</li>
          <li>Strong proficiency in Django (backend development).</li>
          <li>Expertise in JavaScript and Vue.js (frontend development).</li>
          <li>Solid knowledge of HTML &amp; CSS for UI/UX development.</li>
          <li>Experience with Mobile PWA (Progressive Web Applications).</li>
          <li>Proficiency in MySQL or PostgreSQL with the ability to run SQL queries.</li>
        </ul>
    
        <p style="margin-bottom: 10px;"><b>Relevant Keywords:</b> Full-Stack Developer, Django, Vue.js, HTML, CSS, JavaScript, PWA, MySQL, PostgreSQL, Backend, Frontend</p>
    
        <p style="margin-bottom: 10px;"><b>Contact details:</b> roshni.napit@hexamatics.com.my / nikita@hexamatics.com.my</p>
    
        <p style="margin-bottom: 0;"><b>Additional tips:</b> Highlight your experience with Django and Vue.js in your application. Showcase any PWA projects you've worked on.</p>    
    </div>

  Here is the array: ${JSON.stringify(jobDescriptions, null, 2)}`;

  const result = await model.generateContent(prompt);

  // Load the HTML string into Cheerio
  const $ = cheerio.load(result.response.text());

  // Extract the container div content
  const containerContent = $(".main_container").html();

  sendEmail(containerContent,nodemailer_email,nodemailer_password);
}

// Puppeteer code for automation
async function searchJobs(linkedin_email,linkedin_password,nodemailer_email,nodemailer_password,job_title) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");
  await page.type("#username", linkedin_email);
  await page.type("#password", linkedin_password);
  await page.click(".btn__primary--large.from__button--floating");
  await page.waitForNavigation();
  await page.waitForSelector("img");

  await page.goto(
    `https://www.linkedin.com/jobs/search/?keywords=${job_title}`
  );

  let jobLinks = await page.evaluate(() => {
    return [...document.querySelectorAll(".job-card-container__link")].map(
      (job) => job.href
    );
  });

  let descriptions = [];

  for (const link of jobLinks) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded" });
      // Extract content of the div
      const jobDescription = await page.$eval(".mt4 p", (el) => {       
        return { jobLink: window.location.href, jobDetails: el.innerText };
      });

      descriptions.push(jobDescription); // Add to the array
    } catch (error) {
      console.error(`Error extracting job description from ${link}:`, error);
    }
  }

  await browser.close();
  getJobAnalysis(descriptions,nodemailer_email,nodemailer_password);
}


// Nodemailer code for sending email
async function sendEmail(jobDescriptions,nodemailer_email,nodemailer_password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: nodemailer_email,
      pass: nodemailer_password,
    },
  });

  const mailOptions = {
    from: nodemailer_email,
    to: nodemailer_email,
    subject: "Top Jobs for Your Skillset",
    html: jobDescriptions
  };

  let info = await transporter.sendMail(mailOptions);
  console.log(info);
}


// Alternate routes
app.all("*", (req, res) => {
  res.render("error.ejs", {status: 404, message: "The requested resource does not exist."});
});

// Error handling middleware
app.use((err, req, res, next) => {
  let {status=500, message="Something went wrong"} = err;
  res.render("error.ejs", {status, message});
});