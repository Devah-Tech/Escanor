import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { LucideIcon } from "lucide-react-native";

type notificationType = {
  show: boolean;
  icon: LucideIcon;
  title: string;
  message: string;
  type: "success" | "info" | "error" | "warning" | "muted";
};

const Notification = ({ notification }: { notification: notificationType }) => {
  return (
    <Alert action={notification.type} className="mt-6 gap-3">
      <AlertIcon as={notification.icon} size="lg" />
      <AlertText className="text-typography-900 font-semibold" size="md">
        {notification.title}
      </AlertText>
      <AlertText className="text-typography-900" size="md">
        {notification.message}
      </AlertText>
    </Alert>
  );
};

export default Notification;
