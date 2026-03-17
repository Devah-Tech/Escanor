import { ExternalLink } from "@/components/external-link";
import InvalidMoney from "@/components/invalid-money";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useThemeMode } from "@/components/ui/theme-mode-provider";
import { Fonts } from "@/constants/theme";
import { Image } from "expo-image";
import { Moon, Sun } from "lucide-react-native";
import { StyleSheet } from "react-native";

export default function InfoScreen() {
  const { themeMode, toggleThemeMode } = useThemeMode();

  return (
    <>
      <Fab
        className="bg-amber-400 dark:bg-white data-[active=true]:bg-amber-500 dark:data-[active=true]:bg-gray-200 m-6"
        size="lg"
        placement="top right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={toggleThemeMode}
      >
        <FabIcon as={themeMode === "dark" ? Moon : Sun} />
      </Fab>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/Escanor.png")}
            style={styles.headerImage}
          />
        }
      >
        <ThemedView className="flex-row gap-8">
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}
          >
            Escanor
          </ThemedText>
        </ThemedView>
        <ThemedText>
          Esta aplicación ayuda en la{" "}
          <ThemedText type="defaultSemiBold">
            verificación del valor legal
          </ThemedText>{" "}
          de los billetes de{" "}
          <ThemedText type="defaultSemiBold">Bs. 10</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">Bs. 20</ThemedText> y{" "}
          <ThemedText type="defaultSemiBold">Bs. 50</ThemedText> de la{" "}
          <ThemedText type="defaultSemiBold">Serie B</ThemedText>, según la{" "}
          <ExternalLink href="https://abi.bo/guia-que-hacer-si-tiene-billetes-de-bs-10-20-o-50-de-la-serie-b/">
            <ThemedText className="font-normal" type="link">
              normativa vigente
            </ThemedText>
          </ExternalLink>{" "}
          en Bolivia.
        </ThemedText>
        <Collapsible title="Billetes afectados">
          <ThemedView className="gap-3">
            <ThemedText>
              Únicamente los billetes de Bs. 10, Bs. 20 y Bs. 50 de la Serie B
              que correspondan a los números de serie identificados como parte
              del lote accidentado.
            </ThemedText>
            <ThemedText>
              Todos los demás billetes, incluyendo la Serie A y los de Bs. 100 y
              Bs. 200 de la Serie B, tienen plena validez legal.
            </ThemedText>
          </ThemedView>
        </Collapsible>
        <Collapsible title="Billetes de Bs. 10, invalidados">
          <ThemedView className="gap-3">
            <ThemedText>
              Lista de rangos de la{" "}
              <ThemedText type="defaultSemiBold">Serie B</ThemedText> de los
              billetes de <ThemedText type="defaultSemiBold">Bs. 10</ThemedText>
              , <ThemedText type="defaultSemiBold">sin valor legal</ThemedText>.
            </ThemedText>
            <InvalidMoney denomination="10" />
            <ThemedText>
              Los billetes de Bs. 10 de la Serie B que no entren en la lista de
              rangos anteriores, tienen plena validez legal.
            </ThemedText>
            <ThemedText>
              <ThemedText type="defaultSemiBold">Tip</ThemedText>: Si el número
              de serie del billete de Bs. 10 de la Serie B empieza con{" "}
              <ThemedText type="defaultSemiBold">066</ThemedText> o inferior, es
              legal y no requiere verificación.
            </ThemedText>
          </ThemedView>
        </Collapsible>
        <Collapsible title="Billetes de Bs. 20, invalidados">
          <ThemedView className="gap-3">
            <ThemedText>
              Lista de rangos de la{" "}
              <ThemedText type="defaultSemiBold">Serie B</ThemedText> de los
              billetes de <ThemedText type="defaultSemiBold">Bs. 20</ThemedText>
              , <ThemedText type="defaultSemiBold">sin valor legal</ThemedText>.
            </ThemedText>
            <InvalidMoney denomination="20" />
            <ThemedText>
              Los billetes de Bs. 20 de la Serie B que no entren en la lista de
              rangos anteriores, tienen plena validez legal.
            </ThemedText>
            <ThemedText>
              <ThemedText type="defaultSemiBold">Tip</ThemedText>: Si el número
              de serie del billete de Bs. 20 de la Serie B empieza con{" "}
              <ThemedText type="defaultSemiBold">086</ThemedText> o inferior, es
              legal y no requiere verificación.
            </ThemedText>
          </ThemedView>
        </Collapsible>
        <Collapsible title="Billetes de Bs. 50, invalidados">
          <ThemedView className="gap-3">
            <ThemedText>
              Lista de rangos de la{" "}
              <ThemedText type="defaultSemiBold">Serie B</ThemedText> de los
              billetes de <ThemedText type="defaultSemiBold">Bs. 50</ThemedText>
              , <ThemedText type="defaultSemiBold">sin valor legal</ThemedText>.
            </ThemedText>
            <InvalidMoney denomination="50" />
            <ThemedText>
              Los billetes de Bs. 50 de la Serie B que no entren en la lista de
              rangos anteriores, tienen plena validez legal.
            </ThemedText>
            <ThemedText>
              <ThemedText type="defaultSemiBold">Tip</ThemedText>: Si el número
              de serie del billete de Bs. 50 de la Serie B empieza con{" "}
              <ThemedText type="defaultSemiBold">076</ThemedText> o inferior, es
              legal y no requiere verificación.
            </ThemedText>
          </ThemedView>
        </Collapsible>
        <Collapsible title="Política de privacidad">
          <ThemedText>
            Esta aplicación no recopila, almacena ni transmite ningún tipo de
            información personal de los usuarios.
          </ThemedText>
        </Collapsible>
        <Collapsible title="Términos y condiciones">
          <ThemedText>
            Esta aplicación{" "}
            <ThemedText className="italic">solamente</ThemedText> es una
            herramienta de consulta y verificación del valor legal de los
            billetes de <ThemedText type="defaultSemiBold">Bs. 10</ThemedText>,{" "}
            <ThemedText type="defaultSemiBold">Bs. 20</ThemedText> y{" "}
            <ThemedText type="defaultSemiBold">Bs. 50</ThemedText> de la{" "}
            <ThemedText type="defaultSemiBold">Serie B</ThemedText>, de acuerdo
            con la resolución del{" "}
            <ExternalLink href="https://www.bcb.gob.bo/">
              <ThemedText className="font-normal" type="link">
                Banco Central de Bolivia
              </ThemedText>
            </ExternalLink>
          </ThemedText>
        </Collapsible>
        <Collapsible title="Acerca de">
          <ThemedText>
            <ThemedText type="defaultSemiBold">Escanor</ThemedText> es una
            aplicación gratuita patrocinada por:
          </ThemedText>
          <ThemedView className="justify-center items-center mt-3">
            <Image
              source={require("@/assets/images/codeinc-bolivia.png")}
              style={{ width: 100, height: 100, borderRadius: 6 }}
            />
            <ExternalLink href="https://codeinc-bolivia.com/">
              <ThemedText type="link">CODE.INC Bolivia</ThemedText>
            </ExternalLink>
          </ThemedView>
        </Collapsible>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 180,
    width: 210,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
