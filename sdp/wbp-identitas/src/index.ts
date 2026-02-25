import { db, identitas, eq } from '@sdp/database';

export const name = "@sdp/wbp-identitas";

export const getIdentitasById = async (nomorInduk: string) => {
  const result = await db.select().from(identitas).where(eq(identitas.nomorInduk, nomorInduk));
  return result[0];
};

export const getAllIdentitas = async () => {
  return await db.select().from(identitas).limit(10);
};
