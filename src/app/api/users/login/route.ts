import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody
        // const { email, password } = await request.json();
        console.log("Login request body:", reqBody);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // return NextResponse.json({ message: "Login successful", user }, { status: 200 });

        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
            // Add any other user data you want to include in the token
        };

        // create token 
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1d' });
        console.log("Token created:", token);

        const response = NextResponse.json({
            message: "Login successful",
            success: true
        })
        response.cookies.set("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict"
        });
        return response;

    } catch (error: any) {
        return NextResponse.json({ message: "Error logging in", error: error.message || 'Unknown Error' }, { status: 500 });
    }
}