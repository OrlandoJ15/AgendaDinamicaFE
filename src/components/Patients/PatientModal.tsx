import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Patient } from '@/types/medical';
import { patientService } from '@/services/patientService';


/* =======================
   🔹 REGEX
   ======================= */
const regex = {
  nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,100}$/,
  cedula: /^[0-9]{6,12}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^[0-9\-\s]{6,20}$/
};

/* =======================
   🔹 TIPOS FORM
   ======================= */
type PatientForm = {
  nomPaciente: string;
  numId: string;

  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;

  tipoId: string;
  cedula: string;
  nacimiento: string;
  genero: string;
  correo: string;

  vivePais: 'SI' | 'NO';
  pais: string;
  profesion: string;

  telefonoCasa: string;
  telefonoCelular: string;

  direccion: string;
  observacion: string;

  religion: string;
  etnia: string;

  consentimiento: 'SI' | 'NO' | 'NA';
};

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patient: Patient) => void;
  initialData?: Partial<Patient>;
};

/* =======================
   🔹 LISTAS MOCK
   ======================= */
const mockLists = {
  tiposId: ['CEDULA IDENTIDAD', 'PASAPORTE', 'NIT'],
  generos: ['FEMENINO', 'MASCULINO', 'OTRO'],
  paises: ['COSTA RICA', 'PANAMA', 'NICARAGUA'],
  religiones: ['CATOLICO', 'ADVENTISTA', 'NINGUNA'],
  etnias: ['MESTIZA', 'INDIGENA', 'OTRA'],
  profesiones: ['MEDICO', 'INGENIERO', 'AEROMOZA'],
  vivePais: ['SI', 'NO']
};

