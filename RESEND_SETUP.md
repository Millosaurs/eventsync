# Resend Email Setup Guide

This guide will walk you through setting up Resend for sending emails in EventSync.

## What is Resend?

Resend is a modern email API service designed for developers. It provides a simple, reliable way to send transactional and notification emails from your application.

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" or "Get Started"
3. Create an account using your email or GitHub
4. Verify your email address

## Step 2: Get Your API Key

1. Log in to your Resend dashboard at [https://resend.com/dashboard](https://resend.com/dashboard)
2. Navigate to "API Keys" in the sidebar
3. Click "Create API Key"
4. Give it a name (e.g., "EventSync Development" or "EventSync Production")
5. Select the appropriate permission level:
   - **Sending access** - For production (recommended for security)
   - **Full access** - For development (gives complete API access)
6. Click "Create"
7. **IMPORTANT**: Copy the API key immediately - it will only be shown once!

Your API key will look like: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Configure Environment Variables

Add the following environment variables to your `.env.local` file (create it if it doesn't exist):

```bash
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Email sender configuration
EMAIL_FROM="EventSync <noreply@yourdomain.com>"

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Variable Explanations:

- **RESEND_API_KEY**: Your Resend API key from Step 2
- **EMAIL_FROM**: The "from" address for your emails (format: "Name <email@domain.com>")
- **NEXT_PUBLIC_APP_URL**: Your application's URL (use your production URL when deploying)

## Step 4: Domain Setup (Optional but Recommended for Production)

By default, Resend allows you to send emails using their test domain (`onboarding@resend.dev`). For production, you should use your own domain.

### Add Your Domain:

1. In the Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain name (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain's DNS settings:
   - **SPF Record** (TXT record)
   - **DKIM Records** (CNAME records)
   - **DMARC Record** (TXT record) - Optional but recommended

### Verify Your Domain:

1. After adding DNS records, click "Verify" in the Resend dashboard
2. DNS propagation can take a few minutes to 48 hours
3. Once verified, you can send emails from any address at your domain

### Update EMAIL_FROM:

Once your domain is verified, update the `EMAIL_FROM` environment variable:

```bash
EMAIL_FROM="EventSync <noreply@yourdomain.com>"
```

## Step 5: Test the Integration

You can test if Resend is working correctly:

### Option 1: Using the Application

1. Create a team and invite members (this sends credentials emails)
2. Start a running event and notify teams (sends event notification emails)
3. Check the Resend dashboard under "Logs" to see sent emails

### Option 2: Using a Test Script

Create a test file `test-email.js`:

```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'EventSync <onboarding@resend.dev>',
      to: ['your-email@example.com'],
      subject: 'Test Email from EventSync',
      html: '<p>This is a test email from EventSync!</p>',
    });

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmail();
```

Run with: `node test-email.js`

## Features Using Resend in EventSync

### 1. Team Member Invitation Emails
When a team leader adds members to their team, EventSync automatically sends:
- Welcome email with account credentials
- Login instructions
- Team information

**Implementation**: See `lib/email.ts` → `sendCredentialsEmail()`

### 2. Running Event Notifications
When an event manager starts an event, all registered team members receive:
- Event details and location
- Direct link to their team's running event portal
- Access to QR codes for attendance and coupons

**Implementation**: See `lib/email.ts` → `sendRunningEventEmail()`

### 3. Custom Event Messages
Event managers can post urgent updates that could optionally trigger email notifications.

## Monitoring and Logs

### View Email Logs:

1. Go to the Resend dashboard
2. Click "Logs" in the sidebar
3. You'll see:
   - Email status (sent, delivered, bounced, etc.)
   - Recipient information
   - Timestamps
   - Error messages (if any)

### Email Statuses:

- **Sent**: Email successfully sent to Resend
- **Delivered**: Email delivered to recipient's mail server
- **Bounced**: Email could not be delivered
- **Complained**: Recipient marked as spam
- **Opened**: Recipient opened the email (requires tracking)
- **Clicked**: Recipient clicked a link (requires tracking)

## Rate Limits

### Free Tier:
- 100 emails per day
- 3,000 emails per month
- Good for development and testing

### Paid Plans:
- Starting at $20/month for 50,000 emails
- No daily sending limits
- Better deliverability
- Priority support

Check current pricing at [https://resend.com/pricing](https://resend.com/pricing)

## Security Best Practices

### 1. Keep Your API Key Secret
- Never commit API keys to version control
- Use environment variables
- Add `.env.local` to `.gitignore`

### 2. Use Different Keys for Different Environments
- Development key for local development
- Production key for live application
- This allows you to revoke keys independently

### 3. Rotate Keys Regularly
- Generate new API keys periodically
- Revoke old keys in the Resend dashboard

### 4. Use Sending Access Only in Production
- Full access is only needed for development
- Sending access is more secure for production

## Troubleshooting

### Issue: Emails Not Sending

**Check:**
1. Is `RESEND_API_KEY` set correctly in `.env.local`?
2. Is the API key valid (not revoked)?
3. Check Resend dashboard logs for error messages
4. Ensure you haven't exceeded rate limits

### Issue: Emails Going to Spam

**Solutions:**
1. Set up your own domain (don't use resend.dev in production)
2. Configure SPF, DKIM, and DMARC records
3. Avoid spam trigger words in subject lines
4. Use a consistent "from" address
5. Don't send too many emails at once

### Issue: Domain Verification Fails

**Check:**
1. DNS records are added correctly
2. DNS propagation has completed (can take up to 48 hours)
3. Use [https://mxtoolbox.com](https://mxtoolbox.com) to verify DNS records
4. Ensure there are no typos in the DNS records

### Issue: Invalid Email Format

Ensure email addresses are in the correct format:
- Single recipient: `"user@example.com"`
- Multiple recipients: `["user1@example.com", "user2@example.com"]`
- With name: `"User Name <user@example.com>"`

## Testing in Development

While developing, you can use:

1. **Resend's Test Domain**: `onboarding@resend.dev` (default)
2. **Your Personal Email**: Test emails by sending to your own address
3. **Email Testing Services**: 
   - [Mailtrap](https://mailtrap.io) - Catches emails in development
   - [MailHog](https://github.com/mailhog/MailHog) - Local email testing

## Production Checklist

Before deploying to production:

- [ ] Create a production Resend API key with "Sending access" only
- [ ] Add and verify your custom domain
- [ ] Update `EMAIL_FROM` to use your custom domain
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production URL
- [ ] Test all email flows in staging environment
- [ ] Configure email templates for branding
- [ ] Set up monitoring for email delivery rates
- [ ] Review and configure DMARC policy

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Node.js SDK](https://github.com/resend/resend-node)
- [Email Best Practices](https://resend.com/docs/knowledge-base/email-best-practices)
- [Domain Setup Guide](https://resend.com/docs/dashboard/domains/introduction)

## Support

If you encounter issues:
1. Check Resend's status page: [https://resend.com/status](https://resend.com/status)
2. Review Resend documentation
3. Contact Resend support (available on paid plans)
4. Check the EventSync repository issues

## Summary

1. Sign up at resend.com
2. Create an API key
3. Add `RESEND_API_KEY` to `.env.local`
4. Configure `EMAIL_FROM` and `NEXT_PUBLIC_APP_URL`
5. (Optional) Add and verify your custom domain
6. Test email functionality
7. Monitor email logs in Resend dashboard

That's it! You're now ready to send emails from EventSync using Resend. 🎉