const OpenAI = require('openai')
const AIAnalysis = require('../models/AIAnalysis')
const TrackedJob = require('../models/TrackedJob')
const UserProfile = require('../models/UserProfile')

function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function isQuotaError(error) {
  return error?.status === 429 || String(error?.message).includes('quota')
}

function buildDemoJobMatch(profile, trackedJob) {
  const profileSkills = profile.skills || []
  const description = `${trackedJob.title} ${trackedJob.description}`.toLowerCase()
  const matchingSkills = profileSkills.filter((skill) =>
    description.includes(skill.toLowerCase())
  )

  const missingSkills = ['Testing', 'Performance optimization', 'System design']
    .filter((skill) => !matchingSkills.includes(skill))
    .slice(0, 3)

  return {
    source: 'demo',
    matchScore: Math.min(88, 62 + matchingSkills.length * 6),
    summary: `Demo analysis: this role appears aligned with your ${profile.targetRole || 'target role'} profile, especially if you highlight relevant project work and measurable frontend impact.`,
    matchingSkills:
      matchingSkills.length > 0
        ? matchingSkills
        : ['React', 'JavaScript', 'Frontend development'],
    missingSkills,
    strengths: [
      'Your profile shows relevant frontend experience for this role.',
      'The role can be positioned well around dashboard, UI, and API integration work.',
      'Your tracked project experience gives you concrete examples to discuss.',
    ],
    improvementSuggestions: [
      'Add 2-3 measurable achievements to your resume bullets.',
      'Tailor the resume summary to mention the job title and strongest matching skills.',
      'Prepare one project story that explains architecture, state management, and API handling.',
    ],
    applicationAdvice: [
      'Apply with a tailored resume version for this role.',
      'Mention your Smart Job Tracker project if the role values React dashboards or SaaS UI.',
      'Follow up after 5-7 days if you do not receive a response.',
    ],
  }
}

function buildDemoInterviewPrep(profile, trackedJob) {
  return {
    source: 'demo',
    focusAreas: [
      'Explain your most relevant frontend project end to end.',
      'Review React state management, routing, API integration, and component design.',
      'Prepare examples of debugging UI issues and improving user experience.',
    ],
    technicalQuestions: [
      'How would you structure reusable components for a dashboard product?',
      'How do you handle loading, error, and empty states in React?',
      'What are the tradeoffs between local state, context, and backend persistence?',
      'How would you optimize a page rendering many job cards?',
      'How do you secure API keys in a full-stack application?',
    ],
    behavioralQuestions: [
      'Tell me about a time you improved a user workflow.',
      'Describe a difficult bug you solved and how you approached it.',
      'How do you prioritize polish versus shipping features?',
    ],
    projectTalkingPoints: [
      `Connect your Smart Job Tracker project to this ${trackedJob.title} role.`,
      'Discuss how you moved from localStorage to authenticated MongoDB persistence.',
      'Explain how the AI match feature is handled through the backend for security.',
    ],
    studyPlan: [
      'Day 1: Revise React fundamentals and routing.',
      'Day 2: Practice explaining your project architecture.',
      'Day 3: Prepare answers for API, auth, and MongoDB questions.',
      'Day 4: Mock interview with role-specific frontend questions.',
    ],
    closingAdvice: `Position yourself as a ${profile.targetRole || 'frontend'} candidate who can build practical SaaS workflows, not only static UI screens.`,
  }
}

async function analyzeJobMatch(req, res) {
  try {
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === 'your_openai_api_key_here'
    ) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key is not configured in server .env',
      })
    }

    const trackedJob = await TrackedJob.findOne({
      _id: req.params.trackedJobId,
      user: req.user._id,
    })

    if (!trackedJob) {
      return res.status(404).json({ success: false, message: 'Tracked job not found' })
    }

    const profile = await UserProfile.findOne({ user: req.user._id })

    if (!profile?.resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Please save your resume/profile before running AI analysis',
      })
    }

    let result

    try {
      const openai = getOpenAIClient()

      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content:
              'You are an expert career coach. Return honest resume-job fit analysis as JSON.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              resume: profile.resumeText,
              targetRole: profile.targetRole,
              skills: profile.skills,
              job: trackedJob,
            }),
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'job_match_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                matchScore: { type: 'integer', minimum: 0, maximum: 100 },
                summary: { type: 'string' },
                matchingSkills: { type: 'array', items: { type: 'string' } },
                missingSkills: { type: 'array', items: { type: 'string' } },
                strengths: { type: 'array', items: { type: 'string' } },
                improvementSuggestions: { type: 'array', items: { type: 'string' } },
                applicationAdvice: { type: 'array', items: { type: 'string' } },
              },
              required: [
                'matchScore',
                'summary',
                'matchingSkills',
                'missingSkills',
                'strengths',
                'improvementSuggestions',
                'applicationAdvice',
              ],
            },
          },
        },
      })

      result = JSON.parse(response.output_text)
      result.source = 'openai'
    } catch (error) {
      if (!isQuotaError(error)) {
        throw error
      }

      console.warn('OpenAI quota unavailable, returning demo AI analysis')
      result = buildDemoJobMatch(profile, trackedJob)
    }

    const analysis = await AIAnalysis.create({
      user: req.user._id,
      trackedJob: trackedJob._id,
      type: 'JOB_MATCH',
      result,
    })

    res.status(200).json({ success: true, analysis })
  } catch (error) {
    console.error('AI job match analysis failed:', error.message)

    res.status(500).json({
      success: false,
      message:
        error?.error?.message ||
        error?.message ||
        'Server error while running AI job match analysis',
    })
  }
}

