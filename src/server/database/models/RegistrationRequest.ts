import { getDatabase } from "../connection";
import { v4 as uuidv4 } from "uuid";

export interface RegistrationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: "dui" | "passport";
  documentNumber: string;
  memberCode: string;
  password: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export class RegistrationRequestModel {
  static async create(
    requestData: Omit<
      RegistrationRequest,
      "id" | "status" | "submittedAt" | "reviewedAt" | "reviewedBy"
    >,
  ): Promise<RegistrationRequest> {
    const db = await getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO registration_requests (
        id, first_name, last_name, email, phone, document_type, 
        document_number, member_code, password, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        requestData.firstName,
        requestData.lastName,
        requestData.email,
        requestData.phone,
        requestData.documentType,
        requestData.documentNumber,
        requestData.memberCode,
        requestData.password,
        "pending",
        now,
      ],
    );

    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create registration request");
    }

    return created;
  }

  static async findById(id: string): Promise<RegistrationRequest | null> {
    const db = await getDatabase();
    const request = await db.get(
      "SELECT * FROM registration_requests WHERE id = ?",
      [id],
    );
    return request ? this.mapDbToRequest(request) : null;
  }

  static async findByEmail(email: string): Promise<RegistrationRequest | null> {
    const db = await getDatabase();
    const request = await db.get(
      "SELECT * FROM registration_requests WHERE email = ?",
      [email],
    );
    return request ? this.mapDbToRequest(request) : null;
  }

  static async getAll(): Promise<RegistrationRequest[]> {
    const db = await getDatabase();
    const requests = await db.all(
      "SELECT * FROM registration_requests ORDER BY submitted_at DESC",
    );
    return requests.map((request) => this.mapDbToRequest(request));
  }

  static async getPendingRequests(): Promise<RegistrationRequest[]> {
    const db = await getDatabase();
    const requests = await db.all(
      "SELECT * FROM registration_requests WHERE status = 'pending' ORDER BY submitted_at DESC",
    );
    return requests.map((request) => this.mapDbToRequest(request));
  }

  static async approve(
    id: string,
    reviewedBy: string,
    notes?: string,
  ): Promise<RegistrationRequest | null> {
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.run(
      `UPDATE registration_requests 
       SET status = 'approved', reviewed_at = ?, reviewed_by = ?, notes = ? 
       WHERE id = ?`,
      [now, reviewedBy, notes || null, id],
    );

    return this.findById(id);
  }

  static async reject(
    id: string,
    reviewedBy: string,
    rejectionReason: string,
    notes?: string,
  ): Promise<RegistrationRequest | null> {
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.run(
      `UPDATE registration_requests 
       SET status = 'rejected', reviewed_at = ?, reviewed_by = ?, rejection_reason = ?, notes = ? 
       WHERE id = ?`,
      [now, reviewedBy, rejectionReason, notes || null, id],
    );

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.run(
      "DELETE FROM registration_requests WHERE id = ?",
      [id],
    );
    return result.changes > 0;
  }

  static async isEmailAlreadyRequested(email: string): Promise<boolean> {
    const db = await getDatabase();
    const count = await db.get(
      "SELECT COUNT(*) as count FROM registration_requests WHERE email = ? AND status = 'pending'",
      [email],
    );
    return count.count > 0;
  }

  private static mapDbToRequest(dbRequest: any): RegistrationRequest {
    return {
      id: dbRequest.id,
      firstName: dbRequest.first_name,
      lastName: dbRequest.last_name,
      email: dbRequest.email,
      phone: dbRequest.phone,
      documentType: dbRequest.document_type,
      documentNumber: dbRequest.document_number,
      memberCode: dbRequest.member_code,
      password: dbRequest.password,
      status: dbRequest.status,
      submittedAt: new Date(dbRequest.submitted_at),
      reviewedAt: dbRequest.reviewed_at
        ? new Date(dbRequest.reviewed_at)
        : undefined,
      reviewedBy: dbRequest.reviewed_by,
      rejectionReason: dbRequest.rejection_reason,
      notes: dbRequest.notes,
    };
  }
}
