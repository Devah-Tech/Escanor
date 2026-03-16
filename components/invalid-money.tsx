import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { Box } from "@/components/ui/box";
import {
  Table,
  TableBody,
  TableCaption,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import db from "@/db.json";

type DenominationKey = keyof typeof db;

const InvalidMoney = ({ denomination }: { denomination: DenominationKey }) => {
  const ranges = db[denomination];

  return (
    <Box className="rounded-lg overflow-hidden w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Del</TableHead>
            <TableHead className="text-center">Al</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranges.map((range, index) => (
            <TableRow key={index}>
              <TableData className="font-normal text-center">
                {range.a.toString().padStart(9, "0")}
              </TableData>
              <TableData className="font-normal text-center">
                {range.b.toString().padStart(9, "0")}
              </TableData>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption className="font-normal">
          <ExternalLink href="https://abi.bo/bcb-publica-lista-de-los-billetes-del-accidente-y-desde-el-lunes-se-restablecera-la-circulacion-de-la-serie-b/">
            <ThemedText type="link">Fuente: ABI</ThemedText>
          </ExternalLink>
        </TableCaption>
      </Table>
    </Box>
  );
};

export default InvalidMoney;
