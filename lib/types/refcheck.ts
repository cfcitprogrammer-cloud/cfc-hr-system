export type ReferenceCheck = {
  id: string; // Unique identifier for the reference check
  title: string; // Title or subject of the check
  receiver_name: string; // Name of the person receiving the request
  receiver_email: string; // Email of the receiver
  employee_name: string; // Candidate being checked
  position: string; // Candidate's position or role
  company: string; // Company associated with the check
  expires_on: string; // Expiry date of the request (ISO string)
  created_at: string; // Date the request was created (ISO string)
  user_id: string; // ID of the HR or user creating the request
  sid: string; // Session or unique secondary identifier
  status: string;
};
