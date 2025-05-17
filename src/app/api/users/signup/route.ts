import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

// Ensure DB is connected
connectDB();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    console.log("User registration attempt:", { username, email });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log("User created:", savedUser);

    // Send verification email
    try {
      await sendEmail({
        email,
        emailtype: "verify",
        userId: savedUser._id,
      });
    } catch (emailError: unknown) {
      console.error("Email sending failed:", emailError instanceof Error ? emailError.message : emailError);

      return NextResponse.json(
        {
          message: "User created, but email failed",
          error: emailError instanceof Error ? emailError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: savedUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating user:", errorMessage);
    return NextResponse.json(
      { message: "Error creating user", error: errorMessage },
      { status: 500 }
    );
  }
}
