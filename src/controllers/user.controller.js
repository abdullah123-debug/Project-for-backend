import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("Controller started");
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);

  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    console.log("Missing fields:", fullname, email, username, password);
    throw new ApiErrors(400, "All fields are required");
  }

  console.log("Checking if user exists...");
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    console.log("User already exists:", username, email);
    throw new ApiErrors(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    console.log("Avatar file missing");
    throw new ApiErrors(400, "Avatar file is required");
  }

  console.log("Uploading avatar...");
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    console.log("Avatar upload failed");
    throw new ApiErrors(400, "Avatar upload failed");
  }
  console.log("Avatar uploaded:", avatar.url);

  let coverImage = "";
  if (coverImageLocalPath) {
    console.log("Uploading cover image...");
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Cover image uploaded:", coverImage.url);
  }

  console.log("Creating user in DB...");
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  console.log("Fetching created user without sensitive fields...");
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    console.log("User creation failed");
    throw new ApiErrors(500, "Something went wrong while registering the user");
  }

  console.log("User registered successfully:", createdUser._id);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully!"));
});

export { registerUser };
