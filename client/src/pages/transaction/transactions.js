import {
  Heading,
  HStack,
  Text,
  VStack,
  Box,
  Image,
  Button,
  Select,
  Tag,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { dateFormat, getMonthYear } from "../../utils/formatDate";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as TooltipChart,
} from "recharts";
import naturalCompare from "../../utils/naturalCompare";
import api from "../../services/api";
import DataTable from "./../../components/dataTable";

export default function Transactions() {
  const token = useSelector((state) => state.userReducer.token);
  const currentUser = useSelector((state) => state.userReducer);
  const isAdmin = currentUser.role === "admin";

  const users = useSelector((state) => state.userReducer.users);
  const transactions = useSelector(
    (state) => state.transactionReducer.transactions
  );
  const orders = useSelector((state) => state.orderReducer.orders);

  // const [selectedRow, setSelectedRow] = useState(null);
  const [filterTransactions, setFilterTransactions] = useState(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedUser, setSelectedUser] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // calculate data per month
  const calculateMonthlyData = (transactions, orders, year, effectiveUser) => {
    const monthlyData = {};

    // Helper function to add an amount to all months from transactionDate until fixedTransactionEndDate
    const addRecurringTransaction = (transaction) => {
      let currentDate = new Date(transaction.transactionDate);
      let endDate = new Date(transaction.fixedTransactionEndDate);

      // Make sure hours, minutes, and seconds don't affect the comparison
      currentDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      while (currentDate <= endDate) {
        const monthYear = getMonthYear(currentDate.toISOString()); // mm/yyyy

        if (currentDate.getFullYear() === year) {
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { income: 0, expense: 0, orderIncome: 0 };
          }
          if (transaction.transactionName === "הכנסה") {
            monthlyData[monthYear].income += transaction.amount;
          } else if (transaction.transactionName === "הוצאה") {
            monthlyData[monthYear].expense += transaction.amount;
          }
        }
        // Move to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    };

    // Calculate data from transactions table
    transactions.forEach((transaction) => {
      if (
        effectiveUser !== "all" &&
        transaction.createdBy?._id !== effectiveUser
      )
        return;

      if (transaction.transactionType === "קבועה") {
        addRecurringTransaction(transaction);
      } else {
        const monthYear = getMonthYear(transaction.transactionDate); // mm/yyyy
        const [m, transactionYear] = monthYear.split("/");

        if (parseInt(transactionYear) === year) {
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { income: 0, expense: 0, orderIncome: 0 };
          }
          if (transaction.transactionName === "הכנסה") {
            monthlyData[monthYear].income += transaction.amount;
          } else if (transaction.transactionName === "הוצאה") {
            monthlyData[monthYear].expense += transaction.amount;
          }
        }
      }
    });

    // Calculate data from orders table
    orders.forEach((order) => {
      if (!order.payments || !Array.isArray(order.payments)) return;

      if (effectiveUser !== "all" && order.createdBy?._id !== effectiveUser)
        return;

      order.payments.forEach((payment) => {
        const monthYear = getMonthYear(payment.date);
        const [m, paymentYear] = monthYear.split("/");

        if (parseInt(paymentYear) === year) {
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { income: 0, expense: 0, orderIncome: 0 };
          }
          monthlyData[monthYear].orderIncome += payment.amount;
        }
      });
    });

    // Convert object to array and sort by month-year using naturalCompare
    return Object.keys(monthlyData)
      .sort(naturalCompare)
      .map((monthYear) => ({
        name: monthYear,
        income: monthlyData[monthYear].income,
        expense: monthlyData[monthYear].expense,
        orderIncome: monthlyData[monthYear].orderIncome,
      }));
  };

  const effectiveUser = isAdmin ? selectedUser : currentUser.userId;
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  // Filter transactions based on selected user (if admin) or show own transactions (if not admin)
  const displayedTransactions = useMemo(() => {
    if (effectiveUser === "all") return sortedTransactions;
    return sortedTransactions.filter((t) => t.createdBy?._id === effectiveUser);
  }, [sortedTransactions, effectiveUser]);

  // chart data
  const chartData = useMemo(
    () =>
      calculateMonthlyData(transactions, orders, selectedYear, effectiveUser),
    [transactions, orders, selectedYear, effectiveUser]
  );

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
      columnHelper.accessor("transactionName", {
        cell: (info) => {
          return (
            <Text
              variant={"runningTextSb"}
              color={info.getValue() === "הכנסה" ? "green" : "red"}
            >
              {info.getValue()}
            </Text>
          );
        },
        header: () => "שם הפעולה",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("transactionType", {
        cell: (info) => {
          return (
            <Tag
              colorScheme={info.getValue() === "רגילה" ? "gray" : "orange"}
              size="lg"
            >
              {info.getValue()}
            </Tag>
          );
        },
        header: () => "סוג הפעולה",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("amount", {
        cell: (info) => {
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "סכום",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("description", {
        cell: (info) => {
          return <Text variant={"runningText"}>{info.getValue()}</Text>;
        },
        header: () => "תיאור",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("transactionDate", {
        cell: (info) => {
          return (
            <Text variant={"runningText"}>{dateFormat(info.getValue())}</Text>
          );
        },
        header: () => "תאריך",
        enableSorting: true,
        enableFiltering: true,
      }),
      columnHelper.accessor("fixedTransactionEndDate", {
        cell: (info) => {
          return (
            <Text variant={"runningText"}>{dateFormat(info.getValue())}</Text>
          );
        },
        header: () => "תאריך סיום",
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
              "האם אתה בטוח שברצונך למחוק את הפעולה?"
            );
            if (confirmed) {
              const resp = await api.epDeleteTransaction(
                info.getValue(),
                token
              );
              const { message } = resp.data;
              if (resp.status === 200) {
                dispatch({
                  type: "DELETE_TRANSACTION",
                  payload: info.getValue(),
                });
                alert(message);
              }
            }
          };

          const handleStop = async () => {
            const confirmed = window.confirm(
              `האם אתה בטוח שברצונך לסיים את ה${info.row.original.transactionName} הקבועה?`
            );
            if (confirmed) {
              const resp = await api.epFinishTransaction(
                info.getValue(),
                token
              );
              const { message } = resp.data;
              if (resp.status === 200) {
                dispatch({
                  type: "FINISH_TRANSACTION",
                  payload: {
                    ...info.row.original,
                    fixedTransactionEndDate: new Date().toISOString(),
                    isFinished: true,
                  },
                });
                alert(message);
              }
            }
          };

          return (
            <HStack justifyContent={"end"} gap={"20px"} flexWrap={"wrap"}>
              {!info.row.original.isFinished &&
              info.row.original.transactionType === "קבועה" ? (
                <Button
                  variant={"link"}
                  onClick={handleStop}
                  title={`סיים ${info.row.original.transactionName} קבועה`}
                >
                  {/* <NotAllowedIcon
                                        w="22px"
                                        h="22px"
                                        aria-label={`סיים ${info.row.original.transactionName} קבועה`}
                                    /> */}
                  <Image
                    src="/assets/icons/stopHand.png"
                    w="22px"
                    h="22px"
                    alt={`סיים ${info.row.original.transactionName} קבועה`}
                  />
                </Button>
              ) : (
                info.row.original.isFinished && (
                  <Text variant={"runningText"}>הסתיימה</Text>
                )
              )}
              <Link
                to={`/editTransaction/${info.getValue()}`}
                title="ערוך פעולה"
                aria-label="ערוך פעולה"
              >
                <EditIcon w="22px" h="22px" color={"primary.dbsGoldenrod"} />
              </Link>
              <Button
                variant={"link"}
                onClick={handleDelete}
                title="מחק פעולה"
                aria-label="מחק פעולה"
              >
                <DeleteIcon w="22px" h="22px" color={"primary.error"} />
              </Button>
            </HStack>
          );
        },
        header: () => "",
      }),
    ];
  }, [sortedTransactions]);

  // const onRowClick = (row) => {
  //     setSelectedRow(row);
  //   };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // standart mobile size (768px)
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // call the function at the beginning to update the status

    return () => window.removeEventListener("resize", handleResize); // reset
  }, []);

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        ניהול הוצאות והכנסות
      </Heading>

      <Box
        position="relative"
        width="100%"
        height={350}
        display={"flex"}
        flexDirection={"column"}
        gap={"10px"}
        mb={"50px"}
      >
        <HStack gap="20px">
          {/* select year */}
          <HStack>
            <Text variant={"runningText"}>בחר שנה:</Text>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              width="130px"
            >
              {[...Array(currentYear - 2023)].map((_, i) => {
                const year = currentYear - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </Select>
          </HStack>
          {/* select user */}
          {isAdmin && (
            <HStack>
              <Text variant={"runningText"}>בחר משתמש:</Text>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                width="160px"
              >
                <option value="all">כל המשתמשים</option>
                {users.map((user) => {
                  return (
                    <option key={user._id} value={user._id}>
                      {user.nickName}
                    </option>
                  );
                })}
              </Select>
            </HStack>
          )}
        </HStack>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(tick) => {
                if (isMobile) {
                  return tick.split("/")[0]; // show only month in mobile
                }
                return tick; // yyyy-mm
              }}
            />
            <YAxis />
            <TooltipChart
              labelFormatter={(label, payload) => {
                if (payload && payload.length) {
                  const income = payload[0].payload.income || 0;
                  const orderIncome = payload[0].payload.orderIncome || 0;
                  const expense = payload[0].payload.expense || 0;
                  const profit = income + orderIncome - expense;

                  return (
                    <>
                      <Text as="span" variant={"runningTextSb"}>
                        {label}
                      </Text>
                      <br />
                      <Tag
                        variant={"outline"}
                        colorScheme="blue"
                        size="lg"
                        my="10px"
                        fontWeight={"600"}
                      >
                        {`רווח: ${profit.toLocaleString()}`}
                      </Tag>
                    </>
                  );
                }
                return label;
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="green" name="הכנסות" />
            <Bar dataKey="orderIncome" fill="goldenrod" name="הכנסות מהזמנות" />
            <Bar dataKey="expense" fill="red" name="הוצאות" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box
        h={"100%"}
        bgColor="#FBFBFB"
        borderRadius="20px"
        boxShadow="0 2px 20px 0px rgba(0,0,0,0.08)"
        px="28px"
        w="100%"
        maxW={"1600px"}
        position={"relative"}
      >
        <Button
          variant={"primary"}
          p="16px"
          onClick={() => navigate("/addTransaction")}
          position={"absolute"}
          right={0}
          top={"-60px"}
        >
          הוסף פעולה
        </Button>

        <DataTable
          // selectedRow={selectedRow}
          // onRowClick={onRowClick}
          columns={columns}
          originalData={displayedTransactions}
          data={
            !filterTransactions ? displayedTransactions : filterTransactions
          }
          variant={"orders"}
          scroll={true}
          pageSize={8}
          filteredData={(newData) => setFilterTransactions(newData)}
          isLoading={!transactions || transactions.length === 0}
        />
      </Box>
    </VStack>
  );
}
