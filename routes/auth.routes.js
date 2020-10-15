const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth/register
router.post(
    '/register', 
    [
        check('email', 'Email is not corrected').isEmail(),
        check('password', 'Minimal length of password is 5 symbols').isLength({ min: 5 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Regestration data is not corrected'
            });
        }
        const {email, password} = req.body;
        const candidate = await User.findOne({ email });

        if(candidate) {
            return res.status(400).json({ message: 'User already exist' })
        }
        const hashedPassword = await bcrypt.hash(password, 77);
        const user = new User({ email: email, password: hashedPassword });
        await user.save();
        res.status(200).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ message: 'Something wrong. Try again.' });
    }
});

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Email is not corrected').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult();

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Login error'
            });
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({ message: 'Such user is not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecretKey'),
            { expiresIn: '1h' }
        );

        res.json({ token, userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Something wrong. Try again.' });
    }    
});

module.exports = router;