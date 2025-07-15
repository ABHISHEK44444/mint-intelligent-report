
import React, { useState } from 'react';
import { DailyReport } from '../../types';

interface DailyReportTableProps {
    reports: DailyReport[];
    onAddReport: (report: Omit<DailyReport, 'id'>) => void;
    canAdd: boolean;
    userId: string;
    onUpdateReport: (reportId: string, updates: Partial<DailyReport>) => void;
    isManager: boolean;
}

const TableInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white rounded-[3px]"
    />
);

const DailyReportTable: React.FC<DailyReportTableProps> = ({ reports, onAddReport, canAdd, userId, onUpdateReport, isManager }) => {
    const [newReport, setNewReport] = useState({
        date: new Date().toISOString().split('T')[0], day: new Date().toLocaleString('en-us', { weekday: 'long' }),
        accountName: '', contactPerson: '', contactNumber: '', workDone: '', outcome: '', supportRequired: ''
    });

    const [editingRemarksId, setEditingRemarksId] = useState<string | null>(null);
    const [remarksInput, setRemarksInput] = useState('');

    const handleEditRemarks = (report: DailyReport) => {
        setEditingRemarksId(report.id);
        setRemarksInput(report.remarks || '');
    };

    const handleSaveRemarks = (reportId: string) => {
        onUpdateReport(reportId, { remarks: remarksInput });
        setEditingRemarksId(null);
        setRemarksInput('');
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof typeof newReport) => {
        let value = e.target.value;
        if (field === 'date') {
            const date = new Date(value);
            // Adjust for timezone to get correct day
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() + timezoneOffset);
            const dayOfWeek = adjustedDate.toLocaleString('en-us', { weekday: 'long' });
            setNewReport({ ...newReport, date: value, day: dayOfWeek });
        } else {
            setNewReport({ ...newReport, [field]: value });
        }
    };

    const handleAddClick = () => {
        if (!newReport.accountName || !newReport.workDone) {
            alert('Please fill in at least Account Name and Work Done.');
            return;
        }
        onAddReport({ ...newReport, userId });
        setNewReport({ 
            date: new Date().toISOString().split('T')[0], day: new Date().toLocaleString('en-us', { weekday: 'long' }),
            accountName: '', contactPerson: '', contactNumber: '', workDone: '', outcome: '', supportRequired: ''
        });
    };

    const headers = ['Sr. No.', 'Dated', 'Day', 'Account Name', 'Contact Person', 'Contact Number', 'Requirement/Work done', 'Outcome/result/remarks/Response', 'Support required', 'Manager Remarks'];

    return (
        <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="min-w-full border-collapse">
                <thead className="bg-teal-100">
                    <tr>
                        {headers.map(header => (
                            <th key={header} scope="col" className="p-2 border border-slate-300 text-left text-xs font-bold text-slate-700 uppercase">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {reports.map((report, index) => (
                        <tr key={report.id} className="hover:bg-slate-50">
                            <td className="p-2 border border-slate-300 whitespace-nowrap text-sm text-center text-slate-500">{index + 1}</td>
                            <td className="p-2 border border-slate-300 whitespace-nowrap text-sm text-slate-500">{report.date}</td>
                            <td className="p-2 border border-slate-300 whitespace-nowrap text-sm text-slate-500">{report.day}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{report.accountName}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{report.contactPerson}</td>
                            <td className="p-2 border border-slate-300 whitespace-nowrap text-sm text-slate-500">{report.contactNumber}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{report.workDone}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{report.outcome}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{report.supportRequired}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900 min-w-[250px]">
                                {isManager && editingRemarksId === report.id ? (
                                    <div className="flex items-center space-x-2">
                                        <input type="text" value={remarksInput} onChange={(e) => setRemarksInput(e.target.value)} className="w-full border border-slate-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"/>
                                        <button onClick={() => handleSaveRemarks(report.id)} className="text-sky-600 hover:text-sky-800 font-semibold text-xs">Save</button>
                                        <button onClick={() => setEditingRemarksId(null)} className="text-slate-500 hover:text-slate-700 text-xs">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group">
                                        <span>{report.remarks || <span className="text-slate-400 italic">No remarks</span>}</span>
                                        {isManager && <button onClick={() => handleEditRemarks(report)} className="ml-4 text-sky-600 hover:text-sky-800 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {canAdd && (
                        <tr className="bg-slate-50">
                             <td className="p-2 border border-slate-300 text-center">
                                <button onClick={handleAddClick} title="Add new row" className="text-sky-600 hover:text-sky-800 font-bold text-lg leading-none">+</button>
                             </td>
                             <td className="p-0 border border-slate-300">
                                <input type="date" value={newReport.date} onChange={e => handleInputChange(e, 'date')} className="w-full bg-transparent p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white rounded-[3px]" />
                             </td>
                             <td className="p-0 border border-slate-300"><TableInput value={newReport.day} onChange={e => handleInputChange(e, 'day')} placeholder="Day" /></td>
                             <td className="p-0 border border-slate-300"><TableInput value={newReport.accountName} onChange={e => handleInputChange(e, 'accountName')} placeholder="Account Name" /></td>
                             <td className="p-0 border border-slate-300"><TableInput value={newReport.contactPerson} onChange={e => handleInputChange(e, 'contactPerson')} placeholder="Contact Person" /></td>
                             <td className="p-0 border border-slate-300"><TableInput value={newReport.contactNumber} onChange={e => handleInputChange(e, 'contactNumber')} placeholder="Contact Number" /></td>
                             <td className="p-0 border border-slate-300"><TableInput value={newReport.workDone} onChange={e => handleInputChange(e, 'workDone')} placeholder="Work Done" /></td>
                             <td className="p-0 border border-slate-300"><TableInput value={newReport.outcome} onChange={e => handleInputChange(e, 'outcome')} placeholder="Outcome" /></td>
                             <td className="p-0 border border-slate-300"><TableInput value={newReport.supportRequired} onChange={e => handleInputChange(e, 'supportRequired')} placeholder="Support Required" /></td>
                             <td className="p-2 border border-slate-300 bg-slate-100"></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DailyReportTable;