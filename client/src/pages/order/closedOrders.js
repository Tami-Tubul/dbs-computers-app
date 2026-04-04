import { Heading, HStack, Text, VStack, Box, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { EditIcon, StarIcon, UnlockIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import naturalCompare from "../../utils/naturalCompare";
import getDeliveryText from "../../utils/getDeliveryText";
import api from "../../services/api";
import DataTable from "../../components/dataTable";
import {
  fullDateFormat,
  hebrewDateFormat,
  timeFormat,
} from "../../utils/formatDate";

const customProductSort = (a, b) => {
  const productA = a.original.products[0]?.product?.productName || "";
  const productB = b.original.products[0]?.product?.productName || "";
  return naturalCompare(productA, productB);
};

export default function ClosedOrders() {
  const token = useSelector((state) => state.userReducer.token);
  const orders = useSelector((state) => state.orderReducer.orders).filter(
    (o) => o.orderStatus === "סגורה"
  );
  const [filterOrders, setFilterOrders] = useState(null);
  // const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoize and sort orders by closeDate
  const sortedOrders = useMemo(() => {
    return orders
      .slice()
      .sort((a, b) => new Date(b.closeDate) - new Date(a.closeDate));
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
      columnHelper.accessor("remainingPrice", {
        cell: (info) => {
          return (
            <Text
              variant={"runningText"}
              color={
                info.getValue() > 0 ? "primary.error" : "primary.runningText"
              }
              maxW="300px"
              w="100%"
            >
              {info.getValue()}
            </Text>
          );
        },
        header: () => "נותר לתשלום",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("closeDate", {
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
        header: () => "תאריך סיום הזמנה",
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
          // const handleDelete = async () => {
          //     const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?");
          //     if (confirmed) {
          //         const resp = await api.epDeleteOrder(info.getValue(), token);
          //         const { message, removedProductIds } = resp.data;
          //         if (resp.status === 200) {
          //             dispatch({ type: "DELETE_ORDER", payload: info.getValue() });
          //             dispatch({ type: "UPDATE_PRODUCTS", payload: { removedProductIds } }); //update order products to available true
          //             alert(message);
          //         }
          //     }
          // };

          const handleReopen = async () => {
            const confirmed = window.confirm(
              "האם אתה בטוח שברצונך לפתוח את ההזמנה מחדש?"
            );
            if (!confirmed) return;

            try {
              const resp = await api.epReopenOrder(info.getValue(), token);
              const { message, reopenedOrder, affectedProducts } = resp.data;

              dispatch({ type: "REOPEN_ORDER", payload: reopenedOrder });
              dispatch({
                type: "UPDATE_PRODUCTS",
                payload: { addedProductIds: affectedProducts },
              });
              alert(message);
              navigate("/openOrders");
            } catch (error) {
              if (error.response && error.response.status === 400) {
                const { message, unavailableProducts } = error.response.data;
                let fullMessage = message;

                if (unavailableProducts && unavailableProducts.length > 0) {
                  const productNames = unavailableProducts
                    .map((p) => p.product?.productName)
                    .join(", ");
                  fullMessage += `\nהמוצרים הם: ${productNames}`;
                }

                alert(fullMessage);
              }
            }
          };

          return (
            <HStack justifyContent={"end"} gap={"20px"} flexWrap={"wrap"}>
              <Link
                to={`/editClosedOrder/${info.getValue()}`}
                title="ערוך הזמנה סגורה"
                aria-label="ערוך הזמנה סגורה"
              >
                <EditIcon w="22px" h="22px" color={"primary.dbsGoldenrod"} />
              </Link>
              <Button
                variant={"link"}
                onClick={handleReopen}
                title="פתח מחדש הזמנה שנסגרה"
                aria-label="פתח מחדש הזמנה שנסגרה"
              >
                <UnlockIcon w="22px" h="22px" color={"primary.dbsBlue"} />
              </Button>
              {/* <Button variant={"link"} onClick={handleDelete} title="מחק הזמנה סגורה" aria-label="מחק הזמנה סגורה">
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
  }, [sortedOrders]);

  // const onRowClick = (row) => {
  //     setSelectedRow(row);
  //   };

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        הזמנות סגורות
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
