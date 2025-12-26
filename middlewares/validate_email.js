// middleware/validate_email.js
import validator from 'validator';

const ALLOWED_DOMAINS = ['gmail.com', '@phillife.com.ph'];

export const validateEmail = (req, res, next ) => {
    const { email } = req.body;

    if(!email) {
        return res.status(400).json({
            message: 'Email is required.'
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            message: 'Invalid Email format'
        });
    }

    const normalizedEmail = validator.normalizeEmail(email);
    const domain = normalizedEmail.split('@')[1].toLowerCase();

    if (!ALLOWED_DOMAINS.includes(domain)){
        return res.status(400).json({
            message: 'Email must be a Gmail or phillife email address.'
        });
    }

    req.body.email = normalizedEmail;

    next();
}