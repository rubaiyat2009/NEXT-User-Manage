import PickPickupRequestTimeSlotStep, {
    PickPickupRequestTimeSlotStepProps,
} from '@/app/(app)/_components/PickPickupRequestTimeSlotStep';
import PickDriverStep, { PickDriverStepProps } from '@/app/(app)/_components/PickDriverStep';
import PickShipperStep, { PickShipperStepProps } from '@/app/(app)/_components/PickShipperStep';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { useState } from 'react';
import { DeepPartial, FormProvider, useForm } from 'react-hook-form';
import {
    SchedulePickupRequestFormData,
    SchedulePickupRequestFormDataSchema,
} from '@/app/_schemas/SchedulePickupRequestFormDataSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export type PickupRequestFormProps = Omit<PickShipperStepProps, 'onInvalid'> &
    Omit<PickPickupRequestTimeSlotStepProps, 'onNext'> &
    Omit<PickDriverStepProps, 'onNext'> & {
        onClose?: () => void;
        pickupRequest?: DeepPartial<SchedulePickupRequestFormData>;
    };

export default function PickupRequestForm({ onClose, pickupRequest }: PickupRequestFormProps) {
    const [tab, setTab] = useState('time-slot');

    const form = useForm<SchedulePickupRequestFormData>({
        resolver: zodResolver(SchedulePickupRequestFormDataSchema),
        defaultValues: pickupRequest,
    });

    return (
        <FormProvider {...form}>
            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="time-slot">Time Slot *</TabsTrigger>
                    <TabsTrigger value="driver">Driver</TabsTrigger>
                    <TabsTrigger value="shipper">Shipper/Consignee</TabsTrigger>
                </TabsList>
                <TabsContent value="time-slot">
                    <PickPickupRequestTimeSlotStep onNext={() => setTab('driver')} />
                </TabsContent>
                <TabsContent value="driver">
                    <PickDriverStep onNext={() => setTab('shipper')} />
                </TabsContent>
                <TabsContent value="shipper">
                    <PickShipperStep
                        onClose={onClose}
                        onInvalid={(errors) => {
                            if (!!errors.pickup_start_datetime || !!errors.pickup_end_datetime) {
                                return setTab('time-slot');
                            }
                            if (
                                !!errors.plate_no ||
                                !!errors.driver ||
                                !!errors.booking?.Users
                            ) {
                                return setTab('driver');
                            }
                            if (!!errors.booking?.shipper) {
                                return setTab('shipper');
                            }
                        }}
                    />
                </TabsContent>
            </Tabs>
        </FormProvider>
    );
}
