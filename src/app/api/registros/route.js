import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const estudiantes = await prisma.estudiante.findMany();
    return NextResponse.json(estudiantes);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          mensaje: error.message,
        },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const { nombre, genero, edad, carrere } = await request.json();
    const nuevoEstudiante = await prisma.estudiante.create({
      data: {
        nombre,
        genero,
        edad,
        carrere,
      },
    });
    return NextResponse.json(nuevoEstudiante);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          mensaje: error.message,
        },
        { status: 500 }
      );
    }
  }
}
