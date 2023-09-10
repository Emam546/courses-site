import { useState } from "react";
import Section from "./section";

import { useRouter } from "next/router";
import DeleteDialog from "@/components/common/deleteDailog";
import { useMutation } from "@tanstack/react-query";
import { deleteDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "@/store";
import { AuthActions } from "@/store/auth";
function AccountDeleteDialog() {
    const user = useAppSelector((state) => state.auth.user!);
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const query = useMutation({
        mutationFn: async () => {
            await deleteDoc(user.ref);
        },
        onSuccess() {
            dispatch(AuthActions.setUser(undefined));
            route.push("/login");
        },
    });
    const route = useRouter();

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="tw-text-red-600 tw-w-fit active:tw-text-red-700"
            >
                Delete Account
            </button>
            <DeleteDialog
                data={{
                    accept: "Delete",
                    title: "Are you sure you want to delete your account?",
                    desc: `Once you click delete, your account and associated data
                        will be permanently deleted and cannot be restored.
                        Alternatively if you keep your free account, the next
                        time you want to edit or update your resume you won'
                        t have to start from scratch.`,
                    deny: "Keep My Account",
                }}
                onAccept={async () => {
                    await query.mutateAsync();
                    setOpen(false);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                open={open}
                submitting={query.isLoading}
            />
        </div>
    );
}
export default function DeleteAccount() {
    return (
        <Section label="DANGER ZONE">
            <div className="tw-flex tw-justify-between tw-items-stretch md:tw-items-center tw-gap-y-2 tw-flex-col md:tw-flex-row">
                <p className="tw-text-neutral-500 tw-text-base">
                    Once you delete your account, it cannot be undone. This is
                    permanent.
                </p>
                <AccountDeleteDialog />
            </div>
        </Section>
    );
}
