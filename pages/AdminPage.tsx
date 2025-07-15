
import React, { useState, useContext } from 'react';
import { User, Permission, Role } from '../types';
import { mockUsers, mockPermissions } from '../services/mockData';
import { AuthContext } from '../contexts/AuthContext';


const UserList: React.FC<{ users: User[] }> = ({ users }) => {
    const auth = useContext(AuthContext);
    const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
    
    const handleResetPassword = (user: User) => {
        setResettingPasswordId(user.id);
    };

    const handleSavePassword = (user: User) => {
        if (passwordInput && passwordInput.length >= 4) {
             if (auth?.resetPassword(user.username, passwordInput)) {
                showNotification('success', `Password for ${user.name} has been reset.`);
                setResettingPasswordId(null);
                setPasswordInput('');
             } else {
                 showNotification('error', 'Failed to reset password.');
             }
        } else {
            showNotification('error', 'Password must be at least 4 characters.');
        }
    };
    
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

  return (
    <div className="overflow-x-auto">
        {notification && (
            <div className={`mb-4 p-3 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {notification.message}
            </div>
        )}
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{user.username}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role}
                  </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                {user.role !== Role.ADMIN && (
                    resettingPasswordId === user.id ? (
                         <div className="flex items-center space-x-2">
                            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="New Password" className="w-full border border-slate-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"/>
                            <button onClick={() => handleSavePassword(user)} className="text-sky-600 hover:text-sky-800 font-semibold">Save</button>
                            <button onClick={() => setResettingPasswordId(null)} className="text-slate-500 hover:text-slate-700">Cancel</button>
                        </div>
                    ) : (
                        <button onClick={() => handleResetPassword(user)} className="text-red-600 hover:text-red-800 font-semibold">Reset Password</button>
                    )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PermissionManager: React.FC<{
  permissions: Permission[];
  users: User[];
  onAddPermission: (viewerId: string, targetId: string) => void;
  onRemovePermission: (viewerId: string, targetId: string) => void;
}> = ({ permissions, users, onAddPermission, onRemovePermission }) => {
  const [viewerId, setViewerId] = useState('');
  const [targetId, setTargetId] = useState('');

  const handleAdd = () => {
    if (viewerId && targetId && viewerId !== targetId) {
      onAddPermission(viewerId, targetId);
      setViewerId('');
      setTargetId('');
    }
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown User';

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-slate-900">Current Permissions</h3>
      <div className="mt-4 border rounded-lg overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {permissions.length > 0 ? permissions.map((p, index) => (
            <li key={index} className="px-6 py-4 flex items-center justify-between">
                <div>
                    <span className="font-semibold text-sky-700">{getUserName(p.viewerId)}</span>
                    <span className="text-slate-500 mx-2">can view reports of</span>
                    <span className="font-semibold text-green-700">{getUserName(p.targetId)}</span>
                </div>
              <button onClick={() => onRemovePermission(p.viewerId, p.targetId)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
            </li>
          )) : <li className="px-6 py-4 text-slate-500">No special permissions assigned.</li>}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label htmlFor="viewer" className="block text-sm font-medium text-slate-700">Viewer</label>
          <select id="viewer" value={viewerId} onChange={e => setViewerId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="target" className="block text-sm font-medium text-slate-700">Can View Reports Of</label>
          <select id="target" value={targetId} onChange={e => setTargetId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 flex items-end">
          <button onClick={handleAdd} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
            Add Permission
          </button>
        </div>
      </div>
    </div>
  );
};


const AddUserForm: React.FC<{
  onAddUser: (user: Omit<User, 'id'>) => void;
  existingUsers: User[];
}> = ({ onAddUser, existingUsers }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.USER);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !username || !password) {
      setError('All fields are required.');
      return;
    }

    if (existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError('Username already exists.');
      return;
    }

    onAddUser({ name, username, password, role });
    setName('');
    setUsername('');
    setPassword('');
    setRole(Role.USER);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
          <input type="text" id="fullName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="username-add" className="block text-sm font-medium text-slate-700">Username</label>
          <input type="text" id="username-add" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="password-add" className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" id="password-add" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
          <select id="role" value={role} onChange={e => setRole(e.target.value as Role)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
            <option value={Role.USER}>User</option>
            <option value={Role.ADMIN}>Admin</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
          Add User
        </button>
      </div>
    </form>
  );
};


export const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);

    const addUser = (newUser: Omit<User, 'id'>) => {
        const userWithId = { ...newUser, id: `user-${Date.now()}` };
        
        // In a real app, this would be a single API call.
        // For this mock setup, we update the imported array directly.
        mockUsers.push(userWithId);
        setUsers([...mockUsers]);
    };
    
    const addPermission = (viewerId: string, targetId: string) => {
        if (!permissions.some(p => p.viewerId === viewerId && p.targetId === targetId)) {
            const newPermission = { viewerId, targetId };
            mockPermissions.push(newPermission);
            setPermissions([...mockPermissions]);
        }
    };

    const removePermission = (viewerId: string, targetId: string) => {
        const index = mockPermissions.findIndex(p => p.viewerId === viewerId && p.targetId === targetId);
        if (index > -1) {
            mockPermissions.splice(index, 1);
            setPermissions([...mockPermissions]);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
                <p className="text-slate-500 mt-1">Manage users and permissions.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">User Management</h2>
                <div className="mb-8">
                   <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Add New User</h3>
                   <AddUserForm onAddUser={addUser} existingUsers={users} />
                </div>
                
                <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">All Users</h3>
                    <UserList users={users} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Permission Management</h2>
                <PermissionManager 
                    permissions={permissions} 
                    users={users.filter(u => u.role !== 'admin')} // Admins don't need permissions
                    onAddPermission={addPermission} 
                    onRemovePermission={removePermission} 
                />
            </div>
        </div>
    );
};