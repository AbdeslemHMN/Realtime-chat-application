import  Post from "../models/postModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";


// @desc Create a new post
const createPost = async (req, res) => {
    try {
        const postedBy = req.user._id;
        const {text} = req.body;
        let {img} = req.body;
        if (!postedBy || !text) return res.status(400).json({ error: "PostedBy and text field are required" });
        const user = await User.findById(postedBy);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user._id.toString() !== req.user._id.toString()) return res.status(401).json({ error: "Unauthorized to create post" });

        const maxPostLength = 500;

        if (text.length > maxPostLength) return res.status(400).json({ error: `Post text must be less than ${maxPostLength} characters` });

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ postedBy, text, img });

        await newPost.save();

        if (newPost) {
            res.status(201).json(newPost);
        } else {
            res.status(400).json({ error: "Invalid post data" });
        }
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in createPost: ", err.message);
    } ;
};

// @desc Get post
const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid post ID" });
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.status(200).json( post );
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getPost: ", err.message);
    } ;
} ;

// @desc Delete post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;  
        // Check if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid post ID" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.postedBy.toString() !== req.user._id.toString()) return res.status(401).json({ error: "Unauthorized to delete post" });

        if (post.img) {
            const publicId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in deletePost: ", err.message);
    }
};

// @desc Like or unlike a  post
const likeUnlikePost = async (req, res) => {
    try {
        const { id : postId } = req.params;
        // Check if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid post ID" });

        const userId = req.user._id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({ error: "Post not found" });

        const isLiked = post.likes.includes(userId);
        if(isLiked){
            // unlike post
            await Post.updateOne({_id:postId},{ $pull: { likes: userId } });
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            // like post
            post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
        }
        

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in likePost: ", err.message);
    } ;
};

// @desc Reply to a post
const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        
        const { id : postId } = req.params;
        // Check if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid post ID" });

        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text) return res.status(400).json({ error: "Text field is required" });

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({ error: "Post not found" });

        const reply = {
            userId,
            text,
            userProfilePic,
            username
        };

        post.replies.push(reply);
        await post.save();

        res.status(200).json( post);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in replyToPost: ", err.message);
    }
};

// @desc Get feed post
const getFeedPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);   
        if(!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
        res.status(200).json(feedPosts);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
} ;

// @desc Get user post
const getUserPost = async (req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({ error: "User not found" });

        const posts = await Post.find({postedBy: user._id}).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getUserPost: ", err.message);
    }
}
export { createPost , getPost , deletePost , likeUnlikePost , replyToPost , getFeedPost , getUserPost};  