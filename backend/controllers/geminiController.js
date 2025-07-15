import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatReportsForPrompt = (reports, reportType) => {
  if (reports.length === 0) {
    return "No reports filed.";
  }
  
  if (reportType === 'daily') {
      return (reports).map(r => 
        `- Date: ${new Date(r.date).toLocaleDateString()}\n  Account: ${r.accountName}\n  Work Done: ${r.workDone}\n  Outcome: ${r.outcome}\n  Support Needed: ${r.supportRequired || 'None'}`
      ).join('\n\n');
  } else {
       return (reports).map(r => 
        `- Date: ${new Date(r.date).toLocaleDateString()}\n  Customer: ${r.customerName}\n  Requirement: ${r.requirement}\n  Proposed Action: ${r.proposedAction}\n  Support Needed: ${r.supportRequired || 'None'}`
      ).join('\n\n');
  }
};

export const generateSummary = async (req, res) => {
    if (!API_KEY) {
        return res.status(503).json({ message: "AI functionality is disabled because the API key is not configured." });
    }

    const { reports, reportType, userName } = req.body;

    const formattedReports = formatReportsForPrompt(reports, reportType);

    const prompt = `
      You are an expert sales manager analyzing employee performance.
      Based on the following ${reportType} reports for the employee "${userName}", provide a concise summary.
      
      Your summary should include:
      1.  **Key Activities:** A brief overview of the main tasks accomplished.
      2.  **Potential Blockers/Risks:** Identify any challenges or dependencies mentioned (like needing support).
      3.  **Suggested Next Steps:** Propose 1-2 actionable recommendations for the employee.
      
      Format your output clearly using markdown. Use bolding with asterisks (e.g., **Key Activities:**).

      **Reports Data:**
      ${formattedReports}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ summary: response.text });
    } catch (error) {
        console.error("Error generating summary with Gemini:", error);
        res.status(500).json({ message: "An error occurred while generating the AI summary." });
    }
};
