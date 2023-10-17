import nodemailer from 'nodemailer';

const signUpEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          type: 'login',
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false,
          ciphers:'SSLv3'
        }
      });

    const {email, name, token} = data

    // Send email

    try {
      const adress = process.env.EMAIL_USER
      const info = await transporter.sendMail({
          from: `"Veterinary Patients Management" ${adress}`,
          to: email,
          subject: 'Verify your account', 
          text: 'Verify your account',
          html: `<p>Hi ${name}!, please verify your account in VPM - Veterinary Patients Management.<p>
              <p>Your account is ready, you only have to verify your email using this link:
              <a href="${process.env.FRONTEND_URL}/verifyaccount/${token}">Verify Account</a> </p>

              <p>If you didn't create this account, please ignore this message.</p>
          `,
      });
      console.log('Email sent: %s', info.messageId);
    }
    catch (error) {
      console.log(error);
    }

}

export default signUpEmail;