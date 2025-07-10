import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { resumeContent, jobDescription } = req.body;

  if (!resumeContent || !jobDescription) {
    return res.status(400).json({ error: 'Resume and job description are required' });
  }

  const prompt = `
You are an expert career assistant. Generate a tailored, professional cover letter based on the following resume and job description.

Resume:
${resumeContent}

Job Description:
${jobDescription}

The cover letter should:
- Start with a strong introduction stating interest in the role.
- Highlight relevant experiences and skills from the resume.
- Reflect alignment with the company’s values or mission (if possible).
- Be concise, clear, and enthusiastic.
- End with a professional closing.

Return only the cover letter text.
`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user'
          }
        ]
      }
    );

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({ error: 'No content generated' });
    }

    res.status(200).json({ coverLetter: generatedText });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

export default router;