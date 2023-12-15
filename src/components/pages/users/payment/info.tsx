import { createCollection, getDocRef } from "@/firebase";
import {
    QueryDocumentSnapshot,
    deleteDoc,
    getDoc,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useState } from "react";
import styles from "../../style.module.scss";
import { useCollection } from "react-firebase-hooks/firestore";
import DeleteDialog from "@/components/common/AlertDialog";

import { formateDate } from "@/utils";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetDoc } from "@/hooks/fireStore";
import ErrorShower from "@/components/common/error";
import queryClient from "@/queryClient";
import { UnpaidCoursesKey } from "./form";
export interface Props {
    userId: string;
}
interface ElemProps {
    payment: QueryDocumentSnapshot<DataBase["Payments"]>;
}
function PaymentShower({ payment }: ElemProps) {
    const [open, setOpen] = useState(false);
    const { data: course } = useGetDoc("Courses", payment.data().courseId);
    return (
        <>
            <tr>
                <td>
                    {course && course.exists() ? course.data().name : "Deleted"}
                </td>
                <td>
                    {formateDate(
                        payment.data().activatedAt?.toDate() || new Date()
                    )}
                </td>
                <td className="first-letter:tw-uppercase">
                    {payment.data().price.num}{" "}
                    <span className="tw-capitalize">
                        {payment.data().price.currency}
                    </span>
                </td>
                <td className="first-letter:tw-uppercase">
                    {payment.data().type}
                </td>

                <td>
                    <button
                        type="button"
                        className="hover:tw-text-red-600 disabled:tw-text-neutral-600 tw-border-0 tw-bg-transparent tw-block tw-w-fit tw-mx-auto"
                        onClick={() => {
                            setOpen(true);
                        }}
                        aria-label="delete"
                        disabled={open}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </td>
            </tr>
            <DeleteDialog
                onAccept={async () => {
                    await deleteDoc(payment.ref);
                    setOpen(false);
                    const course = await getDoc(
                        getDocRef("Courses", payment.data().courseId)
                    );
                    if (!course.exists) return;
                    const key = UnpaidCoursesKey(
                        payment.data().userId,
                        course.data()?.levelId
                    );
                    const courses =
                        queryClient.getQueryData<
                            Array<QueryDocumentSnapshot<DataBase["Courses"]>>
                        >(key);
                    if (!courses) return;
                    queryClient.setQueriesData(
                        key,
                        [...courses, course].sort(
                            (a, b) => a.data()!.order - b.data()!.order
                        )
                    );
                }}
                onClose={function () {
                    setOpen(false);
                }}
                open={open}
                data={{
                    title: `Delete payment`,
                    desc: `Once you click Delete, The payment action will be deleted`,
                    accept: `Delete payment action`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
export default function PaymentInfoGenerator({ userId }: Props) {
    const [payments, loading, errorShower] = useCollection(
        query(
            createCollection("Payments"),
            where("userId", "==", userId),
            orderBy("activatedAt")
        )
    );
    return (
        <>
            <ErrorShower
                loading={loading}
                error={errorShower}
            />
            {payments && (
                <>
                    {!payments.empty && (
                        <table
                            className={styles.table}
                            border={1}
                        >
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Activated At</th>
                                    <th>Price</th>
                                    <th>Type</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments?.docs.map((doc) => {
                                    return (
                                        <PaymentShower
                                            payment={doc}
                                            key={doc.id}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    {payments.empty && (
                        <p className="tw-mb-0">
                            The user has no payment actions so far
                        </p>
                    )}
                </>
            )}
        </>
    );
}
