import { extractDataFromToken } from "@/helpers/dataOfToken";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connectDB();


export async function GET(request: NextRequest) {
    try {
        const userID = await extractDataFromToken(request);

        if (!userID) {
            return NextResponse.json({ message: "User ID not found" }, { status: 400 });
        }

        const user = await User.findById(userID, { password: 0 });
        console.log("Cookies:", request.cookies);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User Found !!", user }, { status: 200 });
    } catch (error: unknown) {
        console.error("Profile error:", error);
        return NextResponse.json({ message: "Error fetching user data", error: (error as Error).message || 'Unknown Error' }, { status: 500 });
    }

}
