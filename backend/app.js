const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// API Keys and URLs
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GENAI_API_KEY = process.env.GENAI_API_KEY || 'AIzaSyDia290Ad4zkTdeCGKNDoGURXaaz9lXYsY';
const GPT_API_URL = 'https://gpt-4o-mini.deno.dev/v1/chat/completions';

// Email Configuration
const SMTP_SERVER = process.env.SMTP_SERVER || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USERNAME = process.env.SMTP_USERNAME || 'hanonymous371@gmail.com';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || 'dqhp wtwk flae shmv';

// Google Generative AI configuration
const genAI = new GoogleGenerativeAI(GENAI_API_KEY);

async function fetchFileContent(fileUrl) {
  try {
    const response = await axios.get(fileUrl, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching file content: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

async function generateReadme(fileContent, fileName, model, userRequirements) {
  let basePrompt = `Create a README.md file for the file ${fileName}:\n${fileContent}. `;
  if (userRequirements) {
    basePrompt += `Consider the following user requirements: ${userRequirements}. `;
  } else {
    basePrompt += 'It should contain all necessary information like endpoint parameters, descriptions, etc. ';
  }
  basePrompt += 'Do not include \`\`\`markdown anywhere, just provide direct .md format data.';

  switch (model) {
    case 'gpt':
      return generateReadmeWithGPT(basePrompt);
    case 'google':
      return generateReadmeWithGoogle(basePrompt);
    case 'claude':
      return generateReadmeWithClaude(basePrompt);
    case 'llama':
      return generateReadmeWithLlama(basePrompt);
    case 'groq':
      return generateReadmeWithGroq(basePrompt);
    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}

async function generateReadmeWithGPT(prompt) {
  try {
    const response = await axios.post(GPT_API_URL, {
      model: 'gpt-4o-mini',
      stream: false,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Hi, I am rahul nakum' }
      ]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }
    return null;
  } catch (error) {
    console.error('Error with GPT API:', error);
    return null;
  }
}

async function generateReadmeWithGoogle(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error with Google API:', error);
    return null;
  }
}

async function generateReadmeWithClaude(prompt) {
  try {
    const response = await axios.post(GPT_API_URL, {
      model: 'claude-3-haiku',
      stream: false,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Hi, I am rahul nakum' }
      ]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }
    return null;
  } catch (error) {
    console.error('Error with Claude API:', error);
    return null;
  }
}

async function generateReadmeWithLlama(prompt) {
  try {
    const response = await axios.post(GPT_API_URL, {
      model: 'llama-3.1-70b',
      stream: false,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Hi, I am rahul nakum' }
      ]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }
    return null;
  } catch (error) {
    console.error('Error with Llama API:', error);
    return null;
  }
}

async function generateReadmeWithGroq(prompt) {
  try {
    const response = await axios.post(GROQ_API_URL, {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }
    return null;
  } catch (error) {
    console.error('Error with Groq API:', error);
    return null;
  }
}

async function processFile(file, socket, userRequirements) {
  try {
    if (typeof file === 'object' && file.name && file.download_url) {
      const content = await fetchFileContent(file.download_url);
      const repoUrl = file.download_url;

      const models = ['gpt', 'google', 'claude', 'llama', 'groq'];
      let readme = null;

      for (const model of models) {
        readme = await generateReadme(content, repoUrl, model, userRequirements);
        if (readme) break;
      }

      socket.emit('readme_section', { readme_content: readme, file_name: file.name });
    } else {
      throw new Error('Invalid file format or missing required keys (name and download_url)');
    }
  } catch (error) {
    socket.emit('error', { message: `Error processing ${file.name || 'unknown'}: ${error.message}` });
  }
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('generate_readme', async (data) => {
    const repoUrl = data.repoUrl;
    const userRequirements = data.userRequirements || '';

    try {
      const [owner, repo] = repoUrl.split('/').slice(-2);
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      const files = response.data;

      const filePromises = files
        .filter(file => file.type === 'file')
        .map(file => processFile(file, socket, userRequirements));

      await Promise.all(filePromises);
      socket.emit('readme_generation_complete');
    } catch (error) {
      console.error(`Error in generate_readme: ${error.message}`);
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
      }
      socket.emit('error', { message: `Failed to generate README: ${error.message}` });
    }
  });

  socket.on('send_contact_form', async (data) => {
    const { title, description } = data;

    if (!title || !description) {
      socket.emit('contact_form_response', { success: false, message: 'Title and description are required.' });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false,
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: SMTP_USERNAME,
        to: SMTP_USERNAME, // Change this to the recipient email
        subject: `New Contact Form Submission: ${title}`,
        text: `Title: ${title}\n\nDescription: ${description}`
      });

      socket.emit('contact_form_response', { success: true, message: 'Your message has been sent successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      socket.emit('contact_form_response', { success: false, message: 'Failed to send message. Please try again later.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err)
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  })
})

app.use(
  cors({
    origin: "*", // In production, replace with your frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  }),
)

const db_link =
  process.env.DB_LINK ||
  'mongodb+srv://hanonymous371:YlKHdJPyd9xJn4aI@cluster0.evl26.mongodb.net/?retryWrites=true&w=majority';

async function connectToDatabase() {
  try {
    await mongoose.connect(db_link, {
      dbName: 'readme',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Successfully connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit process if unable to connect to MongoDB
  }
}
// Analytics schema
const analyticsSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  country: String,
  region: String,
  city: String,
  latitude: Number,
  longitude: Number,
  timezone: String,
  isp: String,
  pageUrl: String,
  referrer: String,
  deviceType: String,
  browserName: String,
  osName: String,
  screenResolution: String,
  language: String,
  timestamp: { type: Date, default: Date.now },
})

const Analytics = mongoose.model("Analytics", analyticsSchema)

// API routes with better error handling
app.post("/log-visit", async (req, res) => {
  try {
    const analytics = new Analytics(req.body)
    await analytics.save()
    console.log("📝 Visit logged:", analytics)
    res.json({ success: true })
  } catch (error) {
    console.error("❌ Error logging visit:", error)
    res.status(500).json({
      success: false,
      error: "Failed to log visit",
      details: error.message,
    })
  }
})

app.get("/view-logs", async (req, res) => {
  try {
    const logs = await Analytics.find().sort({ timestamp: -1 }).limit(100)
    res.json(logs)
  } catch (error) {
    console.error("❌ Error fetching logs:", error)
    res.status(500).json({
      error: "Failed to fetch logs",
      details: error.message,
    })
  }
})

const PORT = process.env.PORT || 8080;
async function startServer() {
  await connectToDatabase(); // Connect to MongoDB before starting the server
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

// Call to start the server
startServer();