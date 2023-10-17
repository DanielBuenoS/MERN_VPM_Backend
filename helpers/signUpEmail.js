import nodemailer from 'nodemailer';

const signUpEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
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
        subject: 'Verify your account', 
        text: 'Verify your account',
        html: `<p>Hi ${name}!, please verify your account in VPM - Veterinary Patients Management.<p>
            <p>Your account is ready, you only have to verify your email using this link:
            <a href="${process.env.FRONTEND_URL}/verifyaccount/${token}">Verify Account</a> </p>

            <p>If you didn't create this account, please ignore this message.</p>
        `,
    });

    console.log('Email sent: %s', info.messageId)


}

export default signUpEmail;