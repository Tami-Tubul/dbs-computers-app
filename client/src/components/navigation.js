"use client";
import React, { useEffect, useState } from "react";
import {
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Navigation() {
  const [activeLink, setActiveLink] = useState();
  const { pathname } = useLocation();
  const userRole = useSelector((state) => state.userReducer.role);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  return (
    <HStack w="100%" gap="40px">
      <Menu>
        <MenuButton
          as={Text}
          variant="runningTextSb"
          cursor="pointer"
          _hover={{ color: "primary.dbsGoldenrod" }}
        >
          הזמנות
        </MenuButton>
        <MenuList
          onMouseEnter={(e) => e.currentTarget.focus()}
          onMouseLeave={(e) => e.currentTarget.blur()}
        >
          <Link to="/addOrder">
            <MenuItem
              fontWeight={600}
              color={
                activeLink === "/addOrder"
                  ? "primary.dbsGoldenrod"
                  : "primary.runningText"
              }
              _hover={{ color: "primary.dbsGoldenrod" }}
            >
              הזמנה חדשה
            </MenuItem>
          </Link>
          <Link to="/openOrders">
            <MenuItem
              fontWeight={600}
              color={
                activeLink === "/openOrders"
                  ? "primary.dbsGoldenrod"
                  : "primary.runningText"
              }
              _hover={{ color: "primary.dbsGoldenrod" }}
            >
              הזמנות פתוחות
            </MenuItem>
          </Link>
          <Link to="/closedOrders">
            <MenuItem
              fontWeight={600}
              color={
                activeLink === "/closedOrders"
                  ? "primary.dbsGoldenrod"
                  : "primary.runningText"
              }
              _hover={{ color: "primary.dbsGoldenrod" }}
            >
              הזמנות סגורות
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
      <Link to={"/customers"}>
        <HStack>
          {/* <Image
            src=""
            alt=""
            width={28}
            height={28}
          /> */}
          <Text
            variant="runningTextSb"
            as="span"
            color={
              activeLink === "/customers"
                ? "primary.dbsGoldenrod"
                : "primary.runningText"
            }
            _hover={{ color: "primary.dbsGoldenrod" }}
          >
            לקוחות
          </Text>
        </HStack>
      </Link>
      <Link to={"/products"}>
        <HStack>
          {/* <Image src="" alt="" width={28} height={28} /> */}
          <Text
            variant="runningTextSb"
            as="span"
            color={
              activeLink === "/products"
                ? "primary.dbsGoldenrod"
                : "primary.runningText"
            }
            _hover={{ color: "primary.dbsGoldenrod" }}
          >
            מוצרים
          </Text>
        </HStack>
      </Link>
      <Link to={"/transactions"}>
        <HStack>
          {/* <Image
            src=""
            alt=""
            width={28}
            height={28}
          /> */}
          <Text
            variant="runningTextSb"
            as="span"
            color={
              activeLink === "/transactions"
                ? "primary.dbsGoldenrod"
                : "primary.runningText"
            }
            _hover={{ color: "primary.dbsGoldenrod" }}
          >
            ניהול הוצאות והכנסות {userRole !== "admin" && "שלי"}
          </Text>
        </HStack>
      </Link>
    </HStack>
  );
}
