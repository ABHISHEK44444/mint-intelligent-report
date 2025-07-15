import React, { useState } from 'react';
import { WeeklyPlan } from '../../types';

interface WeeklyPlanTableProps {
    plans: WeeklyPlan[];
    onAddPlan: (plan: Omit<WeeklyPlan, 'id'|'userId'>) => void;
    canAdd: boolean;
    onUpdatePlan: (planId: string, updates: Partial<WeeklyPlan>) => void;
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

const WeeklyPlanTable: React.FC<WeeklyPlanTableProps> = ({ plans, onAddPlan, canAdd, onUpdatePlan, isManager }) => {
     const getInitialState = () => ({
        date: new Date().toISOString().split('T')[0], day: new Date().toLocaleString('en-us', { weekday: 'long' }),
        customerName: '', contactPerson: '', requirement: '', proposedAction: '', planningRequired: '', supportRequired: ''
    });
    
    const [newPlan, setNewPlan] = useState(getInitialState());

    const [editingRemarksId, setEditingRemarksId] = useState<string | null>(null);
    const [remarksInput, setRemarksInput] = useState('');

    const handleEditRemarks = (plan: WeeklyPlan) => {
        setEditingRemarksId(plan.id);
        setRemarksInput(plan.remarks || '');
    };

    const handleSaveRemarks = (planId: string) => {
        onUpdatePlan(planId, { remarks: remarksInput });
        setEditingRemarksId(null);
        setRemarksInput('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof typeof newPlan) => {
        let value = e.target.value;
        if (field === 'date') {
            const date = new Date(value);
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() + timezoneOffset);
            const dayOfWeek = adjustedDate.toLocaleString('en-us', { weekday: 'long' });
            setNewPlan({ ...newPlan, date: value, day: dayOfWeek });
        } else {
            setNewPlan({ ...newPlan, [field]: value });
        }
    };


    const handleAddClick = () => {
        if (!newPlan.customerName || !newPlan.requirement) {
            alert('Please fill in at least Customer Name and Requirement.');
            return;
        }
        onAddPlan(newPlan);
        setNewPlan(getInitialState());
    };
    
    const headers = ['S.No.', 'Date', 'Day', 'Customer name', 'Contact person\'s', 'Requirement', 'Proposed action', 'Planning required before meeting', 'Support required', 'Manager Remarks'];

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
                    {plans.map((plan, index) => (
                        <tr key={plan.id} className="hover:bg-slate-50">
                            <td className="p-2 border border-slate-300 whitespace-nowrap text-sm text-center text-slate-500">{index + 1}</td>
                            <td className="p-2 border border-slate-300 whitespace-nowrap text-sm text-slate-500">{new Date(plan.date).toLocaleDateString()}</td>
                            <td className="p-2 border border-slate-300 whitespace-nowrap text-sm text-slate-500">{plan.day}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{plan.customerName}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{plan.contactPerson}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{plan.requirement}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{plan.proposedAction}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{plan.planningRequired}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900">{plan.supportRequired}</td>
                            <td className="p-2 border border-slate-300 text-sm text-slate-900 min-w-[250px]">
                                 {isManager && editingRemarksId === plan.id ? (
                                    <div className="flex items-center space-x-2">
                                        <input type="text" value={remarksInput} onChange={(e) => setRemarksInput(e.target.value)} className="w-full border border-slate-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"/>
                                        <button onClick={() => handleSaveRemarks(plan.id)} className="text-sky-600 hover:text-sky-800 font-semibold text-xs">Save</button>
                                        <button onClick={() => setEditingRemarksId(null)} className="text-slate-500 hover:text-slate-700 text-xs">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group">
                                        <span>{plan.remarks || <span className="text-slate-400 italic">No remarks</span>}</span>
                                        {isManager && <button onClick={() => handleEditRemarks(plan)} className="ml-4 text-sky-600 hover:text-sky-800 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>}
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
                                <input type="date" value={newPlan.date} onChange={e => handleInputChange(e, 'date')} className="w-full bg-transparent p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white rounded-[3px]" />
                            </td>
                            <td className="p-0 border border-slate-300"><TableInput value={newPlan.day} onChange={e => handleInputChange(e, 'day')} placeholder="Day" /></td>
                            <td className="p-0 border border-slate-300"><TableInput value={newPlan.customerName} onChange={e => handleInputChange(e, 'customerName')} placeholder="Customer Name" /></td>
                            <td className="p-0 border border-slate-300"><TableInput value={newPlan.contactPerson} onChange={e => handleInputChange(e, 'contactPerson')} placeholder="Contact Person" /></td>
                            <td className="p-0 border border-slate-300"><TableInput value={newPlan.requirement} onChange={e => handleInputChange(e, 'requirement')} placeholder="Requirement" /></td>
                            <td className="p-0 border border-slate-300"><TableInput value={newPlan.proposedAction} onChange={e => handleInputChange(e, 'proposedAction')} placeholder="Proposed Action" /></td>
                            <td className="p-0 border border-slate-300"><TableInput value={newPlan.planningRequired} onChange={e => handleInputChange(e, 'planningRequired')} placeholder="Planning" /></td>
                            <td className="p-0 border border-slate-300"><TableInput value={newPlan.supportRequired} onChange={e => handleInputChange(e, 'supportRequired')} placeholder="Support" /></td>
                            <td className="p-2 border border-slate-300 bg-slate-100"></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default WeeklyPlanTable;
