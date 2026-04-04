import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Spinner,
  VStack,
  HStack,
  Button,
  Text,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Popover,
  Input,
  Image,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  fullDateFormat,
  hebrewDateFormat,
  timeFormat,
} from "./../utils/formatDate";
import calculateDaysSince from "../utils/calculateDaysSince";
import { useDeepCompareMemo } from "use-deep-compare";

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";

function DataTable({
  selectedRow,
  onRowClick,
  columns,
  originalData,
  data,
  variant,
  scroll,
  pageSize,
  filteredData,
  isLoading,
  globalFilter,
  highlight,
  renderRowSubComponent,
}) {
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState([]);
  const [inputValues, setInputValues] = useState({});

  //Render the table only when the content of originalData changes and not the address in memory
  const memoizedOriginalData = useDeepCompareMemo(
    () => originalData,
    [originalData]
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize ?? 10,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,

    debugTable: false,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
  });

  const handleFilter = (colHeader, searchValue) => {
    if (searchValue && searchValue !== "") {
      //remove spaces
      const trimmedValue = searchValue.trim();

      // Adding the new filter to the filters array
      setFilters((prevFilters) => {
        const updatedFilters = prevFilters.filter(
          (filter) => !Object.prototype.hasOwnProperty.call(filter, colHeader)
        );
        updatedFilters.push({ [colHeader]: trimmedValue });
        return updatedFilters;
      });
    }
  };

  // filter data
  const getFilteredData = () => {
    const searchValueToLower = (searchValue) => searchValue.toLowerCase();

    const getCombinedCustomerFields = (field) => {
      if (!field) return { fullName: "", phone: "" };
      const fullName = `${(field.firstname || "").trim()} ${(
        field.lastname || ""
      ).trim()}`;
      const phone = `${(field.phone || "").trim()}`;
      return { fullName, phone };
    };

    const getCombineProducts = (field, row) => {
      if (!field && row.mouseQuantity === 0) return "";

      const stringProducts =
        field?.map((p) => p.product?.productName?.trim() || "").join(", ") ||
        "";
      const mouseText =
        row.mouseQuantity > 0 ? `עכבר*${row.mouseQuantity}` : "";

      if (stringProducts && mouseText) return `${stringProducts}, ${mouseText}`;
      if (stringProducts) return stringProducts;
      return mouseText;
    };

    const getDeliveryText = (field) => {
      if (!field || !field.enabled) return "לא";
      let parts = ["כן"];
      if (field.go?.enabled) {
        parts.push(`הלוך: ${field.go.payment ? "שולם" : "לא שולם"}`);
      }
      if (field.back?.enabled) {
        parts.push(`חזור: ${field.back.payment ? "שולם" : "לא שולם"}`);
      }
      return parts.join(", ");
    };

    const getCombinedDate = (field) => {
      if (!field) return "";
      return `${fullDateFormat(field)} ${
        hebrewDateFormat(field).split(",")[1]
      } בשעה ${timeFormat(field)}`;
    };

    const getCombinedDaysInUse = (field) => {
      if (!field) return "";
      return calculateDaysSince(field);
    };

    const filterData = originalData?.filter((item) =>
      filters.every((filterObj) => {
        const [colHeader, searchValue] = Object.entries(filterObj)[0];
        const field = item[colHeader];
        // const searchValueLower = searchValueToLower(searchValue);

        switch (colHeader) {
          case "customer": {
            const { fullName, phone } = getCombinedCustomerFields(field);
            return (
              fullName.includes(searchValue) || phone.includes(searchValue)
            );
          }
          case "fullname": {
            // Calculated column
            const fullNameCombined = `${(item.firstname || "").trim()} ${(
              item.lastname || ""
            ).trim()}`;
            return fullNameCombined.includes(searchValue);
          }
          case "products":
            return getCombineProducts(field, item).includes(searchValue);

          case "orderDate":
          case "closeDate":
          case "transactionDate":
            return getCombinedDate(field).includes(searchValue);

          case "delivery":
            return getDeliveryText(field).includes(searchValue);

          case "orderPrice":
          case "remainingPrice":
          case "amount":
            return Number(field) === Number(searchValue);

          case "daysInUse": // Calculated column
            return (
              Number(getCombinedDaysInUse(item.orderDate)) ===
              Number(searchValue)
            );

          case "createdBy": {
            const creator = field; // object
            return (creator?.nickName || "")
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          }
          default:
            return (
              field
                ?.toString()
                .toLowerCase()
                .includes(searchValue.toLowerCase()) || false
            );
        }
      })
    );

    filteredData(filterData);
  };

  // clear this filter
  const clearFilter = (colHeader) => {
    setFilters((prevFilters) =>
      prevFilters.filter(
        (filter) => !Object.prototype.hasOwnProperty.call(filter, colHeader)
      )
    );
  };

  // useEffect that will update the filtered data when the filters change
  useEffect(() => {
    getFilteredData();
  }, [filters, memoizedOriginalData]);

  return (
    <VStack w="100%" gap="32px">
      <Box
        w="100%"
        border={highlight ? "1px solid" : "none"}
        borderRadius={"20px"}
        borderColor={"primary.purple.default"}
      >
        <Table variant={variant ? variant : "transparent"}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup, hgIndex) => (
              <Tr key={`headerGroup-${hgIndex}`}>
                {headerGroup.headers.map((header, hIndex) => {
                  const meta = header.column.columnDef.meta;

                  return (
                    <Th
                      key={`header-${hgIndex}-${hIndex}`}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}
                      cursor={
                        header.column.columnDef.enableSorting
                          ? "pointer"
                          : "default"
                      }
                      whiteSpace={{ base: "normal", lg: "nowrap" }} // normal on small screens, nowrap on laptops and up
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.columnDef.enableSorting && (
                        <chakra.span w="fit-content">
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "desc" ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )
                          ) : null}
                        </chakra.span>
                      )}
                      {header.column.columnDef.enableFiltering && (
                        <Popover trigger="click" closeOnMouseLeave>
                          {({ isOpen, onClose }) => (
                            <>
                              <PopoverTrigger>
                                <Button
                                  px="8px"
                                  onClick={(e) => e.stopPropagation()} // Prevents sorting from running
                                >
                                  <Image
                                    src={
                                      filters.some((filter) =>
                                        Object.keys(filter).includes(
                                          header.column.id
                                        )
                                      )
                                        ? "/assets/icons/filter_selected.svg"
                                        : "/assets/icons/filter.svg"
                                    }
                                    w={15}
                                    h={15}
                                    alt="פתח חלון סינון עמודה"
                                  />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                onClick={(e) => e.stopPropagation()} // Stop propagation here
                              >
                                <PopoverHeader>
                                  סנן לפי {header.column.columnDef.header()}
                                </PopoverHeader>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <Button
                                  position="absolute"
                                  right="40px"
                                  p="0px"
                                  w="24px"
                                  h="24px"
                                  onClick={() => {
                                    setInputValues((prev) => ({
                                      ...prev,
                                      [header.column.id]: "",
                                    }));
                                    clearFilter(header.column.id);
                                    onClose(); // Close the popover
                                  }}
                                >
                                  <Image
                                    src="/assets/icons/garbage.svg"
                                    alt="נקה סינון"
                                    title="נקה סינון"
                                    w="24px"
                                    h="24px"
                                  />
                                </Button>
                                <PopoverBody
                                  onClick={(e) => e.stopPropagation()} // Stop propagation here
                                >
                                  <HStack
                                    justifyContent={"space-between"}
                                    gap="16px"
                                  >
                                    <Input
                                      width="260px"
                                      type="text"
                                      name={`searchby-${header.column.id}`}
                                      value={
                                        inputValues[header.column.id] || ""
                                      }
                                      onChange={(e) =>
                                        setInputValues((prev) => ({
                                          ...prev,
                                          [header.column.id]: e.target.value,
                                        }))
                                      }
                                    />
                                    <Button
                                      variant={"primary"}
                                      onClick={() => {
                                        handleFilter(
                                          header.column.id,
                                          inputValues[header.column.id]
                                        );
                                        onClose(); // Close the popover
                                      }}
                                    >
                                      סנן
                                    </Button>
                                  </HStack>
                                </PopoverBody>
                              </PopoverContent>
                            </>
                          )}
                        </Popover>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody h={isLoading ? "308px" : ""}>
            {table.getRowModel().rows.map((row, rowIndex) => {
              const isFinished = row.original.isFinished;
              return (
                <React.Fragment key={`row-${rowIndex}`}>
                  <Tr
                    // className={
                    //   selectedRow?.id == row.original.id ? "selected" : ""
                    // }
                    // onClick={
                    //   onRowClick
                    //     ? () => {
                    //         onRowClick(row.original);
                    //       }
                    //     : null
                    // }
                    pointerEvents={isFinished && "none"}
                    backgroundColor={isFinished && "#E1E1E1"}
                    opacity={isFinished && "0.5"}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                      const meta = cell.column.columnDef.meta;

                      return (
                        <Td
                          key={`cell-${rowIndex}-${cellIndex}`}
                          isNumeric={meta?.isNumeric}
                          width={meta?.maxWidth ?? false}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                  {row.getIsExpanded() && (
                    <Tr>
                      <Td colSpan={table.getAllColumns().length}>
                        {renderRowSubComponent({ row })}
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              );
            })}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <Tr>
                <Td textAlign={"center"} colSpan={table.getAllColumns().length}>
                  אין תוצאות
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      {isLoading && (
        <Box
          position={"absolute"}
          top="60px"
          bottom="0"
          left="0"
          right="0"
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          bgColor={"transparent"}
          backdropFilter={"blur(5px)"}
        >
          <VStack
            width={"300px"}
            h="150px"
            borderRadius={"12px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            bgColor={"primary.black"}
          >
            <Spinner variant="brand" />
            <Text variant={"body12sb"} color="light.32">
              טוען נתונים...
            </Text>
          </VStack>
        </Box>
      )}

      {table.getPageCount() > 1 && table.getPageCount() <= 10 && (
        <HStack justifyContent={"flex-start"} mb="16px" w="100%">
          {Array.from({ length: table.getPageCount() }, (_, index) => (
            <Button
              key={`page-${index}`}
              variant={"paging"}
              data-index={index}
              data-current={table.getState().pagination.pageIndex}
              onClick={() => table.setPageIndex(index)}
              isDisabled={table.getState().pagination.pageIndex === index}
            >
              {index + 1}
            </Button>
          ))}
        </HStack>
      )}

      {table.getPageCount() > 10 && (
        <HStack justifyContent={"flex-start"} ml="24px" mb="16px" w="100%">
          <Button
            variant={"paging"}
            onClick={() => table.setPageIndex(0)}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant={"paging"}
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            variant={"paging"}
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            variant={"paging"}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            isDisabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
          <HStack>
            <Text variant={"body12m"} color={"primary.white"}>
              עמוד
            </Text>
            <Text variant={"body12m"} color={"primary.white"}>
              {table.getState().pagination.pageIndex + 1} מתוך{" "}
              {table.getPageCount()}
            </Text>
          </HStack>
        </HStack>
      )}
    </VStack>
  );
}

export default DataTable;
