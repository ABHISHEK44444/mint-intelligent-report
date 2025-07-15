
import { GoogleGenAI } from "@google/genai";
import { DailyReport, WeeklyPlan } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to disable the feature or show a warning.
  // For this project, we'll log an error and allow the app to run without Gemini functionality.
  console.error("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const formatReportsForPrompt = (reports: (DailyReport | WeeklyPlan)[], reportType: 'daily' | 'weekly'): string => {
  if (reports.length === 0) {
    return "No reports filed.";
  }
  
  if(reportType === 'daily') {
      return (reports as DailyReport[]).map(r => 
        `- Date: ${r.date} (${r.day})\n  Account: ${r.accountName}\n  Work Done: ${r.workDone}\n  Outcome: ${r.outcome}\n  Support Needed: ${r.supportRequired || 'None'}`
      ).join('\n\n');
  } else {
       return (reports as WeeklyPlan[]).map(r => 
        `- Date: ${r.date} (${r.day})\n  Customer: ${r.customerName}\n  Requirement: ${r.requirement}\n  Proposed Action: ${r.proposedAction}\n  Support Needed: ${r.supportRequired || 'None'}`
      ).join('\n\n');
  }
};

export const generateReportSummary = async (
  reports: (DailyReport | WeeklyPlan)[],
  reportType: 'daily' | 'weekly',
  userName: string
): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("AI functionality is disabled because the API key is not configured.");
  }
  
  const formattedReports = formatReportsForPrompt(reports, reportType);

  const prompt = `
    You are an expert sales manager analyzing employee performance.
    Based on the following ${reportType} reports for the employee "${userName}", provide a concise summary.
    
    Your summary should include:
    1.  **Key Activities:** A brief overview of the main tasks accomplished.
    2.  **Potential Blockers/Risks:** Identify any challenges or dependencies mentioned (like needing support).
    3.  **Suggested Next Steps:** Propose 1-2 actionable recommendations for the employee.
    
    Format your output clearly using markdown.

    **Reports Data:**
    ${formattedReports}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return "An error occurred while generating the AI summary. Please check the console for details.";
  }
};
