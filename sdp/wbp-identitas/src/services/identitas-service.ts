import { db, identitas, eq, type InferSelectModel, type InferInsertModel } from '@sdp/database';

export type Identitas = InferSelectModel<typeof identitas>;
export type NewIdentitas = InferInsertModel<typeof identitas>;

export class IdentitasService {
  static async getById(nomorInduk: string): Promise<Identitas | undefined> {
    const result = await db
      .select()
      .from(identitas)
      .where(eq(identitas.nomorInduk, nomorInduk))
      .limit(1);
    
    return result[0];
  }

  static async getAll(limit: number = 10): Promise<Identitas[]> {
    return await db.select().from(identitas).limit(limit);
  }

  static async create(data: NewIdentitas): Promise<Identitas> {
    const result = await db.insert(identitas).values(data).returning();
    return result[0];
  }

  static async update(nomorInduk: string, data: Partial<NewIdentitas>): Promise<Identitas | undefined> {
    const result = await db
      .update(identitas)
      .set(data)
      .where(eq(identitas.nomorInduk, nomorInduk))
      .returning();
    
    return result[0];
  }

  static async delete(nomorInduk: string): Promise<void> {
    await db.delete(identitas).where(eq(identitas.nomorInduk, nomorInduk));
  }
}
