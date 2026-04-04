import {
  Container,
  HStack,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  Text,
  Tag,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const products = useSelector((state) => state.productReducer.products);
  const [animatedValues, setAnimatedValues] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(products)) {
      const intervals = products.map((prod, index) => {
        const availableProducts = prod.list.filter((p) => p.available).length;
        const unavailableProducts = prod.list.length - availableProducts;
        const targetValue = (unavailableProducts / prod.list.length) * 100;

        let currentValue = 0;
        return setInterval(() => {
          if (currentValue < targetValue) {
            setAnimatedValues((prev) => {
              const newValues = [...prev];
              newValues[index] = currentValue + 1;
              return newValues;
            });
            currentValue += 1;
          } else {
            clearInterval(intervals[index]);
          }
        }, 10);
      });
      return () => intervals.forEach((interval) => clearInterval(interval));
    }
  }, [products]);

  return (
    <Container maxW="70%">
      <HStack justifyContent={"center"} gap="80px" flexWrap={"wrap"}>
        {_.isEmpty(products) && (
          <Box h={"100%"} mt="150px">
            <Spinner />
          </Box>
        )}
        {products?.map((prod, index) => {
          const availableProducts = prod.list.filter((p) => p.available).length;
          const unavailableProducts = prod.list.length - availableProducts;
          const animatedValue = animatedValues[index] || 0;
          return (
            <VStack gap="12px" key={`prod_${index}`}>
              <Text variant={"runningTextSb"}>{prod.category}</Text>
              <CircularProgress
                value={animatedValue}
                size="120px"
                thickness="15px"
                color="primary.dbsGold"
                trackColor="primary.dbsBlue"
              >
                <CircularProgressLabel
                  color="primary.dbsBlue"
                  fontSize={"18px"}
                  fontWeight={600}
                >
                  {prod.list.length}
                </CircularProgressLabel>
              </CircularProgress>
              <HStack>
                <Tag bgColor="primary.dbsGold">{`בשימוש: ${unavailableProducts}`}</Tag>
                <Tag
                  bgColor="primary.dbsBlue"
                  color="white"
                >{`פנויים: ${availableProducts}`}</Tag>
              </HStack>
            </VStack>
          );
        })}
      </HStack>
    </Container>
  );
}
