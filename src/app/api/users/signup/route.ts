import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB()

export async function POST(request: NextRequest) {
    // const {username, email, password} = await request.json()
    // const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody

        console.log("User created successfully", reqBody)

        //check if user is created successfully
        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        console.log("User created: ", savedUser)

        // send verification email
        try {
            await sendEmail({
                email,
                emailtype: 'verify',
                userId: savedUser._id
            });
        } catch (emailError: any) {
            console.error("Email sending failed:", emailError.message);
            return NextResponse.json({ message: "User created, but email failed", error: emailError.message }, { status: 500 });
        }
        

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ message: "Error creating user", error: error.message || 'Unknown Error'}, { status: 500 })
    }
}