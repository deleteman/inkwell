
// pages/api/feedback/title.js

import { handleFeedbackRequest } from '../utils';
import { getTitleFeedback } from "@/app/lib/openai"

export const maxDuration = 60

export async function POST(req, res) {
  return await handleFeedbackRequest(req, res, getTitleFeedback);
}
