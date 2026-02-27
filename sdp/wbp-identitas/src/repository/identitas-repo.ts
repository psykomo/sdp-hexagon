import { db, identitas, eq, sql, like, or, type InferSelectModel } from '@sdp/database';

export type Identitas = InferSelectModel<typeof identitas>;

/**
 * IdentitasRepository - Database operations
 */
export class IdentitasRepository {
  async findById(nomorInduk: string): Promise<Identitas | null> {
    const result = await db
      .select()
      .from(identitas)
      .where(eq(identitas.nomorInduk, nomorInduk))
      .limit(1);
    
    return result[0] || null;
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<Identitas[]> {
    return await db
      .select()
      .from(identitas)
      .where(eq(identitas.isDeleted, 0))
      .limit(limit)
      .offset(offset);
  }

  async search(query: string, limit: number = 10): Promise<Identitas[]> {
    const pattern = `%${query}%`;
    
    return await db
      .select()
      .from(identitas)
      .where(
        or(
          like(identitas.namaLengkap, pattern),
          like(identitas.nik, pattern),
          like(identitas.nomorInduk, pattern)
        )
      )
      .limit(limit);
  }

  async count(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(identitas)
      .where(eq(identitas.isDeleted, 0));
    
    return result[0]?.count ?? 0;
  }

  async exists(nomorInduk: string): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(identitas)
      .where(eq(identitas.nomorInduk, nomorInduk));
    
    return (result[0]?.count ?? 0) > 0;
  }

  async create(data: Partial<Identitas>): Promise<Identitas> {
    const now = new Date().toISOString();
    
    const result = await db
      .insert(identitas)
      .values(data as Identitas)
      .returning();
    
    // Update timestamps after insert
    const updated = await db
      .update(identitas)
      .set({ created: now, updated: now })
      .where(eq(identitas.nomorInduk, result[0].nomorInduk))
      .returning();
    
    return updated[0];
  }

  async update(nomorInduk: string, data: Partial<Identitas>): Promise<Identitas | null> {
    const result = await db
      .update(identitas)
      .set({
        ...data,
        updated: new Date().toISOString(),
      })
      .where(eq(identitas.nomorInduk, nomorInduk))
      .returning();
    
    return result[0] || null;
  }

  async delete(nomorInduk: string): Promise<boolean> {
    // Soft delete
    const result = await db
      .update(identitas)
      .set({
        isDeleted: 1,
        updated: new Date().toISOString(),
      })
      .where(eq(identitas.nomorInduk, nomorInduk))
      .returning();
    
    return !!result[0];
  }

  async hardDelete(nomorInduk: string): Promise<boolean> {
    const result = await db
      .delete(identitas)
      .where(eq(identitas.nomorInduk, nomorInduk))
      .returning();
    
    return !!result[0];
  }
}

// Singleton instance
export const identitasRepository = new IdentitasRepository();
