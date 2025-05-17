import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User with this email does not exist" }, { status: 400 });
        }

        await sendEmail({ email, emailtype: "reset", userId: user._id });

        return NextResponse.json({ message: "Reset email sent successfully", success: true });
    } catch (error: unknown) {
        console.error("Forget Password Error:", error);
        return NextResponse.json({ error: (error as Error).message || "Something went wrong" }, { status: 500 });
    }
}
