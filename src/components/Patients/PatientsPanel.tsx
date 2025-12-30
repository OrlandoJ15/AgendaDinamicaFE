import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Patient } from '@/types/medical';

type Props = {
  patients: Patient[];

  searchName: string;
  searchCedula: string;

  onSearchNameChange: (v: string) => void;
  onSearchCedulaChange: (v: string) => void;

  onSearchByName: () => void;
  onSearchByCedula: () => void;

  onNew: () => void;
  onView: (p: Patient) => void;
  onEdit: (p: Patient) => void;
  onDelete: (p: Patient) => void;
};

export default function PatientsPanel({
  patients,
  searchName,
  searchCedula,
  onSearchNameChange,
  onSearchCedulaChange,
  onSearchByName,
  onSearchByCedula,
  onNew,
  onView,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pacientes</h2>
        <Button onClick={onNew}>Nuevo Paciente</Button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3 items-end">

        {/* Búsqueda por nombre */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Apellidos del paciente"
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
          />
          <Button variant="outline" onClick={onSearchByName}>
            Buscar
          </Button>
        </div>

        {/* Búsqueda por identificación */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Número identificación"
            value={searchCedula}
            onChange={(e) => onSearchCedulaChange(e.target.value)}
          />
          <Button variant="outline" onClick={onSearchByCedula}>
            Buscar
          </Button>
        </div>
      </div>

      {/* LISTA */}
      <div className="grid gap-2">
        {patients.map(p => (
          <Card key={p.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">
                {p.nomPaciente}
              </div>
              <div className="text-sm text-muted-foreground">
                Identificación: {p.numId}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(p)}>
                Ver
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(p)}>
                Modificar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(p)}>
                Eliminar
              </Button>
            </div>
          </Card>
        ))}

        {patients.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No se encontraron pacientes.
          </div>
        )}
      </div>
    </div>
  );
}
