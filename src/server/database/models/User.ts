import { getDatabase } from "../connection";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
  role:
    | "super_admin"
    | "atencion_miembro"
    | "anfitrion"
    | "monitor"
    | "mercadeo"
    | "recepcion"
    | "porteria"
    | "miembro";
  isActive: boolean;
  status: "pending" | "approved" | "rejected";
  memberStatus?: "activo" | "inactivo" | "en_mora";
  membershipType?:
    | "Viuda"
    | "Honorario"
    | "Fundador"
    | "Visitador Transeunte"
    | "Visitador Especial"
    | "Visitador Juvenil"
    | "Contribuyente";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    return user ? this.mapDbToUser(user) : null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.get("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return user ? this.mapDbToUser(user) : null;
  }

  static async findById(id: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    return user ? this.mapDbToUser(user) : null;
  }

  static async findByCredentials(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.get(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ? AND is_active = 1",
      [usernameOrEmail, usernameOrEmail, password],
    );
    return user ? this.mapDbToUser(user) : null;
  }

  static async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "fullName">,
  ): Promise<User> {
    const db = await getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    const result = await db.run(
      `INSERT INTO users (
        id, first_name, last_name, username, password, email, phone, role, 
        is_active, status, member_status, membership_type, profile_image, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userData.firstName,
        userData.lastName,
        userData.username,
        userData.password,
        userData.email,
        userData.phone,
        userData.role,
        userData.isActive ? 1 : 0,
        userData.status,
        userData.memberStatus || null,
        userData.membershipType || null,
        userData.profileImage || null,
        now,
        now,
      ],
    );

    const createdUser = await this.findById(id);
    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    return createdUser;
  }

  static async updateLastLogin(id: string): Promise<void> {
    const db = await getDatabase();
    await db.run(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );
  }

  static async updatePassword(
    id: string,
    hashedPassword: string,
  ): Promise<void> {
    const db = await getDatabase();
    await db.run(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, id],
    );
  }

  static async update(
    id: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    const db = await getDatabase();

    const setClause = [];
    const values = [];

    const allowedFields = [
      "first_name",
      "last_name",
      "username",
      "password",
      "email",
      "phone",
      "role",
      "is_active",
      "status",
      "member_status",
      "membership_type",
      "profile_image",
    ];

    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = this.camelToSnake(key);
      if (allowedFields.includes(dbKey)) {
        setClause.push(`${dbKey} = ?`);
        values.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.run(
      `UPDATE users SET ${setClause.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
    );

    return this.findById(id);
  }

  static async getAll(): Promise<User[]> {
    const db = await getDatabase();
    const users = await db.all("SELECT * FROM users ORDER BY created_at DESC");
    return users.map((user) => this.mapDbToUser(user));
  }

  static async isEmailAvailable(email: string): Promise<boolean> {
    const db = await getDatabase();
    const count = await db.get(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email],
    );
    return count.count === 0;
  }

  static async isUsernameAvailable(username: string): Promise<boolean> {
    const db = await getDatabase();
    const count = await db.get(
      "SELECT COUNT(*) as count FROM users WHERE username = ?",
      [username],
    );
    return count.count === 0;
  }

  private static mapDbToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      username: dbUser.username,
      password: dbUser.password,
      email: dbUser.email,
      phone: dbUser.phone,
      fullName: dbUser.full_name,
      role: dbUser.role,
      isActive: Boolean(dbUser.is_active),
      status: dbUser.status,
      memberStatus: dbUser.member_status,
      membershipType: dbUser.membership_type,
      lastLogin: dbUser.last_login ? new Date(dbUser.last_login) : undefined,
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at),
      profileImage: dbUser.profile_image,
    };
  }

  private static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
