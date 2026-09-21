export const runtime = "nodejs";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route to save recording URL for a session
 * 
 * This endpoint stores the recording URL from Vapi end-of-call-report
 */
export async function POST(req: NextRequest) {
    const { sessionId, recordingUrl } = await req.json();

    if (!sessionId || !recordingUrl) {
        return NextResponse.json(
            { error: 'sessionId and recordingUrl are required' },
            { status: 400 }
        );
    }

    try {
        const result = await db.update(SessionChatTable)
            .set({ recordingUrl: recordingUrl })
            //@ts-ignore
            .where(eq(SessionChatTable.sessionId, sessionId))
            .returning();

        return NextResponse.json({
            success: true,
            message: 'Recording URL saved successfully',
            data: result[0]
        });

    } catch (error: any) {
        console.error('Error saving recording URL:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save recording URL' },
            { status: 500 }
        );
    }
}
