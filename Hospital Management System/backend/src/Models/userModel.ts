import { PoolConnection } from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

export const UserModel = {
    signup: async (userData: User, db: PoolConnection): Promise<void> => {
        const query = `INSERT INTO patientsAuth SET ?`;

        return db.query(query, userData)
            .then(() => {})
            .finally(() => {
                db.release();
                console.log('Database connection released after signup');
            });
    },

    login: async (email: string, db: PoolConnection): Promise<User | null> => {
        const query = `SELECT * FROM patientsAuth WHERE email = ?`;

        return db.query(query, [email])
            .then(([rows]) => (rows as User[])[0] || null)
            .finally(() => {
                db.release();
                console.log('Database connection released after login');
            });
    },

    findByEmail: async (email: string, db: PoolConnection): Promise<User | null> => {
        const query = `SELECT * FROM patientsAuth WHERE email = ?`;

        return db.query(query, [email])
            .then(([rows]) => (rows as User[])[0] || null)
            .finally(() => {
                db.release();
                console.log('Database connection released after findByEmail');
            });
    },

    resetPassword: async (email: string, newPassword: string, db: PoolConnection): Promise<void> => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const query = `UPDATE patientsAuth SET password = ? WHERE email = ?`;

        return db.query(query, [hashedPassword, email])
            .then(() => {})
            .finally(() => {
                db.release();
                console.log('Database connection released after reset password');
            });
    },
    
    update: async (userData: User, db: PoolConnection): Promise<void> => {
        const query = `UPDATE patientsAuth SET name = ?, email = ?, password = ? WHERE id = ?`;

        return db.query(query, [userData.name, userData.email, userData.password, userData.id])
            .then(() => {})
            .finally(() => {
                db.release();
                console.log('Database connection released after update');
            });
    },

    delete: async (email: string, db: PoolConnection): Promise<void> => {
        const query = `DELETE FROM patientsAuth WHERE email = ?`;

        return db.query(query, [email])
            .then(() => {})
            .finally(() => {
                db.release();
                console.log('Database connection released after delete');
            });
    },

    forgotPassword: async (email: string, db: PoolConnection): Promise<string | null> => {
        const query = `SELECT id FROM patientsAuth WHERE email = ?`;

        return db.query(query, [email])
            .then((result: any) => {
                if (result[0].length > 0) {
                    const userId = result[0][0].id;
                    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
                    return token;
                } else {
                    return null;
                }
            })
            .finally(() => {
                db.release();
                console.log('Database connection released after forgot password');
            });
    },

    validateToken: (token: string): jwt.JwtPayload | null => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        } catch (error) {
            return null;
        }
    }
};


