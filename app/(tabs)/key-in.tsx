import Notification from "@/components/notification";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { findInRanges } from "@/utils/functions";
import { useFocusEffect } from "expo-router";
import {
  Annoyed,
  CircleAlert,
  CircleCheck,
  CircleX,
  LucideIcon,
  SearchCheck,
} from "lucide-react-native";
import { useCallback, useState } from "react";

import db from "@/db.json";

type DenominationKey = keyof typeof db;

export default function KeyInScreen() {
  const denominations = [
    { value: "10", label: "Bs. 10" },
    { value: "20", label: "Bs. 20" },
    { value: "50", label: "Bs. 50" },
  ];

  const [selectedDenomination, setSelectedDenomination] =
    useState<DenominationKey | null>(null);
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [notification, setNotification] = useState<{
    show: boolean;
    icon: LucideIcon;
    title: string;
    message: string;
    type: "success" | "info" | "error" | "warning" | "muted";
  }>({ show: false, icon: Annoyed, title: "", message: "", type: "muted" });

  const handleDenominationSelect = (denomination: string) => {
    if (selectedDenomination !== null) {
      handleClear();
    }
    setSelectedDenomination(denomination as DenominationKey);
  };

  const handleChangeSerialNumber = (text: string) => {
    setSerialNumber(text);

    if (text.length < 9 && notification.show) {
      setNotification({
        show: false,
        icon: Annoyed,
        title: "",
        message: "",
        type: "muted",
      });
    }
  };

  const handleClear = () => {
    setSelectedDenomination(null);
    setSerialNumber("");
    setNotification({
      show: false,
      icon: Annoyed,
      title: "",
      message: "",
      type: "muted",
    });
  };

  const handleVerify = () => {
    if (selectedDenomination && serialNumber.length === 9) {
      const result = findInRanges(
        db[selectedDenomination],
        Number(serialNumber),
      );

      if (result) {
        setNotification({
          show: true,
          icon: CircleAlert,
          title: "Billete No Válido",
          message: "El billete no tiene valor legal.",
          type: "warning",
        });
      } else {
        setNotification({
          show: true,
          icon: CircleCheck,
          title: "Billete Válido",
          message: "El billete tiene valor legal.",
          type: "success",
        });
      }
    } else {
      setNotification({
        show: true,
        icon: CircleX,
        title: "Error",
        message: "Error al verificar el billete.",
        type: "error",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        handleClear();
      };
    }, []),
  );

  return (
    <ThemedView className="flex-1 items-center justify-center p-6 gap-3">
      <ThemedView className="flex-row justify-center">
        <ThemedText type="subtitle">Digitar Número de Serie</ThemedText>
      </ThemedView>
      <ThemedView className="gap-3 mb-6">
        <ThemedText>
          <ThemedText type="defaultSemiBold">
            Seleccione el valor del billete
          </ThemedText>{" "}
          de la Serie B que desea validar e{" "}
          <ThemedText type="defaultSemiBold">
            ingrese el número de serie
          </ThemedText>{" "}
          para realizar la verificación.
        </ThemedText>
      </ThemedView>
      <ThemedView className="flex-row justify-center gap-3 mb-6">
        <Button
          className="data-[hover=true]:border-sky-600 data-[hover=true]:border-2"
          variant="outline"
          size="lg"
          action="primary"
          data-active={selectedDenomination === denominations[0].value}
          onPress={() => handleDenominationSelect(denominations[0].value)}
          isHovered={selectedDenomination === denominations[0].value}
        >
          <ButtonText>{denominations[0].label}</ButtonText>
        </Button>
        <Button
          className="data-[hover=true]:border-amber-600 data-[hover=true]:border-2"
          variant="outline"
          size="lg"
          action="primary"
          data-active={selectedDenomination === denominations[1].value}
          onPress={() => handleDenominationSelect(denominations[1].value)}
          isHovered={selectedDenomination === denominations[1].value}
        >
          <ButtonText>{denominations[1].label}</ButtonText>
        </Button>
        <Button
          className="data-[hover=true]:border-purple-600 data-[hover=true]:border-2"
          variant="outline"
          size="lg"
          action="primary"
          data-active={selectedDenomination === denominations[2].value}
          onPress={() => handleDenominationSelect(denominations[2].value)}
          isHovered={selectedDenomination === denominations[2].value}
        >
          <ButtonText>{denominations[2].label}</ButtonText>
        </Button>
      </ThemedView>
      <Box className="w-48 justify-center mb-6">
        <Input
          variant="outline"
          size="xl"
          isDisabled={selectedDenomination === null}
          isInvalid={false}
        >
          <InputField
            className="text-xl font-bold tracking-widest"
            keyboardType="numeric"
            maxLength={9}
            placeholder="000000000"
            returnKeyType="done"
            value={serialNumber}
            onChangeText={handleChangeSerialNumber}
            onSubmitEditing={serialNumber.length < 9 ? undefined : handleVerify}
          />
          <InputSlot className="px-3">
            <ThemedText className="text-xl" type="defaultSemiBold">
              B
            </ThemedText>
          </InputSlot>
        </Input>
      </Box>
      <Box className="flex-row justify-center gap-3">
        <Button
          variant="solid"
          size="lg"
          action="secondary"
          onPress={handleClear}
        >
          <ButtonText>Limpiar</ButtonText>
        </Button>
        <Button
          className="bg-cyan-700 dark:bg-white data-[active=true]:bg-cyan-500 dark:data-[active=true]:bg-gray-200"
          variant="solid"
          size="lg"
          action="primary"
          onPress={handleVerify}
          isDisabled={
            selectedDenomination === null || serialNumber.length !== 9
          }
        >
          <ButtonIcon as={SearchCheck} className="mr-2" />
          <ButtonText>Verificar</ButtonText>
        </Button>
      </Box>
      {notification.show && serialNumber.length === 9 && (
        <Notification notification={notification} />
      )}
    </ThemedView>
  );
}
