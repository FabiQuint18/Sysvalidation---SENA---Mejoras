
import React, { useEffect } from 'react';
import { Validation, checkExpiringValidations } from '@/types/validation';
import { useToast } from '@/hooks/use-toast';

interface ExpiryNotificationsProps {
  validations: Validation[];
  userEmail?: string;
}

const ExpiryNotifications = ({ validations, userEmail }: ExpiryNotificationsProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const notifications = checkExpiringValidations(validations);
    const { sixMonths, threeMonths, oneMonth } = notifications;

    // Simular envío de correos electrónicos
    if (sixMonths.length > 0) {
      console.log('Enviando recordatorio de 6 meses:', sixMonths);
      toast({
        title: "Recordatorio de Vencimiento - 6 Meses",
        description: `${sixMonths.length} validaciones vencerán en los próximos 6 meses`,
        variant: "default",
      });
    }

    if (threeMonths.length > 0) {
      console.log('Enviando recordatorio de 3 meses:', threeMonths);
      toast({
        title: "Recordatorio de Vencimiento - 3 Meses",
        description: `${threeMonths.length} validaciones vencerán en los próximos 3 meses`,
        variant: "default",
      });
    }

    if (oneMonth.length > 0) {
      console.log('Enviando recordatorio de 1 mes:', oneMonth);
      toast({
        title: "Alerta de Vencimiento Crítico - 1 Mes",
        description: `${oneMonth.length} validaciones vencerán en el próximo mes`,
        variant: "destructive",
      });
    }

    // Simular envío de correos
    if (userEmail && (sixMonths.length > 0 || threeMonths.length > 0 || oneMonth.length > 0)) {
      console.log(`Enviando correo de recordatorio a: ${userEmail}`);
    }
  }, [validations, userEmail, toast]);

  return null; // Componente invisible que solo maneja notificaciones
};

export default ExpiryNotifications;
