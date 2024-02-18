import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
 try {
      const { content } = req.body
      if (!content || typeof content !== 'string') throw new ApiError('Invalid Tweet Content', 400)
      const tweet = await Tweet.create({
       content ,
       owner : req.user._id
       }) 
   
       if (!tweet) {
           throw new ApiError(401,"Server Error",)
       }

       res
       .status(200)
       .json(
        new ApiResponse(
            200,
            tweet,
            "tweet created successfully"
            )
       )
 } catch (error) {
    throw new ApiError(401,"Internal server  error")
 }
})

const getUserTweets = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId
        const user  = await User.findById(userId)
        const  tweets=await Tweet.find({owner:userId}).sort("-createdAt").populate({
             path:"owner",
        })
        if (!tweets) {
            throw new ApiError("No Tweets Found","Not found")   
        }
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                "tweets  fetched Successfully"
            )
        )
    } catch (error) {
        throw new ApiError(500,'server error')
    }
}
)

const updateTweet = asyncHandler(async (req, res) => {
   try {
    const tweetId = req.params.tweetId
    const {content} = req.body

    const tweet = await Tweet.findByIdAndUpdate(tweetId ,{
        content : content
    })

    res
    .status(200)
    .json(
        new  ApiResponse(
            200,
            tweet,
            'Updated successfully'
        )
    )

   } catch (error) {
    throw new ApiError(500,  'Server Error')
   }
})

const deleteTweet = asyncHandler(async (req, res) => {
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
