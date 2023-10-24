import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const sendMail = async ({ to, subject, html, text, from, attachments }: any) => {
    const msg = {
        to,
        from, // Use the email address or domain you verified above
        subject,
        text,
        html,
        attachments,
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.log('error', error);
    }
};

export default sendMail;
