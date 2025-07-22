import { getDatabase } from '../server/database/connection';

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingConfirmations: boolean;
  bookingReminders: boolean;
  paymentReminders: boolean;
  systemNotifications: boolean;
  marketingEmails: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPreferencesData {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  bookingConfirmations?: boolean;
  bookingReminders?: boolean;
  paymentReminders?: boolean;
  systemNotifications?: boolean;
  marketingEmails?: boolean;
}

export class NotificationPreferencesService {
  private static instance: NotificationPreferencesService;

  public static getInstance(): NotificationPreferencesService {
    if (!NotificationPreferencesService.instance) {
      NotificationPreferencesService.instance = new NotificationPreferencesService();
    }
    return NotificationPreferencesService.instance;
  }

  private constructor() {}

  // Get user notification preferences
  public async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const db = await getDatabase();
      const preferences = await db.get(
        `SELECT user_id as userId, email, sms, push, booking_confirmations as bookingConfirmations,
                booking_reminders as bookingReminders, payment_reminders as paymentReminders,
                system_notifications as systemNotifications, marketing_emails as marketingEmails,
                created_at as createdAt, updated_at as updatedAt
         FROM notification_preferences 
         WHERE user_id = ?`,
        [userId]
      );

      if (!preferences) {
        // Return default preferences if none exist
        return this.createDefaultPreferences(userId);
      }

