import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request, { params: { id } }) {
  try {
    const estudiante = await prisma.estudiante.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!estudiante) {
      return NextResponse.json(
        { mensaje: "Estudiante no existe" },
        { status: 404 }
      );
    }
    return NextResponse.json(estudiante);
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

export async function DELETE(request, { params: { id } }) {
  try {
    const deletEstudiante = await prisma.estudiante.delete({
      where: {
        id: Number(id),
      },
    });
    if (!deletEstudiante) {
      return NextResponse.json(
        { mensaje: "Estudiante no fue eliminado exitosamente" },
        { status: 404 }
      );
    }
    return NextResponse.json(deletEstudiante);
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

export async function PUT(request, { params: { id } }) {
  try {
    const { nombre, genero, edad, carrere } = await request.json();
    const updatedEstudiante = await prisma.estudiante.update({
      where: {
        id: Number(id),
      },
      data: {
        nombre,
        genero,
        edad,
        carrere,
      },
    });
    return NextResponse.json(updatedEstudiante);
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