export default function PatientModal({
  isOpen,
  onOpenChange,
  onSave,
  initialData = {}
}: Props) {

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      nomPaciente: initialData.nomPaciente || '',
      numId: initialData.numId ||'',
      primerApellido: initialData.lastName1 || '',
      segundoApellido: initialData.lastName2 || '',
      primerNombre: initialData.firstName || '',
      segundoNombre: initialData.middleName || '',
      tipoId: initialData.identificationType || mockLists.tiposId[0],
      cedula: initialData.identificationNumber || '',
      nacimiento: initialData.birthDate || '',
      genero: initialData.gender || mockLists.generos[0],
      correo: initialData.email || '',
      vivePais: initialData.livesInCountry ? 'SI' : 'NO',
      pais: initialData.country || mockLists.paises[0],
      profesion: initialData.profession || mockLists.profesiones[0],
      telefonoCasa: initialData.phonePrimary || '',
      telefonoCelular: initialData.phoneSecondary || '',
      direccion: initialData.exactAddress || '',
      observacion: initialData.notes || '',
      religion: initialData.religion || mockLists.religiones[0],
      etnia: initialData.ethnicGroup || mockLists.etnias[0],
      consentimiento: initialData.habeasData ? 'SI' : 'NO'
    }
  });

  /* =======================
     🔹 RESET EDITAR / NUEVO
     ======================= */
  useEffect(() => {
    reset({
      nomPaciente: initialData.firstName
        ? `${initialData.firstName} ${initialData.lastName1 ?? ''}`
        : '',
      numId: initialData.identificationNumber || '',

      primerNombre: initialData.firstName || '',
      segundoNombre: initialData.middleName || '',
      primerApellido: initialData.lastName1 || '',
      segundoApellido: initialData.lastName2 || '',

      tipoId: initialData.identificationType || mockLists.tiposId[0],
      cedula: initialData.identificationNumber || '',
      nacimiento: initialData.birthDate || '',
      genero: initialData.gender || mockLists.generos[0],
      correo: initialData.email || '',

      vivePais: initialData.livesInCountry ? 'SI' : 'NO',
      pais: initialData.country || mockLists.paises[0],
      profesion: initialData.profession || '',

      telefonoCasa: initialData.phonePrimary || '',
      telefonoCelular: initialData.phoneSecondary || '',

      direccion: initialData.exactAddress || '',
      observacion: initialData.notes || '',

      religion: initialData.religion || mockLists.religiones[0],
      etnia: initialData.ethnicGroup || mockLists.etnias[0],
      consentimiento: initialData.habeasData ? 'SI' : 'NA'
    });
  }, [isOpen, initialData, reset]);

  /* =======================
     🔹 SUBMIT
     ======================= */
  const submit = async (data: PatientForm) => {
    const patient: Patient = {
      id: initialData.id ?? `tmp-${Date.now()}`,

      nomPaciente:data.nomPaciente, 
      numId:data.numId,

      firstName: data.primerNombre,
      middleName: data.segundoNombre,
      lastName1: data.primerApellido,
      lastName2: data.segundoApellido,
      identificationType: data.tipoId,
      identificationNumber: data.cedula,
      birthDate: data.nacimiento,
      gender: data.genero,
      email: data.correo,
      livesInCountry: data.vivePais === 'SI',
      country: data.pais,
      profession: data.profesion,
      phonePrimary: data.telefonoCasa,
      phoneSecondary: data.telefonoCelular,
      exactAddress: data.direccion,
      notes: data.observacion,
      religion: data.religion,
      ethnicGroup: data.etnia,
      habeasData: data.consentimiento === 'SI',
      privacyAuthorization: data.consentimiento === 'SI',
      restrictions: [],
      createdAt: initialData.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = initialData.id
      ? await patientService.update(initialData.id, patient)
      : await patientService.create(patient);

    onSave(saved);
    onOpenChange(false);
  };

  /* =======================
     🔹 UI
     ======================= */
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">

        <DialogHeader>
          <DialogTitle>Nuevo Paciente</DialogTitle>
        </DialogHeader>

        {/*  ✅ SCROLL APLICADO */}
        <div className="max-h-[75vh] overflow-y-auto pr-2">

          <form onSubmit={handleSubmit(submit)} className="grid grid-cols-2 gap-4">

            <div>
              <Label>Primer Apellido</Label>
              <Input {...register('primerApellido', { required: 'Requerido', pattern: { value: regex.nombre, message: 'Nombre inválido' } })} />
              {errors.primerApellido && <p className="text-destructive text-sm">{errors.primerApellido.message}</p>}
            </div>

            <div>
              <Label>Segundo Apellido</Label>
              <Input {...register('segundoApellido', { pattern: { value: regex.nombre, message: 'Apellido inválido' } })} />
              {errors.segundoApellido && <p className="text-destructive text-sm">{errors.segundoApellido.message}</p>}
            </div>

            <div>
              <Label>Primer Nombre</Label>
              <Input {...register('primerNombre', { pattern: { value: regex.nombre, message: 'Nombre inválido' } })} />
              {errors.primerNombre && <p className="text-destructive text-sm">{errors.primerNombre.message}</p>}
            </div>

            <div>
              <Label>Segundo Nombre</Label>
              <Input {...register('segundoNombre')} />
            </div>

            <div>
              <Label>Tipo Identificación</Label>
              <Controller
                control={control}
                name="tipoId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockLists.tiposId.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Cédula</Label>
              <Input {...register('cedula', { required: 'Cédula requerida', pattern: { value: regex.cedula, message: 'Cédula inválida' } })} />
              {errors.cedula && <p className="text-destructive text-sm">{errors.cedula.message}</p>}
            </div>

            <div>
              <Label>Fecha Nacimiento</Label>
              <Input type="date" {...register('nacimiento', { required: 'Fecha requerida' })} />
              {errors.nacimiento && <p className="text-destructive text-sm">{errors.nacimiento.message}</p>}
            </div>

            <div>
              <Label>Género</Label>
              <Controller
                control={control}
                name="genero"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockLists.generos.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Correo</Label>
              <Input {...register('correo', { pattern: { value: regex.email, message: 'Email inválido' } })} />
              {errors.correo && <p className="text-destructive text-sm">{errors.correo.message}</p>}
            </div>

            <div>
              <Label>Vive en el país</Label>
              <Controller
                control={control}
                name="vivePais"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockLists.vivePais.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>País</Label>
              <Controller
                control={control}
                name="pais"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockLists.paises.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Profesión</Label>
              <Controller
                control={control}
                name="profesion"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockLists.profesiones.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Teléfono Habitación</Label>
              <Input {...register('telefonoCasa', { pattern: { value: regex.telefono, message: 'Teléfono inválido' } })} />
              {errors.telefonoCasa && <p className="text-destructive text-sm">{errors.telefonoCasa.message}</p>}
            </div>

            <div>
              <Label>Teléfono Celular</Label>
              <Input {...register('telefonoCelular', { pattern: { value: regex.telefono, message: 'Teléfono inválido' } })} />
              {errors.telefonoCelular && <p className="text-destructive text-sm">{errors.telefonoCelular.message}</p>}
            </div>

            <div className="col-span-2">
              <Label>Dirección Permanente</Label>
              <Textarea {...register('direccion')} rows={2} />
            </div>

            <div className="col-span-2">
              <Label>Observación</Label>
              <Textarea {...register('observacion')} rows={2} />
            </div>

            <div>
              <Label>Religión</Label>
              <Controller
                control={control}
                name="religion"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockLists.religiones.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Etnia</Label>
              <Controller
                control={control}
                name="etnia"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockLists.etnias.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="col-span-2">
              <Label>Consentimiento Envío Información</Label>
              <div className="flex items-center gap-4 mt-2">
                <Controller
                  control={control}
                  name="consentimiento"
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-2"><RadioGroupItem value="SI" />SI Desea</label>
                        <label className="flex items-center gap-2"><RadioGroupItem value="NO" />NO Desea</label>
                        <label className="flex items-center gap-2"><RadioGroupItem value="NA" />No ha dado consentimiento</label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="col-span-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>

          </form>
        </div>

      </DialogContent>
    </Dialog>
  );
}