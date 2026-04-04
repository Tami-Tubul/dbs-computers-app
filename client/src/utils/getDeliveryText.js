import { Text, VStack } from "@chakra-ui/react";

export default function getDeliveryText(delivery) {
  if (!delivery?.enabled) {
    return <Text variant={"runningText"}>לא</Text>;
  }

  return (
    <VStack align="start" spacing={0}>
      <Text variant={"runningText"}>כן</Text>

      {delivery.go?.enabled && (
        <Text variant={"runningText"}>
          הלוך: {delivery.go.payment ? "שולם" : "לא שולם"}
        </Text>
      )}

      {delivery.back?.enabled && (
        <Text variant={"runningText"}>
          חזור: {delivery.back.payment ? "שולם" : "לא שולם"}
        </Text>
      )}
    </VStack>
  );
}
