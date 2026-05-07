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

    const duration = 200;
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
        const total = cat.list.length;
        const available = cat.list.filter((p) => p.available).length;
        const unavailable = total - available;
        const targetPercentage = total === 0 ? 0 : (unavailable / total) * 100;

        return {
          ...cat,
          available,
          unavailable,
          total,
          targetPercentage,
        };
      }) || []
    );
  }, [allproducts]);

  if (_.isEmpty(allproducts)) {
    return (
      <Container maxW="70%">
        <Box
          h="300px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="primary.dbsBlue" thickness="4px" />
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
              totalLabel={prod.total}
            />

            <HStack spacing={3}>
              <Tag size="lg" bgColor="primary.dbsGold" color="black">
                {`בשימוש: ${prod.unavailable}`}
              </Tag>
              <Tag size="lg" bgColor="primary.dbsBlue" color="white">
                {`פנויים: ${prod.available}`}
              </Tag>
            </HStack>
          </VStack>
        ))}
      </HStack>
    </Container>
  );
}
