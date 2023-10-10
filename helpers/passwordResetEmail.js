import nodemailer from 'nodemailer';

const passwordResetEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const {email, name, token} = data

    // Send email
    const info = await transporter.sendMail({
        from: 'Veterinary Patients Management',
        to: email,
        subject: 'Reset your password', 
        text: 'Reset your password',
        html: `<p>Hi ${name}!, you have requested to reset your password.<p>
            <p>Follow the next link to set a new password:
            <a href="${process.env.FRONTEND_URL}/passwordreset/${token}">Password Reset</a> </p>

            <p>If you didn't request to reset your password, please ignore this message.</p>
        `,
    });

    console.log('Email sent: %s', info.messageId)


}

export default passwordResetEmail; 