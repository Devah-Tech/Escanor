import NoCameraDevice from "@/components/no-camera-device";
import {
  extractBanknoteData,
  findInRanges,
  getMostFrequentItem,
} from "@/utils/functions";
import { performOcr } from "@bear-block/vision-camera-ocr";
import { router } from "expo-router";
import React, { useEffect } from "react";
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

let values: (string | null)[] = [];
let serials: (string | null)[] = [];

let resetFrameProcessor = () => {};
let stopReadings = () => {};

// Función general en JS para mostrar los diálogos de alerta del escáner
const showScannerDialog = Worklets.createRunOnJS(
  (
    type: "error" | "success" | "warning",
    title: string,
    subtitle: string | null,
    message: string,
    confirmText?: string,
    cancelText?: string,
  ) => {
    // Si el usuario da a cancelar (oculta en éxito) o se regresa, vaciamos variables y salimos
    const handleExit = () => {
      values = [];
      serials = [];
      router.back();
    };

    // Si el usuario decide reescanear (solo en reintento)
    const handleRetry = () => {
      values = [];
      serials = [];
      resetFrameProcessor();
    };

    if (type === "error") {
      Alert.alert(title, (subtitle ? subtitle + "\n\n" : "") + message, [
        { text: confirmText ?? "Ok", onPress: handleExit },
      ]);
    } else {
      Alert.alert(title, (subtitle ? subtitle + "\n\n" : "") + message, [
        {
          text: cancelText ?? "Cancelar",
          style: "cancel",
          onPress: handleExit,
        },
        { text: confirmText ?? "Ok", onPress: handleRetry },
      ]);
    }
  },
);

// Envolvemos la función con createRunOnJS para poder llamarla desde el worklet de forma segura
const handleTextDetected = Worklets.createRunOnJS(
  (text: string, count: number) => {
    // Limpiamos los arrays si es la primera lectura de la ráfaga (por seguridad extra)
    if (count === 1) {
      values = [];
      serials = [];
    }

    const { value, serial } = extractBanknoteData(text);

    values.push(value);
    serials.push(serial);

    const finalValue = getMostFrequentItem(values);
    const finalSerial = getMostFrequentItem(serials);

    const aciertosCorte = finalValue?.maxCount ?? 0;
    const aciertosSerie = finalSerial?.maxCount ?? 0;

    // Cuando se cumple la condición de tener al menos 1 acierto en Corte y Serie, procesamos
    if (aciertosCorte >= 1 && aciertosSerie >= 1) {
      stopReadings();

      const denomination = finalValue?.mostFrequent as DenominationKey;
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
        if (findInRanges(db[denomination], Number(serialNumber))) {
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
    } else if (count === numberOfReadings) {
      showScannerDialog(
        "warning",
        "Lectura imprecisa",
        "No se pudieron leer con la claridad suficiente el Valor y/o la Serie del billete.",
        "¿Desea volver a intentar escanear o prefiere salir?",
        "Reintentar",
        "Salir",
      );
    }
  },
);

export default function ModalScreen() {
  const device = useCameraDevice("back");
  const readingsCount = useSharedValue(0);

  // Instanciamos el reset para poder usarlo desde el JS de forma segura
  resetFrameProcessor = () => {
    readingsCount.value = 0;
  };

  // Detener el procesamiento de nuevos frames
  stopReadings = () => {
    readingsCount.value = numberOfReadings;
  };

  // Restablecer siempre el estado de manera estricta cada vez que se abre la vista del Modal
  useEffect(() => {
    values = [];
    serials = [];
    readingsCount.value = 0;
  }, []);

  // Procesador de frames para OCR
  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";

    try {
      if (readingsCount.value >= numberOfReadings) {
        return;
      }

      runAtTargetFps(6, () => {
        const result = performOcr(frame);

        if (result?.text) {
          readingsCount.value += 1;
          handleTextDetected(result.text, readingsCount.value);
        }
      });
    } catch (error) {
      showScannerDialog(
        "error",
        "Error en el procesador de frames",
        `${error}`,
        "Ocurrió un error inesperado en el proceso de escaneo. Por favor, vuelve a intentar.",
        "Salir",
      );
    }
  }, []);

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
