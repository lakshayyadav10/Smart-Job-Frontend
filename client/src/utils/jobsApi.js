export async function fetchJobs() {
  const response = await fetch('https://remotive.com/api/remote-jobs')

  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }

  const data = await response.json()

  return data.jobs.map((job, index) => ({
    id: job.id ?? index + 1,
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || 'Remote',
    type: job.job_type || 'Full-Time',
    mode: 'Remote',
    experience: 'Not specified',
    salary: job.salary || 'Not disclosed',
    description: job.description
      ? job.description.replace(/<[^>]+>/g, '').slice(0, 220) + '...'
      : 'No description available.',
    url: job.url,
  }))
}
