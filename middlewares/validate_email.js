import validator from 'validator';

const ALLOWED_DOMAINS = ['gmail.com', 'phillife.com', 'phillife.com.ph'];

export const validateEmail = (req, res, next) => {
    let { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    email = email.trim();

    console.log("Incoming email:", email); // optional debug

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    const normalizedEmail = validator.normalizeEmail(email);
    const domain = normalizedEmail.split('@')[1].toLowerCase();

    if (!ALLOWED_DOMAINS.includes(domain)) {
        return res.status(400).json({
            message: 'Email must be a Gmail or phillife email address.'
        });
    }

    req.body.email = normalizedEmail;
    next();
};
