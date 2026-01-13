// controllers/auth/auth_Controller.js
import * as Model from '../../models/auth/auth_Model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ----------------- REGISTER -----------------
export const register = async (req, res) => {
    try {
        console.log('REGISTER WORKING:');

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body missing."
            });
        }
        
        const { first_name, middle_name, last_name, email, password, role } = req.body;

        // Required fields
        if (!first_name || !last_name || !email || password) {
            return res.status(400).json({
                message: 'Required fields missing.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format.'
            });
        }

        // Password validation: 8+ character, uppercase, number special char
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(password)){
            return res.status(400).json({
                message: 'Password must be 8+ characters, include uppercase, number or special character.'
            });
        }

        // Check if email already exists
        const existingUser = await Model.getUserByEmail(email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already register. Use another email to register.'
            });
        }

    // Get roles from DB to ensure exact casing
    const allowedRoles = [ 'user', 'admin', 'Super Admin' ];

    let selectedRole = 'user';

    if (role && allowedRoles.includes(role)) {
        selectedRole = role;
    }

    // If logged in as admin or superadmin, allow assigning higher roles
    if (req.user && ['admin', 'Super Admin'].includes(req.user.role)) {
        selectedRole = role && allowedRoles.includes(role) ? role : 'user';
    }

    // Create user
    const userId = await Model.createUser({
        email: email.toLowerCase(),
        password,
        role: selectedRole
    });

    // Create profile
    await Model.createProfile(userId, {
        first_name,
        middle_name,
        last_name
    });

    // Generate token
    const token = jwt.sign(
        { id: userId, role: selectedRole },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    await Model.updateToken(userId, token);

    res.status(201).json({
        success: true,
        user: {
            id: userId,
            email: email.toLowerCase(),
            role: selectedRole,
            first_name,
            middle_name,
            last_name
        },
        token
    });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            message: 'Server Error.'
        });
    }
};

// ----------------- LOGIN -----------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({
            message: 'Email and password required.'
        });

        const user = await Model.getUserByEmail(email);
        if (!user) return res.status(400).json({
            message: 'Invalid Credentials.'
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({
            message: 'Invalid Credentials.'
        });

        const token = jwt.sign({ id: user.id, role: user.role },
            process.env.JWT_SECRET, {
                expiresIn: '8h'
            })
        await Model.updateToken(user.id, token);

        const profile = await Model.getProfileByUserId(user.id);

        res.status(200).json({
            success: true,
            token,
            user: { ...user, profile }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ----------------- GET USERS -----------------
export const getAllUsers = async (req, res) => {
    try {
        const users = await Model.getAllUsersWithProfiles();

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get Users Error:',error);
        res.status(500).json({ 
            message: 'Users not found'
        });
    }
}

// Get User
export const getUser = async (req, res) => {
    try {
        const user = await Model.getUserWithProfileById(req.params.id);
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get User Error:',error);
        return res.status(500).json({
            message: 'User not found.'
        })
    }
}

// ----------------- UPDATE USER (Admin) -----------------
export const updateUser = async (req, res) => {
    try {
        let { email, role, first_name ,middle_name, last_name, department, birthday, phone, address } = req.body;

        if (email){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).json({
                message: 'Invalid email format.'
            });
        }

        if (role) {
            const allowedRoles = ['user', 'admin', 'Super Admin'];
            if (!allowedRoles.includes(role)) return res.status(400).json({
                message: 'Invalid Role.'
            })
        }

        if (birthday && isNaN(Date.parse(birthday))) return res.status(400).json({
            message: 'Invalid birthday format.'
        });
        if (phone && !/^\d{10,15}$/.test(phone)) return res.status(400).json({ 
            message: 'Invalid phone number.'
        });

        await Model.updateUser(req.params.id, { email, role });
        await Model.updateProfile(req.params.id, { first_name, middle_name, last_name, department, birthday, phone, address });

        res.status(200).json({
            success: true,
            message: 'User updated.'
        })
    } catch (error) {
        console.error('Update user Error:', error)
        res.status(500).json({
            message: 'Server Error.'
        })
    }
}

// ----------------- DELETE USER (Admin) -----------------
export const removeUser = async (req, res) => {
    try {
        await Model.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: 'User deleted.'
        })
    } catch (error) {
        console.error('Delete user error:', error)
        return res.status(500).json({
            message: 'Server error.'
        });
    }
};

// ----------------- GET MY PROFILE -----------------
export const getMyProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized.'
            });
        }

        const profile = await Model.getProfileByUserId(req.user.id);

        if (profile?.birthday) {
            profile.birthday = new Date(profile.birthday).toISOString().split('T')[0];
        }

        res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Get my Profile Error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// ----------------- UPDATE MY PROFILE -----------------
export const updateMyProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({
            message: 'Unauthorized.'
        });

        const { birthday, phone, ...rest } = req.body;

        let formattedBirthday = null;
        if (birthday) {
            const parsed = new Date(birthday);
            if (isNaN(parsed)) {
                return res.status(400).json({
                    message: 'Invalid format birthday.'
                });
            }
            // Format to YYYY-MM-DD
            formattedBirthday = parsed.toISOString().split('T')[0];
        }

        // Validation
        if (phone && !/^\d{10,15}$/.test(phone)) return res.status(400).json({
            message: 'Invalid format phone.'
        });

        // Update profile
        await Model.updateProfile(req.user.id, req.body);

        // Fetch updated profile
        const updatedProfile = await Model.getProfileByUserId(req.user.id);

        res.status(200).json({
            success: true, 
            message: 'Profile updated successfully.',
            profile: updatedProfile
        });

    } catch (error) {
        console.error('Update profile Error:', error);
        return res.status(500).json({
            message: 'Server error.'
        });
    }
};

// ----------------- CHANGE PASSWORD -----------------
export const changePassword = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized.'
            });
        }

        const  { currentPassword, newPassword, confirmPassword } = req.body;
        
        if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({
            message: 'All fields are required.'
        });

        if (newPassword !== confirmPassword) return res.status(400).json({
            message: 'New Password do not match.'
        });

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: 'Password must contaion uppercase, numnber and special character.'
            });
        }

        const user = await Model.getUserByIdWithPassword(req.user.id);
        if (!user) return res.status(404).json({
            message: 'User Not Found.'
        });

        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) return res.status(400).json({
            message: 'New password cannot be same as old password.'
        })

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({
            message: 'Current password was incorrect'
        });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Model.updatePassword(req.user.id, hashedPassword);
        await Model.updateToken(req.user.id, null);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully. Please login again'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        return res.status(500).json({
            message: 'Server Error.'
        });
    }
};

// ----------------- LOGOUT -----------------
export const logout = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unanthorized.'
            });
        }

        await Model.logoutUser(req.user.Id);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            message: 'Server Error.'
        });
    }
};
