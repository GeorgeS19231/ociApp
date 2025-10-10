import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendActivationCodeToNewUser(name, email, code) {
    await resend.emails.send({
        from: 'ociappsup@gmail.com',
        to: [email],
        subject: 'Your activation code',
        text: `Hi ${name}, we're glad you joined our community.\n To activate your account please use next code: ${code}`
    }
    )
}