      return {
        userId: preferences.userId,
        email: Boolean(preferences.email),
        sms: Boolean(preferences.sms),
        push: Boolean(preferences.push),
        bookingConfirmations: Boolean(preferences.bookingConfirmations),
        bookingReminders: Boolean(preferences.bookingReminders),
        paymentReminders: Boolean(preferences.paymentReminders),
        systemNotifications: Boolean(preferences.systemNotifications),
        marketingEmails: Boolean(preferences.marketingEmails),
        createdAt: preferences.createdAt,
        updatedAt: preferences.updatedAt,
      };
    } catch (error) {
      console.error('❌ Error getting user preferences:', error);
      return null;
    }
  }

  // Create default preferences for a new user
  public async createDefaultPreferences(userId: string): Promise<NotificationPreferences> {
    const defaultPreferences: NotificationPreferences = {
      userId,
      email: true,
      sms: false,
      push: true,
      bookingConfirmations: true,
      bookingReminders: true,
      paymentReminders: true,
      systemNotifications: true,
      marketingEmails: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const db = await getDatabase();
      await db.run(
        `INSERT OR REPLACE INTO notification_preferences 
         (user_id, email, sms, push, booking_confirmations, booking_reminders, 
          payment_reminders, system_notifications, marketing_emails, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          defaultPreferences.email ? 1 : 0,
          defaultPreferences.sms ? 1 : 0,
          defaultPreferences.push ? 1 : 0,
          defaultPreferences.bookingConfirmations ? 1 : 0,
          defaultPreferences.bookingReminders ? 1 : 0,
          defaultPreferences.paymentReminders ? 1 : 0,
          defaultPreferences.systemNotifications ? 1 : 0,
          defaultPreferences.marketingEmails ? 1 : 0,
          defaultPreferences.createdAt,
          defaultPreferences.updatedAt,
        ]
      );

      console.log('✅ Default notification preferences created for user:', userId);
      return defaultPreferences;
    } catch (error) {
      console.error('❌ Error creating default preferences:', error);
      throw error;
    }
  }

  // Update user notification preferences
  public async updateUserPreferences(
    userId: string,
    updates: UpdateNotificationPreferencesData
  ): Promise<NotificationPreferences | null> {
    try {
      const db = await getDatabase();
      
      // Build dynamic update query
      const setClause = [];
      const values = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          const dbKey = this.camelToSnake(key);
          setClause.push(`${dbKey} = ?`);
          values.push(value ? 1 : 0);
        }
      });

      if (setClause.length === 0) {
        return this.getUserPreferences(userId);
      }

      values.push(new Date().toISOString()); // updated_at
      values.push(userId);

      await db.run(
        `UPDATE notification_preferences 
         SET ${setClause.join(', ')}, updated_at = ?
         WHERE user_id = ?`,
        values
      );

      console.log('✅ Notification preferences updated for user:', userId);
      return this.getUserPreferences(userId);
    } catch (error) {
      console.error('❌ Error updating preferences:', error);
      return null;
    }
  }

  // Check if user wants specific notification type
  public async shouldReceiveNotification(
    userId: string,
    notificationType: 'email' | 'sms' | 'push',
    category?: 'booking_confirmations' | 'booking_reminders' | 'payment_reminders' | 'system_notifications' | 'marketing_emails'
  ): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) {
        return false;
      }

      // Check if the user wants this type of notification
      if (!preferences[notificationType]) {
        return false;
      }

      // Check category-specific preferences if provided
      if (category && !preferences[category]) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error checking notification preferences:', error);
      return false;
    }
  }

  // Get users who want to receive a specific type of notification
  public async getUsersForNotification(
    notificationType: 'email' | 'sms' | 'push',
    category?: string
  ): Promise<string[]> {
    try {
      const db = await getDatabase();
      
      let query = `SELECT user_id FROM notification_preferences WHERE ${notificationType} = 1`;
      const params = [];

      if (category) {
        const dbCategory = this.camelToSnake(category);
        query += ` AND ${dbCategory} = 1`;
      }

      const rows = await db.all(query, params);
      return rows.map(row => row.user_id);
    } catch (error) {
      console.error('❌ Error getting users for notification:', error);
      return [];
    }
  }

  // Get notification statistics
  public async getNotificationStats(): Promise<{
    totalUsers: number;
    emailEnabled: number;
    smsEnabled: number;
    pushEnabled: number;
    byCategory: Record<string, number>;
  }> {
    try {
      const db = await getDatabase();
      
      const stats = await db.get(`
        SELECT 
          COUNT(*) as totalUsers,
          SUM(email) as emailEnabled,
          SUM(sms) as smsEnabled,
          SUM(push) as pushEnabled,
          SUM(booking_confirmations) as bookingConfirmations,
          SUM(booking_reminders) as bookingReminders,
          SUM(payment_reminders) as paymentReminders,
          SUM(system_notifications) as systemNotifications,
          SUM(marketing_emails) as marketingEmails
        FROM notification_preferences
      `);

      return {
        totalUsers: stats.totalUsers || 0,
        emailEnabled: stats.emailEnabled || 0,
        smsEnabled: stats.smsEnabled || 0,
        pushEnabled: stats.pushEnabled || 0,
        byCategory: {
          bookingConfirmations: stats.bookingConfirmations || 0,
          bookingReminders: stats.bookingReminders || 0,
          paymentReminders: stats.paymentReminders || 0,
          systemNotifications: stats.systemNotifications || 0,
          marketingEmails: stats.marketingEmails || 0,
        },
      };
    } catch (error) {
      console.error('❌ Error getting notification stats:', error);
      return {
        totalUsers: 0,
        emailEnabled: 0,
        smsEnabled: 0,
        pushEnabled: 0,
        byCategory: {},
      };
    }
  }

  // Bulk update preferences for multiple users
  public async bulkUpdatePreferences(
    userIds: string[],
    updates: UpdateNotificationPreferencesData
  ): Promise<number> {
    try {
      const db = await getDatabase();
      let updatedCount = 0;

      for (const userId of userIds) {
        const result = await this.updateUserPreferences(userId, updates);
        if (result) {
          updatedCount++;
        }
      }

      console.log(`✅ Bulk updated preferences for ${updatedCount} users`);
      return updatedCount;
    } catch (error) {
      console.error('❌ Error in bulk update:', error);
      return 0;
    }
  }

  // Utility method to convert camelCase to snake_case
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

// Export singleton instance
export const notificationPreferencesService = NotificationPreferencesService.getInstance();
