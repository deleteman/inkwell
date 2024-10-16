
// pages/api/feedback/text.js

import { handleFeedbackRequest } from '../utils';
import { getTextFeedback } from "@/app/lib/openai"

export async function POST(req, res) {
  return await handleFeedbackRequest(req, res, getTextFeedback);
}
