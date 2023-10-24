import { startSession } from 'mongoose';
import { Invoice, User } from '../_models';

export default async function blockedUser() {
    const ClientSession = await startSession();

    const expiredDueDateList = await Invoice.find({ due_date: { $lte: new Date() } });

    if (expiredDueDateList.length > 0) {
        const needToBlockHaulierList = [
            ...new Set(expiredDueDateList.map((invoice) => invoice.haulier)),
        ];

        await User.updateMany(
            { haulier: { $in: needToBlockHaulierList } },
            { disabled: true },
            { session: ClientSession, new: true },
        );
    }
}
