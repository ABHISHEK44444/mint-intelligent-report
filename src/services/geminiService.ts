import { DailyReport, WeeklyPlan } from "../types";

export const generateReportSummary = async (
  reports: (DailyReport | WeeklyPlan)[],
  reportType: 'daily' | 'weekly',
  userName: string
): Promise<string> => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return "Authentication error. Please log in again.";
  }

  try {
    const response = await fetch('/api/gemini/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reports, reportType, userName }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error generating summary:", data.message);
      return `An error occurred while generating the AI summary: ${data.message}`;
    }

    return data.summary;
  } catch (error) {
    console.error("Error calling backend for summary:", error);
    return "An error occurred while communicating with the server. Please check the console for details.";
  }
};
