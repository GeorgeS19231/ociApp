import sgMail from '@sendgrid/mail';

let sendgridConfigured = false;

function formatRecipientName(name, email) {
    if (name && String(name).trim()) {
        return String(name).trim();
    }

    if (email && String(email).includes('@')) {
        return String(email).split('@')[0];
    }

    return 'there';
}

function ensureMailerConfigured() {
    if (sendgridConfigured) {
        return;
    }

    const apiKey = process.env.SENDGRID_KEY;
    if (!apiKey) {
        const error = new Error('Email service is not configured. Set SENDGRID_KEY to enable email delivery.');
        error.status = 503;
        throw error;
    }

    if (!apiKey.startsWith('SG.')) {
        const error = new Error('SENDGRID_KEY is invalid.');
        error.status = 503;
        throw error;
    }

    sgMail.setApiKey(apiKey);
    sendgridConfigured = true;
}

export async function sendActivationCodeToNewUser(name, email, code) {
    try {
        ensureMailerConfigured();
        const recipientName = formatRecipientName(name, email);
        const msg = {
            to: email,
            from: 'ociappsup@gmail.com',
            subject: 'Your activation code',
            html: `
                <h1>Welcome ${recipientName}!</h1>
                <p>We're glad you joined our community.</p>
                <p>To activate your account, please use this code:</p>
                <h2 style="color: #4CAF50;">${code}</h2>
            `,
            text: `Hi ${recipientName}, we're glad you joined our community.\nTo activate your account please use next code: ${code}`
        };

        const response = await sgMail.send(msg);
        console.log('Email sent successfully:', response[0].statusCode);
        return response;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}

export async function sendByebyeEmail(email, name) {
    try {
        ensureMailerConfigured();
        const recipientName = formatRecipientName(name, email);
        const msg = {
            to: email,
            from: 'ociappsup@gmail.com',
            subject: 'We are sorry to see you leaving..',
            html: `
                <h1>Goodbye ${recipientName}!</h1>
                <p>We saw that you've decided to leave our community.</p>
                <p>Is there any particular reason why you decided to proceed that way?</p>
                <p>We'd love to hear your feedback to improve our service.</p>
            `,
            text: `Hi ${recipientName}, we saw that you're about to leave. Is there any particular reason why you decided to proceed that way?`
        };

        const response = await sgMail.send(msg);
        console.log('Goodbye email sent successfully:', response[0].statusCode);
        return response;
    } catch (error) {
        console.error('Goodbye email sending error:', error);
        throw error;
    }
}

export async function sendPasswordResetCode(email, code) {
    try {
        ensureMailerConfigured();
        const msg = {
            to: email,
            from: 'ociappsup@gmail.com',
            subject: 'Your password reset code',
            html: `
                <h1>Password reset</h1>
                <p>Use the code below to reset your password:</p>
                <h2 style="color: #4CAF50;">${code}</h2>
            `,
            text: `Use this code to reset your password: ${code}`
        };

        const response = await sgMail.send(msg);
        console.log('Password reset email sent successfully:', response[0].statusCode);
        return response;
    } catch (error) {
        console.error('Password reset email sending error:', error);
        throw error;
    }
}
