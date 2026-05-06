import {
  Heading,
  HStack,
  Text,
  VStack,
  Box,
  Button,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Tabs,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "./../../components/dataTable";
import api from "../../services/api";

export default function Products() {
  const token = useSelector((state) => state.userReducer.token);
  const productsByCategory = useSelector(
    (state) => state.productReducer.products,
  );
  const [filtersByCategory, setFiltersByCategory] = useState({});
  // const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();
  const getColumns = (category) => {
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
      columnHelper.accessor("productName", {
        cell: (info) => {
          const row = info.row.original;
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "שם מוצר",
        enableSorting: true,
        enableFiltering: true,
      }),

      columnHelper.accessor("status", {
        cell: (info) => {
          return <Text variant="runningText">{info.getValue() || "-"}</Text>;
        },
        header: () => "סטטוס",
        enableSorting: true,
        enableFiltering: true,
      }),

      columnHelper.accessor("available", {
        cell: (info) => {
          return (
            <Text variant={"runningText"}>
              {info.getValue() ? "פנוי" : "תפוס"}
            </Text>
          );
        },
        header: () => "זמינות",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("specification", {
        cell: (info) => {
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "מפרט",
        enableSorting: true,
        enableFiltering: true,
      }),

      ...(category === "מחשבים"
        ? [
            columnHelper.accessor("computerDetails.softwares", {
              cell: (info) => {
                const softwares = info.getValue();
                return (
                  <Text variant={"runningText"}>
                    {info.getValue()?.join(", ") || "-"}
                  </Text>
                );
              },
              header: () => "תוכנות",
              enableSorting: true,
              enableFiltering: true,
            }),
          ]
        : []),

      columnHelper.accessor("currentOrder", {
        header: () => "קישור להזמנה",
        cell: (info) => {
          const orderId = info.getValue();

          if (!orderId) return <Text>-</Text>;

          return (
            <Link to={`/editOrder/${orderId}`}>
              <Text
                variant={"runningText"}
                color={"primary.linkBrandBright"}
                textDecoration="underline"
              >
                מעבר להזמנה
              </Text>
            </Link>
          );
        },
      }),

      columnHelper.accessor("_id", {
        cell: (info) => {
          const handleDelete = async () => {
            const confirmed = window.confirm(
              "האם אתה בטוח שברצונך למחוק את המוצר?",
            );
            if (confirmed) {
              try {
                const resp = await api.epDeleteProduct(info.getValue(), token);
                const { message } = resp.data;
                if (resp.status === 200) {
                  dispatch({
                    type: "DELETE_PRODUCT",
                    payload: info.getValue(),
                  });
                  alert(message);
                }
              } catch (error) {
                console.error(error);
                if (error.response.status === 400)
                  alert(error.response.data.message);
              }
            }
          };

          return (
            <HStack justifyContent={"end"} gap={"20px"} flexWrap={"wrap"}>
              <Link
                to={`/editProduct/${info.getValue()}`}
                title="ערוך פרטי מוצר"
                aria-label="ערוך פרטי מוצר"
              >
                <EditIcon w="22px" h="22px" color={"primary.dbsGoldenrod"} />
              </Link>
              <Button
                variant={"link"}
                onClick={handleDelete}
                title="מחק מוצר"
                aria-label="מחק מוצר"
              >
                <DeleteIcon w="22px" h="22px" color={"primary.error"} />
              </Button>
            </HStack>
          );
        },
        header: () => "",
      }),
    ];
  };

  // const onRowClick = (row) => {
  //     setSelectedRow(row);
  //   };

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        מוצרים
      </Heading>
      <Box
        h={"100%"}
        bgColor="#FBFBFB"
        borderRadius="20px"
        boxShadow="0 2px 20px 0px rgba(0,0,0,0.08)"
        px="28px"
        w="100%"
        maxW={"1200px"}
        position={"relative"}
      >
        <Button
          variant={"primary"}
          p="16px"
          onClick={() => navigate("/addProduct")}
          position={"absolute"}
          right={0}
          top={"-60px"}
        >
          הוסף מוצר
        </Button>

        <Tabs>
          <TabList>
            {productsByCategory.map((cat, index) => (
              <Tab key={cat.category}>
                {cat.category} ({cat.list.length})
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {productsByCategory.map((cat, index) => (
              <TabPanel key={cat.category} px={0}>
                <DataTable
                  // selectedRow={selectedRow}
                  // onRowClick={onRowClick}
                  columns={getColumns(cat.category)}
                  originalData={cat.list}
                  data={
                    filtersByCategory[cat.category]?.length
                      ? filtersByCategory[cat.category]
                      : cat.list
                  }
                  variant={"orders"}
                  scroll={true}
                  pageSize={10}
                  filteredData={(newData) =>
                    setFiltersByCategory((prev) => ({
                      ...prev,
                      [cat.category]: newData,
                    }))
                  }
                  isLoading={!cat.list}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </VStack>
  );
}
