import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable, usersTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const SESSION_REPORT_PROMPT = `
You are an expert AI Language Evaluator that has just completed a voice-based language learning session with a student.

The goal of the conversation was to TEACH and ASSESS the user's spoken skills, vocabulary, and pronunciation in the target European language (e.g., German, French, Spanish, etc.), with instructions provided in their primary language (Hindi or English).

Based on:
1) AI Language Tutor info (target language, specialist)
2) The full voice conversation between the AI language tutor and the student

Generate a structured LANGUAGE LEARNING REPORT with the following fields:

1. agent:
   Name of the AI Language Tutor (e.g. "German Tutor (Deutsch)")

2. user:
   Name of the student or "Anonymous"

3. timestamp:
   Current date and time in ISO format

4. trainingTopic:
   The specific language and topic practiced (e.g. "German - Basic Greetings & Numbers")

5. learningGoal:
   The goal of the session (e.g. "Conversational fluency in German with Hindi explanations")

6. sessionSummary:
   2–3 sentence summary of how the language practice went, what words/phrases were practiced, and student's verbal responsiveness

7. questionsAsked:
   List of key practice phrases, questions, or translation exercises asked by the tutor

8. userResponses:
   Brief summary of the student's spoken responses and comprehension

9. correctConcepts:
   List of words, phrases, or grammar concepts the student pronounced or used correctly

10. incorrectOrMissingConcepts:
    List of words or grammar rules the student struggled with or mispronounced

11. trainerFeedback:
    Specific pronunciation and vocabulary tips to help the student improve for the next session

12. learningScore:
    A numerical score from 1 to 100 representing the student's language fluency and active participation

Return the result strictly in valid JSON format:
{
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "learningGoal": "string",
  "trainingTopic": "string",
  "sessionSummary": "string",
  "questionsAsked": ["phrase1", "phrase2"],
  "userResponses": "string",
  "correctConcepts": ["word1", "word2"],
  "incorrectOrMissingConcepts": ["word1", "word2"],
  "trainerFeedback": "string",
  "overallAssessment": "string",
  "learningScore": number
}

Rules:
- Focus specifically on language learning, pronunciation, and vocabulary.
- Respond with ONLY valid JSON. No Markdown ticks, no extra text.
`;

export async function POST(req: NextRequest) {
   const { sessionId, sessionDetail, messages, studentName } = await req.json();

   try {
      const UserInput = `
AI Teacher Agent Info: ${JSON.stringify(sessionDetail?.selectedTeacher)}
Student Name: ${studentName || "Anonymous"}
Conversation: ${JSON.stringify(messages)}
      `.trim();

      const completion = await openai.chat.completions.create({
         model: "google/gemini-2.0-flash-001",
         messages: [
            { role: 'system', content: SESSION_REPORT_PROMPT },
            { role: "user", content: UserInput }
         ],
      });

      const rawResp = completion.choices[0].message;

      //@ts-ignore
      const Resp = rawResp.content.trim().replace('```json', '').replace('```', '')
      const JSONResp = JSON.parse(Resp);

      // Ensure user and agent fields are populated if AI missed them
      if (!JSONResp.user || JSONResp.user === "Anonymous") JSONResp.user = studentName || "Anonymous";
      if (!JSONResp.agent) JSONResp.agent = sessionDetail?.selectedTeacher?.specialist || "AI Teacher";
      if (!JSONResp.trainingTopic) JSONResp.trainingTopic = sessionDetail?.selectedTeacher?.specialist || "General Learning";

      // Save to Database (Session Report)
      await db.update(SessionChatTable).set({
         report: JSONResp,
         conversation: messages
      }).where(eq(SessionChatTable.sessionId, sessionId));

      // Update User Total Score
      if (JSONResp?.learningScore) {
         // First get the user email from the session
         const session = await db.select({
            createdBy: SessionChatTable.createdBy
         })
         .from(SessionChatTable)
         .where(eq(SessionChatTable.sessionId, sessionId))
         .limit(1);

         if (session && session[0]?.createdBy) {
            await db.update(usersTable)
               .set({
                  score: sql`${usersTable.score} + ${JSONResp.learningScore}`
               })
               .where(eq(usersTable.email, session[0].createdBy));
         }
      }

      return NextResponse.json(JSONResp)
   } catch (e) {
      console.error("Error in POST /api/training-report:", e);
      return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
   }
}
