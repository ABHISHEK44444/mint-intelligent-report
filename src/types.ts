export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
}

export interface DailyReport {
  id: string;
  userId: string;
  date: string;
  day: string;
  accountName: string;
  contactPerson: string;
  contactNumber: string;
  workDone: string;
  outcome: string;
  supportRequired: string;
  remarks?: string;
}

export interface WeeklyPlan {
  id: string;
  userId: string;
  date: string;
  day: string;
  customerName: string;
  contactPerson: string;
  requirement: string;
  proposedAction: string;
  planningRequired: string;
  supportRequired: string;
  remarks?: string;
}

export interface Permission {
  _id: string;
  viewerId: { id: string, name: string };
  targetId: { id: string, name: string };
}
