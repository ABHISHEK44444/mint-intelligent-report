
import React, { useState, useMemo, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { mockUsers, mockDailyReports, mockWeeklyPlans, mockPermissions } from '../services/mockData';
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
            <div className="mt-2 text-slate-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
        )}
    </div>
);

const DashboardPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('Daily Activity');
    
    const [dailyReports, setDailyReports] = useState<DailyReport[]>(mockDailyReports);
    const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>(mockWeeklyPlans);

    const [selectedUserId, setSelectedUserId] = useState<string>(auth?.currentUser?.id || '');
    
    const [aiSummary, setAiSummary] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    const viewableUsers = useMemo(() => {
        if (!auth?.currentUser) return [];
        if (auth.currentUser.role === Role.ADMIN) return mockUsers;

        const permittedUserIds = mockPermissions
            .filter(p => p.viewerId === auth.currentUser!.id)
            .map(p => p.targetId);
        
        const uniqueIds = new Set([auth.currentUser.id, ...permittedUserIds]);
        return mockUsers.filter(u => uniqueIds.has(u.id));
    }, [auth?.currentUser]);

    const handleAddDailyReport = (report: Omit<DailyReport, 'id'>) => {
        const newReport = { ...report, id: `dr${Date.now()}` };
        setDailyReports(prev => [...prev, newReport]);
    };

    const handleAddWeeklyPlan = (plan: Omit<WeeklyPlan, 'id'>) => {
        const newPlan = { ...plan, id: `wp${Date.now()}` };
        setWeeklyPlans(prev => [...prev, newPlan]);
    };

    const handleUpdateDailyReport = useCallback((reportId: string, updates: Partial<DailyReport>) => {
        // In a real app, this would be an API call. For this mock, we update both state and the source array.
        const updatedReports = dailyReports.map(r => r.id === reportId ? { ...r, ...updates } : r);
        setDailyReports(updatedReports);

        const reportIndex = mockDailyReports.findIndex(r => r.id === reportId);
        if (reportIndex > -1) {
            mockDailyReports[reportIndex] = { ...mockDailyReports[reportIndex], ...updates } as DailyReport;
        }
    }, [dailyReports]);

    const handleUpdateWeeklyPlan = useCallback((planId: string, updates: Partial<WeeklyPlan>) => {
        const updatedPlans = weeklyPlans.map(p => p.id === planId ? { ...p, ...updates } : p);
        setWeeklyPlans(updatedPlans);
        
        const planIndex = mockWeeklyPlans.findIndex(p => p.id === planId);
        if (planIndex > -1) {
            mockWeeklyPlans[planIndex] = { ...mockWeeklyPlans[planIndex], ...updates } as WeeklyPlan;
        }
    }, [weeklyPlans]);


    const generateSummary = useCallback(async () => {
        const user = mockUsers.find(u => u.id === selectedUserId);
        if (!user) return;

        setIsSummaryLoading(true);
        setAiSummary('');

        const reportsToSummarize = activeTab === 'Daily Activity'
            ? dailyReports.filter(r => r.userId === selectedUserId)
            : weeklyPlans.filter(p => p.userId === selectedUserId);
        
        const reportType = activeTab === 'Daily Activity' ? 'daily' : 'weekly';

        const summary = await generateReportSummary(reportsToSummarize, reportType, user.name);
        setAiSummary(summary);
        setIsSummaryLoading(false);
    }, [selectedUserId, activeTab, dailyReports, weeklyPlans]);

    const canViewOthers = viewableUsers.length > 1;
    const selectedUser = mockUsers.find(u => u.id === selectedUserId);
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
                {activeTab === 'Daily Activity' && (
                    <DailyReportTable 
                        reports={dailyReports.filter(r => r.userId === selectedUserId)}
                        onAddReport={handleAddDailyReport}
                        canAdd={selectedUserId === auth?.currentUser?.id}
                        userId={auth?.currentUser?.id || ''}
                        onUpdateReport={handleUpdateDailyReport}
                        isManager={isManager}
                    />
                )}
                {activeTab === 'Weekly Plan' && (
                    <WeeklyPlanTable
                        plans={weeklyPlans.filter(p => p.userId === selectedUserId)}
                        onAddPlan={handleAddWeeklyPlan}
                        canAdd={selectedUserId === auth?.currentUser?.id}
                        userId={auth?.currentUser?.id || ''}
                        onUpdatePlan={handleUpdateWeeklyPlan}
                        isManager={isManager}
                    />
                )}
            </div>

            <div className="mt-6 pt-6 border-t">
                <button
                    onClick={generateSummary}
                    disabled={isSummaryLoading || !process.env.API_KEY}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 mr-2 ${isSummaryLoading ? 'animate-spin' : ''}`}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    {isSummaryLoading ? 'Generating...' : `Generate ${selectedUser?.name}'s Summary`}
                </button>
                {!process.env.API_KEY && <p className="text-xs text-red-500 mt-2">AI features are disabled. API_KEY is not configured.</p>}
                {(aiSummary || isSummaryLoading) && <AiSummary summary={aiSummary} isLoading={isSummaryLoading} />}

            </div>
        </div>
    );
};

export default DashboardPage;