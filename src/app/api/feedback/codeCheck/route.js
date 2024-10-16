
// pages/api/feedback/codeCheck.js

import { handleFeedbackRequest } from '../utils';
import { getCodeCheckFeedback } from "@/app/lib/openai"

export const maxDuration = 60

export async function POST(req, res) {
  return await handleFeedbackRequest(req, res, getCodeCheckFeedback);
}
