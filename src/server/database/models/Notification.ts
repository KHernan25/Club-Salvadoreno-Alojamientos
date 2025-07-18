import { getDatabase } from "../connection";
import { v4 as uuidv4 } from "uuid";

export interface Notification {
  id: string;
  type:
    | "reservation"
    | "user_registration"
    | "system"
    | "review"
    | "access"
    | "billing";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
  userId?: string;
  role?:
    | "super_admin"
    | "atencion_miembro"
    | "anfitrion"
    | "monitor"
    | "mercadeo"
    | "recepcion"
    | "porteria";
}

export class NotificationModel {
  static async create(
    notificationData: Omit<Notification, "id" | "createdAt" | "isRead">,
  ): Promise<Notification> {
    const db = await getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO notifications (
        id, type, title, message, is_read, created_at, data, user_id, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        notificationData.type,
        notificationData.title,
        notificationData.message,
        0, // isRead = false
        now,
        notificationData.data ? JSON.stringify(notificationData.data) : null,
        notificationData.userId || null,
        notificationData.role || null,
      ],
    );

    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create notification");
    }

    return created;
  }

  static async findById(id: string): Promise<Notification | null> {
    const db = await getDatabase();
    const notification = await db.get(
      "SELECT * FROM notifications WHERE id = ?",
      [id],
    );
    return notification ? this.mapDbToNotification(notification) : null;
  }

  static async getAll(): Promise<Notification[]> {
    const db = await getDatabase();
    const notifications = await db.all(
      "SELECT * FROM notifications ORDER BY created_at DESC",
    );
    return notifications.map((notification) =>
      this.mapDbToNotification(notification),
    );
  }

  static async getUnreadCount(): Promise<number> {
    const db = await getDatabase();
    const result = await db.get(
      "SELECT COUNT(*) as count FROM notifications WHERE is_read = 0",
    );
    return result.count;
  }

  static async markAsRead(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.run(
      "UPDATE notifications SET is_read = 1 WHERE id = ?",
      [id],
    );
    return result.changes > 0;
  }

  static async markAllAsRead(): Promise<number> {
    const db = await getDatabase();
    const result = await db.run(
      "UPDATE notifications SET is_read = 1 WHERE is_read = 0",
    );
    return result.changes;
  }

  static async getByRole(role: string): Promise<Notification[]> {
    const db = await getDatabase();
    const notifications = await db.all(
      "SELECT * FROM notifications WHERE role = ? OR role IS NULL ORDER BY created_at DESC",
      [role],
    );
    return notifications.map((notification) =>
      this.mapDbToNotification(notification),
    );
  }

  static async getByUserId(userId: string): Promise<Notification[]> {
    const db = await getDatabase();
    const notifications = await db.all(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    );
    return notifications.map((notification) =>
      this.mapDbToNotification(notification),
    );
  }

  private static mapDbToNotification(dbNotification: any): Notification {
    return {
      id: dbNotification.id,
      type: dbNotification.type,
      title: dbNotification.title,
      message: dbNotification.message,
      isRead: Boolean(dbNotification.is_read),
      createdAt: new Date(dbNotification.created_at),
      data: dbNotification.data ? JSON.parse(dbNotification.data) : undefined,
      userId: dbNotification.user_id,
      role: dbNotification.role,
    };
  }
}
