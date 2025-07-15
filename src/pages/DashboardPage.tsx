import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DailyReport, WeeklyPlan, User, Role } from '../types';
import DailyReportTable from '../components/reports/DailyReportTable';
import WeeklyPlanTable from '../components/reports/WeeklyPlanTable';
import { generateReportSummary } from '../services/geminiService';

const Tabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs = ['Daily Activity', 'Weekly Plan'];
    return (
        <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                            activeTab === tab
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

const AiSummary: React.FC<{ summary: string; isLoading: boolean }> = ({ summary, isLoading }) => (
    <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-sky-500"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            AI-Powered Summary
        </h3>
        {isLoading ? (
            <div className="mt-2 text-slate-600 animate-pulse">Generating summary...</div>
        ) : (
            <div className="mt-2 text-slate-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />').replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>') }} />
        )}
    </div>
);

const DashboardPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('Daily Activity');
    
    const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
    const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
    const [viewableUsers, setViewableUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>(auth?.currentUser?.id || '');
    
    const [aiSummary, setAiSummary] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    const token = sessionStorage.getItem('token');

    const fetchViewableUsers = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch('/api/users/viewable', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const users = await response.json();
                setViewableUsers(users);
            }
        } catch (error) {
            console.error("Failed to fetch viewable users:", error);
        }
    }, [token]);

    const fetchReports = useCallback(async () => {
        if (!selectedUserId || !token) return;
        setDataLoading(true);
        try {
            const [dailyRes, weeklyRes] = await Promise.all([
                fetch(`/api/reports/daily/${selectedUserId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`/api/reports/weekly/${selectedUserId}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (dailyRes.ok) setDailyReports(await dailyRes.json());
            if (weeklyRes.ok) setWeeklyPlans(await weeklyRes.json());
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setDataLoading(false);
        }
    }, [selectedUserId, token]);

    useEffect(() => {
        fetchViewableUsers();
    }, [fetchViewableUsers]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);


    const handleAddDailyReport = async (report: Omit<DailyReport, 'id' | 'userId'>) => {
        try {
            const response = await fetch('/api/reports/daily', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...report, userId: auth?.currentUser?.id })
            });
            if (response.ok) fetchReports(); // Re-fetch data
        } catch (error) {
            console.error("Failed to add daily report:", error);
        }
    };

    const handleAddWeeklyPlan = async (plan: Omit<WeeklyPlan, 'id' | 'userId'>) => {
        try {
            const response = await fetch('/api/reports/weekly', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...plan, userId: auth?.currentUser?.id })
            });
            if (response.ok) fetchReports();
        } catch (error) {
            console.error("Failed to add weekly plan:", error);
        }
    };

    const handleUpdateReport = useCallback(async (reportType: 'daily' | 'weekly', reportId: string, updates: Partial<DailyReport | WeeklyPlan>) => {
        try {
            const response = await fetch(`/api/reports/${reportType}/${reportId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updates)
            });
            if (response.ok) fetchReports();
        } catch (error) {
            console.error(`Failed to update ${reportType} report:`, error);
        }
    }, [token, fetchReports]);


    const generateSummary = useCallback(async () => {
        const user = viewableUsers.find(u => u.id === selectedUserId);
        if (!user) return;

        setIsSummaryLoading(true);
        setAiSummary('');

        const reportsToSummarize = activeTab === 'Daily Activity' ? dailyReports : weeklyPlans;
        const reportType = activeTab === 'Daily Activity' ? 'daily' : 'weekly';

        if(reportsToSummarize.length === 0){
             setAiSummary("No reports found for this user in the selected category.");
             setIsSummaryLoading(false);
             return;
        }

        const summary = await generateReportSummary(reportsToSummarize, reportType, user.name);
        setAiSummary(summary);
        setIsSummaryLoading(false);
    }, [selectedUserId, activeTab, dailyReports, weeklyPlans, viewableUsers]);

    const canViewOthers = viewableUsers.length > 1;
    const selectedUser = viewableUsers.find(u => u.id === selectedUserId);
    const isManager = auth?.currentUser?.role === Role.ADMIN;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                     <h1 className="text-xl font-semibold text-slate-800">
                        {activeTab === 'Daily Activity' ? 'Daily Activity and Call Report' : 'Week Plan Format'}
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Sales Person: <span className="font-medium">{selectedUser?.name || '...'}</span>
                    </p>
                </div>
                 {canViewOthers && (
                    <div className="flex-shrink-0">
                        <label htmlFor="user-select" className="block text-sm font-medium text-slate-700 mb-1">View Reports For</label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                        >
                            {viewableUsers.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-4">
                {dataLoading ? <div className="text-center p-8">Loading reports...</div> : (
                    <>
                        {activeTab === 'Daily Activity' && (
                            <DailyReportTable 
                                reports={dailyReports}
                                onAddReport={handleAddDailyReport}
                                canAdd={selectedUserId === auth?.currentUser?.id}
                                onUpdateReport={(reportId, updates) => handleUpdateReport('daily', reportId, updates)}
                                isManager={isManager}
                            />
                        )}
                        {activeTab === 'Weekly Plan' && (
                            <WeeklyPlanTable
                                plans={weeklyPlans}
                                onAddPlan={handleAddWeeklyPlan}
                                canAdd={selectedUserId === auth?.currentUser?.id}
                                onUpdatePlan={(planId, updates) => handleUpdateReport('weekly', planId, updates)}
                                isManager={isManager}
                            />
                        )}
                    </>
                )}
            </div>

            <div className="mt-6 pt-6 border-t">
                <button
                    onClick={generateSummary}
                    disabled={isSummaryLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 mr-2 ${isSummaryLoading ? 'animate-spin' : ''}`}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    {isSummaryLoading ? 'Generating...' : `Generate ${selectedUser?.name}'s Summary`}
                </button>
                {(aiSummary || isSummaryLoading) && <AiSummary summary={aiSummary} isLoading={isSummaryLoading} />}
            </div>
        </div>
    );
};

export default DashboardPage;
