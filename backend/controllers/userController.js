import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import mongoose from "mongoose";

// @desc    Get a user profile 
const getProfileUser = async (req, res) => {
    const {username} = req.params
   try {
    const user = await User.findOne({username}).select("-password").select("-updatedAt");
    if (!user) return res.status(400).json({error: "User not found"});

    res.status(200).json(user);

   } catch (err) {
       res.status(500).json({ error: err.message });
       console.log("Error in profileUser: ", err.message);
   } ;
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
        console.log("Error in signupUser: ", err.message);
    }
};

// @desc    Login a user
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect)  return res.status(400).json({error: "Invalid username or password"});

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
        console.log("Error in loginUser: ", err.message);
    }
};

// @desc    Logout a user
const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({message: "Logged out successfully"});

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in logoutUser: ", err.message);
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
        console.log("Error in followUnfollowUser: ", err.message);
        
    }
};

// @desc    Update a user
const updateUser = async (req, res) => {   
    const {name, email, username, password, confirm_password, profilePic, bio} = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({error: "User not found"});

        if(req.params.id !== userId.toString()) return res.status(400).json({error: "You can only update your profile"});
        
        if (password) {
            const minLength = 6;
            
            if (password.length < minLength) return res.status(400).json({error: `Password must be at least ${minLength} characters long`});
            
            if (password !== confirm_password) return res.status(400).json({error: "Passwords do not match"});
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if(email) {
            const emailExists = await User.findOne({email});
            if (email === user.email) return res.status(400).json({error: "You already use this email"});
            if (emailExists) return res.status(400).json({error: "Email already exists"});
            user.email = email;
        }

        if(username) {
            const usernameExists = await User.findOne({username});
            if (username === user.username) return res.status(400).json({error: "You already use this username"});
            if (usernameExists) return res.status(400).json({error: "Username already exists"});
            user.username = username;
        }
        
        user.name = name || user.name;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        
        user = await user.save();
        res.status(200).json({message: "Profile updated successfully",user});
        
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in updateUser: ", err.message);
    } ; 
} ;


export { signupUser , loginUser, logoutUser, followUnfollowUser , updateUser , getProfileUser };