export const runtime = "nodejs";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route to update Vapi call ID for a session
 * 
 * This endpoint stores the Vapi call ID associated with a session
 * so we can retrieve the recording later
 */
export async function POST(req: NextRequest) {
    const { sessionId, vapiCallId } = await req.json();

    if (!sessionId || !vapiCallId) {
        return NextResponse.json(
            { error: 'sessionId and vapiCallId are required' },
            { status: 400 }
        );
    }

    try {
        const result = await db.update(SessionChatTable)
            .set({ vapiCallId: vapiCallId })
            //@ts-ignore
            .where(eq(SessionChatTable.sessionId, sessionId))
            .returning();

        return NextResponse.json({
            success: true,
            message: 'Vapi call ID saved successfully',
            data: result[0]
        });

    } catch (error: any) {
        console.error('Error saving Vapi call ID:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save Vapi call ID' },
            { status: 500 }
        );
    }
}
