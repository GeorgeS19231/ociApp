import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_KEY);

export async function sendActivationCodeToNewUser(name, email, code) {
    try {
        const msg = {
            to: email,
            from: 'ociappsup@gmail.com',
            subject: 'Your activation code',
            html: `
                <h1>Welcome ${name}!</h1>
                <p>We're glad you joined our community.</p>
                <p>To activate your account, please use this code:</p>
                <h2 style="color: #4CAF50;">${code}</h2>
            `,
            text: `Hi ${name}, we're glad you joined our community.\nTo activate your account please use next code: ${code}`
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
        const msg = {
            to: email,
            from: 'ociappsup@gmail.com',
            subject: 'We are sorry to see you leaving..',
            html: `
                <h1>Goodbye ${name}!</h1>
                <p>We saw that you've decided to leave our community.</p>
                <p>Is there any particular reason why you decided to proceed that way?</p>
                <p>We'd love to hear your feedback to improve our service.</p>
            `,
            text: `Hi ${name}, we saw that you're about to leave. Is there any particular reason why you decided to proceed that way?`
        };

        const response = await sgMail.send(msg);
        console.log('Goodbye email sent successfully:', response[0].statusCode);
        return response;
    } catch (error) {
        console.error('Goodbye email sending error:', error);
        throw error;
    }
}
