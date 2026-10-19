import { useState } from "react"
import { Celda, conjuego, type Tabla } from "conjuego/por-defecto"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Casilla = Tabla["no_personal"]["gerundio"]
type Paradigma = Partial<Record<Celda, Casilla>>

interface Columna {
  titulo: string
  paradigma: (tabla: Tabla) => Paradigma
  prefijo?: string
}

interface Seccion {
  titulo: string
  columnas: Columna[]
}

const PERSONAS: { celda: Celda; pronombre: string }[] = [
  { celda: Celda.PRIMERA_SINGULAR, pronombre: "yo" },
  { celda: Celda.SEGUNDA_SINGULAR, pronombre: "tú" },
  { celda: Celda.SEGUNDA_SINGULAR_VOSEO, pronombre: "vos" },
  { celda: Celda.TERCERA_SINGULAR, pronombre: "él / ella / usted" },
  { celda: Celda.PRIMERA_PLURAL, pronombre: "nosotros" },
  { celda: Celda.SEGUNDA_PLURAL, pronombre: "vosotros" },
  { celda: Celda.TERCERA_PLURAL, pronombre: "ellos / ellas / ustedes" },
]

const SECCIONES: Seccion[] = [
  {
    titulo: "Indicativo · tiempos simples",
    columnas: [
      { titulo: "Presente", paradigma: (t) => t.indicativo.presente },
      { titulo: "Pretérito", paradigma: (t) => t.indicativo.preterito },
      { titulo: "Imperfecto", paradigma: (t) => t.indicativo.imperfecto },
      { titulo: "Futuro", paradigma: (t) => t.indicativo.futuro },
      { titulo: "Condicional", paradigma: (t) => t.indicativo.condicional },
    ],
  },
  {
    titulo: "Indicativo · tiempos compuestos",
    columnas: [
      { titulo: "Perfecto", paradigma: (t) => t.indicativo.perfecto },
      {
        titulo: "Pluscuamperfecto",
        paradigma: (t) => t.indicativo.pluscuamperfecto,
      },
      { titulo: "Anterior", paradigma: (t) => t.indicativo.anterior },
      {
        titulo: "Futuro perfecto",
        paradigma: (t) => t.indicativo.futuro_perfecto,
      },
      {
        titulo: "Condicional perfecto",
        paradigma: (t) => t.indicativo.condicional_perfecto,
      },
    ],
  },
  {
    titulo: "Subjuntivo · tiempos simples",
    columnas: [
      { titulo: "Presente", paradigma: (t) => t.subjuntivo.presente },
      {
        titulo: "Imperfecto (-ra)",
        paradigma: (t) => t.subjuntivo.imperfecto.ra,
      },
      {
        titulo: "Imperfecto (-se)",
        paradigma: (t) => t.subjuntivo.imperfecto.se,
      },
      { titulo: "Futuro", paradigma: (t) => t.subjuntivo.futuro },
    ],
  },
  {
    titulo: "Subjuntivo · tiempos compuestos",
    columnas: [
      { titulo: "Perfecto", paradigma: (t) => t.subjuntivo.perfecto },
      {
        titulo: "Pluscuamperfecto (-ra)",
        paradigma: (t) => t.subjuntivo.pluscuamperfecto.ra,
      },
      {
        titulo: "Pluscuamperfecto (-se)",
        paradigma: (t) => t.subjuntivo.pluscuamperfecto.se,
      },
      {
        titulo: "Futuro perfecto",
        paradigma: (t) => t.subjuntivo.futuro_perfecto,
      },
    ],
  },
  {
    titulo: "Imperativo",
    columnas: [
      { titulo: "Afirmativo", paradigma: (t) => t.imperativo.afirmativa },
      {
        titulo: "Negativo",
        paradigma: (t) => t.imperativo.negativa,
        prefijo: "no ",
      },
    ],
  },
]

const NO_PERSONALES: {
  titulo: string
  forma: (tabla: Tabla) => Casilla
}[] = [
    { titulo: "Infinitivo", forma: (t) => t.no_personal.infinitivo },
    { titulo: "Gerundio", forma: (t) => t.no_personal.gerundio },
    { titulo: "Participio", forma: (t) => t.no_personal.participio_pasado },
    {
      titulo: "Infinitivo compuesto",
      forma: (t) => t.no_personal.infinitivo_compuesto,
    },
    {
      titulo: "Gerundio compuesto",
      forma: (t) => t.no_personal.gerundio_compuesto,
    },
  ]

function conjugar(verbo: string): { tabla: Tabla | null; error: string | null } {
  if (!verbo.trim()) return { tabla: null, error: null }
  try {
    return { tabla: conjuego(verbo.trim()), error: null }
  } catch (e) {
    return { tabla: null, error: e instanceof Error ? e.message : String(e) }
  }
}

function Forma({
  casilla,
  prefijo = "",
}: {
  casilla: Casilla | undefined
  prefijo?: string
}) {
  if (casilla == null) return <span className="text-muted-foreground">—</span>
  if (typeof casilla === "string") return <span>{prefijo + casilla}</span>
  const [principal, ...variantes] = casilla
  return (
    <span className="flex flex-col">
      <span>{prefijo + principal}</span>
      {variantes.map((v) => (
        <span key={v} className="text-xs text-muted-foreground">
          {prefijo + v}
        </span>
      ))}
    </span>
  )
}

function TablaSeccion({
  seccion,
  tabla,
}: {
  seccion: Seccion
  tabla: Tabla | null
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">
        {seccion.titulo}
      </h2>
      <div className="rounded-lg border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Persona</TableHead>
              {seccion.columnas.map((c) => (
                <TableHead key={c.titulo} className="w-44">
                  {c.titulo}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERSONAS.map(({ celda, pronombre }) => (
              <TableRow key={celda}>
                <TableCell className="text-muted-foreground">
                  {pronombre}
                </TableCell>
                {seccion.columnas.map((c) => (
                  <TableCell key={c.titulo} className="align-top">
                    {tabla ? (
                      <Forma
                        casilla={c.paradigma(tabla)[celda]}
                        prefijo={c.prefijo}
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export function App() {
  const [verbo, setVerbo] = useState("tener")
  const { tabla, error } = conjugar(verbo)

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-medium">conjuego</h1>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a
              href="https://github.com/korovindn/conjuego"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/conjuego"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              npm
            </a>
          </nav>
        </div>
        <Input
          value={verbo}
          onChange={(e) => setVerbo(e.target.value)}
          placeholder="Infinitivo: tener, lavarse, googlear…"
          autoFocus
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          className="h-11 text-base"
        />
        <p className="min-h-5 text-sm text-muted-foreground">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : tabla ? null : (
            "Escribe un verbo en infinitivo"
          )}
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Formas no personales
        </h2>
        <div className="rounded-lg border">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                {NO_PERSONALES.map((f) => (
                  <TableHead key={f.titulo} className="w-44">
                    {f.titulo}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {NO_PERSONALES.map((f) => (
                  <TableCell key={f.titulo} className="align-top">
                    {tabla ? (
                      <Forma casilla={f.forma(tabla)} />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {SECCIONES.map((s) => (
        <TablaSeccion key={s.titulo} seccion={s} tabla={tabla} />
      ))}
    </div>
  )
}

export default App
