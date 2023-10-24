"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { columns } from "./data";
import { capitalize } from "../libs/utils";
const API_BASE_URL = "http://localhost:3000/api/registros";

const handleDelete = async (user) => {
  if (
    window.confirm(`¿Estás seguro de que deseas eliminar a ${user.nombre}?`)
  ) {
    try {
      const response = await fetch(`/api/registros/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      } else {
        const data = await response.json();
        console.error(data.mensaje);
      }
    } catch (error) {
      console.error("Error al eliminar al estudiante:", error);
    }
  }
};

const INITIAL_VISIBLE_COLUMNS = ["nombre", "genero", "edad", "carrere"];

function renderCell(user, columnKey) {
  const cellValue = user[columnKey];

  switch (columnKey) {
    case "genero":
      return <p className="text-bold text-small capitalize">{cellValue}</p>;
    case "edad":
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          size="sm"
          variant="dot"
        >
          {cellValue}
        </Chip>
      );
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Button
            size="sm"
            variant="filled"
            color="orange"
            // onClick={() => handleEdit(user)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="filled"
            color="red"
            textColor="white"
            onClick={() => handleDelete(user)}
          >
            Eliminar
          </Button>
        </div>
      );
    default:
      return cellValue;
  }
}

function DashboardPrisma() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set([...INITIAL_VISIBLE_COLUMNS, "actions"])
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: "",
    genero: "",
    edad: "",
    carrere: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          genero: item.genero,
          edad: item.edad,
          carrere: item.carrere,
        }));
        setUsers(transformedData);
      } else {
        console.error("Failed to fetch data from the API");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  const pages = Math.ceil(users.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [users, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleNewUserChange = (field, value) => {
    setNewUser({
      ...newUser,
      [field]: value,
    });
  };

  const handleSaveNewUser = async () => {
    const newUserWithIntEdad = {
      ...newUser,
      edad: parseInt(newUser.edad, 10),
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserWithIntEdad),
      });

      if (response.ok) {
        fetchData();
        setNewUser({
          nombre: "",
          genero: "",
          edad: "",
          carrere: "",
        });
        setShowCreateForm(false);
      } else {
        const data = await response.json();
        console.error(data.mensaje);
      }
    } catch (error) {
      console.error("Error al crear el estudiante:", error);
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex items-center w-full sm:max-w-[44%] border-1">
            <SearchIcon className="text-white mr-2" />
            <Input
              isClearable
              classNames={{
                base: "w-full",
                inputWrapper: "border-none",
              }}
              placeholder="Search by name..."
              size="sm"
              value={filterValue}
              variant="bordered"
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
              style={{
                color: "black",
                borderRadius: "9px",
                border: "1px solid white",
                paddingBlock: "3px",
                paddingLeft: "3px",
                paddingRight: "3px",
                paddingTop: "3px",
              }}
            />
          </div>
          <div className="flex gap-3 items-center">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem
                    key={column.uid}
                    className="capitalize text-white"
                  >
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="flex items-center">
              <Button
                className="bg-foreground text-background"
                size="sm"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                Añadir nuevo
              </Button>
              <PlusIcon className="text-background ml-1" />{" "}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} Estudiantes
          </span>
          <label className="flex items-center text-small">
            Filas por página:
            <select
              className="bg-black text-white outline-none text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
          nextLabel="use client"
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination, and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {showCreateForm && (
        <div className="mt-3">
          <h2 className="text-default-500 text-2xl font-semibold mb-2">
            Crear Nuevo Estudiante
          </h2>
          <Input
            className="mb-2"
            placeholder="Nombre"
            value={newUser.nombre}
            onChange={(e) => handleNewUserChange("nombre", e.target.value)}
            style={{
              color: "black",
              borderRadius: "9px",
              border: "1px solid white",
              paddingBlock: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
            }}
          />
          <Input
            className="mb-2"
            placeholder="Genero"
            value={newUser.genero}
            onChange={(e) => handleNewUserChange("genero", e.target.value)}
            style={{
              color: "black",
              borderRadius: "9px",
              border: "1px solid white",
              paddingBlock: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
            }}
          />
          <Input
            className="mb-2"
            placeholder="Edad"
            value={newUser.edad}
            onChange={(e) => handleNewUserChange("edad", e.target.value)}
            style={{
              color: "black",
              borderRadius: "9px",
              border: "1px solid white",
              paddingBlock: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
            }}
          />
          <Input
            className="mb-2"
            placeholder="Carrera"
            value={newUser.carrere}
            onChange={(e) => handleNewUserChange("carrere", e.target.value)}
            style={{
              color: "black",
              borderRadius: "9px",
              border: "1px solid white",
              paddingBlock: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
            }}
          />
          <Button
            className="mt-2"
            size="sm"
            onClick={handleSaveNewUser}
            style={{
              borderRadius: "9px",
              border: "1px solid white",
              paddingBlock: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
            }}
          >
            Guardar Nuevo Estudiante
          </Button>
          <Button
            className="mt-2 ml-2"
            size="sm"
            onClick={() => setShowCreateForm(false)}
            style={{
              borderRadius: "9px",
              border: "1px solid white",
              paddingBlock: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
            }}
          >
            Cerrar
          </Button>
        </div>
      )}
    </div>
  );
}

export default DashboardPrisma;