async function getLatestJobMatch(req, res) {
  try {
    const trackedJob = await TrackedJob.findOne({
      _id: req.params.trackedJobId,
      user: req.user._id,
    })

    if (!trackedJob) {
      return res.status(404).json({
        success: false,
        message: 'Tracked job not found',
      })
    }

    const analysis = await AIAnalysis.findOne({
      user: req.user._id,
      trackedJob: trackedJob._id,
      type: 'JOB_MATCH',
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      analysis,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI job match analysis',
    })
  }
}

async function generateInterviewPrep(req, res) {
  try {
    const trackedJob = await TrackedJob.findOne({
      _id: req.params.trackedJobId,
      user: req.user._id,
    })

    if (!trackedJob) {
      return res.status(404).json({
        success: false,
        message: 'Tracked job not found',
      })
    }

    const profile = await UserProfile.findOne({ user: req.user._id })

    if (!profile?.resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Please save your resume/profile before generating interview prep',
      })
    }

    let result

    try {
      const openai = getOpenAIClient()

      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content:
              'You are an expert interview coach. Return practical interview prep as JSON.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              resume: profile.resumeText,
              targetRole: profile.targetRole,
              skills: profile.skills,
              job: trackedJob,
            }),
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'interview_prep',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                focusAreas: { type: 'array', items: { type: 'string' } },
                technicalQuestions: { type: 'array', items: { type: 'string' } },
                behavioralQuestions: { type: 'array', items: { type: 'string' } },
                projectTalkingPoints: { type: 'array', items: { type: 'string' } },
                studyPlan: { type: 'array', items: { type: 'string' } },
                closingAdvice: { type: 'string' },
              },
              required: [
                'focusAreas',
                'technicalQuestions',
                'behavioralQuestions',
                'projectTalkingPoints',
                'studyPlan',
                'closingAdvice',
              ],
            },
          },
        },
      })

      result = JSON.parse(response.output_text)
      result.source = 'openai'
    } catch (error) {
      if (!isQuotaError(error)) {
        throw error
      }

      console.warn('OpenAI quota unavailable, returning demo interview prep')
      result = buildDemoInterviewPrep(profile, trackedJob)
    }

    const analysis = await AIAnalysis.create({
      user: req.user._id,
      trackedJob: trackedJob._id,
      type: 'INTERVIEW_PREP',
      result,
    })

    res.status(200).json({ success: true, analysis })
  } catch (error) {
    console.error('AI interview prep failed:', error.message)

    res.status(500).json({
      success: false,
      message:
        error?.error?.message ||
        error?.message ||
        'Server error while generating interview prep',
    })
  }
}

async function getLatestInterviewPrep(req, res) {
  try {
    const trackedJob = await TrackedJob.findOne({
      _id: req.params.trackedJobId,
      user: req.user._id,
    })

    if (!trackedJob) {
      return res.status(404).json({
        success: false,
        message: 'Tracked job not found',
      })
    }

    const analysis = await AIAnalysis.findOne({
      user: req.user._id,
      trackedJob: trackedJob._id,
      type: 'INTERVIEW_PREP',
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      analysis,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching interview prep',
    })
  }
}

async function getAIHistory(req, res) {
  try {
    const analyses = await AIAnalysis.find({ user: req.user._id })
      .populate('trackedJob', 'jobId title company location status')
      .sort({ createdAt: -1 })
      .limit(50)

    res.status(200).json({
      success: true,
      analyses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI history',
    })
  }
}

module.exports = {
  analyzeJobMatch,
  getLatestJobMatch,
  generateInterviewPrep,
  getLatestInterviewPrep,
  getAIHistory,
}
