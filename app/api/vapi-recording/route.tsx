export const runtime = "nodejs";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route to fetch Vapi call recording
 * 
 * This endpoint retrieves the recording URL for a given session ID
 * by first fetching the Vapi call ID from the database, then calling Vapi API
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('callId'); // Using 'callId' param for backward compatibility

    if (!sessionId) {
        return NextResponse.json(
            { error: 'Session ID is required' },
            { status: 400 }
        );
    }

    console.log("serverside", process.env.VAPI_PRIVATE_API_KEY, process.env.NEXT_PUBLIC_VAPI_API_KEY);

    try {
        // First, fetch the Vapi call ID from the database
        const sessionData = await db.select().from(SessionChatTable)
            //@ts-ignore
            .where(eq(SessionChatTable.sessionId, sessionId))
            .limit(1);

        if (!sessionData || sessionData.length === 0) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        const vapiCallId = sessionData[0].vapiCallId;

        if (!vapiCallId) {
            return NextResponse.json(
                { error: 'No Vapi call ID found for this session. The call may not have been recorded.' },
                { status: 404 }
            );
        }

        // Fetch call details from Vapi API
        const response = await fetch(`https://api.vapi.ai/call/${vapiCallId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.VAPI_PRIVATE_API_KEY || process.env.NEXT_PUBLIC_VAPI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Vapi API error: ${response.statusText}`);
        }

        const callData = await response.json();

        // Extract recording URL from the call data
        // The recording URL might be in different places depending on Vapi's response structure
        const recordingUrl = callData.artifact?.recordingUrl ||
            callData.recordingUrl ||
            callData.artifact?.recording?.url ||
            callData.artifact?.stereoRecordingUrl ||
            null;

        if (!recordingUrl) {
            return NextResponse.json(
                { error: 'No recording found for this call. Recording may still be processing.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            recordingUrl,
            vapiCallId,
            callData: callData // Return full call data for debugging
        });

    } catch (error: any) {
        console.error('Error fetching Vapi recording:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch recording' },
            { status: 500 }
        );
    }
}
