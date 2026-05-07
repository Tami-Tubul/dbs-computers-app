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
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";

const AnimatedProgress = ({ targetValue, totalLabel }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (targetValue <= 0) {
      setCurrentValue(0);
      return;
    }

    const duration = 100;
    const frameRate = 10;
    const totalFrames = duration / frameRate;
    const increment = targetValue / totalFrames;

    const interval = setInterval(() => {
      setCurrentValue((prev) => {
        const nextValue = prev + increment;
        if (nextValue >= targetValue) {
          clearInterval(interval);
          return targetValue;
        }
        return nextValue;
      });
    }, frameRate);

    return () => clearInterval(interval);
  }, [targetValue]);

  return (
    <CircularProgress
      value={currentValue}
      size="120px"
      thickness="15px"
      color="primary.dbsGold"
      trackColor="primary.dbsBlue"
    >
      <CircularProgressLabel
        color="primary.dbsBlue"
        fontSize="18px"
        fontWeight={600}
      >
        {totalLabel}
      </CircularProgressLabel>
    </CircularProgress>
  );
};

export default function Dashboard() {
  const allproducts = useSelector((state) => state.productReducer.products);

  const products = useMemo(() => {
    return (
      allproducts?.map((cat) => {
        const filteredList = cat.list.filter((p) => p.status !== "נמכר");
        const available = filteredList.filter((p) => p.available).length;
        const total = filteredList.length;
        const targetPercentage =
          total === 0 ? 0 : ((total - available) / total) * 100;

        return {
          ...cat,
          list: filteredList,
          available,
          unavailable: total - available,
          targetPercentage,
        };
      }) || []
    );
  }, [allproducts]);

  if (_.isEmpty(products)) {
    return (
      <Container maxW="70%">
        <Box h="100%" mt="150px" textAlign="center">
          <Spinner size="xl" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="70%" py={10}>
      <HStack justifyContent="center" gap="80px" flexWrap="wrap">
        {products.map((prod, index) => (
          <VStack gap="12px" key={prod.id || prod.category || index}>
            <Text variant="runningTextSb">{prod.category}</Text>

            <AnimatedProgress
              targetValue={prod.targetPercentage}
              totalLabel={prod.list.length}
            />

            <HStack>
              <Tag bgColor="primary.dbsGold">{`בשימוש: ${prod.unavailable}`}</Tag>
              <Tag bgColor="primary.dbsBlue" color="white">
                {`פנויים: ${prod.available}`}
              </Tag>
            </HStack>
          </VStack>
        ))}
      </HStack>
    </Container>
  );
}
