import { NextResponse } from 'next/server';
import { connectDB } from "@/dbConfig/dbConfig";

connectDB()
export async function GET() {
    try {
        const res = NextResponse.json({
            message: "Logout successful",
            success: true
        })
        res.cookies.set(
            'authToken', "",
            {
                httpOnly: true,
                expires: new Date(0)
            }
        );
        return res;
    } catch (error: any) {
        return NextResponse.json({ message: "Error logging out", error: error.message || 'Unknown Error' }, { status: 500 });
    }
}