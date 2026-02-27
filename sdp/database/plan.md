# Database Design Plan - SDP Prison Management System

## Overview

This document outlines the database table design for the SDP (Sistem Database Pemasyarakatan) prison management system. The design follows Indonesian prison system regulations.

## Design Principles

1. **Identitas (Identity)** - Single identity per inmate/WBP
2. **Perkara (Case)** - Each crime committed results in a new registration
3. **Mutasi (Transfer)** - Inmate can be transferred between prisons
4. **Tahapan Perkara (Case Stages)** - Tahanan stages (A1, A2, etc.) until convicted

---

## Existing Table

### 1. `identitas`

Stores personal identity information for each WBP (Warga Binaan Pemasyarakatan).

| Column | Type | Description |
|--------|------|-------------|
| `NOMOR_INDUK` | text | Primary key |
| `NAMA_LENGKAP` | text | Full name |
| `NIK` | text | National ID |
| `TANGGAL_LAHIR` | date | Date of birth |
| `ALAMAT` | text | Address |
| ... | ... | (other personal attributes) |

---

## New Tables

### 2. `lembaga` (Prison/Lapas)

Reference table for prisons/institutions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `kode` | text | LAPAS_A, LAPAS_B, RUTAN_X, etc. |
| `nama` | text | Full name |
| `jenis` | enum | RUTAN, LAPAS, LEMAS |
| `alamat` | text | Address |
| `is_active` | boolean | Active status |

---

### 3. `perkara` (Case/Registration)

Represents each time an inmate enters the prison system due to a crime. One inmate can have multiple perkara in their lifetime.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `nomor_induk` | text | FK → identitas.NOMOR_INDUK |
| `nomor_perkara` | text | Case number (e.g., PDM-2024-001) |
| `tanggal_masuk` | date | Date entered prison |
| `jenis_kasus` | enum | NARAPIDANA, TAHANAN |
| `pasal` | text | Criminal article (KUHP) |
| `nama_penanganan` | text | Name of case handler |
| `nama_polres` | text | Police station |
| `nama_kejaksaan` | text | Prosecutor's office |
| `nama_pengadilan` | text | Court name |
| `tanggal_putusan` | date | Verdict date |
| `status_wbp` | enum | TAHANAN, NARAPIDANA, BEBAS, dll |
| `id_lembaga_asal` | uuid | FK → lembaga (initial prison) |

---

### 4. `tahapan_perkara` (Case Stages)

Represents the stages a tahanan goes through according to KUHAP: A1, A2, A3, B1, B2 during investigation/trial. Each stage gets a registration number.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `id_perkara` | uuid | FK → perkara.id |
| `nomor_registrasi` | text | Registration number assigned by prison |
| `kode_tahapan` | text | A1, A2, A3, B1, B2 |
| `nama_tahapan` | text | e.g., "Penahanan Tahap I" |
| `tanggal_mulai` | date | Start of this stage |
| `tanggal_selesai` | date | End of this stage |
| `lembaga_id` | uuid | FK → lembaga |
| `catatan` | text | Notes |

> **Note**: Once convicted (status_wbp = NARAPIDANA), stages no longer apply.

---

### 5. `mutasi` (Transfer)

Records transfers of inmates between prisons. Can be for tahanan (case-specific) or convicted WBP.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `nomor_induk` | text | FK → identitas.NOMOR_INDUK |
| `id_perkara` | uuid | FK → perkara.id (optional, for tahanan transfers) |
| `jenis_mutasi` | enum | ANTAR_LEMBAGA, PENGELOLAAN |
| `lembaga_asal_id` | uuid | FK → lembaga |
| `lembaga_tujuan_id` | uuid | FK → lembaga |
| `tanggal_mutasi` | date | Transfer date |
| `nomor_surat` | text | Transfer letter number |
| `alasan` | text | Reason for transfer |
| `status_mutasi` | enum | PERMINTAAN, DALAM_PERJALANAN, SELESAI |

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│    identitas    │       │    lembaga      │
│ (existing table)│       │   (reference)   │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │ 1:N                     │
         │ (multiple cases         │ 1:N
         │  in lifetime)           │ (mutasi)
         ▼                         │
┌─────────────────┐                │
│    perkara     │◄───────────────┘
│  (registration)│
└────────┬────────┘
         │
    ┌────┴────┐
    │ 1:N     │ 1:N
    ▼         ▼
┌────────────┐    ┌─────────────┐
│ tahapan_   │    │  mutasi     │
│ perkara    │    │ (transfers) │
│ (A1,A2...) │    └─────────────┘
└────────────┘
```

---

## Enum Definitions

### `jenis_kasus`
- NARAPIDANA (convicted)
- TAHANAN (detainee/pre-trial)

### `status_wbp`
- TAHANAN
- NARAPIDANA
- BEBAS
- dll

### `jenis_lembaga`
- RUTAN (Rumah Tahanan Negara)
- LAPAS (Lembaga Pemasyarakatan)
- LEMAS (Lembaga Khusus)

### `jenis_mutasi`
- ANTAR_LEMBAGA (between institutions)
- PENGELOLAAN (management transfer)

### `status_mutasi`
- PERMINTAAN (requested)
- DALAM_PERJALANAN (in transit)
- SELESAI (completed)

### `kode_tahapan` (KUHAP Stages)
- A1 (Penahanan Tahap I - Police)
- A2 (Penahanan Tahap II - Prosecutor)
- A3 (Penahanan Tahap III - Court)
- B1 (Penahanan Tahap Penyidikan)
- B2 (Penahanan Tahap Penuntutan)

---

## Notes

- One inmate (identitas) can have multiple perkara entries over their lifetime
- Each perkara can have multiple tahapan_perkara entries (A1→A2→A3→B1→B2)
- Once status_wbp becomes NARAPIDANA, tahapan_perkara is no longer relevant
- mutasi can be linked to a specific perkara (for tahanan) or null (for general WBP management)
