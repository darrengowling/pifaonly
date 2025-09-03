// Simple waitlist API endpoint
// In a real implementation, you'd integrate with a service like ConvertKit, Mailchimp, or save to database

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, groupSize, message } = req.body

    // Validate required fields
    if (!name || !email || !groupSize) {
      return res.status(400).json({ 
        message: 'Name, email, and group size are required' 
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      })
    }

    // Log the submission (in production, you'd save to database or send to email service)
    console.log('Waitlist Submission:', {
      name,
      email,
      groupSize,
      message: message || 'No message',
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown'
    })

    // Simulate successful submission
    // In production, replace this with actual service integration:
    // - ConvertKit: await convertkit.subscribers.create({ email, first_name: name })
    // - Mailchimp: await mailchimp.lists.addListMember(listId, { email_address: email })
    // - Database: await db.waitlist.create({ name, email, groupSize, message })

    return res.status(200).json({ 
      message: 'Successfully joined waitlist!',
      success: true 
    })

  } catch (error) {
    console.error('Waitlist API Error:', error)
    return res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
}