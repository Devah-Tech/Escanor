import NoCameraDevice from "@/components/no-camera-device";
import { isLowAndroid } from "@/constants/android";
import {
  extractBanknoteData,
  findInRanges,
  getMostFrequentItem,
} from "@/utils/functions";
import { performOcr } from "@bear-block/vision-camera-ocr";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useSharedValue, Worklets } from "react-native-worklets-core";

import db from "@/db.json";

type DenominationKey = keyof typeof db;

const numberOfReadings = 12;

const fps = isLowAndroid ? 5 : 6;

export default function ModalScreen() {
  const device = useCameraDevice("back");

  const valuesRef = useRef<(string | null)[]>([]);
  const serialsRef = useRef<(string | null)[]>([]);

  const readingsCount = useSharedValue(0);

  // Función con createRunOnJS para mostrar los diálogos de alerta del escáner
  const showScannerDialog = useMemo(
    () =>
      Worklets.createRunOnJS(
        (
          type: "error" | "success" | "warning",
          title: string,
          subtitle: string | null,
          message: string,
          confirmText?: string,
          cancelText?: string,
        ) => {
          // Al Salir
          const handleExit = () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          };

          // Al Reintentar
          const handleRetry = () => {
            valuesRef.current = [];
            serialsRef.current = [];
            readingsCount.value = 0; // Reiniciar para nuevo escaneo
          };

          if (type === "error") {
            Alert.alert(title, (subtitle ? subtitle + "\n\n" : "") + message, [
              { text: confirmText ?? "Ok", onPress: handleExit },
            ]);
          } else {
            if (isLowAndroid) {
              Alert.alert(
                title,
                (subtitle ? subtitle + "\n\n" : "") + message,
                [{ text: "Ok", onPress: handleExit }],
              );
            } else {
              Alert.alert(
                title,
                (subtitle ? subtitle + "\n\n" : "") + message,
                [
                  {
                    text: cancelText ?? "Cancelar",
                    style: "cancel",
                    onPress: handleExit,
                  },
                  { text: confirmText ?? "Ok", onPress: handleRetry },
                ],
              );
            }
          }
        },
      ),
    [],
  );

  // Función para detectar el texto con createRunOnJS para poder llamarla desde el worklet de forma segura
  const handleTextDetected = useMemo(
    () =>
      Worklets.createRunOnJS((text: string, count: number) => {
        const { value, serial } = extractBanknoteData(text);

        valuesRef.current.push(value);
        serialsRef.current.push(serial);

        const finalValue = getMostFrequentItem(valuesRef.current);
        const finalSerial = getMostFrequentItem(serialsRef.current);

        const valueSuccesses = finalValue?.maxCount ?? 0;
        const serialSuccesses = finalSerial?.maxCount ?? 0;

        // Cuando se cumple la condición de tener al menos 1 acierto en el Valor y la Serie, procesamos
        if (valueSuccesses >= 1 && serialSuccesses >= 1) {
          readingsCount.value = numberOfReadings; // Igualar para parar el proceso de escaneo

          const denomination = finalValue?.mostFrequent;
          const serialText = finalSerial?.mostFrequent as string;

          const serialNumber = serialText.split(" ")[0];
          const serialLetter = serialText.split(" ")[1];

          if (serialLetter !== "B") {
            showScannerDialog(
              "success",
              "Billete detectado",
              `Valor: Bs. ${finalValue?.mostFrequent} | Serie: ${finalSerial?.mostFrequent}`,
              `✅ El billete tiene valor legal.\n\nNo es necesario validar billetes de la Serie ${serialLetter}.`,
              "Escanear otro billete",
              "Salir",
            );
          } else {
            if (denomination === "100" || denomination === "200") {
              showScannerDialog(
                "success",
                "Billete detectado",
                `Valor: Bs. ${finalValue?.mostFrequent} | Serie: ${finalSerial?.mostFrequent}`,
                `✅ El billete tiene valor legal.\n\nNo es necesario validar billetes de Bs. ${finalValue?.mostFrequent} de la Serie ${serialLetter}.`,
                "Escanear otro billete",
                "Salir",
              );
            } else {
              if (
                findInRanges(
                  db[denomination as DenominationKey],
                  Number(serialNumber),
                )
              ) {
                showScannerDialog(
                  "success",
                  "Billete detectado",
                  `Valor: Bs. ${finalValue?.mostFrequent} | Serie: ${finalSerial?.mostFrequent}`,
                  "✅ ¡Este billete tiene valor legal!",
                  "Escanear otro billete",
                  "Salir",
                );
              } else {
                showScannerDialog(
                  "success",
                  "Billete detectado",
                  `Valor: Bs. ${finalValue?.mostFrequent} | Serie: ${finalSerial?.mostFrequent}`,
                  "❌ ¡Este billete no tiene valor legal!",
                  "Escanear otro billete",
                  "Salir",
                );
              }
            }
          }
        } else if (count === numberOfReadings) {
          showScannerDialog(
            "warning",
            "Lectura imprecisa",
            "No se pudo leer con la claridad suficiente el Valor y/o la Serie del billete.",
            "¿Desea volver a intentar escanear o prefiere salir?",
            "Reintentar",
            "Salir",
          );
        }
      }),
    [],
  );

  // Inicializar estado al montar/desmontar el modal
  useEffect(() => {
    valuesRef.current = [];
    serialsRef.current = [];
    readingsCount.value = 0;
  }, []);

  // Procesador de frames OCR
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      try {
        if (readingsCount.value >= numberOfReadings) {
          return;
        }

        runAtTargetFps(fps, () => {
          const result = performOcr(frame);

          if (result?.text) {
            readingsCount.value += 1;
            handleTextDetected(result.text, readingsCount.value);
          }
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        showScannerDialog(
          "error",
          "Error en el proceso OCR",
          errorMessage,
          "Ocurrió un error inesperado en el proceso OCR. Por favor, vuelve a intentar.",
          "Salir",
        );
      }
    },
    [handleTextDetected, showScannerDialog],
  );

  if (device === undefined) return <NoCameraDevice />;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Escanor</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
