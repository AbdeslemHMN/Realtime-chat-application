import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// @desc    Get a user profile 
const getProfileUser = async (req, res) => {
    const { query } = req.params
    try {
        let user
        if (mongoose.Types.ObjectId.isValid(query)) {
    // query is userId
            user = await User.findOne({ _id: query , isFrozen: false }).select("-password").select("-updatedAt");
        } else {
    // query is username
        user = await User.findOne({username: query , isFrozen: false}).select("-password").select("-updatedAt");
    }
        if (!user) return res.status(400).json({ error: "User not found" });
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
} ;


// @desc    Register a new user
const signupUser = async (req, res) => {
    try {
        const {name, email, username, password, confirm_password} = req.body;
        const user = await User.findOne({$or: [{email}, {username}]});

        if (user) {
            return res.status(400).json({error: "User already exists"}); 
        }

        const minLength = 6;
        if (password.length < minLength) {
            return res.status(400).json({error: `Password must be at least ${minLength} characters long`});
        }
        
        if (password !== confirm_password) return res.status(400).json({error: "Passwords do not match"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({error: "Invalid user data"});
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Login a user
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" });
        
        if (user.isFrozen) {
            user.isFrozen = false;
            await user.save();
        }
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Logout a user
const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({message: "Logged out successfully"});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};  

// @desc    Follow or Unfollow a user
const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: "Invalid user ID"});
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) return res.status(400).json({error: "You cannot follow or unfollow yourself"});

        if (!userToModify || !currentUser) return res.status(400).json({error: "User not found"});

        const isFollowing = currentUser.following.includes(id); 

        if (isFollowing) {
            // Unfollow user 
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
            res.status(200).json({message: "User unfollowed successfully"});
        } else {
            // Follow user
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            res.status(200).json({message: "User followed successfully"});
        }

    } catch (err) {
        res.status(500).json({ error: err.message });     
    }
};



// @desc new update user i should understand it before integrate it in my code

const updateUser = async (req, res) => {
    const { name, email, username, password, confirm_password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id;

    const promises = [];
    const updates = {};

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({error: "User not found"});

        if(req.params.id !== userId.toString()) return res.status(400).json({error: "You can only update your profile"});
        
        if (password && confirm_password) {
            const minLength = 6;
            
            if (password.length < minLength) return res.status(400).json({error: `Password must be at least ${minLength} characters long`});
            
            if (password !== confirm_password) return res.status(400).json({error: "Passwords do not match"},password,confirm_password);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        // Username and email checks
        if (username && username !== user.username) {
            promises.push(User.findOne({ username }).then(existingUser => {
                if (existingUser) throw new Error("Username already exists");
                updates.username = username;
            }));
        }

        if (email && email !== user.email) {
            promises.push(User.findOne({ email }).then(existingEmail => {
                if (existingEmail) throw new Error("Email already exists");
                updates.email = email;
            }));
        }

        // Profile picture handling
        if (profilePic) {
            if (user.profilePic) {
                promises.push(cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]));
            }
            promises.push(cloudinary.uploader.upload(profilePic).then(uploadedResponse => {
                updates.profilePic = uploadedResponse.secure_url;
            }));
        }

        // Await all promises
        await Promise.all(promises);

        // Apply updates
        updates.name = name || user.name;
        updates.bio = bio || user.bio;
        Object.assign(user, updates);

        const updatedUser = await user.save();
        updatedUser.password = null;

        res.status(200).json(updatedUser);
        
    } catch (err) {
        console.error("Error in updateUser: ", err.message);
        res.status(500).json({ error: err.message });
    } ; 
} ;

const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid user ID" });
        const usersFollowedByUser = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId } ,
                    isFrozen: false
                }
            },
                {
                $sample: {
                    size: 10
                }
            }
        ]);
        const filteredUsers = users.filter(user => !usersFollowedByUser.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4).map(user => {
            delete user.password
            return user;
        }
        );
        res.status(200).json(suggestedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const freezeUser = async (req, res) => { 
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: "User not found" });

        user.isFrozen = true;
        await user.save();
        res.status(200).json({ message: "User frozen successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { signupUser , loginUser, logoutUser, followUnfollowUser , updateUser , getProfileUser , getSuggestedUsers , freezeUser };