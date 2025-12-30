import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Pencil, Trash2, Building2, Paperclip } from "lucide-react";

interface CartaSeguro {
  id: number;
  fecha: string;
  nombreCompleto: string;
  sucursal: string;
  estatus: string;
  aseguradora: string;
  documento?: string; // ruta o nombre del PDF
}

const aseguradoras = [
  "BMI",
  "Geo Blue",
  "Bupa",
  "Redbridge",
  "Panamerican",
  "Sandoz",
  "Adisa",
  "Koris",
  "Femsa",
  "INS",
  "Profesionales Aleate",
];

const sucursales = ["San José", "Al Este", "Santa Ana"];

const CartasSeguroPanel: React.FC = () => {
  const [cartas, setCartas] = useState<CartaSeguro[]>([]);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [cartaEditando, setCartaEditando] = useState<CartaSeguro | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);

  const [formulario, setFormulario] = useState({
    fecha: "",
    nombreCompleto: "",
    sucursal: sucursales[0],
    estatus: "Pendiente",
    aseguradora: aseguradoras[0],
  });

  const guardarCarta = async () => {
    let documentoRuta = "";

    // Si hay archivo, lo subimos al servidor
    if (archivo) {
      const formData = new FormData();
      formData.append("file", archivo);

      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      //documentoRuta = res.data.path; // el backend devuelve la ruta del archivo
      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
    }

    if (cartaEditando) {
      setCartas((prev) =>
        prev.map((c) =>
          c.id === cartaEditando.id ? { ...c, ...formulario, documento: documentoRuta || c.documento } : c
        )
      );
    } else {
      setCartas((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formulario,
          documento: documentoRuta,
        },
      ]);
    }

    setFormulario({
      fecha: "",
      nombreCompleto: "",
      sucursal: sucursales[0],
      estatus: "Pendiente",
      aseguradora: aseguradoras[0],
    });
    setArchivo(null);
    setCartaEditando(null);
    setDialogoAbierto(false);
  };

  const editarCarta = (carta: CartaSeguro) => {
    setCartaEditando(carta);
    setFormulario({
      fecha: carta.fecha,
      nombreCompleto: carta.nombreCompleto,
      sucursal: carta.sucursal,
      estatus: carta.estatus,
      aseguradora: carta.aseguradora,
    });
    setDialogoAbierto(true);
  };

  const eliminarCarta = (id: number) => {
    setCartas((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Gestión de Cartas de Seguros
          </h3>
          <Badge variant="outline">Listado general</Badge>
        </div>

        <div className="flex items-center justify-end mb-6">
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Nueva Carta
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {cartaEditando ? "Editar Carta" : "Agregar Nueva Carta"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 mt-4">
                <Input
                  type="date"
                  placeholder="Fecha"
                  value={formulario.fecha}
                  onChange={(e) =>
                    setFormulario({ ...formulario, fecha: e.target.value })
                  }
                />
                <Input
                  placeholder="Nombre Completo"
                  value={formulario.nombreCompleto}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nombreCompleto: e.target.value,
                    })
                  }
                />

                <Select
                  value={formulario.aseguradora}
                  onValueChange={(valor) =>
                    setFormulario({ ...formulario, aseguradora: valor })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione aseguradora" />
                  </SelectTrigger>
                  <SelectContent>
                    {aseguradoras.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formulario.sucursal}
                  onValueChange={(valor) =>
                    setFormulario({ ...formulario, sucursal: valor })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {sucursales.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formulario.estatus}
                  onValueChange={(valor) =>
                    setFormulario({ ...formulario, estatus: valor })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>

                {/* Campo de carga de PDF */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Paperclip className="w-4 h-4" /> Documento PDF
                  </label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setArchivo(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogoAbierto(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={guardarCarta}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabla general */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Aseguradora</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead className="w-24 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartas.map((carta) => (
              <TableRow key={carta.id}>
                <TableCell>{carta.fecha}</TableCell>
                <TableCell>{carta.nombreCompleto}</TableCell>
                <TableCell>{carta.aseguradora}</TableCell>
                <TableCell>{carta.sucursal}</TableCell>
                <TableCell>{carta.estatus}</TableCell>
                <TableCell>
                  {carta.documento ? (
                    <a
                      href={`http://localhost:4000/${carta.documento}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Ver PDF
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editarCarta(carta)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => eliminarCarta(carta.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CartasSeguroPanel;
