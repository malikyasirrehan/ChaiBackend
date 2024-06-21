import { asycHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../util/ApiError.js"
import { User } from "../models/user.model.js"
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiRespose } from "../utils/apiRespose.js";


const registerUser = asycHandler(async (req, res) => {

    // 1 get user details from frontend
    // 2 validation  => not empty
    // 3 check if user already exists 

    // 4 check for images, check for avatar
    // 5 upload them to cloudinary , avatar
    // 6 create user object   => create entry in db
    // 7 remove password and refresh token field from respose
    // 8 check for user creation
    // 9 return respose
    // ______________________________________________________________


    // 1 get user details from frontend

    const { fullName, email, username, password } = req.body
    console.log("email", email);


    // 2 validation  => not empty

    // if(fullName==""){
    //     throw new ApiError(400,"fullname is required")

    // }     SECOND METHOD

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")

    }


    // 3 check if user already exists 

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    // 4 check for images, check for avatar


    const avatarLocalPath = req.files?.avatar[0].path
    const converImageLocalpath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(converImageLocalpath)


    //    5 upload them to cloudinary , avatar
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")

    }


    // 6 create user object   => create entry in db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

      // 8 check for user creation

    const createdUser = await User.findById(user._id,).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiRespose (200, createdUser ,"User registered successfully")
    )




})



export { registerUser }
