import { Heading, HStack, Text, VStack, Box, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { EditIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "./../../components/dataTable";

export default function Customers() {
  const token = useSelector((state) => state.userReducer.token);
  const customers = useSelector((state) => state.customerReducer.customers);
  const sortedCustomers = [...customers].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  const [filterOrders, setFilterOrders] = useState(null);
  // const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();
  const columns = useMemo(() => {
    return [
      // columnHelper.accessor("_id", {
      //   cell: (info) =>
      //     <Checkbox
      //       isChecked={selectedRows.includes(info.row.original.id)}
      //       onChange={() => onRowClick(info.row.original.id)}
      //     />,
      //   header: () => "בחר",
      //   enableSorting: false,
      //   enableFiltering: false,
      // }),
      columnHelper.accessor("fullname", {
        cell: (info) => {
          const row = info.row.original;
          return (
            <Text variant={"runningText"}>
              {`${row.firstname} ${row.lastname}`}
            </Text>
          );
        },
        header: () => "שם לקוח",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("phone", {
        cell: (info) => {
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "טלפון",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("address", {
        cell: (info) => {
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "כתובת",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("email", {
        cell: (info) => {
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "מייל",
        enableSorting: true,
        enableFiltering: true,
      }),

      columnHelper.accessor("_id", {
        cell: (info) => {
          // const handleDelete = async () => {
          //     const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק את הלקוח?");
          //     if (confirmed) {
          //         const resp = await api.epDeleteCustomer(info.getValue(), token);
          //         const { message, removedProductIds } = resp.data;
          //         if (resp.status === 200) {
          //             dispatch({ type: "DELETE_CUSTOMER", payload: info.getValue() });
          //             dispatch({ type: "UPDATE_PRODUCTS", payload: { removedProductIds } }); //update order products to available true
          //             alert(message);
          //         }
          //     }
          // };

          return (
            <HStack justifyContent={"end"} gap={"20px"} flexWrap={"wrap"}>
              <Link
                to={`/editCustomer/${info.getValue()}`}
                title="ערוך פרטי לקוח"
                aria-label="ערוך פרטי לקוח"
              >
                <EditIcon w="22px" h="22px" color={"primary.dbsGoldenrod"} />
              </Link>
              {/* <Button variant={"link"} onClick={handleDelete} title="מחק לקוח" aria-label="מחק לקוח">
                                <DeleteIcon
                                    w="22px"
                                    h="22px"
                                    color={"primary.error"}
                                />
                            </Button> */}
            </HStack>
          );
        },
        header: () => "",
      }),
    ];
  }, [sortedCustomers]);

  // const onRowClick = (row) => {
  //     setSelectedRow(row);
  //   };

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        לקוחות
      </Heading>
      <Box
        h={"100%"}
        bgColor="#FBFBFB"
        borderRadius="20px"
        boxShadow="0 2px 20px 0px rgba(0,0,0,0.08)"
        px="28px"
        w="100%"
        maxW={"1000px"}
        position={"relative"}
      >
        <Button
          variant={"primary"}
          p="16px"
          onClick={() => navigate("/addCustomer")}
          position={"absolute"}
          right={0}
          top={"-60px"}
        >
          הוסף לקוח
        </Button>
        <DataTable
          // selectedRow={selectedRow}
          // onRowClick={onRowClick}
          columns={columns}
          originalData={sortedCustomers}
          data={!filterOrders ? sortedCustomers : filterOrders}
          variant={"orders"}
          scroll={true}
          pageSize={8}
          filteredData={(newData) => setFilterOrders(newData)}
          isLoading={
            !sortedCustomers || sortedCustomers.length === 0 || !filterOrders
          }
        />
      </Box>
    </VStack>
  );
}
