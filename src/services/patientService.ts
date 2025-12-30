import { api } from "@/lib/api";
import type { Patient } from "@/types/medical";

/* ============================================================
   MAPEO API → FRONTEND
============================================================ */
function mapToPatient(e: any): Patient {
  if (!e) throw new Error("Respuesta inválida del servidor.");

  return {
    id: e.NumExpediente && e.NumExpediente !== ""
      ? e.NumExpediente
      : `temp-id-${Math.random()}`,

    nomPaciente:e.nomPaciente ?? "",
    numId:e.numId ?? "",
    
    firstName: e.PrimerNom ?? "",
    middleName: e.SegundoNom ?? "",
    lastName1: e.PrimerAp ?? "",
    lastName2: e.SegundoAp ?? "",

    identificationType: e.CodTipDoc ?? "",
    identificationNumber: e.NumId ?? "",

    birthDate: e.FecNacimiento ?? null,
    gender: e.Sexo ?? "",
    email: e.CorreoElectronico ?? "",
    phonePrimary: e.TelHab ?? "",
    phoneSecondary: e.TelCelular ?? "",
    exactAddress: e.DireccionHab ?? "",
    notes: e.Observ ?? "",

    ethnicGroup: e.CodEtnia ?? "",
    religion: e.CodReligion ?? "",
    profession: e.CodProfesion ?? "",
    country: e.CodPais ?? "",

    livesInCountry: e.IndVivePais === "SI",
    habeasData: e.IndConsEnvioInfo === "SI",
    privacyAuthorization: e.IndConsDatosPer === "SI",

    restrictions: Array.isArray(e.Restricciones) ? e.Restricciones : [],

    createdAt: e.FecExpediente ?? null,
    updatedAt: e.FecActualiza ?? null,
  };
}

/* ============================================================
   MAPEO FRONTEND → API
============================================================ */
function mapToPayload(p: Partial<Patient>) {
  return {
    NumExpediente: p.id ?? null,
    PrimerNom: p.firstName ?? "",
    SegundoNom: p.middleName ?? "",
    PrimerAp: p.lastName1 ?? "",
    SegundoAp: p.lastName2 ?? "",
    CodTipDoc: p.identificationType ?? "",
    NumId: p.identificationNumber ?? "",
    FecNacimiento: p.birthDate ?? null,
    Sexo: p.gender ?? "",
    CorreoElectronico: p.email ?? "",
    TelHab: p.phonePrimary ?? "",
    TelCelular: p.phoneSecondary ?? "",
    DireccionHab: p.exactAddress ?? "",
    Observ: p.notes ?? "",
    CodEtnia: p.ethnicGroup ?? "",
    CodReligion: p.religion ?? "",
    CodProfesion: p.profession ?? "",
    CodPais: p.country ?? "",
    IndVivePais: p.livesInCountry ? "SI" : "NO",
    IndConsEnvioInfo: p.habeasData ? "SI" : "NO",
    IndConsDatosPer: p.privacyAuthorization ? "SI" : "NO",
    Restricciones: p.restrictions ?? [],
    FecExpediente: p.createdAt ?? null,
    FecActualiza: p.updatedAt ?? null,
  };
}

/* ============================================================
   SERVICIO COMPLETO
============================================================ */
export const patientService = {
  // GET /Paciente/Todos
  getAll: async (): Promise<Patient[]> => {
    const res = await api.get("/Paciente/Todos");
    if (!Array.isArray(res.data)) return [];
    return res.data.map(mapToPatient);
  },

  // GET /Paciente/{id}
  getById: async (id: string): Promise<Patient> => {
    const res = await api.get(`/Paciente/${id}`);
    return mapToPatient(res.data);
  },

  // GET /Paciente/ByName?primerAp=&segundoAp=
  getByName: async (
  primerNom: string,
  segundoNom: string,
  primerAp: string,
  segundoAp: string
): Promise<Patient[]> => {
  const res = await api.get("/Paciente/ByName", {
    params: { primerNom, segundoNom, primerAp, segundoAp },
  });

  if (!Array.isArray(res.data)) return [];
  return res.data.map(mapToPatient);
},


  // GET /Paciente/ByIdentification?pidentificacion=
  getByIdentification: async (
    identificacion: string
  ): Promise<Patient | null> => {
    const res = await api.get("/Paciente/ByIdentification", {
      params: { pidentificacion: identificacion }
    });

    if (!res.data) return null;
    return mapToPatient(res.data);
  },

  // POST /Paciente/Crear
  create: async (patient: Partial<Patient>): Promise<Patient> => {
    const payload = mapToPayload(patient);
    const res = await api.post("/Paciente/Crear", payload);

    if (!res.data || typeof res.data !== "object") {
      return { ...patient, id: patient.id ?? "" } as Patient;
    }

    return mapToPatient(res.data);
  },

  // PUT /Paciente/Actualizar/{id}
  update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    const payload = mapToPayload(patient);
    const res = await api.put(`/Paciente/Actualizar/${id}`, payload);

    if (!res.data || typeof res.data !== "object") {
      return { ...patient, id } as Patient;
    }

    return mapToPatient(res.data);
  },

  // DELETE /Paciente/Eliminar/{id}
  delete: async (id: string): Promise<boolean> => {
    const res = await api.delete(`/Paciente/Eliminar/${id}`);
    return res.status === 200 || res.status === 204;
  },
};
