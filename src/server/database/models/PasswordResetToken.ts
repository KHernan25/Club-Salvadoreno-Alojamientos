import { db } from '../connection';
import crypto from 'crypto';

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  email: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface CreatePasswordResetTokenData {
  userId: string;
  email: string;
  expiresIn?: number; // minutes, default 60
}

export class PasswordResetTokenModel {
  // Crear un nuevo token de reseteo
  static async create(data: CreatePasswordResetTokenData): Promise<PasswordResetToken> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresIn = data.expiresIn || 60; // 60 minutos por defecto
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000).toISOString();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const resetToken: PasswordResetToken = {
      id,
      userId: data.userId,
      token,
      email: data.email,
      expiresAt,
      used: false,
      createdAt,
    };

    try {
      await db.run(
        `INSERT INTO password_reset_tokens (id, user_id, token, email, expires_at, used, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, data.userId, token, data.email, expiresAt, 0, createdAt]
      );

      console.log('✅ Password reset token created:', { id, email: data.email, expiresAt });
      return resetToken;
    } catch (error) {
      console.error('❌ Error creating password reset token:', error);
      throw new Error('Error creating password reset token');
    }
  }

  // Buscar token por el valor del token
  static async findByToken(token: string): Promise<PasswordResetToken | null> {
    try {
      const row = await db.get(
        `SELECT id, user_id as userId, token, email, expires_at as expiresAt, 
                used, created_at as createdAt
         FROM password_reset_tokens 
         WHERE token = ? AND used = 0`,
        [token]
      );

      if (!row) {
        return null;
      }

      return {
        id: row.id,
        userId: row.userId,
        token: row.token,
        email: row.email,
        expiresAt: row.expiresAt,
        used: Boolean(row.used),
        createdAt: row.createdAt,
      };
    } catch (error) {
      console.error('❌ Error finding password reset token:', error);
      return null;
    }
  }

  // Verificar si un token es válido (no usado y no expirado)
  static async isValidToken(token: string): Promise<boolean> {
    try {
      const resetToken = await this.findByToken(token);
      
      if (!resetToken) {
        return false;
      }

      // Verificar si ha expirado
      const now = new Date();
      const expiresAt = new Date(resetToken.expiresAt);
      
      if (now > expiresAt) {
        console.log('❌ Password reset token expired:', { token: token.substring(0, 8) + '...' });
        return false;
      }

      return !resetToken.used;
    } catch (error) {
      console.error('❌ Error validating password reset token:', error);
      return false;
    }
  }

  // Marcar token como usado
  static async markAsUsed(token: string): Promise<boolean> {
    try {
      const result = await db.run(
        `UPDATE password_reset_tokens 
         SET used = 1 
         WHERE token = ? AND used = 0`,
        [token]
      );

      if (result.changes === 0) {
        console.log('�� Token not found or already used:', { token: token.substring(0, 8) + '...' });
        return false;
      }

      console.log('✅ Password reset token marked as used:', { token: token.substring(0, 8) + '...' });
      return true;
    } catch (error) {
      console.error('❌ Error marking token as used:', error);
      return false;
    }
  }

  // Invalidar todos los tokens de un usuario
  static async invalidateUserTokens(userId: string): Promise<boolean> {
    try {
      await db.run(
        `UPDATE password_reset_tokens 
         SET used = 1 
         WHERE user_id = ? AND used = 0`,
        [userId]
      );

      console.log('✅ All password reset tokens invalidated for user:', userId);
      return true;
    } catch (error) {
      console.error('❌ Error invalidating user tokens:', error);
      return false;
    }
  }

  // Invalidar todos los tokens de un email
  static async invalidateEmailTokens(email: string): Promise<boolean> {
    try {
      await db.run(
        `UPDATE password_reset_tokens 
         SET used = 1 
         WHERE email = ? AND used = 0`,
        [email]
      );

      console.log('✅ All password reset tokens invalidated for email:', email);
      return true;
    } catch (error) {
      console.error('❌ Error invalidating email tokens:', error);
      return false;
    }
  }

  // Limpiar tokens expirados (para tareas de mantenimiento)
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await db.run(
        `DELETE FROM password_reset_tokens 
         WHERE expires_at < datetime('now')`
      );

      const deletedCount = result.changes || 0;
      if (deletedCount > 0) {
        console.log(`✅ Cleaned up ${deletedCount} expired password reset tokens`);
      }

      return deletedCount;
    } catch (error) {
      console.error('❌ Error cleaning up expired tokens:', error);
      return 0;
    }
  }

  // Obtener tokens de un usuario (para debugging/admin)
  static async getUserTokens(userId: string): Promise<PasswordResetToken[]> {
    try {
      const rows = await db.all(
        `SELECT id, user_id as userId, token, email, expires_at as expiresAt, 
                used, created_at as createdAt
         FROM password_reset_tokens 
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
      );

      return rows.map(row => ({
        id: row.id,
        userId: row.userId,
        token: row.token,
        email: row.email,
        expiresAt: row.expiresAt,
        used: Boolean(row.used),
        createdAt: row.createdAt,
      }));
    } catch (error) {
      console.error('❌ Error getting user tokens:', error);
      return [];
    }
  }
}
