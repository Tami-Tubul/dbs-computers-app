import { Heading, HStack, Text, VStack, Box, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fullDateFormat,
  hebrewDateFormat,
  timeFormat,
} from "../../utils/formatDate";
import calculateDaysSince from "../../utils/calculateDaysSince";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DeleteIcon, EditIcon, LockIcon, StarIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import naturalCompare from "../../utils/naturalCompare";
import getDeliveryText from "../../utils/getDeliveryText";
import api from "../../services/api";
import DataTable from "../../components/dataTable";

const customProductSort = (a, b) => {
  const productA = a.original.products[0]?.product?.productName || "";
  const productB = b.original.products[0]?.product?.productName || "";
  return naturalCompare(productA, productB);
};

export default function OpenOrders() {
  const token = useSelector((state) => state.userReducer.token);
  const orders = useSelector((state) => state.orderReducer.orders).filter(
    (o) => o.orderStatus === "פתוחה",
  );
  const [filterOrders, setFilterOrders] = useState(null);
  // const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useDispatch();

  // Memoize and sort orders by orderDate
  const sortedOrders = useMemo(() => {
    return orders
      .slice()
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [orders]);

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
      columnHelper.accessor("customer", {
        cell: (info) => (
          <Text variant={"runningText"}>
            {`${info.getValue()?.firstname} ${info.getValue()?.lastname} ${
              info.getValue()?.phone
            }`}
          </Text>
        ),
        header: () => "פרטי לקוח",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("products", {
        cell: (info) => {
          const row = info.row.original;
          return (
            <Text variant={"runningText"}>
              {info.getValue().map((p, idx) => (
                <span
                  key={idx}
                  title={p.rentedAsAdvanced ? "הושכר כמתקדם" : ""}
                >
                  {p.product?.productName?.trim()}
                  {p.rentedAsAdvanced && (
                    <StarIcon color="primary.dbsGold" boxSize={3} mb={4} />
                  )}
                  {idx < info.getValue().length - 1 ? ", " : ""}
                </span>
              ))}
              {row.mouseQuantity > 0 ? `, עכבר*${row.mouseQuantity}` : ""}
            </Text>
          );
        },
        header: () => "מוצרים",
        enableSorting: true,
        enableFiltering: true,
        sortingFn: customProductSort, // Use custom sorting function
      }),
      columnHelper.accessor("orderDate", {
        cell: (info) => {
          return (
            <>
              <Text variant={"runningText"}>
                {fullDateFormat(info.getValue())}
              </Text>
              <Text variant={"runningText"}>
                {hebrewDateFormat(info.getValue()).split(",")[1]}
              </Text>
              <Text variant={"runningText"}>
                בשעה {timeFormat(info.getValue())}
              </Text>
            </>
          );
        },
        header: () => "תאריך הזמנה",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("delivery", {
        cell: (info) => <>{getDeliveryText(info.getValue())}</>,
        header: () => "משלוח",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("orderPrice", {
        cell: (info) => {
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "סכום ששולם",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("daysInUse", {
        cell: (info) => {
          const row = info.row.original;
          return (
            <Text variant={"runningText"}>
              {`${calculateDaysSince(row.orderDate)} ימים`}
            </Text>
          );
        },
        header: () => "מס' ימים בשימוש",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("createdBy", {
        cell: (info) => {
          const creator = info.getValue();
          return (
            <Text variant="runningText">{creator?.nickName || "לא ידוע"}</Text>
          );
        },
        header: () => 'נוצר ע"י',
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("_id", {
        cell: (info) => {
          const handleDelete = async () => {
            const confirmed = window.confirm(
              "האם אתה בטוח שברצונך למחוק את ההזמנה?",
            );
            if (confirmed) {
              const resp = await api.epDeleteOrder(info.getValue(), token);
              const { message, removedProductIds } = resp.data;
              if (resp.status === 200) {
                dispatch({ type: "DELETE_ORDER", payload: info.getValue() });
                dispatch({
                  type: "UPDATE_PRODUCTS",
                  payload: { removedProductIds },
                }); //update order products to available true
                alert(message);
              }
            }
          };

          return (
            <HStack justifyContent={"end"} gap={"20px"} flexWrap={"wrap"}>
              <Link
                to={`/editOrder/${info.getValue()}`}
                title="ערוך הזמנה"
                aria-label="ערוך הזמנה"
              >
                <EditIcon w="22px" h="22px" color={"primary.dbsGoldenrod"} />
              </Link>
              <Button
                variant={"link"}
                onClick={handleDelete}
                title="מחק הזמנה"
                aria-label="מחק הזמנה"
              >
                <DeleteIcon w="22px" h="22px" color={"primary.error"} />
              </Button>
              <Link
                to={`/closeOrder/${info.getValue()}`}
                title="סגור הזמנה"
                aria-label="סגור הזמנה"
              >
                <LockIcon w="22px" h="22px" color={"primary.dbsBlue"} />
              </Link>
            </HStack>
          );
        },
        header: () => "",
      }),
    ];
  }, [sortedOrders]);

  // const onRowClick = (row) => {
  //     setSelectedRow(row);
  //   };

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        הזמנות פתוחות
      </Heading>
      <Box
        h={"100%"}
        bgColor="#FBFBFB"
        borderRadius="20px"
        boxShadow="0 2px 20px 0px rgba(0,0,0,0.08)"
        px="28px"
        w="100%"
        maxW={"1600px"}
      >
        <DataTable
          // selectedRow={selectedRow}
          // onRowClick={onRowClick}
          columns={columns}
          originalData={sortedOrders}
          data={!filterOrders ? sortedOrders : filterOrders}
          variant={"orders"}
          scroll={true}
          pageSize={8}
          filteredData={(newData) => setFilterOrders(newData)}
          isLoading={
            !sortedOrders || sortedOrders.length === 0 || !filterOrders
          }
        />
      </Box>
    </VStack>
  );
}
