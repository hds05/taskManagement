import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import crypto from "crypto";

connectDB()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody
        console.log(token)

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log("Hashed token:", hashedToken);

        const user = await User.findOne({ verifyToken: hashedToken, verifyTokenExpiry: { $gt: Date.now() } })
        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
        }
        console.log(user);

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined
        await user.save()
        return NextResponse.json({ message: 'Email verified successfully', success: true })

    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
        
    }
}
